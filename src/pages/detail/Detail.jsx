import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import tmdbApi from "./../../api/tmdbApi";
import apiConfig from "../../api/apiConfig";

import Button from "../../components/button/Button";
import Modal, { ModalContent } from "../../components/modal/Modal";

import "./detail.scss";
import CastList from "./CastList";
import VideoList from "./VideoList";
import MovieList from "./../../components/movie-list/MovieList";
import FeedbackSection from "../../components/feedback/FeedbackSection";
import WatchlistSection from "../../components/watchlist/WatchlistSection";

const Detail = () => {
  const { category, id } = useParams();

  const [item, setItem] = useState(null);
  const [trailerSrc, setTrailerSrc] = useState("");
  const [trailerActive, setTrailerActive] = useState(false);

  useEffect(() => {
    const getDetail = async () => {
      const response = await tmdbApi.detail(category, id, { params: {} });
      setItem(response);
      window.scrollTo(0, 0);
    };
    getDetail();
  }, [category, id]);

  const openTrailer = async () => {
    if (!item) return;
    const videos = await tmdbApi.getVideos(category, item.id);
    if (videos.results.length > 0) {
      setTrailerSrc("https://www.youtube.com/embed/" + videos.results[0].key + "?autoplay=1");
      setTrailerActive(true);
    } else {
      alert("Trailer not available");
    }
  };

  const closeTrailer = () => {
    setTrailerSrc("");
    setTrailerActive(false);
  };

  return (
    <>
      {item && (
        <>
          <div
            className="banner"
            style={{
              backgroundImage: `url(${apiConfig.originalImage(
                item.backdrop_path || item.poster_path
              )})`,
            }}
          ></div>

          <div className="mb-3 movie-content container">
            <div className="movie-content__poster">
              <div
                className="movie-content__poster__img"
                style={{
                  backgroundImage: `url(${apiConfig.originalImage(
                    item.backdrop_path || item.poster_path
                  )})`,
                }}
              ></div>
            </div>

            <div className="movie-content__info">
              <h1 className="title">{item.title || item.name}</h1>
              <div className="genres">
                {item.genres &&
                  item.genres.slice(0, 5).map((genre, index) => (
                    <span key={index} className="genres__item">
                      {genre.name}
                    </span>
                  ))}
              </div>
              <p className="overview">{item.overview}</p>
              
              <div className="movie-actions">
                <Button className="play-trailer-btn compact" onClick={openTrailer}>
                  Play Trailer
                </Button>
                <WatchlistSection
                  movieId={item.id}
                  movieTitle={item.title || item.name}
                  moviePoster={item.poster_path}
                />
              </div>
              
              <div className="cast">
                <div className="section__header">
                  <h2>Casts</h2>
                </div>
                {/* casts list */}
                <CastList id={item.id} />
              </div>
            </div>
          </div>

          <div className="container">
            <div className="section mb-3">
              <VideoList id={item.id} />
            </div>

            <Modal active={trailerActive} id="detail_trailer_modal">
              <ModalContent onClose={closeTrailer}>
                <iframe
                  width="100%"
                  height="500px"
                  title="trailer"
                  src={trailerSrc}
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                ></iframe>
              </ModalContent>
            </Modal>
            <div className="section mb-3">
              <div className="section__header mb-2">
                <h2>Similar</h2>
              </div>
              <MovieList category={category} type="similar" id={item.id} />
            </div>
            
            {/* Feedback Section */}
            <FeedbackSection movieId={item.id} />
          </div>
        </>
      )}
    </>
  );
};

export default Detail;
