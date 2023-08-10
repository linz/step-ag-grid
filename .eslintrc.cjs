// This config will run in a way that fails a build
module.exports = {
  env: { commonjs: true, es2020: true, node: true },
  plugins: ["react", "react-hooks", "jest", "jsx-a11y", "testing-library"],
  settings: {
    react: { version: "detect" },
    jest: {
      version: 26,
    },
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jest/recommended",
    "plugin:jest/style",
    "plugin:testing-library/react",
    "plugin:prettier/recommended",
    "plugin:storybook/recommended"
  ],
  ignorePatterns: ["react-app-env.d.ts"],
  rules: {
    // testing-library - to fix
    "testing-library/no-dom-import": "off",

    // Fix these
    "jest/no-conditional-expect": "off",
    "jest/no-standalone-expect": "off",
    "jest/valid-expect": "off",
    "jest/prefer-to-be": "error",
    "testing-library/no-unnecessary-act": "off",
    "testing-library/prefer-presence-queries": "off",
    "testing-library/no-wait-for-multiple-assertions": "off",
    "testing-library/no-render-in-setup": "off",
    "testing-library/no-node-access": "off",
    "testing-library/prefer-screen-queries": "off",
    "testing-library/prefer-find-by": "off",
    "testing-library/prefer-query-by-disappearance": "off",
    "testing-library/no-debugging-utils": "warn",
    "testing-library/render-result-naming-convention": "off",

    // customized rules
    "react/no-unescaped-entities": ["error", { forbid: [">", '"', "}"] }], // ' is ok, don't want to escape this
    "react/react-in-jsx-scope": "off", // TS config takes care of this
    "linebreak-style": ["error", "unix"], // prevent crlf from getting pushed
    "react/prop-types": "off", // Doesn't seem pick up React.FC<Props> typing
    "no-console": ["error", { allow: ["warn", "error"] }], // error on push/codacy
    "jest/no-disabled-tests": "warn", // we have some disabled tests
    "no-unused-vars": "off", // duplicate of typescript rule
    "react/jsx-no-target-blank": "off",
    "jest/expect-expect": "off", // sometimes the assertions are in other functions called from a test

    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": [
      "warn",
      {
        additionalHooks: "(useWorkflowEffect|useWorkflowSidePanelHook)",
      },
    ],
  },
  overrides: [
    {
      /** Overrides for typescript */
      files: ["**/*.ts", "**/*.tsx"],
      plugins: ["@typescript-eslint"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
      extends: ["plugin:@typescript-eslint/recommended"],
      rules: {
        "@typescript-eslint/await-thenable": "error",
        "@typescript-eslint/no-unnecessary-type-constraint": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-empty-function": ["warn", { allow: ["arrowFunctions"] }],
        "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }], // prepend var with _ (e.g.. _myVar) to ignore this pattern
        "@typescript-eslint/no-use-before-define": "off", // We will want to use before define to keep exports at the top
        "@typescript-eslint/ban-ts-comment": "off", // We use explicit overrides
        "@typescript-eslint/naming-convention": "off", // React's convention is to use CamelCase for component file names
      },
    },
    {
      files: ["*.test.js", "*.test.ts", "*.test.tsx", "scripts/*"],
      rules: {
        "no-console": "off",
      },
    },
  ],
};
