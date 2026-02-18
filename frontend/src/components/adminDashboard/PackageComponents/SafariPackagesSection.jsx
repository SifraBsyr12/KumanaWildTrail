import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/adminDashboard-ui/card";
import { Button } from "../../ui/adminDashboard-ui/Button";

const SafariPackagesSection = ({ packages, onAdd, onEdit, onDelete }) => {
  return (
    <section id="safari" className="bg-safari-light/10 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-playfair font-bold text-safari-forest">
          Safari Packages
        </h2>
        <Button
          className="bg-safari-forest hover:bg-safari-leaf text-white"
          onClick={onAdd}
        >
          + Add Safari
        </Button>
      </div>

      <div className="flex flex-wrap justify-center gap-8">
        {packages.map((pkg) => (
          <Card
            key={pkg.packageID}
            className="w-full sm:w-64 md:w-72 overflow-hidden shadow-md border border-safari-forest/20 rounded-2xl transition-transform transform hover:scale-[1.02]"
          >
            <img
              src={`http://localhost:8080${pkg.imageUrl}`}
              alt={pkg.name}
              className="h-40 w-full object-cover"
            />
            <CardHeader className="pb-2">
              <CardTitle className="font-playfair text-safari-forest text-lg">
                {pkg.packageName}
              </CardTitle>
              <CardDescription>{pkg.time}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-1">
                Max People: {pkg.maxPeople}
              </p>
              <p className="text-safari-forest font-semibold text-base mb-2">
                Rs. {pkg.packagePrice} / Person
              </p>
              <div className="flex justify-end mt-3 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit("safari", pkg)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete("safari",  pkg.packageID)}
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

export default SafariPackagesSection;
