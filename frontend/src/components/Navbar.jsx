// Navbar.jsx
import React from "react";
import { Menu } from "lucide-react"; // Sidebar toggle icon
import Login from "./Login";

const Navbar = ({ toggleSidebar }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Left Side: Sidebar Toggle + Logo */}
          <div className="flex items-center">
            {/* Sidebar Toggle Button */}
            <button
              onClick={toggleSidebar}
              className="rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              <Menu />
            </button>

            {/* Logo */}
            <div className="flex items-center ml-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow">
                <div className="w-4 h-4 bg-black rounded-sm"></div>
              </div>
              <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
                ArchitectAI
              </span>
            </div>
          </div>

          {/* Right Side: Login */}
          <Login />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
