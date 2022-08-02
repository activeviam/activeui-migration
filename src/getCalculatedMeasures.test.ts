import { getCalculatedMeasures } from "./getCalculatedMeasures";

describe("getCalculatedMeasures", () => {
  it("returns an empty array when the calculated measures folder contains no children", async () => {
    const result = await getCalculatedMeasures({
      entry: {
        owners: ["ROLE_CS_ROOT"],
        readers: ["ROLE_CS_ROOT"],
        isDirectory: true,
      },
    });
    expect(result).toEqual([]);
  });

  it("returns the parsed calculated measure objects", async () => {
    const legacyCalculatedMeasuresFolder = {
      entry: {
        isDirectory: true,
        owners: ["ROLE_CS_ROOT"],
        readers: ["ROLE_CS_ROOT"],
      },
      children: {
        EquityDerivativesCube: {
          entry: {
            isDirectory: true,
            owners: ["ROLE_CS_ROOT"],
            readers: ["ROLE_CS_ROOT"],
          },
          children: {
            "[Measures].[second calculated measure]": {
              entry: {
                content:
                  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<calculatedMember expression="IIf(IsEmpty(([Currency].[Currency].[ALL].[AllMember], [Measures].[pnl.FOREX])), null, [Measures].[pnl.FOREX] / ([Currency].[Currency].[ALL].[AllMember], [Measures].[pnl.FOREX]))" formatStringExpression="&quot;#,###.##%&quot;" uniqueName="[Measures].[second calculated measure]" xmlns="http://www.quartetfs.com">\n    <additionalProperties/>\n</calculatedMember>\n',
                isDirectory: false,
                owners: ["admin"],
                readers: ["admin"],
              },
            },
            "[Measures].[first calculated measure]": {
              entry: {
                content:
                  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<calculatedMember expression="Count(Descendants([CounterParty].[CounterParty].CurrentMember, [CounterParty].[CounterParty].[CounterPartyGroup]), EXCLUDEEMPTY)" formatStringExpression="&quot;#,###.##&quot;" uniqueName="[Measures].[first calculated measure]" xmlns="http://www.quartetfs.com">\n    <additionalProperties/>\n</calculatedMember>\n',
                isDirectory: false,
                owners: ["admin"],
                readers: ["admin"],
              },
            },
          },
        },
      },
    };
    const result = await getCalculatedMeasures(legacyCalculatedMeasuresFolder);

    expect(result).toMatchSnapshot();
  });
});
