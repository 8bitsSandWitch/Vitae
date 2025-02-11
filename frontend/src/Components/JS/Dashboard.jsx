import React, { useEffect, useState } from 'react';
import JobList from "./JobList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/dashboard.css';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    // Retrieve user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleApply = (jobId) => {
    if (!user) {
      setSnackbar({ open: true, message: 'Please log in to apply for jobs.', severity: 'error' });
      return;
    }

    // Handle the application process here
    console.log(`User ${user.id} applied for job ${jobId}`);
    setSnackbar({ open: true, message: `You have successfully applied for job ${jobId}`, severity: 'success' });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className="dashboard_container main-content">
      <div className="mb-4 dashboard_topTitle">
        <h1>Job Offers</h1>
        <form action="">
          <input type="search" name="" id="" placeholder='Need a job !?' />
          <FontAwesomeIcon className="btn btn-primary search_btn" icon={faMagnifyingGlass} />
        </form>
      </div>
      <div className="card_container">
        <JobList onApply={handleApply} />
      </div>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Dashboard;
