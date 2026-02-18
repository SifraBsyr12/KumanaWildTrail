import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/adminDashboard-ui/Card";
import * as Tooltip from "@radix-ui/react-tooltip";
import { formatMonth } from "./utils";
import { fetchAnimalHotspots } from "./utils";
import { useEffect } from "react";

const SummaryCards = ({ totalSightings, averageSightings, maxSightings, peakDay, hotspots, setHotspots, selectedAnimal, selectedMonth }) => {
  useEffect(() => {
    const loadHotspots = async () => {
      const hotspotData = await fetchAnimalHotspots();
      const mapped = {};
      hotspotData.forEach((item) => {
        mapped[item.animalName] = {
          lat: item.lat,
          lng: item.lng,
          sightingsCount: item.sightingsCount,
          locationName: `Lat: ${item.lat.toFixed(4)}, Lng: ${item.lng.toFixed(4)}`,
        };
      });
      setHotspots(mapped);
    };
    loadHotspots();
  }, [setHotspots]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Total Sightings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-safari-forest">
            {totalSightings}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {selectedAnimal.charAt(0).toUpperCase() + selectedAnimal.slice(1)} sightings
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Daily Average
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-safari-forest">
            {averageSightings}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {formatMonth(selectedMonth)}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Peak Day
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-safari-forest">
            {maxSightings}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {peakDay ? formatMonth(peakDay.date) : "N/A"}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Current Hotspot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-safari-forest truncate">
              {hotspots[selectedAnimal]?.locationName || "Unknown Area"}
            </div>
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <div className="text-gray-400 hover:text-gray-600 transition cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10A8 8 0 112 10a8 8 0 0116 0zM9 8a1 1 0 112 0v4a1 1 0 01-2 0V8zm1-4a1.25 1.25 0 100 2.5A1.25 1.25 0 0010 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-gray-200 text-black text-sm px-3 py-1.5 rounded shadow-md z-50"
                    side="top"
                    sideOffset={6}
                  >
                    This Shows the highest Sighted area withing last 30 days
                    <Tooltip.Arrow className="fill-gray-900" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
          {hotspots[selectedAnimal]?.lat && hotspots[selectedAnimal]?.lng ? (
            <div className="text-xs text-gray-500 mt-1 truncate">
              <a
                href={`https://www.google.com/maps?q=${hotspots[selectedAnimal].lat},${hotspots[selectedAnimal].lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-blue-600"
              >
                {hotspots[selectedAnimal].lat.toFixed(4)},{" "}
                {hotspots[selectedAnimal].lng.toFixed(4)}
              </a>
            </div>
          ) : (
            <div className="text-xs text-gray-500 mt-1">
              No location data
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;