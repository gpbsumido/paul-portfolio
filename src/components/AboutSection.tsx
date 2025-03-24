"use client";

import { Box } from "@mui/material";
import React, { useState } from "react";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import MailIcon from '@mui/icons-material/Mail';

export default function AboutSection() {
    const [clicked, setClicked] = useState(false);

    const handleTextClick = () => {
        setClicked(true);
    };

    return (
        <Box
            sx={{
                width: '50vw',
                height: '100%',
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
                fontSize: '2rem',
            }}
        >
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
                        gap: '0.5em'
                    }}
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
                        gap: '0.5em'
                    }}
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
                        gap: '0.5em'
                    }}
                >
                    <MailIcon />
                    psumido@gmail.com
                </a>
            </Box>
        </Box>
    );
}
