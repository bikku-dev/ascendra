import React, {
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";

import {
    ArrowRight,
    CalendarDays,
    CheckCheck,
    MessageCircle,
    MoreHorizontal,
    RefreshCw,
    Search,
    Send,
    Wifi,
    WifiOff
} from "lucide-react";

import "./MessagesView.css";

import {
    getChatHistory,
    createChatClient,
    sendChatMessage,
    disconnectChat
} from "../../service/chatService";

function MessagesView({
    sessions,
    user
}) {
    const [experts, setExperts] =
        useState([]);

    const [selectedExpert, setSelectedExpert] =
        useState(null);

    const [messages, setMessages] =
        useState([]);

    const [messageText, setMessageText] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [historyLoading, setHistoryLoading] =
        useState(false);

    const [sending, setSending] =
        useState(false);

    const [connected, setConnected] =
        useState(false);

    const [connecting, setConnecting] =
        useState(false);

    const [error, setError] =
        useState("");

    const [searchText, setSearchText] =
        useState("");

    const clientRef =
        useRef(null);

    const messagesEndRef =
        useRef(null);

    const selectedExpertRef =
        useRef(null);

    const mountedRef =
        useRef(true);

    const storedUserId =
        user?.id ??
        user?.userId ??
        user?.user_id ??
        user?.user?.id ??
        user?.user?.userId;

    useEffect(() => {
        selectedExpertRef.current =
            selectedExpert;
    }, [selectedExpert]);

    useEffect(() => {
        return () => {
            mountedRef.current =
                false;
        };
    }, []);

    const getExpertUserId = useCallback(
        booking => {
            return (
                booking?.expertUserId ??
                booking?.expert?.userId ??
                booking?.expert?.user?.id ??
                booking?.expert?.user?.userId ??
                booking?.expertId ??
                booking?.expert?.id ??
                null
            );
        },
        []
    );

    const getExpertName = useCallback(
        booking => {
            return (
                booking?.expertName ||
                booking?.expert?.name ||
                booking?.expert?.fullName ||
                booking?.expert?.user?.name ||
                booking?.expert?.user?.fullName ||
                "Expert"
            );
        },
        []
    );

    const getProfessionalTitle =
        useCallback(
            booking => {
                return (
                    booking?.professionalTitle ||
                    booking?.expert?.professionalTitle ||
                    booking?.expert?.professional_title ||
                    booking?.expert?.title ||
                    booking?.expert?.user?.professionalTitle ||
                    "Mentor"
                );
            },
            []
        );

    const getBookingDate =
        useCallback(
            booking => {
                return (
                    booking?.bookingDate ||
                    booking?.date ||
                    ""
                );
            },
            []
        );

    const getBookingStartTime =
        useCallback(
            booking => {
                return (
                    booking?.startTime ||
                    ""
                );
            },
            []
        );

    useEffect(() => {
        const confirmedBookings =
            (
                Array.isArray(
                    sessions
                )
                    ? sessions
                    : []
            ).filter(
                booking =>
                    String(
                        booking?.status ||
                        ""
                    ).toUpperCase() ===
                    "CONFIRMED"
            );

        const expertMap =
            new Map();

        confirmedBookings.forEach(
            booking => {
                const expertUserId =
                    getExpertUserId(
                        booking
                    );

                if (
                    !expertUserId ||
                    !booking?.id
                ) {
                    return;
                }

                const key =
                    String(
                        expertUserId
                    );

                const current =
                    expertMap.get(
                        key
                    );

                const bookingDate =
                    getBookingDate(
                        booking
                    );

                if (!current) {
                    expertMap.set(
                        key,
                        {
                            expertUserId,
                            expertId:
                                booking?.expertId ??
                                booking?.expert?.id ??
                                null,
                            expertName:
                                getExpertName(
                                    booking
                                ),
                            professionalTitle:
                                getProfessionalTitle(
                                    booking
                                ),
                            bookingId:
                                booking.id,
                            bookingDate,
                            startTime:
                                getBookingStartTime(
                                    booking
                                ),
                            endTime:
                                booking?.endTime ||
                                ""
                        }
                    );

                    return;
                }

                const currentDate =
                    String(
                        current.bookingDate ||
                        ""
                    );

                const nextDate =
                    String(
                        bookingDate ||
                        ""
                    );

                if (
                    nextDate >
                    currentDate
                ) {
                    expertMap.set(
                        key,
                        {
                            ...current,
                            expertName:
                                getExpertName(
                                    booking
                                ),
                            professionalTitle:
                                getProfessionalTitle(
                                    booking
                                ),
                            bookingId:
                                booking.id,
                            bookingDate:
                                bookingDate,
                            startTime:
                                getBookingStartTime(
                                    booking
                                ),
                            endTime:
                                booking?.endTime ||
                                ""
                        }
                    );
                }
            }
        );

        const expertList =
            Array.from(
                expertMap.values()
            );

        setExperts(
            expertList
        );

        setSelectedExpert(
            previous => {
                if (
                    previous
                ) {
                    const matchingExpert =
                        expertList.find(
                            expert =>
                                String(
                                    expert.expertUserId
                                ) ===
                                String(
                                    previous.expertUserId
                                )
                        );

                    if (
                        matchingExpert
                    ) {
                        return matchingExpert;
                    }
                }

                return (
                    expertList[0] ||
                    null
                );
            }
        );

        setLoading(
            false
        );
    }, [
        sessions,
        getBookingDate,
        getBookingStartTime,
        getExpertName,
        getExpertUserId,
        getProfessionalTitle
    ]);

    const connectChat =
        useCallback(() => {
            if (
                !storedUserId
            ) {
                setConnected(
                    false
                );

                setConnecting(
                    false
                );

                setError(
                    "User information is not available. Please sign in again."
                );

                return;
            }

            if (
                clientRef.current
            ) {
                try {
                    disconnectChat(
                        clientRef.current
                    );
                } catch (
                    disconnectError
                ) {
                    console.error(
                        "Previous chat disconnect error:",
                        disconnectError
                    );
                }

                clientRef.current =
                    null;
            }

            setConnected(
                false
            );

            setConnecting(
                true
            );

            setError("");

            try {
                const client =
                    createChatClient({
                        userId:
                            storedUserId,

                        onMessage:
                            incomingMessage => {
                                if (
                                    !mountedRef.current
                                ) {
                                    return;
                                }

                                const activeExpert =
                                    selectedExpertRef.current;

                                if (
                                    !activeExpert
                                ) {
                                    return;
                                }

                                const incomingBookingId =
                                    incomingMessage?.bookingId;

                                const activeBookingId =
                                    activeExpert?.bookingId;

                                if (
                                    incomingBookingId &&
                                    activeBookingId &&
                                    String(
                                        incomingBookingId
                                    ) !==
                                        String(
                                            activeBookingId
                                        )
                                ) {
                                    return;
                                }

                                const senderId =
                                    incomingMessage?.senderId;

                                const receiverId =
                                    incomingMessage?.receiverId;

                                const currentUserId =
                                    String(
                                        storedUserId
                                    );

                                const senderMatches =
                                    String(
                                        senderId
                                    ) ===
                                    currentUserId;

                                const receiverMatches =
                                    String(
                                        receiverId
                                    ) ===
                                    currentUserId;

                                if (
                                    !senderMatches &&
                                    !receiverMatches
                                ) {
                                    return;
                                }

                                setMessages(
                                    previous => {
                                        const incomingId =
                                            incomingMessage?.id;

                                        if (
                                            incomingId &&
                                            previous.some(
                                                item =>
                                                    String(
                                                        item?.id
                                                    ) ===
                                                    String(
                                                        incomingId
                                                    )
                                            )
                                        ) {
                                            return previous;
                                        }

                                        return [
                                            ...previous,
                                            incomingMessage
                                        ];
                                    }
                                );
                            },

                        onConnect:
                            () => {
                                if (
                                    !mountedRef.current
                                ) {
                                    return;
                                }

                                setConnected(
                                    true
                                );

                                setConnecting(
                                    false
                                );

                                setError("");
                            },

                        onError:
                            chatError => {
                                if (
                                    !mountedRef.current
                                ) {
                                    return;
                                }

                                console.error(
                                    "Chat connection error:",
                                    chatError
                                );

                                setConnected(
                                    false
                                );

                                setConnecting(
                                    false
                                );

                                setError(
                                    chatError?.message ||
                                    "Unable to connect to chat server."
                                );
                            },

                        onDisconnect:
                            () => {
                                if (
                                    !mountedRef.current
                                ) {
                                    return;
                                }

                                setConnected(
                                    false
                                );

                                setConnecting(
                                    false
                                );
                            }
                    });

                clientRef.current =
                    client;
            } catch (
                chatError
            ) {
                console.error(
                    "Chat client creation error:",
                    chatError
                );

                setConnected(
                    false
                );

                setConnecting(
                    false
                );

                setError(
                    chatError?.message ||
                    "Unable to start chat connection."
                );
            }
        }, [
            storedUserId
        ]);

    useEffect(() => {
        connectChat();

        return () => {
            if (
                clientRef.current
            ) {
                disconnectChat(
                    clientRef.current
                );

                clientRef.current =
                    null;
            }
        };
    }, [
        connectChat
    ]);

    useEffect(() => {
        if (
            !selectedExpert?.bookingId
        ) {
            setMessages([]);
            return;
        }

        let cancelled =
            false;

        const loadHistory =
            async () => {
                try {
                    setHistoryLoading(
                        true
                    );

                    setError("");

                    const history =
                        await getChatHistory(
                            selectedExpert.bookingId
                        );

                    if (
                        cancelled ||
                        !mountedRef.current
                    ) {
                        return;
                    }

                    const historyData =
                        Array.isArray(
                            history
                        )
                            ? history
                            : [];

                    setMessages(
                        historyData
                    );
                } catch (
                    historyError
                ) {
                    if (
                        cancelled ||
                        !mountedRef.current
                    ) {
                        return;
                    }

                    console.error(
                        "Chat history error:",
                        historyError
                    );

                    setMessages(
                        []
                    );

                    setError(
                        historyError?.response?.data?.message ||
                        historyError?.response?.data?.error ||
                        historyError?.message ||
                        "Unable to load chat history."
                    );
                } finally {
                    if (
                        !cancelled &&
                        mountedRef.current
                    ) {
                        setHistoryLoading(
                            false
                        );
                    }
                }
            };

        loadHistory();

        return () => {
            cancelled =
                true;
        };
    }, [
        selectedExpert?.bookingId
    ]);

    useEffect(() => {
        if (
            !messagesEndRef.current
        ) {
            return;
        }

        messagesEndRef.current.scrollIntoView({
            behavior:
                messages.length > 1
                    ? "smooth"
                    : "auto",
            block: "end"
        });
    }, [
        messages,
        selectedExpert?.bookingId
    ]);

    const handleSelectExpert =
        expert => {
            setSelectedExpert(
                expert
            );

            selectedExpertRef.current =
                expert;

            setMessages(
                []
            );

            setMessageText(
                ""
            );

            setError(
                ""
            );
        };

    const handleSend =
        event => {
            event.preventDefault();

            const text =
                messageText.trim();

            if (
                !text
            ) {
                return;
            }

            if (
                !selectedExpert
            ) {
                setError(
                    "Please select an expert first."
                );

                return;
            }

            if (
                !storedUserId
            ) {
                setError(
                    "Your user session is not available."
                );

                return;
            }

            if (
                !clientRef.current ||
                !clientRef.current.connected
            ) {
                setError(
                    "Chat is still connecting. Your message is ready — please try Send again when the connection is live."
                );

                return;
            }

            if (
                !selectedExpert.expertUserId
            ) {
                setError(
                    "Expert user ID is not available for this booking."
                );

                return;
            }

            try {
                setSending(
                    true
                );

                sendChatMessage(
                    clientRef.current,
                    {
                        bookingId:
                            Number(
                                selectedExpert.bookingId
                            ),
                        senderId:
                            Number(
                                storedUserId
                            ),
                        receiverId:
                            Number(
                                selectedExpert.expertUserId
                            ),
                        message:
                            text
                    }
                );

                setMessageText(
                    ""
                );

                setError(
                    ""
                );
            } catch (
                sendError
            ) {
                console.error(
                    "Send message error:",
                    sendError
                );

                setError(
                    sendError?.message ||
                    "Unable to send message."
                );
            } finally {
                setSending(
                    false
                );
            }
        };

    const handleComposerKeyDown =
        event => {
            if (
                event.key ===
                    "Enter" &&
                !event.shiftKey
            ) {
                event.preventDefault();

                if (
                    messageText.trim()
                ) {
                    handleSend(
                        event
                    );
                }
            }
        };

    const formatDate =
        value => {
            if (
                !value
            ) {
                return "Date unavailable";
            }

            const text =
                String(
                    value
                ).slice(
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
                return text;
            }

            return date.toLocaleDateString(
                "en-IN",
                {
                    day:
                        "numeric",
                    month:
                        "short",
                    year:
                        "numeric"
                }
            );
        };

    const formatTime =
        value => {
            if (
                !value
            ) {
                return "";
            }

            const match =
                String(
                    value
                ).match(
                    /^(\d{1,2}):(\d{2})/
                );

            if (
                !match
            ) {
                return String(
                    value
                );
            }

            const hour =
                Number(
                    match[1]
                );

            const minute =
                match[2];

            return `${hour % 12 || 12}:${minute} ${
                hour >= 12
                    ? "PM"
                    : "AM"
            }`;
        };

    const formatMessageTime =
        value => {
            if (
                !value
            ) {
                return "";
            }

            const date =
                new Date(
                    value
                );

            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {
                return "";
            }

            return date.toLocaleTimeString(
                "en-IN",
                {
                    hour:
                        "numeric",
                    minute:
                        "2-digit"
                }
            );
        };

    const filteredExperts =
        experts.filter(
            expert => {
                const query =
                    searchText
                        .trim()
                        .toLowerCase();

                if (
                    !query
                ) {
                    return true;
                }

                return (
                    expert?.expertName
                        ?.toLowerCase()
                        .includes(
                            query
                        ) ||
                    expert?.professionalTitle
                        ?.toLowerCase()
                        .includes(
                            query
                        )
                );
            }
        );

    if (
        loading
    ) {
        return (
            <div className="inner-page messages-page">
                <section className="page-heading messages-heading">
                    <div>
                        <span className="eyebrow">
                            <span className="eyebrow-dot" />
                            MESSAGES
                        </span>

                        <h1>
                            Your conversations
                        </h1>

                        <p>
                            Loading your booked experts...
                        </p>
                    </div>
                </section>

                <div className="messages-loading-screen">
                    <div className="messages-loading-spinner" />

                    <span>
                        Loading conversations...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="inner-page messages-page">
            <section className="page-heading messages-heading">
                <div className="messages-heading-copy">
                    <span className="eyebrow">
                        <span className="eyebrow-dot" />
                        MESSAGES
                    </span>

                    <h1>
                        Talk to your experts
                    </h1>

                    <p>
                        Stay connected with the experts
                        you have booked mentoring sessions with.
                    </p>
                </div>

                <div
                    className={`chat-connection-status ${
                        connected
                            ? "connected"
                            : "disconnected"
                    }`}
                >
                    {connected ? (
                        <Wifi
                            size={14}
                        />
                    ) : (
                        <WifiOff
                            size={14}
                        />
                    )}

                    <span>
                        {connected
                            ? "Live connection"
                            : connecting
                            ? "Connecting..."
                            : "Offline"}
                    </span>

                    {!connected &&
                        !connecting && (
                            <button
                                type="button"
                                className="chat-retry-button"
                                onClick={
                                    connectChat
                                }
                            >
                                <RefreshCw
                                    size={
                                        12
                                    }
                                />

                                Retry
                            </button>
                        )}
                </div>
            </section>

            {error && (
                <div className="chat-error">
                    <span>
                        {error}
                    </span>

                    {!connected &&
                        !connecting && (
                            <button
                                type="button"
                                className="chat-error-retry"
                                onClick={
                                    connectChat
                                }
                            >
                                Try again
                            </button>
                        )}
                </div>
            )}

            {experts.length ===
            0 ? (
                <div className="messages-empty-card">
                    <div className="messages-empty-icon">
                        <MessageCircle
                            size={27}
                        />
                    </div>

                    <h3>
                        No conversations yet
                    </h3>

                    <p>
                        Once you book and complete
                        payment for a mentoring session,
                        your expert will appear here.
                    </p>
                </div>
            ) : (
                <div className="messages-layout">
                    <aside className="messages-sidebar">
                        <div className="messages-sidebar-header">
                            <div className="messages-sidebar-heading">
                                <span>
                                    CONVERSATIONS
                                </span>

                                <strong>
                                    My Experts
                                </strong>
                            </div>

                            <div className="messages-count">
                                {experts.length}
                            </div>
                        </div>

                        <div className="messages-search">
                            <Search
                                size={15}
                            />

                            <input
                                type="text"
                                value={
                                    searchText
                                }
                                onChange={event =>
                                    setSearchText(
                                        event.target
                                            .value
                                    )
                                }
                                placeholder="Search experts..."
                            />
                        </div>

                        <div className="messages-expert-list">
                            {filteredExperts.length ===
                            0 ? (
                                <div className="messages-no-search">
                                    <Search
                                        size={20}
                                    />

                                    <span>
                                        No experts found
                                    </span>
                                </div>
                            ) : (
                                filteredExperts.map(
                                    expert => {
                                        const active =
                                            String(
                                                selectedExpert?.expertUserId
                                            ) ===
                                            String(
                                                expert.expertUserId
                                            );

                                        return (
                                            <button
                                                key={`${expert.expertUserId}-${expert.bookingId}`}
                                                type="button"
                                                className={`message-expert-item ${
                                                    active
                                                        ? "active"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    handleSelectExpert(
                                                        expert
                                                    )
                                                }
                                            >
                                                <div className="message-expert-avatar">
                                                    {String(
                                                        expert.expertName ||
                                                        "E"
                                                    )
                                                        .trim()
                                                        .charAt(
                                                            0
                                                        )
                                                        .toUpperCase()}
                                                </div>

                                                <div className="message-expert-copy">
                                                    <strong>
                                                        {
                                                            expert.expertName
                                                        }
                                                    </strong>

                                                    <span>
                                                        {
                                                            expert.professionalTitle
                                                        }
                                                    </span>

                                                    <small>
                                                        <CalendarDays
                                                            size={
                                                                11
                                                            }
                                                        />

                                                        {formatDate(
                                                            expert.bookingDate
                                                        )}

                                                        {expert.startTime &&
                                                            ` · ${formatTime(
                                                                expert.startTime
                                                            )}`}
                                                    </small>
                                                </div>

                                                <ArrowRight
                                                    className="message-expert-arrow"
                                                    size={
                                                        15
                                                    }
                                                />
                                            </button>
                                        );
                                    }
                                )
                            )}
                        </div>
                    </aside>

                    <section className="chat-panel">
                        {!selectedExpert ? (
                            <div className="chat-no-selection">
                                <div className="chat-empty-icon">
                                    <MessageCircle
                                        size={28}
                                    />
                                </div>

                                <h3>
                                    Select an expert
                                </h3>

                                <p>
                                    Choose an expert from
                                    your booked sessions to
                                    start chatting.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="chat-header">
                                    <div className="chat-person">
                                        <div className="chat-header-avatar">
                                            {String(
                                                selectedExpert.expertName ||
                                                "E"
                                            )
                                                .trim()
                                                .charAt(
                                                    0
                                                )
                                                .toUpperCase()}
                                        </div>

                                        <div className="chat-header-info">
                                            <strong>
                                                {
                                                    selectedExpert.expertName
                                                }
                                            </strong>

                                            <span>
                                                {
                                                    selectedExpert.professionalTitle
                                                }
                                            </span>

                                            <div className="chat-header-live">
                                                <span
                                                    className={
                                                        connected
                                                            ? "online"
                                                            : ""
                                                    }
                                                />

                                                {connected
                                                    ? "Available for chat"
                                                    : connecting
                                                    ? "Connecting to chat"
                                                    : "Chat unavailable"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="chat-header-right">
                                        <div className="chat-session-card">
                                            <CalendarDays
                                                size={
                                                    15
                                                }
                                            />

                                            <div>
                                                <span>
                                                    SESSION
                                                </span>

                                                <strong>
                                                    {formatDate(
                                                        selectedExpert.bookingDate
                                                    )}
                                                </strong>

                                                {selectedExpert.startTime && (
                                                    <small>
                                                        {formatTime(
                                                            selectedExpert.startTime
                                                        )}
                                                    </small>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            className="chat-more-button"
                                            aria-label="More options"
                                        >
                                            <MoreHorizontal
                                                size={
                                                    18
                                                }
                                            />
                                        </button>
                                    </div>
                                </div>

                                <div className="chat-session-banner">
                                    <div className="chat-session-banner-icon">
                                        <CheckCheck
                                            size={
                                                15
                                            }
                                        />
                                    </div>

                                    <div>
                                        <strong>
                                            Mentoring session
                                        </strong>

                                        <span>
                                            Discuss your goals,
                                            questions and session
                                            preparation with your expert.
                                        </span>
                                    </div>
                                </div>

                                <div className="chat-messages">
                                    {historyLoading ? (
                                        <div className="chat-loading">
                                            <div className="messages-loading-spinner" />

                                            <span>
                                                Loading conversation...
                                            </span>
                                        </div>
                                    ) : messages.length ===
                                      0 ? (
                                        <div className="chat-empty">
                                            <div className="chat-empty-icon">
                                                <MessageCircle
                                                    size={
                                                        25
                                                    }
                                                />
                                            </div>

                                            <h3>
                                                Start the conversation
                                            </h3>

                                            <p>
                                                Send a message to{" "}
                                                <strong>
                                                    {
                                                        selectedExpert.expertName
                                                    }
                                                </strong>{" "}
                                                about your mentoring
                                                session.
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="chat-date-divider">
                                                <span>
                                                    Conversation
                                                </span>
                                            </div>

                                            {messages.map(
                                                (
                                                    message,
                                                    index
                                                ) => {
                                                    const mine =
                                                        String(
                                                            message?.senderId
                                                        ) ===
                                                        String(
                                                            storedUserId
                                                        );

                                                    return (
                                                        <div
                                                            key={
                                                                message?.id ||
                                                                `${message?.sentAt}-${message?.message}-${index}`
                                                            }
                                                            className={`chat-message-row ${
                                                                mine
                                                                    ? "mine"
                                                                    : "theirs"
                                                            }`}
                                                        >
                                                            {!mine && (
                                                                <div className="chat-message-avatar">
                                                                    {String(
                                                                        selectedExpert.expertName ||
                                                                        "E"
                                                                    )
                                                                        .trim()
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase()}
                                                                </div>
                                                            )}

                                                            <div className="chat-message-content">
                                                                <div className="chat-message-bubble">
                                                                    <p>
                                                                        {
                                                                            message?.message
                                                                        }
                                                                    </p>
                                                                </div>

                                                                <div className="chat-message-meta">
                                                                    <span>
                                                                        {formatMessageTime(
                                                                            message?.sentAt
                                                                        )}
                                                                    </span>

                                                                    {mine && (
                                                                        <CheckCheck
                                                                            size={
                                                                                13
                                                                            }
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </>
                                    )}

                                    <div
                                        ref={
                                            messagesEndRef
                                        }
                                    />
                                </div>

                                <form
                                    className="chat-input-area"
                                    onSubmit={
                                        handleSend
                                    }
                                >
                                    <div className="chat-input-shell">
                                        <input
                                            type="text"
                                            value={
                                                messageText
                                            }
                                            onChange={event =>
                                                setMessageText(
                                                    event.target
                                                        .value
                                                )
                                            }
                                            onKeyDown={
                                                handleComposerKeyDown
                                            }
                                            placeholder={
                                                connected
                                                    ? "Write a message..."
                                                    : "Write your message while chat connects..."
                                            }
                                            disabled={
                                                sending
                                            }
                                            autoComplete="off"
                                        />

                                        <span className="chat-input-hint">
                                            Enter to send · Shift + Enter for new line
                                        </span>
                                    </div>

                                    <button
                                        type="submit"
                                        className="chat-send-button"
                                        disabled={
                                            !messageText.trim() ||
                                            !connected ||
                                            sending
                                        }
                                        aria-label="Send message"
                                    >
                                        {sending ? (
                                            <div className="chat-send-loader" />
                                        ) : (
                                            <Send
                                                size={
                                                    17
                                                }
                                            />
                                        )}
                                    </button>
                                </form>
                            </>
                        )}
                    </section>
                </div>
            )}
        </div>
    );
}

export default MessagesView;