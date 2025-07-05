# TypeScript Configuration

This package provides shared TypeScript configuration for the Crowdsourced Meal Map monorepo.

## Usage

In your `tsconfig.json`:

```json
{
  "extends": "@crowdsourced-meal-map/typescript-config/base.json",
  "compilerOptions": {
    // Your overrides here
  }
}
```

## Available Configurations

- `base.json`: Base configuration for all TypeScript projects
- `nextjs.json`: Configuration for Next.js applications
- `react-library.json`: Configuration for React component libraries

## Path Aliases

The following path aliases are configured by default:

- `@/*`: `./src/*`
- `@crowdsourced-meal-map/shared/*`: `../../packages/shared/src/*`
- `@crowdsourced-meal-map/database/*`: `../../packages/database/src/*`
- `@crowdsourced-meal-map/ui/*`: `../../packages/ui/src/*`

These aliases should work seamlessly with both TypeScript and ESLint.
