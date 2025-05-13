/**
 * Revalidation API route for Makeswift
 */
import { json, type ActionFunctionArgs } from '@remix-run/node';
import { MAKESWIFT_REVALIDATION_SECRET } from '~/makeswift/env';

/**
 * Action function to handle revalidation requests
 */
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const secret = formData.get('secret') as string;
  const path = formData.get('path') as string;
  
  // Validate revalidation secret
  if (secret !== MAKESWIFT_REVALIDATION_SECRET) {
    return json({ error: 'Invalid secret' }, { status: 401 });
  }
  
  try {
    // Implementation depends on hosting platform
    // For Vercel, we can use their revalidation endpoint
    const isVercel = typeof process !== 'undefined' && process.env && !!process.env.VERCEL;
    
    if (isVercel) {
      await fetch(`https://${request.headers.get('host')}/_vercel/purge?path=${path}`);
    }
    
    // For other platforms, a custom implementation would be needed
    
    return json({ revalidated: true, path });
  } catch (error) {
    console.error('Revalidation failed:', error);
    return json({ error: 'Revalidation failed' }, { status: 500 });
  }
}