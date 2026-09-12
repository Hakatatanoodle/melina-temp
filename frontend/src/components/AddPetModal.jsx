import OnboardingWizard from './OnboardingWizard.jsx';
import Modal from './Modal.jsx';

/** Logged-in add-pet: the same 2-step wizard inside the shared modal. */
export default function AddPetModal({ onClose, onCreated }) {
  return (
    <Modal title="Add a pet" subtitle="One quick step, then a few gentle details." onClose={onClose}>
      <OnboardingWizard mode="addPet" onComplete={onCreated} onCancel={onClose} />
    </Modal>
  );
}
