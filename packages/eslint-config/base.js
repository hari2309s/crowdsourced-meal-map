import { fileURLToPath } from "node:url";
import path from "node:path";
import parser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import onlyWarn from "eslint-plugin-only-warn";
import turboPlugin from "eslint-plugin-turbo";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Flat ESLint config for monorepo base (ESLint 9+)
 * @type {import('eslint').Linter.FlatConfig[]}
 */
export default [
  {
    files: ["**/*.{js,jsx,ts,tsx}", "**/*.mjs", "**/*.cjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: parser,
      parserOptions: {
        project: [
          "./tsconfig.json",
          "apps/*/tsconfig.json",
          "packages/*/tsconfig.json"
        ],
        ecmaFeatures: { jsx: true },
      },
      globals: {
        window: "readonly",
        document: "readonly",
        process: "readonly",
        module: "readonly",
        require: "readonly",
        __dirname: "readonly",
        __filename: "readonly"
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "only-warn": onlyWarn,
      "turbo": turboPlugin,
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
      "@typescript-eslint/dot-notation": [
        "error",
        {
          allowKeywords: true
        }
      ],
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
    ignores: [
      "**/node_modules",
      "**/dist",
      "**/build",
      "**/.next",
      "**/.turbo"
    ]
  }
];
