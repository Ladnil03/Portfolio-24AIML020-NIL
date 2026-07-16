import React from "react";

function Skill() {
    const skills = [
        "HTML",
        "CSS",
        "JavaScript",
        "React",
        "Python",
        "C++",
        "Git",
        "Machine Learning",
    ];

    return (
        <section
            id="skills"
            style={{
                padding: "50px",
            }}
        >
            <h1
                style={{
                    textAlign: "center",
                    color: "#111",
                    fontSize: "45px",
                    marginBottom: "40px",
                }}
            >
                My Skills
            </h1>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                    gap: "25px",
                }}
            >
                {skills.map((skill) => (
                    <div
                        key={skill}
                        style={{
                            backgroundColor: "#111",
                            color: "white",
                            padding: "30px",
                            textAlign: "center",
                            borderRadius: "15px",
                            border: "3px solid #22c55e",
                            fontSize: "22px",
                            fontWeight: "bold",
                            transition: "0.3s",
                            boxShadow: "0 8px 20px rgba(0,0,0,.2)",
                        }}
                    >
                        {skill}
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Skill;