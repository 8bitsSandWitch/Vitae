import React, { useState } from 'react';
import '../CSS/upload.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';

const UploadCV = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('cv', file);

    // Send the file to the backend
    fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <>
      <div className="up-header">
        <h2>Upload your CV</h2>
      </div>
      
      <div className="up-container">
        <p>Drag and drop your CV here</p>
        <p>or</p>
        <p>Click to browse</p>
        <form onSubmit={handleSubmit}>
          <div className="up-dropzone">
            <FontAwesomeIcon icon={faCloudUploadAlt} size="3x" />
            <input type="file" onChange={handleFileChange} />
          </div>
          <button type="submit">Upload CV</button>
        </form>
      </div>

    </>
  );
};

export default UploadCV;
