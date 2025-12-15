// Company Logo Helper
// Automatically fetches company logos from multiple sources

/**
 * Get company logo URL using Clearbit Logo API
 * Clearbit provides high-quality company logos for free
 * 
 * @param website - Company website domain (e.g., "google.com", "microsoft.com")
 * @returns Logo URL
 */
export const getCompanyLogo = (website: string): string => {
  if (!website) return '';
  
  // Clean up the domain
  let domain = website.toLowerCase().trim();
  
  // Remove common prefixes
  domain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '');
  
  // Remove any path, query parameters, or fragments
  domain = domain.split('/')[0].split('?')[0].split('#')[0];
  
  // Remove port numbers if present
  domain = domain.split(':')[0];
  
  // Use Clearbit Logo API - automatically fetches company logos
  // Alternative APIs:
  // - Google Favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
  // - Brandfetch: requires API key
  // - Logo.dev: requires API key
  
  return `https://logo.clearbit.com/${domain}`;
};

/**
 * Common company name to domain mappings for better UX
 * Users can type company names and we'll automatically resolve domains
 */
export const companyDomainMapping: Record<string, string> = {
  // Tech Giants
  'google': 'google.com',
  'microsoft': 'microsoft.com',
  'apple': 'apple.com',
  'amazon': 'amazon.com',
  'meta': 'meta.com',
  'facebook': 'facebook.com',
  'netflix': 'netflix.com',
  'tesla': 'tesla.com',
  'twitter': 'twitter.com',
  'x': 'x.com',
  'linkedin': 'linkedin.com',
  'salesforce': 'salesforce.com',
  'oracle': 'oracle.com',
  'ibm': 'ibm.com',
  'adobe': 'adobe.com',
  'intel': 'intel.com',
  'nvidia': 'nvidia.com',
  'airbnb': 'airbnb.com',
  'uber': 'uber.com',
  'spotify': 'spotify.com',
  'slack': 'slack.com',
  'zoom': 'zoom.us',
  'dropbox': 'dropbox.com',
  'github': 'github.com',
  
  // Finance
  'goldman sachs': 'goldmansachs.com',
  'jpmorgan': 'jpmorganchase.com',
  'morgan stanley': 'morganstanley.com',
  'bank of america': 'bankofamerica.com',
  'wells fargo': 'wellsfargo.com',
  'citigroup': 'citigroup.com',
  
  // Consulting
  'mckinsey': 'mckinsey.com',
  'bain': 'bain.com',
  'bcg': 'bcg.com',
  'deloitte': 'deloitte.com',
  'pwc': 'pwc.com',
  'ey': 'ey.com',
  'kpmg': 'kpmg.com',
  'accenture': 'accenture.com',
  
  // Retail
  'walmart': 'walmart.com',
  'target': 'target.com',
  'costco': 'costco.com',
  'home depot': 'homedepot.com',
  
  // Other Major Companies
  'coca cola': 'coca-cola.com',
  'pepsi': 'pepsi.com',
  'nike': 'nike.com',
  'adidas': 'adidas.com',
  'starbucks': 'starbucks.com',
  'mcdonalds': 'mcdonalds.com',
  'disney': 'disney.com',
  'sony': 'sony.com',
  'samsung': 'samsung.com',
};

/**
 * Smart domain resolver - tries to extract or infer domain from company name
 * 
 * @param input - Company name or website
 * @returns Cleaned domain
 */
export const resolveCompanyDomain = (input: string): string => {
  if (!input) return '';
  
  const normalized = input.toLowerCase().trim();
  
  // Check if it's already a domain
  if (normalized.includes('.')) {
    return normalized.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  }
  
  // Check against known company mappings
  if (companyDomainMapping[normalized]) {
    return companyDomainMapping[normalized];
  }
  
  // Try to guess the domain by appending .com
  return `${normalized.replace(/\s+/g, '')}.com`;
};

/**
 * Fallback SVG icon for when logo fails to load
 */
export const getFallbackLogoSVG = (companyName?: string): string => {
  const initial = companyName?.charAt(0).toUpperCase() || 'C';
  
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%230b3d84' width='100' height='100'/%3E%3Ctext x='50' y='50' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='50' fill='white'%3E${initial}%3C/text%3E%3C/svg%3E`;
};
