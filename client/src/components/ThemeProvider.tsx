import React, { createContext, useContext, useEffect, useState } from "react";
import { useUserPreferences, type UserPreferences } from "@/hooks/useUserPreferences";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  preferences: UserPreferences | undefined;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const { data: preferences } = useUserPreferences();

  // Apply theme changes
  useEffect(() => {
    if (preferences?.theme) {
      setTheme(preferences.theme);
      const root = window.document.documentElement;
      
      // Remove existing theme classes
      root.classList.remove("light", "dark");
      
      if (preferences.theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        root.classList.add(systemTheme);
      } else {
        root.classList.add(preferences.theme);
      }
    }
  }, [preferences?.theme]);

  // Apply custom colors and logo
  useEffect(() => {
    if (preferences) {
      const root = window.document.documentElement;
      
      // Apply custom primary color
      if (preferences.primaryColor && preferences.primaryColor !== '#2563EB') {
        const primaryColor = hexToHsl(preferences.primaryColor);
        root.style.setProperty('--primary', primaryColor);
        root.style.setProperty('--sidebar-primary', primaryColor);
      } else {
        // Reset to default
        root.style.removeProperty('--primary');
        root.style.removeProperty('--sidebar-primary');
      }
      
      // Note: Secondary color is no longer applied to --secondary and --muted CSS variables
      // to keep neutral UI elements (like navbar, muted text, etc.) using default theme colors
      // Secondary color is still available via useTheme() hook for specific branded elements
    }
  }, [preferences?.primaryColor, preferences?.secondaryColor, preferences?.logoUrl]);

  const value: ThemeContextType = {
    theme,
    setTheme,
    preferences,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Helper function to convert hex to HSL
function hexToHsl(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;

  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  // Convert to HSL format expected by CSS (h s% l%)
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}