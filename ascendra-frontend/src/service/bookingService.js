import { authApi } from "./authService";

const BOOKINGS_API = "/api/bookings";
const EXPERT_AVAILABILITY_API = "/api/expert-availability";
const PAYMENTS_API = "/api/payments";

const ACTIVE_BOOKING_STATUSES = [
    "PENDING_PAYMENT",
    "CONFIRMED"
];

const pad = (value) => String(value).padStart(2, "0");

const timeToMinutes = (time) => {
    if (!time) return 0;

    const [hours, minutes] = time
        .substring(0, 5)
        .split(":")
        .map(Number);

    return hours * 60 + minutes;
};

const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${pad(hours)}:${pad(mins)}:00`;
};

const getDayName = (date) => {
    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
        return null;
    }

    return [
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY"
    ][parsedDate.getDay()];
};

export const getBookingById = async (bookingId) => {
    const response = await authApi.get(
        `${BOOKINGS_API}/${bookingId}`
    );

    return response.data;
};

export const getMyBookings = async (learnerId) => {
    if (!learnerId) {
        throw new Error("Learner ID is required");
    }

    const response = await authApi.get(
        `${BOOKINGS_API}/learner/${learnerId}`
    );

    return response.data;
};

export const getLearnerBookings = async (learnerId) => {
    return getMyBookings(learnerId);
};

export const getMySessions = async (learnerId) => {
    const bookings = await getMyBookings(learnerId);

    return bookings.filter(
        (booking) =>
            booking.status === "CONFIRMED" ||
            booking.status === "COMPLETED"
    );
};

export const getUpcomingBookings = async (learnerId) => {
    const bookings = await getMyBookings(learnerId);

    return bookings.filter(
        (booking) =>
            booking.status === "CONFIRMED"
    );
};

export const getUpcomingSessions = async (learnerId) => {
    return getUpcomingBookings(learnerId);
};

export const getCompletedBookings = async (learnerId) => {
    const bookings = await getMyBookings(learnerId);

    return bookings.filter(
        (booking) =>
            booking.status === "COMPLETED"
    );
};

export const getCompletedSessions = async (learnerId) => {
    return getCompletedBookings(learnerId);
};

export const getCancelledBookings = async (learnerId) => {
    const bookings = await getMyBookings(learnerId);

    return bookings.filter(
        (booking) =>
            booking.status === "CANCELLED"
    );
};

export const getCancelledSessions = async (learnerId) => {
    return getCancelledBookings(learnerId);
};

export const getExpertBookings = async (expertId) => {
    if (!expertId) {
        throw new Error("Expert ID is required");
    }

    const response = await authApi.get(
        `${BOOKINGS_API}/expert/${expertId}`
    );

    return response.data;
};

export const getExpertAvailability = async (expertId) => {
    if (!expertId) {
        throw new Error("Expert ID is required");
    }

    const response = await authApi.get(
        `${EXPERT_AVAILABILITY_API}/expert/${expertId}/active`
    );

    return response.data;
};

export const getActiveExpertAvailability = async (expertId) => {
    return getExpertAvailability(expertId);
};

export const getAvailableSlots = async (
    expertId,
    bookingDate,
    duration = 30
) => {
    if (!expertId) {
        throw new Error("Expert ID is required");
    }

    if (!bookingDate) {
        throw new Error("Booking date is required");
    }

    const availability =
        await getExpertAvailability(expertId);

    const bookings =
        await getExpertBookings(expertId);

    const dayName =
        getDayName(bookingDate);

    if (!dayName) {
        return [];
    }

    const dayAvailability =
        availability.filter(
            (slot) =>
                slot.active !== false &&
                String(slot.dayOfWeek).toUpperCase() ===
                    dayName
        );

    if (dayAvailability.length === 0) {
        return [];
    }

    const activeBookings =
        bookings.filter(
            (booking) =>
                booking.bookingDate === bookingDate &&
                ACTIVE_BOOKING_STATUSES.includes(
                    booking.status
                )
        );

    const slots = [];

    dayAvailability.forEach(
        (availabilitySlot) => {
            const availabilityStart =
                timeToMinutes(
                    availabilitySlot.startTime
                );

            const availabilityEnd =
                timeToMinutes(
                    availabilitySlot.endTime
                );

            let currentTime =
                availabilityStart;

            while (
                currentTime + duration <=
                availabilityEnd
            ) {
                const slotStart =
                    currentTime;

                const slotEnd =
                    currentTime + duration;

                const hasConflict =
                    activeBookings.some(
                        (booking) => {
                            const bookingStart =
                                timeToMinutes(
                                    booking.startTime
                                );

                            const bookingEnd =
                                timeToMinutes(
                                    booking.endTime
                                );

                            return (
                                slotStart <
                                    bookingEnd &&
                                slotEnd >
                                    bookingStart
                            );
                        }
                    );

                if (!hasConflict) {
                    slots.push({
                        startTime:
                            minutesToTime(
                                slotStart
                            ),
                        endTime:
                            minutesToTime(
                                slotEnd
                            )
                    });
                }

                currentTime += duration;
            }
        }
    );

    const uniqueSlots = [];
    const seen = new Set();

    slots.forEach((slot) => {
        const key =
            `${slot.startTime}-${slot.endTime}`;

        if (!seen.has(key)) {
            seen.add(key);
            uniqueSlots.push(slot);
        }
    });

    return uniqueSlots.sort(
        (a, b) =>
            timeToMinutes(a.startTime) -
            timeToMinutes(b.startTime)
    );
};

export const getAvailableSlotsForDate = async (
    expertId,
    bookingDate,
    duration = 30
) => {
    return getAvailableSlots(
        expertId,
        bookingDate,
        duration
    );
};

export const createBooking = async (bookingData) => {
    if (!bookingData) {
        throw new Error("Booking data is required");
    }

    const response = await authApi.post(
        BOOKINGS_API,
        bookingData
    );

    return response.data;
};

export const cancelBooking = async (bookingId) => {
    if (!bookingId) {
        throw new Error("Booking ID is required");
    }

    const response = await authApi.patch(
        `${BOOKINGS_API}/${bookingId}/cancel`
    );

    return response.data;
};

export const createPayment = async (paymentData) => {
    if (!paymentData) {
        throw new Error("Payment data is required");
    }

    const response = await authApi.post(
        PAYMENTS_API,
        paymentData
    );

    return response.data;
};

export const createPaymentOrder = async (
    paymentData
) => {
    if (!paymentData) {
        throw new Error("Payment data is required");
    }

    const response = await authApi.post(
        `${PAYMENTS_API}/razorpay/order`,
        paymentData
    );

    return response.data;
};

export const createRazorpayOrder = async (
    paymentData
) => {
    return createPaymentOrder(paymentData);
};

export const verifyPayment = async (
    paymentData
) => {
    if (!paymentData) {
        throw new Error(
            "Payment verification data is required"
        );
    }

    const response = await authApi.post(
        `${PAYMENTS_API}/razorpay/verify`,
        paymentData
    );

    return response.data;
};

export const verifyRazorpayPayment = async (
    paymentData
) => {
    return verifyPayment(paymentData);
};

export const getPaymentByBookingId = async (
    bookingId
) => {
    if (!bookingId) {
        throw new Error("Booking ID is required");
    }

    const response = await authApi.get(
        `${PAYMENTS_API}/booking/${bookingId}`
    );

    return response.data;
};

export const getPaymentById = async (
    paymentId
) => {
    if (!paymentId) {
        throw new Error("Payment ID is required");
    }

    const response = await authApi.get(
        `${PAYMENTS_API}/${paymentId}`
    );

    return response.data;
};

export const markPaymentSuccess = async (
    paymentId
) => {
    if (!paymentId) {
        throw new Error("Payment ID is required");
    }

    const response = await authApi.patch(
        `${PAYMENTS_API}/${paymentId}/success`
    );

    return response.data;
};

export const markPaymentFailed = async (
    paymentId
) => {
    if (!paymentId) {
        throw new Error("Payment ID is required");
    }

    const response = await authApi.patch(
        `${PAYMENTS_API}/${paymentId}/failed`
    );

    return response.data;
};

export const getBookingsForDate = async (
    expertId,
    bookingDate
) => {
    const bookings =
        await getExpertBookings(expertId);

    return bookings.filter(
        (booking) =>
            booking.bookingDate === bookingDate
    );
};

export const isSlotAvailable = async (
    expertId,
    bookingDate,
    startTime,
    endTime
) => {
    const bookings =
        await getBookingsForDate(
            expertId,
            bookingDate
        );

    const activeBookings =
        bookings.filter(
            (booking) =>
                ACTIVE_BOOKING_STATUSES.includes(
                    booking.status
                )
        );

    const requestedStart =
        timeToMinutes(startTime);

    const requestedEnd =
        timeToMinutes(endTime);

    const hasConflict =
        activeBookings.some(
            (booking) => {
                const bookingStart =
                    timeToMinutes(
                        booking.startTime
                    );

                const bookingEnd =
                    timeToMinutes(
                        booking.endTime
                    );

                return (
                    requestedStart <
                        bookingEnd &&
                    requestedEnd >
                        bookingStart
                );
            }
        );

    return !hasConflict;
};

export const checkExpertAvailability = async (
    expertId,
    bookingDate,
    startTime,
    endTime
) => {
    if (
        !expertId ||
        !bookingDate ||
        !startTime ||
        !endTime
    ) {
        return false;
    }

    const availability =
        await getExpertAvailability(
            expertId
        );

    const dayName =
        getDayName(bookingDate);

    const requestedStart =
        timeToMinutes(startTime);

    const requestedEnd =
        timeToMinutes(endTime);

    const insideAvailability =
        availability.some(
            (slot) => {
                if (
                    slot.active === false ||
                    String(
                        slot.dayOfWeek
                    ).toUpperCase() !==
                        dayName
                ) {
                    return false;
                }

                const slotStart =
                    timeToMinutes(
                        slot.startTime
                    );

                const slotEnd =
                    timeToMinutes(
                        slot.endTime
                    );

                return (
                    requestedStart >=
                        slotStart &&
                    requestedEnd <=
                        slotEnd
                );
            }
        );

    if (!insideAvailability) {
        return false;
    }

    return isSlotAvailable(
        expertId,
        bookingDate,
        startTime,
        endTime
    );
};

export const getAvailableDates = async (
    expertId,
    days = 30
) => {
    if (!expertId) {
        throw new Error("Expert ID is required");
    }

    const availability =
        await getExpertAvailability(
            expertId
        );

    const activeAvailability =
        availability.filter(
            (slot) =>
                slot.active !== false
        );

    const availableDayNames =
        new Set(
            activeAvailability.map(
                (slot) =>
                    String(
                        slot.dayOfWeek
                    ).toUpperCase()
            )
        );

    const dates = [];
    const today = new Date();

    for (
        let index = 0;
        index < days;
        index++
    ) {
        const date = new Date(today);

        date.setDate(
            today.getDate() + index
        );

        const year =
            date.getFullYear();

        const month =
            pad(date.getMonth() + 1);

        const day =
            pad(date.getDate());

        const dateString =
            `${year}-${month}-${day}`;

        const dayName =
            getDayName(dateString);

        if (
            availableDayNames.has(dayName)
        ) {
            const slots =
                await getAvailableSlots(
                    expertId,
                    dateString,
                    30
                );

            if (slots.length > 0) {
                dates.push(dateString);
            }
        }
    }

    return dates;
};

export const createSessionNotification = (
    booking
) => {
    if (!booking?.id) {
        return null;
    }

    const notification = {
        id: `booking-${booking.id}`,
        type: "SESSION_CONFIRMED",
        title: "Session confirmed",
        message: `Your session with ${
            booking.expertName || "your expert"
        } has been confirmed.`,
        bookingId: booking.id,
        expertName:
            booking.expertName || "",
        bookingDate:
            booking.bookingDate || "",
        startTime:
            booking.startTime || "",
        endTime:
            booking.endTime || "",
        read: false,
        createdAt:
            new Date().toISOString()
    };

    const existing =
        JSON.parse(
            localStorage.getItem(
                "ascendra_notifications"
            ) || "[]"
        );

    const alreadyExists =
        existing.some(
            (item) =>
                item.id === notification.id
        );

    if (!alreadyExists) {
        localStorage.setItem(
            "ascendra_notifications",
            JSON.stringify([
                notification,
                ...existing
            ])
        );
    }

    return notification;
};

export const getNotifications = () => {
    try {
        return JSON.parse(
            localStorage.getItem(
                "ascendra_notifications"
            ) || "[]"
        );
    } catch {
        return [];
    }
};

export const getUnreadNotificationCount = () => {
    return getNotifications().filter(
        (notification) =>
            !notification.read
    ).length;
};

export const markNotificationAsRead = (
    notificationId
) => {
    const notifications =
        getNotifications().map(
            (notification) =>
                notification.id ===
                notificationId
                    ? {
                          ...notification,
                          read: true
                      }
                    : notification
        );

    localStorage.setItem(
        "ascendra_notifications",
        JSON.stringify(
            notifications
        )
    );

    return notifications;
};

export const markAllNotificationsAsRead =
    () => {
        const notifications =
            getNotifications().map(
                (notification) => ({
                    ...notification,
                    read: true
                })
            );

        localStorage.setItem(
            "ascendra_notifications",
            JSON.stringify(
                notifications
            )
        );

        return notifications;
    };

export const clearNotifications = () => {
    localStorage.removeItem(
        "ascendra_notifications"
    );
};