import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VerifyCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [verificationDetails, setVerificationDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch companies data
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/companies', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  const fetchCompanyVerification = async (companyId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/api/company-verification/${companyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setVerificationDetails(response.data);
      setCurrentImageIndex(0); // Reset the slider to the first image
    } catch (error) {
      console.error('Error fetching verification details:', error);
    }
  };

  const handleActivateClick = (companyId) => {
    setIsModalOpen(true);
    setSelectedCompany(companyId);
    fetchCompanyVerification(companyId);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCompany(null);
    setVerificationDetails(null);
  };

  const goToNextImage = () => {
    if (verificationDetails) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % getImages().length);
    }
  };

  const goToPrevImage = () => {
    if (verificationDetails) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + getImages().length) % getImages().length);
    }
  };

  const getImages = () => {
    const images = [];
    if (verificationDetails?.company_certificate_url) {
      images.push(`${verificationDetails.company_certificate_url}`);
    }
    if (verificationDetails?.owner_id_front) {
      images.push(`${verificationDetails.owner_id_front}`);
    }
    if (verificationDetails?.owner_id_back) {
      images.push(`${verificationDetails.owner_id_back}`);
    }
    return images;
  };

  const handleApprove = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8000/api/company-verification/${selectedCompany}/activate`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      alert('Verification approved!');
      closeModal();
    } catch (error) {
      console.error('Error approving verification:', error);
    }
  };

  const handleRefuse = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8000/api/company-verification/${selectedCompany}/refuse`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      alert('Verification refused!');
      closeModal();
    } catch (error) {
      console.error('Error refusing verification:', error);
    }
  };

  return (
    <div className="mt-12">
      <h1>Verify Companies</h1>
      <table className="table-auto border-collapse border border-gray-200 w-full">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Company ID</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id}>
              <td className="border border-gray-300 p-2">{company.company_id}</td>
              <td className="border border-gray-300 p-2">{company.status}</td>
              <td className="border border-gray-300 p-2">
                {company.status === 'uploaded' && (
                  <button
                    onClick={() => handleActivateClick(company.id)}
                    className="bg-blue-500 text-white p-2 rounded"
                  >
                    Activate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && verificationDetails && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold">Company Verification</h2>
            <div className="my-4">
              <h3 className="font-medium">Uploaded Photos</h3>
              <div className="relative">
                {/* Image Slider */}
                <div className="flex justify-center items-center">
                  <button
                    onClick={goToPrevImage}
                    className="absolute left-0 bg-gray-500 text-white p-2 rounded-full"
                  >
                    &#10094;
                  </button>
                  <img
                    src={getImages()[currentImageIndex]}
                    alt="Verification"
                    className="w-full h-auto max-w-2xl rounded-lg object-contain"
                  />
                  <button
                    onClick={goToNextImage}
                    className="absolute right-0 bg-gray-500 text-white p-2 rounded-full"
                  >
                    &#10095;
                  </button>
                </div>
                <div className="flex justify-center gap-2 mt-2">
                  {getImages().map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full ${index === currentImageIndex ? 'bg-blue-500' : 'bg-gray-400'}`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Approval and Refusal Buttons */}
            <div className="flex justify-between mt-4">
              <button
                onClick={handleApprove}
                className="bg-green-500 text-white p-2 rounded"
              >
                Approve
              </button>
              <button
                onClick={handleRefuse}
                className="bg-red-500 text-white p-2 rounded"
              >
                Refuse
              </button>
            </div>

            <button onClick={closeModal} className="mt-4 bg-red-500 text-white p-2 rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyCompanies;
