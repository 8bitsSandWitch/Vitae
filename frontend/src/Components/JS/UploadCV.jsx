import React, { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import "../CSS/upload.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const UploadCV = () => {
  const [files, setFiles] = useState([]);
  const [uploadedCVs, setUploadedCVs] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
      return;
    }

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
    files.forEach((file, index) => {
      formData.append(`cv_${index}`, file);
    });

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8000/api/upload/", true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress({
          ...uploadProgress,
          [event.target.id]: percentComplete,
        });
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        setSnackbar({
          open: true,
          message: "File uploaded successfully.",
          severity: "success",
        });
        setOpenModal(false);
        // Fetch updated list of uploaded CVs
        fetch("http://localhost:8000/api/uploaded-cvs/", {
          credentials: "include",
        })
          .then((response) => response.json())
          .then((data) => {
            setUploadedCVs(data);
          })
          .catch((error) => {
            console.error("Error fetching uploaded CVs:", error);
          });
      } else {
        setSnackbar({
          open: true,
          message: "An error occurred during file upload.",
          severity: "error",
        });
      }
    };

    xhr.onerror = () => {
      setSnackbar({
        open: true,
        message: "An error occurred during file upload.",
        severity: "error",
      });
    };

    xhr.send(formData);
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
          <button className="btn btn-primary" onClick={handleOpenModal}>Add CV</button>
        </div>

        <div className="uploaded-cvs">
          {uploadedCVs.length > 0 ? (
            uploadedCVs.map((cv, index) => (
              <div key={index} className="cv-item">
                <a href={cv.cv_url} target="_blank" rel="noopener noreferrer">
                  {cv.name}
                </a>
              </div>
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
        <div className="up-dropzone-container main-content">
          <div className="up-header">
            <h2>Upload your CV</h2>
          </div>

          <div className="file_n_drop">
            <div className="up-dropzone-container">
              <p>Drag and drop your CV here</p>
              <p>or</p>
              <p>Click to browse</p>
              <form className="up_form" onSubmit={handleSubmit}>
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
              </form>
            </div>

            <div className="up-fileContainer">
              <h5>Uploaded Files</h5>
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
