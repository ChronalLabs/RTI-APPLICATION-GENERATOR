# RTI-Gen Backend

AI-Powered RTI Application Generator - Backend API

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/rti-gen
CORS_ORIGIN=http://localhost:3000
```

4. Seed the database:
```bash
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## 📁 Directory Structure

```
backend/
├── src/
│   ├── app.js           # Express app configuration
│   ├── server.js        # Server entry point
│   ├── config/          # Configuration files
│   │   ├── db.js        # MongoDB connection
│   │   └── redis.js     # Redis connection (caching)
│   ├── constants/       # Constants and mappings
│   │   └── departments.js
│   ├── controllers/     # Route controllers (handle HTTP requests)
│   │   ├── rti.controller.js
│   │   ├── question.controller.js
│   │   └── template.controller.js
│   ├── middlewares/     # Express middleware
│   │   ├── error.middleware.js
│   │   └── validate.middleware.js
│   ├── models/          # Mongoose models
│   │   ├── Draft.js
│   │   ├── Template.js
│   │   ├── Rule.js
│   │   └── Department.js
│   ├── routes/          # API routes
│   │   ├── rti.routes.js
│   │   ├── question.routes.js
│   │   └── template.routes.js
│   ├── services/        # Business logic (core engines)
│   │   ├── intent.service.js      # Keyword extraction & dept mapping
│   │   ├── question.service.js    # Question generation
│   │   ├── rule.service.js        # Dynamic rule evaluation
│   │   ├── template.service.js    # Handlebars template rendering
│   │   ├── draft.service.js       # Orchestrates all services
│   │   └── validation.service.js  # Draft validation & scoring
│   └── utils/           # Utility functions
│       └── helpers.js
├── .env.example         # Environment template
├── .gitignore
├── package.json
└── README.md
```

## 🔌 API Endpoints

### RTI Draft

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/rti/generate` | Generate RTI draft |
| POST | `/api/v1/rti/validate` | Validate RTI draft |
| POST | `/api/v1/rti/save` | Save RTI draft |
| GET | `/api/v1/rti/:id` | Get draft by ID |
| PUT | `/api/v1/rti/:id` | Update draft |
| POST | `/api/v1/rti/:id/regenerate` | Regenerate draft |

### Questions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/questions/suggest` | Suggest questions |
| POST | `/api/v1/questions/generate` | Generate questions |
| GET | `/api/v1/questions/categories` | Get categories |

### Templates

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/templates` | Get all templates |
| GET | `/api/v1/templates/:id` | Get template by ID |
| POST | `/api/v1/templates` | Create template |
| PUT | `/api/v1/templates/:id` | Update template |
| DELETE | `/api/v1/templates/:id` | Delete template |
| POST | `/api/v1/templates/preview` | Preview template |

### Departments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/departments` | Get all departments |
| GET | `/api/v1/departments/:id` | Get department by ID |
| POST | `/api/v1/departments` | Create department |
| PUT | `/api/v1/departments/:id` | Update department |
| DELETE | `/api/v1/departments/:id` | Delete department |

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📝 Example Usage

### Generate RTI Draft

```bash
curl -X POST http://localhost:5000/api/v1/rti/generate \
  -H "Content-Type: application/json" \
  -d '{
    "description": "road construction corruption",
    "department": "Municipal",
    "location": "Bhopal",
    "applicantName": "John Doe",
    "language": "en"
  }'
```

### Suggest Questions

```bash
curl -X POST http://localhost:5000/api/v1/questions/suggest \
  -H "Content-Type: application/json" \
  -d '{
    "description": "road construction delays",
    "maxQuestions": 5
  }'
```

## 🏗️ Architecture Flow

```
User Input → API Routes → Controllers → Services → Database/Cache
                                            ↓
                            ┌───────────────┼───────────────┐
                            ↓               ↓               ↓
                      Intent Service  Question Service  Rule Service
                            ↓               ↓               ↓
                            └───────────────┼───────────────┘
                                            ↓
                                    Template Service
                                            ↓
                                   Validation Service
                                            ↓
                                    Generated Draft
```

### Service Responsibilities

1. **Intent Service** - Extracts keywords from user description, maps to relevant government department
2. **Question Service** - Generates structured RTI questions based on intent and category
3. **Rule Service** - Applies dynamic rules (add warnings, override templates, modify scores)
4. **Template Service** - Renders RTI drafts using Handlebars templates (cached in Redis)
5. **Draft Service** - Orchestrates all services to generate complete RTI application
6. **Validation Service** - Validates drafts, calculates quality score (0-100)

## 🚀 Running with Redis (Optional but Recommended)

Redis provides caching for templates. Start Redis in WSL:

```bash
# In WSL terminal (keep this open)
redis-server --bind 0.0.0.0 --protected-mode no
```

Update `.env`:
```env
REDIS_ENABLED=true
REDIS_URL=redis://<WSL_IP>:6379
```

Get WSL IP: `wsl hostname -I`

## 📄 License

MIT
