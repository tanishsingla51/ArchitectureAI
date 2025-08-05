import React from 'react'
import { ArrowRight } from 'lucide-react';

const TopBanner = () => {
  return (
   
        <div className="flex justify-center mb-8">
            <div className="bg-gray-50 rounded-full px-6 py-2 text-sm text-gray-600">
              Generate backend architecture instantly.
              <a href="#generator" className="text-blue-600 hover:text-blue-700 ml-2">
                See how it works <ArrowRight className="inline h-4 w-4" />
              </a>
            </div>
          </div>
    
  )
}

export default TopBanner
