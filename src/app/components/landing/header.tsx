/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { ChevronDownIcon } from '@/app/components/icons'
import Link from 'next/link'
import { useState } from 'react'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [isScrolled, setIsScrolled] = useState<boolean>(false)

  const navItems = [
    {
      name: 'Models',
      dropdown: true,
      href: '#models',
    },

    {
      name: 'AI Principles',
      dropdown: true,
      href: '#models',
    },

    {
      name: 'Developers',
      dropdown: true,
      href: '#models',
    },

    {
      name: 'Blogs',
      dropdown: false,
      href: '#models',
    },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled} ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-transparent'`}
      aria-label="Landing page"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="text-3xl font-bold tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              Yusou
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8" aria-label="Desktop Navigation">
            {navItems.map((item) => (
              <Link
                href={item.href}
                key={item.name}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 flex items-center focus:outline-none focus-visible:text-blue-600 focus-visible:underline"
              >
                {item.name}
                {item.dropdown && (
                  <ChevronDownIcon className="w-4 h-4 ml-1 text-gray-500 group-hover:text-blue-600 transition-opacity" />
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
