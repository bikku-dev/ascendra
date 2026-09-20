import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getToken,
    getUser
} from "../../service/authService";

const API_URL =
    "/api";


function LearnerEntry() {

    const navigate =
        useNavigate();

    const [checking, setChecking] =
        useState(true);


    useEffect(() => {

        const checkProfile = async () => {

            try {

                /*
                 * ============================================
                 * CURRENT LOGGED-IN USER
                 * ============================================
                 */

                const user =
                    getUser();

                const token =
                    getToken();


                /*
                 * USER NAHI MILA
                 */

                if (!user) {

                    navigate(
                        "/login",
                        {
                            replace: true
                        }
                    );

                    return;
                }


                /*
                 * ONLY LEARNER
                 */

                if (
                    user.role &&
                    user.role !== "LEARNER"
                ) {

                    if (
                        user.role === "EXPERT"
                    ) {

                        navigate(
                            "/expert",
                            {
                                replace: true
                            }
                        );

                    } else if (
                        user.role === "ADMIN"
                    ) {

                        navigate(
                            "/admin",
                            {
                                replace: true
                            }
                        );

                    } else {

                        navigate(
                            "/",
                            {
                                replace: true
                            }
                        );
                    }

                    return;
                }


                /*
                 * USER ID
                 */

                const userId =
                    user.id ||
                    user.userId;


                if (!userId) {

                    console.error(
                        "User ID not found"
                    );

                    navigate(
                        "/login",
                        {
                            replace: true
                        }
                    );

                    return;
                }


                /*
                 * ============================================
                 * CHECK LEARNER PROFILE
                 * ============================================
                 */

                const response =
                    await fetch(
                        `${API_URL}/learners/user/${userId}`,
                        {
                            method: "GET",

                            headers: token
                                ? {
                                    Authorization:
                                        `Bearer ${token}`
                                }
                                : {}
                        }
                    );


                /*
                 * ============================================
                 * PROFILE EXISTS
                 * ============================================
                 */

                if (response.ok) {

                    navigate(
                        "/learner/dashboard",
                        {
                            replace: true
                        }
                    );

                    return;
                }


                /*
                 * ============================================
                 * FIRST TIME LEARNER
                 *
                 * Profile nahi hai.
                 * ============================================
                 */

                if (
                    response.status === 404
                ) {

                    navigate(
                        "/learner/onboarding",
                        {
                            replace: true
                        }
                    );

                    return;
                }


                /*
                 * OTHER BACKEND ERROR
                 */

                console.error(
                    "Profile check failed:",
                    response.status
                );

                navigate(
                    "/learner/dashboard",
                    {
                        replace: true
                    }
                );

            } catch (error) {

                console.error(
                    "Learner profile check error:",
                    error
                );

                /*
                 * Backend down hone par
                 * abhi dashboard par mat bhejo.
                 *
                 * User ko error dikhao.
                 */

            } finally {

                setChecking(false);

            }

        };


        checkProfile();

    }, [navigate]);


    if (checking) {

        return (

            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    fontWeight: "600"
                }}
            >
                Checking your profile...
            </div>

        );
    }


    return null;
}


export default LearnerEntry;