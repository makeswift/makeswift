/**
 * API handler for Makeswift in Remix
 */
import { MakeswiftSiteVersion } from '@makeswift/runtime';
import { json, redirect } from '@remix-run/node';
import { createDraftCookie } from './cookies';

/**
 * Configuration for MakeswiftApiHandler
 */
export interface MakeswiftApiHandlerConfig {
  /** Makeswift site API key */
  apiKey: string;
  
  /** Secret for enabling preview mode */
  previewSecret?: string;
  
  /** Secret for revalidation */
  revalidationSecret?: string;
  
  /** Function to revalidate a path (platform-specific) */
  revalidate?: (path: string) => Promise<void>;
}

/**
 * Makeswift API handler for Remix
 * 
 * Centralizes all API route handling for Makeswift in Remix apps
 */
export class MakeswiftApiHandler {
  private config: MakeswiftApiHandlerConfig;
  
  constructor(config: MakeswiftApiHandlerConfig) {
    this.config = config;
  }
  
  /**
   * Handles draft mode requests
   */
  async handleDraft(request: Request) {
    const formData = await request.formData();
    const pathname = formData.get('pathname') as string || '/';
    const secret = formData.get('secret') as string;
    
    // Validate preview secret
    if (this.config.previewSecret && secret !== this.config.previewSecret) {
      return json({ error: 'Invalid preview secret' }, { status: 401 });
    }
    
    const draftCookie = createDraftCookie();
    
    // Redirect to the requested page with draft mode enabled
    return redirect(pathname, {
      headers: {
        'Set-Cookie': await draftCookie.serialize(MakeswiftSiteVersion.Working)
      }
    });
  }
  
  /**
   * Handles clear draft mode requests
   */
  async handleClearDraft(request: Request) {
    const formData = await request.formData();
    const returnTo = formData.get('returnTo') as string || '/';
    
    const draftCookie = createDraftCookie();
    
    // Redirect to the return path with draft mode cookie cleared
    return redirect(returnTo, {
      headers: {
        'Set-Cookie': await draftCookie.serialize('', {
          maxAge: 0, // Expire the cookie
        })
      }
    });
  }
  
  /**
   * Handles revalidation requests
   */
  async handleRevalidate(request: Request) {
    const formData = await request.formData();
    const secret = formData.get('secret') as string;
    const path = formData.get('path') as string;
    
    // Validate revalidation secret
    if (this.config.revalidationSecret && secret !== this.config.revalidationSecret) {
      return json({ error: 'Invalid secret' }, { status: 401 });
    }
    
    try {
      if (this.config.revalidate) {
        await this.config.revalidate(path);
      } else {
        // Default implementation - platform-specific implementations should be provided
        console.warn('No revalidation function provided. Implement platform-specific revalidation.');
      }
      
      return json({ revalidated: true, path });
    } catch (error) {
      console.error('Revalidation failed:', error);
      return json({ error: 'Revalidation failed' }, { status: 500 });
    }
  }
  
  /**
   * Handles webhook requests
   */
  async handleWebhook(request: Request) {
    // Verify the request is from Makeswift
    const apiKey = request.headers.get('x-makeswift-site-api-key');
    
    if (apiKey !== this.config.apiKey) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    try {
      const payload = await request.json();
      
      // Handle different webhook types
      switch (payload.type) {
        case 'site.published': {
          // Trigger revalidation for the entire site
          if (this.config.revalidate) {
            await this.config.revalidate('/*');
          }
          break;
        }
        
        case 'page.published': {
          // Trigger revalidation for a specific page
          const { pathname } = payload.data;
          if (this.config.revalidate && pathname) {
            await this.config.revalidate(pathname);
          }
          break;
        }
        
        default:
          // Log unknown webhook type
          console.log(`Received webhook of type: ${payload.type}`);
      }
      
      return json({ success: true });
    } catch (error) {
      console.error('Error processing webhook:', error);
      return json({ error: 'Webhook processing failed' }, { status: 500 });
    }
  }
  
  /**
   * Route handler map for all Makeswift API routes
   */
  routeHandlers = {
    draft: this.handleDraft.bind(this),
    'clear-draft': this.handleClearDraft.bind(this),
    revalidate: this.handleRevalidate.bind(this),
    webhook: this.handleWebhook.bind(this),
  };
  
  /**
   * Handles an API request based on the path
   */
  async handleRequest(request: Request, route: string) {
    const handler = this.routeHandlers[route as keyof typeof this.routeHandlers];
    
    if (!handler) {
      return json({ error: 'Not found' }, { status: 404 });
    }
    
    return handler(request);
  }
}