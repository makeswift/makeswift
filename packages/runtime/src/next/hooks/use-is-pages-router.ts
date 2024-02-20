import { useRouter } from 'next/router'

export function useIsPagesRouter() {
  try {
    useRouter()
    return true
  } catch (error) {
    return false
  }
}
