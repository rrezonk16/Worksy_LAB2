import React, { useEffect, useState, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import axios from "axios";
import { gsap } from "gsap";

ModuleRegistry.registerModules([AllCommunityModule]);

const UsersComponent = () => {
  const [rowData, setRowData] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const gridApiRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRowData(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const checkPermissions = () => {
      const permissionsFromStorage = JSON.parse(
        localStorage.getItem("permissions") || "[]"
      );
      setPermissions(permissionsFromStorage);
    };

    fetchUsers();
    checkPermissions();
  }, []);

  const [colDefs] = useState([
    { headerName: "ID", field: "id", sortable: true, filter: true, resizable: true },
    { headerName: "Name", field: "name", sortable: true, filter: true, resizable: true },
    { headerName: "Surname", field: "surname", sortable: true, filter: true, resizable: true },
    { headerName: "Email", field: "email", sortable: true, filter: true, resizable: true },
    { headerName: "Phone", field: "phone_number", sortable: true, filter: true, resizable: true },
    { headerName: "Role", field: "role.name", sortable: true, filter: true, resizable: true },
  ]);

  const onGridReady = (params) => {
    gridApiRef.current = params.api;
  };

  const handleRowDoubleClick = (params) => {
    setSelectedUser(params.data);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (isModalOpen) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.5 }
      );
    }
  }, [isModalOpen]);

  const closeModal = () => {
    gsap.to(modalRef.current, {
      opacity: 0,
      scale: 0.5,
      duration: 0.5,
      onComplete: () => setIsModalOpen(false),
    });
  };

  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:8000/api/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setRowData((prevData) => prevData.filter((user) => user.id !== userId));
        alert("User deleted successfully!");
        closeModal();
      } else {
        alert("Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleUpdate = async (updatedUser) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8000/api/users/${updatedUser.id}`,
        updatedUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setRowData((prevData) =>
          prevData.map((user) =>
            user.id === updatedUser.id ? updatedUser : user
          )
        );
        alert("User updated successfully!");
        closeModal();
      } else {
        alert("Failed to update user.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const exportToCSV = () => {
    if (gridApiRef.current) {
      gridApiRef.current.exportDataAsCsv();
    }
  };

  return (
    <div>
      <div style={{ height: 500 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          pagination={true}
          paginationPageSize={10}
          domLayout="autoHeight"
          rowSelection="multiple"
          enableSorting={true}
          enableFilter={true}
          resizable={true}
          autoSizeColumns={true}
          suppressAggFuncInHeader={true}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
            minWidth: 100,
          }}
          rowGroupPanelShow="always"
          animateRows={true}
          onGridReady={onGridReady}
          onRowDoubleClicked={handleRowDoubleClick}
        />
      </div>

      <div className="mt-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={exportToCSV}
        >
          Export to CSV
        </button>
      </div>

      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div
            ref={modalRef}
            className="bg-white p-6 rounded-lg shadow-xl w-96"
            style={{ transition: "transform 0.5s ease-out, opacity 0.5s ease-out" }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-center">User Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">ID:</span>
                <span>{selectedUser.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Name:</span>
                <span>{selectedUser.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Surname:</span>
                <span>{selectedUser.surname}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{selectedUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Phone:</span>
                <span>{selectedUser.phone_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Role:</span>
                <span>{selectedUser.role.name}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              {permissions.includes("EDIT_USERS") && (
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={() => handleUpdate(selectedUser)}
                >
                  Update
                </button>
              )}
              {permissions.includes("DELETE_USERS") && (
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  onClick={() => handleDelete(selectedUser.id)}
                >
                  Delete
                </button>
              )}
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersComponent;
