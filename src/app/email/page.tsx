'use client';

import EmailForm from "@/components/EmailForm";
import { useRouter } from "next/navigation"; // Updated import

export default function EmailPage() {
    const router = useRouter();

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh", // Full viewport height
                padding: "20px",
                position: "relative", // Added for positioning the floating button
            }}
        >
            <button
                onClick={() => router.push("/")} // Ensure this is executed on the client
                style={{
                    position: "absolute", // Make the button float
                    top: "20px",
                    left: "20px",
                    padding: "10px 16px",
                    borderRadius: "50px",
                    border: "1px solid black",
                    background: "transparent",
                    color: "black",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    whiteSpace: "nowrap", // Prevent text from wrapping
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = "black";
                    e.currentTarget.style.color = "white";
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "black";
                }}
            >
                Back to Home
            </button>
            <h1 style={{ textAlign: "center", fontSize: '2rem' }}>Send Me an Email!</h1>
            <EmailForm />
        </div>
    );
}
