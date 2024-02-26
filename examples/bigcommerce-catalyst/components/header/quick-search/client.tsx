'use client';

import { useQuery } from '@tanstack/react-query';
import { useDeferredValue, useState } from 'react';

import { getQuickSearchResults } from '~/client/queries/get-quick-search-results';

import { BaseQuickSearch } from './base';

type QuickSearchResults = Awaited<ReturnType<typeof getQuickSearchResults>>;

const fetchQuickSearch = async (query: string) => {
  const response = await fetch(`/api/quick-search?query=${query}`);

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const data = (await response.json()) as QuickSearchResults;

  return data;
};

export const QuickSearch = ({ children }: { children: React.ReactNode }) => {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const { data: results, isFetching } = useQuery({
    queryKey: ['quick-search', deferredQuery],
    queryFn: () => fetchQuickSearch(deferredQuery),
    enabled: deferredQuery.length >= 3,
    initialData: null,
  });

  return (
    <BaseQuickSearch
      onQueryChange={setQuery}
      pending={isFetching}
      query={query}
      searchResults={results}
    >
      {children}
    </BaseQuickSearch>
  );
};
