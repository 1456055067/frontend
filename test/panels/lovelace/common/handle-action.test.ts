import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { handleAction } from "../../../../src/panels/lovelace/common/handle-action";
import type { HomeAssistant } from "../../../../src/types";

// Minimal hass stub; the "url" action path only needs a node and the config.
const hass = {
  localize: (key: string) => key,
  user: undefined,
} as unknown as HomeAssistant;

describe("handleAction url action", () => {
  let node: HTMLElement;
  let openSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    node = document.createElement("div");
    openSpy = vi.spyOn(window, "open").mockReturnValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const run = (url_path?: string) =>
    handleAction(
      node,
      hass,
      { tap_action: { action: "url", url_path } },
      "tap"
    );

  it("opens the URL in a new tab with noreferrer to prevent tabnabbing", async () => {
    await run("https://example.com/page");
    expect(openSpy).toHaveBeenCalledOnce();
    expect(openSpy).toHaveBeenCalledWith(
      "https://example.com/page",
      "_blank",
      "noreferrer"
    );
  });

  it("passes through query strings and fragments unchanged", async () => {
    await run("https://example.com/page?a=b#frag");
    expect(openSpy).toHaveBeenCalledWith(
      "https://example.com/page?a=b#frag",
      "_blank",
      "noreferrer"
    );
  });

  it("neutralizes a javascript: URL via sanitizeUrl", async () => {
    // eslint-disable-next-line no-script-url
    await run("javascript:alert(document.cookie)");
    expect(openSpy).toHaveBeenCalledOnce();
    const openedUrl = openSpy.mock.calls[0][0] as string;
    // sanitizeUrl neutralizes dangerous schemes (currently to "about:blank").
    expect(openedUrl.startsWith("javascript:")).toBe(false);
  });

  it("neutralizes a data: URL via sanitizeUrl", async () => {
    await run("data:text/html,<script>alert(1)</script>");
    const openedUrl = openSpy.mock.calls[0][0] as string;
    expect(openedUrl.startsWith("data:")).toBe(false);
  });

  it("does not open a window when url_path is missing", async () => {
    await run(undefined);
    expect(openSpy).not.toHaveBeenCalled();
  });
});
