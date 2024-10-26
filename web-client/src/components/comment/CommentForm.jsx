import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CommentList from "./CommentList";
import { createComment, updateComment } from "@/api/comment.api";

const CommentForm = ({ closeForm, commentId, initialComment }) => {
  const param = useParams();
  const [comment, setComment] = useState(initialComment || "");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (comment.trim() === "") {
      setError("Comment cannot be empty.");
      return;
    }

    try {
      if (commentId) {
        await updateComment(param.creator, commentId, comment.trim());
      } else {
        await createComment(param.creator, comment.trim());
      }
      setComment("");
      setError("");
      closeForm();
    } catch (err) {
      setError("Failed to submit the comment. Please try again.");
    }
  };

  return (
    <div
      role="dialog"
      aria-labelledby="comment-form-title"
      aria-modal="true"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white p-4 rounded-lg w-full max-w-lg mx-2 sm:w-3/4 md:w-1/2 lg:w-1/3">
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment"
            className="p-2 border rounded-md resize-none"
            required
          />
          <div className="flex justify-end space-x-2 text-sm">
            <button
              type="button"
              onClick={closeForm}
              className="px-4 py-1 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1 border rounded-lg hover:bg-gray-200"
            >
              Submit
            </button>
          </div>
        </form>
        <CommentList postId={param.creator} />
      </div>
    </div>
  );
};

export default CommentForm;
