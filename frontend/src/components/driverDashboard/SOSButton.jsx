"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/home-ui/button";
import { SOSConfirmationModal } from "./SOSConfirmationModal";

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

// Point-in-polygon check
const isWithinKumana = (lat, lng) => {
  let inside = false;
  for (let i = 0, j = kumanaParkBoundary.length - 1; i < kumanaParkBoundary.length; j = i++) {
    const xi = kumanaParkBoundary[i][0], yi = kumanaParkBoundary[i][1];
    const xj = kumanaParkBoundary[j][0], yj = kumanaParkBoundary[j][1];

    const intersect =
      yi > lng !== yj > lng &&
      lat < ((xj - xi) * (lng - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
};

// Demo fallback coordinates
const demoCoordinates = [
  { lat: 6.547939, lng: 81.688521 },
  { lat: 6.571841, lng: 81.713383 },
  { lat: 6.566790, lng: 81.700198 },
  { lat: 6.474983, lng: 81.654569 },
  { lat: 6.515333, lng: 81.628845 },
];

const getRandomDemoLocation = () => {
  const randomIndex = Math.floor(Math.random() * demoCoordinates.length);
  return demoCoordinates[randomIndex];
};

const SOSButton = ({ onSOS }) => {
  const [isTriggering, setIsTriggering] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isValidLocation, setIsValidLocation] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [useDemoLocation, setUseDemoLocation] = useState(false);

  useEffect(() => {
    if (useDemoLocation) {
      const demoLoc = getRandomDemoLocation();
      setCurrentLocation(demoLoc);
      setIsValidLocation(isWithinKumana(demoLoc.lat, demoLoc.lng));
      setIsLoadingLocation(false);
      return;
    }

    if (navigator.geolocation) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(newLocation);
          setIsValidLocation(isWithinKumana(newLocation.lat, newLocation.lng));
          setIsLoadingLocation(false);
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

  const handleSOSClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = async (note = "") => {
    setShowConfirmation(false);
    setIsTriggering(true);
    setPulseAnimation(true);

    try {
      console.log("Triggering SOS alert with location and note:", currentLocation, note);
      await onSOS({ ...currentLocation, note });
    } catch (error) {
      console.error("Error sending SOS:", error);
    } finally {
      setIsTriggering(false);
      setTimeout(() => setPulseAnimation(false), 2000);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const toggleDemoMode = () => {
    setUseDemoLocation((prev) => !prev);
  };

  return (
    <div className="p-3 rounded-lg border border-red-100 bg-red-50 hover:bg-red-50/80 mb-3">
      <div className="flex items-start">
        <div className="text-2xl mr-2">🚨</div>
        <div className="w-full">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-red-800 text-lg">
              Emergency Alert System
            </h3>
            <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-red-100 text-red-800">
              EMERGENCY
            </span>
          </div>

          <p className="text-sm text-gray-600 mt-1.5">
            Press the button below to send your current location to all nearby rangers and emergency services.
          </p>

          <div className="flex justify-between items-center mt-2 mb-1">
            <p className="text-xs font-medium text-gray-700">
              Current Location Mode:
            </p>
            <button
              type="button"
              onClick={toggleDemoMode}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-600"
            >
              {useDemoLocation ? "Use Real GPS" : "Use Test GPS"}
            </button>
          </div>

          <Button
            onClick={handleSOSClick}
            disabled={isTriggering || isLoadingLocation}
            variant="emergency"
            className={`w-full mt-1 h-12 text-lg font-bold transition-all ${pulseAnimation ? "animate-pulse" : ""}`}
          >
            {isLoadingLocation
              ? "GETTING LOCATION..."
              : isTriggering
              ? "SENDING SOS..."
              : "🚨 SEND SOS"}
          </Button>

          {isLoadingLocation ? (
            <p className="mt-2 text-xs text-gray-500 text-center">
              Determining your location...
            </p>
          ) : (
            <p className="mt-2 text-xs text-center">
              {isValidLocation ? (
                <span className="text-green-600">
                  ✅ You are within Kumana National Park
                </span>
              ) : (
                <span className="text-red-600">
                  ❌ Outside park boundaries - SOS unavailable
                </span>
              )}
            </p>
          )}

          {useDemoLocation && (
            <p className="mt-1 text-[11px] text-yellow-700 bg-yellow-100 px-2 py-1 rounded text-center">
              Test mode active. Coordinates are randomly generated from demo list.
            </p>
          )}

          <p className="mt-2 text-xs text-gray-500 text-center">
            Use only in genuine emergency situations
          </p>
        </div>
      </div>

      <SOSConfirmationModal
        isOpen={showConfirmation}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        locationStatus={{
          coordinates: currentLocation
            ? `${currentLocation.lat.toFixed(5)}, ${currentLocation.lng.toFixed(5)}`
            : "Unknown",
          isValid: isValidLocation,
          isLoading: isLoadingLocation,
        }}
      />
    </div>
  );
};

export default SOSButton;
