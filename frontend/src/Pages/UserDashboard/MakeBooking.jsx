import React, { useState } from "react";
import Button from "../components/User/Button";
import image from "../assets/image.jpeg";
import Input from "../components/User/Input";

const MakeBooking = () => {
  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    safariPackageId: "",
    numberOfGuests: 1,
    safariDate: "",
    specialRequests: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newBooking = {
      date: new Date(formData.safariDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: "09:00 AM - 01:00 PM",
      status: "Pending",
      driver: "Not assigned",
      color: "yellow-100",
      badge: "bg-yellow-100 text-yellow-800",
      buttonLabel: "View Details",
    };

    const existingBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    localStorage.setItem("bookings", JSON.stringify([...existingBookings, newBooking]));

    alert("Booking submitted successfully!");

    setFormData({
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      safariPackageId: "",
      numberOfGuests: 1,
      safariDate: "",
      specialRequests: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#fdfbe4] text-[#2f2f2f] px-4 md:px-12 py-10 pl-[100px] flex flex-col">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#4D7C0F]">
          Make a Safari Booking
        </h1>
        <p className="text-gray-600 mt-2">
          Fill in the details below to reserve your spot
        </p>
      </div>

      {/* Booking Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-0 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 max-w-6xl mx-auto overflow-hidden"
      >
        {/* Image Section */}
        <div className="w-full h-full">
          <img
            src={image}
            alt="Safari"
            className="object-cover h-full w-full rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
          />
        </div>

        {/* Form Fields */}
        <div className="p-6 md:p-8 space-y-4">
          <Input
            type="text"
            name="guestName"
            value={formData.guestName}
            onChange={handleChange}
            placeholder="Full Name *"
            className="w-full border rounded-md p-3 text-sm focus:outline-[#4D7C0F]"
            required
          />
          <Input
            type="email"
            name="guestEmail"
            value={formData.guestEmail}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full border rounded-md p-3 text-sm focus:outline-[#4D7C0F]"
          />
          <Input
            type="tel"
            name="guestPhone"
            value={formData.guestPhone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full border rounded-md p-3 text-sm focus:outline-[#4D7C0F]"
          />
          <Input
            type="number"
            name="safariPackageId"
            value={formData.safariPackageId}
            onChange={handleChange}
            placeholder="Safari Package ID "
            className="w-full border rounded-md p-3 text-sm focus:outline-[#4D7C0F]"
            required
          />
          <Input
            type="number"
            name="numberOfGuests"
            value={formData.numberOfGuests}
            onChange={handleChange}
            placeholder="Number of Guests "
            min={1}
            className="w-full border rounded-md p-3 text-sm focus:outline-[#4D7C0F]"
            required
          />
          <Input
            type="date"
            name="safariDate"
            value={formData.safariDate}
            onChange={handleChange}
            className="w-full border rounded-md p-3 text-sm focus:outline-[#4D7C0F]"
            required
          />
          <textarea
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            placeholder="Special Requests (optional)"
            rows={4}
            className="w-full border rounded-md p-3 text-sm resize-none focus:outline-[#4D7C0F]"
          />

          <Button
            label="Submit Booking"
            className="bg-[#4D7C0F] hover:bg-[#3e630b] text-white w-full py-3 rounded-md text-sm font-semibold transition"
          />
        </div>
      </form>
    </div>
  );
};

export default MakeBooking;
