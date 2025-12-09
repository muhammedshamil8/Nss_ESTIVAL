import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import HERO from "@/assets/logo/Estival.jpg";
import {
  FaWhatsapp,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";
import FashionShowImg from "@/assets/images/fashion_show.png";
import GroupDanceImg from "@/assets/images/group_dance.png";
import { desc } from "motion/react-client";

const EVENTS = [
  {
    name: "Fashion Show",
    prize: "₹27,000",
    slug: "fashion-show",
    description: "A runway competition celebrating style, creativity, coordination, and confident presentation.",
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
    prize: "₹27,000",
    slug: "group-dance",
    description: "A high-energy team performance event showcasing choreography, rhythm, and synchronized teamwork.",
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
    prize: "₹21,000",
    slug: "best-volunteer",
    description: "An excellence award recognizing outstanding leadership, service, discipline, and NSS contribution.",
    emoji: "⭐",
    color: "from-yellow-500 to-orange-600",
  },
  {
    name: "Treasure Hunt",
    prize: "₹17,000",
    slug: "treasure-hunt",
    description: "A competitive hunt where teams follow clues and complete challenges to find the hidden treasure.",

    emoji: "🗺️",
    color: "from-green-500 to-teal-600",
  },
  {
    name: "Spot Photography",
    prize: "₹10,000",
    slug: "spot-photography",
    description: "A time-bound photography event where participants capture compelling moments based on a given theme.",

    emoji: "📸",
    color: "from-indigo-500 to-purple-600",
  },
  {
    name: "Spot Reel Making",
    prize: "₹10,000",
    slug: "spot-reel-making",
    description: "A real-time reel-making event testing creativity, concept, and execution within a limited time.",

    emoji: "🎬",
    color: "from-red-500 to-pink-600",
  },
  {
    name: "Face Painting",
    prize: "₹10,000",
    slug: "face-painting",
    description: "A visually creative contest focused on skillful face art and thematic presentation.",

    emoji: "🎨",
    color: "from-violet-500 to-fuchsia-600",
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const eventDate = new Date("December 17, 2025 09:00:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = eventDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const openEvent = (slug) => {
    // document.documentElement.scrollIntoView({ top: 0, behavior: "smooth" });
    //  window.scrollTo(0, 0);
    const id = "event";
    navigate(`/register/${slug}`);
    // setTimeout(() => {
    //   document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    // }, 150);

  };

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="w-full min-h-screen ">
      {/* HERO SECTION */}
      <section
        id="home"
        className="w-full min-h-[85vh] flex flex-col-reverse md:flex-row items-center justify-between py-12 md:py-16 px-6 md:px-12 lg:px-20 gap-8 md:gap-10 relative overflow-hidden"
      >
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-green-100 rounded-full opacity-30 blur-3xl"></div>
        </div>

        {/* LEFT TEXT */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 max-w-2xl"
        >
          {/* Countdown Timer */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg mb-4">
              <FaCalendarAlt className="text-blue-600" />
              <span className="text-blue-700 font-semibold">
                December 17,18 - 2024
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold text-gray-600 flex items-center gap-2">
                <FaClock className="text-blue-500" />
                Countdown to Estival 2K25
              </h2>
              <div className="flex gap-3 md:gap-4">
                {Object.entries(timeLeft).map(([unit, value], index) => (
                  <div key={unit} className="flex-1">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-3 md:p-4 rounded-xl text-center shadow-lg">
                      <div className="text-2xl md:text-3xl font-bold">
                        {value.toString().padStart(2, "0")}
                      </div>
                      <div className="text-xs md:text-sm uppercase tracking-wider opacity-90 mt-1">
                        {unit}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight"
          >
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 bg-clip-text text-transparent">
              ESTIVAL 2K25
            </span>
          </motion.h1>

          <div className="flex items-center gap-3 mt-4 text-green-700 font-semibold text-lg">
            <FaMapMarkerAlt className="text-green-600" />
            <p>NSS State Fest • EMEA College, Kondotty</p>
          </div>

          <p className="mt-6 text-gray-700 text-lg md:text-xl leading-relaxed max-w-xl">
            A vibrant celebration of creativity, teamwork, and youth
            leadership—bringing NSS volunteers across Kerala together on one
            grand platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollTo("events")}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg font-bold text-lg hover:shadow-xl transition-all duration-300"
            >
              Explore Events
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollTo("about")}
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300"
            >
              About Fest
            </motion.button>
          </div>
        </motion.div>

        {/* HERO IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="flex-1 flex justify-center relative"
        >
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-green-400 rounded-3xl blur-2xl opacity-30 -z-10" />
            <img
              src={HERO}
              alt="Estival Hero"
              className="relative w-full max-w-[500px] rounded-3xl shadow-2xl border-8 border-white"
            />

            {/* Floating Badge */}
            <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-xl shadow-2xl font-bold">
              Starts at 9:00 AM
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ABOUT SECTION */}
      <section
        id="about"
        className="w-full py-20 px-6 md:px-12 lg:px-20 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                About Estival
              </span>
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-green-600 rounded-full mx-auto"></div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto mt-8 text-center text-gray-700 text-lg md:text-xl leading-relaxed"
          >
            <span className="font-bold text-blue-700">Estival 2K25</span> is a{" "}
            <span className="font-semibold text-blue-700">
              state-level NSS Fest
            </span>{" "}
            hosted by{" "}
            <span className="font-semibold text-green-700">
              EMEA College, Kondotty
            </span>
            . With participation from volunteers across Kerala, the fest aims to
            foster leadership, cultural appreciation, creativity, and a spirit
            of community service through exciting competitions and cultural
            events.
          </motion.p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">
            {[
              { value: "4000+", label: "Expected Participants", icon: "👥" },
              { value: "7", label: "Major Events", icon: "🏆" },
              { value: "₹3 Lakh+", label: "Total Prize Pool", icon: "💰" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ scale: 1.05, translateY: -5 }}
                className="bg-gradient-to-br from-white to-blue-50 p-8 text-center rounded-2xl shadow-xl border border-blue-100 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-green-600"></div>
                <div className="text-5xl mb-4">{stat.icon}</div>
                <p className="text-4xl font-black bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-gray-600 text-lg mt-2 font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS SECTION */}
      <section
        id="events"
        className="w-full py-24 px-6 md:px-12 lg:px-20 "
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Events & Competitions
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Choose your arena and showcase your talent
            </p>
            <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mt-4"></div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {EVENTS.map((event, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ scale: 1.03, translateY: -8 }}
                onMouseEnter={() => setHoveredEvent(idx)}
                onMouseLeave={() => setHoveredEvent(null)}
                className="relative bg-white p-6 rounded-3xl shadow-xl border border-gray-200 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl group"
              >
                {/* Prize Badge */}
                <div
                  className={`absolute -top-4 -right-4 bg-gradient-to-r ${event.color} text-white px-5 py-2.5 rounded-xl shadow-lg font-bold text-sm z-10`}
                >
                  🏆 {event.prize}
                </div>

                {/* Icon Container */}
                <div
                  className={`w-24 h-24 bg-gradient-to-br ${event.color} rounded-2xl flex items-center justify-center shadow-xl text-4xl text-white mb-6 overflow-hidden group-hover:scale-110 transition-transform duration-300`}
                >
                  {event.emoji}
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {event.name}
                </h3>
                <p className="text-gray-600 mb-6">
                  {event.description}
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openEvent(event.slug)}
                  className={`w-full py-3.5 bg-gradient-to-r ${event.color} text-white rounded-xl font-bold shadow-md hover:shadow-xl transition-all duration-300`}
                >
                  Register Now →
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section
        id="contact"
        className="w-full rounded-xl py-20 px-6 bg-gradient-to-r from-blue-600 via-blue-500 to-green-600 text-white"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Have Questions?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Reach out to the NSS coordination team at EMEA College. We're here
              to help you.
            </p>
            <div className="w-24 h-1.5 bg-white/50 rounded-full mx-auto mt-4"></div>
          </motion.div>

          {/* Contact Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-16"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => scrollTo("contact")}
              className="px-12 py-4 bg-white text-blue-700 font-bold text-lg rounded-2xl shadow-2xl hover:bg-gray-50 transition-all duration-300"
            >
              Contact Us
            </motion.button>
          </motion.div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* NSS Secretary Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20"
            >
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2 text-white">
                  NSS Secretary
                </h3>
                <div className="w-16 h-1 bg-white/50 rounded-full"></div>
              </div>

              <div className="space-y-8">
                {/* Danish */}
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold">Danish</h4>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <a
                      href="tel:+918129908602"
                      className="text-lg hover:text-white transition-colors duration-300 flex items-center gap-3"
                    >
                      <span className="p-2 bg-white/20 rounded-lg">📞</span>
                      <span>+91 81299 08602</span>
                    </a>
                    <a
                      href="https://wa.me/918129908602"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/90 p-4 rounded-full shadow-xl hover:scale-110 transition-transform duration-300 hover:shadow-2xl"
                    >
                      <FaWhatsapp className="text-green-600 text-3xl" />
                    </a>
                  </div>
                </div>

                {/* Fathima Saniya */}
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold">Fathima Saniya</h4>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <a
                      href="tel:+919633650566"
                      className="text-lg hover:text-white transition-colors duration-300 flex items-center gap-3"
                    >
                      <span className="p-2 bg-white/20 rounded-lg">📞</span>
                      <span>+91 96336 50566</span>
                    </a>
                    <a
                      href="https://wa.me/919633650566"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/90 p-4 rounded-full shadow-xl hover:scale-110 transition-transform duration-300 hover:shadow-2xl"
                    >
                      <FaWhatsapp className="text-green-600 text-3xl" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Program Officer Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20"
            >
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2 text-white">
                  Program Officer
                </h3>
                <div className="w-16 h-1 bg-white/50 rounded-full"></div>
              </div>

              <div className="space-y-8">
                {/* Munavar Jazim */}
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold">Munavar Jazim</h4>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <a
                      href="tel:+918089869477"
                      className="text-lg hover:text-white transition-colors duration-300 flex items-center gap-3"
                    >
                      <span className="p-2 bg-white/20 rounded-lg">📞</span>
                      <span>+91 80898 69477</span>
                    </a>
                    <a
                      href="https://wa.me/918089869477"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/90 p-4 rounded-full shadow-xl hover:scale-110 transition-transform duration-300 hover:shadow-2xl"
                    >
                      <FaWhatsapp className="text-green-600 text-3xl" />
                    </a>
                  </div>
                </div>

                {/* Mubashir K */}
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold">Mubashir K</h4>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <a
                      href="tel:+919961624530"
                      className="text-lg hover:text-white transition-colors duration-300 flex items-center gap-3"
                    >
                      <span className="p-2 bg-white/20 rounded-lg">📞</span>
                      <span>+91 99616 24530</span>
                    </a>
                    <a
                      href="https://wa.me/919961624530"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/90 p-4 rounded-full shadow-xl hover:scale-110 transition-transform duration-300 hover:shadow-2xl"
                    >
                      <FaWhatsapp className="text-green-600 text-3xl" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer Info */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 pt-8 border-t border-white/20 text-center"
          >
            <p className="text-white/90 text-lg">
              For general inquiries, email us at:{" "}
              <a
                href="mailto:nss@emecollege.edu.in"
                className="font-bold hover:text-white transition-colors duration-300 underline"
              >
                nss@emecollege.edu.in
              </a>
            </p>
            <p className="mt-3 text-white/70">
              Available Monday to Friday, 9:00 AM - 5:00 PM
            </p>
            <p className="mt-6 text-white/80 font-semibold">
              December 18, 2024 • EMEA College, Kondotty
            </p>
          </motion.div> */}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
