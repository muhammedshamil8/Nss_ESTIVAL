import React, { useState, useEffect } from "react";
import "./index.css";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import TresasureHuntImg from "@/assets/images/tresasurehunt.svg";
import groupdance from "@/assets/images/groupdance.svg";
import spotphotography from "@/assets/images/spotphotography.svg";
import spotreelmaking from "@/assets/images/spotreelmaking.svg";
import facepainting from "@/assets/images/facepanting.svg";
import bestvolunteer from "@/assets/images/bestvolunteer.svg";
import fashionshow from "@/assets/images/fashionshow.svg";
import FashionShowImg from "@/assets/images/fashion_show.png";
import GroupDanceImg from "@/assets/images/group_dance.png";
import SponserLogo from "@/assets/logo/sponser.webp";

const EVENTS = [
  {
    name: "Fashion Show",
    prize: "₹27,000",
    slug: "fashion-show",
    description:
      "A runway competition celebrating style, creativity, coordination, and confident presentation.",
    img: fashionshow,
    emoji: (
      <img
        src={FashionShowImg}
        alt="Fashion Show"
        className="w-full h-full object-cover rounded-lg p-2"
      />
    ),
    arrow: (
      <svg
        width="65"
        height="65"
        viewBox="0 0 65 65"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="32.5" cy="32.5" r="32.5" fill="#22635B" />
        <path
          d="M36.0197 27.4153L23.4679 39.9671L25.5303 42.0295L38.0821 29.4777L38.0821 40.5404L40.9983 40.5404V24.4991H24.957L24.957 27.4153H36.0197Z"
          fill="white"
        />
      </svg>
    ),
    color: "bg-purple-600",
  },
  {
    name: "Group Dance",
    prize: "₹27,000",
    slug: "group-dance",
    description:
      "A high-energy team performance event showcasing choreography, rhythm, and synchronized teamwork.",
    img: groupdance,
    emoji: (
      <img
        src={GroupDanceImg}
        alt="Group Dance"
        className="w-full h-full object-cover rounded-lg p-3"
      />
    ),
    arrow: (
      <svg
        width="65"
        height="65"
        viewBox="0 0 65 65"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="32.5" cy="32.5" r="32.5" fill="#A41E2B" />
        <path
          d="M36.0197 27.4153L23.4679 39.9671L25.5303 42.0295L38.0821 29.4777L38.0821 40.5404L40.9983 40.5404V24.4991H24.957L24.957 27.4153H36.0197Z"
          fill="white"
        />
      </svg>
    ),
    color: "bg-cyan-600",
  },
  {
    name: "Best Volunteer",
    prize: "₹21,000",
    slug: "best-volunteer",
    description:
      "An excellence award recognizing outstanding leadership, service, discipline, and NSS contribution.",
    img: bestvolunteer,
    emoji: "⭐",
    arrow: (
      <svg
        width="65"
        height="65"
        viewBox="0 0 65 65"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="32.5" cy="32.5" r="32.5" fill="#1667B0" />
        <path
          d="M36.0197 27.4153L23.4679 39.9671L25.5303 42.0295L38.0821 29.4777L38.0821 40.5404L40.9983 40.5404V24.4991H24.957L24.957 27.4153H36.0197Z"
          fill="white"
        />
      </svg>
    ),
    color: "bg-orange-600",
  },
  {
    name: "Treasure Hunt",
    prize: "₹17,000",
    slug: "treasure-hunt",
    img: TresasureHuntImg,
    description:
      "A competitive hunt where teams follow clues and complete challenges to find the hidden treasure.",

    emoji: "🗺️",
    arrow: (
      <svg
        width="65"
        height="65"
        viewBox="0 0 65 65"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="32.5" cy="32.5" r="32.5" fill="#D9B44F" />
        <path
          d="M36.0197 27.4153L23.4679 39.9671L25.5303 42.0295L38.0821 29.4777L38.0821 40.5404L40.9983 40.5404V24.4991H24.957L24.957 27.4153H36.0197Z"
          fill="white"
        />
      </svg>
    ),
    color: "bg-teal-600",
  },
  {
    name: "Spot Photography",
    prize: "₹10,000",
    slug: "spot-photography",
    arrow: (
      <svg
        width="65"
        height="65"
        viewBox="0 0 65 65"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="32.5" cy="32.5" r="32.5" fill="#22635B" />
        <path
          d="M36.0197 27.4153L23.4679 39.9671L25.5303 42.0295L38.0821 29.4777L38.0821 40.5404L40.9983 40.5404V24.4991H24.957L24.957 27.4153H36.0197Z"
          fill="white"
        />
      </svg>
    ),
    description:
      "A time-bound photography event where participants capture compelling moments based on a given theme.",
    img: spotphotography,
    emoji: "📸",
    color: "bg-purple-600",
  },
  {
    name: "Spot Reel Making",
    prize: "₹10,000",
    slug: "spot-reel-making",
    description:
      "A real-time reel-making event testing creativity, concept, and execution within a limited time.",
    img: spotreelmaking,
    emoji: "🎬",
    arrow: (
      <svg
        width="65"
        height="65"
        viewBox="0 0 65 65"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="32.5" cy="32.5" r="32.5" fill="#A41E2B" />
        <path
          d="M36.0197 27.4153L23.4679 39.9671L25.5303 42.0295L38.0821 29.4777L38.0821 40.5404L40.9983 40.5404V24.4991H24.957L24.957 27.4153H36.0197Z"
          fill="white"
        />
      </svg>
    ),
    color: "bg-pink-600",
  },
  {
    name: "Face Painting",
    prize: "₹10,000",
    slug: "face-painting",
    description:
      "A visually creative contest focused on skillful face art and thematic presentation.",
    img: facepainting,
    emoji: "🎨",
    arrow: (
      <svg
        width="65"
        height="65"
        viewBox="0 0 65 65"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="32.5" cy="32.5" r="32.5" fill="#1667B0" />
        <path
          d="M36.0197 27.4153L23.4679 39.9671L25.5303 42.0295L38.0821 29.4777L38.0821 40.5404L40.9983 40.5404V24.4991H24.957L24.957 27.4153H36.0197Z"
          fill="white"
        />
      </svg>
    ),
    color: "bg-fuchsia-600",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fade = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

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

  const valuesArray = () => {
    const { days, hours, minutes, seconds } = timeLeft;
    return [days, hours, minutes, seconds];
  };
  return (
    <motion.div
      className="w-full min-h-screen"
      initial="hidden"
      animate="show"
      variants={staggerContainer}
    >

      <motion.section
        id="home"
        variants={fadeUp}
        className="relative mx-auto w-full px-4  flex items-center justify-center overflow-hidden "
        style={{
          background: '#E5F2FF url("/bg.svg")',
          bakgroundRepeat: "no-repeat",
          backgrockgroundSize: "cover",
          bacundPosition: "center",
        }}
      >
        <div className="text-center mt-24 ">
          <motion.img
            src={"./estival_logo_.png"}
            alt="Estival Logo"
            className="max-h-48 mx-auto mb-1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <div className="bg-[#005AAB] w-1/2 text-white rounded-full text-[10px] sm:text-sm py-1 sm:py-[] mt-2 mx-auto mb-5 max-w-[240px]">
            2025 DECEMBER 17,18
          </div>

          <a
            href="https://mymelova.com/"
            target="_blank"
            className="flex flex-col items-center items-center justify-center gap-2 mx-auto"
          >
            <img
              src={SponserLogo}
              alt="Sponsor Logo"
              className="h-10 sm:h-14"
            />
            <span className="text-sm text-gray-700 -mt-6 font-semibold -rotate-[8deg]">
              Sponsered by
            </span>
          </a>

          <motion.div
            variants={scaleIn}
            className="flex items-center justify-center relative z-20 py-6"
          >
            <motion.div
              className="grid grid-cols-4 bg-white shadow-lg shadow-blue-50 rounded-3xl"
              layout
            >
              {["DAYS", "HRS", "MIN", "SEC"].map((text, i) => {
                const value = valuesArray()[i];
                const padded = String(value).padStart(2, "0");
                return (
                  <div
                    key={i}
                    className={`px-4 sm:px-8 py-6 text-center ${
                      i !== 0 ? "border-l border-gray-100" : ""
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={padded}
                        initial={{ opacity: 0, y: -12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.98 }}
                        transition={{ duration: 0.28, ease: "easeOut" }}
                        className="text-2xl md:text-4xl text-[#005AAB] font-mono tabular-nums w-12 mx-auto text-center font-black"
                      >
                        {padded}
                      </motion.p>
                    </AnimatePresence>

                    <p className="text-xs font-semibold tracking-wider text-[#005AAB] mt-1">
                      {text}
                    </p>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        id="about"
        variants={fadeUp}
        className="w-full pt-20 px-6 md:px-12 lg:px-20 bg-white -mt-16 relative z-10"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              <span className="text-[#005ABB]">About Estival</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto mt-8 text-center text-gray-700 text-sm md:text-base leading-relaxed"
          >
            <span className="font-bold text-blue-700 ">Estival 2K25</span> is a{" "}
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
            <div className="bg-[#005AAB] border rounded-2xl px-3 py-4 md:px-10 md:py-4 flex flex-col items-center">
              <p className="text-sm md:text-2xl font-bold text-white ">
                {"4000+"}
              </p>
              <p className="text-xs font-semibold tracking-wider text-white mt-1">
                {"Participants"}
              </p>
            </div>
            <div className="bg-[#17776B] border rounded-2xl py-4 px-4 md:px-12 md:py-4 flex flex-col items-center">
              <p className="text-sm md:text-2xl font-bold text-white text-nowrap">
                {"7"}
              </p>
              <p className="text-xs font-semibold tracking-wider text-white mt-1 text-nowrap">
                {"Major Events"}
              </p>
            </div>
            <div className="bg-[#A41E2B] border rounded-2xl px-6 py-4 md:px-8 md:py-4 flex flex-col items-center">
              <p className="text-sm md:text-2xl font-bold text-white text-nowrap">
                {"₹3 Lakh+"}
              </p>
              <p className="text-xs font-semibold tracking-wider text-white mt-1 text-nowrap">
                {"Total Price"}
              </p>
            </div>
          </div>
        </div>
      </motion.section>
      <div
        className="pb-[160px]"
        style={{
          background: '#E5F2FF url("/bg.svg")',
          bakgroundRepeat: "no-repeat",
          backgrockgroundSize: "cover",
          bacundPosition: "center",
        }}
      >
        <section className="h-12 mt-12">
          <div className="marguee_rotate_1 absolute z-10  w-[150%] sm:w-[110%] -left-10 -right-4 h-10 bg-[#E2BC5F] py-2  text-black uppercase flex items-center ">
            {[...Array(20)].map((_, i) => (
              <p key={i} className="flex  items-center justify-center">
                <span className="h-2 w-2 rounded-full bg-[#111] mx-5" />
                <span className="whitespace-nowrap">{`REGISTER NOW`}</span>
              </p>
            ))}
          </div>
          <div className="absolute  w-[150%] sm:w-[110%] -left-10 -right-4 h-10 bg-[#E2BC5F] py-2 -rotate-[6deg] sm:-rotate-[3deg] text-black uppercase flex items-center ">
            {[...Array(10)].map((_, i) => (
              <p key={i} className="flex  items-center justify-center">
              </p>
            ))}
          </div>
          <div className="marguee_rotate_2 z-30 absolute w-[150%] sm:w-[110%] -left-10 -right-4 h-10 bg-[#17776B] py-2  text-white uppercase flex items-center">
            {[...Array(20)].map((_, i) => (
              <p key={i} className="flex items-center justify-center">
                <span className="h-2 w-2 rounded-full bg-[#fff] mx-5" />
                <span className="whitespace-nowrap">{`REGISTER NOW`}</span>
              </p>
            ))}
          </div>
          <div className="absolute w-[150%] z-20  sm:w-[110%] -left-10 -right-4 h-10 bg-[#17776B] py-2 rotate-[4deg] sm:rotate-[3deg] text-white uppercase flex items-center">
            {[...Array(10)].map((_, i) => (
              <p key={i} className="flex items-center justify-center">
              </p>
            ))}
          </div>
        </section>

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
                <span className="text-red-800">Events & Competitionsd</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Choose your arena and showcase your talent
              </p>
              <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mt-4"></div>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-3 px-4 mt-12 ">
              {EVENTS.map((event, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ scale: 1.03, translateY: -8 }}
                  onClick={() => openEvent(event.slug)}
                  onMouseEnter={() => setHoveredEvent(idx)}
                  onMouseLeave={() => setHoveredEvent(null)}
                  className={`relative bg-white p-3 md:p-6 rounded-3xl shadow-xl border border-gray-200 flex flex-col items-start text-left transition-all duration-300 hover:shadow-2xl group
      ${idx === EVENTS.length - 1 ? "md:col-start-2" : ""}`}
                >
                  {/* EVENT NAME */}
                  <p className="text-base sm:text-base md:text-base font-semibold self-start text-nowrap">
                    {event.name}
                  </p>

                  {/* FASHION ICON (MOVE TO RIGHT TOP) */}
                  {React.cloneElement(event.arrow, {
                    className: "absolute -top-3 right-2 w-8 sm:w-6 md:w-8",
                  })}
                  {/* EVENT DESCRIPTION */}
                  <p className="mt-4 text-xs md:text-xs text-gray-600 flex-grow">
                    {event.description}
                  </p>
                  {/* MAIN EVENT IMAGE */}

                  <img src={event.img} alt="" className="" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <section id="contact" className="w-full py-4 px-4 -mt-48 pb-10">
        <div
          className="max-w-[90%] sm:max-w-3xl mx-auto rounded-3xl   bg-[#17776B] py-12 px-6 md:px-12 text-white"
          style={{
            background: '#17776B url("/bg.svg")',
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
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
              <h3 className="text-sm md:text-xl font-bold underline mb-4">
                NSS Secretary
              </h3>

              {/* Person 1 */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium">Danish</span>
                <a
                  href="tel:+918129908602"
                  className="hover:text-white transition"
                >
                  +91 81299 08602
                </a>
              </div>

              {/* Person 2 */}
              <div className="flex items-center justify-between">
                <span className="font-medium">Fathima Saniya</span>
                <a
                  href="tel:+919633650566"
                  className="hover:text-white transition"
                >
                  +91 96336 50566
                </a>
              </div>
            </div>

            {/* Program Officer */}
            <div>
              <h3 className="text-sm md:text-xl font-bold underline mb-4">
                Program Officer
              </h3>

              {/* Person 1 */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium">Munavar Jazim</span>
                <a
                  href="tel:+918089869477"
                  className="hover:text-white transition"
                >
                  +91 80898 69477
                </a>
              </div>

              {/* Person 2 */}
              <div className="flex items-center justify-between">
                <span className="font-medium">Mubashir K</span>
                <a
                  href="tel:+919961624530"
                  className="hover:text-white transition"
                >
                  +91 99616 24530
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>


    </motion.div>
  );
};

export default HomePage;
