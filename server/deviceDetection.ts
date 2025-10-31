import { Request } from 'express';

export interface DeviceInfo {
  browser: string;
  browserVersion: string;
  os: string;
  device: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
}

export interface LocationInfo {
  ip: string;
  city: string;
  country: string;
  region: string;
  timezone: string;
}

export interface LoginMetadata {
  device: DeviceInfo;
  location: LocationInfo;
  timestamp: Date;
  userAgent: string;
}

// Extract browser information from User-Agent
export function extractBrowserInfo(userAgent: string): DeviceInfo {
  const ua = userAgent.toLowerCase();
  
  let browser = 'Unknown Browser';
  let browserVersion = '';
  let os = 'Unknown OS';
  let device = 'Unknown Device';
  let deviceType: 'Desktop' | 'Mobile' | 'Tablet' = 'Desktop';

  // Detect Browser (order matters - most specific first)
  if (ua.includes('samsungbrowser')) {
    browser = 'Samsung Internet';
    const match = ua.match(/samsungbrowser\/(\d+(\.\d+)?)/);
    browserVersion = match ? match[1] : '';
  } else if (ua.includes('crios')) {
    // iOS Chrome
    browser = 'Chrome';
    const match = ua.match(/crios\/(\d+(\.\d+)?)/);
    browserVersion = match ? match[1] : '';
  } else if (ua.includes('edgios')) {
    // iOS Edge
    browser = 'Microsoft Edge';
    const match = ua.match(/edgios\/(\d+(\.\d+)?)/);
    browserVersion = match ? match[1] : '';
  } else if (ua.includes('edg/') || ua.includes('edge/')) {
    // Modern Edge (Chromium-based) or Legacy Edge
    browser = 'Microsoft Edge';
    const match = ua.match(/(edg|edge)\/(\d+(\.\d+)?)/);
    browserVersion = match ? match[2] : '';
  } else if (ua.includes('opr') || ua.includes('opera')) {
    browser = 'Opera';
    const match = ua.match(/(opr|opera)\/(\d+(\.\d+)?)/);
    browserVersion = match ? match[2] : '';
  } else if (ua.includes('chrome') && !ua.includes('edge') && !ua.includes('edg/') && !ua.includes('opr')) {
    browser = 'Chrome';
    const match = ua.match(/chrome\/(\d+(\.\d+)?)/);
    browserVersion = match ? match[1] : '';
  } else if (ua.includes('firefox')) {
    browser = 'Firefox';
    const match = ua.match(/firefox\/(\d+(\.\d+)?)/);
    browserVersion = match ? match[1] : '';
  } else if (ua.includes('safari') && !ua.includes('chrome') && !ua.includes('crios')) {
    browser = 'Safari';
    const match = ua.match(/version\/(\d+(\.\d+)?)/);
    browserVersion = match ? match[1] : '';
  }

  // Detect Operating System (check iOS BEFORE macOS)
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
    const match = ua.match(/os (\d+[._]\d+)/);
    os = match ? `iOS ${match[1].replace('_', '.')}` : 'iOS';
  } else if (ua.includes('android')) {
    const match = ua.match(/android (\d+(\.\d+)?)/);
    os = match ? `Android ${match[1]}` : 'Android';
  } else if (ua.includes('windows nt 10')) {
    os = 'Windows 10/11';
  } else if (ua.includes('windows nt 6.3')) {
    os = 'Windows 8.1';
  } else if (ua.includes('windows nt 6.2')) {
    os = 'Windows 8';
  } else if (ua.includes('windows nt 6.1')) {
    os = 'Windows 7';
  } else if (ua.includes('windows')) {
    os = 'Windows';
  } else if (ua.includes('mac os x')) {
    const match = ua.match(/mac os x (\d+[._]\d+)/);
    os = match ? `macOS ${match[1].replace('_', '.')}` : 'macOS';
  } else if (ua.includes('linux')) {
    os = 'Linux';
  }

  // Detect Device Type and Device (check specific devices first)
  if (ua.includes('ipad')) {
    deviceType = 'Tablet';
    device = 'iPad';
  } else if (ua.includes('iphone')) {
    deviceType = 'Mobile';
    device = 'iPhone';
  } else if (ua.includes('ipod')) {
    deviceType = 'Mobile';
    device = 'iPod Touch';
  } else if (ua.includes('android') && (ua.includes('mobile') || ua.includes('phone'))) {
    deviceType = 'Mobile';
    device = 'Android Phone';
  } else if (ua.includes('android') && ua.includes('tablet')) {
    deviceType = 'Tablet';
    device = 'Android Tablet';
  } else if (ua.includes('android')) {
    // Default Android to mobile if not specified
    deviceType = 'Mobile';
    device = 'Android Phone';
  } else if (ua.includes('mobile') || ua.includes('phone')) {
    deviceType = 'Mobile';
    device = 'Mobile Device';
  } else if (ua.includes('tablet')) {
    deviceType = 'Tablet';
    device = 'Tablet';
  } else {
    deviceType = 'Desktop';
    if (ua.includes('mac')) {
      device = 'Mac';
    } else if (ua.includes('windows')) {
      device = 'Windows PC';
    } else if (ua.includes('linux')) {
      device = 'Linux PC';
    } else {
      device = 'Desktop Computer';
    }
  }

  return {
    browser,
    browserVersion,
    os,
    device,
    deviceType
  };
}

// Simple IP-based location detection (basic implementation)
// In production, you might want to use a service like MaxMind GeoIP or ipapi.co
export async function getLocationFromIP(ip: string): Promise<LocationInfo> {
  // Handle localhost and development IPs
  if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
    return {
      ip,
      city: 'Local Development',
      country: 'Local',
      region: 'Development Environment',
      timezone: 'Local Time'
    };
  }

  try {
    // Free IP geolocation service (for production, consider paid services)
    // Add 5-second timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,timezone`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    const data = await response.json();
    
    if (data.status === 'success') {
      return {
        ip,
        city: data.city || 'Unknown City',
        country: data.country || 'Unknown Country',
        region: data.regionName || 'Unknown Region',
        timezone: data.timezone || 'Unknown Timezone'
      };
    }
  } catch (error) {
    console.error('Error fetching location data:', error);
  }

  // Fallback for failed requests
  return {
    ip,
    city: 'Unknown City',
    country: 'Unknown Country',
    region: 'Unknown Region',
    timezone: 'Unknown Timezone'
  };
}

// Helper function to extract real client IP behind proxies/CDNs
function getRealClientIP(req: Request): string {
  // Check X-Forwarded-For header first (for proxies/load balancers)
  const xForwardedFor = req.get('X-Forwarded-For');
  if (xForwardedFor) {
    // X-Forwarded-For can contain multiple IPs, use the first one (original client)
    const firstIP = xForwardedFor.split(',')[0].trim();
    if (firstIP) return firstIP;
  }
  
  // Check other common proxy headers
  const xRealIP = req.get('X-Real-IP');
  if (xRealIP) return xRealIP;
  
  const xClientIP = req.get('X-Client-IP');
  if (xClientIP) return xClientIP;
  
  // Fall back to standard Express IP detection
  return req.ip || req.connection.remoteAddress || 'Unknown IP';
}

// Main function to extract all login metadata
export async function extractLoginMetadata(req: Request): Promise<LoginMetadata> {
  const userAgent = req.get('User-Agent') || '';
  const clientIP = getRealClientIP(req);
  
  const device = extractBrowserInfo(userAgent);
  const location = await getLocationFromIP(clientIP);
  
  return {
    device,
    location,
    timestamp: new Date(),
    userAgent
  };
}

// Helper function to format device info for display
export function formatDeviceInfo(device: DeviceInfo): string {
  const browserInfo = device.browserVersion 
    ? `${device.browser} ${device.browserVersion}` 
    : device.browser;
  
  return `${browserInfo} on ${device.os} (${device.device})`;
}

// Helper function to format location info for display
export function formatLocationInfo(location: LocationInfo): string {
  if (location.city === 'Local Development') {
    return 'Local Development Environment';
  }
  
  const parts = [];
  if (location.city && location.city !== 'Unknown City') parts.push(location.city);
  if (location.region && location.region !== 'Unknown Region' && location.region !== location.city) {
    parts.push(location.region);
  }
  if (location.country && location.country !== 'Unknown Country') parts.push(location.country);
  
  return parts.length > 0 ? parts.join(', ') : 'Unknown Location';
}