import React from 'react';
import { Document, MakeswiftPageSnapshot } from '@makeswift/core';
import { ElementRenderer } from './element';

/**
 * Props for the Page component
 */
interface PageProps {
  /** The document to render */
  document: Document;
  
  /** Optional component overrides */
  components?: Record<string, React.ComponentType<any>>;
}

/**
 * Page component that renders a Makeswift document
 */
export function Page({ document, components }: PageProps) {
  return (
    <div className="makeswift-page" data-makeswift-page-id={document.key}>
      <ElementRenderer element={document.rootElement} components={components} />
    </div>
  );
}

/**
 * Props for the PageFromSnapshot component
 */
interface PageFromSnapshotProps {
  /** The page snapshot from the Makeswift API */
  snapshot: MakeswiftPageSnapshot;
  
  /** Optional component overrides */
  components?: Record<string, React.ComponentType<any>>;
}

/**
 * Creates a Document object from a MakeswiftPageSnapshot
 */
function documentFromSnapshot(snapshot: MakeswiftPageSnapshot): Document {
  const { document } = snapshot;
  
  // First try to find a base localized page
  const baseLocalizedPage = document.localizedPages.find(
    ({ parentId }) => parentId == null
  );
  
  // If found, use it as the document
  if (baseLocalizedPage) {
    return {
      key: baseLocalizedPage.elementTreeId,
      rootElement: baseLocalizedPage.data,
      locale: document.locale,
    };
  }
  
  // Otherwise use the document's data as the root element
  return {
    key: document.id,
    rootElement: document.data,
    locale: document.locale,
  };
}

/**
 * Page component that renders a Makeswift page from a snapshot
 */
export function PageFromSnapshot({ snapshot, components }: PageFromSnapshotProps) {
  const document = documentFromSnapshot(snapshot);
  
  return <Page document={document} components={components} />;
}