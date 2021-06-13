module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["@typescript-eslint", "prettier"],
  env: {
    browser: true,
    node: true,
    jasmine: true,
    jest: true,
  },
  rules: {
    "array-bracket-spacing": ["error", "never"],
    "arrow-spacing": [
      "error",
      {
        before: true,
        after: true,
      },
    ],
    "block-scoped-var": "error",
    "block-spacing": ["error", "always"],
    "brace-style": [
      "error",
      "1tbs",
      {
        allowSingleLine: true,
      },
    ],
    "comma-dangle": ["error", "always-multiline"],
    "comma-spacing": [
      "error",
      {
        before: false,
        after: true,
      },
    ],
    "comma-style": ["error", "last"],
    "constructor-super": "error",
    curly: ["error", "all"],
    eqeqeq: ["error", "always", { null: "ignore" }],
    // "indent": ["error", 2, { SwitchCase: 1, "VariableDeclarator": 2 }],
    "key-spacing": [
      "error",
      {
        beforeColon: false,
        afterColon: true,
      },
    ],
    "keyword-spacing": [
      2,
      {
        before: true,
        after: true,
      },
    ],
    "no-unused-vars": ["error", { args: "none" }],
    "no-use-before-define": "error",
    "operator-linebreak": [
      "error",
      "after",
      {
        overrides: {
          "?": "before",
          ":": "before",
        },
      },
    ],
    "padded-blocks": [
      "error",
      { blocks: "never", switches: "never", classes: "never" },
    ],
    // "quotes": ["error", "double", {
    //   "avoidEscape": true
    // }],
    semi: ["error", "always"],
    "semi-spacing": [
      "error",
      {
        before: false,
        after: true,
      },
    ],
    "no-case-declarations": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/explicit-member-accessibility": [
      "error",
      {
        accessibility: "no-public",
      },
    ],
    "@typescript-eslint/explicit-function-return-type": [
      "off",
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
      },
    ],
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
};
