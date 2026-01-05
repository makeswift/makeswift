'use client'

import { useActionState } from 'react'

import { SubmissionResult, getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { clsx } from 'clsx'
import { ArrowRight } from 'lucide-react'

import { FormStatus } from '@/vibes/soul/form/form-status'
import { Button } from '@/vibes/soul/primitives/button'

import { schema } from './schema'

type Action<State, Payload> = (
  prevState: Awaited<State>,
  formData: Payload
) => State | Promise<State>

export interface InlineEmailFormProps {
  className?: string
  placeholder?: string
  submitLabel?: string
  action: Action<{ lastResult: SubmissionResult | null; successMessage?: string }, FormData>
}

/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --inline-email-form-focus: var(--primary);
 *   --inline-email-form-background: var(--background);
 *   --inline-email-form-placeholder: var(--contrast-500);
 *   --inline-email-form-text: var(--foreground);
 *   --inline-email-form-border: var(--black);
 *   --inline-email-form-error: var(--error);
 * }
 * ```
 */
export function InlineEmailForm({
  className,
  action,
  submitLabel = 'Submit',
  placeholder = 'Enter your email',
}: InlineEmailFormProps) {
  const [{ lastResult, successMessage }, formAction, isPending] = useActionState(action, {
    lastResult: null,
  })

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema })
    },
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
  })

  const { errors = [] } = fields.email

  return (
    <form {...getFormProps(form)} action={formAction} className={clsx('space-y-2', className)}>
      <div
        className={clsx(
          'relative rounded-xl border bg-(--inline-email-form-background,var(--background)) text-base transition-colors duration-200 focus-within:border-(--inline-email-form-focus,var(--primary)) focus:outline-hidden',
          errors.length
            ? 'border-(--inline-email-form-error,var(--error))'
            : 'border-(--inline-email-form-border,var(--black))'
        )}
      >
        <input
          {...getInputProps(fields.email, { type: 'email' })}
          className="h-14 w-full bg-transparent pr-16 pl-5 text-(--inline-email-form-text,var(--foreground)) placeholder-(--inline-email-form-placeholder,var(--contrast-500)) placeholder:font-normal focus:outline-hidden"
          data-1p-ignore
          key={fields.email.id}
          placeholder={placeholder}
        />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 pr-2">
          <Button
            aria-label={submitLabel}
            loading={isPending}
            shape="circle"
            size="small"
            type="submit"
            variant="secondary"
          >
            <ArrowRight size={20} strokeWidth={1.5} />
          </Button>
        </div>
      </div>
      <div className="mt-2">
        {errors.map((error, index) => (
          <FormStatus key={index} type="error">
            {error}
          </FormStatus>
        ))}
        {form.status === 'success' && successMessage != null && (
          <FormStatus>{successMessage}</FormStatus>
        )}
      </div>
    </form>
  )
}
