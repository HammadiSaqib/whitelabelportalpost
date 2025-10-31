// Default landing page elements for the Landing Page Builder
// These elements can be customized by users after "Set Default" is clicked

export const generateDefaultBuilderElements = (companyName: string = "Your Business", userRole?: string) => {
  const elements = [
    // Hero Section
    {
      id: "hero-section",
      type: "hero",
      name: "Hero Section",
      locked: false,
      visible: true,
      style: {
        position: "relative" as const,
        width: "100%",
        height: 600,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
        textAlign: "center" as const,
        padding: 80,
        backgroundImage: "url('https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay"
      },
      content: {
        title: `Transform Your Business with ${companyName}`,
        subtitle: "We help businesses grow with cutting-edge strategies and proven results. Join thousands of successful companies who trust our platform.",
        buttonText: "View Our Plans",
        buttonUrl: "#pricing"
      }
    },
    
    // Features Section
    {
      id: "features-section",
      type: "features",
      name: "Features Section",
      locked: false,
      visible: true,
      style: {
        position: "relative" as const,
        width: "100%",
        height: 500,
        padding: 80,
        backgroundColor: "#f8fafc",
        textAlign: "center" as const,
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        justifyContent: "center"
      },
      content: {
        title: "Why Choose Our Platform",
        subtitle: "Discover the features that make us the preferred choice for businesses world",
        features: [
          {
            icon: "🚀",
            title: "Expert-Driven Solutions",
            description: "Our team of professionals delivers results that exceed expectations"
          },
          {
            icon: "📈",
            title: "Proven Track Record",
            description: "Thousands of successful implementations and satisfied clients"
          },
          {
            icon: "🛡️",
            title: "24/7 Premium Support",
            description: "Round-the-clock assistance to ensure your success"
          },
          {
            icon: "💰",
            title: "Money-Back Guarantee",
            description: "Risk-free investment with our satisfaction guarantee"
          }
        ]
      }
    },
    
    // Pricing Section
    {
      id: "pricing-section",
      type: "pricing",
      name: "Pricing Section",
      locked: false,
      visible: true,
      style: {
        position: "relative" as const,
        width: "100%",
        height: 600,
        padding: 80,
        backgroundColor: "#ffffff",
        textAlign: "center" as const,
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        justifyContent: "center"
      },
      content: {
        title: "Choose Your Plan",
        subtitle: "Select the perfect plan for your business needs",
        plans: [
          {
            name: "Starter",
            price: "$29",
            period: "/month",
            features: [
              "✓ Basic Features",
              "✓ Email Support",
              "✓ 5 Projects",
              "✓ Monthly Reports"
            ],
            highlighted: false,
            buttonText: "Get Started",
            buttonUrl: "#contact"
          },
          {
            name: "Professional",
            price: "$79",
            period: "/month",
            features: [
              "✓ Advanced Features",
              "✓ Priority Support",
              "✓ Unlimited Projects",
              "✓ Weekly Reports",
              "✓ Custom Integrations"
            ],
            highlighted: true,
            buttonText: "Get Started",
            buttonUrl: "#contact"
          },
          {
            name: "Enterprise",
            price: "$199",
            period: "/month",
            features: [
              "✓ All Features",
              "✓ Dedicated Support",
              "✓ White Label",
              "✓ Daily Reports",
              "✓ API Access"
            ],
            highlighted: false,
            buttonText: "Contact Sales",
            buttonUrl: "#contact"
          }
        ]
      }
    },
    
    // Testimonials Section
    {
      id: "testimonials-section",
      type: "testimonial",
      name: "Testimonials Section",
      locked: false,
      visible: true,
      style: {
        position: "relative" as const,
        width: "100%",
        height: 400,
        padding: 80,
        backgroundColor: "#f1f5f9",
        textAlign: "center" as const,
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        justifyContent: "center"
      },
      content: {
        title: "What Our Clients Say",
        testimonials: [
          {
            name: "Sarah Johnson",
            role: "CEO, TechCorp",
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=150&h=150&fit=crop&crop=face",
            text: "This platform transformed our business operations. The results exceeded our expectations and the support team is exceptional."
          },
          {
            name: "Michael Chen",
            role: "Founder, StartupX",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            text: "Outstanding service and incredible value. We've seen a 300% increase in efficiency since implementing their solutions."
          },
          {
            name: "Emily Rodriguez",
            role: "Director, GrowthLab",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
            text: "Professional, reliable, and results-driven. This platform is exactly what our business needed to scale effectively."
          }
        ]
      }
    },
    
    // Contact/CTA Section
    {
      id: "contact-section",
      type: "contact",
      name: "Contact Section",
      locked: false,
      visible: true,
      style: {
        position: "relative" as const,
        width: "100%",
        height: 400,
        padding: 80,
        background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
        color: "#ffffff",
        textAlign: "center" as const,
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        justifyContent: "center"
      },
      content: {
        title: "Ready to Get Started?",
        subtitle: "Join thousands of businesses already growing with our platform",
        buttonText: "Start Your Free Trial",
        buttonUrl: "#signup",
        contactInfo: {
          email: "hello@yourbusiness.com",
          phone: "+1 (555) 123-4567",
          address: "123 Business St, City, State 12345"
        }
      }
    },
    
    // Affiliate Signup Section
    {
      id: "affiliate-signup-section",
      type: "affiliate-signup",
      name: "Affiliate Signup Section",
      locked: false,
      visible: true,
      style: {
        position: "relative" as const,
        width: "100%",
        height: 500,
        padding: 80,
        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        color: "#ffffff",
        textAlign: "center" as const,
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        justifyContent: "center"
      },
      content: {
        title: "Join Our Affiliate Program",
        subtitle: `Partner with ${companyName} and earn commissions by promoting our services to your network`,
        features: [
          "💰 Earn up to 30% commission on all referrals",
          "🚀 Access to exclusive marketing materials",
          "📊 Real-time dashboard with analytics",
          "🎯 Dedicated affiliate support team",
          "🔄 Monthly commission payouts"
        ],
        buttonText: "Start as White Label Affiliate",
        buttonAction: "affiliate-signup"
      }
    },
    
    // Footer Section
    {
      id: "footer-section",
      type: "footer",
      name: "Footer Section",
      locked: false,
      visible: true,
      style: {
        position: "relative" as const,
        width: "100%",
        height: 200,
        padding: 40,
        backgroundColor: "#1f2937",
        color: "#9ca3af",
        textAlign: "center" as const,
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        justifyContent: "center"
      },
      content: {
        companyName: companyName,
        copyright: `© 2024 ${companyName}. All rights reserved.`,
        links: [
          { text: "Privacy Policy", url: "#privacy" },
          { text: "Terms of Service", url: "#terms" },
          { text: "Contact Us", url: "#contact" }
        ],
        socialLinks: [
          { platform: "twitter", url: "#" },
          { platform: "linkedin", url: "#" },
          { platform: "facebook", url: "#" }
        ]
      }
    }
  ];

  // Filter out affiliate signup elements for affiliates
  if (userRole === 'white_label_affiliate') {
    return elements.filter(element => element.type !== 'affiliate-signup');
  }

  return elements;
};