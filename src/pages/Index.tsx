
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeatureCards from "@/components/FeatureCards";
import Stats from "@/components/Stats";
import Solutions from "@/components/Solutions";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-orbi-black text-white">
      <Navbar />
      <Hero />
      <FeatureCards />
      <Stats />
      <Solutions />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
