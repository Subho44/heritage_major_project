import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-indigo-600 via-slate-900 to-slate-800 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-2">
        <div>
          <p className="mb-3 inline-block rounded-full bg-white/10 px-4 py-2 text-sm">
            MERN Stack + Cloud Ready Major Project
          </p>
          <h1 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">
            Build Your Future with an AI Based Smart Job Portal
          </h1>
          <p className="mb-8 text-slate-200">
            Professional UI, OTP login, role-based access, resume upload, job applications, analytics,
            notifications and beginner-friendly clean code.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/register" className="rounded-xl bg-white px-5 py-3 font-semibold text-slate-900">
              Get Started
            </Link>
            <Link to="/jobs" className="rounded-xl border border-white px-5 py-3 font-semibold">
              Browse Jobs
            </Link>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {['Admin Analytics', 'Recruiter Job Posting', 'Jobseeker Tracking', 'Dark Mode UI'].map((item) => (
            <div key={item} className="rounded-2xl bg-white/10 p-6 shadow-lg backdrop-blur">
              <h3 className="text-lg font-semibold">{item}</h3>
              <p className="mt-2 text-sm text-slate-200">Simple logic and industry-style design for students.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
