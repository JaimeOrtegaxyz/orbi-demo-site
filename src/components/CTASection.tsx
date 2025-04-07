
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="bg-orbi-black relative py-[80px]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
          {/* Left side - Buttons */}
          <div className="w-full md:w-2/5 flex flex-col sm:flex-row md:flex-col gap-4 order-2 md:order-1">
            <Button className="bg-orbi-red hover:bg-orbi-red/90 text-white px-8 py-6 text-lg rounded-lg w-full sm:w-auto">
              Start Free Trial
            </Button>
            <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800 px-8 py-6 text-lg rounded-lg w-full sm:w-auto">
              Contact Sales
            </Button>
          </div>
          
          {/* Right side - Text content */}
          <div className="w-full md:w-3/5 text-left md:text-right order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Get Started with Orbi's AI Infrastructure Today
            </h2>
            <p className="text-gray-300 text-lg mb-6 md:mb-0 md:ml-auto md:max-w-2xl">
              Join the companies leveraging our cutting-edge AI technology to drive innovation and achieve unparalleled growth.
            </p>
          </div>
        </div>
        
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-orbi-red/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-orbi-red/5 rounded-full blur-[120px]"></div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
