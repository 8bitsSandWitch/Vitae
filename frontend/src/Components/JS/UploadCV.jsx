import React, { useState } from "react";
import "../CSS/upload.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";

const UploadCV = () => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`cv_${index}`, file);
    });

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8000/api/upload/", true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress({ ...uploadProgress, [event.target.id]: percentComplete });
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        console.log("Success:", xhr.responseText);
      } else {
        console.error("Error:", xhr.responseText);
      }
    };

    xhr.send(formData);
  };

  return (
    <>
      <div className="up-container main-content">
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
                <input type="file" onChange={handleFileChange} accept="application/pdf" multiple />
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
    </>
  );
};

export default UploadCV;
