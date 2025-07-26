import type { TranslationMessages, Locale } from "./types.js";

let messages: TranslationMessages = {};

export function setLocale(loadedMessages: TranslationMessages) {
  messages = loadedMessages;
}

export function t(key: string, vars?: Record<string, string | number>): string {
  const keys = key.split(".");
  let value: any = messages;
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) return key;
  }
  if (typeof value === "string" && vars) {
    Object.entries(vars).forEach(([k, v]) => {
      value = value.replace(new RegExp(`{${k}}`, "g"), String(v));
    });
  }
  return typeof value === "string" ? value : key;
}

/**
 * Loads translation messages for a given locale using dynamic imports.
 * Only supports 'en' and 'de' for now.
 * @param locale The locale code (e.g., 'en', 'de')
 * @param messagesDir The directory where translation files are stored (ignored in static mode)
 */
export async function loadMessages(
  locale: Locale,
  _messagesDir?: string,
): Promise<TranslationMessages> {
  switch (locale) {
    case "en":
      return (await import("./messages/en.json")).default;
    case "de":
      return (await import("./messages/de.json")).default;
    default:
      throw new Error(`Unsupported locale: ${locale}`);
  }
}

export function useTranslation() {
  return { t };
}
