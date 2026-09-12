import { Client } from "@stomp/stompjs";

import { authApi } from "./authService";

const CHAT_API = "/api/chat";

const WS_PATH = "/ws";

const getWebSocketUrl = () => {
    const baseURL =
        authApi?.defaults?.baseURL ||
        window.location.origin;

    let normalized = String(baseURL)
        .trim()
        .replace(/\/+$/, "");

    if (
        normalized.startsWith("https://")
    ) {
        normalized =
            "wss://" +
            normalized.slice(8);
    } else if (
        normalized.startsWith("http://")
    ) {
        normalized =
            "ws://" +
            normalized.slice(7);
    } else if (
        normalized.startsWith("//")
    ) {
        normalized =
            window.location.protocol ===
            "https:"
                ? "wss:" + normalized
                : "ws:" + normalized;
    } else if (
        normalized.startsWith("/")
    ) {
        normalized =
            window.location.protocol ===
            "https:"
                ? "wss://" +
                  window.location.host +
                  normalized
                : "ws://" +
                  window.location.host +
                  normalized;
    } else {
        normalized =
            "ws://" +
            normalized;
    }

    return `${normalized}${WS_PATH}`;
};

export const getChatHistory = async (
    bookingId
) => {
    if (!bookingId) {
        throw new Error(
            "Booking ID is required"
        );
    }

    const response =
        await authApi.get(
            `${CHAT_API}/booking/${bookingId}`
        );

    return Array.isArray(
        response.data
    )
        ? response.data
        : [];
};

export const createChatClient = ({
    userId,
    onMessage,
    onConnect,
    onError,
    onDisconnect
}) => {
    if (!userId) {
        throw new Error(
            "User ID is required"
        );
    }

    const websocketUrl =
        getWebSocketUrl();

    console.log(
        "Chat WebSocket URL:",
        websocketUrl
    );

    const client =
        new Client({
            brokerURL:
                websocketUrl,

            reconnectDelay: 5000,

            heartbeatIncoming: 10000,

            heartbeatOutgoing: 10000,

            connectionTimeout: 10000,

            debug: () => {}
        });

    client.onConnect = () => {
        console.log(
            "Chat WebSocket connected"
        );

        try {
            client.subscribe(
                `/topic/chat/${userId}`,
                frame => {
                    try {
                        const message =
                            JSON.parse(
                                frame.body
                            );

                        if (
                            onMessage
                        ) {
                            onMessage(
                                message
                            );
                        }
                    } catch (
                        error
                    ) {
                        console.error(
                            "Chat message parse error:",
                            error
                        );

                        if (
                            onError
                        ) {
                            onError(
                                error
                            );
                        }
                    }
                }
            );

            if (
                onConnect
            ) {
                onConnect();
            }
        } catch (
            error
        ) {
            console.error(
                "Chat subscription error:",
                error
            );

            if (
                onError
            ) {
                onError(
                    error
                );
            }
        }
    };

    client.onStompError =
        frame => {
            console.error(
                "STOMP error:",
                frame?.headers?.message ||
                    "Unknown STOMP error"
            );

            console.error(
                "STOMP details:",
                frame?.body
            );

            if (
                onError
            ) {
                onError(
                    new Error(
                        frame?.headers
                            ?.message ||
                        "STOMP connection error"
                    )
                );
            }
        };

    client.onWebSocketError =
        event => {
            console.error(
                "WebSocket error:",
                event
            );

            if (
                onError
            ) {
                onError(
                    new Error(
                        "Unable to connect to chat server."
                    )
                );
            }
        };

    client.onWebSocketClose =
        event => {
            console.warn(
                "Chat WebSocket closed:",
                event?.code,
                event?.reason
            );

            if (
                onDisconnect
            ) {
                onDisconnect(
                    event
                );
            }
        };

    client.onDisconnect =
        () => {
            console.log(
                "Chat STOMP disconnected"
            );

            if (
                onDisconnect
            ) {
                onDisconnect();
            }
        };

    client.activate();

    return client;
};

export const sendChatMessage = (
    client,
    {
        bookingId,
        senderId,
        receiverId,
        message
    }
) => {
    if (!client) {
        throw new Error(
            "Chat connection is not available"
        );
    }

    if (
        !client.connected
    ) {
        throw new Error(
            "Chat connection is not ready"
        );
    }

    if (!bookingId) {
        throw new Error(
            "Booking ID is required"
        );
    }

    if (!senderId) {
        throw new Error(
            "Sender ID is required"
        );
    }

    if (!receiverId) {
        throw new Error(
            "Receiver ID is required"
        );
    }

    const cleanMessage =
        String(
            message || ""
        ).trim();

    if (!cleanMessage) {
        return;
    }

    const payload = {
        bookingId:
            Number(
                bookingId
            ),

        senderId:
            Number(
                senderId
            ),

        receiverId:
            Number(
                receiverId
            ),

        message:
            cleanMessage
    };

    client.publish({
        destination:
            "/app/chat",

        body:
            JSON.stringify(
                payload
            )
    });
};

export const disconnectChat =
    client => {
        if (!client) {
            return;
        }

        try {
            if (
                client.active
            ) {
                client.deactivate();
            }
        } catch (
            error
        ) {
            console.error(
                "Chat disconnect error:",
                error
            );
        }
    };