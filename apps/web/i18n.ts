import { getRequestConfig } from "next-intl/server";

// Can be imported from a shared config
const locales = ["en", "de", "fr", "es", "ar", "tr"];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    locale = "en"; // Default to English if locale is invalid
  }

  return {
    locale: locale!,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
