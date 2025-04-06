
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";
import OrbiVisualization from "./OrbiVisualization";
import { useIsMobile } from "@/hooks/use-mobile";

const Hero = () => {
  const isMobile = useIsMobile();
  const nextSectionRef = useRef<HTMLDivElement>(null);

  const scrollToNextSection = () => {
    // Find the next section (FeatureCards)
    const nextSection = document.querySelector('section + section');
    
    if (nextSection) {
      nextSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section className="pt-64 pb-52 hero-gradient relative overflow-hidden">
      {/* Add the visualization as a background that covers the entire section */}
      <div className="absolute inset-0 w-full h-full">
        <OrbiVisualization />
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 pointer-events-none">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 fade-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white select-none">
              Shaping The <span className="text-orbi-red">Next Era of AI</span> Through Data Intelligence
            </h1>
            <p className="text-lg text-gray-300 md:pr-10 select-none">
              Unlock the full potential of your business with our advanced data intelligence platform.
            </p>
            <div className="flex pt-4 relative">
              {/* Main action buttons in a row */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="pointer-events-auto">
                  <Button className="bg-orbi-red hover:bg-orbi-red/90 text-white px-8 py-6 rounded-lg text-lg w-full sm:w-[170px]">
                    Get Started
                  </Button>
                </div>
                <div className="pointer-events-auto">
                  <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800 px-8 py-6 rounded-lg text-lg w-full sm:w-[170px]">
                    Watch Demo
                  </Button>
                </div>
              </div>
              
              {/* Scroll down button - only visible on mobile, positioned to align with bottom of buttons */}
              {isMobile && (
                <div className="pointer-events-auto absolute right-0 bottom-0">
                  <button 
                    onClick={scrollToNextSection}
                    className="bg-orbi-red hover:bg-orbi-red/90 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg animate-pulse-subtle"
                    aria-label="Scroll to next section"
                  >
                    <ChevronDown size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-5 fade-up select-none" style={{
            animationDelay: '0.2s'
          }}>
            {/* Content space for the right side if needed */}
          </div>
        </div>
      </div>

      <div ref={nextSectionRef} />
    </section>
  );
};

export default Hero;
