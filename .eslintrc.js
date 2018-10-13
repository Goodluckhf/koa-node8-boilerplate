module.exports = {
  root: true,
  extends: ["eslint-config-airbnb-base", "plugin:prettier/recommended"],
  parserOptions: {
    parser: "babel-eslint",
    sourceType: "module",
    allowImportExportEverywhere: false,
    codeFrame: false
  },
  env: {
    node: true
  },
  rules: {
    strict: "error",
    "no-param-reassign": "off",
    "no-restricted-syntax": "off",
    "class-methods-use-this": "off",
    "prettier/prettier": "error"
  },
  plugins: ["json", "prettier"],
  overrides: [
    {
      files: ["*.test.js", "*.spec.js", "test/**/*.js"],
      env: {
        jest: true
      },
      rules: {
        "no-console": "off"
      }
    }
  ]
};
