
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  // State to toggle dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  // State to toggle mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Mock user data - in a real app, this would come from a state management solution like Zustand
  const user = {
    name: 'User',
    avatarUrl: '/images/avatarmale.png', // Using copied avatar image
    notifications: 3 // Mock notification count
  }
  
  // Reference to the dropdown menu for detecting outside clicks
  const dropdownRef = useRef(null)
  
  // Toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }
  
  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    
    // Add event listener when dropdown is open
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    // Clean up event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu button */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-6 h-6"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"} 
              />
            </svg>
          </button>

          {/* Logo on the left */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-blue-500 p-1 rounded-md">
              <img src="/vite.svg" alt="ChatApp Logo" className="h-7 w-7" />
            </div>
            <span className="text-white font-bold text-xl">ChatApp</span>
          </Link>
          
          {/* Search bar (hidden on small screens) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for users or messages..."
                className="py-2 pl-10 pr-3 block w-full rounded-md bg-gray-700 text-gray-300 border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* Avatar and user info on the right */}
          <div className="flex items-center space-x-4">
            <div className="text-white hidden md:block">{user.name}</div>
            
            {/* Notifications */}
            <Link to="/notifications" className="text-gray-300 hover:text-white relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
              {user.notifications > 0 && (
                <span className="absolute -top-1 -right-1 block h-4 w-4 rounded-full bg-red-500 text-xs text-white text-center">
                  {user.notifications}
                </span>
              )}
            </Link>
            
            <div className="relative">
              <button 
                onClick={toggleDropdown}
                className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-white transition duration-150 ease-in-out"
              >
                <img 
                  className="h-8 w-8 rounded-full object-cover" 
                  src={user.avatarUrl} 
                  alt={`${user.name}'s avatar`} 
                />
              </button>
              
              {/* Dropdown menu with transition */}
              <div
                ref={dropdownRef}
                className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition-opacity duration-150 ${isDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 invisible'}`}
              >
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</Link>
                <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
                <Link to="/messages" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Messages</Link>
                <button onClick={() => console.log('Sign out clicked')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/home" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900">Home</Link>
              <Link to="/messages" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Messages</Link>
              <Link to="/notifications" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Notifications</Link>
              <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Profile</Link>
              <Link to="/settings" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Settings</Link>
              {/* Mobile search */}
              <div className="px-3 py-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="py-2 pl-10 pr-3 block w-full rounded-md bg-gray-700 text-gray-300 border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar
