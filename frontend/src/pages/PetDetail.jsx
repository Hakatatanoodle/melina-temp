import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { petsService } from '../services/pets.service.js';
import { healthService, recordTypeLabel } from '../services/health.service.js';
import PetImage from '../components/PetImage.jsx';
import HealthRecordForm from '../components/HealthRecordForm.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import EmptyState from '../components/EmptyState.jsx';
import KebabMenu from '../components/KebabMenu.jsx';
import { PageLoader } from '../components/Spinner.jsx';
import { useToast } from '../components/Toast.jsx';
import { formatAge, formatShortDate, groupByYear } from '../utils/format.js';
import { ArrowLeftIcon, CalendarIcon, EditIcon, PlusIcon, TrashIcon } from '../components/icons.jsx';

/**
 * Pet detail — the pet's profile plus its health & care timeline
 * (design.md §20/§21). CRUD becomes more visible here, by design.
 */
export default function PetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [pet, setPet] = useState(null);
  const [records, setRecords] = useState(null);
  const [error, setError] = useState('');

  const [showRecordForm, setShowRecordForm] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [askPetDelete, setAskPetDelete] = useState(false);
  const [busyDelete, setBusyDelete] = useState(false);

  async function loadAll() {
    try {
      const [petData, recordsData] = await Promise.all([petsService.get(id), healthService.listForPet(id)]);
      setPet(petData.pet);
      setRecords(recordsData.records);
      setError('');
    } catch (err) {
      setError(err.message || 'Could not load this pet.');
    }
  }

  useEffect(() => {
    setPet(null);
    setRecords(null);
    loadAll();
  }, [id]);

  async function handleRecordSubmit(payload) {
    const fields = {
      type: payload.type,
      title: payload.title,
      date: payload.date,
      clinic: payload.clinic,
      description: payload.description,
    };
    if (recordToEdit) {
      await healthService.update(recordToEdit.id, fields);
      toast.success('Record updated.');
    } else {
      await healthService.createForPet(id, fields);
      toast.success('Record added.');
    }
    setShowRecordForm(false);
    setRecordToEdit(null);
    await loadAll();
  }

  async function handleRecordDelete() {
    try {
      await healthService.remove(recordToDelete.id);
      setRecordToDelete(null);
      toast.success('Record removed.');
      await loadAll();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handlePetDelete() {
    setBusyDelete(true);
    try {
      await petsService.remove(id);
      toast.success(`${pet.name} was removed from your family.`);
      navigate('/app/pets');
    } catch (err) {
      toast.error(err.message);
      setBusyDelete(false);
    }
  }

  if (error) {
    return (
      <>
        <Link to="/app/pets" className="back-link">
          <ArrowLeftIcon size={15} />
          Back to My Pets
        </Link>
        <div className="alert" style={{ marginTop: 18 }}>
          {error}
        </div>
      </>
    );
  }

  if (!pet || !records) return <PageLoader label="Fetching profile…" />;

  const age = formatAge(pet.dateOfBirth);
  const timeline = groupByYear(records);

  return (
    <div className="page-enter">
      <Link to="/app/pets" className="back-link">
        <ArrowLeftIcon size={15} />
        Back to My Pets
      </Link>

      <header className="pet-hero" style={{ marginTop: 14 }}>
        <PetImage pet={pet} className="pet-hero__media" />
        <div className="pet-hero__info">
          <h1>{pet.name}</h1>
          <p className="pet-hero__meta">
            {pet.species}
            {pet.breed ? ` · ${pet.breed}` : ''}
          </p>
          <div className="pet-hero__stats">
            {age && (
              <div className="pet-hero__stat">
                <b>{age}</b>
                <span>Age</span>
              </div>
            )}
            {pet.weightKg != null && (
              <div className="pet-hero__stat">
                <b>{pet.weightKg} kg</b>
                <span>Weight</span>
              </div>
            )}
            {pet.gender && (
              <div className="pet-hero__stat">
                <b>{pet.gender}</b>
                <span>Gender</span>
              </div>
            )}
            <div className="pet-hero__stat">
              <b>{pet.healthRecordCount}</b>
              <span>Health records</span>
            </div>
          </div>
          <div className="pet-hero__actions">
            <Link to={`/app/pets/${pet.id}/edit`} className="btn btn--secondary btn--sm">
              <EditIcon size={15} />
              Edit {pet.name}
            </Link>
            <KebabMenu label={`Actions for ${pet.name}`}>
              <button type="button" className="menu__item menu__item--danger" onClick={() => setAskPetDelete(true)}>
                <TrashIcon size={15} />
                Remove {pet.name}
              </button>
            </KebabMenu>
          </div>
          {pet.notes && <p className="pet-hero__notes">{pet.notes}</p>}
        </div>
      </header>

      <section className="health-section" aria-label="Health and care">
        <div className="section-head" style={{ marginTop: 0 }}>
          <h2 className="section-head__title">Health &amp; Care</h2>
          <button type="button" className="btn btn--primary btn--sm" onClick={() => setShowRecordForm(true)}>
            <PlusIcon size={15} />
            Add Health Record
          </button>
        </div>

        <div className="health-card">
          {records.length === 0 ? (
            <EmptyState
              icon={<CalendarIcon size={26} />}
              title="Nothing recorded yet."
              text="Keep important care information here so it is easy to find later."
              action={
                <button type="button" className="btn btn--primary" onClick={() => setShowRecordForm(true)}>
                  Add First Record
                </button>
              }
            />
          ) : (
            <div className="timeline">
              {timeline.map((group) => (
                <div className="timeline__group" key={group.year}>
                  <h3 className="timeline__year">{group.year}</h3>
                  {group.records.map((record) => (
                    <div className={`timeline__item timeline__item--${record.type}`} key={record.id}>
                      <div className="timeline__row">
                        <div>
                          <span className="timeline__date">{formatShortDate(record.date)}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                            <span className="timeline__title">{record.title}</span>
                            <span className={`badge badge--${record.type}`}>
                              <span className="badge__dot" />
                              {recordTypeLabel(record.type)}
                            </span>
                          </div>
                          {record.clinic && <span className="timeline__clinic">{record.clinic}</span>}
                          {record.description && <p className="timeline__desc">{record.description}</p>}
                        </div>
                        <div className="timeline__actions">
                          <button
                            type="button"
                            className="icon-btn"
                            aria-label={`Edit ${record.title}`}
                            onClick={() => {
                              setRecordToEdit(record);
                              setShowRecordForm(true);
                            }}
                          >
                            <EditIcon size={15} />
                          </button>
                          <button
                            type="button"
                            className="icon-btn icon-btn--danger"
                            aria-label={`Delete ${record.title}`}
                            onClick={() => setRecordToDelete(record)}
                          >
                            <TrashIcon size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {showRecordForm && (
        <HealthRecordForm
          pet={pet}
          record={recordToEdit}
          onSubmit={handleRecordSubmit}
          onClose={() => {
            setShowRecordForm(false);
            setRecordToEdit(null);
          }}
        />
      )}

      {recordToDelete && (
        <ConfirmDialog
          title={`Remove “${recordToDelete.title}”?`}
          message="This health record will be permanently removed from this pet's history."
          confirmLabel="Remove record"
          onCancel={() => setRecordToDelete(null)}
          onConfirm={handleRecordDelete}
        />
      )}

      {askPetDelete && (
        <ConfirmDialog
          title={`Remove ${pet.name}?`}
          message={`This will remove ${pet.name} and all of their health records. This cannot be undone.`}
          confirmLabel={`Remove ${pet.name}`}
          onCancel={() => setAskPetDelete(false)}
          onConfirm={handlePetDelete}
        />
      )}
    </div>
  );
}
