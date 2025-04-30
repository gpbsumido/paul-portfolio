"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { text } from "stream/consumers";

type Language = "en" | "es" | "fr";

type TranslationKey =
    | "navigation"
    | "about"
    | "designs"
    | "pages"
    | "pages.fantasy"
    | "pages.fantasy.subpages"
    | "pages.fantasy.columns";
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
            fantasybasketball: "Fantasy Basketball",
            fantasyF1: "Fantasy F1",
            forum: "Forum",
            maps: "Map",
        },
        about: {
            title: "About Paul",
            description:
                "I'm a passionate developer and designer with a love for creating beautiful, functional experiences.",
        },
        designs: {
            title: "Designs",
            viewDesign: "View {name} Design",
            subtitle: "Implemented and Designed",
            explore: "Explore"
        },
        pages: {
            error: "Error",
            tryAgain: "Try Again",
            unknownError: "An unknown error occurred",
            fantasy: {
                title: "Fantasy Basketball",
                subtitle: "Fantasy Basketball Data",
                dataNote: "*Data is rate limited and cached for 1 hour",
                errorTitle: "Error Loading Fantasy Basketball Data",
                selectTeam: "Select Team",
                players: "Players",
                noTeamSelected: "No Team Selected",
                loading: "Loading...",
                week: "Week",
                rank: "Rank",
                subpages: {
                    nbaStats: "NBA Stats",
                    league: "League",
                    history: "History",
                    matchups: "Matchups",
                    visualization: "Visualization",
                    drivers: "Drivers",
                    constructors: "Constructors",
                    schedule: "Schedule",
                    qualifying: "Qualifying",
                    "fantasy-scoring": "Fantasy Scoring",
                },
                standingsTitle: "Standings",
                playerStatsTitle: "Player Stats",
                columns: {
                    player: "Player",
                    position: "POS",
                    points: "PTS",
                    rebounds: "REB",
                    assists: "AST",
                    steals: "STL",
                    blocks: "BLK",
                    fantasyPoints: "FP",
                    games: "GP",
                    finalPosition: "Final Position",
                },
                season: "Season",
                historyComingSoon: "History coming soon!",
                matchupsComingSoon: "Matchups coming soon!",
                statsComingSoon: "Stats coming soon!",
                playerContributionsWeekly: "Player Contributions Weekly",
            },
            forum: {
                title: "Forum",
                createPost: "Create Post",
                createTitle: "Create New Post",
                cancel: "Cancel",
                submit: "Submit",
                text: "Text",
                username: "Username",
                newPostTitle: "Title",
            },
            maps: {
                title: "Map",
                subtitle: "Save locations and create routes",
            },
            gallery: {
                title: "Gallery",
                subtitle: "Photography & Visual Work",
            },
        },
    },
    es: {
        navigation: {
            home: "Inicio",
            designs: "Diseños",
            about: "Sobre mí",
            fantasybasketball: "Baloncesto de Fantasía",
            fantasyF1: "F1 de Fantasía",
            forum: "Foro",
            maps: "Mapa",
        },
        about: {
            title: "Sobre Paul",
            description:
                "Soy un desarrollador y diseñador apasionado con amor por crear experiencias hermosas y funcionales.",
        },
        designs: {
            title: "Diseños",
            viewDesign: "Ver diseño de {name}",
            subtitle: "Implementado y Diseñado",
            explore: "Explorar"
        },
        pages: {
            error: "Error",
            tryAgain: "Intentar de nuevo",
            unknownError: "Se produjo un error desconocido",
            fantasy: {
                title: "Baloncesto Fantasy",
                subtitle: "Datos de Baloncesto Fantasy",
                dataNote:
                    "*Los datos están limitados y se almacenan en caché durante 1 hora",
                errorTitle: "Error al cargar los datos de Baloncesto Fantasy",
                selectTeam: "Seleccionar Equipo",
                players: "Jugadores",
                noTeamSelected: "Ningún Equipo Seleccionado",
                loading: "Cargando...",
                week: "Semana",
                rank: "Clasificación",
                subpages: {
                    nbaStats: "Estadísticas NBA",
                    league: "Liga",
                    history: "Historial",
                    matchups: "Partidos",
                    visualization: "Visualización",
                    drivers: "Pilotos",
                    constructors: "Constructores",
                    schedule: "Calendario",
                    qualifying: "Clasificación",
                    "fantasy-scoring": "Puntuación de Fantasía",
                },
                standingsTitle: "Clasificaciones",
                playerStatsTitle: "Estadísticas de Jugadores",
                columns: {
                    player: "Jugador",
                    position: "POS",
                    points: "PTS",
                    rebounds: "REB",
                    assists: "AST",
                    steals: "ROB",
                    blocks: "TAP",
                    fantasyPoints: "FP",
                    games: "GP",
                    finalPosition: "Posición final",
                },
                season: "Temporada",
                historyComingSoon: "¡Historial próximamente!",
                matchupsComingSoon: "¡Partidos próximamente!",
                statsComingSoon: "¡Estadísticas próximamente!",
                playerContributionsWeekly:
                    "Contribuciones Semanales de Jugadores",
            },
            forum: {
                title: "Foro",
                createPost: "Crear Post",
                createTitle: "Crear Nuevo Post",
                cancel: "Cancelar",
                submit: "Enviar",
                text: "Texto",
                username: "Nombre de usuario",
                newPostTitle: "Título",
            },
            maps: {
                title: "Carte",
                subtitle: "Guardar ubicaciones y crear rutas",
            },
            gallery: {
                title: "Galería",
                subtitle: "Fotografía y Trabajo Visual",
            },
        },
    },
    fr: {
        navigation: {
            home: "Accueil",
            designs: "Désigns",
            about: "À propos",
            fantasybasketball: "Basketball Fantaisie",
            fantasyF1: "F1 Fantaisie",
            forum: "Forum",
            maps: "Carte",
        },
        about: {
            title: "À propos de Paul",
            description:
                "Je suis un développeur et designer passionné qui aime créer des expériences belles et fonctionnelles.",
        },
        designs: {
            title: "Designs",
            viewDesign: "Voir le design {name}",
            subtitle: "Implémenté et Conçu",
            explore: "Explorer"
        },
        pages: {
            error: "Erreur",
            tryAgain: "Réessayer",
            unknownError: "Une erreur inconnue s'est produite",
            fantasy: {
                title: "Basketball Fantasy",
                subtitle: "Données de Basketball Fantasy",
                dataNote:
                    "*Les données sont limitées et mises en cache pendant 1 heure",
                errorTitle:
                    "Erreur lors du chargement des données de Basketball Fantasy",
                selectTeam: "Sélectionner une Équipe",
                players: "Joueurs",
                noTeamSelected: "Aucune Équipe Sélectionnée",
                loading: "Chargement...",
                week: "Semaine",
                rank: "Classement",
                subpages: {
                    nbaStats: "Statistiques NBA",
                    league: "Ligue",
                    history: "Historique",
                    matchups: "Matchs",
                    visualization: "Visualisation",
                    drivers: "Pilotes",
                    constructors: "Constructeurs",
                    schedule: "Calendrier",
                    qualifying: "Qualifications",
                    "fantasy-scoring": "Scoring Fantaisie",
                },
                standingsTitle: "Classements",
                playerStatsTitle: "Statistiques des Joueurs",
                columns: {
                    player: "Joueur",
                    position: "POS",
                    points: "PTS",
                    rebounds: "REB",
                    assists: "PAS",
                    steals: "INT",
                    blocks: "CTR",
                    fantasyPoints: "FP",
                    games: "GP",
                    finalPosition: "Position finale",
                },
                season: "Saison",
                historyComingSoon: "Historique à venir!",
                matchupsComingSoon: "Matchs à venir!",
                statsComingSoon: "Statistiques à venir!",
                playerContributionsWeekly:
                    "Contributions Hebdomadaires des Joueurs",
            },
            forum: {
                title: "Forum",
                createPost: "Créer un Post",
                createTitle: "Créer un Nouveau Post",
                cancel: "Annuler",
                submit: "Soumettre",
                text: "Texte",
                username: "Nom d'utilisateur",
                newPostTitle: "Titre",
            },
            maps: {
                title: "Carte",
                subtitle:
                    "Enregistrer des emplacements et créer des itinéraires",
            },
            gallery: {
                title: "Galerie",
                subtitle: "Photographie et Travail Visuel",
            },
        },
    },
} satisfies Record<Language, TranslationValue>;

const LanguageContext = createContext<LanguageContextType | undefined>(
    undefined
);

function getTranslationValue(
    obj: TranslationValue,
    path: string[]
): string | undefined {
    let current: TranslationValue = obj;

    for (const key of path) {
        if (
            typeof current !== "object" ||
            current === null ||
            !(key in current)
        ) {
            return undefined;
        }
        current = current[key];
    }

    return typeof current === "string" ? current : undefined;
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [language, setLanguage] = useState<Language>("en");

    useEffect(() => {
        const savedLanguage = localStorage.getItem(
            "language"
        ) as Language | null;
        if (savedLanguage && ["en", "es", "fr"].includes(savedLanguage)) {
            setLanguage(savedLanguage);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem("language", lang);
    };

    const t = (
        key: TranslationPath,
        params?: Record<string, string>
    ): string => {
        const keys = key.split(".");
        const value =
            getTranslationValue(translations[language], keys) ??
            getTranslationValue(translations["en"], keys) ??
            key;

        if (params) {
            return value.replace(
                /\{(\w+)\}/g,
                (_, paramKey) => params[paramKey] || ""
            );
        }

        return value;
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
