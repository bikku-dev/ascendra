import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import "./Notifications.css";

const STORAGE_KEY = "ascendra_notifications";

const readNotifications = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (!stored) {
            return [];
        }

        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const saveNotifications = (notifications) => {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(notifications)
    );

    window.dispatchEvent(
        new CustomEvent("ascendra-notifications-updated")
    );
};

const formatDate = (value) => {
    if (!value) {
        return "Not available";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

const formatDateOnly = (value) => {
    if (!value) {
        return "Not available";
    }

    const date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    const text = String(value).slice(0, 10);
    const fallback = new Date(`${text}T00:00:00`);

    if (!Number.isNaN(fallback.getTime())) {
        return fallback.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    return String(value);
};

const formatTime = (value) => {
    if (!value) {
        return "Not available";
    }

    const text = String(value);

    const match = text.match(/^(\d{1,2}):(\d{2})/);

    if (!match) {
        return text;
    }

    const hours = Number(match[1]);
    const minutes = Number(match[2]);

    return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${
        hours >= 12 ? "PM" : "AM"
    }`;
};

const formatAmount = (value) => {
    if (value === null || value === undefined || value === "") {
        return "₹0";
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
        return String(value).startsWith("₹")
            ? String(value)
            : `₹${value}`;
    }

    return `₹${numericValue.toLocaleString("en-IN")}`;
};

const getIcon = (type) => {
    switch (String(type || "").toUpperCase()) {
        case "SESSION":
        case "SESSION_CREATED":
        case "SESSION_CONFIRMED":
            return "◷";
        case "PAYMENT":
        case "PAYMENT_SUCCESS":
            return "₹";
        case "PAYMENT_FAILED":
            return "!";
        case "BOOKING":
        case "BOOKING_CONFIRMED":
            return "✓";
        case "BOOKING_CANCELLED":
        case "CANCELLED":
            return "×";
        case "REMINDER":
        case "SESSION_REMINDER":
            return "◉";
        default:
            return "•";
    }
};

const getTypeLabel = (type) => {
    switch (String(type || "").toUpperCase()) {
        case "SESSION":
        case "SESSION_CREATED":
        case "SESSION_CONFIRMED":
            return "Session";
        case "PAYMENT":
        case "PAYMENT_SUCCESS":
        case "PAYMENT_FAILED":
            return "Payment";
        case "BOOKING":
        case "BOOKING_CONFIRMED":
        case "BOOKING_CANCELLED":
            return "Booking";
        case "CANCELLED":
            return "Cancelled";
        case "REMINDER":
        case "SESSION_REMINDER":
            return "Reminder";
        default:
            return "Notification";
    }
};

const getBookingId = (notification) =>
    notification?.bookingId ??
    notification?.booking?.id ??
    notification?.booking?.bookingId ??
    notification?.referenceId ??
    notification?.data?.bookingId ??
    null;

const getTransactionId = (notification) =>
    notification?.transactionId ??
    notification?.razorpayPaymentId ??
    notification?.payment?.transactionId ??
    notification?.payment?.razorpayPaymentId ??
    notification?.data?.transactionId ??
    null;

const getExpertName = (notification) =>
    notification?.expertName ??
    notification?.mentorName ??
    notification?.booking?.expertName ??
    notification?.booking?.expert?.name ??
    notification?.data?.expertName ??
    "Expert";

const getBookingDate = (notification) =>
    notification?.bookingDate ??
    notification?.date ??
    notification?.booking?.bookingDate ??
    notification?.data?.bookingDate ??
    null;

const getStartTime = (notification) =>
    notification?.startTime ??
    notification?.booking?.startTime ??
    notification?.data?.startTime ??
    null;

const getEndTime = (notification) =>
    notification?.endTime ??
    notification?.booking?.endTime ??
    notification?.data?.endTime ??
    null;

const getAmount = (notification) =>
    notification?.amount ??
    notification?.paymentAmount ??
    notification?.booking?.amount ??
    notification?.payment?.amount ??
    notification?.data?.amount ??
    0;

const getPaymentStatus = (notification) => {
    const status =
        notification?.paymentStatus ??
        notification?.payment?.status ??
        notification?.status ??
        "";

    const normalized = String(status).toUpperCase();

    if (
        normalized === "SUCCESS" ||
        normalized === "PAID" ||
        normalized === "COMPLETED"
    ) {
        return "PAID";
    }

    if (
        normalized === "CANCELLED" ||
        normalized === "CANCELED"
    ) {
        return "CANCELLED";
    }

    if (normalized === "FAILED") {
        return "FAILED";
    }

    if (normalized === "CONFIRMED") {
        return "CONFIRMED";
    }

    return normalized || "CONFIRMED";
};

const getReceiptTitle = (notification) => {
    const type = String(notification?.type || "").toUpperCase();

    if (
        type.includes("PAYMENT") ||
        notification?.transactionId ||
        notification?.razorpayPaymentId ||
        notification?.payment
    ) {
        return "Payment Receipt";
    }

    if (
        type.includes("BOOKING") ||
        notification?.bookingId ||
        notification?.booking
    ) {
        return "Booking Receipt";
    }

    return "Session Receipt";
};

const getStatusClass = (status) => {
    const normalized = String(status || "").toLowerCase();

    if (normalized === "paid" || normalized === "confirmed") {
        return "receipt-status-success";
    }

    if (normalized === "failed") {
        return "receipt-status-failed";
    }

    if (normalized === "cancelled") {
        return "receipt-status-cancelled";
    }

    return "receipt-status-neutral";
};

function ReceiptModal({
    notification,
    onClose,
    onJoinSession,
    onViewSession
}) {
    const [downloading, setDownloading] = useState(false);

    if (!notification) {
        return null;
    }

    const bookingId = getBookingId(notification);
    const transactionId = getTransactionId(notification);
    const expertName = getExpertName(notification);
    const bookingDate = getBookingDate(notification);
    const startTime = getStartTime(notification);
    const endTime = getEndTime(notification);
    const amount = getAmount(notification);
    const status = getPaymentStatus(notification);
    const receiptTitle = getReceiptTitle(notification);

    const joinUrl =
        notification?.zoomJoinUrl ??
        notification?.booking?.zoomJoinUrl ??
        notification?.actionUrl ??
        null;

    const hasTime =
        startTime ||
        endTime;

    const handleDownload = () => {
        try {
            setDownloading(true);

            const doc = new jsPDF({
                unit: "mm",
                format: "a4"
            });

            const pageWidth = doc.internal.pageSize.getWidth();

            doc.setFillColor(17, 24, 39);
            doc.rect(0, 0, pageWidth, 42, "F");

            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(22);
            doc.text("ASCENDRA", 20, 18);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.text(
                "Mentoring & Learning Platform",
                20,
                26
            );

            doc.setFont("helvetica", "bold");
            doc.setFontSize(15);
            doc.text(
                receiptTitle,
                pageWidth - 20,
                18,
                { align: "right" }
            );

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.text(
                formatDate(notification.createdAt),
                pageWidth - 20,
                26,
                { align: "right" }
            );

            let y = 61;

            doc.setTextColor(17, 24, 39);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.text("Transaction Details", 20, y);

            y += 12;

            const rows = [
                ["Mentor", expertName],
                ["Date", formatDateOnly(bookingDate)],
                [
                    "Time",
                    hasTime
                        ? `${formatTime(startTime)} – ${formatTime(endTime)}`
                        : "Not available"
                ],
                ["Booking ID", bookingId ? `#${bookingId}` : "Not available"],
                [
                    "Transaction ID",
                    transactionId || "Not available"
                ],
                ["Status", status],
                ["Amount", formatAmount(amount)]
            ];

            rows.forEach(([label, value]) => {
                doc.setFillColor(248, 250, 252);
                doc.roundedRect(
                    20,
                    y - 6,
                    pageWidth - 40,
                    12,
                    2,
                    2,
                    "F"
                );

                doc.setTextColor(107, 114, 128);
                doc.setFont("helvetica", "normal");
                doc.setFontSize(9);
                doc.text(label, 25, y + 1);

                doc.setTextColor(17, 24, 39);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(9);
                doc.text(
                    String(value).slice(0, 75),
                    pageWidth - 25,
                    y + 1,
                    { align: "right" }
                );

                y += 16;
            });

            y += 10;

            doc.setDrawColor(229, 231, 235);
            doc.line(20, y, pageWidth - 20, y);

            y += 13;

            doc.setTextColor(107, 114, 128);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.text(
                "This receipt was generated by Ascendra.",
                20,
                y
            );

            doc.text(
                "Keep this receipt for your records.",
                pageWidth - 20,
                y,
                { align: "right" }
            );

            const safeBookingId = String(
                bookingId || "receipt"
            ).replace(/[^a-zA-Z0-9-_]/g, "");

            doc.save(
                `Ascendra-${receiptTitle.replace(/\s+/g, "-")}-${safeBookingId}.pdf`
            );
        } finally {
            setDownloading(false);
        }
    };

    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );
            document.body.style.overflow =
                previousOverflow;
        };
    }, [onClose]);

    return (
        <div
            className="receipt-modal-backdrop"
            onMouseDown={handleBackdropClick}
            role="presentation"
        >
            <div
                className="receipt-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="receipt-modal-title"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >
                <div className="receipt-modal-top">
                    <div className="receipt-brand">
                        <div className="receipt-brand-mark">
                            A
                        </div>

                        <div>
                            <strong>
                                ASCENDRA
                            </strong>
                            <span>
                                Official receipt
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="receipt-close-btn"
                        onClick={onClose}
                        aria-label="Close receipt"
                    >
                        ×
                    </button>
                </div>

                <div className="receipt-modal-heading">
                    <div>
                        <span className="receipt-eyebrow">
                            TRANSACTION SUMMARY
                        </span>

                        <h2 id="receipt-modal-title">
                            {receiptTitle}
                        </h2>

                        <p>
                            Your booking and payment
                            details are safely stored
                            in this receipt.
                        </p>
                    </div>

                    <span
                        className={`receipt-status ${getStatusClass(
                            status
                        )}`}
                    >
                        {status}
                    </span>
                </div>

                <div className="receipt-amount-card">
                    <span>
                        TOTAL AMOUNT
                    </span>

                    <strong>
                        {formatAmount(amount)}
                    </strong>

                    <small>
                        {transactionId
                            ? `Transaction ${transactionId}`
                            : "Ascendra mentoring session"}
                    </small>
                </div>

                <div className="receipt-details">
                    <div className="receipt-detail">
                        <span>MENTOR</span>
                        <strong>{expertName}</strong>
                    </div>

                    <div className="receipt-detail">
                        <span>BOOKING ID</span>
                        <strong>
                            {bookingId
                                ? `#${bookingId}`
                                : "Not available"}
                        </strong>
                    </div>

                    <div className="receipt-detail">
                        <span>DATE</span>
                        <strong>
                            {formatDateOnly(
                                bookingDate
                            )}
                        </strong>
                    </div>

                    <div className="receipt-detail">
                        <span>TIME</span>
                        <strong>
                            {hasTime
                                ? `${formatTime(
                                      startTime
                                  )} – ${formatTime(
                                      endTime
                                  )}`
                                : "Not available"}
                        </strong>
                    </div>

                    <div className="receipt-detail receipt-detail-wide">
                        <span>
                            TRANSACTION ID
                        </span>
                        <strong>
                            {transactionId ||
                                "Not available"}
                        </strong>
                    </div>

                    <div className="receipt-detail">
                        <span>CREATED</span>
                        <strong>
                            {formatDate(
                                notification.createdAt
                            )}
                        </strong>
                    </div>
                </div>

                <div className="receipt-modal-actions">
                    {joinUrl &&
                        String(status).toUpperCase() !==
                            "CANCELLED" && (
                            <button
                                type="button"
                                className="receipt-primary-btn"
                                onClick={() =>
                                    onJoinSession(
                                        joinUrl
                                    )
                                }
                            >
                                Join session
                                <span>↗</span>
                            </button>
                        )}

                    {bookingId && (
                        <button
                            type="button"
                            className="receipt-secondary-btn"
                            onClick={onViewSession}
                        >
                            View booking
                        </button>
                    )}

                    <button
                        type="button"
                        className="receipt-download-btn"
                        onClick={handleDownload}
                        disabled={downloading}
                    >
                        <span>
                            {downloading
                                ? "Preparing..."
                                : "Download receipt"}
                        </span>
                        <span>
                            ↓
                        </span>
                    </button>
                </div>

                <div className="receipt-modal-footer">
                    <span>
                        ✓ Secure Ascendra record
                    </span>
                    <span>
                        Generated {formatDate(
                            notification.createdAt
                        )}
                    </span>
                </div>
            </div>
        </div>
    );
}

function Notifications() {
    const navigate = useNavigate();

    const [notifications, setNotifications] =
        useState(readNotifications);

    const [filter, setFilter] =
        useState("ALL");

    const [selectedNotification, setSelectedNotification] =
        useState(null);

    useEffect(() => {
        const refreshNotifications = () => {
            setNotifications(
                readNotifications()
            );
        };

        window.addEventListener(
            "storage",
            refreshNotifications
        );

        window.addEventListener(
            "ascendra-notifications-updated",
            refreshNotifications
        );

        return () => {
            window.removeEventListener(
                "storage",
                refreshNotifications
            );

            window.removeEventListener(
                "ascendra-notifications-updated",
                refreshNotifications
            );
        };
    }, []);

    const sortedNotifications = useMemo(() => {
        return [...notifications].sort(
            (a, b) =>
                new Date(b.createdAt || 0) -
                new Date(a.createdAt || 0)
        );
    }, [notifications]);

    const filteredNotifications = useMemo(() => {
        if (filter === "ALL") {
            return sortedNotifications;
        }

        if (filter === "UNREAD") {
            return sortedNotifications.filter(
                (notification) =>
                    notification.read !== true
            );
        }

        return sortedNotifications.filter(
            (notification) =>
                getTypeLabel(
                    notification.type
                ).toUpperCase() === filter
        );
    }, [
        filter,
        sortedNotifications
    ]);

    const unreadCount = notifications.filter(
        (notification) =>
            notification.read !== true
    ).length;

    const sessionCount =
        notifications.filter((notification) => {
            const label = getTypeLabel(
                notification.type
            ).toUpperCase();

            return label === "SESSION";
        }).length;

    const paymentCount =
        notifications.filter((notification) => {
            const label = getTypeLabel(
                notification.type
            ).toUpperCase();

            return label === "PAYMENT";
        }).length;

    const markAsRead = (id) => {
        const updated = notifications.map(
            (notification) =>
                notification.id === id
                    ? {
                          ...notification,
                          read: true
                      }
                    : notification
        );

        setNotifications(updated);
        saveNotifications(updated);

        if (
            selectedNotification?.id === id
        ) {
            setSelectedNotification(
                updated.find(
                    (item) =>
                        item.id === id
                ) || null
            );
        }
    };

    const markAllAsRead = () => {
        const updated = notifications.map(
            (notification) => ({
                ...notification,
                read: true
            })
        );

        setNotifications(updated);
        saveNotifications(updated);

        if (selectedNotification) {
            setSelectedNotification({
                ...selectedNotification,
                read: true
            });
        }
    };

    const removeNotification = (id) => {
        const updated =
            notifications.filter(
                (notification) =>
                    notification.id !== id
            );

        setNotifications(updated);
        saveNotifications(updated);

        if (
            selectedNotification?.id === id
        ) {
            setSelectedNotification(null);
        }
    };

    const clearAll = () => {
        setNotifications([]);
        saveNotifications([]);
        setSelectedNotification(null);
    };

    const handleNotificationClick = (
        notification
    ) => {
        markAsRead(notification.id);
        setSelectedNotification(notification);
    };

    const handleJoinSession = (joinUrl) => {
        if (!joinUrl) {
            return;
        }

        setSelectedNotification(null);

        window.open(
            joinUrl,
            "_blank",
            "noopener,noreferrer"
        );
    };

    const handleViewSession = () => {
        const bookingId =
            getBookingId(
                selectedNotification
            );

        setSelectedNotification(null);

        if (bookingId) {
            navigate(
                `/learner/booking-success?bookingId=${bookingId}`
            );
            return;
        }

        navigate(
            "/learner?view=sessions"
        );
    };

    return (
        <div className="notifications-page">
            <div className="notifications-container">
                <div className="notifications-header">
                    <div className="notifications-heading">
                        <div className="notifications-heading-icon">
                            🔔
                        </div>

                        <div>
                            <h1>
                                Notifications
                            </h1>

                            <p>
                                Stay updated with
                                your bookings,
                                sessions and
                                payments.
                            </p>
                        </div>
                    </div>

                    <div className="notifications-actions">
                        {unreadCount > 0 && (
                            <button
                                type="button"
                                className="notification-action-btn"
                                onClick={
                                    markAllAsRead
                                }
                            >
                                Mark all as read
                            </button>
                        )}

                        {notifications.length >
                            0 && (
                            <button
                                type="button"
                                className="notification-clear-btn"
                                onClick={
                                    clearAll
                                }
                            >
                                Clear all
                            </button>
                        )}
                    </div>
                </div>

                <div className="notifications-summary">
                    <div className="notification-summary-card">
                        <span className="summary-number">
                            {
                                notifications.length
                            }
                        </span>

                        <span className="summary-label">
                            Total notifications
                        </span>
                    </div>

                    <div className="notification-summary-card unread">
                        <span className="summary-number">
                            {unreadCount}
                        </span>

                        <span className="summary-label">
                            Unread
                        </span>
                    </div>

                    <div className="notification-summary-card">
                        <span className="summary-number">
                            {sessionCount}
                        </span>

                        <span className="summary-label">
                            Sessions
                        </span>
                    </div>

                    <div className="notification-summary-card">
                        <span className="summary-number">
                            {paymentCount}
                        </span>

                        <span className="summary-label">
                            Payments
                        </span>
                    </div>
                </div>

                <div className="notifications-filters">
                    <button
                        type="button"
                        className={
                            filter === "ALL"
                                ? "notification-filter active"
                                : "notification-filter"
                        }
                        onClick={() =>
                            setFilter("ALL")
                        }
                    >
                        All
                    </button>

                    <button
                        type="button"
                        className={
                            filter ===
                            "UNREAD"
                                ? "notification-filter active"
                                : "notification-filter"
                        }
                        onClick={() =>
                            setFilter(
                                "UNREAD"
                            )
                        }
                    >
                        Unread
                        {unreadCount >
                            0 && (
                            <span className="filter-count">
                                {
                                    unreadCount
                                }
                            </span>
                        )}
                    </button>

                    <button
                        type="button"
                        className={
                            filter ===
                            "SESSION"
                                ? "notification-filter active"
                                : "notification-filter"
                        }
                        onClick={() =>
                            setFilter(
                                "SESSION"
                            )
                        }
                    >
                        Sessions
                    </button>

                    <button
                        type="button"
                        className={
                            filter ===
                            "PAYMENT"
                                ? "notification-filter active"
                                : "notification-filter"
                        }
                        onClick={() =>
                            setFilter(
                                "PAYMENT"
                            )
                        }
                    >
                        Payments
                    </button>

                    <button
                        type="button"
                        className={
                            filter ===
                            "BOOKING"
                                ? "notification-filter active"
                                : "notification-filter"
                        }
                        onClick={() =>
                            setFilter(
                                "BOOKING"
                            )
                        }
                    >
                        Bookings
                    </button>
                </div>

                <div className="notifications-list">
                    {filteredNotifications.length ===
                    0 ? (
                        <div className="notifications-empty">
                            <div className="empty-icon">
                                🔔
                            </div>

                            <h2>
                                No notifications
                            </h2>

                            <p>
                                {filter ===
                                "UNREAD"
                                    ? "You're all caught up."
                                    : "Your notifications will appear here."}
                            </p>

                            {filter !==
                                "ALL" && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFilter(
                                            "ALL"
                                        )
                                    }
                                    className="empty-reset-btn"
                                >
                                    View all
                                    notifications
                                </button>
                            )}
                        </div>
                    ) : (
                        filteredNotifications.map(
                            (
                                notification
                            ) => {
                                const type =
                                    getTypeLabel(
                                        notification.type
                                    ).toUpperCase();

                                const status =
                                    getPaymentStatus(
                                        notification
                                    );

                                const hasReceiptData =
                                    Boolean(
                                        getBookingId(
                                            notification
                                        ) ||
                                            getTransactionId(
                                                notification
                                            ) ||
                                            notification.amount ||
                                            notification.booking ||
                                            notification.payment
                                    );

                                return (
                                    <div
                                        key={
                                            notification.id
                                        }
                                        className={
                                            notification.read
                                                ? "notification-card"
                                                : "notification-card unread"
                                        }
                                        onClick={() =>
                                            handleNotificationClick(
                                                notification
                                            )
                                        }
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(
                                            event
                                        ) => {
                                            if (
                                                event.key ===
                                                    "Enter" ||
                                                event.key ===
                                                    " "
                                            ) {
                                                event.preventDefault();
                                                handleNotificationClick(
                                                    notification
                                                );
                                            }
                                        }}
                                    >
                                        <div
                                            className={`notification-icon notification-icon-${type.toLowerCase()}`}
                                        >
                                            {getIcon(
                                                notification.type
                                            )}
                                        </div>

                                        <div className="notification-content">
                                            <div className="notification-top">
                                                <span className="notification-type">
                                                    {getTypeLabel(
                                                        notification.type
                                                    )}
                                                </span>

                                                {!notification.read && (
                                                    <span className="notification-new">
                                                        New
                                                    </span>
                                                )}
                                            </div>

                                            <h3>
                                                {
                                                    notification.title ||
                                                    "Notification"
                                                }
                                            </h3>

                                            <p>
                                                {
                                                    notification.message
                                                }
                                            </p>

                                            <div className="notification-meta-row">
                                                <span className="notification-time">
                                                    {formatDate(
                                                        notification.createdAt
                                                    )}
                                                </span>

                                                {hasReceiptData && (
                                                    <span className="notification-receipt-hint">
                                                        View receipt
                                                        <span>
                                                            →
                                                        </span>
                                                    </span>
                                                )}

                                                {type ===
                                                    "PAYMENT" &&
                                                    status && (
                                                        <span
                                                            className={`notification-status ${getStatusClass(
                                                                status
                                                            )}`}
                                                        >
                                                            {
                                                                status
                                                            }
                                                        </span>
                                                    )}
                                            </div>
                                        </div>

                                        <div className="notification-card-actions">
                                            {!notification.read && (
                                                <button
                                                    type="button"
                                                    className="notification-read-btn"
                                                    title="Mark as read"
                                                    aria-label="Mark as read"
                                                    onClick={(
                                                        event
                                                    ) => {
                                                        event.stopPropagation();
                                                        markAsRead(
                                                            notification.id
                                                        );
                                                    }}
                                                >
                                                    ✓
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                className="notification-delete-btn"
                                                title="Delete"
                                                aria-label="Delete notification"
                                                onClick={(
                                                    event
                                                ) => {
                                                    event.stopPropagation();
                                                    removeNotification(
                                                        notification.id
                                                    );
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>

                                        <span className="notification-open-arrow">
                                            →
                                        </span>
                                    </div>
                                );
                            }
                        )
                    )}
                </div>
            </div>

            <ReceiptModal
                notification={
                    selectedNotification
                }
                onClose={() =>
                    setSelectedNotification(
                        null
                    )
                }
                onJoinSession={
                    handleJoinSession
                }
                onViewSession={
                    handleViewSession
                }
            />
        </div>
    );
}

export default Notifications;
