'use client'

import { useEffect, useRef } from 'react'
import { useSyncExternalStore } from 'use-sync-external-store/shim'
import {
  File,
  GlobalElement,
  LocalizedGlobalElement,
  PagePathnameSlice,
  Swatch,
  Table,
  Typography,
} from '../../../api'
import { useMakeswiftHostApiClient } from '../../../next/context/makeswift-host-api-client'

export function useSwatch(swatchId: string | null): Swatch | null {
  const client = useMakeswiftHostApiClient()
  const readSwatch = () => (swatchId == null ? null : client.readSwatch(swatchId))
  const swatch = useSyncExternalStore(client.subscribe, readSwatch, readSwatch)

  useEffect(() => {
    if (swatchId != null) client.fetchSwatch(swatchId).catch(console.error)
  }, [client, swatchId])

  return swatch
}

export function useSwatches(swatchIds: string[]): (Swatch | null)[] {
  const client = useMakeswiftHostApiClient()
  const lastSnapshot = useRef<(Swatch | null)[]>()

  function getSnapshot() {
    const swatches = swatchIds.map(swatchId => client.readSwatch(swatchId))

    if (
      lastSnapshot.current != null &&
      lastSnapshot.current.length === swatches.length &&
      lastSnapshot.current.every((swatch, idx) => swatches[idx] === swatch)
    ) {
      return lastSnapshot.current
    }

    return (lastSnapshot.current = swatches)
  }

  const swatches = useSyncExternalStore(client.subscribe, getSnapshot, getSnapshot)

  useEffect(() => {
    Promise.all(swatchIds.map(swatchId => client.fetchSwatch(swatchId))).catch(console.error)
  }, [client, swatchIds])

  return swatches
}

export function useFile(fileId: string | null): File | null {
  const client = useMakeswiftHostApiClient()
  const readFile = () => (fileId == null ? null : client.readFile(fileId))
  const file = useSyncExternalStore(client.subscribe, readFile, readFile)

  useEffect(() => {
    if (fileId != null) client.fetchFile(fileId)
  }, [client, fileId])

  return file
}

export function useFiles(fileIds: string[]): (File | null)[] {
  const client = useMakeswiftHostApiClient()
  const lastSnapshot = useRef<(File | null)[]>()

  function getSnapshot() {
    const files = fileIds.map(fileId => client.readFile(fileId))

    if (
      lastSnapshot.current != null &&
      lastSnapshot.current.length === files.length &&
      lastSnapshot.current.every((file, idx) => files[idx] === file)
    ) {
      return lastSnapshot.current
    }

    return (lastSnapshot.current = files)
  }

  const files = useSyncExternalStore(client.subscribe, getSnapshot, getSnapshot)

  useEffect(() => {
    Promise.all(fileIds.map(fileId => client.fetchFile(fileId))).catch(console.error)
  }, [client, fileIds])

  return files
}

export function useTypography(typographyId: string | null): Typography | null {
  const client = useMakeswiftHostApiClient()
  const readTypography = () => (typographyId == null ? null : client.readTypography(typographyId))
  const typography = useSyncExternalStore(client.subscribe, readTypography, readTypography)

  useEffect(() => {
    if (typographyId != null) client.fetchTypography(typographyId).catch(console.error)
  }, [client, typographyId])

  return typography
}

export function useGlobalElement(globalElementId: string | null): GlobalElement | null {
  const client = useMakeswiftHostApiClient()
  const readGlobalElement = () =>
    globalElementId == null ? null : client.readGlobalElement(globalElementId)
  const globalElement = useSyncExternalStore(client.subscribe, readGlobalElement, readGlobalElement)

  useEffect(() => {
    if (globalElementId != null) client.fetchGlobalElement(globalElementId).catch(console.error)
  }, [client, globalElementId])

  return globalElement
}

export function useLocalizedGlobalElement(
  globalElementId: string | null,
): LocalizedGlobalElement | null {
  const client = useMakeswiftHostApiClient()
  const readLocalizedGlobalElement = () =>
    globalElementId == null ? null : client.readLocalizedGlobalElement(globalElementId)
  const localizedGlobalElement = useSyncExternalStore(
    client.subscribe,
    readLocalizedGlobalElement,
    readLocalizedGlobalElement,
  )

  useEffect(() => {
    if (globalElementId != null) {
      client.fetchLocalizedGlobalElement(globalElementId).catch(console.error)
    }
  }, [client, globalElementId])

  return localizedGlobalElement
}

export function usePagePathnameSlice(pageId: string | null): PagePathnameSlice | null {
  const client = useMakeswiftHostApiClient()
  const readPagePathnameSlice = () => (pageId == null ? null : client.readPagePathnameSlice(pageId))
  const pagePathnameSlice = useSyncExternalStore(
    client.subscribe,
    readPagePathnameSlice,
    readPagePathnameSlice,
  )

  useEffect(() => {
    if (pageId != null) client.fetchPagePathnameSlice(pageId).catch(console.error)
  }, [client, pageId])

  return pagePathnameSlice
}

export function useTable(tableId: string | null): Table | null {
  const client = useMakeswiftHostApiClient()
  const readTable = () => (tableId == null ? null : client.readTable(tableId))
  const table = useSyncExternalStore(client.subscribe, readTable, readTable)

  useEffect(() => {
    if (tableId != null) client.fetchTable(tableId).catch(console.error)
  }, [client, tableId])

  return table
}
