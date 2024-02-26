import { useMemo } from 'react';

import { AvailableWebPages, getWebPages } from '~/client/queries/get-web-pages';
import { ExistingResultType } from '~/client/util';

import { BaseFooterMenu } from './base-footer-menu';

const filterActivePages = (availableStorePages: AvailableWebPages) =>
  availableStorePages.reduce<Array<{ name: string; path: string }>>((visiblePages, currentPage) => {
    if (currentPage.isVisibleInNavigation) {
      const { name, __typename } = currentPage;

      visiblePages.push({
        name,
        path: __typename === 'ExternalLinkPage' ? currentPage.link : currentPage.path,
      });

      return visiblePages;
    }

    return visiblePages;
  }, []);

type WebPages = ExistingResultType<typeof getWebPages>;

interface Props {
  webPages: WebPages;
}

export const WebPageFooterMenu = ({ webPages }: Props) => {
  const items = useMemo(() => filterActivePages(webPages), [webPages]);

  if (items.length > 0) {
    return <BaseFooterMenu items={items} title="About us" />;
  }

  return null;
};
