interface LandingPageData {
  id: string;
  name: string;
  elements: any[];
  settings: any;
  landing_page_code: string;
  html_content: string | null;
  customizations?: {
    text: {
      heroTitle: string;
      heroSubtitle: string;
      ctaButtonText: string;
      companyName: string;
      footerText: string;
    };
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
      buttonBackground: string;
      buttonText: string;
    };
    logo: {
      logoImageUrl: string | null;
    };
  };
  whiteLabel?: {
    id: string;
    businessName: string;
    domainPath: string;
    logoImageUrl: string | null;
  };
}

export function generateLandingPageHTML(
  landingPageData: LandingPageData,
  customizations?: any
): string {
  // Use customizations from the data or fallback to defaults
  const finalCustomizations = customizations || landingPageData.customizations || {
    text: {
      heroTitle: "Welcome to Our Platform",
      heroSubtitle: "Discover amazing features and services",
      ctaButtonText: "Get Started",
      companyName: landingPageData.whiteLabel?.businessName || "Your Company",
      footerText: "© 2024 All rights reserved"
    },
    colors: {
      primary: "#6366f1",
      secondary: "#8b5cf6",
      accent: "#06b6d4",
      background: "#ffffff",
      text: "#1f2937",
      buttonBackground: "#6366f1",
      buttonText: "#ffffff"
    },
    logo: {
      logoImageUrl: landingPageData.whiteLabel?.logoImageUrl || null
    }
  };

  // If the landing page has pre-built HTML content, use it
  if (landingPageData.html_content) {
    let htmlContent = landingPageData.html_content;
    
    // Apply customizations to HTML content
    htmlContent = htmlContent.replace(/{{heroTitle}}/g, finalCustomizations.text.heroTitle || 'Welcome');
    htmlContent = htmlContent.replace(/{{heroSubtitle}}/g, finalCustomizations.text.heroSubtitle || 'Subtitle');
    htmlContent = htmlContent.replace(/{{ctaButtonText}}/g, finalCustomizations.text.ctaButtonText || 'Get Started');
    htmlContent = htmlContent.replace(/{{companyName}}/g, finalCustomizations.text.companyName || 'Company');
    htmlContent = htmlContent.replace(/{{footerText}}/g, finalCustomizations.text.footerText || '© 2024 All rights reserved');
    
    // Replace logo placeholder
    if (finalCustomizations.logo.logoImageUrl) {
      htmlContent = htmlContent.replace(/{{logoImageUrl}}/g, finalCustomizations.logo.logoImageUrl);
    }
    
    return htmlContent;
  }

  // Generate default HTML structure with customizations
  const logoSection = finalCustomizations.logo.logoImageUrl 
    ? `<div style="text-align: center; margin-bottom: 2rem;">
         <img src="${finalCustomizations.logo.logoImageUrl}" alt="Logo" style="max-height: 80px; width: auto;" />
       </div>`
    : '';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${finalCustomizations.text.companyName}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: ${finalCustomizations.colors.text};
          background-color: ${finalCustomizations.colors.background};
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 2rem 0;
        }
        
        .hero-content {
          max-width: 800px;
        }
        
        h1 {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: ${finalCustomizations.colors.primary};
          line-height: 1.2;
        }
        
        .subtitle {
          font-size: 1.25rem;
          margin-bottom: 2.5rem;
          color: ${finalCustomizations.colors.secondary};
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .cta-button {
          display: inline-block;
          background-color: ${finalCustomizations.colors.buttonBackground};
          color: ${finalCustomizations.colors.buttonText};
          padding: 1rem 2rem;
          font-size: 1.1rem;
          font-weight: 600;
          text-decoration: none;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
          opacity: 0.9;
        }
        
        .footer {
          text-align: center;
          padding: 2rem 0;
          color: ${finalCustomizations.colors.secondary};
          font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
          h1 {
            font-size: 2.5rem;
          }
          
          .subtitle {
            font-size: 1.1rem;
          }
          
          .cta-button {
            padding: 0.875rem 1.5rem;
            font-size: 1rem;
          }
        }
      </style>
    </head>
    <body>
      <div class="hero">
        <div class="container">
          <div class="hero-content">
            ${logoSection}
            <h1>${finalCustomizations.text.heroTitle}</h1>
            <p class="subtitle">${finalCustomizations.text.heroSubtitle}</p>
            <button class="cta-button">${finalCustomizations.text.ctaButtonText}</button>
          </div>
        </div>
      </div>
      
      <footer class="footer">
        <div class="container">
          <p>${finalCustomizations.text.footerText}</p>
        </div>
      </footer>
    </body>
    </html>
  `;
}