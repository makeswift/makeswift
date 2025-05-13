/**
 * Draft mode API route for Makeswift
 */
import { 
  redirect,
  type ActionFunction,
} from 'react-router-dom';
import { createDraftCookie } from '~/makeswift/utils/cookies';
import { MAKESWIFT_PREVIEW_SECRET } from '~/makeswift/env';
// Using string literals directly to avoid import issues
// const MakeswiftSiteVersion = { Working: 'current', Live: 'published' };

/**
 * Action function to enable draft mode
 */
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const pathname = formData.get('pathname') as string;
  const secret = formData.get('secret') as string;
  
  // Validate preview secret
  if (secret !== MAKESWIFT_PREVIEW_SECRET) {
    return new Response(JSON.stringify({ error: 'Invalid preview secret' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const draftCookie = createDraftCookie();
  
  // Redirect to the requested page with draft mode enabled
  return redirect(pathname || '/', {
    headers: {
      'Set-Cookie': await draftCookie.serialize('current')
    }
  });
};

/**
 * Component for the draft route 
 * (This is mainly for structure, the actual functionality is in the action)
 */
export default function Draft() {
  return (
    <div>
      <h1>Draft Mode API</h1>
      <p>This endpoint is used to enable draft mode.</p>
    </div>
  );
}