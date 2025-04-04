
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-orbi-red/10 to-transparent relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Get Started with Orbi's AI Infrastructure Today
          </h2>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
            Join the companies leveraging our cutting-edge AI technology to drive innovation and achieve unparalleled growth.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-orbi-red hover:bg-orbi-red/90 text-white px-8 py-6 text-lg rounded-lg">
              Start Free Trial
            </Button>
            <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800 px-8 py-6 text-lg rounded-lg">
              Contact Sales
            </Button>
          </div>
        </div>
        
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-orbi-red/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-orbi-red/5 rounded-full blur-[120px]"></div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
