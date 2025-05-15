import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UserRoleManager() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState({});
  const [loadingUserId, setLoadingUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:8000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    }
  };

  const fetchRoles = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:8000/api/roles', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const roleMap = {};
      res.data.roles.forEach((role) => {
        roleMap[role.id] = role.name;
      });
      setRoles(roleMap);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Failed to fetch roles');
    }
  };

  const handleRoleChange = async (userId, roleId) => {
    const token = localStorage.getItem('token');
    setLoadingUserId(userId);
    try {
      await axios.post(
        `http://localhost:8000/api/users/${userId}/role`,
        { role_id: roleId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Role updated successfully!');
      await fetchUsers();
    } catch (error) {
      console.error('Error changing role:', error);
      toast.error('Failed to update role');
    } finally {
      setLoadingUserId(null);
    }
  };

  return (
    <div className="mt-16 p-6 bg-white shadow rounded-xl max-w-5xl mx-auto">
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-6">User - Role Manager</h2>
      <table className="w-full border border-gray-200 text-sm text-left">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="px-4 py-2">{user.id}</td>
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">
                <select
                  className="border rounded p-1"
                  value={user.role_id || ''}
                  disabled={loadingUserId === user.id}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                >
                  <option value="">Select Role</option>
                  {Object.entries(roles).map(([id, name]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
                {loadingUserId === user.id && (
                  <span className="ml-2 text-xs text-gray-500 animate-pulse">Saving...</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
