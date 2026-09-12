import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { petsService } from '../services/pets.service.js';
import PetForm, { petToFormValues } from '../components/PetForm.jsx';
import { PageLoader } from '../components/Spinner.jsx';
import { useToast } from '../components/Toast.jsx';
import { ArrowLeftIcon } from '../components/icons.jsx';

/** Edit Pet ("Edit Bruno"). Creation now lives in the onboarding wizard. */
export default function PetFormPage() {
  const { id } = useParams();

  const navigate = useNavigate();
  const toast = useToast();
  const [pet, setPet] = useState(null);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!id) return;
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
  }, [id]);

  async function handleSubmit(payload) {
    const data = await petsService.update(id, payload);
    toast.success(`${data.pet.name} was updated.`);
    navigate(`/app/pets/${id}`);
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

  const title = `Edit ${pet?.name || 'pet'}`;
  const subtitle = 'Update their information whenever life changes — weight, photos and notes live here.';

  return (
    <div className="page-enter">
      <Link to={`/app/pets/${id}`} className="back-link">
        <ArrowLeftIcon size={15} />
        {`Back to ${pet?.name || 'profile'}`}
      </Link>

      <div className="page-head" style={{ marginTop: 10 }}>
        <div>
          <h1 className="page-head__title">{title}</h1>
          <p className="page-head__sub">{subtitle}</p>
        </div>
      </div>

      {!pet ? (
        <PageLoader label="Fetching profile…" />
      ) : (
        <div className="form-card">
          <PetForm
            initialValues={petToFormValues(pet)}
            submitLabel='Save Changes'
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  );
}
