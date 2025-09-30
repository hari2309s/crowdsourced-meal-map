# 🌍 Crowdsourced Meal Map

> An open-source platform mapping food distribution centers with crowdsourced data.

## 📖 About

Meal Map is a community-driven platform that helps people find free meal resources in their area. By connecting food banks, soup kitchens, community fridges, and other food distribution centers, we're working to eliminate food insecurity one location at a time

## ✨ Features

### Current Features

- 🗺️ **Interactive Map**: Browse food centers with detailed location information
- 📱 **Responsive Design**: Seamless experience across desktop, tablet, and mobile
- 🌐 **Internationalization**: Multi-language support for global accessibility
- ⚡ **Real-time Data**: Up-to-date information on food center availability
- 🔍 **Search & Filter**: Find specific types of food assistance near you

### 🚧 Coming Soon

- 👥 **Community Contributions**: Allow users to add new food centers
- 🤖 **AI-Powered Verification**: Automated credibility checking for new submissions
- 🔍 **Semantic Search**: Natural language queries powered by Pinecone vector search
- 📊 **Advanced Analytics**: Insights into food security patterns and needs
- 🌍 **GIS Integration**: Enhanced geographical intelligence and mapping

## 🏗️ Architecture

- [View System Architecture Diagram](docs/system-architecture.md)

This project uses a modern monorepo structure with Turbo for optimal development workflow:

```
crowdsourced-meal-map/
├── apps/
│   ├── web/           # Next.js frontend application
│   └── api/           # Express.js backend API
├── packages/
│   ├── database/      # Supabase client and queries
│   ├── shared/        # Shared types, constants, utilities
│   ├── i18n/          # Internationalization utilities
│   ├── ui/            # Shared UI components
│   ├── eslint-config/ # Shared ESLint configuration
│   └── typescript-config/ # Shared TypeScript configuration
└── ...
```

## 🛠️ Tech Stack

### Frontend

- **Next.js** (React 19) - Full-stack React framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Components** - Modern component architecture

### Backend

- **Express.js** - Fast, unopinionated web framework
- **Supabase** - Open-source Firebase alternative
- **PostgreSQL** - Reliable relational database

### Development Tools

- **Turbo** - High-performance build system for monorepos
- **ESLint** - Code linting and quality assurance
- **Prettier** - Code formatting
- **pnpm** - Fast, disk space efficient package manager

### Future AI Integration

- **Pinecone** - Vector database for semantic search
- **AI Models** - For content moderation and verification
- **GIS Libraries** - Enhanced geospatial capabilities

## 🚀 How to Use

Visit [Crowdsourced Meal Map](https://github.com/hari2309s/crowdsourced-meal-map) to explore food centers in your area! The platform is designed to be intuitive and user-friendly - simply browse the interactive map to find nearby food assistance resources.

## 🙏 Acknowledgments

- **Open Source Community** for the amazing tools and libraries

---
