/**
 * Draft mode API route for Makeswift
 */
import { 
  json, 
  redirect,
  type ActionFunction,
} from 'react-router-dom';
import { createDraftCookie } from '~/makeswift/utils/cookies';
import { MAKESWIFT_PREVIEW_SECRET } from '~/makeswift/env';
import { MakeswiftSiteVersion } from '@makeswift/runtime';

/**
 * Action function to enable draft mode
 */
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const pathname = formData.get('pathname') as string;
  const secret = formData.get('secret') as string;
  
  // Validate preview secret
  if (secret !== MAKESWIFT_PREVIEW_SECRET) {
    return json({ error: 'Invalid preview secret' }, { status: 401 });
  }
  
  const draftCookie = createDraftCookie();
  
  // Redirect to the requested page with draft mode enabled
  return redirect(pathname || '/', {
    headers: {
      'Set-Cookie': await draftCookie.serialize(MakeswiftSiteVersion.Working)
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