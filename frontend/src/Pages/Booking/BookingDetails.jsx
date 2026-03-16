import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function BookingDetails() {
  const { encryptedId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/bookings/decrypt/${encryptedId}`);
        if (!res.ok) return navigate("/unauthorized");

        const data = await res.json();
        if (!data || data.error || !data.id) return navigate("/unauthorized");

        setBooking(data);
      } catch (err) {
        console.error("Error loading booking:", err);
        navigate("/unauthorized");
      } finally {
        setLoading(false);
      }
    };

    if (encryptedId) fetchBooking();
    else navigate("/unauthorized");
  }, [encryptedId, navigate]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-gray-600 text-lg animate-pulse">Loading booking details...</p>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-3xl font-bold text-safari-green mb-6 text-center">
        Booking Details
      </h1>

      <div className="space-y-3 text-gray-700">
        <p><strong>Package:</strong> {booking.packageName || "N/A"}</p>
        <p><strong>Date:</strong> {booking.safariDate}</p>
        <p><strong>Status:</strong> {booking.status}</p>
        <p><strong>Payment:</strong> {booking.paymentStatus || "Pending"}</p>
        <p><strong>Total Amount:</strong> LKR {booking.totalAmount}</p>
      </div>

      <hr className="my-5" />

      {booking.customerEmail ? (
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-safari-charcoal">Registered User</h2>
          <p><strong>Email:</strong> {booking.customerEmail}</p>
        </div>
      ) : (
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-safari-charcoal">Guest Booking</h2>
          <p><strong>Name:</strong> {booking.guestUserName || "N/A"}</p>
          <p><strong>Email:</strong> {booking.guestUserEmail || "N/A"}</p>
          <p><strong>Phone:</strong> {booking.guestUserPhone || "N/A"}</p>
        </div>
      )}

      {booking.driverStatus && (
        <>
          <hr className="my-5" />
          <p><strong>Driver Status:</strong> {booking.driverStatus}</p>
        </>
      )}
    </div>
  );
}
