# API – Crowdsourced Meal Map

This is the Express backend API for the Crowdsourced Meal Map project. It provides endpoints for managing food resource locations, availability, reports, and reviews.

## Features

- RESTful API for food centers, availability, reports, and reviews
- Input validation with Zod
- Supabase integration for data storage
- CORS enabled

## Getting Started

### Install dependencies

```sh
pnpm install
```

### Run in development mode

```sh
pnpm dev
```

### Build for production

```sh
pnpm build
```

## Project Structure

- `src/index.ts` – API entry point
- `src/routes/` – Route handlers for different resources

## Environment Variables

See `.env.example` for required variables (e.g., Supabase keys).

## Main Endpoints

- `GET /food-centers` – List all food centers
- `POST /food-centers` – Add a new food center
- `GET /availability` – Get availability info
- `POST /reports` – Report an issue
- `POST /reviews` – Submit a review

---

For frontend details, see [../web/README.md](../web/README.md)
