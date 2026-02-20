import { useState, useEffect } from "react";
import {
  AlertCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  XCircleIcon,
  UsersIcon,
} from "lucide-react";

import { Button } from "@/components/ui/home-ui/Button";
import { Badge } from "@/components/ui/home-ui/Badge";
import { Progress } from "@/components/ui/home-ui/Progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/home-ui/Dialog";
import { Textarea } from "@/components/ui/home-ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/home-ui/Select";
import { Avatar, AvatarFallback } from "@/components/ui/home-ui/Avatar";
const token = localStorage.getItem("token");
const BASE_URL = process.env.VITE_BACKEND_URL || "http://localhost:8080";
const getStatusBadge = (status) => {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
          Pending
        </Badge>
      );
    case "assigned":
    case "driver_accepted":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
          Driver Assigned
        </Badge>
      );
    case "confirmed":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
          Confirmed
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
          Cancelled
        </Badge>
      );
    case "no_driver":
      return (
        <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
          No Driver Available
        </Badge>
      );
    case "external_driver":
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
          External Driver
        </Badge>
      );
    default:
      return null;
  }
};

const getStatusProgress = (status) => {
  switch (status) {
    case "pending":
      return 25;
    case "assigned":
    case "driver_accepted":
    case "no_driver":
      return 50;
    case "external_driver":
      return 75;
    case "confirmed":
    case "cancelled":
      return 100;
    default:
      return 0;
  }
};

// Format date from ISO string to readable format
const formatDate = (isoDate) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric", 
    year: "numeric" 
  });
};

// Format time from time string
const formatTime = (timeString) => {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

// Fetch available drivers from backend
const fetchAvailableDrivers = async (safariDate) => {
  try {
    const formData = new FormData();
    formData.append("bookingDate", safariDate);
    const response = await fetch(
      `${BASE_URL}/api/admin/getAvailableDrivers?bookingDate=${safariDate}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body:formData,
      },
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch drivers");
    }
    
    const drivers = await response.json();
    return drivers
      .filter(d => d.isAvailable)
      .map(d => ({
        id: d.id,
        name: d.name,
        vehicle: d.vehicle_type,
        seatingCapacity: d.seating_capacity,
        photoUrl: d.photo_url,
        status: "available"
      }));
  } catch (error) {
    console.error("Error fetching drivers:", error);
    return [];
  }
};

const BookingItem = ({ booking }) => {
  // Destructure from booking object with proper mapping
  const {
    id,
    guestUserName: customerName,
    guestUserEmail: customerEmail,
    guestUserPhone: customerPhone,
    safariDate,
    bookingTime,
    numAdults: persons,
    status: initialStatus,
    driverStatus,
    packageName,
    totalAmount,
    paymentStatus,
    driverName,
    pickupLocation
  } = booking;

  /* ------------------------------- State ----------------------------------- */
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  const [expanded, setExpanded] = useState(false);

  // Cancel dialog
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  // Assign dialog
  const [assignOpen, setAssignOpen] = useState(false);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [loadingDrivers, setLoadingDrivers] = useState(false);

  // External driver dialog
  const [externalDriverOpen, setExternalDriverOpen] = useState(false);
  const [externalDriverName, setExternalDriverName] = useState("");
  const [externalDriverPhone, setExternalDriverPhone] = useState("");
  const [externalDriverVehicle, setExternalDriverVehicle] = useState("");

  // Format dates for display
  const formattedDate = formatDate(safariDate);
  const formattedTime = formatTime(bookingTime);

  /* ---------------------------- API Handlers ---------------------------- */

  const openAssignDialog = async () => {
    setLoadingDrivers(true);
    setAssignOpen(true);
    try {
      const drivers = await fetchAvailableDrivers(safariDate);
      setAvailableDrivers(drivers);
      if (drivers.length) setSelectedDriverId(String(drivers[0].id));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDrivers(false);
    }
  };

  const assignAndConfirm = async () => {
    if (!selectedDriverId) return;
    
    try {
      const response = await fetch(`${BASE_URL}/api/admin/bookings/${id}/assign-driver`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          driverId: parseInt(selectedDriverId),
          status: "confirmed",
          driverStatus: "accepted"
        })
      });

      if (!response.ok) throw new Error("Failed to assign driver");

      const driver = availableDrivers.find((d) => String(d.id) === selectedDriverId);
      console.log("Assigned driver:", driver.name, "to booking", id);
      
      setCurrentStatus("confirmed");
      setAssignOpen(false);
      
    } catch (error) {
      console.error("Error assigning driver:", error);
      alert("Failed to assign driver. Please try again.");
    }
  };

  const useExternalDriver = () => {
    setAssignOpen(false);
    setExternalDriverOpen(true);
  };

  const confirmExternalDriver = async () => {
    if (!externalDriverName.trim() || !externalDriverPhone.trim()) {
      alert("Please fill in driver name and phone number");
      return;
    }

    try {
      const response = await fetch(`/api/admin/bookings/${id}/external-driver`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          externalDriverName: externalDriverName.trim(),
          externalDriverPhone: externalDriverPhone.trim(),
          externalDriverVehicle: externalDriverVehicle.trim(),
          status: "external_driver"
        })
      });

      if (!response.ok) throw new Error("Failed to assign external driver");

      console.log("External driver assigned to booking", id);
      setCurrentStatus("external_driver");
      setExternalDriverOpen(false);
      setExternalDriverName("");
      setExternalDriverPhone("");
      setExternalDriverVehicle("");
      
      window.location.reload();
    } catch (error) {
      console.error("Error assigning external driver:", error);
      alert("Failed to assign external driver. Please try again.");
    }
  };

  const noDriverAvailable = async () => {
    try {
      const response = await fetch(`/api/admin/bookings/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          status: "no_driver"
        })
      });

      if (!response.ok) throw new Error("Failed to update status");

      console.log("No driver available for booking", id);
      setCurrentStatus("no_driver");
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const cancelBooking = async () => {
    if (!cancelReason.trim()) return;

    try {
      const response = await fetch(`${BASE_URL}/api/admin/bookings/${id}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          status: "cancelled",
          cancellationReason: cancelReason.trim()
        })
      });

      if (!response.ok) throw new Error("Failed to cancel booking");

      console.log("Cancelled booking", id, "Reason:", cancelReason);
      setCurrentStatus("cancelled");
      setCancelOpen(false);
      setCancelReason("");
      
      window.location.reload();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking. Please try again.");
    }
  };

  const confirmExternalDriverBooking = async () => {
    try {
      const response = await fetch(`/api/admin/bookings/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          status: "confirmed"
        })
      });

      if (!response.ok) throw new Error("Failed to confirm booking");

      setCurrentStatus("confirmed");
      window.location.reload();
    } catch (error) {
      console.error("Error confirming booking:", error);
      alert("Failed to confirm booking. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-3">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
          <div>
            <div className="flex items-center">
              <h3 className="font-semibold text-safari-forest">{customerName}</h3>
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-sm text-gray-500">Booking #{id}</span>
            </div>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <ClockIcon className="h-3.5 w-3.5 mr-1" />
              {formattedDate}, {formattedTime} • {persons} {persons === 1 ? "Person" : "Persons"} • {packageName}
            </div>
            {driverName && (
              <div className="flex items-center mt-1 text-sm text-safari-teal">
                <UserIcon className="h-3.5 w-3.5 mr-1" />
                Driver: {driverName}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {getStatusBadge(currentStatus)}
            <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
              {expanded ? "Hide" : "Details"}
            </Button>
          </div>
        </div>

        {/* -------------------------- Progress -------------------------- */}
        {currentStatus !== "cancelled" && currentStatus !== "confirmed" && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Pending</span>
              <span className="text-center">Driver Assigned</span>
              <span className="text-right">Confirmed</span>
            </div>
            <Progress value={getStatusProgress(currentStatus)} className="h-1.5" />
          </div>
          
        )}

        {/* -------------------------- Expanded Details -------------------------- */}
        {expanded && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer */}
              <div>
                <h4 className="text-sm font-medium text-gray-500">Customer Details</h4>
                <div className="mt-2 space-y-1 text-sm">
                  <p>
                    <span className="text-gray-500">Name:</span> {customerName}
                  </p>
                  <p>
                    <span className="text-gray-500">Phone:</span> {customerPhone}
                  </p>
                  <p>
                    <span className="text-gray-500">Email:</span> {customerEmail}
                  </p>
                </div>
              </div>

              {/* Safari */}
              <div>
                <h4 className="text-sm font-medium text-gray-500">Safari Details</h4>
                <div className="mt-2 space-y-1 text-sm">
                  <p>
                    <span className="text-gray-500">Date:</span> {formattedDate}
                  </p>
                  <p>
                    <span className="text-gray-500">Time:</span> {formattedTime}
                  </p>
                  <p>
                    <span className="text-gray-500">Package:</span> {packageName}
                  </p>
                  <p>
                    <span className="text-gray-500">Amount:</span> LKR {totalAmount?.toLocaleString()}
                  </p>
                  <p>
                    <span className="text-gray-500">Payment:</span> {paymentStatus}
                  </p>
                  {pickupLocation && (
                    <p>
                      <span className="text-gray-500">Pickup:</span> {pickupLocation}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* -------------------------- Action Buttons -------------------------- */}
            <div className="flex flex-wrap gap-2 mt-4">
              {/* Pending → Assign */}
              {currentStatus === "pending" && (
                <>
                  <Button
                    size="sm"
                    className="bg-safari-teal hover:bg-safari-teal/80"
                    onClick={openAssignDialog}
                  >
                    <UsersIcon className="h-4 w-4 mr-1" />
                    Assign Driver
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
                    onClick={() => setExternalDriverOpen(true)}
                  >
                    External Driver
                  </Button>
                </>
              )}

              {/* No driver → retry / external / cancel */}
              {currentStatus === "no_driver" && (
                <div className="flex flex-wrap gap-2 w-full">
                  <Button
                    size="sm"
                    className="bg-safari-teal hover:bg-safari-teal/80"
                    onClick={openAssignDialog}
                  >
                    <UsersIcon className="h-4 w-4 mr-1" />
                    Try Again
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
                    onClick={() => setExternalDriverOpen(true)}
                  >
                    External Driver
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => setCancelOpen(true)}
                  >
                    <XCircleIcon className="h-4 w-4 mr-1" />
                    Cancel Safari
                  </Button>
                </div>
              )}

              {/* External driver → confirm */}
              {currentStatus === "external_driver" && (
                <Button
                  size="sm"
                  className="bg-safari-teal hover:bg-safari-teal/80"
                  onClick={confirmExternalDriverBooking}
                >
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  Confirm Booking
                </Button>
              )}

              {/* General cancel (any non-final state) */}
              {currentStatus !== "cancelled" && currentStatus !== "confirmed" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => setCancelOpen(true)}
                >
                  <XCircleIcon className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* =========================== ASSIGN DRIVER DIALOG =========================== */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Assign Driver</DialogTitle>
            <DialogDescription>
              Choose an available driver for {formattedDate} at {formattedTime}.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {loadingDrivers ? (
              <p className="text-sm text-gray-500">Loading drivers…</p>
            ) : availableDrivers.length === 0 ? (
              <div className="text-center py-6">
                <AlertCircleIcon className="h-10 w-10 mx-auto mb-2 text-amber-500" />
                <p className="text-sm text-gray-600 mb-4">No drivers available at this time.</p>
                <Button
                  variant="outline"
                  className="text-purple-600 border-purple-200 hover:bg-purple-50"
                  onClick={useExternalDriver}
                >
                  Use External Driver Instead
                </Button>
              </div>
            ) : (
              <>
                <Select value={selectedDriverId} onValueChange={setSelectedDriverId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDrivers.map((driver) => (
                      <SelectItem key={driver.id} value={String(driver.id)}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>
                              {driver.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{driver.name}</p>
                            <p className="text-xs text-gray-500">{driver.vehicle}</p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="w-full text-purple-600 border-purple-200 hover:bg-purple-50"
                    onClick={useExternalDriver}
                  >
                    Or Use External Driver
                  </Button>
                </div>
              </>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setAssignOpen(false)}>
              Cancel
            </Button>
            {availableDrivers.length > 0 && (
              <Button
                className="bg-safari-teal hover:bg-safari-teal/80"
                onClick={assignAndConfirm}
                disabled={!selectedDriverId || loadingDrivers}
              >
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                Assign & Confirm
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =========================== EXTERNAL DRIVER DIALOG =========================== */}
      <Dialog open={externalDriverOpen} onOpenChange={setExternalDriverOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign External Driver</DialogTitle>
            <DialogDescription>
              Enter the external driver's information for this booking.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Driver Name *
              </label>
              <input
                type="text"
                placeholder="Enter driver name"
                value={externalDriverName}
                onChange={(e) => setExternalDriverName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-safari-teal"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Phone Number *
              </label>
              <input
                type="tel"
                placeholder="Enter phone number"
                value={externalDriverPhone}
                onChange={(e) => setExternalDriverPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-safari-teal"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Vehicle Details (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Toyota Land Cruiser - ABC 1234"
                value={externalDriverVehicle}
                onChange={(e) => setExternalDriverVehicle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-safari-teal"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setExternalDriverOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={confirmExternalDriver}
              disabled={!externalDriverName.trim() || !externalDriverPhone.trim()}
            >
              <CheckCircleIcon className="h-4 w-4 mr-1" />
              Assign External Driver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =========================== CANCEL DIALOG =========================== */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Safari Booking</DialogTitle>
            <DialogDescription>
              Please provide a reason for cancellation.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Textarea
              placeholder="Reason for cancellation..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setCancelOpen(false)}>
              Go Back
            </Button>
            <Button
              variant="destructive"
              onClick={cancelBooking}
              disabled={!cancelReason.trim()}
            >
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingItem;