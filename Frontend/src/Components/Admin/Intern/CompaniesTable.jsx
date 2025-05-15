import React, { useEffect, useState, useRef } from "react"; // <-- add useRef
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import EditCompanyModal from "./EditCompanyModal";
const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const gridRef = useRef(); 

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/api/companies", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const transformedCompanies = response.data.companies.map((company) => ({
          company_id: company.id,
          company_name: company.name,
          company_nui: company.nui,
          company_email: company.email,
          company_phone_number: company.phone_number,
          created_at: company.verifications?.created_at_formatted || "-",
          updated_at: company.verifications?.updated_at_formatted || "-",
          status: company.verifications?.status || "-",
          company_certificate_url: company.verifications?.company_certificate_url,
          owner_id_front: company.verifications?.owner_id_front,
          owner_id_back: company.verifications?.owner_id_back,
        }));

        setCompanies(transformedCompanies);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  const handleEditCompany = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleExport = () => {
    gridRef.current.api.exportDataAsCsv();
  };

  const columnDefs = [
    { headerName: "Company ID", field: "company_id", filter: true, sortable: true },
    { headerName: "Company Name", field: "company_name", filter: true, sortable: true },
    { headerName: "Company NUI", field: "company_nui", filter: true, sortable: true },
    { headerName: "Company Email", field: "company_email", filter: true, sortable: true },
    { headerName: "Company Phone", field: "company_phone_number", filter: true, sortable: true },
    { headerName: "Applied for verification", field: "created_at", filter: true, sortable: true },
    { headerName: "Decision Made", field: "updated_at", filter: true, sortable: true },
    { headerName: "Status", field: "status", filter: true, sortable: true },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <button
          onClick={() => handleEditCompany(params.data)}
          className="bg-blue-500 text-white p-2 rounded mt-1 h-8 w-20 text-center cursor-pointer items-center flex justify-center"
        >
          Edit
        </button>
      ),
    },
  ];

  return (
    <div className="mt-14">
      <h1 className="mb-4">Manage Companies</h1>

      <button
        onClick={handleExport}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Export to CSV
      </button>

      <div className="ag-theme-alpine" style={{ height: "1000px", width: "100%" }}>
        <AgGridReact
          ref={gridRef}
          rowData={companies}
          columnDefs={columnDefs}
          domLayout="autoHeight"
          pagination={true}
          enableFilter={true}
          enableSorting={true}
          getRowStyle={(params) => {
            if (params.data.status === "approved") return { backgroundColor: "#d4edda" };
            if (params.data.status === "rejected") return { backgroundColor: "#f8d7da" };
            return {};
          }}
        />
      </div>

      {isModalOpen && selectedCompany && (
        <EditCompanyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          companyData={selectedCompany}
        />
      )}
    </div>
  );
};

export default CompanyManagement;
