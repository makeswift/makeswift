import { type ReactRuntime } from '../../../runtimes/react'
import { registerComponent as registerCarouselComponent } from '../Carousel/register'
import { registerComponent as registerCountdownComponent } from '../Countdown/register'
import { registerComponent as registerDividerComponent } from '../Divider/register'
import { registerComponent as registerEmbedComponent } from '../Embed/register'
import { registerComponent as registerFormComponent } from '../Form/register'
import { registerComponent as registerNavigationComponent } from '../Navigation/register'
import { registerComponent as registerSocialLinksComponent } from '../SocialLinks/register'
import { registerComponent as registerVideoComponent } from '../Video/register'

export function registerDefaultComponents(runtime: ReactRuntime) {
  const unregisterCarouselComponent = registerCarouselComponent(runtime)
  const unregisterCountdownComponent = registerCountdownComponent(runtime)
  const unregisterDividerComponent = registerDividerComponent(runtime)
  const unregisterEmbedComponent = registerEmbedComponent(runtime)
  const unregisterFormComponent = registerFormComponent(runtime)
  const unregisterNavigationComponent = registerNavigationComponent(runtime)
  const unregisterSocialLinksComponent = registerSocialLinksComponent(runtime)
  const unregisterVideoComponent = registerVideoComponent(runtime)

  return () => {
    unregisterCarouselComponent()
    unregisterCountdownComponent()
    unregisterDividerComponent()
    unregisterEmbedComponent()
    unregisterFormComponent()
    unregisterNavigationComponent()
    unregisterSocialLinksComponent()
    unregisterVideoComponent()
  }
}
