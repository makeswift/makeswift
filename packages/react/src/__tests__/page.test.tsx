import React from 'react';
import { render, screen } from '@testing-library/react';
import { Page, PageFromSnapshot } from '../page';
import { Document, MakeswiftPageSnapshot } from '@makeswift/core';

// Mock the ElementRenderer component
jest.mock('../element/renderer', () => ({
  ElementRenderer: ({ element }: any) => (
    <div data-testid="mocked-element-renderer" data-element-key={element.key}>
      {element.type}
    </div>
  ),
}));

describe('Page', () => {
  it('should render a document correctly', () => {
    const document: Document = {
      key: 'page-id',
      rootElement: {
        key: 'root-element',
        type: 'Root',
        props: {},
      },
      locale: 'en-US',
    };

    render(<Page document={document} />);

    const page = screen.getByClassName('makeswift-page');
    expect(page).toBeInTheDocument();
    expect(page).toHaveAttribute('data-makeswift-page-id', 'page-id');

    const elementRenderer = screen.getByTestId('mocked-element-renderer');
    expect(elementRenderer).toBeInTheDocument();
    expect(elementRenderer).toHaveAttribute('data-element-key', 'root-element');
  });

  it('should render a page from snapshot correctly', () => {
    const snapshot: MakeswiftPageSnapshot = {
      document: {
        id: 'page-id',
        site: { id: 'site-id' },
        data: {
          key: 'root-element',
          type: 'Root',
          props: {},
        },
        snippets: [],
        fonts: [],
        meta: {},
        seo: {},
        localizedPages: [],
        locale: 'en-US',
      },
      cacheData: {
        apiResources: {
          Swatch: [],
          File: [],
          Typography: [],
          Table: [],
          PagePathnameSlice: [],
          GlobalElement: [],
          LocalizedGlobalElement: [],
        },
        localizedResourcesMap: {},
      },
    };

    render(<PageFromSnapshot snapshot={snapshot} />);

    const page = screen.getByClassName('makeswift-page');
    expect(page).toBeInTheDocument();
    expect(page).toHaveAttribute('data-makeswift-page-id', 'page-id');

    const elementRenderer = screen.getByTestId('mocked-element-renderer');
    expect(elementRenderer).toBeInTheDocument();
    expect(elementRenderer).toHaveAttribute('data-element-key', 'root-element');
  });

  it('should handle localized pages in snapshot', () => {
    const snapshot: MakeswiftPageSnapshot = {
      document: {
        id: 'page-id',
        site: { id: 'site-id' },
        data: {
          key: 'root-element',
          type: 'Root',
          props: {},
        },
        snippets: [],
        fonts: [],
        meta: {},
        seo: {},
        localizedPages: [
          {
            id: 'localized-page-id',
            elementTreeId: 'localized-element-tree-id',
            parentId: null, // base localized page
            data: {
              key: 'localized-root-element',
              type: 'LocalizedRoot',
              props: {},
            },
            meta: {},
            seo: {},
          },
        ],
        locale: 'fr-FR',
      },
      cacheData: {
        apiResources: {
          Swatch: [],
          File: [],
          Typography: [],
          Table: [],
          PagePathnameSlice: [],
          GlobalElement: [],
          LocalizedGlobalElement: [],
        },
        localizedResourcesMap: {},
      },
    };

    render(<PageFromSnapshot snapshot={snapshot} />);

    const page = screen.getByClassName('makeswift-page');
    expect(page).toBeInTheDocument();
    expect(page).toHaveAttribute('data-makeswift-page-id', 'localized-element-tree-id');

    const elementRenderer = screen.getByTestId('mocked-element-renderer');
    expect(elementRenderer).toBeInTheDocument();
    expect(elementRenderer).toHaveAttribute('data-element-key', 'localized-root-element');
  });
});