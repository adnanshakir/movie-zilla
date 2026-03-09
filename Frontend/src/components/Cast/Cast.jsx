import { useState, useEffect } from "react";
import tmdb from "../../services/tmdb.api.js";
import "./cast.scss";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23333'/%3E%3Ccircle cx='40' cy='30' r='14' fill='%23555'/%3E%3Cellipse cx='40' cy='70' rx='22' ry='16' fill='%23555'/%3E%3C/svg%3E";

const Cast = ({ movieId }) => {
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!movieId) return;
    setLoading(true);
    fetch(tmdb.getMovieCredits(movieId))
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        // Top 15 billed cast members only
        setCast((data.cast || []).slice(0, 15));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [movieId]);

  if (loading) {
    return (
      <div className="cast cast--loading">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="cast__skeleton" />
        ))}
      </div>
    );
  }

  if (!cast.length) return null;

  return (
    <section className="cast">
      <h2 className="cast__heading">Cast</h2>
      <div className="cast-grid">
        {cast.map((member) => (
          <div key={member.cast_id ?? member.id} className="cast-card">
            <img
              className="cast-img"
              src={
                member.profile_path
                  ? tmdb.getImageUrl(member.profile_path)
                  : PLACEHOLDER
              }
              alt={member.name}
              loading="lazy"
            />
            <span className="cast-name">{member.name}</span>
            {member.character && (
              <span className="cast-character">{member.character}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Cast;
