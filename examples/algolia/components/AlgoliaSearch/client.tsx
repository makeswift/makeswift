'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { type KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Configure, useHits, useInstantSearch, useSearchBox } from 'react-instantsearch'
import { InstantSearchNext } from 'react-instantsearch-nextjs'

import clsx from 'clsx'
import { env } from 'env'
import debounce from 'lodash.debounce'
import { Spinner } from 'vibes/soul/primitives/spinner'

import algoliaClient from '@/lib/algolia/client'
import { useClickOutside } from '@/lib/utils'

interface AlgoliaSearchProps {
  className?: string
  placeholder?: string
  maxResults?: number
  paginationLimit?: number
  indexName?: string
  show?: boolean
}

type SearchHit = {
  objectID: string
  title: string
  description: string
  image?: string
  url: string
  __position: number
  __queryID?: string
} & Record<string, unknown>

interface SearchInputProps {
  placeholder?: string
  show?: boolean
  maxResults?: number
  paginationLimit?: number
}

interface HitsProps {
  className?: string
  setShowHits: (isFocused: boolean) => void
  maxResults?: number
  paginationLimit?: number
  selectedIndex: number
  setSelectedIndex: (index: number | ((prev: number) => number)) => void
  onHitSelect?: (hit: SearchHit) => void
  shown: number
  setShown: (value: number | ((prev: number) => number)) => void
}

// Custom SearchBox component that actually connects to Algolia
const SearchInput = React.memo(
  ({ placeholder, show = false, maxResults = 8, paginationLimit = 8 }: SearchInputProps) => {
    const [showHits, setShowHits] = useState(show)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const [inputValue, setInputValue] = useState('')
    const [shown, setShown] = useState(maxResults)
    const { refine, query } = useSearchBox()
    const { results } = useHits<SearchHit>()
    const inputRef = useRef<HTMLInputElement | null>(null)
    const router = useRouter()

    // Reset pagination when query changes
    useEffect(() => {
      setShown(maxResults)
    }, [query, maxResults])

    // Calculate the actual number of visible hits for keyboard navigation
    const visibleHitsCount = useMemo(() => {
      if (!results?.hits) return 0
      return Math.min(shown, results.hits.length)
    }, [results?.hits, shown])

    // Scroll selected item into view when selectedIndex changes
    useEffect(() => {
      if (selectedIndex >= 0 && results?.hits?.[selectedIndex]) {
        const selectedElement = document.getElementById(
          `hit-${results.hits[selectedIndex].objectID}`
        )
        if (selectedElement) {
          selectedElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          })
        }
      }
    }, [selectedIndex, results?.hits])

    const handleHitSelect = useCallback(
      (hit: SearchHit) => {
        setShowHits(false)
        setSelectedIndex(-1)
        setInputValue('')
        if (hit.url) {
          router.push(hit.url)
        }
      },
      [setShowHits, router]
    )

    useEffect(() => {
      if (show && inputRef.current) {
        inputRef.current.focus()
        inputRef.current.select()
      }
      if (!show) {
        setShowHits(false)
        setSelectedIndex(-1)
        setInputValue('')
      }
    }, [show])

    const debouncedRefine = useMemo(
      () =>
        debounce((query: string) => {
          refine(query)
        }, 250),
      [refine]
    )

    useEffect(() => {
      return () => {
        debouncedRefine.cancel()
      }
    }, [debouncedRefine])

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setInputValue(value)

        // Reset selected index when typing
        setSelectedIndex(-1)

        if (value.length > 0) {
          setShowHits(true)
        } else {
          setShowHits(false)
        }

        debouncedRefine(value)
      },
      [debouncedRefine]
    )

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (!showHits || !results?.hits) return

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault()
            setSelectedIndex(prev => {
              if (prev === -1) return 0

              const nextIndex = prev < visibleHitsCount - 1 ? prev + 1 : prev
              return nextIndex
            })
            break
          case 'ArrowUp':
            e.preventDefault()
            setSelectedIndex(prev => {
              if (prev <= 0) return -1

              return prev - 1
            })
            break
          case 'Enter':
            e.preventDefault()
            if (selectedIndex >= 0 && results.hits[selectedIndex]) {
              handleHitSelect(results.hits[selectedIndex] as SearchHit)
            }
            break
          case 'Escape':
            e.preventDefault()
            setShowHits(false)
            setSelectedIndex(-1)
            inputRef.current?.blur()
            break
          case 'Home':
            if (visibleHitsCount > 0) {
              e.preventDefault()
              setSelectedIndex(0)
            }
            break
          case 'End':
            if (visibleHitsCount > 0) {
              e.preventDefault()
              setSelectedIndex(visibleHitsCount - 1)
            }
            break
        }
      },
      [showHits, results?.hits, visibleHitsCount, selectedIndex, handleHitSelect]
    )

    const handleFocusOrClick = useCallback(() => {
      if (inputValue.length > 0) {
        setShowHits(true)
      }
    }, [inputValue])

    return (
      <div className="relative w-full">
        {/* Search icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-label="Search"
          aria-autocomplete="list"
          aria-expanded={showHits}
          aria-controls={showHits ? 'search-results' : undefined}
          aria-activedescendant={
            showHits && selectedIndex >= 0 && results?.hits?.[selectedIndex]
              ? `hit-${results.hits[selectedIndex].objectID}`
              : undefined
          }
          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-4 pl-12 pr-4 text-lg text-gray-700 transition-all duration-200 placeholder:text-gray-400 focus:border-transparent focus:bg-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          placeholder={placeholder || 'Search...'}
          spellCheck={false}
          maxLength={512}
          value={inputValue}
          onClick={handleFocusOrClick}
          onFocus={handleFocusOrClick}
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
          name="search"
        />

        {showHits && (
          <Hits
            setShowHits={setShowHits}
            maxResults={maxResults}
            paginationLimit={paginationLimit}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            onHitSelect={handleHitSelect}
            shown={shown}
            setShown={setShown}
          />
        )}
      </div>
    )
  }
)

SearchInput.displayName = 'SearchInput'

const ErrorState = React.memo(({ message }: { message: string }) => {
  return (
    <div className="flex w-full justify-center p-10" role="alert">
      <div className="text-center text-red-600">
        <p className="font-semibold">Search Error</p>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  )
})

ErrorState.displayName = 'ErrorState'

const Hits = React.memo(
  ({
    setShowHits,
    paginationLimit = 8,
    selectedIndex,
    setSelectedIndex,
    onHitSelect,
    shown,
    setShown,
  }: HitsProps) => {
    const { results, sendEvent } = useHits<SearchHit>()
    const { query } = useSearchBox()
    const { status, error } = useInstantSearch({ catchError: true })

    const router = useRouter()
    const olRef = useRef<HTMLDivElement>(null)

    useClickOutside(
      olRef,
      useCallback(() => setShowHits(false), [setShowHits])
    )

    const hitsToShow = useMemo(() => {
      if (!results?.hits) return []
      return results.hits.slice(0, shown)
    }, [results?.hits, shown])

    const handleHitClick = useCallback(
      (hit: SearchHit) => {
        sendEvent('click', hit, 'Hit Clicked')
        if (onHitSelect) {
          onHitSelect(hit)
        } else {
          setShowHits(false)
          if (hit.url) {
            router.push(hit.url)
          }
        }
      },
      [setShowHits, sendEvent, router, onHitSelect]
    )

    const handleShowMore = useCallback(() => {
      setShown(prev => Math.min(prev + paginationLimit, results?.hits?.length || 0))
    }, [results?.hits?.length, paginationLimit, setShown])

    if (status === 'loading' || status === 'stalled') {
      return <Spinner />
    }

    if (error) {
      return <ErrorState message="Unable to load search results. Please try again later." />
    }

    if (!results) {
      return <Spinner />
    }

    return (
      <div
        className="absolute top-full z-50 mt-2 w-full rounded-xl bg-white shadow-xl ring-1 ring-gray-200"
        ref={olRef}
        tabIndex={-1}
      >
        <ol
          id="search-results"
          role="listbox"
          aria-label="Search results"
          className="flex w-full flex-col"
        >
          {hitsToShow.length === 0 ? (
            <div className="p-4 text-center text-gray-600" role="status">
              {query ? `We couldn't find anything for "${query}"` : 'Start typing to search...'}
            </div>
          ) : (
            hitsToShow.map((hit, index) => (
              <li
                key={hit.objectID}
                id={`hit-${hit.objectID}`}
                role="option"
                aria-selected={index === selectedIndex}
                onMouseDown={() => handleHitClick(hit)}
                onMouseEnter={() => setSelectedIndex(index)}
                onMouseLeave={() => setSelectedIndex(-1)}
                className={clsx(
                  'cursor-pointer border-b border-gray-100 p-4 text-gray-600 duration-200 last:border-b-0',
                  index === selectedIndex
                    ? 'bg-blue-50 text-gray-900'
                    : 'hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <div className="flex items-start gap-3">
                  {hit.image && (
                    <Image src={hit.image} alt="" loading="lazy" width={48} height={48} />
                  )}
                  <div className="flex flex-1 flex-col gap-1">
                    <h3 className="line-clamp-1 font-medium text-blue-600">{hit.title}</h3>
                    <p className="line-clamp-2 text-sm text-gray-600">{hit.description}</p>
                    {hit.url && <p className="line-clamp-1 text-xs text-gray-400">{hit.url}</p>}
                  </div>
                </div>
              </li>
            ))
          )}
        </ol>

        {shown < (results?.hits?.length || 0) && (
          <div className="border-t border-gray-100 px-4 py-2">
            <button
              onClick={handleShowMore}
              className="w-full rounded-md px-4 py-2 text-sm text-blue-600 transition-colors hover:bg-blue-50"
              type="button"
            >
              Show {Math.min(paginationLimit, (results?.hits?.length || 0) - shown)} more results
            </button>
          </div>
        )}

        {hitsToShow.length > 0 && (
          <div className="border-t border-gray-100 px-4 py-2 text-xs text-gray-500">
            {results?.hits?.length || 0} result{(results?.hits?.length || 0) !== 1 ? 's' : ''} found
          </div>
        )}
      </div>
    )
  }
)

Hits.displayName = 'Hits'

export default function AlgoliaSearch({
  className,
  placeholder = 'Search',
  maxResults = 8,
  paginationLimit = 8,
  indexName,
  show = false,
}: AlgoliaSearchProps) {
  const resolvedIndexName = indexName || env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME

  return (
    <div className={className}>
      <InstantSearchNext searchClient={algoliaClient} indexName={resolvedIndexName}>
        <Configure
          hitsPerPage={20}
          attributesToRetrieve={['objectID', 'title', 'description', 'image', 'url']}
          attributesToHighlight={['title', 'description']}
          typoTolerance={true}
          removeWordsIfNoResults="allOptional"
        />
        <SearchInput
          placeholder={placeholder}
          maxResults={maxResults}
          paginationLimit={paginationLimit}
          show={show}
        />
      </InstantSearchNext>
    </div>
  )
}
