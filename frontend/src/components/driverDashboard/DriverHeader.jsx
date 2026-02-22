import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Bell } from "lucide-react";

export default function DriverHeader({ setActivePanel, user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [error, setError] = useState(null);
  const [driverPhoto, setDriverPhoto] = useState(null);
  const menuRef = useRef();
  const notificationRef = useRef();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchDriverPhoto = () => {
      fetch(`${backendUrl}/api/driver/get_loggedin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch driver data");
          return res.json();
        })
        .then((data) => {
          if (data.photo_url) {
            setDriverPhoto(`${backendUrl}${data.photo_url}`);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch driver photo", err);
        });
    };

    const fetchNotifications = () => {
      // Replace with real API call
      fetch(`${backendUrl}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch notifications");
          return res.json();
        })
        .then((data) => {
          setNotifications(data || []);
        })
        .catch((err) => {
          console.error("Failed to fetch notifications", err);
          setError("Failed to load notifications");
          // Fallback to mock data
          setNotifications([
            { id: 1, message: "Elephant sighting added to your route", time: "2 min ago" },
            { id: 2, message: "Admin assigned new safari group", time: "10 min ago" },
          ]);
        });
    };

    fetchDriverPhoto();
    fetchNotifications();

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
      if (notificationRef.current && !notificationRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [backendUrl]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const clearNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <header
  className="text-white px-2 xs:px-4 sm:px-6 py-2 flex justify-between items-center shadow-md sticky top-0 z-50"style={{ backgroundColor: "#757a77" }} 
>
      <h1 className="font-caveat text-lg xs:text-xl sm:text-2xl font-semibold tracking-tight truncate">
        Welcome, {user?.name || user?.email || "Driver"}
      </h1>

      {user && (
        <div className="flex items-center gap-2 xs:gap-3 sm:gap-5">
          {/* Notification Bell */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1.5 xs:p-2 rounded-full  hover:bg-safari-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-safari-gold-400"
              aria-label="Notifications"
              aria-expanded={showNotifications}
              aria-haspopup="true"
              aria-controls="notification-dropdown"
              style={{ backgroundColor: "#1e9871" }} 
              
            >
              <Bell size={16} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 h-2 xs:h-2.5 sm:h-3 w-2 xs:w-2.5 sm:w-3 bg-safari-gold-400 rounded-full border-2 border-safari-green-700" />
              )}
            </button>

            {showNotifications && (
              <div
                id="notification-dropdown"
                className="absolute right-0 mt-2 w-72 max-w-[90vw] bg-white text-gray-800 rounded-lg shadow-xl z-50 animate-slide-down"
                role="menu"
                aria-orientation="vertical"
              >
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 text-gray-700 font-semibold text-sm">
                  Notifications ({notifications.length})
                </div>
                {error ? (
                  <div className="px-4 py-3 text-sm text-red-500">
                    {error}
                  </div>
                ) : notifications.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="px-4 py-3 hover:bg-gray-50 flex justify-between items-center text-sm border-b border-gray-100 last:border-none"
                        role="menuitem"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-800 font-medium truncate">{notif.message}</p>
                          <p className="text-gray-500 text-xs mt-1">
                            {notif.time}
                          </p>
                        </div>
                        <button
                          onClick={() => clearNotification(notif.id)}
                          className="ml-2 text-gray-400 hover:text-gray-600 text-xs font-medium px-2 py-1 rounded hover:bg-gray-100 transition-colors duration-150"
                          aria-label={`Clear notification: ${notif.message}`}
                        >
                          Clear
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500" role="menuitem">
                    No new notifications
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile Dropdown with Photo */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-1 xs:gap-2 hover:bg-safari-green-600 px-2 xs:px-2.5 sm:px-3 py-1.5 xs:py-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-safari-gold-400"
              aria-label="User menu"
              aria-expanded={menuOpen}
              aria-haspopup="true"
              aria-controls="profile-dropdown"
              style={{ backgroundColor: "#1e9871" }} 
            >
              <img
                src={driverPhoto || "/Placeholders/person-placeholder.jpg"}
                alt="Driver profile"
                className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-white"
              />
              <ChevronDown
                size={14}
                className={`xs:w-5 xs:h-5 sm:w-6 sm:h-6 ${menuOpen ? "rotate-180" : ""} transition-transform duration-300`}
              />
            </button>

            {menuOpen && (
              <div
                id="profile-dropdown"
                className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-xl z-50 animate-slide-down"
                role="menu"
                aria-orientation="vertical"
              >
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <p className="font-semibold text-sm truncate">
                    {user.name || user.email || "Driver"}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Change your details here
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActivePanel("profile", { user });
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm transition-colors duration-200"
                  role="menuitem"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    setActivePanel("settings", { user });
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm transition-colors duration-200"
                  role="menuitem"
                >
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-red-500 hover:bg-gray-50 text-sm transition-colors duration-200"
                  role="menuitem"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}