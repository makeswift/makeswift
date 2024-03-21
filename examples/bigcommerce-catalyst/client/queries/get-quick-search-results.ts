import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { cache } from 'react';

import { getSessionCustomerId } from '~/auth';

import { client } from '..';
import { graphql } from '../generated';

interface QuickSearch {
  searchTerm?: string;
  categoryEntityId?: number;
  imageWidth?: number;
  imageHeight?: number;
  first?: number;
}

const GET_QUICK_SEARCH_RESULTS_QUERY = /* GraphQL */ `
  query getQuickSearchResults(
    $filters: SearchProductsFiltersInput!
    $imageHeight: Int!
    $imageWidth: Int!
    $first: Int
  ) {
    site {
      search {
        searchProducts(filters: $filters) {
          products(first: $first) {
            edges {
              node {
                ...ProductDetails
              }
            }
          }
        }
      }
    }
  }
`;

export const getQuickSearchResults = cache(
  async ({ searchTerm, imageHeight = 300, imageWidth = 300, categoryEntityId, first = 5 }: QuickSearch) => {
    const query = graphql(GET_QUICK_SEARCH_RESULTS_QUERY);
    const customerId = await getSessionCustomerId();

    const response = await client.fetch({
      document: query,
      variables: { filters: { searchTerm, categoryEntityId }, imageHeight, imageWidth, first },
      customerId,
      fetchOptions: {
        cache: customerId ? 'no-store' : 'force-cache',
      },
    });

    const { products } = response.data.site.search.searchProducts;

    return {
      products: removeEdgesAndNodes(products),
    };
  },
);
