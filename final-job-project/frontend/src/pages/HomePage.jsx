import Hero from '../components/Hero';

const HomePage = () => {
  return (
    <div>
      <Hero />
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            'Email OTP login for Admin, Recruiter and Job Seeker',
            'Resume upload, applications, notifications and tracking',
            'Clean beginner-friendly code with professional design',
          ].map((text) => (
            <div key={text} className="rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Project Feature</h3>
              <p className="mt-3 text-slate-600 dark:text-slate-300">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
