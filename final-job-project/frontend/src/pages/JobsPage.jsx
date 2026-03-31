import { useEffect, useState } from 'react';
import api from '../api/api';
import JobCard from '../components/JobCard';
import { useAuth } from '../context/AuthContext';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ search: '', location: '', jobType: '' });
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  const fetchJobs = async () => {
    const { data } = await api.get('/jobs', { params: filters });
    setJobs(data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    try {
      const { data } = await api.post(`/applications/${jobId}`, { coverLetter: 'I am interested in this job.' });
      setMessage(data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Application failed');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 grid gap-4 rounded-2xl border bg-white p-5 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-4">
        <input className="rounded-xl border p-3 dark:bg-slate-950" placeholder="Search job" onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        <input className="rounded-xl border p-3 dark:bg-slate-950" placeholder="Location" onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
        <select className="rounded-xl border p-3 dark:bg-slate-950" onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}>
          <option value="">All Type</option>
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
          <option value="Internship">Internship</option>
        </select>
        <button onClick={fetchJobs} className="rounded-xl bg-slate-900 p-3 text-white dark:bg-indigo-600">Filter Jobs</button>
      </div>
      {message && <p className="mb-4 text-sm text-indigo-600">{message}</p>}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} onApply={handleApply} canApply={user?.role === 'jobseeker'} />
        ))}
      </div>
    </div>
  );
};

export default JobsPage;
