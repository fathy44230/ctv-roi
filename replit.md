# Overview

This is a marketing waste calculator application designed for legal practices to analyze the efficiency difference between Meta (Facebook) advertising campaigns and Connected TV (CTV) campaigns. The tool helps law firms identify budget waste by comparing campaign metrics like cost per quality case, conversion rates, and ROI across different advertising platforms.

The application allows users to input campaign data for both Meta and CTV platforms, performs automated waste calculations, and provides detailed recommendations for budget optimization. It includes export functionality for sharing analysis results and aims to help legal practices make data-driven decisions about their advertising spend allocation.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built using **React with TypeScript** and follows a modern component-based architecture:

- **Component Library**: Utilizes shadcn/ui components built on top of Radix UI primitives for consistent, accessible UI elements
- **Styling**: Implements Tailwind CSS with a custom design system featuring CSS variables for theming
- **State Management**: Uses React hooks for local state and TanStack Query for server state management and caching
- **Routing**: Implements client-side routing with Wouter library for a lightweight routing solution
- **Forms & Validation**: Leverages React Hook Form with Zod schema validation for type-safe form handling

## Backend Architecture

The backend follows a **Node.js Express** architecture with TypeScript:

- **API Structure**: RESTful API design with centralized route registration
- **Data Layer**: Uses Drizzle ORM with PostgreSQL for database operations, configured for both development and production environments
- **Storage Abstraction**: Implements an interface-based storage pattern with in-memory storage for development and database storage for production
- **Middleware**: Custom logging middleware for API request tracking and error handling

## Database Design

The application uses **PostgreSQL** with Drizzle ORM for type-safe database operations:

- **Schema Structure**: Two main tables - campaigns for storing advertising campaign data and waste_analyses for storing comparison results
- **Data Types**: Supports both Meta (clicks-based) and CTV (brand searches-based) campaign metrics
- **Relationships**: Foreign key relationships between waste analyses and their corresponding campaigns

## Development Workflow

The project uses a **full-stack development setup**:

- **Build System**: Vite for frontend bundling with hot module replacement in development
- **TypeScript Configuration**: Shared TypeScript configuration across client, server, and shared modules
- **Path Aliases**: Configured path mapping for clean imports across the application
- **Development Server**: Integrated development environment with automatic reloading and error overlays

## External Dependencies

- **@neondatabase/serverless**: PostgreSQL database driver optimized for serverless environments
- **Radix UI**: Component primitives for building accessible UI components
- **TanStack Query**: Server state management and data fetching library
- **Drizzle ORM**: Type-safe database toolkit and query builder
- **Zod**: TypeScript-first schema validation library
- **React Hook Form**: Performance-focused forms library with minimal re-renders
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Lucide React**: Icon library providing consistent iconography