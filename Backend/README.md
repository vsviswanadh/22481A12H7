# Backend - URL Shortener API

This folder contains the backend API services for the URL shortener application.

## Structure

```
Backend/
├── logging-middleware/          # Logging middleware service
│   ├── src/
│   │   ├── log.ts              # Main logging function
│   │   └── testLogger.ts       # Test script for logging
│   ├── package.json
│   └── tsconfig.json
│
└── url-shortener-api/          # URL shortener REST API
    ├── src/
    │   ├── routes/             # API route handlers
    │   ├── services/           # Business logic services
    │   ├── types/              # TypeScript type definitions
    │   └── server.ts           # Main server file
    ├── package.json
    └── tsconfig.json
```

## Components

### 1. Logging Middleware
- **Purpose**: Centralized logging service for the application
- **Features**: 
  - Stack-based logging (backend/frontend)
  - Multiple log levels (debug, info, warn, error, fatal)
  - Package-specific logging
  - Remote logging endpoint integration
- **Port**: N/A (utility service)

### 2. URL Shortener API
- **Purpose**: REST API for URL shortening and analytics
- **Features**:
  - Create short URLs with optional custom codes
  - URL expiration management
  - Click tracking and analytics
  - Geographic location tracking
  - CORS enabled for frontend integration
- **Port**: 3000

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Install Logging Middleware dependencies:**
   ```bash
   cd Backend/logging-middleware
   npm install
   ```

2. **Install URL Shortener API dependencies:**
   ```bash
   cd Backend/url-shortener-api
   npm install
   ```

### Running the Services

1. **Start Logging Middleware (for testing):**
   ```bash
   cd Backend/logging-middleware
   npm run dev
   ```

2. **Start URL Shortener API:**
   ```bash
   cd Backend/url-shortener-api
   npm run dev
   ```

## API Endpoints

### URL Shortener API (http://localhost:3000)

- `POST /api/urls` - Create a new short URL
- `GET /api/urls` - Get all URLs with statistics
- `GET /api/urls/:shortCode/stats` - Get detailed statistics for a specific URL
- `GET /:shortCode` - Redirect to original URL (and track click)
- `GET /health` - API health check

## Environment Configuration

The backend API runs on port 3000 by default and is configured to accept requests from the frontend running on port 3001.

## Development

### Building
```bash
# Build logging middleware
cd Backend/logging-middleware
npm run build

# Build URL shortener API  
cd Backend/url-shortener-api
npm run build
```

### Production
```bash
# Start logging middleware in production
cd Backend/logging-middleware
npm start

# Start URL shortener API in production
cd Backend/url-shortener-api
npm start
```

## Technology Stack
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **HTTP Client**: Axios (for logging middleware)
- **Utilities**: UUID, GeoIP-lite
- **Module System**: ES Modules
