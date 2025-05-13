/**
 * Webhook handler for Makeswift
 */
import { json, type ActionFunctionArgs } from '@remix-run/node';
import { MAKESWIFT_SITE_API_KEY } from '~/makeswift/env';

interface WebhookPayload {
  type: string;
  data: Record<string, any>;
}

/**
 * Action function to handle Makeswift webhooks
 */
export async function action({ request }: ActionFunctionArgs) {
  // Verify the request is from Makeswift
  const apiKey = request.headers.get('x-makeswift-site-api-key');
  
  if (apiKey !== MAKESWIFT_SITE_API_KEY) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const payload = await request.json() as WebhookPayload;
    
    // Handle different webhook types
    switch (payload.type) {
      case 'site.published': {
        // Trigger revalidation for the entire site
        // This is a simplified approach; in production you might want to be more selective
        const host = request.headers.get('host');
        await fetch(`https://${host}/api/makeswift/revalidate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            secret: process.env.MAKESWIFT_REVALIDATION_SECRET,
            path: '/*', // Revalidate all pages
          }),
        });
        break;
      }
      
      case 'page.published': {
        // Trigger revalidation for a specific page
        const { pathname } = payload.data;
        const host = request.headers.get('host');
        await fetch(`https://${host}/api/makeswift/revalidate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            secret: process.env.MAKESWIFT_REVALIDATION_SECRET,
            path: pathname,
          }),
        });
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