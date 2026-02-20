import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BellIcon, CalendarIcon, UserIcon, LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/adminDashboard-ui/Button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/adminDashboard-ui/Avatar";
import { Badge } from "@/components/ui/adminDashboard-ui/Badge";

const Header = ({ title, breadcrumbs }) => {
  const [notifications, setNotifications] = useState(3);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear local/session storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleClick = (crumb) => {
    switch (crumb) {
      case "Dashboard":
        navigate("/adminDashboard");
        break;
      case "Packages":
        navigate("/adminDashboard/packages");
        break;
      case "Bookings":
        navigate("/adminDashboard/bookings");
        break;
      case "Reports":
        navigate("/adminDashboard/reports");
        break;
      default:
        break;
    }
  };

  return (
    <header className="bg-gray-500 border-b border-gray-200 px-6 py-3">
      <div className="flex justify-between items-center">
        {/* Left: Breadcrumbs & Title */}
        <div>
          <div className="flex items-center space-x-2 text-safari-sand mb-1">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                <span
                  className="text-sm hover:text-safari-orange cursor-pointer"
                  onClick={() => handleClick(crumb)}
                >
                  {crumb}
                </span>
                {index < breadcrumbs.length - 1 && (
                  <span className="mx-2 text-xs opacity-70">/</span>
                )}
              </div>
            ))}
          </div>
          <h1 className="text-2xl font-playfair font-bold text-safari-forest">
            {title}
          </h1>
        </div>

        {/* Right: Buttons & Avatar */}
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            className="text-safari-forest border-gray-200"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Today: May 26, 2025
          </Button>

          <div className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <BellIcon className="h-5 w-5 text-safari-forest" />
              {notifications > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-safari-orange text-white"
                  variant="default"
                >
                  {notifications}
                </Badge>
              )}
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src="/avatar-placeholder.png" />
              <AvatarFallback className="bg-safari-teal text-white">
                <UserIcon className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-safari-forest">
                Park Admin
              </p>
              <p className="text-xs text-gray-500">admin@kumanapark.com</p>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-safari-forest"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOutIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
