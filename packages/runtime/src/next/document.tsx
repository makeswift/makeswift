'use client'

import NextDocument from 'next/document'

/*
  In the past we exported a custom Document component that had meaningful
  behaviors for the server-side rendering of `<style>` tags. These are no
  longer needed after a rework of our CSS runtime.

  The no-op export is being retained to avoid breaking changes.
*/
export const Document = NextDocument
