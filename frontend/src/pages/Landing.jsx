import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const GALLERY = [
  { src: '/images/pets/sample/dog-3.jpg', caption: 'Dogs' },
  { src: '/images/pets/sample/cat-3.jpg', caption: 'Cats' },
  { src: '/images/pets/sample/rabbit-1.jpg', caption: 'Rabbits' },
  { src: '/images/pets/sample/bird-1.jpg', caption: 'Birds' },
  { src: '/images/pets/sample/hamster-1.jpg', caption: 'Hamsters' },
];

const STEPS = [
  { num: '01', title: 'Create your free account', text: 'A quick sign-up is all it takes. Your information stays private to you.' },
  { num: '02', title: 'Add your pets', text: 'Names, breeds, birthdays, weights — a little profile for every companion.' },
  { num: '03', title: 'Keep every care record', text: 'Vaccinations, checkups, medications and notes, organized and easy to find.' },
];

export default function Landing() {
  const { status } = useAuth();
  const authed = status === 'authed';

  return (
    <div className="landing">
      <header className="container landing-nav">
        <Link to="/" className="wordmark">
          PetCare
        </Link>
        <div className="landing-nav__actions">
          {authed ? (
            <Link to="/app" className="btn btn--primary">
              Go to your dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn--secondary">
                Log In
              </Link>
              <Link to="/register" className="btn btn--primary">
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      <section className="container hero">
        <div className="hero__copy">
          <p className="hero__eyebrow">A quiet home for pet care</p>
          <h1 className="hero__title">
            Better care.
            <br />
            Happier pets.
          </h1>
          <p className="hero__sub">
            Keep your pets, health records, and everyday care information organized in one place — so nothing
            important slips through the cracks.
          </p>
          <div className="hero__ctas">
            {authed ? (
              <Link to="/app" className="btn btn--primary">
                Open PetCare
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn--primary">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn--secondary">
                  Log In
                </Link>
              </>
            )}
          </div>
          <p className="hero__note">Dogs, cats, rabbits, birds — your whole pet family is welcome.</p>
        </div>
        <div className="hero__media">
          <img src="/images/pets/sample/hero-golden.jpg" alt="A golden retriever relaxing in warm light" />
          <div className="hero__media-caption">
            Next care: Rabies booster · Oct 12
            <span>A reminder your vet team would be proud of</span>
          </div>
        </div>
      </section>

      <section className="container landing-how">
        <h2 className="landing-section-title">How PetCare works</h2>
        <p className="landing-section-sub">Three small steps. Everything after that is simply easier.</p>
        <div className="landing-how__grid">
          {STEPS.map((step) => (
            <article key={step.num} className="how-step">
              <div className="how-step__num">{step.num}</div>
              <h3 className="how-step__title">{step.title}</h3>
              <p className="how-step__text">{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container landing-gallery">
        <h2 className="landing-section-title">Every kind of companion</h2>
        <p className="landing-section-sub">
          Dogs, cats, rabbits, birds, hamsters — if it is part of your family, it belongs in PetCare.
        </p>
        <div className="gallery-grid">
          {GALLERY.map((item) => (
            <figure className="gallery-item" key={item.caption}>
              <img src={item.src} alt="" loading="lazy" />
              <figcaption>{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="container landing-closing">
        <div className="closing-card">
          <div>
            <h2 className="closing-card__title">Ready to give your pets the care they deserve?</h2>
            <p className="closing-card__text">
              Create your free PetCare account and add your first companion in under a minute.
            </p>
          </div>
          {authed ? (
            <Link to="/app" className="btn">
              Go to dashboard
            </Link>
          ) : (
            <Link to="/register" className="btn">
              Get Started
            </Link>
          )}
        </div>
      </section>

      <footer className="container landing-footer">
        <span>PetCare — a small, thoughtful home for your pet's information.</span>
        <span>© {new Date().getFullYear()} PetCare</span>
      </footer>
    </div>
  );
}
