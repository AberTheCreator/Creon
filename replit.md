# Creon - Creator Economy Platform

## Overview

Creon is a modern Web3-enabled creator economy platform built as a mobile-first application. It combines traditional web technologies with blockchain functionality to create a comprehensive ecosystem for creators to monetize their work, receive tips, and access grant opportunities. The platform features NFT showcase capabilities, token-gated content, and integrated wallet support for both Ethereum (MetaMask) and Solana (Phantom) ecosystems.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Mobile-First Design**: Responsive design optimized for mobile devices with a maximum width container

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API with structured endpoints
- **Error Handling**: Centralized error handling middleware
- **Request Logging**: Custom middleware for API request logging

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Storage Interface**: Abstract storage interface with DatabaseStorage implementation for production
- **Relations**: Comprehensive table relations for user management, NFTs, grants, tips, and content

## Key Components

### Authentication & Wallet Integration
- Supports MetaMask (Ethereum) and Phantom (Solana) wallet connections
- Mock wallet addresses for development and testing
- Wallet-based user authentication and profile management

### User Management System
- User profiles with verification status
- Bio, title, and avatar support
- Wallet address association for Web3 functionality

### NFT & Digital Asset Management
- NFT collection showcase and management
- Support for both Ethereum and Solana NFTs
- Metadata storage with JSONB fields for flexibility

### Creator Economy Features
- **Tipping System**: Peer-to-peer cryptocurrency tips
- **Grant Discovery**: Application system for creator grants
- **Token-Gated Content**: Premium content access based on token/NFT ownership
- **Earnings Dashboard**: Comprehensive analytics and revenue tracking

### Content & Marketplace
- Template marketplace for design assets
- Content creation tools and workflows
- Rating and download tracking system

## Data Flow

1. **User Onboarding**: Users connect their Web3 wallet (MetaMask/Phantom)
2. **Profile Creation**: User data is stored with wallet association
3. **Content Creation**: Creators upload templates, NFTs, or other digital assets
4. **Monetization**: Users can receive tips, apply for grants, or sell content
5. **Token Gating**: Premium content access is verified through blockchain queries
6. **Analytics**: User stats and earnings are tracked and displayed

## External Dependencies

### Web3 Integration
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **Wallet Libraries**: MetaMask and Phantom wallet integration (simulated in MVP)
- **Blockchain Interaction**: Mock implementations for token balance and NFT ownership verification

### UI & Styling
- **Radix UI**: Comprehensive component primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe CSS class composition

### Development Tools
- **TypeScript**: Static type checking across the entire stack
- **ESBuild**: Fast JavaScript bundler for production builds
- **TSX**: TypeScript execution for development

## Deployment Strategy

### Development Environment
- Vite dev server with HMR for frontend development
- TSX for running TypeScript server files directly
- In-memory storage for rapid prototyping and testing

### Production Build Process
1. **Frontend**: Vite builds optimized static assets to `dist/public`
2. **Backend**: ESBuild bundles server code to `dist/index.js`
3. **Database**: Drizzle migrations applied via `db:push` command

### Environment Configuration
- Database URL configuration via environment variables
- Production/development environment detection
- Replit-specific development tools and banners

