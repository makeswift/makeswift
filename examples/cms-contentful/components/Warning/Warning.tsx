import { ReactNode } from 'react'

import clsx from 'clsx'

export function Warning({ className, children }: { className?: string; children?: ReactNode }) {
	return <p className={clsx('text py-4 text-center text-gray-700', className)}>{children}</p>
}
