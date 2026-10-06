import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Header({ theme, toggleTheme, user, onLogout }) {
    const isLight = theme === "light";
    const navigate = useNavigate();

    const linkStyle = ({ isActive }) => ({
        color: isActive ? "#22c55e" : isLight ? "#111827" : "#ffffff",
        borderBottom: isActive ? "3px solid #22c55e" : "3px solid transparent",
        textDecoration: "none",
        marginRight: "25px",
        fontSize: "18px",
        fontWeight: "600",
        padding: "6px 0",
        transition: "all 0.3s ease"
    });

    const handleLogout = () => {
        if (onLogout) onLogout();
        navigate("/login");
    };

    return (
        <header
            style={{
                backgroundColor: isLight ? "#ffffff" : "#0a0a0a",
                color: isLight ? "#111827" : "white",
                width: "100%",
                boxSizing: "border-box",
                padding: "15px 40px",
                borderBottom: "4px solid #22c55e",
                position: "sticky",
                top: "0",
                zIndex: "1000",
                boxShadow: isLight ? "0 2px 10px rgba(0,0,0,0.06)" : "0 4px 12px rgba(0,0,0,0.15)"
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

                    {/* Auth section */}
                    {user ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginLeft: "10px" }}>
                            <span
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    padding: "6px 12px",
                                    borderRadius: "20px",
                                    backgroundColor: "rgba(34, 197, 94, 0.1)",
                                    border: "1px solid rgba(34, 197, 94, 0.3)",
                                    color: "#22c55e",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                }}
                            >
                                👤 {user.name || user.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                style={{
                                    backgroundColor: "transparent",
                                    color: isLight ? "#6b7280" : "#9ca3af",
                                    border: `1px solid ${isLight ? "#d1d5db" : "#374151"}`,
                                    borderRadius: "8px",
                                    padding: "7px 14px",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <NavLink
                            to="/login"
                            style={{
                                backgroundColor: "#22c55e",
                                color: "#ffffff",
                                textDecoration: "none",
                                borderRadius: "8px",
                                padding: "8px 18px",
                                fontSize: "15px",
                                fontWeight: "600",
                                marginLeft: "10px",
                                transition: "all 0.2s ease",
                                boxShadow: "0 2px 8px rgba(34, 197, 94, 0.3)",
                            }}
                        >
                            Login
                        </NavLink>
                    )}

                    <button
                        onClick={toggleTheme}
                        style={{
                            backgroundColor: isLight ? "#f3f4f6" : "#161616",
                            color: isLight ? "#111827" : "white",
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