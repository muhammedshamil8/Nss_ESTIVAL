import React, { useState, useEffect } from "react";
import './index.css'
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
    description:
      "A runway competition celebrating style, creativity, coordination, and confident presentation.",
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
    description:
      "A high-energy team performance event showcasing choreography, rhythm, and synchronized teamwork.",
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
    description:
      "An excellence award recognizing outstanding leadership, service, discipline, and NSS contribution.",
    emoji: "⭐",
    color: "from-yellow-500 to-orange-600",
  },
  {
    name: "Treasure Hunt",
    prize: "₹17,000",
    slug: "treasure-hunt",
    description:
      "A competitive hunt where teams follow clues and complete challenges to find the hidden treasure.",

    emoji: "🗺️",
    color: "from-green-500 to-teal-600",
  },
  {
    name: "Spot Photography",
    prize: "₹10,000",
    slug: "spot-photography",
    description:
      "A time-bound photography event where participants capture compelling moments based on a given theme.",

    emoji: "📸",
    color: "from-indigo-500 to-purple-600",
  },
  {
    name: "Spot Reel Making",
    prize: "₹10,000",
    slug: "spot-reel-making",
    description:
      "A real-time reel-making event testing creativity, concept, and execution within a limited time.",

    emoji: "🎬",
    color: "from-red-500 to-pink-600",
  },
  {
    name: "Face Painting",
    prize: "₹10,000",
    slug: "face-painting",
    description:
      "A visually creative contest focused on skillful face art and thematic presentation.",

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
    window.scrollTo({ top: 0, behavior: "instant" });
    navigate(`/register/${slug}`);
  };

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="w-full min-h-screen ">
      {/* HERO SECTION */}
    
          <section
        id="home"
        className="relative w-full px-4 min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Image */}
        <img
          src="/bg.svg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover -z-10"
        />

        {/* HEADER — floating on top of image */}
        

        {/* HERO CONTENT BELOW HEADER */}
        <div className="text-center ">
          <motion.img
            src={HERO}
            alt="Estival Logo"
            className=" h-48 mx-auto mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
         <div className="bg-blue-500 text-white rounded-full text-sm py-2 ">2025 DECEMBER 17,18</div>
         <div className="flex items-center justify-center mt-20">
        <div className="grid grid-cols-4 bg-white shadow-lg rounded-3xl overflow-hidden">
          
          {["DAYS","HRS","MIN","SEC"].map((text, i) => (
        <div
          key={i}
          className={`px-8 py-6 text-center w-24 ${i !== 0 ? "border-l border-gray-200" : ""}`}
        >
          <p className="text-3xl md:text-4xl font-bold text-blue-700 text-nowrap">
            {Object.values(timeLeft)[i]}
          </p>
          <p className="text-xs font-semibold tracking-wider text-blue-700 mt-1">
            {text}
          </p>
        </div>
      ))}

        </div>
      </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section
        id="about"
        className="w-full py-20 px-6 md:px-12 lg:px-20 bg-white "
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
          <div className="flex items-center justify-center gap-1 md:gap-10 mt-5">

          <div className="bg-blue-800 border rounded-3xl p-3 md:px-5 flex flex-col items-center">
             <p className="text-xl md:text-4xl font-bold text-white ">
            {"4000+"}
          </p>
          <p className="text-xs font-semibold tracking-wider text-white mt-1">
            {"Participants"}
          </p>
          </div>
          <div className="bg-green-800 border rounded-3xl py-3 px-4 md:px-12 md:py-3 flex flex-col items-center">
             <p className="text-xl md:text-4xl font-bold text-white text-nowrap">
            {"7"}
          </p>
          <p className="text-xs font-semibold tracking-wider text-white mt-1 text-nowrap">
            {"Major Events"}
          </p>
          </div>
          <div className="bg-red-800 border rounded-3xl p-3 md:px-5 flex flex-col items-center">
             <p className="text-xl md:text-4xl font-bold text-white text-nowrap">
            {"₹3 Lakh+"}
          </p>
          <p className="text-xs font-semibold tracking-wider text-white mt-1">
            {"Total Price"}
          </p>
          </div>
          </div>
          {/* Stats */}
          
        </div>
      </section>

     

      {/* EVENTS SECTION */}
      <section id="events" className="w-full py-24 px-6 md:px-12 lg:px-20 ">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              <span className="text-red-800">
                Events & Competitionsd
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
                <p className="text-gray-600 mb-6">{event.description}</p>

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
      <section id="contact" className="w-full py-4 px-4">
  <div className="max-w-[90%] sm:max-w-3xl mx-auto rounded-3xl border-[6px] border-[#0B4E63] bg-[#17776B] py-12 px-6 md:px-12 text-white">

    {/* Title */}
    <div className="text-center mb-8">
      <h2 className="md:text-3xl font-bold mb-3">Have Questions?</h2>
      <p className="text-sm opacity-90 md:text-base">
        Reach out to the NSS coordination team at EMEA College.
        <br /> We're here to help you.
      </p>
    </div>

    {/* Contact Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

      {/* NSS Secretary */}
      <div>
        <h3 className="text-xl font-bold underline mb-4">NSS Secretary</h3>

        {/* Person 1 */}
        <div className="flex items-center justify-between mb-4">
          <span className="font-medium">Danish</span>
          <a href="tel:+918129908602" className="hover:text-white transition">
            +91 81299 08602
          </a>
        </div>

        {/* Person 2 */}
        <div className="flex items-center justify-between">
          <span className="font-medium">Fathima Saniya</span>
          <a href="tel:+919633650566" className="hover:text-white transition">
            +91 96336 50566
          </a>
        </div>
      </div>

      {/* Program Officer */}
      <div>
        <h3 className="text-xl font-bold underline mb-4">Program Officer</h3>

        {/* Person 1 */}
        <div className="flex items-center justify-between mb-4">
          <span className="font-medium">Munavar Jazim</span>
          <a href="tel:+918089869477" className="hover:text-white transition">
            +91 80898 69477
          </a>
        </div>

        {/* Person 2 */}
        <div class="flex items-center justify-between">
          <span className="font-medium">Mubashir K</span>
          <a href="tel:+919961624530" className="hover:text-white transition">
            +91 99616 24530
          </a>
        </div>
      </div>

    </div>
  </div>
</section>

      {/* CONTACT SECTION */}
      
    </div>
  );
};

export default HomePage;
