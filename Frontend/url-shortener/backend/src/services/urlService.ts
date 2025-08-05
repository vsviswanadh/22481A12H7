import { URL, ClickData, CreateUrlRequest, CreateUrlResponse, RedirectResponse } from '../types/index.js';
import { v4 as uuidv4 } from 'uuid';
import geoip from 'geoip-lite';

class URLService {
  private urls: Map<string, URL> = new Map();
  private clicks: ClickData[] = [];
  private maxUrls = 5; // Maximum concurrent URLs per session

  generateShortCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  validateUrl(url: string): boolean {
    try {
      const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
      return urlPattern.test(url);
    } catch {
      return false;
    }
  }

  validateShortCode(shortCode: string): boolean {
    const shortCodePattern = /^[A-Za-z0-9]{3,10}$/;
    return shortCodePattern.test(shortCode);
  }

  async createShortUrl(request: CreateUrlRequest, baseUrl: string): Promise<CreateUrlResponse> {
    try {
      // Validate original URL
      if (!this.validateUrl(request.originalUrl)) {
        return {
          success: false,
          message: 'Invalid URL format',
          error: 'Please provide a valid URL starting with http:// or https://'
        };
      }

      // Check if we've reached the maximum concurrent URLs
      const activeUrls = Array.from(this.urls.values()).filter(url => url.isActive);
      if (activeUrls.length >= this.maxUrls) {
        return {
          success: false,
          message: 'Maximum concurrent URLs reached',
          error: `You can only have ${this.maxUrls} active short URLs at a time`
        };
      }

      // Validate custom short code if provided
      let shortCode = request.customShortCode;
      if (shortCode) {
        if (!this.validateShortCode(shortCode)) {
          return {
            success: false,
            message: 'Invalid custom short code',
            error: 'Short code must be 3-10 characters long and contain only letters and numbers'
          };
        }

        if (this.urls.has(shortCode)) {
          return {
            success: false,
            message: 'Short code already exists',
            error: 'Please choose a different custom short code'
          };
        }
      } else {
        // Generate unique short code
        do {
          shortCode = this.generateShortCode();
        } while (this.urls.has(shortCode));
      }

      // Validate validity period
      if (request.validityPeriod && (request.validityPeriod < 1 || request.validityPeriod > 525600)) {
        return {
          success: false,
          message: 'Invalid validity period',
          error: 'Validity period must be between 1 minute and 1 year (525600 minutes)'
        };
      }

      const id = uuidv4();
      const createdAt = new Date();
      const expiresAt = request.validityPeriod 
        ? new Date(createdAt.getTime() + request.validityPeriod * 60000)
        : undefined;

      const url: URL = {
        id,
        originalUrl: request.originalUrl,
        shortCode,
        customShortCode: request.customShortCode,
        validityPeriod: request.validityPeriod,
        createdAt,
        expiresAt,
        clickCount: 0,
        isActive: true
      };

      this.urls.set(shortCode, url);

      return {
        success: true,
        message: 'Short URL created successfully',
        data: {
          id,
          originalUrl: request.originalUrl,
          shortCode,
          shortUrl: `${baseUrl}/${shortCode}`,
          createdAt,
          expiresAt
        }
      };
    } catch (error) {
      console.error('Error creating short URL:', error);
      return {
        success: false,
        message: 'Internal server error',
        error: 'Failed to create short URL'
      };
    }
  }

  async redirectUrl(shortCode: string, req: any): Promise<RedirectResponse> {
    try {
      const url = this.urls.get(shortCode);

      if (!url || !url.isActive) {
        return {
          success: false,
          error: 'Short URL not found'
        };
      }

      // Check if URL has expired
      if (url.expiresAt && new Date() > url.expiresAt) {
        url.isActive = false;
        return {
          success: false,
          error: 'Short URL has expired'
        };
      }

      // Record click data
      await this.recordClick(url.id, req);

      // Increment click count
      url.clickCount++;

      return {
        success: true,
        originalUrl: url.originalUrl
      };
    } catch (error) {
      console.error('Error redirecting URL:', error);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  }

  private async recordClick(urlId: string, req: any): Promise<void> {
    try {
      const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
      const userAgent = req.get('User-Agent') || 'unknown';
      const referer = req.get('Referer') || 'direct';
      
      // Get geographical data
      const geo = geoip.lookup(ipAddress);
      
      const clickData: ClickData = {
        id: uuidv4(),
        urlId,
        timestamp: new Date(),
        source: referer,
        userAgent,
        ipAddress,
        country: geo?.country || 'unknown',
        city: geo?.city || 'unknown',
        referer
      };

      this.clicks.push(clickData);
    } catch (error) {
      console.error('Error recording click:', error);
    }
  }

  getAllUrls(): URL[] {
    return Array.from(this.urls.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getUrlStats(shortCode: string): { url: URL | undefined; clicks: ClickData[] } {
    const url = this.urls.get(shortCode);
    const clicks = url ? this.clicks.filter(click => click.urlId === url.id) : [];
    return { url, clicks };
  }

  getAllStats() {
    return {
      urls: this.getAllUrls(),
      totalClicks: this.clicks.length,
      activeUrls: Array.from(this.urls.values()).filter(url => url.isActive).length
    };
  }
}

export default new URLService();
