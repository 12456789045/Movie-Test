import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./watchlist-page.scss";
import apiConfig from "../api/apiConfig";

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchWatchlist(parsedUser.id);
    } else {
      history.push("/login");
    }
  }, [history]);

  const fetchWatchlist = async (userId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/watchlist/${userId}`
      );
      setWatchlist(res.data);
    } catch (err) {
      console.log("Error fetching watchlist", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (movieId) => {
    try {
      await axios.post("http://localhost:5000/remove-watchlist", {
        user_id: user.id,
        movie_id: movieId,
      });
      setWatchlist(watchlist.filter((item) => item.movie_id !== movieId));
    } catch (err) {
      alert("Error removing from watchlist");
    }
  };

  if (loading) {
    return <div className="watchlist-page container"><p>Loading...</p></div>;
  }

  return (
    <div className="watchlist-page container">
      <div className="watchlist-header">
        <h1>My Watchlist</h1>
        <p className="watchlist-count">
          {watchlist.length} {watchlist.length === 1 ? "movie" : "movies"}
        </p>
      </div>

      {watchlist.length === 0 ? (
        <div className="empty-watchlist">
          <p className="empty-message">Your watchlist is empty</p>
          <button 
            className="browse-btn"
            onClick={() => history.push("/")}
          >
            Browse Movies
          </button>
        </div>
      ) : (
        <div className="watchlist-grid">
          {watchlist.map((item) => (
            <div key={item.movie_id} className="watchlist-item">
              <div className="item-poster">
                <img
                  src={apiConfig.originalImage(item.movie_poster)}
                  alt={item.movie_title}
                />
                <div className="item-actions">
                  <button
                    className="remove-btn"
                    onClick={() => removeFromWatchlist(item.movie_id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="item-info">
                <h3 className="item-title">{item.movie_title}</h3>
                <p className="item-date">
                  Added: {new Date(item.added_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;
