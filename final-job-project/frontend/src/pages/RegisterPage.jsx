import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'jobseeker' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', form);
      setMessage(data.message);
      setTimeout(() => navigate('/login'), 1200);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="mb-6 text-3xl font-bold dark:text-white">Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full rounded-xl border p-3 dark:bg-slate-950" placeholder="Full Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="w-full rounded-xl border p-3 dark:bg-slate-950" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input type="password" className="w-full rounded-xl border p-3 dark:bg-slate-950" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <select className="w-full rounded-xl border p-3 dark:bg-slate-950" onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="jobseeker">Job Seeker</option>
            <option value="recruiter">Recruiter</option>
            <option value="admin">Admin</option>
          </select>
          <button className="w-full rounded-xl bg-slate-900 p-3 text-white dark:bg-indigo-600">Register</button>
        </form>
        {message && <p className="mt-4 text-sm text-indigo-600">{message}</p>}
        <p className="mt-4 text-sm dark:text-slate-300">Already have account? <Link className="text-indigo-600" to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default RegisterPage;
