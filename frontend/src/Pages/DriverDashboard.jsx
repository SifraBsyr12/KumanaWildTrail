import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import Header from "../components/driverDashboard/DriverHeader";
import Footer from "../components/home/Footer";
import Mapbox from "../components/driverDashboard/MapSection";
import Booking from "../components/driverDashboard/DriverBookingDashboard";
import Calender from "../components/driverDashboard/DriverBookingCalendar";
import Sightingform from "../components/driverDashboard/AnimalSightingForm";
import DriverProfileSidebar from "../components/driverDashboard/DriverProfileSidebar";
import DriverSettingsSidebar from "../components/driverDashboard/DriverSettingsSidebar";
import SOSButton from "../components/driverDashboard/SOSButton";
import MonthlyBookingStats from "../components/driverDashboard/MonthlyBookingStats";

export default function DriverDashboard() {
  const [view, setView] = useState("list");
  const [user, setUser] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 6.48553,
    lng: 81.68975,
  });
  const [activePanel, setActivePanel] = useState(null);
  const [isSendingSOS, setIsSendingSOS] = useState(false);
  const dummyBookings = [
    {
      id: 1,
      date: '2025-06-01',
      timeSlot: 'morning',
      tourType: 'Normal Safari',
      status: 'accepted',
      clientName: 'John Safari',
      vehicle: 'Toyota Land Cruiser'
    },
    {
      id: 2,
      date: '2025-06-01',
      timeSlot: 'evening',
      tourType: 'Bird Watching',
      status: 'pending',
      clientName: 'Sarah Bird',
      vehicle: 'Land Rover Defender'
    },
    {
      id: 3,
      date: '2025-06-03',
      timeSlot: 'full',
      tourType: 'Normal Safari',
      status: 'rejected',
      clientName: 'Mike Explorer',
      vehicle: 'Toyota Hilux'
    },
    {
      id: 4,
      date: '2025-06-15',
      timeSlot: 'morning',
      tourType: 'Photography Tour',
      status: 'accepted',
      clientName: 'Lisa Photographer',
      vehicle: 'Toyota Land Cruiser'
    },
    {
      id: 5,
      date: '2025-06-20',
      timeSlot: 'evening',
      tourType: 'Family Safari',
      status: 'pending',
      clientName: 'The Wilson Family',
      vehicle: 'Land Rover Defender'
    }
  ];
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          id: decoded.id,
          name: decoded.name,
          email: decoded.sub,
          role: decoded.role,
        });
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  const [sightings, setSightings] = useState([
    {
      id: "1",
      animalName: "Elephant",
      dateTime: "2025-05-25T10:30:00",
      location: { lat: 6.4853, lng: 81.6853 },
      description: "Family of 5 elephants near the watering hole",
    },
    {
      id: "2",
      animalName: "Leopard",
      dateTime: "2025-05-25T09:15:00",
      location: { lat: 6.4803, lng: 81.6793 },
      description: "Spotted on a tree branch",
    },
    {
      id: "3",
      animalName: "Crocodile",
      dateTime: "2025-05-25T08:30:00",
      location: { lat: 6.4873, lng: 81.6923 },
      description: "Large crocodile sunbathing on river bank",
    },
  ]);

  const handleSendSOS = async (location) => {
    setIsSendingSOS(true);
    try {
      const token = localStorage.getItem("token");
  
      const body = {
        latitude: location.lat,
        longitude: location.lng,
        details: location.note || "",
      };
      
      console.log("Sending SOS payload:", body);
      
      const response = await fetch("http://localhost:8080/api/sos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      
      
  
      if (response.ok) {
        toast.success("SOS alert sent successfully! Rangers will contact you soon.");
      } else {
        throw new Error("SOS alert failed");
      }
    } catch (error) {
      console.error("Error sending SOS:", error);
      toast.error("Failed to send SOS alert. Please try again.");
    } finally {
      setIsSendingSOS(false);
    }
  };
  
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-0 relative">
      <div className="w-full h-screen bg-[#F8F9FA] relative">
        <div className="absolute inset-0 flex flex-col">
          <Header setActivePanel={setActivePanel} user={user} />

          <div className="flex-1 container mx-auto p-4 overflow-hidden">
            <div className="h-full w-full flex flex-col lg:flex-row gap-4">
              {/* Map Section */}
              <Mapbox
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                sightings={sightings}
              />

              {/* Sidebar Section */}
              <div className="w-full lg:w-1/3 h-full flex flex-col space-y-4 overflow-auto scrollbar-hide">
                {/* Animal Sighting Form */}
                <Sightingform
                  onNewSighting={(newSighting) =>
                    setSightings((prev) => [newSighting, ...prev])
                  }
                />

                {/* SOS Button */}
                <SOSButton onSOS={handleSendSOS} isSending={isSendingSOS} />

                {/* Recent Sightings */}
                {/* <div className="bg-white rounded-lg shadow-md p-4">
                  <h2 className="text-xl font-serif font-semibold text-[#264653] mb-4">
                    Recent Sightings
                  </h2>
                  <div className="h-[250px] rounded-md border overflow-auto scrollbar-hide space-y-3 p-2">
                    {sightings.map((sighting) => (
                      <div
                        key={sighting.id}
                        className={`p-3 rounded-lg border hover:bg-gray-50 ${
                          sighting.animalName === "EMERGENCY" ? "bg-red-50 border-red-200" : ""
                        }`}
                      >
                        <div className="flex">
                          <div className="text-3xl mr-3">
                            {sighting.animalName === "Elephant" ? "🐘" :
                             sighting.animalName === "Leopard" ? "🐆" :
                             sighting.animalName === "Crocodile" ? "🐊" :
                             sighting.animalName === "EMERGENCY" ? "🆘" : "🐾"}
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-medium ${
                              sighting.animalName === "EMERGENCY" 
                                ? "text-red-600" 
                                : "text-[#264653]"
                            }`}>
                              {sighting.animalName}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {new Date(sighting.dateTime).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-400">
                              {sighting.location.lat.toFixed(5)}, {sighting.location.lng.toFixed(5)}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {sighting.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div> */}

                {/* Booking Dashboard */}
                <div>
                  <Booking />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar/List View Section */}
      <div className="w-screen min-h-screen flex flex-col bg-gray-50">
  <div className="flex-1 overflow-auto scrollbar-hide px-4 lg:px-12 py-4">
    <div className="max-w-7xl mx-auto w-full">
      {/* Calendar + Stats side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Calender view={view} />
        </div>
        <div>
          <MonthlyBookingStats bookings={dummyBookings} />
        </div>
      </div>
    </div>
  </div>
</div>


      {/* Footer */}

      {/* Sidebar Components */}
      {activePanel === "profile" && (
        <DriverProfileSidebar
          isOpen={activePanel === "profile"}
          onClose={() => setActivePanel(null)}
          user={user}
        />
      )}
      {activePanel === "settings" && (
        <DriverSettingsSidebar
          isOpen={activePanel === "settings"}
          onClose={() => setActivePanel(null)}
        />
      )}
    </main>
  );
}
