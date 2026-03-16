import { useEffect, useState } from "react";
import BookingHireModal from "../../components/booking/BookingHireModal";

export default function TourPackages() {
  const [tours, setTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/packages")
      .then((res) => res.json())
      .then((data) => {
        const hirePackages = data.filter((pkg) => pkg.packageType === "HIRE");
        setTours(hirePackages);
      })
      .catch((err) => console.error("Error loading tours:", err));
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-safari-charcoal font-caveat text-4xl mb-3">Guided Tours & Transport</h2>
          <p className="font-aref text-safari-charcoal/80 max-w-3xl mx-auto text-sm">
            Seamless and comfortable journeys — from airport transfers to private adventures.
          </p>
        </div>

        <div className="space-y-16 max-w-5xl mx-auto">
          {tours.map((tour, index) => (
            <div
              key={tour.packageID}
              className={`flex flex-col md:flex-row items-center gap-8 ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              <img
                src={`http://localhost:8080${tour.imageUrl}`}
                alt={tour.packageName}
                className="w-full md:w-1/2 h-80 object-cover rounded-[2rem] shadow-md"
              />
              <div className="w-full md:w-1/2 space-y-4">
                <h3 className="font-caveat text-3xl text-safari-charcoal">{tour.packageName}</h3>
                {tour.details ? (
                  <p className="font-aref text-safari-charcoal/80 text-sm leading-relaxed">
                    {tour.details}
                  </p>
                ) : (
                  <p className="font-aref text-safari-charcoal/80 text-sm leading-relaxed">
                    Enjoy a comfortable {tour.vehicleType} with up to {tour.capacity} passengers for your{" "}
                    {tour.tourName?.toLowerCase() || "journey"}.
                  </p>
                )}
                <p className="font-aref text-safari-charcoal font-medium text-base">
                  LKR {tour.packagePrice.toLocaleString()}
                </p>
                <button
                  onClick={() => setSelectedTour(tour)}
                  className="font-aref bg-safari-green hover:bg-safari-light-green text-[#0D722A] px-6 py-2 rounded-full text-sm transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedTour && (
            <BookingHireModal tour={selectedTour} onClose={() => setSelectedTour(null)} />
        )}
      </div>
    </section>
  );
}
