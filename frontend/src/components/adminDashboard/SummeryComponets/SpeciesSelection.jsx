import { getAnimalIcon } from "./utils";

const SpeciesSelection = ({ selectedAnimal, setSelectedAnimal, filteredData }) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-500 mb-2">All Species</h3>
      <div className="border rounded-md p-3 bg-white grid grid-cols-2 sm:grid-cols-3 gap-2 shadow-sm">
        {["elephant", "leopard", "bear"].map((animal) => {
          const total = filteredData.reduce(
            (sum, day) => sum + day.animals[animal],
            0
          );
          return (
            <div
              key={animal}
              className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                animal === selectedAnimal
                  ? "bg-safari-teal/20 border border-safari-teal/30 shadow-inner"
                  : "hover:bg-gray-50 border border-transparent"
              }`}
              onClick={() => setSelectedAnimal(animal)}
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">{getAnimalIcon(animal)}</span>
                <div>
                  <div className="capitalize font-medium">{animal}</div>
                  <div className="text-xs text-gray-500">
                    {total} total sightings
                  </div>
                </div>
              </div>
              {animal === selectedAnimal && (
                <div className="w-2 h-2 rounded-full bg-safari-teal"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SpeciesSelection;