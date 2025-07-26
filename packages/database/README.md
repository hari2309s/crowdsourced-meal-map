# @crowdsourced-meal-map/database

Database client and query utilities for the Crowdsourced Meal Map monorepo. Wraps Supabase and provides typed queries for use in both backend and frontend.

## Features

- Typed Supabase client
- Common queries for food centers, availability, reports, and reviews
- Shared between API and web apps

## Usage

Import and use in your app or API:

```ts
import { client, getFoodCenters } from "@crowdsourced-meal-map/database";

const centers = await getFoodCenters();
```

## Main Exports

- `client` – Supabase client instance
- `queries` – Query functions for main resources
- `types` – Shared database types

## Development

- `pnpm build` – Build the package
- `pnpm dev` – Watch mode

---

See also: [@crowdsourced-meal-map/shared](../shared/README.md)
