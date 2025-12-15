import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { message } from "antd";
import { EVENTS } from "@/data/eventConfig";
import { supabase } from "@/libs/createClient";
import { FaCheckCircle } from "react-icons/fa";
import { Copy, Users } from "lucide-react";

const Register = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const event = EVENTS[slug];

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isRulesExpanded, setIsRulesExpanded] = useState(false);

  const [form, setForm] = useState({
    college: "",
    officer: "",
    officerPhone: "",
    unit_number: "",
    participants: [], // will be objects: { name, phone }
    receipt: null, // optional File
  });

  useEffect(() => {
    // This ensures we're at top after component mounts
    const timer = setTimeout(() => {
      if (window.scrollY > 0) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Initialize with minimum required participants
    if (event) {
      setForm((prev) => {
        // Start with minimum required participants
        const initialParticipants = Array.from({
          length: event.minparticipants,
        }).map((_, i) => prev.participants[i] || { name: "", phone: "" });
        return {
          ...prev,
          participants: initialParticipants,
        };
      });

      // Default to collapsed on mobile, expanded on desktop
      if (window.innerWidth > 768) {
        setIsRulesExpanded(true);
      }
    }

    // Cleanup preview URL on unmount
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, event]);

  if (!event) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <div className="text-6xl mb-4">❌</div>
        <p className="text-2xl font-bold text-red-600">Invalid event</p>
        <p className="text-gray-600 mt-2">
          Please select a valid event to register.
        </p>
      </div>
    );
  }

  const setValue = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const setParticipant = (index, field, value) => {
    setForm((prev) => {
      const participants = [...prev.participants];
      participants[index] = { ...(participants[index] || {}), [field]: value };
      return { ...prev, participants };
    });
  };

  const handleReceiptChange = (file) => {
    if (!file) return;
    // revoke old preview
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    setValue("receipt", file);
  };

  const uploadReceipt = async (file) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `receipt-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("estival")
        .upload(fileName, file, { cacheControl: "3600", upsert: true });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return null;
      }

      const { data } = supabase.storage.from("estival").getPublicUrl(fileName);
      return data?.publicUrl || null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const validateForm = () => {
    if (slug === "next-talk") {
      if (!form.college?.trim()) {
        message.warning("Please fill the college field");
      }
    } else {
      if (
        !form.college?.trim() ||
        !form.officer?.trim() ||
        !form.officerPhone?.trim()
      ) {
        message.warning("Please fill the college and program officer details.");
        return false;
      }
      if (form.unit_number.trim() === "") {
        message.warning("Please fill the Unit Number.");
        return false;
      }
    }

    // Check if we have at least the minimum required participants
    if (form.participants.length < event.minparticipants) {
      message.warning(
        `Minimum ${event.minparticipants} participant(s) required. You have ${form.participants.length}.`
      );
      return false;
    }

    // Check all participants are filled
    const allFilled = form.participants.every(
      (p) => p && p.name?.trim() && p.phone?.trim()
    );
    if (!allFilled) {
      message.warning(
        `Please fill name and phone for all ${form.participants.length} participant(s).`
      );
      return false;
    }

    return true;
  };

  const submit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    let receipt_url = null;

    if (form.receipt) {
      const uploadedUrl = await uploadReceipt(form.receipt);
      if (!uploadedUrl) {
        // allow continuing without receipt (per your earlier instruction) but warn
        message.warning(
          "Receipt upload failed — proceeding without receipt (you can upload later)."
        );
      } else {
        receipt_url = uploadedUrl;
      }
    }

    // prepare payload
    const payload = {
      event_slug: slug,
      event_name: event.title,
      college: form.college,
      officer: form.officer,
      officer_phone: form.officerPhone,
      unit_number: form.unit_number,
      participants: form.participants,
      receipt_url: receipt_url || null,
      payment_verified: "pending",
    };

    try {
      const { error } = await supabase.from("registrations").insert(payload);

      setLoading(false);

      if (error) {
        console.error("Supabase insert error:", error);
        message.error("Registration failed. Try again or contact admin.");
        return;
      }

      message.success("Registration successful!");
      setSubmitted(true);
      setIsRulesExpanded(false); // Collapse rules after submission

      // reset form
      setForm({
        college: "",
        officer: "",
        officerPhone: "",
        unit_number: "",
        participants: Array.from({ length: event.participants }).map(() => ({
          name: "",
          phone: "",
        })),
        receipt: null,
      });
      if (preview) {
        URL.revokeObjectURL(preview);
        setPreview(null);
      }

      // auto-redirect home after short delay
      setTimeout(() => navigate("/"), 2200);
    } catch (err) {
      console.error(err);
      setLoading(false);
      message.error("An error occurred. Try again.");
    }
  };

  // success screen
  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center mt-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-10 shadow-2xl border-2 border-blue-50"
        >
          <div className="text-6xl text-green-500 mb-4">
            <FaCheckCircle />
          </div>
          <h2 className="text-3xl font-bold text-blue-700 mb-2">
            Registration Successful
          </h2>
          <p className="text-gray-600 mb-4">
            Thank you — we received your registration for{" "}
            <span className="font-semibold text-gray-800">{event.title}</span>.
          </p>
          <p className="text-sm text-gray-500">
            A confirmation will be sent to the program officer. Redirecting to
            home...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.9,
        ease: "easeOut",
      }}
      className=" mx-auto py-10 px-4 sm:px-6 lg:px-8 pt-20 bg-[#E5F2FF]"
      id="event"
    >
      <div className="max-w-[1000px] mx-auto">
        <div className="w-full bg-[#eaf4ff] rounded-3xl mb-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-blue-100 flex flex-col sm:flex-row justify-between gap-8">
            <div className="flex-grow">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                {event.title}
              </h2>

              <p className="text-gray-600 mt-2 max-w-md leading-relaxed">
                {event.description}
              </p>

              <div className="flex gap-3 mt-5 flex-wrap">
                <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium">
                  <svg
                    width="21"
                    height="22"
                    viewBox="0 0 21 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.5 10.3435H19.324L17.501 5.01046L1.854 10.3435L1.5 10.3405M1 10.3445H1.5L12.646 1.44046L15.463 5.39046"
                      stroke="#005AAB"
                      strokeWidth="2"
                      strokeLinecap="square"
                    />
                    <path
                      d="M13 15.3405C13 16.0035 12.7366 16.6394 12.2678 17.1082C11.7989 17.5771 11.163 17.8405 10.5 17.8405C9.83696 17.8405 9.20107 17.5771 8.73223 17.1082C8.26339 16.6394 8 16.0035 8 15.3405C8 14.6774 8.26339 14.0415 8.73223 13.5727C9.20107 13.1038 9.83696 12.8405 10.5 12.8405C11.163 12.8405 11.7989 13.1038 12.2678 13.5727C12.7366 14.0415 13 14.6774 13 15.3405Z"
                      stroke="#005AAB"
                      strokeWidth="2"
                      strokeLinecap="square"
                    />
                    <path
                      d="M20 10.3405V20.3405H1V10.3405H20Z"
                      stroke="#005AAB"
                      strokeWidth="2"
                      strokeLinecap="square"
                    />
                    <path
                      d="M1 10.3405H3C3 10.8709 2.78929 11.3796 2.41421 11.7547C2.03914 12.1297 1.53043 12.3405 1 12.3405V10.3405ZM20 10.3405H18C18 10.8709 18.2107 11.3796 18.5858 11.7547C18.9609 12.1297 19.4696 12.3405 20 12.3405V10.3405ZM1 20.3405H3.002C3.00226 20.0775 2.95066 19.817 2.85014 19.574C2.74963 19.331 2.60217 19.1102 2.41621 18.9242C2.23026 18.7383 2.00946 18.5908 1.76644 18.4903C1.52343 18.3898 1.26298 18.3382 1 18.3385V20.3405ZM20 20.3405H18C18 19.81 18.2107 19.3013 18.5858 18.9262C18.9609 18.5512 19.4696 18.3405 20 18.3405V20.3405Z"
                      stroke="#005AAB"
                      strokeWidth="2"
                      strokeLinecap="square"
                    />
                  </svg>
                  Per Head ₹ 50
                </span>

                <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium">
                  <Users />{" "}
                  {event.participants > 1
                    ? `${event.participants} to ${event.maxParticipants} Members`
                    : `${event.participants} Member`}
                </span>

                {slug !== "next-talk" || slug !== "fashion-show" && (
                  <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium">
                    🛡️ Only for NSS volunteers
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col min-w-[220px] justify-center  ">
              <h3 className="text-md font-semibold text-blue-700 underline mb-2">
                Coordinators
              </h3>

              <div className="mt-3 space-y-3">
                {event.coordinators.map((c, i) => (
                  <div key={i} className="flex justify-between text-gray-800">
                    <span>{c.name}</span>
                    <span className="font-medium">{c.phone}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 bg-white rounded-2xl border border-gray-100  shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-semibold text-blue-700">
              Event Rules
            </h3>
            <button
              onClick={() => setIsRulesExpanded(!isRulesExpanded)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
            >
              {isRulesExpanded ? (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                  Hide Rules
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  Show Rules
                </>
              )}
            </button>
          </div>

          <AnimatePresence initial={false}>
            {isRulesExpanded && (
              <motion.div
                key="rules-content"
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: 1,
                  height: "auto",
                  transition: {
                    height: { duration: 0.3, ease: "easeInOut" },
                    opacity: { duration: 0.2, delay: 0.1 },
                  },
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                  transition: {
                    opacity: { duration: 0.2 },
                    height: { duration: 0.3, ease: "easeInOut" },
                  },
                }}
                className="overflow-hidden"
                style={{ overflow: "hidden" }}
              >
                <div className="pt-4">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <ul className="list-disc pl-6 space-y-2">
                      {event.rules.map((r, i) => (
                        <motion.li
                          key={i}
                          className="text-gray-700"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          {r}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name of College *
            </label>
            <input
              value={form.college}
              onChange={(e) => setValue("college", e.target.value)}
              className="w-full input px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder="Enter college name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name of Program Officer {slug === "next-talk" ? "(optional)" : "*"}
            </label>
            <input
              value={form.officer}
              onChange={(e) => setValue("officer", e.target.value)}
              className="w-full input px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder="Enter program officer name"
            />
          </div>

{slug !== "next-talk" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone No of Program Officer *
            </label>
            <input
              value={form.officerPhone}
              onChange={(e) => setValue("officerPhone", e.target.value)}
              className="w-full input px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder="Enter phone number"
            />
          </div>
)}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit Number {slug === "next-talk" ? "(optional)" : "*"}
            </label>
            <input
              value={form.unit_number}
              onChange={(e) => setValue("unit_number", e.target.value)}
              className="w-full input px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder="Enter your NSS Unit Number"
            />
          </div>

          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
              <h3 className="text-xl font-semibold text-blue-700">
                Participants ({form.participants.length} of{" "}
                {event.maxParticipants})
              </h3>
            </div>

            {form.participants.length < event.minparticipants && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-700 text-sm">
                  <span className="font-medium">Note:</span> Minimum{" "}
                  {event.minparticipants} participant(s) required. Please add{" "}
                  {event.minparticipants - form.participants.length} more.
                </p>
              </div>
            )}

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              layout
              transition={{ duration: 0.3 }}
            >
              {form.participants.map((p, i) => (
                <motion.div
                  key={i}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="bg-gray-50 p-4 rounded-xl border relative"
                  data-participant={i + 1}
                >
                  {i >= event.minparticipants && (
                    <button
                      type="button"
                      onClick={() => {
                        if (form.participants.length > event.minparticipants) {
                          setForm((prev) => ({
                            ...prev,
                            participants: prev.participants.filter(
                              (_, idx) => idx !== i
                            ),
                          }));
                          message.info(`Removed participant ${i + 1}`);
                        } else {
                          message.warning(
                            `Cannot remove - minimum ${event.minparticipants} participants required`
                          );
                        }
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  )}

                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Participant Name {i + 1}{" "}
                    {i + 1 <= event.participants ? "*" : ""}
                  </label>
                  <input
                    value={p?.name || ""}
                    onChange={(e) => setParticipant(i, "name", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none"
                    placeholder="Name"
                  />

                  <label className="block text-sm font-medium text-gray-700 mt-3 mb-1">
                    Participant {i + 1} Phone{" "}
                    {i + 1 <= event.minparticipants ? "*" : ""}
                  </label>
                  <input
                    value={p?.phone || ""}
                    onChange={(e) => setParticipant(i, "phone", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none"
                    placeholder="Phone"
                  />

                  {i + 1 <= event.minparticipants && (
                    <p className="text-xs text-gray-500 mt-2">
                      Required participant
                    </p>
                  )}
                </motion.div>
              ))}
            </motion.div>

            {form.participants.length < event.maxParticipants && (
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    if (form.participants.length < event.maxParticipants) {
                      setForm((prev) => ({
                        ...prev,
                        participants: [
                          ...prev.participants,
                          { name: "", phone: "" },
                        ],
                      }));
                      message.success(
                        `Added participant ${form.participants.length + 1}`
                      );

                      setTimeout(() => {
                        const lastParticipant = document.querySelector(
                          `[data-participant="${form.participants.length}"]`
                        );
                        if (lastParticipant) {
                          lastParticipant.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                        }
                      }, 100);
                    }
                  }}
                  className="px-6 py-3 bg-[#17776B] text-white rounded-lg hover:bg-[#145A4D] transition flex items-center gap-2 shadow-md"
                >
                  <span className="text-lg">+</span> Add Participant
                </button>
              </div>
            )}

            {event.maxParticipants > 1 &&
              form.participants.length >= event.maxParticipants && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-700 text-sm">
                    Maximum {event.maxParticipants} participants reached.
                  </p>
                </div>
              )}
          </div>

          <div>
            <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center gap-4">
              <div className="flex-1 text-center sm:text-left">
                <p className="text-sm text-gray-700 flex items-center gap-2 justify-center sm:justify-start">
                  <strong>UPI ID:</strong> {event.paymentDetails.upi_id}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        event.paymentDetails.upi_id
                      );
                      message.success("UPI ID copied!");
                    }}
                    className="p-1 rounded hover:bg-gray-200 transition"
                  >
                    <Copy className="w-4 h-4 text-blue-600" />
                  </button>
                </p>

                <p className="text-sm text-gray-700 flex items-center gap-2 justify-center sm:justify-start">
                  <strong>Gpay:</strong> {event.paymentDetails.Gpay}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(event.paymentDetails.Gpay);
                      message.success("Gpay number copied!");
                    }}
                    className="p-1 rounded hover:bg-gray-200 transition"
                  >
                    <Copy className="w-4 h-4 text-blue-600" />
                  </button>
                </p>
              </div>

              <div>
                <img
                  src={event.paymentDetails.qrcode}
                  alt="QR"
                  className="w-40 sm:w-48 h-auto rounded-lg shadow object-contain"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Payment Screenshot (optional)
              </label>

              <label className="cursor-pointer block">
                <div className="w-full h-44 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50 flex items-center justify-center overflow-hidden">
                  {preview ? (
                    <img
                      src={preview}
                      alt="preview"
                      className="h-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-blue-700 px-6">
                      <p className="font-medium">
                        Click to upload payment screenshot
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        PNG/JPG (max 4MB)
                      </p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    if (file.size > 4 * 1024 * 1024) {
                      message.error("File too large. Max 4MB.");
                      return;
                    }
                    handleReceiptChange(file);
                  }}
                />
              </label>
            </div>
          </div>

          <div>
            <button
              onClick={submit}
              disabled={loading}
              className="w-full bg-[#005AAB] text-white py-3 rounded-xl text-lg font-semibold shadow hover:bg-[#004080] transition"
            >
              {loading ? "Submitting..." : `Submit Registration `}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;
