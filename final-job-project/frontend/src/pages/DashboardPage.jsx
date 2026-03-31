import { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const Card = ({ title, value }) => (
  <div className="rounded-2xl border bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
    <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
    <h3 className="mt-2 text-3xl font-bold dark:text-white">{value}</h3>
  </div>
);

const getLocationText = (location) => {
  if (!location) return 'Location not available';
  if (typeof location === 'string') return location;

  return (
    location.address ||
    location.city ||
    location.state ||
    location.country ||
    'Location not available'
  );
};

const DashboardPage = () => {
  const { user, refreshProfile } = useAuth();

  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [resume, setResume] = useState(null);

  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    location: '',
    skills: '',
    bio: '',
    companyName: '',
  });

  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    description: '',
    skillsRequired: '',
    salary: '',
    experienceLevel: '',
    employmentType: 'Full Time',
    workMode: 'onsite',
    location: {
      coordinates: ['', ''],
      city: '',
      state: '',
      country: '',
      address: '',
    },
  });

  const [message, setMessage] = useState('');

  const fetchAll = async () => {
    try {
      setMessage('');

      if (user?.role === 'admin') {
        const { data } = await api.get('/admin/stats');
        setStats(data);
      }

      if (user?.role === 'recruiter') {
        const [jobsRes, appRes] = await Promise.all([
          api.get('/jobs/my-jobs'),
          api.get('/applications/recruiter/list'),
        ]);
        setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : []);
        setApplications(Array.isArray(appRes.data) ? appRes.data : []);
      }

      if (user?.role === 'jobseeker') {
        const [appRes, resumeRes] = await Promise.all([
          api.get('/applications/my/list'),
          api.get('/users/resume'),
        ]);
        setApplications(Array.isArray(appRes.data) ? appRes.data : []);
        setResume(resumeRes.data || null);
      }

      const notificationRes = await api.get('/notifications');
      setNotifications(Array.isArray(notificationRes.data) ? notificationRes.data : []);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      setMessage(error.response?.data?.message || 'Failed to load dashboard');
    }
  };

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        phone: user.phone || '',
        location: user.location || '',
        skills: Array.isArray(user.skills) ? user.skills.join(', ') : user.skills || '',
        bio: user.bio || '',
        companyName: user.companyName || '',
      });
      fetchAll();
    }
  }, [user]);

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...profile,
        skills:
          typeof profile.skills === 'string'
            ? profile.skills.split(',').map((item) => item.trim()).filter(Boolean)
            : profile.skills,
      };

      const { data } = await api.put('/users/profile', payload);
      setMessage(data.message);
      if (typeof refreshProfile === 'function') {
        refreshProfile();
      }
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
      const payload = {
        title: jobForm.title,
        company: jobForm.company,
        description: jobForm.description,
        skillsRequired: jobForm.skillsRequired,
        salary: jobForm.salary,
        experienceLevel: jobForm.experienceLevel,
        employmentType: jobForm.employmentType,
        workMode: jobForm.workMode,
        location: {
          coordinates: [
            Number(jobForm.location.coordinates[0]),
            Number(jobForm.location.coordinates[1]),
          ],
          city: jobForm.location.city,
          state: jobForm.location.state,
          country: jobForm.location.country,
          address: jobForm.location.address,
        },
      };

      const { data } = await api.post('/jobs', payload);
      setMessage(data.message);

      setJobForm({
        title: '',
        company: '',
        description: '',
        skillsRequired: '',
        salary: '',
        experienceLevel: '',
        employmentType: 'Full Time',
        workMode: 'onsite',
        location: {
          coordinates: ['', ''],
          city: '',
          state: '',
          country: '',
          address: '',
        },
      });

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
          <h1 className="text-3xl font-bold dark:text-white">
            Welcome, {user?.name || 'User'}
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Role: {user?.role || 'N/A'}
          </p>
        </div>
      </div>

      {message && (
        <p className="mb-4 rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-600 dark:bg-indigo-950/40">
          {message}
        </p>
      )}

      {user?.role === 'admin' && stats && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card title="Total Users" value={stats.users || 0} />
            <Card title="Total Jobs" value={stats.jobs || 0} />
            <Card title="Applications" value={stats.applications || 0} />
            <Card title="Notifications" value={stats.notifications || 0} />
          </div>

          <div className="mt-6 rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 text-xl font-semibold dark:text-white">Role Analytics</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {Array.isArray(stats.roleStats) &&
                stats.roleStats.map((item) => (
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
              <input
                value={jobForm.title}
                className="rounded-xl border p-3 dark:bg-slate-950"
                placeholder="Job Title"
                onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
              />

              <input
                value={jobForm.company}
                className="rounded-xl border p-3 dark:bg-slate-950"
                placeholder="Company"
                onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
              />

              <input
                value={jobForm.experienceLevel}
                className="rounded-xl border p-3 dark:bg-slate-950"
                placeholder="Experience"
                onChange={(e) =>
                  setJobForm({ ...jobForm, experienceLevel: e.target.value })
                }
              />

              <input
                value={jobForm.salary}
                className="rounded-xl border p-3 dark:bg-slate-950"
                placeholder="Salary"
                onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
              />

              <input
                value={jobForm.skillsRequired}
                className="rounded-xl border p-3 dark:bg-slate-950"
                placeholder="Skills comma separated"
                onChange={(e) =>
                  setJobForm({ ...jobForm, skillsRequired: e.target.value })
                }
              />

              <select
                value={jobForm.employmentType}
                className="rounded-xl border p-3 dark:bg-slate-950"
                onChange={(e) =>
                  setJobForm({ ...jobForm, employmentType: e.target.value })
                }
              >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Internship">Internship</option>
              </select>

              <select
                value={jobForm.workMode}
                className="rounded-xl border p-3 dark:bg-slate-950"
                onChange={(e) =>
                  setJobForm({ ...jobForm, workMode: e.target.value })
                }
              >
                <option value="onsite">Onsite</option>
                <option value="hybrid">Hybrid</option>
                <option value="remote">Remote</option>
              </select>

              <input
                value={jobForm.location.address}
                className="rounded-xl border p-3 dark:bg-slate-950"
                placeholder="Address"
                onChange={(e) =>
                  setJobForm({
                    ...jobForm,
                    location: { ...jobForm.location, address: e.target.value },
                  })
                }
              />

              <input
                value={jobForm.location.city}
                className="rounded-xl border p-3 dark:bg-slate-950"
                placeholder="City"
                onChange={(e) =>
                  setJobForm({
                    ...jobForm,
                    location: { ...jobForm.location, city: e.target.value },
                  })
                }
              />

              <input
                value={jobForm.location.state}
                className="rounded-xl border p-3 dark:bg-slate-950"
                placeholder="State"
                onChange={(e) =>
                  setJobForm({
                    ...jobForm,
                    location: { ...jobForm.location, state: e.target.value },
                  })
                }
              />

              <input
                value={jobForm.location.country}
                className="rounded-xl border p-3 dark:bg-slate-950"
                placeholder="Country"
                onChange={(e) =>
                  setJobForm({
                    ...jobForm,
                    location: { ...jobForm.location, country: e.target.value },
                  })
                }
              />

              <input
                value={jobForm.location.coordinates[0]}
                className="rounded-xl border p-3 dark:bg-slate-950"
                placeholder="Longitude"
                onChange={(e) =>
                  setJobForm({
                    ...jobForm,
                    location: {
                      ...jobForm.location,
                      coordinates: [e.target.value, jobForm.location.coordinates[1]],
                    },
                  })
                }
              />

              <input
                value={jobForm.location.coordinates[1]}
                className="rounded-xl border p-3 dark:bg-slate-950"
                placeholder="Latitude"
                onChange={(e) =>
                  setJobForm({
                    ...jobForm,
                    location: {
                      ...jobForm.location,
                      coordinates: [jobForm.location.coordinates[0], e.target.value],
                    },
                  })
                }
              />

              <textarea
                value={jobForm.description}
                className="rounded-xl border p-3 dark:bg-slate-950"
                rows="4"
                placeholder="Job Description"
                onChange={(e) =>
                  setJobForm({ ...jobForm, description: e.target.value })
                }
              />

              <button className="rounded-xl bg-slate-900 p-3 text-white dark:bg-indigo-600">
                Post Job
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-4 text-xl font-semibold dark:text-white">My Jobs</h2>
              <div className="space-y-3">
                {jobs.length > 0 ? (
                  jobs.map((job) => (
                    <div key={job._id} className="rounded-xl border p-4 dark:border-slate-700">
                      <h3 className="font-semibold dark:text-white">{job.title}</h3>
                      <p className="text-sm text-slate-500">
                        {job.company} • {getLocationText(job.location)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No jobs posted yet.</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-4 text-xl font-semibold dark:text-white">Applications</h2>
              <div className="space-y-4">
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <div key={app._id} className="rounded-xl border p-4 dark:border-slate-700">
                      <h3 className="font-semibold dark:text-white">{app.job?.title}</h3>
                      <p className="text-sm text-slate-500">
                        {app.jobSeeker?.name} • {app.jobSeeker?.email}
                      </p>
                      <p className="my-2 text-sm">
                        Status: <span className="font-semibold">{app.status}</span>
                      </p>
                      <select
                        className="rounded-lg border p-2 dark:bg-slate-950"
                        value={app.status}
                        onChange={(e) => updateStatus(app._id, e.target.value)}
                      >
                        {['applied', 'reviewing', 'shortlisted', 'rejected', 'hired'].map(
                          (status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No applications available.</p>
                )}
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
              <input
                value={profile.name}
                className="rounded-xl border p-3 dark:bg-slate-950"
                placeholder="Full Name"
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
              <input
                value={profile.phone}
                className="rounded-xl border p-3 dark:bg-slate-950"
                placeholder="Phone"
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
              <input
                value={profile.location}
                className="rounded-xl border p-3 dark:bg-slate-950"
                placeholder="Location"
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              />
              <input
                value={profile.skills}
                className="rounded-xl border p-3 dark:bg-slate-950"
                placeholder="Skills comma separated"
                onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
              />
              <input
                value={profile.bio}
                className="rounded-xl border p-3 dark:bg-slate-950"
                placeholder="Short Bio"
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              />

              <button className="rounded-xl bg-slate-900 p-3 text-white dark:bg-indigo-600">
                Save Profile
              </button>
            </form>

            <div className="mt-6">
              <label className="mb-2 block font-semibold dark:text-white">
                Upload Resume (PDF)
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={uploadResume}
                className="w-full rounded-xl border p-3 dark:bg-slate-950"
              />
              {resume?.fileUrl && (
                <a
                  href={`http://localhost:5000${resume.fileUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-indigo-600"
                >
                  View Uploaded Resume
                </a>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-4 text-xl font-semibold dark:text-white">My Applications</h2>
              <div className="space-y-3">
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <div key={app._id} className="rounded-xl border p-4 dark:border-slate-700">
                      <h3 className="font-semibold dark:text-white">{app.job?.title}</h3>
                      <p className="text-sm text-slate-500">
                        {app.job?.company} • {getLocationText(app.job?.location)}
                      </p>
                      <p className="mt-2 text-sm">
                        Status: <span className="font-semibold">{app.status}</span>
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No applications found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-xl font-semibold dark:text-white">Notifications</h2>
        <div className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((item) => (
              <div key={item._id} className="rounded-xl border p-4 dark:border-slate-700">
                <h3 className="font-semibold dark:text-white">{item.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {item.message}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No notifications found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;