import { useState } from "react";
import { PencilIcon, TrashIcon } from "lucide-react";
import { Button } from "../ui/adminDashboard-ui/Button";
import { Badge } from "../ui/adminDashboard-ui/Badge";

// Mock Review Data (no TS types)
const MOCK_REVIEWS = [
  {
    id: "r1",
    customerName: "Sarah Johnson",
    rating: 5,
    date: "May 24, 2025",
    comment:
      "Amazing experience! Our guide was knowledgeable and we saw so many elephants and birds. Will definitely recommend to friends.",
    verified: true,
    driverName: "Kumar Perera",
  },
  {
    id: "r2",
    customerName: "Michael Brown",
    rating: 4,
    date: "May 23, 2025",
    comment:
      "Great safari, though it was very hot. The driver was excellent and made sure we saw lots of wildlife.",
    verified: true,
    driverName: "Ajith Fernando",
  },
  {
    id: "r3",
    customerName: "Emma Wilson",
    rating: 3,
    date: "May 22, 2025",
    comment:
      "Decent experience but the vehicle was uncomfortable. We did see a leopard which was amazing!",
    verified: false,
    driverName: "Malik Jayasuriya",
  },
  {
    id: "r4",
    customerName: "David Lee",
    rating: 5,
    date: "May 21, 2025",
    comment:
      "Incredible safari! We saw a bear, elephants, and many birds. Our guide was extremely knowledgeable.",
    verified: true,
    driverName: "Saman Rathnayake",
  },
  {
    id: "r5",
    customerName: "Jennifer Chen",
    rating: 2,
    date: "May 20, 2025",
    comment:
      "Disappointing. Too crowded and we barely saw any animals. The driver was nice but seemed in a rush.",
    verified: true,
    driverName: "Nuwan Silva",
  },
];

// Star Rating Subcomponent
const StarRating = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < rating ? "text-safari-sand" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};
// Reviews Table Component (plain JS)
const ReviewsTable = () => {
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [editingId, setEditingId] = useState(null);
  const [editComment, setEditComment] = useState("");

  const startEditing = (review) => {
    setEditingId(review.id);
    setEditComment(review.comment);
  };

  const saveEdit = (id) => {
    console.log(`Saving edited review ${id} with comment: ${editComment}`);
    setReviews(
      reviews.map((review) =>
        review.id === id ? { ...review, comment: editComment } : review
      )
    );
    setEditingId(null);
  };

  const deleteReview = (id) => {
    console.log(`Deleting review ${id}`);
    setReviews(reviews.filter((review) => review.id !== id));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="border-b border-gray-200 p-4">
        <h2 className="font-playfair text-lg font-bold text-safari-forest">
          Customer Reviews & Ratings
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs">
              <th className="px-4 py-3 font-medium text-gray-500">Customer</th>
              <th className="px-4 py-3 font-medium text-gray-500">Rating</th>
              <th className="px-4 py-3 font-medium text-gray-500">Date</th>
              <th className="px-4 py-3 font-medium text-gray-500">Comment</th>
              <th className="px-4 py-3 font-medium text-gray-500">Driver</th>
              <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id} className="border-b border-gray-100 text-sm">
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <span className="font-medium text-safari-forest">
                      {review.customerName}
                    </span>
                    {review.verified && (
                      <Badge
                        variant="outline"
                        className="ml-2 bg-green-50 text-green-600 border-green-200 text-xs"
                      >
                        Verified
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StarRating rating={review.rating} />
                </td>
                <td className="px-4 py-3 text-gray-500">{review.date}</td>
                <td className="px-4 py-3 max-w-xs">
                  {editingId === review.id ? (
                    <textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      className="w-full text-sm border border-gray-300 rounded-md p-2"
                      rows={2}
                    />
                  ) : (
                    <p className="truncate">{review.comment}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500">{review.driverName}</td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    {editingId === review.id ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 bg-safari-teal text-white border-none hover:bg-safari-teal/80"
                        onClick={() => saveEdit(review.id)}
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-safari-teal hover:text-safari-teal/80 hover:bg-safari-teal/10"
                        onClick={() => startEditing(review)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => deleteReview(review.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewsTable;
