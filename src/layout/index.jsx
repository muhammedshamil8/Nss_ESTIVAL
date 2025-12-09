import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { X, LayoutGrid, MapPin, Globe, Mail } from "lucide-react";

import ESTIVALLOGO from "@/assets/logo/EstivalNObg.png";
import EMEALOGO from "@/assets/logo/EMEAlogo.svg";

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isMenuOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isMenuOpen]);

 

  return (
    <div className="flex flex-col min-h-screen">
    


      {/* MAIN CONTENT */}
      <main className="flex-grow max-w-[1300px] mx-auto   pb-10 overflow-x-hidden w-full">
        <Outlet />
      </main>

      {/* FOOTER */}
      {/* FOOTER - Minimal Version */}
      <footer
        id="contact"
        className="bg-gradient-to-b from-white to-blue-50 pt-10 pb-6 border-t border-blue-100 mt-12"
      >
        <div className="max-w-[1300px] mx-auto px-4">
          {/* Contact Block */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-6 border-b border-blue-200">
            {/* Address */}
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <MapPin size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-gray-800 font-medium">
                  EMEA College of Arts & Science
                </p>
                <p className="text-sm text-gray-600">
                  Kumminiparambu P.O., Kondotty, Kerala – 673638
                </p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <a
                href="mailto:nssemeadev@gmail.com"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition group"
              >
                <Mail
                  size={18}
                  className="text-blue-500 group-hover:scale-110 transition"
                />
                nssemeadev@gmail.com
              </a>
              <span className="hidden sm:block text-gray-300">|</span>
              <a
                href="https://www.emeacollege.ac.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition group"
              >
                <Globe
                  size={18}
                  className="text-blue-500 group-hover:scale-110 transition"
                />
                emeacollege.ac.in
              </a>
            </div>
          </div>

          {/* Developer Credit */}
          <div className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Copyright */}
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} EMEA Estival • NSS Unit EMEA
                College
              </p>

              {/* Developer Credit */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Developed with</span>
                <div className="px-4 py-2 rounded-full bg-white shadow-sm border border-gray-200 hover:shadow transition-shadow flex items-center gap-2">
                  <span className="text-red-500 animate-pulse">❤️</span>
                  <span className="text-gray-700">by</span>
                  <a
                    href="https://zamil.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 font-semibold hover:text-green-700 hover:underline transition"
                  >
                    Shamil
                  </a>
                  <span className="text-gray-400">&</span>
                  <a
                    href="https://www.linkedin.com/in/dayyan-ali/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition"
                  >
                    Dayyan
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
