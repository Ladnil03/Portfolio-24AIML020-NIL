import React from "react";
import { NavLink } from "react-router-dom";

function Header({ theme, toggleTheme }) {
    const linkStyle = ({ isActive }) => ({
        color: isActive ? "#22c55e" : "#ffffff",
        borderBottom: isActive ? "3px solid #22c55e" : "3px solid transparent",
        textDecoration: "none",
        marginRight: "25px",
        fontSize: "18px",
        fontWeight: "600",
        padding: "6px 0",
        transition: "all 0.3s ease"
    });

    return (
        <header
            style={{
                backgroundColor: "#0a0a0a",
                color: "white",
                width: "100%",
                boxSizing: "border-box",
                padding: "15px 40px",
                borderBottom: "4px solid #22c55e",
                position: "sticky",
                top: "0",
                zIndex: "1000",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
            }}
        >
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "15px"
                }}
            >
                <NavLink to="/" style={{ textDecoration: "none" }}>
                    <h1
                        style={{
                            color: "#22c55e",
                            fontSize: "28px",
                            margin: 0,
                            fontWeight: "800",
                            letterSpacing: "-0.5px"
                        }}
                    >
                        Student Portfolio
                    </h1>
                </NavLink>

                <nav style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <NavLink to="/" style={linkStyle}>
                        Home
                    </NavLink>

                    <NavLink to="/tasks" style={linkStyle}>
                        Tasks
                    </NavLink>

                    <NavLink to="/contact" style={linkStyle}>
                        Contact
                    </NavLink>

                    <button
                        onClick={toggleTheme}
                        style={{
                            backgroundColor: "#161616",
                            color: "white",
                            border: "2px solid #22c55e",
                            borderRadius: "8px",
                            padding: "8px 14px",
                            fontSize: "15px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.3s ease"
                        }}
                    >
                        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
                    </button>
                </nav>
            </div>
        </header>
    );
}

export default Header;