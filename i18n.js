import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import it from './locales/it.json';

const resources = {
  en: { translation: en },
  it: { translation: it },
};

// Safe detection of language
const deviceLocale = Localization.locale || 'en'; // fallback to 'en'
const languageTag = deviceLocale.split(/[-_]/)[0]; // handle 'en-US' or 'en_US'

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: languageTag,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
