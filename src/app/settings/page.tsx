import { ProfileSettings } from './profile-settings';

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Configuración</h1>
      <ProfileSettings />
    </div>
  );
}
