import React, { useState } from "react";

export default function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    job: "",
    hearAbout: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        setStatus("✅ Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          job: "",
          hearAbout: "",
          message: "",
        });
      } else {
        setStatus("❌ " + result.error);
      }
    } catch (err) {
      setStatus("❌ Failed to send message");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-full"
      >
        <h1 className="text-2xl font-bold mb-2">Contact Us</h1>
        <p className="text-gray-600 mb-6">
          Ready to start a conversation? We’re excited to connect with you. Let’s chat about how we can work together to achieve your goals.
        </p>

        {[
          { name: "name", label: "Your Name *" },
          { name: "email", label: "Email Address *", type: "email" },
          { name: "phone", label: "Phone Number *" },
          { name: "company", label: "Company Name (Optional)" },
          { name: "job", label: "Job Title (Optional)" },
          { name: "hearAbout", label: "How did you hear about us? *" },
        ].map((f) => (
          <div key={f.name} className="mb-4">
            <label className="block text-sm font-medium mb-1">
              {f.label}
            </label>
            <input
              type={f.type || "text"}
              name={f.name}
              value={formData[f.name]}
              onChange={handleChange}
              required={f.label.includes("*")}
              className="border rounded-lg p-2 w-full"
            />
          </div>
        ))}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Your Message *</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="border rounded-lg p-2 w-full h-24"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full"
        >
          Send Message
        </button>

        {status && <p className="mt-4 text-center">{status}</p>}
      </form>
    </div>
  );
}
