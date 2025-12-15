# Graphlynk

## Overview
Graphlynk is a professional SEO and knowledge graph platform designed to enhance online presence through link profiles, blog publishing with newsletters, and search ranking analytics. It integrates SEO optimization with schema markup to offer a comprehensive solution for content creators and marketers to build and monitor their digital authority. The platform aims to provide a robust suite of tools for managing an entity's online identity, tracking performance, and leveraging AI for strategic insights.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Technology Stack
**Frontend:**
- Framework: React with TypeScript (Vite build tool)
- Routing: Wouter
- UI Components: Shadcn UI (built on Radix UI primitives)
- Styling: Tailwind CSS (New York variant)
- State Management: TanStack Query (React Query)
- Form Handling: React Hook Form with Zod validation

**Backend:**
- Runtime: Node.js with Express.js
- Language: TypeScript (ESNext modules)
- Database ORM: Drizzle ORM for PostgreSQL
- Database Provider: Neon serverless PostgreSQL
- Session Management: Cookie-based authentication with JWT
- Email Service: SendGrid

**Authentication Strategy:**
- Passwordless magic link authentication via email.
- JWT tokens stored in HTTP-only cookies.
- Middleware for authenticated endpoint protection.
- Demo login for instant access to premium features (demo@graphauthority.com with AUTHORITY plan).

### Data Model
The relational database schema includes:
- **Users**: User accounts, plan tiers, and profile metadata.
- **Profiles**: Public user profiles with customizable content and schema.org markup.
- **Links**: Ordered, labeled external links with schema markup.
- **Posts**: Blog content with HTML, slug-based routing, and user association.
- **Subscribers**: Email subscriber lists for newsletters.
- **Magic Codes**: Temporary authentication codes.
- **Entities**: Core knowledge graph entities (Person, Organization, Product, Event, Creative Work, Place) with status, visibility, schema.org markup, social profiles, and canonical URLs. Supports claiming via Wikipedia, MusicBrainz, and Wikidata.
- **Entity Sources**: Verified references for entity claims.
- **Entity Relationships**: Graph connections between entities.
- **Entity Verifications**: Identity verification via OAuth and domain ownership.
- **Entity Duplicates**: Duplicate detection and merging.
- **Entity Scores**: Notability and authority scoring.
- **Entity Revisions**: Complete edit history and audit trails.
- **User OAuth Accounts**: OAuth connections for identity verification.

### API Design
A RESTful API structured by domain:
- **Authentication**: `/api/auth/*` (request code, verify code, demo login, logout).
- **User**: `/api/user/*` (retrieve current user).
- **Profile**: `/api/profile/*` (fetch, create, update, public access by username).
- **Blog**: `/api/blog/*` (list, create, update, delete posts).
- **Mailing**: `/api/mailing/*` (subscribe, list subscribers).
- **Search**: `/api/search` (Google Custom Search Engine integration).
- **YouTube**: `/api/youtube/*` (free and PRO/AUTHORITY tier search, export).

### Frontend Architecture
- **Page Structure**: Landing page, authentication flow, dashboard, profile builder, blog management, subscriber lists, search ranking, YouTube video search, API documentation, public profile pages (`/u/:username`).
- **Design System**: Inter and JetBrains Mono typography, HSL-based theming, responsive grid system, card-based layouts.
- **State Management**: React Query for server state (caching, invalidation), React Hook Form for form state with Zod validation. Optimistic updates for UX.

### Build and Deployment
- **Development**: Vite dev server (frontend HMR), `tsx-node` (backend hot-reloading).
- **Production**: Vite builds optimized React bundle, `esbuild` bundles Express server. Single Node.js process.
- **Environment Configuration**: `DATABASE_URL`, `JWT_SECRET`, `GOOGLE_CSE_ID`, `GOOGLE_CSE_KEY`, `SENDGRID_API_KEY`, `EMAIL_FROM`, `YOUTUBE_API_KEY`.

## External Dependencies

- **Database Service**: Neon PostgreSQL (serverless), Drizzle ORM (type-safe access).
- **Email Service**: SendGrid (transactional emails, newsletters).
- **Search Integration**: Google Custom Search Engine API (rank tracking).
- **YouTube Data API v3**: Video search, statistics, channel info, and engagement metrics (free and PRO/AUTHORITY tiers).
- **AI Integration**: OpenAI GPT-5 (via Replit AI Integrations) for AI Assistant, AI Insights, Content Optimizer, Entity Extractor, and Smart Analytics.
- **UI Components**: Radix UI, Shadcn UI, Lucide React (icons).
- **Object Storage**: Replit Object Storage (for media uploads).