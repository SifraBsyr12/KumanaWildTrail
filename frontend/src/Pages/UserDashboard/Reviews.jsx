import React, { useState } from "react";
import Button from "../components/User/Button";
import { Star } from "lucide-react";
import Input from "../components/User/Input";

const Reviews = () => {
  const [rating, setRating] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);

  return (
    <div className="flex min-h-screen bg-[#fdfbe4] text-[#2f2f2f] flex-col ml-4">
      {/* Page Header */}
      <h1 className="text-2xl font-bold mb-1 text-black ml-8">Reviews & Ratings</h1>
      <p className="text-sm text-gray-600 mb-6 ml-8">
        Share your safari experiences
      </p>

      {/* Review Form */}
      <div className="bg-[#fef6e4] rounded-md shadow p-4 md:p-6">
        <h2 className="text-lg font-semibold mb-1 text-black">
          Write a Review
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Tell us about your safari experience
        </p>

        {/* Safari Select */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-black">
            Select Safari to Review
          </label>
          <select className="w-full border rounded p-2 text-sm text-black">
            <option>Select a booking</option>
            <option>May 28, 2025 - John Mateo</option>
            <option>June 05, 2025 - Sarah Johnson</option>
          </select>
        </div>

        {/* Rating */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-black">
            Rating
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 cursor-pointer ${
                  rating >= star || hoverStar  >= star 
                    ? "fill-orange-400 stroke-orange-400"
                    : "stroke-orange-400"
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverStar(star)}
                onMouseLeave={() => setHoverStar(0)}
              />
            ))}
          </div>

          <p className="text-gray-600 mt-2 text-lg">
            {rating === 0 ? "" : `${rating} ${rating === 1 ? "star" : "stars"}`}
          </p>
        </div>

        {/* Review Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-black">
            Review Title
          </label>
          <Input
            type="text"
            placeholder="Summarize your experience in a few words"
            className="w-full border rounded p-2 text-sm text-black"
          />
        </div>

        {/* Review Content */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-black">
            Your Review
          </label>
          <textarea
            rows="4"
            placeholder="Tell us about your experience, what you enjoyed, and any suggestions for improvement..."
            className="w-full border rounded p-2 text-sm text-black"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            label="Submit Review"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default Reviews;
