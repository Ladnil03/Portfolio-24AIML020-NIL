import React, { useState } from "react";

function Projects() {
  const [showDetails, setShowDetails] = useState(false);

  const projectsList = [
    {
      id: 1,
      title: "Portfolio Website",
      role: "Frontend Developer",
      brief: "A fully responsive portfolio web app with dark mode and custom routing.",
      details: "Tech Stack: React, React Router, HTML5, Vanilla CSS3, LocalStorage."
    },
    {
      id: 2,
      title: "AI Chatbot",
      role: "AI/ML Engineer",
      brief: "NLP model trained on custom intents to guide students with course details.",
      details: "Tech Stack: Python, PyTorch, Flask, React, Docker."
    },
    {
      id: 3,
      title: "E-Commerce API",
      role: "Backend Developer",
      brief: "REST API with JWT authentication, order processing, and payment gateway.",
      details: "Tech Stack: Node.js, Express, MongoDB, Stripe SDK, Redis."
    }
  ];

  return (
    <section style={{ padding: "50px 20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", fontSize: "45px", color: "var(--text-h)", marginBottom: "20px" }}>
        My Projects
      </h1>

      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            backgroundColor: "#22c55e",
            color: "white",
            border: "none",
            padding: "12px 24px",
            fontSize: "18px",
            fontWeight: "bold",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "0.3s",
            boxShadow: "0 4px 10px rgba(34, 197, 94, 0.3)"
          }}
        >
          {showDetails ? "Hide Tech Details" : "Show Tech Details"}
        </button>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "25px"
      }}>
        {projectsList.map((project) => (
          <div
            key={project.id}
            style={{
              backgroundColor: "#111",
              color: "white",
              padding: "30px",
              borderRadius: "15px",
              border: "3px solid #22c55e",
              boxShadow: "0 8px 20px rgba(0,0,0,.2)",
              transition: "0.3s"
            }}
          >
            <h3 style={{ color: "#22c55e", fontSize: "24px", marginTop: 0, marginBottom: "10px" }}>
              {project.title}
            </h3>
            <h4 style={{ color: "#aaa", fontSize: "16px", marginBottom: "15px" }}>
              {project.role}
            </h4>
            <p style={{ color: "#eee", fontSize: "16px", lineHeight: "1.6", marginBottom: showDetails ? "15px" : "0" }}>
              {project.brief}
            </p>
            {showDetails && (
              <div style={{
                marginTop: "15px",
                paddingTop: "15px",
                borderTop: "1px solid #333",
                color: "#22c55e",
                fontSize: "14px",
                fontWeight: "bold"
              }}>
                {project.details}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;
