import { ComponentPropsWithoutRef } from 'react'

export function ThirdwebLogo(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      {...props}
      width="20"
      height="14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M.055 1.594C-.145 1.068.227.5.77.5h3.374c.317 0 .598.197.716.502l2.685 7.004a.832.832 0 0 1 0 .592l-1.689 4.398a.76.76 0 0 1-1.431 0L.055 1.595Zm6.517-.024C6.39 1.05 6.762.5 7.296.5h2.94a.77.77 0 0 1 .724.526l2.441 7.004a.861.861 0 0 1 0 .544l-1.467 4.211a.761.761 0 0 1-1.45 0L6.573 1.57ZM13.17.5c-.544 0-.915.568-.716 1.094l4.37 11.402a.76.76 0 0 0 1.431 0l1.69-4.398a.831.831 0 0 0 0-.592L17.26 1.002A.768.768 0 0 0 16.544.5h-3.373Z"
        fill="#000"
        fillOpacity=".2"
      />
    </svg>
  )
}
