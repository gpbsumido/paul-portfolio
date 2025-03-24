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
        flexDirection: 'row',
      }}
    >
      <AboutSection />
      <Box
        sx={{
          width: '50vw',
          height: '100%',
          background: 'white',
          color: 'black',
          display: 'flex',
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
        <Link href="/designs"
          style={{
            paddingBottom: '1.5em'
          }}
        >Designs</Link>
      </Box>
    </Box>
  );
}
