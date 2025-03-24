'use client';

import EmailForm from "@/components/EmailForm";
import { useRouter } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";

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
                onClick={() => router.push("/")} // Updated router.push call
                style={{
                    position: "absolute", // Make the button float
                    top: "20px",
                    left: "20px",
                    padding: "10px",
                    width: "50px", // Set width for a perfect circle
                    height: "50px", // Set height for a perfect circle
                    borderRadius: "50%", // Make it a perfect circle
                    border: "1px solid",
                    background: "white", // Always contrast the background
                    color: "black", // Always contrast the background
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderColor: "black"
                }}
            >
                <span
                    className="material-symbols-outlined"
                    style={{
                        fontSize: "24px",
                        height: '24px',
                        width: '24px',
                    }}
                >
                    <HomeIcon />
                </span>
            </button>
            <h1 style={{ textAlign: "center", fontSize: '2rem' }}>Send Me an Email!</h1>
            <EmailForm />
        </div>
    );
}
