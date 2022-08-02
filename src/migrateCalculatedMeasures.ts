import { ContentRecord } from "@activeviam/activeui-sdk";
import { getCalculatedMeasures } from "./getCalculatedMeasures";
import { generateId } from "./generateId";

export interface LegacyCalculatedMeasure {
  expression: string;
  formatStringExpression: string;
  uniqueName: string;
  owners: string[];
  readers: string[];
  isDirectory: boolean;
}

/**
 * Returns the converted content record tree for the calculted measures, ready to be used in ActiveUI 5.
 */
export async function migrateCalculatedMeasures(
  legacyPivotFolder: ContentRecord
): Promise<ContentRecord> {
  const entitlements = legacyPivotFolder?.children?.entitlements;
  const calculatedMeasuresFolder = entitlements?.children?.cm;

  const legacyCalculatedMeasures = calculatedMeasuresFolder
    ? await getCalculatedMeasures(calculatedMeasuresFolder)
    : [];

  const contentFolder: ContentRecord = {
    entry: { isDirectory: true, owners: ["ROLE_USER"], readers: ["ROLE_USER"] },
    children: {},
  };

  const structureFolder: ContentRecord = {
    entry: { isDirectory: true, owners: ["ROLE_USER"], readers: ["ROLE_USER"] },
    children: {} as { [id: string]: ContentRecord },
  };

  legacyCalculatedMeasures.forEach((legacyMeasure) => {
    const { owners, readers, expression, formatStringExpression, uniqueName } =
      legacyMeasure;

    const id = generateId();

    // @ts-ignore `children` will always be defined since it's hardcoded as an empty object above.
    contentFolder.children[id] = {
      entry: {
        owners,
        readers,
        isDirectory: false,
        content: JSON.stringify({
          expression,
          properties: [`FORMAT_STRING=${formatStringExpression}`],
        }),
      },
    };

    // @ts-ignore `children` will always be defined since it's hardcoded as an empty object above.
    structureFolder.children[id] = {
      entry: {
        isDirectory: true,
        owners,
        readers,
      },
      children: {
        [`${id}_metadata`]: {
          entry: {
            content: JSON.stringify({ name: uniqueName }),
            owners,
            readers,
            isDirectory: false,
          },
        },
      },
    };
  });

  return {
    entry: {
      isDirectory: true,
      owners: ["ROLE_CS_ROOT"],
      readers: ["ROLE_CS_ROOT"],
    },
    children: {
      content: contentFolder,
      structure: structureFolder,
    },
  };
}
