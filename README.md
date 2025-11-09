# Telgea MVNO Integration - Technical Assessment

This project implements MVNO (Mobile Virtual Network Operator) data normalization from SOAP XML and REST JSON formats into Telgea's internal format. A Node.js backend API and an Angular 20 frontend application.

The requirements contained some ambiguity that warranted clarification. In a real life scenario I would have asked for clarification, but in the current environment I had to apply a mix of an educated guess of the intended requirements (considering is a test and not production code) and what I consider good practices.

---

## Requirements Analysis

### The Ambiguity

The original requirements presented conflicting signals about the integration between the backend and frontend:

#### Scenario 1: Backend Integration Layer

"Your task is to structure and partially implement the **integration between the provider's telecom API and Telgea's internal API normalizer**."

**Interpretation:** Server-side integration layer (Node.js backend)

**Key indicators:**

- "Integration between APIs" suggests middleware/backend service
- Evaluation criteria explicitly mentions **Node.js**
- Real MVNO integrations handle sensitive data (server-side concern)
- Provider APIs would be called from a backend, not a frontend

#### Scenario 2: Angular Frontend App

Requirement: "Your task is to create a **simple Angular app** that takes the data you produced in the backend test (SOAP XML and REST JSON), normalizes it to Telgea’s internal format, validates it, and displays the result"

This statement is very confusing and ambiguous

- "Takes the data you produced" suggest the backend output should feed the frontend. But the "produced" data is not the SOAP XML and REST JSON. It would be the internal normalized data.
- Why would the frontend normalize something that is already normalized from the backend?
- It's possible it means to reuse mock files, but it could have been worded better to avoid this confusion.

**Interpretation:** Independent Client-side normalization tool

**Key indicators:**

- What is described previously from the scenario 2 requirements
- The frontend recommended structure has normalizer and validation services (suggesting the backend is not needed)
  services/
  normalizer.service.ts
  xml-parser.service.ts
  validation.service.ts

**In a real-world scenario, I would have immediately paused to ask:**

Should the Angular app **call the backend API**, or have independent normalization logic?

**Without clarification, there are 2 valid interpretations:**

| Interpretation | Backend | Frontend | Integration |

| A) 2 overlapping implementations | API | UI | No integration (this is what is impemented) |
| B) Full Stack | API | UI | Frontend calls backend | (Recommended for production)

---

### Input Validation vs. Output Validation

From the requirements "Your task is to create a simple Angular app that takes the data you produced in the backend test (SOAP XML and REST JSON), **normalizes it to Telgea’s internal format, validates it,** and displays the result."

Maybe it's just a detail in the order of the actions, but I need to challenge having the validation **after** the normalization.

**Decision:** Validate inputs (SOAP/REST), not normalized outputs

**Rationale:**

- External data is untrusted → validate at boundary
- Normalization is deterministic → bugs are code issues, not runtime validation
- Output validation belongs in **tests**, not production code
- If output is wrong, fix the normalizer, don't validate it in the visualizer

**See [mvno-normalizer-fe/README.md § Design Decisions](./mvno-normalizer-fe/README.md#key-design-decisions) for detailed analysis.**

---

### Mock Scenarios WITHOUT Output Comparison

**Original requirement (ambiguous):**

"Compare your output to a provided internal_expected.json and highlight mismatches"

Again, we fall into validating outputs. I couldn't find a purpose for the visual comparison of produced output against expected output. The way I consider best, and how I implemented the tool, would not provide any output if the input is invalid.

**Interpretation A:** Runtime UI comparison tool

- ❌ Circular logic (comparing output to what we expect from our own code)
- ❌ User can't fix code bugs

**Interpretation B:** Test suite with expected outputs

- ✅ Proper place for output validation (development time)
- ✅ 15 test cases comparing actual vs. expected
- ✅ Catches regressions during development

**My implementation:**

- Comparing in automated tests
- Mock loader with 10+ scenarios (better UX than comparison UI)

---

### What I Implemented

**I chose to implement TWO complete, independent solutions:**

#### **Backend** (`/backend`)

- **Technology:** Node.js + Express + TypeScript
- **Purpose:** API for server-side normalization
- **Endpoints:**
  - `POST /api/normalize/soap` - Normalize SOAP XML charges
  - `POST /api/normalize/rest` - Normalize REST JSON usage data
  - `GET /health` - Health check
- **Features:**
  - Type-safe parsing and validation
  - Error handling with meaningful HTTP status codes
  - CORS enabled for potential frontend integration
  - Unit test

#### **Frontend** (`/mvno-normalizer-fe`)

- **Technology:** Angular 20 + TypeScript (strict mode)
- **Purpose:** Internal tool for visual verification of normalization
- **Features:**
  - Interactive UI for pasting SOAP/REST data
  - Client-side normalization (duplicated logic from backend)
  - Validation with detailed error messages
  - Mock data loader with valid/invalid scenarios
  - JSON download capability
  - Jest test suite (15 test cases)

### Why This Approach?

I tried to follow my interpretation of the requirements, while it made sense considering this is a test and not production code

My recommendation for production code would be to have the frontend sending the inputs and getting a response from an API.
(Although this would make a lot of the frontend test requirements invalid - no normalization in frontend)

Tried to cover all evaluation criteria

- Node.js (Backend implementation)
- Angular (Frontend implementation)
- SOAP/REST handling (Both implementations)
- Architecture & Structure (Clean separation in both)

---

## Solution Architecture

### Recommended Production Architecture

**My recommendation: Backend normalization with frontend UI**

```
┌─────────────────┐
│  MVNO Provider  │
│   SOAP/REST     │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│   Backend API (Node.js)         │
│  ┌──────────────────────────┐   │
│  │  Normalization Service   │   │
│  │  - SOAP Parser           │   │
│  │  - REST Parser           │   │
│  │  - Validator             │   │
│  └──────────────────────────┘   │
│           │                     │
│           ▼                     │
│  ┌──────────────────────────┐   │
│  │ Telgea Internal Format   │   │
│  └──────────────────────────┘   │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│   Frontend (Angular)            │
│  - Display normalized data      │
│  - Error visualization          │
│  - Monitoring/reporting         │
└─────────────────────────────────┘
```

### Current Implementation: Two Independent Apps

For this assessment, both apps have **independent normalization logic**:

```
Backend (Node.js)                 Frontend (Angular)
┌──────────────────┐             ┌──────────────────┐
│ NormalizerService│             │ NormalizerService│
│ XMLParserService │             │ XmlParserService │
│ RESTParserService│             │ RestParserService│
└──────────────────┘             └──────────────────┘
```

**Trade-off:** Logic duplication vs. following test requirements

---

## Quick Start

### Prerequisites

- **Node.js** 18+ and npm 9+
- Terminal access (PowerShell/Bash/etc.)

### Backend Setup

```powershell
# Navigate to backend
cd backend

# Install dependencies
npm install

# Run tests
npm test

# Start development server (http://localhost:3000)
npm run dev

# Or build and start production
npm run build
npm start
```

**Test the API:**

```powershell
# Health check
curl http://localhost:3000/health

# Normalize SOAP (use PowerShell or Postman)
curl -X POST http://localhost:3000/api/normalize/soap `
  -H "Content-Type: application/json" `
  -d '{"xml": "<soapenv:Envelope>...</soapenv:Envelope>"}'
```

**See [backend/README.md](./backend/README.md) for full API documentation.**

---

### Frontend Setup

```powershell
# Navigate to frontend
cd mvno-normalizer-fe

# Install dependencies
npm install

# Run tests
npm test

# Start development server (http://localhost:4200)
npm start
```

**Using the app:**

1. Open `http://localhost:4200`
2. Select SOAP or REST input type
3. Click "Load Mock" for example data
4. Click "Normalize" to see output
5. Try different mock scenarios (valid/invalid data)
6. Download normalized JSON if needed

**See [mvno-normalizer-fe/README.md](./mvno-normalizer-fe/README.md) for detailed usage and design decisions.**

---

## License & Usage

This is a technical assessment project. Code is provided for evaluation purposes.

---

## Final Notes

Thank you for reviewing this project.

**Navigation:**

- [Backend Documentation →](./backend/README.md)
- [Frontend Documentation →](./mvno-normalizer-fe/README.md)
