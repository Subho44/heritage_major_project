import { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const Card = ({ title, value }) => (
  <div className="rounded-2xl border bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
    <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
    <h3 className="mt-2 text-3xl font-bold dark:text-white">{value}</h3>
  </div>
);

const DashboardPage = () => {
  const { user, refreshProfile } = useAuth();
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [resume, setResume] = useState(null);
  const [profile, setProfile] = useState({ name: '', phone: '', location: '', skills: '', bio: '', companyName: '' });
  const [jobForm, setJobForm] = useState({ title: '', company: '', location: '', jobType: 'Full Time', experience: '', salary: '', skills: '', description: '' });
  const [message, setMessage] = useState('');

  const fetchAll = async () => {
    try {
      if (user?.role === 'admin') {
        const { data } = await api.get('/admin/stats');
        setStats(data);
      }
      if (user?.role === 'recruiter') {
        const [jobsRes, appRes] = await Promise.all([
          api.get('/jobs/my-jobs'),
          api.get('/applications/recruiter/list'),
        ]);
        setJobs(jobsRes.data);
        setApplications(appRes.data);
      }
      if (user?.role === 'jobseeker') {
        const [appRes, resumeRes] = await Promise.all([
          api.get('/applications/my/list'),
          api.get('/users/resume'),
        ]);
        setApplications(appRes.data);
        setResume(resumeRes.data);
      }
      const notificationRes = await api.get('/notifications');
      setNotifications(notificationRes.data);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to load dashboard');
    }
  };

  useEffect(() => {
    fetchAll();
  }, [user]);

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/users/profile', profile);
      setMessage(data.message);
      refreshProfile();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Profile update failed');
    }
  };

  const uploadResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const { data } = await api.post('/users/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResume(data.resume);
      setMessage(data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Resume upload failed');
    }
  };

  const createJob = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/jobs', jobForm);
      setMessage(data.message);
      setJobForm({ title: '', company: '', location: '', jobType: 'Full Time', experience: '', salary: '', skills: '', description: '' });
      fetchAll();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Job create failed');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/applications/${id}/status`, { status });
      fetchAll();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Status update failed');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Welcome, {user?.name}</h1>
          <p className="text-slate-600 dark:text-slate-300">Role: {user?.role}</p>
        </div>
      </div>
      {message && <p className="mb-4 rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-600 dark:bg-indigo-950/40">{message}</p>}

      {user?.role === 'admin' && stats && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card title="Total Users" value={stats.users} />
            <Card title="Total Jobs" value={stats.jobs} />
            <Card title="Applications" value={stats.applications} />
            <Card title="Notifications" value={stats.notifications} />
          </div>
          <div className="mt-6 rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 text-xl font-semibold dark:text-white">Role Analytics</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {stats.roleStats.map((item) => (
                <Card key={item._id} title={item._id} value={item.total} />
              ))}
            </div>
          </div>
        </>
      )}

      {user?.role === 'recruiter' && (
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 text-xl font-semibold dark:text-white">Post New Job</h2>
            <form onSubmit={createJob} className="grid gap-3">
              {[
                ['title', 'Job Title'],
                ['company', 'Company'],
                ['location', 'Location'],
                ['experience', 'Experience'],
                ['salary', 'Salary'],
                ['skills', 'Skills comma separated'],
              ].map(([key, label]) => (
                <input key={key} value={jobForm[key]} className="rounded-xl border p-3 dark:bg-slate-950" placeholder={label} onChange={(e) => setJobForm({ ...jobForm, [key]: e.target.value })} />
              ))}
              <select value={jobForm.jobType} className="rounded-xl border p-3 dark:bg-slate-950" onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}>
                <option>Full Time</option>
                <option>Part Time</option>
                <option>Internship</option>
              </select>
              <textarea value={jobForm.description} className="rounded-xl border p-3 dark:bg-slate-950" rows="4" placeholder="Job Description" onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })} />
              <button className="rounded-xl bg-slate-900 p-3 text-white dark:bg-indigo-600">Post Job</button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-4 text-xl font-semibold dark:text-white">My Jobs</h2>
              <div className="space-y-3">
                {jobs.map((job) => (
                  <div key={job._id} className="rounded-xl border p-4 dark:border-slate-700">
                    <h3 className="font-semibold dark:text-white">{job.title}</h3>
                    <p className="text-sm text-slate-500">{job.company} • {job.location}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-4 text-xl font-semibold dark:text-white">Applications</h2>
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app._id} className="rounded-xl border p-4 dark:border-slate-700">
                    <h3 className="font-semibold dark:text-white">{app.job?.title}</h3>
                    <p className="text-sm text-slate-500">{app.jobSeeker?.name} • {app.jobSeeker?.email}</p>
                    <p className="my-2 text-sm">Status: <span className="font-semibold">{app.status}</span></p>
                    <select className="rounded-lg border p-2 dark:bg-slate-950" value={app.status} onChange={(e) => updateStatus(app._id, e.target.value)}>
                      {['applied', 'reviewing', 'shortlisted', 'rejected', 'hired'].map((status) => <option key={status}>{status}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {user?.role === 'jobseeker' && (
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 text-xl font-semibold dark:text-white">Profile Management</h2>
            <form onSubmit={updateProfile} className="grid gap-3">
              {[
                ['name', 'Full Name'],
                ['phone', 'Phone'],
                ['location', 'Location'],
                ['skills', 'Skills comma separated'],
                ['bio', 'Short Bio'],
              ].map(([key, label]) => (
                <input key={key} className="rounded-xl border p-3 dark:bg-slate-950" placeholder={label} onChange={(e) => setProfile({ ...profile, [key]: e.target.value })} />
              ))}
              <button className="rounded-xl bg-slate-900 p-3 text-white dark:bg-indigo-600">Save Profile</button>
            </form>

            <div className="mt-6">
              <label className="mb-2 block font-semibold dark:text-white">Upload Resume (PDF)</label>
              <input type="file" accept=".pdf" onChange={uploadResume} className="w-full rounded-xl border p-3 dark:bg-slate-950" />
              {resume && <a href={`http://localhost:5000${resume.fileUrl}`} target="_blank" className="mt-3 inline-block text-indigo-600">View Uploaded Resume</a>}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-4 text-xl font-semibold dark:text-white">My Applications</h2>
              <div className="space-y-3">
                {applications.map((app) => (
                  <div key={app._id} className="rounded-xl border p-4 dark:border-slate-700">
                    <h3 className="font-semibold dark:text-white">{app.job?.title}</h3>
                    <p className="text-sm text-slate-500">{app.job?.company} • {app.job?.location}</p>
                    <p className="mt-2 text-sm">Status: <span className="font-semibold">{app.status}</span></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-xl font-semibold dark:text-white">Notifications</h2>
        <div className="space-y-3">
          {notifications.map((item) => (
            <div key={item._id} className="rounded-xl border p-4 dark:border-slate-700">
              <h3 className="font-semibold dark:text-white">{item.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{item.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
