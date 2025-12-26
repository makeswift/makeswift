'use client'

import Link from 'next/link'
import { useState } from 'react'

import { CloseIcon, MenuIcon, SearchIcon } from '@/vibes/soul/primitives/icons'

import AlgoliaSearch from '../AlgoliaSearch/client'

interface Props {
  className?: string
  links: Array<{
    label: string
    link?: { href: string }
  }>
  alignment?: 'left' | 'center' | 'right'
  orientation?: 'horizontal' | 'vertical'
  searchMaxResults?: number
  searchPaginationLimit?: number
  algoliaIndexName?: string
}

export function Navigation({
  className = '',
  links = [],
  alignment = 'left',
  orientation = 'horizontal',
  searchMaxResults = 2,
  searchPaginationLimit = 2,
  algoliaIndexName,
}: Props) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Close mobile menu when search opens
  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen)
    if (!isSearchOpen) {
      setIsMobileMenuOpen(false)
    }
  }

  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }

  const orientationClasses = {
    horizontal: 'flex-row space-x-8',
    vertical: 'flex-col space-y-4',
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
                  href={item.link?.href ?? '#'}
                  className="relative text-sm font-medium text-gray-700 transition-all duration-300 hover:text-blue-600 md:text-base"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button - Only show on mobile when there are links */}
          {links.length > 0 && (
            <button
              onClick={toggleMobileMenu}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 transition-all duration-300 hover:bg-gray-100 sm:hidden"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <CloseIcon className="text-gray-600" />
              ) : (
                <MenuIcon className="text-gray-600" />
              )}
            </button>
          )}

          {/* Search Button */}
          <button
            onClick={handleSearchToggle}
            className="group flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-gray-50 transition-all duration-300 hover:border-blue-200 hover:bg-blue-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Open search"
          >
            <SearchIcon className="text-gray-600 transition-colors duration-300 group-hover:text-blue-600" />
          </button>
        </div>

        {/* Mobile Menu - Slides down below the nav bar */}
        {isMobileMenuOpen && links.length > 0 && (
          <div className="border-b border-gray-200 bg-white shadow-lg sm:hidden">
            <ul className="flex flex-col px-4 py-2">
              {links.map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.link?.href ?? '#'}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-3 text-base font-medium text-gray-700 transition-colors duration-200 hover:text-blue-600"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
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
                <CloseIcon />
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
                  indexName={algoliaIndexName}
                  show={isSearchOpen}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
