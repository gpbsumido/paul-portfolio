import { StaticImageData } from "next/image";

export interface CarouselProps {
    images: (string | StaticImageData)[];
    currentIndex: number;
    onIndexChange: (index: number) => void;
    title: string;
    textColor: string;
}

export interface ImageCarouselProps {
    images: (string | StaticImageData)[];
    currentIndex: number;
    onIndexChange: (index: number) => void;
}

export interface HomeButtonProps {
    onClick: () => void;
    textColor: string;
    bgColor: string;
}

export interface ProgressBarProps {
    progressKey: number;
} 