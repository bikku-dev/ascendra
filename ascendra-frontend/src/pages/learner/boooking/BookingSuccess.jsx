import React, {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useSearchParams
} from "react-router-dom";

import {
    CheckCircle2,
    CalendarDays,
    Clock3,
    UserRound,
    ArrowRight,
    Home,
    Video,
    Loader2,
    CreditCard
} from "lucide-react";

import {
    getBookingById,
    getPaymentByBookingId
} from "../../../service/bookingService";

import "./BookingSuccess.css";

const formatDate = value => {
    if (!value) {
        return "Not available";
    }

    const text =
        String(value).slice(
            0,
            10
        );

    const date =
        new Date(
            `${text}T00:00:00`
        );

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return value;
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

const timeToMinutes = value => {
    if (!value) {
        return null;
    }

    const text =
        String(value)
            .trim();

    const match =
        text.match(
            /^(\d{1,2}):(\d{2})/
        );

    if (match) {
        return (
            Number(
                match[1]
            ) *
                60 +
            Number(
                match[2]
            )
        );
    }

    const date =
        new Date(text);

    if (
        !Number.isNaN(
            date.getTime()
        )
    ) {
        return (
            date.getHours() *
                60 +
            date.getMinutes()
        );
    }

    return null;
};

const formatTime = value => {
    if (!value) {
        return "Not available";
    }

    const minutes =
        timeToMinutes(
            value
        );

    if (minutes === null) {
        return value;
    }

    const hours =
        Math.floor(
            minutes / 60
        );

    const mins =
        minutes % 60;

    const suffix =
        hours >= 12
            ? "PM"
            : "AM";

    const displayHour =
        hours % 12 || 12;

    return `${displayHour}:${String(
        mins
    ).padStart(
        2,
        "0"
    )} ${suffix}`;
};

const formatTimeRange = (
    start,
    end
) => {
    if (!start) {
        return "Not available";
    }

    if (!end) {
        return formatTime(
            start
        );
    }

    return `${formatTime(
        start
    )} – ${formatTime(
        end
    )}`;
};

const unwrap = response => {
    if (
        Array.isArray(
            response
        )
    ) {
        return response;
    }

    if (
        Array.isArray(
            response?.data
        )
    ) {
        return response.data;
    }

    if (
        Array.isArray(
            response?.content
        )
    ) {
        return response.content;
    }

    return (
        response?.data ??
        response?.content ??
        response
    );
};

const getExpertName = booking =>
    booking?.expertName ||
    booking?.expert?.name ||
    booking?.expert?.fullName ||
    "Expert";

const getBookingId = booking =>
    booking?.id ??
    booking?.bookingId ??
    booking?.booking?.id ??
    "";

const getStatus = booking =>
    String(
        booking?.status ||
        booking?.bookingStatus ||
        ""
    ).toUpperCase();

const getAmount = booking =>
    Number(
        booking?.amount ??
        booking?.totalAmount ??
        booking?.price ??
        0
    );

const getDuration = booking => {
    if (
        booking?.duration
    ) {
        return Number(
            booking.duration
        );
    }

    if (
        booking?.durationMinutes
    ) {
        return Number(
            booking.durationMinutes
        );
    }

    const start =
        timeToMinutes(
            booking?.startTime
        );

    const end =
        timeToMinutes(
            booking?.endTime
        );

    if (
        start !== null &&
        end !== null &&
        end > start
    ) {
        return end - start;
    }

    return 30;
};

const getMeetingUrl = booking =>
    booking?.zoomJoinUrl ||
    booking?.meetingUrl ||
    booking?.zoomLink ||
    booking?.meetingLink ||
    booking?.joinUrl ||
    "";

const getPaymentStatus = payment =>
    String(
        payment?.status ||
        ""
    ).toUpperCase();

function BookingSuccess() {
    const navigate =
        useNavigate();

    const [
        searchParams
    ] = useSearchParams();

    const bookingId =
        searchParams.get(
            "bookingId"
        ) ||
        searchParams.get(
            "id"
        );

    const [
        booking,
        setBooking
    ] = useState(null);

    const [
        payment,
        setPayment
    ] = useState(null);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        error,
        setError
    ] = useState("");

    useEffect(() => {
        let mounted = true;

        const loadBooking =
            async () => {
                if (!bookingId) {
                    setError(
                        "Booking information was not found."
                    );

                    setLoading(
                        false
                    );

                    return;
                }

                try {
                    setLoading(
                        true
                    );

                    setError("");

                    const bookingResponse =
                        await getBookingById(
                            bookingId
                        );

                    if (!mounted) {
                        return;
                    }

                    const bookingData =
                        unwrap(
                            bookingResponse
                        );

                    const bookingObject =
                        Array.isArray(
                            bookingData
                        )
                            ? bookingData[0]
                            : bookingData;

                    setBooking(
                        bookingObject
                    );

                    try {
                        const paymentResponse =
                            await getPaymentByBookingId(
                                bookingId
                            );

                        if (
                            mounted
                        ) {
                            const paymentData =
                                unwrap(
                                    paymentResponse
                                );

                            setPayment(
                                Array.isArray(
                                    paymentData
                                )
                                    ? paymentData[0]
                                    : paymentData
                            );
                        }
                    } catch {
                        if (mounted) {
                            setPayment(
                                null
                            );
                        }
                    }
                } catch (err) {
                    if (!mounted) {
                        return;
                    }

                    setError(
                        err?.response
                            ?.data
                            ?.message ||
                        err?.response
                            ?.data
                            ?.error ||
                        err?.message ||
                        "Unable to load booking details."
                    );
                } finally {
                    if (mounted) {
                        setLoading(
                            false
                        );
                    }
                }
            };

        loadBooking();

        return () => {
            mounted = false;
        };
    }, [
        bookingId
    ]);

    if (loading) {
        return (
            <main className="booking-success-page">

                <section className="booking-success-loading">

                    <Loader2
                        size={32}
                        className="booking-success-spinner"
                    />

                    <h2>
                        Confirming your session
                    </h2>

                    <p>
                        Please wait while we
                        load your booking details.
                    </p>

                </section>

            </main>
        );
    }

    if (
        error ||
        !booking
    ) {
        return (
            <main className="booking-success-page">

                <section className="booking-success-error">

                    <div className="booking-success-error-icon">
                        !
                    </div>

                    <span className="booking-success-eyebrow">
                        BOOKING
                    </span>

                    <h1>
                        We couldn't load your booking
                    </h1>

                    <p>
                        {error ||
                            "The booking details are currently unavailable."}
                    </p>

                    <button
                        type="button"
                        className="booking-success-primary"
                        onClick={() =>
                            navigate(
                                "/learner?view=sessions"
                            )
                        }
                    >
                        Go to my sessions
                        <ArrowRight
                            size={17}
                        />
                    </button>

                </section>

            </main>
        );
    }

    const expertName =
        getExpertName(
            booking
        );

    const bookingNumber =
        getBookingId(
            booking
        );

    const status =
        getStatus(
            booking
        );

    const dateValue =
        booking?.bookingDate ||
        booking?.date;

    const startTime =
        booking?.startTime;

    const endTime =
        booking?.endTime;

    const duration =
        getDuration(
            booking
        );

    const amount =
        getAmount(
            booking
        );

    const meetingUrl =
        getMeetingUrl(
            booking
        );

    const paymentStatus =
        getPaymentStatus(
            payment
        );

    const confirmed =
        status ===
        "CONFIRMED";

    return (
        <main className="booking-success-page">

            <div className="booking-success-shell">

                <section className="booking-success-hero">

                    <div className="booking-success-check">
                        <CheckCircle2
                            size={42}
                        />
                    </div>

                    <span className="booking-success-eyebrow">
                        {confirmed
                            ? "BOOKING CONFIRMED"
                            : "BOOKING CREATED"}
                    </span>

                    <h1>
                        {confirmed
                            ? "Your session is booked."
                            : "Your booking is being processed."}
                    </h1>

                    <p>
                        Your mentoring session
                        with{" "}
                        <strong>
                            {
                                expertName
                            }
                        </strong>{" "}
                        {confirmed
                            ? "has been confirmed successfully."
                            : "has been created and is waiting for payment confirmation."}
                    </p>

                    <div className="booking-success-status">
                        <span />
                        {confirmed
                            ? "CONFIRMED"
                            : status ||
                              "PENDING"}
                    </div>

                </section>

                <section className="booking-success-card">

                    <div className="booking-success-card-header">

                        <div>
                            <span>
                                SESSION DETAILS
                            </span>

                            <h2>
                                Your mentoring session
                            </h2>
                        </div>

                        <div className="booking-success-booking-id">

                            <small>
                                BOOKING ID
                            </small>

                            <strong>
                                #
                                {
                                    bookingNumber
                                }
                            </strong>

                        </div>

                    </div>

                    <div className="booking-success-details">

                        <div className="booking-detail">

                            <div className="booking-detail-icon">
                                <UserRound
                                    size={19}
                                />
                            </div>

                            <div>
                                <span>
                                    Expert
                                </span>

                                <strong>
                                    {
                                        expertName
                                    }
                                </strong>
                            </div>

                        </div>

                        <div className="booking-detail">

                            <div className="booking-detail-icon">
                                <CalendarDays
                                    size={19}
                                />
                            </div>

                            <div>
                                <span>
                                    Date
                                </span>

                                <strong>
                                    {formatDate(
                                        dateValue
                                    )}
                                </strong>
                            </div>

                        </div>

                        <div className="booking-detail">

                            <div className="booking-detail-icon">
                                <Clock3
                                    size={19}
                                />
                            </div>

                            <div>
                                <span>
                                    Time
                                </span>

                                <strong>
                                    {formatTimeRange(
                                        startTime,
                                        endTime
                                    )}
                                </strong>
                            </div>

                        </div>

                        <div className="booking-detail">

                            <div className="booking-detail-icon">
                                <Clock3
                                    size={19}
                                />
                            </div>

                            <div>
                                <span>
                                    Duration
                                </span>

                                <strong>
                                    {
                                        duration
                                    }{" "}
                                    minutes
                                </strong>
                            </div>

                        </div>

                    </div>

                    <div className="booking-success-payment">

                        <div>

                            <span>
                                PAYMENT
                            </span>

                            <strong>
                                {paymentStatus ===
                                "SUCCESS"
                                    ? "Paid successfully"
                                    : confirmed
                                        ? "Payment confirmed"
                                        : "Payment processing"}
                            </strong>

                        </div>

                        <strong>
                            ₹
                            {
                                amount.toLocaleString(
                                    "en-IN"
                                )
                            }
                        </strong>

                    </div>

                    {meetingUrl && (
                        <a
                            href={
                                meetingUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="booking-success-meeting"
                        >
                            <Video
                                size={18}
                            />

                            Join session

                            <ArrowRight
                                size={17}
                            />
                        </a>
                    )}

                    {!meetingUrl &&
                        confirmed && (
                            <div className="booking-success-meeting-pending">

                                <Video
                                    size={18}
                                />

                                <div>
                                    <strong>
                                        Meeting link
                                        will be
                                        available
                                        here
                                    </strong>

                                    <span>
                                        Your session
                                        meeting
                                        details will
                                        appear once
                                        the meeting
                                        is ready.
                                    </span>
                                </div>

                            </div>
                        )}

                </section>

                <section className="booking-success-actions">

                    <button
                        type="button"
                        className="booking-success-primary"
                        onClick={() =>
                            navigate(
                                "/learner?view=sessions"
                            )
                        }
                    >
                        View my sessions

                        <ArrowRight
                            size={17}
                        />
                    </button>

                    <button
                        type="button"
                        className="booking-success-secondary"
                        onClick={() =>
                            navigate(
                                "/learner?view=experts"
                            )
                        }
                    >
                        <Home
                            size={17}
                        />

                        Find another expert
                    </button>

                </section>

            </div>

        </main>
    );
}

export default BookingSuccess;