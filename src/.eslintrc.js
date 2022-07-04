// eslint-disable-next-line no-undef
module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: "module",
  },
  ignorePatterns: ["build/**", "node_modules/**"],
  settings: {
    react: {
      version: "detect",
    },
  },
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  globals: {},
  env: {
    es2020: true,
    browser: true,
    es6: true,
  },
  rules: {
    "react/jsx-sort-props": "error",
    "no-unused-vars": "warn",
    "no-debugger": "warn",
  },
  overrides: [
    {
      files: ["./*.config.js"],
      env: {
        node: true,
      },
    },
  ],
};
