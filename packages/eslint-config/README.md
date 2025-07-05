# ESLint Configuration

This package provides shared ESLint configuration for the Crowdsourced Meal Map monorepo.

## Usage

In your `.eslintrc.js`:

```javascript
module.exports = {
  extends: ["@crowdsourced-meal-map/eslint-config/base"],
  // Your overrides here
};
```

For Next.js projects:

```javascript
module.exports = {
  extends: ["@crowdsourced-meal-map/eslint-config/next-js"],
};
```

For internal React components:

```javascript
module.exports = {
  extends: ["@crowdsourced-meal-map/eslint-config/react-internal"],
};
```

## Features

- TypeScript support
- Prettier integration
- Turbo monorepo support
- React and Next.js specific rules
- Only warnings (no errors) for unused variables
- Proper path alias resolution

## Path Aliases

The configuration automatically resolves the following path aliases:

- `@/*`
- `@shared/*`
- `@crowdsourced-meal-map/shared/*`
- `@crowdsourced-meal-map/database/*`
- `@crowdsourced-meal-map/ui/*`

These aliases work seamlessly with both TypeScript and ESLint.
