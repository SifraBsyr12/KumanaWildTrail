import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Card } from "../ui/driverDashboard-ui/card";
import PropTypes from "prop-types";
import { jwtDecode } from 'jwt-decode'; // Named import

const MapSection = ({ selectedLocation, setSelectedLocation }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerPoolRef = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [sightings, setSightings] = useState([]);
  const [sosAlerts, setSosAlerts] = useState([]);
  const [filters, setFilters] = useState({ animalType: "all" });
  const [isLoading, setIsLoading] = useState(true);

  // Check if token is expired
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token); // Named import
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true; // Assume expired if decoding fails
    }
  };


  // Load Google Maps
  useEffect(() => {
    if (window.google?.maps?.Map) {
      console.log("Google Maps API already loaded");
      setMapLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=marker&callback=initMap`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      console.error("Failed to load Google Maps API");
      setApiError("Failed to load Google Maps API");
    };
    window.initMap = () => {
      console.log("Google Maps API loaded successfully");
      setMapLoaded(true);
    };
    document.head.appendChild(script);
    return () => {
      console.log("Cleaning up Google Maps script");
      document.head.removeChild(script);
      delete window.initMap;
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapLoaded || !selectedLocation) {
      console.log("Map not loaded or no selected location:", { mapLoaded, selectedLocation });
      return;
    }
    try {
      console.log("Initializing map with center:", selectedLocation);
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: selectedLocation,
        zoom: 12,
        disableDefaultUI: true,
        gestureHandling: "greedy",
        mapId: "6bbf28f0a2a779649aa95dc3",
      });
      console.log("Map initialized:", mapInstanceRef.current);
    } catch (error) {
      console.error("Error initializing map:", error);
      setApiError("Error initializing map");
    }
    return () => {
      if (mapInstanceRef.current) {
        console.log("Clearing map instance listeners");
        window.google.maps.event.clearInstanceListeners(mapInstanceRef.current);
      }
    };
  }, [mapLoaded, selectedLocation]);

  // Fetch sightings and SOS alerts with polling
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setApiError("No authentication token found");
        setIsLoading(false);
        return;
      }
      if (isTokenExpired(token)) {
        const newToken = await refreshToken();
        if (!newToken) {
          setApiError("Token refresh failed");
          setIsLoading(false);
          return;
        }
      }
      try {
        const [sRes, sosRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sightings/recent`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sos/unresolved`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
        ]);
        if (sRes.ok) {
          const data = await sRes.json();
          console.log("Fetched sightings:", data);
          setSightings(data);
        } else {
          console.error("Sightings fetch failed:", sRes.status);
        }
        if (sosRes.ok) {
          const data = await sosRes.json();
          console.log("Fetched SOS alerts:", data);
          setSosAlerts(data);
        } else {
          console.error("SOS fetch failed:", sosRes.status);
        }
      } catch (e) {
        console.error("Fetch error:", e);
        setApiError(`Failed to fetch data: ${e.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(() => {
      console.log("Polling for data");
      fetchData();
    }, 30000);
    return () => {
      console.log("Clearing polling interval");
      clearInterval(interval);
    };
  }, []);

  // Filter sightings
  const filteredSightings = useMemo(() => {
    console.log("Recalculating filteredSightings, filters:", filters);
    const lowerFilter = filters.animalType.toLowerCase();
    return filters.animalType === "all"
      ? sightings
      : sightings.filter((s) => s.animalName?.toLowerCase().includes(lowerFilter));
  }, [sightings, filters]);

  // Helper functions for markers
  const getAnimalColor = (name) => {
    const lower = name?.toLowerCase() || "";
    if (lower.includes("elephant")) return "#2A9D8F";
    if (lower.includes("leopard")) return "#E9C46A";
    if (lower.includes("bear")) return "#264653";
    if (lower.includes("tiger")) return "#F4A261";
    return "#E76F51";
  };

  const getAnimalInitial = (name) => name?.charAt(0).toUpperCase() || "?";

  // Create marker for animal sightings
  const createMarker = useCallback((item) => {
    console.log("Creating sighting marker:", item);
    const lat = Number(item.lat);
    const lng = Number(item.lng);
    if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) {
      console.error("Invalid coordinates for sighting:", { lat, lng });
      return null;
    }
    const color = getAnimalColor(item.animalName || "unknown");
    const label = getAnimalInitial(item.animalName || "?");
    const title = `${item.animalName || "Unknown"} — ${new Date(item.dateTime).toLocaleString()}`;

    const pin = document.createElement("div");
    pin.innerHTML = `
      <div style="position:relative;width:30px;height:40px">
        <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 0C6.7 0 0 6.7 0 15c0 8.2 15 27 15 27s15-18.8 15-27C30 6.7 23.3 0 15 0z" fill="${color}"/>
        </svg>
        <div style="position:absolute;top:5px;left:5px;width:20px;height:20px;border-radius:50%;border:2px solid white;background:white;display:flex;align-items:center;justify-content:center;font-size:12px">
          ${label}
        </div>
      </div>`;

    const marker = new window.google.maps.marker.AdvancedMarkerElement({
      position: { lat, lng },
      map: mapInstanceRef.current,
      content: pin,
      title,
    });
    marker.__id = item.sightingId;
    console.log("Sighting marker created:", marker.__id);
    return marker;
  }, []);

  // Create marker for SOS alerts
  const createSOSMarker = useCallback((alert) => {
    console.log("Creating SOS marker:", alert);
    const lat = Number(alert.latitude);
    const lng = Number(alert.longitude);
    if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) {
      console.error("Invalid coordinates for SOS alert:", { lat, lng });
      return null;
    }
    const color = "#D00000";
    const label = "S!";
    const title = `SOS by ${alert.driverName} — ${alert.details || "No details"}`;

    const pin = document.createElement("div");
    pin.innerHTML = `
      <div style="position:relative;width:30px;height:40px">
        <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 0C6.7 0 0 6.7 0 15c0 8.2 15 27 15 27s15-18.8 15-27C30 6.7 23.3 0 15 0z" fill="${color}"/>
        </svg>
        <div style="position:absolute;top:5px;left:5px;width:20px;height:20px;border-radius:50%;border:2px solid white;background:white;display:flex;align-items:center;justify-content:center;font-size:12px">
          ${label}
        </div>
      </div>`;

    const marker = new window.google.maps.marker.AdvancedMarkerElement({
      position: { lat, lng },
      map: mapInstanceRef.current,
      content: pin,
      title,
    });
    marker.__id = `sos-${alert.alertId}`; // Unique ID to avoid conflicts
    console.log("SOS marker created:", marker.__id);
    return marker;
  }, []);

  // Update markers without adjusting map bounds
  const updateMarkers = useCallback(() => {
    console.log("Updating markers, filteredSightings:", filteredSightings, "sosAlerts:", sosAlerts);
    if (!mapLoaded || !mapInstanceRef.current) {
      console.log("Map not loaded or map instance missing");
      return;
    }

    const currentIds = new Set();

    // Add sighting markers
    filteredSightings.forEach((item) => {
      if (!item.sightingId) return;
      currentIds.add(item.sightingId);
      const existing = markerPoolRef.current.find((m) => m.__id === item.sightingId);
      if (!existing) {
        const marker = createMarker(item);
        if (marker) {
          markerPoolRef.current.push(marker);
          console.log("Added sighting marker:", marker.__id);
        }
      }
    });

    // Add SOS markers
    sosAlerts.forEach((alert) => {
      if (!alert.alertId) return;
      const sosId = `sos-${alert.alertId}`;
      currentIds.add(sosId);
      const existing = markerPoolRef.current.find((m) => m.__id === sosId);
      if (!existing) {
        const marker = createSOSMarker(alert);
        if (marker) {
          markerPoolRef.current.push(marker);
          console.log("Added SOS marker:", marker.__id);
        }
      }
    });

    // Remove outdated markers
    markerPoolRef.current = markerPoolRef.current.filter((marker) => {
      const stillVisible = currentIds.has(marker.__id);
      if (!stillVisible) {
        console.log("Removing marker:", marker.__id);
        marker.map = null;
        if (marker.content) marker.content.remove();
      }
      return stillVisible;
    });

    console.log("Updated marker pool:", markerPoolRef.current);
  }, [mapLoaded, filteredSightings, sosAlerts, createMarker, createSOSMarker]);

  // Call updateMarkers when data changes
  useEffect(() => {
    updateMarkers();
  }, [updateMarkers]);

  if (apiError) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="text-red-500">{apiError}</div>
      </Card>
    );
  }

  return (
    <Card className="relative h-full w-full overflow-hidden">
      <div ref={mapRef} className="h-full w-full" />
      {isLoading && (
        <div className="absolute top-4 left-4 bg-white bg-opacity-80 px-3 py-1 rounded-md text-sm">
          Loading...
        </div>
      )}
      <div className="absolute top-4 right-4">
        <select
          className="p-2 border rounded"
          value={filters.animalType}
          onChange={(e) => setFilters({ animalType: e.target.value })}
        >
          <option value="all">All</option>
          <option value="elephant">Elephant</option>
          <option value="leopard">Leopard</option>
          <option value="bear">Bear</option>
          <option value="tiger">Tiger</option>
        </select>
      </div>
    </Card>
  );
};

MapSection.propTypes = {
  selectedLocation: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  setSelectedLocation: PropTypes.func.isRequired,
};

export default MapSection;