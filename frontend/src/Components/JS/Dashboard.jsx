import React, { useEffect, useState } from 'react';
import JobList from "./JobList";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/dashboard.css'


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

      <div className="mb-4 dashboard_topTitle">
        <h1>Job Offers</h1>

        {/* {user ? (
          <p>Welcome {user.first_name}!! <br /> Are you looking for something !?</p>
        ) : (
          <p>Loading...</p>
        )} */}

        <form action="">
          <input type="search" name="" id="" placeholder='Need a job !?'/>
          <FontAwesomeIcon className="btn btn-primary search_btn" icon={faMagnifyingGlass}  />
        </form>
      </div>

      <div className="card_container">
        <JobList />
      </div>
    </div>
  );
};

export default Dashboard;
