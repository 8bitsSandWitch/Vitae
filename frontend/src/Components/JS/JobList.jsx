import React, { useEffect, useState } from "react";
import "../CSS/jobList.css";
import PostImg from '../IMG/picD.jpg'

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

  console.log(jobs)
  return (
    <>
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <div key={job.id} className="job-card">
            <h3>{job.title}</h3>
            <strong>{job.enterprise_name}</strong> 
            <img src={PostImg} alt="Post Image" width="100%" />
            <p>{job.description}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Keywords:</strong> {job.keywords.join(", ")}</p>
            <p><strong>Closed By:</strong> {new Date(job.date_expire).toLocaleDateString('fr-GB')}</p>
            <button>Apply</button>
          </div>
        ))
      ) : (
        <p>No job offers available.</p>
      )}
    </>
  );
};

export default JobList;
