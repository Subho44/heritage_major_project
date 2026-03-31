import { useEffect, useState } from 'react';
import axios from 'axios';
import Jobmap from '../components/Jobmap';

const Nearbyjob = () => {
  const [userCoords, setUserCoords] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) {
      setMessage('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserCoords({ lat, lng });

        try {
          const response = await axios.get(
            `http://localhost:5000/api/jobs/nearby?lat=${lat}&lng=${lng}`
          );
          setJobs(Array.isArray(response.data?.jobs) ? response.data.jobs : []);
        } catch (error) {
          console.error(error);
          setMessage(error.response?.data?.message || 'Failed to load nearby jobs.');
          setJobs([]);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setMessage('Unable to fetch your location. Please allow location access.');
        setLoading(false);
      }
    );
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-4xl font-bold">Nearby Jobs</h2>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
          Find jobs near your current location.
        </p>
      </div>

      {loading && <div>Loading nearby jobs...</div>}

      {!loading && message && (
        <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-red-600">
          {message}
        </div>
      )}

      {!loading && !message && (
        <>
          <Jobmap userCoords={userCoords} jobs={jobs} />
          <div className="grid gap-4 md:grid-cols-2">
            {jobs.length ? (
              jobs.map((job) => (
                <div key={job._id} className="rounded-2xl border bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <h3 className="text-xl font-bold">{job.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{job.company}</p>
                  <p className="mt-3 text-sm leading-6">{job.description}</p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                No nearby jobs found.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Nearbyjob;