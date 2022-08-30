import {
  ComponentType,
  createElement,
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
} from 'react'

const FORWARDED_NEXT_DYNAMIC_REF_KEY = '__forwarded_next_dynamic_ref__'

type WithSavedForwardedRef<P, T> = P & {
  [FORWARDED_NEXT_DYNAMIC_REF_KEY]: ForwardedRef<T>
}

function saveForwardedRef<P, T>(props: P, ref: ForwardedRef<T>): WithSavedForwardedRef<P, T> {
  return { ...props, [FORWARDED_NEXT_DYNAMIC_REF_KEY]: ref }
}

type WithLoadedForwardedRef<P, T> = Omit<P, typeof FORWARDED_NEXT_DYNAMIC_REF_KEY> & {
  ref: ForwardedRef<T>
}

function loadForwardedRef<P, T>({
  [FORWARDED_NEXT_DYNAMIC_REF_KEY]: ref,
  ...props
}: WithSavedForwardedRef<P, T>): WithLoadedForwardedRef<P, T> {
  return { ...props, ref }
}

type LoaderComponent<P> = Promise<ComponentType<P> | { default: ComponentType<P> }>

function resolve(obj: any) {
  return obj && obj.__esModule ? obj.default : obj
}

type PatchedLoaderComponent<P, T> = LoaderComponent<WithSavedForwardedRef<P, T>>

type PatchLoaderComponent = <P, T>(
  loaderComponent: LoaderComponent<P>,
) => PatchedLoaderComponent<P, T>

export function forwardNextDynamicRef<T, P>(
  nextDynamicThunk: (patch: PatchLoaderComponent) => ComponentType<WithSavedForwardedRef<P, T>>,
): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>> {
  const Dynamic = nextDynamicThunk(loaderComponent =>
    loaderComponent.then(moduleOrComponent => ({
      __esModule: true,
      default: props => createElement(resolve(moduleOrComponent), loadForwardedRef(props)),
    })),
  )

  return forwardRef<T, P>((props, ref) => <Dynamic {...saveForwardedRef(props, ref)} />)
}
