import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Brain, Cloud, Database, Lock } from "lucide-react";
const Solutions = () => {
  return <section className="bg-orbi-black relative py-[60px]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="border-orbi-red text-orbi-red mb-4">
            Tailored Solutions for Every Need
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Powerful AI Infrastructure</h2>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg">
            We've built a comprehensive suite of tools and services designed to handle the most demanding AI workloads while remaining flexible for businesses of all sizes.
          </p>
        </div>
        
        {/* Updated image section with new black planet image */}
        <div className="flex justify-center mb-20">
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            <img src="/lovable-uploads/ac79ff9c-e486-47e1-9b20-5141e8fb73eb.png" alt="AI Visualization" className="w-full h-full object-contain" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {solutions.map((solution, index) => <div key={index} className="border border-gray-800 rounded-xl p-6 hover:border-orbi-red/60 transition-all duration-300 animate-fade-in" style={{
          animationDelay: `${index * 0.15}s`
        }}>
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{
                backgroundColor: solution.bgColor
              }}>
                    <solution.icon className="text-white" size={24} style={{
                  color: solution.iconColor
                }} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-orbi-red transition-colors">
                  {solution.title}
                </h3>
                <p className="text-gray-400 mb-6">{solution.description}</p>
                <div className="mt-auto pt-4">
                  <Button variant="ghost" className="text-orbi-red hover:bg-transparent hover:text-white p-0 flex items-center gap-1">
                    Learn more <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </div>)}
        </div>
        
        
      </div>
    </section>;
};
const solutions = [{
  title: "Data Analysis",
  description: "Extract meaningful insights from complex datasets with our advanced analysis tools powered by the latest machine learning algorithms.",
  icon: Database,
  bgColor: "#172554",
  // Deep blue background
  iconColor: "#60A5FA" // Blue icon
}, {
  title: "Neural Network Processing",
  description: "Train and deploy custom neural networks with high performance computation clusters optimized for deep learning workloads.",
  icon: Brain,
  bgColor: "#4C1D95",
  // Deep purple background
  iconColor: "#C084FC" // Purple icon
}, {
  title: "Cloud Intelligence",
  description: "Scale your AI operations seamlessly with our cloud-native platform, offering flexibility and power on demand.",
  icon: Cloud,
  bgColor: "#075985",
  // Deep cyan background
  iconColor: "#38BDF8" // Light blue icon
}, {
  title: "Secure Data Operations",
  description: "Keep your sensitive data protected with enterprise-grade security measures and compliance with global standards.",
  icon: Lock,
  bgColor: "#14532D",
  // Deep green background
  iconColor: "#4ADE80" // Green icon
}];
export default Solutions;