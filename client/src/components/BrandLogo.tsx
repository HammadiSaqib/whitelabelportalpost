import React from 'react';
import { Building2 } from 'lucide-react';
import { useWhiteLabel } from '@/hooks/useWhiteLabel';
import { useTheme } from '@/hooks/useTheme';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  iconPosition?: 'left' | 'right';
  showIcon?: boolean;
  className?: string;
}

export function BrandLogo({ 
  size = 'md', 
  iconPosition = 'right', 
  showIcon = true,
  className = '' 
}: BrandLogoProps) {
  const { whiteLabel, isLoading: whiteLoading } = useWhiteLabel();
  const { logoUrl: preferencesLogoUrl, isLoading: themeLoading } = useTheme();
  
  const isLoading = whiteLoading || themeLoading;
  const brandName = whiteLabel?.businessName || "Your Brand";
  
  // Use the user's logo_image_url from preferences (theme hook), or default to /uploads/logo.png
  const logoUrl = preferencesLogoUrl || "/uploads/logo.png";
  
  // Enhanced debug logging
  console.log('🔍 BrandLogo Enhanced Debug:', {
    whiteLabel,
    preferencesLogoUrl,
    logoUrl,
    brandName,
    isLoading: { whiteLoading, themeLoading },
    'Will show': logoUrl ? 'logo image' : 'business name text',
    'Using default logo': !preferencesLogoUrl && logoUrl === "/uploads/logo.png"
  });
  
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  if (isLoading) {
    return (
      <div className={`${sizeClasses[size]} w-24 bg-gray-200 animate-pulse rounded ${className}`} />
    );
  }

  // If we have a logo URL, show the image
  if (logoUrl) {
    return (
      <div className={className}>
        <img 
          src={logoUrl} 
          alt={`${brandName} Logo`}
          className={`${sizeClasses[size]} w-auto object-contain`}
          onLoad={() => {
            console.log('✅ Logo loaded successfully:', logoUrl);
          }}
          onError={(e) => {
            console.error('❌ Logo failed to load:', logoUrl);
            // If the default logo fails to load, show text instead
            if (logoUrl === "/uploads/logo.png") {
              // Hide the broken image and show text instead
              e.currentTarget.style.display = 'none';
              const textElement = e.currentTarget.nextElementSibling;
              if (textElement) {
                textElement.style.display = 'flex';
              }
            }
          }}
        />
        {/* Fallback text element (hidden by default) */}
        <div className={`flex items-center space-x-2`} style={{ display: 'none' }}>
          {showIcon && iconPosition === 'left' && (
            <Building2 className={`${sizeClasses[size]} w-auto text-primary`} />
          )}
          <span className={`font-bold text-primary ${textSizeClasses[size]}`}>
            {brandName}
          </span>
          {showIcon && iconPosition === 'right' && (
            <Building2 className={`${sizeClasses[size]} w-auto text-primary`} />
          )}
        </div>
      </div>
    );
  }

  // If no logo URL, show the business name text with optional icon
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {showIcon && iconPosition === 'left' && (
        <Building2 className={`${sizeClasses[size]} w-auto text-primary`} />
      )}
      <span className={`font-bold text-primary ${textSizeClasses[size]}`}>
        {brandName}
      </span>
      {showIcon && iconPosition === 'right' && (
        <Building2 className={`${sizeClasses[size]} w-auto text-primary`} />
      )}
    </div>
  );
}