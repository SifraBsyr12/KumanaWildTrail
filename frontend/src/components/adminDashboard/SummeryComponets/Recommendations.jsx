const Recommendations = ({ peakDay, selectedAnimal }) => {
    return (
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">
          Management Recommendations
        </h3>
        <div className="border rounded-md p-4 bg-safari-teal/10 border-safari-teal/20">
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>
              <strong>Best viewing times:</strong> Early morning (6-8am)
              and late afternoon (4-6pm) based on historical patterns
            </li>
            <li>
              <strong>Current hotspot:</strong>{" "}
              {peakDay?.locations[selectedAnimal].name || "Northern sector"}{" "}
              - consider increasing ranger patrols in this area
            </li>
            <li>
              <strong>Visitor experience:</strong> Highlight{" "}
              {selectedAnimal} sightings in today's visitor briefing
            </li>
            <li>
              <strong>Conservation note:</strong>{" "}
              {selectedAnimal === "leopard" || selectedAnimal === "bear"
                ? "Monitor human-wildlife conflict potential"
                : "Normal activity patterns observed"}
            </li>
          </ul>
        </div>
      </div>
    );
  };
  
  export default Recommendations;