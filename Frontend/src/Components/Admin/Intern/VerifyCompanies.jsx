import React, { useEffect, useState } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";

const VerifyCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch companies data
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8000/api/companies",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  const handleActivateClick = (company) => {
    setIsModalOpen(true);
    setSelectedCompany(company); // Use the whole company object
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCompany(null);
  };

  const handleApprove = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8000/api/company-verification/${selectedCompany.company_id}/activate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Verification approved!");
      closeModal();
    } catch (error) {
      console.error("Error approving verification:", error);
    }
  };

  const handleRefuse = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8000/api/company-verification/${selectedCompany.company_id}/refuse`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Verification refused!");
      closeModal();
    } catch (error) {
      console.error("Error refusing verification:", error);
    }
  };

  const columnDefs = [
    {
      headerName: "Company ID",
      field: "company_id",
      filter: true,
      sortable: true,
    },
    {
      headerName: "Company Name",
      field: "company_name",
      filter: true,
      sortable: true,
    },
    {
      headerName: "Company NUI",
      field: "company_nui",
      filter: true,
      sortable: true,
    },
    {
      headerName: "Company Email",
      field: "company_email",
      filter: true,
      sortable: true,
    },
    {
      headerName: "Company Phone",
      field: "company_phone_number",
      filter: true,
      sortable: true,
    },
    { headerName: "Status", field: "status", filter: true, sortable: true },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => {
        if (params.data.status === "uploaded") {
          return (
            <button
              onClick={() => handleActivateClick(params.data)}
              className="bg-blue-500 text-white p-2 rounded mt-1 h-8 w-20 text-center cursor-pointer items-center flex justify-center"
            >
              Activate
            </button>
          );
        }
        return null;
      },
    },
  ];

  return (
    <div className="mt-12">
      <h1>Verify Companies</h1>

      <div
        className="ag-theme-alpine"
        style={{ height: "1000px", width: "100%" }}
      >
        <AgGridReact
          rowData={companies}
          columnDefs={columnDefs}
          domLayout="autoHeight"
          pagination={true}
          enableFilter={true}
          enableSorting={true}
          getRowStyle={(params) => {
            if (params.data.status === "approved") {
              return { backgroundColor: "#d4edda" }; 
            } else if (params.data.status === "rejected") {
              return { backgroundColor: "#f8d7da" }; // Light red for rejected
            }
            return {}; // Default style
          }}
        />
      </div>

      {/* Modal */}
      {isModalOpen && selectedCompany && (
        <div className="fixed inset-0 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-full relative">
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              Company Verification
            </h2>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-700">
                Uploaded Photos
              </h3>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {selectedCompany.company_certificate_url && (
                  <button
                    onClick={() =>
                      window.open(
                        selectedCompany.company_certificate_url,
                        "_blank"
                      )
                    }
                    className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md transition-all"
                  >
                    Company Certificate
                  </button>
                )}
                {selectedCompany.owner_id_front && (
                  <button
                    onClick={() =>
                      window.open(selectedCompany.owner_id_front, "_blank")
                    }
                    className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md transition-all"
                  >
                    ID Front
                  </button>
                )}
                {selectedCompany.owner_id_back && (
                  <button
                    onClick={() =>
                      window.open(selectedCompany.owner_id_back, "_blank")
                    }
                    className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md transition-all"
                  >
                    ID Back
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handleApprove}
                className="bg-green-600 cursor-pointer hover:bg-green-700 text-white py-2 px-6 rounded-lg shadow-md transition-all"
              >
                Approve
              </button>
              <button
                onClick={handleRefuse}
                className="bg-red-600 cursor-pointer hover:bg-red-700 text-white py-2 px-6 rounded-lg shadow-md transition-all"
              >
                Refuse
              </button>
            </div>

            <button
              onClick={closeModal}
              className="absolute top-4 cursor-pointer right-4 bg-gray-300 hover:bg-gray-400 text-gray-800 p-2 rounded-full transition-all"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyCompanies;
