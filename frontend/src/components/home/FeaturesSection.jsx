import { useEffect, useState } from "react";

export default function FeaturesSection() {
  const [hirePackages, setHirePackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/packages");
        const data = await response.json();

        // Filter only HIRE packages
        const hires = data.filter(pkg => pkg.packageType === "HIRE");
        setHirePackages(hires);
      } catch (error) {
        console.error("Error fetching hire packages:", error);
      }
    };

    fetchPackages();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-safari-charcoal font-caveat text-4xl font-normal mb-2">
            Travel with Comfort
          </h2>
          <p className="font-aref font-bold text-safari-charcoal/80 max-w-2xl mx-auto text-sm">
            Seamless and reliable transport to make your journey as smooth as your safari.
          </p>
          <p className="font-aref text-safari-charcoal/80 max-w-2xl mx-auto text-sm">
            From airport pickups to luxury private tours and top safety, we've got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
          {hirePackages.map((hire) => (
            <div key={hire.packageID} className="text-center">
              <div className="flex justify-center mb-4 rounded-full w-20 h-20 mx-auto items-center">
                <img
                  src={`http://localhost:8080${hire.imageUrl}`}
                  alt={hire.tourName || "Transport"}
                  className="w-20 h-20 object-contain"
                />
              </div>
              <h3 className="font-serif text-base font-medium mb-1">
                {hire.tourName || hire.packageName}
              </h3>
              <p className="font-aref bg-[#C6E3B3] mx-8 py-1 rounded-xl text-safari-charcoal/80 text-base">
                {hire.vehicleType || "—"}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="/#contact"
            className="font-aref bg-safari-green hover:bg-safari-light-green text-[#0D722A] px-6 py-2 rounded-full text-base font-medium transition-colors inline-block"
          >
            Hire now &gt;&gt;&gt;
          </a>
        </div>
      </div>
    </section>
  );
}
