# MVNO Data Normalizer - Frontend

Angular 20 frontend implementation for normalizing MVNO (Mobile Virtual Network Operator) data from SOAP XML and REST JSON formats into Telgea's internal format.

## Usage

1. **Select Input Type:** Choose between SOAP XML or REST JSON
2. **Paste Data:** Enter your SOAP/REST data, or click "Load Mock" for an example
3. **Normalize:** Click the "Normalize" button
4. **View Results:**
   - Success: See normalized output in Telgea's internal format
   - Error: See detailed validation error message
5. **Download:** Export normalized data as JSON file

## Overview

This application demonstrates:

- **Input validation** at the boundary (parsers validate before normalization)
- **Clean service architecture** with single responsibilities
- **Modern Angular patterns** (standalone components, signals, inject())
- **Testing** with Jest

## Key Design Decisions

### 1. Validation at Input Boundary

**Decision:** Parsers validate **input data** before normalization, not the normalized output.

**Rationale:**

- Validation errors come from **external data** (SOAP XML, REST JSON)
- Once parsed and validated, normalization is a pure transformation
- If normalized output is wrong, that's a **code bug**, not a validation concern
- Output validation belongs in **automated tests**, not runtime UI

**Implementation:**

- `XmlParserService.parseSOAPCharge()` - validates required SOAP fields
- `RestParserService.validateRESTDataUsage()` - validates REST structure
- `ValidationService` - provides reusable format validators (MSISDN, non-empty strings, etc.)

### 2. No UI Comparison Feature

**Requirement (ambiguous):**

> "Compare your output to a provided internal_expected.json and highlight mismatches"

**Interpretation:**
This requirement appears to suggest implementing runtime validation of the **normalized output** against expected results in the UI. We consciously chose **not** to implement this as a UI feature.

**Decision:**
This requirement is satisfied by automated tests (`normalizer.service.spec.ts`), not runtime output validation in the UI.

**Why Output Validation is an Anti-Pattern:**

Validating normalized output at runtime is architecturally unsound:

1. **Validation should happen at the input boundary** (before processing), not after
2. **If normalized output is wrong, that's a code bug** - fix the normalizer, don't validate its output
3. **Output validation in production code suggests distrust of your own logic** - this belongs in tests
4. **It creates a false sense of safety** - if the normalizer produces bad output, catching it post-facto doesn't help; the damage is already done
5. **It's circular logic** - comparing output against what we expect our code to produce proves nothing about correctness with real data

**Correct Validation Architecture:**

```
External Data (SOAP/REST)
    ↓
[VALIDATE HERE] ← Input boundary: check required fields, formats, types
    ↓
Parse to structured data
    ↓
[NORMALIZE] ← Pure transformation (no validation needed if input was valid)
    ↓
Output (TelgeaInternalFormat)
    ↓
[TEST AGAINST EXPECTED] ← Only in automated tests, not runtime
```

**Why This Makes Sense:**

- **Input validation** catches bad external data (missing fields, wrong types, malformed XML)
- **Normalization** is deterministic: valid input → correct output (if buggy, fix the code)
- **Output validation in tests** ensures the normalizer logic is correct during development
- **No runtime output validation needed** - if input passed validation and code is tested, output is guaranteed correct

**What We Provide Instead:**

- **Input validation** - Real-time errors for bad SOAP/REST data shown to users
- **Multiple mock scenarios** - Dropdown to load valid and intentionally invalid data to demonstrate validation
- **Comprehensive test suite** - 16 test cases comparing actual vs expected outputs (proper place for output validation)
- **Mock loader** - Quickly test different scenarios without manual data entry

**If the Requirement Meant Something Else:**

Perhaps it intended "provide test cases that compare output to expected results" - which we do via Jest tests. If it truly meant a UI comparison tool, we'd need clarification on:

- Why would we want to normalize invalid inputs, and in consequence display invalid outputs?
- What problem does it solve? (Manual testing is inferior to automated tests)
- What should happen when output doesn't match? (Users can't fix code bugs)

### 3. Mock Data with Multiple Scenarios

**Implementation:**

Sample files in `public/assets/mocks/`:

**SOAP Scenarios:**

- `soap-valid.xml` - Complete valid SOAP charge
- `soap-missing-userid.xml` - Missing UserID field
- `soap-missing-phone.xml` - Missing PhoneNumber field
- `soap-invalid-amount.xml` - Negative charge amount
- `soap-malformed.xml` - Invalid XML structure

**REST Scenarios:**

- `rest-valid.json` - Complete valid REST usage data
- `rest-missing-userid.json` - Missing user_id field
- `rest-missing-usage.json` - Missing usage object
- `rest-invalid-structure.json` - Wrong nested structure
- `rest-empty-msisdn.json` - Empty MSISDN string

**UI Feature:**

- Dropdown with descriptive labels: "Valid - Complete valid SOAP charge"
- Automatically switches scenarios when toggling SOAP/REST input type
- Users can quickly test validation by loading intentionally broken data

This transforms the mock loader from convenience into a **validation showcase** - demonstrating error handling without requiring users to manually craft invalid data.

## Tech Stack

- **Angular 20** (standalone components, signals)
- **TypeScript 5.9** (strict mode)
- **Jest** with `jest-preset-angular` (zoneless testing)
- **HttpClient** for loading mock data
- **RxJS** (forkJoin for parallel HTTP requests)

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Development Server

```bash
npm start
```

Navigate to `http://localhost:4200/`

### Running Tests

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

### Build

```bash
npm run build
```

Build artifacts will be in `dist/`

## Testing Strategy

### What we test in automated tests

- SOAP normalization (success + error cases)
- REST normalization (success + error cases)
- Field-specific validation errors
- Malformed input handling

### What we don't test in UI

- Manual output comparison (handled by automated tests)

## Known Limitations

1. **Client-side normalization duplicates backend logic**

   - Requirement was ambiguous whether frontend should be independent or call backend
   - Implemented standalone frontend as specified in "Scenario 2"

2. **Minimal styling**
   - By design per requirement: "not design polish"

## Future Enhancements (Out of Scope)

If requirements evolve, consider:

- **Backend integration** - Call Node.js normalizer API instead of duplicating logic
- **Diff viewer** - If output comparison becomes a validated user requirement

## License

Internal test project for Telgea.

---

**Questions or clarifications on design decisions?** See "Key Design Decisions" section above.
