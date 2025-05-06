"use client";

import { title } from "process";
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
    | "medicalJournal"
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
            title: "Design Showcase",
            viewDesign: "View {name} Design",
            subtitle: "Implemented and Designed",
            explore: "Explore",
        },
        medicalJournal: {
            title: "Clerkship Reflections",
            objectivesTitle: "Objectives",
            encountersTitle: "Encounters",
            loginPrompt:
                "To start creating/editing/viewing reflections, please login.",
            welcomeMessage: "Welcome,",
            userFallback: "User",
            clinicalEncountersTitle: "Encounters",
            reflectionNote:
                "Reflections you create/edit are only visible to you. Still, don't enter any sensitive or personal information about yourself, colleagues, or patients.",
            addEntryTooltip: "Add Entry",
            dateColumn: "Date",
            rotationColumn: "Rotation",
            logoutButton: "Log Out",
            loginButton: "Log In",
            patientSettingColumn: "Patient/Setting",
            interactionColumn: "Interaction",
            hospitalColumn: "Hospital",
            doctorColumn: "Doctor",
            canmedsRolesColumn: "CanMEDS Roles",
            actionsColumn: "Actions",
            editEntryTooltip: "Edit Entry",
            deleteEntryTooltip: "Delete Entry",
            addNewEntryTitle: "Add New Entry",
            editEntryTitle: "Edit Entry",
            dateLabel: "Date",
            rotationLabel: "Rotation",
            locationLabel: "Location",
            canmedsRolesLabel: "CanMEDS Roles",
            patientSettingLabel: "Patient/Setting",
            interactionLabel: "Interaction",
            hospitalLabel: "Hospital",
            doctorLabel: "Doctor",
            learningobjectivesLabel: "Learning Objectives",
            requiredFieldError: "This field is required",
            cancelButton: "Cancel",
            saveChangesButton: "Save Changes",
            addEntryButton: "Add Entry",
            hospitalPlaceholder: "Enter hospital name",
            doctorPlaceholder: "Enter doctor's name",
            category: {
                "Approach to Cardinal EM Presentations":
                    "Approach to Cardinal EM Presentations",
                "Clinical Skills": "Clinical Skills",
                Communication: "Communication",
            },
            objective: {
                "Appropriate consideration of broader differential diagnoses":
                    "Appropriate consideration of broader differential diagnoses",
                "Suggest rule out/ rule in investigations and management":
                    "Suggest rule out/ rule in investigations and management",
                "Develop systematic approach to common presentations":
                    "Develop systematic approach to common presentations",
                "Recognize critical vs non-critical patients":
                    "Recognize critical vs non-critical patients",
                "Perform focused history and physical examination":
                    "Perform focused history and physical examination",
                "Document patient encounters accurately":
                    "Document patient encounters accurately",
                "Develop and implement management plans":
                    "Develop and implement management plans",
                "Follow-up on investigation results":
                    "Follow-up on investigation results",
                "Clear communication with patients and families":
                    "Clear communication with patients and families",
                "Effective handover to other healthcare providers":
                    "Effective handover to other healthcare providers",
                "Appropriate consultation with specialists":
                    "Appropriate consultation with specialists",
                "Documentation of clinical reasoning":
                    "Documentation of clinical reasoning",
            },
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
                subtitle: "Join the discussion and share your thoughts.",
                postedBy: "Posted by",
                createTitle: "Create New Post",
                cancel: "Cancel",
                submit: "Submit",
                text: "Text",
                username: "Username",
                newPostTitle: "Title",
                newPostContent: "Content",
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
            title: "Galería de Diseños",
            viewDesign: "Ver diseño de {name}",
            subtitle: "Implementado y Diseñado",
            explore: "Explorar",
        },
        medicalJournal: {
            title: "Reflexiones de Internado",
            objectivesTitle: "Objetivos",
            encountersTitle: "Encuentros",
            loginPrompt:
                "Para comenzar a crear/editar/ver reflexiones, por favor inicia sesión.",
            welcomeMessage: "Bienvenido,",
            userFallback: "Usuario",
            clinicalEncountersTitle: "Encuentros",
            reflectionNote:
                "Las reflexiones que creas/editas son visibles solo para ti. Aún así, no ingreses información sensible o personal sobre ti, colegas o pacientes.",
            addEntryTooltip: "Agregar Entrada",
            dateColumn: "Fecha",
            rotationColumn: "Rotación",
            patientSettingColumn: "Paciente/Ajuste",
            interactionColumn: "Interacción",
            hospitalColumn: "Hospital",
            doctorColumn: "Doctor",
            loginButton: "Iniciar Sesión",
            logoutButton: "Cerrar Sesión",
            canmedsRolesColumn: "Roles de CanMEDS",
            actionsColumn: "Acciones",
            editEntryTooltip: "Editar Entrada",
            deleteEntryTooltip: "Eliminar Entrada",
            addNewEntryTitle: "Agregar Nueva Entrada",
            editEntryTitle: "Editar Entrada",
            dateLabel: "Fecha",
            rotationLabel: "Rotación",
            locationLabel: "Ubicación",
            canmedsRolesLabel: "Roles de CanMEDS",
            patientSettingLabel: "Paciente/Ajuste",
            interactionLabel: "Interacción",
            hospitalLabel: "Hospital",
            doctorLabel: "Doctor",
            learningobjectivesLabel: "Objetivos de Aprendizaje",
            requiredFieldError: "Este campo es obligatorio",
            cancelButton: "Cancelar",
            saveChangesButton: "Guardar Cambios",
            addEntryButton: "Agregar Entrada",
            hospitalPlaceholder: "Ingrese el nombre del hospital",
            doctorPlaceholder: "Ingrese el nombre del doctor",
            category: {
                "Approach to Cardinal EM Presentations":
                    "Enfoque a Presentaciones Cardinales en EM",
                "Clinical Skills": "Habilidades Clínicas",
                Communication: "Comunicación",
            },
            objective: {
                "Appropriate consideration of broader differential diagnoses":
                    "Consideración apropiada de diagnósticos diferenciales más amplios",
                "Suggest rule out/ rule in investigations and management":
                    "Sugerir investigaciones y manejo para descartar/confirmar",
                "Develop systematic approach to common presentations":
                    "Desarrollar enfoque sistemático para presentaciones comunes",
                "Recognize critical vs non-critical patients":
                    "Reconocer pacientes críticos vs no críticos",
                "Perform focused history and physical examination":
                    "Realizar historia clínica y examen físico enfocados",
                "Document patient encounters accurately":
                    "Documentar encuentros con pacientes con precisión",
                "Develop and implement management plans":
                    "Desarrollar e implementar planes de manejo",
                "Follow-up on investigation results":
                    "Seguimiento de resultados de investigaciones",
                "Clear communication with patients and families":
                    "Comunicación clara con pacientes y familias",
                "Effective handover to other healthcare providers":
                    "Transferencia efectiva a otros proveedores de salud",
                "Appropriate consultation with specialists":
                    "Consulta apropiada con especialistas",
                "Documentation of clinical reasoning":
                    "Documentación del razonamiento clínico",
            },
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
                subtitle: "Únete a la discusión y comparte tus pensamientos.",
                postedBy: "Publicado por",
                newPostContent: "Contenido",
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
            title: "Vitrine de Design",
            viewDesign: "Voir le design {name}",
            subtitle: "Implémenté et Conçu",
            explore: "Explorer",
        },
        medicalJournal: {
            title: "Réflexions de Stage",
            objectivesTitle: "Objectifs",
            encountersTitle: "Rencontres",
            loginPrompt:
                "Pour commencer à créer/modifier/voir des réflexions, veuillez vous connecter.",
            welcomeMessage: "Bienvenue,",
            userFallback: "Utilisateur",
            clinicalEncountersTitle: "Rencontres",
            reflectionNote:
                "Les réflexions que vous créez/modifiez ne sont visibles que par vous. N'entrez pas d'informations sensibles ou personnelles sur vous-même, vos collègues ou vos patients.",
            addEntryTooltip: "Ajouter une Entrée",
            dateColumn: "Date",
            rotationColumn: "Rotation",
            logoutButton: "Déconnexion",
            loginButton: "Connexion",
            patientSettingColumn: "Patient/Contexte",
            interactionColumn: "Interaction",
            hospitalColumn: "Hôpital",
            doctorColumn: "Docteur",
            canmedsRolesColumn: "Rôles CanMEDS",
            actionsColumn: "Actions",
            editEntryTooltip: "Modifier l'Entrée",
            deleteEntryTooltip: "Supprimer l'Entrée",
            addNewEntryTitle: "Ajouter une Nouvelle Entrée",
            editEntryTitle: "Modifier l'Entrée",
            dateLabel: "Date",
            rotationLabel: "Rotation",
            locationLabel: "Lieu",
            canmedsRolesLabel: "Rôles CanMEDS",
            patientSettingLabel: "Patient/Contexte",
            interactionLabel: "Interaction",
            hospitalLabel: "Hôpital",
            doctorLabel: "Docteur",
            learningobjectivesLabel: "Objectifs d'apprentissage",
            requiredFieldError: "Ce champ est obligatoire",
            cancelButton: "Annuler",
            saveChangesButton: "Enregistrer les Modifications",
            addEntryButton: "Ajouter une Entrée",
            hospitalPlaceholder: "Entrez le nom de l'hôpital",
            doctorPlaceholder: "Entrez le nom du médecin",
            category: {
                "Approach to Cardinal EM Presentations":
                    "Approche des présentations cardinales en EM",
                "Clinical Skills": "Compétences Cliniques",
                Communication: "Communication",
            },
            objective: {
                "Appropriate consideration of broader differential diagnoses":
                    "Considération appropriée des diagnostics différentiels plus larges",
                "Suggest rule out/ rule in investigations and management":
                    "Suggérer des investigations et une gestion pour exclure/confirmer",
                "Develop systematic approach to common presentations":
                    "Développer une approche systématique des présentations courantes",
                "Recognize critical vs non-critical patients":
                    "Reconnaître les patients critiques vs non critiques",
                "Perform focused history and physical examination":
                    "Effectuer une anamnèse et un examen physique ciblés",
                "Document patient encounters accurately":
                    "Documenter avec précision les rencontres avec les patients",
                "Develop and implement management plans":
                    "Élaborer et mettre en œuvre des plans de gestion",
                "Follow-up on investigation results":
                    "Suivi des résultats des investigations",
                "Clear communication with patients and families":
                    "Communication claire avec les patients et les familles",
                "Effective handover to other healthcare providers":
                    "Transmission efficace aux autres prestataires de soins",
                "Appropriate consultation with specialists":
                    "Consultation appropriée avec les spécialistes",
                "Documentation of clinical reasoning":
                    "Documentation du raisonnement clinique",
            },
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
                subtitle: "Rejoignez la discussion et partagez vos pensées.",
                postedBy: "Publié par",
                newPostContent: "Contenu",
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
