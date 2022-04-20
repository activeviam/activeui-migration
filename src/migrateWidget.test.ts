/* eslint-disable no-console */
import { migrateWidget } from "./migrateWidget";
import { LegacyWidgetState } from "./migration.types";
import { servers } from "./__test_resources__/servers";

describe("migrateWidget", () => {
  it("converts a widget saved with ActiveUI 4 into one usable with ActiveUI 5", () => {
    const legacyWidgetState: LegacyWidgetState = {
      name: "Untitled chart",
      type: "container",
      value: {
        containerKey: "chart",
        body: {
          query: {
            updateMode: "once",
            mdx: "SELECT NON EMPTY Crossjoin([Booking].[Desk].[LegalEntity].Members, [Currency].[Currency].[Currency].Members) ON ROWS, NON EMPTY [Measures].[contributors.COUNT] ON COLUMNS FROM [EquityDerivativesCube]",
          },
          configuration: {
            type: "plotly-line-chart",
            mapping: {
              xAxis: ["[Currency].[Currency].[Currency]"],
              values: ["[Measures].[contributors.COUNT]"],
              splitBy: ["[Booking].[Desk].[LegalEntity]"],
              horizontalSubplots: [],
              verticalSubplots: [],
            },
          },
        },
      },
      writable: true,
    };

    const [migratedWidgetState, isSupportedByDefaultInActiveUI5] =
      migrateWidget(legacyWidgetState, servers);

    expect(migratedWidgetState).toMatchInlineSnapshot(`
      Object {
        "filters": Array [],
        "mapping": Object {
          "horizontalSubplots": Array [],
          "secondaryValues": Array [],
          "splitBy": Array [
            "[Booking].[Desk].[LegalEntity]",
            "ALL_MEASURES",
          ],
          "values": Array [
            "[Measures].[contributors.COUNT]",
          ],
          "verticalSubplots": Array [],
          "xAxis": Array [
            "[Currency].[Currency].[Currency]",
          ],
        },
        "name": "Untitled chart",
        "query": Object {
          "mdx": "SELECT NON EMPTY Crossjoin([Booking].[Desk].[LegalEntity].Members, [Currency].[Currency].[Currency].Members) ON ROWS, NON EMPTY [Measures].[contributors.COUNT] ON COLUMNS FROM [EquityDerivativesCube]",
          "updateMode": "once",
        },
        "queryContext": Array [],
        "serverKey": "my-server",
        "widgetKey": "plotly-line-chart",
      }
    `);
    expect(isSupportedByDefaultInActiveUI5).toBe(true);
  });

  it("returns a boolean indicating whether the migrated widget has a core equivalent in ActiveUI 5 and will be supported by default", () => {
    const legacyWidgetState: LegacyWidgetState = {
      name: "Untitled page context values",
      type: "container",
      value: {
        containerKey: "context-values",
        body: {},
      },
      writable: true,
    };
    const [migratedWidgetState, isSupportedByDefaultInActiveUI5] =
      migrateWidget(legacyWidgetState, servers);
    expect(migratedWidgetState).toMatchInlineSnapshot(`
        Object {
          "name": "Untitled page context values",
          "widgetKey": "context-values",
        }
      `);
    expect(isSupportedByDefaultInActiveUI5).toBe(false);
  });
});
