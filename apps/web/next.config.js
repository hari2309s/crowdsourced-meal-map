import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: [
        '@crowdsourced-meal-map/shared',
        '@crowdsourced-meal-map/database',
        '@crowdsourced-meal-map/ui',
        '@crowdsourced-meal-map/i18n',
    ],
    env: {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
}

export default withNextIntl(nextConfig);
