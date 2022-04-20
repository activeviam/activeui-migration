import { LegacyWidgetState } from "./migration.types";
import { _getLegacyWidgetPluginKey } from "./_getLegacyWidgetPluginKey";

/**
 * Returns an optimistic ActiveUI5-compatible state of an ActiveUI 4 widget that is not supported by default ActiveUI 5.
 */
export function _migrateUnsupportedWidget(
  legacyWidgetState: LegacyWidgetState
) {
  const widgetPluginKey = _getLegacyWidgetPluginKey(legacyWidgetState);
  return {
    ...legacyWidgetState?.value?.body,
    name: legacyWidgetState?.name,
    widgetKey: widgetPluginKey,
  };
}
