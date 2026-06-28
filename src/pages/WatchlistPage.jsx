import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./watchlist-page.scss";
import apiConfig from "../api/apiConfig";
import tmdbApi, { category as tmdbCategory } from "../api/tmdbApi";
import Modal, { ModalContent } from "../components/modal/Modal";
import Button from "../components/button/Button";

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

  const [modalActive, setModalActive] = useState(false);
  const [trailerSrc, setTrailerSrc] = useState("");
  const iframeRef = useRef(null);

  const openTrailer = async (movieId) => {
    try {
      const videos = await tmdbApi.getVideos(tmdbCategory.movie, movieId);
      if (videos.results && videos.results.length > 0) {
        const key = videos.results[0].key;
        setTrailerSrc("https://www.youtube.com/embed/" + key);
        setModalActive(true);
      } else {
        alert("Trailer not available");
      }
    } catch (err) {
      console.error("Error fetching trailer", err);
      alert("Error fetching trailer");
    }
  };

  const closeModal = () => {
    setTrailerSrc("");
    setModalActive(false);
    if (iframeRef.current) iframeRef.current.setAttribute("src", "");
  };

  if (loading) {
    return <div className="watchlist-page container"><p>Loading...</p></div>;
  }

  return (
    <>
    <div className="watchlist-page container">
      <div className="watchlist-header">
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
                </div>
                <button
                  className="remove-cross"
                  onClick={() => removeFromWatchlist(item.movie_id)}
                  aria-label={`Remove ${item.movie_title} from watchlist`}
                >
                  <i className="bx bx-x"></i>
                </button>
                <Button className="play-overlay" onClick={() => openTrailer(item.movie_id)}>
                  <i className="bx bx-play"></i>
                </Button>
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
      <Modal active={modalActive} id={`modal_watchlist`}> 
        <ModalContent onClose={closeModal}>
          <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
            <iframe
              ref={iframeRef}
              src={trailerSrc}
              title="trailer"
              width="100%"
              height="100%"
              style={{ position: "absolute", top: 0, left: 0, border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

export default WatchlistPage;
