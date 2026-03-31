import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const DEFAULT_CENTER = [22.5726, 88.3639];

const Jobmap = ({ userCoords, jobs = [] }) => {
  const center =
    typeof userCoords?.lat === 'number' && typeof userCoords?.lng === 'number'
      ? [userCoords.lat, userCoords.lng]
      : DEFAULT_CENTER;

  return (
    <div className="h-[400px] overflow-hidden rounded-2xl border border-slate-300 dark:border-slate-800">
      <MapContainer center={center} zoom={12} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {typeof userCoords?.lat === 'number' && typeof userCoords?.lng === 'number' && (
          <Marker position={[userCoords.lat, userCoords.lng]}>
            <Popup>Your Location</Popup>
          </Marker>
        )}

        {jobs.map((job) => {
          const lat = job?.location?.coordinates?.[1];
          const lng = job?.location?.coordinates?.[0];

          if (typeof lat !== 'number' || typeof lng !== 'number') return null;

          return (
            <Marker key={job._id} position={[lat, lng]}>
              <Popup>
                <div>
                  <h3 className="font-bold">{job.title}</h3>
                  <p>{job.company}</p>
                  <p>{job.location?.address || 'Location not available'}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default Jobmap;