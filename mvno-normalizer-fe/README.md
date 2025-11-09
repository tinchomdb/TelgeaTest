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
6. **Mockup Data:** Dropdown with different inputs for manual testing

## Overview

This application demonstrates:

- **Input validation** at the boundary (parsers validate before normalization)
- **Clean service architecture** with single responsibilities
- **Modern Angular patterns** (standalone components, signals, inject())
- **Testing** with Jest

### Mock Data with Multiple Scenarios

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

## License

Internal test project for Telgea.

---

**Questions or clarifications on design decisions?** See "Key Design Decisions" section above.
