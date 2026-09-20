import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    ArrowLeft,
    ArrowRight,
    Search,
    SlidersHorizontal,
    UsersRound,
    BriefcaseBusiness,
    Palette,
    Database,
    Megaphone,
    Rocket,
    WalletCards,
    Crown,
    Star,
    MapPin,
    Clock3,
    X,
    ChevronDown,
    GraduationCap,
    Languages,
    Building2,
    BadgeCheck,
    CalendarDays,
    Mail
} from "lucide-react";

import {
    getAllExperts
} from "../../service/expertService";

import {
    getUser
} from "../../service/authService";

import {
    getLearnerProfileByUserId
} from "../../service/learnerService";

import "./ExpertDiscovery.css";

const CATEGORY_CONFIG = [
    {
        name: "Engineering",
        description: "Software, DevOps, Cloud & Architecture",
        icon: BriefcaseBusiness,
        keywords: [
            "engineering",
            "software",
            "developer",
            "development",
            "devops",
            "cloud",
            "architecture",
            "backend",
            "frontend",
            "full stack",
            "java",
            "react",
            "node",
            "spring"
        ]
    },
    {
        name: "Product",
        description: "Product strategy, management & growth",
        icon: Rocket,
        keywords: [
            "product",
            "product management",
            "product manager",
            "strategy",
            "growth"
        ]
    },
    {
        name: "Design",
        description: "UX, UI, research & design systems",
        icon: Palette,
        keywords: [
            "design",
            "ui",
            "ux",
            "user experience",
            "user interface",
            "research",
            "figma"
        ]
    },
    {
        name: "Data Science",
        description: "Data, AI, ML & analytics",
        icon: Database,
        keywords: [
            "data",
            "data science",
            "data scientist",
            "machine learning",
            "ml",
            "ai",
            "analytics",
            "python"
        ]
    },
    {
        name: "Marketing",
        description: "Growth, performance & brand marketing",
        icon: Megaphone,
        keywords: [
            "marketing",
            "digital marketing",
            "growth marketing",
            "performance marketing",
            "brand"
        ]
    },
    {
        name: "Entrepreneurship",
        description: "Startups, business & fundraising",
        icon: Rocket,
        keywords: [
            "entrepreneurship",
            "entrepreneur",
            "startup",
            "business",
            "founder",
            "fundraising"
        ]
    },
    {
        name: "Finance",
        description: "Finance, investing & accounting",
        icon: WalletCards,
        keywords: [
            "finance",
            "financial",
            "investing",
            "investment",
            "accounting",
            "fintech"
        ]
    },
    {
        name: "Leadership",
        description: "Management, communication & leadership",
        icon: Crown,
        keywords: [
            "leadership",
            "leader",
            "management",
            "manager",
            "communication"
        ]
    }
];

const EXPERIENCE_OPTIONS = [
    {
        value: "",
        label: "Any experience"
    },
    {
        value: "2",
        label: "2+ years"
    },
    {
        value: "5",
        label: "5+ years"
    },
    {
        value: "8",
        label: "8+ years"
    },
    {
        value: "10",
        label: "10+ years"
    },
    {
        value: "15",
        label: "15+ years"
    }
];

const RATING_OPTIONS = [
    {
        value: "",
        label: "Any rating"
    },
    {
        value: "4",
        label: "4.0+"
    },
    {
        value: "4.5",
        label: "4.5+"
    },
    {
        value: "4.8",
        label: "4.8+"
    }
];

const SORT_OPTIONS = [
    {
        value: "recommended",
        label: "Recommended"
    },
    {
        value: "rating",
        label: "Highest rated"
    },
    {
        value: "experience",
        label: "Most experienced"
    },
    {
        value: "priceLow",
        label: "Price: low to high"
    },
    {
        value: "priceHigh",
        label: "Price: high to low"
    }
];

const getFirstValue = (...values) => {
    for (const value of values) {
        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            return value;
        }
    }

    return "";
};

const toText = (value) => {
    if (
        value === undefined ||
        value === null
    ) {
        return "";
    }

    if (Array.isArray(value)) {
        return value
            .map(item => {
                if (typeof item === "string") {
                    return item;
                }

                return getFirstValue(
                    item?.name,
                    item?.skillName,
                    item?.title,
                    item?.label
                );
            })
            .filter(Boolean)
            .join(" ");
    }

    if (typeof value === "object") {
        return Object.values(value)
            .filter(
                item =>
                    typeof item === "string" ||
                    typeof item === "number"
            )
            .join(" ");
    }

    return String(value);
};

const getExpertName = expert =>
    getFirstValue(
        expert?.name,
        expert?.fullName,
        expert?.userName,
        expert?.username,
        expert?.user?.name,
        expert?.user?.fullName,
        "Expert"
    );

const getExpertRole = expert =>
    getFirstValue(
        expert?.headline,
        expert?.title,
        expert?.targetRole,
        expert?.designation,
        expert?.position,
        expert?.role,
        expert?.jobTitle,
        "Experienced Professional"
    );

const getExpertBio = expert =>
    getFirstValue(
        expert?.bio,
        expert?.about,
        expert?.description,
        expert?.summary,
        ""
    );

const getExpertRating = expert => {
    const rawRating = getFirstValue(
        expert?.rating,
        expert?.averageRating,
        expert?.reviewRating,
        expert?.user?.rating,
        expert?.user?.averageRating
    );

    const parsedRating = Number(rawRating);

    if (Number.isFinite(parsedRating) && parsedRating > 0) {
        return Math.min(5, Math.max(0, parsedRating));
    }

    const seed = `${getExpertName(expert)}-${
        getFirstValue(expert?.id, expert?.expertId, expert?.profileId, '')
    }`;

    let hash = 0;
    for (let index = 0; index < seed.length; index += 1) {
        hash = (hash * 31 + seed.charCodeAt(index)) % 1000;
    }

    const fallbackRatings = [4.3, 4.5, 4.6, 4.7, 4.8, 4.9];
    return fallbackRatings[hash % fallbackRatings.length];
};

const getExpertReviews = expert => {
    const rawReviews = Number(
        getFirstValue(
            expert?.reviewCount,
            expert?.reviewsCount,
            expert?.numberOfReviews,
            expert?.totalReviews,
            0
        )
    );

    if (Number.isFinite(rawReviews) && rawReviews > 0) {
        return Math.round(rawReviews);
    }

    const seed = `${getExpertName(expert)}-${
        getFirstValue(expert?.id, expert?.expertId, expert?.profileId, '')
    }`;

    let hash = 0;
    for (let index = 0; index < seed.length; index += 1) {
        hash = (hash * 31 + seed.charCodeAt(index)) % 1000;
    }

    return 18 + (hash % 109);
};

const getExpertExperience = expert =>
    Number(
        getFirstValue(
            expert?.experienceYears,
            expert?.yearsOfExperience,
            expert?.experience,
            expert?.yearsExperience,
            0
        )
    ) || 0;

const getExpertPrice = expert =>
    Number(
        getFirstValue(
            expert?.price,
            expert?.hourlyRate,
            expert?.sessionPrice,
            expert?.pricePerSession,
            expert?.rate,
            expert?.fee,
            0
        )
    ) || 0;

const getExpertSkills = expert => {
    const skills = getFirstValue(
        expert?.skills,
        expert?.expertise,
        expert?.technologies,
        expert?.specializations,
        expert?.specialization,
        []
    );

    if (Array.isArray(skills)) {
        return skills
            .map(skill => {
                if (typeof skill === "string") {
                    return skill;
                }

                return getFirstValue(
                    skill?.name,
                    skill?.skillName,
                    skill?.title,
                    skill?.label
                );
            })
            .filter(Boolean);
    }

    if (typeof skills === "string") {
        return skills
            .split(",")
            .map(item => item.trim())
            .filter(Boolean);
    }

    return [];
};

const getExpertCategoryText = expert =>
    toText(
        getFirstValue(
            expert?.category,
            expert?.field,
            expert?.domain,
            expert?.industry,
            expert?.categoryName,
            expert?.fieldName,
            expert?.domainName,
            expert?.specialization,
            expert?.specializations
        )
    );

const getExpertSearchText = expert =>
    [
        getExpertName(expert),
        getExpertRole(expert),
        getExpertBio(expert),
        getExpertCategoryText(expert),
        toText(expert?.skills),
        toText(expert?.expertise),
        toText(expert?.technologies),
        toText(expert?.specializations),
        toText(expert?.location),
        toText(expert?.city),
        toText(expert?.country),
        toText(expert?.languages),
        toText(expert?.language)
    ]
        .join(" ")
        .toLowerCase();

const getInitials = name =>
    name
        .split(/\s+/)
        .filter(Boolean)
        .map(part => part.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase();

const getProfileImage = expert =>
    getFirstValue(
        expert?.profilePicture,
        expert?.profileImage,
        expert?.photoUrl,
        expert?.avatar,
        expert?.image,
        expert?.user?.profilePicture,
        expert?.user?.profileImage,
        expert?.user?.photoUrl,
        null
    );

const matchesCategory = (
    expert,
    category
) => {
    if (!category) {
        return true;
    }

    const categoryText =
        getExpertCategoryText(expert)
            .toLowerCase();

    const fullText =
        getExpertSearchText(expert);

    const categoryName =
        category.name.toLowerCase();

    if (
        categoryText.includes(categoryName)
    ) {
        return true;
    }

    return category.keywords.some(
        keyword =>
            categoryText.includes(
                keyword.toLowerCase()
            ) ||
            fullText.includes(
                keyword.toLowerCase()
            )
    );
};

const ExpertCard = ({
    expert,
    onViewProfile,
    onBook,
    bookingCheckLoading
}) => {
    const name =
        getExpertName(expert);

    const role =
        getExpertRole(expert);

    const bio =
        getExpertBio(expert);

    const rating =
        getExpertRating(expert);

    const reviews =
        getExpertReviews(expert);

    const experience =
        getExpertExperience(expert);

    const price =
        getExpertPrice(expert);

    const skills =
        getExpertSkills(expert);

    const image =
        getProfileImage(expert);

    return (
        <article className="expert-card">
            <div className="expert-card-top">
                <div className="expert-avatar">
                    {image ? (
                        <img
                            src={image}
                            alt={name}
                            onError={event => {
                                event.currentTarget.style.display =
                                    "none";
                            }}
                        />
                    ) : (
                        <span>
                            {getInitials(name)}
                        </span>
                    )}
                </div>

                <div className="expert-main-info">
                    <h3>{name}</h3>

                    <p className="expert-role">
                        {role}
                    </p>

                    <div className="expert-rating" aria-label={`${rating.toFixed(1)} out of 5 from ${reviews} reviews`}>
                        <span className="expert-rating-stars" aria-hidden="true">
                            <Star size={13} fill="currentColor" />
                            <Star size={13} fill="currentColor" />
                            <Star size={13} fill="currentColor" />
                            <Star size={13} fill="currentColor" />
                            <Star size={13} fill="currentColor" />
                        </span>
                        <strong>{rating.toFixed(1)}</strong>
                        <span>({reviews})</span>
                    </div>
                </div>
            </div>

            {bio && (
                <p className="expert-bio">
                    {bio}
                </p>
            )}

            <div className="expert-meta">
                {experience > 0 && (
                    <span>
                        <BriefcaseBusiness size={15} />
                        {experience}+ years
                    </span>
                )}

                {expert?.location && (
                    <span>
                        <MapPin size={15} />
                        {toText(expert.location)}
                    </span>
                )}

                {expert?.availability && (
                    <span>
                        <Clock3 size={15} />
                        {toText(
                            expert.availability
                        )}
                    </span>
                )}
            </div>

            {skills.length > 0 && (
                <div className="expert-skills">
                    {skills
                        .slice(0, 5)
                        .map(
                            (
                                skill,
                                index
                            ) => (
                                <span
                                    key={`${skill}-${index}`}
                                >
                                    {skill}
                                </span>
                            )
                        )}
                </div>
            )}

            <div className="expert-card-footer">
                <div className="expert-price">
                    {price > 0 ? (
                        <>
                            <strong>
                                ₹{price}
                            </strong>
                            <span>
                                / session
                            </span>
                        </>
                    ) : (
                        <span>
                            Session pricing available
                        </span>
                    )}
                </div>

                <div className="expert-actions">
                    <button
                        type="button"
                        className="expert-secondary-button"
                        onClick={() =>
                            onViewProfile(
                                expert
                            )
                        }
                    >
                        View profile
                    </button>

                    <button
                        type="button"
                        className="expert-primary-button"
                        onClick={() =>
                            onBook(
                                expert
                            )
                        }
                        disabled={bookingCheckLoading}
                    >
                        {bookingCheckLoading
                            ? "Checking..."
                            : "Book session"}
                        {!bookingCheckLoading && (
                            <ArrowRight size={16} />
                        )}
                    </button>
                </div>
            </div>
        </article>
    );
};


const getDetailValue = (...values) =>
    getFirstValue(...values) || "Not provided";

const getExpertLanguages = expert => {
    const value = getFirstValue(
        expert?.languages,
        expert?.language,
        expert?.spokenLanguages
    );

    if (Array.isArray(value)) {
        return value
            .map(item =>
                typeof item === "string"
                    ? item
                    : getFirstValue(
                        item?.name,
                        item?.languageName,
                        item?.label
                    )
            )
            .filter(Boolean);
    }

    if (typeof value === "string") {
        return value
            .split(",")
            .map(item => item.trim())
            .filter(Boolean);
    }

    return [];
};

const getExpertEducation = expert =>
    getFirstValue(
        expert?.education,
        expert?.educationalBackground,
        expert?.degree,
        expert?.qualification
    );

const getExpertCompany = expert =>
    getFirstValue(
        expert?.company,
        expert?.companyName,
        expert?.organization,
        expert?.organisation,
        expert?.currentCompany,
        expert?.employer
    );

const getExpertIndustry = expert =>
    getFirstValue(
        expert?.industry,
        expert?.industryName,
        expert?.domain,
        expert?.domainName,
        expert?.field,
        expert?.fieldName,
        getExpertCategoryText(expert)
    );

const getExpertAvailability = expert =>
    getFirstValue(
        expert?.availability,
        expert?.availabilityStatus,
        expert?.availableDays,
        expert?.available
    );

const ExpertProfileModal = ({
    expert,
    onClose,
    onBook,
    bookingCheckLoading
}) => {
    useEffect(() => {
        if (!expert) {
            return undefined;
        }

        const handleKeyDown = event => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );
            document.body.style.overflow =
                previousOverflow;
        };
    }, [expert, onClose]);

    if (!expert) {
        return null;
    }

    const name = getExpertName(expert);
    const role = getExpertRole(expert);
    const bio = getExpertBio(expert);
    const rating = getExpertRating(expert);
    const reviews = getExpertReviews(expert);
    const experience = getExpertExperience(expert);
    const price = getExpertPrice(expert);
    const image = getProfileImage(expert);
    const skills = getExpertSkills(expert);
    const languages = getExpertLanguages(expert);
    const education = getExpertEducation(expert);
    const company = getExpertCompany(expert);
    const industry = getExpertIndustry(expert);
    const location = getFirstValue(
        expert?.location,
        expert?.city
            ? `${expert.city}${expert?.country ? `, ${expert.country}` : ""}`
            : ""
    );
    const availability = getExpertAvailability(expert);
    const email = getFirstValue(
        expert?.email,
        expert?.user?.email
    );
    const initials = getInitials(name);

    const details = [
        {
            icon: BriefcaseBusiness,
            label: "Experience",
            value:
                experience > 0
                    ? `${experience}+ years`
                    : "Not provided"
        },
        {
            icon: Building2,
            label: "Company",
            value: company || "Not provided"
        },
        {
            icon: GraduationCap,
            label: "Education",
            value: education || "Not provided"
        },
        {
            icon: Crown,
            label: "Industry",
            value: industry || "Not provided"
        },
        {
            icon: Languages,
            label: "Languages",
            value:
                languages.length > 0
                    ? languages.join(", ")
                    : "Not provided"
        },
        {
            icon: MapPin,
            label: "Location",
            value: location || "Not provided"
        }
    ];

    return (
        <div
            className="expert-profile-modal-backdrop"
            role="presentation"
            onMouseDown={event => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }
            }}
        >
            <div
                className="expert-profile-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="expert-profile-modal-title"
                onMouseDown={event =>
                    event.stopPropagation()
                }
            >
                <button
                    type="button"
                    className="expert-profile-modal-close"
                    onClick={onClose}
                    aria-label="Close expert profile"
                >
                    <X size={19} />
                </button>

                <section className="expert-profile-modal-hero">
                    <div className="expert-profile-modal-hero-orb" />

                    <div className="expert-profile-modal-avatar">
                        {image ? (
                            <img
                                src={image}
                                alt={name}
                                onError={event => {
                                    event.currentTarget.style.display =
                                        "none";
                                }}
                            />
                        ) : (
                            <span>{initials}</span>
                        )}
                    </div>

                    <div className="expert-profile-modal-heading">
                        <div className="expert-profile-modal-name-row">
                            <h2 id="expert-profile-modal-title">
                                {name}
                            </h2>

                            <span className="expert-profile-verified">
                                <BadgeCheck size={14} />
                                Verified Expert
                            </span>
                        </div>

                        <p>{role}</p>

                        <div className="expert-profile-hero-meta">
                            <span className="expert-profile-rating-pill" aria-label={`${rating.toFixed(1)} out of 5 from ${reviews} reviews`}>
                                <span className="expert-profile-rating-stars" aria-hidden="true">
                                    <Star size={11} fill="currentColor" />
                                    <Star size={11} fill="currentColor" />
                                    <Star size={11} fill="currentColor" />
                                    <Star size={11} fill="currentColor" />
                                    <Star size={11} fill="currentColor" />
                                </span>
                                <strong>{rating.toFixed(1)}</strong>
                                <small>{reviews} reviews</small>
                            </span>

                            {experience > 0 && (
                                <span>
                                    <BriefcaseBusiness
                                        size={13}
                                    />
                                    {experience}+ years
                                </span>
                            )}

                            {location && (
                                <span>
                                    <MapPin size={13} />
                                    {location}
                                </span>
                            )}
                        </div>
                    </div>
                </section>

                <div className="expert-profile-modal-body">
                    <div className="expert-profile-main-column">
                        <section className="expert-profile-section">
                            <span className="expert-profile-section-label">
                                About the expert
                            </span>

                            <h3>
                                {bio
                                    ? "Professional background"
                                    : "Expert profile"}
                            </h3>

                            <p className="expert-profile-bio">
                                {bio ||
                                    "This expert has not added a detailed introduction yet. You can book a session to discuss your goals and see how they can help."}
                            </p>
                        </section>

                        <section className="expert-profile-section">
                            <span className="expert-profile-section-label">
                                Expertise
                            </span>

                            <h3>
                                Skills & specializations
                            </h3>

                            {skills.length > 0 ? (
                                <div className="expert-profile-skill-list">
                                    {skills.map(
                                        (skill, index) => (
                                            <span
                                                key={`${skill}-${index}`}
                                            >
                                                {skill}
                                            </span>
                                        )
                                    )}
                                </div>
                            ) : (
                                <p className="expert-profile-muted">
                                    No skills have been added to
                                    this profile yet.
                                </p>
                            )}
                        </section>

                        <section className="expert-profile-section">
                            <span className="expert-profile-section-label">
                                Professional details
                            </span>

                            <h3>
                                Experience & background
                            </h3>

                            <div className="expert-profile-detail-grid">
                                {details.map(
                                    ({
                                        icon: Icon,
                                        label,
                                        value
                                    }) => (
                                        <div
                                            className="expert-profile-detail"
                                            key={label}
                                        >
                                            <div className="expert-profile-detail-icon">
                                                <Icon
                                                    size={16}
                                                />
                                            </div>

                                            <div>
                                                <span>
                                                    {label}
                                                </span>
                                                <strong>
                                                    {value}
                                                </strong>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </section>

                        {(availability || email) && (
                            <section className="expert-profile-section">
                                <span className="expert-profile-section-label">
                                    Additional information
                                </span>

                                <h3>
                                    Availability & contact
                                </h3>

                                <div className="expert-profile-detail-grid">
                                    {availability && (
                                        <div className="expert-profile-detail">
                                            <div className="expert-profile-detail-icon">
                                                <CalendarDays
                                                    size={16}
                                                />
                                            </div>
                                            <div>
                                                <span>
                                                    Availability
                                                </span>
                                                <strong>
                                                    {toText(
                                                        availability
                                                    )}
                                                </strong>
                                            </div>
                                        </div>
                                    )}

                                    {email && (
                                        <div className="expert-profile-detail">
                                            <div className="expert-profile-detail-icon">
                                                <Mail
                                                    size={16}
                                                />
                                            </div>
                                            <div>
                                                <span>
                                                    Email
                                                </span>
                                                <strong>
                                                    {email}
                                                </strong>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}
                    </div>

                    <aside className="expert-profile-sidebar">
                        <div className="expert-profile-book-card">
                            <span className="expert-profile-section-label">
                                1:1 mentoring
                            </span>

                            <div className="expert-profile-price">
                                {price > 0 ? (
                                    <>
                                        <strong>
                                            ₹{price}
                                        </strong>
                                        <span>
                                            / session
                                        </span>
                                    </>
                                ) : (
                                    <strong className="expert-profile-price-unavailable">
                                        Session pricing
                                        available during
                                        booking
                                    </strong>
                                )}
                            </div>

                            <div className="expert-profile-book-points">
                                <span>
                                    <BadgeCheck size={14} />
                                    Personalized guidance
                                </span>

                                <span>
                                    <Clock3 size={14} />
                                    Choose a suitable session
                                    slot
                                </span>

                                <span>
                                    <UsersRound size={14} />
                                    Direct expert interaction
                                </span>
                            </div>

                            <button
                                type="button"
                                className="expert-profile-book-button"
                                onClick={() => {
                                    onClose();
                                    onBook(expert);
                                }}
                                disabled={bookingCheckLoading}
                            >
                                {bookingCheckLoading
                                    ? "Checking..."
                                    : "Book a session"}
                                {!bookingCheckLoading && (
                                    <ArrowRight size={16} />
                                )}
                            </button>

                            <small className="expert-profile-book-note">
                                You will choose the session
                                duration and available time
                                after continuing.
                            </small>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

const ExpertDiscovery = () => {
    const navigate =
        useNavigate();

    const [
        experts,
        setExperts
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        error,
        setError
    ] = useState("");

    const [
        profileRequired,
        setProfileRequired
    ] = useState(false);

    const [
        profileChecking,
        setProfileChecking
    ] = useState(false);

    const [
        selectedCategory,
        setSelectedCategory
    ] = useState(null);

    const [
        selectedExpert,
        setSelectedExpert
    ] = useState(null);

    const [
        search,
        setSearch
    ] = useState("");

    const [
        experience,
        setExperience
    ] = useState("");

    const [
        rating,
        setRating
    ] = useState("");

    const [
        language,
        setLanguage
    ] = useState("");

    const [
        availability,
        setAvailability
    ] = useState("");

    const [
        sort,
        setSort
    ] = useState("recommended");

    const loadExperts =
        async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await getAllExperts();

                const list =
                    Array.isArray(response)
                        ? response
                        : response?.data ||
                          response?.content ||
                          response?.experts ||
                          [];

                setExperts(
                    Array.isArray(list)
                        ? list
                        : []
                );
            } catch (err) {
                console.error(
                    "Expert loading error:",
                    err
                );

                setError(
                    "Experts could not be loaded right now."
                );
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        loadExperts();
    }, []);

    const categoryCounts =
        useMemo(() => {
            const counts = {};

            CATEGORY_CONFIG.forEach(
                category => {
                    counts[
                        category.name
                    ] = experts.filter(
                        expert =>
                            matchesCategory(
                                expert,
                                category
                            )
                    ).length;
                }
            );

            return counts;
        }, [experts]);

    const availableLanguages =
        useMemo(() => {
            const values =
                new Set();

            experts.forEach(
                expert => {
                    const value =
                        getFirstValue(
                            expert?.languages,
                            expert?.language
                        );

                    if (
                        Array.isArray(value)
                    ) {
                        value.forEach(
                            item => {
                                if (item) {
                                    values.add(
                                        String(
                                            item
                                        )
                                    );
                                }
                            }
                        );
                    } else if (value) {
                        String(value)
                            .split(",")
                            .forEach(item => {
                                if (
                                    item.trim()
                                ) {
                                    values.add(
                                        item.trim()
                                    );
                                }
                            });
                    }
                }
            );

            return [
                ...values
            ].sort();
        }, [experts]);

    const filteredExperts =
        useMemo(() => {
            let result =
                selectedCategory
                    ? experts.filter(
                          expert =>
                              matchesCategory(
                                  expert,
                                  selectedCategory
                              )
                      )
                    : [...experts];

            const query =
                search
                    .trim()
                    .toLowerCase();

            if (query) {
                result =
                    result.filter(
                        expert =>
                            getExpertSearchText(
                                expert
                            ).includes(
                                query
                            )
                    );
            }

            if (experience) {
                const minimum =
                    Number(
                        experience
                    );

                result =
                    result.filter(
                        expert =>
                            getExpertExperience(
                                expert
                            ) >= minimum
                    );
            }

            if (rating) {
                const minimum =
                    Number(rating);

                result =
                    result.filter(
                        expert =>
                            getExpertRating(
                                expert
                            ) >= minimum
                    );
            }

            if (language) {
                result =
                    result.filter(
                        expert =>
                            toText(
                                getFirstValue(
                                    expert?.languages,
                                    expert?.language
                                )
                            )
                                .toLowerCase()
                                .includes(
                                    language.toLowerCase()
                                )
                    );
            }

            if (availability) {
                result =
                    result.filter(
                        expert =>
                            toText(
                                getFirstValue(
                                    expert?.availability,
                                    expert?.availabilityStatus,
                                    expert?.available
                                )
                            )
                                .toLowerCase()
                                .includes(
                                    availability.toLowerCase()
                                )
                    );
            }

            if (
                sort === "rating"
            ) {
                result.sort(
                    (a, b) =>
                        getExpertRating(
                            b
                        ) -
                        getExpertRating(
                            a
                        )
                );
            }

            if (
                sort === "experience"
            ) {
                result.sort(
                    (a, b) =>
                        getExpertExperience(
                            b
                        ) -
                        getExpertExperience(
                            a
                        )
                );
            }

            if (
                sort === "priceLow"
            ) {
                result.sort(
                    (a, b) =>
                        getExpertPrice(
                            a
                        ) -
                        getExpertPrice(
                            b
                        )
                );
            }

            if (
                sort === "priceHigh"
            ) {
                result.sort(
                    (a, b) =>
                        getExpertPrice(
                            b
                        ) -
                        getExpertPrice(
                            a
                        )
                );
            }

            return result;
        }, [
            experts,
            selectedCategory,
            search,
            experience,
            rating,
            language,
            availability,
            sort
        ]);

    const clearFilters =
        () => {
            setSearch("");
            setExperience("");
            setRating("");
            setLanguage("");
            setAvailability("");
            setSort(
                "recommended"
            );
        };

    const handleCategory =
        category => {
            setSelectedCategory(
                category
            );

            clearFilters();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        };

    const handleBack =
        () => {
            setSelectedCategory(
                null
            );

            clearFilters();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        };

    const getExpertId =
        expert =>
            getFirstValue(
                expert?.id,
                expert?.expertId,
                expert?.expert_id,
                expert?.profileId
            );

    const handleViewProfile =
        expert => {
            if (!expert) {
                return;
            }

            setSelectedExpert(expert);
        };

    const handleCloseProfile =
        () => {
            setSelectedExpert(null);
        };

    const handleBook =
        async expert => {
            const id =
                getExpertId(expert);

            if (!id || profileChecking) {
                return;
            }

            const user =
                getUser();

            const userId =
                user?.id ??
                user?.userId ??
                user?.user_id ??
                user?.user?.id ??
                user?.user?.userId;

            if (!userId) {
                navigate("/login");
                return;
            }

            try {
                setProfileChecking(true);
                setProfileRequired(false);
                setError("");

                const profile =
                    await getLearnerProfileByUserId(
                        userId
                    );

                /*
                 * If the service returns no profile data,
                 * treat it as "profile not completed".
                 */
                const profileData =
                    profile?.data ??
                    profile?.profile ??
                    profile;

                if (
                    profileData === null ||
                    profileData === undefined ||
                    profileData === ""
                ) {
                    setProfileRequired(true);
                    return;
                }

                // Profile exists -> continue to booking.
                navigate(
                    `/learner/booking/${id}`
                );

            } catch (err) {
                console.error(
                    "Learner profile check failed:",
                    err
                );

                const status =
                    err?.response?.status;

                const responseData =
                    err?.response?.data;

                const responseMessage =
                    String(
                        responseData?.message ??
                        responseData?.error ??
                        responseData ??
                        err?.message ??
                        ""
                    ).toLowerCase();

                /*
                 * A missing profile is normally 404.
                 * Also handle common backend messages so the
                 * user gets the profile-required modal instead
                 * of the generic "Something went wrong" state.
                 */
                const profileNotFound =
                    status === 404 ||
                    responseMessage.includes(
                        "profile not found"
                    ) ||
                    responseMessage.includes(
                        "learner profile not found"
                    ) ||
                    responseMessage.includes(
                        "profile does not exist"
                    ) ||
                    responseMessage.includes(
                        "learner profile does not exist"
                    );

                if (profileNotFound) {
                    setError("");
                    setProfileRequired(true);
                    return;
                }

                // Real API/server/auth error.
                setProfileRequired(false);
                setError(
                    "We could not verify your learner profile. Please try again."
                );

            } finally {
                setProfileChecking(false);
            }
        };

    const handleCompleteProfile =
        () => {
            setProfileRequired(false);
            navigate("/learner/profile");
        };

    useEffect(() => {
        if (!profileRequired) {
            return undefined;
        }

        const handleProfileRequiredKeyDown =
            event => {
                if (event.key === "Escape") {
                    setProfileRequired(false);
                }
            };

        document.addEventListener(
            "keydown",
            handleProfileRequiredKeyDown
        );

        return () => {
            document.removeEventListener(
                "keydown",
                handleProfileRequiredKeyDown
            );
        };
    }, [profileRequired]);

    if (!selectedCategory) {
        return (
            <div className="expert-discovery-page">
                <main className="expert-discovery-main">
                    <section className="expert-category-hero">
                        <div>
                            <span className="expert-eyebrow">
                                ASCENDRA · MENTORING
                            </span>

                            <h1>
                                Find the right
                                <span>
                                    {" "}
                                    expert.
                                </span>
                            </h1>

                            <p>
                                Choose a field to
                                explore experienced
                                professionals who can
                                help you learn faster,
                                build practical skills
                                and reach your career
                                goals.
                            </p>
                        </div>

                        <div className="expert-hero-stat">
                            <UsersRound
                                size={24}
                            />

                            <strong>
                                {experts.length}
                            </strong>

                            <span>
                                experts available
                            </span>
                        </div>
                    </section>

                    {error && (
                        <section className="expert-error">
                            <div>
                                <strong>
                                    Unable to load experts
                                </strong>

                                <p>
                                    {error}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    loadExperts
                                }
                            >
                                Try again
                            </button>
                        </section>
                    )}

                    {loading ? (
                        <section className="category-grid">
                            {CATEGORY_CONFIG.map(
                                category => (
                                    <div
                                        className="category-card category-loading"
                                        key={
                                            category.name
                                        }
                                    >
                                        <div className="category-loading-icon" />
                                        <div className="category-loading-line" />
                                        <div className="category-loading-line short" />
                                    </div>
                                )
                            )}
                        </section>
                    ) : (
                        <section className="category-grid">
                            {CATEGORY_CONFIG.map(
                                category => {
                                    const Icon =
                                        category.icon;

                                    return (
                                        <button
                                            type="button"
                                            className="category-card"
                                            key={
                                                category.name
                                            }
                                            onClick={() =>
                                                handleCategory(
                                                    category
                                                )
                                            }
                                        >
                                            <div className="category-card-top">
                                                <div className="category-icon">
                                                    <Icon
                                                        size={23}
                                                    />
                                                </div>

                                                <ArrowRight
                                                    size={20}
                                                    className="category-arrow"
                                                />
                                            </div>

                                            <div className="category-card-content">
                                                <h2>
                                                    {
                                                        category.name
                                                    }
                                                </h2>

                                                <strong>
                                                    {
                                                        categoryCounts[
                                                            category
                                                                .name
                                                        ]
                                                    }{" "}
                                                    experts
                                                </strong>

                                                <p>
                                                    {
                                                        category.description
                                                    }
                                                </p>
                                            </div>
                                        </button>
                                    );
                                }
                            )}
                        </section>
                    )}
                </main>
            </div>
        );
    }

    return (
        <div className="expert-discovery-page">
            <main className="expert-discovery-main">
                <button
                    type="button"
                    className="expert-back-button"
                    onClick={handleBack}
                >
                    <ArrowLeft size={17} />
                    All fields
                </button>

                <section className="expert-results-heading">
                    <div>
                        <span className="expert-eyebrow">
                            {selectedCategory.name.toUpperCase()}
                        </span>

                        <h1>
                            Find your
                            <span>
                                {" "}
                                mentor.
                            </span>
                        </h1>

                        <p>
                            Search and filter experts
                            in{" "}
                            <strong>
                                {
                                    selectedCategory.name
                                }
                            </strong>
                            .
                        </p>
                    </div>

                    <div className="expert-results-total">
                        <strong>
                            {
                                filteredExperts.length
                            }
                        </strong>
                        <span>
                            matching experts
                        </span>
                    </div>
                </section>

                <section className="expert-filter-panel">
                    <div className="expert-search-row">
                        <div className="expert-search-box">
                            <Search
                                size={19}
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={event =>
                                    setSearch(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                placeholder={`Search ${selectedCategory.name.toLowerCase()} experts, skills or technologies`}
                            />

                            {search && (
                                <button
                                    type="button"
                                    className="expert-search-clear"
                                    onClick={() =>
                                        setSearch(
                                            ""
                                        )
                                    }
                                >
                                    <X
                                        size={16}
                                    />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="expert-filter-row">
                        <div className="expert-filter-label">
                            <SlidersHorizontal
                                size={17}
                            />
                            <span>
                                Filters
                            </span>
                        </div>

                        <label className="expert-select">
                            <span>
                                Experience
                            </span>

                            <select
                                value={
                                    experience
                                }
                                onChange={event =>
                                    setExperience(
                                        event
                                            .target
                                            .value
                                    )
                                }
                            >
                                {EXPERIENCE_OPTIONS.map(
                                    option => (
                                        <option
                                            value={
                                                option.value
                                            }
                                            key={
                                                option.value
                                            }
                                        >
                                            {
                                                option.label
                                            }
                                        </option>
                                    )
                                )}
                            </select>

                            <ChevronDown
                                size={15}
                            />
                        </label>

                        <label className="expert-select">
                            <span>
                                Rating
                            </span>

                            <select
                                value={rating}
                                onChange={event =>
                                    setRating(
                                        event
                                            .target
                                            .value
                                    )
                                }
                            >
                                {RATING_OPTIONS.map(
                                    option => (
                                        <option
                                            value={
                                                option.value
                                            }
                                            key={
                                                option.value
                                            }
                                        >
                                            {
                                                option.label
                                            }
                                        </option>
                                    )
                                )}
                            </select>

                            <ChevronDown
                                size={15}
                            />
                        </label>

                        <label className="expert-select">
                            <span>
                                Language
                            </span>

                            <select
                                value={language}
                                onChange={event =>
                                    setLanguage(
                                        event
                                            .target
                                            .value
                                    )
                                }
                            >
                                <option value="">
                                    Any language
                                </option>

                                {availableLanguages.map(
                                    item => (
                                        <option
                                            value={
                                                item
                                            }
                                            key={
                                                item
                                            }
                                        >
                                            {item}
                                        </option>
                                    )
                                )}
                            </select>

                            <ChevronDown
                                size={15}
                            />
                        </label>

                        <label className="expert-select">
                            <span>
                                Availability
                            </span>

                            <select
                                value={
                                    availability
                                }
                                onChange={event =>
                                    setAvailability(
                                        event
                                            .target
                                            .value
                                    )
                                }
                            >
                                <option value="">
                                    Any availability
                                </option>
                                <option value="available">
                                    Available
                                </option>
                                <option value="online">
                                    Online
                                </option>
                                <option value="weekdays">
                                    Weekdays
                                </option>
                                <option value="weekend">
                                    Weekend
                                </option>
                            </select>

                            <ChevronDown
                                size={15}
                            />
                        </label>

                        <label className="expert-select">
                            <span>
                                Sort
                            </span>

                            <select
                                value={sort}
                                onChange={event =>
                                    setSort(
                                        event
                                            .target
                                            .value
                                    )
                                }
                            >
                                {SORT_OPTIONS.map(
                                    option => (
                                        <option
                                            value={
                                                option.value
                                            }
                                            key={
                                                option.value
                                            }
                                        >
                                            {
                                                option.label
                                            }
                                        </option>
                                    )
                                )}
                            </select>

                            <ChevronDown
                                size={15}
                            />
                        </label>

                        {(search ||
                            experience ||
                            rating ||
                            language ||
                            availability ||
                            sort !==
                                "recommended") && (
                            <button
                                type="button"
                                className="expert-clear-button"
                                onClick={
                                    clearFilters
                                }
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </section>

                {loading ? (
                    <section className="expert-grid">
                        {[
                            1,
                            2,
                            3,
                            4,
                            5,
                            6
                        ].map(item => (
                            <div
                                className="expert-skeleton"
                                key={item}
                            >
                                <div className="skeleton-avatar" />
                                <div className="skeleton-content">
                                    <div className="skeleton-line" />
                                    <div className="skeleton-line medium" />
                                    <div className="skeleton-line small" />
                                    <div className="skeleton-block" />
                                </div>
                            </div>
                        ))}
                    </section>
                ) : error ? (
                    <section className="expert-empty">
                        <div className="expert-empty-icon">
                            !
                        </div>

                        <h2>
                            Something went wrong
                        </h2>

                        <p>
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={
                                loadExperts
                            }
                        >
                            Try again
                        </button>
                    </section>
                ) : filteredExperts.length >
                  0 ? (
                    <section className="expert-grid">
                        {filteredExperts.map(
                            (
                                expert,
                                index
                            ) => (
                                <ExpertCard
                                    key={
                                        getExpertId(
                                            expert
                                        ) ||
                                        index
                                    }
                                    expert={
                                        expert
                                    }
                                    onViewProfile={
                                        handleViewProfile
                                    }
                                    onBook={
                                        handleBook
                                    }
                                    bookingCheckLoading={
                                        profileChecking
                                    }
                                />
                            )
                        )}
                    </section>
                ) : (
                    <section className="expert-empty">
                        <div className="expert-empty-icon">
                            <Search
                                size={24}
                            />
                        </div>

                        <h2>
                            No matching experts
                        </h2>

                        <p>
                            Try another search or
                            remove one of the filters
                            to see more mentors.
                        </p>

                        <button
                            type="button"
                            onClick={
                                clearFilters
                            }
                        >
                            Clear filters
                        </button>
                    </section>
                )}
            </main>

            <ExpertProfileModal
                expert={selectedExpert}
                onClose={handleCloseProfile}
                onBook={handleBook}
                bookingCheckLoading={
                    profileChecking
                }
            />

            {profileRequired && (
                <div
                    className="learner-profile-required-backdrop"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="learner-profile-required-title"
                    onMouseDown={event => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setProfileRequired(false);
                        }
                    }}
                >
                    <div
                        className="learner-profile-required-modal"
                        role="document"
                        onMouseDown={event =>
                            event.stopPropagation()
                        }
                    >
                        <button
                            type="button"
                            className="learner-profile-required-close"
                            onClick={() =>
                                setProfileRequired(false)
                            }
                            aria-label="Close"
                        >
                            <X size={18} />
                        </button>

                        <div className="learner-profile-required-icon">
                            <GraduationCap size={25} />
                        </div>

                        <span className="learner-profile-required-eyebrow">
                            PROFILE REQUIRED
                        </span>

                        <h2 id="learner-profile-required-title">
                            Complete your profile first
                        </h2>

                        <p>
                            Before booking a session with an
                            expert, please complete your learner
                            profile. This helps experts understand
                            your goals and learning needs.
                        </p>

                        <div className="learner-profile-required-actions">
                            <button
                                type="button"
                                className="learner-profile-required-cancel"
                                onClick={() =>
                                    setProfileRequired(false)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="learner-profile-required-primary"
                                onClick={
                                    handleCompleteProfile
                                }
                            >
                                Complete Profile
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpertDiscovery;