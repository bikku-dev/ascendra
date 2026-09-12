import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function ThemeToggle({
    className = "theme-toggle"
}) {
    const {
        darkMode,
        toggleTheme
    } = useTheme();

    return (
        <button
            type="button"
            className={className}
            onClick={toggleTheme}
            aria-label={
                darkMode
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            }
            title={
                darkMode
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            }
        >
            {darkMode ? (
                <Sun size={18} />
            ) : (
                <Moon size={18} />
            )}
        </button>
    );
}

export default ThemeToggle;
