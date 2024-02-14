'use client';

import { useDeferredValue, useEffect, useState } from 'react';

import { Link } from '~/components/link';

import { getSearchResults } from './_actions/get-search-results';
import { BaseQuickSearch } from './base';

type SearchResults = Awaited<ReturnType<typeof getSearchResults>>;

export const QuickSearch = ({ children }: { children: React.ReactNode }) => {
  const [results, setResults] = useState<SearchResults | null>(null);
  const [pending, setPending] = useState(false);
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    if (deferredQuery.length < 3) {
      setResults(null);

      return;
    }

    const fetchResults = async () => {
      setPending(true);

      const data = await getSearchResults(deferredQuery);

      setResults(data);
      setPending(false);
    };

    void fetchResults();
  }, [deferredQuery]);

  return (
    <BaseQuickSearch
      onQueryChange={setQuery}
      pending={pending}
      query={query}
      searchResults={results}
    >
      <Link className="flex focus:outline-none focus:ring-4 focus:ring-blue-primary/20" href="/">
        {children}
      </Link>
    </BaseQuickSearch>
  );
};
