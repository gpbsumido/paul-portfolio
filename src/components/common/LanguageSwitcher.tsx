"use client";

import { Button, Menu, MenuItem, Box } from '@mui/material';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageSelect = (lang: 'en' | 'es' | 'fr') => {
        setLanguage(lang);
        handleClose();
    };

    const languageNames = {
        en: 'English',
        es: 'Español',
        fr: 'Français'
    };

    return (
        <Box>
            <Button
                onClick={handleClick}
                sx={{
                    color: 'white',
                    backgroundColor: 'black',
                    borderColor: 'white',
                    '&:hover': {
                        backgroundColor: 'black',
                        borderColor: 'white',
                    },
                    backdropFilter: 'blur(4px)',
                    minWidth: '48px',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    padding: '0',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 0,
                }}
                variant="outlined"
            >
                {language.toUpperCase()}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    sx: {
                        backgroundColor: 'black',
                        backdropFilter: 'blur(4px)',
                        color: 'white',
                        '& .MuiMenuItem-root': {
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={() => handleLanguageSelect('en')} selected={language === 'en'}>
                    {languageNames.en}
                </MenuItem>
                <MenuItem onClick={() => handleLanguageSelect('es')} selected={language === 'es'}>
                    {languageNames.es}
                </MenuItem>
                <MenuItem onClick={() => handleLanguageSelect('fr')} selected={language === 'fr'}>
                    {languageNames.fr}
                </MenuItem>
            </Menu>
        </Box>
    );
} 