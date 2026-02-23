import { useEffect, useState } from "react";
import { X, User, Car, Star, MapPin, Clock } from "lucide-react";

export default function DriverProfileSidebar({ isOpen, onClose, user }) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [driverData, setDriverData] = useState({
    photo: "/Placeholders/person-placeholder.jpg",
    isAvailable: false,
    vehicleType: "",
    seatingCapacity: 0,
  });

  useEffect(() => {
    if (!isOpen) return;

    const token = localStorage.getItem("token");

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
        setDriverData({
          photo: data.photo_url ? `${backendUrl}${data.photo_url}` : "/Placeholders/person-placeholder.jpg",
          isAvailable: data.isAvailable,
          vehicleType: data.vehicle_type || "",
          seatingCapacity: data.seating_capacity ?? 0,
        });
      })
      .catch((err) => {
        console.error("Failed to fetch driver profile", err);
      });
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`fixed right-0 top-0 h-full w-96 bg-gradient-to-b from-green-50 to-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        aria-labelledby="profile-sidebar-title"
      >
        <div className="flex justify-between items-center p-6 border-b border-green-200">
          <h2 id="profile-sidebar-title" className="text-xl font-bold text-green-900 flex items-center gap-2">
            <User className="h-6 w-6" /> Driver Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-red-100 transition-colors"
            aria-label="Close profile sidebar"
          >
            <X className="text-gray-700 hover:text-red-500 h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-gray-800">
          {/* Profile Header */}
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <img
                src={driverData.photo}
                alt="Driver profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-green-200 shadow-md"
              />
              <span className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            <p className="text-2xl mt-3 font-bold text-green-900">{user?.name || "Unknown Driver"}</p>
            <p className="text-sm text-gray-500">{user?.email || "No email provided"}</p>
          </div>

          {/* Driver Stats */}
          <div className="bg-green-100 rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
              <Star className="h-5 w-5" /> Driver Stats
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">Rating</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(user?.rating || 4.5) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">({user?.rating || 4.5}/5)</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Experience</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{ width: `${(user?.yearsExperience || 5) * 10}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{user?.yearsExperience || 5} years</p>
              </div>
            </div>
          </div>

          {/* Vehicle Info */}
          <div>
            <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
              <Car className="h-5 w-5" /> Vehicle Info
            </h3>
            {driverData.vehicleType ? (
              <p className="text-sm text-gray-700">
                {driverData.vehicleType} –{" "}
                {driverData.seatingCapacity > 0 ? driverData.seatingCapacity : "N/A"} Seater
              </p>
            ) : (
              <p className="text-sm text-gray-500">No vehicle details available</p>
            )}
          </div>

          {/* Assigned Safaris */}
          {user?.assignedSafaris?.length > 0 && (
            <div>
              <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5" /> Assigned Safaris
              </h3>
              <ul className="text-sm space-y-2">
                {user.assignedSafaris.map((safari, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    {safari.location} – {safari.date}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Availability */}
          <div>
            <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
              <Clock className="h-5 w-5" /> Availability
            </h3>
            <p className={`text-sm ${driverData.isAvailable ? "text-green-700" : "text-red-700"}`}>
              {driverData.isAvailable ? "Active" : "Inactive"}
            </p>
          </div>

          {/* Safari Expertise Tags */}
          {user?.tags?.length > 0 && (
            <div>
              <h3 className="font-semibold text-green-900 mb-3">Safari Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {user.tags.map((tag, index) => (
                  <span key={index} className="bg-green-200 text-green-800 text-xs px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
