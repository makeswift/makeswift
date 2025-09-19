import { type ReactRuntime } from '../../../runtimes/react'
import { registerComponent as registerBoxComponent } from '../Box/register'
import { registerComponent as registerButtonComponent } from '../Button/register'
import { registerComponent as registerImageComponent } from '../Image/register'
import { registerComponent as registerRootComponent } from '../Root/register'
import { registerComponent as registerSlotComponent } from '../Slot/register'
import { registerComponent as registerTextComponent } from '../Text/register'

import { registerComponent as registerCarouselComponent } from '../Carousel/register'

export function registerCoreComponents(runtime: ReactRuntime) {
  const unregisterBoxComponent = registerBoxComponent(runtime)
  const unregisterButtonComponent = registerButtonComponent(runtime)
  const unregisterImageComponent = registerImageComponent(runtime)
  const unregisterTextComponent = registerTextComponent(runtime)
  const unregisterRootComponent = registerRootComponent(runtime)
  const unregisterSlotComponent = registerSlotComponent(runtime)
  const unregisterCarouselComponent = registerCarouselComponent(runtime)

  return () => {
    unregisterBoxComponent()
    unregisterButtonComponent()
    unregisterImageComponent()
    unregisterTextComponent()
    unregisterRootComponent()
    unregisterSlotComponent()
    unregisterCarouselComponent()
  }
}
