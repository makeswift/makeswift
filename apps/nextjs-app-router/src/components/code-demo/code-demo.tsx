import { Ref, forwardRef } from 'react'

type CodeProp = { value: string } | undefined

type Props = {
  className?: string
  htmlCode?: CodeProp
  cssCode?: CodeProp
  tsCode?: CodeProp
  bashCode?: CodeProp
}

function Section({ title, code }: { title: string; code: CodeProp }) {
  return (
    <section>
      <h3 className="text-sm font-semibold mb-1">{title}</h3>
      <pre className="rounded bg-gray-100 p-3 text-sm whitespace-pre-wrap break-words">
        <code>{code?.value ?? '(empty)'}</code>
      </pre>
    </section>
  )
}

export const CodeDemo = forwardRef(function CodeDemo(
  { className, htmlCode, cssCode, tsCode, bashCode }: Props,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <div
      className={`flex flex-col gap-4 p-4 w-full ${className ?? ''}`}
      ref={ref}
    >
      <Section title="HTML" code={htmlCode} />
      <Section title="CSS" code={cssCode} />
      <Section title="TypeScript" code={tsCode} />
      <Section title="Bash" code={bashCode} />
    </div>
  )
})

export default CodeDemo
