import { useEffect, useState } from "react";
import axios from "axios";

const EditCompanyModal = ({ companyData, isOpen, onClose }) => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const companyId = companyData?.company_id || companyData?.id; // Ensure we're using the correct ID
  
  const fetchCompany = async () => {
    if (!companyId) {
      console.error("No companyId provided, cannot fetch company.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:8000/api/companies/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Company fetched:", res.data.company);
      setCompany(res.data.company); 

    } catch (err) {
      console.error("Failed to fetch company:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:8000/api/companies/${companyId}`, company, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Company updated successfully!");
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update company.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/api/companies/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Company deleted successfully!");
      onClose();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete company.");
    }
  };

  useEffect(() => {
    if (isOpen && companyId) {
      fetchCompany();
    }
  }, [isOpen, companyId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 w-full max-w-xl rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Edit Company</h2>
        {loading ? (
          <p>Loading...</p>
        ) : company ? (
          <div className="space-y-3">
            <input
              name="name"
              value={company.name || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Name"
            />
            <input
              name="nui"
              value={company.nui || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="NUI"
            />
            <input
              name="number_of_employees"
              value={company.number_of_employees || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Number of Employees"
            />
            <input
              name="email"
              value={company.email || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Email"
            />
            <input
              name="city"
              value={company.city || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="City"
            />
            <input
              name="country"
              value={company.country || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Country"
            />
            <input
              name="address"
              value={company.address || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Address"
            />
            <input
              name="phone_number"
              value={company.phone_number || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Phone Number"
            />

            <div className="flex gap-4 mt-4">
              <button onClick={handleEdit} className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Save</button>
              <button onClick={handleDelete} className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700">Delete</button>
              <button onClick={onClose} className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400">Cancel</button>
            </div>
          </div>
        ) : (
          <p>Company not found</p>
        )}
      </div>
    </div>
  );
};

export default EditCompanyModal;
