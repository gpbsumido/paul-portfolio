'use client'

import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Updated import
import { useEffect, useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import Footer from "../../components/Footer"; // Import Footer component
import Image from "next/image";

import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { figmaDesigns, figmaImages, HELIKA_PORTAL_IMAGES, HELIKA_UA_IMAGES } from "@/constants/constants";

export default function Designs() {
    const router = useRouter(); // Updated usage
    const [scrollPosition, setScrollPosition] = useState(0);
    const [activeIframes, setActiveIframes] = useState([false, false, false]); // Track iframe visibility
    const sections = 5; // Number of sections (scalable)
    const [currentPortalImage, setCurrentPortalImage] = useState(0);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [currentUAImage, setCurrentUAImage] = useState(0);
    const [carouselUAIndex, setCarouselUAIndex] = useState(0);


    const designNames = [
        'Sunbow',
        "RoyaltiesFi",
        "CoinFX",
    ]

    const handleScroll = () => {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const position = Math.min(scrollTop / windowHeight, sections); // Normalize scroll position (0 to sections)
        setScrollPosition(position);
    };

    const handleTextClick = (index: number) => {
        const updatedIframes = [...activeIframes];
        updatedIframes[index] = true; // Show iframe for the clicked section
        setActiveIframes(updatedIframes);
    };

    const getBackgroundColor = () => {
        const sectionHeight = 1; // Each section is 1 times the viewport height (100vh content)
        const gapHeight = 0.25; // Gap of 0.25vh where the color should not change
        const totalHeight = sectionHeight + gapHeight; // Total height of a section including the gap
        const sectionIndex = Math.floor(scrollPosition / totalHeight); // Current section index
        const positionInSection = (scrollPosition % totalHeight) / sectionHeight; // Position within the section

        // Only change color within the content area (100vh of the section)
        const adjustedTransition = Math.max(0, Math.min(positionInSection, 1));
        const isEvenSection = sectionIndex % 2 === 0;

        // Flip colors: even sections transition from black to white, odd sections from white to black
        const colorValue = isEvenSection
            ? Math.round(adjustedTransition * 255)
            : Math.round((1 - adjustedTransition) * 255);

        return `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
    };

    const getTextColor = () => {
        const sectionHeight = 1.25; // Each section is 1.25 times the viewport height
        const sectionIndex = Math.floor(scrollPosition / sectionHeight); // Current section index
        const transition = (scrollPosition / sectionHeight) - sectionIndex; // Transition progress within the section
        const isEvenSection = sectionIndex % 2 === 0;

        // Adjust transition to occur only during the content area (100vh of the section)
        const adjustedTransition = Math.max(0, Math.min((transition - 0.2) * 1.25, 1));

        // Flip text colors: even sections transition from white to black, odd sections from black to white
        const colorValue = isEvenSection
            ? Math.round((1 - adjustedTransition) * 255)
            : Math.round(adjustedTransition * 255);

        return `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPortalImage(prevState => (prevState + 1) % HELIKA_PORTAL_IMAGES.length); // Cycle through portal images
            setCurrentUAImage(prevState => (prevState + 1) % HELIKA_UA_IMAGES.length); // Cycle through ua images
        }, 5000); // Switch every 15 seconds

        return () => clearInterval(interval); // Cleanup on component unmount
    }, [currentPortalImage, currentUAImage]);

    return (
        <>
            <Box
                sx={{
                    height: 'fit-content',
                    width: '100vw',
                    background: getBackgroundColor(),
                    color: getTextColor(),
                    display: 'flex',
                    flexDirection: 'column',
                    scrollSnapType: 'y mandatory',
                    overflowY: 'scroll',
                }}
            >
                {/* Floating button with glowing effect */}
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
                        <button
                            onClick={() => router.push("/")} // Updated router.push call
                            style={{
                                position: "absolute", // Make the button float
                                top: "20px",
                                left: "20px",
                                padding: "10px",
                                width: "50px", // Set width for a perfect circle
                                height: "50px", // Set height for a perfect circle
                                borderRadius: "50%", // Make it a perfect circle
                                border: "1px solid",
                                background: getTextColor(), // Always contrast the background
                                color: getBackgroundColor(), // Always contrast the background
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderColor: getBackgroundColor(), // Ensure border contrasts the background
                            }}
                        >
                            <span
                                className="material-symbols-outlined"
                                style={{
                                    fontSize: "24px",
                                    height: '24px',
                                    width: '24px',
                                    color: getBackgroundColor(), // Ensure icon contrasts the background
                                }}
                            >
                                <HomeIcon />
                            </span>
                        </button>
                    </Box>
                </Link>
                <Box
                    sx={{
                        height: '100vh',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        scrollSnapAlign: 'start',
                        color: getTextColor(),
                    }}
                >
                    <Box
                        sx={{
                            height: `calc(100vh + min(25vh, 25vw))`, // Remove gap for the last section
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            scrollSnapAlign: 'start',
                            color: getTextColor(),
                            justifyContent: 'center',
                        }}
                    >
                        <Typography variant="h3" sx={{ color: getTextColor(), fontFamily: 'inherit', paddingBottom: '0.5em' }}>
                            Helika Portal
                        </Typography>
                        <Box
                            sx={{
                                height: '60vh',
                                aspectRatio: '3593/2090',
                                position: 'relative',
                                boxShadow: '10px 0 10px -4px gray, -10px 0 10px -4px gray', // Box shadow only on left and right with equal strength
                                cursor: 'pointer', // Add pointer cursor to indicate clickability
                            }}
                        >
                            <Image
                                src={HELIKA_PORTAL_IMAGES[currentPortalImage]} // Default to the first image
                                alt="Picture of the author"
                                style={{
                                    objectFit: "cover",
                                    zIndex: 100,
                                    marginBottom: '2em',
                                }}
                                fill={true}
                                id='portal-display-image'
                            />
                            {/* Progress bar overlay */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '5px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Background for the progress bar
                                    zIndex: 200,
                                    overflow: 'hidden',
                                }}
                            >
                                <Box
                                    sx={{
                                        height: '100%',
                                        backgroundColor: 'white', // Progress bar color
                                        animation: 'fillProgress 5s linear infinite', // Smooth animation for 15 seconds
                                        width: '100%', // Full width
                                        zIndex: 201,
                                    }}
                                    key={currentPortalImage} // Reset animation on image change
                                />
                                <style jsx>{`
                                    @keyframes fillProgress {
                                        from {
                                            width: 0;
                                        }
                                        to {
                                            width: 100%;
                                        }
                                    }
                                `}</style>
                            </Box>
                        </Box>
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
                            <button
                                onClick={() => setCarouselIndex((prev) => Math.max(prev - 1, 0))}
                                style={{
                                    position: 'absolute',
                                    left: '0',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    zIndex: 10,
                                    background: 'rgba(0, 0, 0, 0.5)',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0.5em',
                                    borderRadius: '50%',
                                }}
                            >
                                <ArrowCircleLeftIcon sx={{ fontSize: '3em' }} />
                            </button>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: '1em',
                                    transform: `translateX(-${carouselIndex * 33.33}%)`,
                                    transition: 'transform 0.3s ease',
                                    width: `${HELIKA_PORTAL_IMAGES.length * 33.33}%`,
                                    paddingLeft: '1em'
                                }}
                            >
                                {HELIKA_PORTAL_IMAGES.map((image, idx) => (
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
                                            flex: '0 0 calc(33.33% - 1em)', // Ensure 3 items fit in the visible area
                                        }}
                                        onMouseEnter={() => {
                                            setCurrentPortalImage(idx)
                                        }} // Set current portal image on hover
                                    >
                                        <Image
                                            src={image} // Use the HELIKA_PORTAL_IMAGES for thumbnails
                                            alt={`Thumbnail ${idx + 1}`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Box>
                            <button
                                onClick={() =>
                                    setCarouselIndex((prev) =>
                                        Math.min(prev + 1, Math.max(0, HELIKA_PORTAL_IMAGES.length - 3))
                                    )
                                }
                                style={{
                                    position: 'absolute',
                                    right: '0',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    zIndex: 10,
                                    background: 'rgba(0, 0, 0, 0.5)',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0.5em',
                                    borderRadius: '50%',
                                }}
                            >
                                <ArrowCircleRightIcon sx={{ fontSize: '3em' }} />
                            </button>
                        </Box>
                    </Box>
                </Box>
                <Box
                    sx={{
                        height: `calc(100vh + min(25vh, 25vw))`,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        scrollSnapAlign: 'start',
                        color: getTextColor(),
                    }}
                >
                    <Box
                        sx={{
                            height: `calc(100vh + min(25vh, 25vw))`, // Remove gap for the last section
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            scrollSnapAlign: 'start',
                            color: getTextColor(),
                            justifyContent: 'center',
                        }}
                    >
                        <Typography variant="h3" sx={{ color: getTextColor(), fontFamily: 'inherit', paddingBottom: '0.5em' }}>
                            Helika UA
                        </Typography>
                        <Box
                            sx={{
                                height: '60vh',
                                aspectRatio: '3593/2090',
                                position: 'relative',
                                boxShadow: '10px 0 10px -4px gray, -10px 0 10px -4px gray', // Box shadow only on left and right with equal strength
                                cursor: 'pointer', // Add pointer cursor to indicate clickability
                            }}
                        >
                            <Image
                                src={HELIKA_UA_IMAGES[currentUAImage]} // Default to the first image
                                alt="Picture of the author"
                                style={{
                                    objectFit: "cover",
                                    zIndex: 100,
                                    marginBottom: '2em',
                                }}
                                fill={true}
                                id='ua-display-image'
                            />
                            {/* Progress bar overlay */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '5px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Background for the progress bar
                                    zIndex: 200,
                                    overflow: 'hidden',
                                }}
                            >
                                <Box
                                    sx={{
                                        height: '100%',
                                        backgroundColor: 'white', // Progress bar color
                                        animation: 'fillProgress 5s linear infinite', // Smooth animation for 15 seconds
                                        width: '100%', // Full width
                                        zIndex: 201,
                                    }}
                                    key={currentUAImage} // Reset animation on image change
                                />
                                <style jsx>{`
                                    @keyframes fillProgress {
                                        from {
                                            width: 0;
                                        }
                                        to {
                                            width: 100%;
                                        }
                                    }
                                `}</style>
                            </Box>
                        </Box>
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
                            <button
                                onClick={() => setCarouselUAIndex((prev) => Math.max(prev - 1, 0))}
                                style={{
                                    position: 'absolute',
                                    left: '0',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    zIndex: 10,
                                    background: 'rgba(0, 0, 0, 0.5)',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0.5em',
                                    borderRadius: '50%',
                                }}
                            >
                                <ArrowCircleLeftIcon sx={{ fontSize: '3em' }} />
                            </button>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: '1em',
                                    transform: `translateX(-${carouselUAIndex * 33.33}%)`,
                                    transition: 'transform 0.3s ease',
                                    width: `${HELIKA_UA_IMAGES.length * 33.33}%`,
                                    paddingLeft: '1em'
                                }}
                            >
                                {HELIKA_UA_IMAGES.map((image, idx) => (
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
                                            flex: '0 0 calc(33.33% - 1em)', // Ensure 3 items fit in the visible area
                                        }}
                                        onMouseEnter={() => {
                                            setCurrentUAImage(idx)
                                        }} // Set current ua image on hover
                                    >
                                        <Image
                                            src={image} // Use the HELIKA_UA_IMAGES for thumbnails
                                            alt={`Thumbnail ${idx + 1}`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Box>
                            <button
                                onClick={() =>
                                    setCarouselUAIndex((prev) =>
                                        Math.min(prev + 1, Math.max(0, HELIKA_UA_IMAGES.length - 3))
                                    )
                                }
                                style={{
                                    position: 'absolute',
                                    right: '0',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    zIndex: 10,
                                    background: 'rgba(0, 0, 0, 0.5)',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0.5em',
                                    borderRadius: '50%',
                                }}
                            >
                                <ArrowCircleRightIcon sx={{ fontSize: '3em' }} />
                            </button>
                        </Box>
                    </Box>
                </Box>
                {[...Array(sections - 2)].map((_, index) => (
                    <Box
                        key={index}
                        sx={{
                            height: `calc(100vh + ${index === sections - 3 ? '0' : 'min(25vh, 25vw)'})`, // Remove gap for the last section
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            scrollSnapAlign: 'start',
                            color: getTextColor(),
                        }}
                    >
                        <Box
                            sx={{
                                height: '100vh', // Actual content area
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
                                        fontSize: '1.5rem', // Larger font size
                                        fontWeight: 'bold', // Bold text
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center', // Center align items
                                        justifyContent: 'center', // Center justify items
                                        gap: '0.5em',
                                    }}
                                    onClick={() => handleTextClick(index)}
                                >
                                    <Image
                                        src={figmaImages[index]} // Add project image
                                        alt={`Project ${designNames[index]}`}
                                        style={{
                                            width: '50%',
                                            height: 'auto',
                                            objectFit: 'contain',
                                        }}
                                    />
                                    View {designNames[index]} Design
                                </Box>
                            )}
                        </Box>
                    </Box>
                ))}
            </Box >
            <Footer /> {/* Add Footer component */}
        </>
    );
}
