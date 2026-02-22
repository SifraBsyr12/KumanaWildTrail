import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function BookingSafariModal({ safari, onClose }) {
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const user =
    auth.currentUser || JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();

  // Initialize form with defaults
  const [formData, setFormData] = useState({
    numAdults: 1,
    safariDate: "",
    pickupLocation: "",
    totalAmount: safari.price || 0,
    notes: "", // optional
  });


  useEffect(() => {
    if (user && !isGuest) {
      setFormData((prev) => ({
        ...prev,
        guestUserName: user.displayName || "",
        guestUserEmail: user.email || "",
      }));
    }
  }, [user, isGuest]);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      totalAmount: Number(safari.packagePrice || 0) * Number(prev.numAdults || 0),
    }));
  }, [formData.numAdults, safari.packagePrice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...(user && !isGuest
          ? { customerEmail: user.email }
          : {
              guestUserName: formData.guestUserName?.trim(),
              guestUserEmail: formData.guestUserEmail?.trim(),
              guestUserPhone: formData.guestUserPhone?.trim() || null,
            }),
        packageId: safari.packageID,
        numAdults: parseInt(formData.numAdults),
        safariDate: formData.safariDate,
        pickupLocation: formData.pickupLocation?.trim() || null,
        totalAmount: parseFloat(formData.totalAmount),
        driverStatus: "not assigned",
      };
    
      console.log("Booking payload:", payload);
    
      const res = await fetch("http://localhost:8080/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    
      const contentType = res.headers.get("content-type"); 
    
      const result = contentType?.includes("application/json")
        ? await res.json()
        : await res.text();
    
      if (res.ok) {
        toast.success(result.message || "Safari booked successfully!");
        onClose();
        navigate("/booking/complete");
      } else {
        console.error(result?.error || result?.message || "Booking failed. Please try again.");
        toast.error(result?.error || result?.message || "Booking failed. Please try again.");
      }
    } catch (err) {
      console.error("Booking failed:", err.message || err);
    } finally {
      setLoading(false);
    }
    
  };

  // Auto-hide login prompt if already logged in
  const showLoginPrompt = !user && !isGuest;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-lg mx-4 p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-safari-charcoal/70 hover:text-red-500 text-xl"
        >
          X
        </button>

        {showLoginPrompt ? (
          <div className="text-center">
            <h2 className="font-caveat text-3xl mb-3 text-safari-charcoal">
              Ready to Book?
            </h2>
            <p className="font-aref text-safari-charcoal/80 text-sm mb-6">
              Login to manage your booking, earn loyalty rewards, and track your
              safari experiences.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => (window.location.href = "/login")}
                className="font-aref bg-safari-green hover:bg-safari-light-green text-[#0D722A] px-6 py-2 rounded-full text-base transition-colors"
              >
                Login Now
              </button>
              <button
                onClick={() => setIsGuest(true)}
                className="font-aref border border-safari-green text-safari-green hover:bg-safari-green hover:text-[#0D722A] px-6 py-2 rounded-full text-base transition-colors"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="font-caveat text-3xl text-safari-charcoal mb-4 text-center">
              Book {safari.packageName}
            </h2>

            <form onSubmit={handleBooking} className="space-y-4">
              {/* Guest Fields */}
              {!user || isGuest ? (
                <>
                  <input
                    type="text"
                    name="guestUserName"
                    placeholder="Full Name *"
                    value={formData.guestUserName || ""}
                    onChange={handleChange}
                    required
                    className="w-full bg-safari-green-100 border border-gray-300 rounded-full px-4 py-2 font-aref text-sm focus:outline-none"
                  />
                  <input
                    type="email"
                    name="guestUserEmail"
                    placeholder="Email Address *"
                    value={formData.guestUserEmail || ""}
                    onChange={handleChange}
                    required
                    className="w-full bg-safari-green-100 border border-gray-300 rounded-full px-4 py-2 font-aref text-sm focus:outline-none"
                  />
                  <input
                    type="tel"
                    name="guestUserPhone"
                    placeholder="Phone (optional)"
                    value={formData.guestUserPhone || ""}
                    onChange={handleChange}
                    className="w-full bg-safari-green-100 border border-gray-300 rounded-full px-4 py-2 font-aref text-sm focus:outline-none"
                  />
                </>
              ) : (
                <div className="bg-safari-green-50 p-3 rounded-xl text-center">
                  <p className="text-sm font-aref text-safari-charcoal">
                    Booking as: <strong>{user.email}</strong>
                  </p>
                </div>
              )}

              {/* Common Fields */}
              <div className="flex gap-4">
                <input
                  type="date"
                  name="safariDate"
                  value={formData.safariDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-1/2 bg-safari-green-100 border border-gray-300 rounded-full px-4 py-2 font-aref text-sm focus:outline-none"
                />
                <input
                  type="number"
                  name="numAdults"
                  placeholder="Adults"
                  min="1"
                  max={safari.maxPeople || 10}
                  value={formData.numAdults}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      numAdults: Number(e.target.value),
                    }))
                  }
                  required
                  className="w-1/2 bg-safari-green-100 border border-gray-300 rounded-full px-4 py-2 font-aref text-sm focus:outline-none"
                />
              </div>
              <div className="bg-safari-green-50 p-3 rounded-xl">
                <p className="text-sm font-aref text-safari-charcoal">
                  Total Amount:{" "}
                  <strong>
                    LKR{" "}
                    {Number(safari.packagePrice) *
                      Number(formData.numAdults || 0)}
                  </strong>
                </p>
                <p className="text-xs text-safari-charcoal/60 mt-1">
                  (LKR {safari.packagePrice || 0} per person)
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="font-aref bg-safari-green hover:bg-safari-light-green text-[#0D722A] w-full py-2 rounded-full text-base transition-colors disabled:opacity-70"
              >
                {loading ? "Processing..." : "Confirm Booking"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
