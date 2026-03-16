import React, { useState } from "react";
import BookingCard from "../components/User/BookingCard";
import Button from "../components/User/Button";
import Input from "../components/User/Input";

const mockData = [
  {
    date: "May 28, 2025",
    time: "09:00 AM - 01:00 PM",
    status: "Accepted",
    driver: "John Mateo",
    badge: "bg-green-100 text-green-800",
    color: "green-100",
    buttonLabel: "Proceed to Payment",
  },
  {
    date: "June 05, 2025",
    time: "02:00 PM - 06:00 PM",
    status: "Pending",
    badge: "bg-yellow-100 text-yellow-800",
    color: "yellow-100",
  },
  {
    date: "June 15, 2025",
    time: "10:00 AM - 02:00 PM",
    status: "Rejected",
    badge: "bg-red-100 text-red-800",
    color: "red-100",
  },
  {
    date: "April 18, 2025",
    time: "08:00 AM - 12:00 PM",
    status: "Accepted",
    driver: "Sarah Johnson",
    badge: "bg-green-100 text-green-800",
    color: "green-100",
    buttonLabel: "Proceed to Payment",
  },
  {
    date: "March 10, 2025",
    time: "03:00 PM - 07:00 PM",
    status: "Accepted",
    driver: "Michael Chen",
    badge: "bg-green-100 text-green-800",
    color: "green-100",
    buttonLabel: "Proceed to Payment",
  },
];

const BookingHistory = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [filteredData, setFilteredData] = useState(mockData);

  // Function to normalize statuses
  const normalizeStatus = (status) => {
    if (status === "Accepted") return "Completed";
    if (status === "Rejected") return "Cancelled";
    return status;
  };

  const handleApplyFilter = () => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const filtered = mockData.filter((booking) => {
      const bookingDate = new Date(booking.date);
      const status = normalizeStatus(booking.status);

      const matchesDate =
        (!start || bookingDate >= start) && (!end || bookingDate <= end);
      const matchesStatus =
        statusFilter === "All" || status === statusFilter;

      return matchesDate && matchesStatus;
    });

    setFilteredData(filtered);
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setStatusFilter("All");
    setFilteredData(mockData);
  };

  const handleStatusClick = (status) => {
    setStatusFilter(status);
    const filtered = mockData.filter((booking) => {
      const bookingStatus = normalizeStatus(booking.status);
      return status === "All" || bookingStatus === status;
    });
    setFilteredData(filtered);
  };

  return (
    <div className="flex min-h-screen bg-[#fdfbe4] text-[#2f2f2f] flex-col px-4 py-6">
      {/* Page Header */}
      <h1 className="text-xl sm:text-2xl font-bold mb-1 text-[black]">
        Booking History
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Browse and filter your past safari bookings
      </p>

      {/* Filter Section */}
      <div className="bg-[#fefae0] rounded-md shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-1 text-[black]">
          Booking History
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          View and filter your past safari bookings
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded p-2 text-sm flex-1 text-[black]"
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded p-2 text-sm flex-1 text-[black]"
          />
          <Button
            label="Apply Filter"
            onClick={handleApplyFilter}
            className="bg-green-700 hover:bg-green-800 text-white text-sm px-4 py-2 rounded"
          />
          <Button
            label="Reset"
            onClick={handleReset}
            className="bg-white border border-gray-300 text-sm px-4 py-2 rounded hover:bg-gray-100 text-[black]"
          />
        </div>

        <div className="flex items-center gap-2 text-sm font-medium">
          <button
            onClick={() => handleStatusClick("All")}
            className={`px-4 py-2 rounded ${
              statusFilter === "All"
                ? "bg-[#4D7C0F] text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleStatusClick("Completed")}
            className={`px-4 py-2 rounded ${
              statusFilter === "Completed"
                ? "bg-yellow-500 text-white"
                : "bg-yellow-50 text-yellow-700"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => handleStatusClick("Cancelled")}
            className={`px-4 py-2 rounded ${
              statusFilter === "Cancelled"
                ? "bg-red-500 text-white"
                : "bg-red-50 text-red-700"
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-[black]">
        {filteredData.length > 0 ? (
          filteredData.map((booking, idx) => (
            <BookingCard key={idx} {...booking} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No bookings found.
          </p>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
