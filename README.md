# Crowdsourced Meal Map

A platform mapping food distribution centers with crowdsourced data.

## About

Meal Map is a platform that helps people find free meal resources in their area. Connecting food banks, soup kitchens, community fridges, and other food distribution centers.

## Features

### Current Features

- **Interactive Map**: Browse food centers with detailed location information
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile
- **Internationalization**: Multi-language support for global accessibility
- **Real-time Data**: Up-to-date information on food center availability
- **Search & Filter**: Find specific types of food assistance near you

## Architecture

- [View System Architecture Diagram](docs/system-architecture.md)

This project uses a modern monorepo structure with Turbo for optimal development workflow:

```
crowdsourced-meal-map/
├── apps/
│   ├── web/           # Next.js frontend application
│   └── api/           # Express.js backend API
├── packages/
│   ├── database/      # Supabase client and queries
│   ├── shared/        # Shared types, constants, utilities
│   ├── i18n/          # Internationalization utilities
│   ├── ui/            # Shared UI components
│   ├── eslint-config/ # Shared ESLint configuration
│   └── typescript-config/ # Shared TypeScript configuration
└── ...
```

## Tech Stack

### Frontend

- **Next.js** (React 19) - Full-stack React framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Components** - Modern component architecture

### Backend

- **Express.js** - Fast, unopinionated web framework
- **Supabase** - Open-source Firebase alternative
- **PostgreSQL** - Reliable relational database
