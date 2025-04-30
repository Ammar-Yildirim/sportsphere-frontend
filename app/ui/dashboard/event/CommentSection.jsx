"use client";

import { FaUser } from "react-icons/fa";
import useAxiosPrivate from "@/app/hooks/useAxiosPrivate";
import { useState, useEffect, useRef } from "react";

export default function CommentSection({ eventId }) {
  const pollingInterval = 10000;
  const api = useAxiosPrivate();
  const [comments, setComments] = useState([]);
  const [userComment, setUserComment] = useState("");
  const [error, setError] = useState(null);
  const [isFetchingComments, setIsFetchingComments] = useState(false);
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [isPolling, setIsPolling] = useState(true);
  const pollingRef = useRef(null);
  const textareaRef = useRef(null);

  const fetchComments = async () => {
    try {
      setIsFetchingComments(true);
      const { data } = await api.get(`/events/${eventId}/comments`);
      setComments(data); 
      setError(null);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Failed to load comments. Please try again later.");
    } finally {
      setIsFetchingComments(false);
    }
  };

  useEffect(() => {
    fetchComments();

    pollingRef.current = setInterval(() => {
      if (isPolling && !isFetchingComments) {
        fetchComments();
      }
    }, pollingInterval);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [eventId, api, isPolling]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPolling(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  async function addComment() {
    if (!userComment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    try {
      setIsPostingComment(true);
      const { data } = await api.post(`/events/${eventId}/comments`, {
        content: userComment, 
      });
      setComments(prevComments => [data, ...prevComments]); 
      setUserComment(""); 
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to post comment. Please try again.";
      setError(errorMessage);
    } finally {
      setIsPostingComment(false);
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
    <div className="md:flex-grow md:overflow-auto p-4 pt-0">
      <div className="mb-6">
        <form onSubmit={handleSubmit}>
          <textarea
            ref={textareaRef}
            className="w-full border border-neutral-300 rounded-md p-2 text-base text-neutral-700 placeholder-neutral-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
            rows="3"
            placeholder="Add a comment..."
            value={userComment}
            onChange={handleInputChange}
            disabled={isPostingComment}
          />
          <button
            type="submit"
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-base disabled:bg-blue-300 disabled:cursor-not-allowed"
            disabled={isPostingComment}
          >
            {isPostingComment ? "Posting..." : "Post Comment"}
          </button>
        </form>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-neutral-500">
            {isFetchingComments ? "Loading comments..." : "No comments yet. Be the first to comment!"}
          </p>
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