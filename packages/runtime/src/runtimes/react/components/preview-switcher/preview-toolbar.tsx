import { useEffect, useMemo, useRef, useState } from 'react'

const styles = `
.floating {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 2147483647;

  box-sizing: border-box;
  display: flex;
  align-items: center;
  background: #0f1225;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  box-shadow: 0 4px 12px 0 rgba(5, 12, 46, 0.15);
}

.preview-toolbar {
  left: 16px;
  gap: 24px;
  max-width: 600px;
  margin: 0 auto;
  padding: 8px 8px 8px 16px;

  font-family: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji',
    'Segoe UI Emoji';
  font-size: 13px;
  line-height: 22px;
}

@keyframes slide-in {
  from {
    transform: translateY(15px);
    opacity: 0;
  }
}

@keyframes slide-in-from-left {
  from {
    transform: translateX(-24px);
    opacity: 0;
  }
}

@keyframes slide-in-from-right {
  from {
    transform: translateX(24px);
    opacity: 0;
  }
}

@keyframes slide-out-to-right {
  to {
    transform: translateX(24px);
    opacity: 0;
  }
}

.preview-toolbar.show {
  animation: slide-in 200ms ease-out;
}

.preview-toolbar.expand {
  animation: slide-in-from-right 200ms ease-out;
}

.preview-toolbar.collapse {
  animation: slide-out-to-right 150ms ease-in forwards;
}

.preview-toolbar-collapsed {
  justify-content: center;
  width: 48px;
  height: 48px;
  padding: 0;
  cursor: pointer;
  animation: slide-in-from-left 200ms ease-out;
  transition: background 150ms;
}

.preview-toolbar-collapsed:focus-visible {
  outline: 2px solid #ffffff;
  outline-offset: 2px;
}

.message {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #f2f3f8;
}

.message > .label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.toolbar-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  border-radius: 6px;
  transition: background 150ms;
}

.toolbar-button:focus-visible {
  outline: 2px solid #ffffff;
  outline-offset: -2px;
}

.preview-toolbar-collapsed:hover,
.toolbar-button:hover {
  background: #272a3b;
}

.view-live {
  padding: 0 10px;
  color: #ffffff;
  font-weight: 600;
  text-decoration: none;
}

.collapse-button {
  width: 30px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.icon {
  flex-shrink: 0;
}
`

function MakeswiftLogoIcon() {
  return (
    <svg className="icon" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M17.9572 15.9364L19.8563 8.8487C20.1257 7.84225 19.839 6.76861 19.1033 6.03157L13.942 0.857616C13.2036 0.117245 12.126 -0.171453 11.1162 0.100615L4.05907 2.00044C3.05328 2.27117 2.26768 3.05744 1.99827 4.0639L0.0997811 11.151C-0.169626 12.1574 0.117076 13.2311 0.852791 13.9681L6.0141 19.1421C6.75248 19.8824 7.83011 20.1711 8.83989 19.8991L15.897 17.9992C16.9028 17.7285 17.6884 16.9422 17.9578 15.9358L17.9572 15.9364Z"
        fill="#EA3BAA"
      />
      <path
        d="M12.8923 4.30537L11.1754 6.84777H12.4193C12.6981 6.84777 12.8697 7.15177 12.7253 7.39058L9.69999 12.3982C9.63546 12.5053 9.51905 12.5712 9.39399 12.5712H8.9523C8.79531 12.5712 8.68156 12.4228 8.72214 12.2712L9.59622 8.99438H8.49131C8.25517 8.99438 8.08421 8.77021 8.14607 8.54271L9.35807 4.09982C9.41462 3.89228 9.60287 3.74859 9.8184 3.74859H12.5963C12.883 3.74859 13.0533 4.06922 12.893 4.3067L12.8923 4.30537ZM9.71063 14.0014H8.15273C7.93587 14.0014 7.74562 14.1477 7.69107 14.3579L7.27931 15.9378C7.22011 16.1646 7.39107 16.3855 7.62522 16.3855H9.17913C9.39599 16.3855 9.58557 16.2391 9.64012 16.0296L10.0552 14.4491C10.1151 14.2222 9.94345 14.0007 9.7093 14.0007L9.71063 14.0014Z"
        fill="white"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg className="icon" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M3 3L9 9M9 3L3 9"
        stroke="#B8BAC7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type ToolbarState = 'shown' | 'collapsing' | 'collapsed' | 'expanding'

const toolbarAnimationClassName: Record<Exclude<ToolbarState, 'collapsed'>, string> = {
  shown: 'show',
  collapsing: 'collapse',
  expanding: 'expand',
}

export function PreviewToolbar() {
  const redirectLiveUrl = useMemo(() => {
    const currentUrl = new URL(window.location.href)
    const destination = `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`
    currentUrl.searchParams.set('makeswift-redirect-live', encodeURIComponent(destination))
    return currentUrl.toString()
  }, [])

  const [state, setState] = useState<ToolbarState>('shown')
  const expandButtonRef = useRef<HTMLButtonElement>(null)
  const collapseButtonRef = useRef<HTMLButtonElement>(null)

  // Keep keyboard focus on the control that toggles back to the previous state
  useEffect(() => {
    if (state === 'collapsed') expandButtonRef.current?.focus()
    if (state === 'expanding') collapseButtonRef.current?.focus()
  }, [state])

  const handleAnimationEnd = () => {
    if (state === 'collapsing') setState('collapsed')
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      {state === 'collapsed' ? (
        <button
          ref={expandButtonRef}
          type="button"
          className="floating preview-toolbar-collapsed"
          aria-label="Expand preview toolbar"
          onClick={() => setState('expanding')}
        >
          <MakeswiftLogoIcon />
        </button>
      ) : (
        <div
          className={`floating preview-toolbar ${toolbarAnimationClassName[state]}`}
          role="region"
          aria-label="Preview mode"
          onAnimationEnd={handleAnimationEnd}
        >
          <div className="message">
            <MakeswiftLogoIcon />
            <span className="label">You are in preview mode</span>
          </div>
          <div className="actions">
            <a className="toolbar-button view-live" href={redirectLiveUrl}>
              View live
            </a>
            <button
              ref={collapseButtonRef}
              type="button"
              className="toolbar-button collapse-button"
              aria-label="Collapse preview toolbar"
              onClick={() => setState('collapsing')}
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
