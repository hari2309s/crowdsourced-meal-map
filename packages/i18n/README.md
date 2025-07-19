# @crowdsourced-meal-map/i18n

Shared i18n utilities for Crowdsourced Meal Map monorepo.

## Features

- Dynamic loading of translation files for any locale
- Type-safe translation utilities for both backend and frontend
- React hook for translations in UI components

## Usage

1. **Load translation messages for the desired locale using `loadMessages(locale, messagesDir)`**
2. **Set the current locale and messages using `setLocale(locale, messages)`**
3. **Use the `t` function for translations throughout your app**
4. **Use the `useTranslation` hook in React components**

### Backend and Frontend Integration

- Import utilities from `@crowdsourced-meal-map/i18n` in your application code.
- Ensure translation files (e.g., `en.json`, `de.json`) are available in the specified directory at runtime.
- Always load and set the locale/messages before rendering or handling requests that require translations.

### API

- `loadMessages(locale: string, messagesDir: string): Promise<TranslationMessages>` — Loads translation messages for the given locale from the specified directory.
- `setLocale(locale: string, messages: TranslationMessages): void` — Sets the current locale and messages for translation.
- `t(key: string, vars?: Record<string, string | number>): string` — Translates a key with optional variable interpolation.
- `useTranslation(): { t: typeof t }` — React hook for accessing the translation function in components.

Refer to the source code for further details on advanced usage and configuration.
