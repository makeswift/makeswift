// eslint-disable-next-line check-file/filename-naming-convention
import { MakeswiftApiHandler } from '@makeswift/runtime/next/server';

import { getConfig } from '~/lib/makeswift/config';
import { runtime } from '~/lib/makeswift/runtime';

const config = getConfig();

export default MakeswiftApiHandler(config.makeswift.siteApiKey, { runtime });
