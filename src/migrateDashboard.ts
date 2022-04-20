import _omit from "lodash/omit";
import _range from "lodash/range";
import _reduce from "lodash/reduce";
import _isEmpty from "lodash/isEmpty";

import {
  DashboardState,
  DashboardPageState,
  DataModel,
  Layout,
  removeWidget,
  deserializeDashboardState,
  serializeDashboardState,
} from "@activeviam/activeui-sdk";
import { _flattenLayout, _convertFromLegacyLayout } from "./_flattenLayout";
import { migrateWidget } from "./migrateWidget";

import type {
  LegacyDashboardState,
  LegacyDashboardPage,
} from "./migration.types";
import { isLegacyLayoutLeaf } from "./isLegacyLayoutLeaf";
import { _migrateContextValues } from "./_migrateContextValues";
import { _getLegacyWidgetPluginKey } from "./_getLegacyWidgetPluginKey";
import { _migrateUnsupportedWidget } from "./_migrateUnsupportedWidget";

/**
 * Returns the layout path to the leaf uniquely identified by `leafKey`, or `undefined` if no leaf has this key.
 */
function findPathToLeaf(layout: Layout, leafKey: string): number[] | undefined {
  for (let childIndex = 0; childIndex < layout.children.length; childIndex++) {
    const child = layout.children[childIndex];

    if ("leafKey" in child) {
      if (child.leafKey === leafKey) {
        return [childIndex];
      }
    } else {
      const pathInChild = findPathToLeaf(child, leafKey);
      if (pathInChild) {
        return [childIndex, ...pathInChild];
      }
    }
  }

  return undefined;
}

/**
 * Returns the converted dashboard state, ready to be used in ActiveUI 5.
 * Specifically:
 *    Flattens value and value.body.
 *    Transforms pages contents from arrays to map, to make access to pages and pages state faster.
 *    Transform the pages layouts from a binary tree into a tree of minimal depth, making widgets resizing more natural.
 *
 * Widgets with keys in `keysOfWidgetPluginsToRemove` are not migrated: they are removed from the output ActiveUI 5 dashboard, and the layout is adapted so that siblings take the remaining space.
 */
export function migrateDashboard({
  legacyDashboardState,
  servers,
  keysOfWidgetPluginsToRemove,
  dashboardId,
}: {
  legacyDashboardState: LegacyDashboardState;
  servers: { [serverKey: string]: { dataModel: DataModel; url: string } };
  keysOfWidgetPluginsToRemove?: string[];
  dashboardId?: string;
}): DashboardState<"serialized"> {
  const pages: { [pageKey: string]: DashboardPageState<"serialized"> } = {};
  const body = legacyDashboardState.value.body;

  const keysOfLeavesToRemove: {
    [pageKey: string]: string[];
  } = {};

  const unsupportedWidgets: {
    [pageKey: string]: { [widgetKey: string]: string[] };
  } = {};

  body.pages.forEach((legacyPage: LegacyDashboardPage, index: number) => {
    const pageKey = `p-${index}`;
    const content: DashboardPageState<"serialized">["content"] = {};
    legacyPage.content.forEach((widget) => {
      const dashboardLeafKey = widget.key;
      const widgetPluginKey = _getLegacyWidgetPluginKey(widget.bookmark);
      if (keysOfWidgetPluginsToRemove?.includes(widgetPluginKey)) {
        keysOfLeavesToRemove[pageKey] = [
          ...(keysOfLeavesToRemove[pageKey] ?? []),
          dashboardLeafKey,
        ];
      } else {
        const [migratedWidget, isSupportedByDefaultInActiveUI5] = migrateWidget(
          widget.bookmark,
          servers
        );
        content[dashboardLeafKey] = migratedWidget;
        if (!isSupportedByDefaultInActiveUI5) {
          const widgetPluginKey = _getLegacyWidgetPluginKey(widget.bookmark);
          unsupportedWidgets[pageKey] = {
            ...(unsupportedWidgets[pageKey] ?? {}),
            [widgetPluginKey]: [
              ...(unsupportedWidgets[pageKey]?.[widgetPluginKey] ?? []),
              widget.bookmark.name,
            ],
          };
        }
      }
    });

    const page: DashboardPageState<"serialized"> = {
      ..._omit(legacyPage, ["content"]),
      content,
      // @ts-expect-error `layout` is filled up below.
      layout: undefined,
      filters: Object.values(legacyPage.filters || {}).flat(),
      queryContext: _migrateContextValues(legacyPage.contextValues),
    };
    const legacyLayout = legacyPage.layout;
    // In ActiveUI 4, the root of a dashboard can be a leaf.
    // This does not happen in ActiveUI 5.
    if (isLegacyLayoutLeaf(legacyLayout)) {
      page.layout = {
        children: [
          {
            leafKey: legacyLayout.ck,
            size: 1,
          },
        ],
        direction: "row",
      };
    } else {
      // @ts-expect-error: converting from one type to the other is difficult to express in TypeScript.
      page.layout = _convertFromLegacyLayout(legacyLayout);
      _flattenLayout(page.layout);
    }

    pages[pageKey] = page;
  });

  const dashboard: DashboardState<"serialized"> = {
    name: legacyDashboardState.name,
    pages,
    pagesOrder: _range(body.pages.length).map((i) => `p-${i}`),
    filters: Object.values(body.filters || {}).flat(),
    queryContext: _migrateContextValues(body.contextValues),
  };

  const deserializedDashboard = deserializeDashboardState(dashboard);

  const dashboardWithWidgetsRemoved = _reduce(
    keysOfLeavesToRemove,
    (dashboardAccumulator, keysToRemove, pageKey) => {
      const layout = dashboardAccumulator.pages[pageKey].layout;
      return keysToRemove.reduce(
        (dashboardAccumulatorForCurrentPage, leafKey) => {
          const layoutPath = findPathToLeaf(layout, leafKey);
          if (!layoutPath) {
            return dashboardAccumulatorForCurrentPage;
          }
          return removeWidget({
            dashboardState: dashboardAccumulatorForCurrentPage,
            pageKey,
            leafKey,
            layoutPath,
          });
        },
        dashboardAccumulator
      );
    },
    deserializedDashboard
  );

  const serializedDashboard = serializeDashboardState(
    dashboardWithWidgetsRemoved
  );

  if (!_isEmpty(unsupportedWidgets)) {
    console.warn(
      `Found unsupported widgets while migrating dashboard "${
        legacyDashboardState.name
      }"${dashboardId ? ` (with id ${dashboardId})` : ""}:\n${JSON.stringify(
        unsupportedWidgets,
        null,
        2
      )}.\nThese widgets will be copied as is and will most likely not work in ActiveUI 5.\nAlternatively, you can use the --remove-widgets CLI option to remove them.`
    );
  }

  return serializedDashboard;
}
