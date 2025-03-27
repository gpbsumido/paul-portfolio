'use client'

import { Box, Typography, IconButton } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import HomeIcon from "@mui/icons-material/Home";
import Footer from "../../components/Footer";
import Image, { StaticImageData } from "next/image";
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { figmaDesigns, figmaImages, HELIKA_PORTAL_IMAGES, HELIKA_UA_IMAGES } from "@/constants/constants";

// Types
interface CarouselProps {
    images: (string | StaticImageData)[];
    currentIndex: number;
    onIndexChange: (index: number) => void;
    title: string;
    textColor: string;
}

interface ImageCarouselProps {
    images: (string | StaticImageData)[];
    currentIndex: number;
    onIndexChange: (index: number) => void;
}

// Reusable components
const HomeButton = ({ onClick, textColor, bgColor }: { onClick: () => void; textColor: string; bgColor: string }) => (
    <button
        onClick={onClick}
        style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            padding: "10px",
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            border: "1px solid",
            background: textColor,
            color: bgColor,
            cursor: "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderColor: bgColor,
        }}
    >
        <HomeIcon style={{ fontSize: "24px", height: '24px', width: '24px', color: bgColor }} />
    </button>
);

const ProgressBar = ({ key }: { key: number }) => (
    <Box
        sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '5px',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            zIndex: 200,
            overflow: 'hidden',
        }}
    >
        <Box
            sx={{
                height: '100%',
                backgroundColor: 'white',
                animation: 'fillProgress 5s linear infinite',
                width: '100%',
                zIndex: 201,
            }}
            key={key}
        />
        <style jsx>{`
            @keyframes fillProgress {
                from { width: 0; }
                to { width: 100%; }
            }
        `}</style>
    </Box>
);

const ImageCarousel = ({ images, currentIndex, onIndexChange }: ImageCarouselProps) => {
    const maxVisible = 3;
    const carouselIndex = useMemo(() => Math.min(currentIndex, images.length - maxVisible), [currentIndex, images.length]);

    return (
        <Box
            sx={{
                height: '20vh',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '16px',
                display: 'flex',
                flexDirection: 'row',
                gap: '1em',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <IconButton
                onClick={() => onIndexChange(Math.max(currentIndex - 1, 0))}
                sx={{
                    position: 'absolute',
                    left: '0',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    '&:hover': { background: 'rgba(0, 0, 0, 0.7)' }
                }}
            >
                <ArrowCircleLeftIcon sx={{ fontSize: '3em' }} />
            </IconButton>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '1em',
                    transform: `translateX(-${carouselIndex * 33.33}%)`,
                    transition: 'transform 0.3s ease',
                    width: `${images.length * 33.33}%`,
                    paddingLeft: '1em'
                }}
            >
                {images.map((image, idx) => (
                    <Box
                        key={idx}
                        sx={{
                            height: '100%',
                            aspectRatio: '3593/2090',
                            backgroundColor: 'white',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flex: '0 0 calc(33.33% - 1em)',
                        }}
                        onMouseEnter={() => onIndexChange(idx)}
                    >
                        <Image
                            src={image}
                            alt={`Thumbnail ${idx + 1}`}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                            loading="lazy"
                        />
                    </Box>
                ))}
            </Box>
            <IconButton
                onClick={() => onIndexChange(Math.min(currentIndex + 1, images.length - maxVisible))}
                sx={{
                    position: 'absolute',
                    right: '0',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    '&:hover': { background: 'rgba(0, 0, 0, 0.7)' }
                }}
            >
                <ArrowCircleRightIcon sx={{ fontSize: '3em' }} />
            </IconButton>
        </Box>
    );
};

const CarouselSection = ({ images, currentIndex, onIndexChange, title, textColor }: CarouselProps) => (
    <Box
        sx={{
            height: `calc(100vh + min(25vh, 25vw))`,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            scrollSnapAlign: 'start',
            color: textColor,
            justifyContent: 'start',
            paddingTop: '5em'
        }}
    >
        <Typography variant="h3" sx={{ color: textColor, fontFamily: 'inherit', paddingBottom: '0.5em' }}>
            {title}
        </Typography>
        <Box
            sx={{
                height: '60vh',
                aspectRatio: '3593/2090',
                position: 'relative',
                boxShadow: '10px 0 10px -4px gray, -10px 0 10px -4px gray',
                cursor: 'pointer',
            }}
        >
            <Image
                src={images[currentIndex]}
                alt={`${title} image ${currentIndex + 1}`}
                style={{
                    objectFit: "cover",
                    zIndex: 100,
                    marginBottom: '2em',
                }}
                fill={true}
                priority={currentIndex === 0}
            />
            <ProgressBar key={currentIndex} />
        </Box>
        <ImageCarousel
            images={images}
            currentIndex={currentIndex}
            onIndexChange={onIndexChange}
        />
    </Box>
);

export default function Designs() {
    const router = useRouter();
    const [scrollPosition, setScrollPosition] = useState(0);
    const [activeIframes, setActiveIframes] = useState([false, false, false]);
    const sections = 5;
    const [currentPortalImage, setCurrentPortalImage] = useState(0);
    const [currentUAImage, setCurrentUAImage] = useState(0);

    const handleScroll = useCallback(() => {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const position = Math.min(scrollTop / windowHeight, sections);
        setScrollPosition(position);
    }, [sections]);

    const handleTextClick = useCallback((index: number) => {
        setActiveIframes(prev => {
            const updated = [...prev];
            updated[index] = true;
            return updated;
        });
    }, []);

    const getBackgroundColor = useCallback(() => {
        const sectionHeight = 1;
        const gapHeight = 0.25;
        const totalHeight = sectionHeight + gapHeight;
        const sectionIndex = Math.floor(scrollPosition / totalHeight);
        const positionInSection = (scrollPosition % totalHeight) / sectionHeight;
        const adjustedTransition = Math.max(0, Math.min(positionInSection, 1));
        const isEvenSection = sectionIndex % 2 === 0;
        const colorValue = isEvenSection
            ? Math.round(adjustedTransition * 255)
            : Math.round((1 - adjustedTransition) * 255);
        return `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
    }, [scrollPosition]);

    const getTextColor = useCallback(() => {
        const sectionHeight = 1.25;
        const sectionIndex = Math.floor(scrollPosition / sectionHeight);
        const transition = (scrollPosition / sectionHeight) - sectionIndex;
        const isEvenSection = sectionIndex % 2 === 0;
        const adjustedTransition = Math.max(0, Math.min((transition - 0.2) * 1.25, 1));
        const colorValue = isEvenSection
            ? Math.round((1 - adjustedTransition) * 255)
            : Math.round(adjustedTransition * 255);
        return `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
    }, [scrollPosition]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPortalImage(prev => (prev + 1) % HELIKA_PORTAL_IMAGES.length);
            setCurrentUAImage(prev => (prev + 1) % HELIKA_UA_IMAGES.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const bgColor = useMemo(() => getBackgroundColor(), [getBackgroundColor]);
    const textColor = useMemo(() => getTextColor(), [getTextColor]);

    const designNames = [
        'Sunbow',
        "RoyaltiesFi",
        "CoinFX",
    ]

    return (
        <>
            <Box
                sx={{
                    height: 'fit-content',
                    width: '100vw',
                    background: bgColor,
                    color: textColor,
                    display: 'flex',
                    flexDirection: 'column',
                    scrollSnapType: 'y mandatory',
                    overflowY: 'scroll',
                }}
            >
                <Link href="/">
                    <Box
                        sx={{
                            position: 'fixed',
                            top: '16px',
                            left: '16px',
                            zIndex: 999,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <HomeButton onClick={() => router.push("/")} textColor={textColor} bgColor={bgColor} />
                    </Box>
                </Link>

                <CarouselSection
                    images={HELIKA_PORTAL_IMAGES}
                    currentIndex={currentPortalImage}
                    onIndexChange={setCurrentPortalImage}
                    title="Helika Portal"
                    textColor={textColor}
                />

                <CarouselSection
                    images={HELIKA_UA_IMAGES}
                    currentIndex={currentUAImage}
                    onIndexChange={setCurrentUAImage}
                    title="Helika UA"
                    textColor={textColor}
                />

                {[...Array(sections - 2)].map((_, index) => (
                    <Box
                        key={index}
                        sx={{
                            height: `calc(100vh + ${index === sections - 3 ? '0' : 'min(25vh, 25vw)'})`,
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            scrollSnapAlign: 'start',
                            color: textColor,
                        }}
                    >
                        <Box
                            sx={{
                                height: '100vh',
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '1em',
                            }}
                        >
                            {activeIframes[index] ? (
                                <iframe
                                    src={figmaDesigns[index]}
                                    style={{
                                        width: '90%',
                                        height: '90%',
                                        border: 'none',
                                    }}
                                />
                            ) : (
                                <Box
                                    sx={{
                                        cursor: 'pointer',
                                        textDecoration: 'underline',
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5em',
                                    }}
                                    onClick={() => handleTextClick(index)}
                                >
                                    <Image
                                        src={figmaImages[index]}
                                        alt={`Project ${designNames[index]}`}
                                        style={{
                                            width: '50%',
                                            height: 'auto',
                                            objectFit: 'contain',
                                        }}
                                        loading="lazy"
                                    />
                                    View {designNames[index]} Design
                                </Box>
                            )}
                        </Box>
                    </Box>
                ))}
            </Box>
            <Footer />
        </>
    );
}
