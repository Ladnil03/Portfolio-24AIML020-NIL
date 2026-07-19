import React from "react";
import { NavLink } from "react-router-dom";

function Header({ theme, toggleTheme }) {
    const linkStyle = ({ isActive }) => ({
        color: isActive ? "#22c55e" : "white",
        textDecoration: "none",
        marginRight: "30px",
        fontSize: "20px",
        fontWeight: "bold",
        transition: "color 0.3s"
    });

    return (
        <header
            style={{
                backgroundColor: "#111",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 60px",
                borderBottom: "4px solid #22c55e",
                position: "sticky",
                top: "0",
                zIndex: "1000",
            }}
        >
            <h1
                style={{
                    color: "#22c55e",
                    fontSize: "35px",
                    margin: 0,
                }}
            >
                Student Portfolio
            </h1>

            <nav style={{ display: "flex", alignItems: "center" }}>
                <NavLink to="/" style={linkStyle}>
                    Home
                </NavLink>

                <NavLink to="/projects" style={linkStyle}>
                    Projects
                </NavLink>

                <NavLink to="/contact" style={linkStyle}>
                    Contact
                </NavLink>

                <button
                    onClick={toggleTheme}
                    style={{
                        backgroundColor: "transparent",
                        color: "white",
                        border: "2px solid #22c55e",
                        borderRadius: "8px",
                        padding: "6px 12px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        transition: "0.3s"
                    }}
                >
                    {theme === "light" ? "🌙 Dark" : "☀️ Light"}
                </button>
            </nav>
        </header>
    );
}

export default Header;