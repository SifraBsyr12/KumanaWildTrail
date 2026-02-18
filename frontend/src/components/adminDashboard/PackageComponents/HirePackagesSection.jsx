import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/adminDashboard-ui/card";
import { Button } from "../../ui/adminDashboard-ui/Button";

const HirePackagesSection = ({ packages, onAdd, onEdit, onDelete }) => {
  return (
    <section id="hire" className="bg-safari-light/10 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-playfair font-bold text-safari-forest">
          Hire Packages
        </h2>
        <Button 
          className="bg-safari-forest hover:bg-safari-leaf"
          onClick={onAdd}
        >
          + Add Hire
        </Button>
      </div>

      <div className="flex flex-wrap justify-center gap-8">
        {packages.map((pkg) => (
          <Card
            key={pkg.packageID}
            className="w-full sm:w-64 md:w-72 overflow-hidden shadow-lg border border-safari-leaf/30 rounded-2xl transition-transform transform hover:scale-[1.02]"
          >
            <CardHeader className="pb-2">
              <CardTitle className="font-playfair text-safari-forest text-lg">
                {pkg.vehicleType}
              </CardTitle>
              <CardDescription>{pkg.tourName}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-safari-forest font-semibold text-base mt-1">
                Rs. {pkg.packagePrice} / Day
              </p>
              {pkg.capacity && (
                <p className="text-gray-600 text-sm mt-1">
                  Capacity: {pkg.capacity} people
                </p>
              )}
              <div className="flex justify-end mt-4 gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onEdit("hire", pkg)}
                >
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => onDelete("hire",pkg.packageID)}
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

export default HirePackagesSection;
