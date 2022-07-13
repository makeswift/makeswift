import { ReactRuntime } from '../../react'
import { registerComponent as registerBoxComponent } from './Box'
import { registerComponent as registerButtonComponent } from './Button'
import { registerComponent as registerCarouselComponent } from './Carousel'
import { registerComponent as registerCountdownComponent } from './Countdown'
import { registerComponent as registerDividerComponent } from './Divider'
import { registerComponent as registerEmbedComponent } from './Embed'
import { registerComponent as registerFormComponent } from './Form'
import { registerComponent as registerImageComponent } from './Image'
import { registerComponent as registerNavigationComponent } from './Navigation'
import { registerComponent as registerRootComponent } from './Root/register'
import { registerComponent as registerSocialLinksComponent } from './SocialLinks'
import { registerComponent as registerTextComponent } from './Text'
import { registerComponent as registerVideoComponent } from './Video/register'

export function registerBuiltinComponents(runtime: ReactRuntime) {
  const unregisterBoxComponent = registerBoxComponent(runtime)
  const unregisterButtonComponent = registerButtonComponent(runtime)
  const unregisterCarouselComponent = registerCarouselComponent(runtime)
  const unregisterCountdownComponent = registerCountdownComponent(runtime)
  const unregisterDividerComponent = registerDividerComponent(runtime)
  const unregisterEmbedComponent = registerEmbedComponent(runtime)
  const unregisterFormComponent = registerFormComponent(runtime)
  const unregisterImageComponent = registerImageComponent(runtime)
  const unregisterNavigationComponent = registerNavigationComponent(runtime)
  const unregisterRootComponent = registerRootComponent(runtime)
  const unregisterSocialLinksComponent = registerSocialLinksComponent(runtime)
  const unregisterTextComponent = registerTextComponent(runtime)
  const unregisterVideoComponent = registerVideoComponent(runtime)

  return () => {
    unregisterBoxComponent()
    unregisterButtonComponent()
    unregisterCarouselComponent()
    unregisterCountdownComponent()
    unregisterDividerComponent()
    unregisterEmbedComponent()
    unregisterFormComponent()
    unregisterImageComponent()
    unregisterNavigationComponent()
    unregisterRootComponent()
    unregisterSocialLinksComponent()
    unregisterTextComponent()
    unregisterTextComponent()
    unregisterVideoComponent()
  }
}
