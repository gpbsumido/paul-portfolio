'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'es' | 'fr';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, params?: Record<string, string>) => string;
}

const translations = {
    en: {
        navigation: {
            home: "Home",
            designs: "Designs",
            about: "About"
        },
        about: {
            title: "About Paul",
            description: "I'm a passionate developer and designer with a love for creating beautiful, functional experiences."
        },
        designs: {
            title: "Designs",
            viewDesign: "View {{name}} Design"
        }
    },
    es: {
        navigation: {
            home: "Inicio",
            designs: "Diseños",
            about: "Sobre mí"
        },
        about: {
            title: "Sobre Paul",
            description: "Soy un desarrollador y diseñador apasionado con amor por crear experiencias hermosas y funcionales."
        },
        designs: {
            title: "Diseños",
            viewDesign: "Ver diseño de {{name}}"
        }
    },
    fr: {
        navigation: {
            home: "Accueil",
            designs: "Designs",
            about: "À propos"
        },
        about: {
            title: "À propos de Paul",
            description: "Je suis un développeur et designer passionné qui aime créer des expériences belles et fonctionnelles."
        },
        designs: {
            title: "Designs",
            viewDesign: "Voir le design {{name}}"
        }
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') as Language;
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es' || savedLanguage === 'fr')) {
            setLanguage(savedLanguage);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const t = (key: string, params?: Record<string, string>) => {
        const keys = key.split('.');
        let value = translations[language];
        
        for (const k of keys) {
            value = value?.[k];
            if (!value) return key;
        }

        if (typeof value !== 'string') return key;

        if (params) {
            return value.replace(/\{\{(\w+)\}\}/g, (_, key) => params[key] || '');
        }

        return value;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
} 