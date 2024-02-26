import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';

import { client } from '..';
import { graphql } from '../generated';

export const GET_INITIAL_DATA = /* GraphQL */ `
  query getInitialData {
    site {
      settings {
        storeName
        logoV2 {
          __typename
          ... on StoreTextLogo {
            text
          }
          ... on StoreImageLogo {
            image {
              url(width: 155)
              altText
            }
          }
        }
        contact {
          address
          email
          phone
        }
        socialMediaLinks {
          name
          url
        }
        status
        statusMessage
      }
      categoryTree {
        entityId
        name
        path
        children {
          entityId
          name
          path
          children {
            entityId
            name
            path
          }
        }
      }
      content {
        pages {
          edges {
            node {
              ...WebPage
              ... on RawHtmlPage {
                path
              }
              ... on ContactPage {
                path
              }
              ... on NormalPage {
                path
              }
              ... on BlogIndexPage {
                path
              }
              ... on ExternalLinkPage {
                link
              }
            }
          }
        }
      }
      brands(first: 5) {
        edges {
          node {
            entityId
            name
            path
          }
        }
      }
    }
  }
`;

export const getInitialData = async () => {
  const query = graphql(GET_INITIAL_DATA);

  const response = await client.fetch({
    document: query,
    fetchOptions: {
      cache: 'force-cache',
    },
  });

  const { brands, categoryTree, content, settings } = response.data.site;

  if (!settings) {
    throw new Error('No settings found');
  }

  return {
    storeSettings: settings,
    categoryTree,
    webPages: removeEdgesAndNodes(content.pages),
    brands: removeEdgesAndNodes(brands),
  };
};
