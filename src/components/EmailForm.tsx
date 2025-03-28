"use client";

import React, { useState } from "react";

export default function EmailForm() {
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const mailtoLink = `mailto:psumido@gmail.com?from=${encodeURIComponent(
            email
        )}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                width: "100%",
                maxWidth: "400px",
                margin: "0 auto",
            }}
        >
            <label>
                Your Email:
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                        width: "100%",
                        padding: "8px",
                        marginTop: "4px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                    }}
                />
            </label>
            <label>
                Subject:
                <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    style={{
                        width: "100%",
                        padding: "8px",
                        marginTop: "4px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                    }}
                />
            </label>
            <label>
                Body:
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                    style={{
                        width: "100%",
                        padding: "8px",
                        marginTop: "4px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        minHeight: "100px",
                    }}
                />
            </label>
            <button
                type="submit"
                style={{
                    padding: "10px 16px",
                    borderRadius: "4px",
                    border: "none",
                    background: "black",
                    color: "white",
                    cursor: "pointer",
                }}
            >
                Send Email
            </button>
        </form>
    );
}
