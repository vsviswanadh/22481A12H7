import express from 'express';
import cors from 'cors';
import { urlRouter } from './routes/urlRoutes.js';
import { clickRouter } from './routes/clickRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3001', 'http://127.0.0.1:3001'], // Frontend server
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/urls', urlRouter);
app.use('/api/clicks', clickRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'URL Shortener API is running' });
});

// Redirect shortened URLs
app.get('/:shortCode', async (req, res) => {
  try {
    const { default: URLService } = await import('./services/urlService.js');
    const result = await URLService.redirectUrl(req.params.shortCode, req);
    
    if (result.success && result.originalUrl) {
      res.redirect(result.originalUrl);
    } else {
      res.status(404).json({ error: 'Short URL not found or expired' });
    }
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 URL Shortener API running on http://localhost:${PORT}`);
});
