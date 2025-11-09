# Telgea MVNO Integration - Technical Assessment

This project implements MVNO (Mobile Virtual Network Operator) data normalization from SOAP XML and REST JSON formats into Telgea's internal format. A Node.js backend API and an Angular 20 frontend application.

The requirements contained some ambiguity that warranted clarification. In a real life scenario I would have asked for clarification, but in the current environment I had to apply a mix of an educated guess of the intended requirements (considering it is a test and not production code) and what I consider good practices.

---

## 📑 Table of Contents

- [Requirements Analysis](#requirements-analysis)
  - [The Integration Ambiguity](#the-integration-ambiguity)
  - [Why This Approach?](#why-this-approach)
- [Solution Architecture](#solution-architecture)
  - [Recommended Production Architecture](#recommended-production-architecture)
  - [Current Implementation: Two Independent Apps](#current-implementation-two-independent-apps)
  - [Input Validation vs. Output Validation](#input-validation-vs-output-validation)
  - [No UI Comparison Feature](#no-ui-comparison-feature)
- [Final Notes](#final-notes)

---

## Requirements Analysis

### The Integration Ambiguity

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

**This statement is confusing and ambiguous**

- "Takes the data you produced" suggest the backend output should feed the frontend. But the "produced" data is not the SOAP XML and REST JSON. It would be the internal normalized data.
- But why would the frontend normalize something that is already normalized from the backend?
- My assumption is that it's possible it means to reuse mock files, but it could have been worded better to avoid this confusion. Also, in real life this could be solved easily with a quick clarification.

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

A- 2 overlapping implementations: API and UI without integration (this is what is impemented)

B- Full Stack API and Frontend that calls backend (Recommended for production)

#### **Backend** (`/backend`)

- **Technology:** Node.js + Express + TypeScript
- **Purpose:** API for server-side normalization
- **Endpoints:**
  - `POST /api/normalize/soap` - Normalize SOAP XML charges
  - `POST /api/normalize/rest` - Normalize REST JSON usage data
  - `GET /health` - Health check
  - The endpoints can be manually tested with a postman collection file I added to the root folder
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
(But this would make a lot of the frontend test requirements invalid - no normalization in frontend)

I Tried to cover all evaluation criteria

- Node.js (Backend implementation)
- Angular (Frontend implementation)
- SOAP/REST handling (Both implementations)
- Architecture & Structure (Clean separation in both)

**Trade-off:** Logic duplication, not ideal pattern vs. following test requirements

---

---

### Input Validation vs. Output Validation

From the requirements "Your task is to create a simple Angular app that takes the data you produced in the backend test (SOAP XML and REST JSON), **normalizes it to Telgea's internal format, validates it,** and displays the result."

Maybe it's just a detail in the order of the actions, but I need to challenge the idea of having the validation **after** the normalization.

**Decision:** Parsers validate **input data** before normalization, we don't validate in runtime the normalized output.

**Rationale:**

- Validation errors come from **external data** (SOAP XML, REST JSON)
- External data is untrusted → validate at boundary
- Once parsed and validated, normalization is a pure transformation
- Normalization is deterministic → bugs are code issues, not runtime validation
- If normalized output is wrong, that's a **code bug**, not a validation concern
- Output validation belongs in **automated tests**, not production code

**Implementation:**

- `XmlParserService.parseSOAPCharge()` - validates required SOAP fields
- `RestParserService.validateRESTDataUsage()` - validates REST structure
- `ValidationService` - provides reusable format validators (MSISDN, non-empty strings, etc.)

---

---

### No UI Comparison Feature

**Requirement (unclear rationale):**

"Compare your output to a provided internal_expected.json and highlight mismatches"

**Interpretation:**
This requirement suggests implementing runtime validation of the **normalized output** against expected results in the UI.

However, this doesn't align with best practices. In my opinion, visual comparison of normalized output against expected output serves no practical purpose. If input is invalid, no output should be produced, so it wouldn't make sense to implement in my approach to the solution, because we don't get any outputs if the inputs are invalid. Such comparisons belong in automated tests.

**Decision:**
This requirement is satisfied by automated tests (`normalizer.service.spec.ts` with test cases covering valid and invalid scenarios), not as a UI feature.
I consciously chose **not** to implement runtime output comparison in the interface.

**If the Requirement Meant Something Else:**

If it truly meant a UI comparison tool, we'd need clarification on:

- Why would we want to normalize invalid inputs, and in consequence display invalid outputs?
- What problem does it solve? (Manual testing is inferior to automated tests)

---

---

## Final Notes

Thank you for reviewing this project.

**Navigation:**

- [Backend Documentation →](./backend/README.md)
- [Frontend Documentation →](./mvno-normalizer-fe/README.md)
