import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Sidebar from "../components/adminDashboard/Sidebar";
import Header from "../components/adminDashboard/Header";
import StatsCard from "../components/adminDashboard/StatsCard";
import MapView from "../components/adminDashboard/MapView";
import BookingItem from "../components/adminDashboard/BookingItem";
const ReviewsTable = lazy(() =>
  import("../components/adminDashboard/ReviewsTable")
);
import LoyaltyControl from "../components/adminDashboard/LoyaltyControl";
const SightingSummary = lazy(() =>
  import("../components/adminDashboard/SightingSummary")
);
const DriverManagement = lazy(() =>
  import("../components/adminDashboard/DriverManagement.jsx")
);
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/adminDashboard-ui/card";
import { Badge } from "../components/ui/adminDashboard-ui/Badge";
import { Button } from "../components/ui/adminDashboard-ui/Button";
import {
  CalendarClockIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  UsersIcon,
  XCircleIcon,
  RefreshCwIcon,
} from "lucide-react";

const token = localStorage.getItem("token");
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [admin, setAdmin] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [todaysSafaris, setTodaysSafaris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all"); // all, pending, confirmed, cancelled
  const navigate = useNavigate();

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  // Fetch bookings from backend
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      //const today = new Date().toISOString();
      const today = "2024-11-06T11:36:00.000Z";

      const response = await fetch(
        `${backendUrl}/api/admin/getAllUpcomingBooking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ today }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      setBookings(data);

      const todayDate = new Date().toISOString().split("T")[0];
      const todaySafaris = data.filter((booking) => {
        const safariDate = booking.safariDate?.split("T")[0];
        return safariDate === todayDate && booking.status !== "cancelled";
      });

      setTodaysSafaris(todaySafaris);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
      setTodaysSafaris([]);
    } finally {
      setLoading(false);
    }
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Get status badge for today's safaris
  const getSafariStatus = (booking) => {
    const now = new Date();
    const safariTime = new Date(booking.safariDate);
    const [hours, minutes] = booking.bookingTime.split(":");
    safariTime.setHours(parseInt(hours), parseInt(minutes));

    const diffMinutes = (safariTime - now) / (1000 * 60);

    if (diffMinutes < 0) return "completed";
    if (diffMinutes < 30) return "in-progress";
    if (diffMinutes < 120) return "starting-soon";
    return "scheduled";
  };

  // Filter bookings based on status
  const filteredBookings = bookings.filter((booking) => {
    if (filterStatus === "all") return true;
    return booking.status === filterStatus;
  });

  // Count bookings by status
  const bookingCounts = {
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* <Sidebar /> */}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Dashboard"
          breadcrumbs={["Home", "Dashboard"]}
          adminName={admin?.name}
        />

        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-safari-cream/30 bg-topography bg-opacity-5">
          {/* Welcome Section */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-safari-forest mb-2">
                Welcome, {admin?.name || "Admin"}!
              </h2>
              <p className="text-gray-600">
                Manage your wildlife safari operations efficiently from this
                dashboard.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() =>
                  navigate("/adminDashboard/BookingManagement", {
                    state: {
                      bookings: filteredBookings, // Rename to avoid confusion
                      fromDashboard: true,
                    },
                  })
                }
                className="bg-safari-forest text-white px-4 py-2 rounded hover:bg-safari-leaf transition"
              >
                Booking Management
              </button>
              <button
                onClick={() => navigate("/adminDashboard/packages")}
                className="bg-safari-forest text-white px-4 py-2 rounded hover:bg-safari-leaf transition"
              >
                Package Management
              </button>
            </div>
          </div>

          <div className="space-y-6 pb-8">
            {/* Overview Section */}
            <section id="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <MapView />
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="font-playfair text-lg font-bold text-safari-forest">
                          Today's Safaris
                        </CardTitle>
                        <CardDescription>
                          Scheduled safari trips for today
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={fetchBookings}
                        disabled={loading}
                      >
                        <RefreshCwIcon
                          className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                        />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8 text-gray-500">
                        Loading safaris...
                      </div>
                    ) : todaysSafaris.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No safaris scheduled for today
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {todaysSafaris.map((safari) => {
                          const status = getSafariStatus(safari);
                          return (
                            <div
                              key={safari.id}
                              className="flex justify-between items-center p-2 rounded-lg border border-gray-100"
                            >
                              <div>
                                <div className="flex items-center">
                                  <span className="font-medium text-safari-forest">
                                    {formatTime(safari.bookingTime)}
                                  </span>
                                  <span className="mx-2 text-gray-300">•</span>
                                  <span className="text-sm">
                                    {safari.driverName || "No Driver"}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {safari.numAdults}{" "}
                                  {safari.numAdults === 1 ? "guest" : "guests"}{" "}
                                  • {safari.packageName}
                                </div>
                              </div>
                              <Badge
                                variant="outline"
                                className={`
                                  ${
                                    status === "in-progress" ||
                                    status === "completed"
                                      ? "bg-green-50 text-green-600 border-green-200"
                                      : ""
                                  }
                                  ${
                                    status === "starting-soon"
                                      ? "bg-blue-50 text-blue-600 border-blue-200"
                                      : ""
                                  }
                                  ${
                                    status === "scheduled"
                                      ? "bg-gray-50 text-gray-600 border-gray-200"
                                      : ""
                                  }
                                `}
                              >
                                {status === "in-progress" ? "In Progress" : ""}
                                {status === "completed" ? "Completed" : ""}
                                {status === "starting-soon"
                                  ? "Starting Soon"
                                  : ""}
                                {status === "scheduled" ? "Scheduled" : ""}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-500">
                          Quick Stats
                        </h4>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => navigate("/adminDashboard/drivers")}
                        >
                          View All
                        </Button>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div className="border rounded-md p-2 text-center">
                          <div className="text-xs text-gray-500">
                            Today's Safaris
                          </div>
                          <div className="text-lg font-bold text-safari-forest">
                            {todaysSafaris.length}
                          </div>
                        </div>
                        <div className="border rounded-md p-2 text-center">
                          <div className="text-xs text-gray-500">
                            Total Bookings
                          </div>
                          <div className="text-lg font-bold text-safari-forest">
                            {bookings.length}
                          </div>
                        </div>
                        <div className="border rounded-md p-2 text-center">
                          <div className="text-xs text-gray-500">Pending</div>
                          <div className="text-lg font-bold text-safari-forest">
                            {bookingCounts.pending}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* <section id="bookings" className="pt-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-playfair font-bold text-safari-forest">
                  Booking Management
                </h2>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant={filterStatus === "all" ? "default" : "outline"}
                    className="h-9"
                    onClick={() => setFilterStatus("all")}
                  >
                    All ({bookings.length})
                  </Button>
                  <Button
                    size="sm"
                    variant={filterStatus === "confirmed" ? "default" : "outline"}
                    className="h-9"
                    onClick={() => setFilterStatus("confirmed")}
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Confirmed ({bookingCounts.confirmed})
                  </Button>
                  <Button
                    size="sm"
                    variant={filterStatus === "pending" ? "default" : "outline"}
                    className="h-9"
                    onClick={() => setFilterStatus("pending")}
                  >
                    <ClockIcon className="h-4 w-4 mr-1" />
                    Pending ({bookingCounts.pending})
                  </Button>
                  <Button
                    size="sm"
                    variant={filterStatus === "cancelled" ? "default" : "outline"}
                    className="h-9"
                    onClick={() => setFilterStatus("cancelled")}
                  >
                    <XCircleIcon className="h-4 w-4 mr-1" />
                    Cancelled ({bookingCounts.cancelled})
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="bg-white p-8 rounded-lg text-center text-gray-500">
                  Loading bookings...
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="bg-white p-8 rounded-lg text-center text-gray-500">
                  No {filterStatus !== "all" ? filterStatus : ""} bookings found
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredBookings.map((booking) => (
                    <BookingItem key={booking.id} booking={booking} />
                  ))}
                </div>
              )}
            </section> */}

            {/* Reviews and Loyalty */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
              <div className="lg:col-span-2">
                {token ? (
                  <Suspense fallback={<div>Loading reviews...</div>}>
                    <ReviewsTable />
                  </Suspense>
                ) : (
                  <div>Checking login status...</div>
                )}
              </div>
              <div>
                <LoyaltyControl />
              </div>
            </div>

            {/* Driver Management Section */}
            <Suspense fallback={<div>Loading driver management...</div>}>
              <DriverManagement />
            </Suspense>

            {/* Sighting Summary */}
            <section id="summary" className="pt-4 bg-white">
              <Suspense fallback={<div>Loading summary...</div>}>
                <SightingSummary />
              </Suspense>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
