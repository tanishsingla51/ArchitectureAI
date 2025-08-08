// Navbar.jsx
import React from 'react'
import Login from './Login'

const Navbar = ({ toggleSidebar }) => {

  return (
    <header className="border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button className="flex items-center" onClick={toggleSidebar}>
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <span className="ml-2 text-xl font-semibold text-gray-900">ArchitectAI</span>
          </button>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-gray-900">Product</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">Features</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">Marketplace</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">Company</a>
          </nav>

          {/* Login Button */}
          <Login />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
