import { _migrateUnsupportedWidget } from "./_migrateUnsupportedWidget";
import { legacyPageFilters } from "./__test_resources__/legacyPageFilters";

describe("_migrateUnsupportedWidget", () => {
  it("returns an optimistic ActiveUI 5 widget state, corresponding to the ActiveUI 4 widget state where the body has been pulled up to the root", () => {
    // The ActiveUI Page Filters widget, with key `filters`, is not supported in ActiveUI 5.
    expect(_migrateUnsupportedWidget(legacyPageFilters)).toMatchInlineSnapshot(`
      Object {
        "name": "Page filters",
        "widgetKey": "filters",
      }
    `);
  });
});
