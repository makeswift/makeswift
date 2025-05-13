/**
 * Webhook handler for Makeswift
 */
import { 
  type ActionFunction,
} from 'react-router-dom';
import { 
  MAKESWIFT_SITE_API_KEY,
  MAKESWIFT_REVALIDATION_SECRET 
} from '~/makeswift/env';

interface WebhookPayload {
  type: string;
  data: Record<string, any>;
}

/**
 * Action function to handle Makeswift webhooks
 */
export const action: ActionFunction = async ({ request }) => {
  // Verify the request is from Makeswift
  const apiKey = request.headers.get('x-makeswift-site-api-key');
  
  if (apiKey !== MAKESWIFT_SITE_API_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
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
            secret: MAKESWIFT_REVALIDATION_SECRET,
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
            secret: MAKESWIFT_REVALIDATION_SECRET,
            path: pathname,
          }),
        });
        break;
      }
      
      default:
        // Log unknown webhook type
        console.log(`Received webhook of type: ${payload.type}`);
    }
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ error: 'Webhook processing failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

/**
 * Component for the webhook route
 * (This is mainly for structure, the actual functionality is in the action)
 */
export default function Webhook() {
  return (
    <div>
      <h1>Webhook API</h1>
      <p>This endpoint receives webhooks from Makeswift.</p>
    </div>
  );
}