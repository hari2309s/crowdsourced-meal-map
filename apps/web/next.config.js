import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@crowdsourced-meal-map/shared",
    "@crowdsourced-meal-map/database",
    "@crowdsourced-meal-map/ui",
    "@crowdsourced-meal-map/i18n",
  ],
  env: {
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL ??
      "https://jsvsbacdhyscoqbsnxrr.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzdnNiYWNkaHlzY29xYnNueHJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MzA4NjMsImV4cCI6MjA2NzMwNjg2M30.cCtNsdFQl0pcqLoF-zHJIJ7H-OLAbhKX40pAJyFKUlM",
  },
};

export default withNextIntl(nextConfig);
