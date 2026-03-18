import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import DriverDashboard from './Pages/DriverDashboard';
import Review from './Pages/Review';
import ProtectedRoute from './components/common/ProtectedRoute';
import Unauthorized from './Pages/util/UnauthorizedPage';
import AdminDashboard from './Pages/AdminDashboard';
import UserDashboard from './Pages/UserDashboard/UserDashboard';
import AdminDashboardPackages from './Pages/AdminDashboard/Packages';
import SafariPackages from './Pages/Packages/SafariPackages';
import ActivityPackages from './Pages/Packages/ActivityPackages';
import HirePackages from './Pages/Packages/HirePackages';
import BookingComplete from './Pages/util/BookingComplete';
import BookingDetails from "./Pages/Booking/BookingDetails";
import BookingMangement from './Pages/AdminDashboard/BookingManagement';
import { Toaster } from 'react-hot-toast';


function App() {
  console.log("App component rendered");

  return (
    <>
    <Toaster position="top-right" reverseOrder={false} />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/DriverDashboard"
        element={
          <ProtectedRoute requiredRole="DRIVER">
            <DriverDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/review" element={<Review />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/customerDashboard" element={<UserDashboard />} />
      <Route
        path="/AdminDashboard"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/AdminDashboard/Packages"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminDashboardPackages/>
          </ProtectedRoute>
        }
      />
       <Route
        path="/AdminDashboard/BookingManagement"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <BookingMangement/>
          </ProtectedRoute>
        }
      />
      <Route path="/Packages/safari_packages" element={<SafariPackages />} />
      <Route path="/Packages/activity_packages" element={<ActivityPackages />} />
      <Route path="/Packages/hire_packages" element={<HirePackages />} />
      <Route path="/booking/complete" element={<BookingComplete />} />
      <Route path="/Booking/:encryptedId" element={<BookingDetails />} />
    </Routes>
    </>
  );
}

export default App;
