import type { AWidgetState } from "@activeviam/dashboard-base";
import type { DataModel } from "@activeviam/data-model";
import { MdxDrillthrough, parse } from "@activeviam/mdx";
import type { DrillthroughTableWidgetState } from "@activeviam/plugin-widget-drillthrough-table";
import { serializeWidgetState } from "@activeviam/widget";
import { _getQueryInLegacyWidgetState } from "./_getQueryInLegacyWidgetState";
import { _getTargetCubeFromServerUrl } from "./_getTargetCubeFromServerUrl";
import { _migrateQuery } from "./_migrateQuery";

/**
 * Returns the converted drillthrough widget state, ready to be used by ActiveUI 5.
 */
export function migrateDrillthrough(
  // Legacy widget states are not typed.
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  legacyDrillthroughState: any,
  servers: { [serverKey: string]: { dataModel: DataModel; url: string } },
): AWidgetState<"serialized"> {
  const legacyQuery = _getQueryInLegacyWidgetState(legacyDrillthroughState);
  const legacyMdx = legacyQuery.mdx
    ? parse<MdxDrillthrough>(legacyQuery.mdx)
    : undefined;

  const serverUrlInLegacyWidgetState =
    legacyDrillthroughState?.value?.body?.serverUrl;
  const { serverKey, cube } = _getTargetCubeFromServerUrl({
    mdx: legacyMdx,
    serverUrl: serverUrlInLegacyWidgetState,
    servers,
  });

  const { query, filters, queryContext } = _migrateQuery<MdxDrillthrough>({
    legacyQuery,
    cube,
  });

  const legacyColumns =
    legacyDrillthroughState.value?.body?.configuration?.tabular?.columns;
  const columnWidths = legacyColumns
    ? legacyColumns.reduce(
        (
          widths: { [columnKey: string]: number },
          width: number,
          columnKey: string,
        ) => {
          widths[columnKey] = width;
          return widths;
        },
        {},
      )
    : {};

  const migratedWidgetState: DrillthroughTableWidgetState = {
    query,
    filters,
    queryContext,
    name: legacyDrillthroughState.name,
    serverKey,
    widgetKey: "drillthrough-table",
    columnWidths,
  };

  return serializeWidgetState(migratedWidgetState);
}
