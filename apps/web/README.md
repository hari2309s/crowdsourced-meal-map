# Web App – Crowdsourced Meal Map

This is the Next.js frontend for the Crowdsourced Meal Map project. It provides an interactive map for discovering, adding, and reporting on free meal resources in your community.

## Features

- Interactive map with markers for food banks, soup kitchens, pantries, and more
- Add new locations and report issues
- User authentication
- Multilingual support (i18n)
- Responsive design

## Getting Started

### Install dependencies

```sh
pnpm install
```

### Run the development server

```sh
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```sh
pnpm build
```

## Project Structure

- `app/` – Next.js app directory (pages, layouts, etc.)
- `components/` – Shared React components
- `hooks/` – Custom React hooks
- `public/` – Static assets

## Environment Variables

See `.env.example` for required variables (e.g., API endpoints, Supabase keys).

---

For backend/API details, see [../api/README.md](../api/README.md)
