import React, { useState } from "react";
import "../CSS/filterCV.css";

const FilterCV = () => {
  const [keywords, setKeywords] = useState("");
  const [filteredCVs, setFilteredCVs] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8000/api/filter-cv/?keywords=${keywords}`)
      .then((response) => response.json())
      .then((data) => {
        setFilteredCVs(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="filter-cv-container main-content">
      <h2>Filter CVs</h2>
      <form className="filter-form" onSubmit={handleSubmit}>
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
        <button type="submit">Filter</button>
      </form>
      <div className="filtered-cvs">
        {filteredCVs.length > 0 ? (
          filteredCVs.map((cv) => (
            <div key={cv.id} className="cv-card">
              <h3>{cv.name}</h3>
              <p><strong>Email:</strong> {cv.email}</p>
              <p><strong>Keywords:</strong> {cv.keywords.join(", ")}</p>
              <a href={cv.cv_url} target="_blank" rel="noopener noreferrer">View CV</a>
            </div>
          ))
        ) : (
          <p>No CVs found.</p>
        )}
      </div>
    </div>
  );
};

export default FilterCV;
