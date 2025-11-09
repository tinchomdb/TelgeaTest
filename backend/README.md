# TelgeaTest Backend - Quick Start

## Overview

Backend API for MVNO (Mobile Virtual Network Operator) provider integration, normalizing SOAP and REST responses into a unified Telgea internal format.

## Architecture

### Services

- **XMLParserService**: Parses SOAP/XML responses with namespace handling
- **RESTParserService**: Validates REST/JSON responses with type guards
- **NormalizerService**: Maps provider-specific formats to Telgea internal format

### Types

- `common.types.ts`: `RawData` type for external/untrusted data
- `mvno-soap.types.ts`: SOAP envelope and charge SMS interfaces
- `mvno-rest.types.ts`: REST response data structures
- `telgea-internal.types.ts`: Target unified format (TelgeaInternalFormat)

### Controllers & Routes

- **mvnoController**: HTTP handlers for `/api/normalize/soap` and `/api/normalize/rest`
- **mvnoRoutes**: Express router mounting both endpoints
- **app.ts**: Express server with CORS, JSON parsing, and error handling

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev          # Start with auto-reload
npm start            # Start server
npm test             # Run unit tests
npm run build        # Compile TypeScript
```

### API Endpoints

#### SOAP Normalization

```
POST /api/normalize/soap
Content-Type: application/json

{
  "xml": "<soapenv:Envelope>...</soapenv:Envelope>"
}
```

#### REST Normalization

```
POST /api/normalize/rest
Content-Type: application/json

{
  "user_id": "USER123",
  "msisdn": "34912345678",
  "usage": { ... },
  "network": { ... }
}
```

#### Health Check

```
GET /health
```

## Design Principles

- **Type Safety**: Strict TypeScript with `strict: true`
- **Input Validation**: Fail-fast validation in parsers
- **Type Predicates**: Use `data is Type` for type guards (industry standard)
- **Progressive Type Narrowing**: `unknown` → `RawData` → specific types
- **Separation of Concerns**: Controllers → Services → Types
- **No Over-Engineering**: YAGNI principle applied (no mappers, no output validation)

## Testing

Unit test for NormalizerService covers both SOAP and REST normalization paths using the AAA (Arrange-Act-Assert) pattern.

```bash
npm test
```

## Production Ready

- ✅ Error handling with meaningful messages
- ✅ CORS enabled
- ✅ Type-safe throughout
- ✅ Health check endpoint
- ✅ Proper HTTP status codes
- ✅ Service encapsulation
