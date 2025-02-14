import React, { useEffect, useState } from "react";
import JobCard from "./JobCard";

const JobList = ({ onApply }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/jobApi/", {
          credentials: "include", // Include credentials in the request
        });
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        } else {
          console.error("Failed to fetch jobs:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <p>Loading jobs...</p>;
  }

  return (
    <div className="job-list">
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <JobCard
            key={job.id}
            job={{
              ...job,
              keywords: Array.isArray(job.keywords) ? job.keywords : job.keywords.split(","),
            }}
            showActions={false} // Do not show delete and edit actions on the dashboard
            onApply={onApply}
          />
        ))
      ) : (
        <p>No job offers available.</p>
      )}
    </div>
  );
};

export default JobList;
