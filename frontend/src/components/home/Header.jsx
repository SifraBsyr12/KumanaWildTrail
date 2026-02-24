import { useState } from "react";
import { PhoneCall, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import AuthModal from "../home/AuthModel";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);

  const openLoginModal = () => {
    setIsLoginView(true);
    setShowAuthModal(true);
    setIsMenuOpen(false); // Close mobile menu if open
  };

  const openSignupModal = () => {
    setIsLoginView(false);
    setShowAuthModal(true);
    setIsMenuOpen(false); // Close mobile menu if open
  };

  return (
    <header className="bg-[#454442] text-white sticky top-0 z-50">
      <div className="container max-w-full px-4 py-1 flex items-center justify-between">
        <div className="flex items-center">
          <div>
            <img
              src="src/assets/logo.jpeg"
              alt="Wild Trails Safari"
              className="w-full h-10 object-cover"
            />
          </div>
        </div>

        {/* Phone */}
        <div className="hidden md:flex items-center text-white ml-[70px] px-3 py-2 bg-[#212529] rounded-3xl font-[Inter]">
          <PhoneCall size={18} className="mr-2" />
          <span className="text-sm">+94 76 661 1421</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex justify-center flex-1 mx-8 pl-[200px]">
          <ul className="flex space-x-12 font-[Inter]">
            <li>
              <Link
                to="/"
                className="text-white text-[12px] font-normal hover:text-safari-gold transition-colors"
              >
                Travel Deals
              </Link>
            </li>
            <li>
              <Link
                to="/#tours"
                className="text-white text-[12px] font-normal font-[Inter] hover:text-safari-gold transition-colors"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                to="/#about"
                className="text-white text-[12px] font-normal font-[Inter] hover:text-safari-gold transition-colors"
              >
                FAQS
              </Link>
            </li>
            <li>
              <Link
                to="/#activities"
                className="text-white text-[12px] font-normal font-[Inter] hover:text-safari-gold transition-colors"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={openSignupModal}
            className="text-[12px] font-normal font-[Inter] text-white px-5 py-2 rounded-3xl border border-[#ffffff] bg-transparent hover:bg-safari-sand transition-colors"
          >
            Sign Up
          </button>
          <button
            onClick={openLoginModal}
            className="text-[12px] font-normal font-[Inter] bg-[#EB5138] text-white px-5 py-2 rounded-3xl hover:bg-[#d1452e] transition-colors"
          >
            Log In
          </button>
        </div>

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
                    Travel Deals
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#tours"
                    className="block text-white hover:text-safari-gold font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#about"
                    className="block text-white hover:text-safari-gold font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    FAQS
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#activities"
                    className="block text-white hover:text-safari-gold font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact Us
                  </Link>
                </li>
                <li className="pt-4 border-t border-gray-700">
                  <button
                    onClick={openSignupModal}
                    className="block w-full text-white border border-white px-5 py-2 rounded-3xl hover:bg-safari-sand transition-colors font-medium text-center"
                  >
                    Sign Up
                  </button>
                </li>
                <li>
                  <button
                    onClick={openLoginModal}
                    className="block w-full bg-[#EB5138] text-white px-5 py-2 rounded-3xl hover:bg-[#d1452e] transition-colors font-medium text-center"
                  >
                    Log In
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          isLogin={isLoginView}
          switchToLogin={() => setIsLoginView(true)}
          switchToSignup={() => setIsLoginView(false)}
        />
      )}
    </header>
  );
}