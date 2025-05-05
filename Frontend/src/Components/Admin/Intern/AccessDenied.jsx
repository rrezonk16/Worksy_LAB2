import React from 'react'

const AccessDenied = () => {
  return (
    <div>
        <h1 className="text-4xl font-bold text-center mt-20">Access Denied</h1>
        <p className="text-lg text-center text-gray-600 mt-4">
            You do not have permission to access this page.
        </p>
        <div className="flex justify-center mt-10">
        </div>
    </div>
  )
}

export default AccessDenied