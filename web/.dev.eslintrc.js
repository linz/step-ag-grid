// This config is for running in code editors for lots of inline hints
module.exports = {
  env: { commonjs: true, node: true },
  plugins: ["react", "@typescript-eslint", "jest", "jsx-a11y", "testing-library"],
  settings: { react: { version: "detect" } },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    project: ["tsconfig.json"],
    sourceType: "module",
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jest/recommended",
    "plugin:jest/style",
    "plugin:testing-library/react",
    "plugin:jsx-a11y/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended", // must be last
  ],
  rules: {
    // testing-library - to fix
    "testing-library/no-dom-import": "off",

    // Fix these
    "no-empty": "warn",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/no-empty-function": ["warn", { allow: ["arrowFunctions"] }],
    "@typescript-eslint/no-unnecessary-condition": "error",
    "no-return-await": "error",

    // customized rules
    "react/no-unescaped-entities": ["error", { forbid: [">", '"', "}"] }], // ' is ok, don't want to escape this
    "react/react-in-jsx-scope": "off", // TS config takes care of this
    "linebreak-style": ["error", "unix"], // prevent crlf from getting pushed
    "react/prop-types": "off",
    "no-console": ["warn", { allow: ["warn", "error"] }], // error on push/codacy
    "jest/no-disabled-tests": "off", // error on push/codacy
    // prepend var with _ (e.g.. _myVar) to ignore this pattern
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // error on push/codacy
    // We will want to use before define to keep exports at the top
    "@typescript-eslint/no-use-before-define": "off",
    // We use explicit overrides
    "@typescript-eslint/ban-ts-comment": "off",
    // React's convention is to use CamelCase for component file names
    "@typescript-eslint/naming-convention": "off",
    // In `dev` until all are fixed
    "react-hooks/exhaustive-deps": [
      "warn",
      {
        additionalHooks: "(useWorkflowEffect|useWorkflowSidePanelHook)",
      },
    ],
  },
  overrides: [
    {
      files: ["*.test.js", "*.test.ts", "*.test.tsx"],
      rules: {
        "no-console": "off",
      },
    },
  ],
  ignorePatterns: ["!.dev.eslintrc.js"],
};
