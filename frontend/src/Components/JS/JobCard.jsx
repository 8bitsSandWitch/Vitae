import React from "react";
import PropTypes from "prop-types";
import "../CSS/jobcard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import PostImg from '../IMG/picD.jpg'; // Import the image

const JobCard = ({ job, onDelete, onEdit, showActions }) => {
  const keywords = Array.isArray(job.keywords) ? job.keywords : job.keywords.split(",");

  return (
    <div className="job-card">
      <div className="job-card-header">
        <h3>{job.title}</h3>
        {showActions && (
          <div>
            <FontAwesomeIcon icon={faEdit} className="edit-icon" onClick={() => onEdit(job)} />
            <FontAwesomeIcon icon={faTrashAlt} className="delete-icon" onClick={() => onDelete(job.id)} />
          </div>
        )}
      </div>
      <div className="job-card-body">
        <img src={PostImg} alt="Job Image" className="job-image" />
        <p><strong>Enterprise:</strong> {job.enterprise_name}</p>
        <p><strong>Email:</strong> {job.enterprise_email}</p>
        <p><strong>Description:</strong> {job.description}</p>
        <p><strong>Keywords:</strong> {keywords.join(", ")}</p>
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Expires on:</strong> {new Date(job.date_expire).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

JobCard.propTypes = {
  job: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    enterprise_name: PropTypes.string.isRequired,
    enterprise_email: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    keywords: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]).isRequired,
    location: PropTypes.string.isRequired,
    date_expire: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  showActions: PropTypes.bool,
};

JobCard.defaultProps = {
  onDelete: () => {},
  onEdit: () => {},
  showActions: false,
};

export default JobCard;
