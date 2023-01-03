import Error, { ErrorProps } from 'next/error'
import { useEffect } from 'react'
import OfflinePage from './_offline'

/*
 * This error page catches clientside errors that occur from next-pwa throwing on offline pages that use getStaticProps. Related issue: https://github.com/shadowwalker/next-pwa/issues/440
 * Using an error boundary didn't work.
 * Since I am grouping all errors by adding a _error page, I also added a 404 page to more specifically handle that case.
 */
export default function ErrorPage({ statusCode }: ErrorProps) {
  useEffect(() => {
    if (statusCode == null && window.navigator.onLine === false) {
      window.location.reload()
    }
  }, [statusCode])

  // Returning the offline page prevents a flicker of the error page in the offline case
  return statusCode == null &&
    typeof window !== 'undefined' &&
    window.navigator.onLine === false ? (
    <OfflinePage />
  ) : (
    <Error statusCode={statusCode} />
  )
}
