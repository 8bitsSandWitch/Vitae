import React, { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import "../CSS/upload.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import JobCard from "./JobCard";
import EditJobModal from "./EditJobModal";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const PostOffer = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [enterpriseName, setEnterpriseName] = useState("");
  const [enterpriseEmail, setEnterpriseEmail] = useState("");
  const [location, setLocation] = useState("");
  const [dateExpire, setDateExpire] = useState("");
  const [postedJobs, setPostedJobs] = useState([]);
  const [snackbar, setSnackbar] = useState({open: false, message: "", severity: "success",});
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const getCSRFToken = () => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1];
    return cookieValue;
  };

  useEffect(() => {
    // Check if the user is authenticated
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));

    const csrfToken = getCSRFToken();

    // Fetch posted jobs by the current user
    fetch("http://localhost:8000/api/user-jobs/", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
    })
      .then((response) => {
        if (response.status === 403) {
          navigate("/login");
          return;
        }
        return response.json();
      })
      .then((data) => {
        setPostedJobs(data);
      })
      .catch((error) => {
        console.error("Error fetching posted jobs:", error);
        setSnackbar({
          open: true,
          message: "Loading failed...",
          severity: "error",
        });
      });
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      title,
      description,
      keywords,
      enterprise_name: enterpriseName,
      enterprise_email: enterpriseEmail,
      location,
      date_expire: dateExpire,
    };

    fetch("http://localhost:8000/api/jobApi/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setSnackbar({
            open: true,
            message: data.message,
            severity: "success",
          });
          setOpenModal(false);
          // Update the posted jobs list
          setPostedJobs((prevJobs) => [
            ...prevJobs,
            {
              id: data.id, // Use the ID from the backend response
              title,
              description,
              keywords: keywords.split(","),
              enterprise_name: enterpriseName,
              enterprise_email: enterpriseEmail,
              location,
              date_expire: dateExpire,
            },
          ]);
        } else {
          setSnackbar({
            open: true,
            message: "An error occurred during job posting.",
            severity: "error",
          });
        }
      })
      .catch((error) => {
        console.error("Error posting job:", error);
        setSnackbar({
          open: true,
          message: "An error occurred during job posting.",
          severity: "error",
        });
      });
  };

  const handleDelete = (jobId) => {
    const csrfToken = getCSRFToken();
    fetch(`http://localhost:8000/api/delete-job/${jobId}/`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "X-CSRFToken": csrfToken,
      },
    })
      .then((response) => {
        if (response.ok) {
          setPostedJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
          setSnackbar({
            open: true,
            message: "Job deleted successfully.",
            severity: "success",
          });
        } else {
          setSnackbar({
            open: true,
            message: "An error occurred during job deletion.",
            severity: "error",
          });
        }
      })
      .catch((error) => {
        console.error("Error deleting job:", error);
        setSnackbar({
          open: true,
          message: "An error occurred during job deletion.",
          severity: "error",
        });
      });
  };

  const handleEdit = (job) => {
    setSelectedJob(job);
    setOpenEditModal(true);
  };


  const handleSave = (updatedJob) => {
    const csrfToken = getCSRFToken();
    fetch(`http://localhost:8000/api/jobApi/${updatedJob.id}/`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(updatedJob),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setSnackbar({
            open: true,
            message: data.message,
            severity: "success",
          });
          setOpenEditModal(false);
          // Update the posted jobs list
          setPostedJobs((prevJobs) =>
            prevJobs.map((job) => (job.id === updatedJob.id ? updatedJob : job))
          );
        } else {
          setSnackbar({
            open: true,
            message: "An error occurred during job update.",
            severity: "error",
          });
        }
      })
      .catch((error) => {
        console.error("Error updating job:", error);
        setSnackbar({
          open: true,
          message: "An error occurred during job update.",
          severity: "error",
        });
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  return (
    <>
      <div className="up-container main-content">
        <div className="up-header">
          <h3>Your Posted Jobs</h3>
          <button className="btn btn-primary" onClick={handleOpenModal}>
            Add Job
          </button>
        </div>

        <div className="uploaded-cvs">
          {postedJobs.length > 0 ? (
            postedJobs.map((job, index) => (
              <JobCard key={index} job={job} onDelete={handleDelete} onEdit={handleEdit} showActions={true} />
            ))
          ) : (
            <p>No jobs posted yet.</p>
          )}
        </div>
      </div>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="up-popup_container">
          <div className="up-dropHeader">
            <h2>Post a Job</h2>
            <button className="btn btn-danger" onClick={handleCloseModal}>
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
                <button type="submit">Post Job</button>
              </form>
            </div>
          </div>
        </div>
      </Modal>

      {selectedJob && (
        <EditJobModal
          open={openEditModal}
          onClose={handleCloseEditModal}
          job={selectedJob}
          onSave={handleSave}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default PostOffer;
