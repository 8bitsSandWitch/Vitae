import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import "../CSS/upload.css";

const EditJobModal = ({ open, onClose, job, onSave }) => {
  const [title, setTitle] = useState(job.title);
  const [description, setDescription] = useState(job.description);
  const [keywords, setKeywords] = useState(job.keywords.join(", "));
  const [enterpriseName, setEnterpriseName] = useState(job.enterprise_name);
  const [enterpriseEmail, setEnterpriseEmail] = useState(job.enterprise_email);
  const [location, setLocation] = useState(job.location);
  const [dateExpire, setDateExpire] = useState(job.date_expire);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedJob = {
      ...job,
      title,
      description,
      keywords: keywords.split(",").map((keyword) => keyword.trim()),
      enterprise_name: enterpriseName,
      enterprise_email: enterpriseEmail,
      location,
      date_expire: dateExpire,
    };
    onSave(updatedJob);
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-title" aria-describedby="modal-description">
      <Box sx={modalStyle}>
        <div className="up-popup_container">
          <div className="up-dropHeader">
            <h2>Edit Job</h2>
            <button className="btn btn-danger" onClick={onClose}>
              Close
            </button>
          </div>
          <div className="file_n_drop">
            <div className="up-dropzone-container">
              <form className="up_form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="title">Job Title</label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="keywords">Keywords (comma separated)</label>
                  <textarea
                    id="keywords"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    required
                  ></textarea>
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
                <button type="submit">Save Changes</button>
              </form>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  width: "100%",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "rgba(0, 0, 0, .5)",
  boxShadow: 24,
  p: 4,
};

export default EditJobModal;
