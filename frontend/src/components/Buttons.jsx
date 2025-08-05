import React from 'react'
import { ArrowRight } from 'lucide-react';

const Buttons = () => {
  return (
    <div>
        <div className="text-center space-x-4">
                <button
                  onClick={() => document.getElementById('generator').scrollIntoView({ behavior: 'smooth' })}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Start Building
                </button>
                <button className="text-gray-700 hover:text-gray-900 font-semibold">
                  View Examples <ArrowRight className="inline h-4 w-4" />
                </button>
              </div>
    </div>
  )
}

export default Buttons
