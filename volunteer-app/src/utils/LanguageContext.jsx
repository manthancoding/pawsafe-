import { createContext, useContext, useState } from 'react';
import translations from './translations';

export const LanguageContext = createContext('en');

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState('en');
    return (
        <LanguageContext.Provider value={language}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useTranslation() {
    const lang = useContext(LanguageContext);
    return translations[lang] || translations['en'];
}
