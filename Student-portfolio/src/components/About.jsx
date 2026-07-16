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
                padding: "70px 20px",
            }}
        >
            <div
                style={{
                    backgroundColor: "white",
                    width: "75%",
                    borderRadius: "20px",
                    padding: "40px",
                    textAlign: "center",
                    boxShadow: "0 10px 25px rgba(0,0,0,.2)",
                    borderLeft: "8px solid #22c55e",
                }}
            >
                <img
                    src={luffy}
                    alt="Profile"
                    style={{
                        width: "200px",
                        height: "200px",
                        borderRadius: "50%",
                        objectFit: "cover",
                    }}
                />

                <h1
                    style={{
                        color: "#111",
                        marginTop: "20px",
                    }}
                >
                    Hi, I'm Nil Lad👋
                </h1>

                <h3
                    style={{
                        color: "#22c55e",
                    }}
                >
                    AI & ML Student | React Developer
                </h3>

                <p
                    style={{
                        color: "#555",
                        fontSize: "18px",
                        lineHeight: "32px",
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