import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { EVENTS } from "@/data/eventConfig";
import { supabase } from "@/libs/createClient";
import { message } from "antd";
import QRcode from "@/assets/images/qrcode.jpeg";

const Register = () => {
  const { slug } = useParams();
  const event = EVENTS[slug];

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    college: "",
    officer: "",
    officerPhone: "",
    participants: [],
    receipt: null, // optional now
  });

  if (!event)
    return <p className="text-center mt-10 text-red-600">Invalid event.</p>;

  // Set input value
  const setValue = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // Upload to Supabase Storage (only if user uploads)
  const uploadReceipt = async (file) => {
    const fileName = `receipt-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("estival")
      .upload(fileName, file);

    if (error) return null;

    return supabase.storage.from("estival").getPublicUrl(fileName).data
      .publicUrl;
  };

  // Handle Submit
  const submit = async () => {
    if (!form.college || !form.officer || !form.officerPhone)
      return message.warning("Please fill all required fields.");

    setLoading(true);

    let receiptURL = null;

    if (form.receipt) {
      receiptURL = await uploadReceipt(form.receipt);
      if (!receiptURL) {
        message.error("Receipt upload failed. Continuing without receipt.");
        return setLoading(false);
      }
    }

    const { error } = await supabase.from("registrations").insert({
      event_slug: slug,
      event_name: event.title,
      college: form.college,
      officer: form.officer,
      officer_phone: form.officerPhone, // UPDATED
      participants: form.participants,
      receipt_url: receiptURL || null, // UPDATED
    });

    setLoading(false);

    if (error) message.error("Registration failed");
    else message.success("Registration successful!");
    setForm({
      college: "",
      officer: "",
      officerPhone: "",
      participants: [],
      receipt: null,
    });
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      {/* Title */}
      <h1 className="text-4xl font-bold text-blue-700">{event.title}</h1>
      <p className="text-green-700 font-semibold text-lg mt-2">
        Registration Fee: ₹{event.fee}
      </p>

      {/* Rules */}
      <h3 className="text-2xl font-semibold text-blue-700 mt-8">Rules</h3>
      <ul className="list-disc pl-6 text-gray-700 leading-relaxed mt-2">
        {event.rules.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>

      {/* FORM */}
      <div className="mt-10 space-y-6">
        {/* College */}
        <div>
          <label className="font-medium text-gray-700 block mb-1">
            Name of College *
          </label>
          <input
            className="input"
            placeholder="Enter college name"
            onChange={(e) => setValue("college", e.target.value)}
          />
        </div>

        {/* Officer */}
        <div>
          <label className="font-medium text-gray-700 block mb-1">
            Program Officer Name *
          </label>
          <input
            className="input"
            placeholder="Enter officer name"
            onChange={(e) => setValue("officer", e.target.value)}
          />
        </div>

        {/* Officer Phone */}
        <div>
          <label className="font-medium text-gray-700 block mb-1">
            Program Officer Phone Number *
          </label>
          <input
            className="input"
            placeholder="Phone number"
            onChange={(e) => setValue("officerPhone", e.target.value)}
          />
        </div>

        {/* Participants */}
        <h3 className="text-xl font-semibold text-blue-700 mt-8">
          Participants ({event.participants})
        </h3>

        {[...Array(event.participants)].map((_, i) => (
          <div key={i} className="space-y-2 bg-gray-50 p-4 rounded-xl border">
            <div>
              <label className="font-medium text-gray-700 block mb-1">
                Participant {i + 1} Name
              </label>
              <input
                className="input"
                placeholder="Name"
                onChange={(e) => {
                  const list = [...form.participants];
                  list[i] = { ...list[i], name: e.target.value };
                  setValue("participants", list);
                }}
              />
            </div>

            <div>
              <label className="font-medium text-gray-700 block mb-1">
                Participant {i + 1} Phone
              </label>
              <input
                className="input"
                placeholder="Phone"
                onChange={(e) => {
                  const list = [...form.participants];
                  list[i] = { ...list[i], phone: e.target.value };
                  setValue("participants", list);
                }}
              />
            </div>
          </div>
        ))}

        {/* Payment Section */}
        <h3 className="text-xl font-semibold text-blue-700 mt-8">
          Payment (Optional)
        </h3>

        <p className="text-sm text-gray-600 mb-3">
          Online payment is optional. You may pay offline. Upload screenshot
          only if paid online.
           {/* (confirm your slot as soon as possible by paying
          the fee) */}
        </p>

        <div className="p-4 border rounded-xl bg-gray-50">
          <p>
            <b>UPI ID:</b> estival@upi
          </p>
          <p>
            <b>Phone:</b> 9876543210
          </p>
          <img
            src={QRcode}
            alt="QR Code"
            className="w-40 mt-3 rounded-lg shadow"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="font-medium text-gray-700 block mb-1">
            Upload Payment Screenshot (Optional)
          </label>

          <label className="cursor-pointer block">
            <div className="w-full h-48 rounded-xl border-2 border-dashed border-blue-400 flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 transition">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full object-contain rounded-lg"
                />
              ) : (
                <p className="text-blue-600">Click to upload screenshot</p>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                setValue("receipt", file);
                if (file) setPreview(URL.createObjectURL(file));
              }}
            />
          </label>
        </div>

        {/* Submit */}
        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          {loading ? "Submitting..." : "Submit Registration"}
        </button>
      </div>
    </div>
  );
};

export default Register;
