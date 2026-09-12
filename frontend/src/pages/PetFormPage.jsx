import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { petsService } from '../services/pets.service.js';
import PetForm, { petToFormValues } from '../components/PetForm.jsx';
import { PageLoader } from '../components/Spinner.jsx';
import { useToast } from '../components/Toast.jsx';
import { ArrowLeftIcon } from '../components/icons.jsx';

/**
 * Add Pet / Edit Pet. Product copy adapts: "Tell us about her" on create,
 * "Edit Bruno" on edit — never "Create record".
 */
export default function PetFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const navigate = useNavigate();
  const toast = useToast();
  const [pet, setPet] = useState(isEdit ? null : undefined); // null = loading, undefined = new
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    let active = true;
    petsService
      .get(id)
      .then((data) => {
        if (active) setPet(data.pet);
      })
      .catch((err) => {
        if (active) setLoadError(err.message || 'Could not load this pet.');
      });
    return () => {
      active = false;
    };
  }, [isEdit, id]);

  async function handleSubmit(payload) {
    if (isEdit) {
      const data = await petsService.update(id, payload);
      toast.success(`${data.pet.name} was updated.`);
      navigate(`/app/pets/${id}`);
    } else {
      const data = await petsService.create(payload);
      toast.success(`Welcome to the family, ${data.pet.name}!`);
      navigate(`/app/pets/${data.pet.id}`);
    }
  }

  if (loadError) {
    return (
      <>
        <Link to="/app/pets" className="back-link">
          <ArrowLeftIcon size={15} />
          Back to My Pets
        </Link>
        <div className="alert" style={{ marginTop: 18 }}>
          {loadError}
        </div>
      </>
    );
  }

  const title = isEdit ? `Edit ${pet?.name || 'pet'}` : 'Add a pet';
  const subtitle = isEdit ? 'Update their information whenever life changes.' : 'A little profile for a new companion.';

  return (
    <div className="page-enter">
      <Link to={isEdit ? `/app/pets/${id}` : '/app/pets'} className="back-link">
        <ArrowLeftIcon size={15} />
        {isEdit ? `Back to ${pet?.name || 'profile'}` : 'Back to My Pets'}
      </Link>

      <div className="page-head" style={{ marginTop: 10 }}>
        <div>
          <h1 className="page-head__title">{title}</h1>
          <p className="page-head__sub">{subtitle}</p>
        </div>
      </div>

      {isEdit && !pet ? (
        <PageLoader label="Fetching profile…" />
      ) : (
        <div className="form-card">
          <PetForm
            initialValues={petToFormValues(isEdit ? pet : undefined)}
            submitLabel={isEdit ? 'Save Changes' : 'Add Pet'}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  );
}
