import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { X, LayoutGrid, MapPin, Globe, Mail } from "lucide-react";

import ESTIVALLOGO from "@/assets/logo/Estival.jpg";
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

  const scrollToSection = (id) => {
    navigate("/");
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 150);

    if (isMenuOpen) toggleMenu();
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="w-full fixed top-0 left-0 z-50">
        <div
          className="
      backdrop-blur-xl bg-white/40 
      border-b border-white/30 
      shadow-[0_8px_32px_rgba(0,0,0,0.1)] 
      supports-backdrop-blur:bg-white/50
      transition-all
    "
        >
          <div className="max-w-[1300px] mx-auto px-4 py-3 flex justify-between items-center">
            {/* Logo */}
            <img
              src={ESTIVALLOGO}
              alt="Estival Logo"
              className="h-12 cursor-pointer select-none"
              onClick={() => navigate("/")}
            />

            {/* Mobile menu toggle */}
            <button className="lg:hidden text-blue-700" onClick={toggleMenu}>
              {isMenuOpen ? <X size={26} /> : <LayoutGrid size={26} />}
            </button>

            {/* Desktop Menu */}
            <nav className="hidden lg:flex gap-8 items-center font-semibold text-gray-700">
              {[
                { id: "home", label: "Home" },
                { id: "about", label: "About" },
                { id: "events", label: "Events" },
                { id: "contact", label: "Contact" },
              ].map((item) => {
                const isActive =
                  location.pathname === "/" &&
                  window.location.hash.replace("#", "") === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`relative nav-btn px-1 transition-all ${
                      isActive ? "text-blue-700 font-bold" : "text-gray-700"
                    }`}
                  >
                    {item.label}

                    {/* Active underline */}
                    <span
                      className={`
                  absolute left-0 right-0 -bottom-1 h-[2px] 
                  rounded-full bg-blue-600 transition-all 
                  ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"}
                `}
                    />
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`
      lg:hidden fixed top-0 left-0 w-full h-screen 
      backdrop-blur-2xl bg-white/70 
      border-r border-white/30
      shadow-xl transition-transform duration-300
      ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
    `}
        >
          <div className="flex justify-between items-center px-4 py-4 border-b border-white/40">
            <img src={ESTIVALLOGO} className="h-10" alt="logo" />
            <button className="text-blue-700" onClick={toggleMenu}>
              <X size={26} />
            </button>
          </div>

          <ul className="flex flex-col items-center w-full mt-6 space-y-6 text-lg font-semibold">
            {[
              { id: "home", label: "Home" },
              { id: "about", label: "About" },
              { id: "events", label: "Events" },
              { id: "contact", label: "Contact" },
            ].map((item) => (
              <li key={item.id}>
                <button
                  className="
              mobile-nav-btn text-gray-800 hover:text-blue-700 
              transition-all
            "
                  onClick={() => scrollToSection(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="absolute bottom-0 p-4 w-full">
            <button
              className="bg-blue-600 text-white py-2 rounded-md w-full"
              onClick={toggleMenu}
            >
              Close
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow max-w-[1300px] mx-auto px-4 pt-28 pb-10">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer id="contact" className="bg-blue-50 p-8 mt-10 border-t">
        <div className="max-w-[1300px] mx-auto">
          {/* Contact Block */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b pb-6">
            {/* Address */}
            <div className="flex items-center gap-4">
              <MapPin size={30} strokeWidth={1} className="text-blue-700" />
              <div>
                <img src={EMEALOGO} alt="EMEA Logo" className="h-10 mb-1" />
                <p className="text-sm leading-5 text-gray-800">
                  EMEA College of Arts & Science,
                  <br />
                  Kondotty, Kerala – 673638
                </p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="flex flex-col gap-3 text-gray-700">
              <a
                href="mailto:nss.emea@gmail.com"
                className="flex items-center gap-3 hover:text-blue-600 transition"
              >
                <Mail strokeWidth={1} /> nss.emea@gmail.com
              </a>

              <a
                href="https://www.emeacollege.ac.in"
                target="_blank"
                className="flex items-center gap-3 hover:text-blue-600 transition"
              >
                <Globe strokeWidth={1} /> emeacollege.ac.in
              </a>
            </div>
          </div>

          {/* Developer Credit */}
          <div className="border-t border-gray-300 mt-6 pt-4 flex flex-col items-center text-sm text-gray-700">
            <span className="px-4 py-1.5 rounded-full bg-white shadow-sm border">
              Developed <span className="text-red-500 animate-pulse">❤️</span>{" "}
              by
              <a
                href="https://zamil.vercel.app"
                target="_blank"
                className="text-green-600 font-semibold ml-1 hover:underline"
              >
                Shamil
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
