import type { AWidgetState, DataModel } from "@activeviam/activeui-sdk";
import type { LegacyWidgetState } from "./migration.types";

import { migrateChart } from "./migrateChart";
import { migrateTable } from "./migrateTable";
import { migrateKpi } from "./migrateKpi";
import { migrateQuickFilter } from "./migrateQuickFilter";
import { migrateDrillthrough } from "./migrateDrillthrough";
import { migrateTextEditor } from "./migrateTextEditor";
import { _getLegacyWidgetPluginKey } from "./_getLegacyWidgetPluginKey";
import { _migrateUnsupportedWidget } from "./_migrateUnsupportedWidget";

/**
 * Returns the converted widget state, ready to be used in ActiveUI 5.
 */
export function migrateWidget(
  legacyWidgetState: LegacyWidgetState,
  servers: { [serverKey: string]: { dataModel: DataModel; url: string } }
): [AWidgetState<"serialized">, boolean] {
  const widgetPluginKey = _getLegacyWidgetPluginKey(legacyWidgetState);
  switch (widgetPluginKey) {
    case "chart":
      return [migrateChart(legacyWidgetState, servers), true];
    case "tabular-view":
    case "pivot-table":
      return [migrateTable(legacyWidgetState, servers), true];
    case "featured-values":
      return [migrateKpi(legacyWidgetState, servers), true];
    case "quick-filter":
      return [migrateQuickFilter(legacyWidgetState, servers), true];
    case "drillthrough":
      return [migrateDrillthrough(legacyWidgetState, servers), true];
    case "rich-text-editor":
      return [migrateTextEditor(legacyWidgetState), true];
    default:
      return [_migrateUnsupportedWidget(legacyWidgetState), false];
  }
}
