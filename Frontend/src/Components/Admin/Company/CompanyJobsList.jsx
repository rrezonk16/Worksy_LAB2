import React, { useEffect, useState } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

import double_tap from "../../../assets/tap.png";
import { set } from "date-fns";
import SendInterviewInviteModal from "./SendInterviewInviteModal";
const CompanyJobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTip, setShowTip] = useState(true);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("company_user_token");
      if (!token) {
        setError("No token found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(response.data.jobs);
      } catch {
        setError("Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleRowDoubleClick = async (event) => {
    const job = event.data;
    const token = localStorage.getItem("company_user_token");

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/job-applications/${job.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedJob(job);
      setApplications(res.data.applications);
    } catch {
      setError("Failed to fetch applications");
    }
  };

  const handleBack = () => {
    setSelectedJob(null);
    setApplications([]);
  };

  const handleDeleteJob = async () => {
    // Ensure a job is selected
    if (!selectedJob) {
      setError("No job selected");
      return;
    }

    // Get token from localStorage
    const token = localStorage.getItem("company_user_token");

    // Check if token exists
    if (!token) {
      setError("No token found");
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:8000/api/jobs/${selectedJob.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);

      if (response.status === 200) {
        setJobs((prevJobs) =>
          prevJobs.filter((job) => job.id !== selectedJob.id)
        );
        setError(null);
        alert("Job deleted successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const exportToExcel = () => {
    const data = applications.flatMap((app) =>
      app.answers.map((ans) => ({
        Name: `${app.user.name} ${app.user.surname}`,
        Email: app.user.email,
        Phone: app.user.phone_number,
        Question: ans.question.question_text,
        Answer:
          typeof ans.answer === "string" &&
          ans.answer.startsWith("applications/")
            ? `http://localhost:8000/storage/${ans.answer}`
            : ans.answer,
      }))
    );

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");

    XLSX.writeFile(workbook, "applications.xlsx");
  };

  const colDefs = [
    { headerName: "Job Title", field: "title" },
    { headerName: "Description", field: "description" },
    { headerName: "Company Name", field: "company.name" },
    { headerName: "Created At", field: "created_at" },
    { headerName: "Updated At", field: "updated_at" },
  ];

  const onGridReady = (params) => params.api.sizeColumnsToFit();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (selectedJob) {
    return (
      <div className="mt-16 px-6 max-w-5xl mx-auto">
        <button
          onClick={handleBack}
          className="mb-6 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
        >
          ← Back to Jobs
        </button>
        <button
          onClick={() => navigate(`?active-tab=edit-job=${selectedJob.id}`)}
          className="mb-6 px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition ml-3  cursor-pointer "
        >
          Edit Job
        </button>
        <button
          onClick={handleDeleteJob}
          className="mb-6 px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition ml-3  cursor-pointer "
        >
          Delete Job
        </button>
        <h2 className="text-2xl font-bold mb-8 text-gray-800">
          Applications for:{" "}
          <span className="text-indigo-600">{selectedJob.title}</span>
        </h2>
        {applications.length > 0 && (
          <button
            onClick={exportToExcel}
            className="mb-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Export to Excel
          </button>
        )}

        {applications.length === 0 ? (
          <p className="text-gray-500">No applications yet.</p>
        ) : (
          applications.map((app) => (
            <div
              key={app.id}
              className="mb-8 p-6 border rounded-lg shadow-sm bg-white"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {app.user.name} {app.user.surname}
                  </h3>
                  <p className="text-sm text-gray-600">{app.user.email}</p>
                  <p className="text-sm text-gray-600">
                    <strong>Phone:</strong> {app.user.phone_number}
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`/profile/${app.user.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className=" cursor-pointer bg-green-700 rounded-2xl p-3 text-white hover:bg-green-600">
                      {" "}
                      Open Profile
                    </button>
                  </a>
                  <button
                    className=" cursor-pointer bg-blue-700 rounded-2xl p-3 text-white hover:bg-blue-600"
                    onClick={() => {
                      setSelectedAppId(app.id);
                      setShowModal(true);
                    }}
                  >
                    <img
                      src="https://img.icons8.com/ios-filled/24/ffffff/new-post.png"
                      alt="Send Invite"
                      className="inline-block mr-2"
                    />
                    Send Invite
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Answers:</h4>
                <ul className="space-y-2">
                  {app.answers.map((ans) => (
                    <li key={ans.id} className="bg-gray-50 p-3 rounded border">
                      <strong className="text-gray-700">
                        {ans.question.question_text}:
                      </strong>{" "}
                      {typeof ans.answer === "string" &&
                      ans.answer.startsWith("applications/") ? (
                        <a
                          href={`http://localhost:8000/storage/${ans.answer}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block ml-2 text-white bg-indigo-600 px-3 py-1 rounded hover:bg-indigo-700 transition"
                        >
                          Open File
                        </a>
                      ) : (
                        <span className="text-gray-800">{ans.answer}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
          {showModal && (
        <SendInterviewInviteModal
          applicationId={selectedAppId}
          onClose={() => setShowModal(false)}
          onSuccess={() => {}}
        />
      )}
      </div>
    );
  }

  return (
    <div className="mt-14 p-4">
      {showTip && (
        <div className="fixed top-24 right-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-md max-w-xs z-50">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold">TIP</p>
              <p className="text-sm mt-1">
                Double click on a job to see the applications.
              </p>
            </div>
            <button
              onClick={() => setShowTip(false)}
              className="ml-4 text-yellow-700 hover:text-yellow-900 font-bold text-lg leading-none"
            >
              ×
            </button>
          </div>
          <img className="w-6 mt-2" src={double_tap} alt="Double tap icon" />
        </div>
      )}

      <div
        className="ag-theme-alpine "
        style={{ height: "600px", width: "100%" }}
      >
        <AgGridReact
          rowData={jobs}
          columnDefs={colDefs}
          pagination={true}
          paginationPageSize={10}
          domLayout="autoHeight"
          rowSelection="multiple"
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
          }}
          onGridReady={onGridReady}
          onRowDoubleClicked={handleRowDoubleClick}
        />
      </div>

    
    </div>
  );
};

export default CompanyJobsList;
