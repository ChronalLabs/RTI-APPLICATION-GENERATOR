# 📘 PRD.md

# RTI-Gen — AI-Powered RTI Application Generator

---

## 1. Product Overview

### 1.1 Product Name

**RTI-Gen** (Right to Information Generator)

### 1.2 Product Vision

RTI-Gen is an open-source, scalable platform that helps citizens generate structured, legally compliant RTI (Right to Information) applications using intelligent logic, rule-based validation, and configurable templates.

The long-term vision is to evolve RTI-Gen into a **general-purpose civic and legal document generation engine**.

### 1.3 Problem Statement

Many citizens struggle to file RTI applications because:

- They do not know the correct legal format.
- They are unsure what information to request.
- Templates vary across departments.
- Errors can lead to rejection.
- Language barriers exist.
- Existing tools are static and non-intelligent.

### 1.4 Proposed Solution

RTI-Gen solves these problems by:

- Converting user intent into structured RTI questions.
- Applying rule-based logic to ensure correctness.
- Generating drafts using configurable templates.
- Validating drafts and providing feedback.
- Supporting extensibility for future features like multilingual support and AI.

---

## 2. Product Goals & Objectives

### 2.1 Primary Goals

- Provide an intelligent RTI draft generation system.
- Ensure correctness and legal structure of RTI applications.
- Build a modular, scalable, and open-source architecture.
- Enable easy extension for future civic-tech use cases.

### 2.2 Success Metrics

- Accuracy of generated RTI drafts.
- Ease of use for end users.
- Extensibility of templates and rules.
- Code modularity and maintainability.
- Community contributions (open-source).

---

## 3. Target Users

- Citizens filing RTI applications.
- NGOs and activists.
- Journalists.
- Developers contributing to civic-tech tools.
- Open-source contributors.

---

## 4. Core Features

### 4.1 Core Functional Features

- RTI Draft Generation
- Smart Question Suggestion
- Rule-Based Logic Engine
- Template-Based Drafting
- Validation and Scoring
- Editable Draft Output

### 4.2 Advanced / Future Features

- Multilingual RTI generation (English, Hindi, etc.)
- Knowledge graph visualization of departments and templates.
- Caching (Redis) and background processing (Bull).
- AI-based NLP enhancements.
- User accounts and draft history (optional).
- Admin panel for templates and rules.

---

## 5. Product Flow

### 5.1 User Flow

```
User Input
     ↓
Smart Question Suggestions
     ↓
RTI Draft Generation
     ↓
Validation & Score
     ↓
Edit / Download Draft
```

### 5.2 System Flow

1. User submits description
2. Intent detection and department mapping
3. Question engine generates structured questions
4. Rule engine applies RTI rules
5. Template engine selects and renders template
6. Draft generator creates RTI text
7. Validation engine evaluates draft
8. Final RTI draft returned to user

---

## 6. Logical Design & Core Concepts

### 6.1 Engine-Based Architecture

The system is designed as multiple independent engines:

- Intent Engine
- Question Engine
- Rule Engine
- Template Engine
- Draft Engine
- Validation Engine

This ensures **modularity** and **scalability**.

### 6.2 Intent Detection Logic

**Purpose:** Identify keywords and departments from user input.

**Example:**

*Input:*
```
"Road construction corruption"
```

*Output:*
```
Keywords: road, construction
Department: Municipal
```

### 6.3 Question Engine Logic

**Purpose:** Convert vague intent into structured RTI questions.

**Example Output:**

- Provide budget details for road construction.
- Provide contractor information.
- Provide tender documents.

### 6.4 Rule Engine Logic

**Purpose:** Apply RTI-specific rules dynamically.

**Example Rules:**

```
IF department == Police → use formal template
IF questions.length > 5 → use extended template
IF applicant address missing → add warning
```

Rules are stored in the database and evaluated dynamically.

### 6.5 Template Engine Logic

**Purpose:** Generate RTI drafts using configurable templates.

**Template Example:**

```
To,
The Public Information Officer,
{{department}}, {{location}}

Subject: RTI Application under RTI Act, 2005

I request the following information:
{{questions}}
```

### 6.6 Validation & Scoring Logic

**Purpose:** Evaluate the quality and completeness of RTI drafts.

**Scoring Factors:**

- Mandatory fields present
- Question clarity
- Legal structure correctness
- Department relevance

**Example Output:**

```
Score: 88%
Warnings:
- Missing applicant address
- Question 2 unclear
```

---

## 7. Technical Architecture (MERN Stack)

### 7.1 High-Level Architecture

```
React Frontend
     ↓
Express.js API Layer
     ↓
RTI Core Engines
     ↓
MongoDB (Data Storage)
     ↓
Redis & Bull (optional)
```

### 7.2 Backend Architecture

```
Request
     ↓
Routes
     ↓
Validators (optional)
     ↓
Controllers
     ↓
Services / Engines
     ↓
Database
     ↓
Response
```

### 7.3 Frontend Architecture

```
React Components
     ↓
API Service Layer
     ↓
State Management
     ↓
UI Rendering
```

---

## 8. Directory Structure

### 8.1 Backend Structure

```
backend/
├── src/
│   ├── app.js
│   ├── server.js
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── constants/
│   │   └── departments.js
│   │
│   ├── controllers/
│   │   ├── question.controller.js
│   │   ├── rti.controller.js
│   │   └── template.controller.js
│   │
│   ├── middlewares/
│   │   ├── error.middleware.js
│   │   └── validate.middleware.js
│   │
│   ├── models/
│   │   ├── Department.js
│   │   ├── Draft.js
│   │   ├── Rule.js
│   │   └── Template.js
│   │
│   ├── routes/
│   │   ├── question.routes.js
│   │   ├── rti.routes.js
│   │   └── template.routes.js
│   │
│   ├── services/
│   │   ├── draft.service.js
│   │   ├── intent.service.js
│   │   ├── question.service.js
│   │   ├── rule.service.js
│   │   ├── template.service.js
│   │   └── validation.service.js
│   │
│   └── utils/
│       └── helpers.js
│
├── tests/
├── .env.example
└── package.json
```

### 8.2 Frontend Structure
 
 
 User Input → API Call → Suggestions → Draft → Validation → UI Update

```
frontend/src/
├── components/
│   ├── layout/
│   ├── rti/
│   │   ├── InputForm.jsx
│   │   ├── QuestionList.jsx
│   │   ├── DraftPreview.jsx
│   │   ├── ValidationPanel.jsx
│   │   └── TemplateSelector.jsx
│   │
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Modal.jsx
│   │   └── Loader.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── Generate.jsx
│   ├── Graph.jsx
│   └── NotFound.jsx
│
├── services/
│   └── api.js
│
├── hooks/
├── context/
├── i18n/
├── styles/
└── App.jsx
```

---
```


Colors (Recommended)

Primary: Blue (#2563EB)

Secondary: Slate (#64748B)

Success: Green (#22C55E)

Warning: Yellow (#FACC15)

Error: Red (#EF4444)

Typography

Heading: Inter / Poppins

Body: Inter / Roboto

Components Style

rounded cards

soft shadows

minimal borders

clear hierarchy
```

## 9. Tech Stack & Dependencies

### 9.1 Core Tech Stack

**Frontend:**

- React.js
- Axios
- Tailwind CSS / MUI
- React Flow (graphs)
- i18next (multilingual)

**Backend:**

- Node.js
- Express.js
- MongoDB + Mongoose
- Handlebars / Mustache (template engine)

**Optional Advanced:**

- Redis (caching)
- Bull (queues)

### 9.2 Backend Dependencies

| Dependency | Purpose |
|------------|---------|
| express | API server |
| mongoose | MongoDB ODM |
| dotenv | Environment variables |
| cors | CORS handling |
| handlebars | Template rendering |
| joi / express-validator | Input validation |
| redis | Caching |
| bull | Background jobs |
| jest | Testing |

### 9.3 Frontend Dependencies

| Dependency | Purpose |
|------------|---------|
| react | UI framework |
| axios | API communication |
| tailwindcss / mui | Styling |
| reactflow | Knowledge graph |
| i18next | Multilingual support |
| react-hook-form | Form handling |

---

## 10. Database Design (MongoDB)

### 10.1 Draft Collection

```json
{
  "applicantName": "Rahul Sharma",
  "department": "Municipal",
  "location": "Bhopal",
  "questions": ["..."],
  "templateId": "ObjectId",
  "draftText": "...",
  "score": 90,
  "warnings": ["..."],
  "createdAt": "Date"
}
```

### 10.2 Template Collection

```json
{
  "name": "municipal_template",
  "department": "Municipal",
  "language": "en",
  "content": "...",
  "version": "1.0"
}
```

### 10.3 Rule Collection

```json
{
  "name": "Police Formal Rule",
  "priority": 1,
  "conditions": [
    { "field": "department", "operator": "equals", "value": "Police" }
  ],
  "actions": [
    { "type": "setTemplate", "value": "police_template" }
  ]
}
```

### 10.4 Department Collection

```json
{
  "name": "Municipal",
  "keywords": ["road", "water", "construction"]
}
```

---

## 11. API Design

### 11.1 Generate RTI Draft

```http
POST /api/v1/rti/generate
```

**Request:**

```json
{
  "description": "road corruption case",
  "department": "Municipal",
  "location": "Bhopal",
  "language": "en"
}
```

**Response:**

```json
{
  "draft": "...",
  "questions": ["..."],
  "score": 90,
  "warnings": ["..."]
}
```

### 11.2 Validate RTI Draft

```http
POST /api/v1/rti/validate
```

### 11.3 Suggest Questions

```http
POST /api/v1/questions/suggest
```

### 11.4 Templates API

```http
GET /api/v1/templates
```

---

## 12. Scalability & Extensibility

### 12.1 Scalability Design

- Modular engine-based architecture
- Rule-driven logic instead of hardcoding
- Template configurability
- Optional caching and async processing

### 12.2 Future Extensions

- User authentication (JWT + bcrypt)
- Admin panel
- PDF/DOCX export
- AI-powered NLP
- Multi-country RTI support
- Other legal document generators

---

## 13. Design Rationale (Logical Thinking)

### Traditional Approach ❌

```
Form → Hardcoded Text
```

**Problems:**

- Not scalable
- Not intelligent
- Hard to extend

### RTI-Gen Approach ✅

```
Intent → Rules → Templates → Validation → Draft
```

**Benefits:**

- Dynamic logic
- Configurable templates
- Extensible rules
- Open-source friendly
- Future-ready architecture

---

## 14. UX Enhancements (Make Your Project Stand Out)

### 🔥 14.1 Live Draft Preview

As user selects questions → draft updates in **real-time**.

```
[User selects question] → [Draft instantly reflects change]
```

### 🔥 14.2 Explainability UI

Show logic to users — making the system feel **intelligent**:

```
Why this question was suggested?
→ Because your issue relates to "road construction".
```

This transparency builds user trust and understanding.

### 🔥 14.3 RTI Quality Meter 📊

Visual progress bar showing draft completeness:

```
Completeness: ████████░░ 80%
```

**Factors displayed:**
- Required fields filled
- Question clarity score
- Legal structure compliance

### 🔥 14.4 Wizard Mode (Beginner-Friendly)

Step-by-step guided flow for new users:

| Step | Action |
|------|--------|
| Step 1 | Describe your issue |
| Step 2 | Select relevant questions |
| Step 3 | Review and edit draft |
| Step 4 | Download / Submit |

### 🔥 14.5 Accessibility (Important)

Ensuring the platform is usable by everyone:

- **Simple language** — avoid legal jargon
- **Large buttons** — easy to click/tap
- **Keyboard navigation** — full keyboard support
- **Mobile responsive** — works on all devices
- **High contrast** — readable for visually impaired users
- **Screen reader friendly** — proper ARIA labels

---

## 15. Summary

RTI-Gen is designed as a **legal document generation engine**, not just a form-based tool.

**It combines:**

- Structured logic
- Rule-based reasoning
- Template-driven generation
- Modular MERN architecture
- Scalability and extensibility

**This makes it suitable for:**

- GSoC projects
- Open-source development
- Civic-tech platforms
- Real-world legal-tech applications

