/**
 * Makeswift client configuration
 * 
 * Since we're having import issues with @makeswift/runtime, this is a simplified client
 * that only handles the functions we need
 */
import { MAKESWIFT_SITE_API_KEY, MAKESWIFT_API_ORIGIN } from './env';

/**
 * Simple fetch wrapper for Makeswift
 */
class MakeswiftClient {
  private apiKey: string;
  private apiOrigin: string;
  private cache: Map<string, any>;

  constructor(apiKey: string, apiOrigin: string = 'https://api.makeswift.com') {
    this.apiKey = apiKey;
    this.apiOrigin = apiOrigin || 'https://api.makeswift.com';
    this.cache = new Map();
  }

  /**
   * Generate a cache key from path and options
   */
  private getCacheKey(path: string, options: { siteVersion?: string; locale?: string }): string {
    const { siteVersion = 'published', locale = 'en' } = options;
    return `${path}:${siteVersion}:${locale}`;
  }

  /**
   * Get a page snapshot from Makeswift with caching
   */
  async getPageSnapshot(path: string, options: { siteVersion?: string; locale?: string } = {}) {
    const cacheKey = this.getCacheKey(path, options);
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    const { siteVersion = 'published', locale } = options;
    const normalizedPath = path === '/' ? '/' : path.replace(/^\/+|\/+$/g, '');
    
    try {
      console.log(`Fetching Makeswift page for path: ${normalizedPath}`);
      
      // IMPORTANT: For development purposes, always use fallback content
      // Remove this check in production to use the real Makeswift API
      const fallbackData = this.getFallbackPageData(normalizedPath);
      if (fallbackData) {
        console.log(`Using fallback data for path: ${normalizedPath}`);
        // Cache the fallback result
        this.cache.set(cacheKey, fallbackData);
        return fallbackData;
      }
      
      // The code below will only execute if we don't have fallback data for this path
      const url = new URL(`${this.apiOrigin}/api/v1/sites/${this.apiKey}/pages`);
      url.searchParams.append('path', normalizedPath);
      url.searchParams.append('version', siteVersion);
      
      if (locale) {
        url.searchParams.append('locale', locale);
      }
      
      console.log(`Fetching from URL: ${url.toString()}`);
      
      const response = await fetch(url.toString(), {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          console.error(`Page not found for path: ${normalizedPath}`);
          return null;
        }
        throw new Error(`Failed to fetch page: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Cache the result
      this.cache.set(cacheKey, data);
      
      console.log(`Successfully fetched page for path: ${normalizedPath}`);
      return data;
    } catch (error) {
      console.error(`Error fetching Makeswift page for path: ${normalizedPath}:`, error);
      
      // Provide fallback page data for demo purposes if request fails
      const fallbackData = this.getFallbackPageData(normalizedPath);
      if (fallbackData) {
        console.log(`Using fallback data for path: ${normalizedPath}`);
        return fallbackData;
      }
      
      return null;
    }
  }
  
  /**
   * Get fallback page data for demo purposes
   */
  private getFallbackPageData(path: string) {
    // Simple hardcoded pages for testing when API fails
    const pages = {
      '/': {
        document: {
          meta: {
            title: 'Makeswift + Remix Demo - Home',
            description: 'This is a fallback Makeswift demo home page',
          },
          root: {
            type: 'fragment',
            props: {},
            children: [
              {
                type: 'simple-text',
                props: {
                  text: 'Welcome to Makeswift + Remix',
                  color: '#333333',
                  fontSize: 32,
                },
              },
              {
                type: 'content-card',
                props: {
                  title: 'Home Page Card',
                  description: 'This is a demonstration of the content card component on the homepage. It renders dynamic content from Makeswift.',
                  backgroundColor: '#f0f9ff',
                  borderRadius: 8,
                  padding: 24,
                  textAlign: 'center',
                },
              },
              {
                type: 'simple-text',
                props: {
                  text: 'This page is rendering Makeswift components dynamically in Remix!',
                  color: '#0c4a6e',
                  fontSize: 18,
                },
              },
              {
                type: 'content-card',
                props: {
                  title: 'How It Works',
                  description: 'This page demonstrates dynamic rendering of Makeswift components within a Remix application. It uses custom components registered with the Makeswift runtime.',
                  backgroundColor: '#fff1f2',
                  borderRadius: 12,
                  padding: 24,
                  textAlign: 'left',
                },
              }
            ],
          },
        },
      },
      '/about': {
        document: {
          meta: {
            title: 'About Makeswift + Remix Demo',
            description: 'This is a fallback Makeswift about page',
          },
          root: {
            type: 'fragment',
            props: {},
            children: [
              {
                type: 'simple-text',
                props: {
                  text: 'About Makeswift + Remix',
                  color: '#333333',
                  fontSize: 32,
                },
              },
              {
                type: 'content-card',
                props: {
                  title: 'About This Demo',
                  description: 'This is a demonstration of the content card component on the about page. It shows how Makeswift components can be used in Remix applications.',
                  backgroundColor: '#f0fff4',
                  borderRadius: 8,
                  padding: 24,
                  textAlign: 'center',
                },
              },
              {
                type: 'simple-text',
                props: {
                  text: 'Makeswift is a visual page builder that integrates with React frameworks.',
                  color: '#166534',
                  fontSize: 18,
                },
              }
            ],
          },
        },
      },
      '/sample': {
        document: {
          meta: {
            title: 'Sample Page - Makeswift + Remix',
            description: 'This is a sample page demonstrating Makeswift integration',
          },
          root: {
            type: 'fragment',
            props: {},
            children: [
              {
                type: 'simple-text',
                props: {
                  text: 'Sample Makeswift Page',
                  color: '#333333',
                  fontSize: 32,
                },
              },
              {
                type: 'content-card',
                props: {
                  title: 'Sample Content Card',
                  description: 'This is a sample content card to demonstrate how Makeswift components render in a Remix application.',
                  backgroundColor: '#eff6ff',
                  borderRadius: 10,
                  padding: 24,
                  textAlign: 'center',
                },
              },
              {
                type: 'simple-text',
                props: {
                  text: 'You can navigate between different pages to see how dynamic routing works with Makeswift in Remix.',
                  color: '#1e40af',
                  fontSize: 16,
                },
              },
              {
                type: 'content-card',
                props: {
                  title: 'Development Process',
                  description: 'This sample shows how to integrate Makeswift with Remix and handle browser-specific limitations like process.env access.',
                  backgroundColor: '#fdf4ff',
                  borderRadius: 8,
                  padding: 20,
                  textAlign: 'left',
                },
              }
            ],
          },
        },
      },
    };
    
    // Either return the specific page or null if not found
    return pages[path] || null;
  }
}

// Initialize the client
export const client = new MakeswiftClient(
  MAKESWIFT_SITE_API_KEY,
  MAKESWIFT_API_ORIGIN
);