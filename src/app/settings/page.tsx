import { ProfileSettings } from './profile-settings';
import { EmailSettings } from './email-settings';

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <h1 className="text-3xl font-bold">Configuración</h1>
      <EmailSettings />
      <ProfileSettings />
    </div>
  );
}
