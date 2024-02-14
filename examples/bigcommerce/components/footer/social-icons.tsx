import {
  SiFacebook,
  SiInstagram,
  SiLinkedin,
  SiPinterest,
  SiX,
  SiYoutube,
} from '@icons-pack/react-simple-icons';

import { FooterNav, FooterNavGroupList, FooterNavLink } from '@bigcommerce/components/footer';
import { getStoreSettings } from '~/client/queries/get-store-settings';
import { ExistingResultType } from '~/client/util';
import { Link } from '~/components/link';

const socialIconNames = [
  'Facebook',
  'Twitter',
  'X',
  'Pinterest',
  'Instagram',
  'LinkedIn',
  'YouTube',
];

const SocialIcon = ({ name }: { name: string }) => {
  switch (name) {
    case 'Facebook':
      return <SiFacebook title="Facebook" />;

    case 'Twitter':
    case 'X':
      return <SiX title="X" />;

    case 'Pinterest':
      return <SiPinterest title="Pinterest" />;

    case 'Instagram':
      return <SiInstagram title="Instagram" />;

    case 'LinkedIn':
      return <SiLinkedin title="LinkedIn" />;

    case 'YouTube':
      return <SiYoutube title="YouTube" />;

    default:
      return null;
  }
};

type StoreSettings = ExistingResultType<typeof getStoreSettings>;

interface Props {
  storeSettings: StoreSettings;
}

export const SocialIcons = ({ storeSettings }: Props) => {
  const socialMediaLinks = storeSettings.socialMediaLinks;

  if (socialMediaLinks.length === 0) {
    return null;
  }

  return (
    <FooterNav aria-label="Social media links" className="block">
      <FooterNavGroupList className="flex-row gap-6">
        {socialMediaLinks.map((link) => {
          if (!socialIconNames.includes(link.name)) {
            return null;
          }

          return (
            <FooterNavLink asChild key={link.name}>
              <Link href={link.url}>
                <SocialIcon name={link.name} />
              </Link>
            </FooterNavLink>
          );
        })}
      </FooterNavGroupList>
    </FooterNav>
  );
};
