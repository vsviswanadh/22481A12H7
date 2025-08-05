# Full-Stack Development Project Structure

This repository contains the organized structure for Backend and Frontend development tracks for Afford Medical Technologies.

## Project Structure

```
22481A12H7/
├── Backend/
│   └── logging-middleware/          # Centralized logging service
│       ├── src/
│       │   ├── log.ts              # Main logging function
│       │   └── testLogger.ts       # Test script for logging
│       ├── package.json
│       └── tsconfig.json
│
├── Frontend/
│   └── url-shortener/              # Complete URL shortener application
│       ├── backend/                # Express.js API server
│       │   ├── src/
│       │   │   ├── server.ts       # Main server file
│       │   │   ├── routes/         # API routes
│       │   │   ├── services/       # Business logic
│       │   │   └── types/          # TypeScript definitions
│       │   ├── dist/               # Compiled JavaScript
│       │   ├── package.json
│       │   └── tsconfig.json
│       │
│       ├── frontend/               # Web UI
│       │   ├── public/
│       │   │   ├── index.html      # Main application page
│       │   │   ├── stats.html      # Analytics dashboard
│       │   │   ├── script.js       # Main application logic
│       │   │   ├── stats.js        # Analytics functionality
│       │   │   └── styles.css      # Responsive styling
│       │   └── package.json
│       │
│       └── README.md               # URL shortener documentation
│
└── README.md                       # This file
```

## Components

### Backend Track - Logging Middleware
**Location**: `Backend/logging-middleware/`

A TypeScript-based logging middleware for centralized application logging.

**Features**:
- Stack-based logging (backend/frontend)
- Multiple log levels (debug, info, warn, error, fatal)
- Package-specific logging
- Remote logging endpoint integration
- Full TypeScript support

**Usage**:
```bash
cd Backend/logging-middleware
npm install
npm run dev        # Run test logger
npm run build      # Compile TypeScript
npm start          # Run compiled version
```

### Frontend Track - URL Shortener Application
**Location**: `Frontend/url-shortener/`

A complete full-stack URL shortening application with backend API and frontend UI.

**Backend API Features**:
- RESTful API with Express.js and TypeScript
- URL shortening with custom codes
- Click tracking and analytics
- Geographic location tracking
- CORS enabled for frontend integration

**Frontend UI Features**:
- Responsive web interface
- Real-time form validation
- Analytics dashboard
- Copy-to-clipboard functionality
- Mobile-responsive design

**Usage**:
```bash
# Start Backend API (Terminal 1)
cd Frontend/url-shortener/backend
npm install
npm start          # Runs on http://localhost:3000

# Start Frontend UI (Terminal 2)  
cd Frontend/url-shortener/frontend
npm install
npm run dev        # Runs on http://localhost:3001
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Quick Setup

1. **Backend Logging Middleware**:
   ```bash
   cd Backend/logging-middleware
   npm install
   npm run dev
   ```

2. **Frontend URL Shortener**:
   ```bash
   # Terminal 1 - API Server
   cd Frontend/url-shortener/backend
   npm install
   npm start
   
   # Terminal 2 - Web UI
   cd Frontend/url-shortener/frontend  
   npm install
   npm run dev
   ```

3. **Access the Applications**:
   - URL Shortener UI: http://localhost:3001
   - URL Shortener API: http://localhost:3000
   - API Health Check: http://localhost:3000/health

## Technology Stack

### Backend
- **Language**: TypeScript
- **Runtime**: Node.js
- **Framework**: Express.js
- **HTTP Client**: Axios
- **Utilities**: UUID, GeoIP-lite

### Frontend
- **Languages**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Modern CSS with Grid/Flexbox
- **HTTP Client**: Fetch API
- **Development**: Live Server

## Project Goals

This workspace demonstrates:
- **Separation of Concerns**: Clear backend/frontend separation
- **TypeScript Integration**: Strong typing across backend services
- **Modern Web Development**: ES modules, responsive design
- **API Design**: RESTful architecture with proper error handling
- **Development Workflow**: Proper build processes and development servers

## Development Notes

### Backend Development
- Uses TypeScript for type safety
- ES modules for modern JavaScript
- Proper error handling and logging
- CORS configuration for frontend integration

### Frontend Development
- Vanilla JavaScript for performance
- Modern CSS with responsive design
- Component-based architecture
- API integration with error handling

## Author
**Vanapalli Sai Viswanadh**  
Roll No: 22481A12H7  
Afford Medical Technologies Private Limited

## License
ISC License
