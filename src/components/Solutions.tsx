
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const Solutions = () => {
  return (
    <section className="py-20 bg-orbi-black">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {solutions.map((solution, index) => (
            <div 
              key={index}
              className="feature-card hover:border-orbi-red/60 group animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orbi-red/20 to-orange-500/20 flex items-center justify-center">
                    <solution.icon className="text-orbi-red" size={24} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-orbi-red transition-colors">
                  {solution.title}
                </h3>
                <p className="text-gray-400 mb-6">{solution.description}</p>
                <div className="mt-auto pt-4">
                  <Button variant="ghost" className="text-orbi-red hover:bg-orbi-red/10 p-0 flex items-center gap-1">
                    Learn more <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Button className="bg-orbi-red hover:bg-orbi-red/90 text-white px-8 py-6 text-lg rounded-lg">
            Explore All Solutions
          </Button>
        </div>
      </div>
    </section>
  );
};

import { Brain, Cloud, Database, Lock } from "lucide-react";

const solutions = [
  {
    title: "Data Analysis",
    description: "Extract meaningful insights from complex datasets with our advanced analysis tools powered by the latest machine learning algorithms.",
    icon: Database
  },
  {
    title: "Neural Network Processing",
    description: "Train and deploy custom neural networks with high performance computation clusters optimized for deep learning workloads.",
    icon: Brain
  },
  {
    title: "Cloud Intelligence",
    description: "Scale your AI operations seamlessly with our cloud-native platform, offering flexibility and power on demand.",
    icon: Cloud
  },
  {
    title: "Secure Data Operations",
    description: "Keep your sensitive data protected with enterprise-grade security measures and compliance with global standards.",
    icon: Lock
  }
];

export default Solutions;
