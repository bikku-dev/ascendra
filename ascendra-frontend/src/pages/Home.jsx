import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";

import {
    ArrowRight,
    BarChart3,
    Briefcase,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    Clock3,
    Globe2,
    GraduationCap,
    Handshake,
    LockKeyhole,
    Quote,
    Search,
    ShieldCheck,
    Sparkles,
    Star,
    UserRound,
    Mail,
    Menu,
    Phone,
    X,
    CheckCircle,
    Send,
    MessageSquareText,
    Target,
    TrendingUp,
    Users,
} from "lucide-react";

import "./Home.css";
import ThemeToggle from "../components/ThemeToggle";

gsap.registerPlugin(ScrollTrigger);

function Home() {
    const [openFaq, setOpenFaq] = useState(0);
    const [expertModalOpen, setExpertModalOpen] = useState(false);
    const [expertSubmitting, setExpertSubmitting] = useState(false);
    const [expertSubmitted, setExpertSubmitted] = useState(false);
    const [expertError, setExpertError] = useState("");
    const [expertApplicationId, setExpertApplicationId] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [expertForm, setExpertForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        jobTitle: "",
        company: "",
        experience: "",
        expertise: "",
        bio: "",
        mentorshipTopics: "",
        sessionPrice: "",
        availability: "",
    });
    const pageRef = useRef(null);
    const expertModalRef = useRef(null);

    useEffect(() => {
        const root = pageRef.current;
        if (!root) return;

        const ctx = gsap.context(() => {
            const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

            if (prefersReducedMotion) {
                gsap.set(root.querySelectorAll(".home-reveal, .hero-visual-reveal"), {
                    clearProps: "all",
                });
                return;
            }

            const intro = gsap.timeline({
                defaults: { ease: "power3.out" },
            });

            intro
                .from(".home-header", {
                    y: -28,
                    autoAlpha: 0,
                    duration: 0.8,
                })
                .from(".home-pill", {
                    y: 24,
                    autoAlpha: 0,
                    duration: 0.65,
                }, "-=0.35")
                .from(".home-hero h1", {
                    y: 45,
                    autoAlpha: 0,
                    duration: 0.9,
                }, "-=0.35")
                .from(".home-hero-copy > p", {
                    y: 24,
                    autoAlpha: 0,
                    duration: 0.7,
                }, "-=0.5")
                .from(".home-search, .home-buttons, .home-trust", {
                    y: 22,
                    autoAlpha: 0,
                    stagger: 0.12,
                    duration: 0.65,
                }, "-=0.35")
                .from(".hero-visual-reveal", {
                    x: 55,
                    y: 25,
                    scale: 0.94,
                    autoAlpha: 0,
                    duration: 1,
                    stagger: 0.14,
                    ease: "back.out(1.3)",
                }, "-=0.8");

            gsap.to(".visual-background", {
                y: -18,
                rotation: -1,
                duration: 3.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });

            gsap.to(".main-visual", {
                y: -10,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });

            gsap.to(".floating-top", {
                y: -12,
                x: 5,
                duration: 2.6,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });

            gsap.to(".floating-bottom", {
                y: 10,
                x: -4,
                duration: 3.2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });

            gsap.utils.toArray(".home-reveal").forEach((element) => {
                gsap.fromTo(
                    element,
                    { y: 42, autoAlpha: 0 },
                    {
                        y: 0,
                        autoAlpha: 1,
                        duration: 0.85,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: element,
                            start: "top 86%",
                            once: true,
                        },
                    }
                );
            });

            gsap.utils.toArray(".step-card, .expert-card, .category-card, .side-card, .testimonial-card, .faq-item").forEach((element) => {
                gsap.fromTo(
                    element,
                    { y: 35, autoAlpha: 0 },
                    {
                        y: 0,
                        autoAlpha: 1,
                        duration: 0.7,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: element,
                            start: "top 88%",
                            once: true,
                        },
                    }
                );
            });

            gsap.utils.toArray(".stat-item").forEach((element, index) => {
                gsap.fromTo(
                    element,
                    { y: 25, autoAlpha: 0 },
                    {
                        y: 0,
                        autoAlpha: 1,
                        duration: 0.65,
                        delay: index * 0.08,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: element,
                            start: "top 90%",
                            once: true,
                        },
                    }
                );
            });

            gsap.utils.toArray(".section-heading, .section-top, .cta-inner").forEach((element) => {
                gsap.fromTo(
                    element,
                    { y: 30, autoAlpha: 0 },
                    {
                        y: 0,
                        autoAlpha: 1,
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: element,
                            start: "top 88%",
                            once: true,
                        },
                    }
                );
            });

            const cleanupHover = [];
            const interactive = root.querySelectorAll(
                ".home-start, .home-primary, .home-secondary, .book-button, .outline-button, .wide-primary, .wide-outline, .cta-primary, .cta-secondary, .category-card, .expert-card, .step-card, .side-card, .testimonial-card"
            );

            interactive.forEach((element) => {
                const enter = () => {
                    gsap.to(element, {
                        y: -5,
                        scale: element.classList.contains("category-card") ? 1.012 : 1.008,
                        duration: 0.25,
                        ease: "power2.out",
                        overwrite: true,
                    });
                };
                const leave = () => {
                    gsap.to(element, {
                        y: 0,
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out",
                        overwrite: true,
                    });
                };
                element.addEventListener("mouseenter", enter);
                element.addEventListener("mouseleave", leave);
                cleanupHover.push(() => {
                    element.removeEventListener("mouseenter", enter);
                    element.removeEventListener("mouseleave", leave);
                });
            });

            ScrollTrigger.refresh();

            return () => {
                cleanupHover.forEach((cleanup) => cleanup());
                gsap.killTweensOf(root.querySelectorAll("*"));
            };
        }, root);

        return () => ctx.revert();
    }, []);

    const openExpertApplication = () => {
        setMobileMenuOpen(false);
        setExpertError("");
        const saved = localStorage.getItem("ascendra-expert-application");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.status === "PENDING") {
                    setExpertApplicationId(parsed.applicationId || "");
                    setExpertSubmitted(true);
                }
            } catch {
                localStorage.removeItem("ascendra-expert-application");
            }
        }
        setExpertModalOpen(true);
    };

    const closeExpertApplication = () => {
        if (expertSubmitting) return;
        setExpertModalOpen(false);
        setExpertError("");
    };

    const handleExpertChange = (event) => {
        const { name, value } = event.target;
        setExpertForm((current) => ({ ...current, [name]: value }));
    };

    const handleExpertSubmit = async (event) => {
        event.preventDefault();
        setExpertSubmitting(true);
        setExpertError("");

        try {
            const applicationId = `EXP-${Date.now().toString().slice(-8)}`;
            const application = {
                status: "PENDING",
                applicationId,
                submittedAt: new Date().toISOString(),
                ...expertForm,
            };

            localStorage.setItem(
                "ascendra-expert-application",
                JSON.stringify(application)
            );

            setExpertApplicationId(applicationId);
            setExpertSubmitted(true);
        } catch (error) {
            setExpertError("Unable to save your application. Please try again.");
        } finally {
            setExpertSubmitting(false);
        }
    };

    useEffect(() => {
        if (!expertModalOpen) return;

        document.body.classList.add("expert-modal-open");
        const onKeyDown = (event) => {
            if (event.key === "Escape") closeExpertApplication();
        };
        window.addEventListener("keydown", onKeyDown);

        const modal = expertModalRef.current;
        if (modal && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            gsap.fromTo(
                modal,
                { autoAlpha: 0, y: 28, scale: 0.97 },
                { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: "power3.out" }
            );
        }

        return () => {
            document.body.classList.remove("expert-modal-open");
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [expertModalOpen]);

    const experts = [
        {
            initials: "RK",
            name: "Rahul Kumar",
            role: "Senior Software Engineer",
            company: "Microsoft",
            rating: "4.9",
            reviews: "128",
            price: "$80",
            skills: ["System Design", "Backend", "Career Growth"],
        },
        {
            initials: "SC",
            name: "Sarah Chen",
            role: "Senior Product Manager",
            company: "Stripe",
            rating: "4.9",
            reviews: "127",
            price: "$95",
            skills: ["Product Strategy", "UX Research", "B2B SaaS"],
        },
        {
            initials: "MP",
            name: "Meera Patel",
            role: "Data Science Lead",
            company: "Netflix",
            rating: "5.0",
            reviews: "83",
            price: "$110",
            skills: ["Machine Learning", "Python", "Analytics"],
        },
        {
            initials: "DK",
            name: "David Kim",
            role: "Founder & CEO",
            company: "Verve",
            rating: "4.8",
            reviews: "61",
            price: "$120",
            skills: ["Fundraising", "Go-to-Market", "Leadership"],
        },
    ];

    const categories = [
        {
            icon: <Briefcase />,
            title: "Engineering",
            count: "284 experts",
            description: "Software, DevOps, Cloud & Architecture",
        },
        {
            icon: <Target />,
            title: "Product",
            count: "193 experts",
            description: "Product strategy, management & growth",
        },
        {
            icon: <Sparkles />,
            title: "Design",
            count: "156 experts",
            description: "UX, UI, research & design systems",
        },
        {
            icon: <BarChart3 />,
            title: "Data Science",
            count: "142 experts",
            description: "Data, AI, ML & analytics",
        },
        {
            icon: <TrendingUp />,
            title: "Marketing",
            count: "118 experts",
            description: "Growth, performance & brand marketing",
        },
        {
            icon: <Globe2 />,
            title: "Entrepreneurship",
            count: "97 experts",
            description: "Startups, business & fundraising",
        },
        {
            icon: <BarChart3 />,
            title: "Finance",
            count: "83 experts",
            description: "Finance, investing & accounting",
        },
        {
            icon: <Users />,
            title: "Leadership",
            count: "71 experts",
            description: "Management, communication & leadership",
        },
    ];

    const testimonials = [
        {
            initials: "JL",
            name: "Jordan Liu",
            role: "Senior PM at Shopify",
            text: "I was stuck as a mid-level PM for two years. After just 4 sessions with my mentor on Ascendra, I had a clear promotion strategy and the confidence to execute it.",
        },
        {
            initials: "KO",
            name: "Kezia Okafor",
            role: "Engineering Manager at Monzo",
            text: "The quality of experts here is incredible. My mentor has 20 years of engineering leadership experience and remembers exactly where I left off every session.",
        },
        {
            initials: "RM",
            name: "Ryan Moss",
            role: "Product Manager at Notion",
            text: "I changed careers from finance into product management. My Ascendra mentor helped me build a portfolio, prepare for interviews, and navigate every step.",
        },
    ];

    const faqs = [
        {
            question: "How does Ascendra work?",
            answer:
                "Browse our network of experienced professionals, compare their profiles and expertise, choose a mentor and book a 1-on-1 session that fits your schedule. After the session, you can continue learning through follow-up conversations.",
        },
        {
            question: "How are experts selected?",
            answer:
                "Experts are selected based on their professional experience, knowledge, communication ability and willingness to help others. Profiles include their experience, skills, ratings and learner reviews.",
        },
        {
            question: "What happens during a mentoring session?",
            answer:
                "You decide what you want to work on. Sessions can focus on career planning, technical problems, interview preparation, product decisions, leadership, portfolio reviews or any other professional goal.",
        },
        {
            question: "Can I become an expert on Ascendra?",
            answer:
                "Yes. Professionals with valuable industry experience can apply to become an expert. You can define your expertise, availability and session pricing.",
        },
        {
            question: "How do payments work?",
            answer:
                "Learners pay securely when booking a session. The expert receives their earnings after the session according to Ascendra's payment process.",
        },
    ];

    return (
        <div className="home-page" ref={pageRef}>

            <header className="home-header">
                <div className="home-header-inner">

                    <Link to="/" className="home-logo" onClick={() => setMobileMenuOpen(false)}>
                        <span>A</span>
                        <strong>Ascendra</strong>
                    </Link>

                    <nav className={`home-nav ${mobileMenuOpen ? "home-nav-open" : ""}`}>
                        <a href="#how" onClick={() => setMobileMenuOpen(false)}>How it works</a>
                        <a href="#mentors" onClick={() => setMobileMenuOpen(false)}>Mentors</a>
                        <a href="#categories" onClick={() => setMobileMenuOpen(false)}>Categories</a>
                        <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
                        <div className="mobile-nav-actions">
                            <Link to="/login" className="mobile-signin-link" onClick={() => setMobileMenuOpen(false)}>
                                Sign in
                            </Link>
                            <button
                                type="button"
                                className="mobile-expert-link"
                                onClick={openExpertApplication}
                            >
                                Become an Expert
                            </button>
                        </div>
                    </nav>

                    <div className="home-actions">
                        <ThemeToggle />

                        <Link to="/login" className="signin-link">
                            Sign in
                        </Link>

                        <button
                            type="button"
                            className="become-expert-nav"
                            onClick={openExpertApplication}
                        >
                            Become an Expert
                        </button>

                        <Link
                            to="/register"
                            className="home-start"
                        >
                            Get started
                            <ArrowRight size={16} />
                        </Link>

                        <button
                            type="button"
                            className="mobile-menu-button"
                            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={mobileMenuOpen}
                            onClick={() => setMobileMenuOpen((current) => !current)}
                        >
                            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
                        </button>
                    </div>

                </div>
            </header>

            <main>

                <section className="home-hero">

                    <div className="hero-inner">

                        <div className="home-hero-copy">

                            <div className="home-pill">
                                <Sparkles size={15} />
                                Connect with world-class experts
                            </div>

                            <h1>
                                Learn from people
                                <br />
                                <span>
                                    who've been there.
                                </span>
                            </h1>

                            <p>
                                Ascendra connects curious learners with
                                experienced professionals for personalized
                                1-on-1 guidance that accelerates your career.
                            </p>

                            <div className="home-search">

                                <Search size={21} />

                                <input
                                    type="text"
                                    placeholder="Search by skill, role, or name..."
                                />

                                <button type="button">
                                    Search
                                </button>

                            </div>

                            <div className="home-buttons">

                                <Link
                                    to="/register"
                                    className="home-primary"
                                >
                                    Start learning free
                                    <ArrowRight size={18} />
                                </Link>

                                <a
                                    href="#mentors"
                                    className="home-secondary"
                                >
                                    Browse experts
                                </a>

                            </div>

                            <button
                                type="button"
                                className="hero-expert-link"
                                onClick={openExpertApplication}
                            >
                                <span className="hero-expert-link-icon"><Users size={15} /></span>
                                <span>Have professional expertise?</span>
                                <strong>Become an Expert</strong>
                                <ArrowRight size={15} />
                            </button>

                            <div className="home-trust">

                                <span>
                                    <CheckCircle2 />
                                    No credit card
                                </span>

                                <span>
                                    <Star />
                                    4.9 average rating
                                </span>

                                <span>
                                    12K+ experts
                                </span>

                            </div>

                        </div>

                        <div className="home-visual">

                            <div className="visual-background"></div>

                            <div className="visual-card main-visual">

                                <div className="visual-top">
                                    <span>YOUR NEXT STEP</span>
                                    <Sparkles />
                                </div>

                                <h3>
                                    Find someone who's already where
                                    you want to be.
                                </h3>

                                <div className="visual-person">

                                    <div className="visual-avatar">
                                        RK
                                    </div>

                                    <div>
                                        <strong>
                                            Rahul Kumar
                                        </strong>

                                        <span>
                                            Software Engineer
                                        </span>

                                        <small>
                                            Microsoft
                                        </small>
                                    </div>

                                    <Star className="visual-star" />

                                </div>

                                <div className="visual-tags">
                                    <span>System Design</span>
                                    <span>Backend</span>
                                </div>

                                <div className="visual-bottom">

                                    <div>
                                        <strong>$80</strong>
                                        <span>/ session</span>
                                    </div>

                                    <button type="button">
                                        Book
                                    </button>

                                </div>

                            </div>

                            <div className="floating-card floating-top hero-visual-reveal">

                                <CheckCircle2 />

                                <div>
                                    <strong>
                                        Session booked!
                                    </strong>

                                    <span>
                                        Tomorrow at 3:00 PM
                                    </span>
                                </div>

                            </div>

                            <div className="floating-card floating-bottom hero-visual-reveal">

                                <div className="mini-stat">
                                    <strong>12K+</strong>
                                    <span>Experts</span>
                                </div>

                                <div className="mini-stat">
                                    <strong>94%</strong>
                                    <span>Satisfaction</span>
                                </div>

                                <div className="mini-stat">
                                    <strong>50K+</strong>
                                    <span>Sessions</span>
                                </div>

                            </div>

                        </div>

                    </div>

                </section>

                <section className="stats-section home-reveal">

                    <div className="stats-grid">

                        <div className="stat-item">
                            <strong>12,000+</strong>
                            <b>Verified Experts</b>
                            <span>Across 85+ categories</span>
                        </div>

                        <div className="stat-item">
                            <strong>50,000+</strong>
                            <b>Sessions Completed</b>
                            <span>In the last 12 months</span>
                        </div>

                        <div className="stat-item">
                            <strong>94%</strong>
                            <b>Satisfaction Rate</b>
                            <span>Based on learner reviews</span>
                        </div>

                        <div className="stat-item">
                            <strong>4.9 / 5</strong>
                            <b>Average Rating</b>
                            <span>Across all experts</span>
                        </div>

                    </div>

                </section>

                <section
                    id="how"
                    className="content-section how-section home-reveal"
                >

                    <div className="section-heading">

                        <span className="section-label">
                            SIMPLE PROCESS
                        </span>

                        <h2>
                            How Ascendra works
                        </h2>

                        <p>
                            From first search to meaningful growth
                            in three simple steps.
                        </p>

                    </div>

                    <div className="steps">

                        <div className="step-card">

                            <div className="step-icon">
                                <Search />
                            </div>

                            <span className="step-number">
                                STEP 01
                            </span>

                            <h3>
                                Find your expert
                            </h3>

                            <p>
                                Search by skill, role or industry.
                                Filter by price, availability and
                                rating to find the right professional.
                            </p>

                        </div>

                        <div className="step-card">

                            <div className="step-icon">
                                <CalendarDays />
                            </div>

                            <span className="step-number">
                                STEP 02
                            </span>

                            <h3>
                                Book a session
                            </h3>

                            <p>
                                Pick a time that works for both of you.
                                Book securely and receive instant
                                confirmation.
                            </p>

                        </div>

                        <div className="step-card">

                            <div className="step-icon">
                                <TrendingUp />
                            </div>

                            <span className="step-number">
                                STEP 03
                            </span>

                            <h3>
                                Grow with guidance
                            </h3>

                            <p>
                                Have a focused session, continue
                                conversations and track your progress
                                over time.
                            </p>

                        </div>

                    </div>

                </section>

                <section
                    id="mentors"
                    className="experts-section home-reveal"
                >

                    <div className="section-container">

                        <div className="section-top">

                            <div>

                                <span className="section-label">
                                    FEATURED EXPERTS
                                </span>

                                <h2>
                                    Learn from the best
                                </h2>

                                <p>
                                    Get practical guidance from people
                                    who have already done it.
                                </p>

                            </div>

                            <a
                                href="#categories"
                                className="outline-button"
                            >
                                View all experts
                                <ArrowRight size={17} />
                            </a>

                        </div>

                        <div className="experts-grid">

                            {experts.map((expert) => (

                                <article
                                    className="expert-card"
                                    key={expert.name}
                                >

                                    <div className="expert-header">

                                        <div className="expert-avatar">
                                            {expert.initials}
                                        </div>

                                        <div className="expert-info">

                                            <h3>
                                                {expert.name}
                                            </h3>

                                            <p>
                                                {expert.role}
                                            </p>

                                            <span>
                                                {expert.company}
                                            </span>

                                        </div>

                                    </div>

                                    <div className="rating-row">

                                        <div className="stars">
                                            <Star />
                                            <Star />
                                            <Star />
                                            <Star />
                                            <Star />
                                        </div>

                                        <strong>
                                            {expert.rating}
                                        </strong>

                                        <span>
                                            ({expert.reviews})
                                        </span>

                                    </div>

                                    <div className="skill-tags">

                                        {expert.skills.map((skill) => (
                                            <span key={skill}>
                                                {skill}
                                            </span>
                                        ))}

                                    </div>

                                    <div className="expert-footer">

                                        <div>

                                            <strong>
                                                {expert.price}
                                            </strong>

                                            <span>
                                                / session
                                            </span>

                                        </div>

                                        <Link
                                            to="/register"
                                            className="book-button"
                                        >
                                            Book
                                        </Link>

                                    </div>

                                </article>

                            ))}

                        </div>

                    </div>

                </section>

                <section
                    id="categories"
                    className="categories-section home-reveal"
                >

                    <div className="section-container">

                        <div className="section-heading">

                            <span className="section-label">
                                85+ CATEGORIES
                            </span>

                            <h2>
                                Whatever you want to learn
                            </h2>

                            <p>
                                Find experienced people across
                                the skills that matter to your career.
                            </p>

                        </div>

                        <div className="categories-grid">

                            {categories.map((category) => (

                                <a
                                    href="#mentors"
                                    className="category-card"
                                    key={category.title}
                                >

                                    <div className="category-icon">
                                        {category.icon}
                                    </div>

                                    <h3>
                                        {category.title}
                                    </h3>

                                    <strong>
                                        {category.count}
                                    </strong>

                                    <p>
                                        {category.description}
                                    </p>

                                    <ArrowRight className="category-arrow" />

                                </a>

                            ))}

                        </div>

                    </div>

                </section>

                <section
                    id="about"
                    className="both-section home-reveal"
                >

                    <div className="section-container">

                        <div className="section-heading">

                            <span className="section-label">
                                BUILT FOR BOTH SIDES
                            </span>

                            <h2>
                                Built for both sides of learning
                            </h2>

                            <p>
                                Whether you're looking for guidance
                                or ready to share your experience.
                            </p>

                        </div>

                        <div className="both-grid">

                            <div className="side-card learner-card">

                                <div className="side-title">

                                    <div className="side-icon">
                                        <GraduationCap />
                                    </div>

                                    <h3>
                                        For Learners
                                    </h3>

                                </div>

                                <div className="benefits">

                                    <div>

                                        <Target />

                                        <span>

                                            <strong>
                                                Targeted guidance
                                            </strong>

                                            Get advice specific to your
                                            goals and career stage.

                                        </span>

                                    </div>

                                    <div>

                                        <Clock3 />

                                        <span>

                                            <strong>
                                                Flexible scheduling
                                            </strong>

                                            Book sessions at times that
                                            work for your schedule.

                                        </span>

                                    </div>

                                    <div>

                                        <LockKeyhole />

                                        <span>

                                            <strong>
                                                Safe to ask anything
                                            </strong>

                                            Get honest and confidential
                                            professional guidance.

                                        </span>

                                    </div>

                                    <div>

                                        <BarChart3 />

                                        <span>

                                            <strong>
                                                Track your progress
                                            </strong>

                                            Set goals and see your growth
                                            over time.

                                        </span>

                                    </div>

                                </div>

                                <Link
                                    to="/register"
                                    className="wide-primary"
                                >
                                    Start learning
                                    <ArrowRight size={17} />
                                </Link>

                            </div>

                            <div className="side-card expert-side-card">

                                <div className="side-title">

                                    <div className="side-icon expert-icon">
                                        <Users />
                                    </div>

                                    <h3>
                                        For Experts
                                    </h3>

                                </div>

                                <div className="benefits">

                                    <div>

                                        <TrendingUp />

                                        <span>

                                            <strong>
                                                Earn on your schedule
                                            </strong>

                                            Set your own rates and
                                            availability.

                                        </span>

                                    </div>

                                    <div>

                                        <Globe2 />

                                        <span>

                                            <strong>
                                                Global reach
                                            </strong>

                                            Connect with motivated
                                            learners worldwide.

                                        </span>

                                    </div>

                                    <div>

                                        <ShieldCheck />

                                        <span>

                                            <strong>
                                                Protected payments
                                            </strong>

                                            Get paid reliably after
                                            completed sessions.

                                        </span>

                                    </div>

                                    <div>

                                        <Handshake />

                                        <span>

                                            <strong>
                                                Real impact
                                            </strong>

                                            Help people accelerate
                                            their careers.

                                        </span>

                                    </div>

                                </div>

                                <button
                                    type="button"
                                    className="wide-outline"
                                    onClick={openExpertApplication}
                                >
                                    Become an Expert
                                    <ArrowRight size={17} />
                                </button>

                            </div>

                        </div>

                    </div>

                </section>

                <section className="testimonials-section home-reveal">

                    <div className="section-container">

                        <div className="section-heading">

                            <span className="section-label">
                                TESTIMONIALS
                            </span>

                            <h2>
                                Stories from our community
                            </h2>

                        </div>

                        <div className="testimonials-grid">

                            {testimonials.map((testimonial) => (

                                <article
                                    className="testimonial-card"
                                    key={testimonial.name}
                                >

                                    <div className="testimonial-stars">

                                        <Star />
                                        <Star />
                                        <Star />
                                        <Star />
                                        <Star />

                                    </div>

                                    <Quote className="quote-icon" />

                                    <p>
                                        "{testimonial.text}"
                                    </p>

                                    <div className="testimonial-user">

                                        <div className="testimonial-avatar">
                                            {testimonial.initials}
                                        </div>

                                        <div>

                                            <strong>
                                                {testimonial.name}
                                            </strong>

                                            <span>
                                                {testimonial.role}
                                            </span>

                                        </div>

                                    </div>

                                </article>

                            ))}

                        </div>

                    </div>

                </section>

                <section
                    id="faq"
                    className="faq-section home-reveal"
                >

                    <div className="section-container faq-container">

                        <div className="section-heading">

                            <span className="section-label">
                                FAQ
                            </span>

                            <h2>
                                Common questions
                            </h2>

                            <p>
                                Everything you need to know before
                                getting started.
                            </p>

                        </div>

                        <div className="faq-list">

                            {faqs.map((faq, index) => (

                                <div
                                    className={`faq-item ${
                                        openFaq === index
                                            ? "faq-open"
                                            : ""
                                    }`}
                                    key={faq.question}
                                >

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setOpenFaq(
                                                openFaq === index
                                                    ? -1
                                                    : index
                                            )
                                        }
                                    >

                                        <span>
                                            {faq.question}
                                        </span>

                                        <ChevronDown />

                                    </button>

                                    {openFaq === index && (
                                        <div className="faq-answer">

                                            <p>
                                                {faq.answer}
                                            </p>

                                        </div>
                                    )}

                                </div>

                            ))}

                        </div>

                    </div>

                </section>

                <section className="final-cta home-reveal">

                    <div className="cta-inner">

                        <div className="cta-sparkle">
                            <Sparkles />
                        </div>

                        <span className="section-label">
                            YOUR NEXT STEP
                        </span>

                        <h2>
                            Your next career breakthrough
                            starts here.
                        </h2>

                        <p>
                            Join thousands of professionals who are
                            growing faster with the right mentorship.
                        </p>

                        <div className="cta-buttons">

                            <Link
                                to="/register"
                                className="cta-primary"
                            >
                                Get started — It's free
                                <ArrowRight />
                            </Link>

                            <a
                                href="#mentors"
                                className="cta-secondary"
                            >
                                Browse experts
                            </a>

                        </div>

                        <small>
                            No credit card required · Cancel anytime
                        </small>

                    </div>

                </section>

            </main>

            {expertModalOpen && (
                <div className="expert-modal-overlay" onMouseDown={(event) => {
                    if (event.target === event.currentTarget) closeExpertApplication();
                }}>
                    <div className="expert-modal" ref={expertModalRef} role="dialog" aria-modal="true" aria-labelledby="expert-modal-title">
                        <div className="expert-modal-head">
                            <div>
                                <span className="expert-modal-kicker">EXPERT APPLICATION</span>
                                <h2 id="expert-modal-title">Become an Ascendra Expert</h2>
                                <p>Share your experience. Our team will review your profile before verification.</p>
                            </div>
                            <button type="button" className="expert-modal-close" onClick={closeExpertApplication} aria-label="Close">
                                <X size={20} />
                            </button>
                        </div>

                        {expertSubmitted ? (
                            <div className="expert-success-state">
                                <div className="expert-success-icon"><CheckCircle size={34} /></div>
                                <span className="expert-success-label">APPLICATION SUBMITTED</span>
                                <h3>Your application is under review.</h3>
                                <p>
                                    Thanks for applying to become an Ascendra Expert. Your request has been sent to the Ascendra admin team and will remain pending until your professional details are reviewed and verified.
                                </p>
                                <div className="expert-application-id">
                                    <span>Application ID</span>
                                    <strong>{expertApplicationId}</strong>
                                </div>
                                <div className="expert-status-stack">
                                    <div className="expert-pending-note">
                                        <Clock3 size={17} />
                                        <span>Pending admin verification</span>
                                    </div>
                                    <div className="expert-admin-notice">
                                        <MessageSquareText size={16} />
                                        <span>Request sent to admin</span>
                                    </div>
                                </div>
                                <button type="button" className="expert-success-close" onClick={closeExpertApplication}>
                                    Done
                                </button>
                            </div>
                        ) : (
                            <form className="expert-application-form" onSubmit={handleExpertSubmit}>
                                <div className="expert-form-section">
                                    <div className="expert-form-section-title">
                                        <UserRound size={17} />
                                        <div>
                                            <strong>Personal details</strong>
                                            <span>Tell us who you are</span>
                                        </div>
                                    </div>
                                    <div className="expert-form-grid">
                                        <label>
                                            Full name
                                            <div className="expert-input-wrap"><UserRound size={16} /><input name="fullName" value={expertForm.fullName} onChange={handleExpertChange} placeholder="Your full name" required /></div>
                                        </label>
                                        <label>
                                            Email address
                                            <div className="expert-input-wrap"><Mail size={16} /><input type="email" name="email" value={expertForm.email} onChange={handleExpertChange} placeholder="you@example.com" required /></div>
                                        </label>
                                        <label>
                                            Phone number
                                            <div className="expert-input-wrap"><Phone size={16} /><input name="phone" value={expertForm.phone} onChange={handleExpertChange} placeholder="+91 98765 43210" required /></div>
                                        </label>
                                    </div>
                                </div>

                                <div className="expert-form-section">
                                    <div className="expert-form-section-title">
                                        <Briefcase size={17} />
                                        <div>
                                            <strong>Professional background</strong>
                                            <span>Help us understand your experience</span>
                                        </div>
                                    </div>
                                    <div className="expert-form-grid">
                                        <label>
                                            Current job title
                                            <div className="expert-input-wrap"><Briefcase size={16} /><input name="jobTitle" value={expertForm.jobTitle} onChange={handleExpertChange} placeholder="Senior Software Engineer" required /></div>
                                        </label>
                                        <label>
                                            Company / organization
                                            <div className="expert-input-wrap"><Globe2 size={16} /><input name="company" value={expertForm.company} onChange={handleExpertChange} placeholder="Company name" required /></div>
                                        </label>
                                        <label>
                                            Years of experience
                                            <select name="experience" value={expertForm.experience} onChange={handleExpertChange} required>
                                                <option value="">Select experience</option>
                                                <option value="2-4">2–4 years</option>
                                                <option value="5-7">5–7 years</option>
                                                <option value="8-10">8–10 years</option>
                                                <option value="10+">10+ years</option>
                                            </select>
                                        </label>
                                        <label>
                                            Primary expertise
                                            <div className="expert-input-wrap"><Sparkles size={16} /><input name="expertise" value={expertForm.expertise} onChange={handleExpertChange} placeholder="Backend, Product, Data Science..." required /></div>
                                        </label>
                                    </div>
                                </div>

                                <div className="expert-form-section">
                                    <div className="expert-form-section-title">
                                        <Target size={17} />
                                        <div>
                                            <strong>Mentorship profile</strong>
                                            <span>What can learners learn from you?</span>
                                        </div>
                                    </div>
                                    <div className="expert-form-grid single-row">
                                        <label>
                                            Topics you can mentor on
                                            <input name="mentorshipTopics" value={expertForm.mentorshipTopics} onChange={handleExpertChange} placeholder="System design, interviews, leadership, career growth..." required />
                                        </label>
                                        <label>
                                            Starting session price
                                            <input type="number" min="1" name="sessionPrice" value={expertForm.sessionPrice} onChange={handleExpertChange} placeholder="₹ / session" required />
                                        </label>
                                        <label>
                                            Availability
                                            <input name="availability" value={expertForm.availability} onChange={handleExpertChange} placeholder="Weekdays evenings, weekends..." required />
                                        </label>
                                    </div>
                                    <label className="expert-full-field">
                                        Professional bio
                                        <textarea name="bio" value={expertForm.bio} onChange={handleExpertChange} placeholder="Tell learners about your experience, achievements and the kind of guidance you provide..." rows="4" required />
                                    </label>
                                </div>

                                {expertError && (
                                    <div className="expert-form-error">{expertError}</div>
                                )}

                                <div className="expert-form-footer">
                                    <div className="expert-form-trust">
                                        <ShieldCheck size={17} />
                                        <span>Your application will remain <strong>Pending</strong> until admin verification.</span>
                                    </div>
                                    <button type="submit" className="expert-submit-button" disabled={expertSubmitting}>
                                        {expertSubmitting ? "Submitting..." : "Submit Application"}
                                        <Send size={17} />
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            <footer className="home-footer">

                <div className="footer-container">

                    <div className="footer-brand">

                        <Link
                            to="/"
                            className="footer-logo"
                        >
                            <span>A</span>
                            <strong>Ascendra</strong>
                        </Link>

                        <p>
                            The professional mentorship marketplace
                            connecting learners with world-class experts.
                        </p>

                    </div>

                    <div className="footer-column">

                        <h4>
                            Platform
                        </h4>

                        <a href="#mentors">
                            Find Experts
                        </a>

                        <a href="#how">
                            How It Works
                        </a>

                        <a href="#categories">
                            Categories
                        </a>

                        <button
                            type="button"
                            className="footer-action-link"
                            onClick={openExpertApplication}
                        >
                            Become an Expert
                        </button>

                    </div>

                    <div className="footer-column">

                        <h4>
                            Company
                        </h4>

                        <a href="#about">
                            About
                        </a>

                        <a href="#about">
                            Blog
                        </a>

                        <a href="#about">
                            Careers
                        </a>

                        <a href="#about">
                            Press
                        </a>

                    </div>

                    <div className="footer-column">

                        <h4>
                            Support
                        </h4>

                        <a href="#faq">
                            Help Center
                        </a>

                        <a href="#faq">
                            Contact Us
                        </a>

                        <a href="#faq">
                            Privacy
                        </a>

                        <a href="#faq">
                            Terms
                        </a>

                    </div>

                </div>

                <div className="footer-bottom">

                    <span>
                        © 2026 Ascendra. All rights reserved.
                    </span>

                    <span>
                        Learn. Connect. Grow.
                    </span>

                </div>

            </footer>

        </div>
    );
}

export default Home;