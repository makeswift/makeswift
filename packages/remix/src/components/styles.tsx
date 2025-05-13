/**
 * Component for including Makeswift styles in Remix apps
 */
import React from 'react';

/**
 * MakeswiftStyles component props
 */
interface MakeswiftStylesProps {
  /** Additional CSS to include */
  additionalCss?: string;
}

/**
 * Component for including Makeswift styles in the document head
 */
export function MakeswiftStyles({ additionalCss = '' }: MakeswiftStylesProps) {
  return (
    <>
      <link 
        rel="stylesheet" 
        href="https://cdn.makeswift.com/static/styles.css" 
      />
      {additionalCss && (
        <style dangerouslySetInnerHTML={{ __html: additionalCss }} />
      )}
    </>
  );
}