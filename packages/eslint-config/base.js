import { defineConfig } from "eslint-define-config";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('eslint').Linter.Config} */
export default defineConfig({
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  plugins: ["only-warn", "turbo"],
  env: {
    es2022: true,
    node: true,
    browser: true,
    es6: true
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    },
    project: "./tsconfig.json"
  },
  rules: {
    // Base rules
    "no-unused-vars": "off",
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "prefer-const": "warn",
    
    // TypeScript rules
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_"
      }
    ],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    
    // Import rules
    "import/no-unresolved": "off",
    "import/extensions": "off",
    
    // Turbo rules
    "turbo/no-undeclared-env-vars": "error"
  },
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: ["apps/*/tsconfig.json", "packages/*/tsconfig.json"]
      }
    },
    react: {
      version: "detect"
    }
  },
  ignorePatterns: [
    "**/node_modules",
    "**/dist",
    "**/build",
    "**/.next",
    "**/.turbo"
  ]
});
