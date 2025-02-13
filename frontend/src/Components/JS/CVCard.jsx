import React from "react";
import PropTypes from "prop-types";
import "../CSS/cvcard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const CVCard = ({ cv, onDelete }) => {
  const handleOpenCV = () => {
    const formattedUrl = cv.cv_url.startsWith("http") ? cv.cv_url : `http://127.0.0.1:8000${cv.cv_url}`;
    window.open(formattedUrl, "_blank");
  };

  return (
    <div className="cv-card">
      <div className="cv-card-header">
        <h3>{cv.name}</h3>
        <FontAwesomeIcon icon={faTrashAlt} className="delete-icon" onClick={() => onDelete(cv.id)} />
      </div>
      <div className="cv-card-body">
        <p><strong>Email:</strong> {cv.email}</p>
        <p><strong>Description:</strong> {cv.description}</p>
        <p><strong>Keywords:</strong> {cv.keywords.join(", ")}</p>
      </div>
      <div className="cv-card-footer">
        <button className="btn btn-primary" onClick={handleOpenCV}>
          Open CV
        </button>
      </div>
    </div>
  );
};

CVCard.propTypes = {
  cv: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    keywords: PropTypes.arrayOf(PropTypes.string).isRequired,
    cv_url: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CVCard;
