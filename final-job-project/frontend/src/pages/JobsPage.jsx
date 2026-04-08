import { useEffect, useState } from 'react';
import api from '../api/api';
import JobCard from '../components/JobCard';
import { useAuth } from '../context/AuthContext';
import Chatboat from '../components/Chatboat';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    employmentType: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setMessage('');

      const { data } = await api.get('/jobs', {
        params: filters,
      });

      setJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch jobs error:', error);
      setMessage(error.response?.data?.message || 'Failed to load jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    try {
      const { data } = await api.post(`/applications/${jobId}`, {
        coverLetter: 'I am interested in this job.',
      });
      setMessage(data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Application failed');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 grid gap-4 rounded-2xl border bg-white p-5 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-4">
        <input
          className="rounded-xl border p-3 dark:bg-slate-950"
          placeholder="Search job"
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
        />
       
        <input
          className="rounded-xl border p-3 dark:bg-slate-950"
          placeholder="City"
          value={filters.city}
          onChange={(e) =>
            setFilters({ ...filters, city: e.target.value })
          }
        />

        <select
          className="rounded-xl border p-3 dark:bg-slate-950"
          value={filters.employmentType}
          onChange={(e) =>
            setFilters({ ...filters, employmentType: e.target.value })
          }
        >
          <option value="">All Type</option>
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
          <option value="Internship">Internship</option>
        </select>

        <button
          onClick={fetchJobs}
          className="rounded-xl bg-slate-900 p-3 text-white dark:bg-indigo-600"
        >
          Filter Jobs
        </button>
      </div>

      {message && <p className="mb-4 text-sm text-indigo-600">{message}</p>}

      {loading ? (
        <div className="rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          Loading jobs...
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onApply={handleApply}
              canApply={user?.role === 'jobseeker'}
            />
          ))}

          <div>
           <Chatboat/>
          </div>  
        </div>
        
      ) : (
        <div className="rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          No jobs found.
        </div>
      )}
    </div>
  );
};

export default JobsPage;