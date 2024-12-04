import { Ref, forwardRef } from 'react'

type Props = {
  className?: string
  font?: { fontFamily: string; fontStyle: string; fontWeight: string }
  text?: string
}

export const Button = forwardRef(function Button(
  { className, font, text }: Props,
  ref: Ref<HTMLButtonElement>,
) {
  return (
    <button
      style={{ ...font }}
      className={
        'rounded-md bg-blue-200 prose p-3 h-20 w-full' + ' ' + className
      }
      ref={ref}
    >
      {text ?? 'Dope Button'}
    </button>
  )
})

export default Button
