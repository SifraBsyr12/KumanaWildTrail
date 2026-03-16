import { useState, useEffect } from "react";
import Header from "../../components/adminDashboard/Header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/adminDashboard-ui/card";
import { Button } from "../../components/ui/adminDashboard-ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/adminDashboard-ui/dialog";
import { Input } from "../../components/ui/adminDashboard-ui/input";
import { Label } from "../../components/ui/adminDashboard-ui/label";
import SafariPackagesSection from "../../components/adminDashboard/PackageComponents/SafariPackagesSection";
import HirePackagesSection from "../../components/adminDashboard/PackageComponents/HirePackagesSection";
import ActivityPackagesSection from "../../components/adminDashboard/PackageComponents/ActivityPackagesSection";

const PackageManager = () => {
  const [admin, setAdmin] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [safariPackages, setSafariPackages] = useState([]);
  const [hirePackages, setHirePackages] = useState([]);
  const [activityPackages, setActivityPackages] = useState([]);
  const [editModal, setEditModal] = useState({
    open: false,
    type: "",
    package: null,
  });
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    type: "",
    packageId: null,
  });
  const [error, setError] = useState(null);
  
  const [timeSlots, setTimeSlots] = useState([]);
  const [newSlotStart, setNewSlotStart] = useState("");
  const [newSlotEnd, setNewSlotEnd] = useState("");

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) setAdmin(JSON.parse(storedAdmin));
    fetchPackages();
  }, []);

  const token = localStorage.getItem("token");
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
  const API_BASE = `${BASE_URL}/api/admin/packages`;

  const handleAddPackage = (type) => {
    setSelectedFile(null);
    setError(null);
    setTimeSlots([]); // Reset time slots
    setNewSlotStart("");
    setNewSlotEnd("");
    
    setEditModal({
      open: true,
      type,
      package: {
        packageID: null,
        packageName: "",
        packagePrice: null,
        packageType: type.toUpperCase(),
        imageUrl: "",
        details: "",
        maxPeople: null,
        vehicleType: "",
        tourName: "",
        capacity: null,
        time: "",
        startTime: "07:00",
        endTime: "16:00",
        location: "",
        timeSlots: [], // Add time slots field
      },
    });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setEditModal({
      ...editModal,
      package: { ...editModal.package, imageFile: e.target.files[0] },
    });
  };

  // Add a new time slot
  const handleAddTimeSlot = () => {
    if (!newSlotStart || !newSlotEnd) {
      setError("Please select both start and end times for the time slot.");
      return;
    }
    if (newSlotStart >= newSlotEnd) {
      setError("End time must be after start time.");
      return;
    }
    const newSlot = `${newSlotStart}-${newSlotEnd}`;
    if (timeSlots.includes(newSlot)) {
      setError("This time slot already exists.");
      return;
    }

    setTimeSlots([...timeSlots, newSlot]);
    setNewSlotStart("");
    setNewSlotEnd("");
    setError(null);
  };

  // Remove a time slot
  const handleRemoveTimeSlot = (index) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const handleSaveEdit = async () => {
    const { type, package: pkg } = editModal;

    // Type-specific validation
    let errors = [];
    if (type === "safari") {
      if (!pkg.packageName) errors.push("Package name is required.");
      if (!pkg.packagePrice || pkg.packagePrice <= 0) errors.push("Price must be greater than 0.");
      if (!pkg.startTime || !pkg.endTime) errors.push("Start and end times are required.");
      else if (pkg.startTime >= pkg.endTime) errors.push("End time must be after start time.");
    } else if (type === "activity") {
      if (!pkg.packageName) errors.push("Package name is required.");
      if (!pkg.packagePrice || pkg.packagePrice <= 0) errors.push("Price must be greater than 0.");
      if (!pkg.location) errors.push("Location is required.");
      if (timeSlots.length === 0) errors.push("At least one time slot is required.");
    } else if (type === "hire") {
      if (!pkg.vehicleType) errors.push("Vehicle type is required.");
      if (!pkg.tourName) errors.push("Tour name is required.");
      if (!pkg.packagePrice || pkg.packagePrice <= 0) errors.push("Price per day must be greater than 0.");
    }

    if (errors.length > 0) {
      setError(errors.join(" "));
      return;
    }

    const formData = new FormData();
    formData.append("packageType", type.toUpperCase());
    const packageName = type === "hire" ? `${pkg.vehicleType} - ${pkg.tourName}` : pkg.packageName;
    formData.append("packageName", packageName || "");

    if (type === "safari") {
      formData.append("maxPeople", pkg.maxPeople || 0);
      formData.append("details", pkg.details || "");
      formData.append("time", `${pkg.startTime}-${pkg.endTime}`);
    } else if (type === "activity") {
      formData.append("maxPeople", pkg.maxPeople || 0);
      formData.append("details", pkg.details || "");
      formData.append("location", pkg.location || "");
      formData.append("timeSlots", JSON.stringify(timeSlots));
    } else if (type === "hire") {
      formData.append("vehicleType", pkg.vehicleType || "");
      formData.append("tourName", pkg.tourName || "");
      formData.append("capacity", pkg.capacity || 0);
    }
    formData.append("packagePrice", pkg.packagePrice || 0);
    if (selectedFile) formData.append("imageFile", selectedFile);
    try {
      const method = pkg.packageID ? "PUT" : "POST";
      const url = pkg.packageID ? `${API_BASE}/${pkg.packageID}` : API_BASE;
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save package");
      }
      await res.json();
      fetchPackages();
      setEditModal({ open: false, type: "", package: null });
      setSelectedFile(null);
      setTimeSlots([]);
      setError(null);
    } catch (err) {
      console.error("Error saving package:", err);
      setError(err.message || "Failed to save package. Please try again.");
    }
  };

  const handleEdit = (type, pkg) => {
    if (!pkg.packageID) {
      setError("Cannot edit package: Invalid package ID.");
      return;
    }
    const [startTime, endTime] = pkg.time ? pkg.time.split("-") : ["07:00", "16:00"];

    let parsedTimeSlots = [];
    if (type === "activity" && pkg.timeSlots) {
      try {
        parsedTimeSlots = typeof pkg.timeSlots === "string" 
          ? JSON.parse(pkg.timeSlots) 
          : pkg.timeSlots;
      } catch (e) {
        console.error("Error parsing time slots:", e);
        parsedTimeSlots = [];
      }
    }

    setSelectedFile(null);
    setError(null);
    setTimeSlots(parsedTimeSlots);
    setNewSlotStart("");
    setNewSlotEnd("");
    
    setEditModal({
      open: true,
      type,
      package: {
        packageID: pkg.packageID,
        packageName: pkg.packageName || "",
        packagePrice: pkg.packagePrice || null,
        packageType: pkg.packageType || type.toUpperCase(),
        imageUrl: pkg.imageUrl || "",
        details: pkg.details || "",
        maxPeople: pkg.maxPeople || null,
        vehicleType: pkg.vehicleType || "",
        tourName: pkg.tourName || "",
        capacity: pkg.capacity || null,
        time: pkg.time || "",
        startTime: startTime || "07:00",
        endTime: endTime || "16:00",
        location: pkg.location || "",
        timeSlots: parsedTimeSlots,
        imageFile: null,
      },
    });
  };

  const handleDelete = (type, packageId) => {
    if (!packageId) {
      setError("Cannot delete package: Invalid package ID.");
      return;
    }

    setError(null);
    setDeleteModal({ open: true, type, packageId });
  };

  const handleConfirmDelete = async () => {
    const { packageId } = deleteModal;
    if (!packageId) {
      setError("Cannot delete package: Invalid package ID.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/${packageId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete package");
      fetchPackages();
      setDeleteModal({ open: false, type: "", packageId: null });
      setError(null);
    } catch (err) {
      console.error("Error deleting package:", err);
      setError("Failed to delete package. Please try again.");
    }
  };

  const fetchPackages = async () => {
    try {
      const res = await fetch(API_BASE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch packages");
      const data = await res.json();

      const mappedData = data.map((pkg) => ({
        packageID: pkg.packageID,
        packageName: pkg.packageName,
        packagePrice: pkg.packagePrice,
        packageType: pkg.packageType,
        imageUrl: pkg.imageUrl,
        details: pkg.details,
        maxPeople: pkg.maxPeople,
        vehicleType: pkg.vehicleType,
        tourName: pkg.tourName,
        capacity: pkg.capacity,
        time: pkg.time,
        location: pkg.location,
        timeSlots: pkg.timeSlots,
      }));

      setSafariPackages(mappedData.filter((p) => p.packageType === "SAFARI"));
      setHirePackages(mappedData.filter((p) => p.packageType === "HIRE"));
      setActivityPackages(mappedData.filter((p) => p.packageType === "ACTIVITY"));
      setError(null);
    } catch (err) {
      console.error("Error fetching packages:", err);
      setError("Failed to fetch packages. Please try again.");
    }
  };

  // Handler to strip leading zeros and ensure valid number
  const handleNumberChange = (value, field) => {
    // Remove leading zeros and convert to number, allow empty string
    const cleanedValue = value === "" ? null : Number(value.replace(/^0+/, "") || 0);
    setEditModal({
      ...editModal,
      package: { ...editModal.package, [field]: cleanedValue },
    });
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Package Management"
          breadcrumbs={["Home", "Dashboard", "Packages"]}
          adminName={admin?.name}
        />

        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-safari-cream/30 bg-topography bg-opacity-5">
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
              {error}
            </div>
          )}
          <div className="bg-white p-6 rounded-xl shadow-md mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-safari-forest mb-2">
                Welcome, {admin?.name || "Admin"}!
              </h2>
              <p className="text-gray-600">
                Manage safari, hire, and activity packages offered through Kumana TrailMate.
              </p>
            </div>
          </div>

          <div className="space-y-10 pb-8">
            <SafariPackagesSection
              packages={safariPackages}
              onAdd={() => handleAddPackage("safari")}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            <HirePackagesSection
              packages={hirePackages}
              onAdd={() => handleAddPackage("hire")}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            <ActivityPackagesSection
              packages={activityPackages}
              onAdd={() => handleAddPackage("activity")}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>

          {/* Edit Modal */}
          <Dialog
            open={editModal.open}
            onOpenChange={(open) => setEditModal({ ...editModal, open })}
          >
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-white">
              <DialogHeader>
                <DialogTitle className="text-safari-forest font-playfair">
                  {editModal.package?.packageID ? "Edit" : "Add"} {editModal.type.charAt(0).toUpperCase() + editModal.type.slice(1)} Package
                </DialogTitle>
                <DialogDescription>
                  {editModal.package?.packageID ? "Make changes to the package details below." : "Enter details for the new package."}
                </DialogDescription>
              </DialogHeader>
              {editModal.package && (
                <div className="grid gap-4 py-4">
                  {(editModal.type === "safari" || editModal.type === "activity") && (
                    <>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="packageName" className="text-right text-safari-forest">
                          Name
                        </Label>
                        <Input
                          id="packageName"
                          value={editModal.package.packageName}
                          onChange={(e) =>
                            setEditModal({
                              ...editModal,
                              package: { ...editModal.package, packageName: e.target.value },
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="packagePrice" className="text-right text-safari-forest">
                          Price
                        </Label>
                        <Input
                          id="packagePrice"
                          type="number"
                          value={editModal.package.packagePrice ?? ""}
                          onChange={(e) => handleNumberChange(e.target.value, "packagePrice")}
                          className="col-span-3"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="maxPeople" className="text-right text-safari-forest">
                          Max People
                        </Label>
                        <Input
                          id="maxPeople"
                          type="number"
                          value={editModal.package.maxPeople ?? ""}
                          onChange={(e) => handleNumberChange(e.target.value, "maxPeople")}
                          className="col-span-3"
                          min="0"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="details" className="text-right text-safari-forest">
                          Details
                        </Label>
                        <Input
                          id="details"
                          value={editModal.package.details}
                          onChange={(e) =>
                            setEditModal({
                              ...editModal,
                              package: { ...editModal.package, details: e.target.value },
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      {editModal.type === "safari" && (
                        <>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="startTime" className="text-right text-safari-forest">
                              Start Time
                            </Label>
                            <Input
                              id="startTime"
                              type="time"
                              value={editModal.package.startTime}
                              onChange={(e) =>
                                setEditModal({
                                  ...editModal,
                                  package: { ...editModal.package, startTime: e.target.value },
                                })
                              }
                              className="col-span-3 border border-gray-300 rounded-md p-2 text-safari-forest bg-safari-cream/20 focus:ring-safari-leaf focus:border-safari-leaf"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="endTime" className="text-right text-safari-forest">
                              End Time
                            </Label>
                            <Input
                              id="endTime"
                              type="time"
                              value={editModal.package.endTime}
                              onChange={(e) =>
                                setEditModal({
                                  ...editModal,
                                  package: { ...editModal.package, endTime: e.target.value },
                                })
                              }
                              className="col-span-3 border border-gray-300 rounded-md p-2 text-safari-forest bg-safari-cream/20 focus:ring-safari-leaf focus:border-safari-leaf"
                            />
                          </div>
                        </>
                      )}
                      {editModal.type === "activity" && (
                        <>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="location" className="text-right text-safari-forest">
                              Location
                            </Label>
                            <Input
                              id="location"
                              value={editModal.package.location}
                              onChange={(e) =>
                                setEditModal({
                                  ...editModal,
                                  package: { ...editModal.package, location: e.target.value },
                                })
                              }
                              className="col-span-3"
                            />
                          </div>
                          
                          {/* Time Slots Section */}
                          <div className="col-span-4 border-t pt-4">
                            <Label className="text-safari-forest font-semibold mb-2 block">
                              Available Time Slots
                            </Label>
                            
                            {/* Add Time Slot */}
                            <div className="flex gap-2 mb-3">
                              <Input
                                type="time"
                                value={newSlotStart}
                                onChange={(e) => setNewSlotStart(e.target.value)}
                                placeholder="Start"
                                className="flex-1"
                              />
                              <span className="flex items-center px-2 text-gray-500">to</span>
                              <Input
                                type="time"
                                value={newSlotEnd}
                                onChange={(e) => setNewSlotEnd(e.target.value)}
                                placeholder="End"
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                onClick={handleAddTimeSlot}
                                className="bg-safari-leaf hover:bg-safari-forest"
                              >
                                Add
                              </Button>
                            </div>
                            
                            {/* Display Time Slots */}
                            {timeSlots.length > 0 && (
                              <div className="space-y-2">
                                {timeSlots.map((slot, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between bg-safari-cream/30 p-2 rounded-md"
                                  >
                                    <span className="text-safari-forest font-medium">
                                      {slot.replace("-", " - ")}
                                    </span>
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => handleRemoveTimeSlot(index)}
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                            {timeSlots.length === 0 && (
                              <p className="text-sm text-gray-500 italic">
                                No time slots added yet. Add at least one time slot.
                              </p>
                            )}
                          </div>
                        </>
                      )}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="imageFile" className="text-right text-safari-forest">
                          Image
                        </Label>
                        <input
                          id="imageFile"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="col-span-3"
                        />
                      </div>
                      {editModal.package.imageUrl && !selectedFile && (
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right text-safari-forest">Current Image</Label>
                          <img
                            src={editModal.package.imageUrl ? `http://localhost:8080${editModal.package.imageUrl}` : ""}
                            alt="Current package"
                            className="col-span-3 h-20 object-cover"
                          />
                        </div>
                      )}
                    </>
                  )}
                  {editModal.type === "hire" && (
                    <>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="vehicleType" className="text-right text-safari-forest">
                          Vehicle Type
                        </Label>
                        <Input
                          id="vehicleType"
                          value={editModal.package.vehicleType}
                          onChange={(e) =>
                            setEditModal({
                              ...editModal,
                              package: { ...editModal.package, vehicleType: e.target.value },
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tourName" className="text-right text-safari-forest">
                          Tour Name
                        </Label>
                        <Input
                          id="tourName"
                          value={editModal.package.tourName}
                          onChange={(e) =>
                            setEditModal({
                              ...editModal,
                              package: { ...editModal.package, tourName: e.target.value },
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="packagePrice" className="text-right text-safari-forest">
                          Price Per Day
                        </Label>
                        <Input
                          id="packagePrice"
                          type="number"
                          value={editModal.package.packagePrice ?? ""}
                          onChange={(e) => handleNumberChange(e.target.value, "packagePrice")}
                          className="col-span-3"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="capacity" className="text-right text-safari-forest">
                          Capacity
                        </Label>
                        <Input
                          id="capacity"
                          type="number"
                          value={editModal.package.capacity ?? ""}
                          onChange={(e) => handleNumberChange(e.target.value, "capacity")}
                          className="col-span-3"
                          min="0"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="imageFile" className="text-right text-safari-forest">
                          Image
                        </Label>
                        <input
                          id="imageFile"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="col-span-3"
                        />
                      </div>
                      {editModal.package.imageUrl && !selectedFile && (
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right text-safari-forest">Current Image</Label>
                          <img
                            src={editModal.package.imageUrl}
                            alt="Current package"
                            className="col-span-3 h-20 object-cover"
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditModal({ open: false, type: "", package: null });
                    setSelectedFile(null);
                    setTimeSlots([]);
                    setError(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-safari-forest hover:bg-safari-leaf"
                  onClick={handleSaveEdit}
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Modal */}
          <Dialog
            open={deleteModal.open}
            onOpenChange={(open) => setDeleteModal({ ...deleteModal, open })}
          >
            <DialogContent className="sm:max-w-[425px] bg-white">
              <DialogHeader>
                <DialogTitle className="text-safari-forest font-playfair">
                  Delete {deleteModal.type.charAt(0).toUpperCase() + deleteModal.type.slice(1)} Package
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this package? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteModal({ open: false, type: "", packageId: null })}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleConfirmDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default PackageManager;