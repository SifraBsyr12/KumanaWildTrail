import { Link } from "react-router-dom";

export default function Header2() {
  return (
    <div className="bg-[#45644d]/80  text-white">
      <div className="container mx-auto px-4 py-2">
        <nav className="flex justify-end space-x-8 font-[Inter] mr-[100px]">
          {/* Safaries */}
          <div className="relative group py-2 ">
            <Link
              to="/bookings"
              className="flex items-center text-white text-[12px] font-normal cursor-pointer hover:text-safari-gold transition-colors duration-300 ease-in-out"
              >
              Safaries
              <svg
                className="w-3 h-3 ml-1 transition-transform group-hover:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Link>
            <div className="absolute left-1/2 -translate-x-1/2 z-10 hidden group-hover:block bg-[#454442]/90 text-white pt-2 rounded-b shadow-lg w-48 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
              <div className="pt-2 pb-1">
                <ul className="space-y-1">
                  <li>
                    <Link
                      to="/bookings/morning-safari"
                      className="block px-4 py-2 text-[12px] hover:bg-[#575654] cursor-pointer hover:text-safari-gold transition-colors"
                    >
                      Morning Safari
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/bookings/evening-safari"
                      className="block px-4 py-2 text-[12px] hover:bg-[#575654] cursor-pointer hover:text-safari-gold transition-colors"
                    >
                      Evening Safari
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/bookings/full-day-bird-watching"
                      className="block px-4 py-2 text-[12px] hover:bg-[#575654] cursor-pointer hover:text-safari-gold transition-colors"
                    >
                      Full Day Bird Watching
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Taxi Service */}
          <div className="relative group py-2">
            <Link
              to="/taxi-service"
              className="flex items-center text-white text-[12px] font-normal cursor-pointer hover:text-safari-gold transition-colors"
            >
              Taxi Service
              <svg
                className="w-3 h-3 ml-1 transition-transform group-hover:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Link>
            <div className="absolute left-1/2 -translate-x-1/2 z-10 hidden group-hover:block bg-[#454442]/90 text-white pt-2 rounded-b shadow-lg w-48 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
              <div className="pt-2 pb-1">
                <ul className="space-y-1">
                  <li>
                    <Link
                      to="/taxi-service/airport-transport"
                      className="block px-4 py-2 text-[12px] hover:bg-[#575654] hover:text-safari-gold transition-colors"
                    >
                      Airport Transport
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/taxi-service/arugambe-connections"
                      className="block px-4 py-2 text-[12px] hover:bg-[#575654] hover:text-safari-gold transition-colors"
                    >
                      Arugambe Connections
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/taxi-service/private-tours"
                      className="block px-4 py-2 text-[12px] hover:bg-[#575654] hover:text-safari-gold transition-colors"
                    >
                      Private Tours
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/taxi-service/tuk-tuk-hire"
                      className="block px-4 py-2 text-[12px] hover:bg-[#575654] hover:text-safari-gold transition-colors"
                    >
                      Tuk Tuk Hire
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Activities */}
          <div className="relative group py-2">
            <Link
              to="/activities"
              className="flex items-center text-white text-[12px] cursor-pointer font-normal hover:text-safari-gold transition-colors"
            >
              Activities
              <svg
                className="w-3 h-3 ml-1 transition-transform group-hover:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Link>
            <div className="absolute left-1/2 -translate-x-1/2 z-10 hidden group-hover:block bg-[#454442]/90 text-white pt-2 rounded-b shadow-lg w-48 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
              <div className="pt-2 pb-1">
                <ul className="space-y-1">
                  <li>
                    <Link
                      to="/activities/kudumbigala-rock"
                      className="block px-4 py-2 text-[12px] hover:bg-[#575654] hover:text-safari-gold transition-colors"
                    >
                      Kudumbigala Rock
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/activities/lagoon-boat-tour"
                      className="block px-4 py-2 text-[12px] hover:bg-[#575654] hover:text-safari-gold transition-colors"
                    >
                      Lagoon Boat Tour
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/activities/surfing-arugambe"
                      className="block px-4 py-2 text-[12px] hover:bg-[#575654] hover:text-safari-gold transition-colors"
                    >
                      Surfing in Arugambe
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/activities/cooking-class"
                      className="block px-4 py-2 text-[12px] hover:bg-[#575654] hover:text-safari-gold transition-colors"
                    >
                      Cooking Class
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}