import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Eye,
    EyeOff,
    Lock,
    ShieldCheck
} from "lucide-react";

import axios from "axios";

import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";

import "./Auth.css";

function ResetPassword() {
    const navigate = useNavigate();
    const { setDarkMode } = useTheme();

    const [token, setToken] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(
            window.location.search
        );

        const resetToken = params.get("token");

        if (!resetToken) {
            setError(
                "Invalid or missing password reset link."
            );
            return;
        }

        setToken(resetToken);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!token) {
            setError(
                "Invalid or missing password reset token."
            );
            return;
        }

        if (!password || !confirmPassword) {
            setError(
                "Please enter and confirm your new password."
            );
            return;
        }

        if (password.length < 6) {
            setError(
                "Password must be at least 6 characters long."
            );
            return;
        }

        if (password !== confirmPassword) {
            setError(
                "Passwords do not match."
            );
            return;
        }

        try {
            setLoading(true);

            await axios.post(
                "/api/auth/reset-password",
                {
                    token: token,
                    newPassword: password
                }
            );

            setSuccess(
                "Your password has been updated successfully."
            );

            setPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err) {
            console.error(
                "Reset password error:",
                err
            );

            const backendMessage =
                err?.response?.data?.message;

            const backendError =
                err?.response?.data?.error;

            setError(
                backendMessage ||
                backendError ||
                "Unable to reset password. The link may have expired."
            );

        } finally {
            setLoading(false);
        }
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
                        <strong>
                            Ascendra
                        </strong>

                        <small>
                            Learn beyond limits
                        </small>
                    </span>

                </Link>

                <div className="auth-top-actions">

                    <ThemeToggle />

                    <span className="auth-top-divider" />

                    <span className="auth-top-question">
                        Already have access?
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

                {/* Hero */}

                <section className="auth-hero">

                    <div className="auth-hero-content">

                        <div className="auth-eyebrow">

                            <span className="eyebrow-line" />

                            <span className="eyebrow-icon">
                                <ShieldCheck size={14} />
                            </span>

                            <span>
                                SECURE PASSWORD RESET
                            </span>

                        </div>

                        <h1>
                            New password.
                            <br />

                            <span className="hero-muted">
                                Fresh start.
                            </span>

                            <br />

                            <span className="hero-accent">
                                Keep moving.
                            </span>

                        </h1>

                        <p className="auth-hero-description">
                            Create a new secure password for
                            your Ascendra account and continue
                            your learning journey.
                        </p>

                        <div className="hero-trust-row">

                            <div className="hero-trust-item">
                                <CheckCircle2 />
                                <span>
                                    Secure password
                                </span>
                            </div>

                            <div className="hero-trust-item">
                                <ShieldCheck />
                                <span>
                                    Protected reset
                                </span>
                            </div>

                        </div>

                    </div>

                </section>

                {/* Form */}

                <section className="auth-form-section">

                    <div className="auth-card">

                        <div className="auth-card-accent" />

                        <div className="auth-card-top">

                            <div className="auth-mobile-logo">
                                A
                            </div>

                            <span className="auth-card-label">
                                RESET PASSWORD
                            </span>

                            <h2>
                                Create a
                                <span> new password</span>
                            </h2>

                            <p>
                                Choose a strong password for
                                your Ascendra account.
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

                            {/* New Password */}

                            <div className="auth-field">

                                <label htmlFor="new-password">
                                    New password
                                </label>

                                <div className="auth-input">

                                    <span className="input-icon">
                                        <Lock size={17} />
                                    </span>

                                    <input
                                        id="new-password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Enter new password"
                                        value={password}
                                        autoComplete="new-password"
                                        disabled={loading}
                                        onChange={(e) =>
                                            setPassword(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        disabled={loading}
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff size={17} />
                                        ) : (
                                            <Eye size={17} />
                                        )}
                                    </button>

                                </div>

                            </div>

                            {/* Confirm Password */}

                            <div className="auth-field">

                                <label htmlFor="confirm-password">
                                    Confirm password
                                </label>

                                <div className="auth-input">

                                    <span className="input-icon">
                                        <Lock size={17} />
                                    </span>

                                    <input
                                        id="confirm-password"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        autoComplete="new-password"
                                        disabled={loading}
                                        onChange={(e) =>
                                            setConfirmPassword(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        disabled={loading}
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        aria-label={
                                            showConfirmPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={17} />
                                        ) : (
                                            <Eye size={17} />
                                        )}
                                    </button>

                                </div>

                            </div>

                            {/* Submit */}

                            <button
                                type="submit"
                                className="primary-auth-btn"
                                disabled={loading || !token}
                            >

                                <span>
                                    {loading
                                        ? "Updating..."
                                        : "Update password"
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
                                Your new password will be
                                securely encrypted.
                            </span>

                        </div>

                        <Link
                            to="/login"
                            className="forgot-password"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "6px",
                                width: "100%",
                                marginTop: "20px",
                                textDecoration: "none"
                            }}
                        >
                            <ArrowLeft size={15} />
                            Back to login
                        </Link>

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

export default ResetPassword;