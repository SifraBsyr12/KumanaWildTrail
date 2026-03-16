import React, { useEffect, useState } from "react";
import Sidebar from "../../components/User/Sidebar";
import Header from "../../components/User/Header";
import BookingCard from "../../components/User/BookingCard";
import LoyaltyPointsCard from "../../components/User/LoyaltyPointsCard";
import ReviewsCard from "../../components/User/ReviewCard";
import MemoryAlbum from "../../components/User/MemoryAlbum";
import {Link} from "react-router-dom";

const Dashboard = () => {
  const [localBookings, setLocalBookings] = useState([]);

  const sampleBookings = [
    {
      date: "May 28, 2025",
      time: "09:00 AM - 01:00 PM",
      status: "Accepted",
      driver: "John Mateo",
      color: "green-100",
      badge: "bg-green-200 text-green-800",
      buttonLabel: "Proceed to Payment",
    },
    {
      date: "June 05, 2025",
      time: "02:00 PM - 06:00 PM",
      status: "Pending",
      badge: "bg-yellow-100 text-yellow-800",
    },
    {
      date: "June 15, 2025",
      time: "10:00 AM - 02:00 PM",
      status: "Rejected",
      badge: "bg-red-100 text-red-800",
    },
  ];

  // Load local bookings temporarily
  useEffect(() => {
  const stored = JSON.parse(localStorage.getItem("bookings")) || [];
  setLocalBookings(stored);

  // Delay clearing to after first render
  setTimeout(() => {
    localStorage.removeItem("bookings");
  }, 1000); // 1 sec later
}, []);

  const allBookings = [...sampleBookings, ...localBookings];

  return (
    <div className="flex min-h-screen bg-[#fdfbe4] text-[#2f2f2f]">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6">
        <Header />

        {/* Booking Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {allBookings.map((booking, index) => (
            <BookingCard key={index} {...booking} />
          ))}
        </div>

        {/* Loyalty and Reviews */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <LoyaltyPointsCard />
          <ReviewsCard />
        </div>

       <MemoryAlbum /> 
      </main>
    </div>
  );
};

export default Dashboard;
