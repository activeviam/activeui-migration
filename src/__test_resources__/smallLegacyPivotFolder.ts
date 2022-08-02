/**
 * The content of the /pivot folder on a Content Server, useful for unit tests.
 */
export const smallLegacyPivotFolder = {
  entry: {
    isDirectory: true,
    owners: ["ROLE_CS_ROOT"],
    readers: ["ROLE_CS_ROOT"],
    timestamp: 1658134321609,
    lastEditor: "_no_user_",
    canRead: true,
    canWrite: true,
  },
  children: {
    entitlements: {
      entry: {
        isDirectory: true,
        owners: ["ROLE_CS_ROOT"],
        readers: ["ROLE_CS_ROOT"],
        timestamp: 1658134321726,
        lastEditor: "_no_user_",
        canRead: true,
        canWrite: true,
      },
      children: {
        cv: {
          entry: {
            isDirectory: true,
            owners: ["ROLE_CS_ROOT"],
            readers: ["ROLE_CS_ROOT"],
            timestamp: 1658134321726,
            lastEditor: "_no_user_",
            canRead: true,
            canWrite: true,
          },
          children: {
            _global_: {
              entry: {
                isDirectory: true,
                owners: ["ROLE_CS_ROOT"],
                readers: ["ROLE_CS_ROOT"],
                timestamp: 1658155918107,
                lastEditor: "_no_user_",
                canRead: true,
                canWrite: true,
              },
              children: {
                admin: {
                  entry: {
                    isDirectory: true,
                    owners: ["admin"],
                    readers: ["admin"],
                    timestamp: 1658155918132,
                    lastEditor: "_no_user_",
                    canRead: true,
                    canWrite: true,
                  },
                  children: {
                    IMdxContext: {
                      entry: {
                        content:
                          '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<mdxContext xmlns="http://www.quartetfs.com">\n    <additionalProperties/>\n    <calculatedMembers/>\n    <cubeFormatter>en-US</cubeFormatter>\n    <defaultMembers/>\n    <formatters/>\n    <hiddenGrandTotals/>\n    <hiddenSubtotals/>\n    <kpis/>\n    <measureAliases/>\n    <namedSets/>\n</mdxContext>\n',
                        isDirectory: false,
                        owners: ["admin"],
                        readers: ["admin"],
                        timestamp: 1658155918134,
                        lastEditor: "_no_user_",
                        canRead: true,
                        canWrite: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        kpi: {
          entry: {
            isDirectory: true,
            owners: ["ROLE_USER"],
            readers: ["ROLE_USER"],
            timestamp: 1658134321928,
            lastEditor: "_no_user_",
            canRead: true,
            canWrite: true,
          },
        },
        cm: {
          entry: {
            isDirectory: true,
            owners: ["ROLE_USER"],
            readers: ["ROLE_USER"],
            timestamp: 1658134321871,
            lastEditor: "_no_user_",
            canRead: true,
            canWrite: true,
          },
          children: {
            EquityDerivativesCube: {
              entry: {
                isDirectory: true,
                owners: ["ROLE_USER"],
                readers: ["ROLE_USER"],
                timestamp: 1658156066842,
                lastEditor: "admin",
                canRead: true,
                canWrite: true,
              },
              children: {
                "[Measures].[third calculated measure]": {
                  entry: {
                    content:
                      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<calculatedMember expression="IIf(IsEmpty(([Booking].[Desk].CurrentMember.Parent, [Measures].[pnl.SUM])), null, [Measures].[pnl.SUM] / ([Booking].[Desk].CurrentMember.Parent, [Measures].[pnl.SUM]))" formatStringExpression="&quot;#,###.##%&quot;" uniqueName="[Measures].[third calculated measure]" xmlns="http://www.quartetfs.com">\n    <additionalProperties/>\n</calculatedMember>\n',
                    isDirectory: false,
                    owners: ["admin"],
                    readers: ["admin"],
                    timestamp: 1658156075259,
                    lastEditor: "admin",
                    canRead: true,
                    canWrite: true,
                  },
                },
                "[Measures].[second calculated measure]": {
                  entry: {
                    content:
                      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<calculatedMember expression="IIf(IsEmpty(([Currency].[Currency].[ALL].[AllMember], [Measures].[pnl.FOREX])), null, [Measures].[pnl.FOREX] / ([Currency].[Currency].[ALL].[AllMember], [Measures].[pnl.FOREX]))" formatStringExpression="&quot;#,###.##%&quot;" uniqueName="[Measures].[second calculated measure]" xmlns="http://www.quartetfs.com">\n    <additionalProperties/>\n</calculatedMember>\n',
                    isDirectory: false,
                    owners: ["admin"],
                    readers: ["admin"],
                    timestamp: 1658156071796,
                    lastEditor: "admin",
                    canRead: true,
                    canWrite: true,
                  },
                },
                "[Measures].[first calculated measure]": {
                  entry: {
                    content:
                      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<calculatedMember expression="Count(Descendants([CounterParty].[CounterParty].CurrentMember, [CounterParty].[CounterParty].[CounterPartyGroup]), EXCLUDEEMPTY)" formatStringExpression="&quot;#,###.##&quot;" uniqueName="[Measures].[first calculated measure]" xmlns="http://www.quartetfs.com">\n    <additionalProperties/>\n</calculatedMember>\n',
                    isDirectory: false,
                    owners: ["admin"],
                    readers: ["admin"],
                    timestamp: 1658156066844,
                    lastEditor: "admin",
                    canRead: true,
                    canWrite: true,
                  },
                },
              },
            },
          },
        },
      },
    },
    config: {
      entry: {
        isDirectory: true,
        owners: ["ROLE_CS_ROOT"],
        readers: ["ROLE_CS_ROOT"],
        timestamp: 1658134321703,
        lastEditor: "_no_user_",
        canRead: true,
        canWrite: true,
      },
    },
    apcs_version: {
      entry: {
        content: "3",
        isDirectory: false,
        owners: ["ROLE_CS_ROOT"],
        readers: ["ROLE_CS_ROOT"],
        timestamp: 1658134321656,
        lastEditor: "_no_user_",
        canRead: true,
        canWrite: true,
      },
    },
  },
};
