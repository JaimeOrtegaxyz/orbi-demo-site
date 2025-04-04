
import { Button } from "@/components/ui/button";
import OrbiVisualization from "./OrbiVisualization";

const Hero = () => {
  return (
    <section className="pt-32 pb-20 hero-gradient relative overflow-hidden">
      {/* Add the visualization as a background that covers the entire section */}
      <div className="absolute inset-0 w-full h-full">
        <OrbiVisualization />
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 fade-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
              Shaping The <span className="text-orbi-red">Next Era of AI</span> Through Data Intelligence
            </h1>
            <p className="text-lg text-gray-300 md:pr-10">
              Unlock the full potential of AI with our advanced data intelligence platform, designed to transform your business operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="bg-orbi-red hover:bg-orbi-red/90 text-white px-8 py-6 rounded-lg text-lg">
                Get Started
              </Button>
              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800 px-8 py-6 rounded-lg text-lg">
                Watch Demo
              </Button>
            </div>
          </div>
          
          {/* We don't need this separate visualization container anymore */}
          <div className="lg:col-span-5 fade-up" style={{
            animationDelay: '0.2s'
          }}>
            {/* Content space for the right side if needed */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
