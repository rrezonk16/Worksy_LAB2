import React, { useEffect, useState } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import Talk from "talkjs";

import double_tap from "../../../assets/tap.png";
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
  const companyUser = JSON.parse(localStorage.getItem("company_user"));

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
        console.log(response.data.applications);
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
      console.log(res.data.applications);

      setApplications(res.data.applications);
    } catch {
      setError("Failed to fetch applications");
    }
  };

  const handleBack = () => {
    setSelectedJob(null);
    console.log(applications);

    setApplications([]);
  };

  const handleDeleteJob = async () => {
    if (!selectedJob) {
      setError("No job selected");
      return;
    }

    const token = localStorage.getItem("company_user_token");

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

  const openChat = (app) => {
    const me = new Talk.User({
      id: `publisher_${app.job.company_id}`,
      name: companyUser.name,
      email: companyUser.email,
      photoUrl: companyUser.avatarUrl,
    });

    const other = new Talk.User({
      id: `applicant_${app.user.id}`,
      name: `${app.user.name} ${app.user.surname}`,
      email: app.user.email,
      photoUrl: app.user.avatarUrl,
    });

    const session = new Talk.Session({
      appId: "tEAW4NLM",
      me: me,
    });

    const conversationId = `job_${app.job_id}_applicant_${app.user.id}`;
    const conversation = session.getOrCreateConversation(conversationId);
    conversation.setParticipant(me);
    conversation.setParticipant(other);

    const inbox = session.createPopup(conversation, {
      keepOpen: false,
    });

    inbox.mount();
  };

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
  className="mb-8 p-6 border rounded-2xl shadow-md bg-white space-y-6"
>
  {/* Header: User Info and Actions */}
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <div>
      <h3 className="text-xl font-semibold text-gray-800">
        {app.user.name} {app.user.surname}
      </h3>
      <p className="text-sm text-gray-600">{app.user.email}</p>
      <p className="text-sm text-gray-600">
        <strong>Phone:</strong> {app.user.phone_number}
      </p>
    </div>

    <div className="flex flex-wrap gap-3">
      <button
        className="bg-purple-700 rounded-2xl px-4 py-2 text-white hover:bg-purple-600 transition"
        onClick={() => openChat(app)}
      >
        Message
      </button>
      <a
        href={`/profile/${app.user.id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className="bg-green-700 rounded-2xl px-4 py-2 text-white hover:bg-green-600 transition">
          Open Profile
        </button>
      </a>
      <button
        className="bg-blue-700 rounded-2xl px-4 py-2 text-white hover:bg-blue-600 transition flex items-center gap-2"
        onClick={() => {
          setSelectedAppId(app.id);
          setShowModal(true);
        }}
      >
        <img
          src="https://img.icons8.com/ios-filled/24/ffffff/new-post.png"
          alt="Send Invite"
        />
        Send Invite
      </button>
    </div>
  </div>

  {/* Meeting Info */}
  {app.interview_meeting && (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 p-4 rounded-lg border">
      <p className="text-sm text-gray-700">
        <strong>Interview Scheduled at:</strong>{" "}
        {new Date(app.interview_meeting.scheduled_at).toLocaleString()}
      </p>
      <button
        className="mt-2 sm:mt-0 bg-blue-600 rounded-xl px-4 py-2 text-white hover:bg-blue-500 transition"
        onClick={() =>
          window.open(
            `https://meet.jit.si/${app.interview_meeting.room_name}`,
            "_blank"
          )
        }
      >
        Start Meet
      </button>
    </div>
  )}

  {/* Answers Section */}
  <div>
    <h4 className="font-medium text-gray-700 mb-3">Answers:</h4>
    <ul className="space-y-3">
      {app.answers.map((ans) => (
        <li key={ans.id} className="bg-gray-50 p-4 rounded-lg border">
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
