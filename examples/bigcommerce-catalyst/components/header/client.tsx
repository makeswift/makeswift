'use client';

import { useSession } from 'next-auth/react';

import { useStoreSettings } from '~/providers/bc-data-provider';

import { Cart } from '../cart/client';
import { StoreLogo } from '../store-logo';

import { BasePagesHeader } from './base';
import { HeaderNav } from './header-nav/client';
import { QuickSearch } from './quick-search/client';

export const PagesHeader = () => {
  const { status } = useSession();
  const storeSettings = useStoreSettings();

  return (
    <BasePagesHeader
      cart={<Cart />}
      collapsedNav={<HeaderNav inCollapsedNav />}
      isLoggedIn={status === 'authenticated'}
      nav={<HeaderNav className="hidden lg:flex" />}
      quickSearch={
        <QuickSearch>
          <StoreLogo settings={storeSettings} />
        </QuickSearch>
      }
      storeSettings={storeSettings}
    />
  );
};
