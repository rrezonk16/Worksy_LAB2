import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { AgGridReact } from "ag-grid-react";

const CompanyUsers = () => {
  const token = localStorage.getItem('company_user_token');
  const [users, setUsers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    surname: '',
    username: '',
    password: '',
    position: ''
  });

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/company-users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.users);
    } catch (err) {
      console.error('Error fetching users', err);
    }
  }, [token]);

  const createUser = async () => {
    try {
      await axios.post('http://localhost:8000/api/company-users', newUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewUser({ name: '', surname: '', username: '', password: '', position: '' });
      setShowCreateForm(false);
      fetchUsers();
    } catch (err) {
      console.error('Error creating user', err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/company-users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user', err);
    }
  };

  const updateUser = async (params) => {
    try {
      const { id, name, surname, position } = params.data;
      await axios.put(`http://localhost:8000/api/company-users/${id}`, { name, surname, position }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Error updating user', err);
    }
  };

  const changePassword = async (id) => {
    const newPassword = prompt("Enter new password:");
    if (!newPassword) return;
    try {
      await axios.put(`http://localhost:8000/api/company-users/${id}/password`, { password: newPassword }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Password changed successfully.");
    } catch (err) {
      console.error('Error changing password', err);
    }
  };

  const columnDefs = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', editable: true },
    { field: 'surname', editable: true },
    { field: 'username' },
    { field: 'position', editable: true },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: (params) => (
        <div className="flex gap-2">
          <button
            className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
            onClick={() => changePassword(params.data.id)}
          >
            Password
          </button>
          <button
            className="bg-red-600 text-white px-2 py-1 rounded text-sm"
            onClick={() => deleteUser(params.data.id)}
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Company Users</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {showCreateForm ? 'Cancel' : 'Create New User'}
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white shadow-md rounded p-4 mb-6">
          <h3 className="text-lg font-semibold mb-2">New User</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              className="border p-2 rounded"
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={e => setNewUser({ ...newUser, name: e.target.value })}
            />
            <input
              className="border p-2 rounded"
              type="text"
              placeholder="Surname"
              value={newUser.surname}
              onChange={e => setNewUser({ ...newUser, surname: e.target.value })}
            />
            <input
              className="border p-2 rounded"
              type="text"
              placeholder="Username"
              value={newUser.username}
              onChange={e => setNewUser({ ...newUser, username: e.target.value })}
            />
            <input
              className="border p-2 rounded"
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={e => setNewUser({ ...newUser, password: e.target.value })}
            />
            <input
              className="border p-2 rounded col-span-2"
              type="text"
              placeholder="Position"
              value={newUser.position}
              onChange={e => setNewUser({ ...newUser, position: e.target.value })}
            />
          </div>
          <button
            onClick={createUser}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create User
          </button>
        </div>
      )}

      <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
        <AgGridReact
          rowData={users}
          columnDefs={columnDefs}
          onCellValueChanged={updateUser}
          animateRows
          pagination
        />
      </div>
    </div>
  );
};

export default CompanyUsers;
