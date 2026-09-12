import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/register";
import OAuthSuccess from "./pages/oAuthSuccess";

import LearnerHome from "./pages/LearnerHome";
import Profile from "./pages/profile";
import LearnerOnboarding from "./pages/learner/LearnerOnboarding";

import ExpertDiscovery from "./pages/learner/ExpertDiscovery";
import Booking from "./pages/learner/boooking/Booking";
import BookingSuccess from "./pages/learner/boooking/BookingSuccess";

import Sessions from "./pages/learner/sessions/Sessions";
import Notifications from "./pages/learner/notifications/Notifications";

import {
    ThemeProvider
} from "./context/ThemeContext";

const getToken = () => {
    return (
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("ascendra_token")
    );
};

const getCurrentUser = () => {
    const keys = [
        "user",
        "ascendra_user"
    ];

    for (const key of keys) {
        const value =
            localStorage.getItem(key);

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

function ProtectedRoute({
    children
}) {
    const token = getToken();
    const user = getCurrentUser();

    if (!token && !user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return children;
}

function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <Routes>

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        path="/oauth-success"
                        element={<OAuthSuccess />}
                    />

                    <Route
                        path="/learner"
                        element={
                            <ProtectedRoute>
                                <LearnerHome />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/learner/dashboard"
                        element={
                            <ProtectedRoute>
                                <LearnerHome />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/learner/onboarding"
                        element={
                            <ProtectedRoute>
                                <LearnerOnboarding />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/learner/experts"
                        element={
                            <ProtectedRoute>
                                <ExpertDiscovery />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/learner/booking/:expertId"
                        element={
                            <ProtectedRoute>
                                <Booking />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/learner/booking-success"
                        element={
                            <ProtectedRoute>
                                <BookingSuccess />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/learner/bookings/success"
                        element={
                            <ProtectedRoute>
                                <BookingSuccess />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/learner/sessions"
                        element={
                            <ProtectedRoute>
                                <Sessions />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/learner/notifications"
                        element={
                            <ProtectedRoute>
                                <Notifications />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/learner"
                                replace
                            />
                        }
                    />

                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;