import { useEffect, useState } from "react";
import BookingSafariModal from "../../components/booking/BookingSafariModal";

export default function SafariPackages() {
  const [safaris, setSafaris] = useState([]);
  const [selectedSafari, setSelectedSafari] = useState(null);

  useEffect(() => {
    const fetchSafaris = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/packages/getAllsafari");
        const data = await res.json();
        setSafaris(data);
      } catch (err) {
        console.error("Error fetching safaris:", err);
      }
    };
    fetchSafaris();
  }, []);

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-safari-charcoal font-caveat text-4xl text-center mb-4">
          Explore Our Safari Experiences
        </h2>
        <p className="text-center font-aref text-safari-charcoal/70 max-w-3xl mx-auto mb-16">
          Discover the untamed beauty of Kumana with our expertly guided safari
          adventures. Choose your ideal package and immerse yourself in
          unforgettable wildlife encounters.
        </p>

        <div className="flex flex-col gap-20">
          {safaris.map((safari, index) => (
            <div
              key={safari.packageID}
              className={`flex flex-col md:flex-row items-center gap-10 ${
                index % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="md:w-1/2">
                <img
                  src={`http://localhost:8080${safari.imageUrl}`}
                  alt={safari.packageName}
                  className="w-full h-[400px] object-cover rounded-[2rem] shadow-md"
                />
              </div>

              <div className="md:w-1/2 text-safari-charcoal">
                <h3 className="font-caveat text-3xl mb-2">
                  {safari.packageName}
                </h3>
                <p className="font-aref text-sm text-safari-charcoal/80 mb-4 leading-relaxed">
                  {safari.details.slice(0, 350)}...
                </p>

                <div className="flex flex-wrap gap-4 mb-4 font-aref text-sm">
                  {safari.time && (
                    <div className="bg-[#E6F4E2] px-4 py-1 rounded-full">
                      🕒 Time: {safari.time}
                    </div>
                  )}
                  {safari.maxPeople > 0 && (
                    <div className="bg-[#E6F4E2] px-4 py-1 rounded-full">
                      👥 Max: {safari.maxPeople} people
                    </div>
                  )}
                  <div className="bg-[#E6F4E2] px-4 py-1 rounded-full">
                    💲 {safari.packagePrice.toLocaleString()} LKR
                  </div>
                </div>

                <button
                  onClick={() => setSelectedSafari(safari)}
                  className="font-aref bg-safari-green hover:bg-safari-light-green text-[#0D722A] px-6 py-2 rounded-full text-base font-medium transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedSafari && (
        <BookingSafariModal
          safari={selectedSafari}
          onClose={() => setSelectedSafari(null)}
        />
      )}
    </section>
  );
}
