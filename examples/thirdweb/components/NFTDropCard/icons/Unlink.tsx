import { ComponentPropsWithoutRef } from 'react'

export function Unlink(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg {...props} width="16" height="16" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 3V0h1v3H4Zm9.268-1.025a2.5 2.5 0 0 0-3.536 0L6.854 4.854l-.708-.708 2.88-2.878a3.5 3.5 0 0 1 4.949 0l.757.757a3.5 3.5 0 0 1 0 4.95l-2.878 2.879-.708-.708 2.88-2.878a2.5 2.5 0 0 0 0-3.536l-.758-.757ZM12 16v-3h-1v3h1ZM3 5H0V4h3v1Zm13 6h-3v1h3v-1ZM2.732 14.025a2.5 2.5 0 0 0 3.536 0l2.878-2.879.708.708-2.88 2.878a3.5 3.5 0 0 1-4.949 0l-.757-.757a3.5 3.5 0 0 1 0-4.95l2.878-2.879.708.708-2.88 2.878a2.5 2.5 0 0 0 0 3.536l.758.757Zm7.414-8.879-5 5 .708.708 5-5-.708-.708Z"
      />
    </svg>
  )
}
