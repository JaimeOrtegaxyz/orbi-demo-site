import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MenuIcon, Search, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-orbi-black/95 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <img src="/orbi_logo.png" alt="Orbi Logo" className="h-8 aspect-square sm:hidden" />
              <img src="/orbi_text_w.png" alt="Orbi" className="hidden sm:block h-6" />
            </a>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {["Products", "Solutions", "Resources", "Pricing"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                Sign In
              </Button>
              <Button className="bg-orbi-red hover:bg-orbi-red/90 text-white">
                Get Started
              </Button>
            </div>
            <button 
              className="md:hidden text-gray-300 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-orbi-darkgray border-t border-orbi-lightgray">
          <div className="container mx-auto px-4 py-3 space-y-3">
            {["Products", "Solutions", "Resources", "Pricing"].map((item) => (
              <a
                key={item}
                href="#"
                className="block text-gray-300 hover:text-white py-2"
              >
                {item}
              </a>
            ))}
            <div className="flex flex-col space-y-2 pt-2">
              <Button variant="ghost" className="justify-start text-gray-300 hover:text-white">
                Sign In
              </Button>
              <Button className="bg-orbi-red hover:bg-orbi-red/90 text-white">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
