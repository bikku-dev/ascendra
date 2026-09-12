import React from "react";

const ExpertCard = ({
  expert,
  onViewProfile,
  onBook,
}) => {

  // =========================================================
  // EXPERT DATA
  // =========================================================

  const name =
    expert?.name ||
    expert?.userName ||
    expert?.fullName ||
    expert?.user?.name ||
    "Expert";


  const headline =
    expert?.headline ||
    expert?.targetRole ||
    expert?.designation ||
    expert?.title ||
    "Professional Expert";


  const bio =
    expert?.bio ||
    expert?.about ||
    expert?.description ||
    "Experienced professional ready to help you grow.";


  const experience = Number(
    expert?.experienceYears ??
    expert?.yearsOfExperience ??
    expert?.experience ??
    0
  );


  const rating = Number(
    expert?.rating ??
    expert?.averageRating ??
    0
  );


  const totalReviews =
    expert?.totalReviews ??
    expert?.reviewCount ??
    expert?.reviewsCount ??
    0;


  // =========================================================
  // SKILLS
  // =========================================================

  const rawSkills =
    expert?.skills ||
    expert?.expertise ||
    expert?.expertSkills ||
    [];


  const skills = Array.isArray(rawSkills)
    ? rawSkills
        .map((skill) => {

          if (typeof skill === "string") {
            return skill;
          }

          return (
            skill?.name ||
            skill?.skillName ||
            skill?.title ||
            skill?.skill?.name ||
            ""
          );

        })
        .filter(Boolean)
    : [];


  // =========================================================
  // AVATAR
  // =========================================================

  const avatar =
    expert?.profileImage ||
    expert?.profileImageUrl ||
    expert?.avatar ||
    expert?.avatarUrl ||
    expert?.imageUrl ||
    expert?.user?.profileImage ||
    "";


  // =========================================================
  // INITIAL
  // =========================================================

  const initial =
    name
      .trim()
      .charAt(0)
      .toUpperCase() || "E";


  // =========================================================
  // HANDLERS
  // =========================================================

  const handleViewProfile = () => {

    if (onViewProfile) {
      onViewProfile(expert);
    }

  };


  const handleBook = () => {

    if (onBook) {
      onBook(expert);
    }

  };


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <article className="expert-card">


      {/* =====================================================
          TOP SECTION
      ===================================================== */}

      <div className="expert-card-top">


        {/* PROFILE IMAGE */}

        <div className="expert-avatar">

          {avatar ? (

            <img
              src={avatar}
              alt={name}
              onError={(event) => {
                event.currentTarget.style.display =
                  "none";
              }}
            />

          ) : (

            <span>
              {initial}
            </span>

          )}

        </div>


        {/* BASIC INFO */}

        <div className="expert-basic-info">

          <h3 className="expert-name">

            {name}

          </h3>


          <p className="expert-headline">

            {headline}

          </p>


          <div className="expert-rating">

            <span className="rating-star">
              ★
            </span>


            <strong>

              {rating > 0
                ? rating.toFixed(1)
                : "New"}

            </strong>


            {totalReviews > 0 && (

              <span className="review-count">

                ({totalReviews})

              </span>

            )}

          </div>

        </div>


      </div>



      {/* =====================================================
          EXPERIENCE
      ===================================================== */}

      <div className="expert-experience">

        <span className="experience-icon">
          ◷
        </span>


        <span>

          {experience > 0
            ? `${experience}+ years experience`
            : "Experienced professional"}

        </span>

      </div>



      {/* =====================================================
          BIO
      ===================================================== */}

      <p className="expert-bio">

        {bio}

      </p>



      {/* =====================================================
          SKILLS
      ===================================================== */}

      {skills.length > 0 && (

        <div className="expert-skills">


          {skills
            .slice(0, 5)
            .map((skill, index) => (

              <span
                className="expert-skill"
                key={`${skill}-${index}`}
              >

                {skill}

              </span>

            ))}


          {skills.length > 5 && (

            <span className="expert-skill-more">

              +{skills.length - 5}

            </span>

          )}


        </div>

      )}



      {/* =====================================================
          ACTIONS
      ===================================================== */}

      <div className="expert-card-actions">


        <button
          type="button"
          className="expert-view-button"
          onClick={handleViewProfile}
        >

          View profile

        </button>


        <button
          type="button"
          className="expert-book-button"
          onClick={handleBook}
        >

          Book mentor

          <span>
            →
          </span>

        </button>


      </div>


    </article>

  );

};


export default ExpertCard;