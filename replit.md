# Educational Portfolio Website

## Overview

This is a full-stack educational portfolio website designed with accessibility in mind for all age groups, from children to seniors. The application serves as a platform for sharing educational experiences, managing learning resources, and facilitating communication between educators and learners. Built with React, Express, and Drizzle ORM, it features a modern, user-friendly interface with comprehensive content management capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development patterns
- **Routing**: Wouter for lightweight client-side navigation
- **Styling**: Tailwind CSS with custom design system optimized for accessibility
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible interface elements
- **State Management**: TanStack React Query for server state management and caching
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules for modern JavaScript features
- **API Design**: RESTful API endpoints with comprehensive CRUD operations
- **File Upload**: Multer middleware for handling educational resource file uploads
- **Error Handling**: Centralized error handling with detailed logging
- **Development**: Hot module replacement and runtime error overlay integration

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema Design**: 
  - Users table for basic authentication
  - Blog posts table for educational experiences and articles
  - Learning resources table for file-based educational materials
- **Migrations**: Drizzle Kit for schema management and migrations

### Design System
- **Accessibility First**: Large fonts, high contrast colors, and intuitive navigation designed for all age groups
- **Color Palette**: Educational blue and warm orange with comprehensive light/dark mode support
- **Typography**: Inter and Poppins fonts for optimal readability
- **Component System**: Consistent spacing, hover effects, and responsive design patterns

### File Management
- **Upload System**: Local file storage with size limits (10MB) and type validation
- **Supported Formats**: Educational documents (PDF, Office), images, videos, and audio files
- **Organization**: Category-based organization (children's resources vs. senior resources)

### Content Management
- **Blog System**: Full CRUD operations for educational posts with tagging and categorization
- **Resource Management**: File upload, metadata management, and download tracking
- **Publishing Control**: Draft/published states for content review workflow

## External Dependencies

### Core Framework Dependencies
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight React router
- **react**: Core React library and DOM rendering

### UI and Styling
- **@radix-ui/***: Primitive UI components for accessibility
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Backend Infrastructure
- **express**: Web application framework
- **drizzle-orm**: Type-safe database ORM
- **@neondatabase/serverless**: PostgreSQL database adapter
- **multer**: File upload middleware

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **tsx**: TypeScript execution for Node.js

### Validation and Forms
- **zod**: Schema validation library
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation integration

### Additional Features
- **date-fns**: Date manipulation utilities
- **nanoid**: Unique ID generation
- **connect-pg-simple**: PostgreSQL session store

### Korean Language Support
The application includes comprehensive Korean language support for content, with UTF-8 encoding and appropriate font loading for international users.