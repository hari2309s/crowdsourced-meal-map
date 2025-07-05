/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    transpilePackages: ['@repo/shared', '@repo/database'],
    env: {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    i18n: {
        locales: ['en', 'de', 'fr', 'es', 'ar', 'tr'],
        defaultLocale: 'en',
    },
}

export default nextConfig;
