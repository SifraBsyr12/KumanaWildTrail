import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/home-ui/button";
import { Input } from "../ui/driverDashboard-ui/input";
import { Textarea } from "../ui/driverDashboard-ui/textarea";
import { Label } from "../ui/driverDashboard-ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/driverDashboard-ui/select";

const token = localStorage.getItem("token");
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

// Polygon coordinates of Kumana Park (latitude, longitude)
const kumanaParkBoundary = [
  [6.285, 81.690], [6.290, 81.650], [6.300, 81.600], [6.320, 81.550],
  [6.340, 81.500], [6.360, 81.470], [6.380, 81.450], [6.400, 81.430],
  [6.420, 81.420], [6.440, 81.410], [6.460, 81.400], [6.480, 81.405],
  [6.500, 81.415], [6.520, 81.430], [6.540, 81.450], [6.560, 81.480],
  [6.580, 81.510], [6.600, 81.540], [6.620, 81.570], [6.640, 81.600],
  [6.660, 81.630], [6.680, 81.660], [6.700, 81.700], [6.690, 81.740],
  [6.670, 81.770], [6.650, 81.790], [6.630, 81.800], [6.600, 81.810],
  [6.570, 81.820], [6.540, 81.830], [6.510, 81.840], [6.480, 81.850],
  [6.450, 81.845], [6.420, 81.840], [6.390, 81.830], [6.360, 81.810],
  [6.330, 81.780], [6.300, 81.740], [6.285, 81.690]
];

// Updated demo coordinates within Kumana Park boundaries
const demoCoordinates = [
  { lat: 6.350, lng: 81.470 },
  { lat: 6.400, lng: 81.500 },
  { lat: 6.450, lng: 81.600 },
  { lat: 6.500, lng: 81.700 },
  { lat: 6.600, lng: 81.650 },
];

const getLocalDateTimeString = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16);
};

// Ray casting algorithm for point-in-polygon detection
const isPointInPolygon = (point, polygon) => {
  const [lat, lng] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [latI, lngI] = polygon[i];
    const [latJ, lngJ] = polygon[j];

    const intersect = ((lngI > lng) !== (lngJ > lng)) &&
        (lat < ((latJ - latI) * (lng - lngI)) / (lngJ - lngI) + latI);

    if (intersect) inside = !inside;
  }

  return inside;
};

const AnimalSightingForm = ({ onSubmit }) => {
  const [animalName, setAnimalName] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedLocation, setSelectedLocation] = useState({ lat: 0, lng: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidLocation, setIsValidLocation] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [useDemoLocation, setUseDemoLocation] = useState(false);

  const animalOptions = [
    { value: "Tiger", label: "Tiger" },
    { value: "Sloth Bear", label: "Sloth Bear" },
    { value: "Elephant", label: "Elephant" },

  ];

  const isWithinKumanaPolygon = (lat, lng) => {
    // First try using Google Maps geometry if available
    if (window.google?.maps?.geometry) {
      const point = new window.google.maps.LatLng(lat, lng);
      const polygon = new window.google.maps.Polygon({
        paths: kumanaParkBoundary.map(([lat, lng]) => new window.google.maps.LatLng(lat, lng)),
      });

      return window.google.maps.geometry.poly.containsLocation(point, polygon);
    }

    // Fallback to our own ray casting implementation
    return isPointInPolygon([lat, lng], kumanaParkBoundary);
  };

  const getRandomDemoLocation = () => {
    const randomIndex = Math.floor(Math.random() * demoCoordinates.length);
    return demoCoordinates[randomIndex];
  };

  useEffect(() => {
    setDateTime(getLocalDateTimeString());

    const processLocation = (lat, lng) => {
      setSelectedLocation({ lat, lng });
      const isValid = isWithinKumanaPolygon(lat, lng);
      setIsValidLocation(isValid);
      setIsLoadingLocation(false);
    };

    if (useDemoLocation) {
      const demoLoc = getRandomDemoLocation();
      processLocation(demoLoc.lat, demoLoc.lng);
      return;
    }

    if (navigator.geolocation) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            processLocation(latitude, longitude);
          },
          (error) => {
            console.error("Error fetching location:", error);
            setIsLoadingLocation(false);
          }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
      setIsLoadingLocation(false);
    }
  }, [useDemoLocation]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!animalName.trim() || !dateTime || !isValidLocation) {
      toast.error("Please fill all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const newSighting = {
        animalName: animalName.trim(),
        dateTime: new Date(dateTime).toISOString(),
        notes: notes.trim() || undefined,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      };

      const response = await fetch(`${BASE_URL}/api/sightings/createSighting`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSighting),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Something went wrong");
        return;
      }
      const data = await response.json();
      console.log("Sighting submitted:", data);

      if (onSubmit && typeof onSubmit === "function") {
        await onSubmit(newSighting);
      }
      toast.success("Sighting submitted successfully!");
      setAnimalName("");
      setNotes("");
    } catch (error) {
      console.error("Error submitting sighting:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="p-3 rounded-lg border border-emerald-100 bg-emerald-50 hover:bg-emerald-50/80 mb-3">
      <div className="flex items-start">
        <div className="w-full">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-emerald-800 text-lg">Animal Sighting Report</h3>
            <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-emerald-100 text-emerald-800">REPORT</span>
          </div>

          <p className="text-sm text-gray-600 mt-1.5 mb-4">Record details of any wildlife sightings during your safari.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="animalName" className="block text-sm font-medium mb-1.5 text-gray-700">Animal Species*</Label>
              <Select value={animalName} onValueChange={setAnimalName} required>
                <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm">
                  <SelectValue placeholder="Select an animal" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg">
                  {animalOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="hover:bg-emerald-50 focus:bg-emerald-50 text-sm">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dateTime" className="block text-sm font-medium mb-1.5 text-gray-700">Date & Time*</Label>
              <Input id="dateTime" type="datetime-local" value={dateTime} readOnly className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-700 text-sm" />
            </div>

            <div>
              <Label htmlFor="notes" className="block text-sm font-medium mb-1.5 text-gray-700">Notes</Label>
              <Textarea id="notes" placeholder="Additional observations (behavior, group size, etc.)" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="block text-sm font-medium text-gray-700">Location</Label>
                <button type="button" onClick={() => setUseDemoLocation(!useDemoLocation)} className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-600">
                  {useDemoLocation ? "Use Real Location" : "Use Demo Location"}
                </button>
              </div>

              {isLoadingLocation ? (
                <div className="flex items-center justify-center h-10 border border-gray-300 rounded-md bg-gray-50">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-emerald-500"></div>
                  <span className="ml-2 text-sm text-gray-600">Getting location...</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className={`w-full border rounded-md px-3 py-2 text-sm ${
                    isValidLocation
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}>
                    <div className="flex justify-between">
                      <span className="font-medium">Coordinates:</span>
                      <span>
                        {selectedLocation.lat.toFixed(5)}, {selectedLocation.lng.toFixed(5)}
                      </span>
                    </div>
                    <div className="text-xs mt-1">
                      {isValidLocation ? "✅ Within Kumana National Park" : "❌ Outside park boundaries"}
                    </div>
                  </div>
                  {useDemoLocation && (
                    <div className="text-xs text-gray-500 bg-yellow-50 p-1.5 rounded">
                      Using demo location for testing. Auto-randomizing every 10s.
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting || !isValidLocation || isLoadingLocation} variant="animalSighting" className={`w-full mt-2 h-12 text-base font-medium transition-all ${
              isSubmitting ? "bg-emerald-400" : "bg-emerald-600 hover:bg-emerald-700"
            } text-white`}>
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                <span className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                  Submit Sighting
                </span>
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center mt-2">* Required fields</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AnimalSightingForm;
