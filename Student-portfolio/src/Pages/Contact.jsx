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
    <section style={{ padding: "50px 20px", maxWidth: "600px", margin: "0 auto" }}>
      <div
        style={{
          backgroundColor: "#111",
          color: "white",
          padding: "40px",
          borderRadius: "20px",
          border: "3px solid #22c55e",
          boxShadow: "0 10px 25px rgba(0,0,0,.2)"
        }}
      >
        <h1 style={{ color: "#22c55e", marginTop: 0, marginBottom: "20px", fontSize: "32px", textAlign: "center" }}>
          Contact Me
        </h1>

        <form onSubmit={handleFormSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "16px" }}>
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              style={{
                width: "100%",
                padding: "10px 15px",
                borderRadius: "8px",
                border: "1px solid #444",
                backgroundColor: "#222",
                color: "white",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "16px" }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={{
                width: "100%",
                padding: "10px 15px",
                borderRadius: "8px",
                border: "1px solid #444",
                backgroundColor: "#222",
                color: "white",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "16px" }}>
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              maxLength={250}
              rows="5"
              style={{
                width: "100%",
                padding: "10px 15px",
                borderRadius: "8px",
                border: "1px solid #444",
                backgroundColor: "#222",
                color: "white",
                fontSize: "16px",
                boxSizing: "border-box",
                resize: "vertical"
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "6px",
                fontSize: "14px",
                color: message.length >= 250 ? "#ef4444" : "#aaa"
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
              color: "white",
              border: "none",
              padding: "12px",
              fontSize: "18px",
              fontWeight: "bold",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "0.3s"
            }}
          >
            Send Message
          </button>
        </form>

        {message && (
          <div
            style={{
              marginTop: "25px",
              padding: "15px",
              borderRadius: "8px",
              backgroundColor: "#222",
              borderLeft: "4px solid #22c55e"
            }}
          >
            <strong style={{ color: "#22c55e", display: "block", marginBottom: "5px" }}>Live Preview:</strong>
            <p style={{ margin: 0, whiteSpace: "pre-wrap", color: "#eee", fontSize: "15px" }}>{message}</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Contact;
