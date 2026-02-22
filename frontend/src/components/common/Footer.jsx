import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-safari-green text-white pt-8 pb-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {/* Logo and About */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-white rounded-full mr-2 flex items-center justify-center text-safari-green">
                🌴
              </div>
              <div className="font-bold text-white text-lg">Wild Trails</div>
            </div>
            <p className="text-white/80 text-sm mb-3">
              Experience authentic wildlife adventures in Sri Lanka with our expert local guides.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-safari-gold transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-white hover:text-safari-gold transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-white hover:text-safari-gold transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="font-bold text-base mb-3">Home</h4>
            <ul className="space-y-1.5 text-sm">
              <li><a href="/" className="text-white/80 hover:text-white transition-colors">Home</a></li>
              <li><a href="/#tours" className="text-white/80 hover:text-white transition-colors">Tours</a></li>
              <li><a href="/#about" className="text-white/80 hover:text-white transition-colors">About Us</a></li>
              <li><a href="/#activities" className="text-white/80 hover:text-white transition-colors">Activities</a></li>
              <li><a href="/#contact" className="text-white/80 hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Tours */}
          <div className="col-span-1">
            <h4 className="font-bold text-base mb-3">Our Tours</h4>
            <ul className="space-y-1.5 text-sm">
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Morning Safari</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Evening Safari</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Full Day Safari</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Camping Experience</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Cultural Tours</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h4 className="font-bold text-base mb-3">Contact</h4>
            <address className="not-italic text-white/80 text-sm">
              <p>42 Wildlife Avenue</p>
              <p>Habarana, Sri Lanka</p>
              <p className="mt-1.5">info@wildtrailssafari.com</p>
              <p>+94 76 661 1421</p>
            </address>
          </div>
        </div>

        <div className="border-t border-white/20 pt-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-xs mb-2 md:mb-0">
            &copy; {new Date().getFullYear()} Wild Trails Safari. All rights reserved.
          </p>

          <div className="flex space-x-4">
            <a href="#" className="text-white/60 text-xs hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-white/60 text-xs hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-white/60 text-xs hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
