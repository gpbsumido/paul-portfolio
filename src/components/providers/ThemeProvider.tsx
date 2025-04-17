"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return (
        <NextThemesProvider {...props}>
            <MuiThemeWrapper>{children}</MuiThemeWrapper>
        </NextThemesProvider>
    );
}

function MuiThemeWrapper({ children }: { children: React.ReactNode }) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const theme = createTheme({
        palette: {
            mode: resolvedTheme as "light" | "dark",
        },
    });

    if (!mounted) {
        return null;
    }

    return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}
