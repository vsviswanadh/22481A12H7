export interface URL {
  id: string;
  originalUrl: string;
  shortCode: string;
  customShortCode?: string;
  validityPeriod?: number; // in minutes
  createdAt: Date;
  expiresAt?: Date;
  clickCount: number;
  isActive: boolean;
}

export interface ClickData {
  id: string;
  urlId: string;
  timestamp: Date;
  source: string;
  userAgent: string;
  ipAddress: string;
  country?: string;
  city?: string;
  referer?: string;
}

export interface CreateUrlRequest {
  originalUrl: string;
  customShortCode?: string;
  validityPeriod?: number; // in minutes
}

export interface CreateUrlResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    originalUrl: string;
    shortCode: string;
    shortUrl: string;
    createdAt: Date;
    expiresAt?: Date;
  };
  error?: string;
}

export interface RedirectResponse {
  success: boolean;
  originalUrl?: string;
  error?: string;
}
