import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import {
    ArrowRight,
    CheckCircle2,
    Eye,
    EyeOff,
    Lock,
    Mail,
    ShieldCheck,
    Sparkles,
    User,
    Users,
} from "lucide-react";

import {
    registerUser,
    loginUser,
    getToken,
} from "../service/authService";

import ThemeToggle from "../components/ThemeToggle";

import "./Auth.css";

function Register() {
    const navigate = useNavigate();
    const containerRef = useRef(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".auth-logo", {
                y: -15,
                opacity: 0,
                duration: 0.7,
                ease: "power3.out",
            });

            gsap.from(".auth-hero-content", {
                x: -45,
                opacity: 0,
                duration: 0.9,
                delay: 0.1,
                ease: "power3.out",
            });

            gsap.from(".auth-card", {
                y: 35,
                opacity: 0,
                duration: 0.9,
                delay: 0.2,
                ease: "power3.out",
            });

            gsap.from(".register-benefit-card", {
                y: 20,
                opacity: 0,
                duration: 0.7,
                delay: 0.45,
                stagger: 0.12,
                ease: "power3.out",
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) {
            return;
        }

        setError("");

        const cleanName = name.trim();
        const cleanEmail = email.trim();

        if (!cleanName || !cleanEmail || !password) {
            setError("Please fill all fields.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        try {
            setLoading(true);

            await registerUser(
                cleanName,
                cleanEmail,
                password
            );

            let token = getToken();

            if (!token) {
                await loginUser(
                    cleanEmail,
                    password
                );

                token = getToken();
            }

            if (!token) {
                throw new Error(
                    "Account created, but login could not be completed."
                );
            }

            navigate("/learner", {
                replace: true,
            });

        } catch (err) {
            console.error(
                "Registration error:",
                err
            );

            const backendMessage =
                err?.response?.data?.message;

            const backendError =
                err?.response?.data?.error;

            if (err?.response?.status === 409) {
                setError(
                    backendMessage ||
                    "An account with this email already exists."
                );
            } else if (err?.response?.status === 400) {
                setError(
                    backendMessage ||
                    "Please check the information you entered."
                );
            } else {
                setError(
                    backendMessage ||
                    backendError ||
                    err?.message ||
                    "Unable to create account. Please try again."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="auth-page"
            ref={containerRef}
        >

            <div className="auth-background">

                <div className="auth-orb auth-orb-one" />

                <div className="auth-orb auth-orb-two" />

                <div className="auth-orb auth-orb-three" />

                <div className="auth-grid" />

                <div className="auth-glow auth-glow-one" />

                <div className="auth-glow auth-glow-two" />

            </div>

            <header className="auth-topbar">

                <Link
                    to="/"
                    className="auth-logo"
                >

                    <span className="logo-mark">
                        A
                    </span>

                    <span className="logo-word">
                        Ascendra
                    </span>

                </Link>

                <div className="auth-top-actions">

                    <ThemeToggle />

                    <span className="auth-top-divider" />

                    <span className="auth-top-question">
                        Already a member?
                    </span>

                    <Link
                        to="/login"
                        className="top-auth-link"
                    >
                        Sign in

                        <ArrowRight size={16} />
                    </Link>

                </div>

            </header>

            <main className="auth-layout">

                <section className="auth-hero">

                    <div className="auth-hero-content">

                        <div className="auth-eyebrow">

                            <span className="eyebrow-icon">
                                <Sparkles size={15} />
                            </span>

                            START YOUR JOURNEY

                        </div>

                        <h1>

                            Your future

                            <br />

                            <span className="hero-muted">
                                starts
                            </span>

                            <br />

                            <span className="hero-accent">
                                here.
                            </span>

                        </h1>

                        <p className="auth-hero-description">
                            Create your Ascendra account and
                            start learning from people who have
                            already walked the path.
                        </p>

                        <div className="register-steps">

                            <div className="register-step active">

                                <div className="step-number">
                                    01
                                </div>

                                <div>

                                    <strong>
                                        Create your account
                                    </strong>

                                    <span>
                                        Set up your learning profile
                                    </span>

                                </div>

                            </div>

                            <div className="register-step">

                                <div className="step-number">
                                    02
                                </div>

                                <div>

                                    <strong>
                                        Find the right expert
                                    </strong>

                                    <span>
                                        Connect with experienced professionals
                                    </span>

                                </div>

                            </div>

                            <div className="register-step">

                                <div className="step-number">
                                    03
                                </div>

                                <div>

                                    <strong>
                                        Grow faster
                                    </strong>

                                    <span>
                                        Learn through focused sessions
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="register-benefit-grid">

                        <div className="register-benefit-card">

                            <div className="register-benefit-icon">
                                <Users />
                            </div>

                            <strong>
                                Expert network
                            </strong>

                            <span>
                                Learn from professionals
                                with real-world experience.
                            </span>

                        </div>

                        <div className="register-benefit-card">

                            <div className="register-benefit-icon">
                                <CheckCircle2 />
                            </div>

                            <strong>
                                Practical learning
                            </strong>

                            <span>
                                Turn your goals into measurable
                                career progress.
                            </span>

                        </div>

                    </div>

                </section>

                <section className="auth-form-section">

                    <div className="auth-card register-card">

                        <div className="auth-card-top">

                            <div className="auth-mobile-logo">
                                A
                            </div>

                            <span className="auth-card-label">
                                CREATE ACCOUNT
                            </span>

                            <h2>
                                Build your Ascendra profile
                            </h2>

                            <p>
                                Join the community and start
                                learning with expert guidance.
                            </p>

                        </div>

                        {error && (
                            <div className="auth-error">

                                <span className="error-dot" />

                                <span>
                                    {error}
                                </span>

                            </div>
                        )}

                        <form
                            className="auth-form"
                            onSubmit={handleSubmit}
                        >

                            <div className="auth-field">

                                <label htmlFor="register-name">
                                    Full name
                                </label>

                                <div className="auth-input">

                                    <User size={18} />

                                    <input
                                        id="register-name"
                                        type="text"
                                        placeholder="Your full name"
                                        value={name}
                                        autoComplete="name"
                                        disabled={loading}
                                        onChange={(e) =>
                                            setName(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                            </div>

                            <div className="auth-field">

                                <label htmlFor="register-email">
                                    Email address
                                </label>

                                <div className="auth-input">

                                    <Mail size={18} />

                                    <input
                                        id="register-email"
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

                            <div className="auth-field">

                                <div className="auth-label-row">

                                    <label htmlFor="register-password">
                                        Password
                                    </label>

                                    <span className="password-hint">
                                        8+ characters
                                    </span>

                                </div>

                                <div className="auth-input">

                                    <Lock size={18} />

                                    <input
                                        id="register-password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Create a secure password"
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
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>

                                </div>

                            </div>

                            <div className="password-quality">

                                <div className="quality-bars">

                                    <span
                                        className={
                                            password.length >= 1
                                                ? "active"
                                                : ""
                                        }
                                    />

                                    <span
                                        className={
                                            password.length >= 4
                                                ? "active"
                                                : ""
                                        }
                                    />

                                    <span
                                        className={
                                            password.length >= 8
                                                ? "active"
                                                : ""
                                        }
                                    />

                                    <span
                                        className={
                                            password.length >= 12
                                                ? "active"
                                                : ""
                                        }
                                    />

                                </div>

                                <span>
                                    {password.length === 0
                                        ? "Use at least 8 characters"
                                        : password.length < 8
                                            ? `${password.length}/8 characters`
                                            : "Password looks good"}
                                </span>

                            </div>

                            <button
                                type="submit"
                                className="primary-auth-btn"
                                disabled={loading}
                            >

                                <span>
                                    {loading
                                        ? "Creating account..."
                                        : "Create account"}
                                </span>

                                {!loading && (
                                    <span className="button-arrow">
                                        <ArrowRight size={18} />
                                    </span>
                                )}

                            </button>

                        </form>

                        <div className="auth-security">

                            <ShieldCheck size={15} />

                            <span>
                                Your information is securely
                                handled by Ascendra.
                            </span>

                        </div>

                        <p className="auth-bottom-text">

                            Already have an account?

                            <Link to="/login">
                                Sign in
                            </Link>

                        </p>

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

export default Register;