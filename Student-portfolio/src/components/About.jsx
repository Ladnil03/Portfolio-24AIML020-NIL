import React from "react";
import luffy from "../assets/luffy.jpg";

function About() {
    return (
        <section
            id="about"
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "60px 20px 40px",
                width: "100%",
                boxSizing: "border-box"
            }}
        >
            <div
                style={{
                    backgroundColor: "var(--card-bg)",
                    maxWidth: "900px",
                    width: "100%",
                    borderRadius: "20px",
                    padding: "45px 35px",
                    textAlign: "center",
                    boxShadow: "var(--shadow)",
                    borderLeft: "8px solid #22c55e",
                    border: "1px solid var(--border)",
                    borderLeftWidth: "8px",
                    borderLeftColor: "#22c55e",
                    boxSizing: "border-box"
                }}
            >
                <img
                    src={luffy}
                    alt="Profile"
                    style={{
                        width: "180px",
                        height: "180px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "4px solid #22c55e",
                        boxShadow: "0 6px 16px rgba(34, 197, 94, 0.25)"
                    }}
                />

                <h1
                    style={{
                        color: "var(--text-h)",
                        marginTop: "20px",
                        fontSize: "38px",
                        fontWeight: "700"
                    }}
                >
                    Hi, I'm Nil Lad 👋
                </h1>

                <h3
                    style={{
                        color: "#22c55e",
                        fontSize: "22px",
                        fontWeight: "600",
                        marginTop: "10px",
                        marginBottom: "20px"
                    }}
                >
                    AI & ML Student | React Developer
                </h3>

                <p
                    style={{
                        color: "var(--text)",
                        fontSize: "18px",
                        lineHeight: "1.7",
                        maxWidth: "750px",
                        margin: "0 auto"
                    }}
                >
                    Passionate about Artificial Intelligence, Web Development,
                    Machine Learning and Competitive Programming.
                    I enjoy building responsive websites and solving real-world
                    problems using technology.
                </p>
            </div>
        </section>
    );
}

export default About;