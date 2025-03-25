'use client'

import AboutSection from "@/components/AboutSection";
import { Box } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' }, // Vertical on small screens
      }}
    >
      <AboutSection />
      <Box
        sx={{
          width: { xs: '100vw', md: '50vw' }, // Full width on small screens
          height: { xs: '50vh', md: '100%' }, // Half height on small screens
          background: 'white',
          color: 'black',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'background 0.6s ease',
          '&:hover': {
            background: 'black',
            color: 'white',
          },
          fontSize: '2rem',
        }}
      >
        <Link
          href="/designs"
          style={{ fontWeight: 'normal', transition: 'font-weight 0.6s ease' }}
          onMouseEnter={(e) => e.currentTarget.style.fontWeight = 'bold'}
          onMouseLeave={(e) => e.currentTarget.style.fontWeight = 'normal'}
        >
          Designs
        </Link>
      </Box>
    </Box>
  );
}
