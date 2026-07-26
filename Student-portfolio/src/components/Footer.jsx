import React from "react";

function Footer() {
    return (
        <footer
            style={{
                backgroundColor: "#0a0a0a",
                color: "#ffffff",
                textAlign: "center",
                padding: "25px 20px",
                marginTop: "auto",
                width: "100%",
                boxSizing: "border-box",
                borderTop: "4px solid #22c55e",
            }}
        >
            <p style={{ margin: 0, fontSize: "16px", fontWeight: "500" }}>
                © 2026 <span style={{ color: "#22c55e", fontWeight: "bold" }}>Student Portfolio</span> | All Rights Reserved
            </p>
        </footer>
    );
}

export default Footer;