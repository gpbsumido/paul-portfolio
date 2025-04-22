# Paul's Portfolio Website

A modern, feature-rich portfolio website built with Next.js, TypeScript, and Material-UI. This website showcases various projects and capabilities including interactive maps, email functionality, forums, and more.

## Project Structure

```
src/
├── app/                  # Next.js app directory (pages and routing)
│   ├── page.tsx          # Home page
│   ├── designs/          # Design showcase
│   ├── maps/              # Interactive map feature
│   ├── email/            # Contact Form prototype
│   ├── forum/            # Discussion forum prototype
│   ├── fantasy-bball/    # Fantasy Basketball Stats for personal league
│   ├── fantasy-f1/       # Fantasy F1 Stats as well as driver/constructor championship data
│   └── gallery/          # Image gallery prototype
│   ├── social-media/       # Curated Social Media timeline prototype
├── components/           # Reusable React components
│   ├── features/         # Feature-specific components
│   │   └── routes/       # Route management components
├── contexts/             # React context providers
├── lib/                  # Library configurations
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
├── constants/            # Constant values
├── styles/               # Global styles and themes
├── assets/               # Static assets

```

## Pages and Features

### Home Page (`/`)

- Main landing page
- Portfolio showcase
- Navigation to other sections

### Interactive Map (`/map`)

- MapLibre GL integration
- Features:
    - Current location tracking
    - Custom markers
    - Route planning with multiple transportation modes
    - Turn-by-turn directions
    - Distance and duration calculations

### Email Contact (`/email`)

- Contact form functionality
- Email sending capabilities

### Forum (`/forum`)

- Discussion platform
- User interactions
- Thread management

### Fantasy Basketball (`/fantasy-bball`)

- Fantasy basketball related features
- Stats and analytics

### Design Showcase (`/designs`)

- Portfolio of design work
- Visual projects

### Gallery (`/gallery`)

- Image gallery
- Photo showcase

## Libraries and Dependencies

### Core

- **Next.js**: React framework for production-grade applications
- **React**: JavaScript library for building user interfaces
- **TypeScript**: Static type-checking for JavaScript

### UI/Components

- **Material-UI (MUI)**: React UI framework implementing Material Design
    - Components: Buttons, Typography, Icons, etc.
    - Styling system
    - Theme customization

### Mapping

- **MapLibre GL**: Open-source library for custom maps
    - Vector tile rendering
    - Custom markers
    - Route visualization
    - Geolocation features

### Styling

- **CSS Modules**: Scoped styling solution
- **Emotion**: CSS-in-JS library used by MUI

### State Management

- **React Context**: Built-in state management
- **React Hooks**: State and lifecycle management

### Development Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **Jest**: Testing framework
- **React Testing Library**: React component testing

## Getting Started

1. Clone the repository
2. Install dependencies:
    ```bash
    npm install
    ```
3. Run the development server:
    ```bash
    npm run dev
    ```
4. Open [http://localhost:3009](http://localhost:3009) in your browser
