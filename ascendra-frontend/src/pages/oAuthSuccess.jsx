import { useEffect } from "react";
import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import { saveToken } from "../service/authService";

function OAuthSuccess() {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {

        const token = searchParams.get("token");

        if (!token) {
            navigate("/login", {
                replace: true,
            });
            return;
        }

        // JWT save karo
        saveToken(token);

        // Google login ke baad bhi directly learner website
        navigate("/learner", {
            replace: true,
        });

    }, [navigate, searchParams]);

    return (
        <div className="oauth-loading">

            <div className="loading-logo">
                A
            </div>

            <div className="loading-spinner" />

            <h2>Signing you in...</h2>

            <p>
                Please wait while we take you to your learning space.
            </p>

        </div>
    );
}

export default OAuthSuccess;