import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    CalendarDays,
    Clock3,
    Video,
    ArrowRight,
    CheckCircle2,
    XCircle,
    Loader2,
    RefreshCw,
    UserRound
} from "lucide-react";

import {
    getMyBookings
} from "../../../service/bookingService";

import "./Sessions.css";

const getCurrentUser = () => {
    const keys = [
        "user",
        "ascendra_user"
    ];

    for (const key of keys) {
        const value = localStorage.getItem(key);

        if (!value) {
            continue;
        }

        try {
            return JSON.parse(value);
        } catch {
            continue;
        }
    }

    return null;
};

const unwrap = response => {
    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (Array.isArray(response?.content)) {
        return response.content;
    }

    return [];
};

const getBookingId = booking =>
    booking?.id ??
    booking?.bookingId ??
    "";

const getExpertName = booking =>
    booking?.expertName ||
    booking?.expert?.user?.name ||
    booking?.expert?.name ||
    "Expert";

const getProfessionalTitle = booking =>
    booking?.professionalTitle ||
    booking?.expert?.professionalTitle ||
    "Mentoring Expert";

const getStatus = booking =>
    String(
        booking?.status ||
        booking?.bookingStatus ||
        ""
    ).toUpperCase();

const getMeetingUrl = booking =>
    booking?.zoomJoinUrl ||
    booking?.meetingUrl ||
    booking?.zoomLink ||
    booking?.meetingLink ||
    booking?.joinUrl ||
    "";

const timeToMinutes = value => {
    if (!value) {
        return null;
    }

    const match = String(value)
        .trim()
        .match(/^(\d{1,2}):(\d{2})/);

    if (!match) {
        return null;
    }

    return (
        Number(match[1]) * 60 +
        Number(match[2])
    );
};

const formatDate = value => {
    if (!value) {
        return "Date unavailable";
    }

    const date = new Date(
        `${String(value).slice(0, 10)}T00:00:00`
    );

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
};

const formatTime = value => {
    if (!value) {
        return "";
    }

    const minutes = timeToMinutes(value);

    if (minutes === null) {
        return String(value);
    }

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    const suffix = hours >= 12
        ? "PM"
        : "AM";

    const displayHour =
        hours % 12 || 12;

    return `${displayHour}:${String(mins).padStart(2, "0")} ${suffix}`;
};

const formatTimeRange = (
    start,
    end
) => {
    if (!start) {
        return "Time unavailable";
    }

    if (!end) {
        return formatTime(start);
    }

    return `${formatTime(start)} – ${formatTime(end)}`;
};

const getDuration = booking => {
    if (booking?.duration) {
        return Number(booking.duration);
    }

    if (booking?.durationMinutes) {
        return Number(booking.durationMinutes);
    }

    const start = timeToMinutes(
        booking?.startTime
    );

    const end = timeToMinutes(
        booking?.endTime
    );

    if (
        start !== null &&
        end !== null &&
        end > start
    ) {
        return end - start;
    }

    return null;
};

const getAmount = booking =>
    Number(
        booking?.amount ??
        booking?.totalAmount ??
        booking?.price ??
        0
    );

const sortBookings = bookings => {
    return [...bookings].sort(
        (a, b) => {
            const dateA = `${a?.bookingDate || ""} ${a?.startTime || ""}`;
            const dateB = `${b?.bookingDate || ""} ${b?.startTime || ""}`;

            return dateA.localeCompare(dateB);
        }
    );
};

function SessionCard({
    booking,
    type
}) {
    const navigate = useNavigate();

    const expertName =
        getExpertName(booking);

    const title =
        getProfessionalTitle(booking);

    const bookingId =
        getBookingId(booking);

    const status =
        getStatus(booking);

    const meetingUrl =
        getMeetingUrl(booking);

    const duration =
        getDuration(booking);

    const amount =
        getAmount(booking);

    const handleOpen = () => {
        navigate(
            `/learner/booking-success?bookingId=${bookingId}`
        );
    };

    return (
        <article className="session-card">

            <div className="session-card-top">

                <div className="session-expert">

                    <div className="session-avatar">
                        {expertName
                            .split(" ")
                            .map(part => part[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                    </div>

                    <div className="session-expert-info">

                        <h3>
                            {expertName}
                        </h3>

                        <p>
                            {title}
                        </p>

                    </div>

                </div>

                <span
                    className={`session-status session-status-${status.toLowerCase()}`}
                >
                    {status === "CONFIRMED" && (
                        <CheckCircle2 size={14} />
                    )}

                    {status === "CANCELLED" && (
                        <XCircle size={14} />
                    )}

                    {status === "COMPLETED" && (
                        <CheckCircle2 size={14} />
                    )}

                    {status === "CONFIRMED"
                        ? "Confirmed"
                        : status === "COMPLETED"
                            ? "Completed"
                            : status === "CANCELLED"
                                ? "Cancelled"
                                : status || "Pending"}
                </span>

            </div>

            <div className="session-card-divider" />

            <div className="session-info-grid">

                <div className="session-info-item">

                    <div className="session-info-icon">
                        <CalendarDays size={17} />
                    </div>

                    <div>
                        <span>Date</span>
                        <strong>
                            {formatDate(
                                booking?.bookingDate
                            )}
                        </strong>
                    </div>

                </div>

                <div className="session-info-item">

                    <div className="session-info-icon">
                        <Clock3 size={17} />
                    </div>

                    <div>
                        <span>Time</span>
                        <strong>
                            {formatTimeRange(
                                booking?.startTime,
                                booking?.endTime
                            )}
                        </strong>
                    </div>

                </div>

                <div className="session-info-item">

                    <div className="session-info-icon">
                        <Clock3 size={17} />
                    </div>

                    <div>
                        <span>Duration</span>
                        <strong>
                            {duration
                                ? `${duration} minutes`
                                : "Session"}
                        </strong>
                    </div>

                </div>

                <div className="session-info-item">

                    <div className="session-info-icon">
                        ₹
                    </div>

                    <div>
                        <span>Amount</span>
                        <strong>
                            ₹{amount.toLocaleString("en-IN")}
                        </strong>
                    </div>

                </div>

            </div>

            <div className="session-card-bottom">

                <div className="session-booking-number">
                    Booking #{bookingId}
                </div>

                <div className="session-actions">

                    {type === "upcoming" &&
                        status === "CONFIRMED" &&
                        meetingUrl && (
                            <a
                                href={meetingUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="session-join-button"
                            >
                                <Video size={16} />
                                Join session
                            </a>
                        )}

                    <button
                        type="button"
                        className="session-view-button"
                        onClick={handleOpen}
                    >
                        View details
                        <ArrowRight size={16} />
                    </button>

                </div>

            </div>

        </article>
    );
}

function EmptyState({
    type
}) {
    const navigate = useNavigate();

    const content = {
        upcoming: {
            title: "No upcoming sessions",
            text: "Your confirmed mentoring sessions will appear here.",
            button: "Find an expert"
        },
        completed: {
            title: "No completed sessions",
            text: "Sessions you complete will appear here.",
            button: "Explore experts"
        },
        cancelled: {
            title: "No cancelled sessions",
            text: "You don't have any cancelled sessions.",
            button: "Find an expert"
        }
    };

    const current =
        content[type];

    return (
        <div className="sessions-empty">

            <div className="sessions-empty-icon">
                <CalendarDays size={25} />
            </div>

            <h3>
                {current.title}
            </h3>

            <p>
                {current.text}
            </p>

            <button
                type="button"
                onClick={() =>
                    navigate(
                        "/learner/experts"
                    )
                }
            >
                {current.button}
                <ArrowRight size={16} />
            </button>

        </div>
    );
}

function Sessions() {
    const [
        bookings,
        setBookings
    ] = useState([]);

    const [
        activeTab,
        setActiveTab
    ] = useState("upcoming");

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        error,
        setError
    ] = useState("");

    const loadSessions = async () => {
        try {
            setLoading(true);
            setError("");

            const user =
                getCurrentUser();

            const learnerId =
                user?.learnerId ||
                user?.learnerProfileId ||
                user?.learner?.id ||
                user?.id;

            if (!learnerId) {
                throw new Error(
                    "Learner information could not be found."
                );
            }

            const response =
                await getMyBookings(
                    learnerId
                );

            const data =
                unwrap(response);

            setBookings(
                sortBookings(data)
            );
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Unable to load your sessions."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSessions();
    }, []);

    const groupedBookings =
        useMemo(() => {
            return {
                upcoming: bookings.filter(
                    booking =>
                        getStatus(booking) ===
                            "CONFIRMED" ||
                        getStatus(booking) ===
                            "PENDING_PAYMENT"
                ),
                completed: bookings.filter(
                    booking =>
                        getStatus(booking) ===
                        "COMPLETED"
                ),
                cancelled: bookings.filter(
                    booking =>
                        getStatus(booking) ===
                        "CANCELLED"
                )
            };
        }, [bookings]);

    const currentBookings =
        groupedBookings[activeTab];

    return (
        <main className="sessions-page">

            <div className="sessions-container">

                <header className="sessions-header">

                    <div>

                        <span className="sessions-eyebrow">
                            YOUR LEARNING
                        </span>

                        <h1>
                            My sessions
                        </h1>

                        <p>
                            Keep track of your mentoring
                            sessions and upcoming meetings.
                        </p>

                    </div>

                    <button
                        type="button"
                        className="sessions-refresh"
                        onClick={loadSessions}
                        disabled={loading}
                    >
                        <RefreshCw
                            size={17}
                            className={
                                loading
                                    ? "sessions-refresh-spin"
                                    : ""
                            }
                        />

                        Refresh
                    </button>

                </header>

                <section className="sessions-tabs">

                    <button
                        type="button"
                        className={
                            activeTab === "upcoming"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveTab("upcoming")
                        }
                    >
                        Upcoming
                        <span>
                            {groupedBookings.upcoming.length}
                        </span>
                    </button>

                    <button
                        type="button"
                        className={
                            activeTab === "completed"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveTab("completed")
                        }
                    >
                        Completed
                        <span>
                            {groupedBookings.completed.length}
                        </span>
                    </button>

                    <button
                        type="button"
                        className={
                            activeTab === "cancelled"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveTab("cancelled")
                        }
                    >
                        Cancelled
                        <span>
                            {groupedBookings.cancelled.length}
                        </span>
                    </button>

                </section>

                {loading && (
                    <div className="sessions-loading">

                        <Loader2
                            size={30}
                            className="sessions-loader"
                        />

                        <h3>
                            Loading your sessions
                        </h3>

                        <p>
                            Please wait a moment...
                        </p>

                    </div>
                )}

                {!loading && error && (
                    <div className="sessions-error">

                        <div>
                            <XCircle size={22} />
                        </div>

                        <section>
                            <h3>
                                Couldn't load sessions
                            </h3>

                            <p>
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={loadSessions}
                            >
                                Try again
                                <RefreshCw size={15} />
                            </button>
                        </section>

                    </div>
                )}

                {!loading &&
                    !error &&
                    currentBookings.length === 0 && (
                        <EmptyState
                            type={activeTab}
                        />
                    )}

                {!loading &&
                    !error &&
                    currentBookings.length > 0 && (
                        <section className="sessions-list">

                            {currentBookings.map(
                                booking => (
                                    <SessionCard
                                        key={
                                            getBookingId(
                                                booking
                                            )
                                        }
                                        booking={
                                            booking
                                        }
                                        type={
                                            activeTab
                                        }
                                    />
                                )
                            )}

                        </section>
                    )}

            </div>

        </main>
    );
}

export default Sessions;