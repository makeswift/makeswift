import Image from 'next/image';

import { getStoreSettings } from '~/client/queries/get-store-settings';
import { ExistingResultType } from '~/client/util';

type StoreSettings = ExistingResultType<typeof getStoreSettings>;

interface Props {
  settings: StoreSettings;
}

export const StoreLogo = ({ settings }: Props) => {
  const { logoV2: logo, storeName } = settings;

  if (logo.__typename === 'StoreTextLogo') {
    return <span className="text-2xl font-black">{logo.text}</span>;
  }

  return (
    <Image
      alt={logo.image.altText ? logo.image.altText : storeName}
      height={32}
      priority
      src={logo.image.url}
      width={155}
    />
  );
};
