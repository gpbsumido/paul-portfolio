'use client';

import { Box } from '@mui/material';
import React from 'react';
import Image from 'next/image';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import MailIcon from '@mui/icons-material/Mail';
import PaulImg from '../assets/paul.jpeg';
import '../app/globals.css';

const SocialLink = ({
  href,
  icon: Icon,
  text,
}: {
  href: string;
  icon: React.ElementType;
  text: string;
}) => (
  <a
    href={href}
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
    <Icon />
    {text}
  </a>
);

export default function AboutSection() {
  const [clicked, setClicked] = React.useState(false);

  const socialLinks = [
    {
      href: 'https://www.linkedin.com/in/paulsumido/',
      icon: LinkedInIcon,
      text: '@paulsumido',
    },
    {
      href: 'https://github.com/gpbsumido',
      icon: GitHubIcon,
      text: '@gpbsumido',
    },
    {
      href: 'mailto:psumido@gmail.com',
      icon: MailIcon,
      text: 'psumido@gmail.com',
    },
  ];

  return (
    <Box
      sx={{
        width: { xs: '100%', md: '50vw' },
        height: { xs: '50vh', md: '100%' },
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
        fontSize: { xs: '1.5rem', md: '2rem' },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          height: { xs: '10em', md: '20em' },
          aspectRatio: '9/13',
        }}
      >
        <Image
          src={PaulImg}
          fill
          alt="Picture of the author"
          style={{
            objectFit: 'cover',
            zIndex: 100,
            marginBottom: '2em',
          }}
        />
      </Box>
      <div
        className={`about-text ${clicked ? 'clicked' : ''}`}
        onClick={() => setClicked(true)}
      >
        About Paul
      </div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.2em',
          marginTop: '0.5em',
        }}
      >
        {socialLinks.map((link, index) => (
          <SocialLink
            key={index}
            href={link.href}
            icon={link.icon}
            text={link.text}
          />
        ))}
      </Box>
    </Box>
  );
}
