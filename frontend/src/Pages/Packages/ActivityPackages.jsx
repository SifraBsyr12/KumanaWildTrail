import { useEffect, useState } from "react";
import BookingActivityModal from "../../components/booking/BookingActivityModal";

export default function ActivityPackages() {
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/packages")
      .then((res) => res.json())
      .then((data) => {
        const activityPackages = data.filter(
          (pkg) => pkg.packageType === "ACTIVITY"
        );
        setActivities(activityPackages);
      })
      .catch((err) => console.error("Error loading activities:", err));
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-safari-charcoal font-caveat text-4xl mb-3">
            Cultural & Adventure Activities
          </h2>
          <p className="font-aref text-safari-charcoal/80 max-w-3xl mx-auto text-sm">
            Immerse yourself in local culture and experience adventure beyond the trails.
          </p>
        </div>

        <div className="space-y-16 max-w-5xl mx-auto">
          {activities.map((activity, index) => {
            const timeSlotsArray = activity.timeSlots
              ? JSON.parse(activity.timeSlots)
              : [];

            return (
              <div
                key={activity.packageID}
                className={`flex flex-col md:flex-row items-center gap-8 ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                <img
                  src={`http://localhost:8080${activity.imageUrl}`}
                  alt={activity.packageName}
                  className="w-full md:w-1/2 h-80 object-cover rounded-[2rem] shadow-md"
                />
                <div className="w-full md:w-1/2 space-y-4">
                  <h3 className="font-caveat text-3xl text-safari-charcoal">
                    {activity.packageName}
                  </h3>
                  <p className="font-aref text-safari-charcoal/80 text-sm leading-relaxed">
                    {activity.details}
                  </p>
                  {activity.location && (
                    <p className="font-aref text-safari-charcoal/80 text-sm italic">
                      📍 Location: {activity.location}
                    </p>
                  )}
                  <p className="font-aref text-safari-charcoal font-medium text-base">
                    LKR {activity.packagePrice.toLocaleString()}
                  </p>

                  {timeSlotsArray.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {timeSlotsArray.map((slot, i) => (
                        <span
                          key={i}
                          className="bg-safari-green/20 text-safari-green font-aref text-xs px-3 py-1 rounded-full"
                        >
                          {slot}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedActivity(activity)}
                    className="font-aref bg-safari-green hover:bg-safari-light-green text-[#0D722A] px-6 py-2 rounded-full text-sm transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {selectedActivity && (
          <BookingActivityModal
            activity={selectedActivity}
            onClose={() => setSelectedActivity(null)}
          />
        )}
      </div>
    </section>
  );
}
