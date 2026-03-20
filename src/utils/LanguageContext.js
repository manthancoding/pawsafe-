import { createContext, useContext } from 'react';
import translations from '../utils/translations';

export const LanguageContext = createContext('en');

export function useTranslation() {
    const lang = useContext(LanguageContext);
    return translations[lang] || translations['en'];
}
