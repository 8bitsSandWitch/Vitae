import React, { useEffect, useState } from "react";
import "../CSS/jobList.css";

const JobList = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/jobs/")
      .then((response) => response.json())
      .then((data) => {
        setJobs(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <div className="job-list-container main-content">
      <h2>Job Offers</h2>
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <div key={job.id} className="job-card">
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <p><strong>Keywords:</strong> {job.keywords.join(", ")}</p>
            <button>Apply</button>
          </div>
        ))
      ) : (
        <p>No job offers available.</p>
      )}
    </div>
  );
};

export default JobList;
