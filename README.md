# Crowdsourced Meal Map

A monorepo for the Crowdsourced Meal Map project, which helps communities find, share, and report on free meal resources such as food banks, soup kitchens, and community fridges.

## Monorepo Structure

- **apps/**
  - **web/**: Next.js frontend for the interactive meal map
  - **api/**: Express backend API for data and reporting
- **packages/**
  - **database/**: Database client and queries (Supabase)
  - **shared/**: Shared types, constants, and utilities
  - **i18n/**: Internationalization utilities and messages
  - **ui/**: Shared UI components
  - **eslint-config/**: Shared ESLint config
  - **typescript-config/**: Shared TypeScript config

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- pnpm (preferred), yarn, or npm

### Install dependencies
```sh
pnpm install
```

### Development
To start both frontend and backend in development mode:
```sh
# In separate terminals:
cd apps/web && pnpm dev
cd apps/api && pnpm dev
```

### Build all packages
```sh
pnpm build
```

## Tech Stack
- Next.js (React 19)
- Express
- Supabase
- TypeScript
- Tailwind CSS
- Turbo monorepo

## Apps & Packages
- [Web App](./apps/web/README.md)
- [API](./apps/api/README.md)
- [Database](./packages/database/README.md)
- [Shared](./packages/shared/README.md)
- [UI](./packages/ui/README.md)
- [i18n](./packages/i18n/README.md)
- [ESLint Config](./packages/eslint-config/README.md)

## Contributing
Pull requests and issues are welcome!

---

© Crowdsourced Meal Map contributors
