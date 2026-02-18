import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { ExternalLinkIcon } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getAnimalIcon, formatDate } from "./utils";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapPopup = ({ location, animalType, date }) => {
  if (!location.lat || !location.lon) {
    return (
      <div className="p-4 text-center text-gray-500 bg-gray-50 rounded">
        No location data available for this sighting
      </div>
    );
  }

  const position = [location.lat, location.lon];

  return (
    <div className="w-full max-w-[90vw] sm:max-w-[400px] bg-white rounded-lg overflow-hidden">
      <MapContainer
        center={position}
        zoom={15}
        style={{ height: "300px", width: "100%" }}
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            <div className="text-center">
              <span className="text-xl">{getAnimalIcon(animalType)}</span>
              <div className="font-medium capitalize">
                {animalType} Sighting
              </div>
              <div className="text-sm">{location.name}</div>
              <div className="text-xs text-gray-600">
                {formatDate(new Date(date))}
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
      <div className="p-3 text-sm border-t bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div>
          <div className="font-medium">{location.name}</div>
          <div className="text-gray-600 font-mono">
            {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
          </div>
        </div>
        <a
          href={`https://www.google.com/maps?q=${location.lat},${location.lon}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-safari-teal hover:underline text-sm flex items-center bg-white px-2 py-1 rounded"
        >
          Open in Maps <ExternalLinkIcon className="ml-1 h-3 w-3" />
        </a>
      </div>
    </div>
  );
};

export default MapPopup;