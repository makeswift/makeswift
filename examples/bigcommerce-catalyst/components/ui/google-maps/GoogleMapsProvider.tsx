import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react"

import Script from "next/script"

import { Loader } from "@googlemaps/js-api-loader"

const Context = createContext<typeof google.maps | null>(null)

type Props = {
  apiKey: string
  children: React.ReactNode
}
export function GoogleMapsProvider({ apiKey, children }: Props) {
  const loader = useRef(
    new Loader({
      apiKey,
      version: "weekly",
      libraries: ["places"],
    })
  )

  const [googleMaps, setGoogleMaps] = useState<typeof google.maps | null>(null)

  useEffect(() => {
    loader.current.load().then(() => {
      setGoogleMaps(google.maps)
    })
  }, [])

  return <Context.Provider value={googleMaps}>{children}</Context.Provider>
}

export function useGoogleMaps() {
  const context = useContext(Context)

  if (context === undefined) {
    throw new Error("useGoogleMaps must be used within a GoogleMapsProvider")
  }

  return context
}
