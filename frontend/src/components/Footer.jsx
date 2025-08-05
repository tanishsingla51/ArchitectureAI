import React from 'react'


const Footer = () => {
  return (
    <div>
          <footer className="bg-white border-t border-gray-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="md:col-span-1">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <span className="ml-2 text-xl font-semibold text-gray-900">ArchitectAI</span>
              </div>
              <p className="text-sm text-gray-500">
                © copyright ArchitectAI 2024. All rights reserved.
              </p>
            </div>

            {/* Navigation Links */}
            <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li><a href="#" className="hover:text-gray-700">Generator</a></li>
                  <li><a href="#" className="hover:text-gray-700">Documentation</a></li>
                  <li><a href="#" className="hover:text-gray-700">API Reference</a></li>
                  <li><a href="#" className="hover:text-gray-700">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li><a href="#" className="hover:text-gray-700">Templates</a></li>
                  <li><a href="#" className="hover:text-gray-700">Best Practices</a></li>
                  <li><a href="#" className="hover:text-gray-700">Tutorials</a></li>
                  <li><a href="#" className="hover:text-gray-700">Examples</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li><a href="#" className="hover:text-gray-700">About</a></li>
                  <li><a href="#" className="hover:text-gray-700">Blog</a></li>
                  <li><a href="#" className="hover:text-gray-700">Careers</a></li>
                  <li><a href="#" className="hover:text-gray-700">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li><a href="#" className="hover:text-gray-700">Help Center</a></li>
                  <li><a href="#" className="hover:text-gray-700">Community</a></li>
                  <li><a href="#" className="hover:text-gray-700">Status</a></li>
                  <li><a href="#" className="hover:text-gray-700">Feedback</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Watermark */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-0 right-0 text-center">
            <span className="text-8xl font-bold text-gray-100 opacity-20">ArchitectAI</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
