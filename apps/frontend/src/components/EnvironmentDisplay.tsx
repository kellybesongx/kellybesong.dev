export default function EnvironmentDisplay() {
  return (
    <div>
      <h2>Current Environment: {import.meta.env.VITE_ENV_NAME}</h2>
    </div>
  );
}
