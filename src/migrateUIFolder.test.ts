import _map from "lodash/map";
import _intersection from "lodash/intersection";
import _some from "lodash/some";
import { migrateUIFolder } from "./migrateUIFolder";
import { smallLegacyUIFolder } from "./__test_resources__/smallLegacyUIFolder";
import { legacyUIFolder } from "./__test_resources__/legacyUIFolder";
import { servers } from "./__test_resources__/servers";
import { ContentRecord } from "@activeviam/activeui-sdk";

describe("migrateUIFolder", () => {
  beforeEach(() => {
    // Do not clutter the test output with expected warnings.
    // The tests that explicitly check for warnings can still spy on console.warn.
    console.warn = jest.fn();
  });

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

    // In the Activeui 4 folder, the file with id `0xb` represents a saved Page Filters widget.
    // It is removed from the ActiveUI 5 UI folder.
    const savedWidgets = migratedUIFolder.children!.widgets;
    const hasRecord = (
      contentRecord: ContentRecord,
      recordId: string
    ): boolean =>
      _some(
        contentRecord.children,
        (child, childId) => childId === recordId || hasRecord(child, recordId)
      );
    expect(hasRecord(savedWidgets, "0xb")).toBe(false);

    // In the ActiveUI 4 UI folder, the file with id `eef` represents a saved dashboard which includes a Page Filters widget.
    // This widget is removed from the migrated dashboard in the ActiveUI 5 folder.
    const migratedDashboard = JSON.parse(
      migratedUIFolder.children!.dashboards.children!.content.children!.eef
        .entry.content
    );
    const { content, layout } = migratedDashboard.pages["p-0"];
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

  it("warns when trying to migrate widgets that have no core equivalent in ActiveUI 5 and will not be supported by default", () => {
    const consoleWarnSpy = jest.spyOn(console, "warn");
    migrateUIFolder(legacyUIFolder, servers);
    // There should be two warnings:
    // - One when trying to migrate an unsupported saved widget
    // - One when trying to migrate a saved dashboard which includes an unsupported widget.
    expect(consoleWarnSpy).toHaveBeenCalledTimes(2);
    expect(consoleWarnSpy.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "Unsupported widgetKey: \\"filters\\". The widget \\"Page filters\\" (with id 0xb) will be copied as is and will most likely not work correctly in ActiveUI 5. Alternatively, you can remove all widgets of this type by using the --remove-widgets option in the CLI.",
        ],
        Array [
          "Found unsupported widgets while migrating dashboard \\"1 page, 4 widgets\\" (with id eef):
      {
        \\"p-0\\": {
          \\"filters\\": [
            \\"Page filters\\"
          ]
        }
      }.
      These widgets will be copied as is and will most likely not work in ActiveUI 5.
      Alternatively, you can use the --remove-widgets CLI option to remove them.",
        ],
      ]
    `);
  });
});
