import { useEffect, useState } from "react";
import TourCard from "./TourCard";

export default function ToursSection() {
  const [safariPackages, setSafariPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/packages");
        const data = await response.json();

        // Filter only SAFARI packages
        const safaris = data.filter(pkg => pkg.packageType === "SAFARI");
        setSafariPackages(safaris);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    fetchPackages();
  }, []);

  // Function to calculate duration in hours from "HH:mm-HH:mm"
  const calculateDuration = (timeRange) => {
    if (!timeRange || !timeRange.includes("-")) return "—";
    const [start, end] = timeRange.split("-");
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);

    const startDate = new Date(0, 0, 0, startH, startM);
    const endDate = new Date(0, 0, 0, endH, endM);
    const diffMs = endDate - startDate;
    const diffHours = diffMs / (1000 * 60 * 60);

    return `${diffHours} hours`;
  };

  return (
    <section id="tours" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-safari-charcoal font-caveat text-4xl font-normal mb-4">
            Explore The Wild
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="font-aref font-bold text-safari-charcoal/80 mb-2">
              Venture deep into Kumana's wild heart with our expertly guided safaris, tailored for every type of explorer.
            </p>
            <p className="font-aref text-safari-charcoal/80">
              From sunrise to sunset, discover breathtaking wildlife encounters and the untouched beauty of nature.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {safariPackages.map((tour) => (
            <TourCard
              key={tour.packageID}
              image={`http://localhost:8080${tour.imageUrl}`}
              title={tour.packageName}
              time={tour.time || "—"}
              duration={calculateDuration(tour.time)}
              maxPeople={tour.maxPeople}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
