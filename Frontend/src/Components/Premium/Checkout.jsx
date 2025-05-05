import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navigation/Navbar";
import Footer from "../Navigation/Footer";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan, amount } = location.state || {};
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!plan || !amount) {
      navigate("/subscribe");
    } else {
      setOrderId(`SUB-${Math.floor(Math.random() * 100000)}`);
    }
  }, [plan, amount, navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    const paymentData = {
      ClientOrderId: orderId,
      Amount: amount,
      CallbackUrl: "https://your-api.com/api/payment-callback", // ← Update this
      RedirectUrl: `http://localhost:5173/success?order=${orderId}`,
    };

    try {
      const response = await axios.post(
        "https://ibascommerce.pbc.group/Banking",
        paymentData,
        {
          headers: {
            Token:
              "f9e10c50c5464f54915283aa40a4d821:ac1fc70189ef44d5b5fc1265b93abf1b",
            "Content-Type": "application/json",
          },
        }
      );

      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.write(response.data);
        newWindow.document.close();
      } else {
        alert("Please enable popups for this site.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-around h-screen flex-col">
      <Navbar />
      <div className=" flex h-full items-center justify-center bg-gray-100 py-12 px-4 ">
        <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full ">
          <h2 className="text-3xl font-bold text-center mb-4">
            Subscription Details
          </h2>
          <div className="text-gray-700 text-center mb-6">
            <p className="mb-2">
              <strong>Plan:</strong>{" "}
              {plan?.charAt(0).toUpperCase() + plan?.slice(1)}
            </p>
            <p className="mb-2">
              <strong>Amount:</strong> €{amount}
            </p>
            <p className="mb-2">
              <strong>Order Number:</strong> {orderId}
            </p>
          </div>

          <form onSubmit={handlePayment}>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-3 text-white text-lg font-semibold ${
                loading
                  ? "bg-gray-500"
                  : "bg-gradient-to-r  to-green-600 cursor-pointer hover:from-gray-300 "
              } transition`}
            >
              {loading ? (
                "Processing Payment..."
              ) : (
                <>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                    alt="Visa"
                    className="h-6"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
                    alt="MasterCard"
                    className="h-12"
                  />
                  Pay with Visa / MasterCard
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
