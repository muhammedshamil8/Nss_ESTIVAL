"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import HERO from "@/assets/logo/Estival.jpg";
import { FaWhatsapp } from "react-icons/fa";
import FashionShowImg from "@/assets/images/fashion_show.png";
import GroupDanceImg from "@/assets/images/group_dance.png";

const EVENTS = [
  {
    name: "Fashion Show",
    prize: "₹1,00,000",
    slug: "fashion-show",
    emoji: (
      <img
        src={FashionShowImg}
        alt="Fashion Show"
        className="w-full h-full object-cover rounded-lg p-2"
      />
    ),
    color: "from-pink-500 to-purple-600",
  },
  {
    name: "Group Dance",
    prize: "₹50,000",
    slug: "group-dance",
    emoji: (
      <img
        src={GroupDanceImg}
        alt="Group Dance"
        className="w-full h-full object-cover rounded-lg p-3"
      />
    ),
    color: "from-blue-500 to-cyan-600",
  },
  {
    name: "Best Volunteer",
    prize: "₹50,000",
    slug: "best-volunteer",
    emoji: "⭐",
    color: "from-yellow-500 to-orange-600",
  },
  {
    name: "Treasure Hunt",
    prize: "₹25,000",
    slug: "treasure-hunt",
    emoji: "🗺️",
    color: "from-green-500 to-teal-600",
  },
  {
    name: "Spot Photography",
    prize: "₹15,000",
    slug: "spot-photography",
    emoji: "📸",
    color: "from-indigo-500 to-purple-600",
  },
  {
    name: "Spot Reel Making",
    prize: "₹15,000",
    slug: "spot-reel-making",
    emoji: "🎬",
    color: "from-red-500 to-pink-600",
  },
  {
    name: "Face Painting",
    prize: "₹10,000",
    slug: "face-painting",
    emoji: "🎨",
    color: "from-violet-500 to-fuchsia-600",
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [hoveredEvent, setHoveredEvent] = useState(null);

  const openEvent = (slug) => {
    document.documentElement.scrollIntoView({ top: 0, behavior: "smooth" });
    navigate(`/register/${slug}`);
  }
  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section
        id="home"
        className="w-full min-h-[85vh] flex flex-col-reverse md:flex-row items-center justify-between py-16 px-6 md:px-12 lg:px-20 gap-10"
      >
        {/* LEFT TEXT */}
        <div className="flex-1 max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black text-blue-700 leading-tight"
          >
            ESTIVAL <span className="text-green-600">2K25</span>
          </motion.h1>

          <p className="mt-4 text-xl font-semibold text-green-700">
            NSS State Fest • EMEA College, Kondotty
          </p>

          <p className="mt-4 text-gray-600 text-lg max-w-xl leading-relaxed">
            A vibrant celebration of creativity, teamwork, and youth
            leadership—bringing NSS volunteers across Kerala together on one
            grand platform.
          </p>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => scrollTo("events")}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow-md font-semibold hover:bg-blue-700 transition-all"
            >
              Explore Events
            </button>

            <button
              onClick={() => scrollTo("about")}
              className="px-8 py-3 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              About Fest
            </button>
          </div>
        </div>

        {/* HERO IMAGE */}
        {/* HERO IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="flex-1 flex justify-center relative"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-green-400 rounded-3xl blur-2xl opacity-30" />
            <img
              src={HERO}
              alt="Estival Hero"
              className="relative w-[90%] max-w-[440px] rounded-3xl shadow-2xl"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ABOUT SECTION */}
      <section
        id="about"
        className="w-full py-20 px-6 md:px-12 lg:px-20 bg-gray-50"
      >
        <h2 className="text-4xl font-bold text-blue-700 text-center">
          About Estival
        </h2>
        <div className="w-20 h-1 bg-blue-600 rounded-full mx-auto mt-3"></div>

        <p className="max-w-4xl mx-auto mt-6 text-center text-gray-700 text-lg leading-relaxed">
          Estival 2K25 is a{" "}
          <span className="font-semibold text-blue-700">
            state-level NSS Fest
          </span>
          hosted by{" "}
          <span className="font-semibold text-green-700">
            EMEA College, Kondotty
          </span>
          . With participation from volunteers across Kerala, the fest aims to
          foster leadership, cultural appreciation, creativity, and a spirit of
          community service.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto mt-14">
          {[
            { value: "4000+", label: "Participants" },
            { value: "7", label: "Major Events" },
            { value: "₹3 Lakh+", label: "Total Prizes" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-white p-8 text-center rounded-2xl shadow border-t-4 border-blue-600"
            >
              <p className="text-4xl font-black text-blue-700">{stat.value}</p>
              <p className="text-gray-600 text-lg mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* EVENTS SECTION */}
      <section id="events" className="w-full py-24 px-6 md:px-12 lg:px-20">
        <h2 className="text-4xl font-bold text-blue-700 text-center">
          Events & Competitions
        </h2>
        <p className="text-lg text-gray-600 text-center mt-2">
          Choose your arena and showcase your talent
        </p>
        <div className="w-20 h-1 bg-blue-600 rounded-full mx-auto mt-4"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-14">
          {EVENTS.map((event, idx) => (
            <motion.div
              key={idx}
              onMouseEnter={() => setHoveredEvent(idx)}
              onMouseLeave={() => setHoveredEvent(null)}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.04 }}
              className="relative bg-white p-8 rounded-3xl shadow-xl border border-gray-200 flex flex-col items-center text-center transition-all"
            >
              {/* Prize Badge */}
              <div
                className={`absolute -top-5 -right-5 bg-gradient-to-r ${event.color} text-white px-4 py-2 rounded-xl shadow-lg`}
              >
                🏆 {event.prize}
              </div>

              {/* Icon */}
              <div
                className={`w-20 h-20 bg-gradient-to-br ${event.color} rounded-2xl flex items-center justify-center shadow-xl text-4xl text-white mb-6`}
              >
                {event.emoji}
              </div>

              <h3 className="text-2xl font-bold text-gray-700">{event.name}</h3>

              <button
                onClick={() => openEvent(event.slug)}
                className={`mt-8 w-full py-3 bg-gradient-to-r ${event.color} text-white rounded-xl font-semibold shadow-md hover:scale-105 transition`}
              >
                Register Now →
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CONTACT SECTION */}
<section
  id="contact"
  className="w-full py-20 px-6 bg-gradient-to-r from-blue-600 to-green-600 text-white text-center rounded-2xl mt-20 shadow-xl"
>
  {/* Title */}
  <h2 className="text-4xl font-bold">Have Questions?</h2>

  {/* Subtitle */}
  <p className="mt-3 text-lg opacity-90 max-w-xl mx-auto">
    Reach out to the NSS coordination team at EMEA College. We're here to help.
  </p>

  {/* Contact Button */}
  <motion.button
    whileHover={{ scale: 1.06 }}
    whileTap={{ scale: 0.95 }}
    className="mt-8 px-10 py-3 bg-white text-blue-700 font-semibold rounded-xl shadow-xl hover:bg-gray-100 transition"
  >
    Contact Us
  </motion.button>

  {/* Phone + WhatsApp */}
  <div className="mt-6 flex items-center justify-center gap-4">
    <a
      href="tel:+911234567890"
      className="text-lg hover:underline font-medium hover:text-white"
    >
      +91 12345 67890
    </a>

    <a
      href="https://wa.me/911234567890"
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white/90 p-3 rounded-full shadow-lg hover:scale-110 transition transform flex items-center justify-center"
    >
      <FaWhatsapp className="text-green-600 text-2xl" />
    </a>
  </div>
   <div className="mt-2 flex items-center justify-center gap-4">
    <a
      href="tel:+911234567890"
      className="text-lg hover:underline font-medium hover:text-white"
    >
      +91 12345 67890
    </a>

    <a
      href="https://wa.me/911234567890"
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white/90 p-3 rounded-full shadow-lg hover:scale-110 transition transform flex items-center justify-center"
    >
      <FaWhatsapp className="text-green-600 text-2xl" />
    </a>
  </div>

  {/* Small note */}
  {/* <p className="mt-6 text-white/80 text-sm">
    Available Monday – Friday, 9:00 AM to 6:00 PM IST
  </p> */}
</section>

    </div>
  );
};

export default HomePage;
