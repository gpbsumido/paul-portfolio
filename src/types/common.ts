import { ElementType } from "react";

export interface HomeButtonProps {
    component?: ElementType;
    href?: string;
}

export interface DropdownItem {
    key: string;
    label: string;
    value?: any;
}

export interface DropdownComponentProps {
    items: DropdownItem[];
    currentSelected?: string;
    startIcon?: React.ReactNode;
    buttonStyles?: object;
    onChange?: (value: any) => void;
    minWidth?: number | string;
    title?: string;
    titleLocation?: "above" | "left"
}
