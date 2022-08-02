import { ContentRecord } from "@activeviam/activeui-sdk";
import xml2js from "xml2js";
import _flatMap from "lodash/flatMap";
import { LegacyCalculatedMeasure } from "./migrateCalculatedMeasures";

/**
 * Extracts and parses the XML calculated measure objects from the /pivot/entitlements/cm folder.
 */
export const getCalculatedMeasures = async (
  calculatedMeasuresFolder: ContentRecord
): Promise<LegacyCalculatedMeasure[]> => {
  const parser = new xml2js.Parser();

  const calculatedMeasures: LegacyCalculatedMeasure[] = [];

  if (calculatedMeasuresFolder?.children) {
    await Promise.all(
      // Legacy calculated measures are grouped by cube in `/pivot/entitlements/cm`. But they are flattened in ActiveUI 5.
      _flatMap(calculatedMeasuresFolder.children, async ({ children }) => {
        if (children) {
          const measures = await Promise.all(
            Object.values(children).map(async (cmEntry) => {
              const result = await parser.parseStringPromise(
                cmEntry.entry.content
              );

              const { owners, readers, isDirectory } = cmEntry.entry;

              const calculatedMeasure = {
                owners,
                readers,
                isDirectory,
                /*
                  xml2js parses the given XML and returns an object of the shape:

                  {
                    calculatedMember: {$: {...}, additionalProperties: {...}}
                  }

                  In this case, the data that is required (`expression`, `formatStringExpression`, and `uniqueName`) lives within the `$` property/
                */
                ...result.calculatedMember["$"],
              };

              return calculatedMeasure;
            })
          );
          calculatedMeasures.push(...measures);
        }
      })
    );
  }

  return calculatedMeasures;
};
