import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import tmdb from "../../services/tmdb.api";
import "./hero.scss";

const features = [
  { icon: "🎬", label: "Trending movies updated daily" },
  { icon: "▶", label: "Watch trailers instantly" },
  { icon: "❤", label: "Save your favorites" },
  { icon: "📋", label: "Track your watch history" },
];

const Hero = () => {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch(tmdb.getTrending());
        const data = await res.json();

        setMovies(data.results.slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    };

    fetchTrending();
  }, []);

  return (
    <section className="hero">
      <div className="hero__overlay" />

      <div className="container hero__inner">
        {/* Left — copy */}
        <div className="hero__content">
          <span className="hero__eyebrow">Your personal cinema</span>

          <h1 className="hero__title">
            Never Wonder
            <br />
            <span>What to Watch</span> Again.
          </h1>

          <p className="hero__desc">
            MovieZilla helps you discover what's trending, preview trailers
            before committing, and build a list that actually reflects your
            taste.
          </p>

          <ul className="hero__features">
            {features.map((f) => (
              <li key={f.label}>
                <span className="hero__feature-icon">{f.icon}</span>
                {f.label}
              </li>
            ))}
          </ul>

          <div className="hero__actions">
            <button
              className="btn btn--primary btn--lg"
              onClick={() => navigate("/")}
            >
              Explore Movies
            </button>
            <button
              className="btn btn--outline btn--lg"
              onClick={() => navigate("/search")}
            >
              Search Titles
            </button>
          </div>
        </div>

        {/* Right — decorative poster stack */}
        <div className="hero__visual" aria-hidden="true">
          <div className="hero__poster-stack">
            {movies[2] && (
              <div
                className="hero__poster hero__poster--back"
                style={{
                  backgroundImage: `url(${tmdb.getImageUrl(movies[2].poster_path)})`,
                }}
              />
            )}

            {movies[1] && (
              <div
                className="hero__poster hero__poster--mid"
                style={{
                  backgroundImage: `url(${tmdb.getImageUrl(movies[1].poster_path)})`,
                }}
              />
            )}

            {movies[0] && (
              <div
                className="hero__poster hero__poster--front"
                style={{
                  backgroundImage: `url(${tmdb.getImageUrl(movies[0].poster_path)})`,
                }}
              >
                <div className="hero__overlay">
                  <h4 className="hero__poster-title">{movies[0].title}</h4>

                  <div className="hero__rating">
                    ⭐ {movies[0].vote_average.toFixed(1)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
