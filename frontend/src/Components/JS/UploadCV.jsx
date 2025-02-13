import React, { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import "../CSS/upload.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import CVCard from "./CVCard";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const UploadCV = () => {
  const [files, setFiles] = useState([]);
  const [cvName, setCvName] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [uploadedCVs, setUploadedCVs] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if the user is authenticated
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));

    // Fetch uploaded CVs
    fetch("http://localhost:8000/api/uploaded-cvs/", {
      credentials: "include",
    })
      .then((response) => {
        if (response.status === 403) {
          navigate("/login");
          return;
        }
        return response.json();
      })
      .then((data) => {
        setUploadedCVs(data);
      })
      .catch((error) => {
        console.error("Error fetching uploaded CVs:", error);
        setSnackbar({
          open: true,
          message: "Loading failed...",
          severity: "error",
        });
      });
  }, [navigate]);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const getCSRFToken = () => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1];
    return cookieValue;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setSnackbar({
        open: true,
        message: "Please select a file to upload.",
        severity: "error",
      });
      return;
    }

    const formData = new FormData();
    formData.append("cv", files[0]);
    formData.append("name", cvName);
    formData.append("email", user.email);
    formData.append("description", description);
    formData.append("keywords", keywords);

    const csrfToken = getCSRFToken();

    fetch("http://localhost:8000/api/upload/", {
      method: "POST",
      credentials: "include",
      headers: {
        "X-CSRFToken": csrfToken,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "File uploaded successfully") {
          setSnackbar({
            open: true,
            message: "File uploaded successfully.",
            severity: "success",
          });
          setOpenModal(false);
          // Update the uploaded CVs list
          setUploadedCVs((prevCVs) => [
            ...prevCVs,
            {
              id: data.id, // Use the ID from the backend response
              name: cvName,
              email: user.email,
              description: description,
              keywords: keywords.split(","),
              cv_url: data.file_url,
            },
          ]);
        } else {
          setSnackbar({
            open: true,
            message: "An error occurred during file upload.",
            severity: "error",
          });
        }
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        setSnackbar({
          open: true,
          message: "An error occurred during file upload.",
          severity: "error",
        });
      });
  };

  const handleDelete = (cvId) => {
    const csrfToken = getCSRFToken();
    fetch(`http://localhost:8000/api/delete-cv/${cvId}/`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "X-CSRFToken": csrfToken,
      },
    })
      .then((response) => {
        if (response.ok) {
          setUploadedCVs((prevCVs) => prevCVs.filter((cv) => cv.id !== cvId));
          setSnackbar({
            open: true,
            message: "CV deleted successfully.",
            severity: "success",
          });
        } else {
          setSnackbar({
            open: true,
            message: "An error occurred during CV deletion.",
            severity: "error",
          });
        }
      })
      .catch((error) => {
        console.error("Error deleting CV:", error);
        setSnackbar({
          open: true,
          message: "An error occurred during CV deletion.",
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

  return (
    <>
      <div className="up-container main-content">
        <div className="up-header">
          <h3>Your Uploaded CVs</h3>
          <button className="btn btn-primary" onClick={handleOpenModal}>
            Add CV
          </button>
        </div>

        <div className="uploaded-cvs">
          {uploadedCVs.length > 0 ? (
            uploadedCVs.map((cv, index) => (
              <CVCard key={index} cv={cv} onDelete={handleDelete} />
            ))
          ) : (
            <p>No CVs uploaded yet.</p>
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
            <h2>Upload your CV</h2>
            <button className="btn btn-danger" onClick={handleCloseModal}>
              Close
            </button>
          </div>

          <div className="file_n_drop">
            <div className="up-dropzone-container">
              <p>Drag and drop your CV here</p>
              <p>or</p>
              <p>Click to browse</p>
              <form className="up_form" onSubmit={handleSubmit}>
                <div className="">
                  <div className="up-dropzone">
                    <FontAwesomeIcon icon={faCloudUploadAlt} size="3x" />
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="application/pdf"
                      multiple
                    />
                  </div>
                  <button type="submit">Upload CV</button>
                </div>
                <div className="hidden">
                  <div className="form-group">
                    <label htmlFor="cvName">CV Name</label>
                    <input
                      type="text"
                      id="cvName"
                      value={cvName}
                      onChange={(e) => setCvName(e.target.value)}
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
                </div>
              </form>
            </div>

            <div className="up-fileContainer">
              <h5>File List</h5>
              <div className="file_template">
                {files.map((file, index) => (
                  <div key={index} className="file-item">
                    <span>{file.name}</span>
                    {uploadProgress[file.name] && (
                      <div className="progress">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: `${uploadProgress[file.name]}%` }}
                          aria-valuenow={uploadProgress[file.name]}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {uploadProgress[file.name]}%
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Modal>

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

export default UploadCV;
