import "fake-indexeddb/auto";

// jsdom doesn't implement these — they're needed by resolveCaseAssetUrl and
// by the reinstall-cache regression test, which specifically asserts that
// two calls return DIFFERENT url strings, so this must produce a unique
// value per call rather than a fixed stub string.
if (typeof URL.createObjectURL !== "function") {
  let counter = 0;
  URL.createObjectURL = () => `blob:mock-url-${++counter}`;
}
if (typeof URL.revokeObjectURL !== "function") {
  URL.revokeObjectURL = () => {};
}
