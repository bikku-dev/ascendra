import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Moon,
  Sun,
  ChevronDown,
  User,
  LogOut,
  Compass,
  BriefcaseBusiness,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("ascendra-theme") === "dark";
  });

  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  /*
   * -----------------------------------------
   * THEME
   * -----------------------------------------
   */

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);

    localStorage.setItem(
      "ascendra-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  /*
   * -----------------------------------------
   * CLOSE DROPDOWN WHEN USER CHANGES
   * -----------------------------------------
   */

  useEffect(() => {
    setProfileOpen(false);
  }, [user]);

  /*
   * -----------------------------------------
   * NAVIGATION
   * -----------------------------------------
   */

  const goToLearnerExperts = () => {
    setMobileMenu(false);
    setProfileOpen(false);

    /*
     * Learner ke andar ExpertDiscovery open hoga.
     *
     * URL:
     * /learner?view=experts
     */

    navigate("/learner?view=experts");
  };

  const goToBecomeExpert = () => {
    setMobileMenu(false);
    setProfileOpen(false);

    /*
     * Is page ko baad me actual
     * mentor application flow se connect karenge.
     */

    navigate("/become-expert");
  };

  /*
   * -----------------------------------------
   * LOGOUT
   * -----------------------------------------
   */

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
    setProfileOpen(false);
    setMobileMenu(false);

    navigate("/");
  };

  /*
   * -----------------------------------------
   * USER HELPERS
   * -----------------------------------------
   */

  const getInitial = () => {
    if (!user) {
      return "A";
    }

    const name =
      user.name ||
      user.fullName ||
      user.username ||
      user.email ||
      "User";

    return name.charAt(0).toUpperCase();
  };

  const getName = () => {
    if (!user) {
      return "";
    }

    return (
      user.name ||
      user.fullName ||
      user.username ||
      user.email?.split("@")[0] ||
      "User"
    );
  };

  /*
   * -----------------------------------------
   * PROFILE
   * -----------------------------------------
   */

  const handleProfile = () => {
    setProfileOpen(false);
    setMobileMenu(false);

    /*
     * Existing learner profile.
     */

    navigate("/learner?view=profile");
  };

  /*
   * -----------------------------------------
   * RENDER
   * -----------------------------------------
   */

  return (
    <header className="ascendra-navbar">

      <div className="navbar-container">

        {/* =========================
            LOGO
        ========================== */}

        <Link
          to={user ? "/learner" : "/"}
          className="brand"
          onClick={() => {
            setMobileMenu(false);
            setProfileOpen(false);
          }}
        >
          <div className="brand-logo">
            A
          </div>

          <span>
            Ascendra
          </span>
        </Link>

        {/* =========================
            DESKTOP NAVIGATION
        ========================== */}

        <nav className="desktop-nav">

          <Link
            to={user ? "/learner" : "/"}
          >
            Home
          </Link>

          <button
            type="button"
            className="nav-button"
            onClick={goToLearnerExperts}
          >
            <Compass size={16} />
            Find Experts
          </button>

          <Link to="/how-it-works">
            How It Works
          </Link>

          <button
            type="button"
            className="nav-button"
            onClick={goToBecomeExpert}
          >
            <BriefcaseBusiness size={16} />
            Become an Expert
          </button>

        </nav>

        {/* =========================
            RIGHT ACTIONS
        ========================== */}

        <div className="navbar-actions">

          {/* Theme */}

          <button
            type="button"
            className="theme-button"
            onClick={() => setDarkMode((prev) => !prev)}
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun size={19} />
            ) : (
              <Moon size={19} />
            )}
          </button>

          {/* =========================
              NOT LOGGED IN
          ========================== */}

          {!user ? (
            <>
              <Link
                to="/login"
                className="signin-button"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="get-started-button"
              >
                Get Started
                <span className="button-arrow">
                  →
                </span>
              </Link>
            </>
          ) : (

            /* =========================
               LOGGED IN
            ========================== */

            <div className="profile-wrapper">

              <button
                type="button"
                className="profile-button"
                onClick={() =>
                  setProfileOpen((prev) => !prev)
                }
                aria-expanded={profileOpen}
              >

                <div className="profile-avatar">
                  {getInitial()}
                </div>

                <span>
                  {getName()}
                </span>

                <ChevronDown
                  size={16}
                  className={
                    profileOpen
                      ? "chevron-open"
                      : ""
                  }
                />

              </button>

              {/* =========================
                  PROFILE DROPDOWN
              ========================== */}

              {profileOpen && (
                <div className="profile-dropdown">

                  <div className="profile-header">

                    <div className="profile-avatar large">
                      {getInitial()}
                    </div>

                    <div>

                      <strong>
                        {getName()}
                      </strong>

                      <span>
                        Learner
                      </span>

                    </div>

                  </div>

                  <div className="dropdown-divider" />

                  {/* Profile */}

                  <button
                    type="button"
                    onClick={handleProfile}
                  >
                    <User size={17} />
                    Profile
                  </button>

                  {/* Find Experts */}

                  <button
                    type="button"
                    onClick={goToLearnerExperts}
                  >
                    <Compass size={17} />
                    Find Experts
                  </button>

                  {/* Become Expert */}

                  <button
                    type="button"
                    onClick={goToBecomeExpert}
                  >
                    <BriefcaseBusiness size={17} />
                    Become an Expert
                  </button>

                  <div className="dropdown-divider" />

                  {/* Logout */}

                  <button
                    type="button"
                    className="logout-button"
                    onClick={handleLogout}
                  >
                    <LogOut size={17} />
                    Logout
                  </button>

                </div>
              )}

            </div>
          )}

          {/* =========================
              MOBILE BUTTON
          ========================== */}

          <button
            type="button"
            className="mobile-menu-button"
            onClick={() =>
              setMobileMenu((prev) => !prev)
            }
            aria-label="Open menu"
          >
            {mobileMenu ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>

        </div>

      </div>

      {/* =========================
          MOBILE MENU
      ========================== */}

      {mobileMenu && (
        <div className="mobile-menu">

          <Link
            to={user ? "/learner" : "/"}
            onClick={() =>
              setMobileMenu(false)
            }
          >
            Home
          </Link>

          <button
            type="button"
            onClick={goToLearnerExperts}
          >
            <Compass size={17} />
            Find Experts
          </button>

          <Link
            to="/how-it-works"
            onClick={() =>
              setMobileMenu(false)
            }
          >
            How It Works
          </Link>

          <button
            type="button"
            onClick={goToBecomeExpert}
          >
            <BriefcaseBusiness size={17} />
            Become an Expert
          </button>

          {!user ? (
            <>
              <Link
                to="/login"
                onClick={() =>
                  setMobileMenu(false)
                }
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="mobile-get-started"
                onClick={() =>
                  setMobileMenu(false)
                }
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleProfile}
              >
                <User size={17} />
                Profile
              </button>

              <button
                type="button"
                className="mobile-logout"
                onClick={handleLogout}
              >
                <LogOut size={17} />
                Logout
              </button>
            </>
          )}

        </div>
      )}

    </header>
  );
};

export default Navbar;