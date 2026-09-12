import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    Check,
    CheckCircle2,
    Clock3,
    CreditCard,
    Loader2,
    ShieldCheck,
    Star,
    UserRound,
    X
} from "lucide-react";

import {
    getExpertById
} from "../../../service/expertService";

import {
    getExpertAvailability,
    createBooking,
    createPaymentOrder,
    verifyPayment
} from "../../../service/bookingService";

import { authApi } from "../../../service/authService";

import "./Booking.css";

const BOOKING_API = "/api/bookings";

const FALLBACK_SESSIONS = [
    {
        id: "30",
        duration: 30,
        price: 399,
        title: "Quick guidance",
        description:
            "Focused help on one specific question or problem."
    },
    {
        id: "45",
        duration: 45,
        price: 699,
        title: "Deep-dive session",
        description:
            "Detailed mentoring, problem solving and practical guidance."
    },
    {
        id: "60",
        duration: 60,
        price: 999,
        title: "Full mentoring session",
        description:
            "A complete session for career, technical or interview goals."
    }
];

const getUser = () => {
    const keys = [
        "user",
        "ascendra_user"
    ];

    for (const key of keys) {
        try {
            const value =
                localStorage.getItem(key);

            if (value) {
                return JSON.parse(value);
            }
        } catch {
            continue;
        }
    }

    return null;
};

const getUserId = user =>
    user?.id ??
    user?.userId ??
    user?.user?.id ??
    user?.user?.userId;

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

    if (Array.isArray(response?.availability)) {
        return response.availability;
    }

    if (Array.isArray(response?.slots)) {
        return response.slots;
    }

    if (Array.isArray(response?.data?.content)) {
        return response.data.content;
    }

    if (Array.isArray(response?.data?.availability)) {
        return response.data.availability;
    }

    if (Array.isArray(response?.data?.slots)) {
        return response.data.slots;
    }

    return (
        response?.data ??
        response?.content ??
        response?.availability ??
        response?.slots ??
        response
    );
};

const getExpertName = expert =>
    expert?.name ||
    expert?.fullName ||
    expert?.userName ||
    expert?.user?.name ||
    expert?.user?.fullName ||
    "Expert";

const getExpertTitle = expert =>
    expert?.headline ||
    expert?.professionalTitle ||
    expert?.targetRole ||
    expert?.role ||
    expert?.designation ||
    "Experienced Professional";

const getExpertRating = expert =>
    Number(
        expert?.rating ??
        expert?.averageRating ??
        0
    );

const getExpertExperience = expert =>
    Number(
        expert?.experienceYears ??
        expert?.yearsOfExperience ??
        expert?.experience ??
        0
    );

const getExpertPhoto = expert =>
    expert?.profilePicture ||
    expert?.profileImage ||
    expert?.photoUrl ||
    expert?.avatarUrl ||
    expert?.avatar ||
    expert?.user?.profilePicture ||
    expert?.user?.profileImage ||
    "";

const getInitials = name =>
    String(name)
        .split(" ")
        .map(part =>
            part
                .charAt(0)
                .toUpperCase()
        )
        .filter(Boolean)
        .slice(0, 2)
        .join("") || "E";

const getSessions = expert => {
    const source =
        expert?.sessionPackages ||
        expert?.sessions ||
        expert?.sessionTypes ||
        expert?.packages ||
        [];

    if (
        !Array.isArray(source) ||
        source.length === 0
    ) {
        return FALLBACK_SESSIONS;
    }

    const normalized =
        source
            .map((item, index) => {
                const duration =
                    Number(
                        item?.duration ??
                        item?.durationMinutes ??
                        item?.minutes ??
                        0
                    );

                const price =
                    Number(
                        item?.price ??
                        item?.amount ??
                        item?.sessionPrice ??
                        0
                    );

                return {
                    id:
                        item?.id ??
                        item?.sessionId ??
                        `${duration}-${index}`,
                    duration,
                    price,
                    title:
                        item?.title ||
                        item?.name ||
                        `${duration} minute session`,
                    description:
                        item?.description ||
                        "Mentoring session with your expert."
                };
            })
            .filter(
                item =>
                    item.duration > 0 &&
                    item.price >= 0
            );

    return normalized.length
        ? normalized
        : FALLBACK_SESSIONS;
};

const normalizeTime = value => {
    if (!value) {
        return "";
    }

    const text =
        String(value).trim();

    if (!text) {
        return "";
    }

    if (
        /^\d{2}:\d{2}:\d{2}$/.test(text)
    ) {
        return text;
    }

    if (
        /^\d{2}:\d{2}$/.test(text)
    ) {
        return `${text}:00`;
    }

    const date =
        new Date(text);

    if (!Number.isNaN(date.getTime())) {
        return [
            String(date.getHours()).padStart(2, "0"),
            String(date.getMinutes()).padStart(2, "0"),
            "00"
        ].join(":");
    }

    return "";
};

const timeToMinutes = value => {
    const normalized =
        normalizeTime(value);

    if (!normalized) {
        return null;
    }

    const parts =
        normalized
            .split(":")
            .map(Number);

    if (
        parts.length < 2 ||
        Number.isNaN(parts[0]) ||
        Number.isNaN(parts[1])
    ) {
        return null;
    }

    return (
        parts[0] * 60 +
        parts[1]
    );
};

const minutesToTime = minutes => {
    const safe =
        Math.max(
            0,
            Math.min(
                1439,
                Number(minutes)
            )
        );

    const hours =
        Math.floor(safe / 60);

    const mins =
        safe % 60;

    return `${String(hours).padStart(
        2,
        "0"
    )}:${String(mins).padStart(
        2,
        "0"
    )}:00`;
};

const toDateKey = date => {
    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const formatDate = date => {
    if (!date) {
        return "";
    }

    return new Intl.DateTimeFormat(
        "en-IN",
        {
            weekday: "short",
            day: "numeric",
            month: "short"
        }
    ).format(
        new Date(
            `${date}T00:00:00`
        )
    );
};

const formatLongDate = date => {
    if (!date) {
        return "";
    }

    return new Intl.DateTimeFormat(
        "en-IN",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    ).format(
        new Date(
            `${date}T00:00:00`
        )
    );
};

const buildFutureDates = count => {
    const dates = [];

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    for (
        let index = 0;
        index < count;
        index += 1
    ) {
        const date =
            new Date(today);

        date.setDate(
            today.getDate() +
            index
        );

        dates.push(
            toDateKey(date)
        );
    }

    return dates;
};

const getDayName = date => {
    const value =
        new Date(
            `${date}T00:00:00`
        );

    return [
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY"
    ][value.getDay()];
};

const normalizeDay = value => {
    if (!value) {
        return "";
    }

    return String(value)
        .trim()
        .toUpperCase();
};

const getAvailabilityDay = row =>
    normalizeDay(
        row?.dayOfWeek ??
        row?.day ??
        row?.weekday
    );

const getAvailabilityStart = row =>
    normalizeTime(
        row?.startTime ??
        row?.start ??
        row?.from ??
        row?.availableFrom
    );

const getAvailabilityEnd = row =>
    normalizeTime(
        row?.endTime ??
        row?.end ??
        row?.to ??
        row?.availableTo
    );

const isActiveAvailability = row => {
    if (!row) {
        return false;
    }

    if (
        row?.active === false ||
        row?.isActive === false
    ) {
        return false;
    }

    const status =
        String(
            row?.status ?? ""
        ).toUpperCase();

    if (
        [
            "INACTIVE",
            "DISABLED",
            "UNAVAILABLE"
        ].includes(status)
    ) {
        return false;
    }

    return true;
};

const normalizeAvailability = response => {
    const raw =
        unwrap(response);

    const rows =
        Array.isArray(raw)
            ? raw
            : raw &&
                typeof raw === "object"
                ? [raw]
                : [];

    return rows
        .map((row, index) => {
            const day =
                getAvailabilityDay(row);

            const start =
                getAvailabilityStart(row);

            const end =
                getAvailabilityEnd(row);

            if (
                !day ||
                !start ||
                !end ||
                !isActiveAvailability(row)
            ) {
                return null;
            }

            return {
                id:
                    row?.id ??
                    `${day}-${start}-${end}-${index}`,
                dayOfWeek: day,
                startTime: start,
                endTime: end,
                active: true
            };
        })
        .filter(Boolean);
};

const normalizeBookings = response => {
    const raw =
        unwrap(response);

    const rows =
        Array.isArray(raw)
            ? raw
            : raw &&
                typeof raw === "object"
                ? [raw]
                : [];

    return rows
        .map(row => {
            const date =
                row?.bookingDate ??
                row?.date;

            const start =
                normalizeTime(
                    row?.startTime ??
                    row?.start
                );

            const end =
                normalizeTime(
                    row?.endTime ??
                    row?.end
                );

            const status =
                String(
                    row?.status ??
                    row?.bookingStatus ??
                    ""
                ).toUpperCase();

            if (
                !date ||
                !start ||
                !end
            ) {
                return null;
            }

            return {
                id:
                    row?.id ??
                    row?.bookingId,
                bookingDate:
                    String(date).slice(0, 10),
                startTime: start,
                endTime: end,
                status
            };
        })
        .filter(Boolean);
};

const isBlockingBooking = booking =>
    [
        "PENDING_PAYMENT",
        "CONFIRMED"
    ].includes(
        booking?.status
    );

const overlaps = (
    start,
    end,
    bookingStart,
    bookingEnd
) =>
    start < bookingEnd &&
    end > bookingStart;

const createDurationSlots = (
    availabilityRows,
    duration,
    date,
    bookings
) => {
    if (
        !Array.isArray(
            availabilityRows
        ) ||
        !duration
    ) {
        return [];
    }

    const result = [];

    availabilityRows.forEach(
        (row, rowIndex) => {
            const start =
                timeToMinutes(
                    row.startTime
                );

            const end =
                timeToMinutes(
                    row.endTime
                );

            if (
                start === null ||
                end === null ||
                end <= start
            ) {
                return;
            }

            for (
                let cursor = start;
                cursor + duration <= end;
                cursor += 15
            ) {
                const slotEnd =
                    cursor +
                    duration;

                const blocked =
                    bookings.some(
                        booking => {
                            if (
                                booking.bookingDate !==
                                date
                            ) {
                                return false;
                            }

                            if (
                                !isBlockingBooking(
                                    booking
                                )
                            ) {
                                return false;
                            }

                            const bookingStart =
                                timeToMinutes(
                                    booking.startTime
                                );

                            const bookingEnd =
                                timeToMinutes(
                                    booking.endTime
                                );

                            if (
                                bookingStart ===
                                    null ||
                                bookingEnd ===
                                    null
                            ) {
                                return false;
                            }

                            return overlaps(
                                cursor,
                                slotEnd,
                                bookingStart,
                                bookingEnd
                            );
                        }
                    );

                if (blocked) {
                    continue;
                }

                result.push({
                    id:
                        `${date}-${minutesToTime(
                            cursor
                        )}-${minutesToTime(
                            slotEnd
                        )}-${rowIndex}`,
                    date,
                    startTime:
                        minutesToTime(
                            cursor
                        ),
                    endTime:
                        minutesToTime(
                            slotEnd
                        ),
                    available: true
                });
            }
        }
    );

    const unique =
        new Map();

    result.forEach(slot => {
        unique.set(
            `${slot.startTime}-${slot.endTime}`,
            slot
        );
    });

    return Array.from(
        unique.values()
    ).sort(
        (a, b) =>
            timeToMinutes(
                a.startTime
            ) -
            timeToMinutes(
                b.startTime
            )
    );
};

const formatTime = value => {
    const minutes =
        timeToMinutes(value);

    if (minutes === null) {
        return value || "";
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
    ).padStart(2, "0")} ${suffix}`;
};

const formatTimeRange = (
    start,
    end
) => {
    if (!start) {
        return "";
    }

    if (!end) {
        return formatTime(start);
    }

    return `${formatTime(
        start
    )} – ${formatTime(end)}`;
};

const getBookingId = response => {
    const data =
        unwrap(response);

    const object =
        Array.isArray(data)
            ? data[0]
            : data;

    return (
        object?.id ??
        object?.bookingId ??
        object?.booking?.id ??
        object?.data?.id ??
        object?.data?.bookingId
    );
};

const getPaymentObject = response => {
    const data =
        unwrap(response);

    return Array.isArray(data)
        ? data[0]
        : data;
};

function Booking() {
    const navigate =
        useNavigate();

    const { expertId } =
        useParams();

    const [
        expert,
        setExpert
    ] = useState(null);

    const [
        availabilityRows,
        setAvailabilityRows
    ] = useState([]);

    const [
        existingBookings,
        setExistingBookings
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        availabilityLoading,
        setAvailabilityLoading
    ] = useState(false);

    const [
        submitting,
        setSubmitting
    ] = useState(false);

    const [
        error,
        setError
    ] = useState("");

    const [
        step,
        setStep
    ] = useState(1);

    const [
        selectedSession,
        setSelectedSession
    ] = useState(null);

    const [
        selectedDate,
        setSelectedDate
    ] = useState("");

    const [
        selectedSlot,
        setSelectedSlot
    ] = useState(null);

    const [
        notes,
        setNotes
    ] = useState("");

    const futureDates =
        useMemo(
            () =>
                buildFutureDates(
                    30
                ),
            []
        );

    const sessions =
        useMemo(
            () =>
                getSessions(
                    expert
                ),
            [expert]
        );

    const platformFee =
        useMemo(() => {
            if (!selectedSession) {
                return 0;
            }

            return Math.round(
                selectedSession.price *
                    0.05
            );
        }, [
            selectedSession
        ]);

    const total =
        useMemo(() => {
            if (!selectedSession) {
                return 0;
            }

            return (
                selectedSession.price +
                platformFee
            );
        }, [
            selectedSession,
            platformFee
        ]);

    const availableDates =
        useMemo(() => {
            if (
                !selectedSession ||
                availabilityRows.length ===
                    0
            ) {
                return [];
            }

            return futureDates.filter(
                date => {
                    const day =
                        getDayName(
                            date
                        );

                    const dayRows =
                        availabilityRows.filter(
                            row =>
                                row.dayOfWeek ===
                                day
                        );

                    const slots =
                        createDurationSlots(
                            dayRows,
                            selectedSession.duration,
                            date,
                            existingBookings
                        );

                    return (
                        slots.length > 0
                    );
                }
            );
        }, [
            futureDates,
            availabilityRows,
            existingBookings,
            selectedSession
        ]);

    const selectedDateSlots =
        useMemo(() => {
            if (
                !selectedDate ||
                !selectedSession
            ) {
                return [];
            }

            const day =
                getDayName(
                    selectedDate
                );

            const dayRows =
                availabilityRows.filter(
                    row =>
                        row.dayOfWeek ===
                        day
                );

            return createDurationSlots(
                dayRows,
                selectedSession.duration,
                selectedDate,
                existingBookings
            );
        }, [
            selectedDate,
            selectedSession,
            availabilityRows,
            existingBookings
        ]);

    useEffect(() => {
        let mounted = true;

        const loadExpert =
            async () => {
                try {
                    setLoading(true);
                    setError("");

                    const response =
                        await getExpertById(
                            expertId
                        );

                    const data =
                        unwrap(response);

                    if (mounted) {
                        setExpert(
                            data
                        );
                    }
                } catch (err) {
                    if (mounted) {
                        setError(
                            err?.response
                                ?.data
                                ?.message ||
                            err?.response
                                ?.data
                                ?.error ||
                            "Unable to load this expert."
                        );
                    }
                } finally {
                    if (mounted) {
                        setLoading(
                            false
                        );
                    }
                }
            };

        if (expertId) {
            loadExpert();
        } else {
            setLoading(false);
            setError(
                "Expert ID was not provided."
            );
        }

        return () => {
            mounted = false;
        };
    }, [expertId]);

    useEffect(() => {
        if (!expertId) {
            return;
        }

        let mounted = true;

        const loadBookingData =
            async () => {
                try {
                    setAvailabilityLoading(
                        true
                    );

                    setError("");

                    const [
                        availabilityResponse,
                        bookingsResponse
                    ] = await Promise.all([
                        getExpertAvailability(
                            expertId
                        ),
                        authApi.get(
                            `${BOOKING_API}/expert/${expertId}`
                        )
                    ]);

                    if (!mounted) {
                        return;
                    }

                    setAvailabilityRows(
                        normalizeAvailability(
                            availabilityResponse
                        )
                    );

                    setExistingBookings(
                        normalizeBookings(
                            bookingsResponse
                        )
                    );
                } catch (err) {
                    if (!mounted) {
                        return;
                    }

                    setAvailabilityRows(
                        []
                    );

                    setExistingBookings(
                        []
                    );

                    setError(
                        err?.response
                            ?.data
                            ?.message ||
                        err?.response
                            ?.data
                            ?.error ||
                        "Unable to load expert availability."
                    );
                } finally {
                    if (mounted) {
                        setAvailabilityLoading(
                            false
                        );
                    }
                }
            };

        loadBookingData();

        return () => {
            mounted = false;
        };
    }, [expertId]);

    useEffect(() => {
        if (
            selectedDate &&
            !availableDates.includes(
                selectedDate
            )
        ) {
            setSelectedDate("");
            setSelectedSlot(null);
        }
    }, [
        availableDates,
        selectedDate
    ]);

    useEffect(() => {
        if (!selectedDate) {
            setSelectedSlot(null);
            return;
        }

        const stillAvailable =
            selectedDateSlots.some(
                slot =>
                    slot.id ===
                    selectedSlot?.id
            );

        if (!stillAvailable) {
            setSelectedSlot(
                null
            );
        }
    }, [
        selectedDate,
        selectedDateSlots,
        selectedSlot
    ]);

    const handleSessionSelect =
        session => {
            setSelectedSession(
                session
            );

            setSelectedDate(
                ""
            );

            setSelectedSlot(
                null
            );

            setStep(1);

            setError("");
        };

    const handleDateSelect =
        date => {
            setSelectedDate(
                date
            );

            setSelectedSlot(
                null
            );

            setError("");
        };

    const handleSlotSelect =
        slot => {
            setSelectedSlot(
                slot
            );

            setError("");
        };

    const handleContinue =
        () => {
            setError("");

            if (step === 1) {
                if (!selectedSession) {
                    setError(
                        "Please select a session."
                    );
                    return;
                }

                if (
                    availableDates.length ===
                    0
                ) {
                    setError(
                        "No available date is currently available for this session duration."
                    );
                    return;
                }

                if (!selectedDate) {
                    setError(
                        "Please select an available date."
                    );
                    return;
                }

                if (
                    selectedDateSlots.length ===
                    0
                ) {
                    setError(
                        "No available time is left for this date."
                    );
                    return;
                }

                setStep(2);
                return;
            }

            if (step === 2) {
                if (!selectedSlot) {
                    setError(
                        "Please select an available time."
                    );
                    return;
                }

                setStep(3);
            }
        };

    const handleBack =
        () => {
            setError("");

            if (step === 1) {
                navigate(-1);
                return;
            }

            setStep(
                previous =>
                    previous - 1
            );
        };

    const handleBooking =
        async () => {
            const user =
                getUser();

            const learnerId =
                getUserId(
                    user
                );

            if (!learnerId) {
                setError(
                    "Your learner account could not be found. Please login again."
                );
                return;
            }

            if (
                !selectedSession ||
                !selectedDate ||
                !selectedSlot
            ) {
                setError(
                    "Please complete the booking details."
                );
                return;
            }

            const latestBookings =
                existingBookings;

            const latestDay =
                getDayName(
                    selectedDate
                );

            const latestAvailability =
                availabilityRows.filter(
                    row =>
                        row.dayOfWeek ===
                        latestDay
                );

            const latestSlots =
                createDurationSlots(
                    latestAvailability,
                    selectedSession.duration,
                    selectedDate,
                    latestBookings
                );

            const currentSlotStillAvailable =
                latestSlots.some(
                    slot =>
                        slot.startTime ===
                            selectedSlot.startTime &&
                        slot.endTime ===
                            selectedSlot.endTime
                );

            if (
                !currentSlotStillAvailable
            ) {
                setSelectedSlot(
                    null
                );

                setStep(2);

                setError(
                    "This time slot is no longer available. Please select another time."
                );

                return;
            }

            try {
                setSubmitting(true);
                setError("");

                const bookingPayload = {
                    learnerId:
                        Number(
                            learnerId
                        ),

                    expertId:
                        Number(
                            expertId
                        ),

                    bookingDate:
                        selectedDate,

                    startTime:
                        selectedSlot.startTime,

                    endTime:
                        selectedSlot.endTime,

                    amount:
                        total
                };

                const bookingResponse =
                    await createBooking(
                        bookingPayload
                    );

                const bookingId =
                    getBookingId(
                        bookingResponse
                    );

                if (!bookingId) {
                    throw new Error(
                        "Booking was created but no booking ID was returned."
                    );
                }

                const paymentResponse =
                    await createPaymentOrder(
                        {
                            bookingId
                        }
                    );

                const payment =
                    getPaymentObject(
                        paymentResponse
                    );

                const orderId =
                    payment?.razorpayOrderId;

                const razorpayKey =
                    payment?.razorpayKeyId;

                const paymentId =
                    payment?.paymentId;

                if (
                    !orderId ||
                    !razorpayKey ||
                    !paymentId
                ) {
                    throw new Error(
                        "Razorpay order details were not returned by the server."
                    );
                }

                if (
                    !window.Razorpay
                ) {
                    throw new Error(
                        "Razorpay checkout is not loaded. Please refresh the page and try again."
                    );
                }

                const options = {
                    key:
                        razorpayKey,

                    amount:
                        payment?.amount ??
                        total * 100,

                    currency:
                        payment?.currency ||
                        "INR",

                    name:
                        "Ascendra",

                    description:
                        `${selectedSession.duration} minute mentoring session`,

                    order_id:
                        orderId,

                    prefill: {
                        name:
                            user?.name ||
                            user?.fullName ||
                            user?.username ||
                            "",

                        email:
                            user?.email ||
                            ""
                    },

                    notes: {
                        booking_id:
                            String(
                                bookingId
                            )
                    },

                    theme: {
                        color:
                            "#10aaa4"
                    },

                    handler:
                        async razorpayResponse => {
                            try {
                                setSubmitting(
                                    true
                                );

                                setError("");

                                if (
                                    !razorpayResponse
                                        ?.razorpay_payment_id ||
                                    !razorpayResponse
                                        ?.razorpay_order_id ||
                                    !razorpayResponse
                                        ?.razorpay_signature
                                ) {
                                    throw new Error(
                                        "Razorpay payment verification details are missing."
                                    );
                                }

                                await verifyPayment(
                                    {
                                        paymentId:
                                            paymentId,

                                        razorpayPaymentId:
                                            razorpayResponse
                                                .razorpay_payment_id,

                                        razorpayOrderId:
                                            razorpayResponse
                                                .razorpay_order_id,

                                        razorpaySignature:
                                            razorpayResponse
                                                .razorpay_signature
                                    }
                                );

                                navigate(
                                    `/learner/booking-success?bookingId=${bookingId}`,
                                    {
                                        replace:
                                            true
                                    }
                                );
                            } catch (err) {
                                setError(
                                    err?.response
                                        ?.data
                                        ?.message ||
                                    err?.response
                                        ?.data
                                        ?.error ||
                                    err?.message ||
                                    "Payment verification failed. Please contact support if the amount was deducted."
                                );

                                setSubmitting(
                                    false
                                );
                            }
                        },

                    modal: {
                        ondismiss:
                            () => {
                                setSubmitting(
                                    false
                                );
                            }
                    }
                };

                const razorpay =
                    new window.Razorpay(
                        options
                    );

                razorpay.on(
                    "payment.failed",
                    response => {
                        setError(
                            response
                                ?.error
                                ?.description ||
                            "Payment failed. Please try again."
                        );

                        setSubmitting(
                            false
                        );
                    }
                );

                razorpay.open();
            } catch (err) {
                setError(
                    err?.response
                        ?.data
                        ?.message ||
                    err?.response
                        ?.data
                        ?.error ||
                    err?.message ||
                    "Unable to create the booking."
                );

                setSubmitting(
                    false
                );
            }
        };

    const expertName =
        getExpertName(
            expert
        );

    const expertTitle =
        getExpertTitle(
            expert
        );

    const rating =
        getExpertRating(
            expert
        );

    const experience =
        getExpertExperience(
            expert
        );

    const photo =
        getExpertPhoto(
            expert
        );

    if (loading) {
        return (
            <div className="booking-page">
                <div className="booking-loading">
                    <Loader2
                        size={28}
                        className="booking-spin"
                    />

                    <h2>
                        Preparing your booking
                    </h2>

                    <p>
                        Loading expert details and
                        availability.
                    </p>
                </div>
            </div>
        );
    }

    if (!expert) {
        return (
            <div className="booking-page">
                <div className="booking-error-state">
                    <div className="booking-error-icon">
                        <X size={24} />
                    </div>

                    <h1>
                        Expert unavailable
                    </h1>

                    <p>
                        {error ||
                            "This expert could not be found."}
                    </p>

                    <button
                        type="button"
                        className="booking-primary-button"
                        onClick={() =>
                            navigate(-1)
                        }
                    >
                        <ArrowLeft
                            size={17}
                        />
                        Back to experts
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="booking-page">
            <div className="booking-container">

                <header className="booking-header">

                    <button
                        type="button"
                        className="booking-back-link"
                        onClick={() =>
                            navigate(-1)
                        }
                    >
                        <ArrowLeft
                            size={17}
                        />
                        Back
                    </button>

                    <div className="booking-brand">
                        <span>
                            A
                        </span>
                        Ascendra
                    </div>

                    <div className="booking-secure">
                        <ShieldCheck
                            size={17}
                        />
                        Secure booking
                    </div>

                </header>

                <div className="booking-layout">

                    <main className="booking-main">

                        <div className="booking-progress">

                            <div
                                className={`booking-progress-step ${
                                    step >= 1
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <span>
                                    {step > 1 ? (
                                        <Check
                                            size={15}
                                        />
                                    ) : (
                                        "1"
                                    )}
                                </span>

                                <strong>
                                    Session
                                </strong>
                            </div>

                            <div
                                className={`booking-progress-line ${
                                    step > 1
                                        ? "active"
                                        : ""
                                }`}
                            />

                            <div
                                className={`booking-progress-step ${
                                    step >= 2
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <span>
                                    {step > 2 ? (
                                        <Check
                                            size={15}
                                        />
                                    ) : (
                                        "2"
                                    )}
                                </span>

                                <strong>
                                    Date & time
                                </strong>
                            </div>

                            <div
                                className={`booking-progress-line ${
                                    step > 2
                                        ? "active"
                                        : ""
                                }`}
                            />

                            <div
                                className={`booking-progress-step ${
                                    step >= 3
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <span>
                                    3
                                </span>

                                <strong>
                                    Review
                                </strong>
                            </div>

                        </div>

                        <div className="booking-page-title">

                            <span>
                                BOOK A SESSION
                            </span>

                            <h1>
                                Schedule time with{" "}
                                {expertName}
                            </h1>

                            <p>
                                Choose a session,
                                select a real available
                                date and pick an open
                                time.
                            </p>

                        </div>

                        {error && (
                            <div className="booking-error-banner">

                                <div>
                                    <X
                                        size={16}
                                    />
                                </div>

                                <p>
                                    {error}
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setError(
                                            ""
                                        )
                                    }
                                >
                                    <X
                                        size={15}
                                    />
                                </button>

                            </div>
                        )}

                        {step === 1 && (
                            <>

                                <section className="booking-section">

                                    <div className="booking-section-heading">

                                        <div>
                                            <span>
                                                01
                                            </span>

                                            <h2>
                                                Choose your session
                                            </h2>
                                        </div>

                                        <p>
                                            Pick the duration
                                            that fits your goal.
                                        </p>

                                    </div>

                                    <div className="booking-session-grid">

                                        {sessions.map(
                                            session => (
                                                <button
                                                    type="button"
                                                    key={
                                                        session.id
                                                    }
                                                    className={`booking-session-card ${
                                                        selectedSession?.id ===
                                                        session.id
                                                            ? "selected"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        handleSessionSelect(
                                                            session
                                                        )
                                                    }
                                                >

                                                    <div className="booking-session-top">

                                                        <div className="booking-session-icon">
                                                            <Clock3
                                                                size={
                                                                    19
                                                                }
                                                            />
                                                        </div>

                                                        <strong className="booking-session-duration">
                                                            {
                                                                session.duration
                                                            }{" "}
                                                            min
                                                        </strong>

                                                    </div>

                                                    <h3>
                                                        {
                                                            session.title
                                                        }
                                                    </h3>

                                                    <p>
                                                        {
                                                            session.description
                                                        }
                                                    </p>

                                                    <div className="booking-session-price">
                                                        ₹
                                                        {
                                                            session.price
                                                        }
                                                    </div>

                                                </button>
                                            )
                                        )}

                                    </div>

                                </section>

                                {selectedSession && (
                                    <section className="booking-section">

                                        <div className="booking-section-heading">

                                            <div>
                                                <span>
                                                    02
                                                </span>

                                                <h2>
                                                    Choose an available date
                                                </h2>
                                            </div>

                                            <p>
                                                Only dates with
                                                an actual{" "}
                                                {
                                                    selectedSession.duration
                                                }
                                                -minute slot
                                                are shown.
                                            </p>

                                        </div>

                                        {availabilityLoading ? (
                                            <div className="booking-inline-loading">
                                                <Loader2
                                                    size={20}
                                                    className="booking-spin"
                                                />

                                                Checking
                                                availability...
                                            </div>
                                        ) : availableDates.length ===
                                          0 ? (
                                            <div className="booking-empty-state">

                                                <CalendarDays
                                                    size={30}
                                                />

                                                <h3>
                                                    No available dates
                                                </h3>

                                                <p>
                                                    This expert
                                                    currently has
                                                    no open{" "}
                                                    {
                                                        selectedSession.duration
                                                    }
                                                    -minute
                                                    sessions in
                                                    the next 30
                                                    days.
                                                </p>

                                            </div>
                                        ) : (
                                            <div className="booking-date-grid">

                                                {availableDates.map(
                                                    date => (
                                                        <button
                                                            type="button"
                                                            key={
                                                                date
                                                            }
                                                            className={`booking-date-card ${
                                                                selectedDate ===
                                                                date
                                                                    ? "selected"
                                                                    : ""
                                                            }`}
                                                            onClick={() =>
                                                                handleDateSelect(
                                                                    date
                                                                )
                                                            }
                                                        >

                                                            <CalendarDays
                                                                size={
                                                                    18
                                                                }
                                                            />

                                                            <strong>
                                                                {date ===
                                                                futureDates[0]
                                                                    ? "Today"
                                                                    : date ===
                                                                      futureDates[1]
                                                                        ? "Tomorrow"
                                                                        : formatDate(
                                                                              date
                                                                          )}
                                                            </strong>

                                                            <small>
                                                                {
                                                                    date
                                                                }
                                                            </small>

                                                        </button>
                                                    )
                                                )}

                                            </div>
                                        )}

                                    </section>
                                )}

                            </>
                        )}

                        {step === 2 && (
                            <section className="booking-section">

                                <div className="booking-section-heading">

                                    <div>
                                        <span>
                                            02
                                        </span>

                                        <h2>
                                            Choose an available time
                                        </h2>
                                    </div>

                                    <p>
                                        {
                                            selectedDate
                                                ? formatLongDate(
                                                      selectedDate
                                                  )
                                                : "Select a date"
                                        }
                                    </p>

                                </div>

                                {availabilityLoading ? (
                                    <div className="booking-inline-loading">
                                        <Loader2
                                            size={20}
                                            className="booking-spin"
                                        />

                                        Loading
                                        available times...
                                    </div>
                                ) : selectedDateSlots.length ===
                                  0 ? (
                                    <div className="booking-empty-state">

                                        <Clock3
                                            size={30}
                                        />

                                        <h3>
                                            No available times
                                        </h3>

                                        <p>
                                            All matching
                                            sessions on
                                            this date are
                                            already booked.
                                        </p>

                                    </div>
                                ) : (
                                    <div className="booking-slot-grid">

                                        {selectedDateSlots.map(
                                            slot => (
                                                <button
                                                    type="button"
                                                    key={
                                                        slot.id
                                                    }
                                                    className={`booking-slot ${
                                                        selectedSlot?.id ===
                                                        slot.id
                                                            ? "selected"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        handleSlotSelect(
                                                            slot
                                                        )
                                                    }
                                                >
                                                    <Clock3
                                                        size={
                                                            16
                                                        }
                                                    />

                                                    <span>
                                                        {formatTimeRange(
                                                            slot.startTime,
                                                            slot.endTime
                                                        )}
                                                    </span>

                                                    {selectedSlot?.id ===
                                                        slot.id && (
                                                        <CheckCircle2
                                                            size={
                                                                17
                                                            }
                                                        />
                                                    )}

                                                </button>
                                            )
                                        )}

                                    </div>
                                )}

                            </section>
                        )}

                        {step === 3 && (
                            <>

                                <section className="booking-section">

                                    <div className="booking-section-heading">

                                        <div>
                                            <span>
                                                03
                                            </span>

                                            <h2>
                                                Review your booking
                                            </h2>
                                        </div>

                                        <p>
                                            Check the details
                                            before payment.
                                        </p>

                                    </div>

                                    <div className="booking-review-card">

                                        <div className="booking-review-row">
                                            <span>
                                                Session
                                            </span>

                                            <strong>
                                                {
                                                    selectedSession?.duration
                                                }{" "}
                                                minutes
                                            </strong>
                                        </div>

                                        <div className="booking-review-row">
                                            <span>
                                                Date
                                            </span>

                                            <strong>
                                                {formatLongDate(
                                                    selectedDate
                                                )}
                                            </strong>
                                        </div>

                                        <div className="booking-review-row">
                                            <span>
                                                Time
                                            </span>

                                            <strong>
                                                {formatTimeRange(
                                                    selectedSlot?.startTime,
                                                    selectedSlot?.endTime
                                                )}
                                            </strong>
                                        </div>

                                    </div>

                                    <div className="booking-notes">

                                        <label>
                                            What would you
                                            like to work on?
                                            <span>
                                                Optional
                                            </span>
                                        </label>

                                        <textarea
                                            value={
                                                notes
                                            }
                                            onChange={event =>
                                                setNotes(
                                                    event
                                                        .target
                                                        .value
                                                        .slice(
                                                            0,
                                                            500
                                                        ))
                                                }
                                            
                                            placeholder="Example: I want help preparing for a Spring Boot interview."/>

                                        <small>
                                            {
                                                notes.length
                                            }
                                            /500
                                        </small>

                                    </div>

                                </section>

                            </>
                        )}

                        <div className="booking-actions">

                            <button
                                type="button"
                                className="booking-secondary-button"
                                onClick={
                                    handleBack
                                }
                                disabled={
                                    submitting
                                }
                            >
                                <ArrowLeft
                                    size={17}
                                />
                                Back
                            </button>

                            {step < 3 ? (
                                <button
                                    type="button"
                                    className="booking-primary-button"
                                    onClick={
                                        handleContinue
                                    }
                                    disabled={
                                        availabilityLoading ||
                                        !selectedSession ||
                                        !selectedDate ||
                                        (step === 2 &&
                                            !selectedSlot)
                                    }
                                >
                                    Continue
                                    <ArrowRight
                                        size={17}
                                    />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="booking-primary-button"
                                    onClick={
                                        handleBooking
                                    }
                                    disabled={
                                        submitting
                                    }
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2
                                                size={17}
                                                className="booking-spin"
                                            />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard
                                                size={17}
                                            />
                                            Continue to payment
                                        </>
                                    )}
                                </button>
                            )}

                        </div>

                    </main>

                    <aside className="booking-sidebar">

                        <div className="booking-expert-card">

                            <div className="booking-expert-top">

                                {photo ? (
                                    <img
                                        src={
                                            photo
                                        }
                                        alt={
                                            expertName
                                        }
                                        className="booking-expert-avatar-image"
                                    />
                                ) : (
                                    <div className="booking-expert-avatar">
                                        {
                                            getInitials(
                                                expertName
                                            )
                                        }
                                    </div>
                                )}

                                <div>
                                    <span className="booking-card-label">
                                        YOUR EXPERT
                                    </span>

                                    <h2>
                                        {
                                            expertName
                                        }
                                    </h2>

                                    <p>
                                        {
                                            expertTitle
                                        }
                                    </p>
                                </div>

                            </div>

                            <div className="booking-expert-meta">

                                {rating > 0 && (
                                    <span>
                                        <Star
                                            size={15}
                                            fill="currentColor"
                                        />
                                        {rating.toFixed(
                                            1
                                        )}
                                    </span>
                                )}

                                {experience > 0 && (
                                    <span>
                                        <Clock3
                                            size={15}
                                        />
                                        {
                                            experience
                                        }
                                        + years
                                    </span>
                                )}

                            </div>

                        </div>

                        <div className="booking-summary-card">

                            <div className="booking-summary-heading">

                                <h2>
                                    Booking summary
                                </h2>

                                <CheckCircle2
                                    size={19}
                                />

                            </div>

                            <div className="booking-summary-list">

                                <div className="booking-summary-item">

                                    <CalendarDays
                                        size={18}
                                    />

                                    <div>
                                        <span>
                                            DATE
                                        </span>

                                        <strong>
                                            {selectedDate
                                                ? formatLongDate(
                                                      selectedDate
                                                  )
                                                : "Select a date"}
                                        </strong>
                                    </div>

                                </div>

                                <div className="booking-summary-item">

                                    <Clock3
                                        size={18}
                                    />

                                    <div>
                                        <span>
                                            TIME
                                        </span>

                                        <strong>
                                            {selectedSlot
                                                ? formatTimeRange(
                                                      selectedSlot.startTime,
                                                      selectedSlot.endTime
                                                  )
                                                : "Select a time"}
                                        </strong>
                                    </div>

                                </div>

                                <div className="booking-summary-item">

                                    <UserRound
                                        size={18}
                                    />

                                    <div>
                                        <span>
                                            SESSION
                                        </span>

                                        <strong>
                                            {selectedSession
                                                ? `${selectedSession.duration} minutes`
                                                : "Select a session"}
                                        </strong>
                                    </div>

                                </div>

                            </div>

                            <div className="booking-summary-pricing">

                                <div className="booking-price-row">
                                    <span>
                                        Session fee
                                    </span>

                                    <strong>
                                        ₹
                                        {
                                            selectedSession
                                                ? selectedSession.price
                                                : 0
                                        }
                                    </strong>
                                </div>

                                <div className="booking-price-row">
                                    <span>
                                        Platform fee
                                    </span>

                                    <strong>
                                        ₹
                                        {
                                            platformFee
                                        }
                                    </strong>
                                </div>

                                <div className="booking-total-row">

                                    <span>
                                        Total
                                    </span>

                                    <strong>
                                        ₹
                                        {
                                            total
                                        }
                                    </strong>

                                </div>

                            </div>

                            <div className="booking-protection">

                                <ShieldCheck
                                    size={17}
                                />

                                <p>
                                    Secure payment.
                                    Your booking is
                                    confirmed only
                                    after successful
                                    payment verification.
                                </p>

                            </div>

                        </div>

                        <div className="booking-help-card">

                            <UserRound
                                size={18}
                            />

                            <div>
                                <strong>
                                    Need help?
                                </strong>

                                <p>
                                    You can review
                                    everything before
                                    payment.
                                </p>
                            </div>

                        </div>

                    </aside>

                </div>

            </div>
        </div>
    );
}

export default Booking;