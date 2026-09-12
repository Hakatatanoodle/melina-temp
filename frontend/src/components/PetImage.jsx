import { useState } from 'react';
import { initials } from '../utils/format.js';

const TINTS = {
  dog: 'var(--moss-tint)',
  cat: 'var(--clay-tint)',
  rabbit: 'var(--sand-soft)',
  bird: 'var(--sand-soft)',
  fish: 'var(--moss-tint)',
  other: 'var(--sand-soft)',
};

function tintFor(species) {
  const key = Object.keys(TINTS).find((candidate) =>
    String(species || '').toLowerCase().includes(candidate)
  );
  return TINTS[key] || TINTS.other;
}

/**
 * Pet portrait with deterministic branded fallback: uses the pet's image when
 * present and reachable; otherwise (or on load error) renders a warm
 * species-tinted monogram. No external requests required.
 */
export default function PetImage({ pet, className, children }) {
  const [failed, setFailed] = useState(false);
  const showImage = pet?.imageUrl && !failed;

  return (
    <div
      className={`${className || ''}${showImage ? '' : ' pet-card__media--fallback'}`.trim()}
      style={showImage ? undefined : { background: tintFor(pet?.species) }}
    >
      {showImage ? (
        <img
          src={pet.imageUrl}
          alt={`${pet.name}'s portrait`}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="pet-card__initial" aria-hidden="true">
          {initials(pet?.name)}
        </span>
      )}
      {children}
    </div>
  );
}
