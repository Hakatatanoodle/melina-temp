import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { healthService, recordTypeLabel } from '../services/health.service.js';
import { petsService } from '../services/pets.service.js';
import AddPetModal from '../components/AddPetModal.jsx';
import HealthRecordForm from '../components/HealthRecordForm.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { PageLoader } from '../components/Spinner.jsx';
import { useToast } from '../components/Toast.jsx';
import { formatShortDate, groupByYear } from '../utils/format.js';
import { CalendarIcon, EditIcon, PlusIcon, TrashIcon } from '../components/icons.jsx';

/** Health Records — care history across all pets, as one timeline (§21). */
export default function Health() {
  const toast = useToast();

  const [records, setRecords] = useState(null);
  const [pets, setPets] = useState([]);
  const [error, setError] = useState('');

  const [showAddPet, setShowAddPet] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);

  async function loadAll() {
    try {
      const [recordsData, petsData] = await Promise.all([healthService.listAll(), petsService.list()]);
      setRecords(recordsData.records);
      setPets(petsData.pets);
      setError('');
    } catch (err) {
      setError(err.message || 'Could not load health records.');
      setRecords([]);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleRecordSubmit(payload) {
    if (recordToEdit) {
      await healthService.update(recordToEdit.id, payload);
      toast.success('Record updated.');
    } else {
      const { petId, ...fields } = payload;
      await healthService.createForPet(petId, fields);
      toast.success('Record added.');
    }
    setShowForm(false);
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

  const timeline = records ? groupByYear(records) : [];

  function editRecord(record) {
    setRecordToEdit(record);
    setShowForm(true);
  }

  return (
    <div className="page-enter">
      <div className="page-head">
        <div>
          <h1 className="page-head__title">Health Records</h1>
          <p className="page-head__sub">The care history of your whole pet family, newest first.</p>
        </div>
        <button
          type="button"
          className="btn btn--primary"
          disabled={pets.length === 0}
          onClick={() => setShowForm(true)}
        >
          <PlusIcon size={15} />
          Add Health Record
        </button>
      </div>

      {error && <div className="alert">{error}</div>}
      {!records && !error && <PageLoader label="Fetching health records…" />}

      {records && records.length === 0 && !error && (
        pets.length === 0 ? (
          <EmptyState
            icon={<CalendarIcon size={26} />}
            title="Add a pet first."
            text="Health records live with each pet. Add your first companion, then start their care history."
            action={
              <button type="button" className="btn btn--primary" onClick={() => setShowAddPet(true)}>
                Add Your First Pet
              </button>
            }
          />
        ) : (
          <EmptyState
            icon={<CalendarIcon size={26} />}
            title="Nothing recorded yet."
            text="Keep important care information here so it is easy to find later."
            action={
              <button type="button" className="btn btn--primary" onClick={() => setShowForm(true)}>
                Add First Record
              </button>
            }
          />
        )
      )}

      {records && records.length > 0 && (
        <div className="health-card">
          <TimelineView timeline={timeline} onEdit={editRecord} onDelete={setRecordToDelete} />
        </div>
      )}

      {showAddPet && (
        <AddPetModal
          onClose={() => setShowAddPet(false)}
          onCreated={async () => {
            setShowAddPet(false);
            await loadAll();
          }}
        />
      )}

      {showForm && (
        <HealthRecordForm
          petOptions={pets}
          record={recordToEdit}
          onSubmit={handleRecordSubmit}
          onClose={() => {
            setShowForm(false);
            setRecordToEdit(null);
          }}
        />
      )}

      {recordToDelete && (
        <ConfirmDialog
          title={`Remove “${recordToDelete.title}”?`}
          message="This health record will be permanently removed."
          confirmLabel="Remove record"
          onCancel={() => setRecordToDelete(null)}
          onConfirm={handleRecordDelete}
        />
      )}
    </div>
  );
}

/** Timeline grouped by year, with per-record edit/delete. */
function TimelineView({ timeline, onEdit, onDelete }) {
  return (
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
                    <Link to={`/app/pets/${record.pet.id}`} className="badge" style={{ fontWeight: 800 }}>
                      {record.pet.name}
                    </Link>
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
                  <button type="button" className="icon-btn" aria-label={`Edit ${record.title}`} onClick={() => onEdit(record)}>
                    <EditIcon size={15} />
                  </button>
                  <button
                    type="button"
                    className="icon-btn icon-btn--danger"
                    aria-label={`Delete ${record.title}`}
                    onClick={() => onDelete(record)}
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
  );
}
