import 'server-only';

import { ShoppingCart } from 'lucide-react';
import { ReactNode, Suspense } from 'react';

import { getSessionCustomerId } from '~/auth';
import { getStoreSettings } from '~/client/queries/get-store-settings';

import { Cart } from '../cart/server';
import { StoreLogo } from '../store-logo';

import { BasePagesHeader } from './base';
import { HeaderNav } from './header-nav/server';
import { QuickSearch } from './quick-search/server';

const SuspendedCart = ({ children }: { children: ReactNode }) => {
  return <Suspense fallback={<ShoppingCart aria-hidden="true" />}>{children}</Suspense>;
};

export const Header = async () => {
  const [customerId, storeSettings] = await Promise.all([
    getSessionCustomerId(),
    getStoreSettings(),
  ]);

  if (!storeSettings) {
    throw new Error('Store settings not found');
  }

  return (
    <BasePagesHeader
      cart={
        <SuspendedCart>
          <Cart />
        </SuspendedCart>
      }
      collapsedNav={<HeaderNav inCollapsedNav />}
      isLoggedIn={!!customerId}
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
