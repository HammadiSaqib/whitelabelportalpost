# WhiteLabel Pro - B2B2C SaaS Platform

## Overview
WhiteLabel Pro is a comprehensive B2B2C SaaS platform designed for multi-tier affiliate marketing with role-based access control. Its purpose is to empower businesses to manage and expand their affiliate networks, thereby boosting market reach and revenue potential through a flexible and scalable SaaS model. Key capabilities include customizable dashboards, revenue sharing, and white-label solutions for various user roles (Super Admins, White-Label Clients, Affiliates, End Users).

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

The application utilizes a full-stack TypeScript architecture with separate client and server components.

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **State Management**: TanStack Query
- **UI Components**: Radix UI primitives with shadcn/ui
- **Styling**: Tailwind CSS

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage
- **API Design**: RESTful with role-based access control

### Database
- **Primary Database**: PostgreSQL (Neon serverless)
- **ORM**: Drizzle ORM
- **Migrations**: Drizzle Kit

### Key Features and Design Patterns
- **User Role System**: Hierarchical roles including Super Admin, White-Label Client, and various Affiliate and End User roles.
- **Authentication & Authorization**: Replit Auth, session storage, role-based middleware, HTTPS-only cookies, and CSRF protection.
- **AI Integration**: OpenAI GPT-4o for content generation and personalization.
- **Comprehensive Dashboards**: Role-specific dashboards with dynamic data loading, analytics, and interactive charts.
- **Payment Processing**: Integration with NMI Payment Gateway.
- **Content Management**: Advanced drag-and-drop landing page builder with customizable templates and custom domain support.
- **Affiliate Management**: Signup, login, commission tracking, and referral systems with role-based visibility.
- **Plan Management**: Creation and editing of subscription plans with user-based access control and scheduling capabilities.
- **Real-time Analytics**: End-user activity, purchase history, and sales analytics for white-label clients.
- **Announcements System**: Platform-wide and client-specific announcements with scheduling and targeting.
- **Domain Management**: Professional interface for custom domain paths, including real-time validation.
- **Automated White-Label Record Creation**: Automated generation of white-label records for all end-user signups, including Google OAuth users.
- **Role-Based Purchase Authentication**: Ensures only "end_user" role can purchase plans directly on landing pages.

## External Dependencies

- **Database**: Neon PostgreSQL
- **Authentication**: Replit Auth service
- **AI Services**: OpenAI API
- **Payment Processing**: NMI Payment Gateway
- **Email Marketing**: Mailchimp
- **Analytics**: Google Analytics
- **Automation**: Zapier
- **Communication**: Slack

## Recent Changes (October 2025)
- **White Label Affiliate Clean URL Format - COMPLETE (Oct 31)**: Updated White Label Affiliate Dashboard to use clean referral URL format matching Super-Admin Affiliates. Changed from `/{domainPath}?ref=code` to `/{domainPath}?code` (clean format without `ref=` parameter). Key changes: (1) Updated `copyAffiliateLink()` function to use `whiteLabelInfo.domainPath` as canonical domain source instead of extracting from URL path. (2) Added loading states and error handling to prevent displaying `undefined` while data loads. (3) Updated all referral URL displays (copy button area, edit mode input, QR code generator) to consistently use clean format. (4) Added conditional rendering to only show referral URLs when `domainPath` is available. The Pricing page already supports clean URL format (checks for parameter names as referral codes), so commission tracking works correctly. White Label Affiliates now have clean, professional referral URLs like `/munib?ahmeedd` instead of `/munib?ref=ahmeedd`.
- **White Label Affiliate Commission Tracking Fix - COMPLETE (Oct 31)**: Fixed critical bug preventing White Label Affiliates from earning commissions when customers purchased using their referral codes. (1) **Commission Creation Logic**: Updated three payment processing endpoints in server/routes.ts (lines 3878, 4352, 7085) to accept BOTH `super_admin_affiliate` AND `white_label_affiliate` roles for commission creation. Previously, the role check `affiliate.role === 'super_admin_affiliate'` blocked White Label Affiliates from receiving commissions even when valid referral codes were used. Now uses `(affiliate.role === 'super_admin_affiliate' || affiliate.role === 'white_label_affiliate')` to support both affiliate types. (2) **Enhanced Logging**: Added `affiliateRole` field to commission creation console logs for better monitoring and debugging. White Label Affiliates can now successfully earn commissions when customers purchase plans through their referral URLs, with commissions calculated using the plan's `affiliateCommissionPercentage` and stored in the `referralCommissions` table.
- **Affiliate Announcements Complete Fix - COMPLETE (Oct 31)**: Fixed all announcement interaction issues for both affiliate types. (1) **White Label Affiliate Like Buttons**: Fixed backend endpoint `/api/white-label-affiliate/announcements` to use `getAnnouncementsByWhiteLabelId(whiteLabel.id, user.id)` instead of `getAnnouncementsByUserId()` to include `userLiked` status. Like buttons now properly show selected state (blue background, filled ThumbsUp icon) when announcement is liked. (2) **Super Admin Affiliate Like Buttons**: Updated `AnnouncementsSection` component to check `announcement.userLiked` and apply red text + filled Heart icon when liked. (3) **White Label Affiliate Comments**: Fixed comment endpoint from non-existent `/api/white-label-affiliate/announcements/${id}/comment` to correct `/api/announcements/${id}/comments` and changed payload from `{comment}` to `{content}` to match backend validation. Comments now successfully post. (4) **Real-time Like Updates**: Implemented optimistic UI updates for both affiliate types using TanStack Query's onMutate with proper rollback on error - users see like count changes instantly without page reload. (5) **Debug Logging**: Added comprehensive debug logging to `/api/affiliate-payment` endpoint to investigate proof image upload issues.
- **White Label Client Payment Tracking Fixes - COMPLETE (Oct 31)**: Fixed critical bugs preventing white label clients from viewing affiliate payment data. (1) Updated `/api/affiliate-payments/:affiliateId` endpoint to allow white_label_client role with proper ownership validation (previously only super_admin could access). (2) Fixed `getAffiliatePaymentSummary()` storage method which had hardcoded `totalPaid = 0` and `totalCommission = 100` for white_label_client - now queries actual data from `affiliatePayments` and `referralCommissions` tables. White label clients can now see accurate Total Paid and Total Commission values for their affiliates instead of always showing $0.00.
- **Affiliate Signup Tracking - COMPLETE (Oct 31)**: Added new `affiliateOfWhiteLabelId` column to users table to permanently track which white label an affiliate signed up through via URL parameter `/login?role=affiliate&whitelabel_id=X`. This column is separate from `whiteLabelId` (which can change if affiliate switches white labels) and preserves the original signup source for commission and referral tracking. Updated both signup endpoints (`/api/auth/signup-white-label-affiliate` in authRoutes.ts and `/api/affiliate/signup` in routes.ts) to capture and store the whitelabel_id from URL in BOTH columns. Fixed critical bug where `upsertUserSchema` in shared/schema.ts was missing `affiliateOfWhiteLabelId` in its field list, preventing the value from being inserted. Added `affiliateOfWhiteLabelId: true` to the schema's `.pick()` method to allow the field to be stored. Fixed drizzle.config.ts to use PostgreSQL (Neon) instead of MySQL. Schema changes successfully pushed to database. This enables proper attribution of affiliates to their original white label clients regardless of future changes to their current white label association.
- **White Label Affiliate Referral System - COMPLETE**: Fully implemented referral URL system for White Label Affiliates. Added five backend endpoints: `GET /api/white-label-affiliate/referral-code` (fetch existing code), `PUT /api/white-label-affiliate/referral-code` (save/update code), `POST /api/white-label-affiliate/check-referral-code` (real-time validation), `GET /api/white-label-affiliate/commissions` (view commission data), and `GET /api/white-label-affiliate/referrals` (view referred users). Fixed `updateUserReferralCode()` storage method by adding `.returning()` for PostgreSQL compatibility. Added `getUsersByReferralCode()` storage method to retrieve all users referred by a specific referral code. Frontend fetches white label client's `domainPath` via `/api/white-labels/by-id/:id` and uses it in all referral URLs (`/{domainPath}?ref=code` instead of `/pricing?ref=code`). White Label Affiliates can now create, save, and use referral codes that direct customers to their white label client's custom landing pages. Commission and Referral tabs display proper data.
- **White Label Affiliate Dashboard - COMPLETE**: Implemented full-featured White Label Affiliate Dashboard at `/{domainPath}/affiliate` that mirrors Super Admin Affiliate Dashboard exactly but shows only white label client's plans where `allowAffiliatePromotion=true`. Dashboard includes 6 tabs (Overview, Plans, Profile, Announcements, Payment Details, Payment History) with all features: referral tracking, commission viewing, payment management, QR code generation, and announcement interactions. No visibility toggle needed - affiliates automatically see all promotable plans from their white label client. Backend endpoints at `/api/white-label-affiliate/*` handle plan filtering, announcements, and payment account management. App.tsx routing intelligently renders correct dashboard based on user role.