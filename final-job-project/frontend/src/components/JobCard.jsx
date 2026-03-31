import React from 'react';

const JobCard = ({ job, onApply, canApply }) => {
  if (!job) return null;

  const locationText =
    job?.location?.address ||
    job?.location?.city ||
    job?.location?.state ||
    job?.location?.country ||
    'Location not available';

  const skills =
    Array.isArray(job?.skillsRequired) && job.skillsRequired.length > 0
      ? job.skillsRequired
      : [];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
        {job?.title || 'Job Title'}
      </h3>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {job?.company || 'Company Name'}
      </p>

      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {job?.description || 'No description available.'}
      </p>

      <div className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
        <p>
          <span className="font-semibold">Location:</span> {locationText}
        </p>
        <p>
          <span className="font-semibold">Salary:</span>{' '}
          {job?.salary || 'Not disclosed'}
        </p>
        <p>
          <span className="font-semibold">Experience:</span>{' '}
          {job?.experienceLevel || 'Not specified'}
        </p>
        <p>
          <span className="font-semibold">Employment Type:</span>{' '}
          {job?.employmentType || 'Not specified'}
        </p>
        <p>
          <span className="font-semibold">Work Mode:</span>{' '}
          {job?.workMode || 'Not specified'}
        </p>
        <p>
          <span className="font-semibold">Status:</span>{' '}
          {job?.status || 'open'}
        </p>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
          Skills Required:
        </p>

        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No skills listed
          </p>
        )}
      </div>

      {canApply && (
        <button
          onClick={() => onApply(job._id)}
          className="mt-5 w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          Apply Now
        </button>
      )}
    </div>
  );
};

export default JobCard;