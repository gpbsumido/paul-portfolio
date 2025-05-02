import { ROTATIONS } from "@/constants/medical-journal";

export interface Feedback {
    id: string;
    text: string;
    rotation: string;
    journal_entry_id?: string;
    journal?: {
        id: string;
        patientSetting: string;
        interaction: string;
        canmedsRoles: string[];
        learningObjectives: string[];
        rotation: string;
        date: string;
        location: string;
        hospital?: string;
        doctor?: string;
        whatIDidWell?: string;
        whatICouldImprove?: string;
    };
}

export interface LearningEntry {
    id: string;
    patientSetting: string;
    interaction: string;
    canmedsRoles: string[];
    learningObjectives: string[];
    rotation: string;
    date: string;
    location: string;
    hospital?: string;
    doctor?: string;
    whatIDidWell?: string;
    whatICouldImprove?: string;
    feedback?: Feedback[];
}

export type Rotation = typeof ROTATIONS[number]; 