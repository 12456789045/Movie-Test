import React, { useState, useEffect } from "react";
import axios from "axios";
import "./feedback.scss";

const FeedbackSection = ({ movieId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [comment, setComment] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userVotes, setUserVotes] = useState({}); // Track user votes
  const [error, setError] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [movieId]); // Remove user dependency to ensure feedback loads for all users

  // Separate effect for fetching user votes when user logs in
  useEffect(() => {
    if (user) {
      fetchUserVotes();
    } else {
      setUserVotes({}); // Clear votes for logged out users
    }
  }, [user, feedbacks]); // Re-fetch votes when user changes or feedbacks change

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/feedback/${movieId}`
      );
      setFeedbacks(res.data);
    } catch (err) {
      console.log("Error fetching feedbacks", err);
      setError("Error loading reviews");
    }
  };

  const fetchUserVotes = async () => {
    if (!user) return;

    const votes = {};
    for (let feedback of feedbacks) {
      try {
        const voteRes = await axios.get(
          `http://localhost:5000/feedback-user-vote/${feedback.id}/${user.id}`
        );
        votes[feedback.id] = voteRes.data.userVote;
      } catch (err) {
        console.log("Error fetching user vote", err);
      }
    }
    setUserVotes(votes);
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("Please login to submit feedback");
      return;
    }

    if (!comment.trim()) {
      setError("Please enter a comment");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/add-feedback", {
        user_id: user.id,
        movie_id: movieId,
        comment,
      });

      if (response.data) {
        // Create the new feedback object for immediate display
        const newFeedback = {
          id: response.data.id,
          user_id: user.id,
          movie_id: movieId,
          comment: comment.trim(),
          likes: 0,
          dislikes: 0,
          created_at: new Date().toISOString(),
          name: user.name
        };

        // Add to feedbacks list immediately
        setFeedbacks(prevFeedbacks => [newFeedback, ...prevFeedbacks]);

        setComment("");
        setSubmitted(true);
        
        // Refresh feedbacks list from server after a short delay to ensure consistency
        setTimeout(() => {
          fetchFeedbacks();
        }, 1000);

        setTimeout(() => {
          setSubmitted(false);
        }, 3000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Error submitting feedback";
      setError(errorMessage);
      console.log("Error submitting feedback", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (feedbackId, voteType) => {
    if (!user) {
      setError("Please login to vote");
      return;
    }

    try {
      await axios.post("http://localhost:5000/vote-feedback", {
        feedback_id: feedbackId,
        user_id: user.id,
        vote_type: voteType,
      });

      setUserVotes({
        ...userVotes,
        [feedbackId]: voteType,
      });

      fetchFeedbacks(); // Refresh feedback to get updated vote counts
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error voting on feedback";
      setError(errorMessage);
      console.log("Error voting on feedback", err);
    }
  };

  return (
    <div className="feedback-section">
      <div className="feedback-container">
        <h2>User Reviews & Feedback</h2>

        {/* Add Feedback Form - Only show for logged in users */}
        {user && (
          <div className="feedback-form">
            <h3>Share Your Opinion</h3>
            <form onSubmit={handleSubmitFeedback}>
              <div className="form-group">
                <label htmlFor="comment">Your Feedback:</label>
                <textarea
                  id="comment"
                  placeholder="Share your thoughts about this movie..."
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                    setError("");
                  }}
                  rows="4"
                />
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Review"}
              </button>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              {submitted && (
                <div className="success-message">
                  Thank you! Your feedback has been submitted.
                </div>
              )}
            </form>
          </div>
        )}

        {!user && (
          <div className="login-prompt">
            <p>Please <a href="/login">login</a> to share your feedback.</p>
          </div>
        )}

        {/* Display Feedbacks */}
        <div className="feedbacks-list">
          <h3>Reviews from Users ({feedbacks.length})</h3>

          {feedbacks.length === 0 ? (
            <p className="no-feedback">
              No reviews yet. Be the first to share your thoughts!
            </p>
          ) : (
            feedbacks.map((feedback) => (
              <div key={feedback.id} className="feedback-item">
                <div className="feedback-header">
                  <div className="feedback-user">
                    <span className="user-avatar">
                      {feedback.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="user-details">
                      <p className="user-name">{feedback.name}</p>
                      <p className="feedback-date">
                        {new Date(feedback.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="feedback-comment">{feedback.comment}</p>

                {/* Like/Dislike Buttons */}
                <div className="feedback-votes">
                  <button
                    className={`vote-btn like-btn ${
                      userVotes[feedback.id] === "like" ? "active" : ""
                    }`}
                    onClick={() => handleVote(feedback.id, "like")}
                  >
                    <span className="icon">👍</span>
                    <span className="count">{feedback.likes || 0}</span>
                  </button>
                  <button
                    className={`vote-btn dislike-btn ${
                      userVotes[feedback.id] === "dislike" ? "active" : ""
                    }`}
                    onClick={() => handleVote(feedback.id, "dislike")}
                  >
                    <span className="icon">👎</span>
                    <span className="count">{feedback.dislikes || 0}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackSection;
