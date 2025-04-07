
import { Card } from "@/components/ui/card";

const Stats = () => {
  return <section className="py-16 bg-orbi-darkgray">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            500,000+ Users Worldwide
          </h2>
          <p className="text-white/90 text-lg">
            Join the global community of data scientists and AI enthusiasts who trust Orbi for their intelligence needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-6 text-center">
                <div className="mb-3">
                  <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {stat.value}
                  </span>
                </div>
                <h3 className="text-lg font-medium mb-2 text-white">{stat.title}</h3>
                <p className="text-gray-400 text-xs">{stat.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>;
};

const stats = [{
  value: "98%",
  title: "Accuracy Rate",
  description: "In predictive analytics across industries"
}, {
  value: "24/7",
  title: "Support Available",
  description: "Technical assistance whenever you need"
}, {
  value: "3.5M+",
  title: "Daily Predictions",
  description: "Processed through our AI engines daily"
}, {
  value: "150+",
  title: "Enterprise Clients",
  description: "Top companies trusting our platform"
}];

export default Stats;
