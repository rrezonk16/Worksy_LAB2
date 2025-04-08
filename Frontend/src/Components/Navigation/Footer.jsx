import React from 'react';
import logo_icon from '../../assets/logo_icon.png';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-green-400 text-white py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          {/* Logo and Name */}
          <div className="flex flex-col items-center md:items-start">
            <img src={logo_icon} alt="Worksy Logo" className="w-12 mb-2" />
            <h2 className="text-2xl font-bold">Worksy</h2>
            <p className="italic text-sm">Your career companion</p>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-8 text-sm text-center md:text-left">
            <div>
              <h4 className="font-semibold mb-2">Company</h4>
              <ul className="space-y-1">
                <li><Link to="/about" className="hover:underline">About Us</Link></li>
                <li><Link to="/careers" className="hover:underline">Careers</Link></li>
                <li><Link to="/contact" className="hover:underline">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Resources</h4>
              <ul className="space-y-1">
                <li><Link to="/faq" className="hover:underline">FAQ</Link></li>
                <li><Link to="/support" className="hover:underline">Support</Link></li>
                <li><Link to="/privacy" className="hover:underline">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Get Started</h4>
              <ul className="space-y-1">
                <li><Link to="/register" className="hover:underline">Join Now</Link></li>
                <li><Link to="/login" className="hover:underline">Log In</Link></li>
                <li><Link to="/jobs" className="hover:underline">Find Jobs</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Worksy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
