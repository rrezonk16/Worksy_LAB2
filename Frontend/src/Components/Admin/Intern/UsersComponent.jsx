import React, { useEffect, useState, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import axios from "axios";
import UserDetailsModal from "./UserDetailsModal"; // Import the modal component

ModuleRegistry.registerModules([AllCommunityModule]);

const UsersComponent = () => {
  const [rowData, setRowData] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const gridApiRef = useRef(null);

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

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
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

      {isModalOpen && (
        <UserDetailsModal
          selectedUser={selectedUser}
          permissions={permissions}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default UsersComponent;
