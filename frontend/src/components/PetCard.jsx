import { Link, useNavigate } from 'react-router-dom';
import PetImage from './PetImage.jsx';
import KebabMenu from './KebabMenu.jsx';
import { formatAge, formatShortDate } from '../utils/format.js';
import { recordTypeLabel } from '../services/health.service.js';
import { EditIcon, TrashIcon } from './icons.jsx';

/**
 * Pet card — design.md §18/§19 Concept A (Editorial Portrait):
 * image first, strong name, calm metadata, one clear next action.
 */
export default function PetCard({ pet, onDelete }) {
  const navigate = useNavigate();
  const age = formatAge(pet.dateOfBirth);

  const care = pet.nextCare
    ? {
        icon: null,
        muted: false,
        text: `Next care: ${recordTypeLabel(pet.nextCare.type)} · ${formatShortDate(pet.nextCare.date)}`,
      }
    : pet.lastCare
      ? { muted: true, text: `Last care: ${recordTypeLabel(pet.lastCare.type)} · ${formatShortDate(pet.lastCare.date)}` }
      : { muted: true, text: 'No care logged yet' };

  return (
    <article className="pet-card">
      <Link to={`/app/pets/${pet.id}`} className="pet-card__media-link" aria-label={`View ${pet.name}'s profile`}>
        <PetImage pet={pet} className="pet-card__media" />
      </Link>
      <div className="pet-card__body">
        <div className="pet-card__name-row">
          <h3 className="pet-card__name">{pet.name}</h3>
          <KebabMenu label={`Actions for ${pet.name}`}>
            <button type="button" className="menu__item" onClick={() => navigate(`/app/pets/${pet.id}/edit`)}>
              <EditIcon size={15} />
              Edit {pet.name}
            </button>
            <button type="button" className="menu__item menu__item--danger" onClick={() => onDelete?.(pet)}>
              <TrashIcon size={15} />
              Remove {pet.name}
            </button>
          </KebabMenu>
        </div>
        <p className="pet-card__meta">
          {pet.species}
          {pet.breed ? ` · ${pet.breed}` : ''}
        </p>
        <p className="pet-card__stats">
          {[age && `${age} old`, pet.gender, pet.weightKg != null && `${pet.weightKg} kg`].filter(Boolean).join(' · ')}
        </p>
        <p className={`pet-card__care${care.muted ? ' pet-card__care--muted' : ''}`}>{care.text}</p>
      </div>
      <div className="pet-card__foot">
        <Link to={`/app/pets/${pet.id}`} className="pet-card__view">
          View profile
        </Link>
      </div>
    </article>
  );
}
