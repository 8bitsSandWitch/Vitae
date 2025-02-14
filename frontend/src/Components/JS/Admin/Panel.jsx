import React, { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import axios from 'axios';
import './panel.css'
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Panel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    type_utils: '',
    password: '', // Add password field
  });

  const getCSRFToken = () => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1];
    return cookieValue;
  };

  const fetchUsers = async () => {
    const csrfToken = getCSRFToken();
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get('http://localhost:8000/api/Utilisateur/', {
        headers: {
          "X-CSRFToken": csrfToken,
          "Authorization": `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setUsers(response.data);
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Users fetched successfully',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to fetch users',
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenDialog = (user) => {
    setSelectedUser(user);
    setFormData(user || {
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      type_utils: '',
      password: '', // Add password field
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const csrfToken = getCSRFToken();
    const token = localStorage.getItem("token");

    try {
      if (selectedUser) {
        // Update user
        await axios.put(`http://localhost:8000/api/Utilisateur/${selectedUser.id}/`, formData, {
          headers: {
            "X-CSRFToken": csrfToken,
            "Authorization": `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setSnackbar({
          open: true,
          message: 'User updated successfully',
          severity: 'success',
        });
      } else {
        // Add new user
        await axios.post('http://localhost:8000/api/Utilisateur/', formData, {
          headers: {
            "X-CSRFToken": csrfToken,
            "Authorization": `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setSnackbar({
          open: true,
          message: 'User added successfully',
          severity: 'success',
        });
      }
      handleCloseDialog();
      fetchUsers();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to save user',
        severity: 'error',
      });
    }
  };

  const handleDelete = async (userId) => {
    const csrfToken = getCSRFToken();
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:8000/api/Utilisateur/${userId}/`, {
        headers: {
          "X-CSRFToken": csrfToken,
          "Authorization": `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setSnackbar({
        open: true,
        message: 'User deleted successfully',
        severity: 'success',
      });
      fetchUsers();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to delete user',
        severity: 'error',
      });
    }
  };

  const columns = [
    { field: 'username', headerName: 'Username', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'first_name', headerName: 'First Name', width: 150 },
    { field: 'last_name', headerName: 'Last Name', width: 150 },
    { field: 'type_utils', headerName: 'Type', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <Button onClick={() => handleOpenDialog(params.row)}>Edit</Button>
          <Button onClick={() => handleDelete(params.row.id)}>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <div className="panel-main">
      <Button onClick={() => handleOpenDialog(null)}>Add User</Button>
      <DataGrid rows={users} columns={columns} pageSize={5} loading={loading} />
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedUser ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Type"
            name="type_utils"
            value={formData.type_utils}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit}>{selectedUser ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Panel;