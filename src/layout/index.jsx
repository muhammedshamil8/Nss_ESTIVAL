import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { MapPin, Globe, Instagram } from "lucide-react";

import SponserLogo from "@/assets/logo/sponser.webp";

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isMenuOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isMenuOpen]);

  const scrollToSection = (id) => {
    navigate("/");
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 150);

    if (isMenuOpen) toggleMenu();
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-around w-full max-w-5xl px-4">
        <nav className="flex space-x-6 sm:space-x-8 text-xs sm:text-sm font-medium text-gray-700 uppercase bg-white/80 backdrop-blur border border-gray-200 rounded-full px-8 py-2 shadow">
          <button onClick={() => scrollToSection("home")}>HOME</button>
          <button onClick={() => scrollToSection("about")}>ABOUT</button>
          <button onClick={() => scrollToSection("events")}>EVENTS</button>
          <button onClick={() => scrollToSection("contact")}>CONTACT</button>
        </nav>


        {/* sponser logo https://mymelova.com/ */}
        <a href="https://mymelova.com/" target="_blank" className="
          
        ">
        <img src={SponserLogo} alt="Sponsor Logo" className="h-12 sm:h-16" />
       </a>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow   pb-10 overflow-x-hidden w-full ">
        <Outlet />
      </main>

      {/* FOOTER */}
      {/* FOOTER - Minimal Version */}
      <footer
        id="contact"
        className="bg-gradient-to-b from-white to-blue-50 pt-10 pb-6 border-t border-blue-100 "
      >
        <div className="max-w-[1300px] mx-auto px-4">
          {/* Contact Block */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-6 border-b border-blue-200">
            {/* Address */}
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className=" rounded-full  flex items-center justify-center">
                <MapPin className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-sm sm:text-md text-gray-800 font-medium">
                  EMEA College of Arts & Science
                </p>
                <p className="text-[10px] sm:text-sm text-gray-600">
                  Kumminiparambu P.O., Kondotty, Kerala – 673638
                </p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <a
                target="_blank"
                href="https://www.instagram.com/nss_emea_college"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition group"
              >
                {/* <Mail
                  size={18}
                  className="text-blue-500 group-hover:scale-110 transition"
                />
                nssemeadev@gmail.com */}
                <Instagram
                  size={18}
                  className="text-green-500 group-hover:scale-110 transition"
                />
                <span>nss_emea_college</span>
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
          <div className="pt-6 pb-2">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              {/* Copyright */}
              {/* <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} EMEA Estival • NSS Unit EMEA
                College
              </p> */}

              {/* Developer Credit */}
              <div className="flex items-center gap-3 justify-center text-center">
                <span className="text-sm text-gray-600">
                  Developed with{" "}
                  <span className="inline-block animate-pulse text-red-500">
                    ❤️
                  </span>{" "}
                  by{" "}
                  <br className="sm:hidden"/>
                  <br className="sm:hidden"/>
                  <a
                    href="https://wa.me/+918089465673?text=Hello%20Shamil,%20I%20am%20looking%20to%20build%20a%20website.%20Please%20provide%20details%20about%20your%20services."
                    target="_blank"
                    className="hover:underline hover:text-blue-600"
                    rel="noopener noreferrer"
                  >
                    {" "}
                    Shamil{" "}
                  </a>
                  ,{" "}
                  <a
                    href="https://wa.me/919061084323?text=Hello%20Dayyan,%20I%20am%20looking%20to%20build%20a%20website.%20Please%20provide%20details%20about%20your%20services."
                    target="_blank"
                    className="hover:underline hover:text-blue-600"
                    rel="noopener noreferrer"
                  >
                    Dayyan{" "}
                  </a>{" "}
                  &
                  <a
                    href="https://wa.me/+919061306799?text=Hello%20Irshad,%20I%20am%20looking%20to%20build%20a%20website.%20Please%20provide%20details%20about%20your%20services."
                    className="hover:underline hover:text-blue-600"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {" "}
                    Irshad
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
