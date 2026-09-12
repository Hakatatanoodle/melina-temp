import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import PetCard from '../components/PetCard.jsx';

/** Product preview pets — static, non-interactive (pointer-events disabled). */
const PREVIEW_PETS = [
  {
    id: 'preview-bruno',
    name: 'Bruno',
    species: 'Dog',
    breed: 'Golden Retriever',
    dateOfBirth: '2023-05-14',
    gender: 'Male',
    weightKg: 28.5,
    imageUrl: '/images/pets/sample/dog-1.jpg',
    nextCare: { type: 'vaccination', title: 'Rabies booster', date: '2026-10-12' },
    lastCare: null,
    healthRecordCount: 5,
  },
  {
    id: 'preview-luna',
    name: 'Luna',
    species: 'Cat',
    breed: 'Persian',
    dateOfBirth: '2024-02-03',
    gender: 'Female',
    weightKg: 4.2,
    imageUrl: '/images/pets/sample/cat-1.jpg',
    nextCare: null,
    lastCare: { type: 'checkup', title: 'General checkup', date: '2026-08-20' },
    healthRecordCount: 3,
  },
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
            Bruno's rabies booster
            <span>Tue, Oct 12 — set up in seconds</span>
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

      <section className="container landing-preview">
        <h2 className="landing-section-title">Your pets, at a glance</h2>
        <p className="landing-section-sub">A calm dashboard with the care information that matters right now.</p>
        <div className="preview-shell">
          <div className="preview-top">
            <span className="landing-section-title" style={{ fontSize: 22 }}>
              Good morning, Alex.
            </span>
            <div className="preview-top__stats">
              <span>
                <b>2</b> Pets
              </span>
              <span>
                <b>8</b> Health records
              </span>
              <span>
                <b>1</b> Upcoming
              </span>
            </div>
          </div>
          <div className="preview-pets">
            {PREVIEW_PETS.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
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
