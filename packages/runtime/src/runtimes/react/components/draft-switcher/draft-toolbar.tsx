const makeswiftIcon =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAACXBIWXMAABcRAAAXEQHKJvM/AAABjElEQVRYhc2XzU3EMBCFB8TddAAXn6EE6GCpgNABZ1/IXnymBOgAOmA7YM8+ABVsXEHQQFaKQryeN3Yk3ilKJtEnv/nLUd/3pFG0riGi88yrnQn+UfJ5FUi0riWiB2H4nQn+KRd0DFP8agXEfkqCYJBoHdtxIQxfm+DfFgEhoith3NYE30o/qgGR2BJB+xY7kdYEL8oNFUi0jiFMJuxVWrJqEMFxsyUNCsE6AeNztvBp7aJ143vXksoRnwhYtmNdSoIQa6RlO9YXEWW7KgoCleOgxgTf1QZBT+RZ2lXFING6UxCCq+ceeUE8fYdknY599v9sJvzGBP+yCEgC7GPmETc0OJ+0awAlkhe2pAbIXAeFZ8xe2g2Nk3c3ub0xwWt6zY9qbmiqGVMbZK21ZC/YmhlbeBMTzZNDQqcvDb1kM1x32iqZSt1HaqukfKvq34BAOTLsrH+ETNmUkKHHA+428RgeclPVWozeSyAI2EdWB34jtqXNTAySOY3i/KgFIlqOa4GkFmBegorzg4joG07he/M7zl6jAAAAAElFTkSuQmCC'

const styles = `
.exit-preview-container {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 2147483647;
}

.exit-preview-button {
  background: #2e2e2e;
  padding: 10px 18px 10px 14px;
  border: 0px;
  border-radius: 32px;
  color: #efefef;
  box-shadow:
    0 11px 40px 0 rgba(0, 0, 0, 0.25),
    0 2px 10px 0 rgba(0, 0, 0, 0.12);
  transition: 150ms;

  font-family: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji',
    'Segoe UI Emoji';
  font-size: 14px;
  cursor: pointer;

  display: flex;
  align-items: center;
  gap: 6px;
}

.exit-preview-button > .label {
  transform: translateY(-1px);
}

.exit-preview-container:hover > .exit-preview-button {
  transform: translateY(-2px);
  box-shadow:
    0 15px 40px 0 rgba(0, 0, 0, 0.3),
    0 6px 10px 0 rgba(0, 0, 0, 0.15);
}
`

type Props = {
  onExitDraft: () => void
}

export function DraftToolbar({ onExitDraft }: Props) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="exit-preview-container">
        <button className="exit-preview-button" onClick={onExitDraft}>
          <img src={makeswiftIcon} alt="Makeswift Logo" width={18} height={18} />
          <span className="label">Exit preview</span>
        </button>
      </div>
    </>
  )
}
