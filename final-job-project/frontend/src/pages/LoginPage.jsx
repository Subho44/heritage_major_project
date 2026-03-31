import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'jobseeker',
    otp: '',
  });
  const [message, setMessage] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const { saveAuth } = useAuth();
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setDevOtp('');

    try {
      const payload = {
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
      };

      const { data } = await api.post('/auth/login', payload);

      setMessage(data.message);
      setDevOtp(data.devOtp || '');
      setStep(2);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const payload = {
        email: form.email.trim().toLowerCase(),
        role: form.role,
        otp: form.otp.trim(),
      };

      const { data } = await api.post('/auth/verify-otp', payload);
      saveAuth(data);
      navigate('/dashboard');
    } catch (error) {
      setMessage(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    setMessage('');

    try {
      const payload = {
        email: form.email.trim().toLowerCase(),
        role: form.role,
      };

      const { data } = await api.post('/auth/resend-otp', payload);
      setMessage(data.message);
      setDevOtp(data.devOtp || '');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Resend OTP failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="mb-6 text-3xl font-bold dark:text-white">Login With Email OTP</h1>

        {step === 1 ? (
          <form onSubmit={sendOtp} className="space-y-4">
            <input
              className="w-full rounded-xl border p-3 dark:bg-slate-950"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              type="password"
              className="w-full rounded-xl border p-3 dark:bg-slate-950"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <select
              className="w-full rounded-xl border p-3 dark:bg-slate-950"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="jobseeker">Job Seeker</option>
              <option value="recruiter">Recruiter</option>
              <option value="admin">Admin</option>
            </select>

            <button
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 p-3 text-white dark:bg-indigo-600"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="space-y-4">
            <input
              className="w-full rounded-xl border p-3 dark:bg-slate-950"
              placeholder="Email"
              value={form.email}
              readOnly
            />

            <input
              className="w-full rounded-xl border p-3 dark:bg-slate-950"
              placeholder="Enter OTP"
              value={form.otp}
              onChange={(e) => setForm({ ...form, otp: e.target.value })}
            />

            <button
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 p-3 text-white"
            >
              {loading ? 'Verifying...' : 'Verify OTP & Login'}
            </button>

            <button
              type="button"
              onClick={resendOtp}
              disabled={loading}
              className="w-full rounded-xl border border-indigo-600 p-3 text-indigo-600"
            >
              Resend OTP
            </button>
          </form>
        )}

        {message && <p className="mt-4 text-sm text-indigo-600">{message}</p>}

        {devOtp && (
          <p className="mt-2 text-sm text-emerald-600">
            Test OTP: <strong>{devOtp}</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;