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
                padding: "40px 20px 60px",
                maxWidth: "1000px",
                margin: "0 auto",
                width: "100%",
                boxSizing: "border-box"
            }}
        >
            <h1
                style={{
                    textAlign: "center",
                    color: "var(--text-h)",
                    fontSize: "36px",
                    marginBottom: "35px",
                    fontWeight: "700"
                }}
            >
                My Skills
            </h1>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "20px",
                }}
            >
                {skills.map((skill) => (
                    <div
                        key={skill}
                        style={{
                            backgroundColor: "var(--card-bg)",
                            color: "var(--text-h)",
                            padding: "24px 20px",
                            textAlign: "center",
                            borderRadius: "14px",
                            border: "2px solid #22c55e",
                            fontSize: "20px",
                            fontWeight: "600",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            boxShadow: "var(--shadow)",
                            cursor: "default"
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