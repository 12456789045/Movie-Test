import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./watchlist.scss";

const WatchlistSection = ({ movieId, movieTitle, moviePoster }) => {
  const [inWatchlist, setInWatchlist] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkWatchlist = useCallback(async (userId) => {
    try {
      const res = await axios.get(
        `/api/watchlist-check/${userId}/${movieId}`
      );
      setInWatchlist(res.data.inWatchlist);
    } catch (err) {
      console.log("Error checking watchlist", err);
    }
  }, [movieId]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
      checkWatchlist(JSON.parse(userData).id);
    }
  }, [movieId, checkWatchlist]);

  const handleWatchlistToggle = async () => {
    if (!user) {
      alert("Please login to use watchlist");
      return;
    }

    setLoading(true);

    try {
      if (inWatchlist) {
        await axios.post("/api/remove-watchlist", {
          user_id: user.id,
          movie_id: movieId,
        });
      } else {
        await axios.post("/api/add-watchlist", {
          user_id: user.id,
          movie_id: movieId,
          movie_title: movieTitle,
          movie_poster: moviePoster,
        });
      }

      setInWatchlist(!inWatchlist);
    } catch (err) {
      if (err.response?.data?.message === "Already in watchlist") {
        setInWatchlist(true);
      } else {
        alert("Error updating watchlist");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="watchlist-section">
      <button
        className={`watchlist-btn ${inWatchlist ? "in-watchlist" : ""}`}
        onClick={handleWatchlistToggle}
        disabled={loading}
      >
        <span className="icon">
          {inWatchlist ? "✓" : "+"}
        </span>
        <span className="text">
          {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
        </span>
      </button>
    </div>
  );
};

export default WatchlistSection;
