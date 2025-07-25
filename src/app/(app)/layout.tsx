"use client";

import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";
import AuthContext from "@/contexts/AuthContext";

interface RootLayoutProps {
    children: React.ReactNode;
}

/**
 * RootLayout component - Main layout wrapper
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be rendered
 * @description The root layout component that wraps the entire application and provides the font configuration
 * @returns {JSX.Element} Root layout with font configuration
 */
export default function RootLayout({
    children,
}: RootLayoutProps): React.ReactElement {
    return (
        <Auth0Provider
            domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
            clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
            authorizationParams={{
                redirect_uri:
                    typeof window !== "undefined"
                        ? `${window.location.origin}/login`
                        : "",
                audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
            }}
            useRefreshTokens={true}
            cacheLocation="localstorage"
        >
            <AuthContext>{children}</AuthContext>
        </Auth0Provider>
    );
}
