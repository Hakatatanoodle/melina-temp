import { useNavigate } from 'react-router-dom';
import OnboardingWizard from '../components/OnboardingWizard.jsx';

/** Post-registration onboarding: create the first pet before reaching the app. */
export default function Onboarding() {
  const navigate = useNavigate();
  return (
    <div className="container container--narrow page-enter">
      <div className="onboarding-page">
        <OnboardingWizard
          mode="onboarding"
          onComplete={() => navigate('/app', { replace: true })}
          onCancel={() => navigate('/app', { replace: true })}
        />
      </div>
    </div>
  );
}
