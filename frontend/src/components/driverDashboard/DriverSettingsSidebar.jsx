import { useState, useRef, useEffect } from "react";
import { X, Camera, Bell, Palette, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function DriverSettingsSidebar({ isOpen, onClose }) {
  const [availability, setAvailability] = useState(true);
  const [notifications, setNotifications] = useState({ email: true, push: false });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("/driver-placeholder.png");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [vehicleType, setVehicleType] = useState("");
  const [seatingCapacity, setSeatingCapacity] = useState(0);

  const fileInputRef = useRef();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isOpen) {
      fetch(`${backendUrl}/api/driver/get_loggedin`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.photo_url) setPreview(`${backendUrl}${data.photo_url}`);
          if (typeof data.isAvailable === "boolean") setAvailability(data.isAvailable);
          if (data.vehicle_type) setVehicleType(data.vehicle_type);
          if (data.seating_capacity) setSeatingCapacity(data.seating_capacity);
        })
        .catch((err) => console.error("Failed to fetch driver info", err));
    }
  }, [isOpen, backendUrl, token]);

  const handlePasswordChange = () => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    if (password && !handlePasswordChange()) return;
    setShowConfirmModal(true);
  };

  const confirmSave = async () => {
    try {
      // 1. Upload photo
      if (photo instanceof File) {
        const formData = new FormData();
        formData.append("file", photo);
  
        const res = await fetch(`${backendUrl}/api/driver/update/photo`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
  
        if (!res.ok) throw new Error("Photo upload failed");
        const photoUrl = await res.text();
        setPreview(`${backendUrl}${photoUrl}`);
      }
  
      // 2. Update settings
      const settingsPayload = {
        isAvailable: availability,
        vehicle_type: vehicleType,
        seating_capacity: seatingCapacity,
      };
  
      const settingsRes = await fetch(`${backendUrl}/api/driver/update/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settingsPayload),
      });
  
      if (!settingsRes.ok) throw new Error("Settings update failed");
  
      // 3. Update password (if provided)
      if (password) {
        const passwordPayload = {
          newPassword: password,
          confirmPassword: confirmPassword,
        };
  
        const passwordRes = await fetch(`${backendUrl}/api/driver/change-password`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(passwordPayload),
        });
  
        if (!passwordRes.ok) {
          const errorText = await passwordRes.text();
          throw new Error(`Password update failed: ${errorText}`);
        }
      }
  
      toast.success("Settings updated successfully!");
      setShowConfirmModal(false);
      setPassword("");
      setConfirmPassword("");
      onClose();
    } catch (err) {
      console.error("Error saving settings:", err.message);
      toast.error(err.message || "An error occurred while saving your settings.");
    }
  
};
    
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
        aria-labelledby="settings-sidebar-title"
      >
        <div className="flex justify-between items-center p-6 border-b border-green-200">
          <h2 id="settings-sidebar-title" className="text-xl font-bold text-green-900 flex items-center gap-2">
            <Palette className="h-6 w-6" /> Driver Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-red-100 transition-colors"
            aria-label="Close settings sidebar"
          >
            <X className="text-gray-700 hover:text-red-500 h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-gray-800">
          {/* Profile Photo */}
          <div>
            <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
              <Camera className="h-5 w-5" /> Profile Photo
            </h3>
            <div className="flex items-center gap-4">
              <img src={preview} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-green-200" />
              <button
                onClick={() => fileInputRef.current.click()}
                className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
              >
                Upload Photo
              </button>
              <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handlePhotoUpload} />
            </div>
          </div>

          {/* Availability */}
          <div>
            <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
              <Clock className="h-5 w-5" /> Availability
            </h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-green-600 rounded"
                checked={availability}
                onChange={() => setAvailability(!availability)}
              />
              <span className="text-sm font-medium">Available for Safaris</span>
            </label>
          </div>

          {/* Notifications */}
          {/* Vehicle Info */}
          <div>
            <h3 className="font-semibold text-green-900 mb-3">Update Vehicle Info</h3>
            <label className="block text-sm font-medium mb-1">Vehicle Type</label>
            <input
              type="text"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-green-500 mb-4"
              placeholder="e.g., Jeep"
            />
            <label className="block text-sm font-medium mb-1">Seating Capacity</label>
            <input
              type="number"
              min="1"
              value={seatingCapacity}
              onChange={(e) => setSeatingCapacity(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-green-500"
              placeholder="Enter seating capacity"
            />
          </div>

          {/* Password */}
          <div>
            <h3 className="font-semibold text-green-900 mb-3">Change Password</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-green-500"
                />
              </div>
              {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveChanges}
            className="w-full py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition shadow-md"
          >
            Save Changes
          </button>
        </div>
      </aside>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-80 shadow-xl">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Confirm Changes</h3>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to save these settings?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmSave}
                className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
