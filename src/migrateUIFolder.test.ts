import _map from "lodash/map";
import _intersection from "lodash/intersection";
import _some from "lodash/some";
import { migrateUIFolder } from "./migrateUIFolder";
import { smallLegacyUIFolder } from "./__test_resources__/smallLegacyUIFolder";
import { legacyUIFolder } from "./__test_resources__/legacyUIFolder";
import { servers } from "./__test_resources__/servers";
import { ContentRecord } from "@activeviam/activeui-sdk";
import { LegacyDashboardState } from "./migration.types";

/**
 *  Returns whether `contentRecord` has a descendant with the id `recordId`.
 */
const hasRecord = (contentRecord: ContentRecord, recordId: string): boolean =>
  _some(
    contentRecord.children,
    (child, childId) => childId === recordId || hasRecord(child, recordId)
  );

describe("migrateUIFolder", () => {
  it("returns a valid ActiveUI5 /ui folder on a small input", () => {
    const migratedUIFolder = migrateUIFolder(smallLegacyUIFolder, servers);
    expect(migratedUIFolder).toMatchSnapshot();
  });

  it("returns a valid ActiveUI5 /ui folder on a real life input", () => {
    const migratedUIFolder = migrateUIFolder(legacyUIFolder, servers);
    expect(migratedUIFolder).toMatchSnapshot();
  });

  it("removes the specified widget plugins from the widget bookmarks themselves, and from the content of the dashboard bookmarks", () => {
    const keysOfWidgetPluginsToRemove = ["filters"];
    const migratedUIFolder = migrateUIFolder(
      legacyUIFolder,
      servers,
      keysOfWidgetPluginsToRemove
    );

    // In the ActiveUI 4 folder, the file with id `0xb` represents a saved Page Filters widget.
    // It is removed from the ActiveUI 5 UI folder.
    const savedContentInLegacyUIFolder: ContentRecord =
      legacyUIFolder.children!.bookmarks;
    const savedWidgets = migratedUIFolder.children!.widgets;
    expect(hasRecord(savedContentInLegacyUIFolder, "0xb")).toBe(true);
    expect(hasRecord(savedWidgets, "0xb")).toBe(false);

    // In the ActiveUI 4 UI folder, the file with id `eef` represents a saved dashboard which includes a Page Filters widget.
    // This widget is removed from the migrated dashboard in the ActiveUI 5 folder.
    const legacyDashboard: LegacyDashboardState = JSON.parse(
      legacyUIFolder.children!.bookmarks.children!.content.children!.eef.entry
        .content
    );
    const widgetPluginKeysInLegacyDashboard: string[] = [];
    legacyDashboard.value.body.pages.forEach((page) =>
      page.content.forEach(({ bookmark }) =>
        widgetPluginKeysInLegacyDashboard.push(bookmark.value.containerKey)
      )
    );
    const migratedDashboard = JSON.parse(
      migratedUIFolder.children!.dashboards.children!.content.children!.eef
        .entry.content
    );
    const { content, layout } = migratedDashboard.pages["p-0"];
    const widgetPluginKeys = _map(content, ({ widgetKey }) => widgetKey);
    expect(widgetPluginKeysInLegacyDashboard).toEqual(
      expect.arrayContaining(keysOfWidgetPluginsToRemove)
    );
    expect(widgetPluginKeys).toEqual(
      expect.not.arrayContaining(keysOfWidgetPluginsToRemove)
    );
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
});
