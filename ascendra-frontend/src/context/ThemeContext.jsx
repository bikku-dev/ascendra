import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";

const ThemeContext = createContext(null);

const THEME_KEY = "ascendra-theme";

export function ThemeProvider({ children }) {
    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem(THEME_KEY);

        if (savedTheme === "dark") {
            return true;
        }

        if (savedTheme === "light") {
            return false;
        }

        return false;
    });

    useEffect(() => {
        const theme = darkMode ? "dark" : "light";

        document.documentElement.setAttribute(
            "data-theme",
            theme
        );

        document.body.setAttribute(
            "data-theme",
            theme
        );

        document.documentElement.classList.toggle(
            "dark",
            darkMode
        );

        document.body.classList.toggle(
            "dark-mode",
            darkMode
        );

        localStorage.setItem(
            THEME_KEY,
            theme
        );

        localStorage.setItem(
            "ascendra_theme",
            theme
        );
    }, [darkMode]);

    const toggleTheme = () => {
        setDarkMode(current => !current);
    };

    const value = useMemo(
        () => ({
            darkMode,
            setDarkMode,
            toggleTheme
        }),
        [darkMode]
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error(
            "useTheme must be used inside ThemeProvider"
        );
    }

    return context;
}
