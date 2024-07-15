import { ComponentPropsWithoutRef } from 'react'

export function LogoMedium20(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" {...props}>
      <path d="M2.372 5.264a.79.79 0 0 0-.252-.659L.252 2.34V2H6.05l4.482 9.905L14.473 2H20v.34L18.404 3.88a.47.47 0 0 0-.178.451v11.335a.47.47 0 0 0 .178.452l1.559 1.542v.34H12.12v-.34l1.615-1.58c.159-.16.159-.207.159-.45V6.467L9.403 17.962h-.607L3.566 6.468v7.704c-.043.323.064.65.29.884l2.1 2.568v.338H0v-.338l2.1-2.568a1.03 1.03 0 0 0 .272-.884z" />
    </svg>
  )
}
