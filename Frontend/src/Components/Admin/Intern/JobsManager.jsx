import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AgGridReact } from "ag-grid-react";


const JobsManager = () => {
  const [rowData, setRowData] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [gridApi, setGridApi] = useState(null)
  const navigate = useNavigate()

 const fetchJobs = async () => {
  try {
    const token = localStorage.getItem('token')

    const response = await axios.get('http://localhost:8000/api/admin/jobs/all', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    setRowData(response.data)
  } catch (error) {
    console.error('Error fetching all jobs:', error)
  }
}

 const deleteJob = async (id) => {
  try {
    const token = localStorage.getItem('token')

   const response=  await axios.delete(`http://localhost:8000/api/admin/jobs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log(response);
    

    fetchJobs(currentPage)
  } catch (error) {
    console.error('Error deleting job:', error)
  }
}

  const openJobDetails = (id) => {
    navigate(`/jobs/${id}`)
  }

  const editJob = (id) => {
    navigate(`/jobs/${id}/edit`)
  }

const actionCellRenderer = (params) => (
  <div className="flex items-center justify-center space-x-1 h-full">
    <button
      onClick={() => openJobDetails(params.data.id)}
      className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-2 rounded h-7 w-16 flex items-center justify-center"
    >
      Open
    </button>
    <button
      onClick={() => editJob(params.data.id)}
      className="bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-white px-2 rounded h-7 w-16 flex items-center justify-center"
    >
      Edit
    </button>
    <button
      onClick={() => deleteJob(params.data.id)}
      className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-2 rounded h-7 w-20 flex items-center justify-center"
    >
      Delete
    </button>
  </div>
)

  const columns = [
    { headerName: 'ID', field: 'id', width: 90 },
    { headerName: 'Title', field: 'title', flex: 1 },
    { headerName: 'Company', field: 'company.name', flex: 1, valueGetter: (p) => p.data.company?.name || 'N/A' },
    { headerName: 'Location', field: 'details.location', flex: 1, valueGetter: (p) => p.data.details?.location || 'N/A' },
    { headerName: 'Wage', field: 'details.wage', flex: 1, valueGetter: (p) => p.data.details?.wage || 'N/A' },
    { headerName: 'Actions', cellRenderer: actionCellRenderer, width: 250 },
  ]

  const onGridReady = useCallback((params) => {
    setGridApi(params.api)
    fetchJobs()
  }, [])

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      fetchJobs(newPage)
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Jobs Manager</h2>
      <div className="ag-theme-alpine" style={{  width: "100%" }}>
        <AgGridReact
          columnDefs={columns}
          rowData={rowData}
          domLayout="autoHeight"
          onGridReady={onGridReady}
          enableFilter={true}
          enableSorting={true}
        />
      </div>
    </div>
  )
}

export default JobsManager
