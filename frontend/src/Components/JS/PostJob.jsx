import React, { useState } from "react";
import "../CSS/postJob.css";

const PostJob = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [keywords, setKeywords] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const jobData = {
      title: jobTitle,
      description: jobDescription,
      keywords: keywords.split(",").map((keyword) => keyword.trim()),
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
    <div className="post-job-container main-content">
      <h2>Post a Job</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Post Job</button>
      </form>
    </div>
  );
};

export default PostJob;
