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
          const token = localStorage.getItem('token');

          const response = await axios.get(
            `http://localhost:5000/api/jobs/nearby?lat=${lat}&lng=${lng}`
          );

          console.log('Nearby jobs response:', response.data);

          setJobs(Array.isArray(response.data) ? response.data : response.data.jobs || []);
          setMessage('');
        } catch (error) {
          console.error('Nearby jobs fetch error:', error);
          console.error('Backend error response:', error.response?.data);

          if (error.response?.data?.message) {
            setMessage(error.response.data.message);
          } else {
            setMessage('Failed to load nearby jobs.');
          }
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setMessage('Unable to fetch your location. Please allow location access.');
        setLoading(false);
      }
    );
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Nearby Jobs</h2>
        <p className="text-slate-600 dark:text-slate-300">
          Find jobs near your current location.
        </p>
      </div>

      {loading && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow dark:border-slate-800 dark:bg-slate-900">
          Loading nearby jobs...
        </div>
      )}

      {!loading && message && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {message}
        </div>
      )}

      {!loading && !message && (
        <>
          <Jobmap userCoords={userCoords} jobs={jobs} />

          <div className="grid gap-4 md:grid-cols-2">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div
                  key={job._id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <h3 className="text-xl font-bold">{job.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{job.company}</p>
                  <p className="mt-2 text-sm">{job.description}</p>

                  <div className="mt-3 space-y-1 text-sm">
                    <p>
                      <span className="font-semibold">Salary:</span> {job.salary || 'Not disclosed'}
                    </p>
                    <p>
                      <span className="font-semibold">Experience:</span>{' '}
                      {job.experienceLevel || 'Not specified'}
                    </p>
                    <p>
                      <span className="font-semibold">Work Mode:</span>{' '}
                      {job.workMode || 'Not specified'}
                    </p>
                    <p>
                      <span className="font-semibold">Address:</span>{' '}
                      {job.location?.address || 'Location not available'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow dark:border-slate-800 dark:bg-slate-900">
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