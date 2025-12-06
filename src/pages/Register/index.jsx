import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { message } from "antd";
import { EVENTS } from "@/data/eventConfig";
import { supabase } from "@/libs/createClient";
import QRcode from "@/assets/images/qrcode.jpeg"; // replace if different path
import HERO from "@/assets/logo/Estival.jpg";
import { FaCheckCircle } from "react-icons/fa";

const Register = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const event = EVENTS[slug];

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    college: "",
    officer: "",
    officerPhone: "",
    participants: [], // will be objects: { name, phone }
    receipt: null, // optional File
  });

  useEffect(() => {
    // ensure participants array has correct length (for controlled inputs)
    if (event) {
      setForm((prev) => {
        const arr = Array.from({ length: event.participants }).map((_, i) => prev.participants[i] || { name: "", phone: "" });
        return { ...prev, participants: arr };
      });
    }
    // cleanup preview URL on unmount
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
        <p className="text-gray-600 mt-2">Please select a valid event to register.</p>
      </div>
    );
  }

  const setValue = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

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
    if (!form.college?.trim() || !form.officer?.trim() || !form.officerPhone?.trim()) {
      message.warning("Please fill the college and program officer details.");
      return false;
    }

    // check participants
    const allFilled = form.participants.every((p) => p && p.name?.trim() && p.phone?.trim());
    if (!allFilled) {
      message.warning(`Please fill name and phone for all ${event.participants} participant(s).`);
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
        message.warning("Receipt upload failed — proceeding without receipt (you can upload later).");
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
      payment_verified: 'pending', 
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

      // reset
      setForm({
        college: "",
        officer: "",
        officerPhone: "",
        participants: Array.from({ length: event.participants }).map(() => ({ name: "", phone: "" })),
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
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-10 shadow-2xl border-2 border-blue-50">
          <div className="text-6xl text-green-500 mb-4"><FaCheckCircle /></div>
          <h2 className="text-3xl font-bold text-blue-700 mb-2">Registration Successful</h2>
          <p className="text-gray-600 mb-4">Thank you — we received your registration for <span className="font-semibold text-gray-800">{event.title}</span>.</p>
          <p className="text-sm text-gray-500">A confirmation will be sent to the program officer. Redirecting to home...</p>
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
        ease: "easeOut"
      }}
      className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8"
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
            <div className="sm:max-w-[65%]">
              <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                {event.title}
              </h1>

              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow">
                  💰 ₹{event.fee}
                </span>
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold shadow">
                  👥 {event.participants} {event.participants > 1 ? "Members" : "Member"}
                </span>
                <span className="text-sm text-gray-600 ml-2">• Please read rules below</span>
              </div>

              <p className="mt-4 text-gray-700 max-w-xl leading-relaxed">{/* brief event summary optional */}</p>
            </div>

            <div className="flex-shrink-0">
              <div className="w-44 h-28 rounded-xl overflow-hidden shadow-lg border border-blue-50 bg-gradient-to-br from-white to-blue-50 flex items-center justify-center">
                <img src={HERO} alt="hero" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rules block */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-blue-700">Rules</h3>
        <ul className="list-disc pl-6 mt-3 text-gray-700">
          {event.rules.map((r, i) => (
            <li key={i} className="mb-1">{r}</li>
          ))}
        </ul>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* College */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name of College *</label>
          <input
            value={form.college}
            onChange={(e) => setValue("college", e.target.value)}
            className="w-full input px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-200 outline-none"
            placeholder="Enter college name"
          />
        </div>

        {/* Officer */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Program Officer Name *</label>
          <input
            value={form.officer}
            onChange={(e) => setValue("officer", e.target.value)}
            className="w-full input px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-200 outline-none"
            placeholder="Enter program officer name"
          />
        </div>

        {/* Officer Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Program Officer Phone *</label>
          <input
            value={form.officerPhone}
            onChange={(e) => setValue("officerPhone", e.target.value)}
            className="w-full input px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-200 outline-none"
            placeholder="Enter phone number"
          />
        </div>

        {/* Participants */}
        <div>
          <h3 className="text-xl font-semibold text-blue-700 mb-3">Participants ({event.participants})</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {form.participants.map((p, i) => (
              <div key={i} className="bg-gray-50 p-4 rounded-xl border">
                <label className="block text-sm font-medium text-gray-700 mb-1">Participant {i + 1} Name</label>
                <input
                  value={p?.name || ""}
                  onChange={(e) => setParticipant(i, "name", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none"
                  placeholder="Name"
                />

                <label className="block text-sm font-medium text-gray-700 mt-3 mb-1">Participant {i + 1} Phone</label>
                <input
                  value={p?.phone || ""}
                  onChange={(e) => setParticipant(i, "phone", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none"
                  placeholder="Phone"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Payment - optional */}
        <div>
          <h3 className="text-xl font-semibold text-blue-700">Payment (Optional)</h3>
          <p className="text-sm text-gray-600 mt-1">Online payment optional — you can pay offline. Upload screenshot only if paid online.</p>

          <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row items-center gap-4">
            <div>
              <p className="text-sm text-gray-700"><strong>UPI ID:</strong> estival@upi</p>
              <p className="text-sm text-gray-700"><strong>Phone:</strong> 9876543210</p>
            </div>

            <div className="ml-auto">
              <img src={QRcode} alt="QR" className="w-36 rounded-lg shadow" />
            </div>
          </div>

          {/* Upload box */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Payment Screenshot (optional)</label>

            <label className="cursor-pointer block">
              <div className="w-full h-44 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50 flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img src={preview} alt="preview" className="h-full object-contain" />
                ) : (
                  <div className="text-center text-blue-700 px-6">
                    <p className="font-medium">Click to upload payment screenshot</p>
                    <p className="text-xs text-gray-600 mt-1">PNG/JPG (max 4MB)</p>
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
            {loading ? "Submitting..." : `Submit Registration — ₹${event.fee}`}
          </button>
        </div>
      </div>
  </motion.div>
  );
};

export default Register;
