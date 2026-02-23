"use client";

import { ScrollArea } from "../ui/scroll-area";
import { AnimalSighting } from "./DriverDashboard";

interface RecentSightingsListProps {
  sightings: AnimalSighting[];
}

const RecentSightingsList = ({ sightings }: RecentSightingsListProps) => {
  // Helper function to format date
  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Helper to get animal icon class (would be actual icons in a real app)
  const getAnimalEmoji = (animalName: string) => {
    const name = animalName.toLowerCase();
    if (name.includes('elephant')) return '🐘';
    if (name.includes('leopard')) return '🐆';
    if (name.includes('bear')) return '🐻';
    if (name.includes('bird')) return '🦅';
    if (name.includes('buffalo')) return '🐃';
    if (name.includes('deer') || name.includes('elk')) return '🦌';
    if (name.includes('snake')) return '🐍';
    if (name.includes('monkey')) return '🐒';
    if (name.includes('crocodile')) return '🐊';
    return '🦓'; // Default
  };

  return (
    <div>
      <h2 className="text-xl font-serif text-safari-text font-semibold mb-3">Recent Sightings</h2>
      
      <ScrollArea className="h-[calc(100%-2rem)] max-h-64">
        {sightings.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No sightings recorded yet</p>
        ) : (
          <ul className="space-y-3">
            {sightings.map((sighting) => (
              <li
                key={sighting.id}
                className="p-3 rounded-lg bg-safari-secondary/10 border border-safari-secondary/20 hover:bg-safari-secondary/20 transition-colors"
              >
                <div className="flex items-start">
                  <span className="text-2xl mr-2" aria-hidden="true">
                    {getAnimalEmoji(sighting.animalName)}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-medium text-safari-text">{sighting.animalName}</h3>
                    <div className="flex justify-between items-center">
                      <time className="text-xs text-gray-500">{formatDate(sighting.dateTime)}</time>
                      <span className="text-xs text-gray-500">
                        {sighting.location.lat.toFixed(4)}, {sighting.location.lng.toFixed(4)}
                      </span>
                    </div>
                    {sighting.notes && (
                      <p className="mt-1 text-sm text-safari-text/80">{sighting.notes}</p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>
    </div>
  );
};

export default RecentSightingsList;
