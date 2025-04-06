import { Facebook, Github, Instagram, Linkedin, Twitter } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="bg-orbi-darkgray py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <img src="/orbi_logo.png" alt="Orbi Logo" className="h-8 w-8" />
              <img src="/orbi_text_w.png" alt="Orbi" className="h-6" />
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Orbi is at the forefront of AI-powered data intelligence, providing solutions for businesses of all sizes to harness the power of their data.
            </p>
            <div className="flex space-x-4">
              {[Twitter, Facebook, Instagram, Linkedin, Github].map((Icon, i) => (
                <a 
                  key={i}
                  href="#" 
                  className="w-10 h-10 rounded-full bg-orbi-lightgray flex items-center justify-center hover:bg-orbi-red transition-colors duration-300"
                >
                  <Icon size={18} className="text-white" />
                </a>
              ))}
            </div>
          </div>
          
          {footerLinks.map((column, i) => (
            <div key={i}>
              <h3 className="font-semibold text-white mb-6">{column.title}</h3>
              <ul className="space-y-4">
                {column.links.map((link, j) => (
                  <li key={j}>
                    <a href={link.href} className="text-gray-400 hover:text-orbi-red transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <Separator className="bg-gray-800 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © 2025 Orbi. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-orbi-red text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-orbi-red text-sm">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-orbi-red text-sm">Cookies Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "Integrations", href: "#" },
      { label: "Changelog", href: "#" },
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "Community", href: "#" },
      { label: "Support", href: "#" },
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Blog", href: "#" },
    ]
  }
];

export default Footer;
