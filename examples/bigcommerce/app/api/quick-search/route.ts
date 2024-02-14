import { NextRequest, NextResponse } from 'next/server';

import { getQuickSearchResults } from '~/client/queries/get-quick-search-results';

export const GET = async (request: NextRequest) => {
  const query = request.nextUrl.searchParams.get('query');

  if (!query) {
    return new Response('Missing query.', { status: 400 });
  }

  const searchResults = await getQuickSearchResults({
    searchTerm: query,
    imageHeight: 150,
    imageWidth: 150,
  });

  return NextResponse.json(searchResults);
};

export const runtime = 'edge';
