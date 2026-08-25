import { SectionHeader } from '../components/product/SectionHeader';
import { SessionSetup } from '../components/product/SessionSetup';

export const CreateSessionPage = () => {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Focus Sessions"
        title="Build your focus block"
        description="Select an activity, choose Pomodoro, custom timer, or open listening, then pick a playlist, ambient sound, or silence."
      />
      <SessionSetup />
    </div>
  );
};
