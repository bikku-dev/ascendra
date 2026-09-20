import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Mail,
    ShieldCheck
} from "lucide-react";

import axios from "axios";

import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";

import "./Auth.css";

function ForgotPassword() {
    const navigate = useNavigate();
    const { setDarkMode } = useTheme();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const cleanEmail = email.trim();

        if (!cleanEmail) {
            setError("Please enter your email address.");
            return;
        }

        try {
            setLoading(true);

            await axios.post(
                "/api/auth/forgot-password",
                {
                    email: cleanEmail
                }
            );

            setSuccess(
                "If an account exists with this email, a password reset link has been sent. Please check your inbox."
            );

            setEmail("");

        } catch (err) {
            console.error(
                "Forgot password error:",
                err
            );

            const backendMessage =
                err?.response?.data?.message;

            const backendError =
                err?.response?.data?.error;

            setError(
                backendMessage ||
                backendError ||
                "Unable to process your request. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        setDarkMode(false);
        localStorage.setItem(
            "ascendra-theme",
            "light"
        );
        localStorage.setItem(
            "ascendra_theme",
            "light"
        );

        navigate("/login");
    };

    return (
        <div className="auth-page">

            <div className="auth-background">
                <div className="auth-noise" />
                <div className="auth-grid" />

                <div className="auth-orb auth-orb-one" />
                <div className="auth-orb auth-orb-two" />
                <div className="auth-orb auth-orb-three" />

                <div className="auth-glow auth-glow-one" />
                <div className="auth-glow auth-glow-two" />
            </div>

            {/* Top Bar */}

            <header className="auth-topbar">

                <Link
                    to="/"
                    className="auth-logo"
                >
                    <span className="logo-mark">
                        A
                    </span>

                    <span className="logo-copy">
                        <strong>Ascendra</strong>
                        <small>
                            Learn beyond limits
                        </small>
                    </span>
                </Link>

                <div className="auth-top-actions">

                    <ThemeToggle />

                    <span className="auth-top-divider" />

                    <span className="auth-top-question">
                        Remember your password?
                    </span>

                    <Link
                        to="/login"
                        className="top-auth-link"
                    >
                        Sign in
                        <ArrowRight size={15} />
                    </Link>

                </div>

            </header>

            {/* Main */}

            <main className="auth-layout">

                {/* Left Section */}

                <section className="auth-hero">

                    <div className="auth-hero-content">

                        <div className="auth-eyebrow">

                            <span className="eyebrow-line" />

                            <span className="eyebrow-icon">
                                <ShieldCheck size={14} />
                            </span>

                            <span>
                                ACCOUNT SECURITY
                            </span>

                        </div>

                        <h1>
                            Get back.
                            <br />

                            <span className="hero-muted">
                                Stay secure.
                            </span>

                            <br />

                            <span className="hero-accent">
                                Keep growing.
                            </span>
                        </h1>

                        <p className="auth-hero-description">
                            Enter your registered email and
                            we'll send you a secure link to
                            create a new password.
                        </p>

                        <div className="hero-trust-row">

                            <div className="hero-trust-item">
                                <CheckCircle2 />
                                <span>
                                    Secure reset link
                                </span>
                            </div>

                            <div className="hero-trust-item">
                                <ShieldCheck />
                                <span>
                                    Protected account
                                </span>
                            </div>

                            <div className="hero-trust-item">
                                <Mail />
                                <span>
                                    Email verification
                                </span>
                            </div>

                        </div>

                    </div>

                </section>

                {/* Form Section */}

                <section className="auth-form-section">

                    <div className="auth-card">

                        <div className="auth-card-accent" />

                        <div className="auth-card-top">

                            <div className="auth-mobile-logo">
                                A
                            </div>

                            <span className="auth-card-label">
                                PASSWORD RECOVERY
                            </span>

                            <h2>
                                Forgot your
                                <span> password?</span>
                            </h2>

                            <p>
                                No worries. Enter your email
                                and we'll send you a reset link.
                            </p>

                        </div>

                        {/* Error */}

                        {error && (
                            <div className="auth-error">

                                <span className="error-icon">
                                    !
                                </span>

                                <span>
                                    {error}
                                </span>

                            </div>
                        )}

                        {/* Success */}

                        {success && (
                            <div
                                className="auth-success"
                                style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "10px",
                                    padding: "12px 14px",
                                    marginBottom: "18px",
                                    borderRadius: "12px"
                                }}
                            >
                                <CheckCircle2
                                    size={18}
                                    style={{
                                        flexShrink: 0,
                                        marginTop: "2px"
                                    }}
                                />

                                <span>
                                    {success}
                                </span>
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="auth-form"
                        >

                            <div className="auth-field">

                                <label htmlFor="forgot-email">
                                    Email address
                                </label>

                                <div className="auth-input">

                                    <span className="input-icon">
                                        <Mail size={17} />
                                    </span>

                                    <input
                                        id="forgot-email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        autoComplete="email"
                                        disabled={loading}
                                        onChange={(e) =>
                                            setEmail(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                            </div>

                            <button
                                type="submit"
                                className="primary-auth-btn"
                                disabled={loading}
                            >

                                <span>
                                    {loading
                                        ? "Sending..."
                                        : "Send reset link"
                                    }
                                </span>

                                {!loading && (
                                    <span className="button-arrow">
                                        <ArrowRight size={18} />
                                    </span>
                                )}

                                {loading && (
                                    <span className="auth-spinner" />
                                )}

                            </button>

                        </form>

                        <div className="auth-security">

                            <ShieldCheck size={15} />

                            <span>
                                Your password reset link is
                                securely generated.
                            </span>

                        </div>

                        <button
                            type="button"
                            className="forgot-password"
                            onClick={handleBackToLogin}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "6px",
                                width: "100%",
                                marginTop: "20px",
                                background: "none",
                                border: "none",
                                cursor: "pointer"
                            }}
                        >
                            <ArrowLeft size={15} />
                            Back to login
                        </button>

                    </div>

                </section>

            </main>

            <footer className="auth-footer">

                <span>
                    © 2026 Ascendra
                </span>

                <span className="auth-footer-dot">
                    •
                </span>

                <span>
                    Learn. Connect. Grow.
                </span>

            </footer>

        </div>
    );
}

export default ForgotPassword;