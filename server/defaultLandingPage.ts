// 🚀 ULTRA-MODERN PROFESSIONAL LANDING PAGE - NEXT-GEN DESIGN 2024
// Mobile-First Responsive Design with Advanced Animations & UX
export function generateDefaultBuilderElements(businessName = "") {
  return [
    // 🎯 PREMIUM NAVIGATION BAR - Glass Morphism Design
    {
      id: "navbar-1",
      type: "navbar",
      style: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        height: "auto",
        minHeight: "75px",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(25px) saturate(180%)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 24px",
        zIndex: 9999,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset",
        transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        animation: "slideDown 0.8s ease-out"
      },
      content: {
        brand: businessName,
        logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=60&h=60&fit=crop&crop=center&auto=format&q=80",
        menuItems: [
          { text: "Home", url: "#hero", active: true, icon: "🏠" },
          { text: "Features", url: "#features", icon: "⚡" },
          { text: "Pricing", url: "#pricing", icon: "💎" },
          { text: "Reviews", url: "#testimonials", icon: "⭐" },
          { text: "Contact", url: "#contact", icon: "📞" }
        ],
        ctaButton: { 
          text: "🚀 Start Free Trial", 
          url: "#pricing",
          style: "background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%); color: white; padding: 14px 28px; border-radius: 50px; font-weight: 700; font-size: 14px; transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4); border: none; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;"
        },
        mobileMenuToggle: true,
        brandStyle: "font-size: 24px; font-weight: 800; background: linear-gradient(135deg, #6366f1, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -0.5px;"
      }
    },

    // 🌟 HERO SECTION - Dynamic Gradient Background
    {
      id: "hero-1",
      type: "hero",
      style: {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        padding: "120px 0 80px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      },
      content: {
        title: `Transform Your Business`,
        subtitle: `We help businesses grow with cutting-edge strategies and proven results. Join thousands of successful companies who trust our platform.`,
        ctaButton: {
          text: "🚀 Get Started Free",
          url: "#pricing",
          style: "background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); color: white; padding: 18px 36px; border-radius: 50px; font-weight: 700; font-size: 18px; border: 2px solid rgba(255, 255, 255, 0.3); cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 12px; transition: all 0.4s ease; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);"
        },
        secondaryButton: {
          text: "📹 Watch Demo",
          url: "#demo",
          style: "background: transparent; color: white; padding: 18px 36px; border-radius: 50px; font-weight: 600; font-size: 16px; border: 2px solid rgba(255, 255, 255, 0.4); cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 12px; transition: all 0.4s ease; margin-left: 20px;"
        }
      }
    },

    // ⚡ FEATURES SECTION - Modern Card Grid
    {
      id: "features-1",
      type: "features",
      style: {
        padding: "100px 0",
        background: "#f8fafc"
      },
      content: {
        title: "Why Choose Our Platform?",
        subtitle: "Powerful features designed to accelerate your business growth",
        features: [
          {
            icon: "🚀",
            title: "Lightning Fast",
            description: "Optimized performance that delivers results in seconds, not minutes."
          },
          {
            icon: "🔒",
            title: "Bank-Level Security",
            description: "Enterprise-grade security protecting your data with military-grade encryption."
          },
          {
            icon: "📊",
            title: "Advanced Analytics",
            description: "Deep insights and real-time analytics to track your success metrics."
          },
          {
            icon: "🎯",
            title: "Smart Targeting",
            description: "AI-powered targeting that reaches your ideal customers automatically."
          },
          {
            icon: "💡",
            title: "Innovation First",
            description: "Cutting-edge technology that keeps you ahead of the competition."
          },
          {
            icon: "🌍",
            title: "Global Reach",
            description: "Scale your business worldwide with our international infrastructure."
          }
        ]
      }
    },

    // 💎 PRICING SECTION - Premium Design
    {
      id: "pricing-1",
      type: "pricing",
      style: {
        padding: "100px 0",
        background: "white"
      },
      content: {
        title: "Choose Your Success Plan",
        subtitle: "Flexible pricing that grows with your business",
        plans: [
          {
            name: "Starter",
            price: "$29",
            period: "/month",
            description: "Perfect for small businesses getting started",
            features: [
              "Up to 1,000 contacts",
              "Basic analytics",
              "Email support",
              "Mobile app access",
              "Basic integrations"
            ],
            ctaText: "Start Free Trial",
            popular: false
          },
          {
            name: "Professional",
            price: "$79",
            period: "/month",
            description: "Ideal for growing businesses",
            features: [
              "Up to 10,000 contacts",
              "Advanced analytics",
              "Priority support",
              "Custom integrations",
              "Team collaboration",
              "Advanced reporting"
            ],
            ctaText: "Get Started",
            popular: true
          },
          {
            name: "Enterprise",
            price: "$199",
            period: "/month",
            description: "For large organizations",
            features: [
              "Unlimited contacts",
              "Custom analytics",
              "24/7 phone support",
              "White-label options",
              "Dedicated account manager",
              "Custom development"
            ],
            ctaText: "Contact Sales",
            popular: false
          }
        ]
      }
    },

    // ⭐ TESTIMONIALS SECTION
    {
      id: "testimonials-1",
      type: "testimonials",
      style: {
        padding: "100px 0",
        background: "#f8fafc"
      },
      content: {
        title: "What Our Customers Say",
        subtitle: "Join thousands of satisfied customers worldwide",
        testimonials: [
          {
            name: "Sarah Johnson",
            role: "CEO, TechStart Inc.",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face&auto=format&q=80",
            content: "This platform transformed our business completely. We saw 300% growth in just 6 months!",
            rating: 5
          },
          {
            name: "Michael Chen",
            role: "Marketing Director, GrowthCo",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face&auto=format&q=80",
            content: "The analytics and insights are incredible. We finally understand our customers.",
            rating: 5
          },
          {
            name: "Emily Rodriguez",
            role: "Founder, StartupXYZ",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face&auto=format&q=80",
            content: "Best investment we've made. The ROI is phenomenal and support is outstanding.",
            rating: 5
          }
        ]
      }
    },

    // 📞 CONTACT SECTION
    {
      id: "contact-1",
      type: "contact",
      style: {
        padding: "100px 0",
        background: "white"
      },
      content: {
        title: "Ready to Get Started?",
        subtitle: "Contact us today and Transform Your Business tomorrow",
        contactInfo: {
          email: "hello@yourbusiness.com",
          phone: "+1 (555) 123-4567",
          address: "123 Business St, Suite 100, City, State 12345"
        },
        ctaButton: {
          text: "Start Your Free Trial",
          url: "#pricing",
          style: "background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%); color: white; padding: 18px 36px; border-radius: 50px; font-weight: 700; font-size: 18px; border: none; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 12px; transition: all 0.4s ease; box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);"
        }
      }
    },

    // 🦶 FOOTER SECTION
    {
      id: "footer-1",
      type: "footer",
      style: {
        padding: "60px 0 30px",
        background: "#1a202c",
        color: "white"
      },
      content: {
        companyName: "",
        tagline: "Transforming businesses worldwide",
        links: [
          { text: "Privacy Policy", url: "/privacy" },
          { text: "Terms of Service", url: "/terms" },
          { text: "Support", url: "/support" },
          { text: "Contact", url: "/contact" }
        ],
        socialLinks: [
          { platform: "Twitter", url: "https://twitter.com", icon: "🐦" },
          { platform: "LinkedIn", url: "https://linkedin.com", icon: "💼" },
          { platform: "Facebook", url: "https://facebook.com", icon: "📘" }
        ],
        copyright: `© 2024. All rights reserved.`
      }
    }
  ];
}

// Default landing page settings
export const defaultLandingPageSettings = {
  meta: {
    title: "Professional Landing Page",
    description: "Transform Your Business our cutting-edge platform",
    keywords: "business, growth, platform, success"
  },
  theme: {
    primaryColor: "#6366f1",
    secondaryColor: "#8b5cf6",
    accentColor: "#d946ef",
    backgroundColor: "#ffffff",
    textColor: "#1a202c"
  },
  responsive: {
    mobile: true,
    tablet: true,
    desktop: true
  },
  animations: {
    enabled: true,
    duration: "0.4s",
    easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)"
  }
};

// Default landing page elements for backward compatibility
export const defaultLandingPageElements = generateDefaultBuilderElements();

// Enhanced JavaScript for interactive features
export function generateEnhancedJavaScript() {
  return `
    <script>
      // Smooth scrolling for navigation links
      document.addEventListener('DOMContentLoaded', function() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
          link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          });
        });

        // Scroll animations
        const observerOptions = {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }
          });
        }, observerOptions);

        // Observe all sections
        document.querySelectorAll('section').forEach(section => {
          section.style.opacity = '0';
          section.style.transform = 'translateY(30px)';
          section.style.transition = 'all 0.6s ease-out';
          observer.observe(section);
        });

        // Mobile menu enhancement
        const mobileMenuButton = document.querySelector('[data-mobile-menu-toggle]');
        const mobileMenu = document.querySelector('[data-mobile-menu]');
        
        if (mobileMenuButton && mobileMenu) {
          mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            this.classList.toggle('active');
          });
        }

        // Navbar scroll effect
        let lastScrollY = window.scrollY;
        const navbar = document.querySelector('[data-navbar]');
        
        window.addEventListener('scroll', function() {
          const currentScrollY = window.scrollY;
          
          if (navbar) {
            if (currentScrollY > 100) {
              navbar.style.background = 'rgba(255, 255, 255, 0.98)';
              navbar.style.backdropFilter = 'blur(20px) saturate(180%)';
              navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12)';
            } else {
              navbar.style.background = 'rgba(255, 255, 255, 0.95)';
              navbar.style.backdropFilter = 'blur(25px) saturate(180%)';
              navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.08)';
            }
          }
          
          lastScrollY = currentScrollY;
        });

        // Button hover effects
        document.querySelectorAll('button, .btn, [role="button"]').forEach(button => {
          button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.15)';
          });
          
          button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
          });
        });

        // Form enhancements
        document.querySelectorAll('input, textarea').forEach(input => {
          input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
          });
          
          input.addEventListener('blur', function() {
            if (!this.value) {
              this.parentElement.classList.remove('focused');
            }
          });
        });
      });

      // Analytics tracking
      function trackEvent(eventName, properties = {}) {
        if (typeof gtag !== 'undefined') {
          gtag('event', eventName, properties);
        }
        console.log('Event tracked:', eventName, properties);
      }

      // Track CTA clicks
      document.addEventListener('click', function(e) {
        if (e.target.matches('[data-cta]') || e.target.closest('[data-cta]')) {
          const cta = e.target.matches('[data-cta]') ? e.target : e.target.closest('[data-cta]');
          trackEvent('cta_click', {
            cta_text: cta.textContent.trim(),
            cta_location: cta.getAttribute('data-cta')
          });
        }
      });
    </script>
  `;
}