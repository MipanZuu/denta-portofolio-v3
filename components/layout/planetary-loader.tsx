export function PlanetaryLoader() {
  return (
    <div className="route-loading" role="status" aria-live="polite">
      <div className="planet-loader" aria-hidden="true">
        <span className="planet-loader-halo" />
        <span className="planet-loader-core"><i /></span>
        <span className="planet-loader-orbit orbit-one"><i /></span>
        <span className="planet-loader-orbit orbit-two"><i /></span>
        <span className="planet-loader-orbit orbit-three"><i /></span>
      </div>
      <span className="sr-only">Loading page</span>
    </div>
  );
}
