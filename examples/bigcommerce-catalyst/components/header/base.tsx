'use client';

import { LogOut, User } from 'lucide-react';
import { signOut } from 'next-auth/react';

import { Button } from '@bigcommerce/components/button';
import {
  NavigationMenu,
  NavigationMenuCollapsed,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuToggle,
} from '@bigcommerce/components/navigation-menu';
import { getStoreSettings } from '~/client/queries/get-store-settings';
import { ExistingResultType } from '~/client/util';
import { Link } from '~/components/link';

import { StoreLogo } from '../store-logo';

type StoreSettings = ExistingResultType<typeof getStoreSettings>;

interface Props {
  cart: React.ReactNode;
  nav: React.ReactNode;
  collapsedNav: React.ReactNode;
  quickSearch: React.ReactNode;
  isLoggedIn: boolean;
  storeSettings: StoreSettings;
}

export const BasePagesHeader = ({
  cart,
  storeSettings,
  nav,
  collapsedNav,
  quickSearch,
  isLoggedIn,
}: Props) => {
  return (
    <header>
      <NavigationMenu>
        <NavigationMenuLink asChild className="px-0">
          <Link href="/">
            <StoreLogo settings={storeSettings} />
          </Link>
        </NavigationMenuLink>

        {nav}

        <div className="flex">
          <NavigationMenuList>
            <NavigationMenuItem>{quickSearch}</NavigationMenuItem>

            <NavigationMenuItem className="hidden lg:flex">
              {isLoggedIn ? (
                <Button
                  className="p-3 text-black hover:bg-transparent"
                  onClick={() => signOut()}
                  type="button"
                  variant="subtle"
                >
                  <LogOut />
                </Button>
              ) : (
                <NavigationMenuLink asChild>
                  <Link aria-label="Login" href="/login">
                    <User />
                  </Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link className="relative" href="/cart">
                  {cart}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>

          <NavigationMenuToggle className="ms-2 lg:hidden" />
        </div>

        <NavigationMenuCollapsed>{collapsedNav}</NavigationMenuCollapsed>
      </NavigationMenu>
    </header>
  );
};
