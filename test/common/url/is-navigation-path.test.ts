import { describe, expect, it } from "vitest";
import { isNavigationPath } from "../../../src/common/url/is-navigation-path";

describe("isNavigationPath", () => {
  it("accepts in-app absolute-path relative references", () => {
    expect(isNavigationPath("/")).toBe(true);
    expect(isNavigationPath("/lovelace/0")).toBe(true);
    expect(isNavigationPath("/config/integrations?domain=hue")).toBe(true);
    expect(isNavigationPath("/history#foo")).toBe(true);
  });

  it("rejects protocol-relative references", () => {
    expect(isNavigationPath("//evil.tld")).toBe(false);
    expect(isNavigationPath("//evil.tld/path")).toBe(false);
  });

  it("rejects absolute URLs to other origins", () => {
    expect(isNavigationPath("https://evil.tld/")).toBe(false);
    expect(isNavigationPath("http://evil.tld")).toBe(false);
  });

  it("rejects dangerous schemes", () => {
    // eslint-disable-next-line no-script-url
    expect(isNavigationPath("javascript:alert(1)")).toBe(false);
    expect(isNavigationPath("data:text/html,<script>1</script>")).toBe(false);
    expect(isNavigationPath("vbscript:msgbox(1)")).toBe(false);
  });

  it("rejects relative references without a leading slash", () => {
    expect(isNavigationPath("lovelace/0")).toBe(false);
    expect(isNavigationPath("")).toBe(false);
  });

  it("rejects non-string input", () => {
    expect(isNavigationPath(undefined)).toBe(false);
    expect(isNavigationPath(null)).toBe(false);
    expect(isNavigationPath(42)).toBe(false);
    expect(isNavigationPath({ path: "/foo" })).toBe(false);
  });
});
