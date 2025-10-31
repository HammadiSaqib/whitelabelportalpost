import React, { useState, useEffect } from 'react';
import { generateLandingPageHTML } from '../utils/landingPageGenerator';

// Pencil icon SVG component
const PencilIcon = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    style={{
      position: 'absolute',
      top: '-8px',
      right: '-8px',
      background: 'white',
      borderRadius: '50%',
      padding: '2px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      color: '#007bff',
      zIndex: 1000
    }}
  >
    <path d="m18 2 4 4-14 14H4v-4L18 2z" />
    <path d="m14.5 5.5 4 4" />
  </svg>
);

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

export default function ShootDefaultLanding() {
  const [landingPageData, setLandingPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [editingElement, setEditingElement] = useState<{
    element: HTMLElement;
    fieldName: string;
    currentValue: string;
    elementType: string;
    rect: DOMRect;
  } | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const customizationsParam = urlParams.get('customizations');
  const editMode = true; // Always enable edit mode for direct WYSIWYG editing
  const domain = urlParams.get('domain') || window.location.hostname;

  console.log('ShootDefaultLanding - URL params:', { customizationsParam, editMode, domain });
  console.log('ShootDefaultLanding - Edit mode:', editMode);
  console.log('ShootDefaultLanding - Domain:', domain);
  console.log('ShootDefaultLanding - Window location:', window.location.href);

  useEffect(() => {
    const fetchLandingPage = async () => {
      try {
        setLoading(true);
        
        // Build API URL with domain parameter
        const apiUrl = `/api/landing-pages/default?domain=${encodeURIComponent(domain)}`;
        console.log('Fetching landing page from:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch landing page: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Received landing page data:', data);
        
        setLandingPageData(data);
      } catch (err) {
        console.error('Error fetching landing page:', err);
        setError(err instanceof Error ? err.message : 'Failed to load landing page');
      } finally {
        setLoading(false);
      }
    };

    fetchLandingPage();
  }, [domain]);
  // Handle element click for editing
  const handleElementClick = (event: React.MouseEvent) => {
    if (!editMode) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    const target = event.target as HTMLElement;
    
    if (!isEditableElement(target)) return;
    
    const fieldName = getFieldNameFromElement(target);
    const currentValue = getElementValue(target, fieldName);
    const elementType = getElementType(target);
    const rect = target.getBoundingClientRect();
    
    // Start editing
    setEditingElement({
      element: target,
      fieldName,
      currentValue,
      elementType,
      rect
    });
    setEditValue(currentValue);
    
    // Send click event to parent for tracking
    if (window.parent) {
      window.parent.postMessage({
        type: 'ELEMENT_CLICKED',
        elementType,
        fieldName,
        currentValue,
        position: { x: event.clientX, y: event.clientY }
      }, '*');
    }
  };

  // Handle saving inline edit
  const handleSaveEdit = () => {
    if (!editingElement) return;
    
    const { element, fieldName, elementType } = editingElement;
    
    // Update the element's content
    if (elementType === 'text') {
      element.textContent = editValue;
    } else if (elementType === 'button') {
      element.textContent = editValue;
    }
    
    // Send update to parent component
    if (window.parent) {
      window.parent.postMessage({
        type: 'ELEMENT_UPDATED',
        fieldName,
        newValue: editValue,
        elementType
      }, '*');
    }
    
    // Clear editing state
    setEditingElement(null);
    setEditValue('');
  };

  // Handle canceling inline edit
  const handleCancelEdit = () => {
    setEditingElement(null);
    setEditValue('');
  };

  // Handle mouse enter for hover effects
  const handleMouseEnter = (event: React.MouseEvent) => {
    if (!editMode) return;
    
    const target = event.target as HTMLElement;
    if (isEditableElement(target)) {
      setHoveredElement(target);
    }
  };

  // Handle mouse leave for hover effects
  const handleMouseLeave = (event: React.MouseEvent) => {
    if (!editMode) return;
    
    const target = event.target as HTMLElement;
    if (target === hoveredElement) {
      setHoveredElement(null);
    }
  };

  // Check if element is editable
  const isEditableElement = (element: HTMLElement): boolean => {
    const editableTags = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'A', 'BUTTON'];
    const tagName = element.tagName.toUpperCase();
    
    // Check if it's an editable tag
    if (!editableTags.includes(tagName)) return false;
    
    // Skip if it's inside a script, style, or other non-content elements
    let parent = element.parentElement;
    while (parent) {
      if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName.toUpperCase())) {
        return false;
      }
      parent = parent.parentElement;
    }
    
    // Check if element has text content
    const textContent = element.textContent?.trim();
    return textContent && textContent.length > 0;
  };

  // Get field name based on element characteristics
  const getFieldNameFromElement = (element: HTMLElement): string => {
    const tagName = element.tagName.toUpperCase();
    const className = element.className || '';
    const textContent = element.textContent?.toLowerCase() || '';
    
    // Hero title - usually H1 or large headings
    if (tagName === 'H1' || className.includes('hero-title') || className.includes('title')) {
      return 'heroTitle';
    }
    
    // Hero subtitle - usually H2 or subtitle classes
    if (tagName === 'H2' || className.includes('hero-subtitle') || className.includes('subtitle')) {
      return 'heroSubtitle';
    }
    
    // CTA buttons
    if (tagName === 'BUTTON' || tagName === 'A') {
      if (textContent.includes('start') || textContent.includes('get') || textContent.includes('try') || 
          textContent.includes('sign') || textContent.includes('join') || className.includes('cta')) {
        return 'ctaButtonText';
      }
    }
    
    // Company name - usually in navbar or footer
    if (className.includes('brand') || className.includes('logo') || className.includes('company')) {
      return 'companyName';
    }
    
    // Feature titles
    if ((tagName === 'H3' || tagName === 'H4') && className.includes('feature')) {
      return 'featureTitle';
    }
    
    // Feature descriptions
    if (tagName === 'P' && className.includes('feature')) {
      return 'featureDescription';
    }
    
    // Testimonial content
    if (className.includes('testimonial')) {
      return 'testimonialContent';
    }
    
    // Default to generic text content
    return 'textContent';
  };

  // Get current value for the element
  const getElementValue = (element: HTMLElement, fieldName: string): string => {
    if (landingPageData?.customizations?.text) {
      const customText = landingPageData.customizations.text as any;
      if (customText[fieldName]) {
        return customText[fieldName];
      }
    }
    
    return element.textContent || '';
  };

  // Get element type for editing
  const getElementType = (element: HTMLElement): string => {
    const tagName = element.tagName.toUpperCase();
    
    if (tagName === 'BUTTON' || tagName === 'A') {
      return 'button';
    }
    
    return 'text';
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Arial, sans-serif',
        color: 'red'
      }}>
        Error: {error}
      </div>
    );
  }

  if (!landingPageData) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        No landing page data available
      </div>
    );
  }

  // Apply custom settings if provided
  let finalCustomizations = landingPageData.customizations;
  if (customizationsParam) {
    try {
      const parsedCustomizations = JSON.parse(decodeURIComponent(customizationsParam));
      finalCustomizations = { ...finalCustomizations, ...parsedCustomizations };
    } catch (err) {
      console.error('Error parsing custom customizations:', err);
    }
  }

  // Generate HTML content
  const htmlContent = generateLandingPageHTML(landingPageData, finalCustomizations);

  return (
    <div 
      onClick={handleElementClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        width: '100%',
        height: '100vh',
        overflow: 'auto',
        position: 'relative'
      }}
    >
      {/* Hover pencil icon overlay */}
      {editMode && hoveredElement && !editingElement && (
        <div
          style={{
            position: 'absolute',
            left: hoveredElement.getBoundingClientRect().right - 20 + window.scrollX,
            top: hoveredElement.getBoundingClientRect().top - 8 + window.scrollY,
            zIndex: 10000,
            pointerEvents: 'none'
          }}
        >
          <PencilIcon />
        </div>
      )}

      {/* Inline editing overlay */}
      {editMode && editingElement && (
        <div
          style={{
            position: 'absolute',
            left: editingElement.rect.left + window.scrollX,
            top: editingElement.rect.top + window.scrollY,
            width: Math.max(editingElement.rect.width, 200),
            zIndex: 10001,
            background: 'white',
            border: '2px solid #007bff',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            padding: '8px'
          }}
        >
          {editingElement.elementType === 'text' ? (
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              style={{
                width: '100%',
                minHeight: '60px',
                border: 'none',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
                fontSize: '14px',
                padding: '4px'
              }}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleSaveEdit();
                } else if (e.key === 'Escape') {
                  handleCancelEdit();
                }
              }}
            />
          ) : (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                fontFamily: 'inherit',
                fontSize: '14px',
                padding: '4px'
              }}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveEdit();
                } else if (e.key === 'Escape') {
                  handleCancelEdit();
                }
              }}
            />
          )}
          
          <div style={{
            display: 'flex',
            gap: '8px',
            marginTop: '8px',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={handleSaveEdit}
              style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '4px 12px',
                borderRadius: '3px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              style={{
                background: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '4px 12px',
                borderRadius: '3px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Debug indicator for edit mode */}
      {editMode && (
        <div style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          background: '#007bff',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: 'bold',
          zIndex: 9999,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          ✏️ Edit Mode Active - Click any text to edit
        </div>
      )}

      {/* Landing page content with event delegation */}
      <div 
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        style={{
          ...(editMode && {
            cursor: 'pointer'
          })
        }}
        onMouseOver={handleMouseEnter}
        onMouseOut={handleMouseLeave}
        onClick={handleElementClick}
      />

      {/* CSS for hover effects in edit mode */}
      {editMode && (
        <style>
          {`
            [data-editable="true"]:hover {
              outline: 2px dashed #007bff !important;
              outline-offset: 2px !important;
              background-color: rgba(0, 123, 255, 0.05) !important;
              transition: all 0.2s ease !important;
            }
            
            h1:hover, h2:hover, h3:hover, h4:hover, h5:hover, h6:hover,
            p:hover, span:hover, a:hover, button:hover {
              outline: 2px dashed #007bff !important;
              outline-offset: 2px !important;
              background-color: rgba(0, 123, 255, 0.05) !important;
              transition: all 0.2s ease !important;
              position: relative !important;
            }
            
            h1:hover::after, h2:hover::after, h3:hover::after, h4:hover::after, h5:hover::after, h6:hover::after,
            p:hover::after, span:hover::after, a:hover::after, button:hover::after {
              content: "✏️ Click to edit";
              position: absolute;
              top: -25px;
              left: 0;
              background: #007bff;
              color: white;
              padding: 2px 6px;
              border-radius: 3px;
              font-size: 10px;
              font-weight: normal;
              white-space: nowrap;
              z-index: 1000;
              pointer-events: none;
            }
          `}
        </style>
      )}
    </div>
  );
}