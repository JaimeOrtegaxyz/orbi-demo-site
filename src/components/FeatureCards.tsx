
import { Activity, ArrowRight, BarChart3, Box, Code, Cpu } from "lucide-react";
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
            <Card key={index} className="glass-card border-0 overflow-hidden animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="p-6 space-y-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${feature.bgColor}`}>
                  <feature.icon className={feature.iconColor} size={20} />
                </div>
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
                <div className="flex items-center pt-4">
                  <span className="text-xs text-gray-500 mr-auto">{feature.date}</span>
                  <div className="flex gap-1">
                    {feature.tags.map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full bg-orbi-lightgray text-gray-300">
                        {tag}
                      </span>
                    ))}
                  </div>
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
    bgColor: "bg-blue-500/10",
    iconColor: "text-blue-400",
    date: "May 15, 2025",
    tags: ["AI", "Analytics"]
  },
  {
    title: "Neural Networks",
    description: "Our custom neural networks adapt to your specific business needs and learning patterns.",
    icon: Cpu,
    bgColor: "bg-orbi-red/10",
    iconColor: "text-orbi-red",
    date: "May 12, 2025",
    tags: ["Neural", "ML"]
  },
  {
    title: "Code Integration",
    description: "Seamless integration with your existing codebase through our developer-friendly API.",
    icon: Code,
    bgColor: "bg-green-500/10",
    iconColor: "text-green-400",
    date: "May 10, 2025",
    tags: ["API", "Dev"]
  },
];

export default FeatureCards;
