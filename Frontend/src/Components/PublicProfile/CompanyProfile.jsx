import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navigation/Navbar';
import Footer from '../Navigation/Footer';

const CompanyProfile = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/public/companies/${id}`)
      .then(response => {
        setCompany(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching company data:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;
  if (!company) return <div className="text-center mt-10 text-red-500">Company not found.</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Company Info Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={`http://localhost:8000/${company.logo_url}`}
                alt="Company Logo"
                className="w-24 h-24 rounded-xl object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold">{company.name}</h2>
                <p className="text-sm text-gray-500">{company.city}, {company.country}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <p><strong>Email:</strong> {company.email}</p>
              <p><strong>Phone:</strong> {company.phone_number}</p>
              <p><strong>Address:</strong> {company.address}</p>
              <p><strong>NUI:</strong> {company.nui}</p>
              <p><strong>Employees:</strong> {company.number_of_employees}</p>
              <p><strong>Activities:</strong> {company.activities?.join(', ')}</p>
              <p><strong>Njesia:</strong> {company.njesia?.join(', ')}</p>
            </div>
          </div>

          {/* Jobs List Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4 h-[500px] overflow-y-auto">
            <h3 className="text-xl font-semibold border-b pb-2">Open Jobs</h3>
            {company.jobs && company.jobs.length > 0 ? (
              company.jobs.map(job => (
                <div key={job.id} className="last:border-b-0 p-3 mb-3 last:mb-0 cursor-pointer hover:bg-gray-100 rounded-2xl "> 
                  <h4 className="text-lg font-bold text-indigo-700">{job.title}</h4>
                  <p className="text-gray-600 text-sm">{job.description}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No jobs available for this company.</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CompanyProfile;
