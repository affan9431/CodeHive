import { useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";
import toast from "react-hot-toast";

const ReviewsSection = ({ reviews, courseId, userId }) => {
  const [newReview, setNewReview] = useState({ rating: 0, content: "" });
  const [isSubmit, setIsSubmit] = useState(false);

  const handleSubmitReview = async () => {
    try {
      setIsSubmit(true);
      // await axios.post(`http://localhost:8080/api/review/createReview`, {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/review/createReview`,
        {
          id: courseId,
          userId: userId,
          rating: newReview.rating,
          message: newReview.content,
        }
      );

      toast.success(
        "Your review has been successfully submitted. Thank you for your feedback!"
      );

      setNewReview({ rating: 0, content: "" });
      setIsSubmit(false);
    } catch (error) {
      toast.error("Failed to submit your review. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
      <h3 className="text-xl font-semibold mb-4">Reviews</h3>

      {/* Review Form */}
      <div className="flex items-center mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-6 w-6 cursor-pointer transition-colors duration-200 ${
              star <= newReview.rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
            onClick={() => setNewReview({ ...newReview, rating: star })}
          />
        ))}
      </div>

      <textarea
        value={newReview.content}
        onChange={(e) =>
          setNewReview({ ...newReview, content: e.target.value })
        }
        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none min-h-[100px]"
        placeholder="Write your review..."
      />

      <div className="flex justify-end mt-3">
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!newReview.content.trim()}
          onClick={handleSubmitReview}
        >
          {isSubmit ? "Submitting..." : "Submit Review"}
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            {/* Star Ratings */}
            <div className="flex items-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= review.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* Review Content */}
            <p className="text-lg text-gray-900">{review.message}</p>

            {/* Reviewer Info */}
            <p className="text-sm text-gray-500 mt-2">
              <span className="font-medium">By:</span> {review.userID.userName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsSection;
