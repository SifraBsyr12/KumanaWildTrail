import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/adminDashboard-ui/card";
import { Button } from "../../ui/adminDashboard-ui/Button";

const ActivityPackagesSection = ({ packages, onAdd, onEdit, onDelete }) => {
  return (
    <section id="activities" className="bg-safari-light/10 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-playfair font-bold text-safari-forest">
          Activity Packages
        </h2>
        <Button 
          className="bg-safari-forest hover:bg-safari-leaf"
          onClick={onAdd}
        >
          + Add Activity
        </Button>
      </div>

      <div className="flex flex-wrap justify-center gap-8">
        {packages.map((pkg) => (
          <Card
            key={pkg.packageID}
            className="w-full sm:w-64 md:w-72 overflow-hidden shadow-lg border border-safari-leaf/30 rounded-2xl transition-transform transform hover:scale-[1.02]"
          >
            <img
              src={`http://localhost:8080${pkg.imageUrl}`}
              alt={pkg.name}
              className="h-48 w-full object-cover"
            />
            <CardHeader className="pb-1">
              <CardTitle className="font-playfair text-safari-forest text-lg">
                {pkg.name}
              </CardTitle>
              <CardDescription>{pkg.location || "At Kumana Reserve"}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm mb-2 line-clamp-2">{pkg.details}</p>
              {pkg.duration && (
                <p className="text-gray-600 text-sm mb-1">
                  Duration: {pkg.duration}
                </p>
              )}
              {pkg.difficulty && (
                <p className="text-gray-600 text-sm mb-1">
                  Difficulty: {pkg.difficulty}
                </p>
              )}
              <p className="text-safari-forest font-semibold text-base mt-2">
                Rs. {pkg.packagePrice} / Per Person
              </p>
              <div className="flex justify-end mt-4 gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onEdit("activity", pkg)}
                >
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => onDelete("activity",  pkg.packageID)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ActivityPackagesSection;
