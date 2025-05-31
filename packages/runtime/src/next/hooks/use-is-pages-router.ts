// import { useRouter } from 'next/router'

export function useIsPagesRouter() {
  // switch to `next/compat/router` once we drop support for Next.js 14:
  // https://nextjs.org/docs/pages/api-reference/functions/use-router#the-nextcompatrouter-export
  try {
    // DECOUPLE_TODO:
    // useRouter()
    return true
  } catch (error) {
    return false
  }
}
