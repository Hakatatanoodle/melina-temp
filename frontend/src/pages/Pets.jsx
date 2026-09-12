import { useEffect, useState } from 'react';
import { petsService } from '../services/pets.service.js';
import PetCard from '../components/PetCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import AddPetModal from '../components/AddPetModal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { PageLoader } from '../components/Spinner.jsx';
import { useToast } from '../components/Toast.jsx';
import { PlusIcon, PawIcon } from '../components/icons.jsx';

/** My Pets — the full family grid with add + manage actions. */
export default function Pets() {
  const toast = useToast();
  const [pets, setPets] = useState(null);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function loadPets() {
    try {
      const data = await petsService.list();
      setPets(data.pets);
    } catch (err) {
      setError(err.message || 'Could not load your pets.');
      setPets([]);
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

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-head__title">My Pets</h1>
          <p className="page-head__sub">
            {pets?.length ? `${pets.length} ${pets.length === 1 ? 'companion' : 'companions'} in your care.` : 'Your family, all in one place.'}
          </p>
        </div>
        <button type="button" className="btn btn--primary" onClick={() => setShowAdd(true)}>
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
