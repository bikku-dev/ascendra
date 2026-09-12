import React, {
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";

import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    ArrowRight,
    UserRound,
    Code2,
    Target,
    Plus,
    Trash2,
    Save,
    Check,
    Loader2,
    Camera,
    Mail,
    BriefcaseBusiness,
    Sparkles,
    X,
    Pencil
} from "lucide-react";

import {
    getLearnerProfileByUserId,
    createLearnerProfile,
    updateLearnerProfile,
    getAllSkills,
    getLearnerSkills,
    createLearnerSkill,
    deleteLearnerSkill,
    getLearnerGoals,
    createGoal,
    deleteGoal
} from "../../service/learnerService";

import {
    authApi,
    getUser
} from "../../service/authService";

import "./LearnerOnboarding.css";

const USER_KEYS = [
    "user",
    "ascendra_user"
];

const MAX_BIO_LENGTH = 500;

const getStoredUser = () => {

    for (const key of USER_KEYS) {

        try {

            const raw =
                localStorage.getItem(key);

            if (raw) {
                return JSON.parse(raw);
            }

        } catch (error) {

            console.warn(
                `Invalid ${key}`,
                error
            );

        }
    }

    try {

        return getUser?.() || null;

    } catch {

        return null;

    }
};

const getUserId = (user) =>
    user?.id ??
    user?.userId ??
    user?.user_id ??
    user?.user?.id ??
    null;

const getUserName = (user) =>
    user?.name ||
    user?.fullName ||
    user?.username ||
    user?.user?.name ||
    user?.email?.split("@")[0] ||
    "Learner";

const getUserEmail = (user) =>
    user?.email ||
    user?.user?.email ||
    "";

const getProfilePicture = (user) =>
    user?.profilePicture ||
    user?.profile_picture ||
    user?.profileImage ||
    user?.photoUrl ||
    user?.picture ||
    null;

const getSkillId = (item) =>
    item?.skillId ??
    item?.skill?.id ??
    item?.skill?.skillId ??
    null;

const getSkillName = (item) =>
    item?.skillName ||
    item?.name ||
    item?.skill?.name ||
    "Skill";

const getSkillLevel = (item) =>
    Number(
        item?.skillLevel ??
        item?.level ??
        item?.proficiency ??
        0
    );

const getGoalTitle = (goal) =>
    goal?.title ||
    goal?.name ||
    "Untitled goal";

const getGoalDescription = (goal) =>
    goal?.description ||
    goal?.details ||
    "";

const normalizeArray = (value) => {

    if (Array.isArray(value)) {
        return value;
    }

    if (Array.isArray(value?.data)) {
        return value.data;
    }

    if (Array.isArray(value?.content)) {
        return value.content;
    }

    return [];
};

function Avatar({
    src,
    name,
    large = false
}) {

    const initials =
        name
            ?.split(/\s+/)
            .filter(Boolean)
            .map((part) =>
                part.charAt(0)
            )
            .join("")
            .slice(0, 2)
            .toUpperCase() ||
        "L";

    return (
        <div
            className={
                `onboarding-avatar ${
                    large
                        ? "onboarding-avatar-large"
                        : ""
                }`
            }
        >

            {src ? (

                <img
                    src={src}
                    alt="Profile"
                    onError={(event) => {

                        event.currentTarget.style.display =
                            "none";

                    }}
                />

            ) : (

                <span>
                    {initials}
                </span>

            )}

        </div>
    );
}

function SectionHeader({
    icon,
    eyebrow,
    title,
    description,
    right
}) {

    return (
        <div className="onboarding-section-header">

            <div className="onboarding-section-heading">

                <div className="onboarding-section-icon">
                    {icon}
                </div>

                <div>

                    <span className="onboarding-card-eyebrow">
                        {eyebrow}
                    </span>

                    <h2>
                        {title}
                    </h2>

                    <p>
                        {description}
                    </p>

                </div>

            </div>

            {right && (
                <div>
                    {right}
                </div>
            )}

        </div>
    );
}

function LearnerOnboarding({
    embedded = false,
    onDone
}) {

    const navigate =
        useNavigate();

    const photoInputRef =
        useRef(null);

    const [
        user,
        setUser
    ] = useState(
        getStoredUser()
    );

    const [
        profile,
        setProfile
    ] = useState(null);

    const [
        experienceLevel,
        setExperienceLevel
    ] = useState("");

    const [
        targetRole,
        setTargetRole
    ] = useState("");

    const [
        bio,
        setBio
    ] = useState("");

    const [
        profilePicture,
        setProfilePicture
    ] = useState(
        getProfilePicture(
            getStoredUser()
        )
    );

    const [
        selectedPhoto,
        setSelectedPhoto
    ] = useState(null);

    const [
        photoPreview,
        setPhotoPreview
    ] = useState(null);

    const [
        uploadingPhoto,
        setUploadingPhoto
    ] = useState(false);

    const [
        editingIdentity,
        setEditingIdentity
    ] = useState(false);

    const [
        editedName,
        setEditedName
    ] = useState(
        getUserName(
            getStoredUser()
        )
    );

    const [
        savingIdentity,
        setSavingIdentity
    ] = useState(false);

    const [
        availableSkills,
        setAvailableSkills
    ] = useState([]);

    const [
        skills,
        setSkills
    ] = useState([]);

    const [
        selectedSkillId,
        setSelectedSkillId
    ] = useState("");

    const [
        selectedSkillLevel,
        setSelectedSkillLevel
    ] = useState(50);

    const [
        goals,
        setGoals
    ] = useState([]);

    const [
        goalTitle,
        setGoalTitle
    ] = useState("");

    const [
        goalDescription,
        setGoalDescription
    ] = useState("");

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        savingProfile,
        setSavingProfile
    ] = useState(false);

    const [
        savingSkill,
        setSavingSkill
    ] = useState(false);

    const [
        savingGoal,
        setSavingGoal
    ] = useState(false);

    const [
        deletingId,
        setDeletingId
    ] = useState(null);

    const [
        message,
        setMessage
    ] = useState("");

    const [
        error,
        setError
    ] = useState("");

    const clearAlerts = () => {

        setMessage("");
        setError("");

    };

    const syncStoredUser = (
        updatedUser
    ) => {

        try {

            localStorage.setItem(
                "user",
                JSON.stringify(
                    updatedUser
                )
            );

            localStorage.setItem(
                "ascendra_user",
                JSON.stringify(
                    updatedUser
                )
            );

        } catch (storageError) {

            console.warn(
                "Unable to update stored user:",
                storageError
            );

        }
    };

    const loadSkillsAndGoals =
        async (learnerId) => {

            const [
                skillsData,
                goalsData
            ] = await Promise.all([
                getLearnerSkills(
                    learnerId
                ),
                getLearnerGoals(
                    learnerId
                )
            ]);

            setSkills(
                normalizeArray(
                    skillsData
                )
            );

            setGoals(
                normalizeArray(
                    goalsData
                )
            );
        };

    useEffect(() => {

        let mounted = true;

        const loadData =
            async () => {

                try {

                    setLoading(true);
                    setError("");

                    const currentUser =
                        getStoredUser();

                    if (!currentUser) {

                        navigate(
                            "/login",
                            {
                                replace: true
                            }
                        );

                        return;
                    }

                    if (!mounted) {
                        return;
                    }

                    setUser(
                        currentUser
                    );

                    setEditedName(
                        getUserName(
                            currentUser
                        )
                    );

                    setProfilePicture(
                        getProfilePicture(
                            currentUser
                        )
                    );

                    const userId =
                        getUserId(
                            currentUser
                        );

                    if (!userId) {

                        throw new Error(
                            "User ID not found. Please login again."
                        );

                    }

                    let existingProfile =
                        null;

                    try {

                        existingProfile =
                            await getLearnerProfileByUserId(
                                userId
                            );

                    } catch (
                        profileError
                    ) {

                        if (
                            profileError
                                ?.response
                                ?.status !==
                            404
                        ) {

                            throw profileError;

                        }

                    }

                    if (
                        mounted &&
                        existingProfile
                    ) {

                        setProfile(
                            existingProfile
                        );

                        setExperienceLevel(
                            existingProfile.experienceLevel ||
                            existingProfile.experience ||
                            ""
                        );

                        setTargetRole(
                            existingProfile.targetRole ||
                            ""
                        );

                        setBio(
                            existingProfile.bio ||
                            ""
                        );

                    }

                    try {

                        const allSkills =
                            await getAllSkills();

                        if (mounted) {

                            setAvailableSkills(
                                normalizeArray(
                                    allSkills
                                )
                            );

                        }

                    } catch (
                        skillError
                    ) {

                        console.warn(
                            "Unable to load available skills:",
                            skillError
                        );

                        if (mounted) {

                            setAvailableSkills(
                                []
                            );

                        }

                    }

                    if (
                        existingProfile?.id
                    ) {

                        await loadSkillsAndGoals(
                            existingProfile.id
                        );

                    } else if (
                        mounted
                    ) {

                        setSkills([]);
                        setGoals([]);

                    }

                } catch (err) {

                    console.error(
                        "Learner onboarding error:",
                        err
                    );

                    if (mounted) {

                        setError(
                            err?.response?.data?.message ||
                            err?.response?.data?.error ||
                            err?.message ||
                            "Unable to load your profile."
                        );

                    }

                } finally {

                    if (mounted) {
                        setLoading(false);
                    }

                }

            };

        loadData();

        return () => {

            mounted = false;

        };

    }, [navigate]);

    const completion =
        useMemo(() => {

            let score = 0;

            if (experienceLevel) {
                score += 20;
            }

            if (targetRole.trim()) {
                score += 20;
            }

            if (bio.trim()) {
                score += 20;
            }

            if (skills.length) {
                score += 20;
            }

            if (goals.length) {
                score += 20;
            }

            return score;

        }, [
            experienceLevel,
            targetRole,
            bio,
            skills,
            goals
        ]);

    const userName =
        getUserName(user);

    const userEmail =
        getUserEmail(user);

    const displayedPhoto =
        photoPreview ||
        profilePicture;

    const saveProfile =
        async () => {

            clearAlerts();

            const currentUserId =
                getUserId(user);

            if (!currentUserId) {

                setError(
                    "User ID not found. Please login again."
                );

                return null;
            }

            if (!experienceLevel) {

                setError(
                    "Please select your experience level."
                );

                return null;
            }

            if (!targetRole.trim()) {

                setError(
                    "Please enter your target role."
                );

                return null;
            }

            if (
                bio.trim().length >
                MAX_BIO_LENGTH
            ) {

                setError(
                    `About you cannot exceed ${MAX_BIO_LENGTH} characters.`
                );

                return null;
            }

            setSavingProfile(true);

            try {

                const payload = {
                    userId:
                        Number(
                            currentUserId
                        ),
                    experienceLevel,
                    targetRole:
                        targetRole.trim(),
                    bio:
                        bio.trim()
                };

                const savedProfile =
                    profile?.id
                        ? await updateLearnerProfile(
                            profile.id,
                            payload
                        )
                        : await createLearnerProfile(
                            payload
                        );

                setProfile(
                    savedProfile
                );

                setMessage(
                    profile?.id
                        ? "Profile updated successfully."
                        : "Profile created successfully."
                );

                return savedProfile;

            } catch (err) {

                console.error(
                    "Profile save error:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    err?.message ||
                    "Unable to save your profile."
                );

                return null;

            } finally {

                setSavingProfile(
                    false
                );

            }
        };

    const ensureLearnerProfile =
        async () => {

            if (profile?.id) {
                return profile;
            }

            return saveProfile();
        };

    const handlePhotoSelect =
        (event) => {

            const file =
                event.target.files?.[0];

            if (!file) {
                return;
            }

            clearAlerts();

            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/webp"
            ];

            if (
                !allowedTypes.includes(
                    file.type
                )
            ) {

                setError(
                    "Please select a JPG, PNG or WEBP image."
                );

                event.target.value =
                    "";

                return;
            }

            if (
                file.size >
                5 * 1024 * 1024
            ) {

                setError(
                    "Profile photo must be smaller than 5 MB."
                );

                event.target.value =
                    "";

                return;
            }

            if (photoPreview) {

                URL.revokeObjectURL(
                    photoPreview
                );

            }

            const previewUrl =
                URL.createObjectURL(
                    file
                );

            setSelectedPhoto(
                file
            );

            setPhotoPreview(
                previewUrl
            );

        };

    const handleUploadPhoto =
        async () => {

            if (!selectedPhoto) {

                setError(
                    "Please select a photo first."
                );

                return;
            }

            setUploadingPhoto(
                true
            );

            clearAlerts();

            try {

                const formData =
                    new FormData();

                formData.append(
                    "file",
                    selectedPhoto
                );

                const response =
                    await authApi.post(
                        "/api/user/profile/picture",
                        formData,
                        {
                            headers: {
                                "Content-Type":
                                    "multipart/form-data"
                            }
                        }
                    );

                const uploadedPicture =
                    response
                        ?.data
                        ?.profilePicture;

                if (!uploadedPicture) {

                    throw new Error(
                        "Profile picture was not returned by the server."
                    );

                }

                setProfilePicture(
                    uploadedPicture
                );

                const currentUser =
                    getStoredUser();

                if (currentUser) {

                    const updatedUser = {
                        ...currentUser,
                        profilePicture:
                            uploadedPicture
                    };

                    setUser(
                        updatedUser
                    );

                    syncStoredUser(
                        updatedUser
                    );
                }

                if (photoPreview) {

                    URL.revokeObjectURL(
                        photoPreview
                    );

                }

                setPhotoPreview(
                    null
                );

                setSelectedPhoto(
                    null
                );

                if (
                    photoInputRef.current
                ) {

                    photoInputRef.current.value =
                        "";

                }

                setMessage(
                    "Profile photo updated successfully."
                );

            } catch (err) {

                console.error(
                    "Photo upload error:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    err?.message ||
                    "Unable to update profile photo."
                );

            } finally {

                setUploadingPhoto(
                    false
                );

            }
        };

    const cancelPhoto =
        () => {

            setSelectedPhoto(
                null
            );

            if (photoPreview) {

                URL.revokeObjectURL(
                    photoPreview
                );

            }

            setPhotoPreview(
                null
            );

            if (
                photoInputRef.current
            ) {

                photoInputRef.current.value =
                    "";

            }

            clearAlerts();

        };

    const handleEditName =
        () => {

            clearAlerts();

            setEditedName(
                getUserName(
                    user
                )
            );

            setEditingIdentity(
                true
            );

        };

    const handleCancelName =
        () => {

            setEditedName(
                getUserName(
                    user
                )
            );

            setEditingIdentity(
                false
            );

            clearAlerts();

        };

    const handleSaveName =
        async () => {

            clearAlerts();

            const currentUserId =
                getUserId(user);

            if (!currentUserId) {

                setError(
                    "User ID not found. Please login again."
                );

                return;

            }

            const cleanName =
                editedName
                    .trim()
                    .replace(
                        /\s+/g,
                        " "
                    );

            if (
                cleanName.length < 2
            ) {

                setError(
                    "Name must contain at least 2 characters."
                );

                return;
            }

            if (
                cleanName.length > 100
            ) {

                setError(
                    "Name cannot exceed 100 characters."
                );

                return;
            }

            setSavingIdentity(
                true
            );

            try {

                const response =
                    await authApi.put(
                        `/api/users/${currentUserId}/profile`,
                        {
                            name:
                                cleanName,
                            email:
                                userEmail
                        }
                    );

                const updatedUser =
                    response?.data || {};

                const nextUser = {
                    ...user,
                    ...updatedUser,
                    id:
                        updatedUser?.id ??
                        user?.id,
                    name:
                        updatedUser?.name ??
                        cleanName,
                    email:
                        updatedUser?.email ??
                        userEmail,
                    profilePicture:
                        updatedUser?.profilePicture ??
                        profilePicture
                };

                setUser(
                    nextUser
                );

                setEditedName(
                    getUserName(
                        nextUser
                    )
                );

                setProfilePicture(
                    getProfilePicture(
                        nextUser
                    ) ||
                    profilePicture
                );

                syncStoredUser(
                    nextUser
                );

                setEditingIdentity(
                    false
                );

                setMessage(
                    "Your name was updated successfully."
                );

            } catch (err) {

                console.error(
                    "Name update error:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    err?.message ||
                    "Unable to update your name."
                );

            } finally {

                setSavingIdentity(
                    false
                );

            }
        };

    const handleAddSkill =
        async () => {

            clearAlerts();

            if (!selectedSkillId) {

                setError(
                    "Please select a skill."
                );

                return;
            }

            const numericSkillId =
                Number(
                    selectedSkillId
                );

            if (!numericSkillId) {

                setError(
                    "Invalid skill selected."
                );

                return;
            }

            if (
                skills.some(
                    (skill) =>
                        Number(
                            getSkillId(
                                skill
                            )
                        ) ===
                        numericSkillId
                )
            ) {

                setError(
                    "This skill is already added."
                );

                return;
            }

            const level =
                Math.min(
                    100,
                    Math.max(
                        0,
                        Number(
                            selectedSkillLevel
                        )
                    )
                );

            setSavingSkill(
                true
            );

            try {

                const learner =
                    await ensureLearnerProfile();

                if (!learner) {
                    return;
                }

                const learnerId =
                    learner.id ||
                    learner.learnerId;

                if (!learnerId) {

                    throw new Error(
                        "Learner profile ID was not found."
                    );

                }

                const createdSkill =
                    await createLearnerSkill({
                        learnerId:
                            Number(
                                learnerId
                            ),
                        skillId:
                            numericSkillId,
                        skillLevel:
                            level
                    });

                setSkills(
                    (previous) => [
                        ...previous,
                        createdSkill
                    ]
                );

                setSelectedSkillId(
                    ""
                );

                setSelectedSkillLevel(
                    50
                );

                setMessage(
                    "Skill added successfully."
                );

            } catch (err) {

                console.error(
                    "Add skill error:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    err?.message ||
                    "Unable to add this skill."
                );

            } finally {

                setSavingSkill(
                    false
                );

            }
        };

    const handleDeleteSkill =
        async (skill) => {

            const learnerSkillId =
                skill?.id ||
                skill?.learnerSkillId;

            if (!learnerSkillId) {

                setError(
                    "Skill record ID not found."
                );

                return;
            }

            setDeletingId(
                `skill-${learnerSkillId}`
            );

            clearAlerts();

            try {

                await deleteLearnerSkill(
                    learnerSkillId
                );

                setSkills(
                    (previous) =>
                        previous.filter(
                            (item) =>
                                (
                                    item?.id ||
                                    item?.learnerSkillId
                                ) !==
                                learnerSkillId
                        )
                );

                setMessage(
                    "Skill removed successfully."
                );

            } catch (err) {

                console.error(
                    "Delete skill error:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    err?.message ||
                    "Unable to remove this skill."
                );

            } finally {

                setDeletingId(
                    null
                );

            }
        };

    const handleAddGoal =
        async () => {

            clearAlerts();

            if (!goalTitle.trim()) {

                setError(
                    "Please enter a goal title."
                );

                return;
            }

            if (
                goalTitle.trim().length >
                150
            ) {

                setError(
                    "Goal title cannot exceed 150 characters."
                );

                return;
            }

            setSavingGoal(
                true
            );

            try {

                const learner =
                    await ensureLearnerProfile();

                if (!learner) {
                    return;
                }

                const learnerId =
                    learner.id ||
                    learner.learnerId;

                if (!learnerId) {

                    throw new Error(
                        "Learner profile ID was not found."
                    );

                }

                const createdGoal =
                    await createGoal({
                        learnerId:
                            Number(
                                learnerId
                            ),
                        title:
                            goalTitle.trim(),
                        description:
                            goalDescription.trim()
                    });

                setGoals(
                    (previous) => [
                        ...previous,
                        createdGoal
                    ]
                );

                setGoalTitle(
                    ""
                );

                setGoalDescription(
                    ""
                );

                setMessage(
                    "Goal added successfully."
                );

            } catch (err) {

                console.error(
                    "Add goal error:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    err?.message ||
                    "Unable to add your goal."
                );

            } finally {

                setSavingGoal(
                    false
                );

            }
        };

    const handleDeleteGoal =
        async (goal) => {

            const goalId =
                goal?.id ||
                goal?.goalId;

            if (!goalId) {

                setError(
                    "Goal ID not found."
                );

                return;
            }

            setDeletingId(
                `goal-${goalId}`
            );

            clearAlerts();

            try {

                await deleteGoal(
                    goalId
                );

                setGoals(
                    (previous) =>
                        previous.filter(
                            (item) =>
                                (
                                    item?.id ||
                                    item?.goalId
                                ) !==
                                goalId
                        )
                );

                setMessage(
                    "Goal removed successfully."
                );

            } catch (err) {

                console.error(
                    "Delete goal error:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    err?.message ||
                    "Unable to remove this goal."
                );

            } finally {

                setDeletingId(
                    null
                );

            }
        };

    const finishOnboarding =
        async () => {

            clearAlerts();

            let currentProfile =
                profile;

            if (
                !currentProfile?.id
            ) {

                currentProfile =
                    await saveProfile();

            }

            if (!currentProfile) {
                return;
            }

            const learnerId =
                currentProfile.id ||
                currentProfile.learnerId;

            if (learnerId) {

                try {

                    await loadSkillsAndGoals(
                        learnerId
                    );

                } catch (err) {

                    console.warn(
                        "Unable to refresh learner data:",
                        err
                    );

                }

            }

            if (
                typeof onDone ===
                "function"
            ) {

                onDone(
                    currentProfile
                );

                return;
            }

            navigate(
                "/learner?view=dashboard",
                {
                    replace: true
                }
            );
        };

    const handleBack =
        () => {

            if (
                typeof onDone ===
                "function"
            ) {

                onDone(profile);

                return;
            }

            navigate(
                "/learner?view=dashboard"
            );
        };

    useEffect(() => {

        return () => {

            if (photoPreview) {

                URL.revokeObjectURL(
                    photoPreview
                );

            }

        };

    }, [photoPreview]);

    if (loading) {

        return (
            <div
                className={
                    `onboarding-page ${
                        embedded
                            ? "onboarding-embedded"
                            : ""
                    }`
                }
            >

                <div className="onboarding-loading">

                    <div className="onboarding-loader-logo">
                        A
                    </div>

                    <Loader2
                        className="spin"
                        size={22}
                    />

                    <h2>
                        Preparing your profile...
                    </h2>

                    <p>
                        Loading your information,
                        skills and goals.
                    </p>

                </div>

            </div>
        );
    }

    return (
        <div
            className={
                `onboarding-page ${
                    embedded
                        ? "onboarding-embedded"
                        : ""
                }`
            }
        >

            {!embedded && (

                <header className="onboarding-navbar">

                    <div className="onboarding-brand">

                        <span className="onboarding-brand-mark">
                            A
                        </span>

                        <div>

                            <strong>
                                Ascendra
                            </strong>

                            <span>
                                Learning Workspace
                            </span>

                        </div>

                    </div>

                    <button
                        className="onboarding-back"
                        onClick={handleBack}
                        type="button"
                    >
                        <ArrowLeft size={17} />
                        Dashboard
                    </button>

                </header>

            )}

            <main className="onboarding-container">

                <section className="onboarding-hero">

                    <div className="onboarding-hero-copy">

                        <span className="onboarding-eyebrow">

                            <span className="eyebrow-dot" />

                            YOUR LEARNER PROFILE

                        </span>

                        <h1>
                            Build your{" "}
                            <span>
                                profile.
                            </span>
                        </h1>

                        <p>
                            Manage your identity,
                            experience, skills and
                            career goals from one
                            focused workspace.
                        </p>

                    </div>

                    <div className="onboarding-progress-card">

                        <div
                            className="onboarding-progress-ring"
                            style={{
                                "--progress":
                                    `${completion * 3.6}deg`
                            }}
                        >

                            <div className="onboarding-progress-ring-inner">

                                <strong>
                                    {completion}%
                                </strong>

                                <span>
                                    Profile
                                </span>

                            </div>

                        </div>

                        <div className="onboarding-progress-copy">

                            <span>
                                PROFILE COMPLETION
                            </span>

                            <h3>
                                {completion >= 100
                                    ? "Profile complete"
                                    : completion >= 60
                                        ? "Almost there"
                                        : "Keep building"}
                            </h3>

                            <p>
                                {completion >= 100
                                    ? "Your learner profile is ready."
                                    : "Add your details, skills and goals."}
                            </p>

                        </div>

                    </div>

                </section>

                {message && (

                    <div className="onboarding-alert onboarding-success">

                        <Check size={17} />

                        <span>
                            {message}
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                setMessage("")
                            }
                        >
                            <X size={16} />
                        </button>

                    </div>

                )}

                {error && (

                    <div className="onboarding-alert onboarding-error">

                        <span>
                            {error}
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                setError("")
                            }
                        >
                            <X size={16} />
                        </button>

                    </div>

                )}

                <section className="onboarding-card">

                    <SectionHeader
                        icon={
                            <UserRound
                                size={21}
                            />
                        }
                        eyebrow="ACCOUNT"
                        title="Your identity"
                        description="Your profile photo and name are visible across your Ascendra workspace."
                    />

                    <div className="identity-layout">

                        <div className="photo-panel">

                            <div className="photo-preview">

                                <Avatar
                                    src={
                                        displayedPhoto
                                    }
                                    name={
                                        userName
                                    }
                                    large
                                />

                            </div>

                            <input
                                ref={
                                    photoInputRef
                                }
                                className="hidden-file-input"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={
                                    handlePhotoSelect
                                }
                            />

                            <button
                                type="button"
                                className="photo-button"
                                onClick={() =>
                                    photoInputRef.current?.click()
                                }
                                disabled={
                                    uploadingPhoto
                                }
                            >

                                <Camera
                                    size={17}
                                />

                                Change photo

                            </button>

                            <small>
                                JPG, PNG or WEBP · Max 5 MB
                            </small>

                            {selectedPhoto && (

                                <div className="photo-actions">

                                    <button
                                        type="button"
                                        className="primary-button small-button"
                                        onClick={
                                            handleUploadPhoto
                                        }
                                        disabled={
                                            uploadingPhoto
                                        }
                                    >

                                        {uploadingPhoto ? (

                                            <>
                                                <Loader2
                                                    size={16}
                                                    className="spin"
                                                />

                                                Uploading...
                                            </>

                                        ) : (

                                            <>
                                                <Check
                                                    size={16}
                                                />

                                                Upload photo
                                            </>

                                        )}

                                    </button>

                                    <button
                                        type="button"
                                        className="photo-cancel-button"
                                        onClick={
                                            cancelPhoto
                                        }
                                        disabled={
                                            uploadingPhoto
                                        }
                                    >

                                        <X
                                            size={15}
                                        />

                                        Cancel

                                    </button>

                                </div>

                            )}

                        </div>

                        <div className="identity-fields">

                            <div className="form-field">

                                <div className="field-label-row">

                                    <label>
                                        Full name
                                    </label>

                                    {!editingIdentity && (

                                        <button
                                            type="button"
                                            className="profile-edit-button"
                                            onClick={
                                                handleEditName
                                            }
                                        >

                                            <Pencil
                                                size={14}
                                            />

                                            Edit

                                        </button>

                                    )}

                                </div>

                                {editingIdentity ? (

                                    <div className="identity-edit-box">

                                        <div className="editable-field">

                                            <UserRound
                                                size={17}
                                            />

                                            <input
                                                type="text"
                                                value={
                                                    editedName
                                                }
                                                onChange={(event) => {

                                                    setEditedName(
                                                        event.target.value
                                                    );

                                                    clearAlerts();

                                                }}
                                                placeholder="Enter your full name"
                                                maxLength={100}
                                                autoFocus
                                                disabled={
                                                    savingIdentity
                                                }
                                            />

                                        </div>

                                        <div className="identity-edit-actions">

                                            <button
                                                type="button"
                                                className="identity-cancel-button"
                                                onClick={
                                                    handleCancelName
                                                }
                                                disabled={
                                                    savingIdentity
                                                }
                                            >
                                                <X
                                                    size={15}
                                                />
                                                Cancel
                                            </button>

                                            <button
                                                type="button"
                                                className="identity-save-button"
                                                onClick={
                                                    handleSaveName
                                                }
                                                disabled={
                                                    savingIdentity ||
                                                    !editedName.trim()
                                                }
                                            >

                                                {savingIdentity ? (

                                                    <>
                                                        <Loader2
                                                            size={15}
                                                            className="spin"
                                                        />

                                                        Saving...
                                                    </>

                                                ) : (

                                                    <>
                                                        <Check
                                                            size={15}
                                                        />

                                                        Save name
                                                    </>

                                                )}

                                            </button>

                                        </div>

                                    </div>

                                ) : (

                                    <div className="readonly-field">

                                        <UserRound
                                            size={17}
                                        />

                                        <input
                                            value={
                                                userName
                                            }
                                            readOnly
                                        />

                                    </div>

                                )}

                                <small>
                                    You can update your display name anytime.
                                </small>

                            </div>

                            <div className="form-field">

                                <label>
                                    Email
                                </label>

                                <div className="readonly-field">

                                    <Mail
                                        size={17}
                                    />

                                    <input
                                        value={
                                            userEmail ||
                                            "Email not available"
                                        }
                                        readOnly
                                    />

                                </div>

                                <small>
                                    Your login email is managed by your account.
                                </small>

                            </div>

                        </div>

                    </div>

                </section>

                <section className="onboarding-card">

                    <SectionHeader
                        icon={
                            <BriefcaseBusiness
                                size={21}
                            />
                        }
                        eyebrow="ABOUT YOU"
                        title="Your experience"
                        description="Tell Ascendra where you are today and where you want to go."
                        right={
                            profile && (
                                <span className="saved-badge">
                                    <Check
                                        size={14}
                                    />
                                    Saved
                                </span>
                            )
                        }
                    />

                    <div className="form-grid">

                        <div className="form-field">

                            <label htmlFor="experienceLevel">
                                Experience level
                            </label>

                            <select
                                id="experienceLevel"
                                value={
                                    experienceLevel
                                }
                                onChange={(event) => {

                                    setExperienceLevel(
                                        event.target.value
                                    );

                                    clearAlerts();

                                }}
                            >

                                <option value="">
                                    Select your level
                                </option>

                                <option value="BEGINNER">
                                    Beginner
                                </option>

                                <option value="INTERMEDIATE">
                                    Intermediate
                                </option>

                                <option value="ADVANCED">
                                    Advanced
                                </option>

                                <option value="EXPERT">
                                    Expert
                                </option>

                            </select>

                        </div>

                        <div className="form-field">

                            <label htmlFor="targetRole">
                                Target role
                            </label>

                            <input
                                id="targetRole"
                                type="text"
                                value={
                                    targetRole
                                }
                                onChange={(event) => {

                                    setTargetRole(
                                        event.target.value
                                    );

                                    clearAlerts();

                                }}
                                placeholder="e.g. Full Stack Developer"
                                maxLength={120}
                            />

                        </div>

                        <div className="form-field form-field-full">

                            <div className="field-label-row">

                                <label htmlFor="bio">
                                    About you
                                </label>

                                <span>
                                    {bio.length}/
                                    {MAX_BIO_LENGTH}
                                </span>

                            </div>

                            <textarea
                                id="bio"
                                value={
                                    bio
                                }
                                onChange={(event) => {

                                    setBio(
                                        event.target.value
                                    );

                                    clearAlerts();

                                }}
                                placeholder="Tell us about your current skills, experience and what you want to achieve..."
                                rows={5}
                                maxLength={
                                    MAX_BIO_LENGTH
                                }
                            />

                        </div>

                    </div>

                    <div className="section-save-row">

                        <div>

                            <span>
                                Keep your profile current
                            </span>

                            <p>
                                These details help Ascendra
                                understand your learning direction.
                            </p>

                        </div>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={
                                saveProfile
                            }
                            disabled={
                                savingProfile
                            }
                        >

                            {savingProfile ? (

                                <>
                                    <Loader2
                                        size={17}
                                        className="spin"
                                    />

                                    Saving...
                                </>

                            ) : (

                                <>
                                    <Save
                                        size={17}
                                    />

                                    Save information
                                </>

                            )}

                        </button>

                    </div>

                </section>

                <section className="onboarding-card">

                    <SectionHeader
                        icon={
                            <Code2
                                size={21}
                            />
                        }
                        eyebrow="YOUR SKILLS"
                        title="Skills you have"
                        description="Add the skills you already know and set your current proficiency."
                        right={
                            <span className="count-badge">
                                {skills.length}{" "}
                                {skills.length === 1
                                    ? "skill"
                                    : "skills"}
                            </span>
                        }
                    />

                    <div className="skill-form">

                        <div className="form-field">

                            <label htmlFor="skill">
                                Choose a skill
                            </label>

                            <select
                                id="skill"
                                value={
                                    selectedSkillId
                                }
                                onChange={(event) => {

                                    setSelectedSkillId(
                                        event.target.value
                                    );

                                    clearAlerts();

                                }}
                            >

                                <option value="">
                                    Select a skill
                                </option>

                                {availableSkills.map(
                                    (
                                        skill,
                                        index
                                    ) => {

                                        const id =
                                            skill?.id ??
                                            skill?.skillId ??
                                            skill?.value;

                                        const name =
                                            skill?.name ??
                                            skill?.skillName ??
                                            `Skill ${index + 1}`;

                                        return (

                                            <option
                                                key={
                                                    id ??
                                                    index
                                                }
                                                value={
                                                    id
                                                }
                                            >
                                                {name}
                                            </option>

                                        );

                                    }
                                )}

                            </select>

                        </div>

                        <div className="form-field skill-level-field">

                            <div className="field-label-row">

                                <label htmlFor="skillLevel">
                                    Current level
                                </label>

                                <strong className="range-value">
                                    {selectedSkillLevel}%
                                </strong>

                            </div>

                            <input
                                id="skillLevel"
                                className="range-input"
                                type="range"
                                min="0"
                                max="100"
                                value={
                                    selectedSkillLevel
                                }
                                onChange={(event) => {

                                    setSelectedSkillLevel(
                                        Number(
                                            event.target.value
                                        )
                                    );

                                    clearAlerts();

                                }}
                            />

                            <div className="range-labels">

                                <span>
                                    Beginner
                                </span>

                                <span>
                                    Expert
                                </span>

                            </div>

                        </div>

                        <button
                            type="button"
                            className="primary-button add-button"
                            onClick={
                                handleAddSkill
                            }
                            disabled={
                                savingSkill
                            }
                        >

                            {savingSkill ? (

                                <Loader2
                                    size={17}
                                    className="spin"
                                />

                            ) : (

                                <Plus
                                    size={17}
                                />

                            )}

                            {savingSkill
                                ? "Adding..."
                                : "Add skill"}

                        </button>

                    </div>

                    <div className="items-list">

                        {skills.length === 0 ? (

                            <div className="empty-state onboarding-empty">

                                <div className="empty-state-icon">

                                    <Code2
                                        size={21}
                                    />

                                </div>

                                <strong>
                                    No skills added yet
                                </strong>

                                <p>
                                    Add the skills you
                                    currently use so
                                    Ascendra can understand
                                    your profile.
                                </p>

                            </div>

                        ) : (

                            skills.map(
                                (
                                    skill,
                                    index
                                ) => {

                                    const recordId =
                                        skill?.id ||
                                        skill?.learnerSkillId ||
                                        index;

                                    const level =
                                        Math.max(
                                            0,
                                            Math.min(
                                                100,
                                                getSkillLevel(
                                                    skill
                                                )
                                            )
                                        );

                                    return (

                                        <div
                                            className="item-row"
                                            key={
                                                recordId
                                            }
                                        >

                                            <div className="item-main">

                                                <div className="item-icon">

                                                    <Code2
                                                        size={18}
                                                    />

                                                </div>

                                                <div>

                                                    <strong>
                                                        {getSkillName(
                                                            skill
                                                        )}
                                                    </strong>

                                                    <span>
                                                        Current proficiency
                                                    </span>

                                                </div>

                                            </div>

                                            <div className="item-progress">

                                                <div className="item-progress-top">

                                                    <span>
                                                        Level
                                                    </span>

                                                    <strong>
                                                        {level}%
                                                    </strong>

                                                </div>

                                                <div className="item-progress-track">

                                                    <span
                                                        style={{
                                                            width:
                                                                `${level}%`
                                                        }}
                                                    />

                                                </div>

                                            </div>

                                            <button
                                                type="button"
                                                className="icon-delete-button"
                                                onClick={() =>
                                                    handleDeleteSkill(
                                                        skill
                                                    )
                                                }
                                                disabled={
                                                    deletingId ===
                                                    `skill-${recordId}`
                                                }
                                                aria-label="Delete skill"
                                            >

                                                {deletingId ===
                                                `skill-${recordId}` ? (

                                                    <Loader2
                                                        size={17}
                                                        className="spin"
                                                    />

                                                ) : (

                                                    <Trash2
                                                        size={17}
                                                    />

                                                )}

                                            </button>

                                        </div>

                                    );

                                }
                            )

                        )}

                    </div>

                </section>

                <section className="onboarding-card">

                    <SectionHeader
                        icon={
                            <Target
                                size={21}
                            />
                        }
                        eyebrow="CAREER GOALS"
                        title="Where you want to go"
                        description="Create a clear outcome so your skills and expert recommendations stay focused."
                        right={
                            <span className="count-badge">
                                {goals.length}{" "}
                                {goals.length === 1
                                    ? "goal"
                                    : "goals"}
                            </span>
                        }
                    />

                    <div className="goal-form">

                        <div className="form-field">

                            <label htmlFor="goalTitle">
                                Goal title
                            </label>

                            <input
                                id="goalTitle"
                                type="text"
                                value={
                                    goalTitle
                                }
                                onChange={(event) => {

                                    setGoalTitle(
                                        event.target.value
                                    );

                                    clearAlerts();

                                }}
                                placeholder="e.g. Become a Full Stack Developer"
                                maxLength={150}
                            />

                        </div>

                        <div className="form-field form-field-full">

                            <label htmlFor="goalDescription">
                                Description
                            </label>

                            <textarea
                                id="goalDescription"
                                value={
                                    goalDescription
                                }
                                onChange={(event) => {

                                    setGoalDescription(
                                        event.target.value
                                    );

                                    clearAlerts();

                                }}
                                placeholder="Describe the outcome you want to achieve..."
                                rows={4}
                            />

                        </div>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={
                                handleAddGoal
                            }
                            disabled={
                                savingGoal
                            }
                        >

                            {savingGoal ? (

                                <Loader2
                                    size={17}
                                    className="spin"
                                />

                            ) : (

                                <Plus
                                    size={17}
                                />

                            )}

                            {savingGoal
                                ? "Adding..."
                                : "Add goal"}

                        </button>

                    </div>

                    <div className="items-list">

                        {goals.length === 0 ? (

                            <div className="empty-state onboarding-empty">

                                <div className="empty-state-icon">

                                    <Target
                                        size={21}
                                    />

                                </div>

                                <strong>
                                    No goals added yet
                                </strong>

                                <p>
                                    Create a clear goal so
                                    Ascendra can connect your
                                    skills with the right expert.
                                </p>

                            </div>

                        ) : (

                            goals.map(
                                (
                                    goal,
                                    index
                                ) => {

                                    const goalId =
                                        goal?.id ||
                                        goal?.goalId ||
                                        index;

                                    return (

                                        <div
                                            className="goal-item-row"
                                            key={
                                                goalId
                                            }
                                        >

                                            <div className="goal-item-icon">

                                                <Target
                                                    size={18}
                                                />

                                            </div>

                                            <div className="goal-item-content">

                                                <strong>
                                                    {getGoalTitle(
                                                        goal
                                                    )}
                                                </strong>

                                                <p>
                                                    {getGoalDescription(
                                                        goal
                                                    ) ||
                                                        "No description added."}
                                                </p>

                                                {goal?.status && (

                                                    <span className="goal-status">
                                                        {String(
                                                            goal.status
                                                        )}
                                                    </span>

                                                )}

                                            </div>

                                            <button
                                                type="button"
                                                className="icon-delete-button"
                                                onClick={() =>
                                                    handleDeleteGoal(
                                                        goal
                                                    )
                                                }
                                                disabled={
                                                    deletingId ===
                                                    `goal-${goalId}`
                                                }
                                                aria-label="Delete goal"
                                            >

                                                {deletingId ===
                                                `goal-${goalId}` ? (

                                                    <Loader2
                                                        size={17}
                                                        className="spin"
                                                    />

                                                ) : (

                                                    <Trash2
                                                        size={17}
                                                    />

                                                )}

                                            </button>

                                        </div>

                                    );

                                }
                            )

                        )}

                    </div>

                </section>

                <section className="onboarding-complete-card">

                    <div className="complete-icon">

                        <Sparkles
                            size={24}
                        />

                    </div>

                    <div className="complete-content">

                        <span className="onboarding-card-eyebrow">
                            READY WHEN YOU ARE
                        </span>

                        <h2>
                            Your learning profile
                            is taking shape.
                        </h2>

                        <p>
                            Your information, skills
                            and goals are connected
                            to your learner account.
                            You can update them anytime.
                        </p>

                    </div>

                    <button
                        type="button"
                        className="primary-button complete-button"
                        onClick={
                            finishOnboarding
                        }
                        disabled={
                            savingProfile ||
                            savingSkill ||
                            savingGoal ||
                            savingIdentity ||
                            uploadingPhoto
                        }
                    >

                        <Check
                            size={17}
                        />

                        Save and go to dashboard

                        <ArrowRight
                            size={17}
                        />

                    </button>

                </section>

                {!embedded && (

                    <div className="onboarding-footer">

                        <div>

                            <Check
                                size={15}
                            />

                            Your profile is securely
                            linked to your account.

                        </div>

                        <span>
                            Ascendra Learning Workspace
                        </span>

                    </div>

                )}

            </main>

        </div>
    );
}

export default LearnerOnboarding;