import { createContext, useContext } from 'react';

import { getInitialData } from '~/client/queries/get-initial-data';
import { ExistingResultType } from '~/client/util';

type BcDataContext = ExistingResultType<typeof getInitialData>;

const BcDataContext = createContext<BcDataContext | null>(null);

export const useBrands = () => {
  const context = useContext(BcDataContext);

  if (!context) {
    throw new Error('useBrands must be used within a BcDataProvider');
  }

  return context.brands;
};

export const useCategoryTree = () => {
  const context = useContext(BcDataContext);

  if (!context) {
    throw new Error('useCategoryTree must be used within a BcDataProvider');
  }

  return context.categoryTree;
};

export const useStoreSettings = () => {
  const context = useContext(BcDataContext);

  if (!context) {
    throw new Error('useStoreSettings must be used within a BcDataProvider');
  }

  return context.storeSettings;
};

export const useWebPages = () => {
  const context = useContext(BcDataContext);

  if (!context) {
    throw new Error('useWebPages must be used within a BcDataProvider');
  }

  return context.webPages;
};

interface Props {
  children: React.ReactNode;
  value: BcDataContext;
}

export const BcDataProvider = ({ children, value }: Props) => {
  return <BcDataContext.Provider value={value}>{children}</BcDataContext.Provider>;
};
