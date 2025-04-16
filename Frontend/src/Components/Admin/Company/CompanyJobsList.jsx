import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
const CompanyJobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
ModuleRegistry.registerModules([AllCommunityModule]);

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setJobs(response.data.jobs);
      } catch (error) {
        setError('Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const colDefs = [
    { headerName: 'Job Title', field: 'title', sortable: true, filter: true },
    { headerName: 'Description', field: 'description', sortable: true, filter: true },
    { headerName: 'Company Name', field: 'company.name', sortable: true, filter: true },
    { headerName: 'Created At', field: 'created_at', sortable: true, filter: true },
    { headerName: 'Updated At', field: 'updated_at', sortable: true, filter: true },
  ];

  const rowData = jobs.map(job => ({
    title: job.title,
    description: job.description,
    company: job.company,
    created_at: job.created_at,
    updated_at: job.updated_at,
  }));

  const onGridReady = params => {
    params.api.sizeColumnsToFit();
  };

  const handleRowDoubleClick = event => {
    console.log('Row double clicked:', event.data);
  };

  return (
    <div className="ag-theme-alpine mt-14" style={{ height: '600px', width: '100%' }}>
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
  );
};

export default CompanyJobsList;
