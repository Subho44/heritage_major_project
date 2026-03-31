const JobCard = ({ job, onApply, canApply }) => {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{job.title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">{job.company}</p>
        </div>
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200">
          {job.jobType}
        </span>
      </div>
      <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">{job.location} • {job.experience}</p>
      <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">Salary: {job.salary}</p>
      <p className="mb-4 line-clamp-3 text-sm text-slate-700 dark:text-slate-300">{job.description}</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {job.skills?.map((skill) => (
          <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs dark:bg-slate-800">
            {skill}
          </span>
        ))}
      </div>
      {canApply && (
        <button onClick={() => onApply(job._id)} className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white dark:bg-indigo-600">
          Apply Now
        </button>
      )}
    </div>
  );
};

export default JobCard;
