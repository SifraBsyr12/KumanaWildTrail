import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";

export default function BookingHireModal({ tour, onClose }) {
  const auth = getAuth();
  const user = auth.currentUser || JSON.parse(localStorage.getItem("user")) || null;

  const [isGuest, setIsGuest] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(!user);

  // Only days state for hire bookings
  const [hiredDays, setHiredDays] = useState(1);

  // Only form fields that don't trigger cost recalc
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    safariDate: "",
    pickupLocation: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [bookingCost, setBookingCost] = useState(0);

  // Format date as YYYY-MM-DD for input
  const formatDateForInput = (date) => {
    return date.toISOString().split("T")[0];
  };

  // Convert YYYY-MM-DD to Date object for backend
  const convertToDate = (dateString) => {
    return new Date(dateString);
  };

  // Recalculate cost whenever tour or hiredDays change
  useEffect(() => {
    console.log('Full tour object:', tour);
    const pricePerDay = parseFloat(tour?.packagePrice || 0);
    const cost = pricePerDay * hiredDays;
    console.log('Cost calculation:', { pricePerDay, hiredDays, cost });
    setBookingCost(cost);
  }, [tour, hiredDays]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const pricePerDay = parseFloat(tour?.packagePrice || 0);
      const finalCost = pricePerDay * hiredDays;

      const payload = {
        packageId: tour.packageID,
        customerEmail: user ? user.email : null,
        safariDate: convertToDate(formData.safariDate),
        hiredDays: hiredDays,
        pickupLocation: formData.pickupLocation || null,
        totalAmount: finalCost,
        bookingDate: new Date().toISOString(),
        driverStatus: "PENDING",
        ...(!user && {
          guestUserName: formData.name,
          guestUserEmail: formData.email,
          guestUserPhone: formData.phone,
        }),
      };

      console.log("Booking payload:", payload);

      const res = await fetch("http://localhost:8080/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Vehicle hired successfully!");
        onClose();
      } else {
        const errorData = await res.json();
        alert(`Booking failed: ${errorData.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("Error during booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getMinStartDate = () => formatDateForInput(new Date());

  const pricePerDay = parseFloat(tour?.packagePrice || 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-lg p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl hover:text-red-500"
        >
          ✕
        </button>

        {showLoginPrompt && !isGuest ? (
          <div className="text-center">
            <h2 className="font-caveat text-3xl mb-3">Ready to Book?</h2>
            <p className="font-aref text-sm text-safari-charcoal/80 mb-6">
              Login to manage your bookings or continue as a guest.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => (window.location.href = "/login")}
                className="bg-safari-green text-[#0D722A] px-6 py-2 rounded-full"
              >
                Login Now
              </button>
              <button
                onClick={() => {
                  setIsGuest(true);
                  setShowLoginPrompt(false);
                }}
                className="border border-safari-green text-safari-green px-6 py-2 rounded-full"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="font-caveat text-3xl mb-4 text-center">
              {tour.packageName}
            </h2>

            {/* Booking Cost Display */}
            <div className="bg-safari-green-50 rounded-2xl p-4 mb-6 text-center">
              <p className="font-aref text-sm text-safari-charcoal/80">
                Total Booking Cost
              </p>
              <p className="font-caveat text-2xl text-safari-green">
                ${bookingCost.toLocaleString()}
              </p>
              <p className="font-aref text-xs text-safari-charcoal/60 mt-1">
                ${pricePerDay.toLocaleString()} per day × {hiredDays} day
                {hiredDays !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Maximum Passengers Info */}
            <div className="bg-blue-50 rounded-2xl p-3 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="font-aref text-sm text-blue-900">
                  Maximum Capacity
                </span>
              </div>
              <span className="font-aref text-sm font-semibold text-blue-900">
                {tour.capacity || 12} passengers
              </span>
            </div>

            <div className="space-y-4">
              {!user && (
                <>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border px-4 py-2 rounded-full text-sm bg-safari-green-100"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border px-4 py-2 rounded-full text-sm bg-safari-green-100"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full border px-4 py-2 rounded-full text-sm bg-safari-green-100"
                  />
                </>
              )}

              {/* Safari Start Date */}
              <div className="space-y-2">
                <label className="font-aref text-sm text-safari-charcoal/80 block">
                  Safari Start Date
                </label>
                <input
                  type="date"
                  name="safariDate"
                  value={formData.safariDate}
                  onChange={handleChange}
                  min={getMinStartDate()}
                  required
                  className="w-full border px-4 py-2 rounded-full text-sm bg-safari-green-100"
                />
              </div>

              {/* Hired Days Counter */}
              <div className="space-y-2">
                <label className="font-aref text-sm text-safari-charcoal/80 block">
                  Number of Days
                </label>
                <div className="flex items-center justify-between bg-safari-green-100 rounded-full px-4 py-2">
                  <span className="font-aref text-sm text-safari-charcoal/80">
                    Duration
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setHiredDays(Math.max(1, hiredDays - 1))}
                      disabled={hiredDays <= 1}
                      className="w-6 h-6 rounded-full bg-safari-green text-white flex items-center justify-center disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="font-aref text-sm min-w-8 text-center">
                      {hiredDays} day{hiredDays !== 1 ? "s" : ""}
                    </span>
                    <button
                      type="button"
                      onClick={() => setHiredDays(hiredDays + 1)}
                      className="w-6 h-6 rounded-full bg-safari-green text-white flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Pickup Location */}
              <div className="space-y-2">
                <label className="font-aref text-sm text-safari-charcoal/80 block">
                  Pickup Location (Optional)
                </label>
                <input
                  type="text"
                  name="pickupLocation"
                  placeholder="Enter pickup location"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-full text-sm bg-safari-green-100"
                />
              </div>

              <button
                type="button"
                onClick={handleBooking}
                disabled={loading || !formData.safariDate}
                className="bg-safari-green text-[#0D722A] w-full py-2 rounded-full font-semibold disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : `Confirm Booking - $${bookingCost.toLocaleString()}`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}