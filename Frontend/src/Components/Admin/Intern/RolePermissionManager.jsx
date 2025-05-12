import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function RolePermissionManager() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [newRoleName, setNewRoleName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  useEffect(() => {
    if (selectedRole) fetchRolePermissions(selectedRole);
  }, [selectedRole]);

  const token = localStorage.getItem('token');

  const fetchRoles = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/roles', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(res.data.roles);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/permissions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPermissions(res.data.permissions);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  const fetchRolePermissions = async (roleId) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/roles/${roleId}/permissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedPermissions(res.data.permissions.map((p) => p.id));
    } catch (error) {
      console.error('Error fetching role permissions:', error);
    }
  };

  const createRole = async () => {
    if (!newRoleName.trim()) return;

    try {
      await axios.post(
        'http://localhost:8000/api/roles',
        { name: newRoleName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewRoleName('');
      setMessage('Role created successfully!');
      fetchRoles();
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  const togglePermission = (id) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedPermissions(permissions.map((p) => p.id));
  const clearAll = () => setSelectedPermissions([]);

  const savePermissions = async () => {
    try {
      await axios.post(
        `http://localhost:8000/api/roles/${selectedRole}/permissions`,
        { permission_ids: selectedPermissions },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage('Permissions saved!');
    } catch (error) {
      console.error('Error saving permissions:', error);
    }
  };

  return (
    <div className="mt-16 p-6 bg-white shadow rounded-xl max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Role - Permission Manager</h2>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Create New Role</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            placeholder="Enter role name"
            className="border rounded px-3 py-2 flex-grow"
          />
          <button
            onClick={createRole}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Select Role</h3>
        <select
          className="w-full border px-3 py-2 rounded"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="">-- Choose a Role --</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      </div>

      {selectedRole && (
        <>
          <div className="flex gap-4 mb-4">
            <button onClick={selectAll} className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded">
              Select All
            </button>
            <button onClick={clearAll} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded">
              Clear All
            </button>
            <button onClick={savePermissions} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded">
              Save
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {permissions.map((permission) => (
              <label key={permission.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedPermissions.includes(permission.id)}
                  onChange={() => togglePermission(permission.id)}
                />
                <span>{permission.name}</span>
              </label>
            ))}
          </div>
        </>
      )}

      {message && (
        <div className="mt-6 p-3 bg-green-100 text-green-700 border border-green-300 rounded">
          {message}
        </div>
      )}
    </div>
  );
}
