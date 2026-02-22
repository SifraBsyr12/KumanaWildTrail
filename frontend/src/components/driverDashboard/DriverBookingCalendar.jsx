import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState } from "react";
import {
  FaSun,
  FaMoon,
  FaCalendarDay,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const dummyBookings = [
  {
    id: 1,
    date: "2025-06-01",
    timeSlot: "morning",
    tourType: "Normal Safari",
    status: "accepted",
    clientName: "John Safari",
    vehicle: "Toyota Land Cruiser",
  },
  {
    id: 2,
    date: "2025-06-01",
    timeSlot: "evening",
    tourType: "Bird Watching",
    status: "pending",
    clientName: "Sarah Bird",
    vehicle: "Land Rover Defender",
  },
  {
    id: 3,
    date: "2025-06-03",
    timeSlot: "full",
    tourType: "Normal Safari",
    status: "rejected",
    clientName: "Mike Explorer",
    vehicle: "Toyota Hilux",
  },
  {
    id: 4,
    date: "2025-06-15",
    timeSlot: "morning",
    tourType: "Photography Tour",
    status: "accepted",
    clientName: "Lisa Photographer",
    vehicle: "Toyota Land Cruiser",
  },
  {
    id: 5,
    date: "2025-06-20",
    timeSlot: "evening",
    tourType: "Family Safari",
    status: "pending",
    clientName: "The Wilson Family",
    vehicle: "Land Rover Defender",
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "accepted":
      return "bg-emerald-500";
    case "pending":
      return "bg-amber-500";
    case "rejected":
      return "bg-rose-500";
    default:
      return "bg-gray-400";
  }
};

const getSlotColor = (slot) => {
  switch (slot) {
    case "morning":
      return "bg-yellow-400";
    case "evening":
      return "bg-indigo-400";
    case "full":
      return "bg-blue-400";
    default:
      return "bg-gray-200";
  }
};

const getSlotIcon = (slot) => {
  switch (slot) {
    case "morning":
      return <FaSun className="text-white text-xs" />;
    case "evening":
      return <FaMoon className="text-white text-xs" />;
    case "full":
      return <FaCalendarDay className="text-white text-xs" />;
    default:
      return null;
  }
};

export default function DriverBookingCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  const bookingsByDate = dummyBookings.reduce((acc, booking) => {
    const key = booking.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(booking);
    return acc;
  }, {});

  const hasBookings = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return bookingsByDate[dateStr]?.length > 0;
  };

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;

    const dateStr = date.toISOString().split("T")[0];
    const dayBookings = bookingsByDate[dateStr] || [];

    return (
      <div className="absolute bottom-1 left-0 right-0">
        <div className="flex justify-center items-center gap-1">
          {dayBookings.map((b, idx) => (
            <span
              key={idx}
              className={`w-4 h-4 flex items-center justify-center rounded-full ${getSlotColor(
                b.timeSlot
              )}`}
              title={`${b.timeSlot} - ${b.tourType} (${b.status})`}
            >
              {getSlotIcon(b.timeSlot)}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const tileClassName = ({ date, view }) => {
    let classes = ["min-h-[90px] relative text-sm lg:text-base"];

    const dateStr = date.toISOString().split("T")[0];
    if (view === "month") {
      if (hasBookings(date)) {
        classes.push("border-b-4 border-emerald-400");
      }
      if (selectedDate?.date === dateStr) {
        classes.push("ring-2 ring-blue-500 ring-offset-1");
      }
      if (date.toDateString() === new Date().toDateString()) {
        classes.push("bg-blue-50 border border-blue-200");
      }
    }
    return classes.join(" ");
  };

  const showDetails = (date) => {
    const key = date.toISOString().split("T")[0];
    const selected = bookingsByDate[key] || [];
    setSelectedDate({ date: key, bookings: selected });
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Driver Booking Calendar
        </h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-1">
            <FaSun className="text-yellow-400" />
            <span className="text-sm text-gray-600">Morning</span>
          </div>
          <div className="flex items-center gap-1">
            <FaMoon className="text-indigo-400" />
            <span className="text-sm text-gray-600">Evening</span>
          </div>
          <div className="flex items-center gap-1">
            <FaCalendarDay className="text-blue-400" />
            <span className="text-sm text-gray-600">Full Day</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full border-b-4 border-emerald-400" />
            <span className="text-sm text-gray-600">Booked Date</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Calendar Section */}
        <div className="lg:w-2/3 w-full">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <Calendar
              onClickDay={showDetails}
              tileContent={tileContent}
              tileClassName={tileClassName}
              value={selectedDate}
              onActiveStartDateChange={({ activeStartDate }) =>
                setActiveStartDate(activeStartDate)
              }
              activeStartDate={activeStartDate}
              prevLabel={
                <FaChevronLeft className="text-gray-500 hover:text-blue-600" />
              }
              nextLabel={
                <FaChevronRight className="text-gray-500 hover:text-blue-600" />
              }
              prev2Label={null}
              next2Label={null}
              className="w-full"
            />
          </div>
        </div>

        {/* Details Panel */}
        <div className="lg:w-1/3 w-full bg-gray-50 rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
            {selectedDate?.date
              ? `Bookings on ${selectedDate.date}`
              : "Select a date to view bookings"}
          </h3>

          {selectedDate?.bookings?.length ? (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {selectedDate.bookings.map((booking) => (
                <div
                  key={booking.id}
                  className={`p-3 bg-white rounded-lg border-l-4 ${getStatusColor(
                    booking.status
                  )} shadow-xs`}
                >
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-bold text-gray-800 capitalize">
                        {booking.tourType}
                      </h4>
                      <div className="flex items-center mt-1 text-sm">
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${getSlotColor(
                            booking.timeSlot
                          )}`}
                        ></span>
                        <span className="text-gray-600 capitalize">
                          {booking.timeSlot} slot
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(
                        booking.status
                      )} text-white`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-100 text-sm">
                    <div className="text-gray-600">
                      <span className="font-medium">Client:</span>{" "}
                      {booking.clientName}
                    </div>
                    <div className="text-gray-600">
                      <span className="font-medium">Vehicle:</span>{" "}
                      {booking.vehicle}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-4 rounded-lg text-center text-gray-500">
              {selectedDate?.date
                ? "No bookings on this date"
                : "Click on any marked date to view bookings"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
