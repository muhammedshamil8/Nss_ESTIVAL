import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion , AnimatePresence } from "motion/react";
import { message } from "antd";
import { EVENTS } from "@/data/eventConfig";
import { supabase } from "@/libs/createClient";
import { FaCheckCircle } from "react-icons/fa";
import { Copy } from "lucide-react";

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
    if (
      !form.college?.trim() ||
      !form.officer?.trim() ||
      !form.officerPhone?.trim()
    ) {
      message.warning("Please fill the college and program officer details.");
      return false;
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
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
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
      className="max-w-[900px] mx-auto py-10 px-4 sm:px-6 lg:px-8"
      id="event"
    >
      {/* Header / Hero-style top */}
      <div className="relative mb-8">
        <div className="absolute inset-0 -z-10 rounded-3xl overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.14, 1], rotate: [0, 60, 0] }}
            transition={{ duration: 18, repeat: Infinity }}
            className="absolute -top-28 -right-28 w-80 h-80 bg-gradient-to-br from-blue-200 to-blue-100 rounded-full opacity-30 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.1, 0.96, 1.1], rotate: [40, 0, 40] }}
            transition={{ duration: 14, repeat: Infinity }}
            className="absolute -bottom-28 -left-28 w-80 h-80 bg-gradient-to-br from-green-200 to-green-100 rounded-full opacity-30 blur-3xl"
          />
        </div>

        <div className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-blue-50">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            {/* LEFT SIDE: TITLE + TAGS + COORDINATORS */}
            <div className="sm:max-w-[65%]">
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                {event.title}
              </h1>

              {/* Tags */}
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow">
                  💰 {event.maxParticipants > 1 ? "Per Head" : ""} ₹
                  {event.perfee}
                </span>

                <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold shadow">
                  👥{" "}
                  {event.participants > 1
                    ? event.participants + " to " + event.maxParticipants
                    : event.participants}{" "}
                  {event.participants > 1 ? "Members" : "Member"}
                </span>

                <span className="text-sm text-gray-600 ml-2">
                  • Please read the rules below
                </span>
              </div>

              {/* Coordinators */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-blue-700">
                  Coordinators:
                </h3>

                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 mt-3">
                  {event.coordinators.map((c, i) => (
                    <div
                      key={i}
                      className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-200 shadow-sm w-full sm:w-auto"
                    >
                      <p className="font-semibold">{c.name}</p>
                      <p className="text-gray-500">
                        📞 {c.phone}{" "}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(c.phone);
                            message.success("Phone number copied!");
                          }}
                          className="p-1 rounded hover:bg-gray-200 transition"
                        >
                          <Copy className="w-4 h-4 text-blue-600" />
                        </button>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <p className="mt-4 text-gray-700 max-w-xl leading-relaxed">
                {/* optional summary */}
              </p>
            </div>

            {/* RIGHT SIDE: (empty for now or hero image later) */}
            <div className="flex-shrink-0 hidden">
              {/* Placeholder for hero */}
            </div>
          </div>
        </div>
      </div>

      {/* Rules block with toggle */}
      <div className="mb-8 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold text-blue-700">Event Rules</h3>
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
                  opacity: { duration: 0.2, delay: 0.1 }
                }
              }}
              exit={{ 
                opacity: 0, 
                height: 0,
                transition: { 
                  opacity: { duration: 0.2 },
                  height: { duration: 0.3, ease: "easeInOut" }
                }
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

      {/* Form */}
      <div className="space-y-6">
        {/* College */}
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

        {/* Officer */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name of Program Officer *
          </label>
          <input
            value={form.officer}
            onChange={(e) => setValue("officer", e.target.value)}
            className="w-full input px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-200 outline-none"
            placeholder="Enter program officer name"
          />
        </div>

        {/* Officer Phone */}
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

        {/* Participants */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
            <h3 className="text-xl font-semibold text-blue-700">
              Participants ({form.participants.length} of{" "}
              {event.maxParticipants})
            </h3>
          </div>

          {/* Validation message */}
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
                {/* Remove button for non-required participants */}
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

                {/* Required indicator */}
                {i + 1 <= event.minparticipants && (
                  <p className="text-xs text-gray-500 mt-2">
                    Required participant
                  </p>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Add Participant Button at bottom - only show if not at max */}
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

                    // Scroll to the newly added participant
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
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2 shadow-md"
              >
                <span className="text-lg">+</span> Add Participant
              </button>
            </div>
          )}

          {/* Max participants message */}
          {event.maxParticipants > 1 &&
            form.participants.length >= event.maxParticipants && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-700 text-sm">
                  Maximum {event.maxParticipants} participants reached.
                </p>
              </div>
            )}
        </div>

        {/* Payment - optional */}
        <div>
          <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center gap-4">
            {/* Payment Text */}
            <div className="flex-1 text-center sm:text-left">
              <p className="text-sm text-gray-700 flex items-center gap-2 justify-center sm:justify-start">
                <strong>UPI ID:</strong> {event.paymentDetails.upi_id}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(event.paymentDetails.upi_id);
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

            {/* QR Code */}
            <div>
              <img
                src={event.paymentDetails.qrcode}
                alt="QR"
                className="w-40 sm:w-48 h-auto rounded-lg shadow object-contain"
              />
            </div>
          </div>

          {/* Upload box */}
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

        {/* Submit button */}
        <div>
          <button
            onClick={submit}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold shadow hover:bg-blue-700 transition"
          >
            {loading ? "Submitting..." : `Submit Registration `}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;
