import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { petsService } from '../services/pets.service.js';
import { healthService } from '../services/health.service.js';
import PetCard from '../components/PetCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import AddPetModal from '../components/AddPetModal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { PageLoader } from '../components/Spinner.jsx';
import { useToast } from '../components/Toast.jsx';
import { PlusIcon, PawIcon } from '../components/icons.jsx';
import { formatDate, firstName, formatShortDate, greetingForHour } from '../utils/format.js';
import { recordTypeLabel } from '../services/health.service.js';

/**
 * Dashboard — answers "how are my pets doing, and what can I do next?"
 * Mixed summary composition: one prominent care feature + quiet numbers
 * (design.md §17), then the photography-led pet grid.
 */
export default function Dashboard() {
  const { user } = useAuth();
  const toast = useToast();

  const [pets, setPets] = useState(null);
  const [recent, setRecent] = useState(null);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function loadPets() {
    try {
      const [petsData, recordsData] = await Promise.all([petsService.list(), healthService.listAll()]);
      setPets(petsData.pets);
      setRecent(recordsData.records.slice(0, 3));
    } catch (err) {
      setError(err.message || 'Could not load your pets.');
      setPets([]);
      setRecent([]);
    }
  }

  useEffect(() => {
    loadPets();
  }, []);

  async function handleDelete() {
    setDeleting(true);
    try {
      await petsService.remove(petToDelete.id);
      setPetToDelete(null);
      toast.success(`${petToDelete.name} was removed from your family.`);
      await loadPets();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  }

  const now = new Date();
  const totalRecords = (pets || []).reduce((sum, pet) => sum + (pet.healthRecordCount || 0), 0);

  const upcoming = (pets || [])
    .filter((pet) => pet.nextCare)
    .map((pet) => ({ ...pet.nextCare, petName: pet.name, petId: pet.id }))
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))[0];

  return (
    <>
      <div className="dash-greeting">
        <h1>
          {greetingForHour(now.getHours())}, {firstName(user?.fullName)}.
        </h1>
        <p>
          {upcoming
            ? `${upcoming.petName}'s ${upcoming.title} is coming up on ${formatDate(upcoming.date)}.`
            : 'Here is your pet care at a glance.'}
        </p>
      </div>

      <section className="dash-summary" aria-label="Pet care summary">
        {upcoming ? (
          <div className="dash-feature">
            <span className="dash-feature__eyebrow">Next up</span>
            <h2 className="dash-feature__title">{upcoming.title}</h2>
            <p className="dash-feature__meta">
              {upcoming.petName} · {recordTypeLabel(upcoming.type)} · {formatDate(upcoming.date)}
            </p>
            <Link className="dash-feature__link" to={`/app/pets/${upcoming.petId}`}>
              Open {upcoming.petName}'s profile →
            </Link>
          </div>
        ) : (
          <div className="dash-feature dash-feature--quiet">
            <span className="dash-feature__eyebrow">All caught up</span>
            <h2 className="dash-feature__title">No upcoming care scheduled</h2>
            <p className="dash-feature__meta">
              Add a dated record — like a vaccination or checkup — and it will show up here.
            </p>
          </div>
        )}
        <div className="dash-stats">
          <div className="stat-tile">
            <span className="stat-tile__label">Pets</span>
            <span className="stat-tile__value">{pets ? pets.length : '—'}</span>
          </div>
          <div className="stat-tile">
            <span className="stat-tile__label">Health records</span>
            <span className="stat-tile__value">{pets ? totalRecords : '…'}</span>
          </div>
        </div>
      </section>

      <section aria-label="My Pets">
        <div className="section-head" style={{ marginTop: 0 }}>
          <h2 className="section-head__title">My Pets</h2>
          <button type="button" className="btn btn--primary btn--sm" onClick={() => setShowAdd(true)}>
            <PlusIcon size={15} />
            Add Pet
          </button>
        </div>

        {error && <div className="alert">{error}</div>}
        {!pets && !error && <PageLoader label="Fetching your pets…" />}

        {pets && pets.length === 0 && !error && (
          <EmptyState
            icon={<PawIcon size={30} />}
            title="Your pet family is looking a little empty."
            text="Add your first companion to get started — PetCare will keep their story organized."
            action={
              <button type="button" className="btn btn--primary" onClick={() => setShowAdd(true)}>
                Add Your First Pet
              </button>
            }
          />
        )}

        {pets && pets.length > 0 && (
          <div className="pets-grid">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} onDelete={setPetToDelete} />
            ))}
          </div>
        )}
      </section>

      {recent && recent.length > 0 && pets && pets.length > 0 && (
        <section aria-label="Recent care">
          <div className="section-head">
            <h2 className="section-head__title">Recent care</h2>
            <Link to="/app/health" className="btn btn--secondary btn--sm">
              All health records
            </Link>
          </div>
          <div className="health-card" style={{ padding: '18px 24px 8px' }}>
            <div className="timeline">
              {recent.map((record) => (
                <div className={`timeline__item timeline__item--${record.type}`} key={record.id} style={{ paddingBottom: 14 }}>
                  <div className="timeline__row">
                    <div>
                      <span className="timeline__date">
                        {formatShortDate(record.date)} · {record.pet.name}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <span className="timeline__title">{record.title}</span>
                        <span className={`badge badge--${record.type}`}>
                          <span className="badge__dot" />
                          {recordTypeLabel(record.type)}
                        </span>
                      </div>
                    </div>
                    <Link to={`/app/pets/${record.pet.id}`} className="btn btn--ghost btn--sm">
                      Open {record.pet.name}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {showAdd && (
        <AddPetModal
          onClose={() => setShowAdd(false)}
          onCreated={async () => {
            setShowAdd(false);
            await loadPets();
          }}
        />
      )}

      {petToDelete && (
        <ConfirmDialog
          title={`Remove ${petToDelete.name}?`}
          message={`This will remove ${petToDelete.name} and all of their health records. This cannot be undone.`}
          confirmLabel={`Remove ${petToDelete.name}`}
          onCancel={() => setPetToDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
