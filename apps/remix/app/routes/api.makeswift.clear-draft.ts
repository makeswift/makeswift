/**
 * Clear draft mode API route for Makeswift
 */
import { type ActionFunctionArgs, redirect } from '@remix-run/node';
import { createDraftCookie } from '~/makeswift/utils/cookies';

/**
 * Action function to clear draft mode
 */
export async function action({ request }: ActionFunctionArgs) {
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