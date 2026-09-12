import axios from "axios";

const API_URL = "http://localhost:8080";

const TOKEN_KEY = "ascendra_token";
const USER_KEY = "ascendra_user";

const decodeJwt = (token) => {
    try {
        if (!token || typeof token !== "string") {
            return null;
        }

        const parts = token.split(".");

        if (parts.length !== 3) {
            return null;
        }

        const base64Payload = parts[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const paddedPayload =
            base64Payload +
            "=".repeat(
                (4 - (base64Payload.length % 4)) % 4
            );

        return JSON.parse(
            atob(paddedPayload)
        );
    } catch {
        return null;
    }
};

const createUserFromToken = (token) => {
    const payload = decodeJwt(token);

    if (!payload) {
        return null;
    }

    return {
        id:
            payload.id ??
            payload.userId ??
            payload.user_id ??
            payload.sub ??
            null,

        name:
            payload.name ??
            payload.username ??
            payload.fullName ??
            payload.full_name ??
            "Learner",

        email:
            payload.email ??
            payload.mail ??
            "",

        role:
            payload.role ??
            payload.authorities?.[0]?.authority ??
            "LEARNER",

        profilePicture:
            payload.profilePicture ??
            payload.profile_picture ??
            payload.picture ??
            null
    };
};

const normalizeUser = (
    userData,
    fallbackEmail = ""
) => {
    if (!userData) {
        return null;
    }

    return {
        id:
            userData.id ??
            userData.userId ??
            userData.user_id ??
            null,

        name:
            userData.name ??
            userData.username ??
            userData.fullName ??
            userData.full_name ??
            "Learner",

        email:
            userData.email ??
            userData.mail ??
            fallbackEmail,

        role:
            userData.role ??
            userData.authorities?.[0]?.authority ??
            "LEARNER",

        profilePicture:
            userData.profilePicture ??
            userData.profile_picture ??
            userData.picture ??
            null
    };
};

const saveAuthData = (
    token,
    userData = null
) => {
    if (!token) {
        throw new Error(
            "Authentication token is missing."
        );
    }

    localStorage.setItem(
        TOKEN_KEY,
        token
    );

    localStorage.removeItem("accessToken");
    localStorage.removeItem("token");

    let user = normalizeUser(userData);

    if (!user) {
        user = createUserFromToken(token);
    }

    if (user) {
        localStorage.setItem(
            USER_KEY,
            JSON.stringify(user)
        );
    }

    return user;
};

export const saveToken = (token) => {
    return saveAuthData(token);
};

export const getToken = () => {
    const currentToken =
        localStorage.getItem(TOKEN_KEY);

    if (currentToken) {
        return currentToken;
    }

    const oldAccessToken =
        localStorage.getItem("accessToken");

    if (oldAccessToken) {
        localStorage.setItem(
            TOKEN_KEY,
            oldAccessToken
        );

        localStorage.removeItem(
            "accessToken"
        );

        return oldAccessToken;
    }

    const oldToken =
        localStorage.getItem("token");

    if (oldToken) {
        localStorage.setItem(
            TOKEN_KEY,
            oldToken
        );

        localStorage.removeItem(
            "token"
        );

        return oldToken;
    }

    return null;
};

export const getUser = () => {
    const storedUser =
        localStorage.getItem(USER_KEY);

    if (storedUser) {
        try {
            return JSON.parse(storedUser);
        } catch {
            localStorage.removeItem(USER_KEY);
        }
    }

    const token = getToken();

    if (!token) {
        return null;
    }

    const user =
        createUserFromToken(token);

    if (user) {
        localStorage.setItem(
            USER_KEY,
            JSON.stringify(user)
        );
    }

    return user;
};

export const isAuthenticated = () => {
    const token = getToken();

    if (!token) {
        return false;
    }

    const payload =
        decodeJwt(token);

    if (!payload) {
        return false;
    }

    if (payload.exp) {
        return (
            payload.exp * 1000 >
            Date.now()
        );
    }

    return true;
};

export const removeToken = () => {
    localStorage.removeItem(
        TOKEN_KEY
    );

    localStorage.removeItem(
        USER_KEY
    );

    localStorage.removeItem(
        "accessToken"
    );

    localStorage.removeItem(
        "token"
    );
};

export const loginUser = async (
    email,
    password
) => {
    try {
        const cleanEmail =
            email.trim().toLowerCase();

        const response =
            await axios.post(
                `${API_URL}/api/auth/login`,
                {
                    email: cleanEmail,
                    password
                }
            );

        const token =
            response.data?.accessToken ??
            response.data?.token ??
            response.data?.jwt;

        if (!token) {
            throw new Error(
                "Authentication token not received from server."
            );
        }

        const userData = {
            id:
                response.data?.userId ??
                response.data?.id ??
                response.data?.user?.id ??
                response.data?.user?.userId ??
                null,

            name:
                response.data?.name ??
                response.data?.username ??
                response.data?.user?.name ??
                "Learner",

            email:
                response.data?.email ??
                response.data?.user?.email ??
                cleanEmail,

            role:
                response.data?.role ??
                response.data?.user?.role ??
                "LEARNER",

            profilePicture:
                response.data?.profilePicture ??
                response.data?.profile_picture ??
                response.data?.user?.profilePicture ??
                null
        };

        const user =
            saveAuthData(
                token,
                userData
            );

        return {
            ...response.data,
            token,
            user
        };
    } catch (error) {
        const message =
            error.response?.data?.message ??
            error.response?.data?.error ??
            error.message ??
            "Login failed.";

        throw new Error(message);
    }
};

export const registerUser = async (
    name,
    email,
    password
) => {
    try {
        const cleanName =
            name.trim();

        const cleanEmail =
            email.trim().toLowerCase();

        const response =
            await axios.post(
                `${API_URL}/api/auth/register`,
                {
                    name: cleanName,
                    email: cleanEmail,
                    password
                }
            );

        const token =
            response.data?.accessToken ??
            response.data?.token ??
            response.data?.jwt;

        let user = null;

        if (token) {
            const userData = {
                id:
                    response.data?.userId ??
                    response.data?.id ??
                    response.data?.user?.id ??
                    response.data?.user?.userId ??
                    null,

                name:
                    response.data?.name ??
                    response.data?.username ??
                    response.data?.user?.name ??
                    cleanName,

                email:
                    response.data?.email ??
                    response.data?.user?.email ??
                    cleanEmail,

                role:
                    response.data?.role ??
                    response.data?.user?.role ??
                    "LEARNER",

                profilePicture:
                    response.data?.profilePicture ??
                    response.data?.profile_picture ??
                    response.data?.user?.profilePicture ??
                    null
            };

            user =
                saveAuthData(
                    token,
                    userData
                );
        }

        return {
            ...response.data,
            token,
            user
        };
    } catch (error) {
        const message =
            error.response?.data?.message ??
            error.response?.data?.error ??
            error.message ??
            "Registration failed.";

        throw new Error(message);
    }
};

export const getAuthHeaders = () => {
    const token = getToken();

    if (!token) {
        return {};
    }

    return {
        Authorization:
            `Bearer ${token}`
    };
};

export const authApi =
    axios.create({
        baseURL: API_URL,
        headers: {
            "Content-Type":
                "application/json"
        }
    });

authApi.interceptors.request.use(
    (config) => {
        const token = getToken();

        if (token) {
            config.headers =
                config.headers || {};

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

authApi.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (
            error.response?.status === 401
        ) {
            removeToken();

            if (
                window.location.pathname !==
                "/login"
            ) {
                window.location.href =
                    "/login";
            }
        }

        return Promise.reject(error);
    }
);

export const logoutUser = () => {
    removeToken();

    window.location.href =
        "/login";
};