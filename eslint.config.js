const globals = require("globals");
const pluginJs  = require("@eslint/js");
const tseslint  = require("typescript-eslint");


module.exports = [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.node }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];