import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { EVENTS } from "@/data/eventConfig";
import { supabase } from "@/libs/createClient";
import { message } from "antd";

const Register = () => {
  const { slug } = useParams();
  const event = EVENTS[slug];

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    college: "",
    officer: "",
    officerPhone: "",
    participants: [],
    paymentNumber: "",
    receipt: null,
  });

  if (!event) return <p className="text-center mt-10">Invalid event.</p>;

  // --- Handle Input ---
  const setValue = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // --- Upload Receipt ---
  const uploadReceipt = async (file) => {
    const fileName = `receipt-${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("estival")
      .upload(fileName, file);

    if (error) return null;
    return supabase.storage.from("estival").getPublicUrl(fileName).data.publicUrl;
  };

  // --- Submit Registration ---
  const submit = async () => {
    if (!form.college || !form.officer || !form.officerPhone) {
      return message.warning("Please complete all required fields.");
    }

    if (!form.receipt) {
      return message.warning("Please upload payment screenshot.");
    }

    setLoading(true);

    const receiptURL = await uploadReceipt(form.receipt);
    if (!receiptURL) {
      message.error("Receipt upload failed");
      return setLoading(false);
    }

    const { error } = await supabase.from("registrations").insert({
      event_slug: slug,
      event_name: event.title,
      college: form.college,
      officer: form.officer,
      officerPhone: form.officerPhone,
      participants: form.participants,
      receiptURL,
    });

    setLoading(false);

    if (error) {
      message.error("Failed to register.");
    } else {
      message.success("Registration successful!");
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">

      {/* Title */}
      <h1 className="text-3xl font-bold text-blue-700">{event.title}</h1>
      <p className="text-green-600 font-medium">Registration Fee: ₹{event.fee}</p>

      {/* Rules */}
      <h3 className="mt-6 text-lg font-semibold">Rules</h3>
      <ul className="list-disc pl-6 text-gray-700">
        {event.rules.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>

      {/* Required Form */}
           {/* Required Form */}
      <div className="mt-8 space-y-6">

        {/* College Name */}
        <div>
          <label className="block font-medium mb-1">Name of College</label>
          <input
            className="input"
            placeholder="Enter college name"
            onChange={(e) => setValue("college", e.target.value)}
          />
        </div>

        {/* Program Officer Name */}
        <div>
          <label className="block font-medium mb-1">Program Officer Name</label>
          <input
            className="input"
            placeholder="Enter program officer name"
            onChange={(e) => setValue("officer", e.target.value)}
          />
        </div>

        {/* Program Officer Phone */}
        <div>
          <label className="block font-medium mb-1">Program Officer Phone Number</label>
          <input
            className="input"
            placeholder="Enter phone number"
            onChange={(e) => setValue("officerPhone", e.target.value)}
          />
        </div>

        {/* Dynamic Participants */}
        <h3 className="font-semibold mt-6">Participants</h3>

        {[...Array(event.participants)].map((_, i) => (
          <div key={i} className="space-y-2">

            <div>
              <label className="block font-medium mb-1">
                Participant {i + 1} Name
              </label>
              <input
                className="input"
                placeholder="Enter participant name"
                onChange={(e) => {
                  const list = [...form.participants];
                  list[i] = { ...list[i], name: e.target.value };
                  setValue("participants", list);
                }}
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                Participant {i + 1} Phone
              </label>
              <input
                className="input"
                placeholder="Enter phone number"
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
        <h3 className="font-semibold mt-6">Payment Details</h3>
        <div className="p-4 border rounded-xl bg-gray-50">
          <p><b>UPI ID:</b> estival@upi</p>
          <p><b>Phone:</b> 9876543210</p>
          <img src="/qrcode.png" alt="QR Code" className="w-40 mt-2" />
        </div>

        {/* Receipt Upload */}
        <div>
          <label className="block font-medium mb-1">
            Upload Payment Screenshot
          </label>
          <input
            type="file"
            className="input"
            onChange={(e) => setValue("receipt", e.target.files[0])}
          />
        </div>

        {/* Submit Button */}
        <button
          className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4"
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Registration"}
        </button>

      </div>


    </div>
  );
};

export default Register;
