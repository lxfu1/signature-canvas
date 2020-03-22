export default {
  entry: "src/index.ts",
  doc: {
    themeConfig: { mode: "dark" }
  },
  esm: {
    type: "rollup"
  },
  cjs: {
    type: "rollup"
  }
};
