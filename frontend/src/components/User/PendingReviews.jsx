import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/home-ui/button"; 
import { toast } from 'react-hot-toast';

const PendingReviews = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('/api/customer/bookings'); 
        const data = await res.json();
        const unreviewed = data.filter(booking => !booking.reviewed);
        setBookings(unreviewed);
      } catch (err) {
        toast.error('Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-10 space-y-4">
        <p className="text-gray-600">You’ve already reviewed all your bookings.</p>
        <Button
          onClick={() => navigate('/dashboard')}
          className="bg-orange-400 text-white hover:bg-orange-500 transition"
        >
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Pending Reviews</h2>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="border p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center"
          >
            <div className="text-sm sm:text-base space-y-1">
              <p><span className="font-medium">Driver:</span> {booking.driverName}</p>
              <p><span className="font-medium">Customer:</span> {booking.customerName}</p>
              <p><span className="font-medium">Date:</span> {new Date(booking.date).toLocaleDateString()}</p>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-4">
              {booking.reviewed ? (
                <span className="text-green-600 font-semibold">Reviewed ✅</span>
              ) : (
                <Button
                  onClick={() => navigate(`/reviews/${booking.id}`)}
                  className="bg-orange-400 text-white hover:bg-orange-500 transition"
                >
                  Write a Review
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingReviews;
