import { useEffect, useState } from "react";

export default function ActivitiesSection() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/packages");
        const data = await response.json();

        // Filter only ACTIVITY packages
        const filteredActivities = data.filter(pkg => pkg.packageType === "ACTIVITY");
        setActivities(filteredActivities);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, []);

  return (
    <section id="activities" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-safari-charcoal font-caveat text-4xl font-normal mb-2">
            Unforgettable Activities
          </h2>
          <p className="font-aref font-bold text-safari-charcoal/80 max-w-3xl mx-auto text-sm">
            The adventure doesn't end with the safari!
          </p>
          <p className="font-aref text-safari-charcoal/80 max-w-2xl mx-auto text-sm mt-2">
            Make the most of your time in the Kumana region with unique cultural
            and adventure experiences. From ancient temples and scenic rock
            climbs to serene boat rides and hands-on local cooking,
          </p>
        </div>

        {/* Activity Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
          {activities.map((activity) => (
            <div key={activity.packageID} className="text-center">
              <img
                src={`http://localhost:8080${activity.imageUrl}`}
                alt={activity.packageName}
                className="w-64 h-80 object-cover rounded-[2rem] mx-auto shadow-md"
              />
              <div className="mt-4">
                <div className="w-64 mx-auto bg-[#C6E3B3] text-safari-charcoal/80 text-sm font-aref px-4 py-2 rounded-full font-medium">
                  {activity.packageName}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="text-center mt-10">
          <a
            href="/#contact"
            className="font-aref bg-safari-green hover:bg-safari-light-green text-[#0D722A] px-6 py-2 rounded-full text-base font-medium transition-colors inline-block"
          >
            Plan My Holiday &gt;&gt;&gt;
          </a>
        </div>
      </div>
    </section>
  );
}
