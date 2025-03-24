'use client'

import { Box } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Updated import
import { useEffect, useState } from "react";

export default function Designs() {
    const router = useRouter(); // Updated usage
    const [scrollPosition, setScrollPosition] = useState(0);
    const [activeIframes, setActiveIframes] = useState([false, false, false]); // Track iframe visibility
    const sections = 3; // Number of sections (scalable)
    const iframeLinks = [
        "https://embed.figma.com/design/CSlimnvD8zLPOzzF7d97Hu/Sunbow?node-id=0-1&embed-host=share",
        "https://embed.figma.com/design/sQzKGPpOZpdgvwCGxlSEkQ/RoyaltiesFi-Wireframes?embed-host=share",
        "https://embed.figma.com/design/qeHrTLQ05l2BzksQHJBv3o/CoinFX-Entity-Application?embed-host=share",
    ]; // Array of iframe links

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

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const getBackgroundColor = () => {
        const sectionHeight = 1.25; // Each section is 1.25 times the viewport height (100vh content + 25vh/25vw gap)
        const sectionIndex = Math.floor(scrollPosition / sectionHeight); // Current section index
        const transition = (scrollPosition / sectionHeight) - sectionIndex; // Transition progress within the section
        const isEvenSection = sectionIndex % 2 === 0;

        // Adjust transition to occur only during the content area (100vh of the section)
        const adjustedTransition = Math.max(0, Math.min((transition - 0.2) * 1.25, 1));

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

    return (
        <Box
            sx={{
                height: `calc(${sections * 125}vh - 25vh)`, // Total height adjusted for gaps
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
                            borderRadius: "50px",
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
                                color: getBackgroundColor(), // Ensure icon contrasts the background
                            }}
                        >
                            home
                        </span>
                    </button>
                </Box>
            </Link>
            {[...Array(sections)].map((_, index) => (
                <Box
                    key={index}
                    sx={{
                        height: `calc(100vh + ${index === sections - 1 ? '0' : 'min(25vh, 25vw)'})`, // Remove gap for the last section
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
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {activeIframes[index] ? (
                            <iframe
                                src={iframeLinks[index]}
                                style={{
                                    width: '90%',
                                    height: '90%',
                                    border: 'none',
                                }}
                            />
                        ) : (
                            <span
                                style={{
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    fontSize: '1.5rem', // Larger font size
                                    fontWeight: 'bold', // Bold text
                                }}
                                onClick={() => handleTextClick(index)}
                            >
                                View {designNames[index]} Design
                            </span>
                        )}
                    </Box>
                    {index !== sections - 1 && (
                        <Box
                            sx={{
                                height: 'min(25vh, 25vw)', // Gap area
                                width: '100%',
                            }}
                        />
                    )}
                </Box>
            ))}
        </Box>
    );
}
