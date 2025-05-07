import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
import 'react-toastify/dist/ReactToastify.css';

import double_tap from '../../../assets/tap.png';
const CompanyJobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTip, setShowTip] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem('company_user_token');
      if (!token) {
        setError('No token found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/jobs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(response.data.jobs);
      } catch {
        setError('Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleRowDoubleClick = async (event) => {
    const job = event.data;
    const token = localStorage.getItem('company_user_token');

    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/job-applications/${job.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedJob(job);
      setApplications(res.data.applications);
    } catch {
      setError('Failed to fetch applications');
    }
  };

  const handleBack = () => {
    setSelectedJob(null);
    setApplications([]);
  };

  const colDefs = [
    { headerName: 'Job Title', field: 'title' },
    { headerName: 'Description', field: 'description' },
    { headerName: 'Company Name', field: 'company.name' },
    { headerName: 'Created At', field: 'created_at' },
    { headerName: 'Updated At', field: 'updated_at' },
  ];

  const onGridReady = (params) => params.api.sizeColumnsToFit();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  if (selectedJob) {
    return (
      <div className="mt-14 p-4">
        <button onClick={handleBack} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
          Back to Jobs
        </button>
        <h2 className="text-xl font-bold mb-4">
          Applications for: {selectedJob.title}
        </h2>
        {applications.map(app => (
          <div key={app.id} className="mb-6 p-4 border rounded shadow">
            <h3 className="text-lg font-semibold">
              {app.user.name} {app.user.surname} ({app.user.email})
            </h3>
            <p><strong>Phone:</strong> {app.user.phone_number}</p>
            <div className="mt-2">
              <h4 className="font-medium">Answers:</h4>
              <ul className="list-disc ml-6">
                {app.answers.map(ans => (
                  <li key={ans.id}>
                    <strong>{ans.question.question_text}</strong>: {ans.answer}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className='mt-14 p-4'>
{showTip && (
  <div className="fixed top-24 right-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-md max-w-xs z-50">
    <div className="flex justify-between items-start">
      <div>
        <p className="font-semibold">TIP</p>
        <p className="text-sm mt-1">Double click on a job to see the applications.</p>
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

    <div className="ag-theme-alpine " style={{ height: '600px', width: '100%' }}>
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
