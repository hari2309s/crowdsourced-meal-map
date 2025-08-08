# 🌍 Crowdsourced Meal Map

> An open-source platform mapping food distribution centers with crowdsourced data, enhanced by AI to support UN SDG 2 (Zero Hunger). It promotes global food security.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)

## 📖 About

Crowdsourced Meal Map is a community-driven platform that helps people find free meal resources in their area. By connecting food banks, soup kitchens, community fridges, and other food distribution centers, we're working to eliminate food insecurity one location at a time.

### 🎯 Mission

Supporting **UN Sustainable Development Goal 2 (Zero Hunger)** by democratizing access to food security information through technology and community collaboration.

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

## 🤝 Contributing

We welcome community contributions! The most valuable way you can help is by **adding food centers** to our platform. Your local knowledge makes all the difference in building a comprehensive resource.

### 🍽️ Add Food Centers

**Know of a food bank, soup kitchen, or community fridge in your area?**

We're actively looking for community members to help us map food resources globally. Your contributions directly support people in need by making food assistance more discoverable.

**What we need:**

- Food banks and pantries
- Soup kitchens and community meals
- Community fridges and little free pantries
- Mobile food distribution programs
- Religious organizations offering meals
- Community centers with food programs

**How to contribute food center data:**
Once the contribution feature is live, you'll be able to add locations directly through the platform. Until then, feel free to open an issue with food center details you'd like to see added!

### 🐛 Report Issues

Found a problem or have suggestions? Please open an issue to help us improve the platform.

### 📍 Local Area Experts Wanted

We're especially looking for contributors who can help us accurately map food resources in their communities. Your local expertise is invaluable!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **UN Sustainable Development Goals** for inspiration and guidance
- **Open Source Community** for the amazing tools and libraries
- **Food Security Organizations** worldwide for their continued efforts
- **Contributors** who help make this project possible

---

<div align="center">
  <strong>Together, we can end hunger. One location at a time. 🌍</strong>
</div>
