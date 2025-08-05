import React from 'react'
import Headline from '../components/Headline.jsx';
import { ArrowRight } from 'lucide-react';
import TopBanner from '../components/TopBanner.jsx';
import Description from '../components/Description.jsx';
import Buttons from '../components/Buttons.jsx';

const MainPage = () => {
  return (
    <div>
      <section className="relative overflow-hidden">
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              {/* Top Banner */}
              
              <TopBanner />

              {/* Main Headline */}
              <Headline />
    
              {/* Description */}
              <Description />
    
              {/* CTA Buttons */}
              <Buttons />
              
            </div>
          </section>
    
    </div>
  )
}

export default MainPage
