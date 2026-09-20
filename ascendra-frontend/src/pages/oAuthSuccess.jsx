import { useEffect, useState } from "react";
import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import { saveToken } from "../service/authService";

function OAuthSuccess() {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    useEffect(() => {

        const token =
            searchParams.get("token");

        const oauthError =
            searchParams.get("error");

        if (oauthError) {
            setError(
                "Google login failed. Please try again."
            );

            setTimeout(() => {
                navigate("/login", {
                    replace: true,
                });
            }, 1500);

            return;
        }

        if (!token) {
            setError(
                "Authentication failed. Please try again."
            );

            setTimeout(() => {
                navigate("/login", {
                    replace: true,
                });
            }, 1500);

            return;
        }

        try {

            saveToken(token);

            navigate("/learner", {
                replace: true,
            });

        } catch (error) {

            setError(
                "Unable to complete Google login."
            );

            setTimeout(() => {
                navigate("/login", {
                    replace: true,
                });
            }, 1500);
        }

    }, [navigate, searchParams]);

    if (error) {
        return (
            <div className="oauth-loading">
                <div className="loading-logo">
                    A
                </div>

                <h2>
                    {error}
                </h2>

                <p>
                    Redirecting you to login...
                </p>
            </div>
        );
    }

    return (
        <div className="oauth-loading">

            <div className="loading-logo">
                A
            </div>

            <div className="loading-spinner" />

            <h2>
                Signing you in...
            </h2>

            <p>
                Please wait while we take you to your learning space.
            </p>

        </div>
    );
}

export default OAuthSuccess;