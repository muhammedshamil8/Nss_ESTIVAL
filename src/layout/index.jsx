import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { X, LayoutGrid, MapPin, Globe, Mail } from "lucide-react";
import ESTIVALLOGO from "@/assets/logo/Estival.jpg";

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    if (isMenuOpen) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [isMenuOpen]);

  const scrollToSection = (id) => {
    navigate("/");
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 120);
    if (isMenuOpen) toggleMenu();
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* NAVBAR */}
      <header className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
        <div className="max-w-[1300px] mx-auto px-4 py-3 flex justify-between items-center">

          <img
            src={ESTIVALLOGO}
            alt="Estival Logo"
            className="h-12 cursor-pointer"
            onClick={() => navigate("/")}
          />

          <button className="lg:hidden text-blue-600" onClick={toggleMenu}>
            {isMenuOpen ? <X size={26} /> : <LayoutGrid size={26} />}
          </button>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex gap-6 items-center">
            <button onClick={() => navigate("/")} className="nav-btn">Home</button>
            <button onClick={() => scrollToSection("about")} className="nav-btn">About</button>
            <button onClick={() => scrollToSection("events")} className="nav-btn">Events</button>
            <button onClick={() => scrollToSection("contact")} className="nav-btn">Contact</button>
          </nav>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden fixed top-0 left-0 w-full h-screen bg-white z-50 transition-transform duration-300 ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center px-4 py-3 border-b">
            <img src={ESTIVALLOGO} className="h-10" />
            <button className="text-blue-600" onClick={toggleMenu}>
              <X size={26} />
            </button>
          </div>

          <ul className="flex flex-col items-center w-full mt-6 space-y-4">
            <li><button className="mobile-nav-btn" onClick={() => navigate("/")}>Home</button></li>
            <li><button className="mobile-nav-btn" onClick={() => scrollToSection("about")}>About</button></li>
            <li><button className="mobile-nav-btn" onClick={() => scrollToSection("events")}>Events</button></li>
            <li><button className="mobile-nav-btn" onClick={() => scrollToSection("contact")}>Contact</button></li>
          </ul>

          <div className="absolute bottom-0 p-4 w-full">
            <button className="bg-blue-600 text-white py-2 rounded-md w-full" onClick={toggleMenu}>
              Close
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
   <main className="flex-grow max-w-[1300px] mx-auto px-4 pt-28 pb-6">

        <Outlet />
      </main>

      {/* FOOTER */}
      <footer id="contact" className="bg-blue-50 p-6 mt-10">
        <div className="max-w-[1300px] mx-auto">

          {/* Contact Block */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b pb-6">
            <div className="flex items-center gap-4">
              <MapPin strokeWidth={1} size={30} />
              <p className="text-sm leading-5">
                EMEA College of Arts & Science,<br />
                Kondotty, Kerala – 673638
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex gap-3 items-center">
                <Mail strokeWidth={1} />
                <a href="mailto:nss.emea@gmail.com" className="text-sm hover:text-blue-600">
                  nss.emea@gmail.com
                </a>
              </div>

              <div className="flex gap-3 items-center">
                <Globe strokeWidth={1} />
                <a href="https://www.emeacollege.ac.in" target="_blank" className="text-sm hover:text-blue-600">
                  emeacollege.ac.in
                </a>
              </div>
            </div>
          </div>

          {/* Cute Dev Credit */}
          <div className="border-t border-gray-300 mt-6 pt-4 flex flex-col items-center text-sm text-gray-700">
            <span className="px-4 py-1.5 rounded-full bg-white shadow-sm border text-gray-600">
              Developed with <span className="animate-pulse text-red-500">❤️</span> by
              <a href="https://www.linkedin.com/in/dayyan-ali/" target="_blank" className="text-blue-600 font-semibold mx-1 hover:underline">Dayyan</a>
              &
              <a href="https://zamil.vercel.app" target="_blank" className="text-green-600 font-semibold mx-1 hover:underline">Shamil</a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
