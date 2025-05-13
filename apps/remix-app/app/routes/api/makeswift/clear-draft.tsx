/**
 * Clear draft mode API route for Makeswift
 */
import { 
  redirect,
  type ActionFunction,
} from 'react-router-dom';
import { createDraftCookie } from '~/makeswift/utils/cookies';

/**
 * Action function to clear draft mode
 */
export const action: ActionFunction = async ({ request }) => {
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
};

/**
 * Component for the clear-draft route
 * (This is mainly for structure, the actual functionality is in the action)
 */
export default function ClearDraft() {
  return (
    <div>
      <h1>Clear Draft Mode API</h1>
      <p>This endpoint is used to disable draft mode.</p>
    </div>
  );
}