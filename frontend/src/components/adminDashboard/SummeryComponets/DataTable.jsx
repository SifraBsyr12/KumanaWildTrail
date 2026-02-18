import { Button } from "@/components/ui/adminDashboard-ui/Button";
import { MapPinIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/adminDashboard-ui/Popover";
import MapPopup from "./MapPopup";
import { formatDate } from "./utils";

const DataTable = ({ filteredData, totalSightings, selectedAnimal, viewMode }) => {
    const renderTableRows = () => {
        if (viewMode === "month") {
            return filteredData.map((entry, index) => (
                <TableRow
                    key={`month-${index}`}
                    entry={entry}
                    index={index}
                    selectedAnimal={selectedAnimal}
                    totalSightings={totalSightings}
                />
            ));
        } else {
            const dayData = filteredData[0];
            if (!dayData) return null;

            const sightings = Array(dayData.animals[selectedAnimal]).fill({
                ...dayData,
                id: Math.random().toString(36).substr(2, 9),
            });

            return sightings.map((sighting, index) => (
                <TableRow
                    key={`day-${index}-${sighting.id}`}
                    entry={sighting}
                    index={index}
                    selectedAnimal={selectedAnimal}
                    totalSightings={totalSightings}
                    isDailyView={true}
                    sightingNumber={index + 1}
                />
            ));
        }
    };

    return (
        <div className="border rounded-md bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto overflow-y-auto max-h-[500px]"> {/* Added overflow-y-auto and max-h */}
                <table className="min-w-[900px] w-full text-sm">
                    <thead className="bg-gray-50 text-left sticky top-0 z-10"> {/* Made header sticky */}
                    <tr>
                        {viewMode === "day" && <th className="p-3">#</th>}
                        <th className="p-3">Date</th>
                        <th className="p-3">Sightings</th>
                        <th className="p-3">% of Total</th>
                        <th className="p-3">Location</th>
                    </tr>
                    </thead>
                    <tbody>{renderTableRows()}</tbody>
                </table>
            </div>
        </div>
    );
};

const TableRow = ({
                      entry,
                      index,
                      selectedAnimal,
                      totalSightings,
                      isDailyView = false,
                      sightingNumber = null,
                  }) => {
    const percentOfTotal = totalSightings
        ? (
            ((isDailyView ? 1 : entry.animals[selectedAnimal]) / totalSightings) *
            100
        ).toFixed(isDailyView ? 2 : 1)
        : 0;

    const location = entry.locations[selectedAnimal];

    return (
        <tr
            className={`border-t ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
            } hover:bg-gray-100`}
        >
            {isDailyView && <td className="p-3 whitespace-nowrap">{sightingNumber}</td>}
            <td className="p-3 whitespace-nowrap">{formatDate(entry.date)}</td>
            <td className="p-3 font-medium text-safari-forest">
                {isDailyView ? 1 : entry.animals[selectedAnimal]}
            </td>
            <td className="p-3">{percentOfTotal}%</td>
            <td className="p-3">
                {location?.lat ? (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-safari-teal bg-safari-teal/10 hover:bg-safari-teal/20"
                            >
                                <MapPinIcon className="h-3.5 w-3.5 mr-1" />
                                {location.name}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[90vw] sm:w-[400px] p-0">
                            <MapPopup
                                location={location}
                                animalType={selectedAnimal}
                                date={entry.date}
                                sightingNumber={isDailyView ? sightingNumber : null}
                            />
                        </PopoverContent>
                    </Popover>
                ) : (
                    <span className="text-gray-400">No {selectedAnimal} spotted</span>
                )}
            </td>
        </tr>
    );
};

export default DataTable;
