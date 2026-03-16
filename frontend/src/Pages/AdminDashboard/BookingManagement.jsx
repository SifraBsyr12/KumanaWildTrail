// src/pages/adminDashboard/BookingManagement.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookingItem from "@/components/adminDashboard/BookingItem";
import { Button } from "@/components/ui/adminDashboard-ui/Button";
import {
  RefreshCwIcon,
  AlertCircleIcon,
  SearchIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*                     CONFIGURATION                                   */
/* ------------------------------------------------------------------ */
const token = localStorage.getItem("token");
const backendUrl = "http://localhost:8080";

/* ------------------------------------------------------------------ */
/*                     BOOKING MANAGEMENT COMPONENT                   */
/* ------------------------------------------------------------------ */
const BookingManagement = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("upcoming"); // "upcoming" or "all"
  const [searchQuery, setSearchQuery] = useState("");

  // -----------------------------------------------------------------
  // 1. FETCH UPCOMING BOOKINGS
  // -----------------------------------------------------------------
  const fetchUpcomingBookings = async () => {
    if (!token) {
      setError("Authentication token missing. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const today = new Date().toISOString();

      const response = await fetch(`${backendUrl}/api/admin/getAllUpcomingBooking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ today }),
      });

      if (!response.ok) {
        const txt = await response.text();
        throw new Error(`HTTP ${response.status}: ${txt}`);
      }

      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("[BookingManagement] Fetch error:", err);
      setError(err.message || "Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------------
  // 2. FETCH ALL BOOKINGS (INCLUDING PAST)
  // -----------------------------------------------------------------
  const fetchAllBookings = async () => {
    if (!token) {
      setError("Authentication token missing. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${backendUrl}/api/admin/getAllBooking`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const txt = await response.text();
        throw new Error(`HTTP ${response.status}: ${txt}`);
      }

      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("[BookingManagement] Fetch error:", err);
      setError(err.message || "Failed to load all bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------------
  // 3. CANCEL BOOKING – ONLY THIS FUNCTION CALLS THE API
  // -----------------------------------------------------------------
  const cancelBooking = async (bookingId, cancelReason) => {
    if (!token) throw new Error("Authentication token missing");

    const response = await fetch(`${backendUrl}/api/admin/${bookingId}/cancelBooking`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        cancelReason: cancelReason || "Cancelled by admin" 
      }),
    });

    if (!response.ok) {
      const txt = await response.text();
      throw new Error(`Failed to cancel booking: ${txt}`);
    }

    return await response.json();
  };

  // -----------------------------------------------------------------
  // 4. FETCH AVAILABLE DRIVERS (for BookingItem)
  // -----------------------------------------------------------------
  const fetchAvailableDrivers = async (safariDate) => {
    if (!token) return [];

    try {
      const url = `${backendUrl}/api/admin/getAvailableDrivers?bookingDate=${safariDate}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch drivers");
      const drivers = await response.json();

      return drivers
        .filter((d) => d.isAvailable)
        .map((d) => ({
          id: d.id,
          name: d.name,
          vehicle: d.vehicle_type,
          seatingCapacity: d.seating_capacity,
          photoUrl: d.photo_url,
          status: "available",
        }));
    } catch (err) {
      console.error("[BookingManagement] Driver fetch error:", err);
      return [];
    }
  };

  // -----------------------------------------------------------------
  // 5. INITIAL LOAD
  // -----------------------------------------------------------------
  useEffect(() => {
    if (viewMode === "upcoming") {
      fetchUpcomingBookings();
    } else {
      fetchAllBookings();
    }
  }, [viewMode]);

  // -----------------------------------------------------------------
  // 6. FILTERING & SEARCH
  // -----------------------------------------------------------------
  useEffect(() => {
    let list = [...bookings];

    // Filter by status
    if (filterStatus === "payment_pending") {
      list = list.filter((b) => b.paymentStatus === "pending");
    } else if (filterStatus !== "all") {
      list = list.filter((b) => b.status === filterStatus);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      list = list.filter(
        (b) =>
          b.guestUserName?.toLowerCase().includes(query) ||
          b.customerName?.toLowerCase().includes(query) ||
          b.guestUserEmail?.toLowerCase().includes(query) ||
          b.customerEmail?.toLowerCase().includes(query) ||
          b.guestUserPhone?.toLowerCase().includes(query) ||
          b.customerPhone?.toLowerCase().includes(query) ||
          b.packageName?.toLowerCase().includes(query) ||
          b.tourName?.toLowerCase().includes(query) ||
          b.id?.toString().includes(query)
      );
    }

    setFiltered(list);
  }, [bookings, filterStatus, searchQuery]);

  // -----------------------------------------------------------------
  // 7. COUNTS FOR TABS
  // -----------------------------------------------------------------
  const counts = {
    all: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
    payment_pending: bookings.filter((b) => b.paymentStatus === "pending").length,
    external_driver: bookings.filter((b) => b.status === "external_driver").length,
  };

  // -----------------------------------------------------------------
  // 8. REFRESH HANDLERS
  // -----------------------------------------------------------------
  const handleRefresh = () => {
    if (viewMode === "upcoming") {
      fetchUpcomingBookings();
    } else {
      fetchAllBookings();
    }
  };

  const handleBookingUpdated = () => {
    handleRefresh();
  };

  // -----------------------------------------------------------------
  // UI
  // -----------------------------------------------------------------
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen max-h-screen overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-safari-forest">Booking Management</h1>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} disabled={loading} size="sm" variant="outline">
            <RefreshCwIcon className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex gap-2">
        <Button
          onClick={() => setViewMode("upcoming")}
          variant={viewMode === "upcoming" ? "default" : "outline"}
          size="sm"
        >
          Upcoming Bookings
        </Button>
        <Button
          onClick={() => setViewMode("all")}
          variant={viewMode === "all" ? "default" : "outline"}
          size="sm"
        >
          All Bookings
        </Button>
      </div>

      {/* Search Bar */}
      {viewMode === "all" && (
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, tour, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safari-forest focus:border-transparent"
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start gap-2">
          <AlertCircleIcon className="h-5 w-5 mt-0.5" />
          <div>
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-gray-200 overflow-x-auto">
        {[
          { key: "all", label: "All" },
          { key: "pending", label: "Pending" },
          { key: "confirmed", label: "Confirmed" },
          { key: "payment_pending", label: "Payment Pending" },
          { key: "external_driver", label: "External Driver" },
          { key: "cancelled", label: "Cancelled" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap
              ${filterStatus === tab.key
                ? "border-safari-forest text-safari-forest"
                : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
          >
            {tab.label} ({counts[tab.key]})
          </button>
        ))}
      </div>

      {/* Content - Scrollable Area */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            <RefreshCwIcon className="inline-block h-6 w-6 animate-spin mr-2" />
            Loading bookings…
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg border">
            {searchQuery ? (
              <>No bookings found matching "{searchQuery}"</>
            ) : (
              <>No {filterStatus !== "all" ? filterStatus.replace("_", " ") : ""} bookings found.</>
            )}
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {filtered.map((booking) => (
              <BookingItem
                key={booking.id}
                booking={booking}
                onUpdate={handleBookingUpdated}
                onCancel={cancelBooking}                    // ← ONLY this runs
                fetchAvailableDrivers={fetchAvailableDrivers}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingManagement;