import { useState } from "react";
import {
  Home,
  Calendar,
  Star,
  Gift,
  Camera,
  Clock,
  Menu,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", icon: <Home />, path: "/" },
  { label: "Make a Booking", icon: <Calendar />, path: "/makebooking" },
  { label: "Reviews", icon: <Star />, path: "/reviews" },
  { label: "Loyalty Points", icon: <Gift />, path: "/loyalty" },
  { label: "Memory Album", icon: <Camera />, path: "/memoryalbum" },
  { label: "Booking History", icon: <Clock />, path: "/bookinghistory" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 🌐 Mobile + Medium: Hamburger only */}
      <div className="md:hidden fixed top-0 left-0 w-[64px] h-full bg-[#f8f7db] shadow-md z-50 p-4">
        <div className="flex items-center space-x-2">
          <div className="bg-[#4D7C0F] text-white w-8 h-8 flex items-center justify-center rounded-full font-bold">
            K
          </div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="focus:outline-none justify-end"
        >
          <div className="flex justify-start">
            <Menu size={28} className="text-black mt-3" />
          </div>
        </button>
      </div>

      {/* 📱 Slide-in drawer for small/medium on click */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-[#f8f7db] shadow-md pt-16 p-4 z-50 overflow-y-auto transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        onMouseLeave={() => setIsOpen(false)}
      >
        {/* ✅ Mobile Title */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-[#4D7C0F] text-white w-10 h-10 flex items-center justify-center rounded-full font-bold">
            K
          </div>
          <span className="text-lg font-bold text-black">Kumana TrailMate</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-2">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.path}
              className="flex items-center space-x-3 p-2 rounded-md hover:bg-[#e4e4e4] text-black transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span>{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </a>
          ))}
        </nav>
      </div>

      {/* 🖥️ Desktop Sidebar: Hover-expand */}
      <div className="hidden md:block group fixed top-0 left-0 h-screen z-40">
        <div className="bg-[#f8f7db] w-16 group-hover:w-64 overflow-hidden transition-all duration-300 h-full shadow-md p-4">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-[#4D7C0F] text-white w-10 h-10 flex items-center justify-center rounded-full font-bold">
              K
            </div>
            <span className="text-lg font-bold text-black hidden group-hover:block">
              Kumana TrailMate
            </span>
          </div>

          <nav className="flex flex-col space-y-2">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.path}
                className="flex items-center space-x-3 p-2 rounded-md hover:bg-[#e4e4e4] text-black transition-all"
              >
                <span>{item.icon}</span>
                <span className="text-sm font-medium hidden group-hover:inline">
                  {item.label}
                </span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
