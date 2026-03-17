import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/home-ui/card";
import { Button } from "@/components/ui/home-ui/button";
import { Label } from "@/components/ui/home-ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/home-ui/radio-group";
import { Star } from "lucide-react";

export default function ReviewsPage() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState("");
  const [rating, setRating] = useState("4");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Fetch bookings from Spring Boot backend
  useEffect(() => {
    fetch("http://localhost:8080/api/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.error("Error fetching bookings:", err));
  }, []);

  // Submit review to backend
  const handleSubmit = async () => {
    const review = {
      bookingId: selectedBooking,
      rating: parseInt(rating),
      title,
      content,
    };

    try {
      const res = await fetch("http://localhost:8080/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(review),
      });

      if (res.ok) {
        alert("Review submitted successfully!");
        setSelectedBooking("");
        setRating("4");
        setTitle("");
        setContent("");
      } else {
        alert("Failed to submit review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-heading text-safari-darkBrown">
        Reviews & Ratings
      </h1>
      <p className="text-safari-darkBrown/70">Share your safari experiences</p>

      <Card className="border-safari-brown/20">
        <CardHeader className="bg-safari-orange/10">
          <CardTitle className="text-safari-darkBrown font-heading">
            Write a Review
          </CardTitle>
          <CardDescription className="text-safari-darkBrown/70">
            Tell us about your safari experience
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Safari dropdown */}
            <div className="space-y-2">
              <Label className="text-safari-darkBrown">
                Select Safari to Review
              </Label>
              <select
                value={selectedBooking}
                onChange={(e) => setSelectedBooking(e.target.value)}
                className="w-full rounded-md border border-safari-brown/20 bg-white p-3 text-safari-darkBrown focus:outline-none focus:ring-2 focus:ring-safari-green"
              >
                <option value="">Select a booking</option>
                {bookings.map((booking) => (
                  <option key={booking.id} value={booking.id}>
                    {booking.safariName} - {booking.date}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating stars */}
            <div className="space-y-2">
              <Label className="text-safari-darkBrown">Rating</Label>
              <RadioGroup
                value={rating}
                onValueChange={setRating}
                className="flex space-x-1"
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="flex items-center">
                    <RadioGroupItem
                      value={String(value)}
                      id={`rating-${value}`}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={`rating-${value}`}
                      className="cursor-pointer p-2"
                    >
                      <Star className={`h-8 w-8 text-safari-orange ${
                        rating >= value ? "fill-safari-orange" : ""
                      }`} />
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Review title */}
            <div className="space-y-2">
              <Label
                htmlFor="review-title"
                className="text-safari-darkBrown"
              >
                Review Title
              </Label>
              <input
                id="review-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-md border border-safari-brown/20 bg-white p-3 text-safari-darkBrown focus:outline-none focus:ring-2 focus:ring-safari-green"
                placeholder="Summarize your experience in a few words"
              />
            </div>

            {/* Review content */}
            <div className="space-y-2">
              <Label
                htmlFor="review-content"
                className="text-safari-darkBrown"
              >
                Your Review
              </Label>
              <textarea
                id="review-content"
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tell us about your experience..."
                className="w-full rounded-md border border-safari-brown/20 bg-white p-3 text-safari-darkBrown focus:outline-none focus:ring-2 focus:ring-safari-green"
              />
            </div>

            {/* Submit button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                className="bg-safari-orange hover:bg-safari-orange/90 text-white"
              >
                Submit Review
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
