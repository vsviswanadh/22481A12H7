# Frontend - URL Shortener UI

This folder contains the frontend user interface for the URL shortener application.

## Structure

```
Frontend/
└── url-shortener-ui/           # Frontend web application
    ├── public/
    │   ├── index.html          # Main URL shortener page
    │   ├── stats.html          # Statistics and analytics page
    │   ├── script.js           # Main page JavaScript
    │   ├── stats.js            # Statistics page JavaScript
    │   └── styles.css          # Responsive CSS styles
    ├── package.json
    └── README.md
```

## Features

### 1. URL Shortener Page (index.html)
- **Functionality**: Create short URLs with optional customization
- **Features**:
  - Input validation for URLs and custom short codes
  - Optional validity period setting (1 minute to 1 year)
  - Real-time form validation with user feedback
  - Success/error message display
  - Recent URLs listing with click counts
  - Copy-to-clipboard functionality
  - Responsive design for mobile and desktop

### 2. Statistics Page (stats.html)
- **Functionality**: View comprehensive analytics for all URLs
- **Features**:
  - Overview dashboard with total URLs, active URLs, and total clicks
  - Detailed table of all shortened URLs
  - Individual URL statistics with click details
  - Geographic location tracking for clicks
  - User agent and referrer information
  - Responsive table design
  - Detailed view modal for each URL

## Technology Stack
- **Languages**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Styling**: Modern CSS with gradients, animations, and responsive design
- **HTTP Client**: Fetch API for backend communication
- **No Framework**: Pure vanilla JavaScript for lightweight performance

## Getting Started

### Prerequisites
- Node.js (for development server)
- Backend API running on http://localhost:3000

### Installation
```bash
cd Frontend/url-shortener-ui
npm install
```

### Development Server
```bash
npm run dev
```
This starts a live development server on http://localhost:3001

### Building for Production
```bash
npm run build
```
Creates a `dist` folder with optimized static files.

### Serving Production Build
```bash
npm run serve
```
Serves the built files on http://localhost:3001

## API Integration

The frontend communicates with the backend API running on `http://localhost:3000`:

- **Base API URL**: `http://localhost:3000`
- **CORS**: Enabled for requests from localhost:3001
- **Content Type**: JSON for all API requests

### API Endpoints Used
- `POST /api/urls` - Create new short URLs
- `GET /api/urls` - Fetch all URLs with statistics
- `GET /api/urls/:shortCode/stats` - Get detailed URL statistics

## Design Features

### Visual Design
- **Color Scheme**: Modern gradient background with purple/blue theme
- **Typography**: Clean, readable fonts with proper hierarchy
- **Layout**: Card-based design with smooth shadows and rounded corners
- **Animations**: Smooth transitions and hover effects

### User Experience
- **Form Validation**: Real-time validation with clear error messages
- **Loading States**: Visual feedback during API requests
- **Copy Functionality**: One-click copying of shortened URLs
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Navigation**: Clear navigation between main page and statistics

### Accessibility
- **Semantic HTML**: Proper HTML structure for screen readers
- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Color Contrast**: High contrast text for readability
- **Error Handling**: Clear error messages for failed operations

## Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **JavaScript Features**: ES6+ features (Fetch API, async/await, classes)
- **CSS Features**: CSS Grid, Flexbox, CSS Custom Properties

## Development Notes

### File Organization
- `index.html` - Main page with URL creation form
- `stats.html` - Analytics and statistics page
- `script.js` - Main page functionality and API integration
- `stats.js` - Statistics page functionality and data visualization
- `styles.css` - Comprehensive styling for both pages

### Key JavaScript Classes
- `URLShortener` - Main page controller class
- `URLStatsManager` - Statistics page controller class

### CSS Architecture
- **Mobile-first**: Responsive design starting from mobile
- **Component-based**: Modular CSS for reusable components
- **Custom Properties**: CSS variables for consistent theming
- **Animation Classes**: Reusable animation utilities

## Customization

### Theming
Colors and design can be easily customized by modifying the CSS custom properties in `styles.css`:

```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #48bb78;
  --error-color: #e53e3e;
}
```

### API Configuration
Backend API URL can be changed by modifying the `apiBaseUrl` property in both JavaScript files.
