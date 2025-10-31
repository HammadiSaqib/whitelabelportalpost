import { useEffect } from "react";
import { useUserPreferences } from "./useUserPreferences";

export function useTheme() {
  const { data: preferences, isLoading } = useUserPreferences();

  // Apply theme and custom colors
  useEffect(() => {
    if (!preferences) return;

    const root = document.documentElement;
    
    // Apply theme
    root.classList.remove("light", "dark");
    if (preferences.theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(preferences.theme);
    }

    // Apply custom primary color
    if (preferences.primaryColor) {
      const primaryHsl = hexToHsl(preferences.primaryColor);
      root.style.setProperty('--primary', primaryHsl);
      root.style.setProperty('--sidebar-primary', primaryHsl);
      root.style.setProperty('--ring', primaryHsl);
      
      // Calculate foreground color (white for dark colors, black for light)
      const lightness = getLightness(preferences.primaryColor);
      const foregroundHsl = lightness > 60 ? '0 0% 0%' : '0 0% 100%';
      root.style.setProperty('--primary-foreground', foregroundHsl);
    }

    // Apply custom secondary color  
    if (preferences.secondaryColor) {
      const secondaryHsl = hexToHsl(preferences.secondaryColor);
      root.style.setProperty('--secondary', secondaryHsl);
      root.style.setProperty('--muted', secondaryHsl);
      
      // Calculate foreground color for secondary
      const lightness = getLightness(preferences.secondaryColor);
      const foregroundHsl = lightness > 60 ? '0 0% 0%' : '0 0% 100%';
      root.style.setProperty('--secondary-foreground', foregroundHsl);
    }
  }, [preferences]);

  const result = {
    theme: preferences?.theme || 'system',
    primaryColor: preferences?.primaryColor,
    secondaryColor: preferences?.secondaryColor,
    logoUrl: preferences?.logoUrl,
    isLoading
  };

  // Enhanced debug logging
  console.log('🔍 useTheme Enhanced Debug:', {
    'Raw preferences from API': preferences,
    'Extracted logoUrl': preferences?.logoUrl,
    'Final result': result,
    'Expected logo': '/uploads/profile_1758573914115-879455885.png',
    'Logo found': !!preferences?.logoUrl,
    isLoading
  });

  return result;
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

// Helper function to get lightness from hex color
function getLightness(hex: string): number {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return 50;

  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  return l * 100;
}