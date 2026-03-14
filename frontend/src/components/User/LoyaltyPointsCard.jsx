import Button from "./Button";

const LoyaltyPointsCard = () => {
  return (
    <div className="bg-[#f6f1ea] rounded-xl shadow-md p-4 sm:p-6 w-full">
      {/* Heading */}
      <h2 className="text-base sm:text-lg font-semibold mb-1">
        🎁 Loyalty Points
      </h2>

      {/* Subtext */}
      <p className="text-sm text-gray-600 mb-4">
        Earn points with every safari booking
      </p>

      {/* Points */}
      <div className="text-3xl font-bold">450</div>
      <div className="text-sm text-right text-gray-700">$4.50</div>

      {/* Progress bar */}
      <div className="mt-2 mb-2 w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-green-600 h-2 rounded-full transition-all duration-300"
          style={{ width: "90%" }}
        />
      </div>
      <div className="text-xs text-right text-gray-600">450 / 500</div>

      {/* CTA Button */}
      <Button
        label="View History"
        className="mt-4 w-full border border-gray-600 text-sm py-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
      />
    </div>
  );
};

export default LoyaltyPointsCard;
