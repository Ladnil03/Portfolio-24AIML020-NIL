import React from "react";

function Header() {
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

            <nav>
                <a
                    href="#about"
                    style={{
                        color: "white",
                        textDecoration: "none",
                        marginRight: "30px",
                        fontSize: "20px",
                        fontWeight: "bold",
                    }}
                >
                    About
                </a>

                <a
                    href="#skills"
                    style={{
                        color: "white",
                        textDecoration: "none",
                        fontSize: "20px",
                        fontWeight: "bold",
                    }}
                >
                    Skills
                </a>
            </nav>
        </header>
    );
}

export default Header;