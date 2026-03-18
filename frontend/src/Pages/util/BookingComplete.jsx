import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function BookingComplete() {
  return (
    <div className="min-h-screen bg-safari-beige flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full">
        <div className="flex justify-center mb-4">
          <CheckCircle className="text-safari-green w-16 h-16" />
        </div>
        <h1 className="text-2xl font-bold text-safari-charcoal mb-3">
          Thank You for Your Booking!
        </h1>
        <p className="text-safari-charcoal/80 mb-4">
          Your booking has been successfully submitted. You’ll receive an
          email shortly with your booking details.
        </p>
        <p className="text-safari-charcoal/80 mb-4">
          Once your booking is reviewed, you’ll be notified via email about the
          status and payment options.
        </p>
        <p className="text-safari-charcoal/80 mb-6">
          {`If you're a registered user, you can also track your booking status anytime from your dashboard.`}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/dashboard"
            className="bg-safari-green text-white px-6 py-2 rounded-xl hover:bg-safari-green-600 transition"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/"
            className="bg-safari-yellow text-safari-charcoal px-6 py-2 rounded-xl hover:bg-safari-yellow-500 transition"
          >
            Back to Home
          </Link>
        </div>

        <div className="mt-8 border-t pt-6">
          <h2 className="text-lg font-semibold text-safari-charcoal mb-2">
            Explore More Safari Packages
          </h2>
          <p className="text-safari-charcoal/70 mb-4">
            Discover other adventures waiting for you in Kumana. Plan your next
            experience today!
          </p>
          <Link
            to="/packages"
            className="text-safari-green font-medium hover:underline"
          >
            Surf More Packages →
          </Link>
        </div>
      </div>
    </div>
  );
}
