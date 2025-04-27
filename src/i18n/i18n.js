// src/i18n/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enUS from './locales/en-us';
import ptBR from './locales/pt-br';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      'en-US': {
        translation: enUS
      },
      'pt-BR': {
        translation: ptBR
      }
    },
    lng: 'pt-BR',
    fallbackLng: 'en-US',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;