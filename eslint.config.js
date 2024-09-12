const globals = require("globals");
const pluginJs = require("@eslint/js");
const tseslint = require("typescript-eslint");


config = [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.node }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];

module.exports = config;