import { ReactElement, useEffect, useRef, useState } from "react"

import clsx from "clsx"
import { createRoot } from "react-dom/client"
import tailwindConfig from "tailwind.config.js"
import resolveConfig from "tailwindcss/resolveConfig"

import { useGoogleMaps } from "./GoogleMapsProvider"

const { theme } = resolveConfig(tailwindConfig)

export type Location = {
  position: { lat: number; lng: number }
  title: string
}

export type Marker = {
  location: Location
  infoWindowContent: ReactElement
}

type MarkersState = {
  mapMarker: google.maps.Marker
  marker: Marker
}[]

interface Props {
  className?: string
  markers?: Marker[]
  options?: google.maps.MapOptions
}

const defaultOptions: google.maps.MapOptions = {
  center: { lat: 34.052802636549195, lng: -118.25381242506454 },
  zoom: 5,
  streetViewControl: false,
  mapTypeControlOptions: { mapTypeIds: [] },
  fullscreenControl: false,
  styles: [
    {
      elementType: "geometry",
      stylers: [{ color: "#1d2c4d" }],
    },
    {
      elementType: "labels.text.fill",
      stylers: [{ color: "#8ec3b9" }],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [{ color: "#1a3646" }],
    },
    {
      featureType: "administrative.country",
      elementType: "geometry.stroke",
      stylers: [{ color: "#4b6878" }],
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "labels.text.fill",
      stylers: [{ color: "#64779e" }],
    },
    {
      featureType: "administrative.province",
      elementType: "geometry.stroke",
      stylers: [{ color: "#4b6878" }],
    },
    {
      featureType: "landscape.man_made",
      elementType: "geometry.stroke",
      stylers: [{ color: "#334e87" }],
    },
    {
      featureType: "landscape.natural",
      elementType: "geometry",
      stylers: [{ color: "#023e58" }],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ color: "#283d6a" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6f9ba5" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#1d2c4d" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry.fill",
      stylers: [{ color: "#023e58" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#3C7680" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#304a7d" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#98a5be" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#1d2c4d" }],
    },
    {
      featureType: "road.arterial",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#2c6675" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#255763" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#b0d5ce" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#023e58" }],
    },
    {
      featureType: "road.local",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      elementType: "labels.text.fill",
      stylers: [{ color: "#98a5be" }],
    },
    {
      featureType: "transit",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#1d2c4d" }],
    },
    {
      featureType: "transit.line",
      elementType: "geometry.fill",
      stylers: [{ color: "#283d6a" }],
    },
    {
      featureType: "transit.station",
      elementType: "geometry",
      stylers: [{ color: "#3a4762" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#0e1626" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#4e6d70" }],
    },
  ],
}

export function GoogleMaps({ className, markers, options }: Props) {
  const googleMaps = useGoogleMaps()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!googleMaps || !ref.current) return

    const map = new googleMaps.Map(ref.current, {
      ...defaultOptions,
      ...(options ?? {}),
      center: options?.center ?? defaultOptions.center,
    })

    const infoWindow = new googleMaps.InfoWindow()

    markers?.forEach(marker => {
      const mapMarker = new googleMaps.Marker({
        ...marker.location,
        map,
        icon: "/marker.svg",
      })

      mapMarker.addListener("click", () => {
        const content = document.createElement("div")
        const element = createRoot(content)

        element.render(marker.infoWindowContent ?? <div>Content not provided.</div>)
        infoWindow.setContent(content)
        infoWindow.open(map, mapMarker)
      })
    })

    map.addListener("drag", () => {
      infoWindow.close()
    })
  }, [googleMaps, markers, options])

  return <div className={clsx(className, "h-full")} ref={ref}></div>
}
