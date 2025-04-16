"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "es" | "fr";

type TranslationKey = "navigation" | "about" | "designs" | "pages" | "common";
type TranslationPath = `${TranslationKey}.${string}`;

type TranslationValue = string | { [key: string]: TranslationValue };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationPath, params?: Record<string, string>) => string;
}

const translations = {
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
    pages: {
      fantasy: {
        title: "Fantasy Basketball",
        dataNote: "*Data is rate limited and cached for 1 hour",
        errorTitle: "Error Loading Fantasy Basketball Data",
        selectTeam: "Select Team",
        players: "Players",
        noTeamSelected: "No Team Selected",
        columns: {
          player: "Player",
          position: "POS",
          points: "PTS",
          rebounds: "REB",
          assists: "AST",
          steals: "STL",
          blocks: "BLK",
          fantasyPoints: "FP",
        },
      },
    },
    common: {
      unknownError: "An unknown error occurred",
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
    pages: {
      fantasy: {
        title: "Baloncesto Fantasy",
        dataNote: "*Los datos están limitados y se almacenan en caché durante 1 hora",
        errorTitle: "Error al cargar los datos de Baloncesto Fantasy",
        selectTeam: "Seleccionar Equipo",
        players: "Jugadores",
        noTeamSelected: "Ningún Equipo Seleccionado",
        columns: {
          player: "Jugador",
          position: "POS",
          points: "PTS",
          rebounds: "REB",
          assists: "AST",
          steals: "ROB",
          blocks: "TAP",
          fantasyPoints: "FP",
        },
      },
    },
    common: {
      unknownError: "Se produjo un error desconocido",
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
    pages: {
      fantasy: {
        title: "Basketball Fantasy",
        dataNote: "*Les données sont limitées et mises en cache pendant 1 heure",
        errorTitle: "Erreur lors du chargement des données de Basketball Fantasy",
        selectTeam: "Sélectionner une Équipe",
        players: "Joueurs",
        noTeamSelected: "Aucune Équipe Sélectionnée",
        columns: {
          player: "Joueur",
          position: "POS",
          points: "PTS",
          rebounds: "REB",
          assists: "PAS",
          steals: "INT",
          blocks: "CTR",
          fantasyPoints: "FP",
        },
      },
    },
    common: {
      unknownError: "Une erreur inconnue s'est produite",
    },
  },
} satisfies Record<Language, TranslationValue>;

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getTranslationValue(obj: TranslationValue, path: string[]): string | undefined {
  let current: TranslationValue = obj;

  for (const key of path) {
    if (typeof current !== "object" || current === null || !(key in current)) {
      return undefined;
    }
    current = current[key];
  }

  return typeof current === "string" ? current : undefined;
}

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

  const t = (key: TranslationPath, params?: Record<string, string>): string => {
    const keys = key.split(".");
    const value =
      getTranslationValue(translations[language], keys) ??
      getTranslationValue(translations["en"], keys) ??
      key;

    if (params) {
      return value.replace(/\{(\w+)\}/g, (_, paramKey) => params[paramKey] || "");
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
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