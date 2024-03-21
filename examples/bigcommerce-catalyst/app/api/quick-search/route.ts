import { NextRequest, NextResponse } from 'next/server';

import { getQuickSearchResults } from '~/client/queries/get-quick-search-results';

export const GET = async (request: NextRequest) => {
  const query = request.nextUrl.searchParams.get('query');
  const categoryEntityId = request.nextUrl.searchParams.get('categoryId');
  const imageHeight = request.nextUrl.searchParams.get('imageHeight');
  const imageWidth = request.nextUrl.searchParams.get('imageWidth');
  const limit = request.nextUrl.searchParams.get('limit');

  const searchResults = await getQuickSearchResults({
    searchTerm: query ? query : undefined,
    categoryEntityId: categoryEntityId ? parseInt(categoryEntityId, 10) : undefined,
    imageHeight: imageHeight ? parseInt(imageHeight, 10) : 150,
    imageWidth: imageWidth ? parseInt(imageWidth, 10) : 150,
    first: limit ? parseInt(limit, 10) : 10,
  });

  return NextResponse.json(searchResults);
};

export const runtime = 'edge';
