"use client";

import { Box } from "@mui/material";
import React, { useState } from "react";
import Image from "next/image";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import MailIcon from '@mui/icons-material/Mail';
import PaulImg from '../assets/paul.jpeg';
import '../app/globals.css'; // Import global CSS for styles

export default function AboutSection() {
    const [clicked, setClicked] = useState(false);

    const handleTextClick = () => {
        setClicked(true);
    };

    return (
        <Box
            sx={{
                width: { xs: '100%', md: '50vw' }, // Full width on small screens
                height: { xs: '50vh', md: '100%' }, // Half height on small screens
                background: 'white',
                color: 'black',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'all 0.6s ease',
                '&:hover': {
                    background: 'black',
                    color: 'white',
                },
                fontSize: { xs: '1.5rem', md: '2rem' }, // Adjust font size based on screen width
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    height: { xs: '10em', md: '20em' }, // Adjust height based on screen width
                    aspectRatio: '9/13',
                }}
            >
                <Image
                    src={PaulImg}
                    fill={true}
                    alt="Picture of the author"
                    style={{
                        objectFit: "cover",
                        zIndex: 100,
                        marginBottom: '2em',
                    }}
                />
            </Box>
            <div
                className={`about-text ${clicked ? "clicked" : ""}`}
                onClick={handleTextClick}
            >
                About Paul
            </div>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: '0.2em',
                    marginTop: '0.5em',
                }}
            >
                <a
                    href="https://www.linkedin.com/in/paulsumido/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        fontSize: '1rem',
                        gap: '0.5em',
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'font-weight 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.fontWeight = 'bold')}
                    onMouseLeave={(e) => (e.currentTarget.style.fontWeight = 'normal')}
                >
                    <LinkedInIcon />
                    @paulsumido
                </a>
                <a
                    href="https://github.com/gpbsumido"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        fontSize: '1rem',
                        gap: '0.5em',
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'font-weight 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.fontWeight = 'bold')}
                    onMouseLeave={(e) => (e.currentTarget.style.fontWeight = 'normal')}
                >
                    <GitHubIcon />
                    @gpbsumido
                </a>
                <a
                    href="mailto:psumido@gmail.com"
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        fontSize: '1rem',
                        gap: '0.5em',
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'font-weight 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.fontWeight = 'bold')}
                    onMouseLeave={(e) => (e.currentTarget.style.fontWeight = 'normal')}
                >
                    <MailIcon />
                    psumido@gmail.com
                </a>
            </Box>
        </Box>
    );
}
