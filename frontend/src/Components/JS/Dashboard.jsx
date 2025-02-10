import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/dashboard.css'
import JobList from "./JobList";
import FilterCV from "./FilterCV";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="dashboard_container main-content">
      <h1 className="mb-4">Dashboard</h1>
      {user ? (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Welcome, {user.username}!</h5>
            <p className="card-text"><strong>Email:</strong> {user.email}</p>
            <p className="card-text"><strong>First Name:</strong> {user.first_name}</p>
            <p className="card-text"><strong>Last Name:</strong> {user.last_name}</p>
            {/* Add more personalized content here */}
            <JobList />
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
