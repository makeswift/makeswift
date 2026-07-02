// import { useRef } from 'react'

// import { ControlInstance } from '@makeswift/controls'

// import { getPropControllers } from '../../../state/read-only-state'
// import { useDocumentKey } from './use-document-context'
// import { useSelector } from './use-selector'

// export function useControlInstances(elementKey: string): Record<string, ControlInstance> | null {
//   const documentKey = useDocumentKey()
//   const prev = useRef<Record<string, ControlInstance>>(null)

//   return useSelector(state => {
//     if (documentKey == null) return null

//     const result = getPropControllers(state, { documentKey, elementKey })
//     if (result !== prev.current) {
//       console.log(`@@ useControlInstances for ${elementKey}`, result)
//       prev.current = result
//     }
//     return result
//   })
// }

export { useControlInstances } from '../components/control-instances-context'
