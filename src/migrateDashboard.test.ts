import _map from "lodash/map";
import _mapValues from "lodash/mapValues";
import _intersection from "lodash/intersection";
import { legacyDashboard } from "./__test_resources__/legacyDashboard";
import { migrateDashboard } from "./migrateDashboard";
import { LegacyDashboardState } from "./migration.types";
import { servers } from "./__test_resources__/servers";

describe("migrateDashboard", () => {
  beforeEach(() => {
    // Do not clutter the test output with expected warnings.
    // The tests that explicitly check for warnings can still spy on console.warn.
    console.warn = jest.fn();
  });

  it("turns the pages content from arrays into maps", () => {
    const dashboard = migrateDashboard({
      legacyDashboardState: legacyDashboard,
      servers,
    });
    expect(dashboard.pages["p-0"].content).toMatchInlineSnapshot(`
      Object {
        "1": Object {
          "columnWidths": Object {
            "[Currency].[Currency].[Currency]": 250,
          },
          "filters": Array [
            "TopCount(Filter([Geography].[City].Levels(1).Members, NOT IsEmpty([Measures].[contributors.COUNT])), 3, [Measures].[contributors.COUNT])",
            "{[Currency].[Currency].[ALL].[AllMember].[GBP], [Currency].[Currency].[ALL].[AllMember].[JPY], [Currency].[Currency].[ALL].[AllMember].[USD]}",
          ],
          "mapping": Object {
            "columns": Array [
              "ALL_MEASURES",
            ],
            "measures": Array [
              "[Measures].[contributors.COUNT]",
            ],
            "rows": Array [
              "[Currency].[Currency].[Currency]",
            ],
          },
          "name": "Tree table",
          "query": Object {
            "mdx": "SELECT NON EMPTY Hierarchize(DrilldownLevel([Currency].[Currency].[ALL].[AllMember])) ON ROWS, NON EMPTY [Measures].[contributors.COUNT] ON COLUMNS FROM [EquityDerivativesCube] CELL PROPERTIES VALUE, FORMATTED_VALUE, BACK_COLOR, FORE_COLOR, FONT_FLAGS",
            "updateMode": "once",
          },
          "queryContext": Array [
            Object {
              "key": "queriesTimeLimit",
              "value": 60,
            },
            Object {
              "key": "mdx.casesensitive",
              "value": true,
            },
            Object {
              "key": "mdx.defaultmembers.[Geography].[City]",
              "value": "[AllMember].[Berlin]",
            },
          ],
          "serverKey": "my-server",
          "widgetKey": "tree-table",
        },
        "2": Object {
          "filters": Array [],
          "mapping": Object {
            "horizontalSubplots": Array [],
            "secondaryValues": Array [],
            "splitBy": Array [
              "ALL_MEASURES",
            ],
            "values": Array [
              "[Measures].[pnlDelta.SUM]",
              "[Measures].[pnlVega.SUM]",
            ],
            "verticalSubplots": Array [],
            "xAxis": Array [
              "[Currency].[Currency].[Currency]",
            ],
          },
          "name": "Chart",
          "plotly": Object {
            "data": Object {
              "overridesByTraceKey": Object {
                "[Measures].[pnlVega.SUM]": Object {
                  "name": "Taux de marge",
                  "yaxis": "y2",
                },
              },
            },
            "layout": Object {
              "margin": Object {
                "b": 20,
                "l": 20,
                "r": 20,
                "t": 20,
              },
              "xaxis": Object {
                "showgrid": false,
                "showline": false,
                "showticklabels": false,
              },
              "yaxis": Object {
                "showline": false,
                "showticklabels": true,
              },
              "yaxis2": Object {
                "overlaying": "y",
                "range": Array [
                  -1000,
                  1000,
                ],
                "showline": true,
                "showticklabels": true,
                "side": "right",
              },
            },
          },
          "query": Object {
            "mdx": "SELECT NON EMPTY [Currency].[Currency].[Currency].Members ON ROWS, NON EMPTY {[Measures].[pnlDelta.SUM], [Measures].[pnlVega.SUM]} ON COLUMNS FROM [EquityDerivativesCube]",
            "updateMode": "once",
          },
          "queryContext": Array [],
          "serverKey": "my-server",
          "switchedTo": "plotly-line-chart",
          "widgetKey": "plotly-line-chart",
        },
        "3": Object {
          "cubeName": "EquityDerivativesCube",
          "levelCoordinates": Object {
            "dimensionName": "Currency",
            "hierarchyName": "Currency",
            "levelName": "Currency",
          },
          "mode": "checkbox",
          "name": "Quick filter",
          "serverKey": "my-server",
          "widgetKey": "quick-filter",
        },
        "4": Object {
          "name": "Page filters",
          "widgetKey": "filters",
        },
      }
    `);
  });

  it("flattens the page layouts", () => {
    const dashboard = migrateDashboard({
      legacyDashboardState: legacyDashboard,
      servers,
    });
    expect(dashboard.pages["p-0"].layout).toMatchInlineSnapshot(`
      Object {
        "children": Array [
          Object {
            "leafKey": "4",
            "size": 0.2,
          },
          Object {
            "children": Array [
              Object {
                "leafKey": "3",
                "size": 0.3,
              },
              Object {
                "leafKey": "1",
                "size": 0.27999999999999997,
              },
              Object {
                "leafKey": "2",
                "size": 0.42,
              },
            ],
            "direction": "column",
            "size": 0.8,
          },
        ],
        "direction": "row",
      }
    `);
  });

  it("migrates dashboard context values", () => {
    // Due to the flattening, the context values from the first cube that are also defined in the second cube are overriden.
    const dashboard = migrateDashboard({
      legacyDashboardState: legacyDashboard,
      servers,
    });
    expect(dashboard.queryContext).toMatchInlineSnapshot(`
      Array [
        Object {
          "key": "queriesTimeLimit",
          "value": 60,
        },
        Object {
          "key": "mdx.casesensitive",
          "value": false,
        },
        Object {
          "key": "mdx.defaultmembers.[Geography].[City]",
          "value": "[AllMember].[Paris]",
        },
      ]
    `);
  });

  it("migrates page context values", () => {
    const dashboard = migrateDashboard({
      legacyDashboardState: legacyDashboard,
      servers,
    });
    expect(_mapValues(dashboard.pages, ({ queryContext }) => queryContext))
      .toMatchInlineSnapshot(`
      Object {
        "p-0": Array [
          Object {
            "key": "mdx.lightCrossjoin",
            "value": true,
          },
          Object {
            "key": "mdx.aggressiveFormulaEvaluation",
            "value": true,
          },
        ],
      }
    `);
  });

  it("never returns a layout leaf", () => {
    // LegacyDashboardState has some attributes that are uninteresting to this test.
    // eslint-disable-next-line
    const legacyEmptyDashboard = {
      value: {
        body: {
          pages: [
            {
              content: [],
              layout: {
                "0": {
                  ck: "0",
                },
              },
            },
          ],
        },
      },
    } as unknown as LegacyDashboardState;
    const emptyDashboard = migrateDashboard({
      legacyDashboardState: legacyEmptyDashboard,
      servers,
    });
    expect(emptyDashboard).toMatchInlineSnapshot(`
      Object {
        "filters": Array [],
        "name": undefined,
        "pages": Object {
          "p-0": Object {
            "content": Object {},
            "filters": Array [],
            "layout": Object {
              "0": Object {
                "ck": "0",
              },
              "children": Array [],
            },
            "queryContext": Array [],
          },
        },
        "pagesOrder": Array [
          "p-0",
        ],
        "queryContext": Array [],
      }
    `);
  });

  it("removes the specified widget keys, and adapts the layout", () => {
    const keysOfWidgetPluginsToRemove = ["filters"];

    const dashboard = migrateDashboard({
      legacyDashboardState: legacyDashboard,
      servers,
      keysOfWidgetPluginsToRemove,
    });

    const { content, layout } = dashboard.pages["p-0"];
    const widgetPluginKeys = _map(content, ({ widgetKey }) => widgetKey);
    expect(
      _intersection(widgetPluginKeys, keysOfWidgetPluginsToRemove)
    ).toHaveLength(0);
    expect(layout).toMatchInlineSnapshot(`
      Object {
        "children": Array [
          Object {
            "leafKey": "3",
            "size": 0.3,
          },
          Object {
            "leafKey": "1",
            "size": 0.27999999999999997,
          },
          Object {
            "leafKey": "2",
            "size": 0.42,
          },
        ],
        "direction": "column",
      }
    `);
  });

  it("warns in the console if some widgets in the migrated dashboard have no core equivalent in ActiveUI 5 and will not be supported by default", () => {
    const consoleWarnSpy = jest.spyOn(console, "warn");
    migrateDashboard({
      legacyDashboardState: legacyDashboard,
      servers,
      dashboardId: "eef",
    });
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
      "Found unsupported widgets while migrating dashboard \\"1 page, 4 widgets\\" (with id eef):
      {
        \\"p-0\\": {
          \\"filters\\": [
            \\"Page filters\\"
          ]
        }
      }.
      These widgets will be copied as is and will most likely not work in ActiveUI 5.
      Alternatively, you can use the --remove-widgets CLI option to remove them."
    `);
  });
});
