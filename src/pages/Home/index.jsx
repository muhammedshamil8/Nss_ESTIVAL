"use client";
import React from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";

// TEMP hero image – replace if needed
import HERO from "@/assets/logo/Estival.jpg";

const EVENTS = [
  { name: "Fashion Show", prize: "₹1,00,000", slug: "fashion-show" },
  { name: "Group Dance", prize: "₹50,000", slug: "group-dance" },
  { name: "Best Volunteer", prize: "₹50,000", slug: "best-volunteer" },
  { name: "Treasure Hunt", prize: "₹25,000", slug: "treasure-hunt" },
  { name: "Spot Photography", prize: "₹15,000", slug: "spot-photography" },
  { name: "Spot Reel Making", prize: "₹15,000", slug: "spot-reel-making" },
  { name: "Face Painting", prize: "₹10,000", slug: "face-painting" },
];

const HomePage = () => {
  const navigate = useNavigate();

  const openEvent = (slug) => {
    navigate(`/register/${slug}`);
  };

  const NavigateTo = (url) => {
    document.getElementById(url)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="w-full">

      {/* HERO SECTION */}
      <section className="w-full flex flex-col-reverse md:flex-row items-center justify-between py-16 gap-10">
        
        <div className="flex-1 text-left">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold text-blue-700 leading-tight"
          >
            ESTIVAL 2K25
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-4 text-lg md:text-xl text-green-700 font-medium"
          >
            NSS State Fest • EMEA College, Kondotty
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-4 text-gray-600 max-w-xl"
          >
            A vibrant celebration of talent, creativity, teamwork and youth
            leadership — bringing together NSS volunteers from across Kerala.
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => NavigateTo("events")}
            className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-lg shadow-md font-semibold"
          >
            Explore Events
          </motion.button>
        </div>

        {/* HERO IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex-1 flex justify-center"
        >
          <img src={HERO} alt="Estival Hero" className="w-[85%] max-w-[420px]" />
        </motion.div>

      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="w-full py-16">
        <h2 className="text-3xl font-bold text-blue-700 text-center">
          About Estival
        </h2>

        <p className="max-w-3xl mx-auto mt-4 text-center text-gray-700 leading-relaxed">
          Estival 2K25 is a state-level NSS Fest hosted by EMEA College, Kondotty.
          With 4000+ participants across Kerala, the fest features competitive,
          creative and leadership-based events — giving students an unforgettable
          platform to shine.
        </p>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 max-w-4xl mx-auto">
          {[
            { value: "4000+", label: "Participants" },
            { value: "7", label: "Major Events" },
            { value: "₹3 Lakh+", label: "Total Prizes" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-blue-600 text-center"
            >
              <p className="text-3xl font-bold text-blue-700">{stat.value}</p>
              <p className="text-gray-600 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* EVENTS SECTION */}
      <section id="events" className="w-full py-16">
        <h2 className="text-3xl font-bold text-blue-700 text-center">
          Events & Competitions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto">
          {EVENTS.map((event, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.04 }}
              className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm flex flex-col items-center text-center"
            >
              <h3 className="text-xl font-semibold text-blue-700">{event.name}</h3>
              <p className="text-green-700 mt-2 font-medium">{event.prize}</p>

              <button
                onClick={() => openEvent(event.slug)}
                className="mt-5 px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-all"
              >
                Register
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CONTACT CTA */}
      <section id="contact" className="w-full py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white text-center rounded-xl mb-10">
        <h2 className="text-3xl font-bold">Have Questions?</h2>
        <p className="mt-3 text-lg opacity-90">
          Reach out to the NSS team at EMEA College.
        </p>

        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          // onClick={() => navigate("/contact")}
          className="mt-6 px-10 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow-md"
        >
          Contact Us
        </motion.button>

        {/* +91 12345 67890 whatsap and icon also  */}
        <p className="mt-4 opacity-90 flex items-center justify-center">
          <a href="tel:+911234567890" className="underline">+91 12345 67890</a>
          <a href="https://wa.me/911234567890" target="_blank" rel="noopener noreferrer" className="bg-white p-2 rounded-full ml-2 flex items-center justify-center w-fit"> 
          <FaWhatsapp className="inline-block  text-green-500 bg-white rounded-full" />
          </a>
        </p>
      </section>

    </div>
  );
};

export default HomePage;
