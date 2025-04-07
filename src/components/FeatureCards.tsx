
import { Activity, ArrowRight, BarChart3, Brain, Code, Cpu } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FeatureCards = () => {
  return (
    <section className="py-16 bg-orbi-black">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Latest Highlights</h2>
          <Button variant="ghost" className="text-orbi-red hover:text-white flex items-center gap-2">
            View all <ArrowRight size={16} />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border border-gray-800 bg-orbi-black overflow-hidden animate-fade-in rounded-xl" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-6 space-y-5">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-900">
                  <feature.icon className="text-orbi-red" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
                <div className="pt-4">
                  <Button variant="ghost" className="text-orbi-red px-0 hover:bg-transparent hover:text-white">
                    View
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const features = [
  {
    title: "AI-Powered Analytics",
    description: "Leverage advanced AI algorithms to extract actionable insights from your data in real-time.",
    icon: BarChart3,
  },
  {
    title: "Neural Networks",
    description: "Our custom neural networks adapt to your specific business needs and learning patterns.",
    icon: Brain,
  },
  {
    title: "Code Integration",
    description: "Seamless integration with your existing codebase through our developer-friendly API.",
    icon: Code,
  },
];

export default FeatureCards;
