import { useEffect, useState } from "react";
import { PencilIcon, TrashIcon, ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/adminDashboard-ui/Button";
import toast, { Toaster } from "react-hot-toast";

const token = localStorage.getItem("token");
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const StarRating = ({ rating }) => (
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`h-4 w-4 ${i < rating ? "text-yellow-500" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const ReviewsTable = () => {
  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/admin/reviews/getAll`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setReviews(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        toast.error("Failed to load reviews");
        setReviews([]);
      }
    };

    fetchReviews();
  }, []);

  
  const sortedReviews = [...reviews].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (sortField === "date") {
      valA = new Date(valA);
      valB = new Date(valB);
    } else if (sortField === "driverName" || sortField === "customerName") {
      valA = valA?.toLowerCase() || "";
      valB = valB?.toLowerCase() || "";
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = sortedReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1); 
  };

  const startEditing = (review) => {
    setEditingId(review.id);
    setEditComment(review.comment);
  };

  const saveEdit = (id) => {
    fetch(`${BASE_URL}/api/admin/reviews/edit/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment: editComment }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        setReviews(
          reviews.map((r) => (r.id === id ? { ...r, comment: editComment } : r))
        );
        setEditingId(null);
        toast.success("Comment updated successfully");
      })
      .catch(() => toast.error("Failed to update comment"));
  };

  const confirmDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const deleteReview = (id) => {
    fetch(`${BASE_URL}/api/admin/reviews/delete/${id}`, { 
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }, 
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        setReviews(reviews.filter((r) => r.id !== id));
        setConfirmDeleteId(null);
        toast.success("Review deleted");
      })
      .catch(() => toast.error("Failed to delete review"));
  };

  return (
    <div className="relative">
      <Toaster position="top-right" />
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200 p-4">
          <h2 className="font-playfair text-lg font-bold text-safari-forest">
            Customer Reviews & Ratings
          </h2>
        </div>

        <div className="overflow-x-auto">
          <div className="max-h-[500px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="border-b border-gray-200 text-left text-xs">
                  <th
                    className="px-4 py-3 cursor-pointer text-gray-500 w-[15%]"
                    onClick={() => handleSort("customerName")}
                  >
                    <div className="flex items-center gap-1">
                      Customer
                      {sortField === "customerName" ? (
                        sortOrder === "asc" ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )
                      ) : (
                        <ChevronsUpDown className="h-3 w-3 opacity-50" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 cursor-pointer text-gray-500 w-[10%]"
                    onClick={() => handleSort("rating")}
                  >
                    <div className="flex items-center gap-1">
                      Rating
                      {sortField === "rating" ? (
                        sortOrder === "asc" ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )
                      ) : (
                        <ChevronsUpDown className="h-3 w-3 opacity-50" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 cursor-pointer text-gray-500 w-[15%]"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      {sortField === "date" ? (
                        sortOrder === "asc" ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )
                      ) : (
                        <ChevronsUpDown className="h-3 w-3 opacity-50" />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-gray-500 w-[30%]">Comment</th>
                  <th
                    className="px-4 py-3 cursor-pointer text-gray-500 w-[15%]"
                    onClick={() => handleSort("driverName")}
                  >
                    <div className="flex items-center gap-1">
                      Driver
                      {sortField === "driverName" ? (
                        sortOrder === "asc" ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )
                      ) : (
                        <ChevronsUpDown className="h-3 w-3 opacity-50" />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-gray-500 w-[15%]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentReviews.map((review) => (
                  <tr
                    key={review.id}
                    className="border-b border-gray-100 text-sm"
                  >
                    <td className="px-4 py-3 font-medium text-safari-forest">
                      {review.customerName}
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
                    <td className="px-4 py-3 text-gray-500">
                      {review.driverName}
                    </td>
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
                          onClick={() => confirmDelete(review.id)}
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

          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {indexOfFirstReview + 1}-{Math.min(indexOfLastReview, sortedReviews.length)} of {sortedReviews.length} reviews
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "outline" : "ghost"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={currentPage === pageNum ? "bg-gray-100" : ""}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <span className="px-2">...</span>
                )}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </Button>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this review?
            </p>
            <div className="flex justify-end space-x-3">
              <Button size="sm" variant="outline" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => deleteReview(confirmDeleteId)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsTable;