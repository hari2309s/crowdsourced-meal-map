export type Locale = string;

export type TranslationMessages = {
  [key: string]: string | TranslationMessages;
};
