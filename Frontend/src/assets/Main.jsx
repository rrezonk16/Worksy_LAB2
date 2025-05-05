import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../Components/Navigation/Footer';
import Navbar from '../Components/Navigation/Navbar';
import PremiumSection from '../Components/Main/PremiumSection';
import phoneUi from '../assets/phone_ui.png';
import mark_review from '../assets/mark_review.png';
import emma_review from '../assets/emma_review.png';
const Main = () => {
  const navigate = useNavigate();

  return (
    <div className="font-sans bg-gradient-to-b from-[#d7f0dc] to-white min-h-screen">
      {/* Header */}
<Navbar/>

      <section className="flex flex-col lg:flex-row items-center justify-between py-16">

        <div className="w-full lg:w-1/2 px-8 lg:px-16">
          <h2 className="text-4xl font-bold mb-6">Find Your Dream Job or Hire Top Talent!</h2>
          <button onClick={() => navigate('/register')} className="bg-black text-white px-6 py-3 rounded-full">Join now</button>
        </div>
        
        <div className="flex justify-end w-full lg:w-1/2">
          <img src={phoneUi} alt="Phone UI" className="max-w-md" />
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16 px-8 lg:px-32">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <img src={mark_review} alt="Mark T." className="w-24 h-24 mx-auto rounded-full mb-4" />
            <h4 className="font-bold">Mark T.</h4>
            <p className="text-sm text-gray-500 mb-2">HR Manager</p>
            <p className="italic text-gray-700 mb-2">“As a recruiter, I love how Worksy streamlines the hiring process. It’s efficient and user-friendly!”</p>
            <p className="text-green-500">★★★★★</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 text-center">
            <img src={emma_review} alt="Emma R." className="w-24 h-24 mx-auto rounded-full mb-4" />
            <h4 className="font-bold">Emma R.</h4>
            <p className="text-sm text-gray-500 mb-2">Graphic Designer</p>
            <p className="italic text-gray-700 mb-2">“Worksy made job hunting so easy! I found my dream job within a week. Highly recommend!”</p>
            <p className="text-green-500">★★★★★</p>
          </div>
        </div>
      </section>
      <PremiumSection />



      <Footer />
    </div>
  );
};

export default Main;
