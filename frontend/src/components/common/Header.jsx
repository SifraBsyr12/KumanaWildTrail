import { useState } from "react";
import { PhoneCall, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-black text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <div className="text-white font-bold text-xl flex items-center">
            <div className="w-8 h-8 bg-safari-gold rounded-full mr-2 flex items-center justify-center text-black">
              🌴
            </div>
            <span>Wild Trails</span>
          </div>
        </div>

        {/* Phone */}
        <div className="hidden md:flex items-center text-white">
          <PhoneCall size={18} className="mr-2" />
          <span className="font-medium">+94 76 661 1421</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex justify-center flex-1 mx-8">
          <ul className="flex space-x-6">
            <li>
              <Link
                to="/"
                className="text-white hover:text-safari-gold font-medium transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/#tours"
                className="text-white hover:text-safari-gold font-medium transition-colors"
              >
                Tours
              </Link>
            </li>
            <li>
              <Link
                to="/#about"
                className="text-white hover:text-safari-gold font-medium transition-colors"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/#activities"
                className="text-white hover:text-safari-gold font-medium transition-colors"
              >
                Activities
              </Link>
            </li>
            <li>
              <Link
                to="/#contact"
                className="text-white hover:text-safari-gold font-medium transition-colors"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </nav>

        {/* Book Now Button */}
        <Link
          to="/DriverDashboard"
          className="hidden md:block bg-safari-gold text-black px-5 py-2 rounded hover:bg-safari-sand transition-colors font-medium"
        >
          Log IN
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black py-4">
          <div className="container mx-auto px-4">
            <nav>
              <ul className="space-y-4">
                <li>
                  <Link
                    to="/"
                    className="block text-white hover:text-safari-gold font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#tours"
                    className="block text-white hover:text-safari-gold font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Tours
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#about"
                    className="block text-white hover:text-safari-gold font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#activities"
                    className="block text-white hover:text-safari-gold font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Activities
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#contact"
                    className="block text-white hover:text-safari-gold font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/DriverDashboard"
                    className="block w-full bg-safari-gold text-black px-5 py-2 rounded hover:bg-safari-sand transition-colors font-medium text-center mt-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Driver Dashboard
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
