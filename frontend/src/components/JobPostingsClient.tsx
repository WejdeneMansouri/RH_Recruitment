"use client";

import { useEffect, useState } from 'react';

interface JobPosting {
  id: number;
  title: string;
  description: string;
  requirements: string;
  status: string;
}

export default function JobPostingsClient() {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);

  useEffect(() => {
    fetch('http://localhost:8082/api/job-postings')
      .then((response) => response.json())
      .then((data) => setJobPostings(data))
      .catch((error) => console.error('Error fetching job postings:', error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Recruitment Management</h1>
        <div className="grid gap-6">
          {jobPostings.map((job) => (
            <div key={job.id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
              <p className="text-gray-600 mb-4">{job.description}</p>
              <p className="text-sm text-gray-500">Requirements: {job.requirements}</p>
              <p className="text-sm text-gray-500">Status: {job.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}