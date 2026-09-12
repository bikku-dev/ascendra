import React, { useEffect, useMemo, useState } from "react";
import {
    ArrowUpRight,
    CalendarDays,
    Check,
    CheckCircle2,
    ChevronRight,
    Clock3,
    Copy,
    CreditCard,
    FileText,
    Filter,
    RefreshCw,
    Search,
    ShieldCheck,
    X,
    XCircle
} from "lucide-react";
import "./PaymentHistoryView.css";
import { getPaymentByBookingId } from "../../service/bookingService";

function PaymentHistoryView({ sessions }) {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [copiedId, setCopiedId] = useState("");

    const bookings = useMemo(
        () => (Array.isArray(sessions) ? sessions : []),
        [sessions]
    );

    const loadPayments = async (showRefresh = false) => {
        if (showRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        setError("");

        if (bookings.length === 0) {
            setPayments([]);
            setLoading(false);
            setRefreshing(false);
            return;
        }

        try {
            const results = await Promise.all(
                bookings.map(async (booking) => {
                    if (!booking?.id) {
                        return null;
                    }

                    try {
                        const payment = await getPaymentByBookingId(booking.id);

                        return {
                            ...payment,
                            booking
                        };
                    } catch {
                        return null;
                    }
                })
            );

            setPayments(
                results.filter(Boolean)
            );
        } catch (err) {
            console.error("Payment history error:", err);
            setPayments([]);
            setError(
                err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    err?.message ||
                    "Unable to load payment history."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadPayments();
    }, [bookings]);

    const formatAmount = (value) => {
        const amount = Number(value);

        if (Number.isNaN(amount)) {
            return "₹0";
        }

        return `₹${amount.toLocaleString("en-IN")}`;
    };

    const getAmount = (payment) =>
        payment?.amount ??
        payment?.paidAmount ??
        payment?.booking?.amount ??
        0;

    const formatDate = (value) => {
        if (!value) {
            return "Date unavailable";
        }

        const text = String(value).slice(0, 10);
        const date = new Date(`${text}T00:00:00`);

        if (Number.isNaN(date.getTime())) {
            return text;
        }

        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    const formatDateTime = (value) => {
        if (!value) {
            return "Date unavailable";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return String(value);
        }

        return date.toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit"
        });
    };

    const formatTime = (value) => {
        if (!value) {
            return "Time unavailable";
        }

        const match = String(value).match(/^(\d{1,2}):(\d{2})/);

        if (!match) {
            return String(value);
        }

        const hour = Number(match[1]);

        return `${hour % 12 || 12}:${match[2]} ${
            hour >= 12 ? "PM" : "AM"
        }`;
    };

    const getExpertName = (booking) =>
        booking?.expertName ||
        booking?.expert?.name ||
        booking?.expert?.fullName ||
        "Expert";

    const getExpertTitle = (booking) =>
        booking?.professionalTitle ||
        booking?.expertTitle ||
        booking?.expert?.professionalTitle ||
        booking?.expert?.title ||
        "Mentoring session";

    const getTransactionId = (payment) =>
        payment?.transactionId ||
        payment?.razorpayPaymentId ||
        payment?.razorpay_payment_id ||
        payment?.paymentId ||
        "Not available";

    const getPaymentStatus = (payment) => {
        const status = String(
            payment?.status ||
                payment?.paymentStatus ||
                ""
        ).toUpperCase();

        if (
            status === "SUCCESS" ||
            status === "PAID" ||
            status === "COMPLETED"
        ) {
            return {
                key: "success",
                label: "Paid",
                description: "Payment completed successfully"
            };
        }

        if (
            status === "FAILED" ||
            status === "FAILURE"
        ) {
            return {
                key: "failed",
                label: "Failed",
                description: "Payment could not be completed"
            };
        }

        if (
            status === "CREATED" ||
            status === "PENDING"
        ) {
            return {
                key: "pending",
                label: "Pending",
                description: "Payment is awaiting completion"
            };
        }

        return {
            key: "pending",
            label: status || "Pending",
            description: "Payment status is being processed"
        };
    };

    const sortedPayments = useMemo(
        () =>
            [...payments].sort((a, b) => {
                const aDate = new Date(
                    a?.paidAt || a?.createdAt || 0
                ).getTime();

                const bDate = new Date(
                    b?.paidAt || b?.createdAt || 0
                ).getTime();

                return bDate - aDate;
            }),
        [payments]
    );

    const totalPaid = useMemo(
        () =>
            sortedPayments
                .filter(
                    (payment) =>
                        getPaymentStatus(payment).key ===
                        "success"
                )
                .reduce(
                    (total, payment) =>
                        total + Number(getAmount(payment) || 0),
                    0
                ),
        [sortedPayments]
    );

    const successCount = sortedPayments.filter(
        (payment) =>
            getPaymentStatus(payment).key === "success"
    ).length;

    const pendingCount = sortedPayments.filter(
        (payment) =>
            getPaymentStatus(payment).key === "pending"
    ).length;

    const failedCount = sortedPayments.filter(
        (payment) =>
            getPaymentStatus(payment).key === "failed"
    ).length;

    const filteredPayments = useMemo(() => {
        const query = search.trim().toLowerCase();

        return sortedPayments.filter((payment) => {
            const booking = payment?.booking || {};
            const status = getPaymentStatus(payment).key;
            const transaction = getTransactionId(payment);

            const searchable = [
                getExpertName(booking),
                getExpertTitle(booking),
                transaction,
                booking?.id,
                payment?.id
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const matchesSearch =
                !query || searchable.includes(query);

            const matchesStatus =
                statusFilter === "all" ||
                status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [sortedPayments, search, statusFilter]);

    const copyTransaction = async (payment) => {
        const transactionId = getTransactionId(payment);

        if (
            !transactionId ||
            transactionId === "Not available"
        ) {
            return;
        }

        try {
            await navigator.clipboard.writeText(transactionId);
            setCopiedId(transactionId);

            window.setTimeout(() => {
                setCopiedId("");
            }, 1600);
        } catch {
            setCopiedId("");
        }
    };

    if (loading) {
        return (
            <div className="payment-page">
                <div className="payment-page-shell">
                    <section className="payment-hero payment-hero-loading">
                        <div>
                            <span className="payment-eyebrow">
                                <span className="payment-eyebrow-dot" />
                                PAYMENTS
                            </span>
                            <h1>Payment history</h1>
                            <p>
                                A clear record of your mentoring
                                payments, all in one place.
                            </p>
                        </div>
                    </section>

                    <div className="payment-loading-card">
                        <div className="payment-loading-spinner" />
                        <div>
                            <strong>Loading payment history</strong>
                            <span>
                                Fetching your latest transactions...
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-page">
            <div className="payment-page-shell">
                <section className="payment-hero">
                    <div className="payment-hero-copy">
                        <span className="payment-eyebrow">
                            <span className="payment-eyebrow-dot" />
                            PAYMENT CENTER
                        </span>

                        <h1>Payment history</h1>

                        <p>
                            Track your mentoring purchases, payment
                            status and transaction details from one
                            secure workspace.
                        </p>

                        <div className="payment-trust-line">
                            <span>
                                <ShieldCheck size={14} />
                                Secure records
                            </span>
                            <span className="payment-trust-divider" />
                            <span>
                                <FileText size={14} />
                                {sortedPayments.length} records
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className={`payment-refresh-button ${
                            refreshing ? "is-refreshing" : ""
                        }`}
                        onClick={() => loadPayments(true)}
                        disabled={refreshing}
                    >
                        <RefreshCw size={16} />
                        {refreshing ? "Refreshing" : "Refresh"}
                    </button>
                </section>

                {error && (
                    <div className="payment-error">
                        <div className="payment-error-icon">
                            <XCircle size={18} />
                        </div>
                        <div>
                            <strong>Couldn’t load payments</strong>
                            <span>{error}</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => loadPayments(true)}
                        >
                            Try again
                        </button>
                    </div>
                )}

                <section className="payment-stats">
                    <div className="payment-stat-card payment-stat-primary">
                        <div className="payment-stat-icon">
                            <CreditCard size={20} />
                        </div>
                        <div className="payment-stat-content">
                            <span>Total paid</span>
                            <strong>{formatAmount(totalPaid)}</strong>
                            <small>
                                Across successful payments
                            </small>
                        </div>
                        <div className="payment-stat-glow" />
                    </div>

                    <div className="payment-stat-card">
                        <div className="payment-stat-icon">
                            <CheckCircle2 size={20} />
                        </div>
                        <div className="payment-stat-content">
                            <span>Successful</span>
                            <strong>{successCount}</strong>
                            <small>Completed transactions</small>
                        </div>
                    </div>

                    <div className="payment-stat-card">
                        <div className="payment-stat-icon">
                            <Clock3 size={20} />
                        </div>
                        <div className="payment-stat-content">
                            <span>Pending</span>
                            <strong>{pendingCount}</strong>
                            <small>Awaiting completion</small>
                        </div>
                    </div>

                    <div className="payment-stat-card">
                        <div className="payment-stat-icon">
                            <XCircle size={20} />
                        </div>
                        <div className="payment-stat-content">
                            <span>Failed</span>
                            <strong>{failedCount}</strong>
                            <small>Unsuccessful attempts</small>
                        </div>
                    </div>
                </section>

                <section className="payment-history-panel">
                    <div className="payment-panel-header">
                        <div>
                            <span className="payment-panel-kicker">
                                TRANSACTIONS
                            </span>
                            <h2>Your payment activity</h2>
                            <p>
                                Review every mentoring payment and
                                its associated session.
                            </p>
                        </div>

                        <div className="payment-panel-count">
                            <span>{filteredPayments.length}</span>
                            <small>
                                {filteredPayments.length === 1
                                    ? "record"
                                    : "records"}
                            </small>
                        </div>
                    </div>

                    <div className="payment-toolbar">
                        <div className="payment-search">
                            <Search size={17} />
                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search mentor, transaction or booking..."
                                aria-label="Search payments"
                            />
                            {search && (
                                <button
                                    type="button"
                                    className="payment-search-clear"
                                    onClick={() => setSearch("")}
                                    aria-label="Clear search"
                                >
                                    <X size={15} />
                                </button>
                            )}
                        </div>

                        <div className="payment-filter">
                            <Filter size={15} />
                            <select
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(event.target.value)
                                }
                                aria-label="Filter payments"
                            >
                                <option value="all">
                                    All payments
                                </option>
                                <option value="success">
                                    Successful
                                </option>
                                <option value="pending">
                                    Pending
                                </option>
                                <option value="failed">
                                    Failed
                                </option>
                            </select>
                        </div>
                    </div>

                    {filteredPayments.length === 0 ? (
                        <div className="payment-empty">
                            <div className="payment-empty-orbit">
                                <div className="payment-empty-icon">
                                    <CreditCard size={25} />
                                </div>
                            </div>

                            <span className="payment-empty-kicker">
                                NO RESULTS
                            </span>

                            <h3>
                                {sortedPayments.length === 0
                                    ? "No payment history yet"
                                    : "No payments match your filters"}
                            </h3>

                            <p>
                                {sortedPayments.length === 0
                                    ? "Your mentoring payments will appear here automatically after a successful booking."
                                    : "Try changing your search or selecting a different payment status."}
                            </p>

                            {sortedPayments.length > 0 && (
                                <button
                                    type="button"
                                    className="payment-reset-button"
                                    onClick={() => {
                                        setSearch("");
                                        setStatusFilter("all");
                                    }}
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="payment-list">
                            {filteredPayments.map((payment, index) => {
                                const booking =
                                    payment?.booking || {};
                                const status =
                                    getPaymentStatus(payment);
                                const amount =
                                    getAmount(payment);
                                const transactionId =
                                    getTransactionId(payment);
                                const expertName =
                                    getExpertName(booking);
                                const avatar =
                                    expertName
                                        .trim()
                                        .charAt(0)
                                        .toUpperCase() || "E";

                                return (
                                    <article
                                        className={`payment-item payment-item-${status.key}`}
                                        key={
                                            payment?.id ||
                                            booking?.id ||
                                            index
                                        }
                                    >
                                        <div className="payment-item-main">
                                            <div
                                                className={`payment-item-status-icon payment-item-status-${status.key}`}
                                            >
                                                {status.key ===
                                                "success" ? (
                                                    <CheckCircle2
                                                        size={20}
                                                    />
                                                ) : status.key ===
                                                  "failed" ? (
                                                    <XCircle
                                                        size={20}
                                                    />
                                                ) : (
                                                    <Clock3
                                                        size={20}
                                                    />
                                                )}
                                            </div>

                                            <div className="payment-mentor">
                                                <div className="payment-avatar">
                                                    {booking?.expert
                                                        ?.profileImage ||
                                                    booking?.expert
                                                        ?.avatarUrl ||
                                                    booking?.expert
                                                        ?.image ? (
                                                        <img
                                                            src={
                                                                booking
                                                                    .expert
                                                                    .profileImage ||
                                                                booking
                                                                    .expert
                                                                    .avatarUrl ||
                                                                booking
                                                                    .expert
                                                                    .image
                                                            }
                                                            alt=""
                                                        />
                                                    ) : (
                                                        avatar
                                                    )}
                                                </div>

                                                <div className="payment-mentor-copy">
                                                    <span className="payment-type">
                                                        MENTORING PAYMENT
                                                    </span>
                                                    <h3>
                                                        {expertName}
                                                    </h3>
                                                    <p>
                                                        {getExpertTitle(
                                                            booking
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="payment-item-session">
                                            <span>
                                                <CalendarDays size={14} />
                                                SESSION
                                            </span>
                                            <strong>
                                                {formatDate(
                                                    booking?.bookingDate
                                                )}
                                            </strong>
                                            <small>
                                                {formatTime(
                                                    booking?.startTime
                                                )}{" "}
                                                –{" "}
                                                {formatTime(
                                                    booking?.endTime
                                                )}
                                            </small>
                                        </div>

                                        <div className="payment-item-transaction">
                                            <span>
                                                TRANSACTION
                                            </span>
                                            <div>
                                                <code>
                                                    {transactionId}
                                                </code>

                                                {transactionId !==
                                                    "Not available" && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            copyTransaction(
                                                                payment
                                                            )
                                                        }
                                                        title={
                                                            copiedId ===
                                                            transactionId
                                                                ? "Copied"
                                                                : "Copy transaction ID"
                                                        }
                                                        aria-label="Copy transaction ID"
                                                    >
                                                        {copiedId ===
                                                        transactionId ? (
                                                            <Check
                                                                size={13}
                                                            />
                                                        ) : (
                                                            <Copy
                                                                size={13}
                                                            />
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="payment-item-amount">
                                            <span>AMOUNT</span>
                                            <strong>
                                                {formatAmount(
                                                    amount
                                                )}
                                            </strong>
                                            <b
                                                className={`payment-status payment-status-${status.key}`}
                                            >
                                                {status.label}
                                            </b>
                                        </div>

                                        <button
                                            type="button"
                                            className="payment-view-button"
                                            onClick={() =>
                                                setSelectedPayment(
                                                    payment
                                                )
                                            }
                                            aria-label="View payment details"
                                            title="View payment details"
                                        >
                                            <ArrowUpRight
                                                size={17}
                                            />
                                        </button>

                                        <div className="payment-item-footer">
                                            <span>
                                                {payment?.paidAt
                                                    ? `Paid ${formatDateTime(
                                                          payment.paidAt
                                                      )}`
                                                    : payment?.createdAt
                                                    ? `Created ${formatDateTime(
                                                          payment.createdAt
                                                      )}`
                                                    : "Payment date unavailable"}
                                            </span>

                                            <span>
                                                Booking #
                                                {booking?.id ||
                                                    "—"}
                                            </span>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>

                <div className="payment-footer-note">
                    <ShieldCheck size={16} />
                    <span>
                        Your payment records are linked to your
                        mentoring sessions for easy reference.
                    </span>
                </div>
            </div>

            {selectedPayment && (
                <PaymentDetailsModal
                    payment={selectedPayment}
                    onClose={() =>
                        setSelectedPayment(null)
                    }
                    formatAmount={formatAmount}
                    formatDate={formatDate}
                    formatDateTime={formatDateTime}
                    formatTime={formatTime}
                    getExpertName={getExpertName}
                    getExpertTitle={getExpertTitle}
                    getTransactionId={getTransactionId}
                    getPaymentStatus={getPaymentStatus}
                    copiedId={copiedId}
                    copyTransaction={copyTransaction}
                />
            )}
        </div>
    );
}

function PaymentDetailsModal({
    payment,
    onClose,
    formatAmount,
    formatDate,
    formatDateTime,
    formatTime,
    getExpertName,
    getExpertTitle,
    getTransactionId,
    getPaymentStatus,
    copiedId,
    copyTransaction
}) {
    const booking = payment?.booking || {};
    const status = getPaymentStatus(payment);
    const amount =
        payment?.amount ??
        payment?.paidAmount ??
        booking?.amount ??
        0;
    const transactionId =
        getTransactionId(payment);

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
            className="payment-modal-backdrop"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="payment-modal">
                <div className="payment-modal-top">
                    <div>
                        <span className="payment-modal-kicker">
                            PAYMENT RECEIPT
                        </span>
                        <h2>Transaction details</h2>
                        <p>
                            Complete payment information for
                            this mentoring session.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="payment-modal-close"
                        onClick={onClose}
                        aria-label="Close payment details"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="payment-receipt">
                    <div
                        className={`payment-receipt-icon payment-receipt-${status.key}`}
                    >
                        {status.key === "success" ? (
                            <CheckCircle2 size={25} />
                        ) : status.key === "failed" ? (
                            <XCircle size={25} />
                        ) : (
                            <Clock3 size={25} />
                        )}
                    </div>

                    <span>Amount paid</span>
                    <strong>
                        {formatAmount(amount)}
                    </strong>

                    <b
                        className={`payment-status payment-status-${status.key}`}
                    >
                        {status.label}
                    </b>

                    <small>
                        {status.description}
                    </small>
                </div>

                <div className="payment-modal-section">
                    <div className="payment-modal-section-heading">
                        <span>MENTORING SESSION</span>
                        <span>
                            Booking #{booking?.id || "—"}
                        </span>
                    </div>

                    <div className="payment-detail-grid">
                        <div className="payment-detail-box payment-detail-wide">
                            <span>Mentor</span>
                            <strong>
                                {getExpertName(booking)}
                            </strong>
                            <small>
                                {getExpertTitle(booking)}
                            </small>
                        </div>

                        <div className="payment-detail-box">
                            <span>
                                <CalendarDays size={13} />
                                Date
                            </span>
                            <strong>
                                {formatDate(
                                    booking?.bookingDate
                                )}
                            </strong>
                        </div>

                        <div className="payment-detail-box">
                            <span>
                                <Clock3 size={13} />
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
                    </div>
                </div>

                <div className="payment-modal-section">
                    <div className="payment-modal-section-heading">
                        <span>TRANSACTION</span>
                    </div>

                    <div className="payment-transaction-box">
                        <div>
                            <span>Transaction ID</span>
                            <code>{transactionId}</code>
                        </div>

                        {transactionId !==
                            "Not available" && (
                            <button
                                type="button"
                                onClick={() =>
                                    copyTransaction(
                                        payment
                                    )
                                }
                            >
                                {copiedId ===
                                transactionId ? (
                                    <>
                                        <Check size={14} />
                                        Copied
                                    </>
                                ) : (
                                    <>
                                        <Copy size={14} />
                                        Copy
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    <div className="payment-meta-list">
                        <div>
                            <span>Payment ID</span>
                            <strong>
                                {payment?.id || "Not available"}
                            </strong>
                        </div>

                        <div>
                            <span>
                                {payment?.paidAt
                                    ? "Paid at"
                                    : "Created at"}
                            </span>
                            <strong>
                                {payment?.paidAt
                                    ? formatDateTime(
                                          payment.paidAt
                                      )
                                    : formatDateTime(
                                          payment.createdAt
                                      )}
                            </strong>
                        </div>

                        <div>
                            <span>Payment method</span>
                            <strong>
                                {payment?.method ||
                                    payment?.paymentMethod ||
                                    "Razorpay"}
                            </strong>
                        </div>
                    </div>
                </div>

                <div className="payment-modal-bottom">
                    <div>
                        <ShieldCheck size={15} />
                        <span>Secure transaction record</span>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                    >
                        Done
                        <ChevronRight size={15} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PaymentHistoryView;
