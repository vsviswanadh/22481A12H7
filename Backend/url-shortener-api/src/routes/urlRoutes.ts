import express from 'express';
import URLService from '../services/urlService.js';
import { CreateUrlRequest } from '../types/index.js';

export const urlRouter = express.Router();

// Create short URL
urlRouter.post('/', async (req, res) => {
  try {
    const createRequest: CreateUrlRequest = req.body;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    const result = await URLService.createShortUrl(createRequest, baseUrl);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error creating URL:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'Failed to create short URL'
    });
  }
});

// Get all URLs with statistics
urlRouter.get('/', (req, res) => {
  try {
    const stats = URLService.getAllStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching URLs:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'Failed to fetch URLs'
    });
  }
});

// Get specific URL statistics
urlRouter.get('/:shortCode/stats', (req, res) => {
  try {
    const { shortCode } = req.params;
    const stats = URLService.getUrlStats(shortCode);
    
    if (stats.url) {
      res.json({
        success: true,
        data: stats
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Short URL not found',
        error: 'The requested short URL does not exist'
      });
    }
  } catch (error) {
    console.error('Error fetching URL stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'Failed to fetch URL statistics'
    });
  }
});
