"use client";

import { FaUser } from "react-icons/fa";
import useAxiosPrivate from "@/app/hooks/useAxiosPrivate";
import { useState, useEffect } from "react";

export default function CommentSection({ eventId }) {
  const api = useAxiosPrivate();
  const [comments, setComments] = useState([]);
  const [userComment, setUserComment] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getComments() {
      try {
        setIsLoading(true);
        const { data } = await api.get(`/events/${eventId}/comments`);
        setComments(data); 
        setError(null);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("Failed to load comments. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    getComments();
  }, [eventId, api]);

  async function addComment() {
    if (!userComment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await api.post(`/events/${eventId}/comments`, {
        content: userComment, 
      });
      setComments([data, ...comments]); 
      setUserComment(""); 
      setError(null);
    } catch (err) {
        const errorMessage = err.response?.data?.message || "Failed to post comment. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const handleInputChange = (e) => {
    setUserComment(e.target.value);
    if (error) setError(null); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addComment();
  };

  const getDisplayName = (comment) => {
    const firstName = comment.userFirstName || "";
    const lastName = comment.userLastName || "";
    return `${firstName} ${lastName}`.trim() || "Anonymous";
  };

  const getFormattedTime = (createdAt) => {
    if (!createdAt) return "Just now"; 
    try {
      return new Date(createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Unknown time";
    }
  };

  return (
    <div className="md:flex-grow md:overflow-auto bg-neutral-50 p-4 pt-0">
      {/* Comment Input */}
      <div className="mb-6">
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full border border-neutral-300 rounded-md p-2 text-base text-neutral-700 placeholder-neutral-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
            rows="3"
            placeholder="Add a comment..."
            value={userComment}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-base disabled:bg-blue-300 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Posting..." : "Post Comment"}
          </button>
        </form>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div className="space-y-4">
        {isLoading && comments.length === 0 ? (
          <p className="text-neutral-500">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-neutral-500">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="bg-neutral-200 rounded-full h-8 w-8 flex items-center justify-center">
                  <FaUser className="h-5 w-5 text-neutral-500" />
                </div>
                <p className="font-medium text-lg text-neutral-700">{getDisplayName(comment)}</p>
                <span className="text-sm text-neutral-500 font-light leading-5">
                  {getFormattedTime(comment.createdAt)}
                </span>
              </div>
              <p className="text-base text-neutral-700 leading-6">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}