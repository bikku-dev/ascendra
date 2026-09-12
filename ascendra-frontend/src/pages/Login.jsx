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
    Star,
    Users
} from "lucide-react";

import {
    loginUser,
    getToken,
    getUser
} from "../service/authService";

import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";

import "./Auth.css";

function Login() {
    const navigate = useNavigate();
    const { setDarkMode } = useTheme();
    const containerRef = useRef(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".auth-topbar", {
                y: -20,
                opacity: 0,
                duration: 0.7,
                ease: "power3.out"
            });

            gsap.from(".auth-hero-content", {
                x: -40,
                opacity: 0,
                duration: 0.9,
                delay: 0.1,
                ease: "power3.out"
            });

            gsap.from(".auth-card", {
                y: 30,
                opacity: 0,
                duration: 0.9,
                delay: 0.18,
                ease: "power3.out"
            });

            gsap.from(".auth-floating-card", {
                y: 18,
                opacity: 0,
                duration: 0.75,
                delay: 0.45,
                stagger: 0.12,
                ease: "power3.out"
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

        const cleanEmail = email.trim();

        if (!cleanEmail || !password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            await loginUser(
                cleanEmail,
                password
            );

            const token = getToken();
            const user = getUser();

            if (!token) {
                throw new Error(
                    "Login successful, but authentication token was not saved."
                );
            }

            setDarkMode(false);
            localStorage.setItem("ascendra-theme", "light");
            localStorage.setItem("ascendra_theme", "light");

            const role =
                user?.role
                    ?.toString()
                    .toUpperCase();

            if (role === "EXPERT") {
                navigate("/expert", {
                    replace: true
                });

                return;
            }

            if (role === "ADMIN") {
                navigate("/admin", {
                    replace: true
                });

                return;
            }

            navigate("/learner", {
                replace: true
            });
        } catch (err) {
            console.error(
                "Login error:",
                err
            );

            const backendMessage =
                err?.response?.data?.message;

            const backendError =
                err?.response?.data?.error;

            if (err?.response?.status === 401) {
                setError(
                    backendMessage ||
                    "Invalid email or password."
                );
            } else if (err?.response?.status === 403) {
                setError(
                    backendMessage ||
                    "You are not allowed to login."
                );
            } else {
                setError(
                    backendMessage ||
                    backendError ||
                    err?.message ||
                    "Unable to login. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const googleLogin = () => {
        setError("");

        setDarkMode(false);
        localStorage.setItem("ascendra-theme", "light");
        localStorage.setItem("ascendra_theme", "light");

        window.location.href =
            "http://localhost:8080/oauth2/authorization/google";
    };

    return (
        <div
            className="auth-page"
            ref={containerRef}
        >
            <div className="auth-background">
                <div className="auth-noise" />
                <div className="auth-grid" />
                <div className="auth-orb auth-orb-one" />
                <div className="auth-orb auth-orb-two" />
                <div className="auth-orb auth-orb-three" />
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

                    <span className="logo-copy">
                        <strong>Ascendra</strong>
                        <small>Learn beyond limits</small>
                    </span>
                </Link>

                <div className="auth-top-actions">
                    <ThemeToggle />

                    <span className="auth-top-divider" />

                    <span className="auth-top-question">
                        New to Ascendra?
                    </span>

                    <Link
                        to="/register"
                        className="top-auth-link"
                    >
                        Create account
                        <ArrowRight size={15} />
                    </Link>
                </div>
            </header>

            <main className="auth-layout">
                <section className="auth-hero">
                    <div className="auth-hero-content">
                        <div className="auth-eyebrow">
                            <span className="eyebrow-line" />

                            <span className="eyebrow-icon">
                                <Sparkles size={14} />
                            </span>

                            <span>
                                YOUR NEXT CHAPTER
                            </span>
                        </div>

                        <h1>
                            Learn.
                            <br />

                            <span className="hero-muted">
                                Grow.
                            </span>

                            <br />

                            <span className="hero-accent">
                                Become more.
                            </span>
                        </h1>

                        <p className="auth-hero-description">
                            Connect with experienced professionals,
                            build real-world skills and move closer
                            to your career goals through focused
                            1-on-1 mentorship.
                        </p>

                        <div className="hero-trust-row">
                            <div className="hero-trust-item">
                                <CheckCircle2 />
                                <span>
                                    Verified experts
                                </span>
                            </div>

                            <div className="hero-trust-item">
                                <ShieldCheck />
                                <span>
                                    Secure payments
                                </span>
                            </div>

                            <div className="hero-trust-item">
                                <Users />
                                <span>
                                    Personal guidance
                                </span>
                            </div>
                        </div>

                        <div className="auth-hero-stats">
                            <div className="hero-stat">
                                <strong>
                                    10K+
                                </strong>

                                <span>
                                    Learners
                                </span>
                            </div>

                            <div className="hero-stat">
                                <strong>
                                    500+
                                </strong>

                                <span>
                                    Experts
                                </span>
                            </div>

                            <div className="hero-stat">
                                <strong>
                                    4.9
                                </strong>

                                <span>
                                    Avg. rating
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="auth-floating-card floating-review">
                        <div className="floating-avatar">
                            JL
                        </div>

                        <div className="floating-review-content">
                            <div className="floating-review-stars">
                                <Star />
                                <Star />
                                <Star />
                                <Star />
                                <Star />
                            </div>

                            <strong>
                                Career clarity that works.
                            </strong>

                            <span>
                                Trusted by professionals worldwide
                            </span>
                        </div>
                    </div>

                    <div className="auth-floating-card floating-session">
                        <div className="floating-session-icon">
                            <CheckCircle2 />
                        </div>

                        <div>
                            <strong>
                                Mentoring session
                            </strong>

                            <span>
                                Ready when you are
                            </span>
                        </div>
                    </div>
                </section>

                <section className="auth-form-section">
                    <div className="auth-card">
                        <div className="auth-card-accent" />

                        <div className="auth-card-top">
                            <div className="auth-mobile-logo">
                                A
                            </div>

                            <span className="auth-card-label">
                                WELCOME BACK
                            </span>

                            <h2>
                                Sign in to
                                <span> Ascendra</span>
                            </h2>

                            <p>
                                Continue your journey and pick up
                                exactly where you left off.
                            </p>
                        </div>

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

                        <form
                            onSubmit={handleSubmit}
                            className="auth-form"
                        >
                            <div className="auth-field">
                                <label htmlFor="login-email">
                                    Email address
                                </label>

                                <div className="auth-input">
                                    <span className="input-icon">
                                        <Mail size={17} />
                                    </span>

                                    <input
                                        id="login-email"
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
                                    <label htmlFor="login-password">
                                        Password
                                    </label>

                                    <button
                                        type="button"
                                        className="forgot-password"
                                        disabled={loading}
                                        onClick={() =>
                                            setError(
                                                "Password reset is not configured yet."
                                            )
                                        }
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                <div className="auth-input">
                                    <span className="input-icon">
                                        <Lock size={17} />
                                    </span>

                                    <input
                                        id="login-password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Enter your password"
                                        value={password}
                                        autoComplete="current-password"
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

                            <button
                                type="submit"
                                className="primary-auth-btn"
                                disabled={loading}
                            >
                                <span>
                                    {loading
                                        ? "Signing in..."
                                        : "Sign in"}
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

                        <div className="auth-divider">
                            <span />
                            <small>OR CONTINUE WITH</small>
                            <span />
                        </div>

                        <button
                            type="button"
                            className="google-auth-btn"
                            disabled={loading}
                            onClick={googleLogin}
                        >
                            <span className="google-icon">
                                G
                            </span>

                            <span>
                                Continue with Google
                            </span>
                        </button>

                        <div className="auth-security">
                            <ShieldCheck size={15} />

                            <span>
                                Protected with secure authentication
                            </span>
                        </div>

                        <p className="auth-bottom-text">
                            Don't have an account?

                            <Link to="/register">
                                Create account
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

export default Login;