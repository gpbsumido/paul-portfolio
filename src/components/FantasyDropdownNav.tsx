'use client';

import { useState } from 'react';
import { Box, Button, Menu, MenuItem, Typography, Portal } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useLanguage } from '@/contexts/LanguageContext';

const subpages = [
    {
        key: 'nbaStats',
        href: '/fantasy-bball/nba-stats',
    },
    {
        key: 'league',
        href: '/fantasy-bball/league',
    },
    {
        key: 'history',
        href: '/fantasy-bball/history/2024',
    },
    {
        key: 'matchups',
        href: '/fantasy-bball/matchups',
    }
];

export default function FantasyDropdownNav() {
    const { t } = useLanguage();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const pathname = usePathname();
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const currentPage = subpages.find(page => pathname === page.href)?.key || 'title';

    return (
        <Box>
            <Button
                variant="contained"
                startIcon={<SportsBasketballIcon />}
                endIcon={<KeyboardArrowDownIcon />}
                onClick={handleClick}
                sx={{
                    backgroundColor: 'primary.main',
                    '&:hover': {
                        backgroundColor: 'primary.dark',
                    },
                }}
            >
                {t(`pages.fantasy.${currentPage === 'title' ? 'title' : `subpages.${currentPage}`}`)}
            </Button>
            {open && (
                <Portal>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        disableScrollLock
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        sx={{
                            '& .MuiPaper-root': {
                                position: 'fixed',
                                mt: 1,
                            }
                        }}
                    >
                        {subpages.map((page) => (
                            <MenuItem
                                key={page.href}
                                component={Link}
                                href={page.href}
                                onClick={handleClose}
                                selected={pathname === page.href}
                                sx={{
                                    minWidth: 200,
                                    '&.Mui-selected': {
                                        backgroundColor: 'primary.light',
                                        '&:hover': {
                                            backgroundColor: 'primary.light',
                                        },
                                    },
                                }}
                            >
                                <Typography variant="body1">
                                    {t(`pages.fantasy.subpages.${page.key}`)}
                                </Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Portal>
            )}
        </Box>
    );
} 