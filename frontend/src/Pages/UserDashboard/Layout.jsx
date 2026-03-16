// src/Layout.jsx
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/User/Sidebar";
import Dashboard from "./Dashboard";
import BookingHistory from "./BookingHistory";
import Reviews from "./Reviews";
import MakeBooking from "./MakeBooking";
import MemoryAlbum from "./MemoryAlbum";

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-[#fdfbe4]">
      <Sidebar />
      <main className="pt-4 px-4 md:pl-16 w-full bg-[#fdfbe4] min-h-screen text-[#2f2f2f] transition-all pl-[60px]">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/makebooking" element={<MakeBooking />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/memoryalbum" element={<MemoryAlbum />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
          <Route path="/bookinghistory" element={<BookingHistory />} />
        </Routes>
      </main>
    </div>
  );
};

export default Layout;
