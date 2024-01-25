import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import HelloWorldApp from '@/app/hello-world-app/page'
import HelloWorldPage from '@/pages/hello-world-page'

describe('Hello World test', () => {
  it('renders a heading containing the right text', () => {
    // No good way to render layout here without manually rendering,
    // and updating the container option to not be a `body` tag
    const appScreen = render(<HelloWorldApp />)
    const appHeading = appScreen.getByRole('heading', { level: 1 })
    // Not working as expected with tailwind styles. Styles are default.
    // const styles = window.getComputedStyles()

    // Kinda weird I have to do this.
    appScreen.unmount()

    const pagesScreen = render(<HelloWorldPage />)
    const pageHeading = pagesScreen.getByRole('heading', { level: 1 })

    expect(appHeading.textContent).toBe(pageHeading.textContent)
    expect(appHeading.isEqualNode(pageHeading)).toBe(true)
  })
})
