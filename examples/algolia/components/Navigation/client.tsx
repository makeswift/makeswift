'use client'

import Link from 'next/link'
import { useState } from 'react'

import AlgoliaSearch from '../AlgoliaSearch/client'

interface Props {
  className?: string
  links: Array<{
    label: string
    link: { href: string }
  }>
  alignment?: 'left' | 'center' | 'right'
  orientation?: 'horizontal' | 'vertical'
  searchMaxResults?: number
  searchPaginationLimit?: number
}

export function Navigation({
  className = '',
  links = [],
  alignment = 'left',
  orientation = 'horizontal',
  searchMaxResults = 2,
  searchPaginationLimit = 2,
}: Props) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }

  const orientationClasses = {
    horizontal: 'flex-row space-x-8',
    vertical: 'flex-col space-y-4',
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  return (
    <>
      <nav className={`relative ${className}`}>
        <div className="flex items-center justify-between border-b border-gray-100 bg-white/95 px-4 py-4 shadow-sm backdrop-blur-md md:px-6">
          {/* Navigation Links */}
          <ul
            className={`flex items-center ${alignmentClasses[alignment]} ${orientationClasses[orientation]} ${
              orientation === 'horizontal' ? 'hidden sm:flex' : ''
            }`}
          >
            {links.map((item, i) => (
              <li key={i}>
                <Link
                  href={item.link.href}
                  className="relative text-sm font-medium text-gray-700 transition-all duration-300 hover:text-blue-600 md:text-base"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button - Only show on mobile when there are links */}
          {links.length > 0 && (
            <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 transition-all duration-300 hover:bg-gray-100 sm:hidden">
              <svg
                className="h-5 w-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}

          {/* Search Button */}
          <button
            onClick={toggleSearch}
            className="group flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-gray-50 transition-all duration-300 hover:border-blue-200 hover:bg-blue-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Open search"
          >
            <svg
              className="h-5 w-5 text-gray-600 transition-colors duration-300 group-hover:text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Search Dropdown Overlay */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="absolute left-0 right-0 top-0 border-b border-gray-200 bg-white shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative p-4 md:p-6">
              {/* Close Button */}
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close search"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Search Component */}
              <div className="mx-auto max-w-4xl">
                <h2 className="mb-4 pr-8 text-center text-xl font-semibold text-gray-900 md:mb-6 md:text-2xl">
                  Search
                </h2>
                <AlgoliaSearch
                  placeholder="What are you looking for?"
                  paginationLimit={searchPaginationLimit}
                  maxResults={searchMaxResults}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
