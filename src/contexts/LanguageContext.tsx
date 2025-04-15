"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "es" | "fr";

type TranslationKey = "navigation" | "about" | "designs";
type TranslationPath = `${TranslationKey}.${string}`;

interface Translations {
    navigation: {
        home: string;
        designs: string;
        about: string;
    };
    about: {
        title: string;
        description: string;
    };
    designs: {
        title: string;
        viewDesign: string;
    };
}

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: TranslationPath) => string;
}

const translations: Record<Language, Translations> = {
    en: {
        navigation: {
            home: "Home",
            designs: "Designs",
            about: "About",
        },
        about: {
            title: "About Paul",
            description:
                "I'm a passionate developer and designer with a love for creating beautiful, functional experiences.",
        },
        designs: {
            title: "Designs",
            viewDesign: "View {name} Design",
        },
    },
    es: {
        navigation: {
            home: "Inicio",
            designs: "Diseños",
            about: "Sobre mí",
        },
        about: {
            title: "Sobre Paul",
            description:
                "Soy un desarrollador y diseñador apasionado con amor por crear experiencias hermosas y funcionales.",
        },
        designs: {
            title: "Diseños",
            viewDesign: "Ver diseño de {name}",
        },
    },
    fr: {
        navigation: {
            home: "Accueil",
            designs: "Designs",
            about: "À propos",
        },
        about: {
            title: "À propos de Paul",
            description:
                "Je suis un développeur et designer passionné qui aime créer des expériences belles et fonctionnelles.",
        },
        designs: {
            title: "Designs",
            viewDesign: "Voir le design {name}",
        },
    },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
    undefined
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>("en");

    useEffect(() => {
        const savedLanguage = localStorage.getItem("language") as Language | null;
        if (savedLanguage && ["en", "es", "fr"].includes(savedLanguage)) {
            setLanguage(savedLanguage);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem("language", lang);
    };

    const t = (key: TranslationPath): string => {
        const [section, subKey] = key.split(".");
        const translation = translations[language][section as TranslationKey][subKey as keyof Translations[TranslationKey]];
        return translation || key;
    };

    return (
        <LanguageContext.Provider
            value={{ language, setLanguage: handleSetLanguage, t }}
        >
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
