import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import logo_full from "../../assets/logo_full.png";
import Navbar from "../Navigation/Navbar";
import Footer from "../Navigation/Footer";

const Success = () => {
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const orderId = query.get("order");

  useEffect(() => {
    const checkOrderStatus = async () => {
      if (!orderId) {
        setError("Missing order ID");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://ibascommerce.pbc.group/CheckOrder?OrderId=${orderId}`
        );
        setOrderData(response.data?.Result);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch order status");
      } finally {
        setLoading(false);
      }
    };

    checkOrderStatus();
  }, [orderId]);

  useEffect(() => {
    if (orderData?.IsSuccess) {
      const postPremium = async () => {
        try {
          const token = localStorage.getItem("company_user_token");
          
          await axios.post(
            "http://localhost:8000/api/subscribe-premium",
            {
              subscription_type: "Premium", 
              duration_days: 30, 
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Company set to premium");
        } catch (err) {
          console.error("Failed to notify backend:", err);
        }
      };

      postPremium();
    }
  }, [orderData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">Checking payment status...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between h-screen">
      <Navbar />
      <div className="h-full flex flex-col items-center justify-center bg-gray-100 p-6">
        <h1 className="text-xl font-semibold text-yellow-600 tracking-wide">PREMIUM</h1>

        <img
          src={logo_full}
          alt="Logo"
          className="h-16 mb-2"
        />

        <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md text-center">
          {orderData?.IsSuccess ? (
            <>
              <h2 className="text-3xl font-extrabold text-green-600 mb-4">
                Payment Successful 🎉
              </h2>
              <p className="text-gray-700 mb-3">
                Thank you for your payment. Your premium subscription is now active.
              </p>
              <p className="text-gray-600 text-sm mb-6">
                You will receive a receipt in your email.
              </p>
              <div className="text-left text-gray-800 mt-6 space-y-2">
                <p><span className="font-semibold">Order Number:</span> {orderData.IDClientOrder}</p>
                <p><span className="font-semibold">Amount:</span> €{orderData.Amount}</p>
                <p><span className="font-semibold">Date:</span> {orderData.InsertionDate}</p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-extrabold text-red-600 mb-4">
                Payment Failed ❌
              </h2>
              <p className="text-gray-700">
                Your transaction could not be completed. Please try again or contact support.
              </p>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Success;
