import React from 'react';
import { useNavigate } from 'react-router-dom';

const Main = () => {
  const navigate = useNavigate();

  return (
    <div className="font-sans bg-gradient-to-b from-[#d7f0dc] to-white min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <img src="/public/Favicon-32x32.png" alt="Worksy Logo" className="w-10 h-10" />
          <h1 className="text-2xl font-bold text-gray-800">Work<span className="text-green-500">sy</span></h1>
        </div>
        <div className="space-x-4">
          <button className="text-gray-800 font-medium">About Us</button>
          <button onClick={() => navigate('/register')} className="px-4 py-2 border border-gray-800 rounded-full hover:bg-gray-800 hover:text-white">Join now</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between py-16">

        <div className="w-full lg:w-1/2 px-8 lg:px-16">
          <h2 className="text-4xl font-bold mb-6">Find Your Dream Job or Hire Top Talent!</h2>
          <button onClick={() => navigate('/register')} className="bg-black text-white px-6 py-3 rounded-full">Join now</button>
        </div>
        
        <div className="flex justify-end w-full lg:w-1/2">
          <img src="/public/png1.png" alt="Phone UI" className="max-w-md" />
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16 px-8 lg:px-32">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <img src="/public/person2.png" alt="Mark T." className="w-24 h-24 mx-auto rounded-full mb-4" />
            <h4 className="font-bold">Mark T.</h4>
            <p className="text-sm text-gray-500 mb-2">HR Manager</p>
            <p className="italic text-gray-700 mb-2">“As a recruiter, I love how Worksy streamlines the hiring process. It’s efficient and user-friendly!”</p>
            <p className="text-green-500">★★★★★</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 text-center">
            <img src="/public/person1.png" alt="Emma R." className="w-24 h-24 mx-auto rounded-full mb-4" />
            <h4 className="font-bold">Emma R.</h4>
            <p className="text-sm text-gray-500 mb-2">Graphic Designer</p>
            <p className="italic text-gray-700 mb-2">“Worksy made job hunting so easy! I found my dream job within a week. Highly recommend!”</p>
            <p className="text-green-500">★★★★★</p>
          </div>
        </div>
      </section>

      {/* Explore Jobs */}
      <section className="bg-gray-100 py-16 px-8 lg:px-32 text-center">
        <h3 className="text-xl italic mb-6">Explore Thousands of <span className="text-green-600 font-bold">Jobs</span></h3>
        <div className="flex flex-wrap justify-center gap-6 mb-6">
          {['Full-time', 'Part-time', 'Freelance', 'Remote Work'].map((type, i) => (
            <div key={i} className="flex flex-col items-center text-sm">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-2">
                <span>{type[0]}</span>
              </div>
              <p>{type}</p>
            </div>
          ))}
        </div>
        <button onClick={() => navigate('/register')} className="bg-green-500 text-white px-6 py-2 rounded-full">Join now</button>
      </section>

      {/* Footer */}
      <footer className="bg-green-400 py-8 text-center text-white font-semibold">
        <img src="/logo.png" alt="Worksy Logo" className="mx-auto w-12 mb-2" />
        <h2 className="text-xl">Worksy</h2>
        <p className="italic">Footer</p>
      </footer>
    </div>
  );
};

export default Main;
