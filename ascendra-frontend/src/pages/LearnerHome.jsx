import React, {
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";

import {
    useNavigate,
    useSearchParams
} from "react-router-dom";

import gsap from "gsap";

import {
    LayoutDashboard,
    UserRound,
    Code2,
    Target,
    UsersRound,
    CalendarDays,
    Trophy,
    TrendingUp,
    LogOut,
    ArrowRight,
    Pencil,
    Plus,
    CheckCircle2,
    ChevronRight,
    Menu,
    X,
    MessageCircle,
    CreditCard,
    Bell,
    Mail,
    ShieldCheck,
    Zap,
    Clock3,
    Video,
    Search,
    Filter,
    Sparkles,
    Flame,
    BookOpen,
    RotateCcw,
    Download,
    Printer,
    ReceiptText
} from "lucide-react";

import {
    getLearnerProfileByUserId,
    getLearnerSkills,
    getLearnerGoals
} from "../service/learnerService";

import {
    removeToken,
    logoutUser
} from "../service/authService";

import { useTheme } from "../context/ThemeContext";

import {
    getMyBookings,
    getBookingById,
    getPaymentByBookingId
} from "../service/bookingService";

import {
    getUserNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead
} from "../service/notificationService";

import LearnerOnboarding from "./learner/LearnerOnboarding";
import ExpertDiscovery from "./learner/ExpertDiscovery";
import MessagesView from "./learner/MessagesView";
import PaymentHistoryView from "./learner/PaymentHistoryView";

import "./Learner.css";

const USER_KEYS = [
    "user",
    "ascendra_user"
];

const getStoredUser = () => {
    for (const key of USER_KEYS) {
        try {
            const raw = localStorage.getItem(key);

            if (raw) {
                return JSON.parse(raw);
            }
        } catch (error) {
            console.warn(
                `Invalid ${key}`,
                error
            );
        }
    }

    return null;
};

const getSkillLevel = (skill) =>
    Number(
        skill?.skillLevel ??
        skill?.level ??
        skill?.proficiency ??
        0
    );

const getSkillName = (skill) =>
    skill?.skillName ||
    skill?.name ||
    skill?.skill?.name ||
    skill?.title ||
    "Skill";

const getGoalTitle = (goal) =>
    goal?.title ||
    goal?.name ||
    goal?.goal ||
    "Learning goal";

const getGoalDescription = (goal) =>
    goal?.description ||
    goal?.details ||
    "Active learning direction";

function Avatar({
    src,
    initials,
    large = false
}) {
    return (
        <div
            className={`avatar ${
                large
                    ? "avatar-large"
                    : ""
            }`}
        >
            {src ? (
                <img
                    src={src}
                    alt="Profile"
                    onError={(event) => {
                        event.currentTarget.style.display =
                            "none";
                    }}
                />
            ) : (
                <span>
                    {initials}
                </span>
            )}
        </div>
    );
}

const navGroups = [
    {
        label: "WORKSPACE",
        items: [
            {
                key: "dashboard",
                label: "Dashboard",
                description:
                    "Your learning overview",
                icon: LayoutDashboard
            },
            {
                key: "profile",
                label: "My Profile",
                description:
                    "Personal info, skills & goals",
                icon: UserRound
            },
            {
                key: "experts",
                label: "Find Experts",
                description:
                    "Get guidance from experts",
                icon: UsersRound
            },
            {
                key: "sessions",
                label: "My Sessions",
                description:
                    "Your mentoring sessions",
                icon: CalendarDays
            },
            {
                key: "challenges",
                label: "Challenges",
                description:
                    "Practice & assignments",
                icon: Trophy
            },
            {
                key: "progress",
                label: "Progress",
                description:
                    "Track your growth",
                icon: TrendingUp
            },
            {
                key: "messages",
                label: "Messages",
                description:
                    "Your conversations",
                icon: MessageCircle
            },
            {
                key: "payments",
                label: "Payments",
                description:
                    "Payment history",
                icon: CreditCard
            },
            {
                key: "notifications",
                label: "Notifications",
                description:
                    "Important updates",
                icon: Bell
            },
        ]
    }
];

function LearnerHome() {
    const navigate = useNavigate();
    const { setDarkMode } = useTheme();

    const [
        searchParams,
        setSearchParams
    ] = useSearchParams();

    const pageRef = useRef(null);

    const [
        user,
        setUser
    ] = useState(
        getStoredUser()
    );

    const [
        profile,
        setProfile
    ] = useState(null);

    const [
        skills,
        setSkills
    ] = useState([]);

    const [
        goals,
        setGoals
    ] = useState([]);

    const [
        sessions,
        setSessions
    ] = useState([]);

    const [
        sessionsLoading,
        setSessionsLoading
    ] = useState(false);

    const [
        sessionsError,
        setSessionsError
    ] = useState("");

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        sidebarOpen,
        setSidebarOpen
    ] = useState(false);

    const [
        notifications,
        setNotifications
    ] = useState([]);

    const [
        notificationDetails,
        setNotificationDetails
    ] = useState({});

    const [
        notificationsLoading,
        setNotificationsLoading
    ] = useState(false);

    const [
        notificationsError,
        setNotificationsError
    ] = useState("");

    const [
        unreadNotificationCount,
        setUnreadNotificationCount
    ] = useState(0);

    const requestedView =
        searchParams.get("view") ||
        "dashboard";

    const currentView =
        requestedView === "settings"
            ? "dashboard"
            : requestedView;

    useEffect(() => {
        setDarkMode(false);
        localStorage.setItem("ascendra-theme", "light");
        localStorage.setItem("ascendra_theme", "light");
    }, [setDarkMode]);

    useEffect(() => {
        const storedUser =
            getStoredUser();

        if (!storedUser) {
            navigate(
                "/login",
                {
                    replace: true
                }
            );

            return;
        }

        setUser(storedUser);
    }, [navigate]);

    const refreshLearnerData =
        async () => {
            const storedUser =
                getStoredUser();

            if (!storedUser) {
                navigate(
                    "/login",
                    {
                        replace: true
                    }
                );

                return;
            }

            setUser(
                storedUser
            );

            const userId =
                storedUser?.userId ??
                storedUser?.id ??
                storedUser?.user_id ??
                storedUser?.user?.id ??
                storedUser?.user?.userId;

            if (!userId) {
                setProfile(null);
                setSkills([]);
                setGoals([]);
                setSessions([]);
                setSessionsError("");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                let learnerProfile =
                    null;

                try {
                    learnerProfile =
                        await getLearnerProfileByUserId(
                            userId
                        );
                } catch (profileError) {
                    const status =
                        profileError?.response?.status;

                    /*
                     * A user account can exist before the learner
                     * profile is created. A 404 therefore means
                     * "profile not created yet", not "dashboard broken".
                     */
                    if (status === 404) {
                        console.warn(
                            `Learner profile not found for user ${userId}.`
                        );
                        learnerProfile = null;
                    } else {
                        throw profileError;
                    }
                }

                setProfile(
                    learnerProfile ||
                    null
                );

                if (
                    learnerProfile?.id
                ) {
                    const [
                        skillsResult,
                        goalsResult
                    ] =
                        await Promise.allSettled([
                            getLearnerSkills(
                                learnerProfile.id
                            ),
                            getLearnerGoals(
                                learnerProfile.id
                            )
                        ]);

                    const skillsData =
                        skillsResult.status ===
                        "fulfilled"
                            ? skillsResult.value
                            : [];

                    const goalsData =
                        goalsResult.status ===
                        "fulfilled"
                            ? goalsResult.value
                            : [];

                    if (
                        skillsResult.status ===
                        "rejected"
                    ) {
                        console.error(
                            "Learner skills error:",
                            skillsResult.reason
                        );
                    }

                    if (
                        goalsResult.status ===
                        "rejected"
                    ) {
                        console.error(
                            "Learner goals error:",
                            goalsResult.reason
                        );
                    }

                    setSkills(
                        Array.isArray(
                            skillsData
                        )
                            ? skillsData
                            : Array.isArray(
                                skillsData?.data
                            )
                                ? skillsData.data
                                : []
                    );

                    setGoals(
                        Array.isArray(
                            goalsData
                        )
                            ? goalsData
                            : Array.isArray(
                                goalsData?.data
                            )
                                ? goalsData.data
                                : []
                    );

                    try {
                        setSessionsLoading(true);
                        setSessionsError("");

                        const bookingResponse =
                            await getMyBookings(
                                learnerProfile.id
                            );

                        const bookingData =
                            Array.isArray(
                                bookingResponse
                            )
                                ? bookingResponse
                                : Array.isArray(
                                    bookingResponse?.data
                                )
                                    ? bookingResponse.data
                                    : Array.isArray(
                                        bookingResponse?.content
                                    )
                                        ? bookingResponse.content
                                        : [];

                        setSessions(
                            bookingData
                        );
                    } catch (bookingError) {
                        console.error(
                            "Learner sessions error:",
                            bookingError
                        );

                        setSessions([]);
                        setSessionsError(
                            bookingError?.response?.data?.message ||
                            bookingError?.response?.data?.error ||
                            "Unable to load your sessions."
                        );
                    } finally {
                        setSessionsLoading(false);
                    }
                } else {
                    setSkills([]);
                    setGoals([]);
                    setSessions([]);
                    setSessionsError("");
                }
            } catch (error) {
                console.error(
                    "Learner dashboard error:",
                    error
                );

                setProfile(null);
                setSkills([]);
                setGoals([]);
                setSessions([]);
                setSessionsError("");
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        refreshLearnerData();
    }, [navigate]);

    const loadNotifications = async () => {
        const storedUser = getStoredUser();

        const userId =
            storedUser?.id ??
            storedUser?.userId ??
            storedUser?.user_id ??
            storedUser?.user?.id ??
            storedUser?.user?.userId;

        if (!userId) {
            setNotifications([]);
            setUnreadNotificationCount(0);
            return;
        }

        try {
            setNotificationsLoading(true);
            setNotificationsError("");

            const [
                notificationResponse,
                unreadResponse
            ] = await Promise.all([
                getUserNotifications(userId),
                getUnreadNotificationCount(userId)
            ]);

            const notificationData =
                Array.isArray(notificationResponse)
                    ? notificationResponse
                    : Array.isArray(notificationResponse?.data)
                        ? notificationResponse.data
                        : [];

            setNotifications(notificationData);

            setUnreadNotificationCount(
                Number(
                    unreadResponse?.count ??
                    unreadResponse?.data ??
                    unreadResponse ??
                    0
                )
            );

            const details = {};

            await Promise.all(
                notificationData
                    .filter(
                        notification =>
                            notification?.referenceId
                    )
                    .map(
                        async notification => {
                            const bookingId =
                                notification.referenceId;

                            try {
                                const booking =
                                    await getBookingById(
                                        bookingId
                                    );

                                let payment = null;

                                try {
                                    payment =
                                        await getPaymentByBookingId(
                                            bookingId
                                        );
                                } catch {
                                    payment = null;
                                }

                                details[
                                    String(
                                        notification.id
                                    )
                                ] = {
                                    booking,
                                    payment
                                };
                            } catch {
                                details[
                                    String(
                                        notification.id
                                    )
                                ] = {
                                    booking: null,
                                    payment: null
                                };
                            }
                        }
                    )
            );

            setNotificationDetails(details);
        } catch (error) {
            console.error(
                "Learner notifications error:",
                error
            );

            setNotifications([]);
            setNotificationDetails({});
            setUnreadNotificationCount(0);

            setNotificationsError(
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Unable to load notifications."
            );
        } finally {
            setNotificationsLoading(false);
        }
    };

    const handleNotificationRead =
        async notification => {
            if (!notification?.id) {
                return;
            }

            try {
                if (!notification.read) {
                    await markNotificationAsRead(
                        notification.id
                    );
                }

                setNotifications(
                    previous =>
                        previous.map(
                            item =>
                                item.id ===
                                notification.id
                                    ? {
                                        ...item,
                                        read: true
                                    }
                                    : item
                        )
                );

                if (!notification.read) {
                    setUnreadNotificationCount(
                        previous =>
                            Math.max(
                                0,
                                previous - 1
                            )
                    );
                }
            } catch (error) {
                console.error(
                    "Mark notification as read error:",
                    error
                );
            }
        };

    const handleMarkAllNotificationsRead =
        async () => {
            const storedUser =
                getStoredUser();

            const userId =
                storedUser?.id ??
                storedUser?.userId ??
                storedUser?.user_id ??
                storedUser?.user?.id ??
                storedUser?.user?.userId;

            if (!userId) {
                return;
            }

            try {
                await markAllNotificationsAsRead(
                    userId
                );

                setNotifications(
                    previous =>
                        previous.map(
                            item => ({
                                ...item,
                                read: true
                            })
                        )
                );

                setUnreadNotificationCount(0);
            } catch (error) {
                console.error(
                    "Mark all notifications as read error:",
                    error
                );
            }
        };

    useEffect(() => {
        if (
            currentView ===
            "notifications"
        ) {
            loadNotifications();
        }
    }, [currentView]);

    useEffect(() => {
        if (
            currentView !==
            "sessions"
        ) {
            return;
        }

        const interval =
            setInterval(() => {
                refreshLearnerData();
            }, 30000);

        return () => {
            clearInterval(
                interval
            );
        };
    }, [currentView]);

    const completion =
        useMemo(() => {
            if (!profile) {
                return 0;
            }

            let completed = 0;

            if (
                profile.experienceLevel ||
                profile.experience
            ) {
                completed++;
            }

            if (
                profile.targetRole?.trim()
            ) {
                completed++;
            }

            if (
                profile.bio?.trim()
            ) {
                completed++;
            }

            if (
                skills.length > 0
            ) {
                completed++;
            }

            if (
                goals.length > 0
            ) {
                completed++;
            }

            return Math.round(
                (completed / 5) * 100
            );
        }, [
            profile,
            skills,
            goals
        ]);

    const averageSkill =
        useMemo(() => {
            if (!skills.length) {
                return 0;
            }

            return Math.round(
                skills.reduce(
                    (
                        total,
                        skill
                    ) =>
                        total +
                        Math.min(
                            Math.max(
                                getSkillLevel(
                                    skill
                                ),
                                0
                            ),
                            100
                        ),
                    0
                ) /
                skills.length
            );
        }, [skills]);

    const completedGoals =
        useMemo(
            () =>
                goals.filter(
                    (goal) =>
                        goal?.completed ===
                            true ||
                        String(
                            goal?.status ||
                            ""
                        ).toUpperCase() ===
                            "COMPLETED"
                ).length,
            [goals]
        );

    const name =
        user?.name?.trim() ||
        user?.fullName?.trim() ||
        user?.username?.trim() ||
        profile?.name?.trim() ||
        "Learner";

    const firstName =
        name.split(/\s+/)[0] ||
        "Learner";

    const initials =
        name
            .split(/\s+/)
            .filter(Boolean)
            .map(
                (part) =>
                    part.charAt(0)
            )
            .join("")
            .slice(0, 2)
            .toUpperCase() ||
        "L";

    const profilePicture =
        profile?.profilePicture ||
        profile?.profile_picture ||
        profile?.photoUrl ||
        profile?.avatarUrl ||
        user?.profilePicture ||
        user?.profile_picture ||
        user?.profileImage ||
        user?.photoUrl ||
        user?.picture ||
        null;

    const navigateView =
        (view) => {
            setSearchParams({
                view
            });

            setSidebarOpen(
                false
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        };

    const handleLogout =
        async () => {
            try {
                await logoutUser();
            } catch (error) {
                console.warn(
                    "Logout error:",
                    error
                );
            } finally {
                removeToken();

                localStorage.removeItem(
                    "user"
                );

                localStorage.removeItem(
                    "ascendra_user"
                );

                navigate(
                    "/login",
                    {
                        replace: true
                    }
                );
            }
        };

    useEffect(() => {
        if (loading) {
            return;
        }

        const ctx =
            gsap.context(
                () => {
                    gsap.fromTo(
                        ".ui-animate",
                        {
                            y: 16,
                            opacity: 0
                        },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.55,
                            stagger: 0.05,
                            ease:
                                "power2.out"
                        }
                    );
                },
                pageRef
            );

        return () =>
            ctx.revert();
    }, [
        loading,
        currentView
    ]);

    if (loading) {
        return (
            <div className="learner-page">
                <div className="learner-loading">
                    <div className="loading-logo">
                        A
                    </div>

                    <div className="loading-spinner" />

                    <h2>
                        Preparing your workspace
                    </h2>

                    <p>
                        Loading your profile,
                        skills and goals...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="learner-page"
            ref={pageRef}
        >
            <button
                type="button"
                className={`mobile-menu-button ${
                    sidebarOpen
                        ? "open"
                        : ""
                }`}
                onClick={() =>
                    setSidebarOpen(
                        (value) =>
                            !value
                    )
                }
                aria-label="Toggle menu"
            >
                {sidebarOpen ? (
                    <X size={21} />
                ) : (
                    <Menu size={21} />
                )}
            </button>

            {sidebarOpen && (
                <button
                    type="button"
                    className="sidebar-overlay"
                    onClick={() =>
                        setSidebarOpen(
                            false
                        )
                    }
                    aria-label="Close menu"
                />
            )}

            <aside
                className={`learner-sidebar ${
                    sidebarOpen
                        ? "sidebar-open"
                        : ""
                }`}
            >
                <div className="sidebar-brand">
                    <div className="sidebar-brand-mark">
                        A
                    </div>

                    <div>
                        <strong>
                            Ascendra
                        </strong>

                        <span>
                            Learning Workspace
                        </span>
                    </div>

                    <button
                        type="button"
                        className="sidebar-close"
                        onClick={() =>
                            setSidebarOpen(
                                false
                            )
                        }
                        aria-label="Close navigation"
                    >
                        <X size={18} />
                    </button>
                </div>

                <button
                    type="button"
                    className="sidebar-user-card"
                    onClick={() =>
                        navigateView(
                            "profile"
                        )
                    }
                >
                    <Avatar
                        src={
                            profilePicture
                        }
                        initials={
                            initials
                        }
                    />

                    <span>
                        <strong>
                            {name}
                        </strong>

                        <small>
                            Learner
                        </small>
                    </span>

                    <ChevronRight
                        size={17}
                    />
                </button>

                <div className="sidebar-heading">
                    WORKSPACE
                </div>

                <nav className="sidebar-nav">
                    {navGroups.map(
                        (group) => (
                            <div
                                className="nav-group"
                                key={
                                    group.label
                                }
                            >
                                {group.items.map(
                                    (
                                        item
                                    ) => {
                                        const Icon =
                                            item.icon;

                                        const active =
                                            currentView ===
                                            item.key;

                                        return (
                                            <button
                                                key={
                                                    item.key
                                                }
                                                type="button"
                                                className={`sidebar-item ${
                                                    active
                                                        ? "active"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    navigateView(
                                                        item.key
                                                    )
                                                }
                                            >
                                                <span className="sidebar-item-icon">
                                                    <Icon
                                                        size={
                                                            18
                                                        }
                                                    />
                                                </span>

                                                <span className="sidebar-item-copy">
                                                    <strong>
                                                        {
                                                            item.label
                                                        }
                                                    </strong>

                                                    <small>
                                                        {
                                                            item.description
                                                        }
                                                    </small>
                                                </span>

                                                {active && (
                                                    <span className="sidebar-active-dot" />
                                                )}
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        )
                    )}
                </nav>

                <div className="sidebar-bottom">
                    <div className="sidebar-progress-mini">
                        <div className="mini-progress-top">
                            <span>
                                Profile strength
                            </span>

                            <strong>
                                {completion}%
                            </strong>
                        </div>

                        <div className="mini-progress-track">
                            <span
                                style={{
                                    width: `${completion}%`
                                }}
                            />
                        </div>
                    </div>

                    <button
                        type="button"
                        className="sidebar-logout"
                        onClick={
                            handleLogout
                        }
                    >
                        <LogOut
                            size={17}
                        />

                        <span>
                            Logout
                        </span>
                    </button>
                </div>
            </aside>

            <main className="learner-main">
                <header className="learner-topbar">
                    <div className="topbar-brand">
                        <div className="topbar-brand-mark">
                            A
                        </div>

                        <span>
                            Ascendra
                        </span>
                    </div>

                    <div className="topbar-actions">
                        <button
                            type="button"
                            className="topbar-profile"
                            onClick={() =>
                                navigateView(
                                    "profile"
                                )
                            }
                        >
                            <Avatar
                                src={
                                    profilePicture
                                }
                                initials={
                                    initials
                                }
                            />

                            <span>
                                {
                                    firstName
                                }
                            </span>

                            <ChevronRight
                                size={15}
                            />
                        </button>

                        <button
                            type="button"
                            className="topbar-logout"
                            onClick={
                                handleLogout
                            }
                        >
                            <LogOut
                                size={17}
                            />

                            <span>
                                Logout
                            </span>
                        </button>
                    </div>
                </header>

                <div className="learner-content">
                    {currentView ===
                        "dashboard" && (
                        <DashboardView
                            firstName={
                                firstName
                            }
                            user={user}
                            profile={
                                profile
                            }
                            profilePicture={
                                profilePicture
                            }
                            initials={
                                initials
                            }
                            completion={
                                completion
                            }
                            skills={
                                skills
                            }
                            goals={
                                goals
                            }
                            averageSkill={
                                averageSkill
                            }
                            completedGoals={
                                completedGoals
                            }
                            navigateView={
                                navigateView
                            }
                        />
                    )}

                    {currentView ===
                        "profile" && (
                        <ProfileView
                            user={user}
                            profile={profile}
                            profilePicture={profilePicture}
                            initials={initials}
                            completion={completion}
                            skills={skills}
                            goals={goals}
                            sessions={sessions}
                            completedGoals={completedGoals}
                            navigateView={navigateView}
                            onRefresh={refreshLearnerData}
                        />
                    )}

                    {currentView ===
                        "experts" && (
                        <ExpertDiscovery />
                    )}

                    {currentView ===
                        "progress" && (
                        <ProgressView
                            completion={
                                completion
                            }
                            averageSkill={
                                averageSkill
                            }
                            skills={
                                skills
                            }
                            goals={
                                goals
                            }
                            completedGoals={
                                completedGoals
                            }
                            sessions={
                                sessions
                            }
                        />
                    )}

                    {currentView ===
                        "sessions" && (
                        <SessionsView
                            sessions={
                                sessions
                            }
                            loading={
                                sessionsLoading
                            }
                            error={
                                sessionsError
                            }
                            navigate={
                                navigate
                            }
                            navigateView={
                                navigateView
                            }
                        />
                    )}

                    {currentView ===
                        "messages" && (
                        <MessagesView
                            sessions={
                                sessions
                            }
                            user={
                                user
                            }
                        />
                    )}

                    {currentView ===
                        "payments" && (
                        <PaymentHistoryView
                            sessions={
                                sessions
                            }
                        />
                    )}

                    {currentView ===
                        "challenges" && (
                        <ChallengesView
                            skills={skills}
                            goals={goals}
                        />
                    )}

                    {currentView ===
                        "notifications" && (
                        <NotificationsView
                            notifications={
                                notifications
                            }
                            notificationDetails={
                                notificationDetails
                            }
                            loading={
                                notificationsLoading
                            }
                            error={
                                notificationsError
                            }
                            unreadCount={
                                unreadNotificationCount
                            }
                            onRead={
                                handleNotificationRead
                            }
                            onReadAll={
                                handleMarkAllNotificationsRead
                            }
                            onRetry={
                                loadNotifications
                            }
                            navigate={
                                navigate
                            }
                        />
                    )}
                </div>
            </main>
        </div>
    );
}

function ProfileView({
    user,
    profile,
    profilePicture,
    initials,
    completion,
    skills,
    goals,
    sessions,
    completedGoals,
    navigateView,
    onRefresh
}) {
    const name = nameOrLearner(profile, user);
    const role =
        profile?.targetRole?.trim() ||
        profile?.experienceLevel?.trim() ||
        "Learner";

    const email =
        user?.email ||
        profile?.email ||
        "Email not available";

    const location =
        profile?.location ||
        profile?.city ||
        "India";

    const timezone =
        profile?.timezone ||
        "Asia/Kolkata";

    const memberSince =
        user?.createdAt ||
        user?.createdDate ||
        profile?.createdAt ||
        null;

    const formatMemberSince = value => {
        if (!value) return "Active learner";

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return "Active learner";
        }

        return `Member since ${date.toLocaleDateString("en-IN", {
            month: "short",
            year: "numeric"
        })}`;
    };

    const scrollToSection = index => {
        const cards = document.querySelectorAll(
            ".profile-page .onboarding-card"
        );

        const target = cards[index];

        if (target) {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    };

    const firstSkill = skills[0];
    const firstGoal = goals[0];

    return (
        <div className="profile-page">
            <section className="profile-hero ui-animate">
                <div className="profile-hero-content">
                    <div className="profile-hero-eyebrow">
                        <span className="eyebrow-dot" />
                        MY PROFILE
                    </div>

                    <h1>
                        Your learning <span>identity.</span>
                    </h1>

                    <p>
                        Shape the profile experts see, showcase what you are
                        learning, and make your next mentoring conversation more
                        relevant.
                    </p>

                    <div className="profile-hero-tags">
                        <span>
                            <ShieldCheck size={14} />
                            {role}
                        </span>
                        <span>
                            <Code2 size={14} />
                            {skills.length} skills
                        </span>
                        <span>
                            <Target size={14} />
                            {goals.length} goals
                        </span>
                    </div>
                </div>

                <div className="profile-hero-quote">
                    <span>“</span>
                    <strong>
                        Learn with intent.
                        <br />
                        Grow with people.
                    </strong>
                    <small>— Ascendra</small>
                </div>
            </section>

            <section className="profile-overview-grid ui-animate">
                <div className="profile-overview-card">
                    <div className="profile-overview-photo">
                        <Avatar
                            src={profilePicture}
                            initials={initials}
                            large
                        />
                        <button
                            type="button"
                            className="profile-photo-edit"
                            onClick={() => scrollToSection(0)}
                            aria-label="Edit profile photo"
                            title="Edit profile"
                        >
                            <Pencil size={14} />
                        </button>
                    </div>

                    <div className="profile-overview-main">
                        <div className="profile-name-line">
                            <h2>{name}</h2>
                            <span className="profile-live-badge">
                                <span />
                                Active
                            </span>
                        </div>

                        <div className="profile-email-line">
                            <Mail size={15} />
                            <span>{email}</span>
                        </div>

                        <div className="profile-meta-row">
                            <span className="profile-role-badge">
                                <ShieldCheck size={13} />
                                {role}
                            </span>
                            <span>
                                <Clock3 size={13} />
                                {formatMemberSince(memberSince)}
                            </span>
                        </div>
                    </div>

                    <div className="profile-overview-message">
                        <div className="profile-overview-message-icon">
                            <Zap size={20} />
                        </div>
                        <div>
                            <strong>Keep building.</strong>
                            <span>
                                Your profile helps Ascendra connect you with
                                better-fit experts.
                            </span>
                        </div>
                    </div>
                </div>

                <div className="profile-completion-card">
                    <div
                        className="profile-completion-ring"
                        style={{
                            "--progress": `${Math.max(0, Math.min(100, completion)) * 3.6}deg`
                        }}
                    >
                        <div className="profile-completion-ring-inner">
                            <strong>{completion}%</strong>
                            <span>complete</span>
                        </div>
                    </div>

                    <div className="profile-completion-copy">
                        <span>PROFILE COMPLETION</span>
                        <h2>
                            {completion >= 100
                                ? "You're all set"
                                : "Keep going"}
                        </h2>
                        <p>
                            {completion >= 100
                                ? "Your learner profile is ready to connect with mentors."
                                : "Add more profile details to improve mentor recommendations."}
                        </p>
                        <button
                            type="button"
                            className="button button-primary compact-button"
                            onClick={() => scrollToSection(0)}
                        >
                            {completion >= 100 ? "Review profile" : "Complete profile"}
                            <ArrowRight size={15} />
                        </button>
                    </div>
                </div>
            </section>

            <section className="profile-tabs ui-animate">
                <button
                    type="button"
                    className="profile-tab active"
                    onClick={() => scrollToSection(0)}
                >
                    <UserRound size={17} />
                    Profile
                </button>
                <button
                    type="button"
                    className="profile-tab"
                    onClick={() => scrollToSection(1)}
                >
                    <ShieldCheck size={17} />
                    Experience
                </button>
                <button
                    type="button"
                    className="profile-tab"
                    onClick={() => scrollToSection(2)}
                >
                    <Code2 size={17} />
                    Skills
                </button>
                <button
                    type="button"
                    className="profile-tab"
                    onClick={() => scrollToSection(3)}
                >
                    <Target size={17} />
                    Goals
                </button>
            </section>

            <section className="profile-content-layout">
                <div className="profile-editor-column">
                    <LearnerOnboarding
                        embedded
                        onDone={async () => {
                            await onRefresh();
                            navigateView("dashboard");
                        }}
                    />
                </div>

                <aside className="profile-side-column">
                    <div className="profile-side-card profile-learning-card">
                        <div className="profile-side-heading">
                            <div className="profile-side-icon cyan">
                                <TrendingUp size={17} />
                            </div>
                            <div>
                                <strong>Learning snapshot</strong>
                                <span>Your current progress signals</span>
                            </div>
                        </div>

                        <div className="profile-stat-stack">
                            <div className="profile-stat-item">
                                <div className="profile-stat-icon teal">
                                    <Code2 size={15} />
                                </div>
                                <div>
                                    <strong>{skills.length}</strong>
                                    <span>Skills added</span>
                                </div>
                            </div>

                            <div className="profile-stat-item">
                                <div className="profile-stat-icon blue">
                                    <Target size={15} />
                                </div>
                                <div>
                                    <strong>{completedGoals}</strong>
                                    <span>Goals completed</span>
                                </div>
                            </div>

                            <div className="profile-stat-item">
                                <div className="profile-stat-icon purple">
                                    <CalendarDays size={15} />
                                </div>
                                <div>
                                    <strong>{sessions.length}</strong>
                                    <span>Sessions booked</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="profile-side-card profile-focus-card">
                        <span className="profile-card-kicker">YOUR CURRENT FOCUS</span>
                        <h3>
                            {firstGoal
                                ? getGoalTitle(firstGoal)
                                : "Define your next learning goal"}
                        </h3>
                        <p>
                            {firstGoal
                                ? getGoalDescription(firstGoal)
                                : "A clear goal helps you find the right expert and turn every session into measurable progress."}
                        </p>
                        <button
                            type="button"
                            className="profile-side-action"
                            onClick={() => scrollToSection(3)}
                        >
                            Manage goals
                            <ArrowRight size={14} />
                        </button>
                    </div>

                    <div className="profile-side-card profile-skill-card">
                        <div className="profile-side-heading">
                            <div className="profile-side-icon blue">
                                <Code2 size={17} />
                            </div>
                            <div>
                                <strong>Skill spotlight</strong>
                                <span>Keep your strengths current</span>
                            </div>
                        </div>

                        {firstSkill ? (
                            <div className="profile-highlight-skill">
                                <strong>{getSkillName(firstSkill)}</strong>
                                <span>
                                    {getSkillLevel(firstSkill)}% proficiency
                                </span>
                                <div className="profile-highlight-track">
                                    <span
                                        style={{
                                            width: `${Math.max(0, Math.min(100, getSkillLevel(firstSkill)))}%`
                                        }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="profile-empty-side">
                                <span>No skills added yet.</span>
                                <button
                                    type="button"
                                    onClick={() => scrollToSection(2)}
                                >
                                    Add a skill
                                    <ArrowRight size={13} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="profile-side-card profile-location-card">
                        <div className="profile-side-heading">
                            <div className="profile-side-icon violet">
                                <Clock3 size={17} />
                            </div>
                            <div>
                                <strong>Availability context</strong>
                                <span>Useful for mentor matching</span>
                            </div>
                        </div>
                        <div className="profile-location-row">
                            <span>Location</span>
                            <strong>{location}</strong>
                        </div>
                        <div className="profile-location-row">
                            <span>Timezone</span>
                            <strong>{timezone}</strong>
                        </div>
                    </div>
                </aside>
            </section>
        </div>
    );
}

function DashboardView({
    firstName,
    user,
    profile,
    profilePicture,
    initials,
    completion,
    skills,
    goals,
    averageSkill,
    completedGoals,
    navigateView
}) {
    const currentGoal = goals[0] || null;
    const goalTitle = getGoalTitle(currentGoal);
    const profileRole =
        profile?.targetRole?.trim() ||
        profile?.experienceLevel?.trim() ||
        "Learner";

    const levelLabel = value => {
        const numeric = Number(value || 0);
        if (numeric >= 80) return "Advanced";
        if (numeric >= 55) return "Intermediate";
        if (numeric > 0) return "Beginner";
        return "Not started";
    };

    return (
        <div className="dashboard-page">
            <section className="dashboard-hero ui-animate">
                <div className="hero-copy">
                    <div className="hero-eyebrow-row">
                        <span className="eyebrow hero-eyebrow">
                            <span className="eyebrow-dot" />
                            LEARNER WORKSPACE
                        </span>
                        <span
                            className={`hero-status-pill ${
                                profile?.id
                                    ? ""
                                    : "profile-status-missing"
                            }`}
                        >
                            <span />
                            {profile?.id
                                ? "Profile active"
                                : "Profile setup needed"}
                        </span>
                    </div>

                    <h1>
                        Welcome back, <span>{firstName}.</span>
                    </h1>

                    <p>
                        Your learning workspace is ready. Track your skills,
                        manage your goals and connect with experts from one place.
                    </p>

                    <div className="hero-account">
                        <ShieldCheck size={16} />
                        <span>{user?.email || profile?.email || "Learner account"}</span>
                    </div>

                    <div className="hero-actions">
                        <button
                            type="button"
                            className="button button-primary"
                            onClick={() =>
                                navigateView(
                                    profile?.id
                                        ? "experts"
                                        : "profile"
                                )
                            }
                        >
                            {profile?.id
                                ? "Find an expert"
                                : "Complete profile"}
                            <ArrowRight size={17} />
                        </button>

                        <button
                            type="button"
                            className="button button-ghost"
                            onClick={() =>
                                navigateView("profile")
                            }
                        >
                            <Pencil size={16} />
                            {profile?.id
                                ? "Update profile"
                                : "Open profile"}
                        </button>
                    </div>
                </div>

                <div className="hero-profile-card">
                    <div className="hero-profile-top">
                        <div className="hero-avatar-shell">
                            <Avatar
                                src={profilePicture}
                                initials={initials}
                                large
                            />
                        </div>
                        <div className="hero-profile-meta">
                            <span>YOUR PROFILE</span>
                            <strong>{nameOrLearner(profile, user)}</strong>
                            <small>{profileRole}</small>
                        </div>
                    </div>

                    <div className="hero-profile-divider" />

                    <div className="hero-completion-row">
                        <div>
                            <span>PROFILE COMPLETION</span>
                            <strong>{completion}%</strong>
                        </div>
                        <span className="completion-label">
                            {completion >= 100 ? "Complete" : "In progress"}
                        </span>
                    </div>

                    <div className="hero-progress-track">
                        <span style={{ width: `${completion}%` }} />
                    </div>

                    <p className="hero-profile-note">
                        {completion >= 100
                            ? "Your profile is ready for expert matching."
                            : "Complete your profile to improve expert recommendations."}
                    </p>
                </div>
            </section>

            <section className="dashboard-section-heading ui-animate">
                <div>
                    <span className="eyebrow">
                        <span className="eyebrow-dot" />
                        AT A GLANCE
                    </span>
                    <h2>Your learning overview</h2>
                </div>
                <span className="dashboard-updated">Live workspace data</span>
            </section>

            {!profile?.id && (
                <section className="profile-setup-notice ui-animate">
                    <div className="profile-setup-icon">
                        <UserRound size={22} />
                    </div>

                    <div className="profile-setup-copy">
                        <span className="card-eyebrow">
                            FIRST STEP
                        </span>
                        <h2>Complete your learner profile</h2>
                        <p>
                            Your account is ready, but a learner profile has
                            not been created yet. Add your experience, target
                            role, skills and goals before booking a mentor.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="button button-primary compact-button"
                        onClick={() =>
                            navigateView("profile")
                        }
                    >
                        Complete profile
                        <ArrowRight size={16} />
                    </button>
                </section>
            )}

            <section className="stats-grid">
                <StatCard
                    icon={<Target size={21} />}
                    label="CURRENT GOAL"
                    value={goalTitle}
                    text={goals.length ? "Your active direction" : "Create your first goal"}
                    onClick={() => navigateView("profile")}
                />

                <StatCard
                    icon={<Code2 size={21} />}
                    label="SKILLS"
                    value={skills.length}
                    text="Skills in your profile"
                    onClick={() => navigateView("profile")}
                />

                <StatCard
                    icon={<TrendingUp size={21} />}
                    label="AVERAGE SKILL"
                    value={`${averageSkill}%`}
                    text={levelLabel(averageSkill)}
                    onClick={() => navigateView("progress")}
                />

                <StatCard
                    icon={<CheckCircle2 size={21} />}
                    label="GOALS COMPLETED"
                    value={completedGoals}
                    text={`of ${goals.length} total goals`}
                    onClick={() => navigateView("progress")}
                />
            </section>

            <section className="dashboard-grid">
                <div className="dashboard-card dashboard-panel ui-animate">
                    <CardHeader
                        eyebrow="YOUR SKILLS"
                        title="Skill snapshot"
                        action="View all"
                        onClick={() => navigateView("progress")}
                    />

                    {skills.length === 0 ? (
                        <EmptyState
                            icon={<Code2 size={22} />}
                            title="No skills yet"
                            text="Add your skills to build a stronger expert-matching profile."
                            action="Add skills"
                            onClick={() => navigateView("profile")}
                        />
                    ) : (
                        <div className="skill-list">
                            {skills.slice(0, 5).map((skill, index) => {
                                const level = Math.min(
                                    Math.max(getSkillLevel(skill), 0),
                                    100
                                );

                                return (
                                    <div
                                        className="skill-row"
                                        key={
                                            skill?.id ||
                                            `${getSkillName(skill)}-${index}`
                                        }
                                    >
                                        <div className="skill-row-top">
                                            <div className="skill-name-wrap">
                                                <span className="skill-bullet" />
                                                <span>{getSkillName(skill)}</span>
                                            </div>
                                            <strong>{level}%</strong>
                                        </div>
                                        <div className="skill-progress">
                                            <span style={{ width: `${level}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="dashboard-card dashboard-panel ui-animate">
                    <CardHeader
                        eyebrow="CURRENT GOAL"
                        title="Where you're going"
                        action="Manage"
                        onClick={() => navigateView("profile")}
                    />

                    {currentGoal ? (
                        <div className="goal-preview">
                            <div className="goal-preview-icon">
                                <Target size={22} />
                            </div>

                            <div className="goal-preview-content">
                                <span className="goal-status">ACTIVE GOAL</span>
                                <strong>{goalTitle}</strong>
                                <p>{getGoalDescription(currentGoal)}</p>
                            </div>
                        </div>
                    ) : (
                        <EmptyState
                            icon={<Target size={22} />}
                            title="No goal created"
                            text="Create a clear goal so Ascendra can connect you with the right expert."
                            action="Create goal"
                            onClick={() => navigateView("profile")}
                        />
                    )}

                    {currentGoal && (
                        <button
                            type="button"
                            className="panel-link-button"
                            onClick={() => navigateView("profile")}
                        >
                            Refine this goal
                            <ArrowRight size={15} />
                        </button>
                    )}
                </div>
            </section>

            <section className="learning-journey-card ui-animate">
                <div className="learning-journey-icon">
                    <Zap size={22} />
                </div>

                <div className="learning-journey-copy">
                    <span>YOUR NEXT MOVE</span>
                    <h2>Turn your profile into progress.</h2>
                    <p>
                        Find the right expert, book a focused session and keep
                        your growth measurable inside Ascendra.
                    </p>
                </div>

                <button
                    className="button journey-button"
                    type="button"
                    onClick={() => navigateView("experts")}
                >
                    Explore experts
                    <ArrowRight size={17} />
                </button>
            </section>
        </div>
    );
}

function nameOrLearner(profile, user) {
    return (
        user?.name?.trim() ||
        user?.fullName?.trim() ||
        user?.username?.trim() ||
        profile?.name?.trim() ||
        "Learner"
    );
}

function CardHeader({
    eyebrow,
    title,
    action,
    onClick
}) {
    return (
        <div className="card-header">
            <div>
                <span className="card-eyebrow">
                    {eyebrow}
                </span>

                <h2>
                    {title}
                </h2>
            </div>

            {action && (
                <button
                    type="button"
                    onClick={
                        onClick
                    }
                    className="text-action"
                >
                    {action}

                    <ArrowRight
                        size={15}
                    />
                </button>
            )}
        </div>
    );
}

function StatCard({
    icon,
    label,
    value,
    text,
    onClick
}) {
    return (
        <button
            className="dashboard-card stat-card ui-animate"
            onClick={onClick}
            type="button"
        >
            <div className="stat-icon">
                {icon}
            </div>

            <div className="stat-content">
                <span>
                    {label}
                </span>

                <strong>
                    {value}
                </strong>

                <small>
                    {text}
                </small>
            </div>

            <ChevronRight
                className="stat-arrow"
                size={18}
            />
        </button>
    );
}

function EmptyState({
    icon,
    title,
    text,
    action,
    onClick
}) {
    return (
        <div className="empty-state">
            <div className="empty-state-icon">
                {icon}
            </div>

            <h3>
                {title}
            </h3>

            <p>
                {text}
            </p>

            {action && (
                <button
                    className="button button-primary compact-button"
                    onClick={
                        onClick
                    }
                    type="button"
                >
                    <Plus
                        size={16}
                    />

                    {action}

                    <ArrowRight
                        size={16}
                    />
                </button>
            )}
        </div>
    );
}

function SessionsView({
    sessions,
    loading,
    error,
    navigate,
    navigateView
}) {
    const getMinutes = (value) => {
        if (!value) {
            return null;
        }

        const match =
            String(value).match(
                /^(\d{1,2}):(\d{2})/
            );

        if (!match) {
            return null;
        }

        return (
            Number(match[1]) * 60 +
            Number(match[2])
        );
    };

    const getSessionState = (session) => {
        const status =
            String(
                session?.status || ""
            ).toUpperCase();

        if (
            status === "CANCELLED"
        ) {
            return {
                key: "cancelled",
                label: "Cancelled"
            };
        }

        if (
            status === "COMPLETED"
        ) {
            return {
                key: "completed",
                label: "Completed"
            };
        }

        if (
            status ===
            "PENDING_PAYMENT"
        ) {
            return {
                key: "pending",
                label: "Payment Pending"
            };
        }

        const bookingDate =
            String(
                session?.bookingDate ||
                ""
            ).slice(0, 10);

        const now = new Date();

        const today =
            `${now.getFullYear()}-${String(
                now.getMonth() + 1
            ).padStart(2, "0")}-${String(
                now.getDate()
            ).padStart(2, "0")}`;

        if (
            bookingDate ===
            today
        ) {
            const start =
                getMinutes(
                    session?.startTime
                );

            const end =
                getMinutes(
                    session?.endTime
                );

            const now =
                new Date();

            const current =
                now.getHours() * 60 +
                now.getMinutes();

            if (
                start !== null &&
                end !== null &&
                current >= start &&
                current < end &&
                status === "CONFIRMED"
            ) {
                return {
                    key: "running",
                    label: "Running"
                };
            }
        }

        if (
            status === "CONFIRMED"
        ) {
            return {
                key: "upcoming",
                label: "Upcoming"
            };
        }

        return {
            key: "upcoming",
            label:
                status ||
                "Upcoming"
        };
    };

    const formatDate = (value) => {
        if (!value) {
            return "Date unavailable";
        }

        const date =
            new Date(
                `${String(value).slice(0, 10)}T00:00:00`
            );

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return String(value);
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );
    };

    const formatTime = (value) => {
        if (!value) {
            return "Time unavailable";
        }

        const match =
            String(value).match(
                /^(\d{1,2}):(\d{2})/
            );

        if (!match) {
            return String(value);
        }

        const hour =
            Number(match[1]);

        const minute =
            match[2];

        const suffix =
            hour >= 12
                ? "PM"
                : "AM";

        const displayHour =
            hour % 12 || 12;

        return `${displayHour}:${minute} ${suffix}`;
    };

    const formatTimeRange = (
        start,
        end
    ) => {
        return `${formatTime(
            start
        )} – ${formatTime(end)}`;
    };

    const sortedSessions =
        [...sessions].sort(
            (a, b) => {
                const aValue =
                    `${a?.bookingDate || ""}T${a?.startTime || ""}`;

                const bValue =
                    `${b?.bookingDate || ""}T${b?.startTime || ""}`;

                return aValue.localeCompare(
                    bValue
                );
            }
        );

    if (loading) {
        return (
            <div className="inner-page">
                <section className="page-heading">
                    <span className="eyebrow">
                        <span className="eyebrow-dot" />
                        MY SESSIONS
                    </span>

                    <h1>
                        Your mentoring sessions
                    </h1>

                    <p>
                        Loading your scheduled
                        mentoring sessions...
                    </p>
                </section>

                <div className="sessions-loading">
                    <div className="loading-spinner" />

                    <span>
                        Loading sessions...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="inner-page sessions-page">
            <section className="page-heading sessions-heading">
                <div>
                    <span className="eyebrow">
                        <span className="eyebrow-dot" />
                        MY SESSIONS
                    </span>

                    <h1>
                        Your mentoring sessions
                    </h1>

                    <p>
                        Manage your upcoming,
                        running and completed
                        mentoring sessions.
                    </p>
                </div>

                <button
                    type="button"
                    className="button button-primary"
                    onClick={() =>
                        navigateView(
                            "experts"
                        )
                    }
                >
                    <Plus size={17} />
                    Book a session
                </button>
            </section>

            {error && (
                <div className="sessions-error">
                    <strong>
                        Unable to load sessions
                    </strong>

                    <span>
                        {error}
                    </span>
                </div>
            )}

            {!error &&
                sortedSessions.length ===
                    0 && (
                    <div className="dashboard-card sessions-empty">
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <CalendarDays
                                    size={24}
                                />
                            </div>

                            <h3>
                                No sessions yet
                            </h3>

                            <p>
                                Your booked mentoring
                                sessions will appear
                                here.
                            </p>

                            <button
                                type="button"
                                className="button button-primary compact-button"
                                onClick={() =>
                                    navigate(
                                        "/learner/experts"
                                    )
                                }
                            >
                                Find an expert
                                <ArrowRight
                                    size={16}
                                />
                            </button>
                        </div>
                    </div>
                )}

            {sortedSessions.length >
                0 && (
                <div className="sessions-list">
                    {sortedSessions.map(
                        (session) => {
                            const state =
                                getSessionState(
                                    session
                                );

                            const isJoinable =
                                (
                                    state.key ===
                                        "running" ||
                                    state.key ===
                                        "upcoming"
                                ) &&
                                String(
                                    session?.status ||
                                        ""
                                ).toUpperCase() ===
                                    "CONFIRMED" &&
                                session?.zoomJoinUrl;

                            return (
                                <article
                                    className={`dashboard-card session-card session-${state.key}`}
                                    key={
                                        session?.id
                                    }
                                >
                                    <div className="session-card-top">
                                        <div className="session-expert">
                                            <div className="session-avatar">
                                                {String(
                                                    session?.expertName ||
                                                        "E"
                                                )
                                                    .trim()
                                                    .charAt(
                                                        0
                                                    )
                                                    .toUpperCase()}
                                            </div>

                                            <div className="session-expert-copy">
                                                <span className="session-label">
                                                    EXPERT
                                                </span>

                                                <h2>
                                                    {
                                                        session?.expertName ||
                                                        "Expert"
                                                    }
                                                </h2>

                                                <p>
                                                    {
                                                        session?.professionalTitle ||
                                                        "Mentor"
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <span
                                            className={`session-status status-${state.key}`}
                                        >
                                            {state.key ===
                                                "running" && (
                                                <span className="session-live-dot" />
                                            )}

                                            {
                                                state.label
                                            }
                                        </span>
                                    </div>

                                    <div className="session-details">
                                        <div className="session-detail">
                                            <CalendarDays
                                                size={
                                                    18
                                                }
                                            />

                                            <div>
                                                <span>
                                                    DATE
                                                </span>

                                                <strong>
                                                    {formatDate(
                                                        session?.bookingDate
                                                    )}
                                                </strong>
                                            </div>
                                        </div>

                                        <div className="session-detail">
                                            <Clock3
                                                size={
                                                    18
                                                }
                                            />

                                            <div>
                                                <span>
                                                    TIME
                                                </span>

                                                <strong>
                                                    {formatTimeRange(
                                                        session?.startTime,
                                                        session?.endTime
                                                    )}
                                                </strong>
                                            </div>
                                        </div>

                                        <div className="session-detail">
                                            <CreditCard
                                                size={
                                                    18
                                                }
                                            />

                                            <div>
                                                <span>
                                                    AMOUNT
                                                </span>

                                                <strong>
                                                    ₹
                                                    {Number(
                                                        session?.amount ||
                                                            0
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </strong>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="session-card-bottom">
                                        <span className="session-booking-id">
                                            Booking #
                                            {
                                                session?.id
                                            }
                                        </span>

                                        {isJoinable ? (
                                            <a
                                                href={
                                                    session.zoomJoinUrl
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                                className="session-join-button"
                                            >
                                                <Video
                                                    size={
                                                        16
                                                    }
                                                />

                                                Join Session

                                                <ArrowRight
                                                    size={
                                                        15
                                                    }
                                                />
                                            </a>
                                        ) : (
                                            <span className="session-info-text">
                                                {state.key ===
                                                "pending"
                                                    ? "Complete payment to confirm"
                                                    : state.key ===
                                                        "completed"
                                                    ? "Session completed"
                                                    : state.key ===
                                                        "cancelled"
                                                    ? "Session cancelled"
                                                    : "Session scheduled"}
                                            </span>
                                        )}
                                    </div>
                                </article>
                            );
                        }
                    )}
                </div>
            )}
        </div>
    );
}


function NotificationsView({
    notifications,
    notificationDetails,
    loading,
    error,
    unreadCount,
    onRead,
    onReadAll,
    onRetry,
    navigate
}) {
    const [selectedReceipt, setSelectedReceipt] = useState(null);

    const formatDate = value => {
        if (!value) return "Not available";

        const text = String(value).slice(0, 10);
        const date = new Date(`${text}T00:00:00`);

        if (Number.isNaN(date.getTime())) {
            return text;
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
    };

    const timeToMinutes = value => {
        if (!value) return null;

        const match =
            String(value).match(
                /^(\d{1,2}):(\d{2})/
            );

        if (!match) return null;

        return (
            Number(match[1]) * 60 +
            Number(match[2])
        );
    };

    const formatTime = value => {
        const minutes = timeToMinutes(value);

        if (minutes === null) {
            return value || "Not available";
        }

        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        return `${hours % 12 || 12}:${String(
            mins
        ).padStart(2, "0")} ${
            hours >= 12 ? "PM" : "AM"
        }`;
    };

    const formatAmount = value => {
        const amount = Number(value);

        if (Number.isNaN(amount)) {
            return "₹0";
        }

        return `₹${amount.toLocaleString("en-IN")}`;
    };

    const getBookingId = booking =>
        booking?.id ??
        booking?.bookingId ??
        booking?.booking?.id ??
        null;

    const getExpertName = booking =>
        booking?.expertName ||
        booking?.expert?.name ||
        "Expert";

    const getPaymentStatus = payment =>
        String(
            payment?.status ||
            payment?.paymentStatus ||
            ""
        ).toUpperCase();

    const getIcon = type => {
        switch (
            String(type || "").toUpperCase()
        ) {
            case "PAYMENT_SUCCESS":
                return "₹";
            case "PAYMENT_FAILED":
                return "!";
            case "BOOKING_CANCELLED":
                return "×";
            default:
                return "✓";
        }
    };

    const getLabel = type => {
        switch (
            String(type || "").toUpperCase()
        ) {
            case "PAYMENT_SUCCESS":
                return "Payment successful";
            case "PAYMENT_FAILED":
                return "Payment failed";
            case "BOOKING_CANCELLED":
                return "Booking cancelled";
            case "SESSION_CREATED":
                return "Session created";
            default:
                return "Session confirmed";
        }
    };

    const buildReceiptFileName = (booking, payment) => {
        const bookingId = getBookingId(booking) || "payment";
        return `Ascendra-Payment-Receipt-${bookingId}.pdf`;
    };

    const escapePdfText = value =>
        String(value ?? "")
            .replace(/\\/g, "\\\\")
            .replace(/\(/g, "\\(")
            .replace(/\)/g, "\\)")
            .replace(/\r?\n/g, " ");

    const downloadReceipt = (booking, payment) => {
        const bookingId = getBookingId(booking) || "N/A";
        const expertName = getExpertName(booking);
        const date = formatDate(booking?.bookingDate);
        const time = `${formatTime(booking?.startTime)} - ${formatTime(booking?.endTime)}`;
        const amount = formatAmount(payment?.amount ?? booking?.amount);
        const transactionId =
            payment?.transactionId ||
            payment?.razorpayPaymentId ||
            "Not available";
        const paymentStatus = getPaymentStatus(payment) || "SUCCESS";
        const paymentDate = payment?.paidAt || payment?.createdAt || booking?.createdAt;
        const issuedOn = paymentDate
            ? new Date(paymentDate).toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit"
            })
            : new Date().toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit"
            });

        const pdfAmount = amount.replace(/₹/g, "INR ");
        const pdfSafe = value => String(value ?? "").replace(/[^\x20-\x7E]/g, "?");

        const lines = [
            ["ASCENDRA", 34],
            ["PAYMENT RECEIPT", 24],
            ["Mentoring session payment confirmation", 12],
            ["", 12],
            [`Payment status: ${paymentStatus}`, 12],
            [`Transaction ID: ${transactionId}`, 12],
            [`Booking ID: #${bookingId}`, 12],
            [`Mentor: ${expertName}`, 12],
            [`Session date: ${date}`, 12],
            [`Session time: ${time}`, 12],
            [`Amount paid: ${pdfAmount}`, 16],
            [`Issued on: ${issuedOn}`, 11],
            ["", 12],
            ["Thank you for learning with Ascendra.", 12]
        ];

        const escapeForPdf = escapePdfText;
        const contentParts = [
            "BT",
            "/F1 20 Tf",
            "50 760 Td"
        ];

        lines.forEach(([text, size], index) => {
            if (index > 0) {
                contentParts.push("0 -34 Td");
            }
            contentParts.push(`/F1 ${size} Tf`);
            contentParts.push(`(${escapeForPdf(pdfSafe(text))}) Tj`);
        });
        contentParts.push("ET");

        const stream = contentParts.join("\n");
        const objects = [];
        objects.push("<< /Type /Catalog /Pages 2 0 R >>");
        objects.push("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
        objects.push("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>");
        objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
        objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

        let pdf = "%PDF-1.4\n";
        const offsets = [0];
        objects.forEach((object, index) => {
            offsets.push(pdf.length);
            pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
        });

        const xrefOffset = pdf.length;
        pdf += `xref\n0 ${objects.length + 1}\n`;
        pdf += "0000000000 65535 f \n";
        for (let index = 1; index <= objects.length; index += 1) {
            pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
        }
        pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

        const blob = new Blob([pdf], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = buildReceiptFileName(booking, payment);
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    };

    const printReceipt = receipt => {
        if (!receipt) return;
        const booking = receipt.booking || {};
        const payment = receipt.payment || {};
        const bookingId = getBookingId(booking) || "N/A";
        const transactionId =
            payment?.transactionId ||
            payment?.razorpayPaymentId ||
            "Not available";
        const amount = formatAmount(payment?.amount ?? booking?.amount);
        const popup = window.open("", "_blank", "noopener,noreferrer");
        if (!popup) return;

        popup.document.write(`<!doctype html><html><head><title>Ascendra Payment Receipt</title><style>
            body{font-family:Arial,sans-serif;background:#f5f8f7;margin:0;padding:40px;color:#10201f}
            .receipt{max-width:680px;margin:auto;background:#fff;border:1px solid #dfe8e5;border-radius:18px;padding:34px;box-shadow:0 12px 35px rgba(16,32,31,.08)}
            .brand{font-size:28px;font-weight:800;letter-spacing:.04em}.kicker{margin-top:6px;color:#087d76;font-size:11px;font-weight:800;letter-spacing:.14em}
            h1{font-family:Georgia,serif;font-size:30px;margin:8px 0}.sub{color:#657674;font-size:13px}.status{display:inline-block;margin-top:18px;padding:7px 10px;border-radius:99px;background:#eaf8f1;color:#15845f;font-size:11px;font-weight:800}
            .grid{display:grid;grid-template-columns:1fr 1fr;margin-top:24px;border:1px solid #dfe8e5}.item{padding:14px;border-bottom:1px solid #dfe8e5}.item:nth-child(odd){border-right:1px solid #dfe8e5}.item:nth-last-child(-n+2){border-bottom:0}.label{display:block;color:#657674;font-size:10px;margin-bottom:5px}.value{font-size:13px;font-weight:700;overflow-wrap:anywhere}.amount{margin-top:24px;padding:18px;background:#f8fbfa;border-radius:12px}.amount span{color:#657674;font-size:11px}.amount strong{display:block;margin-top:5px;font-size:25px}.footer{margin-top:25px;color:#657674;font-size:11px;line-height:1.6}
            @media print{body{padding:0;background:#fff}.receipt{box-shadow:none;border:0;max-width:none}}
        </style></head><body><main class="receipt">
            <div class="brand">ASCENDRA</div><div class="kicker">PAYMENT RECEIPT</div><h1>Payment confirmed</h1><div class="sub">Your mentoring session payment has been recorded successfully.</div>
            <div class="status">PAID</div><section class="grid">
            <div class="item"><span class="label">Mentor</span><span class="value">${expertName.replace(/</g,"&lt;")}</span></div>
            <div class="item"><span class="label">Session date</span><span class="value">${date}</span></div>
            <div class="item"><span class="label">Session time</span><span class="value">${time}</span></div>
            <div class="item"><span class="label">Booking ID</span><span class="value">#${bookingId}</span></div>
            <div class="item"><span class="label">Transaction ID</span><span class="value">${transactionId}</span></div>
            <div class="item"><span class="label">Issued on</span><span class="value">${new Date().toLocaleString("en-IN")}</span></div></section>
            <div class="amount"><span>Amount paid</span><strong>${amount}</strong></div><div class="footer">Thank you for learning with Ascendra. Keep this receipt for your records.</div>
            </main><script>window.onload=()=>window.print();</script></body></html>`);
        popup.document.close();
    };

    return (
        <div className="notifications-page">
            <div className="notifications-header">
                <div>
                    <span className="eyebrow">
                        <span className="eyebrow-dot" />
                        NOTIFICATIONS
                    </span>

                    <h1>
                        Your notifications
                    </h1>

                    <p>
                        Stay updated with your
                        bookings, payments and
                        mentoring sessions.
                    </p>
                </div>

                {unreadCount > 0 && (
                    <button
                        type="button"
                        className="notifications-read-all"
                        onClick={onReadAll}
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {loading && (
                <div className="notifications-state">
                    <div className="notifications-loader" />
                    <h3>
                        Loading notifications
                    </h3>
                    <p>
                        Checking your latest
                        booking and payment updates.
                    </p>
                </div>
            )}

            {!loading && error && (
                <div className="notifications-state notifications-error">
                    <div className="notifications-state-icon">
                        !
                    </div>
                    <h3>
                        Unable to load notifications
                    </h3>
                    <p>{error}</p>
                    <button
                        type="button"
                        className="button button-primary"
                        onClick={onRetry}
                    >
                        Try again
                    </button>
                </div>
            )}

            {!loading &&
                !error &&
                notifications.length === 0 && (
                    <div className="notifications-state">
                        <div className="notifications-state-icon">
                            <Bell size={22} />
                        </div>
                        <h3>
                            No notifications yet
                        </h3>
                        <p>
                            Payment, booking and
                            session updates will
                            appear here.
                        </p>
                    </div>
                )}

            {!loading &&
                !error &&
                notifications.length > 0 && (
                    <div className="notifications-list">
                        {notifications.map(
                            notification => {
                                const detail =
                                    notificationDetails?.[
                                        String(
                                            notification.id
                                        )
                                    ] || {};

                                const booking =
                                    detail.booking;

                                const payment =
                                    detail.payment;

                                const bookingId =
                                    getBookingId(
                                        booking
                                    ) ??
                                    notification.referenceId;

                                const isPayment =
                                    String(
                                        notification.type ||
                                        ""
                                    ).toUpperCase() ===
                                    "PAYMENT_SUCCESS";

                                return (
                                    <article
                                        key={
                                            notification.id
                                        }
                                        className={`notification-card ${
                                            notification.read
                                                ? ""
                                                : "is-unread"
                                        }`}
                                        onClick={() =>
                                            onRead(
                                                notification
                                            )
                                        }
                                    >
                                        <div className="notification-card-top">
                                            <div
                                                className={`notification-icon notification-icon-${String(
                                                    notification.type ||
                                                        ""
                                                ).toLowerCase()}`}
                                            >
                                                {getIcon(
                                                    notification.type
                                                )}
                                            </div>

                                            <div className="notification-main">
                                                <div className="notification-title-row">
                                                    <div>
                                                        <span className="notification-type">
                                                            {getLabel(
                                                                notification.type
                                                            )}
                                                        </span>

                                                        <h2>
                                                            {
                                                                notification.title
                                                            }
                                                        </h2>
                                                    </div>

                                                    {!notification.read && (
                                                        <span className="notification-unread-dot" />
                                                    )}
                                                </div>

                                                <p className="notification-message">
                                                    {
                                                        notification.message
                                                    }
                                                </p>

                                                <span className="notification-time">
                                                    {notification.createdAt
                                                        ? new Date(
                                                            notification.createdAt
                                                        ).toLocaleString(
                                                            "en-IN",
                                                            {
                                                                day: "numeric",
                                                                month: "short",
                                                                hour: "numeric",
                                                                minute: "2-digit"
                                                            }
                                                        )
                                                        : ""}
                                                </span>
                                            </div>
                                        </div>

                                        {(booking ||
                                            payment) && (
                                            <div className="notification-receipt">
                                                <div className="notification-receipt-heading">
                                                    <div>
                                                        <span>
                                                            ASCENDRA
                                                        </span>
                                                        <strong>
                                                            {isPayment
                                                                ? "Payment receipt"
                                                                : "Booking details"}
                                                        </strong>
                                                    </div>

                                                    <span className="notification-success-badge">
                                                        {getPaymentStatus(
                                                            payment
                                                        ) ===
                                                        "SUCCESS"
                                                            ? "PAID"
                                                            : String(
                                                                booking?.status ||
                                                                ""
                                                            ).toUpperCase() ===
                                                                "CONFIRMED"
                                                            ? "CONFIRMED"
                                                            : String(
                                                                booking?.status ||
                                                                ""
                                                            ).toUpperCase()}
                                                    </span>
                                                </div>

                                                <div className="notification-receipt-grid">
                                                    <div>
                                                        <span>
                                                            Mentor
                                                        </span>
                                                        <strong>
                                                            {getExpertName(
                                                                booking
                                                            )}
                                                        </strong>
                                                    </div>

                                                    <div>
                                                        <span>
                                                            Date
                                                        </span>
                                                        <strong>
                                                            {formatDate(
                                                                booking?.bookingDate
                                                            )}
                                                        </strong>
                                                    </div>

                                                    <div>
                                                        <span>
                                                            Time
                                                        </span>
                                                        <strong>
                                                            {formatTime(
                                                                booking?.startTime
                                                            )}{" "}
                                                            –{" "}
                                                            {formatTime(
                                                                booking?.endTime
                                                            )}
                                                        </strong>
                                                    </div>

                                                    <div>
                                                        <span>
                                                            Amount
                                                        </span>
                                                        <strong>
                                                            {formatAmount(
                                                                payment?.amount ??
                                                                booking?.amount
                                                            )}
                                                        </strong>
                                                    </div>

                                                    <div>
                                                        <span>
                                                            Booking ID
                                                        </span>
                                                        <strong>
                                                            #
                                                            {
                                                                bookingId
                                                            }
                                                        </strong>
                                                    </div>

                                                    <div>
                                                        <span>
                                                            Transaction ID
                                                        </span>
                                                        <strong>
                                                            {payment?.transactionId ||
                                                                payment?.razorpayPaymentId ||
                                                                "Not available"}
                                                        </strong>
                                                    </div>
                                                </div>

                                                <div className="notification-actions">
                                                    {booking?.zoomJoinUrl && (
                                                        <button
                                                            type="button"
                                                            className="button button-primary"
                                                            onClick={
                                                                event => {
                                                                    event.stopPropagation();
                                                                    onRead(
                                                                        notification
                                                                    );
                                                                    window.open(
                                                                        booking.zoomJoinUrl,
                                                                        "_blank",
                                                                        "noopener,noreferrer"
                                                                    );
                                                                }
                                                            }
                                                        >
                                                            <Video
                                                                size={16}
                                                            />
                                                            Join session
                                                        </button>
                                                    )}

                                                    {isPayment && payment && (
                                                        <button
                                                            type="button"
                                                            className="notification-secondary-button notification-receipt-button"
                                                            onClick={event => {
                                                                event.stopPropagation();
                                                                onRead(notification);
                                                                setSelectedReceipt({ booking, payment });
                                                            }}
                                                        >
                                                            <ReceiptText size={15} />
                                                            View receipt
                                                        </button>
                                                    )}

                                                    {bookingId && (
                                                        <button
                                                            type="button"
                                                            className="notification-secondary-button"
                                                            onClick={
                                                                event => {
                                                                    event.stopPropagation();
                                                                    onRead(
                                                                        notification
                                                                    );
                                                                    navigate(
                                                                        `/learner?view=sessions`
                                                                    );
                                                                }
                                                            }
                                                        >
                                                            View session
                                                            <ArrowRight
                                                                size={16}
                                                            />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </article>
                                );
                            }
                        )}
                    </div>
                )}

            {selectedReceipt && (
                <div
                    className="receipt-modal-backdrop"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Payment receipt"
                    onMouseDown={event => {
                        if (event.target === event.currentTarget) {
                            setSelectedReceipt(null);
                        }
                    }}
                >
                    <div className="receipt-modal">
                        <button
                            type="button"
                            className="receipt-modal-close"
                            onClick={() => setSelectedReceipt(null)}
                            aria-label="Close receipt"
                        >
                            <X size={19} />
                        </button>

                        <div className="receipt-modal-head">
                            <div className="receipt-brand-mark">A</div>
                            <div>
                                <span>ASCENDRA</span>
                                <strong>Payment receipt</strong>
                            </div>
                            <span className="receipt-paid-badge">PAID</span>
                        </div>

                        <div className="receipt-modal-amount">
                            <span>Amount paid</span>
                            <strong>
                                {formatAmount(
                                    selectedReceipt.payment?.amount ??
                                    selectedReceipt.booking?.amount
                                )}
                            </strong>
                        </div>

                        <div className="receipt-modal-grid">
                            <div>
                                <span>Mentor</span>
                                <strong>{getExpertName(selectedReceipt.booking)}</strong>
                            </div>
                            <div>
                                <span>Session date</span>
                                <strong>{formatDate(selectedReceipt.booking?.bookingDate)}</strong>
                            </div>
                            <div>
                                <span>Session time</span>
                                <strong>
                                    {formatTime(selectedReceipt.booking?.startTime)} – {formatTime(selectedReceipt.booking?.endTime)}
                                </strong>
                            </div>
                            <div>
                                <span>Booking ID</span>
                                <strong>#{getBookingId(selectedReceipt.booking) || "N/A"}</strong>
                            </div>
                            <div className="receipt-wide-field">
                                <span>Transaction ID</span>
                                <strong>
                                    {selectedReceipt.payment?.transactionId ||
                                        selectedReceipt.payment?.razorpayPaymentId ||
                                        "Not available"}
                                </strong>
                            </div>
                            <div>
                                <span>Payment status</span>
                                <strong>Successful</strong>
                            </div>
                        </div>

                        <div className="receipt-modal-footer">
                            <button
                                type="button"
                                className="button button-primary"
                                onClick={() =>
                                    downloadReceipt(
                                        selectedReceipt.booking,
                                        selectedReceipt.payment
                                    )
                                }
                            >
                                <Download size={16} />
                                Download PDF
                            </button>
                            <button
                                type="button"
                                className="notification-secondary-button"
                                onClick={() => printReceipt(selectedReceipt)}
                            >
                                <Printer size={16} />
                                Print / Save PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ChallengesView({
    skills,
    goals
}) {
    const safeSkills = Array.isArray(skills)
        ? skills
        : [];

    const safeGoals = Array.isArray(goals)
        ? goals
        : [];

    const currentUser = getStoredUser();
    const userId =
        currentUser?.id ??
        currentUser?.userId ??
        currentUser?.user_id ??
        "guest";

    const storageKey = `ascendra_challenges_${userId}`;

    const challengeCatalog = useMemo(() => {
        const skillNames = safeSkills
            .map(getSkillName)
            .filter(Boolean);

        const primarySkill =
            skillNames[0] || "Backend Development";
        const secondarySkill =
            skillNames[1] || "Problem Solving";
        const goalTitle =
            getGoalTitle(safeGoals[0]) ||
            "Career Growth";

        return [
            {
                id: "api-design",
                title: "Design a production-ready REST API",
                description:
                    `Create a clean API contract for ${primarySkill} with validation, error handling and pagination.`,
                skill: primarySkill,
                difficulty: "Intermediate",
                duration: 30,
                points: 120,
                type: "Build",
                icon: Code2,
                featured: true,
                steps: [
                    "Define the main resources and endpoints.",
                    "Add request validation and consistent error responses.",
                    "Design pagination and filtering.",
                    "Write a short API contract for another developer."
                ]
            },
            {
                id: "debugging-sprint",
                title: "Debug the failing service",
                description:
                    "Trace a realistic backend failure, isolate the root cause and propose a production-safe fix.",
                skill: secondarySkill,
                difficulty: "Intermediate",
                duration: 20,
                points: 90,
                type: "Debug",
                icon: Zap,
                steps: [
                    "Read the symptoms and identify the failing layer.",
                    "List the three most likely root causes.",
                    "Choose the highest-confidence cause and explain why.",
                    "Write the fix and one regression test."
                ]
            },
            {
                id: "system-thinking",
                title: "Architect for 100K users",
                description:
                    "Design a scalable learning platform architecture and explain the trade-offs behind each component.",
                skill: "System Design",
                difficulty: "Advanced",
                duration: 45,
                points: 180,
                type: "Architecture",
                icon: Target,
                steps: [
                    "Sketch the client, API and data layers.",
                    "Choose a caching and messaging strategy.",
                    "Plan for traffic spikes and database growth.",
                    "Explain one reliability trade-off."
                ]
            },
            {
                id: "career-plan",
                title: "Turn your goal into a 30-day plan",
                description:
                    `Break down “${goalTitle}” into a focused sequence of practical weekly outcomes.`,
                skill: "Career Growth",
                difficulty: "Beginner",
                duration: 15,
                points: 60,
                type: "Planning",
                icon: BookOpen,
                steps: [
                    "Define the outcome you want after 30 days.",
                    "Pick one measurable milestone for each week.",
                    "Add one practical project or exercise.",
                    "Choose how you will review progress every Sunday."
                ]
            },
            {
                id: "interview-ready",
                title: "Senior engineer interview sprint",
                description:
                    "Practice explaining technical decisions clearly, like you would in a real engineering interview.",
                skill: "Interview",
                difficulty: "Advanced",
                duration: 25,
                points: 140,
                type: "Interview",
                icon: Flame,
                steps: [
                    "Explain one project in 90 seconds.",
                    "Describe one difficult production problem you solved.",
                    "Explain a technical trade-off you made.",
                    "Finish with what you would improve today."
                ]
            },
            {
                id: "daily-practice",
                title: "15-minute fundamentals",
                description:
                    "A quick confidence-building challenge you can complete between mentoring sessions.",
                skill: primarySkill,
                difficulty: "Beginner",
                duration: 15,
                points: 50,
                type: "Practice",
                icon: Sparkles,
                steps: [
                    "Pick one concept you are currently learning.",
                    "Explain it in your own words.",
                    "Write one practical example.",
                    "Note one question you still have."
                ]
            }
        ];
    }, [safeSkills, safeGoals]);

    const [completed, setCompleted] = useState({});
    const [activeId, setActiveId] = useState(null);
    const [query, setQuery] = useState("");
    const [difficulty, setDifficulty] = useState("All");
    const [type, setType] = useState("All");
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed && typeof parsed === "object") {
                    setCompleted(parsed);
                }
            }
        } catch (error) {
            console.warn("Challenge progress could not be restored", error);
        }
    }, [storageKey]);

    const toggleComplete = id => {
        setCompleted(previous => {
            const next = {
                ...previous,
                [id]: !previous[id]
            };
            try {
                localStorage.setItem(
                    storageKey,
                    JSON.stringify(next)
                );
            } catch (error) {
                console.warn("Challenge progress could not be saved", error);
            }
            return next;
        });
    };

    const resetProgress = () => {
        setCompleted({});
        try {
            localStorage.removeItem(storageKey);
        } catch (error) {
            console.warn("Challenge progress could not be reset", error);
        }
    };

    const filtered = useMemo(() => {
        const text = query.trim().toLowerCase();
        return challengeCatalog.filter(challenge => {
            const matchesText = !text || [
                challenge.title,
                challenge.description,
                challenge.skill,
                challenge.type
            ].join(" ").toLowerCase().includes(text);
            const matchesDifficulty =
                difficulty === "All" ||
                challenge.difficulty === difficulty;
            const matchesType =
                type === "All" ||
                challenge.type === type;
            return matchesText && matchesDifficulty && matchesType;
        });
    }, [challengeCatalog, query, difficulty, type]);

    const completedCount = challengeCatalog.filter(
        item => completed[item.id]
    ).length;
    const totalPoints = challengeCatalog
        .filter(item => completed[item.id])
        .reduce((sum, item) => sum + item.points, 0);
    const overallPercent = challengeCatalog.length
        ? Math.round((completedCount / challengeCatalog.length) * 100)
        : 0;
    const activeChallenge = challengeCatalog.find(
        item => item.id === activeId
    );
    const ActiveChallengeIcon = activeChallenge?.icon;

    return (
        <div className="challenges-page">
            <section className="challenges-hero ui-animate">
                <div className="challenges-hero-copy">
                    <div className="page-kicker">
                        <span className="kicker-dot" />
                        LEARNING CHALLENGES
                    </div>
                    <h1>
                        Build skills by
                        <span> doing.</span>
                    </h1>
                    <p>
                        Short, practical challenges designed to turn your
                        Ascendra learning path into visible progress.
                    </p>
                    <div className="challenge-hero-actions">
                        <button
                            type="button"
                            className="button button-primary"
                            onClick={() => {
                                const next = challengeCatalog.find(
                                    item => !completed[item.id]
                                );
                                if (next) {
                                    setActiveId(next.id);
                                    window.scrollTo({
                                        top: 420,
                                        behavior: "smooth"
                                    });
                                }
                            }}
                        >
                            <Sparkles size={17} />
                            Start a challenge
                            <ArrowRight size={17} />
                        </button>
                        <button
                            type="button"
                            className="button button-secondary"
                            onClick={resetProgress}
                        >
                            <RotateCcw size={16} />
                            Reset progress
                        </button>
                    </div>
                </div>

                <div className="challenge-hero-progress">
                    <div
                        className="challenge-progress-ring"
                        style={{
                            "--challenge-progress": `${overallPercent}%`
                        }}
                    >
                        <div>
                            <strong>{overallPercent}%</strong>
                            <span>completed</span>
                        </div>
                    </div>
                    <div className="challenge-hero-stats">
                        <div>
                            <strong>{completedCount}</strong>
                            <span>Completed</span>
                        </div>
                        <div>
                            <strong>{totalPoints}</strong>
                            <span>Points earned</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="challenge-summary-grid ui-animate">
                <div className="challenge-summary-card">
                    <div className="challenge-summary-icon teal">
                        <Trophy size={20} />
                    </div>
                    <div>
                        <span>CHALLENGES</span>
                        <strong>{challengeCatalog.length}</strong>
                        <small>Curated for your learning path</small>
                    </div>
                </div>
                <div className="challenge-summary-card">
                    <div className="challenge-summary-icon violet">
                        <Flame size={20} />
                    </div>
                    <div>
                        <span>STREAK</span>
                        <strong>{completedCount > 0 ? `${completedCount} day${completedCount === 1 ? "" : "s"}` : "Start today"}</strong>
                        <small>Keep building consistent momentum</small>
                    </div>
                </div>
                <div className="challenge-summary-card">
                    <div className="challenge-summary-icon blue">
                        <Target size={20} />
                    </div>
                    <div>
                        <span>FOCUS</span>
                        <strong>{safeSkills.length || 0} skill{safeSkills.length === 1 ? "" : "s"}</strong>
                        <small>Challenges adapt to your profile</small>
                    </div>
                </div>
                <div className="challenge-summary-card">
                    <div className="challenge-summary-icon amber">
                        <Zap size={20} />
                    </div>
                    <div>
                        <span>NEXT REWARD</span>
                        <strong>{Math.max(0, 250 - totalPoints)} pts</strong>
                        <small>Until your next milestone</small>
                    </div>
                </div>
            </section>

            <section className="challenge-workspace ui-animate">
                <div className="challenge-toolbar">
                    <div>
                        <span className="card-eyebrow">YOUR PRACTICE LIBRARY</span>
                        <h2>Choose your next challenge</h2>
                        <p>Work through one focused task at a time. Your progress is saved locally on this device.</p>
                    </div>
                    <button
                        type="button"
                        className={`challenge-filter-toggle ${showFilters ? "active" : ""}`}
                        onClick={() => setShowFilters(value => !value)}
                    >
                        <Filter size={17} />
                        Filters
                    </button>
                </div>

                <div className={`challenge-filters ${showFilters ? "open" : ""}`}>
                    <label className="challenge-search">
                        <Search size={18} />
                        <input
                            value={query}
                            onChange={event => setQuery(event.target.value)}
                            placeholder="Search challenges, skills or topics..."
                        />
                    </label>
                    <select
                        value={difficulty}
                        onChange={event => setDifficulty(event.target.value)}
                    >
                        <option>All</option>
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                    </select>
                    <select
                        value={type}
                        onChange={event => setType(event.target.value)}
                    >
                        <option>All</option>
                        <option>Build</option>
                        <option>Debug</option>
                        <option>Architecture</option>
                        <option>Planning</option>
                        <option>Interview</option>
                        <option>Practice</option>
                    </select>
                </div>

                <div className="challenge-results-meta">
                    <span>{filtered.length} challenge{filtered.length === 1 ? "" : "s"}</span>
                    {query || difficulty !== "All" || type !== "All" ? (
                        <button
                            type="button"
                            onClick={() => {
                                setQuery("");
                                setDifficulty("All");
                                setType("All");
                            }}
                        >
                            Clear filters
                        </button>
                    ) : null}
                </div>

                {filtered.length > 0 ? (
                    <div className="challenge-card-grid">
                        {filtered.map(challenge => {
                            const Icon = challenge.icon;
                            const done = Boolean(completed[challenge.id]);
                            return (
                                <article
                                    className={`challenge-card ${done ? "completed" : ""} ${challenge.featured ? "featured" : ""}`}
                                    key={challenge.id}
                                >
                                    <div className="challenge-card-topline">
                                        <div className="challenge-type">
                                            <Icon size={16} />
                                            {challenge.type}
                                        </div>
                                        {done ? (
                                            <span className="challenge-complete-badge">
                                                <CheckCircle2 size={14} />
                                                Complete
                                            </span>
                                        ) : challenge.featured ? (
                                            <span className="challenge-featured-badge">
                                                Recommended
                                            </span>
                                        ) : null}
                                    </div>

                                    <div className="challenge-card-icon">
                                        <Icon size={23} />
                                    </div>

                                    <div className="challenge-card-content">
                                        <div className="challenge-skill-line">
                                            <span>{challenge.skill}</span>
                                            <span>{challenge.difficulty}</span>
                                        </div>
                                        <h3>{challenge.title}</h3>
                                        <p>{challenge.description}</p>
                                    </div>

                                    <div className="challenge-card-meta">
                                        <span><Clock3 size={15} /> {challenge.duration} min</span>
                                        <span><Zap size={15} /> {challenge.points} pts</span>
                                    </div>

                                    <div className="challenge-card-footer">
                                        <button
                                            type="button"
                                            className="challenge-open-button"
                                            onClick={() => setActiveId(challenge.id)}
                                        >
                                            {done ? "Review challenge" : "Open challenge"}
                                            <ArrowRight size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            className={`challenge-check-button ${done ? "done" : ""}`}
                                            onClick={() => toggleComplete(challenge.id)}
                                            aria-label={done ? "Mark challenge incomplete" : "Mark challenge complete"}
                                            title={done ? "Mark incomplete" : "Mark complete"}
                                        >
                                            <CheckCircle2 size={19} />
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className="challenge-no-results">
                        <Search size={25} />
                        <h3>No challenges found</h3>
                        <p>Try a different search or clear your filters.</p>
                    </div>
                )}
            </section>

            <section className="challenge-guidance ui-animate">
                <div className="challenge-guidance-icon">
                    <Sparkles size={21} />
                </div>
                <div>
                    <span className="card-eyebrow">HOW TO USE CHALLENGES</span>
                    <h2>One focused challenge is better than ten unfinished tasks.</h2>
                    <p>
                        Pick a challenge that matches your current skill level, finish the steps,
                        then mark it complete. Because this version is frontend-only, your challenge
                        progress is stored locally and does not change your backend profile or sessions.
                    </p>
                </div>
            </section>

            {activeChallenge && (
                <div
                    className="challenge-modal-backdrop"
                    onMouseDown={event => {
                        if (event.target === event.currentTarget) {
                            setActiveId(null);
                        }
                    }}
                >
                    <div className="challenge-modal" role="dialog" aria-modal="true">
                        <button
                            type="button"
                            className="challenge-modal-close"
                            onClick={() => setActiveId(null)}
                            aria-label="Close challenge"
                        >
                            ×
                        </button>
                        <div className="challenge-modal-icon">
                            <ActiveChallengeIcon size={25} />
                        </div>
                        <div className="challenge-modal-kicker">
                            {activeChallenge.type} · {activeChallenge.difficulty} · {activeChallenge.duration} min
                        </div>
                        <h2>{activeChallenge.title}</h2>
                        <p>{activeChallenge.description}</p>
                        <div className="challenge-step-list">
                            {activeChallenge.steps.map((step, index) => (
                                <div className="challenge-step" key={step}>
                                    <span>{index + 1}</span>
                                    <p>{step}</p>
                                </div>
                            ))}
                        </div>
                        <div className="challenge-modal-footer">
                            <div>
                                <strong>{activeChallenge.points} points</strong>
                                <span>Frontend practice reward</span>
                            </div>
                            <button
                                type="button"
                                className={`button ${completed[activeChallenge.id] ? "button-secondary" : "button-primary"}`}
                                onClick={() => toggleComplete(activeChallenge.id)}
                            >
                                <CheckCircle2 size={17} />
                                {completed[activeChallenge.id] ? "Completed" : "Mark complete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ProgressView({
    completion,
    averageSkill,
    skills,
    goals,
    completedGoals,
    sessions
}) {
    const safeSkills = Array.isArray(skills)
        ? skills
        : [];

    const safeGoals = Array.isArray(goals)
        ? goals
        : [];

    const safeSessions = Array.isArray(sessions)
        ? sessions
        : [];

    const clamp = value =>
        Math.max(
            0,
            Math.min(100, Number(value) || 0)
        );

    const completedSessions = safeSessions.filter(
        session =>
            String(session?.status || "").toUpperCase() ===
            "COMPLETED"
    ).length;

    const upcomingSessions = safeSessions.filter(
        session =>
            String(session?.status || "").toUpperCase() ===
            "CONFIRMED"
    ).length;

    const cancelledSessions = safeSessions.filter(
        session =>
            String(session?.status || "").toUpperCase() ===
            "CANCELLED"
    ).length;

    const activeGoals = safeGoals.filter(goal => {
        const status = String(
            goal?.status || ""
        ).toUpperCase();

        return ![
            "COMPLETED",
            "DONE",
            "ACHIEVED"
        ].includes(status);
    }).length;

    const goalCompletion = safeGoals.length
        ? clamp(
              (completedGoals /
                  safeGoals.length) *
                  100
          )
        : 0;

    const averageSkillSafe = clamp(
        averageSkill
    );

    const profileSafe = clamp(
        completion
    );

    const overallHealth = Math.round(
        (profileSafe +
            averageSkillSafe +
            goalCompletion) /
            3
    );

    const skillBars = safeSkills
        .map((skill, index) => ({
            id:
                skill?.id ||
                `${getSkillName(skill)}-${index}`,
            name: getSkillName(skill),
            level: clamp(
                getSkillLevel(skill)
            )
        }))
        .sort((a, b) => b.level - a.level);

    const topSkills = skillBars.slice(0, 6);

    const maxSkill = Math.max(
        ...topSkills.map(
            skill => skill.level
        ),
        100
    );

    const sessionTotal = safeSessions.length;

    const sessionCompletion = sessionTotal
        ? clamp(
              (completedSessions /
                  sessionTotal) *
                  100
          )
        : 0;

    const metricData = [
        {
            label: "Profile",
            value: `${profileSafe}%`,
            detail:
                profileSafe >= 100
                    ? "Complete"
                    : "Needs attention",
            icon: <UserRound size={17} />,
            tone: "teal"
        },
        {
            label: "Skill average",
            value: `${averageSkillSafe}%`,
            detail:
                `${safeSkills.length} skill${safeSkills.length === 1 ? "" : "s"} tracked`,
            icon: <Code2 size={17} />,
            tone: "blue"
        },
        {
            label: "Goals",
            value: `${completedGoals}/${safeGoals.length}`,
            detail:
                `${activeGoals} active`,
            icon: <Target size={17} />,
            tone: "violet"
        },
        {
            label: "Mentoring",
            value: sessionTotal,
            detail:
                `${completedSessions} completed`,
            icon: <CalendarDays size={17} />,
            tone: "orange"
        }
    ];

    const progressRing =
        profileSafe * 3.6;

    const sessionBars = [
        {
            label: "Completed",
            value: completedSessions,
            percent: sessionTotal
                ? (completedSessions /
                      sessionTotal) *
                  100
                : 0,
            tone: "success"
        },
        {
            label: "Upcoming",
            value: upcomingSessions,
            percent: sessionTotal
                ? (upcomingSessions /
                      sessionTotal) *
                  100
                : 0,
            tone: "teal"
        },
        {
            label: "Cancelled",
            value: cancelledSessions,
            percent: sessionTotal
                ? (cancelledSessions /
                      sessionTotal) *
                  100
                : 0,
            tone: "muted"
        }
    ];

    return (
        <div className="progress-page">
            <section className="progress-page-hero ui-animate">
                <div className="progress-page-hero-copy">
                    <span className="eyebrow">
                        <span className="eyebrow-dot" />
                        YOUR PROGRESS
                    </span>

                    <h1>
                        See how far <span>you've come.</span>
                    </h1>

                    <p>
                        Your Ascendra progress hub brings together profile
                        readiness, skill development, goals and mentoring activity
                        so you always know what to focus on next.
                    </p>

                    <div className="progress-hero-pills">
                        <span>
                            <TrendingUp size={14} />
                            Learning health {overallHealth}%
                        </span>
                        <span>
                            <Zap size={14} />
                            {safeSkills.length} skills tracked
                        </span>
                        <span>
                            <CalendarDays size={14} />
                            {sessionTotal} sessions
                        </span>
                    </div>
                </div>

                <div className="progress-hero-visual">
                    <div
                        className="progress-ring-large"
                        style={{
                            "--progress-angle": `${progressRing}deg`
                        }}
                    >
                        <div className="progress-ring-large-inner">
                            <strong>{profileSafe}%</strong>
                            <span>Profile ready</span>
                        </div>
                    </div>

                    <div className="progress-hero-visual-copy">
                        <span>PROFILE COMPLETION</span>
                        <strong>
                            {profileSafe >= 100
                                ? "You're ready to learn."
                                : "A stronger profile, better matches."}
                        </strong>
                        <small>
                            {profileSafe >= 100
                                ? "Keep your skills and goals current as you grow."
                                : "Complete missing profile details to improve mentor matching."}
                        </small>
                    </div>
                </div>
            </section>

            <section className="progress-metrics premium-metrics ui-animate">
                {metricData.map(metric => (
                    <div
                        className="premium-progress-metric"
                        key={metric.label}
                    >
                        <div
                            className={`premium-metric-icon ${metric.tone}`}
                        >
                            {metric.icon}
                        </div>
                        <div className="premium-metric-copy">
                            <span>{metric.label}</span>
                            <strong>{metric.value}</strong>
                            <small>{metric.detail}</small>
                        </div>
                        <div className="premium-metric-arrow">
                            <ChevronRight size={16} />
                        </div>
                    </div>
                ))}
            </section>

            <section className="progress-grid-main">
                <div className="progress-panel skill-development-panel ui-animate">
                    <div className="progress-panel-header">
                        <div>
                            <span className="card-eyebrow">
                                SKILL DEVELOPMENT
                            </span>
                            <h2>Strength across your skills</h2>
                            <p>
                                Your current proficiency snapshot. Keep practicing
                                through challenges and mentoring sessions to move these
                                levels forward.
                            </p>
                        </div>
                        <div className="progress-panel-badge">
                            {averageSkillSafe}% avg
                        </div>
                    </div>

                    {topSkills.length === 0 ? (
                        <EmptyState
                            icon={<Code2 />}
                            title="No skills added yet"
                            text="Add your skills to start building your progress profile."
                        />
                    ) : (
                        <div className="skill-graph-list">
                            {topSkills.map(skill => {
                                const width = maxSkill
                                    ? (skill.level /
                                          maxSkill) *
                                      100
                                    : 0;

                                return (
                                    <div
                                        className="skill-graph-row"
                                        key={skill.id}
                                    >
                                        <div className="skill-graph-label">
                                            <span>{skill.name}</span>
                                            <strong>{skill.level}%</strong>
                                        </div>
                                        <div className="skill-graph-track">
                                            <span
                                                style={{
                                                    width: `${width}%`
                                                }}
                                            />
                                        </div>
                                        <div className="skill-graph-foot">
                                            <span>
                                                {skill.level >= 80
                                                    ? "Strong"
                                                    : skill.level >= 55
                                                        ? "Growing"
                                                        : skill.level > 0
                                                            ? "Build next"
                                                            : "Not started"}
                                            </span>
                                            <span>
                                                {skill.level >= 80
                                                    ? "Mentor-ready"
                                                    : "Keep practicing"}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="progress-panel learning-health-panel ui-animate">
                    <div className="progress-panel-header compact">
                        <div>
                            <span className="card-eyebrow">
                                LEARNING HEALTH
                            </span>
                            <h2>Your momentum</h2>
                        </div>
                        <div className="health-score">
                            <strong>{overallHealth}%</strong>
                            <span>overall</span>
                        </div>
                    </div>

                    <div className="health-orbit">
                        <div
                            className="health-orbit-ring"
                            style={{
                                "--health-angle": `${overallHealth * 3.6}deg`
                            }}
                        >
                            <div>
                                <strong>{overallHealth}%</strong>
                                <span>health</span>
                            </div>
                        </div>
                    </div>

                    <div className="health-breakdown">
                        <div>
                            <span>
                                <i className="dot teal" />
                                Profile
                            </span>
                            <strong>{profileSafe}%</strong>
                        </div>
                        <div>
                            <span>
                                <i className="dot blue" />
                                Skills
                            </span>
                            <strong>{averageSkillSafe}%</strong>
                        </div>
                        <div>
                            <span>
                                <i className="dot violet" />
                                Goals
                            </span>
                            <strong>{Math.round(goalCompletion)}%</strong>
                        </div>
                    </div>
                </div>
            </section>

            <section className="progress-grid-secondary">
                <div className="progress-panel mentoring-panel ui-animate">
                    <div className="progress-panel-header">
                        <div>
                            <span className="card-eyebrow">
                                MENTORING ACTIVITY
                            </span>
                            <h2>Your session progress</h2>
                            <p>
                                A simple view of the mentoring sessions connected to
                                your learner account.
                            </p>
                        </div>
                        <div className="session-total-badge">
                            <strong>{sessionTotal}</strong>
                            <span>total</span>
                        </div>
                    </div>

                    <div className="session-progress-layout">
                        <div className="session-progress-chart">
                            {sessionBars.map(item => (
                                <div
                                    className="session-bar-row"
                                    key={item.label}
                                >
                                    <div className="session-bar-label">
                                        <span>
                                            <i
                                                className={`session-dot ${item.tone}`}
                                            />
                                            {item.label}
                                        </span>
                                        <strong>{item.value}</strong>
                                    </div>
                                    <div className="session-bar-track">
                                        <span
                                            className={item.tone}
                                            style={{
                                                width: `${item.percent}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="session-summary-card">
                            <div className="session-summary-icon">
                                <CalendarDays size={20} />
                            </div>
                            <strong>
                                {completedSessions > 0
                                    ? "Keep the momentum going."
                                    : sessionTotal > 0
                                        ? "Your mentoring journey has started."
                                        : "Your next session starts here."}
                            </strong>
                            <span>
                                {completedSessions > 0
                                    ? `${completedSessions} session${completedSessions === 1 ? "" : "s"} completed so far.`
                                    : sessionTotal > 0
                                        ? `${sessionTotal} mentoring session${sessionTotal === 1 ? "" : "s"} connected to your account.`
                                        : "Book an expert session to add mentoring activity to your progress."}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="progress-panel goals-panel ui-animate">
                    <div className="progress-panel-header compact">
                        <div>
                            <span className="card-eyebrow">
                                GOAL JOURNEY
                            </span>
                            <h2>Where you're heading</h2>
                        </div>
                        <div className="goal-progress-mini">
                            {Math.round(goalCompletion)}%
                        </div>
                    </div>

                    <div className="goal-progress-headline">
                        <div className="goal-progress-ring">
                            <strong>
                                {completedGoals}
                            </strong>
                            <span>
                                of {safeGoals.length}
                            </span>
                        </div>
                        <div>
                            <strong>
                                {safeGoals.length === 0
                                    ? "Set your first goal"
                                    : completedGoals === safeGoals.length
                                        ? "All goals complete"
                                        : "Keep moving forward"}
                            </strong>
                            <span>
                                {safeGoals.length === 0
                                    ? "Clear goals make expert matching more relevant."
                                    : `${activeGoals} active goal${activeGoals === 1 ? "" : "s"} still shaping your learning path.`}
                            </span>
                        </div>
                    </div>

                    {safeGoals.length > 0 ? (
                        <div className="goal-progress-list">
                            {safeGoals.slice(0, 4).map((goal, index) => {
                                const status = String(
                                    goal?.status || ""
                                ).toUpperCase();
                                const done = [
                                    "COMPLETED",
                                    "DONE",
                                    "ACHIEVED"
                                ].includes(status);

                                return (
                                    <div
                                        className="goal-progress-item"
                                        key={
                                            goal?.id ||
                                            `${getGoalTitle(goal)}-${index}`
                                        }
                                    >
                                        <div
                                            className={`goal-progress-check ${done ? "done" : ""}`}
                                        >
                                            {done ? (
                                                <CheckCircle2 size={14} />
                                            ) : (
                                                <span>{index + 1}</span>
                                            )}
                                        </div>
                                        <div>
                                            <strong>
                                                {getGoalTitle(goal)}
                                            </strong>
                                            <span>
                                                {done
                                                    ? "Completed"
                                                    : getGoalDescription(goal)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="goal-empty-card">
                            <Target size={20} />
                            <span>
                                Add a goal from your profile to make your progress
                                plan more actionable.
                            </span>
                        </div>
                    )}
                </div>
            </section>

            <section className="progress-next-step ui-animate">
                <div className="progress-next-icon">
                    <Zap size={21} />
                </div>
                <div>
                    <span className="card-eyebrow">
                        YOUR NEXT MOVE
                    </span>
                    <h2>
                        {profileSafe < 100
                            ? "Complete your profile before your next mentoring session."
                            : averageSkillSafe < 60
                                ? "Turn your current skills into practical confidence."
                                : completedGoals < safeGoals.length
                                    ? "Choose one active goal and make it your next milestone."
                                    : "Keep the momentum — challenge yourself with something harder."}
                    </h2>
                    <p>
                        Ascendra works best when your profile, skills, goals and
                        mentoring activity stay up to date. Small consistent steps
                        make your progress easier to measure.
                    </p>
                </div>
            </section>
        </div>
    );
}

function ProgressMetric({
    icon,
    label,
    value
}) {
    return (
        <div className="dashboard-card progress-metric">
            <div className="stat-icon">
                {icon}
            </div>

            <span>
                {label}
            </span>

            <strong>
                {value}
            </strong>
        </div>
    );
}

export default LearnerHome;