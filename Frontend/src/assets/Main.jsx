import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../Components/Navigation/Footer';
import Navbar from '../Components/Navigation/Navbar';
import PremiumSection from '../Components/Main/PremiumSection';
import phoneUi from '../assets/phone_ui.png';
import mark_review from '../assets/mark_review.png';
import emma_review from '../assets/emma_review.png';
import BalkansMap from '../Components/Main/Maps/BalkansMap';
import animtaions_list from '../assets/jobs_animtaion.gif';
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

      <img src={animtaions_list} alt="" className='w-full' />

    
      <PremiumSection />

    <BalkansMap />


      <Footer />
    </div>
  );
};

export default Main;
