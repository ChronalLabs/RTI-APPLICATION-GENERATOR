
# 🏛️ RTI-Gen — AI-Powered RTI Application Generator

<p align="center">
   <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License" />
   <img src="https://img.shields.io/badge/Node.js-18+-green.svg" alt="Node.js" />
   <img src="https://img.shields.io/badge/React-19-61DAFB.svg" alt="React" />
   <img src="https://img.shields.io/badge/MongoDB-6+-47A248.svg" alt="MongoDB" />
   <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen.svg" alt="PRs Welcome" />
   <img src="https://img.shields.io/badge/GSoC-2026-orange.svg" alt="GSoC 2026" />
</p>

<p align="center">
   <b>Empowering Citizens, One RTI at a Time</b><br>
   <i>Made with ❤️ for Google Summer of Code (GSoC) and the open-source community</i>
</p>

---

**RTI-Gen** is an open-source, AI-powered platform that helps Indian citizens generate legally compliant RTI (Right to Information) applications. It transforms plain-language requests into structured, ready-to-file RTI drafts using intelligent logic, rule-based validation, and configurable templates.

<p align="center">
   <img src="https://via.placeholder.com/800x200?text=RTI-Gen+-+Empowering+Citizens" alt="RTI-Gen Banner" />
</p>

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [Community & Code of Conduct](#-community--code-of-conduct)
- [License](#-license)

---

## 🎯 Project Overview

### What is RTI-Gen?
RTI-Gen is a civic-tech project designed to make the Right to Information (RTI) process accessible, transparent, and user-friendly for everyone. It is especially built for the Indian context, but the architecture is extensible for other legal document generation use cases.

### Why RTI-Gen?
Many citizens struggle to file RTI applications because:
- They do not know the correct legal format
- They are unsure what information to request
- Templates vary across departments
- Errors can lead to rejection
- Language barriers exist
- Existing tools are static and non-intelligent

### How does it help?
RTI-Gen solves these problems by:
- Converting user intent into structured RTI questions
- Applying rule-based logic to ensure correctness
- Generating drafts using configurable templates
- Validating drafts and providing actionable feedback
- Supporting extensibility for future features like multilingual support

### GSoC & Open Source
This project is developed as part of Google Summer of Code (GSoC) 2026 and welcomes contributions from the global open-source community. We value diversity, collaboration, and learning.

---

## ✨ Features

### Core Features
- 📝 **Smart RTI Draft Generation** — Convert vague descriptions into legally structured applications
- 🧠 **Intelligent Question Suggestion** — Auto-generate relevant RTI questions based on intent
- ⚖️ **Rule-Based Logic Engine** — Dynamically apply RTI-specific rules
- 📄 **Template-Based Drafting** — Use configurable templates for different departments
- ✅ **Validation & Scoring** — Get quality scores and improvement suggestions
- ✏️ **Editable Draft Output** — Fine-tune generated drafts before export

### Advanced Features
- 🌐 **Multilingual Support** — i18n ready (English, Hindi, and more)
- 📊 **Knowledge Graph Visualization** — Explore departments and templates visually
- ⚡ **Redis Caching** — Optimized performance with intelligent caching
- 📱 **Responsive Design** — Works seamlessly on desktop and mobile

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| Vite | Build Tool & Dev Server |
| TailwindCSS 4 | Styling |
| React Router 7 | Routing |
| React Hook Form | Form Management |
| Framer Motion | Animations |
| ReactFlow | Graph Visualization |
| i18next | Internationalization |
| Axios | HTTP Client |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime Environment |
| Express.js | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| Redis | Caching |
| PDFKit | PDF Generation |
| Natural | NLP Processing |
| Handlebars | Template Engine |
| Winston | Logging |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend                          │
│  (Landing Page, Generator Workspace, Templates, Graph)      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   Express.js API Layer                      │
│         /api/v1/rti  |  /api/v1/questions  |  /api/v1/templates│
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    RTI Core Engines                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  Intent  │ │ Question │ │   Rule   │ │ Template │       │
│  │  Engine  │ │  Engine  │ │  Engine  │ │  Engine  │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│  ┌──────────┐ ┌──────────┐                                  │
│  │  Draft   │ │Validation│                                  │
│  │  Engine  │ │  Engine  │                                  │
│  └──────────┘ └──────────┘                                  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│           MongoDB (Data)    |    Redis (Cache)              │
└─────────────────────────────────────────────────────────────┘
```

### System Flow

```
User Input → Intent Detection → Question Generation → Rule Application
     → Template Selection → Draft Generation → Validation → Final Draft
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** v6 or higher
- **Redis** (optional, for caching)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/rti-gen.git
   cd rti-gen
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Create environment file
   cp .env.example .env
   
   # Update .env with your configuration
   # PORT=5000
   # NODE_ENV=development
   # MONGODB_URI=mongodb://localhost:27017/rti-gen
   # CORS_ORIGIN=http://localhost:3000
   
   # Seed the database
   npm run seed
   
   # Start development server
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   
   # Start development server
   npm run dev
   ```

4. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`
   - Health Check: `http://localhost:5000/api/health`

### Quick Start with Docker (Coming Soon)

```bash
docker-compose up -d
```

---

## 📁 Project Structure

```
rti-gen/
├── README.md                 # This file
├── PRD.md                    # Product Requirements Document
│
├── backend/                  # Express.js Backend
│   ├── src/
│   │   ├── app.js           # Express app configuration
│   │   ├── server.js        # Server entry point
│   │   ├── config/          # Database & Redis configuration
│   │   ├── constants/       # Department definitions
│   │   ├── controllers/     # Request handlers
│   │   ├── middlewares/     # Error & validation middleware
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic engines
│   │   └── utils/           # Helper functions
│   ├── tests/               # Jest tests
│   └── package.json
│
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── App.jsx          # Main application component
│   │   ├── main.jsx         # Entry point
│   │   ├── i18n.js          # Internationalization config
│   │   ├── components/      # Reusable UI components
│   │   │   ├── common/      # Buttons, UI elements
│   │   │   ├── layout/      # Header, Footer
│   │   │   ├── rti/         # RTI-specific components
│   │   │   └── templates/   # Template components
│   │   ├── pages/           # Page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── GeneratorWorkspace.jsx
│   │   │   ├── Templates.jsx
│   │   │   └── Graph.jsx
│   │   └── services/        # API service layer
│   ├── public/              # Static assets
│   └── package.json
│
└── doc.md                    # Additional documentation
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Endpoints

#### Health Check
```http
GET /api/health
```

#### RTI Generation
```http
POST /api/v1/rti/generate
Content-Type: application/json

{
  "description": "Road construction corruption in my area",
  "department": "Municipal",
  "applicantName": "John Doe",
  "applicantAddress": "123 Main St, City"
}
```

#### Questions
```http
GET /api/v1/questions/suggest?intent=road+construction
POST /api/v1/questions/generate
```

#### Templates
```http
GET /api/v1/templates
GET /api/v1/templates/:id
POST /api/v1/templates
```

#### Graph
```http
GET /api/v1/graph
```

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test              # Run all tests
npm run test:watch    # Watch mode
```

### Frontend Tests
```bash
cd frontend
npm run lint          # Run ESLint
```

---

## 🤝 Contributing

We welcome contributions from students, developers, and civic-tech enthusiasts! Whether you are a GSoC aspirant, a first-time open-source contributor, or an experienced developer, your help is appreciated.

### How to Contribute
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to your branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request (PR) on GitHub

### Development Guidelines
- Follow the existing code style and best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Be respectful and collaborative

### Areas for Contribution
- 🌐 Add more language translations
- 📝 Create new RTI templates
- 🧪 Write more test cases
- 📖 Improve documentation
- 🐛 Fix bugs and issues

---

## 🌍 Community & Code of Conduct

We are committed to fostering a welcoming and inclusive environment for all contributors. Please read our [Code of Conduct](https://github.com/ChronalLabs/RTI-APPLICATION-GENERATOR/blob/main/CODE_OF_CONDUCT.md) before participating.

Join our discussions, ask questions, and connect with the community:
- **Issues**: [GitHub Issues](https://github.com/ChronalLabs/RTI-APPLICATION-GENERATOR/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ChronalLabs/RTI-APPLICATION-GENERATOR/discussions)

---


## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---


## 🙏 Acknowledgments

- Inspired by the need to make RTI filing accessible to all citizens
- Built with ❤️ for civic-tech and open-source communities
- Special thanks to all contributors, mentors, and GSoC organizers

---


## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/ChronalLabs/RTI-APPLICATION-GENERATOR/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ChronalLabs/RTI-APPLICATION-GENERATOR/discussions)
- **Email**: [contact@chronallabs.com](mailto:contact@chronallabs.com)

---


<p align="center">
   <strong>Empowering Citizens, One RTI at a Time</strong><br>
   <i>Made with ❤️ for GSoC & Open Source</i>
</p>
