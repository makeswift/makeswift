import { useMemo } from 'react'

const styles = `
.preview-toolbar {
  position: fixed;
  bottom: 16px;
  left: 16px;
  right: 16px;
  z-index: 2147483647;

  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 24px;
  max-width: 600px;
  margin: 0 auto;
  padding: 8px 8px 8px 16px;
  background: #0f1225;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  box-shadow: 0 4px 12px 0 rgba(5, 12, 46, 0.15);

  font-family: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji',
    'Segoe UI Emoji';
  font-size: 13px;
  line-height: 22px;
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

.view-live {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 30px;
  padding: 0 10px;
  border-radius: 6px;
  color: #ffffff;
  font-weight: 600;
  text-decoration: none;
  transition: background 150ms;
}

.view-live:hover {
  background: rgba(255, 255, 255, 0.1);
}

.view-live:focus-visible {
  outline: 2px solid #ffffff;
  outline-offset: -2px;
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

function ArrowRightIcon() {
  return (
    <svg className="icon" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M1 5C0.447716 5 0 5.44771 0 6C0 6.55228 0.447716 7 1 7H8.58579L6.29289 9.29289C5.90237 9.68342 5.90237 10.3166 6.29289 10.7071C6.68342 11.0976 7.31658 11.0976 7.70711 10.7071L11.7071 6.70711C11.8946 6.51957 12 6.26522 12 6C12 5.73478 11.8946 5.48043 11.7071 5.29289L7.70711 1.29289C7.31658 0.902369 6.68342 0.902369 6.29289 1.29289C5.90237 1.68342 5.90237 2.31658 6.29289 2.70711L8.58579 5H1Z"
        fill="#B8BAC7"
      />
    </svg>
  )
}

export function PreviewToolbar() {
  const redirectLiveUrl = useMemo(() => {
    const currentUrl = new URL(window.location.href)
    const destination = `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`
    currentUrl.searchParams.set('makeswift-redirect-live', encodeURIComponent(destination))
    return currentUrl.toString()
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="preview-toolbar" role="region" aria-label="Preview mode">
        <div className="message">
          <MakeswiftLogoIcon />
          <span className="label">You are in preview mode</span>
        </div>
        <a className="view-live" href={redirectLiveUrl}>
          <span>View live</span>
          <ArrowRightIcon />
        </a>
      </div>
    </>
  )
}
