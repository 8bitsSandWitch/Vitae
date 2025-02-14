import React, { useState } from "react";
import "../CSS/postJob.css";

const PostJob = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [enterpriseName, setEnterpriseName] = useState("");
  const [enterpriseEmail, setEnterpriseEmail] = useState("");
  const [location, setLocation] = useState("");
  const [dateExpire, setDateExpire] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const jobData = {
      title: jobTitle,
      description: jobDescription,
      keywords: keywords.split(",").map((keyword) => keyword.trim()),
      enterprise_name: enterpriseName,
      enterprise_email: enterpriseEmail,
      location: location,
      date_expire: dateExpire,
    };

    fetch("http://localhost:8000/api/post-job/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    // main-content
    <div className="post-job-container">
      <h2>Post a Job</h2>
      <form className="postjob-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="jobTitle">Job Title</label>
          <input
            type="text"
            id="jobTitle"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="jobDescription">Job Description</label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="keywords">Keywords (comma separated)</label>
          <input
            type="text"
            id="keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="enterpriseName">Enterprise Name</label>
          <input
            type="text"
            id="enterpriseName"
            value={enterpriseName}
            onChange={(e) => setEnterpriseName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="enterpriseEmail">Enterprise Email</label>
          <input
            type="email"
            id="enterpriseEmail"
            value={enterpriseEmail}
            onChange={(e) => setEnterpriseEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="dateExpire">Expiration Date</label>
          <input
            type="date"
            id="dateExpire"
            value={dateExpire}
            onChange={(e) => setDateExpire(e.target.value)}
            required
          />
        </div>
        <button type="submit">Post Job</button>
      </form>
    </div>
  );
};

export default PostJob;
