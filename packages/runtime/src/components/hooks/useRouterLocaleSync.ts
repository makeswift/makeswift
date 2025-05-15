// import { useRouter as usePagesRouter } from 'next/router'
import { P, match } from 'ts-pattern'
import { useEffect } from 'react'

import { setLocale } from '../../state/actions'
import { useDispatch } from '../../runtimes/react/hooks/use-dispatch'

function useRouter() {
  return

  // DECOUPLE_TODO:
  // try {
  //   const router = usePagesRouter()

  //   return router
  // } catch (e) {
  //   return
  // }
}

export const useRouterLocaleSync = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    match(router)
      .with({ locale: P.string }, ({ locale }) => dispatch(setLocale(new Intl.Locale(locale))))
      .otherwise(() => {})
  }, [router])
}
