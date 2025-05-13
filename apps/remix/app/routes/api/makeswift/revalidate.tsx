/**
 * Revalidation API route for Makeswift
 */
import { 
  type ActionFunction,
} from 'react-router-dom';
import { MAKESWIFT_REVALIDATION_SECRET } from '~/makeswift/env';

/**
 * Action function to handle revalidation requests
 */
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const secret = formData.get('secret') as string;
  const path = formData.get('path') as string;
  
  // Validate revalidation secret
  if (secret !== MAKESWIFT_REVALIDATION_SECRET) {
    return new Response(JSON.stringify({ error: 'Invalid secret' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Implementation depends on hosting platform
    // For Vercel, we can use their revalidation endpoint
    const isVercel = typeof process !== 'undefined' && process.env && !!process.env.VERCEL;
    
    if (isVercel) {
      await fetch(`https://${request.headers.get('host')}/_vercel/purge?path=${path}`);
    }
    
    // For other platforms, a custom implementation would be needed
    
    return new Response(JSON.stringify({ revalidated: true, path }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Revalidation failed:', error);
    return new Response(JSON.stringify({ error: 'Revalidation failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

/**
 * Component for the revalidate route
 * (This is mainly for structure, the actual functionality is in the action)
 */
export default function Revalidate() {
  return (
    <div>
      <h1>Revalidation API</h1>
      <p>This endpoint is used to revalidate pages after content changes.</p>
    </div>
  );
}