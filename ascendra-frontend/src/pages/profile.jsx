import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    Camera,
    Mail,
    ShieldCheck,
    User,
    Loader2,
} from "lucide-react";

import {
    getToken,
    removeToken,
} from "../service/authService";

import "./Profile.css";


function Profile() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [uploading, setUploading] = useState(false);


    // =========================================
    // LOAD REAL USER FROM BACKEND
    // =========================================

    useEffect(() => {

        const loadProfile = async () => {

            try {

                const token = getToken();

                if (!token) {

                    navigate("/login", {
                        replace: true,
                    });

                    return;
                }


                const response = await fetch(
                    "http://localhost:8080/api/user/profile",
                    {
                        method: "GET",

                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );


                if (response.status === 401) {

                    removeToken();

                    navigate("/login", {
                        replace: true,
                    });

                    return;
                }


                if (!response.ok) {

                    throw new Error(
                        "Unable to load profile"
                    );
                }


                const data =
                    await response.json();

                console.log(
                    "PROFILE FROM BACKEND:",
                    data
                );

                setUser(data);


            } catch (err) {

                console.error(
                    "Profile error:",
                    err
                );

                setError(
                    "Unable to load your profile."
                );

            } finally {

                setLoading(false);

            }
        };


        loadProfile();

    }, [navigate]);


    // =========================================
    // LOGOUT
    // =========================================

    const logout = () => {

        removeToken();

        navigate("/login", {
            replace: true,
        });

    };


    // =========================================
    // PROFILE PHOTO UPLOAD
    // =========================================

    const handlePhotoChange = async (e) => {

        const file =
            e.target.files?.[0];

        if (!file) return;


        if (!file.type.startsWith("image/")) {

            alert(
                "Please select an image file."
            );

            return;
        }


        try {

            setUploading(true);


            const token = getToken();

            const formData =
                new FormData();

            formData.append(
                "file",
                file
            );


            const response =
                await fetch(
                    "http://localhost:8080/api/user/profile/picture",
                    {
                        method: "POST",

                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },

                        body: formData,
                    }
                );


            if (response.status === 401) {

                removeToken();

                navigate("/login", {
                    replace: true,
                });

                return;
            }


            if (!response.ok) {

                const errorData =
                    await response.json();

                throw new Error(
                    errorData?.message ||
                    "Upload failed"
                );
            }


            const data =
                await response.json();


            // Update photo immediately
            setUser((prev) => ({
                ...prev,
                profilePicture:
                    data.profilePicture,
            }));


        } catch (err) {

            console.error(
                "Photo upload error:",
                err
            );

            alert(
                err.message ||
                "Failed to upload photo."
            );

        } finally {

            setUploading(false);

        }

    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (
            <div className="profile-loading">

                <div className="profile-loading-logo">
                    A
                </div>

                <Loader2
                    className="profile-loading-spinner"
                    size={28}
                />

                <p>
                    Loading your profile...
                </p>

            </div>
        );

    }


    // =========================================
    // ERROR
    // =========================================

    if (error) {

        return (
            <div className="profile-error-page">

                <h2>
                    {error}
                </h2>

                <button
                    onClick={() =>
                        window.location.reload()
                    }
                >
                    Try again
                </button>

            </div>
        );

    }


    // =========================================
    // USER DATA
    // =========================================

    const name =
        user?.name || "Learner";

    const email =
        user?.email || "";

    const role =
        user?.role || "LEARNER";

    const provider =
        user?.provider || "LOCAL";

    const profilePicture =
        user?.profilePicture;


    const initial =
        name
            .charAt(0)
            .toUpperCase();


    // =========================================
    // PAGE
    // =========================================

    return (

        <div className="profile-page">


            {/* =================================
                HEADER
            ================================= */}

            <header className="profile-header">

                <Link
                    to="/learner"
                    className="profile-back"
                >
                    <ArrowLeft size={18} />

                    <span>
                        Back to learning
                    </span>
                </Link>


                <Link
                    to="/"
                    className="profile-brand"
                >
                    Ascendra
                </Link>


                <button
                    onClick={logout}
                    className="profile-logout"
                >
                    Logout
                </button>

            </header>



            {/* =================================
                MAIN
            ================================= */}

            <main className="profile-container">


                <div className="profile-title">

                    <span>
                        ACCOUNT
                    </span>

                    <h1>
                        Your profile
                    </h1>

                    <p>
                        Manage your personal information
                        and learning account.
                    </p>

                </div>



                {/* =================================
                    PROFILE CARD
                ================================= */}

                <div className="profile-card">


                    {/* =================================
                        PHOTO
                    ================================= */}

                    <div className="profile-photo-area">


                        <div className="profile-photo">

                            {profilePicture ? (

                                <img
                                    src={
                                        profilePicture
                                    }
                                    alt={name}
                                />

                            ) : (

                                initial

                            )}

                        </div>


                        <label
                            className={
                                `photo-btn ${
                                    uploading
                                        ? "uploading"
                                        : ""
                                }`
                            }
                        >

                            <Camera size={17} />

                            {uploading
                                ? "Uploading..."
                                : "Change photo"
                            }


                            <input
                                type="file"
                                accept="image/*"
                                onChange={
                                    handlePhotoChange
                                }
                                disabled={
                                    uploading
                                }
                                hidden
                            />

                        </label>


                    </div>



                    {/* =================================
                        DETAILS
                    ================================= */}

                    <div className="profile-details">


                        {/* NAME */}

                        <div className="profile-field">

                            <label>

                                <User size={16} />

                                Full name

                            </label>

                            <div>
                                {name}
                            </div>

                        </div>



                        {/* EMAIL */}

                        <div className="profile-field">

                            <label>

                                <Mail size={16} />

                                Email

                            </label>

                            <div>
                                {email}
                            </div>

                        </div>



                        {/* ACCOUNT TYPE */}

                        <div className="profile-field">

                            <label>

                                <ShieldCheck
                                    size={16}
                                />

                                Account type

                            </label>

                            <div>
                                {role}
                            </div>

                        </div>



                        {/* LOGIN PROVIDER */}

                        <div className="profile-field">

                            <label>

                                <ShieldCheck
                                    size={16}
                                />

                                Sign-in method

                            </label>

                            <div>

                                {provider === "GOOGLE"
                                    ? "Google"
                                    : "Email & Password"
                                }

                            </div>

                        </div>


                    </div>

                </div>

            </main>

        </div>
    );
}


export default Profile;