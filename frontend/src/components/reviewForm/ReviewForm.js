import React from "react";
import { FaStar } from "react-icons/fa";

const ReviewForm = ({
  handleSubmit,
  revText,
  labelText,
  rating,
  setRating,
  submitButtonText,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm text-gray-300">{labelText}</label>
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => {
          const starValue = i + 1;
          return (
            <label key={starValue}>
              <input
                type="radio"
                name="rating"
                value={starValue}
                onClick={() => setRating(starValue)}
                className="hidden"
              />
              <FaStar
                className="cursor-pointer"
                color={starValue <= rating ? "#ffc107" : "#e4e5e9"}
                size={24}
              />
            </label>
          );
        })}
      </div>
      <textarea
        ref={revText}
        className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-500"
        rows="4"
        placeholder="Write your review here..."
        required
      ></textarea>
      <button
        type="submit"
        className="bg-gold-500 text-black py-2 px-4 rounded-md hover:opacity-90"
      >
        {submitButtonText}
      </button>
    </form>
  );
};

export default ReviewForm;
