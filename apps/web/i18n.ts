import { getRequestConfig } from "next-intl/server";
import { loadMessages, setLocale } from "@crowdsourced-meal-map/i18n";

const locales = ["en", "de", "fr", "es", "ar", "tr"];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) {
    locale = "en";
  }
  const messages = await loadMessages(locale!);
  setLocale(messages);
  return {
    locale: locale!,
    messages,
  };
});
