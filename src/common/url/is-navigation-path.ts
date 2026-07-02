// Returns true only for in-app navigation targets: same-origin, absolute-path
// relative references (e.g. "/lovelace/0"). Rejects absolute URLs, scheme
// targets (e.g. "javascript:", "https://evil.tld") and protocol-relative
// references ("//evil.tld") that would navigate away from the current origin.
export const isNavigationPath = (path: unknown): path is string =>
  typeof path === "string" && path.startsWith("/") && !path.startsWith("//");
