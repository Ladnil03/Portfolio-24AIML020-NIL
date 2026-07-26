import React, { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you, ${formData.name}! Your message has been sent.\n\nPreview:\n${message}`);
    setFormData({ name: "", email: "" });
    setMessage("");
  };

  return (
    <section style={{ padding: "50px 20px", maxWidth: "650px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
      <div
        style={{
          backgroundColor: "var(--card-bg)",
          color: "var(--text-h)",
          padding: "40px 35px",
          borderRadius: "20px",
          border: "2px solid #22c55e",
          boxShadow: "var(--shadow)",
          boxSizing: "border-box"
        }}
      >
        <h1 style={{ color: "#22c55e", marginTop: 0, marginBottom: "25px", fontSize: "32px", textAlign: "center", fontWeight: "700" }}>
          Contact Me
        </h1>

        <form onSubmit={handleFormSubmit}>
          <div style={{ marginBottom: "20px", textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "16px", color: "var(--text-h)" }}>
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter your name"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--code-bg)",
                color: "var(--text-h)",
                fontSize: "16px",
                boxSizing: "border-box",
                outline: "none"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px", textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "16px", color: "var(--text-h)" }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--code-bg)",
                color: "var(--text-h)",
                fontSize: "16px",
                boxSizing: "border-box",
                outline: "none"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px", textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "16px", color: "var(--text-h)" }}>
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              maxLength={250}
              rows={5}
              placeholder="Write your message..."
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--code-bg)",
                color: "var(--text-h)",
                fontSize: "16px",
                boxSizing: "border-box",
                resize: "vertical",
                outline: "none"
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "6px",
                fontSize: "14px",
                color: message.length >= 250 ? "#ef4444" : "var(--text)"
              }}
            >
              <span>Characters: {message.length} / 250</span>
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              backgroundColor: "#22c55e",
              color: "#ffffff",
              border: "none",
              padding: "14px",
              fontSize: "18px",
              fontWeight: "600",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 14px rgba(34, 197, 94, 0.3)"
            }}
          >
            Send Message
          </button>
        </form>

        {message && (
          <div
            style={{
              marginTop: "25px",
              padding: "16px",
              borderRadius: "10px",
              backgroundColor: "var(--code-bg)",
              borderLeft: "5px solid #22c55e",
              textAlign: "left"
            }}
          >
            <strong style={{ color: "#22c55e", display: "block", marginBottom: "6px" }}>Live Preview:</strong>
            <p style={{ margin: 0, whiteSpace: "pre-wrap", color: "var(--text-h)", fontSize: "15px" }}>{message}</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Contact;
