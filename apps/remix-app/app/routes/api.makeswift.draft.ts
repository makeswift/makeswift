/**
 * Draft mode API route for Makeswift
 */
import { json, type ActionFunctionArgs, redirect } from '@remix-run/node';
import { createDraftCookie } from '~/makeswift/utils/cookies';
import { MAKESWIFT_PREVIEW_SECRET } from '~/makeswift/env';
import { MakeswiftSiteVersion } from '@makeswift/runtime';

/**
 * Action function to enable draft mode
 */
export async function action({ request }: ActionFunctionArgs) {
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
}