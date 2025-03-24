"use client";

import { Box } from "@mui/material";
import React, { useState } from "react";
import Image from "next/image";

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
            <div className={`logo-carousel ${clicked ? "visible" : ""}`}>
                <a
                    href="https://www.linkedin.com/in/paulsumido/"
                >
                    <Image
                        src="https://img.icons8.com/?size=100&id=xuvGCOXi8Wyg&format=png&color=000000"
                        alt="linkedIn"
                        width={30}
                        height={30}
                    />
                </a>
                <a href="/email">
                    <Image
                        src="https://img.icons8.com/?size=100&id=OumT4lIcOllS&format=png&color=000000"
                        alt="email"
                        width={30}
                        height={30}
                    />
                </a>
            </div>
        </Box>
    );
}
