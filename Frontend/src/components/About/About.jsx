import "./about.scss";

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="11" y1="8" x2="11" y2="14" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    ),
    title: "Smart Discovery",
    desc: "Explore what's trending globally and locally. Curated picks updated every day so you always have something fresh to watch.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
      </svg>
    ),
    title: "Instant Trailers",
    desc: "Preview any movie in seconds. Watch the official trailer before you decide \u2014 no tabs, no searching, no hassle.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: "Favorites List",
    desc: "Save movies you love \u2014 or want to watch later. Your personal list syncs instantly and stays right where you left it.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Watch History",
    desc: "Every movie you've viewed is tracked automatically. Pick up where you left off or revisit something you loved.",
  },
];

const steps = [
  {
    num: "01",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    title: "Find What's Trending",
    desc: "See what everyone is watching right now — popular picks surfaced daily so you never miss a hit.",
  },
  {
    num: "02",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
      </svg>
    ),
    title: "Preview Trailers Instantly",
    desc: "Watch the official trailer without leaving the app. Decide in seconds whether it's worth your time.",
  },
  {
    num: "03",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: "Save & Track Everything",
    desc: "Build your personal watchlist, mark favorites, and keep a history of every movie you've explored.",
  },
];

const About = () => {
  return (
    <section className="about" id="about">
      <div className="container">
        {/* Header */}
        <div className="about__header">
          <span className="about__eyebrow">Why MovieZilla</span>
          <h2 className="about__title">
            Your Personal Movie<br />
            <span>Discovery Platform</span>
          </h2>
          <p className="about__subtitle">
            Stop scrolling endlessly. MovieZilla gives you the right tools to find
            what to watch, preview it instantly, and keep track of everything you love.
          </p>
        </div>

        {/* Feature cards */}
        <div className="about__grid">
          {features.map((f) => (
            <div className="about__card" key={f.title}>
              <div className="about__card-icon">{f.icon}</div>
              <h3 className="about__card-title">{f.title}</h3>
              <p className="about__card-desc">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Steps subsection */}
        <div className="about__steps-section">
          <div className="about__steps-header">
            <h3 className="about__steps-title">
              How MovieZilla Helps You <span>Decide</span>
            </h3>
          </div>

          <div className="about__steps">
            {steps.map((s, i) => (
              <div className="about__step" key={s.num}>
                <span className="about__step-num">{s.num}</span>
                <div className="about__step-icon">{s.icon}</div>
                <h4 className="about__step-title">{s.title}</h4>
                <p className="about__step-desc">{s.desc}</p>
                {i < steps.length - 1 && <div className="about__step-line" aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
