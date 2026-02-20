// Import necessary dependencies and components
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ActivityIcon,
  AlertCircleIcon,
  CalendarCheckIcon,
  ChartBarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CoinsIcon,
  HomeIcon,
  LayersIcon,
  SearchIcon,
  SettingsIcon,
  StarIcon,
} from "lucide-react";

// Import custom utility for conditional class names
import { cn } from "@/lib/utils";

// Reusable SidebarItem component
const SidebarItem = ({ icon, label, to, collapsed }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center py-3 px-3 mb-1 rounded-lg gap-3 transition-colors",
          isActive
            ? "bg-safari-teal/10 text-safari-teal hover:bg-safari-teal/20"
            : "text-safari-forest hover:bg-safari-teal/5 hover:text-safari-teal"
        )
      }
      aria-current={({ isActive }) => (isActive ? "page" : undefined)}
    >
      {/* Icon */}
      <div>{icon}</div>

      {/* Label (hidden when sidebar is collapsed) */}
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
};

// Main AdminSidebar component (renamed from Sidebar)
const AdminSidebar = () => {
  // State to manage sidebar collapse/expand
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 fixed z-30 md:relative",
        collapsed ? "w-16" : "w-64"
      )}
      aria-label="Sidebar navigation"
    >
      {/* Top header section */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200">
        {/* Brand title (shown only when expanded) */}
        {!collapsed && (
          <div className="flex items-center">
            <span className="font-playfair text-xl font-bold text-safari-forest">
              Kumana
            </span>
            <span className="ml-1 font-medium text-safari-teal">TrailMate</span>
          </div>
        )}

        {/* Collapse/Expand toggle button */}
        <button
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="p-0 h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-safari-teal"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRightIcon className="h-4 w-4" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation links */}
      <nav className="p-2 flex-1 overflow-auto" aria-label="Main navigation">
        <SidebarItem icon={<HomeIcon className="h-5 w-5" />} label="Overview" to="/admin/dashboard#overview" collapsed={collapsed} />
        <SidebarItem icon={<LayersIcon className="h-5 w-5" />} label="Animal Sightings" to="/admin/dashboard#sightings" collapsed={collapsed} />
        <SidebarItem icon={<CalendarCheckIcon className="h-5 w-5" />} label="Booking Management" to="/admin/dashboard#bookings" collapsed={collapsed} />
        <SidebarItem icon={<StarIcon className="h-5 w-5" />} label="Reviews & Ratings" to="/admin/dashboard#reviews" collapsed={collapsed} />
        <SidebarItem icon={<CoinsIcon className="h-5 w-5" />} label="Loyalty Program" to="/admin/dashboard#loyalty" collapsed={collapsed} />
        <SidebarItem icon={<ChartBarIcon className="h-5 w-5" />} label="Sighting Summary" to="/admin/dashboard#summary" collapsed={collapsed} />
        <SidebarItem icon={<AlertCircleIcon className="h-5 w-5" />} label="SOS Alerts" to="/admin/dashboard#alerts" collapsed={collapsed} />
        <SidebarItem icon={<ActivityIcon className="h-5 w-5" />} label="Analytics" to="/admin/dashboard#analytics" collapsed={collapsed} />
        <SidebarItem icon={<SettingsIcon className="h-5 w-5" />} label="Settings" to="/admin/dashboard#settings" collapsed={collapsed} />
      </nav>

      {/* Search input (at bottom of sidebar) */}
      <div className="p-4 border-t border-gray-200">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={collapsed ? "" : "Search..."}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-safari-teal"
            aria-label="Search"
          />
        </div>
      </div>
    </aside>
  );
};

// Exporting the component
export default AdminSidebar;
