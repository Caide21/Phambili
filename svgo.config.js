// svgo.config.js
module.exports = {
  multipass: true,
  plugins: [
    { name: "preset-default", params: { overrides: {
      removeViewBox: false,
      removeUnknownsAndDefaults: false,
      convertPathData: { floatPrecision: 2 },
    }}},
    // NEW: make CSS styles become attributes on elements
    "inlineStyles",
    "convertStyleToAttrs",

    "removeDimensions",
    { name: "prefixIds", params: { prefix: "phambili" } },
    // keep this AFTER conversion so we don’t break style->class mappings
    { name: "removeAttrs", params: { attrs: ["class", "data-name", "id"] } },
    "cleanupNumericValues",
    "collapseGroups",
    "mergePaths",
    "sortAttrs",
  ],
};
