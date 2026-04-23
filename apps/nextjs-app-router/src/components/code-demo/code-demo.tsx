import { Ref, forwardRef } from 'react'

type Props = {
  className?: string
  htmlCode?: string
  cssCode?: string
  tsCode?: string
}

export const CodeDemo = forwardRef(function CodeDemo(
  { className, htmlCode, cssCode, tsCode }: Props,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <div
      className={'flex flex-col gap-4 p-4 w-full' + ' ' + className}
      ref={ref}
    >
      <section>
        <h3 className="text-sm font-semibold mb-1">HTML</h3>
        <pre className="rounded bg-gray-100 p-3 text-sm whitespace-pre-wrap break-words">
          <code>{htmlCode ?? '(empty)'}</code>
        </pre>
      </section>

      <section>
        <h3 className="text-sm font-semibold mb-1">CSS</h3>
        <pre className="rounded bg-gray-100 p-3 text-sm whitespace-pre-wrap break-words">
          <code>{cssCode ?? '(empty)'}</code>
        </pre>
      </section>

      <section>
        <h3 className="text-sm font-semibold mb-1">TypeScript</h3>
        <pre className="rounded bg-gray-100 p-3 text-sm whitespace-pre-wrap break-words">
          <code>{tsCode ?? '(empty)'}</code>
        </pre>
      </section>
    </div>
  )
})

export default CodeDemo
