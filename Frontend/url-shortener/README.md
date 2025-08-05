# URL Shortener Application

A full-stack URL shortening application with click analytics, built with Express.js and vanilla JavaScript.

## Project Structure

```
url-shortener/
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── server.ts          # Main server file
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   └── types/             # TypeScript type definitions
│   ├── dist/                  # Compiled JavaScript
│   ├── package.json
│   └── tsconfig.json
└── frontend/                  # Web UI
    ├── public/
    │   ├── index.html         # Main application page
    │   ├── stats.html         # Analytics dashboard
    │   ├── script.js          # Main application logic
    │   ├── stats.js           # Analytics functionality
    │   └── styles.css         # Styling
    ├── package.json
    └── package-lock.json
```

## Features

### Backend API
- **URL Shortening**: Convert long URLs to short codes
- **Click Tracking**: Record analytics for each click
- **Geographic Analysis**: Track visitor locations
- **RESTful API**: Clean endpoints for frontend integration

### Frontend Web Application
- **Responsive Design**: Works on desktop and mobile
- **Real-time Analytics**: View click statistics and geographic data
- **User-friendly Interface**: Simple form-based URL shortening
- **Statistics Dashboard**: Detailed analytics for shortened URLs

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The web application will be available at `http://localhost:8080`

## API Endpoints

- `POST /api/urls` - Create a shortened URL
- `GET /api/urls` - Get all URLs with analytics
- `GET /api/urls/:id` - Get specific URL details
- `GET /:shortCode` - Redirect to original URL (tracks analytics)

## Development

### Backend
- Built with TypeScript and Express.js
- Uses UUID for unique short codes
- Tracks geographic data with geoip-lite
- CORS enabled for frontend integration

### Frontend
- Vanilla JavaScript (ES6+)
- Modular class-based architecture
- Responsive CSS Grid and Flexbox
- Live server for development

## Analytics Features

- **Click Count**: Total clicks per URL
- **Geographic Data**: Country-based visitor tracking
- **Time Tracking**: Creation and last access timestamps
- **Referrer Information**: Track traffic sources

## Contributing

1. Make changes to the TypeScript source files in `backend/src/`
2. The development server will automatically compile and restart
3. Test the frontend integration with the API
4. Ensure both backend and frontend servers are running for full functionality

## License

This project is part of Afford Medical Technologies' internal tools.
