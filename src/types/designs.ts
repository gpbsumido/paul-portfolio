import { StaticImageData } from "next/image";
import { SxProps, Theme } from "@mui/material";

export interface CarouselProps {
    images: (string | StaticImageData)[];
    currentIndex: number;
    onIndexChange: (index: number) => void;
    title: string;
    textColor: string;
    isLoading?: boolean;
    maxWidth?: string;
    sx?: SxProps<Theme>;
}

export interface ImageCarouselProps {
    images: (string | StaticImageData)[];
    currentIndex: number;
    onIndexChange: (index: number) => void;
    isLoading?: boolean;
}

export interface HomeButtonProps {
    onClick: () => void;
    textColor: string;
    bgColor: string;
}

export interface ProgressBarProps {
    progressKey: number;
}
