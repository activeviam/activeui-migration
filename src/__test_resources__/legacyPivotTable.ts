import type { LegacyWidgetState } from "../migration.types";

/**
 * The widgetState of a legacy pivot table, useful for unit tests.
 */
export const legacyPivotTable: LegacyWidgetState = {
  type: "container",
  writable: true,
  name: "Pivot Table",
  value: {
    style: {},
    showTitleBar: true,
    body: {
      serverUrl: "",
      mdx:
        "SELECT NON EMPTY Hierarchize(DrilldownLevel([Currency].[Currency].[ALL].[AllMember])) ON ROWS FROM [EquityDerivativesCube] CELL PROPERTIES VALUE, FORMATTED_VALUE, BACK_COLOR, FORE_COLOR, FONT_FLAGS",
      contextValues: {},
      updateMode: "once",
      ranges: {
        row: {
          chunkSize: 2000,
          thresholdPercentage: 0.1,
        },
        column: {
          chunkSize: 50,
          thresholdPercentage: 0.2,
        },
      },
      configuration: {
        tabular: {
          pinnedHeaderSelector: "member",
          sortingMode: "non-breaking",
          cellRenderers: ["pivot-layout"],
          statisticsShown: true,
          columnsGroups: [
            {
              captionProducer: "firstColumn",
              cellFactory: "kpi-status",
              selector: "kpi-status",
            },
            {
              captionProducer: "firstColumn",
              cellFactory: "lookup",
              selector: "lookup",
            },
            {
              captionProducer: "expiry",
              cellFactory: "expiry",
              selector: "kpi-expiry",
            },
          ],
          hideAddButton: true,
          defaultOptions: {},
          expansion: {
            automaticExpansion: true,
          },
          columns: [
            {
              key: "[Currency].[Currency].[Currency]",
              width: 250,
            },
          ],
        },
      },
    },
    containerKey: "pivot-table",
  },
};
