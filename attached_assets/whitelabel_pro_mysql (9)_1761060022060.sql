-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 18, 2025 at 10:59 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `whitelabel_pro_mysql`
--

-- --------------------------------------------------------

--
-- Table structure for table `activities`
--

CREATE TABLE `activities` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `affiliates`
--

CREATE TABLE `affiliates` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `referral_code` varchar(255) NOT NULL,
  `commission_rate` decimal(5,2) DEFAULT 10.00,
  `total_earnings` decimal(10,2) DEFAULT 0.00,
  `total_referrals` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `bank_name` varchar(255) DEFAULT NULL,
  `account_number` varchar(255) DEFAULT NULL,
  `account_owner_name` varchar(255) DEFAULT NULL,
  `account_type` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `affiliate_type` varchar(255) DEFAULT NULL,
  `parent_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `affiliates`
--

INSERT INTO `affiliates` (`id`, `user_id`, `referral_code`, `commission_rate`, `total_earnings`, `total_referrals`, `is_active`, `bank_name`, `account_number`, `account_owner_name`, `account_type`, `created_at`, `updated_at`, `affiliate_type`, `parent_id`) VALUES
(2, 'affiliate_1', '', 10.00, 850.00, 0, 1, NULL, NULL, NULL, NULL, '2025-06-09 15:08:25', '2025-06-09 15:08:25', 'white_label_affiliate', NULL),
(6, 'hua1objl8w40fw7', 'first1414_7620', 10.00, 0.00, 0, 1, NULL, NULL, NULL, NULL, '2025-10-10 21:20:35', '2025-10-10 21:20:35', 'white_label_affiliate', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `affiliate_payments`
--

CREATE TABLE `affiliate_payments` (
  `id` int(11) NOT NULL,
  `affiliate_id` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'USD',
  `payment_method` varchar(50) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `notes` varchar(1000) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'completed',
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `paid_by_user_id` varchar(255) DEFAULT NULL,
  `transaction_proof_url` varchar(255) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `historical_bank_name` varchar(255) DEFAULT NULL,
  `historical_account_number` varchar(255) DEFAULT NULL,
  `historical_account_owner_name` varchar(255) DEFAULT NULL,
  `historical_account_type` varchar(255) DEFAULT NULL,
  `paid_by` varchar(255) DEFAULT NULL,
  `receipt_image_url` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `affiliate_payments`
--

INSERT INTO `affiliate_payments` (`id`, `affiliate_id`, `amount`, `currency`, `payment_method`, `transaction_id`, `notes`, `status`, `metadata`, `created_at`, `updated_at`, `paid_by_user_id`, `transaction_proof_url`, `description`, `historical_bank_name`, `historical_account_number`, `historical_account_owner_name`, `historical_account_type`, `paid_by`, `receipt_image_url`) VALUES
(3, 'test_affiliate_001', 50.00, 'USD', 'bank_transfer', NULL, NULL, 'completed', NULL, '2025-08-23 13:45:50', '2025-08-23 13:45:50', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '43537113', NULL),
(4, 'db4k9owwms65bna', 0.84, 'USD', 'bank_transfer', NULL, NULL, 'completed', NULL, '2025-08-23 13:46:04', '2025-08-23 13:46:04', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '43537113', NULL),
(5, 'db4k9owwms65bna', 0.69, 'USD', 'bank_transfer', NULL, NULL, 'completed', NULL, '2025-08-23 13:52:23', '2025-08-23 13:52:23', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '43537113', NULL),
(6, '53cnffx7v02h7if', 150.00, 'USD', 'bank_transfer', NULL, NULL, 'completed', NULL, '2025-08-23 13:57:08', '2025-08-23 13:57:08', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '43537113', NULL),
(7, 'db4k9owwms65bna', 0.31, 'USD', 'bank_transfer', NULL, NULL, 'completed', NULL, '2025-08-23 16:05:14', '2025-08-23 16:05:14', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '43537113', NULL),
(8, 'db4k9owwms65bna', 0.50, 'USD', 'bank_transfer', NULL, NULL, 'completed', NULL, '2025-08-23 16:20:52', '2025-08-23 16:20:52', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '43537113', NULL),
(9, 'db4k9owwms65bna', 0.25, 'USD', 'bank_transfer', NULL, NULL, 'completed', NULL, '2025-08-23 16:24:23', '2025-08-23 16:24:23', NULL, '/uploads/payment-proofs/payment-proof-1756002262470-710601803.jpg', NULL, NULL, NULL, NULL, NULL, '43537113', NULL),
(10, 'db4k9owwms65bna', 0.25, 'USD', 'bank_transfer', NULL, NULL, 'completed', NULL, '2025-08-23 17:01:25', '2025-08-23 17:01:25', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '43537113', NULL),
(11, '6pa5688t8fntppw', 120.00, 'USD', 'bank_transfer', NULL, NULL, 'completed', NULL, '2025-08-24 03:33:50', '2025-08-24 03:33:50', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '43537113', NULL),
(12, '6kk4onsspvzjoml', 10.00, 'USD', 'bank_transfer', NULL, NULL, 'completed', NULL, '2025-08-24 05:47:31', '2025-08-24 05:47:31', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '43537113', NULL),
(13, 'db4k9owwms65bna', 0.05, 'USD', 'bank_transfer', NULL, NULL, 'completed', NULL, '2025-08-24 05:59:09', '2025-08-24 05:59:09', NULL, NULL, NULL, 'Easypaisa', '03306252925', 'Muneeb Ahmed', 'checking', '43537113', NULL),
(14, 'aff_001', 100.20, 'USD', 'bank_transfer', NULL, NULL, 'completed', NULL, '2025-08-29 10:35:07', '2025-08-29 10:35:07', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '43537113', NULL),
(15, 'aff_001', 22.20, 'USD', 'bank_transfer', NULL, NULL, 'completed', NULL, '2025-08-29 11:06:05', '2025-08-29 11:06:05', NULL, '/uploads/payment-proofs/payment-proof-1756501564383-33109956.png', NULL, 'Meezan', '03335645614541', 'Sarah Baloch', 'checking', '43537113', NULL),
(16, 'aff_002', 0.20, 'USD', 'bank_transfer', NULL, NULL, 'completed', NULL, '2025-08-29 11:39:43', '2025-08-29 11:39:43', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '43537113', NULL),
(17, 'aff_002', 0.05, 'USD', 'bank_transfer', NULL, NULL, 'completed', NULL, '2025-08-29 11:40:03', '2025-08-29 11:40:03', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '43537113', NULL),
(18, 'db4k9owwms65bna', 0.95, 'USD', 'bank_transfer', NULL, NULL, 'completed', NULL, '2025-08-29 11:57:29', '2025-08-29 11:57:29', NULL, '/uploads/payment-proofs/payment-proof-1756504648499-289105426.png', NULL, 'Easypaisa', '03306252925', 'Muneeb Ahmed', 'checking', '43537113', NULL),
(19, '6kk4onsspvzjoml', 10.00, 'USD', 'bank_transfer', NULL, NULL, 'completed', NULL, '2025-09-19 22:45:05', '2025-09-19 22:45:05', NULL, NULL, NULL, 'Meezan Bank', '0336252924', 'Zaid Raza', 'savings', '43537113', NULL),
(20, '6kk4onsspvzjoml', 10.00, 'USD', 'bank_transfer', NULL, NULL, 'completed', NULL, '2025-09-19 22:45:36', '2025-09-19 22:45:36', NULL, '/uploads/payment-proofs/payment-proof-1758321936818-924951124.png', 'Checking Payment', 'Meezan Bank', '0336252924', 'Zaid Raza', 'savings', '43537113', NULL),
(21, '6kk4onsspvzjoml', 45.00, 'USD', 'bank_transfer', NULL, NULL, 'completed', NULL, '2025-10-16 18:42:45', '2025-10-16 18:42:45', NULL, '/uploads/payment-proofs/payment-proof-1760640165671-249501435.png', NULL, 'Meezan Bank', '0336252924', 'Zaid Raza', 'savings', '43537113', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `affiliate_plan_visibility`
--

CREATE TABLE `affiliate_plan_visibility` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `affiliate_id` varchar(255) NOT NULL,
  `plan_id` int(11) NOT NULL,
  `is_visible` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `affiliate_plan_visibility`
--

INSERT INTO `affiliate_plan_visibility` (`id`, `created_at`, `updated_at`, `affiliate_id`, `plan_id`, `is_visible`) VALUES
(1, '2025-07-18 18:27:54', '2025-08-09 11:58:09', '', 0, 0),
(2, '2025-07-18 19:54:26', '2025-07-18 20:28:24', '', 0, 0),
(3, '2025-07-18 19:54:27', '2025-07-18 19:54:27', '', 0, 0),
(4, '2025-07-18 20:28:25', '2025-07-18 20:28:25', '', 0, 0),
(5, '2025-07-18 20:28:25', '2025-07-18 20:28:25', '', 0, 0),
(6, '2025-07-18 20:28:26', '2025-07-18 20:28:26', '', 0, 0),
(7, '2025-07-18 20:28:27', '2025-07-18 20:28:27', '', 0, 0),
(8, '2025-07-19 15:42:02', '2025-08-09 11:58:09', '', 0, 0),
(9, '2025-07-19 15:42:03', '2025-08-02 03:41:34', '', 0, 0),
(10, '2025-07-19 15:42:04', '2025-08-09 11:57:11', '', 0, 0),
(11, '2025-07-19 15:42:06', '2025-08-04 21:40:05', '', 0, 0),
(12, '2025-07-19 15:42:06', '2025-08-06 04:51:05', '', 0, 0),
(13, '2025-07-19 15:42:07', '2025-07-23 19:34:09', '', 0, 0),
(14, '2025-07-19 15:42:08', '2025-07-23 19:34:10', '', 0, 0),
(15, '2025-07-19 15:42:09', '2025-07-23 19:34:11', '', 0, 0),
(16, '2025-07-19 15:42:10', '2025-07-23 19:34:12', '', 0, 0),
(17, '2025-07-19 15:42:11', '2025-07-23 19:34:13', '', 0, 0),
(18, '2025-07-23 19:10:46', '2025-07-23 19:41:07', '', 0, 0),
(19, '2025-07-23 19:10:51', '2025-07-23 19:30:19', '', 0, 0),
(20, '2025-07-23 19:10:52', '2025-07-23 19:30:20', '', 0, 0),
(21, '2025-08-04 21:39:46', '2025-08-09 11:58:10', '', 0, 0),
(22, '2025-08-05 01:55:00', '2025-08-05 01:55:00', '', 0, 0),
(23, '2025-08-05 02:45:38', '2025-08-05 02:45:38', '', 0, 0),
(24, '2025-08-06 05:33:21', '2025-08-06 05:33:21', '', 0, 0),
(25, '2025-08-06 05:33:31', '2025-08-06 05:33:31', '', 0, 0),
(26, '2025-08-12 02:55:14', '2025-08-12 02:55:14', '', 0, 0),
(27, '2025-08-12 02:55:16', '2025-08-12 02:55:16', '', 0, 0),
(28, '2025-08-12 02:55:17', '2025-08-12 09:04:39', '', 0, 0),
(29, '2025-08-12 03:13:21', '2025-08-12 03:13:21', '', 0, 0),
(30, '2025-08-12 03:25:49', '2025-08-12 03:25:49', '', 0, 0),
(31, '2025-08-12 09:28:21', '2025-08-12 09:31:46', '', 0, 0),
(32, '2025-08-12 10:10:31', '2025-08-12 10:10:31', '', 0, 0),
(33, '2025-08-13 09:07:28', '2025-08-13 09:07:28', '', 0, 0),
(34, '2025-08-23 11:59:16', '2025-08-23 12:51:01', '', 0, 0),
(35, '2025-10-10 18:26:11', '2025-10-10 18:26:11', 'hua1objl8w40fw7', 136, 1),
(36, '2025-10-10 19:08:28', '2025-10-10 19:08:28', 'hua1objl8w40fw7', 134, 1),
(37, '2025-10-11 08:18:17', '2025-10-11 08:18:17', 'hua1objl8w40fw7', 140, 1),
(38, '2025-10-16 23:38:20', '2025-10-16 23:38:20', 'hua1objl8w40fw7', 133, 1);

-- --------------------------------------------------------

--
-- Table structure for table `ai_content_optimizations`
--

CREATE TABLE `ai_content_optimizations` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ai_generated_content`
--

CREATE TABLE `ai_generated_content` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `content_type` varchar(50) NOT NULL,
  `prompt` text NOT NULL,
  `generated_content` text NOT NULL,
  `tokens_used` int(11) DEFAULT NULL,
  `model_used` varchar(100) DEFAULT NULL,
  `quality_score` int(11) DEFAULT NULL,
  `is_approved` tinyint(1) DEFAULT 0,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `type` varchar(255) DEFAULT NULL,
  `usage_count` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ai_generated_content`
--

INSERT INTO `ai_generated_content` (`id`, `user_id`, `content_type`, `prompt`, `generated_content`, `tokens_used`, `model_used`, `quality_score`, `is_approved`, `metadata`, `created_at`, `type`, `usage_count`, `updated_at`) VALUES
(1, '43537113', '', 'Hello', 'Experience premium quality with our innovative solution. Designed for professionals who demand excellence, this product delivers outstanding performance and reliability. Key features include advanced functionality, user-friendly interface, and comprehensive support. Perfect for businesses looking to enhance their operations and achieve better results.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"audience\":\"\",\"keywords\":[],\"suggestions\":[\"Add specific technical specifications\",\"Include customer testimonials\",\"Mention warranty and support details\",\"Add pricing and availability information\"]}', '2025-06-22 03:39:26', 'product_description', 0, '2025-06-22 08:39:26'),
(2, '43537113', '', 'Hello', 'Experience premium quality with our innovative solution. Designed for professionals who demand excellence, this product delivers outstanding performance and reliability. Key features include advanced functionality, user-friendly interface, and comprehensive support. Perfect for businesses looking to enhance their operations and achieve better results.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"audience\":\"\",\"keywords\":[],\"suggestions\":[\"Add specific technical specifications\",\"Include customer testimonials\",\"Mention warranty and support details\",\"Add pricing and availability information\"]}', '2025-06-22 03:39:40', 'product_description', 0, '2025-06-22 08:39:40'),
(3, '43537113', '', 'Hello', 'Experience premium quality with our innovative solution. Designed for professionals who demand excellence, this product delivers outstanding performance and reliability. Key features include advanced functionality, user-friendly interface, and comprehensive support. Perfect for businesses looking to enhance their operations and achieve better results.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"audience\":\"\",\"keywords\":[],\"suggestions\":[\"Add specific technical specifications\",\"Include customer testimonials\",\"Mention warranty and support details\",\"Add pricing and availability information\"]}', '2025-06-22 03:44:03', 'product_description', 0, '2025-06-22 08:44:03'),
(4, '43537113', '', 'Hello', 'Experience premium quality with our innovative solution. Designed for professionals who demand excellence, this product delivers outstanding performance and reliability. Key features include advanced functionality, user-friendly interface, and comprehensive support. Perfect for businesses looking to enhance their operations and achieve better results.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"audience\":\"\",\"keywords\":[],\"suggestions\":[\"Add specific technical specifications\",\"Include customer testimonials\",\"Mention warranty and support details\",\"Add pricing and availability information\"]}', '2025-06-22 03:44:39', 'product_description', 0, '2025-06-22 08:44:39'),
(5, '43537113', '', 'Hello', 'Experience premium quality with our innovative solution. Designed for professionals who demand excellence, this product delivers outstanding performance and reliability. Key features include advanced functionality, user-friendly interface, and comprehensive support. Perfect for businesses looking to enhance their operations and achieve better results.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"audience\":\"\",\"keywords\":[],\"suggestions\":[\"Add specific technical specifications\",\"Include customer testimonials\",\"Mention warranty and support details\",\"Add pricing and availability information\"]}', '2025-06-22 03:47:05', 'product_description', 0, '2025-06-22 08:47:05'),
(6, '43537113', '', 'Make A Description Of The JavaScript', 'Experience premium quality with our innovative solution. Designed for professionals who demand excellence, this product delivers outstanding performance and reliability. Key features include advanced functionality, user-friendly interface, and comprehensive support. Perfect for businesses looking to enhance their operations and achieve better results.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"audience\":\"JavaScript\",\"keywords\":[\"JavaScript\",\"Coding\"],\"suggestions\":[\"Add specific technical specifications\",\"Include customer testimonials\",\"Mention warranty and support details\",\"Add pricing and availability information\"]}', '2025-06-22 03:48:13', 'product_description', 0, '2025-06-22 08:48:13'),
(7, '43537113', '', 'Make A Description Of The JavaScript Product', 'Experience premium quality with our innovative solution. Designed for professionals who demand excellence, this product delivers outstanding performance and reliability. Key features include advanced functionality, user-friendly interface, and comprehensive support. Perfect for businesses looking to enhance their operations and achieve better results.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"audience\":\"Coders\",\"keywords\":[\"JavaScript\",\"Coding\"],\"suggestions\":[\"Add specific technical specifications\",\"Include customer testimonials\",\"Mention warranty and support details\",\"Add pricing and availability information\"]}', '2025-06-22 03:53:39', 'product_description', 0, '2025-06-22 08:53:39'),
(8, '43537113', '', 'Make A Description For JavaScript Product', 'Experience premium quality with our innovative solution. Designed for professionals who demand excellence, this product delivers outstanding performance and reliability. Key features include advanced functionality, user-friendly interface, and comprehensive support. Perfect for businesses looking to enhance their operations and achieve better results.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"audience\":\"Coders\",\"keywords\":[\"JavaScript\",\"Coding\"],\"suggestions\":[\"Add specific technical specifications\",\"Include customer testimonials\",\"Mention warranty and support details\",\"Add pricing and availability information\"]}', '2025-06-22 03:56:49', 'product_description', 0, '2025-06-22 08:56:49'),
(9, '43537113', '', 'Hello', 'Experience premium quality with our innovative solution. Designed for professionals who demand excellence, this product delivers outstanding performance and reliability. Key features include advanced functionality, user-friendly interface, and comprehensive support. Perfect for businesses looking to enhance their operations and achieve better results.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"audience\":\"\",\"keywords\":[],\"suggestions\":[\"Add specific technical specifications\",\"Include customer testimonials\",\"Mention warranty and support details\",\"Add pricing and availability information\"]}', '2025-06-22 03:59:47', 'product_description', 0, '2025-06-22 08:59:47'),
(10, '43537113', '', 'javascript coding platform for developers', 'Experience cutting-edge technology with our innovative software solution. Built with modern architecture and user-centric design, our platform delivers powerful functionality while maintaining simplicity and reliability. Transform your digital workflow today.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"audience\":\"\",\"keywords\":[],\"suggestions\":[\"Add technical specifications and compatibility\",\"Include security and privacy features\",\"Mention customer support and documentation\",\"Add integration capabilities and API access\"]}', '2025-06-22 04:16:58', 'product_description', 0, '2025-06-22 09:16:58'),
(11, '43537113', '', 'javascript coding platform for developers', 'Experience cutting-edge technology with our innovative software solution. Built with modern architecture and user-centric design, our platform delivers powerful functionality while maintaining simplicity and reliability. Transform your digital workflow today.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"audience\":\"\",\"keywords\":[],\"suggestions\":[\"Add technical specifications and compatibility\",\"Include security and privacy features\",\"Mention customer support and documentation\",\"Add integration capabilities and API access\"]}', '2025-06-22 04:17:02', 'product_description', 0, '2025-06-22 09:17:02'),
(12, '43537113', '', 'business enterprise workflow solution', 'Elevate your business operations with our professional-grade solution. Designed for modern enterprises, our platform streamlines workflows, enhances productivity, and drives measurable results. Join thousands of successful businesses that have transformed their operations with our proven methodology.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"audience\":\"\",\"keywords\":[],\"suggestions\":[\"Include specific ROI metrics and case studies\",\"Add integration capabilities with existing systems\",\"Mention scalability for growing businesses\",\"Include compliance and security features\"]}', '2025-06-22 04:17:06', 'product_description', 0, '2025-06-22 09:17:06'),
(13, '43537113', '', 'video course tutorial platform', 'Transform your learning experience with our comprehensive video content. Our expertly crafted courses provide step-by-step guidance, practical examples, and actionable insights. Whether you\'re a beginner or advanced learner, our content is designed to help you master new skills quickly and effectively.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"audience\":\"\",\"keywords\":[],\"suggestions\":[\"Add course duration and structure details\",\"Include instructor credentials and experience\",\"Mention completion certificates or outcomes\",\"Add student testimonials and success stories\"]}', '2025-06-22 04:17:48', 'product_description', 0, '2025-06-22 09:17:48'),
(14, '43537113', '', 'business enterprise workflow solution', 'Elevate your business operations with our professional-grade solution. Designed for modern enterprises, our platform streamlines workflows, enhances productivity, and drives measurable results. Join thousands of successful businesses that have transformed their operations with our proven methodology.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"audience\":\"\",\"keywords\":[],\"suggestions\":[\"Include specific ROI metrics and case studies\",\"Add integration capabilities with existing systems\",\"Mention scalability for growing businesses\",\"Include compliance and security features\"]}', '2025-06-22 04:17:54', 'product_description', 0, '2025-06-22 09:17:54'),
(15, '43537113', '', 'javascript coding platform for developers', 'Experience cutting-edge technology with our innovative software solution. Built with modern architecture and user-centric design, our platform delivers powerful functionality while maintaining simplicity and reliability. Transform your digital workflow today.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"audience\":\"\",\"keywords\":[],\"suggestions\":[\"Add technical specifications and compatibility\",\"Include security and privacy features\",\"Mention customer support and documentation\",\"Add integration capabilities and API access\"]}', '2025-06-22 04:18:16', 'product_description', 0, '2025-06-22 09:18:16'),
(16, '43537113', '', 'business enterprise workflow solution', 'Elevate your business operations with our professional-grade solution. Designed for modern enterprises, our platform streamlines workflows, enhances productivity, and drives measurable results. Join thousands of successful businesses that have transformed their operations with our proven methodology.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"audience\":\"\",\"keywords\":[],\"suggestions\":[\"Include specific ROI metrics and case studies\",\"Add integration capabilities with existing systems\",\"Mention scalability for growing businesses\",\"Include compliance and security features\"]}', '2025-06-22 04:18:19', 'product_description', 0, '2025-06-22 09:18:19'),
(17, '43537113', '', 'javascript coding platform for developers', 'Experience cutting-edge technology with our innovative software solution. Built with modern architecture and user-centric design, our platform delivers powerful functionality while maintaining simplicity and reliability. Transform your digital workflow today.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"audience\":\"tech start ups\",\"keywords\":[\"innovative\"],\"suggestions\":[\"Add technical specifications and compatibility\",\"Include security and privacy features\",\"Mention customer support and documentation\",\"Add integration capabilities and API access\"]}', '2025-06-22 04:18:35', 'product_description', 0, '2025-06-22 09:18:35'),
(18, '43537113', '', 'Where Is Pakistan', 'Experience premium quality with our innovative solution. Designed for professionals who demand excellence, this product delivers outstanding performance and reliability. Key features include advanced functionality, user-friendly interface, and comprehensive support. Perfect for businesses looking to enhance their operations and achieve better results.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"audience\":\"\",\"keywords\":[],\"suggestions\":[\"Add specific technical specifications\",\"Include customer testimonials\",\"Mention warranty and support details\",\"Add pricing and availability information\"]}', '2025-06-22 04:21:18', 'product_description', 0, '2025-06-22 09:21:18'),
(19, '43537113', '', 'Create a compelling video product description for: \"Amazing YT Video\"', 'Transform your learning experience with our comprehensive video content. Our expertly crafted courses provide step-by-step guidance, practical examples, and actionable insights. Whether you\'re a beginner or advanced learner, our content is designed to help you master new skills quickly and effectively.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add course duration and structure details\",\"Include instructor credentials and experience\",\"Mention completion certificates or outcomes\",\"Add student testimonials and success stories\"]}', '2025-06-22 04:58:10', 'product_description', 0, '2025-06-22 09:58:10'),
(20, '43537113', '', 'Enhance this video product description: \"experience with our comprehensive  content. Our expertly crafted courses provide step-by-step guidance, practical examples, and actionable insights. Whether you\'re a  or advanced learner, our content is designed to help y\" for product \"Amazing YT Video\"', 'Transform your learning experience with our comprehensive video content. Our expertly crafted courses provide step-by-step guidance, practical examples, and actionable insights. Whether you\'re a beginner or advanced learner, our content is designed to help you master new skills quickly and effectively.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add course duration and structure details\",\"Include instructor credentials and experience\",\"Mention completion certificates or outcomes\",\"Add student testimonials and success stories\"]}', '2025-06-22 04:58:36', 'product_description', 0, '2025-06-22 09:58:36'),
(21, '43537113', '', 'Enhance this video product description: \"Transform your learning experience with our comprehensive video content. Our expertly crafted courses provide step-by-step guidance, practical examples, and actionable insights. Whether you\'re a beginner or advanced learner, our content is designed to help you master new skills quickly and effectively.\" for product \"Amazing Video\"', 'Transform your learning experience with our comprehensive video content. Our expertly crafted courses provide step-by-step guidance, practical examples, and actionable insights. Whether you\'re a beginner or advanced learner, our content is designed to help you master new skills quickly and effectively.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add course duration and structure details\",\"Include instructor credentials and experience\",\"Mention completion certificates or outcomes\",\"Add student testimonials and success stories\"]}', '2025-06-22 04:58:45', 'product_description', 0, '2025-06-22 09:58:45'),
(22, '43537113', '', 'Create a compelling video product description for: \"Amazing Video\"', 'Transform your learning experience with our comprehensive video content. Our expertly crafted courses provide step-by-step guidance, practical examples, and actionable insights. Whether you\'re a beginner or advanced learner, our content is designed to help you master new skills quickly and effectively.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add course duration and structure details\",\"Include instructor credentials and experience\",\"Mention completion certificates or outcomes\",\"Add student testimonials and success stories\"]}', '2025-06-22 04:58:51', 'product_description', 0, '2025-06-22 09:58:51'),
(23, '43537113', '', 'Enhance this document product description: \"Video\" for product \"Video\"', 'Transform your learning experience with our comprehensive video content. Our expertly crafted courses provide step-by-step guidance, practical examples, and actionable insights. Whether you\'re a beginner or advanced learner, our content is designed to help you master new skills quickly and effectively.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add course duration and structure details\",\"Include instructor credentials and experience\",\"Mention completion certificates or outcomes\",\"Add student testimonials and success stories\"]}', '2025-06-22 04:59:03', 'product_description', 0, '2025-06-22 09:59:03'),
(24, '43537113', '', 'Create a compelling document product description for: \"V\"', 'Experience premium quality with our innovative solution. Designed for professionals who demand excellence, this product delivers outstanding performance and reliability. Key features include advanced functionality, user-friendly interface, and comprehensive support. Perfect for businesses looking to enhance their operations and achieve better results.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add specific technical specifications\",\"Include customer testimonials\",\"Mention warranty and support details\",\"Add pricing and availability information\"]}', '2025-06-22 04:59:13', 'product_description', 0, '2025-06-22 09:59:13'),
(25, '43537113', '', 'Create a compelling video product description for: \"GTA 6 Trailer\"', 'Transform your learning experience with our comprehensive video content. Our expertly crafted courses provide step-by-step guidance, practical examples, and actionable insights. Whether you\'re a beginner or advanced learner, our content is designed to help you master new skills quickly and effectively.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add course duration and structure details\",\"Include instructor credentials and experience\",\"Mention completion certificates or outcomes\",\"Add student testimonials and success stories\"]}', '2025-06-22 05:02:35', 'product_description', 0, '2025-06-22 10:02:35'),
(26, '43537113', '', 'Enhance this video product description: \"GTA 6 Trailer Video\" for product \"Video\"', 'Transform your learning experience with our comprehensive video content. Our expertly crafted courses provide step-by-step guidance, practical examples, and actionable insights. Whether you\'re a beginner or advanced learner, our content is designed to help you master new skills quickly and effectively.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add course duration and structure details\",\"Include instructor credentials and experience\",\"Mention completion certificates or outcomes\",\"Add student testimonials and success stories\"]}', '2025-06-22 05:03:35', 'product_description', 0, '2025-06-22 10:03:35'),
(27, '43537113', '', 'Enhance this document product description: \"Video\" for product \"Video\"', 'Transform your learning experience with our comprehensive video content. Our expertly crafted courses provide step-by-step guidance, practical examples, and actionable insights. Whether you\'re a beginner or advanced learner, our content is designed to help you master new skills quickly and effectively.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add course duration and structure details\",\"Include instructor credentials and experience\",\"Mention completion certificates or outcomes\",\"Add student testimonials and success stories\"]}', '2025-06-22 05:03:49', 'product_description', 0, '2025-06-22 10:03:49'),
(28, '43537113', '', 'Video', 'Transform your learning experience with our comprehensive video content. Our expertly crafted courses provide step-by-step guidance, practical examples, and actionable insights. Whether you\'re a beginner or advanced learner, our content is designed to help you master new skills quickly and effectively.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"audience\":\"\",\"keywords\":[],\"suggestions\":[\"Add course duration and structure details\",\"Include instructor credentials and experience\",\"Mention completion certificates or outcomes\",\"Add student testimonials and success stories\"]}', '2025-06-22 05:04:01', 'product_description', 0, '2025-06-22 10:04:01'),
(29, '43537113', '', 'Hello\n', 'Discover the power of hello Addressing the challenges that matter most Our comprehensive approach delivers results Advanced capabilities designed for excellence Experience measurable improvements and lasting value Take the next step toward success', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"audience\":\"\",\"keywords\":[],\"suggestions\":[\"Enhance the description with specific details about hello\",\"Add compelling statistics or performance metrics\",\"Include customer testimonials or success stories\",\"Specify target audience and use cases\"]}', '2025-06-22 05:11:19', 'product_description', 0, '2025-06-22 10:11:19'),
(30, '43537113', '', 'Create a compelling audio product description for: \"Music\"', 'Discover the power of create Addressing the challenges that matter most Our comprehensive approach delivers results Advanced capabilities designed for excellence Experience measurable improvements and lasting value Take the next step toward success', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance the description with specific details about create\",\"Add compelling statistics or performance metrics\",\"Include customer testimonials or success stories\",\"Specify target audience and use cases\"]}', '2025-06-22 05:11:44', 'product_description', 0, '2025-06-22 10:11:44'),
(31, '43537113', '', 'Enhance this audio product description: \"Discover the power of create Addressing the challenges that matter most Our comprehensive approach delivers results Advanced capabilities designed for excellence Experience measurable improvements and lasting value Take the next step toward success\" for product \"Cooming Soon\"', 'Discover the power of enhance Addressing the challenges that matter most Our comprehensive approach delivers results Advanced capabilities designed for excellence Experience measurable improvements and lasting value Take the next step toward success', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance the description with specific details about enhance\",\"Add compelling statistics or performance metrics\",\"Include customer testimonials or success stories\",\"Specify target audience and use cases\"]}', '2025-06-22 05:12:10', 'product_description', 0, '2025-06-22 10:12:10'),
(32, '43537113', '', 'Create a compelling audio product description for: \"Cooming Soon\"', 'Discover the power of create Addressing the challenges that matter most Our comprehensive approach delivers results Advanced capabilities designed for excellence Experience measurable improvements and lasting value Take the next step toward success', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance the description with specific details about create\",\"Add compelling statistics or performance metrics\",\"Include customer testimonials or success stories\",\"Specify target audience and use cases\"]}', '2025-06-22 05:12:15', 'product_description', 0, '2025-06-22 10:12:15'),
(33, '43537113', '', 'Create a compelling video product description for: \"GTA 6 Game Review\"', 'Discover the power of create Addressing the challenges that matter most Our comprehensive approach delivers results Advanced capabilities designed for excellence Experience measurable improvements and lasting value Take the next step toward success', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance the description with specific details about create\",\"Add compelling statistics or performance metrics\",\"Include customer testimonials or success stories\",\"Specify target audience and use cases\"]}', '2025-06-22 05:12:48', 'product_description', 0, '2025-06-22 10:12:48'),
(34, '43537113', '', 'Enhance this video product description: \"GTA 6 Game Review\" for product \"GTA 6 Game Review\"', 'Discover the power of enhance Addressing the challenges that matter most Our comprehensive approach delivers results Advanced capabilities designed for excellence Experience measurable improvements and lasting value Take the next step toward success', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance the description with specific details about enhance\",\"Add compelling statistics or performance metrics\",\"Include customer testimonials or success stories\",\"Specify target audience and use cases\"]}', '2025-06-22 05:13:45', 'product_description', 0, '2025-06-22 10:13:45'),
(35, '43537113', '', 'Create a compelling website_link product description for: \"GTA 6 Game Review\"', 'Discover the power of create Addressing the challenges that matter most Our comprehensive approach delivers results Advanced capabilities designed for excellence Experience measurable improvements and lasting value Take the next step toward success', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance the description with specific details about create\",\"Add compelling statistics or performance metrics\",\"Include customer testimonials or success stories\",\"Specify target audience and use cases\"]}', '2025-06-22 05:16:25', 'product_description', 0, '2025-06-22 10:16:25'),
(36, '43537113', '', 'Create a compelling video product description for: \"GTA 6 Game Review\"', 'Discover the power of create Addressing the challenges that matter most Our comprehensive approach delivers results Advanced capabilities designed for excellence Experience measurable improvements and lasting value Take the next step toward success', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance the description with specific details about create\",\"Add compelling statistics or performance metrics\",\"Include customer testimonials or success stories\",\"Specify target audience and use cases\"]}', '2025-06-22 05:16:33', 'product_description', 0, '2025-06-22 10:16:33'),
(37, '43537113', '', 'Create a compelling website_link product description for: \"GTA 6 Game Review\"', 'Dive deep into the most anticipated gaming release of the decade with our comprehensive GTA 6 analysis. This groundbreaking review covers everything from the stunning Vice City recreation to revolutionary gameplay mechanics that redefine open-world gaming. Explore detailed breakdowns of the dual protagonist system, cutting-edge graphics technology, and the massive scope that makes this the most ambitious Grand Theft Auto ever created. Whether you\'re a longtime fan or new to the series, this review provides expert insights into why GTA 6 represents a quantum leap in interactive entertainment.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance the description with specific details about create\",\"Add compelling statistics or performance metrics\",\"Include customer testimonials or success stories\",\"Specify target audience and use cases\"]}', '2025-06-22 05:19:52', 'product_description', 0, '2025-06-22 10:19:52'),
(38, '43537113', '', 'Create a compelling video product description for: \"Coding Video\"', 'Discover the excitement of create in stunning detail. This highly anticipated release delivers cutting-edge visuals, immersive storytelling, and groundbreaking elements that set new industry standards. Experience unprecedented quality and engaging content that captivates audiences worldwide.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance the description with specific details about create\",\"Add compelling statistics or performance metrics\",\"Include customer testimonials or success stories\",\"Specify target audience and use cases\"]}', '2025-06-22 05:20:28', 'product_description', 0, '2025-06-22 10:20:28'),
(39, '43537113', '', 'Enhance this video product description: \"Discover the excitement of create in stunning detail. This highly anticipated release delivers cutting-edge visuals, immersive storytelling, and groundbreaking elements that set new industry standards. Experience unprecedented quality and engaging content that captivates audiences worldwide.\" for product \"E-Commerce\"', 'Discover the excitement of enhance in stunning detail. This highly anticipated release delivers cutting-edge visuals, immersive storytelling, and groundbreaking elements that set new industry standards. Experience unprecedented quality and engaging content that captivates audiences worldwide.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance the description with specific details about enhance\",\"Add compelling statistics or performance metrics\",\"Include customer testimonials or success stories\",\"Specify target audience and use cases\"]}', '2025-06-22 05:21:06', 'product_description', 0, '2025-06-22 10:21:06'),
(40, '43537113', '', 'Create a compelling video product description for: \"E-Commerce\"', 'Discover the excitement of create in stunning detail. This highly anticipated release delivers cutting-edge visuals, immersive storytelling, and groundbreaking elements that set new industry standards. Experience unprecedented quality and engaging content that captivates audiences worldwide.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance the description with specific details about create\",\"Add compelling statistics or performance metrics\",\"Include customer testimonials or success stories\",\"Specify target audience and use cases\"]}', '2025-06-22 05:21:11', 'product_description', 0, '2025-06-22 10:21:11'),
(41, '43537113', '', 'Enhance this video product description: \"Discover the excitement of create in stunning detail. This highly anticipated release delivers cutting-edge visuals, immersive storytelling, and groundbreaking elements that set new industry standards. Experience unprecedented quality and engaging content that captivates audiences worldwide.\" for product \"GTA 6 Game Review\"', 'Dive deep into the most anticipated gaming release of the decade with our comprehensive GTA 6 analysis. This groundbreaking review covers everything from the stunning Vice City recreation to revolutionary gameplay mechanics that redefine open-world gaming. Explore detailed breakdowns of the dual protagonist system, cutting-edge graphics technology, and the massive scope that makes this the most ambitious Grand Theft Auto ever created. Whether you\'re a longtime fan or new to the series, this review provides expert insights into why GTA 6 represents a quantum leap in interactive entertainment.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance the description with specific details about enhance\",\"Add compelling statistics or performance metrics\",\"Include customer testimonials or success stories\",\"Specify target audience and use cases\"]}', '2025-06-22 05:21:25', 'product_description', 0, '2025-06-22 10:21:25'),
(42, '43537113', '', 'Create a compelling website_link product description for: \"GitHub · Build and ship software on a single, collaborative platform\"', 'Transform your workflow with website_link, a cutting-edge platform engineered for maximum productivity. Built with modern architecture featuring cloud-native scalability, enterprise-grade security, and intuitive user interfaces. Key capabilities include seamless third-party integrations, real-time collaboration tools, advanced analytics, and automated workflows that eliminate manual processes and drive measurable business results.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance the description with specific details about website_link\",\"Add compelling statistics or performance metrics\",\"Include customer testimonials or success stories\",\"Specify target audience and use cases\"]}', '2025-06-22 05:28:14', 'product_description', 0, '2025-06-22 10:28:14'),
(43, '43537113', '', 'Create a compelling article product description for: \"GitHub · Build and ship software on a single, collaborative platform\"', 'Transform your workflow with article, a cutting-edge platform engineered for maximum productivity. Built with modern architecture featuring cloud-native scalability, enterprise-grade security, and intuitive user interfaces. Key capabilities include seamless third-party integrations, real-time collaboration tools, advanced analytics, and automated workflows that eliminate manual processes and drive measurable business results.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance the description with specific details about article\",\"Add compelling statistics or performance metrics\",\"Include customer testimonials or success stories\",\"Specify target audience and use cases\"]}', '2025-06-22 05:28:29', 'product_description', 0, '2025-06-22 10:28:29'),
(44, '43537113', '', 'Enhance this article product description: \"Transform your workflow with article, a cutting-edge platform engineered for maximum productivity. Built with modern architecture featuring cloud-native scalability, enterprise-grade security, and intuitive user interfaces. Key capabilities include seamless third-party integrations, real-time collaboration tools, advanced analytics, and automated workflows that eliminate manual processes and drive measurable business results.\" for product \"GitHub\"', 'Transform your workflow with article, a cutting-edge platform engineered for maximum productivity. Built with modern architecture featuring cloud-native scalability, enterprise-grade security, and intuitive user interfaces. Key capabilities include seamless third-party integrations, real-time collaboration tools, advanced analytics, and automated workflows that eliminate manual processes and drive measurable business results.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance the description with specific details about article\",\"Add compelling statistics or performance metrics\",\"Include customer testimonials or success stories\",\"Specify target audience and use cases\"]}', '2025-06-22 05:28:47', 'product_description', 0, '2025-06-22 10:28:47'),
(45, '43537113', '', 'Create a compelling article product description for: \"GitHub\"', 'Discover the exceptional quality of article. This premium offering combines innovative design with superior performance to deliver outstanding results. Built with attention to detail and engineered for excellence, it provides the reliability and functionality you need to achieve your goals with confidence.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance the description with specific details about article\",\"Add compelling statistics or performance metrics\",\"Include customer testimonials or success stories\",\"Specify target audience and use cases\"]}', '2025-06-22 05:28:52', 'product_description', 0, '2025-06-22 10:28:52'),
(46, '43537113', '', 'Create a compelling article product description for: \"Minecraft Adventure\"', 'Discover the exceptional quality of article. This premium offering combines innovative design with superior performance to deliver outstanding results. Built with attention to detail and engineered for excellence, it provides the reliability and functionality you need to achieve your goals with confidence.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance the description with specific details about article\",\"Add compelling statistics or performance metrics\",\"Include customer testimonials or success stories\",\"Specify target audience and use cases\"]}', '2025-06-22 05:29:14', 'product_description', 0, '2025-06-22 10:29:14'),
(47, '43537113', '', 'Create a compelling article product description for: \"JavaScript Tutorial Course\"\"', 'Master modern JavaScript development with our comprehensive programming solution. This expert-crafted resource covers everything from ES6+ fundamentals to advanced frameworks like React, Vue, and Node.js. Learn industry-standard practices including async programming, module systems, testing strategies, and performance optimization. Perfect for developers looking to build scalable web applications, APIs, and full-stack solutions that meet today\'s demanding technical requirements.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance the description with specific details about article\",\"Add compelling statistics or performance metrics\",\"Include customer testimonials or success stories\",\"Specify target audience and use cases\"]}', '2025-06-22 05:29:32', 'product_description', 0, '2025-06-22 10:29:32'),
(48, '43537113', '', 'Create a compelling article product description for: \"Business Management Software\"', 'Streamline your business operations with our comprehensive management software solution. This enterprise-grade platform integrates project management, team collaboration, resource allocation, and performance analytics into one powerful system. Features include automated workflow management, real-time reporting dashboards, advanced permission controls, and seamless integration with existing business tools. Designed for growing organizations that need scalable solutions to manage complex operations efficiently.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance the description with specific details about article\",\"Add compelling statistics or performance metrics\",\"Include customer testimonials or success stories\",\"Specify target audience and use cases\"]}', '2025-06-22 05:29:45', 'product_description', 0, '2025-06-22 10:29:45'),
(49, '43537113', '', 'Enhance this article product description: \"Streamline your business operations with our comprehensive management software solution. This enterprise-grade platform integrates project management, team collaboration, resource allocation, and performance analytics into one powerful system. Features include automated workflow management, real-time reporting dashboards, advanced permission controls, and seamless integration with existing business tools. Designed for growing organizations that need scalable solutions to manage complex operations efficiently.\" for product \"Management Software\"', 'Transform your workflow with article, a cutting-edge platform engineered for maximum productivity. Built with modern architecture featuring cloud-native scalability, enterprise-grade security, and intuitive user interfaces. Key capabilities include seamless third-party integrations, real-time collaboration tools, advanced analytics, and automated workflows that eliminate manual processes and drive measurable business results.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance the description with specific details about article\",\"Add compelling statistics or performance metrics\",\"Include customer testimonials or success stories\",\"Specify target audience and use cases\"]}', '2025-06-22 05:29:55', 'product_description', 0, '2025-06-22 10:29:55'),
(50, '43537113', '', 'Enhance this article product description: \"Transform your workflow with article, a cutting-edge platform engineered for maximum productivity. Built with modern architecture featuring cloud-native scalability, enterprise-grade security, and intuitive user interfaces. Key capabilities include seamless third-party integrations, real-time collaboration tools, advanced analytics, and automated workflows that eliminate manual processes and drive measurable business results.\" for product \"Management\"', 'Transform your workflow with article, a cutting-edge platform engineered for maximum productivity. Built with modern architecture featuring cloud-native scalability, enterprise-grade security, and intuitive user interfaces. Key capabilities include seamless third-party integrations, real-time collaboration tools, advanced analytics, and automated workflows that eliminate manual processes and drive measurable business results.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance the description with specific details about article\",\"Add compelling statistics or performance metrics\",\"Include customer testimonials or success stories\",\"Specify target audience and use cases\"]}', '2025-06-22 05:30:04', 'product_description', 0, '2025-06-22 10:30:04'),
(51, '43537113', '', 'Create a compelling video product description for: \"Amazing Hacks\"', 'Discover the exceptional quality of Amazing Hacks with our comprehensive solution. This premium offering combines innovative design, superior functionality, and outstanding value to deliver results that exceed expectations. Built with attention to detail and engineered for excellence, it provides the reliability and performance you need to achieve your goals with confidence.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add specific details about key features and capabilities\",\"Include customer testimonials and success stories\",\"Mention pricing options and value propositions\",\"Add target audience and ideal use cases\"]}', '2025-06-22 05:38:48', 'product_description', 0, '2025-06-22 10:38:48'),
(52, '43537113', '', 'Enhance this video product description: \"Discover the exceptional quality of Amazing Hacks with our comprehensive solution. This premium offering combines innovative design, superior functionality, and outstanding value to deliver results that exceed expectations. Built with attention to detail and engineered for excellence, it provides the reliability and performance you need to achieve your goals with confidence.\" for product \"Amazing Topics\"', 'Discover the exceptional quality of Amazing Topics with our comprehensive solution. This premium offering combines innovative design, superior functionality, and outstanding value to deliver results that exceed expectations. Built with attention to detail and engineered for excellence, it provides the reliability and performance you need to achieve your goals with confidence.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add specific details about key features and capabilities\",\"Include customer testimonials and success stories\",\"Mention pricing options and value propositions\",\"Add target audience and ideal use cases\"]}', '2025-06-22 05:39:00', 'product_description', 0, '2025-06-22 10:39:00'),
(53, '43537113', '', 'Enhance this video product description: \"Discover the exceptional quality of Amazing Topics with our comprehensive solution. This premium offering combines innovative design, superior functionality, and outstanding value to deliver results that exceed expectations. Built with attention to detail and engineered for excellence, it provides the reliability and performance you need to achieve your goals with confidence.\" for product \"Life Hack\"', 'Discover the exceptional quality of Life Hack with our comprehensive solution. This premium offering combines innovative design, superior functionality, and outstanding value to deliver results that exceed expectations. Built with attention to detail and engineered for excellence, it provides the reliability and performance you need to achieve your goals with confidence.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add specific details about key features and capabilities\",\"Include customer testimonials and success stories\",\"Mention pricing options and value propositions\",\"Add target audience and ideal use cases\"]}', '2025-06-22 05:39:22', 'product_description', 0, '2025-06-22 10:39:22'),
(54, '43537113', '', 'Create a compelling video product description for: \"Life Hack\"', 'Discover the exceptional quality of Life Hack with our comprehensive solution. This premium offering combines innovative design, superior functionality, and outstanding value to deliver results that exceed expectations. Built with attention to detail and engineered for excellence, it provides the reliability and performance you need to achieve your goals with confidence.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add specific details about key features and capabilities\",\"Include customer testimonials and success stories\",\"Mention pricing options and value propositions\",\"Add target audience and ideal use cases\"]}', '2025-06-22 05:39:26', 'product_description', 0, '2025-06-22 10:39:26'),
(55, '43537113', '', 'Create a compelling video product description for: \"bajrangi bhaijaan 2 full movie\"', 'Elevate your lifestyle with bajrangi - a thoughtfully curated experience that enhances your daily life. This premium offering combines quality, functionality, and style to deliver exceptional value and satisfaction.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add specific features and benefits\",\"Include customer testimonials\",\"Mention pricing and availability\",\"Add compelling call-to-action\"]}', '2025-06-22 05:54:36', 'product_description', 0, '2025-06-22 10:54:36'),
(56, '43537113', '', 'Enhance this video product description: \"Elevate your lifestyle with bajrangi - a thoughtfully curated experience that enhances your daily life. This premium offering combines quality, functionality, and style to deliver exceptional value and satisfaction.\" for product \"bajrangi bhaijaan full movie\"', 'Elevate your lifestyle with bajrangi - a thoughtfully curated experience that enhances your daily life. This premium offering combines quality, functionality, and style to deliver exceptional value and satisfaction.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add specific features and benefits\",\"Include customer testimonials\",\"Mention pricing and availability\",\"Add compelling call-to-action\"]}', '2025-06-22 05:54:46', 'product_description', 0, '2025-06-22 10:54:46'),
(57, '43537113', '', 'Create a compelling video product description for: \"bajrangi bhaijaan full movie\"', 'Elevate your lifestyle with bajrangi - a thoughtfully curated experience that enhances your daily life. This premium offering combines quality, functionality, and style to deliver exceptional value and satisfaction.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add specific features and benefits\",\"Include customer testimonials\",\"Mention pricing and availability\",\"Add compelling call-to-action\"]}', '2025-06-22 05:54:49', 'product_description', 0, '2025-06-22 10:54:49'),
(58, '43537113', '', 'Enhance this video product description: \"Elevate your lifestyle with bajrangi - a thoughtfully curated experience that enhances your daily life. This premium offering combines quality, functionality, and style to deliver exceptional value and satisfaction.\" for product \"full movie\"', 'Elevate your lifestyle with full - a thoughtfully curated experience that enhances your daily life. This premium offering combines quality, functionality, and style to deliver exceptional value and satisfaction.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add specific features and benefits\",\"Include customer testimonials\",\"Mention pricing and availability\",\"Add compelling call-to-action\"]}', '2025-06-22 05:54:56', 'product_description', 0, '2025-06-22 10:54:56');
INSERT INTO `ai_generated_content` (`id`, `user_id`, `content_type`, `prompt`, `generated_content`, `tokens_used`, `model_used`, `quality_score`, `is_approved`, `metadata`, `created_at`, `type`, `usage_count`, `updated_at`) VALUES
(59, '43537113', '', 'Enhance this video product description: \"Elevate your lifestyle with full - a thoughtfully curated experience that enhances your daily life. This premium offering combines quality, functionality, and style to deliver exceptional value and satisfaction.\" for product \"How To Kiss\"', 'Elevate your lifestyle with how - a thoughtfully curated experience that enhances your daily life. This premium offering combines quality, functionality, and style to deliver exceptional value and satisfaction.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add specific features and benefits\",\"Include customer testimonials\",\"Mention pricing and availability\",\"Add compelling call-to-action\"]}', '2025-06-22 05:55:27', 'product_description', 0, '2025-06-22 10:55:27'),
(60, '43537113', '', 'Create a compelling video product description for: \"How To Kiss\"', 'Elevate your lifestyle with how - a thoughtfully curated experience that enhances your daily life. This premium offering combines quality, functionality, and style to deliver exceptional value and satisfaction.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add specific features and benefits\",\"Include customer testimonials\",\"Mention pricing and availability\",\"Add compelling call-to-action\"]}', '2025-06-22 05:55:30', 'product_description', 0, '2025-06-22 10:55:30'),
(61, '43537113', '', 'Enhance this video product description: \"Elevate your lifestyle with how - a thoughtfully curated experience that enhances your daily life. This premium offering combines quality, functionality, and style to deliver exceptional value and satisfaction.\" for product \"How To Kiss\"', 'Elevate your lifestyle with how - a thoughtfully curated experience that enhances your daily life. This premium offering combines quality, functionality, and style to deliver exceptional value and satisfaction.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add specific features and benefits\",\"Include customer testimonials\",\"Mention pricing and availability\",\"Add compelling call-to-action\"]}', '2025-06-22 05:55:49', 'product_description', 0, '2025-06-22 10:55:49'),
(62, '43537113', '', 'Create a compelling video product description for: \"How To Kiss\"', 'Master the art of romantic connection with our comprehensive guide to meaningful physical intimacy. This thoughtful tutorial covers the emotional and physical aspects of creating genuine romantic moments that strengthen relationships and build deeper connections.\n\nLearn about reading body language, understanding consent, creating the right atmosphere, and building emotional intimacy that makes physical connection natural and meaningful. Our approach emphasizes respect, communication, and genuine care for your partner\'s comfort and feelings.\n\nThe guide covers timing, technique, and the importance of emotional connection in creating memorable romantic experiences. From first kisses to deepening existing relationships, understand how small gestures and thoughtful approaches create lasting romantic bonds.\n\nPerfect for those seeking to improve their romantic relationships through better understanding of intimacy, communication, and the emotional foundations that make physical connection meaningful and fulfilling.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add specific features and benefits\",\"Include customer testimonials\",\"Mention pricing and availability\",\"Add compelling call-to-action\"]}', '2025-06-22 05:58:11', 'product_description', 0, '2025-06-22 10:58:11'),
(63, '43537113', '', 'Create a compelling video product description for: \"Best Funny Video\"', 'Elevate your lifestyle with best - a thoughtfully curated experience that enhances your daily life. This premium offering combines quality, functionality, and style to deliver exceptional value and satisfaction.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add specific features and benefits\",\"Include customer testimonials\",\"Mention pricing and availability\",\"Add compelling call-to-action\"]}', '2025-06-22 05:58:37', 'product_description', 0, '2025-06-22 10:58:37'),
(64, '43537113', '', 'Create a compelling video product description for: \"Water Pool Video\"', 'Discover Water Pool that captivates audiences worldwide with exceptional entertainment value and engaging content. This premium video collection delivers high-quality production, compelling storytelling, and moments that keep viewers completely absorbed from start to finish.\n\nFeaturing outstanding cinematography, creative direction, and content that resonates with diverse audiences, these videos represent the pinnacle of digital entertainment. Each selection is carefully chosen for its ability to engage, inspire, and entertain while maintaining the highest production standards.\n\nFrom viral sensations that sparked global conversations to hidden gems that deserve widespread recognition, this collection showcases content that defines modern digital entertainment. The videos combine visual appeal with substance, creating viewing experiences that are both enjoyable and memorable.\n\nPerfect for entertainment enthusiasts seeking quality content that stands out in today\'s crowded digital landscape. Whether you\'re looking for inspiration, entertainment, or simply want to experience the best of what video content has to offer, this collection delivers exceptional value and unforgettable moments.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add specific features and benefits\",\"Include customer testimonials\",\"Mention pricing and availability\",\"Add compelling call-to-action\"]}', '2025-06-22 06:01:55', 'product_description', 0, '2025-06-22 11:01:55'),
(65, '43537113', '', 'Create a compelling video product description for: \"Drack Video\"', 'I apologize, but I\'m unable to generate content right now because the AI services are temporarily unavailable. Please try again in a few moments, or contact support if the issue persists.\n\nYour request was: \"Drack Video\"\n\nThis happens when the AI providers (OpenAI/Grok) are experiencing high demand or need API credits to be added.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Try again in a few minutes\",\"Check if API keys have sufficient credits\",\"Contact support if issue persists\",\"Consider using a different AI provider\"]}', '2025-06-22 06:15:39', 'product_description', 0, '2025-06-22 11:15:39'),
(66, '43537113', '', 'Create a compelling video product description for: \"GTA 6 Game Review\"', 'Experience the gaming phenomenon that has captivated millions worldwide with Grand Theft Auto VI. This groundbreaking open-world experience represents the pinnacle of interactive entertainment, featuring unprecedented detail, revolutionary gameplay mechanics, and a living, breathing world that responds to every player choice.\n\nSet in a meticulously recreated Vice City, the game delivers stunning visual fidelity powered by cutting-edge technology. The dual protagonist system offers unique perspectives on crime, relationships, and the pursuit of the American dream, while advanced AI systems create emergent gameplay moments that feel genuinely organic.\n\nFrom high-stakes heists with multiple approach options to intimate character moments that drive the narrative forward, every aspect has been crafted to deliver the most immersive Grand Theft Auto experience ever created. The game\'s technical achievements in physics, weather systems, and NPC behavior set new standards for open-world gaming.\n\nThis isn\'t just a sequel - it\'s a cultural event that pushes the boundaries of what interactive entertainment can achieve, offering hundreds of hours of content across a world that feels truly alive.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add system requirements and compatibility\",\"Include gameplay screenshots or videos\",\"Mention multiplayer and online features\",\"Add user reviews and ratings\"]}', '2025-06-22 06:19:42', 'product_description', 0, '2025-06-22 11:19:42'),
(67, '43537113', '', 'Enhance this video product description: \"Experience the gaming phenomenon that has captivated millions worldwide with Grand Theft Auto VI. This groundbreaking open-world experience represents the pinnacle of interactive entertainment, featuring unprecedented detail, revolutionary gameplay mechanics, and a living, breathing world that responds to every player choice.\n\nSet in a meticulously recreated Vice City, the game delivers stunning visual fidelity powered by cutting-edge technology. The dual protagonist system offers unique perspectives on crime, relationships, and the pursuit of the American dream, while advanced AI systems create emergent gameplay moments that feel genuinely organic.\n\nFrom high-stakes heists with multiple approach options to intimate character moments that drive the narrative forward, every aspect has been crafted to deliver the most immersive Grand Theft Auto experience ever created. The game\'s technical achievements in physics, weather systems, and NPC behavior set new standards for open-world gaming.\n\nThis isn\'t just a sequel - it\'s a cultural event that pushes the boundaries of what interactive entertainment can achieve, offering hundreds of hours of content across a world that feels truly alive.\" for product \"Funny Dance\"', 'Dive into the extraordinary world of Experience the gaming phenomenon that has captivated millions worldwide with Grand Theft Auto VI. This groundbreaking open-world experience represents the pinnacle of interactive entertainment, featuring unprecedented detail, revolutionary gameplay mechanics, and a living, breathing world that responds to every player choice.\n\nSet in a meticulously recreated Vice City, the game delivers stunning visual fidelity powered by cutting-edge technology. The dual protagonist system offers unique perspectives on crime, relationships, and the pursuit of the American dream, while advanced AI systems create emergent gameplay moments that feel genuinely organic.\n\nFrom high-stakes heists with multiple approach options to intimate character moments that drive the narrative forward, every aspect has been crafted to deliver the most immersive Grand Theft Auto experience ever created. The game\'s technical achievements in physics, weather systems, and NPC behavior set new standards for open-world gaming.\n\nThis isn\'t just a sequel - it\'s a cultural event that pushes the boundaries of what interactive entertainment can achieve, offering hundreds of hours of content across a world that feels truly alive. where innovative gameplay meets exceptional storytelling to create an unforgettable gaming experience. This title represents the best of modern game design, combining cutting-edge technology with creative vision to deliver entertainment that pushes the boundaries of interactive media.\n\nThe game features meticulously crafted environments, responsive controls, and gameplay mechanics that reward both casual play and dedicated mastery. Every system has been designed to work in harmony, creating emergent gameplay moments that feel both surprising and satisfying.\n\nFrom the initial moments to the epic conclusion, players are treated to a carefully paced experience that balances challenge with accessibility. The development team\'s attention to detail shines through in every aspect, from character animations to environmental storytelling that enriches the overall narrative.\n\nWhether you\'re a longtime gaming enthusiast or someone looking for your next great digital adventure, this title offers the depth, polish, and innovation that define truly exceptional interactive entertainment.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add system requirements and compatibility\",\"Include gameplay screenshots or videos\",\"Mention multiplayer and online features\",\"Add user reviews and ratings\"]}', '2025-06-22 06:20:04', 'product_description', 0, '2025-06-22 11:20:04'),
(68, '43537113', '', 'Create a compelling video product description for: \"Funny Dance\"', 'Discover the exceptional world of Funny Dance through this comprehensive exploration that combines expert insight with engaging presentation to deliver both knowledge and inspiration. This carefully crafted content examines multiple perspectives while providing practical value that readers can immediately apply.\n\nThe approach balances depth with accessibility, ensuring complex topics are presented in ways that engage diverse audiences while maintaining intellectual rigor. Expert analysis, real-world examples, and thoughtful commentary combine to create content that informs, challenges, and inspires further exploration.\n\nEvery aspect has been designed to provide genuine value, from initial concepts through advanced applications. The content structure allows for both comprehensive study and quick reference, accommodating different learning preferences and time constraints.\n\nPerfect for curious minds seeking authoritative, well-researched content that delivers both immediate insights and lasting value, this resource represents the quality and depth that define truly exceptional informational content.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add specific features and benefits\",\"Include pricing and availability\",\"Mention target audience\",\"Add customer testimonials\"]}', '2025-06-22 06:20:12', 'product_description', 0, '2025-06-22 11:20:12'),
(69, '43537113', '', 'Create a compelling video product description for: \"Not Funny Dance\"', 'Discover the exceptional world of Not Funny Dance through this comprehensive exploration that combines expert insight with engaging presentation to deliver both knowledge and inspiration. This carefully crafted content examines multiple perspectives while providing practical value that readers can immediately apply.\n\nThe approach balances depth with accessibility, ensuring complex topics are presented in ways that engage diverse audiences while maintaining intellectual rigor. Expert analysis, real-world examples, and thoughtful commentary combine to create content that informs, challenges, and inspires further exploration.\n\nEvery aspect has been designed to provide genuine value, from initial concepts through advanced applications. The content structure allows for both comprehensive study and quick reference, accommodating different learning preferences and time constraints.\n\nPerfect for curious minds seeking authoritative, well-researched content that delivers both immediate insights and lasting value, this resource represents the quality and depth that define truly exceptional informational content.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add specific features and benefits\",\"Include pricing and availability\",\"Mention target audience\",\"Add customer testimonials\"]}', '2025-06-22 06:20:35', 'product_description', 0, '2025-06-22 11:20:35'),
(70, '43537113', '', 'Enhance this video product description: \"Discover the exceptional world of Not Funny Dance through this comprehensive exploration that combines expert insight with engaging presentation to deliver both knowledge and inspiration. This carefully crafted content examines multiple perspectives while providing practical value that readers can immediately apply.\n\nThe approach balances depth with accessibility, ensuring complex topics are presented in ways that engage diverse audiences while maintaining intellectual rigor. Expert analysis, real-world examples, and thoughtful commentary combine to create content that informs, challenges, and inspires further exploration.\n\nEvery aspect has been designed to provide genuine value, from initial concepts through advanced applications. The content structure allows for both comprehensive study and quick reference, accommodating different learning preferences and time constraints.\n\nPerfect for curious minds seeking authoritative, well-researched content that delivers both immediate insights and lasting value, this resource represents the quality and depth that define truly exceptional informational content.\" for product \"html And Css Full Course\"', 'Master Discover the exceptional world of Not Funny Dance through this comprehensive exploration that combines expert insight with engaging presentation to deliver both knowledge and inspiration. This carefully crafted content examines multiple perspectives while providing practical value that readers can immediately apply.\n\nThe approach balances depth with accessibility, ensuring complex topics are presented in ways that engage diverse audiences while maintaining intellectual rigor. Expert analysis, real-world examples, and thoughtful commentary combine to create content that informs, challenges, and inspires further exploration.\n\nEvery aspect has been designed to provide genuine value, from initial concepts through advanced applications. The content structure allows for both comprehensive study and quick reference, accommodating different learning preferences and time constraints.\n\nPerfect for curious minds seeking authoritative, well-researched content that delivers both immediate insights and lasting value, this resource represents the quality and depth that define truly exceptional informational content. with this comprehensive guide designed to take you from beginner to confident practitioner through clear, actionable instruction. This tutorial combines expert knowledge with practical application, ensuring you develop both understanding and real-world skills.\n\nThe structured approach breaks down complex concepts into manageable steps, with each lesson building upon previous knowledge to create a solid foundation. Professional instruction, real-world examples, and hands-on practice opportunities ensure you gain practical experience alongside theoretical understanding.\n\nWhat sets this tutorial apart is its focus on practical application and immediate results. Rather than overwhelming you with theory, the guide emphasizes techniques you can start using right away, with tips and strategies that come from years of real-world experience.\n\nPerfect for learners who want to develop genuine expertise efficiently, this tutorial provides the guidance, practice opportunities, and expert insights needed to achieve your learning goals while avoiding common pitfalls that slow progress.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add specific features and benefits\",\"Include pricing and availability\",\"Mention target audience\",\"Add customer testimonials\"]}', '2025-06-22 06:21:21', 'product_description', 0, '2025-06-22 11:21:21'),
(71, '43537113', '', 'Create a compelling video product description for: \"html And Css Full Course\"', 'Discover the exceptional world of html And Css Full Course through this comprehensive exploration that combines expert insight with engaging presentation to deliver both knowledge and inspiration. This carefully crafted content examines multiple perspectives while providing practical value that readers can immediately apply.\n\nThe approach balances depth with accessibility, ensuring complex topics are presented in ways that engage diverse audiences while maintaining intellectual rigor. Expert analysis, real-world examples, and thoughtful commentary combine to create content that informs, challenges, and inspires further exploration.\n\nEvery aspect has been designed to provide genuine value, from initial concepts through advanced applications. The content structure allows for both comprehensive study and quick reference, accommodating different learning preferences and time constraints.\n\nPerfect for curious minds seeking authoritative, well-researched content that delivers both immediate insights and lasting value, this resource represents the quality and depth that define truly exceptional informational content.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add specific features and benefits\",\"Include pricing and availability\",\"Mention target audience\",\"Add customer testimonials\"]}', '2025-06-22 06:21:28', 'product_description', 0, '2025-06-22 11:21:28'),
(72, '43537113', '', 'Create a compelling video product description for: \"Space Exploration Documentary\"', 'Experience the cinematic brilliance of Space Exploration Documentary in this exceptional film that combines masterful storytelling with outstanding production values to create an unforgettable viewing experience. This movie represents filmmaking at its finest, with every element carefully crafted to engage, entertain, and resonate with audiences.\n\nThe film features compelling performances from a talented cast, bringing complex characters to life through nuanced portrayals that add depth and authenticity to the narrative. The cinematography captures both intimate moments and sweeping sequences with equal skill, creating visual poetry that enhances the storytelling.\n\nFrom the opening scene to the powerful conclusion, the movie maintains perfect pacing while exploring themes that are both universal and deeply personal. The production team\'s attention to detail is evident in every frame, from costume design to sound engineering, creating an immersive world that draws viewers completely into the story.\n\nWhether you\'re a film enthusiast or casual moviegoer, this cinematic experience offers the perfect blend of entertainment, artistry, and emotional resonance that makes for truly memorable cinema.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add specific features and benefits\",\"Include pricing and availability\",\"Mention target audience\",\"Add customer testimonials\"]}', '2025-06-22 06:23:27', 'product_description', 0, '2025-06-22 11:23:27'),
(73, '43537113', '', 'Create a compelling video product description for: \"Best Funny Video Compilation\"', 'Experience Best Funny Video Compilation like never before with this captivating video content that delivers pure entertainment value. This carefully produced video combines engaging visuals, compelling storytelling, and memorable moments that keep viewers completely absorbed from start to finish.\n\nThe production quality showcases professional cinematography, creative direction, and attention to detail that sets this content apart in today\'s competitive digital landscape. Whether you\'re seeking entertainment, inspiration, or simply want to experience something extraordinary, this video delivers on all fronts.\n\nFrom stunning visual sequences to perfectly timed content delivery, every element has been crafted to create an immersive viewing experience. The video appeals to diverse audiences while maintaining the high standards that make content truly shareable and memorable.\n\nPerfect for anyone who appreciates quality video content that combines entertainment value with production excellence, creating viewing experiences that resonate long after the final frame.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add video quality and format details\",\"Include duration and file size\",\"Mention viewing platform compatibility\",\"Add download or streaming options\"]}', '2025-06-22 06:24:00', 'product_description', 0, '2025-06-22 11:24:00'),
(74, '43537113', '', 'Create a compelling video product description for: \"JavaScript Tutorial Course\"', 'Dive deep into JavaScript with JavaScript Tutorial, exploring the language that powers modern web interactivity and full-stack development. This comprehensive course covers ES6+ features, asynchronous programming with promises and async/await, DOM manipulation, and the event-driven programming model that makes web pages dynamic and engaging.\n\nThe curriculum progresses from fundamental concepts like variables, functions, and control structures to advanced topics including closures, prototypal inheritance, and functional programming patterns. Students learn to work with APIs, handle JSON data, implement client-side routing, and manage application state effectively.\n\nModern JavaScript development tools and practices are emphasized throughout, including npm package management, bundling with Webpack or Vite, testing with Jest, and debugging techniques. The course covers popular frameworks and libraries like React, showing how they build upon core JavaScript concepts.\n\nIdeal for developers ready to move beyond basic scripting to building full-featured web applications, with practical projects that demonstrate real-world problem-solving and best practices used in professional development environments.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Include step-by-step instructions\",\"Add difficulty level and duration\",\"Mention required tools or materials\",\"Include tips for beginners\"]}', '2025-06-22 06:41:35', 'product_description', 0, '2025-06-22 11:41:35'),
(75, '43537113', '', 'Create a compelling video product description for: \"Body Course\"', 'Master Body Course with this comprehensive guide designed to take you from beginner to confident practitioner through clear, actionable instruction. This tutorial combines expert knowledge with practical application, ensuring you develop both understanding and real-world skills that you can apply immediately.\n\nThe structured approach breaks down complex concepts into manageable steps, with each lesson building upon previous knowledge to create a solid foundation. Professional instruction, real-world examples, and hands-on practice opportunities ensure you gain practical experience alongside theoretical understanding.\n\nWhat sets this tutorial apart is its focus on practical application and immediate results. Rather than overwhelming you with theory, the guide emphasizes techniques you can start using right away, with tips and strategies that come from years of real-world experience and proven success.\n\nPerfect for learners who want to develop genuine expertise efficiently, this tutorial provides the guidance, practice opportunities, and expert insights needed to achieve your learning goals while avoiding common pitfalls that slow progress.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add specific features and benefits\",\"Include pricing and availability\",\"Mention target audience\",\"Add customer testimonials\"]}', '2025-06-22 06:42:24', 'product_description', 0, '2025-06-22 11:42:24'),
(76, '43537113', '', 'Create a compelling article product description for: \"Blog\"', 'Discover the exceptional world of Blog through this comprehensive exploration that combines expert insight with engaging presentation to deliver both knowledge and inspiration. This carefully crafted content examines multiple perspectives while providing practical value that readers can immediately apply.\n\nThe approach balances depth with accessibility, ensuring complex topics are presented in ways that engage diverse audiences while maintaining intellectual rigor. Expert analysis, real-world examples, and thoughtful commentary combine to create content that informs, challenges, and inspires further exploration.\n\nEvery aspect has been designed to provide genuine value, from initial concepts through advanced applications. The content structure allows for both comprehensive study and quick reference, accommodating different learning preferences and time constraints.\n\nPerfect for curious minds seeking authoritative, well-researched content that delivers both immediate insights and lasting value, this resource represents the quality and depth that define truly exceptional informational content.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add specific features and benefits\",\"Include pricing and availability\",\"Mention target audience\",\"Add customer testimonials\"]}', '2025-06-22 06:43:05', 'product_description', 0, '2025-06-22 11:43:05'),
(77, '43537113', '', 'Create a compelling article product description for: \"The Future of Artificial Intelligence in Everyday Life\"', 'Discover the exceptional world of The Future of Artificial Intelligence in Everyday Life through this comprehensive exploration that combines expert insight with engaging presentation to deliver both knowledge and inspiration. This carefully crafted content examines multiple perspectives while providing practical value that readers can immediately apply.\n\nThe approach balances depth with accessibility, ensuring complex topics are presented in ways that engage diverse audiences while maintaining intellectual rigor. Expert analysis, real-world examples, and thoughtful commentary combine to create content that informs, challenges, and inspires further exploration.\n\nEvery aspect has been designed to provide genuine value, from initial concepts through advanced applications. The content structure allows for both comprehensive study and quick reference, accommodating different learning preferences and time constraints.\n\nPerfect for curious minds seeking authoritative, well-researched content that delivers both immediate insights and lasting value, this resource represents the quality and depth that define truly exceptional informational content.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add specific features and benefits\",\"Include pricing and availability\",\"Mention target audience\",\"Add customer testimonials\"]}', '2025-06-22 06:43:53', 'product_description', 0, '2025-06-22 11:43:53'),
(78, '43537113', '', 'Enhance this article product description: \"Discover the exceptional world of The Future of Artificial Intelligence in Everyday Life through this comprehensive exploration that combines expert insight with engaging presentation to deliver both knowledge and inspiration. This carefully crafted content examines multiple perspectives while providing practical value that readers can immediately apply.\n\nThe approach balances depth with accessibility, ensuring complex topics are presented in ways that engage diverse audiences while maintaining intellectual rigor. Expert analysis, real-world examples, and thoughtful commentary combine to create content that informs, challenges, and inspires further exploration.\n\nEvery aspect has been designed to provide genuine value, from initial concepts through advanced applications. The content structure allows for both comprehensive study and quick reference, accommodating different learning preferences and time constraints.\n\nPerfect for curious minds seeking authoritative, well-researched content that delivers both immediate insights and lasting value, this resource represents the quality and depth that define truly exceptional informational content.\" for product \"From GPT to AGI: The Road Ahead\"', 'Journey through the cosmos with Discover the exceptional world of The Future of Artificial Intelligence in Everyday Life through this comprehensive exploration that combines expert insight with engaging presentation to deliver both knowledge and inspiration. This carefully crafted content examines multiple perspectives while providing practical value that readers can immediately apply.\n\nThe approach balances depth with accessibility, ensuring complex topics are presented in ways that engage diverse audiences while maintaining intellectual rigor. Expert analysis, real-world examples, and thoughtful commentary combine to create content that informs, challenges, and inspires further exploration.\n\nEvery aspect has been designed to provide genuine value, from initial concepts through advanced applications. The content structure allows for both comprehensive study and quick reference, accommodating different learning preferences and time constraints.\n\nPerfect for curious minds seeking authoritative, well-researched content that delivers both immediate insights and lasting value, this resource represents the quality and depth that define truly exceptional informational content., an awe-inspiring exploration of humanity\'s quest to understand our place in the universe. This comprehensive guide covers everything from our solar system\'s eight planets to distant galaxies billions of light-years away, revealing the latest discoveries in astronomical research.\n\nExplore the cutting-edge missions currently reshaping our understanding of space, including the James Webb Space Telescope\'s unprecedented infrared observations, Parker Solar Probe\'s journey to touch the Sun, and Voyager\'s continued transmission from interstellar space after four decades of exploration.\n\nThe content examines fundamental questions about extraterrestrial life, from Mars\' subsurface oceans to Europa\'s hidden seas and the thousands of exoplanets discovered in the habitable zones of distant stars. Learn about the search for biosignatures and the Drake Equation\'s implications for finding intelligent life.\n\nUnderstand the latest breakthroughs in space technology, from ion propulsion and solar sails to proposed fusion rockets and breakthrough starshot concepts for reaching nearby star systems within human lifetimes.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add specific features and benefits\",\"Include pricing and availability\",\"Mention target audience\",\"Add customer testimonials\"]}', '2025-06-22 06:44:09', 'product_description', 0, '2025-06-22 11:44:09'),
(79, '43537113', '', 'Create a compelling article product description for: \"From GPT to AGI: The Road Ahead\"', 'Discover the exceptional world of From GPT to AGI: The Road Ahead through this comprehensive exploration that combines expert insight with engaging presentation to deliver both knowledge and inspiration. This carefully crafted content examines multiple perspectives while providing practical value that readers can immediately apply.\n\nThe approach balances depth with accessibility, ensuring complex topics are presented in ways that engage diverse audiences while maintaining intellectual rigor. Expert analysis, real-world examples, and thoughtful commentary combine to create content that informs, challenges, and inspires further exploration.\n\nEvery aspect has been designed to provide genuine value, from initial concepts through advanced applications. The content structure allows for both comprehensive study and quick reference, accommodating different learning preferences and time constraints.\n\nPerfect for curious minds seeking authoritative, well-researched content that delivers both immediate insights and lasting value, this resource represents the quality and depth that define truly exceptional informational content.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add specific features and benefits\",\"Include pricing and availability\",\"Mention target audience\",\"Add customer testimonials\"]}', '2025-06-22 06:44:14', 'product_description', 0, '2025-06-22 11:44:14'),
(80, '43537113', '', 'Create a compelling article product description for: \"The Future of Artificial Intelligence in Everyday Life\"', 'Discover the exceptional world of The Future of Artificial Intelligence in Everyday Life through this comprehensive exploration that combines expert insight with engaging presentation to deliver both knowledge and inspiration. This carefully crafted content examines multiple perspectives while providing practical value that readers can immediately apply.\n\nThe approach balances depth with accessibility, ensuring complex topics are presented in ways that engage diverse audiences while maintaining intellectual rigor. Expert analysis, real-world examples, and thoughtful commentary combine to create content that informs, challenges, and inspires further exploration.\n\nEvery aspect has been designed to provide genuine value, from initial concepts through advanced applications. The content structure allows for both comprehensive study and quick reference, accommodating different learning preferences and time constraints.\n\nPerfect for curious minds seeking authoritative, well-researched content that delivers both immediate insights and lasting value, this resource represents the quality and depth that define truly exceptional informational content.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add specific features and benefits\",\"Include pricing and availability\",\"Mention target audience\",\"Add customer testimonials\"]}', '2025-06-22 06:44:27', 'product_description', 0, '2025-06-22 11:44:27'),
(81, '43537113', '', 'Create a compelling video product description for: \"JavaScript\"', 'Dive deep into JavaScript with JavaScript, exploring the language that powers modern web interactivity and full-stack development. This comprehensive course covers ES6+ features, asynchronous programming with promises and async/await, DOM manipulation, and the event-driven programming model that makes web pages dynamic and engaging.\n\nThe curriculum progresses from fundamental concepts like variables, functions, and control structures to advanced topics including closures, prototypal inheritance, and functional programming patterns. Students learn to work with APIs, handle JSON data, implement client-side routing, and manage application state effectively.\n\nModern JavaScript development tools and practices are emphasized throughout, including npm package management, bundling with Webpack or Vite, testing with Jest, and debugging techniques. The course covers popular frameworks and libraries like React, showing how they build upon core JavaScript concepts.\n\nIdeal for developers ready to move beyond basic scripting to building full-featured web applications, with practical projects that demonstrate real-world problem-solving and best practices used in professional development environments.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add specific features and benefits\",\"Include pricing and availability\",\"Mention target audience\",\"Add customer testimonials\"]}', '2025-06-23 10:09:54', 'product_description', 0, '2025-06-23 15:09:54'),
(82, '43537113', '', 'Create a compelling video product description for: \"113rgruh\"', 'Discover the exceptional world of 113rgruh through this comprehensive exploration that combines expert insight with engaging presentation to deliver both knowledge and inspiration. This carefully crafted content examines multiple perspectives while providing practical value that readers can immediately apply.\n\nThe approach balances depth with accessibility, ensuring complex topics are presented in ways that engage diverse audiences while maintaining intellectual rigor. Expert analysis, real-world examples, and thoughtful commentary combine to create content that informs, challenges, and inspires further exploration.\n\nEvery aspect has been designed to provide genuine value, from initial concepts through advanced applications. The content structure allows for both comprehensive study and quick reference, accommodating different learning preferences and time constraints.\n\nPerfect for curious minds seeking authoritative, well-researched content that delivers both immediate insights and lasting value, this resource represents the quality and depth that define truly exceptional informational content.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add specific features and benefits\",\"Include pricing and availability\",\"Mention target audience\",\"Add customer testimonials\"]}', '2025-06-23 10:10:34', 'product_description', 0, '2025-06-23 15:10:34'),
(83, '43537113', '', 'Create a compelling video product description for: \"113rgruhbkjghjgkj\"', 'Discover the exceptional world of 113rgruhbkjghjgkj through this comprehensive exploration that combines expert insight with engaging presentation to deliver both knowledge and inspiration. This carefully crafted content examines multiple perspectives while providing practical value that readers can immediately apply.\n\nThe approach balances depth with accessibility, ensuring complex topics are presented in ways that engage diverse audiences while maintaining intellectual rigor. Expert analysis, real-world examples, and thoughtful commentary combine to create content that informs, challenges, and inspires further exploration.\n\nEvery aspect has been designed to provide genuine value, from initial concepts through advanced applications. The content structure allows for both comprehensive study and quick reference, accommodating different learning preferences and time constraints.\n\nPerfect for curious minds seeking authoritative, well-researched content that delivers both immediate insights and lasting value, this resource represents the quality and depth that define truly exceptional informational content.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add specific features and benefits\",\"Include pricing and availability\",\"Mention target audience\",\"Add customer testimonials\"]}', '2025-06-23 10:10:49', 'product_description', 0, '2025-06-23 15:10:49'),
(84, '43537113', '', 'Create a compelling video product description for: \"car\"', 'ChatGPT API is currently unavailable. Please check that:\n\n1. Your OpenAI API key is valid and has sufficient credits\n2. Your account has access to GPT-4 models\n3. You haven\'t exceeded rate limits\n\nYour request was: \"car\"\n\nTo fix this issue:\n- Add credits to your OpenAI account at platform.openai.com\n- Verify your API key is working\n- Try again in a few moments\n\nThis system requires a working ChatGPT API connection to generate authentic AI content.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Check OpenAI account credits\",\"Verify API key is correct\",\"Try again in a few minutes\",\"Contact OpenAI support if issues persist\"]}', '2025-06-23 11:20:56', 'product_description', 0, '2025-06-23 16:20:56'),
(85, '43537113', '', 'Create a compelling website_link product description for: \"Video\"', 'Immerse yourself in premium entertainment with Video, delivering engaging experiences that combine creativity, technical excellence, and compelling storytelling to create truly memorable viewing. This carefully curated content represents the best of modern digital entertainment, featuring high production values and innovative approaches that set new standards for online media.\n\nThe experience balances accessibility with sophistication, ensuring broad appeal while maintaining the quality and depth that keep audiences engaged from start to finish. Whether through stunning visuals, captivating narratives, or interactive elements, every aspect has been designed to maximize viewer satisfaction and encourage sharing across social platforms.\n\nFrom trending topics that capture current cultural moments to timeless themes that resonate across demographics, this content demonstrates why certain entertainment becomes viral while other content fades quickly. The production team understands audience preferences, platform algorithms, and the technical requirements for optimal viewing across different devices and connection speeds.\n\nIdeal for entertainment enthusiasts who appreciate quality content, content creators studying successful formats, and anyone seeking engaging experiences that provide both immediate enjoyment and lasting value in today\'s competitive digital entertainment landscape.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance with multimedia elements\",\"Add user testimonials and reviews\",\"Include related content recommendations\",\"Add social sharing capabilities\"]}', '2025-06-23 11:25:22', 'product_description', 0, '2025-06-23 16:25:22'),
(86, '43537113', '', 'Create a compelling website_link product description for: \"Videotyu65767ujh\"', 'Immerse yourself in premium entertainment with Videotyu65767ujh, delivering engaging experiences that combine creativity, technical excellence, and compelling storytelling to create truly memorable viewing. This carefully curated content represents the best of modern digital entertainment, featuring high production values and innovative approaches that set new standards for online media.\n\nThe experience balances accessibility with sophistication, ensuring broad appeal while maintaining the quality and depth that keep audiences engaged from start to finish. Whether through stunning visuals, captivating narratives, or interactive elements, every aspect has been designed to maximize viewer satisfaction and encourage sharing across social platforms.\n\nFrom trending topics that capture current cultural moments to timeless themes that resonate across demographics, this content demonstrates why certain entertainment becomes viral while other content fades quickly. The production team understands audience preferences, platform algorithms, and the technical requirements for optimal viewing across different devices and connection speeds.\n\nIdeal for entertainment enthusiasts who appreciate quality content, content creators studying successful formats, and anyone seeking engaging experiences that provide both immediate enjoyment and lasting value in today\'s competitive digital entertainment landscape.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance with multimedia elements\",\"Add user testimonials and reviews\",\"Include related content recommendations\",\"Add social sharing capabilities\"]}', '2025-06-23 11:25:36', 'product_description', 0, '2025-06-23 16:25:36'),
(87, '43537113', '', 'Create a compelling website_link product description for: \"5767ujhjgj\"', 'Discover exceptional quality with 5767ujhjgj, representing excellence in design, functionality, and user experience that sets new standards in its category. This premium offering combines innovative features with reliable performance, creating value that exceeds expectations while delivering the consistency and satisfaction that define truly superior products and services.\n\nThe careful attention to detail evident in every aspect demonstrates a commitment to quality that goes beyond surface appearances to encompass functionality, durability, and long-term value. Whether through advanced materials, precision engineering, or thoughtful design choices, each element contributes to an overall experience that justifies investment and builds lasting satisfaction.\n\nFrom initial interaction through extended use, this offering maintains the high standards that distinguish exceptional products from merely adequate alternatives. The combination of innovation and reliability ensures that users receive both immediate benefits and enduring value that makes this choice an intelligent investment in quality and performance.\n\nIdeal for discerning consumers who appreciate excellence, professionals requiring dependable solutions, and anyone seeking products or services that deliver on their promises while providing the peace of mind that comes from choosing proven quality and established reputation.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance with multimedia elements\",\"Add user testimonials and reviews\",\"Include related content recommendations\",\"Add social sharing capabilities\"]}', '2025-06-23 11:25:47', 'product_description', 0, '2025-06-23 16:25:47'),
(88, '43537113', '', 'Create a compelling video product description for: \"Car\"', 'ChatGPT API connection failed. Please ensure your OpenAI API key has sufficient credits.\n\nError: 429 You exceeded your current quota, please check your plan and billing details. For more information on this error, read the docs: https://platform.openai.com/docs/guides/error-codes/api-errors.\n\nTo resolve this issue:\n1. Visit platform.openai.com\n2. Add credits to your account\n3. Verify your API key permissions\n4. Try the request again\n\nThis system requires authentic ChatGPT API access for real AI content generation.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add credits to OpenAI account\",\"Verify API key validity\",\"Check account permissions\",\"Contact OpenAI support if needed\"]}', '2025-06-23 11:31:24', 'product_description', 0, '2025-06-23 16:31:24');
INSERT INTO `ai_generated_content` (`id`, `user_id`, `content_type`, `prompt`, `generated_content`, `tokens_used`, `model_used`, `quality_score`, `is_approved`, `metadata`, `created_at`, `type`, `usage_count`, `updated_at`) VALUES
(89, '43537113', '', 'Create a compelling video product description for: \"car\"', 'AI services are currently unavailable. Please check your API keys have sufficient credits.\n\nGemini Error: {\"error\":{\"code\":400,\"message\":\"API key not valid. Please pass a valid API key.\",\"status\":\"INVALID_ARGUMENT\",\"details\":[{\"@type\":\"type.googleapis.com/google.rpc.ErrorInfo\",\"reason\":\"API_KEY_INVALID\",\"domain\":\"googleapis.com\",\"metadata\":{\"service\":\"generativelanguage.googleapis.com\"}},{\"@type\":\"type.googleapis.com/google.rpc.LocalizedMessage\",\"locale\":\"en-US\",\"message\":\"API key not valid. Please pass a valid API key.\"}]}}\nOpenAI Error: 429 You exceeded your current quota, please check your plan and billing details. For more information on this error, read the docs: https://platform.openai.com/docs/guides/error-codes/api-errors.\n\nTo resolve:\n1. Check Google AI Studio for Gemini API credits\n2. Check OpenAI platform for ChatGPT API credits\n3. Verify API key permissions\n4. Try again\n\nThis system requires working AI API access for authentic content generation.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Check Gemini API credits\",\"Check OpenAI API credits\",\"Verify API key permissions\",\"Contact support if needed\"]}', '2025-06-23 11:37:46', 'product_description', 0, '2025-06-23 16:37:46'),
(90, '43537113', '', 'Create a compelling video product description for: \"car\"', 'AI services are currently unavailable. Please check your API keys have sufficient credits.\n\nGemini Error: {\"error\":{\"code\":400,\"message\":\"API key not valid. Please pass a valid API key.\",\"status\":\"INVALID_ARGUMENT\",\"details\":[{\"@type\":\"type.googleapis.com/google.rpc.ErrorInfo\",\"reason\":\"API_KEY_INVALID\",\"domain\":\"googleapis.com\",\"metadata\":{\"service\":\"generativelanguage.googleapis.com\"}},{\"@type\":\"type.googleapis.com/google.rpc.LocalizedMessage\",\"locale\":\"en-US\",\"message\":\"API key not valid. Please pass a valid API key.\"}]}}\nOpenAI Error: 429 You exceeded your current quota, please check your plan and billing details. For more information on this error, read the docs: https://platform.openai.com/docs/guides/error-codes/api-errors.\n\nTo resolve:\n1. Check Google AI Studio for Gemini API credits\n2. Check OpenAI platform for ChatGPT API credits\n3. Verify API key permissions\n4. Try again\n\nThis system requires working AI API access for authentic content generation.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Check Gemini API credits\",\"Check OpenAI API credits\",\"Verify API key permissions\",\"Contact support if needed\"]}', '2025-06-23 11:50:52', 'product_description', 0, '2025-06-23 16:50:52'),
(91, '43537113', '', 'Create a compelling video product description for: \"car\"', 'AI services are currently unavailable. Please check your API keys have sufficient credits.\n\nGemini Error: {\"error\":{\"code\":503,\"message\":\"The model is overloaded. Please try again later.\",\"status\":\"UNAVAILABLE\"}}\nOpenAI Error: 429 You exceeded your current quota, please check your plan and billing details. For more information on this error, read the docs: https://platform.openai.com/docs/guides/error-codes/api-errors.\n\nTo resolve:\n1. Check Google AI Studio for Gemini API credits\n2. Check OpenAI platform for ChatGPT API credits\n3. Verify API key permissions\n4. Try again\n\nThis system requires working AI API access for authentic content generation.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Check Gemini API credits\",\"Check OpenAI API credits\",\"Verify API key permissions\",\"Contact support if needed\"]}', '2025-06-23 12:00:20', 'product_description', 0, '2025-06-23 17:00:20'),
(92, '43537113', '', 'Create a compelling video product description for: \"car\"', 'More than just a mode of transport, the modern automobile is a testament to human ingenuity and a key to unlocking the world around us. It\'s the silent promise of adventure waiting on your driveway, the reliable companion for daily commutes, and the sanctuary that glides you through life\'s most memorable journeys. Every curve, every line, and every meticulously crafted detail speaks to a fusion of art and science, designed not just to move you, but to move *with* you, reflecting an inherent understanding of both performance dynamics and aesthetic appeal.\n\nBeneath its striking aesthetics lies a symphony of advanced engineering, poised to deliver an unparalleled driving experience. Whether you crave exhilarating performance that thrills at every turn, refined efficiency that redefines the journey, or the perfect balance of both, cutting-edge powertrains respond with precision and power. Seamlessly integrated technology transforms the cabin into a connected command center: intuitive infotainment systems, crystal-clear navigation, and advanced driver-assistance features work in harmony to enhance safety, convenience, and pure driving pleasure. It\'s a vehicle that doesn\'t just transport you; it intelligently anticipates and adapts to your every need, making every mile a seamless extension of your intentions.\n\nBut true excellence extends beyond dynamic performance and intelligent connectivity. Engineered with an uncompromising commitment to safety, a robust architecture combined with a comprehensive suite of active and passive safety features provides unwavering peace of mind for every occupant, protecting what matters most. Inside, an ergonomically designed cabin beckons with premium materials, thoughtful amenities, and a quiet refinement, transforming every journey into a comfortable and restorative retreat. The modern car isn\'t merely a machine; it\'s a meticulously engineered ecosystem, a reliable extension of your lifestyle that empowers you to explore, connect, and live life on your own terms. It\'s the ultimate expression of personal mobility, crafted for the road ahead.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance with multimedia elements\",\"Add user testimonials and reviews\",\"Include related content recommendations\",\"Add social sharing capabilities\"]}', '2025-06-23 12:01:52', 'product_description', 0, '2025-06-23 17:01:52'),
(93, '43537113', '', 'Create a compelling video product description for: \"dsafdsaf\"', 'AI services are currently unavailable. Please check your API keys have sufficient credits.\n\nGemini Error: {\"error\":{\"code\":503,\"message\":\"The model is overloaded. Please try again later.\",\"status\":\"UNAVAILABLE\"}}\nOpenAI Error: 429 You exceeded your current quota, please check your plan and billing details. For more information on this error, read the docs: https://platform.openai.com/docs/guides/error-codes/api-errors.\n\nTo resolve:\n1. Check Google AI Studio for Gemini API credits\n2. Check OpenAI platform for ChatGPT API credits\n3. Verify API key permissions\n4. Try again\n\nThis system requires working AI API access for authentic content generation.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Check Gemini API credits\",\"Check OpenAI API credits\",\"Verify API key permissions\",\"Contact support if needed\"]}', '2025-06-23 12:02:13', 'product_description', 0, '2025-06-23 17:02:13'),
(94, '43537113', '', 'Create a compelling video product description for: \"Game\"', 'Step into a meticulously crafted universe where every choice shapes your destiny and every horizon promises an untold adventure. This isn\'t just a game; it\'s an expansive, living world brimming with deep lore, unforgettable characters, and a compelling narrative that pulls you into its very fabric. From the moment you begin your journey, you\'ll be captivated by a saga that challenges your intellect, tests your courage, and invites you to unravel ancient mysteries lurking beneath a breathtakingly beautiful surface.\n\nThe heart of this experience lies in its exceptionally refined **gameplay mechanics**. Whether you prefer the strategic depth of turn-based combat, the fluid precision of real-time action, or the intricate satisfaction of environmental puzzle-solving, the system offers unparalleled flexibility and responsiveness. Explore sprawling, dynamic landscapes, engage in meaningful dialogues with a cast of fully voiced characters, and influence branching **storylines** that react organically to your decisions. Every encounter, every quest, and every discovery feels uniquely impactful, ensuring that no two playthroughs are ever quite the same.\n\nVisually, the game sets a new benchmark. Leveraging cutting-edge rendering techniques, the **graphics** deliver an astonishing level of detail, from the subtle play of light filtering through ancient forests to the intricate textures of handcrafted armor. Complementing this stunning visual fidelity is an evocative, adaptive orchestral score and immersive sound design that dynamically reacts to your actions, creating an atmosphere that is both grand and intimately personal. This harmonious blend of sights and sounds ensures an unparalleled sense of presence, fully immersing you in its vibrant ecosystems and perilous dungeons.\n\nMore than just a technical marvel, this title promises to be a cornerstone within **gaming culture**, offering an experience that fosters profound player connection and community discussion. It\'s a journey designed for both the casual explorer and the dedicated completionist, packed with countless hours of discovery, challenging foes, and heartwarming triumphs. Prepare to lose yourself in an epic that will resonate long after the credits roll, cementing its place as a truly essential and unforgettable interactive masterpiece.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Add gameplay mechanics and features\",\"Include platform compatibility details\",\"Mention multiplayer and community aspects\",\"Add screenshots and gameplay videos\"]}', '2025-06-23 12:02:35', 'product_description', 0, '2025-06-23 17:02:35'),
(95, '43537113', '', 'Create a compelling video product description for: \"Oggy and the Cockroaches\"', '## Oggy and the Cockroaches: The Ultimate Battle of Wits (and Mallets!)\n\nStep into the endlessly chaotic world of *Oggy and the Cockroaches*, where domestic bliss is a myth and the simplest of days transforms into a relentless, high-octane battle of wills. At its heart lies Oggy, a serene, somewhat lazy blue cat whose only wish is to enjoy a quiet life, preferably with a good meal or some TV. His dreams, however, are constantly shattered by Joey, Dee Dee, and Marky – three mischievous cockroaches who reside in his home and view his existence as their personal playground. This animated masterpiece delivers a masterclass in visual comedy, proving that you don\'t need dialogue to create a truly universal and side-splitting experience, relying instead on impeccably timed slapstick, escalating absurdity, and the sheer expressive power of its beloved characters.\n\nWhat makes *Oggy and the Cockroaches* so compelling is its brilliant execution of classic cartoon tropes with a fresh, anarchic energy. Every episode is a meticulously choreographed ballet of destruction, where Oggy\'s desperate attempts to rid himself of his tormentors inevitably backfire in the most spectacular and imaginative ways. From outlandish inventions gone awry to high-speed chases that defy the laws of physics, the show\'s humor stems from the sheer ingenuity of the gags and the unbreakable cycle of cause and effect – or rather, chaos and consequence. It’s a testament to the animators\' skill that despite the constant squabbles, the characters, including Oggy\'s gruff cousin Jack and the ever-present bulldog Bob, maintain distinct personalities that only heighten the hilarity.\n\nBeyond the immediate laughter, *Oggy and the Cockroaches* offers a timeless form of pure, unadulterated entertainment that transcends age barriers. Its simple, relatable premise — the homeowner vs. the pests — is taken to such extreme, fantastical levels that it becomes endlessly rewatchable. Whether you\'re a child captivated by the vibrant animation and non-stop action, or an adult appreciating the intricate comedic timing and nostalgic echoes of classic silent films, this series delivers consistent joy. It\'s more than just a cartoon; it\'s a testament to the enduring power of physical comedy, a vibrant, hilarious escape where the only certainty is that Oggy will never truly win, and the cockroaches will always live to bug another day.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance with multimedia elements\",\"Add user testimonials and reviews\",\"Include related content recommendations\",\"Add social sharing capabilities\"]}', '2025-06-23 12:03:11', 'product_description', 0, '2025-06-23 17:03:11'),
(96, '43537113', '', 'Create a compelling video product description for: \"Credit Repair and Funding\"', 'AI services are currently unavailable. Please check your API keys have sufficient credits.\n\nGemini Error: {\"error\":{\"code\":503,\"message\":\"The model is overloaded. Please try again later.\",\"status\":\"UNAVAILABLE\"}}\nOpenAI Error: 429 You exceeded your current quota, please check your plan and billing details. For more information on this error, read the docs: https://platform.openai.com/docs/guides/error-codes/api-errors.\n\nTo resolve:\n1. Check Google AI Studio for Gemini API credits\n2. Check OpenAI platform for ChatGPT API credits\n3. Verify API key permissions\n4. Try again\n\nThis system requires working AI API access for authentic content generation.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Check Gemini API credits\",\"Check OpenAI API credits\",\"Verify API key permissions\",\"Contact support if needed\"]}', '2025-06-23 12:04:29', 'product_description', 0, '2025-06-23 17:04:29'),
(97, '43537113', '', 'Create a compelling video product description for: \"Oggy and the Cockroaches\"', 'Step into the perpetually chaotic, yet utterly hilarious world of *Oggy and the Cockroaches*! At the heart of this animated phenomenon lies Oggy, a good-natured, albeit perpetually tormented, blue cat whose idyllic domestic life is constantly, hilariously, and quite spectacularly disrupted by three conniving, food-obsessed cockroaches: Dee Dee, Marky, and Joey. This iconic slapstick comedy, reminiscent of classic silent films and Golden Age cartoons, thrives on non-stop visual gags and uproarious antics that transcend language barriers, making it a beloved staple for audiences worldwide.\n\nWhat makes *Oggy and the Cockroaches* truly special is its mastery of physical comedy and inventive storytelling. Each episode is a meticulously choreographed ballet of explosions, pratfalls, elaborate chase sequences, and ingenious (or hilariously failed) traps, all orchestrated by the sheer will of its four main characters. Without a single spoken word, the show communicates volumes through exaggerated expressions, perfectly timed sound effects, and the sheer ingenuity of the characters’ never-ending battle for supremacy – or just a quiet afternoon nap for Oggy. From Joey\'s cunning leadership to Dee Dee\'s insatiable appetite and Marky\'s laid-back yet equally destructive nature, these tiny terrors provide the perfect foil to Oggy\'s ever-frustrated attempts at peace.\n\nMore than just a cartoon, *Oggy and the Cockroaches* is a timeless source of pure, unadulterated fun. Its enduring appeal lies in its simple, universally relatable premise: the endless struggle between man (or cat) and pest, amplified to cartoonishly epic proportions. Perfect for family viewing, or for anyone seeking a dose of unbridled laughter and creative chaos, this series offers an escape into a world where the only language needed is the universal language of humor. Prepare for endless laughs as Oggy\'s house becomes a battlefield of wits, wills, and wonderfully wacky destruction!', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance with multimedia elements\",\"Add user testimonials and reviews\",\"Include related content recommendations\",\"Add social sharing capabilities\"]}', '2025-06-23 12:05:13', 'product_description', 0, '2025-06-23 17:05:13'),
(98, '43537113', '', 'Enhance this video product description: \"Step into the perpetually chaotic, yet utterly hilarious world of *Oggy and the Cockroaches*! At the heart of this animated phenomenon lies Oggy, a good-natured, albeit perpetually tormented, blue cat whose idyllic domestic life is constantly, hilariously, and quite spectacularly disrupted by three conniving, food-obsessed cockroaches: Dee Dee, Marky, and Joey. This iconic slapstick comedy, reminiscent of classic silent films and Golden Age cartoons, thrives on non-stop visual gags and uproarious antics that transcend language barriers, making it a beloved staple for audiences worldwide.\n\nWhat makes *Oggy and the Cockroaches* truly special is its mastery of physical comedy and inventive storytelling. Each episode is a meticulously choreographed ballet of explosions, pratfalls, elaborate chase sequences, and ingenious (or hilariously failed) traps, all orchestrated by the sheer will of its four main characters. Without a single spoken word, the show communicates volumes through exaggerated expressions, perfectly timed sound effects, and the sheer ingenuity of the characters’ never-ending battle for supremacy – or just a quiet afternoon nap for Oggy. From Joey\'s cunning leadership to Dee Dee\'s insatiable appetite and Marky\'s laid-back yet equally destructive nature, these tiny terrors provide the perfect foil to Oggy\'s ever-frustrated attempts at peace.\n\nMore than just a cartoon, *Oggy and the Cockroaches* is a timeless source of pure, unadulterated fun. Its enduring appeal lies in its simple, universally relatable premise: the endless struggle between man (or cat) and pest, amplified to cartoonishly epic proportions. Perfect for family viewing, or for anyone seeking a dose of unbridled laughter and creative chaos, this series offers an escape into a world where the only language needed is the universal language of humor. Prepare for endless laughs as Oggy\'s house becomes a battlefield of wits, wills, and wonderfully wacky destruction!\" for product \"TrackDiv\"', 'Prepare to tumble headfirst into the delightfully absurd universe of *Oggy and the Cockroaches*, an animated masterpiece where domestic bliss is a pipe dream and chaos reigns supreme! At the heart of this global phenomenon is Oggy, a charmingly blue feline whose greatest desire is a quiet, comfortable life. Unfortunately, his home is also the battleground for three ingenious, insatiably hungry cockroaches – the cunning Joey, the gluttonous Dee Dee, and the laid-back yet equally destructive Marky. This iconic series masterfully revives the timeless art of pure slapstick, echoing the golden age of silent films and classic cartoons with its relentless visual gags and uproarious antics that defy language barriers, making it a universal beacon of laughter across generations and cultures.\n\nWhat truly elevates *Oggy and the Cockroaches* to legendary status is its unparalleled mastery of physical comedy and ingenious visual storytelling. Each episode unfolds as a meticulously choreographed ballet of pandemonium: from explosive pratfalls and elaborate chase sequences to hilariously failed traps and impossible feats of cartoon physics, all powered by the sheer will (and insatiable appetites) of its quartet of main characters. The genius lies in its wordless communication; every exaggerated expression, perfectly timed sound effect, and brilliantly conceived gag conveys a spectrum of emotion and narrative complexity, pulling viewers deep into Oggy\'s ever-frustrated attempts at peace. The distinct personalities of the cockroach trio – Joey\'s tactical brilliance, Dee Dee\'s boundless hunger, and Marky\'s effortlessly destructive nonchalance – provide the perfect, endlessly entertaining foil to Oggy\'s perpetually tormented existence.\n\nMore than just a cartoon, *Oggy and the Cockroaches* is a timeless testament to the universal language of humor. Its enduring appeal is rooted in a simple, universally relatable premise: the eternal, epic struggle between the desire for peace and the forces of chaotic disruption, amplified to cartoonishly epic proportions. Whether you\'re seeking unadulterated family entertainment, a dose of nostalgic laughter, or simply a brilliant example of expertly crafted animation, this series offers an escape into a world where the only prerequisite for enjoyment is a willingness to laugh out loud. Dive in and witness Oggy\'s house transform into a hilariously dynamic arena of wits, wills, and wonderfully wacky destruction – a truly unique experience guaranteed to deliver endless smiles.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Include trending hashtags and social media links\",\"Add viewer reaction highlights\",\"Mention viral moments and meme potential\",\"Include share buttons for social platforms\"]}', '2025-06-23 12:06:06', 'product_description', 0, '2025-06-23 17:06:06'),
(99, '43537113', '', 'Create a compelling video product description for: \"TrackDiv\"', 'Here\'s a compelling product description for \"TrackDiv\":\n\nIn an era deluged by data, simply collecting information isn\'t enough; true power lies in understanding and acting upon it. TrackDiv emerges as the indispensable platform engineered to transform raw data streams into crystal-clear, actionable intelligence. Designed for the modern professional, it goes beyond rudimentary tracking, providing an unparalleled lens through which to view your most critical operations, projects, and insights, ensuring you\'re always a step ahead in an increasingly complex landscape.\n\nAt its core, TrackDiv is a master of comprehensive monitoring, capable of seamlessly integrating diverse data sources—from web analytics and user behavior to operational metrics and project progress—all in real-time. But where TrackDiv truly differentiates itself is in its sophisticated \"dividing\" capability. This isn\'t just about segmenting data; it\'s about intelligently contextualizing information, allowing you to define, categorize, and analyze specific subsets with granular precision. Create custom dashboards, pinpoint performance bottlenecks, or isolate high-impact trends, all through an intuitive interface that makes complex analytics approachable for anyone.\n\nThe result? A paradigm shift from reactive observation to proactive strategy. With TrackDiv, decision-makers are empowered with real-time, cross-sectional insights, enabling them to optimize resource allocation, enhance customer experiences, and accelerate growth with unwavering confidence. Whether you\'re a product manager seeking to understand nuanced user engagement, a marketing team refining campaign performance across multiple channels, or an operations lead streamlining intricate workflows, TrackDiv provides the analytical clarity needed to navigate complexity and unlock new efficiencies. Embrace the future of intelligent oversight and turn every data point into a strategic advantage.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance with multimedia elements\",\"Add user testimonials and reviews\",\"Include related content recommendations\",\"Add social sharing capabilities\"]}', '2025-06-23 12:06:20', 'product_description', 0, '2025-06-23 17:06:20'),
(100, '43537113', '', 'Create a compelling video product description for: \"5 Steps of Cradit Repair\"', 'AI services are currently unavailable. Please check your API keys have sufficient credits.\n\nGemini Error: {\"error\":{\"code\":503,\"message\":\"The model is overloaded. Please try again later.\",\"status\":\"UNAVAILABLE\"}}\nOpenAI Error: 429 You exceeded your current quota, please check your plan and billing details. For more information on this error, read the docs: https://platform.openai.com/docs/guides/error-codes/api-errors.\n\nTo resolve:\n1. Check Google AI Studio for Gemini API credits\n2. Check OpenAI platform for ChatGPT API credits\n3. Verify API key permissions\n4. Try again\n\nThis system requires working AI API access for authentic content generation.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Check Gemini API credits\",\"Check OpenAI API credits\",\"Verify API key permissions\",\"Contact support if needed\"]}', '2025-06-23 12:06:50', 'product_description', 0, '2025-06-23 17:06:50'),
(101, '43537113', '', 'Create a compelling video product description for: \"5 Steps of Credit Repair\"', 'Here\'s a compelling product description for \"5 Steps of Credit Repair\":\n\nAre you tired of feeling trapped by a low credit score, high interest rates, and the constant struggle to qualify for loans or secure your financial future? Many individuals find themselves in a challenging credit situation, often feeling overwhelmed and unsure where to begin their journey to recovery. \"The 5 Steps of Credit Repair\" is your definitive, meticulously crafted guide designed to demystify the complex world of credit and empower you with a clear, actionable path towards financial liberation. This isn\'t just about numbers; it\'s about unlocking opportunities, reducing stress, and reclaiming your purchasing power.\n\nThis comprehensive program breaks down the often-intimidating process of credit restoration into five manageable, highly effective phases. You\'ll start by truly understanding your credit reports, learning how to identify and dispute inaccuracies, outdated information, and even fraudulent entries that are silently dragging your score down. From there, you\'ll be equipped with proven strategies for communicating effectively with credit bureaus and creditors, mastering the art of negotiation and leveraging consumer laws to your advantage. Beyond simply removing negatives, the guide also provides essential insights into building a positive credit history, establishing healthy financial habits, and utilizing credit strategically for long-term growth.\n\nImagine a future where you\'re approved for the mortgage you\'ve always dreamed of, qualify for the lowest interest rates on a new car, or finally secure that business loan to launch your entrepreneurial venture. \"The 5 Steps of Credit Repair\" is more than just a guide; it\'s an investment in your peace of mind and financial potential. By systematically applying these proven principles, you\'ll witness a tangible transformation in your credit score, opening doors to better financial products, increased savings, and the freedom to pursue your most important life goals. Take control of your credit destiny today and step into a brighter, more prosperous tomorrow.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance with multimedia elements\",\"Add user testimonials and reviews\",\"Include related content recommendations\",\"Add social sharing capabilities\"]}', '2025-06-23 12:07:06', 'product_description', 0, '2025-06-23 17:07:06'),
(102, '43537113', '', 'Create a compelling video product description for: \"5 Steps of Credit Repair Course\"', 'AI services are currently unavailable. Please check your API keys have sufficient credits.\n\nGemini Error: {\"error\":{\"code\":503,\"message\":\"The model is overloaded. Please try again later.\",\"status\":\"UNAVAILABLE\"}}\nOpenAI Error: 429 You exceeded your current quota, please check your plan and billing details. For more information on this error, read the docs: https://platform.openai.com/docs/guides/error-codes/api-errors.\n\nTo resolve:\n1. Check Google AI Studio for Gemini API credits\n2. Check OpenAI platform for ChatGPT API credits\n3. Verify API key permissions\n4. Try again\n\nThis system requires working AI API access for authentic content generation.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Check Gemini API credits\",\"Check OpenAI API credits\",\"Verify API key permissions\",\"Contact support if needed\"]}', '2025-06-23 12:07:35', 'product_description', 0, '2025-06-23 17:07:35'),
(103, '43537113', '', 'Create a compelling video product description for: \"5 Steps of Credit Repair Course\"', 'Are you feeling the heavy burden of a low credit score, watching opportunities slip away? Whether it\'s the frustration of loan denials, the sting of high interest rates, or simply the desire for greater financial freedom, bad credit can feel like an insurmountable barrier. Introducing the **\"5 Steps of Credit Repair Course\"** – your definitive guide to understanding, improving, and ultimately mastering your credit profile. This isn\'t just a collection of tips; it\'s a meticulously crafted, comprehensive program designed to empower you with the knowledge and actionable strategies needed to transform your financial future.\n\nDeveloped by seasoned financial experts, this course distills the often-complex world of credit repair into five clear, manageable phases. You\'ll gain crucial insights into how credit scores are calculated, learn precise methods for identifying and disputing errors on your credit reports that are dragging your score down, and discover strategic approaches to managing existing debt effectively. Beyond just \"fixing\" issues, the program guides you on cultivating positive credit habits that build a robust financial foundation, ensuring sustainable improvement long after you complete the course. Each step is packed with practical exercises, downloadable templates, and proven techniques to make the journey straightforward and effective.\n\nImagine a future where you qualify for the best interest rates on mortgages and auto loans, secure the credit cards you need, and confidently navigate financial decisions without the weight of poor credit holding you back. The \"5 Steps of Credit Repair Course\" isn\'t merely about numerical improvements; it\'s about reclaiming control, unlocking new possibilities, and achieving true financial peace of mind. Invest in yourself today and take the definitive step towards a higher credit score and a brighter, more secure financial tomorrow.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance with multimedia elements\",\"Add user testimonials and reviews\",\"Include related content recommendations\",\"Add social sharing capabilities\"]}', '2025-06-23 12:07:48', 'product_description', 0, '2025-06-23 17:07:48'),
(104, '43537113', '', 'Create a compelling video product description for: \"5 star perks\"', 'Imagine a world where convenience isn\'t just a promise, but an inherent state; where every interaction is seamless, every benefit amplified, and every experience meticulously tailored to exceed your highest expectations. This isn\'t just an aspiration—it\'s the reality delivered by **\"5 Star Perks.\"** We\'ve redefined what it means to be truly privileged, curating an unparalleled suite of advantages designed not merely to satisfy, but to delight and elevate your everyday to an extraordinary stratum of luxury and efficiency.\n\nAt its core, \"5 Star Perks\" is your exclusive gateway to a realm of premium benefits previously reserved for the most discerning individuals. Envision priority access to sought-after events and services, personalized concierge support attending to your every whim, and significant upgrades across travel, lifestyle, and entertainment. From bespoke recommendations that genuinely understand your preferences to expedited services that reclaim your invaluable time, each perk is meticulously selected to ensure not just convenience, but a genuine and profound enhancement of your life. This isn\'t a collection of standard bonuses; it\'s a carefully woven tapestry of unique opportunities designed to reflect and augment your sophisticated taste.\n\nBeyond the tangible advantages, \"5 Star Perks\" offers an intangible yet profound transformation: the peace of mind that comes from knowing you\'re always valued, always prioritized, and always experiencing the absolute best. It\'s about unlocking a lifestyle where limitations fade, and every desire is met with effortless grace, leaving you free to focus on what truly matters. Stop settling for the ordinary and embrace the extraordinary. Discover how \"5 Star Perks\" doesn\'t just add value; it fundamentally redefines your standard of living, offering an unparalleled stratum of luxury and convenience that truly deserves its impeccable five-star designation.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance with multimedia elements\",\"Add user testimonials and reviews\",\"Include related content recommendations\",\"Add social sharing capabilities\"]}', '2025-06-23 12:08:17', 'product_description', 0, '2025-06-23 17:08:17'),
(105, '44187122', '', 'Enhance this website_link product description: \"Share instantly between devices connected to one network\" for product \"AirForShare.com - Virtual Desktop for your Wi-Fi\"', 'In an increasingly interconnected world, the frustration of digital friction often persists: tangled cables, cumbersome file transfers, or the perennial quest to get content from one device onto another, seamlessly. Enter AirForShare.com, an ingenious solution that redefines how you interact with your digital world. Imagine a fluid, adaptable \"virtual desktop\" that lives not in the cloud, but right on your local Wi-Fi network, transforming how you share, present, and collaborate without a single installation or a byte uploaded to external servers.\n\nAirForShare.com isn\'t just another screen-sharing tool; it\'s a gateway to cross-device harmony. Forget downloading software, struggling with drivers, or wrestling with compatibility issues. With AirForShare, your existing Wi-Fi network becomes the seamless canvas for instant content projection and interaction. Whether you\'re presenting a slideshow from your laptop to a smart TV, mirroring a crucial document from your phone to a colleague\'s screen, or simply streaming family photos from a tablet to a larger display, AirForShare makes it astonishingly simple. Your web browser is your window into this shared digital space, making setup virtually non-existent for any device on your network.\n\nThe true brilliance of AirForShare lies in its foundational principle: leveraging the inherent speed and security of your *local* Wi-Fi network. This isn\'t about sending your sensitive data to remote servers; it\'s about creating a private, high-performance bridge between your devices right where you are. This local-first approach ensures lightning-fast responsiveness, zero bandwidth overhead from internet usage, and unparalleled peace of mind knowing your information stays within your control. It\'s an indispensable tool for educators, streamlining classroom presentations; for businesses, enabling instant, ad-hoc meetings; and for home users, creating a centralized, accessible media hub. AirForShare transforms your disparate devices into a cohesive, collaborative workspace, all powered by the network you already trust.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance with multimedia elements\",\"Add user testimonials and reviews\",\"Include related content recommendations\",\"Add social sharing capabilities\"]}', '2025-06-23 12:15:43', 'product_description', 0, '2025-06-23 17:15:43'),
(106, '43537113', '', 'Enhance this website_link product description: \"Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.\" for product \"YouTube\"', 'Here is a compelling product description for YouTube:\n\nYouTube isn\'t just a platform; it\'s the world\'s definitive stage for visual storytelling, a boundless digital universe where billions converge daily to connect, learn, and be entertained. Since its inception, it has revolutionized how we consume media, transforming from a simple video-sharing site into an indispensable global phenomenon. Whether you\'re seeking in-depth tutorials, the latest music videos, breaking news, live events, or simply a moment of pure entertainment, YouTube offers an unparalleled, on-demand library, instantly accessible to anyone with an internet connection, effectively democratizing broadcast media.\n\nDive into YouTube, and you\'ll discover an astonishing kaleidoscope of content, reflecting every conceivable interest and niche. From amateur creators sharing their passions to professional studios releasing blockbuster trailers, the diversity is staggering. This rich ecosystem fosters vibrant communities around shared interests, allowing viewers to not only consume content but also engage deeply with creators and fellow enthusiasts through comments, likes, and live chat. It\'s where cultural trends are born, memes proliferate, and countless individuals find their voice, building dedicated audiences who often feel more like extended families than mere subscribers.\n\nBeyond entertainment, YouTube has cemented its place as a colossal learning hub and a dynamic engine for the global creator economy. It empowers millions to turn their passions into professions, offering robust tools for monetization, analytics, and unparalleled global reach. The platform continually innovates, introducing features like YouTube Shorts for bite-sized video content and cutting-edge live-streaming capabilities, constantly pushing the boundaries of real-time interaction and content delivery. In essence, YouTube is not merely a destination for videos; it\'s a living, evolving ecosystem that reflects, shapes, and amplifies the human experience, offering endless opportunities for discovery, connection, and self-expression.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance with multimedia elements\",\"Add user testimonials and reviews\",\"Include related content recommendations\",\"Add social sharing capabilities\"]}', '2025-06-23 12:18:13', 'product_description', 0, '2025-06-23 17:18:13'),
(107, '44187122', '', 'Enhance this website_link product description: \"Share instantly between devices connected to one network\" for product \"AirForShare.com - Virtual Desktop for your Wi-Fi\"', 'Tired of wrestling with cables, slow cloud uploads, or cumbersome sharing protocols just to get your digital life in sync? AirForShare.com emerges as the definitive solution, transforming your existing Wi-Fi network into a dynamic, friction-free virtual desktop for all your devices. Imagine the ultimate convenience: seamlessly accessing files, sharing screens, or streaming content between your laptop, tablet, and smartphone, all within the secure, high-speed confines of your local network. It’s a breakthrough in device interoperability, designed to eliminate digital barriers and elevate your workflow.\n\nAt its core, AirForShare delivers the full power of a virtual desktop, reimagined for instantaneous local access. Whether you\'re presenting a critical document from your desktop to a meeting room tablet, accessing your extensive media library on your living room smart TV, or simply needing to grab a file from your home office PC while relaxing on the patio, AirForShare makes it profoundly simple. This isn\'t just about file transfer; it\'s about creating a fluid digital ecosystem where your content is always within reach, effortlessly shared and managed across any connected screen on your Wi-Fi.\n\nThe brilliance of AirForShare lies in its intelligent utilization of your local Wi-Fi. By operating directly within your network, it bypasses the internet, ensuring blistering speeds, enhanced privacy, and unparalleled responsiveness – your data never leaves your home or office. This means no buffering, no privacy concerns associated with third-party servers, and continuous operation even when your internet connection drops. AirForShare.com isn\'t just a utility; it\'s an essential digital bridge that redefines convenience, security, and efficiency for the modern connected lifestyle.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance with multimedia elements\",\"Add user testimonials and reviews\",\"Include related content recommendations\",\"Add social sharing capabilities\"]}', '2025-06-23 12:18:39', 'product_description', 0, '2025-06-23 17:18:39'),
(108, '44187263', '', 'Enhance this website_link product description: \"Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.\" for product \"YouTube\"', '**YouTube: The Global Stage for Vision and Voice**\n\nYouTube isn\'t merely a website; it\'s the unparalleled global stage for video content, a digital universe where billions discover, create, and connect through the power of sight and sound. Launched as a simple video-sharing platform, it swiftly evolved into a cultural phenomenon, redefining how we consume entertainment, learn new skills, follow current events, and engage with communities. It democratized media, allowing anyone with a camera and an idea to broadcast to the world, thereby leveling the playing field and fostering an unprecedented era of digital creativity.\n\nFor viewers, YouTube offers an inexhaustible wellspring of content, catering to virtually every interest imaginable. From in-depth tutorials on quantum physics to heart-warming animal compilations, breaking news reports to independent short films, the platform\'s intelligent algorithms curate personalized feeds, ensuring a tailored and endlessly engaging experience. Its intuitive interface, coupled with features like subscriptions, playlists, and interactive comments, fosters vibrant communities around niche topics and global trends alike, transforming passive watching into an active, social experience.\n\nBeyond consumption, YouTube stands as a revolutionary engine for the creator economy, empowering voices from every corner of the globe to build audiences, cultivate brands, and even forge sustainable careers. It provided the tools and the platform for a new generation of digital artists, educators, entertainers, and activists to flourish, circumventing traditional gatekeepers and directly connecting with their fans. This ecosystem of creators, supported by robust monetization options and analytics, has not only transformed individual lives but has profoundly reshaped entertainment, education, and social discourse on a global scale.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance with multimedia elements\",\"Add user testimonials and reviews\",\"Include related content recommendations\",\"Add social sharing capabilities\"]}', '2025-06-23 12:21:09', 'product_description', 0, '2025-06-23 17:21:09'),
(109, '43537113', '', 'Create a compelling video product description for: \"TrackDiv\"', 'In today\'s fast-paced operational landscape, managing complex projects often feels like navigating a labyrinth blindfolded. Teams grapple with scattered information, disjointed workflows, and a constant struggle to maintain oversight of evolving objectives and resource allocation. Enter TrackDiv, the revolutionary platform engineered to transform this chaos into crystal-clear clarity. It\'s not just a tracking tool; it\'s an intelligent ecosystem designed to bring unparalleled precision and actionable insight to every facet of your project lifecycle, ensuring every moving part is accounted for and optimized.\n\nAt its core, TrackDiv meticulously tracks granular task progression, resource utilization, and critical deadlines in real-time, providing an always-on pulse of your initiatives. The \"Div\" in TrackDiv shines through its intuitive segmentation capabilities, empowering teams to deconstruct monolithic projects into manageable, assignable divisions. This allows for hyper-focused workstreams, optimized team collaboration, and the elimination of common bottlenecks that plague traditional project management. With customizable dashboards and predictive analytics, you gain not just raw data, but foresight, enabling proactive decision-making and efficient course correction before challenges escalate.\n\nTrackDiv is more than just a software solution; it\'s a strategic partner for project managers, team leads, and executives across diverse industries, from agile software development to intricate manufacturing pipelines. By fostering a unified operational view and streamlining communication, it dramatically enhances productivity, accountability, and the overall quality of deliverables. Imagine effortlessly identifying underutilized resources, pinpointing potential delays before they impact the critical path, and ensuring every team member is perfectly aligned with overarching strategic goals. With TrackDiv, you\'re not just managing projects; you\'re orchestrating success with a level of control and insight previously unattainable.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance with multimedia elements\",\"Add user testimonials and reviews\",\"Include related content recommendations\",\"Add social sharing capabilities\"]}', '2025-06-24 02:07:53', 'product_description', 0, '2025-06-24 07:07:53'),
(110, '43537113', '', 'Create a compelling video product description for: \"Oggy and Cockroches\"', 'Prepare for a whirlwind of chaotic fun and relentless slapstick that has captivated audiences worldwide! *Oggy and the Cockroaches* invites you into the perpetually disrupted world of Oggy, a peace-loving, somewhat lazy blue cat whose quiet existence is routinely turned upside down by three mischievous, utterly indomitable cockroaches: Joey, Dee Dee, and Marky. This isn\'t just a cartoon; it\'s an unending, hilarious saga of domestic warfare waged with oversized mallets, improbable traps, and more explosions than your average action movie, all unfolding within the confines of Oggy\'s beleaguered home.\n\nDrawing deep from the wellspring of classic cartoon physics and timeless non-verbal comedy, *Oggy and the Cockroaches* masterfully transforms everyday household items into instruments of mayhem and mirth. Witness Oggy\'s valiant, often futile, attempts to reclaim his sanity and his refrigerator, all while the insect trio devises increasingly elaborate and absurd schemes to raid his food, wreck his home, and generally make his life a living hell. The humor lies in the exaggerated reactions, the ingenious (or spectacularly failing) contraptions, and the sheer, unadulterated persistence of both sides in this epic, silent battle that echoes the beloved rivalries of animation history.\n\nMore than just a series of gags, this beloved animated phenomenon transcends language barriers with its universal brand of visual humor, making it a favorite for families across generations. Its vibrant animation, dynamic pacing, and endlessly inventive scenarios ensure that every episode delivers fresh doses of laughter and surprising twists. Whether you\'re rediscovering the nostalgic joy or introducing new viewers to Oggy\'s plight, *Oggy and the Cockroaches* promises an escape into a world where chaos reigns supreme, and laughter is always the victor. Get ready to join the chase – you won\'t regret immersing yourself in this delightful, high-energy world!', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance with multimedia elements\",\"Add user testimonials and reviews\",\"Include related content recommendations\",\"Add social sharing capabilities\"]}', '2025-06-24 02:08:54', 'product_description', 0, '2025-06-24 07:08:54'),
(111, '43537113', '', 'Create a compelling video product description for: \"Credit Repair\"', 'AI services are currently unavailable. Please check your API keys have sufficient credits.\n\nGemini Error: {\"error\":{\"code\":503,\"message\":\"The model is overloaded. Please try again later.\",\"status\":\"UNAVAILABLE\"}}\nOpenAI Error: 429 You exceeded your current quota, please check your plan and billing details. For more information on this error, read the docs: https://platform.openai.com/docs/guides/error-codes/api-errors.\n\nTo resolve:\n1. Check Google AI Studio for Gemini API credits\n2. Check OpenAI platform for ChatGPT API credits\n3. Verify API key permissions\n4. Try again\n\nThis system requires working AI API access for authentic content generation.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Check Gemini API credits\",\"Check OpenAI API credits\",\"Verify API key permissions\",\"Contact support if needed\"]}', '2025-06-24 07:00:16', 'product_description', 0, '2025-06-24 12:00:16');
INSERT INTO `ai_generated_content` (`id`, `user_id`, `content_type`, `prompt`, `generated_content`, `tokens_used`, `model_used`, `quality_score`, `is_approved`, `metadata`, `created_at`, `type`, `usage_count`, `updated_at`) VALUES
(112, '43537113', '', 'Create a compelling video product description for: \"TackDiv\"', 'AI services are currently unavailable. Please check your API keys have sufficient credits.\n\nGemini Error: {\"error\":{\"code\":503,\"message\":\"The model is overloaded. Please try again later.\",\"status\":\"UNAVAILABLE\"}}\nOpenAI Error: 429 You exceeded your current quota, please check your plan and billing details. For more information on this error, read the docs: https://platform.openai.com/docs/guides/error-codes/api-errors.\n\nTo resolve:\n1. Check Google AI Studio for Gemini API credits\n2. Check OpenAI platform for ChatGPT API credits\n3. Verify API key permissions\n4. Try again\n\nThis system requires working AI API access for authentic content generation.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Check Gemini API credits\",\"Check OpenAI API credits\",\"Verify API key permissions\",\"Contact support if needed\"]}', '2025-06-24 07:00:38', 'product_description', 0, '2025-06-24 12:00:38'),
(113, '43537113', '', 'Create a compelling video product description for: \"Oggy\"', 'AI services are currently unavailable. Please check your API keys have sufficient credits.\n\nGemini Error: {\"error\":{\"code\":503,\"message\":\"The model is overloaded. Please try again later.\",\"status\":\"UNAVAILABLE\"}}\nOpenAI Error: 429 You exceeded your current quota, please check your plan and billing details. For more information on this error, read the docs: https://platform.openai.com/docs/guides/error-codes/api-errors.\n\nTo resolve:\n1. Check Google AI Studio for Gemini API credits\n2. Check OpenAI platform for ChatGPT API credits\n3. Verify API key permissions\n4. Try again\n\nThis system requires working AI API access for authentic content generation.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Check Gemini API credits\",\"Check OpenAI API credits\",\"Verify API key permissions\",\"Contact support if needed\"]}', '2025-06-24 07:01:00', 'product_description', 0, '2025-06-24 12:01:00'),
(114, '44187263', '', 'Enhance this website_link product description: \"Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.\" for product \"YouTube\"', '**YouTube: The Global Stage for Every Story**\n\nIn an age defined by digital connection and dynamic content, YouTube stands as the undisputed global epicenter of video, a colossal library and a vibrant community that fundamentally reshaped how we consume media, learn, and connect. More than just a platform, it\'s a living, breathing archive of human creativity, knowledge, and entertainment, where billions find their voice, their audience, and their next captivating obsession. From the raw, unscripted moments of daily vlogs to meticulously produced documentaries, groundbreaking music videos, and live broadcasts from every corner of the globe, YouTube has democratized storytelling, placing a broadcast studio in the pocket of anyone with an idea.\n\nWhat truly makes YouTube compelling is its unparalleled diversity and the thriving ecosystem it fosters. Here, aspiring musicians share their first tracks alongside industry legends, expert mechanics offer step-by-step tutorials, and passionate gamers build communities around their favorite titles, showcasing intricate gameplay mechanics, stunning graphics, and captivating storylines that captivate millions. It\'s a boundless universe where you can immerse yourself in complex coding concepts and programming languages, witness the latest NASA missions unfold, track Mars rovers, or delve into the wonders of astronomy and cutting-edge rocket technology developed by innovators like SpaceX. This incredible breadth ensures there\'s something for every curiosity, from the profoundly educational to the purely entertaining, including the latest viral content, internet comedy culture, and the ever-evolving landscape of TikTok humor and memes.\n\nBeyond its vast content library, YouTube thrives on community and personalized discovery. Its sophisticated algorithms anticipate your next obsession, serving up tailored recommendations that transform casual browsing into a journey of endless exploration. It\'s the birthplace of global trends, the launching pad for social movements, and the daily conduit for countless hours of shared knowledge. YouTube isn\'t just a destination for passive viewing; it\'s an interactive universe where creators are empowered to forge sustainable careers, audiences actively engage through comments and shares, and the very definition of media continues to evolve at the speed of human innovation and imagination.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance with multimedia elements\",\"Add user testimonials and reviews\",\"Include related content recommendations\",\"Add social sharing capabilities\"]}', '2025-06-28 12:33:33', 'product_description', 0, '2025-06-28 17:33:33'),
(115, '44622389', '', 'Enhance this website_link product description: \"Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.\" for product \"YouTube\"', '**YouTube: The World\'s Infinite Digital Stage**\n\nYouTube isn\'t merely a video-sharing platform; it\'s the definitive global nexus for visual storytelling, a boundless digital universe where every idea, passion, and piece of information finds its audience. From groundbreaking documentaries to the latest chart-topping music videos, insightful educational tutorials to viral comedy sensations, YouTube stands as the most expansive and diverse library of human creativity ever assembled. It\'s where billions connect daily to be entertained, educated, and inspired, transcending geographical boundaries and cultural divides with the universal language of video.\n\nWhat truly distinguishes YouTube is its profound democratization of content creation, transforming passive consumption into active participation. It empowered individuals from all walks of life to become creators, offering a powerful megaphone for unique voices, niche interests, and artistic expressions. This platform has not only launched countless careers, from independent musicians and comedians to educational gurus and lifestyle vloggers, but also fostered entirely new forms of media and entertainment, allowing passions to blossom into professions and turning every voice into a potential global broadcaster.\n\nMore than just a repository, YouTube delivers a dynamic, interactive, and deeply personalized experience. Its sophisticated recommendation algorithms continuously curate your viewing journey, ensuring endless discovery tailored to your evolving interests. With unparalleled accessibility across virtually any device, it brings on-demand entertainment, knowledge, and connection directly to your fingertips. Engage with creators through comments, share your favorite moments, or dive deep into any subject imaginable—YouTube is the quintessential hub where curiosity meets content, continuously evolving to reflect the vibrant pulse of global culture.', NULL, NULL, NULL, 0, '{\"tone\":\"professional\",\"length\":\"medium\",\"suggestions\":[\"Enhance with multimedia elements\",\"Add user testimonials and reviews\",\"Include related content recommendations\",\"Add social sharing capabilities\"]}', '2025-07-04 10:17:58', 'product_description', 0, '2025-07-04 15:17:58');

-- --------------------------------------------------------

--
-- Table structure for table `ai_recommendations`
--

CREATE TABLE `ai_recommendations` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `analytics_events`
--

CREATE TABLE `analytics_events` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `analytics_metrics`
--

CREATE TABLE `analytics_metrics` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` int(11) NOT NULL,
  `white_label_id` int(11) DEFAULT NULL,
  `created_by` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `type` varchar(50) DEFAULT 'general',
  `priority` varchar(50) DEFAULT 'normal',
  `is_published` tinyint(1) DEFAULT 0,
  `published_at` timestamp NULL DEFAULT NULL,
  `targeting_type` varchar(50) DEFAULT 'everyone',
  `targeted_plan_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT json_array() CHECK (json_valid(`targeted_plan_ids`)),
  `expires_at` timestamp NULL DEFAULT NULL,
  `target_audience` varchar(50) DEFAULT 'all',
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `scheduled_at` timestamp NULL DEFAULT NULL,
  `status` varchar(50) DEFAULT 'draft',
  `is_active` tinyint(1) DEFAULT 1,
  `user_id` varchar(255) DEFAULT NULL,
  `attachments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attachments`)),
  `visibility` varchar(255) DEFAULT NULL,
  `is_pinned` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`id`, `white_label_id`, `created_by`, `title`, `content`, `type`, `priority`, `is_published`, `published_at`, `targeting_type`, `targeted_plan_ids`, `expires_at`, `target_audience`, `metadata`, `created_at`, `updated_at`, `scheduled_at`, `status`, `is_active`, `user_id`, `attachments`, `visibility`, `is_pinned`) VALUES
(54, 1, '', 'Welcome to Final Debug Test!', 'We\'re excited to have you as part of our community. Explore our platform and discover what we have to offer.', 'general', 'normal', 0, NULL, '128', '[]', NULL, '128', NULL, '2025-08-29 13:34:01', '2025-09-21 21:04:24', NULL, 'published', 0, '328afffb-74f6-4d76-aa7a-6cb7d37e8fa3', '[]', 'public', 0),
(66, NULL, '', 'test', 'test', 'general', 'normal', 0, '2025-09-19 20:31:18', 'everyone', '[]', NULL, 'all', NULL, '2025-09-19 20:31:18', '2025-09-19 20:31:18', NULL, 'published', 1, '43537113', '[]', 'public', NULL),
(67, NULL, '', 'test2', 'test2', 'general', 'normal', 0, '2025-09-19 20:34:25', 'everyone', '[]', NULL, 'all', NULL, '2025-09-19 20:34:25', '2025-09-19 20:34:25', NULL, 'published', 1, '43537113', '[]', 'public', NULL),
(68, NULL, '', 'schedule test', 'schedule test', 'general', 'normal', 0, '2025-09-19 20:43:18', 'everyone', '[]', NULL, 'all', NULL, '2025-09-19 20:38:22', '2025-09-19 20:43:18', '2025-09-19 20:40:00', 'published', 1, '43537113', '[]', 'public', NULL),
(69, NULL, '', 'test', 'testes', 'general', 'normal', 0, '2025-09-20 09:57:46', 'everyone', '[]', NULL, 'all', NULL, '2025-09-20 09:57:46', '2025-09-21 20:18:43', NULL, 'published', 0, '43537113', '[]', 'public', NULL),
(70, NULL, '', 'hjgj', '', 'general', 'normal', 0, '2025-09-21 20:31:44', 'everyone', '[]', NULL, 'all', NULL, '2025-09-21 20:31:44', '2025-09-21 20:31:44', NULL, 'published', 1, '43537113', '[]', 'public', NULL),
(71, NULL, '', 'News Plan - $22/month', '', 'general', 'normal', 0, '2025-09-21 21:25:49', 'by_plan', '[130]', NULL, 'all', NULL, '2025-09-21 20:31:58', '2025-09-21 21:28:26', NULL, 'published', 1, '43537113', '[]', 'public', NULL),
(72, NULL, '', 'osdf', '', 'general', 'normal', 0, '2025-09-21 21:02:57', 'everyone', '[]', NULL, 'all', NULL, '2025-09-21 20:33:06', '2025-09-21 21:02:57', NULL, 'published', 1, '43537113', '[]', 'public', NULL),
(73, NULL, '', 'oo', '', 'general', 'normal', 0, '2025-09-21 21:29:27', 'by_plan', '[129]', NULL, 'all', NULL, '2025-09-21 21:29:27', '2025-09-21 21:29:27', NULL, 'published', 1, '43537113', '[]', 'public', NULL),
(74, NULL, '', 'ts plan news', '', 'general', 'normal', 0, '2025-09-21 21:30:48', 'by_plan', '[\"[\",\"\\\"\",\"[\",\"\\\"\",\",\",\"\\\"\",\"1\",\"\\\"\",\",\",\"\\\"\",\"2\",\"\\\"\",\",\",\"\\\"\",\"9\",\"\\\"\",\",\",\"\\\"\",\"]\",\"\\\"\",\",\",\"1\",\"3\",\"1\",\"]\",130]', NULL, 'all', NULL, '2025-09-21 21:29:38', '2025-09-21 21:30:48', NULL, 'published', 1, '43537113', '[]', 'public', NULL),
(75, 7, '', 'Checking', '', 'general', 'normal', 0, '2025-09-23 20:15:34', 'everyone', '[]', NULL, 'all', NULL, '2025-09-23 20:13:55', '2025-09-23 20:57:15', '2025-09-23 20:15:00', 'published', 0, '44187263', '[]', 'public', NULL),
(76, 11, '', 'test', 'test', 'general', 'normal', 0, '2025-09-23 20:57:37', 'everyone', '[]', NULL, 'all', NULL, '2025-09-23 20:57:38', '2025-09-23 20:57:41', NULL, 'published', 0, '44377090', '[]', 'public', NULL),
(77, 11, '', 'test', 'test', 'general', 'normal', 0, '2025-09-23 21:01:37', 'everyone', '[]', NULL, 'all', NULL, '2025-09-23 21:01:37', '2025-09-23 21:01:43', NULL, 'published', 0, '44377090', '[]', 'public', NULL),
(78, 7, '', 'im 7', '', 'general', 'normal', 0, '2025-09-23 21:13:47', 'everyone', '[]', NULL, 'all', NULL, '2025-09-23 21:13:47', '2025-09-23 21:13:47', NULL, 'published', 1, '44187263', '[]', 'public', NULL),
(79, 11, '', 'youtubeCreate News', '', 'general', 'normal', 0, '2025-09-23 21:24:34', 'everyone', '[]', NULL, 'all', NULL, '2025-09-23 21:24:34', '2025-09-23 21:24:34', NULL, 'published', 1, '44377090', '[]', 'public', NULL),
(80, 7, '', 'Image Checking', '', 'general', 'normal', 0, '2025-09-24 03:06:14', 'everyone', '[]', NULL, 'all', NULL, '2025-09-24 02:52:03', '2025-09-24 03:06:14', NULL, 'published', 1, '44187263', '[{\"url\":\"/uploads/announcement_1758683174282-167380509_download.jpg\",\"type\":\"image/jpeg\",\"name\":\"download.jpg\",\"size\":182426}]', 'public', NULL),
(81, 7, '', 'j', '', 'general', 'normal', 0, '2025-09-24 14:15:17', 'everyone', '[]', NULL, 'all', NULL, '2025-09-24 14:15:17', '2025-09-24 14:15:17', NULL, 'published', 1, '44187263', '[{\"url\":\"/uploads/announcement_1758723317715-853608016_logo.png\",\"type\":\"image/png\",\"name\":\"logo.png\",\"size\":208018}]', 'public', NULL),
(82, 7, '', 'k', '', 'general', 'normal', 0, '2025-09-24 14:16:45', 'everyone', '[]', NULL, 'all', NULL, '2025-09-24 14:16:45', '2025-09-24 14:16:45', NULL, 'published', 1, '44187263', '[{\"url\":\"/uploads/announcement_1758723405113-994850633_gsGXow.jpg\",\"type\":\"image/jpeg\",\"name\":\"gsGXow.jpg\",\"size\":1954492}]', 'public', NULL),
(83, NULL, '', 'kl', '', 'general', 'normal', 0, '2025-09-24 14:27:12', 'everyone', '[]', NULL, 'all', NULL, '2025-09-24 14:27:12', '2025-09-24 14:27:12', NULL, 'published', 1, '43537113', '[{\"url\":\"/uploads/announcement_1758724032933-83083994_gsGXow.jpg\",\"type\":\"image/jpeg\",\"name\":\"gsGXow.jpg\",\"size\":1954492}]', 'public', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `announcement_analytics`
--

CREATE TABLE `announcement_analytics` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `announcement_id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `event_type` varchar(50) NOT NULL,
  `event_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`event_data`)),
  `session_id` varchar(255) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `announcement_analytics`
--

INSERT INTO `announcement_analytics` (`id`, `created_at`, `updated_at`, `announcement_id`, `user_id`, `event_type`, `event_data`, `session_id`, `timestamp`) VALUES
(21, '2025-09-18 08:03:45', '2025-09-18 08:03:45', 54, '43537113', 'view', '{}', NULL, '2025-09-18 08:03:45'),
(22, '2025-09-18 08:03:45', '2025-09-18 08:03:45', 56, '43537113', 'view', '{}', NULL, '2025-09-18 08:03:45'),
(23, '2025-09-18 14:47:56', '2025-09-18 14:47:56', 56, '43537113', 'view', '{}', NULL, '2025-09-18 14:47:56'),
(24, '2025-09-18 14:47:58', '2025-09-18 14:47:58', 53, '43537113', 'view', '{}', NULL, '2025-09-18 14:47:58'),
(25, '2025-09-18 14:47:58', '2025-09-18 14:47:58', 52, '43537113', 'view', '{}', NULL, '2025-09-18 14:47:58'),
(26, '2025-09-18 14:47:58', '2025-09-18 14:47:58', 51, '43537113', 'view', '{}', NULL, '2025-09-18 14:47:58'),
(27, '2025-09-18 14:47:59', '2025-09-18 14:47:59', 49, '43537113', 'view', '{}', NULL, '2025-09-18 14:47:59'),
(28, '2025-09-18 14:47:59', '2025-09-18 14:47:59', 51, '43537113', 'view', '{}', NULL, '2025-09-18 14:47:59'),
(29, '2025-09-18 14:48:01', '2025-09-18 14:48:01', 56, '43537113', 'view', '{}', NULL, '2025-09-18 14:48:01'),
(30, '2025-09-18 14:48:03', '2025-09-18 14:48:03', 54, '43537113', 'view', '{}', NULL, '2025-09-18 14:48:03'),
(31, '2025-09-18 14:48:04', '2025-09-18 14:48:04', 56, '43537113', 'view', '{}', NULL, '2025-09-18 14:48:04'),
(32, '2025-09-18 14:48:05', '2025-09-18 14:48:05', 50, '43537113', 'view', '{}', NULL, '2025-09-18 14:48:05'),
(33, '2025-09-18 14:48:07', '2025-09-18 14:48:07', 56, '43537113', 'view', '{}', NULL, '2025-09-18 14:48:07'),
(34, '2025-09-18 14:48:07', '2025-09-18 14:48:07', 56, '43537113', 'view', '{}', NULL, '2025-09-18 14:48:07'),
(35, '2025-09-18 14:48:09', '2025-09-18 14:48:09', 56, '43537113', 'view', '{}', NULL, '2025-09-18 14:48:09'),
(36, '2025-09-18 14:48:09', '2025-09-18 14:48:09', 54, '43537113', 'view', '{}', NULL, '2025-09-18 14:48:09'),
(37, '2025-09-18 14:48:09', '2025-09-18 14:48:09', 55, '43537113', 'view', '{}', NULL, '2025-09-18 14:48:09'),
(38, '2025-09-18 14:48:10', '2025-09-18 14:48:10', 53, '43537113', 'view', '{}', NULL, '2025-09-18 14:48:10'),
(39, '2025-09-18 14:48:10', '2025-09-18 14:48:10', 56, '43537113', 'view', '{}', NULL, '2025-09-18 14:48:10'),
(40, '2025-09-18 14:48:11', '2025-09-18 14:48:11', 56, '43537113', 'view', '{}', NULL, '2025-09-18 14:48:11'),
(41, '2025-09-18 14:48:11', '2025-09-18 14:48:11', 56, '43537113', 'view', '{}', NULL, '2025-09-18 14:48:11'),
(42, '2025-09-18 14:48:12', '2025-09-18 14:48:12', 56, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-18 14:48:12'),
(43, '2025-09-18 15:01:29', '2025-09-18 15:01:29', 56, '43537113', 'view', '{}', NULL, '2025-09-18 15:01:29'),
(44, '2025-09-18 15:01:30', '2025-09-18 15:01:30', 56, '43537113', 'view', '{}', NULL, '2025-09-18 15:01:30'),
(45, '2025-09-18 15:01:31', '2025-09-18 15:01:31', 56, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-18 15:01:31'),
(46, '2025-09-18 15:01:33', '2025-09-18 15:01:33', 56, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-18 15:01:33'),
(47, '2025-09-18 15:01:33', '2025-09-18 15:01:33', 56, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-18 15:01:33'),
(48, '2025-09-18 15:01:34', '2025-09-18 15:01:34', 56, '43537113', 'click', '{\"elementClicked\":\"comment\"}', NULL, '2025-09-18 15:01:34'),
(49, '2025-09-18 15:01:35', '2025-09-18 15:01:35', 56, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-18 15:01:35'),
(50, '2025-09-18 15:01:37', '2025-09-18 15:01:37', 56, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-18 15:01:37'),
(51, '2025-09-18 15:01:38', '2025-09-18 15:01:38', 56, '43537113', 'click', '{\"elementClicked\":\"share\"}', NULL, '2025-09-18 15:01:38'),
(52, '2025-09-18 15:01:40', '2025-09-18 15:01:40', 56, '43537113', 'view', '{}', NULL, '2025-09-18 15:01:40'),
(53, '2025-09-18 15:01:50', '2025-09-18 15:01:50', 56, '44187263', 'view', '{}', NULL, '2025-09-18 15:01:50'),
(54, '2025-09-18 15:01:51', '2025-09-18 15:01:51', 56, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-18 15:01:51'),
(55, '2025-09-18 15:01:54', '2025-09-18 15:01:54', 56, '43537113', 'view', '{}', NULL, '2025-09-18 15:01:54'),
(56, '2025-09-18 17:22:24', '2025-09-18 17:22:24', 54, '43537113', 'view', '{}', NULL, '2025-09-18 17:22:24'),
(57, '2025-09-18 17:22:25', '2025-09-18 17:22:25', 56, '43537113', 'view', '{}', NULL, '2025-09-18 17:22:25'),
(58, '2025-09-18 17:22:25', '2025-09-18 17:22:25', 56, '43537113', 'view', '{}', NULL, '2025-09-18 17:22:25'),
(59, '2025-09-18 17:22:32', '2025-09-18 17:22:32', 55, '43537113', 'view', '{}', NULL, '2025-09-18 17:22:32'),
(60, '2025-09-18 17:22:34', '2025-09-18 17:22:34', 56, '43537113', 'view', '{}', NULL, '2025-09-18 17:22:34'),
(61, '2025-09-18 17:22:47', '2025-09-18 17:22:47', 56, '43537113', 'view', '{}', NULL, '2025-09-18 17:22:47'),
(62, '2025-09-18 17:26:38', '2025-09-18 17:26:38', 56, '43537113', 'view', '{}', NULL, '2025-09-18 17:26:38'),
(63, '2025-09-18 17:54:43', '2025-09-18 17:54:43', 54, '43537113', 'view', '{}', NULL, '2025-09-18 17:54:43'),
(64, '2025-09-18 17:54:43', '2025-09-18 17:54:43', 56, '43537113', 'view', '{}', NULL, '2025-09-18 17:54:43'),
(65, '2025-09-18 17:54:44', '2025-09-18 17:54:44', 56, '43537113', 'view', '{}', NULL, '2025-09-18 17:54:44'),
(66, '2025-09-18 17:54:45', '2025-09-18 17:54:45', 54, '43537113', 'view', '{}', NULL, '2025-09-18 17:54:45'),
(67, '2025-09-18 17:55:30', '2025-09-18 17:55:30', 56, '43537113', 'view', '{}', NULL, '2025-09-18 17:55:30'),
(68, '2025-09-18 17:55:33', '2025-09-18 17:55:33', 56, '43537113', 'view', '{}', NULL, '2025-09-18 17:55:33'),
(69, '2025-09-18 17:55:34', '2025-09-18 17:55:34', 56, '43537113', 'view', '{}', NULL, '2025-09-18 17:55:34'),
(70, '2025-09-18 17:55:34', '2025-09-18 17:55:34', 54, '43537113', 'view', '{}', NULL, '2025-09-18 17:55:34'),
(71, '2025-09-18 17:57:23', '2025-09-18 17:57:23', 56, '43537113', 'view', '{}', NULL, '2025-09-18 17:57:23'),
(72, '2025-09-18 17:57:26', '2025-09-18 17:57:26', 56, '43537113', 'view', '{}', NULL, '2025-09-18 17:57:26'),
(73, '2025-09-18 17:57:57', '2025-09-18 17:57:57', 54, '43537113', 'view', '{}', NULL, '2025-09-18 17:57:57'),
(74, '2025-09-18 17:57:57', '2025-09-18 17:57:57', 56, '43537113', 'view', '{}', NULL, '2025-09-18 17:57:57'),
(75, '2025-09-19 17:25:33', '2025-09-19 17:25:33', 56, '43537113', 'view', '{}', NULL, '2025-09-19 17:25:33'),
(76, '2025-09-19 17:25:33', '2025-09-19 17:25:33', 56, '43537113', 'click', '{\"elementClicked\":\"comment\"}', NULL, '2025-09-19 17:25:33'),
(77, '2025-09-19 17:25:34', '2025-09-19 17:25:34', 56, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-19 17:25:34'),
(78, '2025-09-19 20:19:35', '2025-09-19 20:19:35', 56, '43537113', 'view', '{}', NULL, '2025-09-19 20:19:35'),
(79, '2025-09-19 20:23:13', '2025-09-19 20:23:13', 56, '43537113', 'view', '{}', NULL, '2025-09-19 20:23:13'),
(80, '2025-09-19 20:23:14', '2025-09-19 20:23:14', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:23:14'),
(81, '2025-09-19 20:23:14', '2025-09-19 20:23:14', 56, '43537113', 'view', '{}', NULL, '2025-09-19 20:23:14'),
(82, '2025-09-19 20:23:21', '2025-09-19 20:23:21', 55, '43537113', 'view', '{}', NULL, '2025-09-19 20:23:21'),
(83, '2025-09-19 20:23:22', '2025-09-19 20:23:22', 55, '43537113', 'view', '{}', NULL, '2025-09-19 20:23:22'),
(84, '2025-09-19 20:23:25', '2025-09-19 20:23:25', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:23:25'),
(85, '2025-09-19 20:23:33', '2025-09-19 20:23:33', 55, '43537113', 'view', '{}', NULL, '2025-09-19 20:23:33'),
(86, '2025-09-19 20:23:34', '2025-09-19 20:23:34', 52, '43537113', 'view', '{}', NULL, '2025-09-19 20:23:34'),
(87, '2025-09-19 20:23:48', '2025-09-19 20:23:48', 51, '43537113', 'view', '{}', NULL, '2025-09-19 20:23:48'),
(88, '2025-09-19 20:23:48', '2025-09-19 20:23:48', 51, '43537113', 'view', '{}', NULL, '2025-09-19 20:23:48'),
(89, '2025-09-19 20:23:48', '2025-09-19 20:23:48', 50, '43537113', 'view', '{}', NULL, '2025-09-19 20:23:48'),
(90, '2025-09-19 20:24:05', '2025-09-19 20:24:05', 49, '43537113', 'view', '{}', NULL, '2025-09-19 20:24:05'),
(91, '2025-09-19 20:24:06', '2025-09-19 20:24:06', 50, '43537113', 'view', '{}', NULL, '2025-09-19 20:24:06'),
(92, '2025-09-19 20:24:07', '2025-09-19 20:24:07', 50, '43537113', 'click', '{\"elementClicked\":\"comment\"}', NULL, '2025-09-19 20:24:07'),
(93, '2025-09-19 20:24:08', '2025-09-19 20:24:08', 50, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-19 20:24:08'),
(94, '2025-09-19 20:25:03', '2025-09-19 20:25:03', 50, '43537113', 'view', '{}', NULL, '2025-09-19 20:25:03'),
(95, '2025-09-19 20:25:04', '2025-09-19 20:25:04', 51, '43537113', 'view', '{}', NULL, '2025-09-19 20:25:04'),
(96, '2025-09-19 20:25:06', '2025-09-19 20:25:06', 50, '43537113', 'view', '{}', NULL, '2025-09-19 20:25:06'),
(97, '2025-09-19 20:25:50', '2025-09-19 20:25:50', 50, '43537113', 'view', '{}', NULL, '2025-09-19 20:25:50'),
(98, '2025-09-19 20:25:50', '2025-09-19 20:25:50', 51, '43537113', 'view', '{}', NULL, '2025-09-19 20:25:50'),
(99, '2025-09-19 20:25:50', '2025-09-19 20:25:50', 50, '43537113', 'view', '{}', NULL, '2025-09-19 20:25:50'),
(100, '2025-09-19 20:25:56', '2025-09-19 20:25:56', 55, '43537113', 'view', '{}', NULL, '2025-09-19 20:25:56'),
(101, '2025-09-19 20:25:57', '2025-09-19 20:25:57', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:25:57'),
(102, '2025-09-19 20:25:57', '2025-09-19 20:25:57', 56, '43537113', 'view', '{}', NULL, '2025-09-19 20:25:57'),
(103, '2025-09-19 20:27:15', '2025-09-19 20:27:15', 56, '43537113', 'view', '{}', NULL, '2025-09-19 20:27:15'),
(104, '2025-09-19 20:27:26', '2025-09-19 20:27:26', 55, '43537113', 'view', '{}', NULL, '2025-09-19 20:27:26'),
(105, '2025-09-19 20:27:28', '2025-09-19 20:27:28', 55, '43537113', 'view', '{}', NULL, '2025-09-19 20:27:28'),
(106, '2025-09-19 20:27:29', '2025-09-19 20:27:29', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:27:29'),
(107, '2025-09-19 20:27:35', '2025-09-19 20:27:35', 56, '43537113', 'view', '{}', NULL, '2025-09-19 20:27:35'),
(108, '2025-09-19 20:27:38', '2025-09-19 20:27:38', 56, '43537113', 'view', '{}', NULL, '2025-09-19 20:27:38'),
(109, '2025-09-19 20:27:40', '2025-09-19 20:27:40', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:27:40'),
(110, '2025-09-19 20:27:41', '2025-09-19 20:27:41', 51, '43537113', 'view', '{}', NULL, '2025-09-19 20:27:41'),
(111, '2025-09-19 20:27:41', '2025-09-19 20:27:41', 50, '43537113', 'view', '{}', NULL, '2025-09-19 20:27:41'),
(112, '2025-09-19 20:27:41', '2025-09-19 20:27:41', 49, '43537113', 'view', '{}', NULL, '2025-09-19 20:27:41'),
(113, '2025-09-19 20:27:41', '2025-09-19 20:27:41', 48, '43537113', 'view', '{}', NULL, '2025-09-19 20:27:41'),
(114, '2025-09-19 20:27:42', '2025-09-19 20:27:42', 46, '43537113', 'view', '{}', NULL, '2025-09-19 20:27:42'),
(115, '2025-09-19 20:27:42', '2025-09-19 20:27:42', 45, '43537113', 'view', '{}', NULL, '2025-09-19 20:27:42'),
(116, '2025-09-19 20:27:42', '2025-09-19 20:27:42', 41, '43537113', 'view', '{}', NULL, '2025-09-19 20:27:42'),
(117, '2025-09-19 20:27:42', '2025-09-19 20:27:42', 40, '43537113', 'view', '{}', NULL, '2025-09-19 20:27:42'),
(118, '2025-09-19 20:27:43', '2025-09-19 20:27:43', 37, '43537113', 'view', '{}', NULL, '2025-09-19 20:27:43'),
(119, '2025-09-19 20:27:44', '2025-09-19 20:27:44', 41, '43537113', 'view', '{}', NULL, '2025-09-19 20:27:44'),
(120, '2025-09-19 20:27:44', '2025-09-19 20:27:44', 46, '43537113', 'view', '{}', NULL, '2025-09-19 20:27:44'),
(121, '2025-09-19 20:27:48', '2025-09-19 20:27:48', 56, '43537113', 'view', '{}', NULL, '2025-09-19 20:27:48'),
(122, '2025-09-19 20:28:02', '2025-09-19 20:28:02', 55, '43537113', 'view', '{}', NULL, '2025-09-19 20:28:02'),
(123, '2025-09-19 20:28:02', '2025-09-19 20:28:02', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:28:02'),
(124, '2025-09-19 20:28:03', '2025-09-19 20:28:03', 56, '43537113', 'view', '{}', NULL, '2025-09-19 20:28:03'),
(125, '2025-09-19 20:28:03', '2025-09-19 20:28:03', 56, '43537113', 'click', '{\"elementClicked\":\"comment\"}', NULL, '2025-09-19 20:28:03'),
(126, '2025-09-19 20:28:04', '2025-09-19 20:28:04', 56, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-19 20:28:04'),
(127, '2025-09-19 20:28:06', '2025-09-19 20:28:06', 56, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-19 20:28:06'),
(128, '2025-09-19 20:28:07', '2025-09-19 20:28:07', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:28:07'),
(129, '2025-09-19 20:30:51', '2025-09-19 20:30:51', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:30:51'),
(130, '2025-09-19 20:30:51', '2025-09-19 20:30:51', 56, '43537113', 'view', '{}', NULL, '2025-09-19 20:30:51'),
(131, '2025-09-19 20:30:52', '2025-09-19 20:30:52', 56, '43537113', 'click', '{\"elementClicked\":\"comment\"}', NULL, '2025-09-19 20:30:52'),
(132, '2025-09-19 20:30:53', '2025-09-19 20:30:53', 56, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-19 20:30:53'),
(133, '2025-09-19 20:30:55', '2025-09-19 20:30:55', 56, '43537113', 'view', '{}', NULL, '2025-09-19 20:30:55'),
(134, '2025-09-19 20:30:55', '2025-09-19 20:30:55', 56, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-19 20:30:55'),
(135, '2025-09-19 20:30:59', '2025-09-19 20:30:59', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:30:59'),
(136, '2025-09-19 20:31:01', '2025-09-19 20:31:01', 55, '43537113', 'view', '{}', NULL, '2025-09-19 20:31:01'),
(137, '2025-09-19 20:31:09', '2025-09-19 20:31:09', 55, '43537113', 'view', '{}', NULL, '2025-09-19 20:31:09'),
(138, '2025-09-19 20:31:09', '2025-09-19 20:31:09', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:31:09'),
(139, '2025-09-19 20:31:10', '2025-09-19 20:31:10', 56, '43537113', 'view', '{}', NULL, '2025-09-19 20:31:10'),
(140, '2025-09-19 20:31:18', '2025-09-19 20:31:18', 55, '43537113', 'view', '{}', NULL, '2025-09-19 20:31:18'),
(141, '2025-09-19 20:31:19', '2025-09-19 20:31:19', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:31:19'),
(142, '2025-09-19 20:31:27', '2025-09-19 20:31:27', 55, '43537113', 'view', '{}', NULL, '2025-09-19 20:31:27'),
(143, '2025-09-19 20:31:46', '2025-09-19 20:31:46', 55, '43537113', 'view', '{}', NULL, '2025-09-19 20:31:46'),
(144, '2025-09-19 20:31:49', '2025-09-19 20:31:49', 55, '43537113', 'view', '{}', NULL, '2025-09-19 20:31:49'),
(145, '2025-09-19 20:31:49', '2025-09-19 20:31:49', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:31:49'),
(146, '2025-09-19 20:31:50', '2025-09-19 20:31:50', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:31:50'),
(147, '2025-09-19 20:31:54', '2025-09-19 20:31:54', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:31:54'),
(148, '2025-09-19 20:31:54', '2025-09-19 20:31:54', 55, '43537113', 'view', '{}', NULL, '2025-09-19 20:31:54'),
(149, '2025-09-19 20:34:15', '2025-09-19 20:34:15', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:34:15'),
(150, '2025-09-19 20:34:24', '2025-09-19 20:34:24', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:34:24'),
(151, '2025-09-19 20:34:25', '2025-09-19 20:34:25', 66, '43537113', 'view', '{}', NULL, '2025-09-19 20:34:25'),
(152, '2025-09-19 20:34:25', '2025-09-19 20:34:25', 67, '43537113', 'view', '{}', NULL, '2025-09-19 20:34:25'),
(153, '2025-09-19 20:34:28', '2025-09-19 20:34:28', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:34:28'),
(154, '2025-09-19 20:34:33', '2025-09-19 20:34:33', 67, '43537113', 'view', '{}', NULL, '2025-09-19 20:34:33'),
(155, '2025-09-19 20:34:34', '2025-09-19 20:34:34', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:34:34'),
(156, '2025-09-19 20:34:34', '2025-09-19 20:34:34', 54, '43537113', 'click', '{\"elementClicked\":\"comment\"}', NULL, '2025-09-19 20:34:34'),
(157, '2025-09-19 20:34:35', '2025-09-19 20:34:35', 54, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-19 20:34:35'),
(158, '2025-09-19 20:34:37', '2025-09-19 20:34:37', 54, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-19 20:34:37'),
(159, '2025-09-19 20:34:41', '2025-09-19 20:34:41', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:34:41'),
(160, '2025-09-19 20:34:42', '2025-09-19 20:34:42', 67, '43537113', 'view', '{}', NULL, '2025-09-19 20:34:42'),
(161, '2025-09-19 20:34:43', '2025-09-19 20:34:43', 66, '43537113', 'view', '{}', NULL, '2025-09-19 20:34:43'),
(162, '2025-09-19 20:34:43', '2025-09-19 20:34:43', 67, '43537113', 'view', '{}', NULL, '2025-09-19 20:34:43'),
(163, '2025-09-19 20:34:43', '2025-09-19 20:34:43', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:34:43'),
(164, '2025-09-19 20:34:58', '2025-09-19 20:34:58', 67, '43537113', 'view', '{}', NULL, '2025-09-19 20:34:58'),
(165, '2025-09-19 20:35:06', '2025-09-19 20:35:06', 67, '43537113', 'view', '{}', NULL, '2025-09-19 20:35:06'),
(166, '2025-09-19 20:35:06', '2025-09-19 20:35:06', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:35:06'),
(167, '2025-09-19 20:35:07', '2025-09-19 20:35:07', 67, '43537113', 'view', '{}', NULL, '2025-09-19 20:35:07'),
(168, '2025-09-19 20:35:11', '2025-09-19 20:35:11', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:35:11'),
(169, '2025-09-19 20:35:41', '2025-09-19 20:35:41', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:35:41'),
(170, '2025-09-19 20:35:42', '2025-09-19 20:35:42', 67, '43537113', 'view', '{}', NULL, '2025-09-19 20:35:42'),
(171, '2025-09-19 20:35:42', '2025-09-19 20:35:42', 67, '43537113', 'click', '{\"elementClicked\":\"comment\"}', NULL, '2025-09-19 20:35:42'),
(172, '2025-09-19 20:35:50', '2025-09-19 20:35:50', 67, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-19 20:35:50'),
(173, '2025-09-19 20:35:56', '2025-09-19 20:35:56', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:35:56'),
(174, '2025-09-19 20:35:59', '2025-09-19 20:35:59', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:35:59'),
(175, '2025-09-19 20:35:59', '2025-09-19 20:35:59', 67, '43537113', 'view', '{}', NULL, '2025-09-19 20:35:59'),
(176, '2025-09-19 20:36:01', '2025-09-19 20:36:01', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:36:01'),
(177, '2025-09-19 20:36:12', '2025-09-19 20:36:12', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:36:12'),
(178, '2025-09-19 20:36:32', '2025-09-19 20:36:32', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:36:32'),
(179, '2025-09-19 20:37:45', '2025-09-19 20:37:45', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:37:45'),
(180, '2025-09-19 20:37:50', '2025-09-19 20:37:50', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:37:50'),
(181, '2025-09-19 20:38:02', '2025-09-19 20:38:02', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:38:02'),
(182, '2025-09-19 20:38:22', '2025-09-19 20:38:22', 66, '43537113', 'view', '{}', NULL, '2025-09-19 20:38:22'),
(183, '2025-09-19 20:38:23', '2025-09-19 20:38:23', 67, '43537113', 'view', '{}', NULL, '2025-09-19 20:38:23'),
(184, '2025-09-19 20:38:24', '2025-09-19 20:38:24', 68, '43537113', 'view', '{}', NULL, '2025-09-19 20:38:24'),
(185, '2025-09-19 20:38:28', '2025-09-19 20:38:28', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:38:28'),
(186, '2025-09-19 20:39:12', '2025-09-19 20:39:12', 54, '44187263', 'view', '{}', NULL, '2025-09-19 20:39:12'),
(187, '2025-09-19 20:39:12', '2025-09-19 20:39:12', 67, '44187263', 'view', '{}', NULL, '2025-09-19 20:39:12'),
(188, '2025-09-19 20:39:13', '2025-09-19 20:39:13', 54, '44187263', 'view', '{}', NULL, '2025-09-19 20:39:13'),
(189, '2025-09-19 20:39:14', '2025-09-19 20:39:14', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:39:14'),
(190, '2025-09-19 20:39:16', '2025-09-19 20:39:16', 68, '43537113', 'view', '{}', NULL, '2025-09-19 20:39:16'),
(191, '2025-09-19 20:39:23', '2025-09-19 20:39:23', 68, '43537113', 'view', '{}', NULL, '2025-09-19 20:39:23'),
(192, '2025-09-19 20:39:24', '2025-09-19 20:39:24', 68, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-19 20:39:24'),
(193, '2025-09-19 20:39:24', '2025-09-19 20:39:24', 68, '43537113', 'view', '{}', NULL, '2025-09-19 20:39:24'),
(194, '2025-09-19 20:39:37', '2025-09-19 20:39:37', 68, '43537113', 'view', '{}', NULL, '2025-09-19 20:39:37'),
(195, '2025-09-19 20:39:39', '2025-09-19 20:39:39', 67, '43537113', 'view', '{}', NULL, '2025-09-19 20:39:39'),
(196, '2025-09-19 20:39:39', '2025-09-19 20:39:39', 68, '43537113', 'view', '{}', NULL, '2025-09-19 20:39:39'),
(197, '2025-09-19 20:39:39', '2025-09-19 20:39:39', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:39:39'),
(198, '2025-09-19 20:39:48', '2025-09-19 20:39:48', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:39:48'),
(199, '2025-09-19 20:39:48', '2025-09-19 20:39:48', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:39:48'),
(200, '2025-09-19 20:40:02', '2025-09-19 20:40:02', 68, '43537113', 'view', '{}', NULL, '2025-09-19 20:40:02'),
(201, '2025-09-19 20:40:03', '2025-09-19 20:40:03', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:40:03'),
(202, '2025-09-19 20:40:03', '2025-09-19 20:40:03', 54, '43537113', 'click', '{\"elementClicked\":\"comment\"}', NULL, '2025-09-19 20:40:03'),
(203, '2025-09-19 20:40:04', '2025-09-19 20:40:04', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:40:04'),
(204, '2025-09-19 20:40:04', '2025-09-19 20:40:04', 54, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-19 20:40:04'),
(205, '2025-09-19 20:40:08', '2025-09-19 20:40:08', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:40:08'),
(206, '2025-09-19 20:41:11', '2025-09-19 20:41:11', 54, '44187263', 'view', '{}', NULL, '2025-09-19 20:41:11'),
(207, '2025-09-19 20:43:19', '2025-09-19 20:43:19', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:43:19'),
(208, '2025-09-19 20:43:19', '2025-09-19 20:43:19', 68, '43537113', 'view', '{}', NULL, '2025-09-19 20:43:19'),
(209, '2025-09-19 20:43:20', '2025-09-19 20:43:20', 67, '43537113', 'view', '{}', NULL, '2025-09-19 20:43:20'),
(210, '2025-09-19 20:43:20', '2025-09-19 20:43:20', 68, '43537113', 'view', '{}', NULL, '2025-09-19 20:43:20'),
(211, '2025-09-19 20:43:22', '2025-09-19 20:43:22', 67, '43537113', 'view', '{}', NULL, '2025-09-19 20:43:22'),
(212, '2025-09-19 20:43:22', '2025-09-19 20:43:22', 68, '43537113', 'view', '{}', NULL, '2025-09-19 20:43:22'),
(213, '2025-09-19 20:43:23', '2025-09-19 20:43:23', 68, '43537113', 'click', '{\"elementClicked\":\"comment\"}', NULL, '2025-09-19 20:43:23'),
(214, '2025-09-19 20:43:24', '2025-09-19 20:43:24', 68, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-19 20:43:24'),
(215, '2025-09-19 20:43:29', '2025-09-19 20:43:29', 68, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-19 20:43:29'),
(216, '2025-09-19 20:43:30', '2025-09-19 20:43:30', 67, '43537113', 'view', '{}', NULL, '2025-09-19 20:43:30'),
(217, '2025-09-19 20:43:32', '2025-09-19 20:43:32', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:43:32'),
(218, '2025-09-19 20:43:34', '2025-09-19 20:43:34', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:43:34'),
(219, '2025-09-19 20:43:35', '2025-09-19 20:43:35', 68, '43537113', 'view', '{}', NULL, '2025-09-19 20:43:35'),
(220, '2025-09-19 20:43:37', '2025-09-19 20:43:37', 54, '43537113', 'view', '{}', NULL, '2025-09-19 20:43:37'),
(221, '2025-09-19 22:29:37', '2025-09-19 22:29:37', 54, '43537113', 'view', '{}', NULL, '2025-09-19 22:29:37'),
(222, '2025-09-19 22:29:38', '2025-09-19 22:29:38', 68, '43537113', 'view', '{}', NULL, '2025-09-19 22:29:38'),
(223, '2025-09-19 22:29:39', '2025-09-19 22:29:39', 54, '43537113', 'view', '{}', NULL, '2025-09-19 22:29:39'),
(224, '2025-09-19 22:29:41', '2025-09-19 22:29:41', 68, '43537113', 'view', '{}', NULL, '2025-09-19 22:29:41'),
(225, '2025-09-19 22:29:42', '2025-09-19 22:29:42', 68, '43537113', 'click', '{\"elementClicked\":\"comment\"}', NULL, '2025-09-19 22:29:42'),
(226, '2025-09-19 22:29:43', '2025-09-19 22:29:43', 68, '43537113', 'click', '{\"elementClicked\":\"comment\"}', NULL, '2025-09-19 22:29:43'),
(227, '2025-09-19 22:29:45', '2025-09-19 22:29:45', 68, '43537113', 'view', '{}', NULL, '2025-09-19 22:29:45'),
(228, '2025-09-19 22:29:46', '2025-09-19 22:29:46', 67, '43537113', 'view', '{}', NULL, '2025-09-19 22:29:46'),
(229, '2025-09-19 22:29:47', '2025-09-19 22:29:47', 68, '43537113', 'view', '{}', NULL, '2025-09-19 22:29:47'),
(230, '2025-09-19 22:29:54', '2025-09-19 22:29:54', 54, '43537113', 'view', '{}', NULL, '2025-09-19 22:29:54'),
(231, '2025-09-19 22:31:09', '2025-09-19 22:31:09', 68, '43537113', 'view', '{}', NULL, '2025-09-19 22:31:09'),
(232, '2025-09-19 22:31:09', '2025-09-19 22:31:09', 54, '43537113', 'view', '{}', NULL, '2025-09-19 22:31:09'),
(233, '2025-09-19 22:31:12', '2025-09-19 22:31:12', 67, '43537113', 'view', '{}', NULL, '2025-09-19 22:31:12'),
(234, '2025-09-19 22:31:13', '2025-09-19 22:31:13', 68, '43537113', 'view', '{}', NULL, '2025-09-19 22:31:13'),
(235, '2025-09-19 22:31:13', '2025-09-19 22:31:13', 68, '43537113', 'click', '{\"elementClicked\":\"comment\"}', NULL, '2025-09-19 22:31:13'),
(236, '2025-09-19 22:31:28', '2025-09-19 22:31:28', 68, '43537113', 'view', '{}', NULL, '2025-09-19 22:31:28'),
(237, '2025-09-19 22:31:40', '2025-09-19 22:31:40', 68, '43537113', 'view', '{}', NULL, '2025-09-19 22:31:40'),
(238, '2025-09-19 22:31:46', '2025-09-19 22:31:46', 68, '43537113', 'view', '{}', NULL, '2025-09-19 22:31:46'),
(239, '2025-09-19 22:31:48', '2025-09-19 22:31:48', 68, '43537113', 'view', '{}', NULL, '2025-09-19 22:31:48'),
(240, '2025-09-19 22:32:06', '2025-09-19 22:32:06', 54, '43537113', 'view', '{}', NULL, '2025-09-19 22:32:06'),
(241, '2025-09-19 22:32:14', '2025-09-19 22:32:14', 54, '43537113', 'view', '{}', NULL, '2025-09-19 22:32:14'),
(242, '2025-09-19 22:47:04', '2025-09-19 22:47:04', 54, '43537113', 'view', '{}', NULL, '2025-09-19 22:47:04'),
(243, '2025-09-19 22:47:10', '2025-09-19 22:47:10', 68, '43537113', 'view', '{}', NULL, '2025-09-19 22:47:10'),
(244, '2025-09-19 22:47:23', '2025-09-19 22:47:23', 54, '43537113', 'view', '{}', NULL, '2025-09-19 22:47:23'),
(245, '2025-09-19 22:47:23', '2025-09-19 22:47:23', 68, '43537113', 'view', '{}', NULL, '2025-09-19 22:47:23'),
(246, '2025-09-19 22:48:01', '2025-09-19 22:48:01', 67, '43537113', 'view', '{}', NULL, '2025-09-19 22:48:01'),
(247, '2025-09-19 22:48:01', '2025-09-19 22:48:01', 68, '43537113', 'view', '{}', NULL, '2025-09-19 22:48:01'),
(248, '2025-09-19 22:48:01', '2025-09-19 22:48:01', 54, '43537113', 'view', '{}', NULL, '2025-09-19 22:48:01'),
(249, '2025-09-19 22:53:32', '2025-09-19 22:53:32', 54, '43537113', 'view', '{}', NULL, '2025-09-19 22:53:32'),
(250, '2025-09-19 22:53:33', '2025-09-19 22:53:33', 68, '43537113', 'view', '{}', NULL, '2025-09-19 22:53:33'),
(251, '2025-09-19 22:53:33', '2025-09-19 22:53:33', 67, '43537113', 'view', '{}', NULL, '2025-09-19 22:53:33'),
(252, '2025-09-19 22:53:34', '2025-09-19 22:53:34', 66, '43537113', 'view', '{}', NULL, '2025-09-19 22:53:34'),
(253, '2025-09-19 22:53:35', '2025-09-19 22:53:35', 66, '43537113', 'click', '{\"elementClicked\":\"comment\"}', NULL, '2025-09-19 22:53:35'),
(254, '2025-09-19 22:53:37', '2025-09-19 22:53:37', 67, '43537113', 'view', '{}', NULL, '2025-09-19 22:53:37'),
(255, '2025-09-19 22:54:26', '2025-09-19 22:54:26', 54, '43537113', 'view', '{}', NULL, '2025-09-19 22:54:26'),
(256, '2025-09-19 22:54:33', '2025-09-19 22:54:33', 54, '43537113', 'view', '{}', NULL, '2025-09-19 22:54:33'),
(257, '2025-09-19 22:54:35', '2025-09-19 22:54:35', 54, '43537113', 'view', '{}', NULL, '2025-09-19 22:54:35'),
(258, '2025-09-19 22:54:37', '2025-09-19 22:54:37', 54, '43537113', 'view', '{}', NULL, '2025-09-19 22:54:37'),
(259, '2025-09-20 08:35:02', '2025-09-20 08:35:02', 54, '43537113', 'view', '{}', NULL, '2025-09-20 08:35:02'),
(260, '2025-09-20 08:35:02', '2025-09-20 08:35:02', 68, '43537113', 'view', '{}', NULL, '2025-09-20 08:35:02'),
(261, '2025-09-20 08:35:07', '2025-09-20 08:35:07', 54, '43537113', 'view', '{}', NULL, '2025-09-20 08:35:07'),
(262, '2025-09-20 08:35:08', '2025-09-20 08:35:08', 54, '43537113', 'view', '{}', NULL, '2025-09-20 08:35:08'),
(263, '2025-09-20 08:35:12', '2025-09-20 08:35:12', 68, '43537113', 'view', '{}', NULL, '2025-09-20 08:35:12'),
(264, '2025-09-20 08:35:13', '2025-09-20 08:35:13', 68, '43537113', 'view', '{}', NULL, '2025-09-20 08:35:13'),
(265, '2025-09-20 08:35:13', '2025-09-20 08:35:13', 68, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-20 08:35:13'),
(266, '2025-09-20 08:35:21', '2025-09-20 08:35:21', 67, '43537113', 'view', '{}', NULL, '2025-09-20 08:35:21'),
(267, '2025-09-20 08:35:21', '2025-09-20 08:35:21', 68, '43537113', 'view', '{}', NULL, '2025-09-20 08:35:21'),
(268, '2025-09-20 08:35:22', '2025-09-20 08:35:22', 54, '43537113', 'view', '{}', NULL, '2025-09-20 08:35:22'),
(269, '2025-09-20 08:35:26', '2025-09-20 08:35:26', 67, '43537113', 'view', '{}', NULL, '2025-09-20 08:35:26'),
(270, '2025-09-20 08:35:27', '2025-09-20 08:35:27', 68, '43537113', 'view', '{}', NULL, '2025-09-20 08:35:27'),
(271, '2025-09-20 09:57:46', '2025-09-20 09:57:46', 67, '43537113', 'view', '{}', NULL, '2025-09-20 09:57:46'),
(272, '2025-09-20 09:57:46', '2025-09-20 09:57:46', 68, '43537113', 'view', '{}', NULL, '2025-09-20 09:57:46'),
(273, '2025-09-20 09:57:48', '2025-09-20 09:57:48', 69, '43537113', 'view', '{}', NULL, '2025-09-20 09:57:48'),
(274, '2025-09-20 09:57:49', '2025-09-20 09:57:49', 54, '43537113', 'view', '{}', NULL, '2025-09-20 09:57:49'),
(275, '2025-09-21 20:18:37', '2025-09-21 20:18:37', 54, '43537113', 'view', '{}', NULL, '2025-09-21 20:18:37'),
(276, '2025-09-21 20:18:37', '2025-09-21 20:18:37', 69, '43537113', 'view', '{}', NULL, '2025-09-21 20:18:37'),
(277, '2025-09-21 20:18:37', '2025-09-21 20:18:37', 54, '43537113', 'view', '{}', NULL, '2025-09-21 20:18:37'),
(278, '2025-09-21 20:18:38', '2025-09-21 20:18:38', 54, '43537113', 'view', '{}', NULL, '2025-09-21 20:18:38'),
(279, '2025-09-21 20:18:38', '2025-09-21 20:18:38', 54, '43537113', 'view', '{}', NULL, '2025-09-21 20:18:38'),
(280, '2025-09-21 20:18:39', '2025-09-21 20:18:39', 54, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-21 20:18:39'),
(281, '2025-09-21 20:18:40', '2025-09-21 20:18:40', 69, '43537113', 'view', '{}', NULL, '2025-09-21 20:18:40'),
(282, '2025-09-21 20:18:42', '2025-09-21 20:18:42', 69, '43537113', 'view', '{}', NULL, '2025-09-21 20:18:42'),
(283, '2025-09-21 20:18:43', '2025-09-21 20:18:43', 69, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-21 20:18:43'),
(284, '2025-09-21 20:18:44', '2025-09-21 20:18:44', 68, '43537113', 'view', '{}', NULL, '2025-09-21 20:18:44'),
(285, '2025-09-21 20:18:58', '2025-09-21 20:18:58', 68, '43537113', 'view', '{}', NULL, '2025-09-21 20:18:58'),
(286, '2025-09-21 20:18:59', '2025-09-21 20:18:59', 68, '43537113', 'view', '{}', NULL, '2025-09-21 20:18:59'),
(287, '2025-09-21 20:18:59', '2025-09-21 20:18:59', 67, '43537113', 'view', '{}', NULL, '2025-09-21 20:18:59'),
(288, '2025-09-21 20:18:59', '2025-09-21 20:18:59', 66, '43537113', 'view', '{}', NULL, '2025-09-21 20:18:59'),
(289, '2025-09-21 20:19:00', '2025-09-21 20:19:00', 66, '43537113', 'view', '{}', NULL, '2025-09-21 20:19:00'),
(290, '2025-09-21 20:19:00', '2025-09-21 20:19:00', 67, '43537113', 'view', '{}', NULL, '2025-09-21 20:19:00'),
(291, '2025-09-21 20:19:00', '2025-09-21 20:19:00', 68, '43537113', 'view', '{}', NULL, '2025-09-21 20:19:00'),
(292, '2025-09-21 20:19:01', '2025-09-21 20:19:01', 68, '43537113', 'view', '{}', NULL, '2025-09-21 20:19:01'),
(293, '2025-09-21 20:19:01', '2025-09-21 20:19:01', 68, '43537113', 'view', '{}', NULL, '2025-09-21 20:19:01'),
(294, '2025-09-21 20:19:02', '2025-09-21 20:19:02', 68, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-21 20:19:02'),
(295, '2025-09-21 20:19:03', '2025-09-21 20:19:03', 68, '43537113', 'view', '{}', NULL, '2025-09-21 20:19:03'),
(296, '2025-09-21 20:19:38', '2025-09-21 20:19:38', 68, '43537113', 'view', '{}', NULL, '2025-09-21 20:19:38'),
(297, '2025-09-21 20:20:07', '2025-09-21 20:20:07', 67, '43537113', 'view', '{}', NULL, '2025-09-21 20:20:07'),
(298, '2025-09-21 20:20:07', '2025-09-21 20:20:07', 68, '43537113', 'view', '{}', NULL, '2025-09-21 20:20:07'),
(299, '2025-09-21 20:20:33', '2025-09-21 20:20:33', 68, '43537113', 'view', '{}', NULL, '2025-09-21 20:20:33'),
(300, '2025-09-21 20:20:44', '2025-09-21 20:20:44', 66, '43537113', 'view', '{}', NULL, '2025-09-21 20:20:44'),
(301, '2025-09-21 20:20:44', '2025-09-21 20:20:44', 67, '43537113', 'view', '{}', NULL, '2025-09-21 20:20:44'),
(302, '2025-09-21 20:20:44', '2025-09-21 20:20:44', 68, '43537113', 'view', '{}', NULL, '2025-09-21 20:20:44'),
(303, '2025-09-21 20:21:20', '2025-09-21 20:21:20', 68, '43537113', 'view', '{}', NULL, '2025-09-21 20:21:20'),
(304, '2025-09-21 20:21:26', '2025-09-21 20:21:26', 68, '43537113', 'view', '{}', NULL, '2025-09-21 20:21:26'),
(305, '2025-09-21 20:31:40', '2025-09-21 20:31:40', 68, '43537113', 'view', '{}', NULL, '2025-09-21 20:31:40'),
(306, '2025-09-21 20:31:43', '2025-09-21 20:31:43', 68, '43537113', 'view', '{}', NULL, '2025-09-21 20:31:43'),
(307, '2025-09-21 20:31:44', '2025-09-21 20:31:44', 68, '43537113', 'view', '{}', NULL, '2025-09-21 20:31:44'),
(308, '2025-09-21 20:31:45', '2025-09-21 20:31:45', 70, '43537113', 'view', '{}', NULL, '2025-09-21 20:31:45'),
(309, '2025-09-21 20:31:45', '2025-09-21 20:31:45', 68, '43537113', 'view', '{}', NULL, '2025-09-21 20:31:45'),
(310, '2025-09-21 20:31:45', '2025-09-21 20:31:45', 70, '43537113', 'view', '{}', NULL, '2025-09-21 20:31:45'),
(311, '2025-09-21 20:31:58', '2025-09-21 20:31:58', 68, '43537113', 'view', '{}', NULL, '2025-09-21 20:31:58'),
(312, '2025-09-21 20:31:58', '2025-09-21 20:31:58', 70, '43537113', 'view', '{}', NULL, '2025-09-21 20:31:58'),
(313, '2025-09-21 20:32:00', '2025-09-21 20:32:00', 71, '43537113', 'view', '{}', NULL, '2025-09-21 20:32:00'),
(314, '2025-09-21 20:32:00', '2025-09-21 20:32:00', 70, '43537113', 'view', '{}', NULL, '2025-09-21 20:32:00'),
(315, '2025-09-21 20:32:01', '2025-09-21 20:32:01', 68, '43537113', 'view', '{}', NULL, '2025-09-21 20:32:01'),
(316, '2025-09-21 20:32:02', '2025-09-21 20:32:02', 70, '43537113', 'view', '{}', NULL, '2025-09-21 20:32:02'),
(317, '2025-09-21 20:32:28', '2025-09-21 20:32:28', 71, '44187263', 'view', '{}', NULL, '2025-09-21 20:32:28'),
(318, '2025-09-21 20:32:28', '2025-09-21 20:32:28', 70, '44187263', 'view', '{}', NULL, '2025-09-21 20:32:28'),
(319, '2025-09-21 20:32:29', '2025-09-21 20:32:29', 68, '44187263', 'view', '{}', NULL, '2025-09-21 20:32:29'),
(320, '2025-09-21 20:32:31', '2025-09-21 20:32:31', 68, '43537113', 'view', '{}', NULL, '2025-09-21 20:32:31'),
(321, '2025-09-21 20:32:33', '2025-09-21 20:32:33', 68, '44187263', 'view', '{}', NULL, '2025-09-21 20:32:33'),
(322, '2025-09-21 20:32:35', '2025-09-21 20:32:35', 70, '44187263', 'view', '{}', NULL, '2025-09-21 20:32:35'),
(323, '2025-09-21 20:32:36', '2025-09-21 20:32:36', 71, '44187263', 'view', '{}', NULL, '2025-09-21 20:32:36'),
(324, '2025-09-21 20:32:37', '2025-09-21 20:32:37', 70, '44187263', 'view', '{}', NULL, '2025-09-21 20:32:37'),
(325, '2025-09-21 20:32:37', '2025-09-21 20:32:37', 68, '44187263', 'view', '{}', NULL, '2025-09-21 20:32:37'),
(326, '2025-09-21 20:32:40', '2025-09-21 20:32:40', 68, '43537113', 'view', '{}', NULL, '2025-09-21 20:32:40'),
(327, '2025-09-21 20:32:40', '2025-09-21 20:32:40', 70, '43537113', 'view', '{}', NULL, '2025-09-21 20:32:40'),
(328, '2025-09-21 20:32:40', '2025-09-21 20:32:40', 71, '43537113', 'view', '{}', NULL, '2025-09-21 20:32:40'),
(329, '2025-09-21 20:32:41', '2025-09-21 20:32:41', 71, '43537113', 'view', '{}', NULL, '2025-09-21 20:32:41'),
(330, '2025-09-21 20:32:42', '2025-09-21 20:32:42', 71, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-21 20:32:42'),
(331, '2025-09-21 20:33:02', '2025-09-21 20:33:02', 70, '43537113', 'view', '{}', NULL, '2025-09-21 20:33:02'),
(332, '2025-09-21 20:33:03', '2025-09-21 20:33:03', 71, '43537113', 'view', '{}', NULL, '2025-09-21 20:33:03'),
(333, '2025-09-21 20:33:07', '2025-09-21 20:33:07', 72, '43537113', 'view', '{}', NULL, '2025-09-21 20:33:07'),
(334, '2025-09-21 20:33:08', '2025-09-21 20:33:08', 72, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-21 20:33:08'),
(335, '2025-09-21 20:33:08', '2025-09-21 20:33:08', 72, '43537113', 'view', '{}', NULL, '2025-09-21 20:33:08'),
(336, '2025-09-21 20:33:09', '2025-09-21 20:33:09', 72, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-21 20:33:09'),
(337, '2025-09-21 20:33:10', '2025-09-21 20:33:10', 72, '43537113', 'view', '{}', NULL, '2025-09-21 20:33:10'),
(338, '2025-09-21 20:33:14', '2025-09-21 20:33:14', 71, '43537113', 'view', '{}', NULL, '2025-09-21 20:33:14'),
(339, '2025-09-21 20:33:15', '2025-09-21 20:33:15', 72, '43537113', 'view', '{}', NULL, '2025-09-21 20:33:15'),
(340, '2025-09-21 20:33:16', '2025-09-21 20:33:16', 72, '43537113', 'click', '{\"elementClicked\":\"comment\"}', NULL, '2025-09-21 20:33:16'),
(341, '2025-09-21 20:33:17', '2025-09-21 20:33:17', 72, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-21 20:33:17'),
(342, '2025-09-21 20:33:19', '2025-09-21 20:33:19', 72, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-21 20:33:19'),
(343, '2025-09-21 20:33:21', '2025-09-21 20:33:21', 71, '43537113', 'view', '{}', NULL, '2025-09-21 20:33:21'),
(344, '2025-09-21 20:33:21', '2025-09-21 20:33:21', 68, '43537113', 'view', '{}', NULL, '2025-09-21 20:33:21'),
(345, '2025-09-21 20:33:22', '2025-09-21 20:33:22', 67, '43537113', 'view', '{}', NULL, '2025-09-21 20:33:22'),
(346, '2025-09-21 20:33:22', '2025-09-21 20:33:22', 68, '43537113', 'view', '{}', NULL, '2025-09-21 20:33:22'),
(347, '2025-09-21 20:33:23', '2025-09-21 20:33:23', 68, '43537113', 'click', '{\"elementClicked\":\"comment\"}', NULL, '2025-09-21 20:33:23'),
(348, '2025-09-21 20:33:25', '2025-09-21 20:33:25', 72, '43537113', 'view', '{}', NULL, '2025-09-21 20:33:25'),
(349, '2025-09-21 20:33:35', '2025-09-21 20:33:35', 72, '43537113', 'view', '{}', NULL, '2025-09-21 20:33:35'),
(350, '2025-09-21 20:33:36', '2025-09-21 20:33:36', 72, '43537113', 'view', '{}', NULL, '2025-09-21 20:33:36'),
(351, '2025-09-21 20:33:36', '2025-09-21 20:33:36', 72, '43537113', 'view', '{}', NULL, '2025-09-21 20:33:36'),
(352, '2025-09-21 20:33:37', '2025-09-21 20:33:37', 72, '43537113', 'view', '{}', NULL, '2025-09-21 20:33:37'),
(353, '2025-09-21 20:33:39', '2025-09-21 20:33:39', 72, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-21 20:33:39'),
(354, '2025-09-21 20:33:40', '2025-09-21 20:33:40', 72, '43537113', 'view', '{}', NULL, '2025-09-21 20:33:40'),
(355, '2025-09-21 20:34:59', '2025-09-21 20:34:59', 72, '43537113', 'view', '{}', NULL, '2025-09-21 20:34:59'),
(356, '2025-09-21 20:35:44', '2025-09-21 20:35:44', 72, '43537113', 'view', '{}', NULL, '2025-09-21 20:35:44'),
(357, '2025-09-21 20:35:44', '2025-09-21 20:35:44', 72, '43537113', 'view', '{}', NULL, '2025-09-21 20:35:44'),
(358, '2025-09-21 20:35:45', '2025-09-21 20:35:45', 72, '43537113', 'view', '{}', NULL, '2025-09-21 20:35:45'),
(359, '2025-09-21 20:35:45', '2025-09-21 20:35:45', 72, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-21 20:35:45'),
(360, '2025-09-21 20:35:45', '2025-09-21 20:35:45', 72, '43537113', 'view', '{}', NULL, '2025-09-21 20:35:45'),
(361, '2025-09-21 20:38:15', '2025-09-21 20:38:15', 72, '43537113', 'view', '{}', NULL, '2025-09-21 20:38:15'),
(362, '2025-09-21 20:38:15', '2025-09-21 20:38:15', 72, '43537113', 'view', '{}', NULL, '2025-09-21 20:38:15'),
(363, '2025-09-21 20:38:16', '2025-09-21 20:38:16', 72, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-21 20:38:16'),
(364, '2025-09-21 20:38:16', '2025-09-21 20:38:16', 72, '43537113', 'view', '{}', NULL, '2025-09-21 20:38:16'),
(365, '2025-09-21 20:38:19', '2025-09-21 20:38:19', 71, '43537113', 'view', '{}', NULL, '2025-09-21 20:38:19'),
(366, '2025-09-21 20:38:21', '2025-09-21 20:38:21', 72, '43537113', 'view', '{}', NULL, '2025-09-21 20:38:21'),
(367, '2025-09-21 20:38:23', '2025-09-21 20:38:23', 71, '43537113', 'view', '{}', NULL, '2025-09-21 20:38:23'),
(368, '2025-09-21 20:38:24', '2025-09-21 20:38:24', 71, '43537113', 'view', '{}', NULL, '2025-09-21 20:38:24'),
(369, '2025-09-21 20:38:24', '2025-09-21 20:38:24', 72, '43537113', 'view', '{}', NULL, '2025-09-21 20:38:24'),
(370, '2025-09-21 20:39:20', '2025-09-21 20:39:20', 72, '43537113', 'view', '{}', NULL, '2025-09-21 20:39:20'),
(371, '2025-09-21 20:39:25', '2025-09-21 20:39:25', 72, '43537113', 'view', '{}', NULL, '2025-09-21 20:39:25'),
(372, '2025-09-21 20:39:34', '2025-09-21 20:39:34', 72, '43537113', 'view', '{}', NULL, '2025-09-21 20:39:34'),
(373, '2025-09-21 20:39:35', '2025-09-21 20:39:35', 72, '43537113', 'view', '{}', NULL, '2025-09-21 20:39:35'),
(374, '2025-09-21 20:39:42', '2025-09-21 20:39:42', 72, '43537113', 'view', '{}', NULL, '2025-09-21 20:39:42'),
(375, '2025-09-21 20:39:43', '2025-09-21 20:39:43', 72, '43537113', 'view', '{}', NULL, '2025-09-21 20:39:43'),
(376, '2025-09-21 20:39:43', '2025-09-21 20:39:43', 72, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-21 20:39:43'),
(377, '2025-09-21 20:43:00', '2025-09-21 20:43:00', 71, '43537113', 'view', '{}', NULL, '2025-09-21 20:43:00'),
(378, '2025-09-21 20:43:00', '2025-09-21 20:43:00', 72, '43537113', 'view', '{}', NULL, '2025-09-21 20:43:00'),
(379, '2025-09-21 20:44:35', '2025-09-21 20:44:35', 72, '43537113', 'view', '{}', NULL, '2025-09-21 20:44:35'),
(380, '2025-09-21 20:44:40', '2025-09-21 20:44:40', 72, '43537113', 'view', '{}', NULL, '2025-09-21 20:44:40'),
(381, '2025-09-21 20:44:40', '2025-09-21 20:44:40', 71, '43537113', 'view', '{}', NULL, '2025-09-21 20:44:40'),
(382, '2025-09-21 20:45:13', '2025-09-21 20:45:13', 72, '43537113', 'view', '{}', NULL, '2025-09-21 20:45:13'),
(383, '2025-09-21 20:50:00', '2025-09-21 20:50:00', 72, '43537113', 'view', '{}', NULL, '2025-09-21 20:50:00'),
(384, '2025-09-21 20:50:20', '2025-09-21 20:50:20', 72, '43537113', 'view', '{}', NULL, '2025-09-21 20:50:20'),
(385, '2025-09-21 20:50:58', '2025-09-21 20:50:58', 72, '43537113', 'view', '{}', NULL, '2025-09-21 20:50:58'),
(386, '2025-09-21 21:02:42', '2025-09-21 21:02:42', 72, '43537113', 'view', '{}', NULL, '2025-09-21 21:02:42'),
(387, '2025-09-21 21:02:43', '2025-09-21 21:02:43', 72, '43537113', 'view', '{}', NULL, '2025-09-21 21:02:43'),
(388, '2025-09-21 21:02:44', '2025-09-21 21:02:44', 72, '43537113', 'view', '{}', NULL, '2025-09-21 21:02:44'),
(389, '2025-09-21 21:02:44', '2025-09-21 21:02:44', 72, '43537113', 'view', '{}', NULL, '2025-09-21 21:02:44'),
(390, '2025-09-21 21:02:45', '2025-09-21 21:02:45', 72, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-21 21:02:45'),
(391, '2025-09-21 21:02:45', '2025-09-21 21:02:45', 72, '43537113', 'view', '{}', NULL, '2025-09-21 21:02:45'),
(392, '2025-09-21 21:02:45', '2025-09-21 21:02:45', 72, '43537113', 'view', '{}', NULL, '2025-09-21 21:02:45'),
(393, '2025-09-21 21:02:49', '2025-09-21 21:02:49', 72, '43537113', 'view', '{}', NULL, '2025-09-21 21:02:49'),
(394, '2025-09-21 21:02:50', '2025-09-21 21:02:50', 72, '43537113', 'view', '{}', NULL, '2025-09-21 21:02:50'),
(395, '2025-09-21 21:02:51', '2025-09-21 21:02:51', 72, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-21 21:02:51'),
(396, '2025-09-21 21:02:51', '2025-09-21 21:02:51', 72, '43537113', 'view', '{}', NULL, '2025-09-21 21:02:51'),
(397, '2025-09-21 21:02:57', '2025-09-21 21:02:57', 71, '43537113', 'view', '{}', NULL, '2025-09-21 21:02:57'),
(398, '2025-09-21 21:02:58', '2025-09-21 21:02:58', 72, '43537113', 'view', '{}', NULL, '2025-09-21 21:02:58'),
(399, '2025-09-21 21:03:00', '2025-09-21 21:03:00', 72, '43537113', 'view', '{}', NULL, '2025-09-21 21:03:00'),
(400, '2025-09-21 21:03:01', '2025-09-21 21:03:01', 72, '43537113', 'view', '{}', NULL, '2025-09-21 21:03:01'),
(401, '2025-09-21 21:03:02', '2025-09-21 21:03:02', 72, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-21 21:03:02'),
(402, '2025-09-21 21:03:02', '2025-09-21 21:03:02', 72, '43537113', 'view', '{}', NULL, '2025-09-21 21:03:02'),
(403, '2025-09-21 21:03:35', '2025-09-21 21:03:35', 72, '43537113', 'view', '{}', NULL, '2025-09-21 21:03:35'),
(404, '2025-09-21 21:03:37', '2025-09-21 21:03:37', 72, '43537113', 'view', '{}', NULL, '2025-09-21 21:03:37'),
(405, '2025-09-21 21:03:39', '2025-09-21 21:03:39', 72, '43537113', 'view', '{}', NULL, '2025-09-21 21:03:39'),
(406, '2025-09-21 21:03:39', '2025-09-21 21:03:39', 72, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-21 21:03:39'),
(407, '2025-09-21 21:03:40', '2025-09-21 21:03:40', 72, '43537113', 'view', '{}', NULL, '2025-09-21 21:03:40'),
(408, '2025-09-21 21:03:41', '2025-09-21 21:03:41', 72, '43537113', 'view', '{}', NULL, '2025-09-21 21:03:41'),
(409, '2025-09-21 21:03:42', '2025-09-21 21:03:42', 72, '43537113', 'view', '{}', NULL, '2025-09-21 21:03:42'),
(410, '2025-09-21 21:03:42', '2025-09-21 21:03:42', 72, '43537113', 'view', '{}', NULL, '2025-09-21 21:03:42'),
(411, '2025-09-21 21:03:45', '2025-09-21 21:03:45', 72, '43537113', 'view', '{}', NULL, '2025-09-21 21:03:45'),
(412, '2025-09-21 21:03:45', '2025-09-21 21:03:45', 71, '43537113', 'view', '{}', NULL, '2025-09-21 21:03:45'),
(413, '2025-09-21 21:03:45', '2025-09-21 21:03:45', 70, '43537113', 'view', '{}', NULL, '2025-09-21 21:03:45'),
(414, '2025-09-21 21:03:47', '2025-09-21 21:03:47', 71, '43537113', 'view', '{}', NULL, '2025-09-21 21:03:47'),
(415, '2025-09-21 21:03:50', '2025-09-21 21:03:50', 71, '44187263', 'view', '{}', NULL, '2025-09-21 21:03:50'),
(416, '2025-09-21 21:03:54', '2025-09-21 21:03:54', 72, '43537113', 'view', '{}', NULL, '2025-09-21 21:03:54'),
(417, '2025-09-21 21:05:55', '2025-09-21 21:05:55', 72, '44187263', 'view', '{}', NULL, '2025-09-21 21:05:55'),
(418, '2025-09-21 21:23:33', '2025-09-21 21:23:33', 72, '43537113', 'view', '{}', NULL, '2025-09-21 21:23:33'),
(419, '2025-09-21 21:23:33', '2025-09-21 21:23:33', 71, '43537113', 'view', '{}', NULL, '2025-09-21 21:23:33'),
(420, '2025-09-21 21:23:33', '2025-09-21 21:23:33', 70, '43537113', 'view', '{}', NULL, '2025-09-21 21:23:33'),
(421, '2025-09-21 21:23:34', '2025-09-21 21:23:34', 70, '43537113', 'view', '{}', NULL, '2025-09-21 21:23:34'),
(422, '2025-09-21 21:23:36', '2025-09-21 21:23:36', 72, '44187263', 'view', '{}', NULL, '2025-09-21 21:23:36'),
(423, '2025-09-21 21:23:36', '2025-09-21 21:23:36', 72, '44187263', 'view', '{}', NULL, '2025-09-21 21:23:36'),
(424, '2025-09-21 21:23:39', '2025-09-21 21:23:39', 72, '43537113', 'view', '{}', NULL, '2025-09-21 21:23:39'),
(425, '2025-09-21 21:23:40', '2025-09-21 21:23:40', 70, '44187263', 'view', '{}', NULL, '2025-09-21 21:23:40'),
(426, '2025-09-21 21:23:40', '2025-09-21 21:23:40', 72, '44187263', 'view', '{}', NULL, '2025-09-21 21:23:40'),
(427, '2025-09-21 21:23:44', '2025-09-21 21:23:44', 70, '44187263', 'view', '{}', NULL, '2025-09-21 21:23:44'),
(428, '2025-09-21 21:23:44', '2025-09-21 21:23:44', 71, '43537113', 'view', '{}', NULL, '2025-09-21 21:23:44'),
(429, '2025-09-21 21:23:45', '2025-09-21 21:23:45', 71, '43537113', 'view', '{}', NULL, '2025-09-21 21:23:45'),
(430, '2025-09-21 21:23:45', '2025-09-21 21:23:45', 71, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-21 21:23:45'),
(431, '2025-09-21 21:23:46', '2025-09-21 21:23:46', 71, '43537113', 'view', '{}', NULL, '2025-09-21 21:23:46'),
(432, '2025-09-21 21:24:08', '2025-09-21 21:24:08', 68, '44187263', 'view', '{}', NULL, '2025-09-21 21:24:08'),
(433, '2025-09-21 21:24:17', '2025-09-21 21:24:17', 72, '43537113', 'view', '{}', NULL, '2025-09-21 21:24:17'),
(434, '2025-09-21 21:24:17', '2025-09-21 21:24:17', 72, '44187263', 'view', '{}', NULL, '2025-09-21 21:24:17'),
(435, '2025-09-21 21:24:19', '2025-09-21 21:24:19', 70, '44187263', 'view', '{}', NULL, '2025-09-21 21:24:19'),
(436, '2025-09-21 21:24:19', '2025-09-21 21:24:19', 71, '43537113', 'view', '{}', NULL, '2025-09-21 21:24:19'),
(437, '2025-09-21 21:24:20', '2025-09-21 21:24:20', 71, '43537113', 'view', '{}', NULL, '2025-09-21 21:24:20'),
(438, '2025-09-21 21:24:20', '2025-09-21 21:24:20', 72, '43537113', 'view', '{}', NULL, '2025-09-21 21:24:20'),
(439, '2025-09-21 21:24:44', '2025-09-21 21:24:44', 72, '44187263', 'view', '{}', NULL, '2025-09-21 21:24:44'),
(440, '2025-09-21 21:24:46', '2025-09-21 21:24:46', 72, '44187263', 'view', '{}', NULL, '2025-09-21 21:24:46'),
(441, '2025-09-21 21:25:00', '2025-09-21 21:25:00', 72, '44187263', 'view', '{}', NULL, '2025-09-21 21:25:00'),
(442, '2025-09-21 21:25:11', '2025-09-21 21:25:11', 72, '44187263', 'view', '{}', NULL, '2025-09-21 21:25:11'),
(443, '2025-09-21 21:25:12', '2025-09-21 21:25:12', 72, '44187263', 'view', '{}', NULL, '2025-09-21 21:25:12'),
(444, '2025-09-21 21:25:43', '2025-09-21 21:25:43', 72, '44187263', 'view', '{}', NULL, '2025-09-21 21:25:43'),
(445, '2025-09-21 21:25:44', '2025-09-21 21:25:44', 72, '43537113', 'view', '{}', NULL, '2025-09-21 21:25:44'),
(446, '2025-09-21 21:25:48', '2025-09-21 21:25:48', 72, '43537113', 'view', '{}', NULL, '2025-09-21 21:25:48'),
(447, '2025-09-21 21:25:49', '2025-09-21 21:25:49', 71, '43537113', 'view', '{}', NULL, '2025-09-21 21:25:49'),
(448, '2025-09-21 21:25:51', '2025-09-21 21:25:51', 72, '44187263', 'view', '{}', NULL, '2025-09-21 21:25:51'),
(449, '2025-09-21 21:26:24', '2025-09-21 21:26:24', 72, '44187263', 'view', '{}', NULL, '2025-09-21 21:26:24'),
(450, '2025-09-21 21:26:30', '2025-09-21 21:26:30', 72, '44187263', 'view', '{}', NULL, '2025-09-21 21:26:30'),
(451, '2025-09-21 21:26:32', '2025-09-21 21:26:32', 72, '44187263', 'view', '{}', NULL, '2025-09-21 21:26:32'),
(452, '2025-09-21 21:26:32', '2025-09-21 21:26:32', 72, '44187263', 'view', '{}', NULL, '2025-09-21 21:26:32'),
(453, '2025-09-21 21:26:39', '2025-09-21 21:26:39', 72, '44187263', 'view', '{}', NULL, '2025-09-21 21:26:39'),
(454, '2025-09-21 21:26:42', '2025-09-21 21:26:42', 72, '44187263', 'view', '{}', NULL, '2025-09-21 21:26:42'),
(455, '2025-09-21 21:27:20', '2025-09-21 21:27:20', 72, '44187263', 'view', '{}', NULL, '2025-09-21 21:27:20'),
(456, '2025-09-21 21:27:21', '2025-09-21 21:27:21', 72, '44187263', 'view', '{}', NULL, '2025-09-21 21:27:21'),
(457, '2025-09-21 21:27:21', '2025-09-21 21:27:21', 71, '44187263', 'view', '{}', NULL, '2025-09-21 21:27:21'),
(458, '2025-09-21 21:27:26', '2025-09-21 21:27:26', 72, '44187263', 'view', '{}', NULL, '2025-09-21 21:27:26'),
(459, '2025-09-21 21:27:53', '2025-09-21 21:27:53', 70, '44187263', 'view', '{}', NULL, '2025-09-21 21:27:53');
INSERT INTO `announcement_analytics` (`id`, `created_at`, `updated_at`, `announcement_id`, `user_id`, `event_type`, `event_data`, `session_id`, `timestamp`) VALUES
(460, '2025-09-21 21:27:53', '2025-09-21 21:27:53', 72, '44187263', 'view', '{}', NULL, '2025-09-21 21:27:53'),
(461, '2025-09-21 21:27:55', '2025-09-21 21:27:55', 72, '44187263', 'view', '{}', NULL, '2025-09-21 21:27:55'),
(462, '2025-09-21 21:27:55', '2025-09-21 21:27:55', 70, '44187263', 'view', '{}', NULL, '2025-09-21 21:27:55'),
(463, '2025-09-21 21:27:56', '2025-09-21 21:27:56', 68, '44187263', 'view', '{}', NULL, '2025-09-21 21:27:56'),
(464, '2025-09-21 21:28:01', '2025-09-21 21:28:01', 67, '44187263', 'view', '{}', NULL, '2025-09-21 21:28:01'),
(465, '2025-09-21 21:28:04', '2025-09-21 21:28:04', 67, '44187263', 'view', '{}', NULL, '2025-09-21 21:28:04'),
(466, '2025-09-21 21:28:05', '2025-09-21 21:28:05', 68, '44187263', 'view', '{}', NULL, '2025-09-21 21:28:05'),
(467, '2025-09-21 21:28:05', '2025-09-21 21:28:05', 70, '44187263', 'view', '{}', NULL, '2025-09-21 21:28:05'),
(468, '2025-09-21 21:28:05', '2025-09-21 21:28:05', 72, '44187263', 'view', '{}', NULL, '2025-09-21 21:28:05'),
(469, '2025-09-21 21:28:06', '2025-09-21 21:28:06', 72, '44187263', 'view', '{}', NULL, '2025-09-21 21:28:06'),
(470, '2025-09-21 21:28:06', '2025-09-21 21:28:06', 70, '44187263', 'view', '{}', NULL, '2025-09-21 21:28:06'),
(471, '2025-09-21 21:28:08', '2025-09-21 21:28:08', 72, '44187263', 'view', '{}', NULL, '2025-09-21 21:28:08'),
(472, '2025-09-21 21:28:08', '2025-09-21 21:28:08', 70, '44187263', 'view', '{}', NULL, '2025-09-21 21:28:08'),
(473, '2025-09-21 21:28:09', '2025-09-21 21:28:09', 68, '44187263', 'view', '{}', NULL, '2025-09-21 21:28:09'),
(474, '2025-09-21 21:28:19', '2025-09-21 21:28:19', 72, '44187263', 'view', '{}', NULL, '2025-09-21 21:28:19'),
(475, '2025-09-21 21:28:29', '2025-09-21 21:28:29', 72, '44187263', 'view', '{}', NULL, '2025-09-21 21:28:29'),
(476, '2025-09-21 21:29:06', '2025-09-21 21:29:06', 72, '44187263', 'view', '{}', NULL, '2025-09-21 21:29:06'),
(477, '2025-09-21 21:29:06', '2025-09-21 21:29:06', 71, '44187263', 'view', '{}', NULL, '2025-09-21 21:29:06'),
(478, '2025-09-21 21:29:13', '2025-09-21 21:29:13', 72, '43537113', 'view', '{}', NULL, '2025-09-21 21:29:13'),
(479, '2025-09-21 21:29:17', '2025-09-21 21:29:17', 70, '43537113', 'view', '{}', NULL, '2025-09-21 21:29:17'),
(480, '2025-09-21 21:29:17', '2025-09-21 21:29:17', 71, '43537113', 'view', '{}', NULL, '2025-09-21 21:29:17'),
(481, '2025-09-21 21:29:18', '2025-09-21 21:29:18', 72, '43537113', 'view', '{}', NULL, '2025-09-21 21:29:18'),
(482, '2025-09-21 21:29:27', '2025-09-21 21:29:27', 68, '43537113', 'view', '{}', NULL, '2025-09-21 21:29:27'),
(483, '2025-09-21 21:29:27', '2025-09-21 21:29:27', 71, '43537113', 'view', '{}', NULL, '2025-09-21 21:29:27'),
(484, '2025-09-21 21:29:27', '2025-09-21 21:29:27', 72, '43537113', 'view', '{}', NULL, '2025-09-21 21:29:27'),
(485, '2025-09-21 21:29:28', '2025-09-21 21:29:28', 73, '43537113', 'view', '{}', NULL, '2025-09-21 21:29:28'),
(486, '2025-09-21 21:29:38', '2025-09-21 21:29:38', 72, '43537113', 'view', '{}', NULL, '2025-09-21 21:29:38'),
(487, '2025-09-21 21:29:38', '2025-09-21 21:29:38', 73, '43537113', 'view', '{}', NULL, '2025-09-21 21:29:38'),
(488, '2025-09-21 21:29:38', '2025-09-21 21:29:38', 74, '43537113', 'view', '{}', NULL, '2025-09-21 21:29:38'),
(489, '2025-09-21 21:30:02', '2025-09-21 21:30:02', 71, '44187263', 'view', '{}', NULL, '2025-09-21 21:30:02'),
(490, '2025-09-21 21:30:02', '2025-09-21 21:30:02', 72, '44187263', 'view', '{}', NULL, '2025-09-21 21:30:02'),
(491, '2025-09-21 21:30:04', '2025-09-21 21:30:04', 74, '44187263', 'view', '{}', NULL, '2025-09-21 21:30:04'),
(492, '2025-09-21 21:30:06', '2025-09-21 21:30:06', 74, '43537113', 'view', '{}', NULL, '2025-09-21 21:30:06'),
(493, '2025-09-21 21:30:07', '2025-09-21 21:30:07', 74, '43537113', 'view', '{}', NULL, '2025-09-21 21:30:07'),
(494, '2025-09-21 21:30:08', '2025-09-21 21:30:08', 74, '43537113', 'view', '{}', NULL, '2025-09-21 21:30:08'),
(495, '2025-09-21 21:30:08', '2025-09-21 21:30:08', 74, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-21 21:30:08'),
(496, '2025-09-21 21:30:10', '2025-09-21 21:30:10', 74, '43537113', 'view', '{}', NULL, '2025-09-21 21:30:10'),
(497, '2025-09-21 21:30:31', '2025-09-21 21:30:31', 74, '43537113', 'view', '{}', NULL, '2025-09-21 21:30:31'),
(498, '2025-09-21 21:30:32', '2025-09-21 21:30:32', 74, '43537113', 'view', '{}', NULL, '2025-09-21 21:30:32'),
(499, '2025-09-21 21:30:33', '2025-09-21 21:30:33', 74, '43537113', 'view', '{}', NULL, '2025-09-21 21:30:33'),
(500, '2025-09-21 21:30:33', '2025-09-21 21:30:33', 74, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-21 21:30:33'),
(501, '2025-09-21 21:30:33', '2025-09-21 21:30:33', 74, '43537113', 'view', '{}', NULL, '2025-09-21 21:30:33'),
(502, '2025-09-21 21:30:38', '2025-09-21 21:30:38', 73, '44187263', 'view', '{}', NULL, '2025-09-21 21:30:38'),
(503, '2025-09-21 21:30:39', '2025-09-21 21:30:39', 74, '43537113', 'view', '{}', NULL, '2025-09-21 21:30:39'),
(504, '2025-09-21 21:30:40', '2025-09-21 21:30:40', 74, '43537113', 'view', '{}', NULL, '2025-09-21 21:30:40'),
(505, '2025-09-21 21:30:40', '2025-09-21 21:30:40', 74, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-21 21:30:40'),
(506, '2025-09-21 21:30:40', '2025-09-21 21:30:40', 74, '43537113', 'view', '{}', NULL, '2025-09-21 21:30:40'),
(507, '2025-09-21 21:30:51', '2025-09-21 21:30:51', 74, '43537113', 'view', '{}', NULL, '2025-09-21 21:30:51'),
(508, '2025-09-21 21:30:53', '2025-09-21 21:30:53', 74, '43537113', 'view', '{}', NULL, '2025-09-21 21:30:53'),
(509, '2025-09-21 21:30:53', '2025-09-21 21:30:53', 73, '43537113', 'view', '{}', NULL, '2025-09-21 21:30:53'),
(510, '2025-09-21 21:30:54', '2025-09-21 21:30:54', 73, '44187263', 'view', '{}', NULL, '2025-09-21 21:30:54'),
(511, '2025-09-22 12:02:08', '2025-09-22 12:02:08', 74, '43537113', 'view', '{}', NULL, '2025-09-22 12:02:08'),
(512, '2025-09-22 13:13:16', '2025-09-22 13:13:16', 72, '43537113', 'view', '{}', NULL, '2025-09-22 13:13:16'),
(513, '2025-09-22 13:13:17', '2025-09-22 13:13:17', 72, '43537113', 'view', '{}', NULL, '2025-09-22 13:13:17'),
(514, '2025-09-22 13:13:17', '2025-09-22 13:13:17', 73, '43537113', 'view', '{}', NULL, '2025-09-22 13:13:17'),
(515, '2025-09-22 13:13:17', '2025-09-22 13:13:17', 74, '43537113', 'view', '{}', NULL, '2025-09-22 13:13:17'),
(516, '2025-09-22 13:13:19', '2025-09-22 13:13:19', 74, '43537113', 'view', '{}', NULL, '2025-09-22 13:13:19'),
(517, '2025-09-22 13:13:19', '2025-09-22 13:13:19', 73, '43537113', 'view', '{}', NULL, '2025-09-22 13:13:19'),
(518, '2025-09-22 13:13:19', '2025-09-22 13:13:19', 71, '43537113', 'view', '{}', NULL, '2025-09-22 13:13:19'),
(519, '2025-09-22 13:13:19', '2025-09-22 13:13:19', 70, '43537113', 'view', '{}', NULL, '2025-09-22 13:13:19'),
(520, '2025-09-22 13:13:19', '2025-09-22 13:13:19', 67, '43537113', 'view', '{}', NULL, '2025-09-22 13:13:19'),
(521, '2025-09-22 13:13:22', '2025-09-22 13:13:22', 73, '43537113', 'view', '{}', NULL, '2025-09-22 13:13:22'),
(522, '2025-09-22 13:53:27', '2025-09-22 13:53:27', 74, '43537113', 'view', '{}', NULL, '2025-09-22 13:53:27'),
(523, '2025-09-22 13:53:53', '2025-09-22 13:53:53', 74, '43537113', 'view', '{}', NULL, '2025-09-22 13:53:53'),
(524, '2025-09-22 13:53:55', '2025-09-22 13:53:55', 74, '43537113', 'view', '{}', NULL, '2025-09-22 13:53:55'),
(525, '2025-09-22 13:53:55', '2025-09-22 13:53:55', 74, '43537113', 'view', '{}', NULL, '2025-09-22 13:53:55'),
(526, '2025-09-22 13:53:55', '2025-09-22 13:53:55', 74, '43537113', 'view', '{}', NULL, '2025-09-22 13:53:55'),
(527, '2025-09-22 13:53:56', '2025-09-22 13:53:56', 74, '43537113', 'view', '{}', NULL, '2025-09-22 13:53:56'),
(528, '2025-09-22 13:53:56', '2025-09-22 13:53:56', 74, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-22 13:53:56'),
(529, '2025-09-22 13:53:56', '2025-09-22 13:53:56', 74, '43537113', 'view', '{}', NULL, '2025-09-22 13:53:56'),
(530, '2025-09-22 14:06:50', '2025-09-22 14:06:50', 74, '43537113', 'view', '{}', NULL, '2025-09-22 14:06:50'),
(531, '2025-09-22 14:07:35', '2025-09-22 14:07:35', 74, '43537113', 'view', '{}', NULL, '2025-09-22 14:07:35'),
(532, '2025-09-22 14:07:38', '2025-09-22 14:07:38', 74, '43537113', 'view', '{}', NULL, '2025-09-22 14:07:38'),
(533, '2025-09-22 14:07:38', '2025-09-22 14:07:38', 73, '43537113', 'view', '{}', NULL, '2025-09-22 14:07:38'),
(534, '2025-09-22 14:08:38', '2025-09-22 14:08:38', 74, '43537113', 'view', '{}', NULL, '2025-09-22 14:08:38'),
(535, '2025-09-22 14:08:40', '2025-09-22 14:08:40', 73, '43537113', 'view', '{}', NULL, '2025-09-22 14:08:40'),
(536, '2025-09-22 14:08:41', '2025-09-22 14:08:41', 74, '43537113', 'view', '{}', NULL, '2025-09-22 14:08:41'),
(537, '2025-09-22 14:08:41', '2025-09-22 14:08:41', 74, '43537113', 'view', '{}', NULL, '2025-09-22 14:08:41'),
(538, '2025-09-22 14:08:42', '2025-09-22 14:08:42', 74, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-22 14:08:42'),
(539, '2025-09-22 14:15:09', '2025-09-22 14:15:09', 74, '43537113', 'view', '{}', NULL, '2025-09-22 14:15:09'),
(540, '2025-09-22 14:15:18', '2025-09-22 14:15:18', 72, '43537113', 'view', '{}', NULL, '2025-09-22 14:15:18'),
(541, '2025-09-22 14:18:56', '2025-09-22 14:18:56', 74, '44187263', 'view', '{}', NULL, '2025-09-22 14:18:56'),
(542, '2025-09-22 19:40:01', '2025-09-22 19:40:01', 74, '44187263', 'view', '{}', NULL, '2025-09-22 19:40:01'),
(543, '2025-09-23 12:44:49', '2025-09-23 12:44:49', 73, '43537113', 'view', '{}', NULL, '2025-09-23 12:44:49'),
(544, '2025-09-23 12:44:49', '2025-09-23 12:44:49', 74, '43537113', 'view', '{}', NULL, '2025-09-23 12:44:49'),
(545, '2025-09-23 12:44:49', '2025-09-23 12:44:49', 73, '43537113', 'view', '{}', NULL, '2025-09-23 12:44:49'),
(546, '2025-09-23 12:44:49', '2025-09-23 12:44:49', 72, '43537113', 'view', '{}', NULL, '2025-09-23 12:44:49'),
(547, '2025-09-23 12:44:49', '2025-09-23 12:44:49', 71, '43537113', 'view', '{}', NULL, '2025-09-23 12:44:49'),
(548, '2025-09-23 12:44:50', '2025-09-23 12:44:50', 73, '43537113', 'view', '{}', NULL, '2025-09-23 12:44:50'),
(549, '2025-09-23 12:44:50', '2025-09-23 12:44:50', 74, '43537113', 'view', '{}', NULL, '2025-09-23 12:44:50'),
(550, '2025-09-23 12:56:21', '2025-09-23 12:56:21', 74, '44187263', 'view', '{}', NULL, '2025-09-23 12:56:21'),
(551, '2025-09-23 12:56:21', '2025-09-23 12:56:21', 74, '44187263', 'view', '{}', NULL, '2025-09-23 12:56:21'),
(552, '2025-09-23 12:57:09', '2025-09-23 12:57:09', 74, '44187263', 'view', '{}', NULL, '2025-09-23 12:57:09'),
(553, '2025-09-23 20:02:50', '2025-09-23 20:02:50', 72, '44377090', 'view', '{}', NULL, '2025-09-23 20:02:50'),
(554, '2025-09-23 20:02:56', '2025-09-23 20:02:56', 72, '44377090', 'view', '{}', NULL, '2025-09-23 20:02:56'),
(555, '2025-09-23 20:03:19', '2025-09-23 20:03:19', 72, '44377090', 'view', '{}', NULL, '2025-09-23 20:03:19'),
(556, '2025-09-23 20:13:06', '2025-09-23 20:13:06', 72, '44377090', 'view', '{}', NULL, '2025-09-23 20:13:06'),
(557, '2025-09-23 20:13:07', '2025-09-23 20:13:07', 72, '44377090', 'view', '{}', NULL, '2025-09-23 20:13:07'),
(558, '2025-09-23 20:13:39', '2025-09-23 20:13:39', 72, '44377090', 'view', '{}', NULL, '2025-09-23 20:13:39'),
(559, '2025-09-23 20:13:40', '2025-09-23 20:13:40', 72, '44377090', 'view', '{}', NULL, '2025-09-23 20:13:40'),
(560, '2025-09-23 20:13:40', '2025-09-23 20:13:40', 70, '44377090', 'view', '{}', NULL, '2025-09-23 20:13:40'),
(561, '2025-09-23 20:13:40', '2025-09-23 20:13:40', 68, '44377090', 'view', '{}', NULL, '2025-09-23 20:13:40'),
(562, '2025-09-23 20:13:40', '2025-09-23 20:13:40', 67, '44377090', 'view', '{}', NULL, '2025-09-23 20:13:40'),
(563, '2025-09-23 20:13:42', '2025-09-23 20:13:42', 70, '44377090', 'view', '{}', NULL, '2025-09-23 20:13:42'),
(564, '2025-09-23 20:13:49', '2025-09-23 20:13:49', 74, '44187263', 'view', '{}', NULL, '2025-09-23 20:13:49'),
(565, '2025-09-23 20:13:55', '2025-09-23 20:13:55', 74, '44187263', 'view', '{}', NULL, '2025-09-23 20:13:55'),
(566, '2025-09-23 20:13:55', '2025-09-23 20:13:55', 73, '44187263', 'view', '{}', NULL, '2025-09-23 20:13:55'),
(567, '2025-09-23 20:13:55', '2025-09-23 20:13:55', 74, '44187263', 'view', '{}', NULL, '2025-09-23 20:13:55'),
(568, '2025-09-23 20:13:57', '2025-09-23 20:13:57', 72, '44377090', 'view', '{}', NULL, '2025-09-23 20:13:57'),
(569, '2025-09-23 20:13:59', '2025-09-23 20:13:59', 75, '44377090', 'view', '{}', NULL, '2025-09-23 20:13:59'),
(570, '2025-09-23 20:13:59', '2025-09-23 20:13:59', 75, '44187263', 'view', '{}', NULL, '2025-09-23 20:13:59'),
(571, '2025-09-23 20:13:59', '2025-09-23 20:13:59', 75, '44187263', 'view', '{}', NULL, '2025-09-23 20:13:59'),
(572, '2025-09-23 20:14:00', '2025-09-23 20:14:00', 75, '44187263', 'view', '{}', NULL, '2025-09-23 20:14:00'),
(573, '2025-09-23 20:14:02', '2025-09-23 20:14:02', 75, '44187263', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-23 20:14:02'),
(574, '2025-09-23 20:14:02', '2025-09-23 20:14:02', 75, '44187263', 'view', '{}', NULL, '2025-09-23 20:14:02'),
(575, '2025-09-23 20:14:03', '2025-09-23 20:14:03', 74, '44187263', 'view', '{}', NULL, '2025-09-23 20:14:03'),
(576, '2025-09-23 20:14:03', '2025-09-23 20:14:03', 75, '44187263', 'view', '{}', NULL, '2025-09-23 20:14:03'),
(577, '2025-09-23 20:14:05', '2025-09-23 20:14:05', 75, '44187263', 'view', '{}', NULL, '2025-09-23 20:14:05'),
(578, '2025-09-23 20:14:08', '2025-09-23 20:14:08', 75, '44187263', 'view', '{}', NULL, '2025-09-23 20:14:08'),
(579, '2025-09-23 20:14:10', '2025-09-23 20:14:10', 75, '44187263', 'view', '{}', NULL, '2025-09-23 20:14:10'),
(580, '2025-09-23 20:14:11', '2025-09-23 20:14:11', 75, '44187263', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-23 20:14:11'),
(581, '2025-09-23 20:14:12', '2025-09-23 20:14:12', 75, '44187263', 'view', '{}', NULL, '2025-09-23 20:14:12'),
(582, '2025-09-23 20:14:14', '2025-09-23 20:14:14', 75, '44187263', 'view', '{}', NULL, '2025-09-23 20:14:14'),
(583, '2025-09-23 20:14:17', '2025-09-23 20:14:17', 75, '44187263', 'view', '{}', NULL, '2025-09-23 20:14:17'),
(584, '2025-09-23 20:14:18', '2025-09-23 20:14:18', 75, '44187263', 'view', '{}', NULL, '2025-09-23 20:14:18'),
(585, '2025-09-23 20:14:18', '2025-09-23 20:14:18', 75, '44187263', 'view', '{}', NULL, '2025-09-23 20:14:18'),
(586, '2025-09-23 20:14:20', '2025-09-23 20:14:20', 75, '44187263', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-23 20:14:20'),
(587, '2025-09-23 20:14:26', '2025-09-23 20:14:26', 75, '44187263', 'view', '{}', NULL, '2025-09-23 20:14:26'),
(588, '2025-09-23 20:14:31', '2025-09-23 20:14:31', 75, '44187263', 'view', '{}', NULL, '2025-09-23 20:14:31'),
(589, '2025-09-23 20:14:31', '2025-09-23 20:14:31', 74, '44187263', 'view', '{}', NULL, '2025-09-23 20:14:31'),
(590, '2025-09-23 20:14:31', '2025-09-23 20:14:31', 73, '44187263', 'view', '{}', NULL, '2025-09-23 20:14:31'),
(591, '2025-09-23 20:14:32', '2025-09-23 20:14:32', 73, '44187263', 'view', '{}', NULL, '2025-09-23 20:14:32'),
(592, '2025-09-23 20:14:38', '2025-09-23 20:14:38', 72, '44377090', 'view', '{}', NULL, '2025-09-23 20:14:38'),
(593, '2025-09-23 20:14:39', '2025-09-23 20:14:39', 70, '44377090', 'view', '{}', NULL, '2025-09-23 20:14:39'),
(594, '2025-09-23 20:17:03', '2025-09-23 20:17:03', 72, '44377090', 'view', '{}', NULL, '2025-09-23 20:17:03'),
(595, '2025-09-23 20:17:03', '2025-09-23 20:17:03', 75, '44377090', 'view', '{}', NULL, '2025-09-23 20:17:03'),
(596, '2025-09-23 20:17:05', '2025-09-23 20:17:05', 75, '44377090', 'view', '{}', NULL, '2025-09-23 20:17:05'),
(597, '2025-09-23 20:27:47', '2025-09-23 20:27:47', 72, '44377090', 'view', '{}', NULL, '2025-09-23 20:27:47'),
(598, '2025-09-23 20:27:47', '2025-09-23 20:27:47', 70, '44377090', 'view', '{}', NULL, '2025-09-23 20:27:47'),
(599, '2025-09-23 20:27:47', '2025-09-23 20:27:47', 68, '44377090', 'view', '{}', NULL, '2025-09-23 20:27:47'),
(600, '2025-09-23 20:27:48', '2025-09-23 20:27:48', 70, '44377090', 'view', '{}', NULL, '2025-09-23 20:27:48'),
(601, '2025-09-23 20:27:52', '2025-09-23 20:27:52', 72, '44377090', 'view', '{}', NULL, '2025-09-23 20:27:52'),
(602, '2025-09-23 20:30:08', '2025-09-23 20:30:08', 72, '44377090', 'view', '{}', NULL, '2025-09-23 20:30:08'),
(603, '2025-09-23 20:51:01', '2025-09-23 20:51:01', 75, '44377090', 'view', '{}', NULL, '2025-09-23 20:51:01'),
(604, '2025-09-23 20:55:56', '2025-09-23 20:55:56', 75, '44377090', 'view', '{}', NULL, '2025-09-23 20:55:56'),
(605, '2025-09-23 20:55:59', '2025-09-23 20:55:59', 75, '44377090', 'view', '{}', NULL, '2025-09-23 20:55:59'),
(606, '2025-09-23 20:56:00', '2025-09-23 20:56:00', 75, '44377090', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-23 20:56:00'),
(607, '2025-09-23 20:56:01', '2025-09-23 20:56:01', 75, '44377090', 'view', '{}', NULL, '2025-09-23 20:56:01'),
(608, '2025-09-23 20:56:57', '2025-09-23 20:56:57', 75, '44377090', 'view', '{}', NULL, '2025-09-23 20:56:57'),
(609, '2025-09-23 20:56:59', '2025-09-23 20:56:59', 75, '44377090', 'view', '{}', NULL, '2025-09-23 20:56:59'),
(610, '2025-09-23 20:57:00', '2025-09-23 20:57:00', 75, '44377090', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-23 20:57:00'),
(611, '2025-09-23 20:57:02', '2025-09-23 20:57:02', 75, '44377090', 'view', '{}', NULL, '2025-09-23 20:57:02'),
(612, '2025-09-23 20:57:03', '2025-09-23 20:57:03', 72, '44377090', 'view', '{}', NULL, '2025-09-23 20:57:03'),
(613, '2025-09-23 20:57:06', '2025-09-23 20:57:06', 75, '44377090', 'view', '{}', NULL, '2025-09-23 20:57:06'),
(614, '2025-09-23 20:57:11', '2025-09-23 20:57:11', 75, '43537113', 'view', '{}', NULL, '2025-09-23 20:57:11'),
(615, '2025-09-23 20:57:13', '2025-09-23 20:57:13', 75, '43537113', 'view', '{}', NULL, '2025-09-23 20:57:13'),
(616, '2025-09-23 20:57:14', '2025-09-23 20:57:14', 75, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-23 20:57:14'),
(617, '2025-09-23 20:57:15', '2025-09-23 20:57:15', 74, '43537113', 'view', '{}', NULL, '2025-09-23 20:57:15'),
(618, '2025-09-23 20:57:38', '2025-09-23 20:57:38', 72, '44377090', 'view', '{}', NULL, '2025-09-23 20:57:38'),
(619, '2025-09-23 20:57:38', '2025-09-23 20:57:38', 76, '44377090', 'view', '{}', NULL, '2025-09-23 20:57:38'),
(620, '2025-09-23 20:57:39', '2025-09-23 20:57:39', 76, '44377090', 'view', '{}', NULL, '2025-09-23 20:57:39'),
(621, '2025-09-23 20:57:40', '2025-09-23 20:57:40', 76, '44377090', 'view', '{}', NULL, '2025-09-23 20:57:40'),
(622, '2025-09-23 20:57:40', '2025-09-23 20:57:40', 76, '44377090', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-23 20:57:40'),
(623, '2025-09-23 20:57:41', '2025-09-23 20:57:41', 72, '44377090', 'view', '{}', NULL, '2025-09-23 20:57:41'),
(624, '2025-09-23 20:57:49', '2025-09-23 20:57:49', 72, '44377090', 'view', '{}', NULL, '2025-09-23 20:57:49'),
(625, '2025-09-23 20:58:05', '2025-09-23 20:58:05', 74, '43537113', 'view', '{}', NULL, '2025-09-23 20:58:05'),
(626, '2025-09-23 21:00:13', '2025-09-23 21:00:13', 74, '43537113', 'view', '{}', NULL, '2025-09-23 21:00:13'),
(627, '2025-09-23 21:00:25', '2025-09-23 21:00:25', 74, '43537113', 'view', '{}', NULL, '2025-09-23 21:00:25'),
(628, '2025-09-23 21:00:25', '2025-09-23 21:00:25', 72, '44377090', 'view', '{}', NULL, '2025-09-23 21:00:25'),
(629, '2025-09-23 21:00:33', '2025-09-23 21:00:33', 72, '44377090', 'view', '{}', NULL, '2025-09-23 21:00:33'),
(630, '2025-09-23 21:00:34', '2025-09-23 21:00:34', 72, '44377090', 'view', '{}', NULL, '2025-09-23 21:00:34'),
(631, '2025-09-23 21:01:10', '2025-09-23 21:01:10', 74, '43537113', 'view', '{}', NULL, '2025-09-23 21:01:10'),
(632, '2025-09-23 21:01:23', '2025-09-23 21:01:23', 74, '43537113', 'view', '{}', NULL, '2025-09-23 21:01:23'),
(633, '2025-09-23 21:01:31', '2025-09-23 21:01:31', 72, '44377090', 'view', '{}', NULL, '2025-09-23 21:01:31'),
(634, '2025-09-23 21:01:36', '2025-09-23 21:01:36', 72, '44377090', 'view', '{}', NULL, '2025-09-23 21:01:36'),
(635, '2025-09-23 21:01:37', '2025-09-23 21:01:37', 72, '44377090', 'view', '{}', NULL, '2025-09-23 21:01:37'),
(636, '2025-09-23 21:01:40', '2025-09-23 21:01:40', 77, '43537113', 'view', '{}', NULL, '2025-09-23 21:01:40'),
(637, '2025-09-23 21:01:40', '2025-09-23 21:01:40', 74, '43537113', 'view', '{}', NULL, '2025-09-23 21:01:40'),
(638, '2025-09-23 21:01:41', '2025-09-23 21:01:41', 77, '43537113', 'view', '{}', NULL, '2025-09-23 21:01:41'),
(639, '2025-09-23 21:01:41', '2025-09-23 21:01:41', 77, '43537113', 'view', '{}', NULL, '2025-09-23 21:01:41'),
(640, '2025-09-23 21:01:42', '2025-09-23 21:01:42', 77, '43537113', 'view', '{}', NULL, '2025-09-23 21:01:42'),
(641, '2025-09-23 21:01:42', '2025-09-23 21:01:42', 77, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-23 21:01:42'),
(642, '2025-09-23 21:01:43', '2025-09-23 21:01:43', 74, '43537113', 'view', '{}', NULL, '2025-09-23 21:01:43'),
(643, '2025-09-23 21:01:55', '2025-09-23 21:01:55', 72, '44377090', 'view', '{}', NULL, '2025-09-23 21:01:55'),
(644, '2025-09-23 21:02:14', '2025-09-23 21:02:14', 74, '44187263', 'view', '{}', NULL, '2025-09-23 21:02:14'),
(645, '2025-09-23 21:02:23', '2025-09-23 21:02:23', 73, '44187263', 'view', '{}', NULL, '2025-09-23 21:02:23'),
(646, '2025-09-23 21:02:23', '2025-09-23 21:02:23', 72, '44187263', 'view', '{}', NULL, '2025-09-23 21:02:23'),
(647, '2025-09-23 21:02:23', '2025-09-23 21:02:23', 72, '44187263', 'view', '{}', NULL, '2025-09-23 21:02:23'),
(648, '2025-09-23 21:02:24', '2025-09-23 21:02:24', 74, '43537113', 'view', '{}', NULL, '2025-09-23 21:02:24'),
(649, '2025-09-23 21:02:24', '2025-09-23 21:02:24', 74, '43537113', 'view', '{}', NULL, '2025-09-23 21:02:24'),
(650, '2025-09-23 21:02:26', '2025-09-23 21:02:26', 74, '43537113', 'view', '{}', NULL, '2025-09-23 21:02:26'),
(651, '2025-09-23 21:02:26', '2025-09-23 21:02:26', 74, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-23 21:02:26'),
(652, '2025-09-23 21:02:27', '2025-09-23 21:02:27', 74, '43537113', 'view', '{}', NULL, '2025-09-23 21:02:27'),
(653, '2025-09-23 21:02:28', '2025-09-23 21:02:28', 74, '43537113', 'view', '{}', NULL, '2025-09-23 21:02:28'),
(654, '2025-09-23 21:02:29', '2025-09-23 21:02:29', 74, '43537113', 'view', '{}', NULL, '2025-09-23 21:02:29'),
(655, '2025-09-23 21:02:29', '2025-09-23 21:02:29', 74, '43537113', 'view', '{}', NULL, '2025-09-23 21:02:29'),
(656, '2025-09-23 21:02:30', '2025-09-23 21:02:30', 74, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-23 21:02:30'),
(657, '2025-09-23 21:02:31', '2025-09-23 21:02:31', 74, '43537113', 'view', '{}', NULL, '2025-09-23 21:02:31'),
(658, '2025-09-23 21:02:35', '2025-09-23 21:02:35', 74, '43537113', 'view', '{}', NULL, '2025-09-23 21:02:35'),
(659, '2025-09-23 21:02:48', '2025-09-23 21:02:48', 72, '44377090', 'view', '{}', NULL, '2025-09-23 21:02:48'),
(660, '2025-09-23 21:02:50', '2025-09-23 21:02:50', 72, '44377090', 'view', '{}', NULL, '2025-09-23 21:02:50'),
(661, '2025-09-23 21:03:00', '2025-09-23 21:03:00', 72, '44377090', 'view', '{}', NULL, '2025-09-23 21:03:00'),
(662, '2025-09-23 21:04:29', '2025-09-23 21:04:29', 72, '44377090', 'view', '{}', NULL, '2025-09-23 21:04:29'),
(663, '2025-09-23 21:04:31', '2025-09-23 21:04:31', 72, '44377090', 'view', '{}', NULL, '2025-09-23 21:04:31'),
(664, '2025-09-23 21:04:31', '2025-09-23 21:04:31', 70, '44377090', 'view', '{}', NULL, '2025-09-23 21:04:31'),
(665, '2025-09-23 21:04:31', '2025-09-23 21:04:31', 68, '44377090', 'view', '{}', NULL, '2025-09-23 21:04:31'),
(666, '2025-09-23 21:04:32', '2025-09-23 21:04:32', 67, '44377090', 'view', '{}', NULL, '2025-09-23 21:04:32'),
(667, '2025-09-23 21:04:33', '2025-09-23 21:04:33', 72, '44377090', 'view', '{}', NULL, '2025-09-23 21:04:33'),
(668, '2025-09-23 21:12:53', '2025-09-23 21:12:53', 74, '44187263', 'view', '{}', NULL, '2025-09-23 21:12:53'),
(669, '2025-09-23 21:12:53', '2025-09-23 21:12:53', 74, '44187263', 'view', '{}', NULL, '2025-09-23 21:12:53'),
(670, '2025-09-23 21:12:54', '2025-09-23 21:12:54', 73, '44187263', 'view', '{}', NULL, '2025-09-23 21:12:54'),
(671, '2025-09-23 21:12:54', '2025-09-23 21:12:54', 72, '44187263', 'view', '{}', NULL, '2025-09-23 21:12:54'),
(672, '2025-09-23 21:12:55', '2025-09-23 21:12:55', 68, '44187263', 'view', '{}', NULL, '2025-09-23 21:12:55'),
(673, '2025-09-23 21:12:56', '2025-09-23 21:12:56', 67, '44187263', 'view', '{}', NULL, '2025-09-23 21:12:56'),
(674, '2025-09-23 21:12:59', '2025-09-23 21:12:59', 73, '44187263', 'view', '{}', NULL, '2025-09-23 21:12:59'),
(675, '2025-09-23 21:13:01', '2025-09-23 21:13:01', 74, '44187263', 'view', '{}', NULL, '2025-09-23 21:13:01'),
(676, '2025-09-23 21:13:01', '2025-09-23 21:13:01', 73, '44187263', 'view', '{}', NULL, '2025-09-23 21:13:01'),
(677, '2025-09-23 21:13:01', '2025-09-23 21:13:01', 72, '44187263', 'view', '{}', NULL, '2025-09-23 21:13:01'),
(678, '2025-09-23 21:13:46', '2025-09-23 21:13:46', 74, '44187263', 'view', '{}', NULL, '2025-09-23 21:13:46'),
(679, '2025-09-23 21:13:47', '2025-09-23 21:13:47', 73, '44187263', 'view', '{}', NULL, '2025-09-23 21:13:47'),
(680, '2025-09-23 21:13:47', '2025-09-23 21:13:47', 74, '44187263', 'view', '{}', NULL, '2025-09-23 21:13:47'),
(681, '2025-09-23 21:13:47', '2025-09-23 21:13:47', 78, '44187263', 'view', '{}', NULL, '2025-09-23 21:13:47'),
(682, '2025-09-23 21:13:48', '2025-09-23 21:13:48', 78, '44187263', 'view', '{}', NULL, '2025-09-23 21:13:48'),
(683, '2025-09-23 21:13:48', '2025-09-23 21:13:48', 78, '44187263', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-23 21:13:48'),
(684, '2025-09-23 21:13:48', '2025-09-23 21:13:48', 78, '44187263', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-23 21:13:48'),
(685, '2025-09-23 21:13:49', '2025-09-23 21:13:49', 78, '44187263', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-23 21:13:49'),
(686, '2025-09-23 21:13:49', '2025-09-23 21:13:49', 78, '44187263', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-23 21:13:49'),
(687, '2025-09-23 21:14:00', '2025-09-23 21:14:00', 78, '44187263', 'view', '{}', NULL, '2025-09-23 21:14:00'),
(688, '2025-09-23 21:14:05', '2025-09-23 21:14:05', 78, '44187263', 'view', '{}', NULL, '2025-09-23 21:14:05'),
(689, '2025-09-23 21:17:58', '2025-09-23 21:17:58', 78, '44377090', 'view', '{}', NULL, '2025-09-23 21:17:58'),
(690, '2025-09-23 21:24:18', '2025-09-23 21:24:18', 78, '44377090', 'view', '{}', NULL, '2025-09-23 21:24:18'),
(691, '2025-09-23 21:24:19', '2025-09-23 21:24:19', 70, '44377090', 'view', '{}', NULL, '2025-09-23 21:24:19'),
(692, '2025-09-23 21:24:19', '2025-09-23 21:24:19', 67, '44377090', 'view', '{}', NULL, '2025-09-23 21:24:19'),
(693, '2025-09-23 21:24:20', '2025-09-23 21:24:20', 70, '44377090', 'view', '{}', NULL, '2025-09-23 21:24:20'),
(694, '2025-09-23 21:24:20', '2025-09-23 21:24:20', 72, '44377090', 'view', '{}', NULL, '2025-09-23 21:24:20'),
(695, '2025-09-23 21:24:20', '2025-09-23 21:24:20', 78, '44377090', 'view', '{}', NULL, '2025-09-23 21:24:20'),
(696, '2025-09-23 21:24:24', '2025-09-23 21:24:24', 78, '44377090', 'view', '{}', NULL, '2025-09-23 21:24:24'),
(697, '2025-09-23 21:24:33', '2025-09-23 21:24:33', 78, '44377090', 'view', '{}', NULL, '2025-09-23 21:24:33'),
(698, '2025-09-23 21:24:34', '2025-09-23 21:24:34', 72, '44377090', 'view', '{}', NULL, '2025-09-23 21:24:34'),
(699, '2025-09-23 21:24:34', '2025-09-23 21:24:34', 78, '44377090', 'view', '{}', NULL, '2025-09-23 21:24:34'),
(700, '2025-09-23 21:24:35', '2025-09-23 21:24:35', 78, '44377090', 'view', '{}', NULL, '2025-09-23 21:24:35'),
(701, '2025-09-23 21:24:37', '2025-09-23 21:24:37', 79, '44377090', 'view', '{}', NULL, '2025-09-23 21:24:37'),
(702, '2025-09-23 21:24:37', '2025-09-23 21:24:37', 78, '44377090', 'view', '{}', NULL, '2025-09-23 21:24:37'),
(703, '2025-09-23 21:24:37', '2025-09-23 21:24:37', 72, '44377090', 'view', '{}', NULL, '2025-09-23 21:24:37'),
(704, '2025-09-23 21:25:04', '2025-09-23 21:25:04', 72, '44377090', 'view', '{}', NULL, '2025-09-23 21:25:04'),
(705, '2025-09-23 21:25:05', '2025-09-23 21:25:05', 78, '44377090', 'view', '{}', NULL, '2025-09-23 21:25:05'),
(706, '2025-09-23 21:27:16', '2025-09-23 21:27:16', 78, '43537113', 'view', '{}', NULL, '2025-09-23 21:27:16'),
(707, '2025-09-23 21:27:16', '2025-09-23 21:27:16', 79, '43537113', 'view', '{}', NULL, '2025-09-23 21:27:16'),
(708, '2025-09-23 21:27:19', '2025-09-23 21:27:19', 79, '43537113', 'view', '{}', NULL, '2025-09-23 21:27:19'),
(709, '2025-09-23 21:27:19', '2025-09-23 21:27:19', 78, '43537113', 'view', '{}', NULL, '2025-09-23 21:27:19'),
(710, '2025-09-23 21:27:24', '2025-09-23 21:27:24', 79, '44187263', 'view', '{}', NULL, '2025-09-23 21:27:24'),
(711, '2025-09-23 21:27:25', '2025-09-23 21:27:25', 74, '44187263', 'view', '{}', NULL, '2025-09-23 21:27:25'),
(712, '2025-09-23 21:27:26', '2025-09-23 21:27:26', 74, '44187263', 'view', '{}', NULL, '2025-09-23 21:27:26'),
(713, '2025-09-23 21:27:28', '2025-09-23 21:27:28', 73, '44187263', 'view', '{}', NULL, '2025-09-23 21:27:28'),
(714, '2025-09-23 21:27:28', '2025-09-23 21:27:28', 72, '44187263', 'view', '{}', NULL, '2025-09-23 21:27:28'),
(715, '2025-09-23 21:27:28', '2025-09-23 21:27:28', 71, '44187263', 'view', '{}', NULL, '2025-09-23 21:27:28'),
(716, '2025-09-23 21:27:29', '2025-09-23 21:27:29', 70, '44187263', 'view', '{}', NULL, '2025-09-23 21:27:29'),
(717, '2025-09-23 21:27:29', '2025-09-23 21:27:29', 71, '44187263', 'view', '{}', NULL, '2025-09-23 21:27:29'),
(718, '2025-09-23 21:27:29', '2025-09-23 21:27:29', 72, '44187263', 'view', '{}', NULL, '2025-09-23 21:27:29'),
(719, '2025-09-23 21:27:30', '2025-09-23 21:27:30', 78, '44187263', 'view', '{}', NULL, '2025-09-23 21:27:30'),
(720, '2025-09-23 21:27:32', '2025-09-23 21:27:32', 79, '44187263', 'view', '{}', NULL, '2025-09-23 21:27:32'),
(721, '2025-09-23 21:27:32', '2025-09-23 21:27:32', 79, '44187263', 'view', '{}', NULL, '2025-09-23 21:27:32'),
(722, '2025-09-23 21:27:32', '2025-09-23 21:27:32', 78, '44187263', 'view', '{}', NULL, '2025-09-23 21:27:32'),
(723, '2025-09-23 21:27:32', '2025-09-23 21:27:32', 74, '44187263', 'view', '{}', NULL, '2025-09-23 21:27:32'),
(724, '2025-09-23 21:27:33', '2025-09-23 21:27:33', 74, '44187263', 'view', '{}', NULL, '2025-09-23 21:27:33'),
(725, '2025-09-23 21:27:33', '2025-09-23 21:27:33', 78, '44187263', 'view', '{}', NULL, '2025-09-23 21:27:33'),
(726, '2025-09-23 21:27:33', '2025-09-23 21:27:33', 73, '44187263', 'view', '{}', NULL, '2025-09-23 21:27:33'),
(727, '2025-09-23 21:27:35', '2025-09-23 21:27:35', 78, '44187263', 'view', '{}', NULL, '2025-09-23 21:27:35'),
(728, '2025-09-23 21:27:35', '2025-09-23 21:27:35', 74, '44187263', 'view', '{}', NULL, '2025-09-23 21:27:35'),
(729, '2025-09-23 21:27:35', '2025-09-23 21:27:35', 73, '44187263', 'view', '{}', NULL, '2025-09-23 21:27:35'),
(730, '2025-09-23 21:27:36', '2025-09-23 21:27:36', 71, '44187263', 'view', '{}', NULL, '2025-09-23 21:27:36'),
(731, '2025-09-23 21:27:36', '2025-09-23 21:27:36', 70, '44187263', 'view', '{}', NULL, '2025-09-23 21:27:36'),
(732, '2025-09-23 21:27:38', '2025-09-23 21:27:38', 70, '44187263', 'view', '{}', NULL, '2025-09-23 21:27:38'),
(733, '2025-09-23 21:27:38', '2025-09-23 21:27:38', 68, '44187263', 'view', '{}', NULL, '2025-09-23 21:27:38'),
(734, '2025-09-23 21:28:17', '2025-09-23 21:28:17', 79, '43537113', 'view', '{}', NULL, '2025-09-23 21:28:17'),
(735, '2025-09-23 21:28:17', '2025-09-23 21:28:17', 78, '43537113', 'view', '{}', NULL, '2025-09-23 21:28:17'),
(736, '2025-09-23 21:28:18', '2025-09-23 21:28:18', 70, '44187263', 'view', '{}', NULL, '2025-09-23 21:28:18'),
(737, '2025-09-23 21:28:18', '2025-09-23 21:28:18', 71, '44187263', 'view', '{}', NULL, '2025-09-23 21:28:18'),
(738, '2025-09-23 21:28:19', '2025-09-23 21:28:19', 72, '44187263', 'view', '{}', NULL, '2025-09-23 21:28:19'),
(739, '2025-09-23 21:28:19', '2025-09-23 21:28:19', 71, '44187263', 'view', '{}', NULL, '2025-09-23 21:28:19'),
(740, '2025-09-23 21:28:21', '2025-09-23 21:28:21', 71, '44187263', 'view', '{}', NULL, '2025-09-23 21:28:21'),
(741, '2025-09-23 21:28:23', '2025-09-23 21:28:23', 71, '44187263', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-23 21:28:23'),
(742, '2025-09-23 21:28:24', '2025-09-23 21:28:24', 71, '44187263', 'view', '{}', NULL, '2025-09-23 21:28:24'),
(743, '2025-09-23 21:28:24', '2025-09-23 21:28:24', 70, '44187263', 'view', '{}', NULL, '2025-09-23 21:28:24'),
(744, '2025-09-23 21:28:25', '2025-09-23 21:28:25', 72, '44187263', 'view', '{}', NULL, '2025-09-23 21:28:25'),
(745, '2025-09-23 21:28:26', '2025-09-23 21:28:26', 73, '44187263', 'view', '{}', NULL, '2025-09-23 21:28:26'),
(746, '2025-09-23 21:28:26', '2025-09-23 21:28:26', 74, '44187263', 'view', '{}', NULL, '2025-09-23 21:28:26'),
(747, '2025-09-23 21:28:26', '2025-09-23 21:28:26', 78, '44187263', 'view', '{}', NULL, '2025-09-23 21:28:26'),
(748, '2025-09-23 21:28:26', '2025-09-23 21:28:26', 79, '44187263', 'view', '{}', NULL, '2025-09-23 21:28:26'),
(749, '2025-09-23 21:28:26', '2025-09-23 21:28:26', 78, '44187263', 'view', '{}', NULL, '2025-09-23 21:28:26'),
(750, '2025-09-23 21:28:27', '2025-09-23 21:28:27', 78, '44187263', 'view', '{}', NULL, '2025-09-23 21:28:27'),
(751, '2025-09-23 21:28:28', '2025-09-23 21:28:28', 78, '44187263', 'view', '{}', NULL, '2025-09-23 21:28:28'),
(752, '2025-09-23 21:28:28', '2025-09-23 21:28:28', 79, '44187263', 'view', '{}', NULL, '2025-09-23 21:28:28'),
(753, '2025-09-23 21:28:39', '2025-09-23 21:28:39', 79, '44187263', 'view', '{}', NULL, '2025-09-23 21:28:39'),
(754, '2025-09-23 21:28:39', '2025-09-23 21:28:39', 79, '44187263', 'view', '{}', NULL, '2025-09-23 21:28:39'),
(755, '2025-09-23 21:28:39', '2025-09-23 21:28:39', 78, '44187263', 'view', '{}', NULL, '2025-09-23 21:28:39'),
(756, '2025-09-23 21:28:39', '2025-09-23 21:28:39', 74, '44187263', 'view', '{}', NULL, '2025-09-23 21:28:39'),
(757, '2025-09-23 21:30:22', '2025-09-23 21:30:22', 79, '44377090', 'view', '{}', NULL, '2025-09-23 21:30:22'),
(758, '2025-09-23 21:30:23', '2025-09-23 21:30:23', 79, '44377090', 'view', '{}', NULL, '2025-09-23 21:30:23'),
(759, '2025-09-23 21:30:25', '2025-09-23 21:30:25', 79, '44377090', 'view', '{}', NULL, '2025-09-23 21:30:25'),
(760, '2025-09-23 21:30:26', '2025-09-23 21:30:26', 79, '44377090', 'view', '{}', NULL, '2025-09-23 21:30:26'),
(761, '2025-09-23 21:30:26', '2025-09-23 21:30:26', 78, '44377090', 'view', '{}', NULL, '2025-09-23 21:30:26'),
(762, '2025-09-23 21:30:27', '2025-09-23 21:30:27', 78, '44377090', 'view', '{}', NULL, '2025-09-23 21:30:27'),
(763, '2025-09-23 21:30:28', '2025-09-23 21:30:28', 79, '44377090', 'view', '{}', NULL, '2025-09-23 21:30:28'),
(764, '2025-09-23 21:30:29', '2025-09-23 21:30:29', 79, '44377090', 'view', '{}', NULL, '2025-09-23 21:30:29'),
(765, '2025-09-23 21:30:29', '2025-09-23 21:30:29', 78, '44377090', 'view', '{}', NULL, '2025-09-23 21:30:29'),
(766, '2025-09-23 21:30:29', '2025-09-23 21:30:29', 72, '44377090', 'view', '{}', NULL, '2025-09-23 21:30:29'),
(767, '2025-09-23 21:37:49', '2025-09-23 21:37:49', 79, '43537113', 'view', '{}', NULL, '2025-09-23 21:37:49'),
(768, '2025-09-23 21:37:49', '2025-09-23 21:37:49', 78, '43537113', 'view', '{}', NULL, '2025-09-23 21:37:49'),
(769, '2025-09-23 21:37:49', '2025-09-23 21:37:49', 74, '43537113', 'view', '{}', NULL, '2025-09-23 21:37:49'),
(770, '2025-09-23 21:37:59', '2025-09-23 21:37:59', 72, '43537113', 'view', '{}', NULL, '2025-09-23 21:37:59'),
(771, '2025-09-24 01:14:25', '2025-09-24 01:14:25', 79, '44187263', 'view', '{}', NULL, '2025-09-24 01:14:25'),
(772, '2025-09-24 02:31:30', '2025-09-24 02:31:30', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:31:30'),
(773, '2025-09-24 02:31:32', '2025-09-24 02:31:32', 79, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 02:31:32'),
(774, '2025-09-24 02:31:32', '2025-09-24 02:31:32', 78, '44187263', 'view', '{}', NULL, '2025-09-24 02:31:32'),
(775, '2025-09-24 02:31:32', '2025-09-24 02:31:32', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:31:32'),
(776, '2025-09-24 02:31:33', '2025-09-24 02:31:33', 79, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 02:31:33'),
(777, '2025-09-24 02:31:35', '2025-09-24 02:31:35', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:31:35'),
(778, '2025-09-24 02:31:36', '2025-09-24 02:31:36', 78, '44187263', 'view', '{}', NULL, '2025-09-24 02:31:36'),
(779, '2025-09-24 02:31:37', '2025-09-24 02:31:37', 71, '44187263', 'view', '{}', NULL, '2025-09-24 02:31:37'),
(780, '2025-09-24 02:31:38', '2025-09-24 02:31:38', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:31:38'),
(781, '2025-09-24 02:31:43', '2025-09-24 02:31:43', 78, '44187263', 'view', '{}', NULL, '2025-09-24 02:31:43'),
(782, '2025-09-24 02:31:44', '2025-09-24 02:31:44', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:31:44'),
(783, '2025-09-24 02:31:51', '2025-09-24 02:31:51', 74, '44187263', 'view', '{}', NULL, '2025-09-24 02:31:51'),
(784, '2025-09-24 02:32:39', '2025-09-24 02:32:39', 78, '44187263', 'view', '{}', NULL, '2025-09-24 02:32:39'),
(785, '2025-09-24 02:32:39', '2025-09-24 02:32:39', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:32:39'),
(786, '2025-09-24 02:32:41', '2025-09-24 02:32:41', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:32:41'),
(787, '2025-09-24 02:32:42', '2025-09-24 02:32:42', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:32:42'),
(788, '2025-09-24 02:32:43', '2025-09-24 02:32:43', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:32:43'),
(789, '2025-09-24 02:32:45', '2025-09-24 02:32:45', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:32:45'),
(790, '2025-09-24 02:32:46', '2025-09-24 02:32:46', 79, '44187263', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-24 02:32:46'),
(791, '2025-09-24 02:32:48', '2025-09-24 02:32:48', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:32:48'),
(792, '2025-09-24 02:32:50', '2025-09-24 02:32:50', 74, '44187263', 'view', '{}', NULL, '2025-09-24 02:32:50'),
(793, '2025-09-24 02:32:51', '2025-09-24 02:32:51', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:32:51'),
(794, '2025-09-24 02:32:56', '2025-09-24 02:32:56', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:32:56'),
(795, '2025-09-24 02:41:52', '2025-09-24 02:41:52', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:41:52'),
(796, '2025-09-24 02:41:52', '2025-09-24 02:41:52', 78, '44187263', 'view', '{}', NULL, '2025-09-24 02:41:52'),
(797, '2025-09-24 02:41:54', '2025-09-24 02:41:54', 68, '44187263', 'view', '{}', NULL, '2025-09-24 02:41:54'),
(798, '2025-09-24 02:41:54', '2025-09-24 02:41:54', 67, '44187263', 'view', '{}', NULL, '2025-09-24 02:41:54'),
(799, '2025-09-24 02:41:55', '2025-09-24 02:41:55', 66, '44187263', 'view', '{}', NULL, '2025-09-24 02:41:55'),
(800, '2025-09-24 02:42:03', '2025-09-24 02:42:03', 70, '44187263', 'view', '{}', NULL, '2025-09-24 02:42:03'),
(801, '2025-09-24 02:42:03', '2025-09-24 02:42:03', 72, '44187263', 'view', '{}', NULL, '2025-09-24 02:42:03'),
(802, '2025-09-24 02:42:04', '2025-09-24 02:42:04', 72, '44187263', 'view', '{}', NULL, '2025-09-24 02:42:04'),
(803, '2025-09-24 02:42:04', '2025-09-24 02:42:04', 73, '44187263', 'view', '{}', NULL, '2025-09-24 02:42:04'),
(804, '2025-09-24 02:42:06', '2025-09-24 02:42:06', 74, '44187263', 'view', '{}', NULL, '2025-09-24 02:42:06'),
(805, '2025-09-24 02:42:06', '2025-09-24 02:42:06', 78, '44187263', 'view', '{}', NULL, '2025-09-24 02:42:06'),
(806, '2025-09-24 02:42:07', '2025-09-24 02:42:07', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:42:07'),
(807, '2025-09-24 02:42:49', '2025-09-24 02:42:49', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:42:49'),
(808, '2025-09-24 02:42:51', '2025-09-24 02:42:51', 78, '44187263', 'view', '{}', NULL, '2025-09-24 02:42:51'),
(809, '2025-09-24 02:43:12', '2025-09-24 02:43:12', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:43:12'),
(810, '2025-09-24 02:43:22', '2025-09-24 02:43:22', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:43:22'),
(811, '2025-09-24 02:48:13', '2025-09-24 02:48:13', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:48:13'),
(812, '2025-09-24 02:49:40', '2025-09-24 02:49:40', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:49:40'),
(813, '2025-09-24 02:49:43', '2025-09-24 02:49:43', 78, '44187263', 'view', '{}', NULL, '2025-09-24 02:49:43'),
(814, '2025-09-24 02:49:43', '2025-09-24 02:49:43', 74, '44187263', 'view', '{}', NULL, '2025-09-24 02:49:43'),
(815, '2025-09-24 02:49:43', '2025-09-24 02:49:43', 73, '44187263', 'view', '{}', NULL, '2025-09-24 02:49:43'),
(816, '2025-09-24 02:49:43', '2025-09-24 02:49:43', 72, '44187263', 'view', '{}', NULL, '2025-09-24 02:49:43'),
(817, '2025-09-24 02:49:44', '2025-09-24 02:49:44', 71, '44187263', 'view', '{}', NULL, '2025-09-24 02:49:44'),
(818, '2025-09-24 02:49:44', '2025-09-24 02:49:44', 70, '44187263', 'view', '{}', NULL, '2025-09-24 02:49:44'),
(819, '2025-09-24 02:49:44', '2025-09-24 02:49:44', 68, '44187263', 'view', '{}', NULL, '2025-09-24 02:49:44'),
(820, '2025-09-24 02:49:44', '2025-09-24 02:49:44', 67, '44187263', 'view', '{}', NULL, '2025-09-24 02:49:44'),
(821, '2025-09-24 02:49:45', '2025-09-24 02:49:45', 68, '44187263', 'view', '{}', NULL, '2025-09-24 02:49:45'),
(822, '2025-09-24 02:49:45', '2025-09-24 02:49:45', 70, '44187263', 'view', '{}', NULL, '2025-09-24 02:49:45'),
(823, '2025-09-24 02:49:45', '2025-09-24 02:49:45', 73, '44187263', 'view', '{}', NULL, '2025-09-24 02:49:45'),
(824, '2025-09-24 02:49:46', '2025-09-24 02:49:46', 78, '44187263', 'view', '{}', NULL, '2025-09-24 02:49:46'),
(825, '2025-09-24 02:49:52', '2025-09-24 02:49:52', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:49:52'),
(826, '2025-09-24 02:49:54', '2025-09-24 02:49:54', 79, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 02:49:54'),
(827, '2025-09-24 02:49:55', '2025-09-24 02:49:55', 79, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 02:49:55'),
(828, '2025-09-24 02:50:12', '2025-09-24 02:50:12', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:50:12'),
(829, '2025-09-24 02:51:16', '2025-09-24 02:51:16', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:51:16'),
(830, '2025-09-24 02:51:17', '2025-09-24 02:51:17', 79, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 02:51:17'),
(831, '2025-09-24 02:51:17', '2025-09-24 02:51:17', 79, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 02:51:17'),
(832, '2025-09-24 02:51:22', '2025-09-24 02:51:22', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:51:22'),
(833, '2025-09-24 02:51:25', '2025-09-24 02:51:25', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:51:25'),
(834, '2025-09-24 02:51:26', '2025-09-24 02:51:26', 78, '44187263', 'view', '{}', NULL, '2025-09-24 02:51:26'),
(835, '2025-09-24 02:51:28', '2025-09-24 02:51:28', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:51:28'),
(836, '2025-09-24 02:51:29', '2025-09-24 02:51:29', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:51:29'),
(837, '2025-09-24 02:51:29', '2025-09-24 02:51:29', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:51:29'),
(838, '2025-09-24 02:51:30', '2025-09-24 02:51:30', 79, '44187263', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-24 02:51:30'),
(839, '2025-09-24 02:51:30', '2025-09-24 02:51:30', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:51:30'),
(840, '2025-09-24 02:51:38', '2025-09-24 02:51:38', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:51:38'),
(841, '2025-09-24 02:51:40', '2025-09-24 02:51:40', 74, '44187263', 'view', '{}', NULL, '2025-09-24 02:51:40'),
(842, '2025-09-24 02:51:40', '2025-09-24 02:51:40', 78, '44187263', 'view', '{}', NULL, '2025-09-24 02:51:40'),
(843, '2025-09-24 02:51:41', '2025-09-24 02:51:41', 78, '44187263', 'click', '{\"elementClicked\":\"comment\"}', NULL, '2025-09-24 02:51:41'),
(844, '2025-09-24 02:51:42', '2025-09-24 02:51:42', 74, '44187263', 'view', '{}', NULL, '2025-09-24 02:51:42'),
(845, '2025-09-24 02:51:42', '2025-09-24 02:51:42', 73, '44187263', 'view', '{}', NULL, '2025-09-24 02:51:42'),
(846, '2025-09-24 02:51:43', '2025-09-24 02:51:43', 72, '44187263', 'view', '{}', NULL, '2025-09-24 02:51:43'),
(847, '2025-09-24 02:51:43', '2025-09-24 02:51:43', 70, '44187263', 'view', '{}', NULL, '2025-09-24 02:51:43'),
(848, '2025-09-24 02:51:43', '2025-09-24 02:51:43', 71, '44187263', 'view', '{}', NULL, '2025-09-24 02:51:43'),
(849, '2025-09-24 02:51:44', '2025-09-24 02:51:44', 72, '44187263', 'view', '{}', NULL, '2025-09-24 02:51:44'),
(850, '2025-09-24 02:51:44', '2025-09-24 02:51:44', 72, '44187263', 'click', '{\"elementClicked\":\"comment\"}', NULL, '2025-09-24 02:51:44'),
(851, '2025-09-24 02:51:46', '2025-09-24 02:51:46', 72, '44187263', 'view', '{}', NULL, '2025-09-24 02:51:46'),
(852, '2025-09-24 02:51:47', '2025-09-24 02:51:47', 72, '44187263', 'view', '{}', NULL, '2025-09-24 02:51:47'),
(853, '2025-09-24 02:51:48', '2025-09-24 02:51:48', 78, '44187263', 'view', '{}', NULL, '2025-09-24 02:51:48'),
(854, '2025-09-24 02:51:48', '2025-09-24 02:51:48', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:51:48'),
(855, '2025-09-24 02:51:49', '2025-09-24 02:51:49', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:51:49'),
(856, '2025-09-24 02:52:03', '2025-09-24 02:52:03', 78, '44187263', 'view', '{}', NULL, '2025-09-24 02:52:03'),
(857, '2025-09-24 02:52:03', '2025-09-24 02:52:03', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:52:03'),
(858, '2025-09-24 02:52:08', '2025-09-24 02:52:08', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:52:08'),
(859, '2025-09-24 02:52:08', '2025-09-24 02:52:08', 80, '44187263', 'view', '{}', NULL, '2025-09-24 02:52:08'),
(860, '2025-09-24 02:52:10', '2025-09-24 02:52:10', 80, '44187263', 'view', '{}', NULL, '2025-09-24 02:52:10'),
(861, '2025-09-24 02:52:10', '2025-09-24 02:52:10', 80, '44187263', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-24 02:52:10'),
(862, '2025-09-24 02:52:10', '2025-09-24 02:52:10', 80, '44187263', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-24 02:52:10'),
(863, '2025-09-24 02:52:10', '2025-09-24 02:52:10', 80, '44187263', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-24 02:52:10'),
(864, '2025-09-24 02:52:22', '2025-09-24 02:52:22', 80, '44187263', 'view', '{}', NULL, '2025-09-24 02:52:22'),
(865, '2025-09-24 02:52:24', '2025-09-24 02:52:24', 80, '44187263', 'view', '{}', NULL, '2025-09-24 02:52:24'),
(866, '2025-09-24 02:53:35', '2025-09-24 02:53:35', 80, '44187263', 'view', '{}', NULL, '2025-09-24 02:53:35'),
(867, '2025-09-24 02:53:35', '2025-09-24 02:53:35', 80, '44187263', 'view', '{}', NULL, '2025-09-24 02:53:35'),
(868, '2025-09-24 02:53:37', '2025-09-24 02:53:37', 79, '44187263', 'view', '{}', NULL, '2025-09-24 02:53:37'),
(869, '2025-09-24 02:53:38', '2025-09-24 02:53:38', 80, '44187263', 'view', '{}', NULL, '2025-09-24 02:53:38'),
(870, '2025-09-24 02:53:40', '2025-09-24 02:53:40', 80, '44187263', 'view', '{}', NULL, '2025-09-24 02:53:40'),
(871, '2025-09-24 02:53:56', '2025-09-24 02:53:56', 80, '44187263', 'view', '{}', NULL, '2025-09-24 02:53:56'),
(872, '2025-09-24 02:53:56', '2025-09-24 02:53:56', 78, '44187263', 'view', '{}', NULL, '2025-09-24 02:53:56'),
(873, '2025-09-24 02:54:25', '2025-09-24 02:54:25', 80, '44187263', 'view', '{}', NULL, '2025-09-24 02:54:25'),
(874, '2025-09-24 02:56:59', '2025-09-24 02:56:59', 80, '44187263', 'view', '{}', NULL, '2025-09-24 02:56:59'),
(875, '2025-09-24 02:59:31', '2025-09-24 02:59:31', 80, '43537113', 'view', '{}', NULL, '2025-09-24 02:59:31'),
(876, '2025-09-24 03:00:08', '2025-09-24 03:00:08', 80, '43537113', 'view', '{}', NULL, '2025-09-24 03:00:08'),
(877, '2025-09-24 03:00:08', '2025-09-24 03:00:08', 79, '43537113', 'view', '{}', NULL, '2025-09-24 03:00:08'),
(878, '2025-09-24 03:00:15', '2025-09-24 03:00:15', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:00:15'),
(879, '2025-09-24 03:00:15', '2025-09-24 03:00:15', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:00:15'),
(880, '2025-09-24 03:00:16', '2025-09-24 03:00:16', 80, '44187263', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-24 03:00:16'),
(881, '2025-09-24 03:00:16', '2025-09-24 03:00:16', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:00:16'),
(882, '2025-09-24 03:00:24', '2025-09-24 03:00:24', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:00:24'),
(883, '2025-09-24 03:00:25', '2025-09-24 03:00:25', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:00:25'),
(884, '2025-09-24 03:01:43', '2025-09-24 03:01:43', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:01:43'),
(885, '2025-09-24 03:02:21', '2025-09-24 03:02:21', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:02:21'),
(886, '2025-09-24 03:03:05', '2025-09-24 03:03:05', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:03:05'),
(887, '2025-09-24 03:03:06', '2025-09-24 03:03:06', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:03:06'),
(888, '2025-09-24 03:03:44', '2025-09-24 03:03:44', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:03:44'),
(889, '2025-09-24 03:05:00', '2025-09-24 03:05:00', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:05:00'),
(890, '2025-09-24 03:05:58', '2025-09-24 03:05:58', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:05:58'),
(891, '2025-09-24 03:06:01', '2025-09-24 03:06:01', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:06:01'),
(892, '2025-09-24 03:06:02', '2025-09-24 03:06:02', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:06:02'),
(893, '2025-09-24 03:06:04', '2025-09-24 03:06:04', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:06:04'),
(894, '2025-09-24 03:06:05', '2025-09-24 03:06:05', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:06:05'),
(895, '2025-09-24 03:06:07', '2025-09-24 03:06:07', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:06:07'),
(896, '2025-09-24 03:06:09', '2025-09-24 03:06:09', 80, '44187263', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-24 03:06:09'),
(897, '2025-09-24 03:06:14', '2025-09-24 03:06:14', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:06:14'),
(898, '2025-09-24 03:06:14', '2025-09-24 03:06:14', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:06:14'),
(899, '2025-09-24 03:06:14', '2025-09-24 03:06:14', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:06:14'),
(900, '2025-09-24 03:06:23', '2025-09-24 03:06:23', 80, '44187263', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-24 03:06:23'),
(901, '2025-09-24 03:06:24', '2025-09-24 03:06:24', 80, '44187263', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-24 03:06:24'),
(902, '2025-09-24 03:07:27', '2025-09-24 03:07:27', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:07:27');
INSERT INTO `announcement_analytics` (`id`, `created_at`, `updated_at`, `announcement_id`, `user_id`, `event_type`, `event_data`, `session_id`, `timestamp`) VALUES
(903, '2025-09-24 03:07:27', '2025-09-24 03:07:27', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:07:27'),
(904, '2025-09-24 03:08:45', '2025-09-24 03:08:45', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:08:45'),
(905, '2025-09-24 03:09:14', '2025-09-24 03:09:14', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:09:14'),
(906, '2025-09-24 03:09:44', '2025-09-24 03:09:44', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:09:44'),
(907, '2025-09-24 03:09:45', '2025-09-24 03:09:45', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:09:45'),
(908, '2025-09-24 03:10:05', '2025-09-24 03:10:05', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:10:05'),
(909, '2025-09-24 03:10:55', '2025-09-24 03:10:55', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:10:55'),
(910, '2025-09-24 03:10:55', '2025-09-24 03:10:55', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:10:55'),
(911, '2025-09-24 03:15:46', '2025-09-24 03:15:46', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:15:46'),
(912, '2025-09-24 03:15:46', '2025-09-24 03:15:46', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:15:46'),
(913, '2025-09-24 03:15:47', '2025-09-24 03:15:47', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:15:47'),
(914, '2025-09-24 03:15:47', '2025-09-24 03:15:47', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:15:47'),
(915, '2025-09-24 03:15:47', '2025-09-24 03:15:47', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:15:47'),
(916, '2025-09-24 03:15:48', '2025-09-24 03:15:48', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:15:48'),
(917, '2025-09-24 03:15:48', '2025-09-24 03:15:48', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:15:48'),
(918, '2025-09-24 03:15:48', '2025-09-24 03:15:48', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:15:48'),
(919, '2025-09-24 03:15:49', '2025-09-24 03:15:49', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:15:49'),
(920, '2025-09-24 03:15:49', '2025-09-24 03:15:49', 74, '44187263', 'view', '{}', NULL, '2025-09-24 03:15:49'),
(921, '2025-09-24 03:15:55', '2025-09-24 03:15:55', 74, '44187263', 'view', '{}', NULL, '2025-09-24 03:15:55'),
(922, '2025-09-24 03:15:55', '2025-09-24 03:15:55', 74, '44187263', 'view', '{}', NULL, '2025-09-24 03:15:55'),
(923, '2025-09-24 03:15:56', '2025-09-24 03:15:56', 72, '44187263', 'view', '{}', NULL, '2025-09-24 03:15:56'),
(924, '2025-09-24 03:15:57', '2025-09-24 03:15:57', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:15:57'),
(925, '2025-09-24 03:15:58', '2025-09-24 03:15:58', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:15:58'),
(926, '2025-09-24 03:16:01', '2025-09-24 03:16:01', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:16:01'),
(927, '2025-09-24 03:17:39', '2025-09-24 03:17:39', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:17:39'),
(928, '2025-09-24 03:17:39', '2025-09-24 03:17:39', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:17:39'),
(929, '2025-09-24 03:17:40', '2025-09-24 03:17:40', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:17:40'),
(930, '2025-09-24 03:17:40', '2025-09-24 03:17:40', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:17:40'),
(931, '2025-09-24 03:17:40', '2025-09-24 03:17:40', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:17:40'),
(932, '2025-09-24 03:17:41', '2025-09-24 03:17:41', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:17:41'),
(933, '2025-09-24 03:17:44', '2025-09-24 03:17:44', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:17:44'),
(934, '2025-09-24 03:17:46', '2025-09-24 03:17:46', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:17:46'),
(935, '2025-09-24 03:17:48', '2025-09-24 03:17:48', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:17:48'),
(936, '2025-09-24 03:17:49', '2025-09-24 03:17:49', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:17:49'),
(937, '2025-09-24 03:17:49', '2025-09-24 03:17:49', 78, '44187263', 'view', '{}', NULL, '2025-09-24 03:17:49'),
(938, '2025-09-24 03:17:50', '2025-09-24 03:17:50', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:17:50'),
(939, '2025-09-24 03:17:50', '2025-09-24 03:17:50', 79, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:17:50'),
(940, '2025-09-24 03:17:50', '2025-09-24 03:17:50', 78, '44187263', 'view', '{}', NULL, '2025-09-24 03:17:50'),
(941, '2025-09-24 03:17:51', '2025-09-24 03:17:51', 78, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:17:51'),
(942, '2025-09-24 03:17:51', '2025-09-24 03:17:51', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:17:51'),
(943, '2025-09-24 03:17:53', '2025-09-24 03:17:53', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:17:53'),
(944, '2025-09-24 03:17:54', '2025-09-24 03:17:54', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:17:54'),
(945, '2025-09-24 03:18:10', '2025-09-24 03:18:10', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:18:10'),
(946, '2025-09-24 03:18:15', '2025-09-24 03:18:15', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:18:15'),
(947, '2025-09-24 03:18:16', '2025-09-24 03:18:16', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:18:16'),
(948, '2025-09-24 03:19:33', '2025-09-24 03:19:33', 80, '43537113', 'view', '{}', NULL, '2025-09-24 03:19:33'),
(949, '2025-09-24 03:19:35', '2025-09-24 03:19:35', 79, '43537113', 'view', '{}', NULL, '2025-09-24 03:19:35'),
(950, '2025-09-24 03:19:47', '2025-09-24 03:19:47', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:19:47'),
(951, '2025-09-24 03:19:47', '2025-09-24 03:19:47', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:19:47'),
(952, '2025-09-24 03:19:47', '2025-09-24 03:19:47', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:19:47'),
(953, '2025-09-24 03:19:48', '2025-09-24 03:19:48', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:19:48'),
(954, '2025-09-24 03:19:48', '2025-09-24 03:19:48', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:19:48'),
(955, '2025-09-24 03:19:48', '2025-09-24 03:19:48', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:19:48'),
(956, '2025-09-24 03:19:49', '2025-09-24 03:19:49', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:19:49'),
(957, '2025-09-24 03:19:49', '2025-09-24 03:19:49', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:19:49'),
(958, '2025-09-24 03:19:49', '2025-09-24 03:19:49', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:19:49'),
(959, '2025-09-24 03:20:09', '2025-09-24 03:20:09', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:20:09'),
(960, '2025-09-24 03:20:10', '2025-09-24 03:20:10', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:20:10'),
(961, '2025-09-24 03:20:13', '2025-09-24 03:20:13', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:20:13'),
(962, '2025-09-24 03:20:14', '2025-09-24 03:20:14', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:20:14'),
(963, '2025-09-24 03:20:15', '2025-09-24 03:20:15', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:20:15'),
(964, '2025-09-24 03:20:15', '2025-09-24 03:20:15', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:20:15'),
(965, '2025-09-24 03:20:18', '2025-09-24 03:20:18', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:20:18'),
(966, '2025-09-24 03:20:18', '2025-09-24 03:20:18', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:20:18'),
(967, '2025-09-24 03:20:19', '2025-09-24 03:20:19', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:20:19'),
(968, '2025-09-24 03:20:37', '2025-09-24 03:20:37', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:20:37'),
(969, '2025-09-24 03:20:37', '2025-09-24 03:20:37', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:20:37'),
(970, '2025-09-24 03:20:37', '2025-09-24 03:20:37', 78, '44187263', 'view', '{}', NULL, '2025-09-24 03:20:37'),
(971, '2025-09-24 03:20:42', '2025-09-24 03:20:42', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:20:42'),
(972, '2025-09-24 03:20:42', '2025-09-24 03:20:42', 79, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:20:42'),
(973, '2025-09-24 03:20:43', '2025-09-24 03:20:43', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:20:43'),
(974, '2025-09-24 03:20:43', '2025-09-24 03:20:43', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:20:43'),
(975, '2025-09-24 03:20:44', '2025-09-24 03:20:44', 79, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:20:44'),
(976, '2025-09-24 03:20:44', '2025-09-24 03:20:44', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:20:44'),
(977, '2025-09-24 03:20:46', '2025-09-24 03:20:46', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:20:46'),
(978, '2025-09-24 03:22:22', '2025-09-24 03:22:22', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:22:22'),
(979, '2025-09-24 03:22:22', '2025-09-24 03:22:22', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:22:22'),
(980, '2025-09-24 03:22:36', '2025-09-24 03:22:36', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:22:36'),
(981, '2025-09-24 03:22:38', '2025-09-24 03:22:38', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:22:38'),
(982, '2025-09-24 03:23:48', '2025-09-24 03:23:48', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:23:48'),
(983, '2025-09-24 03:23:49', '2025-09-24 03:23:49', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:23:49'),
(984, '2025-09-24 03:23:50', '2025-09-24 03:23:50', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:23:50'),
(985, '2025-09-24 03:23:50', '2025-09-24 03:23:50', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:23:50'),
(986, '2025-09-24 03:23:52', '2025-09-24 03:23:52', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:23:52'),
(987, '2025-09-24 03:23:53', '2025-09-24 03:23:53', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:23:53'),
(988, '2025-09-24 03:23:54', '2025-09-24 03:23:54', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:23:54'),
(989, '2025-09-24 03:23:55', '2025-09-24 03:23:55', 78, '44187263', 'view', '{}', NULL, '2025-09-24 03:23:55'),
(990, '2025-09-24 03:23:55', '2025-09-24 03:23:55', 78, '44187263', 'view', '{}', NULL, '2025-09-24 03:23:55'),
(991, '2025-09-24 03:24:00', '2025-09-24 03:24:00', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:24:00'),
(992, '2025-09-24 03:24:19', '2025-09-24 03:24:19', 74, '44187263', 'view', '{}', NULL, '2025-09-24 03:24:19'),
(993, '2025-09-24 03:24:19', '2025-09-24 03:24:19', 78, '44187263', 'view', '{}', NULL, '2025-09-24 03:24:19'),
(994, '2025-09-24 03:24:29', '2025-09-24 03:24:29', 78, '44187263', 'view', '{}', NULL, '2025-09-24 03:24:29'),
(995, '2025-09-24 03:24:29', '2025-09-24 03:24:29', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:24:29'),
(996, '2025-09-24 03:24:30', '2025-09-24 03:24:30', 79, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:24:30'),
(997, '2025-09-24 03:24:31', '2025-09-24 03:24:31', 79, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:24:31'),
(998, '2025-09-24 03:26:20', '2025-09-24 03:26:20', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:26:20'),
(999, '2025-09-24 03:26:20', '2025-09-24 03:26:20', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:26:20'),
(1000, '2025-09-24 03:26:20', '2025-09-24 03:26:20', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:26:20'),
(1001, '2025-09-24 03:26:21', '2025-09-24 03:26:21', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:26:21'),
(1002, '2025-09-24 03:26:21', '2025-09-24 03:26:21', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:26:21'),
(1003, '2025-09-24 03:26:22', '2025-09-24 03:26:22', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:26:22'),
(1004, '2025-09-24 03:26:39', '2025-09-24 03:26:39', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:26:39'),
(1005, '2025-09-24 03:26:47', '2025-09-24 03:26:47', 80, '43537113', 'view', '{}', NULL, '2025-09-24 03:26:47'),
(1006, '2025-09-24 03:26:47', '2025-09-24 03:26:47', 79, '43537113', 'view', '{}', NULL, '2025-09-24 03:26:47'),
(1007, '2025-09-24 03:26:48', '2025-09-24 03:26:48', 80, '43537113', 'view', '{}', NULL, '2025-09-24 03:26:48'),
(1008, '2025-09-24 03:26:48', '2025-09-24 03:26:48', 80, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:26:48'),
(1009, '2025-09-24 03:26:48', '2025-09-24 03:26:48', 79, '43537113', 'view', '{}', NULL, '2025-09-24 03:26:48'),
(1010, '2025-09-24 03:26:50', '2025-09-24 03:26:50', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:26:50'),
(1011, '2025-09-24 03:26:50', '2025-09-24 03:26:50', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:26:50'),
(1012, '2025-09-24 03:26:52', '2025-09-24 03:26:52', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:26:52'),
(1013, '2025-09-24 03:26:54', '2025-09-24 03:26:54', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:26:54'),
(1014, '2025-09-24 03:26:54', '2025-09-24 03:26:54', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:26:54'),
(1015, '2025-09-24 03:26:55', '2025-09-24 03:26:55', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:26:55'),
(1016, '2025-09-24 03:26:57', '2025-09-24 03:26:57', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:26:57'),
(1017, '2025-09-24 03:26:58', '2025-09-24 03:26:58', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:26:58'),
(1018, '2025-09-24 03:26:59', '2025-09-24 03:26:59', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:26:59'),
(1019, '2025-09-24 03:27:02', '2025-09-24 03:27:02', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:27:02'),
(1020, '2025-09-24 03:27:02', '2025-09-24 03:27:02', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:27:02'),
(1021, '2025-09-24 03:27:02', '2025-09-24 03:27:02', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:27:02'),
(1022, '2025-09-24 03:27:07', '2025-09-24 03:27:07', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:27:07'),
(1023, '2025-09-24 03:27:07', '2025-09-24 03:27:07', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:27:07'),
(1024, '2025-09-24 03:27:07', '2025-09-24 03:27:07', 78, '44187263', 'view', '{}', NULL, '2025-09-24 03:27:07'),
(1025, '2025-09-24 03:27:08', '2025-09-24 03:27:08', 74, '44187263', 'view', '{}', NULL, '2025-09-24 03:27:08'),
(1026, '2025-09-24 03:27:09', '2025-09-24 03:27:09', 74, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:27:09'),
(1027, '2025-09-24 03:27:10', '2025-09-24 03:27:10', 78, '44187263', 'view', '{}', NULL, '2025-09-24 03:27:10'),
(1028, '2025-09-24 03:27:10', '2025-09-24 03:27:10', 74, '44187263', 'view', '{}', NULL, '2025-09-24 03:27:10'),
(1029, '2025-09-24 03:27:10', '2025-09-24 03:27:10', 73, '44187263', 'view', '{}', NULL, '2025-09-24 03:27:10'),
(1030, '2025-09-24 03:27:11', '2025-09-24 03:27:11', 73, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:27:11'),
(1031, '2025-09-24 03:27:11', '2025-09-24 03:27:11', 74, '44187263', 'view', '{}', NULL, '2025-09-24 03:27:11'),
(1032, '2025-09-24 03:27:12', '2025-09-24 03:27:12', 78, '44187263', 'view', '{}', NULL, '2025-09-24 03:27:12'),
(1033, '2025-09-24 03:27:12', '2025-09-24 03:27:12', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:27:12'),
(1034, '2025-09-24 03:27:13', '2025-09-24 03:27:13', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:27:13'),
(1035, '2025-09-24 03:27:13', '2025-09-24 03:27:13', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:27:13'),
(1036, '2025-09-24 03:27:14', '2025-09-24 03:27:14', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:27:14'),
(1037, '2025-09-24 03:27:16', '2025-09-24 03:27:16', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:27:16'),
(1038, '2025-09-24 03:27:23', '2025-09-24 03:27:23', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:27:23'),
(1039, '2025-09-24 03:27:23', '2025-09-24 03:27:23', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:27:23'),
(1040, '2025-09-24 03:27:23', '2025-09-24 03:27:23', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:27:23'),
(1041, '2025-09-24 03:27:24', '2025-09-24 03:27:24', 80, '44187263', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-24 03:27:24'),
(1042, '2025-09-24 03:27:24', '2025-09-24 03:27:24', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:27:24'),
(1043, '2025-09-24 03:31:03', '2025-09-24 03:31:03', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:31:03'),
(1044, '2025-09-24 03:31:04', '2025-09-24 03:31:04', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:31:04'),
(1045, '2025-09-24 03:31:04', '2025-09-24 03:31:04', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:31:04'),
(1046, '2025-09-24 03:31:05', '2025-09-24 03:31:05', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:31:05'),
(1047, '2025-09-24 03:31:05', '2025-09-24 03:31:05', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:31:05'),
(1048, '2025-09-24 03:31:05', '2025-09-24 03:31:05', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:31:05'),
(1049, '2025-09-24 03:31:05', '2025-09-24 03:31:05', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:31:05'),
(1050, '2025-09-24 03:31:05', '2025-09-24 03:31:05', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:31:05'),
(1051, '2025-09-24 03:31:06', '2025-09-24 03:31:06', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:31:06'),
(1052, '2025-09-24 03:31:06', '2025-09-24 03:31:06', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:31:06'),
(1053, '2025-09-24 03:31:06', '2025-09-24 03:31:06', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:31:06'),
(1054, '2025-09-24 03:31:09', '2025-09-24 03:31:09', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:31:09'),
(1055, '2025-09-24 03:31:09', '2025-09-24 03:31:09', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:31:09'),
(1056, '2025-09-24 03:31:10', '2025-09-24 03:31:10', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:31:10'),
(1057, '2025-09-24 03:34:46', '2025-09-24 03:34:46', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:34:46'),
(1058, '2025-09-24 03:35:22', '2025-09-24 03:35:22', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:35:22'),
(1059, '2025-09-24 03:35:23', '2025-09-24 03:35:23', 74, '44187263', 'view', '{}', NULL, '2025-09-24 03:35:23'),
(1060, '2025-09-24 03:35:23', '2025-09-24 03:35:23', 73, '44187263', 'view', '{}', NULL, '2025-09-24 03:35:23'),
(1061, '2025-09-24 03:35:23', '2025-09-24 03:35:23', 72, '44187263', 'view', '{}', NULL, '2025-09-24 03:35:23'),
(1062, '2025-09-24 03:35:24', '2025-09-24 03:35:24', 71, '44187263', 'view', '{}', NULL, '2025-09-24 03:35:24'),
(1063, '2025-09-24 03:37:06', '2025-09-24 03:37:06', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:37:06'),
(1064, '2025-09-24 03:37:07', '2025-09-24 03:37:07', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:37:07'),
(1065, '2025-09-24 03:37:07', '2025-09-24 03:37:07', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:37:07'),
(1066, '2025-09-24 03:37:07', '2025-09-24 03:37:07', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:37:07'),
(1067, '2025-09-24 03:37:08', '2025-09-24 03:37:08', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:37:08'),
(1068, '2025-09-24 03:37:08', '2025-09-24 03:37:08', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:37:08'),
(1069, '2025-09-24 03:37:08', '2025-09-24 03:37:08', 78, '44187263', 'view', '{}', NULL, '2025-09-24 03:37:08'),
(1070, '2025-09-24 03:38:33', '2025-09-24 03:38:33', 78, '44187263', 'view', '{}', NULL, '2025-09-24 03:38:33'),
(1071, '2025-09-24 03:38:35', '2025-09-24 03:38:35', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:38:35'),
(1072, '2025-09-24 03:38:36', '2025-09-24 03:38:36', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:38:36'),
(1073, '2025-09-24 03:38:39', '2025-09-24 03:38:39', 78, '44187263', 'view', '{}', NULL, '2025-09-24 03:38:39'),
(1074, '2025-09-24 03:38:39', '2025-09-24 03:38:39', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:38:39'),
(1075, '2025-09-24 03:38:40', '2025-09-24 03:38:40', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:38:40'),
(1076, '2025-09-24 03:38:40', '2025-09-24 03:38:40', 80, '44187263', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-09-24 03:38:40'),
(1077, '2025-09-24 03:38:40', '2025-09-24 03:38:40', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:38:40'),
(1078, '2025-09-24 03:38:40', '2025-09-24 03:38:40', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:38:40'),
(1079, '2025-09-24 03:38:41', '2025-09-24 03:38:41', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:38:41'),
(1080, '2025-09-24 03:38:41', '2025-09-24 03:38:41', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:38:41'),
(1081, '2025-09-24 03:38:41', '2025-09-24 03:38:41', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:38:41'),
(1082, '2025-09-24 03:38:42', '2025-09-24 03:38:42', 78, '44187263', 'view', '{}', NULL, '2025-09-24 03:38:42'),
(1083, '2025-09-24 03:38:42', '2025-09-24 03:38:42', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:38:42'),
(1084, '2025-09-24 03:38:43', '2025-09-24 03:38:43', 79, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:38:43'),
(1085, '2025-09-24 03:38:43', '2025-09-24 03:38:43', 78, '44187263', 'view', '{}', NULL, '2025-09-24 03:38:43'),
(1086, '2025-09-24 03:38:44', '2025-09-24 03:38:44', 78, '44187263', 'view', '{}', NULL, '2025-09-24 03:38:44'),
(1087, '2025-09-24 03:38:44', '2025-09-24 03:38:44', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:38:44'),
(1088, '2025-09-24 03:38:44', '2025-09-24 03:38:44', 79, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:38:44'),
(1089, '2025-09-24 03:38:44', '2025-09-24 03:38:44', 78, '44187263', 'view', '{}', NULL, '2025-09-24 03:38:44'),
(1090, '2025-09-24 03:38:44', '2025-09-24 03:38:44', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:38:44'),
(1091, '2025-09-24 03:38:45', '2025-09-24 03:38:45', 78, '44187263', 'view', '{}', NULL, '2025-09-24 03:38:45'),
(1092, '2025-09-24 03:39:37', '2025-09-24 03:39:37', 78, '44187263', 'view', '{}', NULL, '2025-09-24 03:39:37'),
(1093, '2025-09-24 03:40:18', '2025-09-24 03:40:18', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:40:18'),
(1094, '2025-09-24 03:40:19', '2025-09-24 03:40:19', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:40:19'),
(1095, '2025-09-24 03:40:19', '2025-09-24 03:40:19', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:40:19'),
(1096, '2025-09-24 03:40:20', '2025-09-24 03:40:20', 80, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 03:40:20'),
(1097, '2025-09-24 03:40:20', '2025-09-24 03:40:20', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:40:20'),
(1098, '2025-09-24 03:40:20', '2025-09-24 03:40:20', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:40:20'),
(1099, '2025-09-24 03:40:20', '2025-09-24 03:40:20', 80, '44187263', 'view', '{}', NULL, '2025-09-24 03:40:20'),
(1100, '2025-09-24 03:40:20', '2025-09-24 03:40:20', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:40:20'),
(1101, '2025-09-24 03:40:21', '2025-09-24 03:40:21', 78, '44187263', 'view', '{}', NULL, '2025-09-24 03:40:21'),
(1102, '2025-09-24 03:40:51', '2025-09-24 03:40:51', 78, '44187263', 'view', '{}', NULL, '2025-09-24 03:40:51'),
(1103, '2025-09-24 03:40:51', '2025-09-24 03:40:51', 79, '44187263', 'view', '{}', NULL, '2025-09-24 03:40:51'),
(1104, '2025-09-24 14:15:02', '2025-09-24 14:15:02', 80, '44187263', 'view', '{}', NULL, '2025-09-24 14:15:02'),
(1105, '2025-09-24 14:15:17', '2025-09-24 14:15:17', 74, '44187263', 'view', '{}', NULL, '2025-09-24 14:15:17'),
(1106, '2025-09-24 14:15:17', '2025-09-24 14:15:17', 78, '44187263', 'view', '{}', NULL, '2025-09-24 14:15:17'),
(1107, '2025-09-24 14:15:18', '2025-09-24 14:15:18', 79, '44187263', 'view', '{}', NULL, '2025-09-24 14:15:18'),
(1108, '2025-09-24 14:15:18', '2025-09-24 14:15:18', 80, '44187263', 'view', '{}', NULL, '2025-09-24 14:15:18'),
(1109, '2025-09-24 14:16:35', '2025-09-24 14:16:35', 81, '44187263', 'view', '{}', NULL, '2025-09-24 14:16:35'),
(1110, '2025-09-24 14:16:45', '2025-09-24 14:16:45', 80, '44187263', 'view', '{}', NULL, '2025-09-24 14:16:45'),
(1111, '2025-09-24 14:16:45', '2025-09-24 14:16:45', 81, '44187263', 'view', '{}', NULL, '2025-09-24 14:16:45'),
(1112, '2025-09-24 14:16:45', '2025-09-24 14:16:45', 82, '44187263', 'view', '{}', NULL, '2025-09-24 14:16:45'),
(1113, '2025-09-24 14:27:00', '2025-09-24 14:27:00', 82, '43537113', 'view', '{}', NULL, '2025-09-24 14:27:00'),
(1114, '2025-09-24 14:27:13', '2025-09-24 14:27:13', 83, '43537113', 'view', '{}', NULL, '2025-09-24 14:27:13'),
(1115, '2025-09-24 14:27:14', '2025-09-24 14:27:14', 82, '43537113', 'view', '{}', NULL, '2025-09-24 14:27:14'),
(1116, '2025-09-24 14:27:14', '2025-09-24 14:27:14', 81, '43537113', 'view', '{}', NULL, '2025-09-24 14:27:14'),
(1117, '2025-09-24 14:29:17', '2025-09-24 14:29:17', 83, '43537113', 'view', '{}', NULL, '2025-09-24 14:29:17'),
(1118, '2025-09-24 14:31:49', '2025-09-24 14:31:49', 83, '43537113', 'view', '{}', NULL, '2025-09-24 14:31:49'),
(1119, '2025-09-24 14:33:52', '2025-09-24 14:33:52', 83, '43537113', 'view', '{}', NULL, '2025-09-24 14:33:52'),
(1120, '2025-09-24 14:33:56', '2025-09-24 14:33:56', 82, '43537113', 'view', '{}', NULL, '2025-09-24 14:33:56'),
(1121, '2025-09-24 14:33:56', '2025-09-24 14:33:56', 83, '43537113', 'view', '{}', NULL, '2025-09-24 14:33:56'),
(1122, '2025-09-24 14:33:57', '2025-09-24 14:33:57', 83, '43537113', 'view', '{}', NULL, '2025-09-24 14:33:57'),
(1123, '2025-09-24 14:34:01', '2025-09-24 14:34:01', 83, '43537113', 'view', '{}', NULL, '2025-09-24 14:34:01'),
(1124, '2025-09-24 14:34:01', '2025-09-24 14:34:01', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 14:34:01'),
(1125, '2025-09-24 14:34:02', '2025-09-24 14:34:02', 83, '43537113', 'view', '{}', NULL, '2025-09-24 14:34:02'),
(1126, '2025-09-24 14:34:02', '2025-09-24 14:34:02', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-09-24 14:34:02'),
(1127, '2025-09-24 14:34:07', '2025-09-24 14:34:07', 82, '43537113', 'view', '{}', NULL, '2025-09-24 14:34:07'),
(1128, '2025-09-24 14:34:07', '2025-09-24 14:34:07', 82, '43537113', 'view', '{}', NULL, '2025-09-24 14:34:07'),
(1129, '2025-09-24 14:34:22', '2025-09-24 14:34:22', 82, '43537113', 'view', '{}', NULL, '2025-09-24 14:34:22'),
(1130, '2025-09-24 14:34:22', '2025-09-24 14:34:22', 83, '43537113', 'view', '{}', NULL, '2025-09-24 14:34:22'),
(1131, '2025-09-24 14:47:22', '2025-09-24 14:47:22', 83, '43537113', 'view', '{}', NULL, '2025-09-24 14:47:22'),
(1132, '2025-09-24 14:47:25', '2025-09-24 14:47:25', 82, '43537113', 'view', '{}', NULL, '2025-09-24 14:47:25'),
(1133, '2025-09-24 14:48:06', '2025-09-24 14:48:06', 83, '43537113', 'view', '{}', NULL, '2025-09-24 14:48:06'),
(1134, '2025-09-24 14:48:29', '2025-09-24 14:48:29', 83, '43537113', 'view', '{}', NULL, '2025-09-24 14:48:29'),
(1135, '2025-10-09 06:32:07', '2025-10-09 06:32:07', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:32:07'),
(1136, '2025-10-09 06:37:10', '2025-10-09 06:37:10', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:37:10'),
(1137, '2025-10-09 06:37:12', '2025-10-09 06:37:12', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:37:12'),
(1138, '2025-10-09 06:37:58', '2025-10-09 06:37:58', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:37:58'),
(1139, '2025-10-09 06:38:35', '2025-10-09 06:38:35', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:38:35'),
(1140, '2025-10-09 06:38:36', '2025-10-09 06:38:36', 82, '43537113', 'view', '{}', NULL, '2025-10-09 06:38:36'),
(1141, '2025-10-09 06:38:36', '2025-10-09 06:38:36', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:38:36'),
(1142, '2025-10-09 06:38:37', '2025-10-09 06:38:37', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 06:38:37'),
(1143, '2025-10-09 06:38:38', '2025-10-09 06:38:38', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 06:38:38'),
(1144, '2025-10-09 06:38:39', '2025-10-09 06:38:39', 82, '43537113', 'view', '{}', NULL, '2025-10-09 06:38:39'),
(1145, '2025-10-09 06:38:40', '2025-10-09 06:38:40', 81, '43537113', 'view', '{}', NULL, '2025-10-09 06:38:40'),
(1146, '2025-10-09 06:38:43', '2025-10-09 06:38:43', 81, '43537113', 'view', '{}', NULL, '2025-10-09 06:38:43'),
(1147, '2025-10-09 06:38:43', '2025-10-09 06:38:43', 80, '43537113', 'view', '{}', NULL, '2025-10-09 06:38:43'),
(1148, '2025-10-09 06:38:43', '2025-10-09 06:38:43', 81, '43537113', 'view', '{}', NULL, '2025-10-09 06:38:43'),
(1149, '2025-10-09 06:38:45', '2025-10-09 06:38:45', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:38:45'),
(1150, '2025-10-09 06:38:58', '2025-10-09 06:38:58', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:38:58'),
(1151, '2025-10-09 06:39:01', '2025-10-09 06:39:01', 82, '43537113', 'view', '{}', NULL, '2025-10-09 06:39:01'),
(1152, '2025-10-09 06:39:03', '2025-10-09 06:39:03', 80, '43537113', 'view', '{}', NULL, '2025-10-09 06:39:03'),
(1153, '2025-10-09 06:39:03', '2025-10-09 06:39:03', 82, '43537113', 'view', '{}', NULL, '2025-10-09 06:39:03'),
(1154, '2025-10-09 06:39:04', '2025-10-09 06:39:04', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:39:04'),
(1155, '2025-10-09 06:39:07', '2025-10-09 06:39:07', 82, '43537113', 'view', '{}', NULL, '2025-10-09 06:39:07'),
(1156, '2025-10-09 06:39:31', '2025-10-09 06:39:31', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:39:31'),
(1157, '2025-10-09 06:39:33', '2025-10-09 06:39:33', 82, '43537113', 'view', '{}', NULL, '2025-10-09 06:39:33'),
(1158, '2025-10-09 06:39:37', '2025-10-09 06:39:37', 71, '43537113', 'view', '{}', NULL, '2025-10-09 06:39:37'),
(1159, '2025-10-09 06:39:38', '2025-10-09 06:39:38', 74, '43537113', 'view', '{}', NULL, '2025-10-09 06:39:38'),
(1160, '2025-10-09 06:39:40', '2025-10-09 06:39:40', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:39:40'),
(1161, '2025-10-09 06:39:41', '2025-10-09 06:39:41', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:39:41'),
(1162, '2025-10-09 06:39:42', '2025-10-09 06:39:42', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:39:42'),
(1163, '2025-10-09 06:39:44', '2025-10-09 06:39:44', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:39:44'),
(1164, '2025-10-09 06:39:45', '2025-10-09 06:39:45', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:39:45'),
(1165, '2025-10-09 06:39:45', '2025-10-09 06:39:45', 83, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-10-09 06:39:45'),
(1166, '2025-10-09 06:39:46', '2025-10-09 06:39:46', 83, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-10-09 06:39:46'),
(1167, '2025-10-09 06:39:46', '2025-10-09 06:39:46', 83, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-10-09 06:39:46'),
(1168, '2025-10-09 06:39:46', '2025-10-09 06:39:46', 83, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-10-09 06:39:46'),
(1169, '2025-10-09 06:39:46', '2025-10-09 06:39:46', 83, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-10-09 06:39:46'),
(1170, '2025-10-09 06:39:47', '2025-10-09 06:39:47', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:39:47'),
(1171, '2025-10-09 06:39:47', '2025-10-09 06:39:47', 83, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-10-09 06:39:47'),
(1172, '2025-10-09 06:39:47', '2025-10-09 06:39:47', 83, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-10-09 06:39:47'),
(1173, '2025-10-09 06:39:47', '2025-10-09 06:39:47', 83, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-10-09 06:39:47'),
(1174, '2025-10-09 06:39:47', '2025-10-09 06:39:47', 83, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-10-09 06:39:47'),
(1175, '2025-10-09 06:39:47', '2025-10-09 06:39:47', 83, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-10-09 06:39:47'),
(1176, '2025-10-09 06:39:54', '2025-10-09 06:39:54', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:39:54'),
(1177, '2025-10-09 06:39:54', '2025-10-09 06:39:54', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:39:54'),
(1178, '2025-10-09 06:39:55', '2025-10-09 06:39:55', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:39:55'),
(1179, '2025-10-09 06:39:55', '2025-10-09 06:39:55', 83, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-10-09 06:39:55'),
(1180, '2025-10-09 06:39:56', '2025-10-09 06:39:56', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:39:56'),
(1181, '2025-10-09 06:39:56', '2025-10-09 06:39:56', 83, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-10-09 06:39:56'),
(1182, '2025-10-09 06:39:57', '2025-10-09 06:39:57', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:39:57'),
(1183, '2025-10-09 06:39:57', '2025-10-09 06:39:57', 83, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-10-09 06:39:57'),
(1184, '2025-10-09 06:39:58', '2025-10-09 06:39:58', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:39:58'),
(1185, '2025-10-09 06:39:58', '2025-10-09 06:39:58', 83, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-10-09 06:39:58'),
(1186, '2025-10-09 06:39:58', '2025-10-09 06:39:58', 83, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-10-09 06:39:58'),
(1187, '2025-10-09 06:39:58', '2025-10-09 06:39:58', 83, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-10-09 06:39:58'),
(1188, '2025-10-09 06:39:59', '2025-10-09 06:39:59', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:39:59'),
(1189, '2025-10-09 06:39:59', '2025-10-09 06:39:59', 83, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-10-09 06:39:59'),
(1190, '2025-10-09 06:40:01', '2025-10-09 06:40:01', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:40:01'),
(1191, '2025-10-09 06:40:03', '2025-10-09 06:40:03', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:40:03'),
(1192, '2025-10-09 06:40:03', '2025-10-09 06:40:03', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:40:03'),
(1193, '2025-10-09 06:40:04', '2025-10-09 06:40:04', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:40:04'),
(1194, '2025-10-09 06:40:06', '2025-10-09 06:40:06', 83, '43537113', 'click', '{\"elementClicked\":\"share\"}', NULL, '2025-10-09 06:40:06'),
(1195, '2025-10-09 06:40:07', '2025-10-09 06:40:07', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:40:07'),
(1196, '2025-10-09 06:40:31', '2025-10-09 06:40:31', 82, '43537113', 'view', '{}', NULL, '2025-10-09 06:40:31'),
(1197, '2025-10-09 06:40:32', '2025-10-09 06:40:32', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:40:32'),
(1198, '2025-10-09 06:46:38', '2025-10-09 06:46:38', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:46:38'),
(1199, '2025-10-09 06:46:39', '2025-10-09 06:46:39', 82, '43537113', 'view', '{}', NULL, '2025-10-09 06:46:39'),
(1200, '2025-10-09 06:46:39', '2025-10-09 06:46:39', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:46:39'),
(1201, '2025-10-09 06:46:39', '2025-10-09 06:46:39', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 06:46:39'),
(1202, '2025-10-09 06:46:42', '2025-10-09 06:46:42', 82, '43537113', 'view', '{}', NULL, '2025-10-09 06:46:42'),
(1203, '2025-10-09 06:46:42', '2025-10-09 06:46:42', 82, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 06:46:42'),
(1204, '2025-10-09 06:46:43', '2025-10-09 06:46:43', 82, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 06:46:43'),
(1205, '2025-10-09 06:47:01', '2025-10-09 06:47:01', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:47:01'),
(1206, '2025-10-09 06:47:21', '2025-10-09 06:47:21', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:47:21'),
(1207, '2025-10-09 06:48:04', '2025-10-09 06:48:04', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:48:04'),
(1208, '2025-10-09 06:48:07', '2025-10-09 06:48:07', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:48:07'),
(1209, '2025-10-09 06:48:18', '2025-10-09 06:48:18', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:48:18'),
(1210, '2025-10-09 06:48:35', '2025-10-09 06:48:35', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:48:35'),
(1211, '2025-10-09 06:48:37', '2025-10-09 06:48:37', 83, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-10-09 06:48:37'),
(1212, '2025-10-09 06:48:40', '2025-10-09 06:48:40', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:48:40'),
(1213, '2025-10-09 06:49:05', '2025-10-09 06:49:05', 82, '43537113', 'view', '{}', NULL, '2025-10-09 06:49:05'),
(1214, '2025-10-09 06:49:08', '2025-10-09 06:49:08', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:49:08'),
(1215, '2025-10-09 06:49:28', '2025-10-09 06:49:28', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:49:28'),
(1216, '2025-10-09 06:49:32', '2025-10-09 06:49:32', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:49:32'),
(1217, '2025-10-09 06:49:37', '2025-10-09 06:49:37', 82, '43537113', 'view', '{}', NULL, '2025-10-09 06:49:37'),
(1218, '2025-10-09 06:49:37', '2025-10-09 06:49:37', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:49:37'),
(1219, '2025-10-09 06:49:45', '2025-10-09 06:49:45', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:49:45'),
(1220, '2025-10-09 06:49:49', '2025-10-09 06:49:49', 82, '43537113', 'view', '{}', NULL, '2025-10-09 06:49:49'),
(1221, '2025-10-09 06:49:55', '2025-10-09 06:49:55', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:49:55'),
(1222, '2025-10-09 06:49:56', '2025-10-09 06:49:56', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 06:49:56'),
(1223, '2025-10-09 06:49:56', '2025-10-09 06:49:56', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:49:56'),
(1224, '2025-10-09 06:49:57', '2025-10-09 06:49:57', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 06:49:57'),
(1225, '2025-10-09 06:51:46', '2025-10-09 06:51:46', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:51:46'),
(1226, '2025-10-09 06:51:46', '2025-10-09 06:51:46', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 06:51:46'),
(1227, '2025-10-09 06:51:47', '2025-10-09 06:51:47', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 06:51:47'),
(1228, '2025-10-09 06:52:22', '2025-10-09 06:52:22', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:52:22'),
(1229, '2025-10-09 06:52:34', '2025-10-09 06:52:34', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:52:34'),
(1230, '2025-10-09 06:52:35', '2025-10-09 06:52:35', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 06:52:35'),
(1231, '2025-10-09 06:52:35', '2025-10-09 06:52:35', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 06:52:35'),
(1232, '2025-10-09 06:55:45', '2025-10-09 06:55:45', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:55:45'),
(1233, '2025-10-09 06:55:47', '2025-10-09 06:55:47', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:55:47'),
(1234, '2025-10-09 06:55:48', '2025-10-09 06:55:48', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 06:55:48'),
(1235, '2025-10-09 06:55:49', '2025-10-09 06:55:49', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:55:49'),
(1236, '2025-10-09 06:55:49', '2025-10-09 06:55:49', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 06:55:49'),
(1237, '2025-10-09 06:55:50', '2025-10-09 06:55:50', 82, '43537113', 'view', '{}', NULL, '2025-10-09 06:55:50'),
(1238, '2025-10-09 06:55:51', '2025-10-09 06:55:51', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:55:51'),
(1239, '2025-10-09 06:55:51', '2025-10-09 06:55:51', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 06:55:51'),
(1240, '2025-10-09 06:55:52', '2025-10-09 06:55:52', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:55:52'),
(1241, '2025-10-09 06:55:52', '2025-10-09 06:55:52', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 06:55:52'),
(1242, '2025-10-09 06:56:10', '2025-10-09 06:56:10', 82, '43537113', 'view', '{}', NULL, '2025-10-09 06:56:10'),
(1243, '2025-10-09 06:56:10', '2025-10-09 06:56:10', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:56:10'),
(1244, '2025-10-09 06:56:11', '2025-10-09 06:56:11', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 06:56:11'),
(1245, '2025-10-09 06:56:11', '2025-10-09 06:56:11', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 06:56:11'),
(1246, '2025-10-09 06:56:18', '2025-10-09 06:56:18', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:56:18'),
(1247, '2025-10-09 06:56:20', '2025-10-09 06:56:20', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:56:20'),
(1248, '2025-10-09 06:56:20', '2025-10-09 06:56:20', 82, '43537113', 'view', '{}', NULL, '2025-10-09 06:56:20'),
(1249, '2025-10-09 06:56:26', '2025-10-09 06:56:26', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:56:26'),
(1250, '2025-10-09 06:56:29', '2025-10-09 06:56:29', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:56:29'),
(1251, '2025-10-09 06:56:45', '2025-10-09 06:56:45', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:56:45'),
(1252, '2025-10-09 06:57:53', '2025-10-09 06:57:53', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:57:53'),
(1253, '2025-10-09 06:57:56', '2025-10-09 06:57:56', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:57:56'),
(1254, '2025-10-09 06:57:57', '2025-10-09 06:57:57', 82, '43537113', 'view', '{}', NULL, '2025-10-09 06:57:57'),
(1255, '2025-10-09 06:57:57', '2025-10-09 06:57:57', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:57:57'),
(1256, '2025-10-09 06:57:57', '2025-10-09 06:57:57', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 06:57:57'),
(1257, '2025-10-09 06:57:58', '2025-10-09 06:57:58', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:57:58'),
(1258, '2025-10-09 06:57:58', '2025-10-09 06:57:58', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 06:57:58'),
(1259, '2025-10-09 06:57:58', '2025-10-09 06:57:58', 82, '43537113', 'view', '{}', NULL, '2025-10-09 06:57:58'),
(1260, '2025-10-09 06:59:48', '2025-10-09 06:59:48', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:59:48'),
(1261, '2025-10-09 06:59:48', '2025-10-09 06:59:48', 83, '43537113', 'view', '{}', NULL, '2025-10-09 06:59:48'),
(1262, '2025-10-09 06:59:49', '2025-10-09 06:59:49', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 06:59:49'),
(1263, '2025-10-09 06:59:49', '2025-10-09 06:59:49', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 06:59:49'),
(1264, '2025-10-09 07:01:06', '2025-10-09 07:01:06', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:01:06'),
(1265, '2025-10-09 07:01:07', '2025-10-09 07:01:07', 82, '43537113', 'view', '{}', NULL, '2025-10-09 07:01:07'),
(1266, '2025-10-09 07:01:07', '2025-10-09 07:01:07', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:01:07'),
(1267, '2025-10-09 07:01:08', '2025-10-09 07:01:08', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:01:08'),
(1268, '2025-10-09 07:01:09', '2025-10-09 07:01:09', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:01:09'),
(1269, '2025-10-09 07:01:13', '2025-10-09 07:01:13', 82, '43537113', 'view', '{}', NULL, '2025-10-09 07:01:13'),
(1270, '2025-10-09 07:01:13', '2025-10-09 07:01:13', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:01:13'),
(1271, '2025-10-09 07:01:14', '2025-10-09 07:01:14', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:01:14'),
(1272, '2025-10-09 07:01:14', '2025-10-09 07:01:14', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:01:14'),
(1273, '2025-10-09 07:01:15', '2025-10-09 07:01:15', 82, '43537113', 'view', '{}', NULL, '2025-10-09 07:01:15'),
(1274, '2025-10-09 07:01:16', '2025-10-09 07:01:16', 82, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:01:16'),
(1275, '2025-10-09 07:01:16', '2025-10-09 07:01:16', 82, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:01:16'),
(1276, '2025-10-09 07:01:16', '2025-10-09 07:01:16', 82, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:01:16'),
(1277, '2025-10-09 07:01:16', '2025-10-09 07:01:16', 82, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:01:16'),
(1278, '2025-10-09 07:01:16', '2025-10-09 07:01:16', 82, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:01:16'),
(1279, '2025-10-09 07:01:17', '2025-10-09 07:01:17', 82, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:01:17'),
(1280, '2025-10-09 07:01:18', '2025-10-09 07:01:18', 82, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:01:18'),
(1281, '2025-10-09 07:01:18', '2025-10-09 07:01:18', 82, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:01:18'),
(1282, '2025-10-09 07:01:22', '2025-10-09 07:01:22', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:01:22'),
(1283, '2025-10-09 07:01:22', '2025-10-09 07:01:22', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:01:22'),
(1284, '2025-10-09 07:01:22', '2025-10-09 07:01:22', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:01:22'),
(1285, '2025-10-09 07:01:23', '2025-10-09 07:01:23', 82, '43537113', 'view', '{}', NULL, '2025-10-09 07:01:23'),
(1286, '2025-10-09 07:02:01', '2025-10-09 07:02:01', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:02:01'),
(1287, '2025-10-09 07:02:01', '2025-10-09 07:02:01', 82, '43537113', 'view', '{}', NULL, '2025-10-09 07:02:01'),
(1288, '2025-10-09 07:02:01', '2025-10-09 07:02:01', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:02:01'),
(1289, '2025-10-09 07:02:05', '2025-10-09 07:02:05', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:02:05'),
(1290, '2025-10-09 07:02:06', '2025-10-09 07:02:06', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:02:06'),
(1291, '2025-10-09 07:02:07', '2025-10-09 07:02:07', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:02:07'),
(1292, '2025-10-09 07:02:11', '2025-10-09 07:02:11', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:02:11'),
(1293, '2025-10-09 07:02:11', '2025-10-09 07:02:11', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:02:11'),
(1294, '2025-10-09 07:02:12', '2025-10-09 07:02:12', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:02:12'),
(1295, '2025-10-09 07:03:23', '2025-10-09 07:03:23', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:03:23'),
(1296, '2025-10-09 07:03:25', '2025-10-09 07:03:25', 82, '43537113', 'view', '{}', NULL, '2025-10-09 07:03:25'),
(1297, '2025-10-09 07:05:38', '2025-10-09 07:05:38', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:05:38'),
(1298, '2025-10-09 07:05:39', '2025-10-09 07:05:39', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:05:39'),
(1299, '2025-10-09 07:05:52', '2025-10-09 07:05:52', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:05:52'),
(1300, '2025-10-09 07:05:55', '2025-10-09 07:05:55', 82, '43537113', 'view', '{}', NULL, '2025-10-09 07:05:55'),
(1301, '2025-10-09 07:05:55', '2025-10-09 07:05:55', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:05:55'),
(1302, '2025-10-09 07:05:55', '2025-10-09 07:05:55', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:05:55'),
(1303, '2025-10-09 07:05:56', '2025-10-09 07:05:56', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:05:56'),
(1304, '2025-10-09 07:05:56', '2025-10-09 07:05:56', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:05:56'),
(1305, '2025-10-09 07:05:57', '2025-10-09 07:05:57', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:05:57'),
(1306, '2025-10-09 07:05:57', '2025-10-09 07:05:57', 82, '43537113', 'view', '{}', NULL, '2025-10-09 07:05:57'),
(1307, '2025-10-09 07:08:50', '2025-10-09 07:08:50', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:08:50'),
(1308, '2025-10-09 07:08:51', '2025-10-09 07:08:51', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:08:51'),
(1309, '2025-10-09 07:08:52', '2025-10-09 07:08:52', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:08:52'),
(1310, '2025-10-09 07:08:52', '2025-10-09 07:08:52', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:08:52'),
(1311, '2025-10-09 07:08:52', '2025-10-09 07:08:52', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:08:52'),
(1312, '2025-10-09 07:08:53', '2025-10-09 07:08:53', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:08:53'),
(1313, '2025-10-09 07:08:53', '2025-10-09 07:08:53', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:08:53'),
(1314, '2025-10-09 07:08:53', '2025-10-09 07:08:53', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:08:53'),
(1315, '2025-10-09 07:08:53', '2025-10-09 07:08:53', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:08:53'),
(1316, '2025-10-09 07:08:53', '2025-10-09 07:08:53', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:08:53'),
(1317, '2025-10-09 07:08:54', '2025-10-09 07:08:54', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:08:54'),
(1318, '2025-10-09 07:08:54', '2025-10-09 07:08:54', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:08:54'),
(1319, '2025-10-09 07:08:54', '2025-10-09 07:08:54', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:08:54');
INSERT INTO `announcement_analytics` (`id`, `created_at`, `updated_at`, `announcement_id`, `user_id`, `event_type`, `event_data`, `session_id`, `timestamp`) VALUES
(1320, '2025-10-09 07:08:54', '2025-10-09 07:08:54', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:08:54'),
(1321, '2025-10-09 07:08:54', '2025-10-09 07:08:54', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:08:54'),
(1322, '2025-10-09 07:08:54', '2025-10-09 07:08:54', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:08:54'),
(1323, '2025-10-09 07:08:55', '2025-10-09 07:08:55', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:08:55'),
(1324, '2025-10-09 07:08:55', '2025-10-09 07:08:55', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:08:55'),
(1325, '2025-10-09 07:08:55', '2025-10-09 07:08:55', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:08:55'),
(1326, '2025-10-09 07:08:55', '2025-10-09 07:08:55', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:08:55'),
(1327, '2025-10-09 07:08:55', '2025-10-09 07:08:55', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:08:55'),
(1328, '2025-10-09 07:08:56', '2025-10-09 07:08:56', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:08:56'),
(1329, '2025-10-09 07:08:56', '2025-10-09 07:08:56', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:08:56'),
(1330, '2025-10-09 07:08:56', '2025-10-09 07:08:56', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:08:56'),
(1331, '2025-10-09 07:08:56', '2025-10-09 07:08:56', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:08:56'),
(1332, '2025-10-09 07:08:56', '2025-10-09 07:08:56', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:08:56'),
(1333, '2025-10-09 07:08:56', '2025-10-09 07:08:56', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:08:56'),
(1334, '2025-10-09 07:08:57', '2025-10-09 07:08:57', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:08:57'),
(1335, '2025-10-09 07:08:58', '2025-10-09 07:08:58', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:08:58'),
(1336, '2025-10-09 07:08:59', '2025-10-09 07:08:59', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:08:59'),
(1337, '2025-10-09 07:09:03', '2025-10-09 07:09:03', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:09:03'),
(1338, '2025-10-09 07:09:04', '2025-10-09 07:09:04', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:09:04'),
(1339, '2025-10-09 07:09:04', '2025-10-09 07:09:04', 82, '43537113', 'view', '{}', NULL, '2025-10-09 07:09:04'),
(1340, '2025-10-09 07:09:05', '2025-10-09 07:09:05', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:09:05'),
(1341, '2025-10-09 07:09:06', '2025-10-09 07:09:06', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:09:06'),
(1342, '2025-10-09 07:09:06', '2025-10-09 07:09:06', 82, '43537113', 'view', '{}', NULL, '2025-10-09 07:09:06'),
(1343, '2025-10-09 07:09:06', '2025-10-09 07:09:06', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:09:06'),
(1344, '2025-10-09 07:09:07', '2025-10-09 07:09:07', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:09:07'),
(1345, '2025-10-09 07:09:07', '2025-10-09 07:09:07', 82, '43537113', 'view', '{}', NULL, '2025-10-09 07:09:07'),
(1346, '2025-10-09 07:09:07', '2025-10-09 07:09:07', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:09:07'),
(1347, '2025-10-09 07:09:08', '2025-10-09 07:09:08', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:09:08'),
(1348, '2025-10-09 07:09:10', '2025-10-09 07:09:10', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:09:10'),
(1349, '2025-10-09 07:09:11', '2025-10-09 07:09:11', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:09:11'),
(1350, '2025-10-09 07:09:12', '2025-10-09 07:09:12', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:09:12'),
(1351, '2025-10-09 07:09:13', '2025-10-09 07:09:13', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:09:13'),
(1352, '2025-10-09 07:09:13', '2025-10-09 07:09:13', 82, '43537113', 'view', '{}', NULL, '2025-10-09 07:09:13'),
(1353, '2025-10-09 07:09:21', '2025-10-09 07:09:21', 82, '43537113', 'view', '{}', NULL, '2025-10-09 07:09:21'),
(1354, '2025-10-09 07:09:21', '2025-10-09 07:09:21', 82, '43537113', 'view', '{}', NULL, '2025-10-09 07:09:21'),
(1355, '2025-10-09 07:09:32', '2025-10-09 07:09:32', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:09:32'),
(1356, '2025-10-09 07:09:45', '2025-10-09 07:09:45', 82, '43537113', 'view', '{}', NULL, '2025-10-09 07:09:45'),
(1357, '2025-10-09 07:09:45', '2025-10-09 07:09:45', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:09:45'),
(1358, '2025-10-09 07:09:48', '2025-10-09 07:09:48', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:09:48'),
(1359, '2025-10-09 07:10:11', '2025-10-09 07:10:11', 82, '43537113', 'view', '{}', NULL, '2025-10-09 07:10:11'),
(1360, '2025-10-09 07:10:13', '2025-10-09 07:10:13', 82, '43537113', 'view', '{}', NULL, '2025-10-09 07:10:13'),
(1361, '2025-10-09 07:10:29', '2025-10-09 07:10:29', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:10:29'),
(1362, '2025-10-09 07:10:30', '2025-10-09 07:10:30', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:10:30'),
(1363, '2025-10-09 07:10:31', '2025-10-09 07:10:31', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:10:31'),
(1364, '2025-10-09 07:10:31', '2025-10-09 07:10:31', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:10:31'),
(1365, '2025-10-09 07:10:31', '2025-10-09 07:10:31', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:10:31'),
(1366, '2025-10-09 07:10:32', '2025-10-09 07:10:32', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:10:32'),
(1367, '2025-10-09 07:10:32', '2025-10-09 07:10:32', 82, '43537113', 'view', '{}', NULL, '2025-10-09 07:10:32'),
(1368, '2025-10-09 07:10:33', '2025-10-09 07:10:33', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:10:33'),
(1369, '2025-10-09 07:10:35', '2025-10-09 07:10:35', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:10:35'),
(1370, '2025-10-09 07:10:36', '2025-10-09 07:10:36', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:10:36'),
(1371, '2025-10-09 07:10:37', '2025-10-09 07:10:37', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:10:37'),
(1372, '2025-10-09 07:10:37', '2025-10-09 07:10:37', 82, '43537113', 'view', '{}', NULL, '2025-10-09 07:10:37'),
(1373, '2025-10-09 07:12:58', '2025-10-09 07:12:58', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:12:58'),
(1374, '2025-10-09 07:13:11', '2025-10-09 07:13:11', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:13:11'),
(1375, '2025-10-09 07:13:11', '2025-10-09 07:13:11', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:13:11'),
(1376, '2025-10-09 07:13:24', '2025-10-09 07:13:24', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:13:24'),
(1377, '2025-10-09 07:13:25', '2025-10-09 07:13:25', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:13:25'),
(1378, '2025-10-09 07:13:27', '2025-10-09 07:13:27', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:13:27'),
(1379, '2025-10-09 07:13:28', '2025-10-09 07:13:28', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:13:28'),
(1380, '2025-10-09 07:13:28', '2025-10-09 07:13:28', 82, '43537113', 'view', '{}', NULL, '2025-10-09 07:13:28'),
(1381, '2025-10-09 07:13:35', '2025-10-09 07:13:35', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:13:35'),
(1382, '2025-10-09 07:13:36', '2025-10-09 07:13:36', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:13:36'),
(1383, '2025-10-09 07:13:37', '2025-10-09 07:13:37', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:13:37'),
(1384, '2025-10-09 07:13:45', '2025-10-09 07:13:45', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:13:45'),
(1385, '2025-10-09 07:13:57', '2025-10-09 07:13:57', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:13:57'),
(1386, '2025-10-09 07:13:58', '2025-10-09 07:13:58', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:13:58'),
(1387, '2025-10-09 07:14:15', '2025-10-09 07:14:15', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:14:15'),
(1388, '2025-10-09 07:14:26', '2025-10-09 07:14:26', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:14:26'),
(1389, '2025-10-09 07:14:27', '2025-10-09 07:14:27', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:14:27'),
(1390, '2025-10-09 07:14:28', '2025-10-09 07:14:28', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:14:28'),
(1391, '2025-10-09 07:14:42', '2025-10-09 07:14:42', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:14:42'),
(1392, '2025-10-09 07:14:42', '2025-10-09 07:14:42', 82, '43537113', 'view', '{}', NULL, '2025-10-09 07:14:42'),
(1393, '2025-10-09 07:15:01', '2025-10-09 07:15:01', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:15:01'),
(1394, '2025-10-09 07:15:07', '2025-10-09 07:15:07', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:15:07'),
(1395, '2025-10-09 07:15:08', '2025-10-09 07:15:08', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:15:08'),
(1396, '2025-10-09 07:15:09', '2025-10-09 07:15:09', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:15:09'),
(1397, '2025-10-09 07:15:09', '2025-10-09 07:15:09', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:15:09'),
(1398, '2025-10-09 07:15:09', '2025-10-09 07:15:09', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:15:09'),
(1399, '2025-10-09 07:15:09', '2025-10-09 07:15:09', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:15:09'),
(1400, '2025-10-09 07:15:10', '2025-10-09 07:15:10', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:15:10'),
(1401, '2025-10-09 07:15:10', '2025-10-09 07:15:10', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:15:10'),
(1402, '2025-10-09 07:15:10', '2025-10-09 07:15:10', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 07:15:10'),
(1403, '2025-10-09 07:41:27', '2025-10-09 07:41:27', 82, '43537113', 'view', '{}', NULL, '2025-10-09 07:41:27'),
(1404, '2025-10-09 07:41:27', '2025-10-09 07:41:27', 83, '43537113', 'view', '{}', NULL, '2025-10-09 07:41:27'),
(1405, '2025-10-09 08:00:14', '2025-10-09 08:00:14', 83, '43537113', 'view', '{}', NULL, '2025-10-09 08:00:14'),
(1406, '2025-10-09 08:00:31', '2025-10-09 08:00:31', 83, '43537113', 'view', '{}', NULL, '2025-10-09 08:00:31'),
(1407, '2025-10-09 08:00:34', '2025-10-09 08:00:34', 83, '43537113', 'view', '{}', NULL, '2025-10-09 08:00:34'),
(1408, '2025-10-09 09:03:49', '2025-10-09 09:03:49', 83, '43537113', 'view', '{}', NULL, '2025-10-09 09:03:49'),
(1409, '2025-10-09 09:03:50', '2025-10-09 09:03:50', 82, '43537113', 'view', '{}', NULL, '2025-10-09 09:03:50'),
(1410, '2025-10-09 09:03:51', '2025-10-09 09:03:51', 83, '43537113', 'view', '{}', NULL, '2025-10-09 09:03:51'),
(1411, '2025-10-09 09:03:54', '2025-10-09 09:03:54', 83, '43537113', 'view', '{}', NULL, '2025-10-09 09:03:54'),
(1412, '2025-10-09 09:03:59', '2025-10-09 09:03:59', 83, '43537113', 'view', '{}', NULL, '2025-10-09 09:03:59'),
(1413, '2025-10-09 09:03:59', '2025-10-09 09:03:59', 83, '43537113', 'view', '{}', NULL, '2025-10-09 09:03:59'),
(1414, '2025-10-09 09:04:00', '2025-10-09 09:04:00', 83, '43537113', 'view', '{}', NULL, '2025-10-09 09:04:00'),
(1415, '2025-10-09 09:04:01', '2025-10-09 09:04:01', 82, '43537113', 'view', '{}', NULL, '2025-10-09 09:04:01'),
(1416, '2025-10-09 09:04:03', '2025-10-09 09:04:03', 82, '43537113', 'view', '{}', NULL, '2025-10-09 09:04:03'),
(1417, '2025-10-09 09:04:03', '2025-10-09 09:04:03', 82, '43537113', 'view', '{}', NULL, '2025-10-09 09:04:03'),
(1418, '2025-10-09 09:20:53', '2025-10-09 09:20:53', 83, '43537113', 'view', '{}', NULL, '2025-10-09 09:20:53'),
(1419, '2025-10-09 09:20:54', '2025-10-09 09:20:54', 83, '43537113', 'view', '{}', NULL, '2025-10-09 09:20:54'),
(1420, '2025-10-09 10:25:04', '2025-10-09 10:25:04', 83, '43537113', 'view', '{}', NULL, '2025-10-09 10:25:04'),
(1421, '2025-10-09 10:25:05', '2025-10-09 10:25:05', 82, '43537113', 'view', '{}', NULL, '2025-10-09 10:25:05'),
(1422, '2025-10-09 10:25:05', '2025-10-09 10:25:05', 83, '43537113', 'view', '{}', NULL, '2025-10-09 10:25:05'),
(1423, '2025-10-09 10:25:06', '2025-10-09 10:25:06', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 10:25:06'),
(1424, '2025-10-09 10:25:06', '2025-10-09 10:25:06', 83, '43537113', 'view', '{}', NULL, '2025-10-09 10:25:06'),
(1425, '2025-10-09 10:25:07', '2025-10-09 10:25:07', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 10:25:07'),
(1426, '2025-10-09 10:25:07', '2025-10-09 10:25:07', 83, '43537113', 'view', '{}', NULL, '2025-10-09 10:25:07'),
(1427, '2025-10-09 10:25:08', '2025-10-09 10:25:08', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 10:25:08'),
(1428, '2025-10-09 10:25:08', '2025-10-09 10:25:08', 82, '43537113', 'view', '{}', NULL, '2025-10-09 10:25:08'),
(1429, '2025-10-09 10:25:09', '2025-10-09 10:25:09', 83, '43537113', 'view', '{}', NULL, '2025-10-09 10:25:09'),
(1430, '2025-10-09 10:25:09', '2025-10-09 10:25:09', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 10:25:09'),
(1431, '2025-10-09 10:25:09', '2025-10-09 10:25:09', 82, '43537113', 'view', '{}', NULL, '2025-10-09 10:25:09'),
(1432, '2025-10-09 10:25:09', '2025-10-09 10:25:09', 82, '43537113', 'view', '{}', NULL, '2025-10-09 10:25:09'),
(1433, '2025-10-09 10:25:09', '2025-10-09 10:25:09', 83, '43537113', 'view', '{}', NULL, '2025-10-09 10:25:09'),
(1434, '2025-10-09 10:25:10', '2025-10-09 10:25:10', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 10:25:10'),
(1435, '2025-10-09 10:25:10', '2025-10-09 10:25:10', 82, '43537113', 'view', '{}', NULL, '2025-10-09 10:25:10'),
(1436, '2025-10-09 10:25:10', '2025-10-09 10:25:10', 82, '43537113', 'view', '{}', NULL, '2025-10-09 10:25:10'),
(1437, '2025-10-09 10:25:10', '2025-10-09 10:25:10', 83, '43537113', 'view', '{}', NULL, '2025-10-09 10:25:10'),
(1438, '2025-10-09 10:25:10', '2025-10-09 10:25:10', 83, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-10-09 10:25:10'),
(1439, '2025-10-09 10:25:11', '2025-10-09 10:25:11', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 10:25:11'),
(1440, '2025-10-09 10:25:11', '2025-10-09 10:25:11', 83, '43537113', 'view', '{}', NULL, '2025-10-09 10:25:11'),
(1441, '2025-10-09 10:25:12', '2025-10-09 10:25:12', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 10:25:12'),
(1442, '2025-10-09 10:25:13', '2025-10-09 10:25:13', 81, '43537113', 'view', '{}', NULL, '2025-10-09 10:25:13'),
(1443, '2025-10-09 10:25:13', '2025-10-09 10:25:13', 82, '43537113', 'view', '{}', NULL, '2025-10-09 10:25:13'),
(1444, '2025-10-09 10:25:13', '2025-10-09 10:25:13', 82, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 10:25:13'),
(1445, '2025-10-09 10:25:14', '2025-10-09 10:25:14', 82, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 10:25:14'),
(1446, '2025-10-09 10:25:20', '2025-10-09 10:25:20', 83, '43537113', 'view', '{}', NULL, '2025-10-09 10:25:20'),
(1447, '2025-10-09 10:25:21', '2025-10-09 10:25:21', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 10:25:21'),
(1448, '2025-10-09 10:25:21', '2025-10-09 10:25:21', 83, '43537113', 'view', '{}', NULL, '2025-10-09 10:25:21'),
(1449, '2025-10-09 10:25:22', '2025-10-09 10:25:22', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 10:25:22'),
(1450, '2025-10-09 10:25:56', '2025-10-09 10:25:56', 83, '43537113', 'view', '{}', NULL, '2025-10-09 10:25:56'),
(1451, '2025-10-09 10:25:57', '2025-10-09 10:25:57', 83, '43537113', 'view', '{}', NULL, '2025-10-09 10:25:57'),
(1452, '2025-10-09 10:25:57', '2025-10-09 10:25:57', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 10:25:57'),
(1453, '2025-10-09 10:41:00', '2025-10-09 10:41:00', 83, '43537113', 'view', '{}', NULL, '2025-10-09 10:41:00'),
(1454, '2025-10-09 10:41:02', '2025-10-09 10:41:02', 83, '43537113', 'view', '{}', NULL, '2025-10-09 10:41:02'),
(1455, '2025-10-09 10:41:02', '2025-10-09 10:41:02', 83, '43537113', 'view', '{}', NULL, '2025-10-09 10:41:02'),
(1456, '2025-10-09 10:41:03', '2025-10-09 10:41:03', 83, '43537113', 'view', '{}', NULL, '2025-10-09 10:41:03'),
(1457, '2025-10-09 10:41:04', '2025-10-09 10:41:04', 82, '43537113', 'view', '{}', NULL, '2025-10-09 10:41:04'),
(1458, '2025-10-09 10:41:04', '2025-10-09 10:41:04', 83, '43537113', 'view', '{}', NULL, '2025-10-09 10:41:04'),
(1459, '2025-10-09 10:41:05', '2025-10-09 10:41:05', 82, '43537113', 'view', '{}', NULL, '2025-10-09 10:41:05'),
(1460, '2025-10-09 10:41:16', '2025-10-09 10:41:16', 83, '43537113', 'view', '{}', NULL, '2025-10-09 10:41:16'),
(1461, '2025-10-09 10:41:16', '2025-10-09 10:41:16', 82, '43537113', 'view', '{}', NULL, '2025-10-09 10:41:16'),
(1462, '2025-10-09 10:41:18', '2025-10-09 10:41:18', 79, '43537113', 'view', '{}', NULL, '2025-10-09 10:41:18'),
(1463, '2025-10-09 10:41:20', '2025-10-09 10:41:20', 74, '43537113', 'view', '{}', NULL, '2025-10-09 10:41:20'),
(1464, '2025-10-09 10:41:20', '2025-10-09 10:41:20', 78, '43537113', 'view', '{}', NULL, '2025-10-09 10:41:20'),
(1465, '2025-10-09 10:41:21', '2025-10-09 10:41:21', 78, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 10:41:21'),
(1466, '2025-10-09 10:42:00', '2025-10-09 10:42:00', 83, '43537113', 'view', '{}', NULL, '2025-10-09 10:42:00'),
(1467, '2025-10-09 10:42:02', '2025-10-09 10:42:02', 83, '43537113', 'view', '{}', NULL, '2025-10-09 10:42:02'),
(1468, '2025-10-09 10:42:03', '2025-10-09 10:42:03', 83, '43537113', 'view', '{}', NULL, '2025-10-09 10:42:03'),
(1469, '2025-10-09 10:42:03', '2025-10-09 10:42:03', 83, '43537113', 'view', '{}', NULL, '2025-10-09 10:42:03'),
(1470, '2025-10-09 10:42:05', '2025-10-09 10:42:05', 83, '43537113', 'view', '{}', NULL, '2025-10-09 10:42:05'),
(1471, '2025-10-09 10:42:06', '2025-10-09 10:42:06', 83, '43537113', 'view', '{}', NULL, '2025-10-09 10:42:06'),
(1472, '2025-10-09 10:42:07', '2025-10-09 10:42:07', 83, '43537113', 'view', '{}', NULL, '2025-10-09 10:42:07'),
(1473, '2025-10-09 10:42:08', '2025-10-09 10:42:08', 74, '43537113', 'view', '{}', NULL, '2025-10-09 10:42:08'),
(1474, '2025-10-09 10:42:08', '2025-10-09 10:42:08', 73, '43537113', 'view', '{}', NULL, '2025-10-09 10:42:08'),
(1475, '2025-10-09 10:42:09', '2025-10-09 10:42:09', 72, '43537113', 'view', '{}', NULL, '2025-10-09 10:42:09'),
(1476, '2025-10-09 10:42:09', '2025-10-09 10:42:09', 72, '43537113', 'view', '{}', NULL, '2025-10-09 10:42:09'),
(1477, '2025-10-09 10:42:10', '2025-10-09 10:42:10', 72, '43537113', 'view', '{}', NULL, '2025-10-09 10:42:10'),
(1478, '2025-10-09 10:42:10', '2025-10-09 10:42:10', 72, '43537113', 'click', '{\"elementClicked\":\"comment\"}', NULL, '2025-10-09 10:42:10'),
(1479, '2025-10-09 10:42:11', '2025-10-09 10:42:11', 71, '43537113', 'view', '{}', NULL, '2025-10-09 10:42:11'),
(1480, '2025-10-09 10:42:11', '2025-10-09 10:42:11', 72, '43537113', 'view', '{}', NULL, '2025-10-09 10:42:11'),
(1481, '2025-10-09 14:42:50', '2025-10-09 14:42:50', 83, '43537113', 'view', '{}', NULL, '2025-10-09 14:42:50'),
(1482, '2025-10-09 14:42:55', '2025-10-09 14:42:55', 83, '43537113', 'view', '{}', NULL, '2025-10-09 14:42:55'),
(1483, '2025-10-09 14:42:56', '2025-10-09 14:42:56', 83, '43537113', 'view', '{}', NULL, '2025-10-09 14:42:56'),
(1484, '2025-10-09 14:42:57', '2025-10-09 14:42:57', 83, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-10-09 14:42:57'),
(1485, '2025-10-09 14:42:57', '2025-10-09 14:42:57', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 14:42:57'),
(1486, '2025-10-09 14:42:57', '2025-10-09 14:42:57', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 14:42:57'),
(1487, '2025-10-09 14:44:21', '2025-10-09 14:44:21', 83, '43537113', 'view', '{}', NULL, '2025-10-09 14:44:21'),
(1488, '2025-10-09 14:44:22', '2025-10-09 14:44:22', 83, '43537113', 'view', '{}', NULL, '2025-10-09 14:44:22'),
(1489, '2025-10-09 14:44:22', '2025-10-09 14:44:22', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 14:44:22'),
(1490, '2025-10-09 14:44:23', '2025-10-09 14:44:23', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-09 14:44:23'),
(1491, '2025-10-10 11:15:41', '2025-10-10 11:15:41', 83, '44187263', 'view', '{}', NULL, '2025-10-10 11:15:41'),
(1492, '2025-10-10 11:15:41', '2025-10-10 11:15:41', 83, '44187263', 'view', '{}', NULL, '2025-10-10 11:15:41'),
(1493, '2025-10-10 11:15:42', '2025-10-10 11:15:42', 83, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-10 11:15:42'),
(1494, '2025-10-10 17:23:26', '2025-10-10 17:23:26', 83, '44187263', 'view', '{}', NULL, '2025-10-10 17:23:26'),
(1495, '2025-10-10 17:23:39', '2025-10-10 17:23:39', 82, '44187263', 'view', '{}', NULL, '2025-10-10 17:23:39'),
(1496, '2025-10-10 17:23:40', '2025-10-10 17:23:40', 82, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-10 17:23:40'),
(1497, '2025-10-10 17:23:46', '2025-10-10 17:23:46', 82, '44187263', 'view', '{}', NULL, '2025-10-10 17:23:46'),
(1498, '2025-10-10 17:23:47', '2025-10-10 17:23:47', 82, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-10 17:23:47'),
(1499, '2025-10-10 17:23:47', '2025-10-10 17:23:47', 82, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-10 17:23:47'),
(1500, '2025-10-10 17:24:02', '2025-10-10 17:24:02', 82, '44187263', 'view', '{}', NULL, '2025-10-10 17:24:02'),
(1501, '2025-10-10 17:24:02', '2025-10-10 17:24:02', 82, '44187263', 'click', '{\"elementClicked\":\"comment\"}', NULL, '2025-10-10 17:24:02'),
(1502, '2025-10-10 17:24:06', '2025-10-10 17:24:06', 82, '44187263', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-10-10 17:24:06'),
(1503, '2025-10-14 08:51:55', '2025-10-14 08:51:55', 83, '44187263', 'view', '{}', NULL, '2025-10-14 08:51:55'),
(1504, '2025-10-14 08:51:56', '2025-10-14 08:51:56', 83, '44187263', 'view', '{}', NULL, '2025-10-14 08:51:56'),
(1505, '2025-10-14 08:51:56', '2025-10-14 08:51:56', 83, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-14 08:51:56'),
(1506, '2025-10-14 08:51:57', '2025-10-14 08:51:57', 83, '44187263', 'view', '{}', NULL, '2025-10-14 08:51:57'),
(1507, '2025-10-14 08:51:57', '2025-10-14 08:51:57', 83, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-14 08:51:57'),
(1508, '2025-10-15 12:12:42', '2025-10-15 12:12:42', 83, '44187263', 'view', '{}', NULL, '2025-10-15 12:12:42'),
(1509, '2025-10-15 12:12:42', '2025-10-15 12:12:42', 82, '44187263', 'view', '{}', NULL, '2025-10-15 12:12:42'),
(1510, '2025-10-15 12:12:46', '2025-10-15 12:12:46', 83, '44187263', 'view', '{}', NULL, '2025-10-15 12:12:46'),
(1511, '2025-10-15 12:12:51', '2025-10-15 12:12:51', 82, '44187263', 'view', '{}', NULL, '2025-10-15 12:12:51'),
(1512, '2025-10-15 12:12:51', '2025-10-15 12:12:51', 81, '44187263', 'view', '{}', NULL, '2025-10-15 12:12:51'),
(1513, '2025-10-15 12:12:52', '2025-10-15 12:12:52', 80, '44187263', 'view', '{}', NULL, '2025-10-15 12:12:52'),
(1514, '2025-10-15 12:12:53', '2025-10-15 12:12:53', 78, '44187263', 'view', '{}', NULL, '2025-10-15 12:12:53'),
(1515, '2025-10-15 12:12:55', '2025-10-15 12:12:55', 82, '44187263', 'view', '{}', NULL, '2025-10-15 12:12:55'),
(1516, '2025-10-15 12:14:58', '2025-10-15 12:14:58', 82, '44187263', 'view', '{}', NULL, '2025-10-15 12:14:58'),
(1517, '2025-10-15 12:15:02', '2025-10-15 12:15:02', 82, '44187263', 'view', '{}', NULL, '2025-10-15 12:15:02'),
(1518, '2025-10-15 12:16:56', '2025-10-15 12:16:56', 82, '44187263', 'view', '{}', NULL, '2025-10-15 12:16:56'),
(1519, '2025-10-15 12:34:40', '2025-10-15 12:34:40', 83, '43537113', 'view', '{}', NULL, '2025-10-15 12:34:40'),
(1520, '2025-10-15 12:34:43', '2025-10-15 12:34:43', 83, '43537113', 'view', '{}', NULL, '2025-10-15 12:34:43'),
(1521, '2025-10-15 12:34:43', '2025-10-15 12:34:43', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-15 12:34:43'),
(1522, '2025-10-15 12:34:44', '2025-10-15 12:34:44', 83, '43537113', 'view', '{}', NULL, '2025-10-15 12:34:44'),
(1523, '2025-10-15 12:34:45', '2025-10-15 12:34:45', 83, '43537113', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-15 12:34:45'),
(1524, '2025-10-15 12:34:45', '2025-10-15 12:34:45', 83, '43537113', 'view', '{}', NULL, '2025-10-15 12:34:45'),
(1525, '2025-10-15 12:34:46', '2025-10-15 12:34:46', 82, '43537113', 'view', '{}', NULL, '2025-10-15 12:34:46'),
(1526, '2025-10-15 12:34:47', '2025-10-15 12:34:47', 83, '43537113', 'view', '{}', NULL, '2025-10-15 12:34:47'),
(1527, '2025-10-15 12:34:47', '2025-10-15 12:34:47', 83, '43537113', 'click', '{\"elementClicked\":\"comment\"}', NULL, '2025-10-15 12:34:47'),
(1528, '2025-10-15 12:34:49', '2025-10-15 12:34:49', 81, '43537113', 'view', '{}', NULL, '2025-10-15 12:34:49'),
(1529, '2025-10-15 12:34:49', '2025-10-15 12:34:49', 82, '43537113', 'view', '{}', NULL, '2025-10-15 12:34:49'),
(1530, '2025-10-15 12:34:49', '2025-10-15 12:34:49', 82, '43537113', 'click', '{\"elementClicked\":\"comment\"}', NULL, '2025-10-15 12:34:49'),
(1531, '2025-10-15 12:34:50', '2025-10-15 12:34:50', 82, '43537113', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-10-15 12:34:50'),
(1532, '2025-10-15 12:34:56', '2025-10-15 12:34:56', 83, '43537113', 'view', '{}', NULL, '2025-10-15 12:34:56'),
(1533, '2025-10-15 12:34:57', '2025-10-15 12:34:57', 83, '43537113', 'click', '{\"elementClicked\":\"share\"}', NULL, '2025-10-15 12:34:57'),
(1534, '2025-10-15 12:35:08', '2025-10-15 12:35:08', 83, '43537113', 'view', '{}', NULL, '2025-10-15 12:35:08'),
(1535, '2025-10-15 12:35:16', '2025-10-15 12:35:16', 83, '43537113', 'view', '{}', NULL, '2025-10-15 12:35:16'),
(1536, '2025-10-15 12:35:21', '2025-10-15 12:35:21', 82, '43537113', 'view', '{}', NULL, '2025-10-15 12:35:21'),
(1537, '2025-10-15 12:35:22', '2025-10-15 12:35:22', 83, '43537113', 'view', '{}', NULL, '2025-10-15 12:35:22'),
(1538, '2025-10-15 12:35:29', '2025-10-15 12:35:29', 83, '43537113', 'view', '{}', NULL, '2025-10-15 12:35:29'),
(1539, '2025-10-15 12:35:32', '2025-10-15 12:35:32', 68, '43537113', 'view', '{}', NULL, '2025-10-15 12:35:32'),
(1540, '2025-10-15 12:35:32', '2025-10-15 12:35:32', 67, '43537113', 'view', '{}', NULL, '2025-10-15 12:35:32'),
(1541, '2025-10-15 12:35:38', '2025-10-15 12:35:38', 83, '43537113', 'view', '{}', NULL, '2025-10-15 12:35:38'),
(1542, '2025-10-15 12:35:48', '2025-10-15 12:35:48', 80, '43537113', 'view', '{}', NULL, '2025-10-15 12:35:48'),
(1543, '2025-10-15 12:42:40', '2025-10-15 12:42:40', 83, '44187263', 'view', '{}', NULL, '2025-10-15 12:42:40'),
(1544, '2025-10-15 12:42:42', '2025-10-15 12:42:42', 82, '44187263', 'view', '{}', NULL, '2025-10-15 12:42:42'),
(1545, '2025-10-15 12:42:42', '2025-10-15 12:42:42', 81, '44187263', 'view', '{}', NULL, '2025-10-15 12:42:42'),
(1546, '2025-10-15 12:42:43', '2025-10-15 12:42:43', 80, '44187263', 'view', '{}', NULL, '2025-10-15 12:42:43'),
(1547, '2025-10-15 12:42:44', '2025-10-15 12:42:44', 73, '44187263', 'view', '{}', NULL, '2025-10-15 12:42:44'),
(1548, '2025-10-15 12:42:45', '2025-10-15 12:42:45', 81, '44187263', 'view', '{}', NULL, '2025-10-15 12:42:45'),
(1549, '2025-10-15 12:42:46', '2025-10-15 12:42:46', 83, '44187263', 'view', '{}', NULL, '2025-10-15 12:42:46'),
(1550, '2025-10-15 12:42:47', '2025-10-15 12:42:47', 82, '44187263', 'view', '{}', NULL, '2025-10-15 12:42:47'),
(1551, '2025-10-15 12:42:51', '2025-10-15 12:42:51', 82, '44187263', 'view', '{}', NULL, '2025-10-15 12:42:51'),
(1552, '2025-10-15 12:42:51', '2025-10-15 12:42:51', 83, '44187263', 'view', '{}', NULL, '2025-10-15 12:42:51'),
(1553, '2025-10-15 12:42:53', '2025-10-15 12:42:53', 82, '44187263', 'view', '{}', NULL, '2025-10-15 12:42:53'),
(1554, '2025-10-15 12:42:56', '2025-10-15 12:42:56', 82, '44187263', 'view', '{}', NULL, '2025-10-15 12:42:56'),
(1555, '2025-10-15 12:42:57', '2025-10-15 12:42:57', 81, '44187263', 'view', '{}', NULL, '2025-10-15 12:42:57'),
(1556, '2025-10-15 12:42:58', '2025-10-15 12:42:58', 80, '44187263', 'view', '{}', NULL, '2025-10-15 12:42:58'),
(1557, '2025-10-15 12:42:59', '2025-10-15 12:42:59', 78, '44187263', 'view', '{}', NULL, '2025-10-15 12:42:59'),
(1558, '2025-10-15 12:43:00', '2025-10-15 12:43:00', 80, '44187263', 'view', '{}', NULL, '2025-10-15 12:43:00'),
(1559, '2025-10-15 12:43:01', '2025-10-15 12:43:01', 81, '44187263', 'view', '{}', NULL, '2025-10-15 12:43:01'),
(1560, '2025-10-15 12:43:02', '2025-10-15 12:43:02', 82, '44187263', 'view', '{}', NULL, '2025-10-15 12:43:02'),
(1561, '2025-10-15 12:43:02', '2025-10-15 12:43:02', 81, '44187263', 'view', '{}', NULL, '2025-10-15 12:43:02'),
(1562, '2025-10-15 12:46:18', '2025-10-15 12:46:18', 81, '44187263', 'view', '{}', NULL, '2025-10-15 12:46:18'),
(1563, '2025-10-15 12:46:18', '2025-10-15 12:46:18', 82, '44187263', 'view', '{}', NULL, '2025-10-15 12:46:18'),
(1564, '2025-10-16 19:01:19', '2025-10-16 19:01:19', 83, '43537113', 'view', '{}', NULL, '2025-10-16 19:01:19'),
(1565, '2025-10-16 19:01:20', '2025-10-16 19:01:20', 82, '43537113', 'view', '{}', NULL, '2025-10-16 19:01:20'),
(1566, '2025-10-16 19:01:21', '2025-10-16 19:01:21', 83, '43537113', 'view', '{}', NULL, '2025-10-16 19:01:21'),
(1567, '2025-10-16 19:01:25', '2025-10-16 19:01:25', 83, '43537113', 'view', '{}', NULL, '2025-10-16 19:01:25'),
(1568, '2025-10-16 19:01:25', '2025-10-16 19:01:25', 82, '43537113', 'view', '{}', NULL, '2025-10-16 19:01:25'),
(1569, '2025-10-16 19:01:26', '2025-10-16 19:01:26', 81, '43537113', 'view', '{}', NULL, '2025-10-16 19:01:26'),
(1570, '2025-10-16 19:01:27', '2025-10-16 19:01:27', 81, '43537113', 'view', '{}', NULL, '2025-10-16 19:01:27'),
(1571, '2025-10-16 19:01:28', '2025-10-16 19:01:28', 74, '43537113', 'view', '{}', NULL, '2025-10-16 19:01:28'),
(1572, '2025-10-16 19:01:32', '2025-10-16 19:01:32', 80, '43537113', 'view', '{}', NULL, '2025-10-16 19:01:32'),
(1573, '2025-10-16 19:01:34', '2025-10-16 19:01:34', 83, '43537113', 'view', '{}', NULL, '2025-10-16 19:01:34'),
(1574, '2025-10-16 19:01:37', '2025-10-16 19:01:37', 72, '43537113', 'view', '{}', NULL, '2025-10-16 19:01:37'),
(1575, '2025-10-16 19:01:38', '2025-10-16 19:01:38', 83, '43537113', 'view', '{}', NULL, '2025-10-16 19:01:38'),
(1576, '2025-10-16 19:01:39', '2025-10-16 19:01:39', 82, '43537113', 'view', '{}', NULL, '2025-10-16 19:01:39'),
(1577, '2025-10-16 19:01:41', '2025-10-16 19:01:41', 80, '43537113', 'view', '{}', NULL, '2025-10-16 19:01:41'),
(1578, '2025-10-16 19:01:43', '2025-10-16 19:01:43', 82, '43537113', 'view', '{}', NULL, '2025-10-16 19:01:43'),
(1579, '2025-10-16 19:01:43', '2025-10-16 19:01:43', 83, '43537113', 'view', '{}', NULL, '2025-10-16 19:01:43'),
(1580, '2025-10-17 20:11:29', '2025-10-17 20:11:29', 83, '44187263', 'view', '{}', NULL, '2025-10-17 20:11:29'),
(1581, '2025-10-17 20:11:29', '2025-10-17 20:11:29', 83, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-17 20:11:29'),
(1582, '2025-10-17 20:11:30', '2025-10-17 20:11:30', 83, '44187263', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-17 20:11:30'),
(1583, '2025-10-17 20:43:55', '2025-10-17 20:43:55', 83, '128cf820-2f12-439d-b994-0213c5eb5219', 'view', '{}', NULL, '2025-10-17 20:43:55'),
(1584, '2025-10-17 20:43:56', '2025-10-17 20:43:56', 83, '128cf820-2f12-439d-b994-0213c5eb5219', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-17 20:43:56'),
(1585, '2025-10-17 20:43:57', '2025-10-17 20:43:57', 83, '128cf820-2f12-439d-b994-0213c5eb5219', 'click', '{\"elementClicked\":\"like\"}', NULL, '2025-10-17 20:43:57'),
(1586, '2025-10-17 20:43:58', '2025-10-17 20:43:58', 82, '128cf820-2f12-439d-b994-0213c5eb5219', 'view', '{}', NULL, '2025-10-17 20:43:58'),
(1587, '2025-10-17 20:43:58', '2025-10-17 20:43:58', 83, '128cf820-2f12-439d-b994-0213c5eb5219', 'view', '{}', NULL, '2025-10-17 20:43:58'),
(1588, '2025-10-17 20:43:59', '2025-10-17 20:43:59', 83, '128cf820-2f12-439d-b994-0213c5eb5219', 'click', '{\"elementClicked\":\"comment\"}', NULL, '2025-10-17 20:43:59'),
(1589, '2025-10-17 20:44:00', '2025-10-17 20:44:00', 83, '128cf820-2f12-439d-b994-0213c5eb5219', 'click', '{\"elementClicked\":\"card\"}', NULL, '2025-10-17 20:44:00'),
(1590, '2025-10-17 20:44:05', '2025-10-17 20:44:05', 83, '128cf820-2f12-439d-b994-0213c5eb5219', 'click', '{\"elementClicked\":\"share\"}', NULL, '2025-10-17 20:44:05'),
(1591, '2025-10-17 20:44:07', '2025-10-17 20:44:07', 83, '128cf820-2f12-439d-b994-0213c5eb5219', 'view', '{}', NULL, '2025-10-17 20:44:07');

-- --------------------------------------------------------

--
-- Table structure for table `announcement_comments`
--

CREATE TABLE `announcement_comments` (
  `id` int(11) NOT NULL,
  `announcement_id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `is_approved` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `parent_comment_id` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `announcement_comments`
--

INSERT INTO `announcement_comments` (`id`, `announcement_id`, `user_id`, `content`, `is_approved`, `created_at`, `updated_at`, `parent_comment_id`, `is_active`) VALUES
(1, 67, '43537113', 'Testing comments after server restart - should work now!', 1, '2025-06-20 15:01:59', '2025-09-19 20:35:37', NULL, 1),
(2, 7, '43537113', 'asdasda', 1, '2025-06-20 15:03:06', '2025-06-20 15:03:06', NULL, 1),
(3, 7, '43537113', 'hjkhj', 1, '2025-06-21 03:57:57', '2025-06-21 03:57:57', NULL, 1),
(4, 7, '44187263', 'lll', 1, '2025-07-12 12:23:37', '2025-07-12 12:23:37', NULL, 1),
(5, 20, '44187263', 'lk', 1, '2025-07-17 14:59:41', '2025-07-17 14:59:41', NULL, 1),
(6, 24, '44915301', 'gfg', 1, '2025-07-23 17:14:21', '2025-07-23 17:14:21', NULL, 1),
(7, 40, 'rg1ptrh9mdfgsrz', 'add', 1, '2025-08-12 04:34:56', '2025-08-12 04:34:56', NULL, 1),
(8, 41, '685xf719omsrqm8', 'gfdsgfd', 1, '2025-08-12 05:14:48', '2025-08-12 05:14:48', NULL, 1),
(9, 45, '43537113', 'jghg', 1, '2025-08-12 21:37:31', '2025-08-12 21:37:31', NULL, 1),
(10, 46, '44187263', 'Amazing', 1, '2025-08-12 21:42:02', '2025-08-12 21:42:02', NULL, 1),
(11, 46, 'tp9tzi7ya1wjjyx', 'Not Bad', 1, '2025-08-12 21:42:29', '2025-08-12 21:42:29', NULL, 1),
(12, 45, '6pa5688t8fntppw', 'superaffiliate', 1, '2025-08-13 06:48:58', '2025-08-13 06:48:58', NULL, 1),
(13, 46, '5qa8llwaph4fhut', 'This is awesome', 1, '2025-08-14 07:49:22', '2025-08-14 07:49:22', NULL, 1),
(14, 56, '43537113', 'test', 1, '2025-09-19 20:30:55', '2025-09-19 20:30:55', NULL, NULL),
(15, 54, '43537113', 'test', 1, '2025-09-19 20:34:37', '2025-09-19 20:34:37', NULL, NULL),
(16, 67, '43537113', 'test', 1, '2025-09-19 20:35:52', '2025-09-19 20:36:28', NULL, 1),
(17, 54, '43537113', 'test', 1, '2025-09-19 20:40:05', '2025-09-19 20:40:05', NULL, NULL),
(18, 68, '43537113', 'test', 1, '2025-09-19 20:43:25', '2025-09-19 20:43:25', NULL, 1),
(19, 68, '6kk4onsspvzjoml', 'll', 1, '2025-09-19 22:29:32', '2025-09-19 22:30:56', NULL, 1),
(20, 68, '6kk4onsspvzjoml', 'll', 1, '2025-09-19 22:29:50', '2025-09-19 22:30:58', NULL, 1),
(21, 68, '6kk4onsspvzjoml', 'gg\n', 1, '2025-09-19 22:40:11', '2025-09-19 22:40:11', NULL, NULL),
(22, 68, '6kk4onsspvzjoml', 'fff', 1, '2025-09-19 22:47:17', '2025-09-19 22:47:17', NULL, NULL),
(23, 68, '6kk4onsspvzjoml', 'oo', 1, '2025-09-19 22:52:41', '2025-09-19 22:52:41', NULL, NULL),
(24, 66, '6kk4onsspvzjoml', '100%', 1, '2025-09-19 22:53:20', '2025-09-19 22:53:20', NULL, 1),
(25, 72, '43537113', 'l;;;', 1, '2025-09-21 20:33:19', '2025-09-21 20:33:19', NULL, 1),
(26, 82, 'hua1objl8w40fw7', 'Its You Affiliate', 1, '2025-10-10 17:24:01', '2025-10-10 17:24:01', NULL, 1),
(27, 82, '44187263', 'Ohh, I See', 1, '2025-10-10 17:24:10', '2025-10-10 17:24:10', NULL, 1),
(28, 82, 'u18o8hwgfhbcz36', 'hehe', 1, '2025-10-14 20:45:22', '2025-10-14 20:45:22', NULL, 1),
(29, 82, 'u18o8hwgfhbcz36', 'hello', 1, '2025-10-15 12:13:35', '2025-10-15 12:13:35', NULL, 1),
(30, 82, '43537113', 'Well', 1, '2025-10-15 12:34:53', '2025-10-15 12:34:53', NULL, 1),
(31, 82, 'u18o8hwgfhbcz36', 'Well', 1, '2025-10-15 12:43:13', '2025-10-15 12:43:13', NULL, 1),
(32, 83, '53cnffx7v02h7if', 'hhh', 1, '2025-10-15 12:49:53', '2025-10-15 12:49:53', NULL, 1),
(33, 82, 'u18o8hwgfhbcz36', 'e', 1, '2025-10-17 18:37:34', '2025-10-17 18:37:34', NULL, 1),
(34, 83, '128cf820-2f12-439d-b994-0213c5eb5219', 'i am new', 1, '2025-10-17 20:44:04', '2025-10-17 20:44:04', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `announcement_likes`
--

CREATE TABLE `announcement_likes` (
  `id` int(11) NOT NULL,
  `announcement_id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `announcement_likes`
--

INSERT INTO `announcement_likes` (`id`, `announcement_id`, `user_id`, `created_at`) VALUES
(1, 6, '43537113', '2025-06-20 14:56:43'),
(2, 7, '43537113', '2025-06-21 03:57:58'),
(3, 8, '43537113', '2025-06-21 10:15:01'),
(5, 9, '44187263', '2025-07-17 14:49:49'),
(7, 20, '44187263', '2025-07-17 14:59:49'),
(9, 40, 'rg1ptrh9mdfgsrz', '2025-08-12 04:34:51'),
(10, 41, '685xf719omsrqm8', '2025-08-12 05:14:45'),
(11, 45, '43537113', '2025-08-12 21:37:26'),
(13, 46, 'tp9tzi7ya1wjjyx', '2025-08-12 21:42:28'),
(14, 46, '44187263', '2025-08-13 22:03:20'),
(15, 46, '5qa8llwaph4fhut', '2025-08-14 07:49:00'),
(30, 56, '43537113', '2025-09-18 15:01:33'),
(31, 56, '44187263', '2025-09-18 15:01:51'),
(32, 68, '43537113', '2025-09-19 20:43:29'),
(40, 78, '44187263', '2025-09-24 03:17:51'),
(51, 80, '43537113', '2025-09-24 03:26:48'),
(55, 74, '44187263', '2025-09-24 03:27:09'),
(56, 73, '44187263', '2025-09-24 03:27:11'),
(65, 79, '44187263', '2025-09-24 03:38:44'),
(113, 78, '43537113', '2025-10-09 10:41:21'),
(121, 82, '44187263', '2025-10-10 17:23:47'),
(126, 81, 'u18o8hwgfhbcz36', '2025-10-15 12:14:15'),
(127, 83, '43537113', '2025-10-15 12:34:45'),
(129, 82, '43537113', '2025-10-16 19:28:39'),
(132, 81, 'hua1objl8w40fw7', '2025-10-16 23:35:34'),
(134, 82, 'hua1objl8w40fw7', '2025-10-16 23:36:32'),
(135, 82, '26tje8w7lymxwlj', '2025-10-16 23:36:36'),
(136, 82, 'u18o8hwgfhbcz36', '2025-10-17 18:37:30'),
(137, 83, '44187263', '2025-10-17 20:11:30');

-- --------------------------------------------------------

--
-- Table structure for table `announcement_shares`
--

CREATE TABLE `announcement_shares` (
  `id` int(11) NOT NULL,
  `announcement_id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `shared_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `white_label_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `parent_category_id` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `white_label_id`, `name`, `description`, `parent_category_id`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 2, 'Hammad', 'tretd', NULL, 1, '2025-06-09 18:29:05', '2025-06-09 18:30:06'),
(6, 2, 'Announcements', 'System and community announcements', NULL, 1, '2025-06-21 09:03:34', '2025-06-21 09:03:34'),
(7, 2, 'Product', 'Product-related categories', NULL, 1, '2025-06-21 09:03:34', '2025-06-21 09:03:34'),
(8, 2, 'Content', 'Content management categories', NULL, 1, '2025-06-21 09:03:34', '2025-06-21 09:03:34'),
(9, 2, 'Support', 'Support and help categories', NULL, 1, '2025-06-21 09:03:34', '2025-06-21 09:03:34'),
(10, 2, 'System Updates', 'Platform system updates and maintenance', 1, 1, '2025-06-21 09:03:41', '2025-06-21 09:03:41'),
(11, 2, 'Community News', 'Community events and news', 1, 1, '2025-06-21 09:03:41', '2025-06-21 09:03:41'),
(12, 2, 'Software Products', 'Software and digital tools', 2, 1, '2025-06-21 09:03:41', '2025-06-21 09:03:41'),
(13, 2, 'Physical Products', 'Physical goods and merchandise', 2, 1, '2025-06-21 09:03:41', '2025-06-21 09:03:41'),
(14, 2, 'Blog Posts', 'Written content and articles', 3, 1, '2025-06-21 09:03:41', '2025-06-21 09:03:41'),
(15, 2, 'Video Content', 'Video tutorials and presentations', 3, 1, '2025-06-21 09:03:41', '2025-06-21 09:03:41'),
(16, 2, 'Technical Help', 'Technical support and troubleshooting', 4, 1, '2025-06-21 09:03:41', '2025-06-21 09:03:41'),
(17, 2, 'General FAQ', 'Frequently asked questions', 4, 1, '2025-06-21 09:03:41', '2025-06-21 09:03:41'),
(18, 2, 'car', NULL, 24, 1, '2025-06-21 09:18:08', '2025-06-21 10:43:12'),
(19, 2, 'Biki', NULL, NULL, 1, '2025-06-21 09:18:24', '2025-07-12 09:07:59'),
(20, 2, 'GG', NULL, 19, 1, '2025-06-21 09:18:34', '2025-06-21 09:18:34'),
(21, 2, 'car', NULL, 20, 1, '2025-06-21 09:25:36', '2025-06-21 09:25:36'),
(22, 2, 'YouTube', NULL, NULL, 1, '2025-06-21 09:25:45', '2025-06-21 09:25:45'),
(23, 2, 'Video', NULL, 22, 1, '2025-06-21 09:25:57', '2025-06-21 10:17:34'),
(24, 2, 'Like', NULL, 23, 1, '2025-06-21 09:26:20', '2025-06-21 09:45:02'),
(25, 2, 'Video', NULL, NULL, 1, '2025-06-21 09:36:21', '2025-06-21 09:36:21'),
(26, 2, 'Video', NULL, NULL, 1, '2025-06-21 09:36:25', '2025-06-21 09:37:56'),
(27, 2, 'car', NULL, NULL, 1, '2025-06-21 09:38:23', '2025-06-21 09:40:17'),
(28, 2, 'Share', NULL, 23, 1, '2025-06-21 10:17:50', '2025-06-21 10:17:50'),
(29, 2, 'car', NULL, NULL, 1, '2025-06-21 10:43:24', '2025-06-21 10:43:24'),
(30, 2, '111222255522212', 'local host', 20, 1, '2025-06-21 14:54:10', '2025-06-21 15:04:13'),
(32, 2, 'Coding', NULL, NULL, 1, '2025-06-21 15:32:39', '2025-06-21 15:32:39'),
(33, 2, 'Backend', NULL, 32, 1, '2025-06-21 15:32:55', '2025-06-21 15:32:55'),
(34, 2, 'Frontend', NULL, 32, 1, '2025-06-21 15:33:13', '2025-06-21 15:33:13'),
(35, 2, 'YouTubi', NULL, NULL, 1, '2025-07-12 09:08:09', '2025-07-12 09:08:09'),
(37, 7, 'M2C', NULL, NULL, 1, '2025-07-12 19:29:28', '2025-07-12 19:29:28'),
(38, 7, 'M2CS', NULL, 37, 1, '2025-07-13 14:26:08', '2025-07-13 14:26:08'),
(40, 7, 'dsf', 'dsv', 38, 1, '2025-07-22 18:11:02', '2025-07-22 18:11:02'),
(41, 2, 'Test Sep', NULL, NULL, 1, '2025-09-19 20:54:08', '2025-09-19 20:54:08'),
(42, 2, 'test', NULL, 41, 1, '2025-09-19 20:54:25', '2025-09-19 20:54:25'),
(44, 2, 'Edit Done', NULL, NULL, 1, '2025-09-19 20:56:43', '2025-09-19 20:59:39'),
(45, 2, 'M3C', NULL, 46, 1, '2025-10-16 22:11:29', '2025-10-16 22:12:49'),
(46, 7, 'M3C', NULL, NULL, 1, '2025-10-16 22:12:44', '2025-10-16 22:12:44'),
(47, 2, 'M3CS', NULL, 46, 1, '2025-10-16 22:13:14', '2025-10-16 22:13:22');

-- --------------------------------------------------------

--
-- Table structure for table `client_template_customizations`
--

CREATE TABLE `client_template_customizations` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `commissions`
--

CREATE TABLE `commissions` (
  `id` int(11) NOT NULL,
  `affiliate_id` varchar(255) NOT NULL,
  `subscription_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `commission_type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `commissions`
--

INSERT INTO `commissions` (`id`, `affiliate_id`, `subscription_id`, `amount`, `status`, `paid_at`, `created_at`, `updated_at`, `commission_type`) VALUES
(3, '1', 2, 12.00, 'paid', '2025-05-25 15:09:35', '2025-05-25 15:09:35', '2025-09-17 19:09:24', 'subscription'),
(4, '2', 2, 8.00, 'paid', '2025-05-30 15:09:35', '2025-05-30 15:09:35', '2025-09-17 19:09:24', 'subscription'),
(6, '1', 2, 125.50, 'paid', '2025-06-13 12:34:39', '2025-06-13 12:34:39', '2025-09-17 19:09:24', 'referral'),
(7, '1', 2, 89.25, 'pending', NULL, '2025-06-16 12:34:39', '2025-09-17 19:09:24', 'subscription'),
(8, '1', 2, 234.75, 'processing', NULL, '2025-06-17 12:34:39', '2025-09-17 19:09:24', 'one_time'),
(9, '1', 2, 156.00, 'paid', '2025-06-08 12:34:39', '2025-06-08 12:34:39', '2025-09-17 19:09:24', 'referral'),
(10, '1', 2, 78.30, 'paid', '2025-06-03 12:34:39', '2025-06-03 12:34:39', '2025-09-17 19:09:24', 'one_time'),
(11, '6', 36, 131.30, 'pending', NULL, '2025-10-10 21:21:15', '2025-10-10 21:21:15', 'white_label_domain'),
(12, 'hua1objl8w40fw7', 38, 1.10, 'pending', NULL, '2025-10-10 22:07:00', '2025-10-10 22:07:00', 'white_label_domain'),
(13, 'hua1objl8w40fw7', 312, 2.42, 'pending', NULL, '2025-10-10 22:32:36', '2025-10-10 22:44:47', 'white_label_domain'),
(14, 'hua1objl8w40fw7', 313, 2.42, 'pending', NULL, '2025-10-10 22:32:36', '2025-10-10 22:44:47', 'white_label_domain'),
(15, 'hua1objl8w40fw7', 315, 2.42, 'pending', NULL, '2025-10-10 22:32:36', '2025-10-10 22:44:47', 'white_label_domain'),
(16, 'hua1objl8w40fw7', 316, 2.42, 'paid', NULL, '2025-10-10 22:32:36', '2025-10-10 22:44:48', 'white_label_domain'),
(17, 'hua1objl8w40fw7', 317, 2.42, 'paid', NULL, '2025-10-10 22:32:36', '2025-10-10 22:44:48', 'white_label_domain');

-- --------------------------------------------------------

--
-- Table structure for table `custom_domains`
--

CREATE TABLE `custom_domains` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_user_sessions`
--

CREATE TABLE `domain_user_sessions` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `user_id` varchar(255) DEFAULT NULL,
  `domain_path` varchar(255) DEFAULT NULL,
  `white_label_id` varchar(255) DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `last_activity` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `domain_user_sessions`
--

INSERT INTO `domain_user_sessions` (`id`, `created_at`, `updated_at`, `user_id`, `domain_path`, `white_label_id`, `session_id`, `is_active`, `last_activity`) VALUES
(1, '2025-07-12 06:00:55', '2025-07-12 06:00:55', '44443117', 'hammad', '2', 'system_created', 0, '2025-07-12 11:00:55'),
(2, '2025-07-12 06:00:55', '2025-07-12 06:00:55', '44915301', 'hammad', '2', 'system_created', 0, '2025-07-12 11:00:55'),
(3, '2025-07-12 06:00:55', '2025-07-12 06:00:55', '44377090', 'hammad', '2', 'system_created', 0, '2025-07-12 11:00:55'),
(4, '2025-07-12 06:25:35', '2025-07-12 06:25:35', '44915301', 'hammad', '2', '6gPEsq6lzFilUYPGlxdvMnWqZPVZA_nA', 0, '2025-07-12 11:25:35'),
(5, '2025-07-12 06:29:23', '2025-07-12 06:29:23', '44915301', 'shoot', '7', '-bgXBs5HrNXV1wMGL9em70lGDL-q1Q-Y', 0, '2025-07-12 11:29:23'),
(6, '2025-07-12 08:44:49', '2025-07-12 08:44:49', '44915301', 'shoot', '7', 'sCeIfMVj0B75cGJXSqi2rlA9nw9lEOlo', 0, '2025-07-12 13:44:49'),
(7, '2025-07-12 08:45:01', '2025-07-12 08:45:01', '44915301', 'hammad', '2', 'DZbPdh2ZuolwI4j6QPeN1EA5Bija4myN', 0, '2025-07-12 13:45:01'),
(8, '2025-07-12 08:49:14', '2025-07-12 08:49:14', '44915301', 'shoot', '7', '6JzlCpxvhAJBldhblLK1b6uWAq4D1b02', 0, '2025-07-12 13:49:14'),
(9, '2025-07-12 10:08:22', '2025-07-12 10:08:22', '44915301', 'shoot', '7', 'h7vdSGgkTnzdWrL99uRNJkQC1qouMKsq', 0, '2025-07-12 15:08:22'),
(10, '2025-07-12 10:08:30', '2025-07-12 10:08:30', '44915301', 'hammad', '2', '5nQ_C_IA_h23JGbC-laANNtISt808eWh', 0, '2025-07-12 15:08:30'),
(11, '2025-07-12 10:10:08', '2025-07-12 10:10:08', '44915301', 'shoot', '7', 'L7Z5xsM1vHDVE21caDlcVqboXuPo_vIS', 0, '2025-07-12 15:10:08'),
(12, '2025-07-12 10:10:15', '2025-07-12 10:10:15', '44915301', 'hammad', '2', 'M2oXioQagqOSct5SZMUg3pTHVERC-MIB', 0, '2025-07-12 15:10:15'),
(13, '2025-07-12 10:38:25', '2025-07-12 10:38:25', '44915301', 'shoot', '7', 'N5oT-22rPLR6WbGRweVDF8ZwCyiR18Dd', 0, '2025-07-12 15:38:25'),
(14, '2025-07-12 10:39:56', '2025-07-12 10:39:56', '44915301', 'shoot', '7', 'asDb7g9Sx1L1ZzvOryMJRTzbkmUU7WBN', 0, '2025-07-12 15:39:56'),
(15, '2025-07-12 10:40:33', '2025-07-12 10:40:33', '44915301', 'hammad', '2', '5TwzP7F0K6kZmqzQ3wyWdg5i_K7AQvyl', 0, '2025-07-12 15:40:33'),
(16, '2025-07-12 10:42:31', '2025-07-12 10:42:31', '44915301', 'shoot', '7', 'kbRH9__DjkAnGD00QdhGN63JIDaGxpZa', 0, '2025-07-12 15:42:31'),
(17, '2025-07-12 10:43:04', '2025-07-12 10:43:04', '44915301', 'shoot', '7', 'ECFrE0bzkm5yvDctI4nRGUGFOQOEW0yS', 0, '2025-07-12 15:43:04'),
(18, '2025-07-12 10:44:25', '2025-07-12 10:44:25', '44915301', 'hammad', '2', 'A-kA2Jf2Pk62CeRDMvf8pnWt75TAabRS', 0, '2025-07-12 15:44:25'),
(21, '2025-07-12 11:12:07', '2025-07-12 11:12:07', '44915301', 'shoot', '7', 'XSmrq5qfWirSlDkGb9X7yU7rxdcC68LY', 0, '2025-07-12 16:12:07'),
(22, '2025-07-12 11:29:08', '2025-07-12 11:29:08', '44915301', 'shoot', '7', '_zpzbXxhnaWFAGvg3dU6KvtuWZdjgd4N', 0, '2025-07-12 16:29:08'),
(23, '2025-07-12 11:43:23', '2025-07-12 11:43:23', '44915301', 'hammad', '2', 'a3wN5sxp7SMam4LD1634-NLi28Q9mrv3', 0, '2025-07-12 16:43:23'),
(24, '2025-07-12 11:44:13', '2025-07-12 11:44:13', '44915301', 'shoot', '7', 'a3wN5sxp7SMam4LD1634-NLi28Q9mrv3', 0, '2025-07-12 16:44:13'),
(25, '2025-07-12 11:50:56', '2025-07-12 11:50:56', '44915301', 'hammad', '2', 'B7XpKnzDlPMeXcOuQP8CXG1lq58qROND', 0, '2025-07-12 16:50:56'),
(26, '2025-07-12 11:51:27', '2025-07-12 11:51:27', '44915301', 'shoot', '7', 'B7XpKnzDlPMeXcOuQP8CXG1lq58qROND', 0, '2025-07-12 16:51:27'),
(27, '2025-07-12 11:51:27', '2025-07-12 11:51:27', '44915301', 'shoot', '7', 'B7XpKnzDlPMeXcOuQP8CXG1lq58qROND', 0, '2025-07-12 16:51:27'),
(28, '2025-07-12 12:08:56', '2025-07-12 12:08:56', '44915301', 'hammad', '2', 'pxUtJQ0fyToC5EHOKabCKuzkwOujU-Iq', 0, '2025-07-12 17:08:56'),
(29, '2025-07-12 12:08:56', '2025-07-12 12:08:56', '44915301', 'hammad', '2', 'pxUtJQ0fyToC5EHOKabCKuzkwOujU-Iq', 0, '2025-07-12 17:08:56'),
(30, '2025-07-12 12:18:50', '2025-07-12 12:18:50', '44915301', 'shoot', '7', 'hmRVxwoyqkdrPoB5X-1_Xus3UVho362v', 0, '2025-07-12 17:18:50'),
(31, '2025-07-12 12:18:50', '2025-07-12 12:18:50', '44915301', 'shoot', '7', 'hmRVxwoyqkdrPoB5X-1_Xus3UVho362v', 0, '2025-07-12 17:18:50'),
(32, '2025-07-12 12:25:23', '2025-07-12 12:25:23', '44915301', 'shoot', '7', 'GlkR9-Jpa3LENhJa4jz3MzR4GxZ-FqNH', 0, '2025-07-12 17:25:23'),
(33, '2025-07-13 06:07:30', '2025-07-13 06:07:30', '44915301', 'shoot', '7', 'eBQRP8XWdlNmlmbz6bPqP3xZRo0RCefu', 0, '2025-07-13 11:07:30'),
(34, '2025-07-13 06:07:30', '2025-07-13 06:07:30', '44915301', 'shoot', '7', 'eBQRP8XWdlNmlmbz6bPqP3xZRo0RCefu', 0, '2025-07-13 11:07:30'),
(35, '2025-07-13 06:26:15', '2025-07-13 06:26:15', '44377090', 'shoot', '7', 'b2tnrfyHsxpjc3AGNL21tW32s06ml628', 0, '2025-07-13 11:26:15'),
(36, '2025-07-13 06:26:15', '2025-07-13 06:26:15', '44377090', 'shoot', '7', 'b2tnrfyHsxpjc3AGNL21tW32s06ml628', 0, '2025-07-13 11:26:15'),
(37, '2025-07-14 04:32:46', '2025-07-14 04:32:46', '44377090', 'hammad', '2', 'hGkKaqhdqIrp3RbdAIfgPHYXkqPHednW', 0, '2025-07-14 09:32:46'),
(38, '2025-07-14 04:32:46', '2025-07-14 04:32:46', '44377090', 'hammad', '2', 'hGkKaqhdqIrp3RbdAIfgPHYXkqPHednW', 0, '2025-07-14 09:32:46'),
(39, '2025-07-14 09:56:30', '2025-07-14 09:56:30', '44377090', 'shoot', '7', 'MAhSffwtrtX4kJg579_0JzrdWyFggnUj', 0, '2025-07-14 14:56:30'),
(40, '2025-07-14 09:56:30', '2025-07-14 09:56:30', '44377090', 'shoot', '7', 'MAhSffwtrtX4kJg579_0JzrdWyFggnUj', 0, '2025-07-14 14:56:30'),
(41, '2025-07-15 10:12:44', '2025-07-15 10:12:44', '44377090', 'shoot', '7', 'ysBY0RTn3pcT1nVY5i_GWA_fmhvkjVcI', 0, '2025-07-15 15:12:44'),
(42, '2025-07-15 10:22:25', '2025-07-15 10:22:25', '44377090', 'shoot', '7', 'Jb-mWAoBvArUhj0tOykdQh3LHLP3p-0p', 0, '2025-07-15 15:22:25'),
(43, '2025-07-15 10:26:11', '2025-07-15 10:26:11', '44377090', 'shoot', '7', 'yQo_RpnunbswpLWKaotzQvL6wNG-j7I9', 0, '2025-07-15 15:26:11'),
(44, '2025-07-15 10:26:37', '2025-07-15 10:26:37', '44377090', 'shoot', '7', 'lobHjB40eWP5PGL3ymdSz5RGaRJANHni', 0, '2025-07-15 15:26:37'),
(45, '2025-07-15 10:27:24', '2025-07-15 10:27:24', '44377090', 'shoot', '7', 'kaDrF_lu4kd5IiUfFLb8kNpk2nldiE_e', 0, '2025-07-15 15:27:24'),
(46, '2025-07-15 10:27:51', '2025-07-15 10:27:51', '44377090', 'shoot', '7', 'KLeJ9B3RoOkNWZPz6q4PjgMPVTGKEu2F', 0, '2025-07-15 15:27:51'),
(47, '2025-07-15 10:28:42', '2025-07-15 10:28:42', '44377090', 'shoot', '7', 'RvVJ1V1yGa6sXGJaSUYjIsR7Zc62yC_9', 0, '2025-07-15 15:28:42'),
(48, '2025-07-15 10:31:25', '2025-07-15 10:31:25', '44377090', 'shoot', '7', 'BsXwfcniTZnn5UL5YSclygkJ6UzyLCuH', 0, '2025-07-15 15:31:25'),
(49, '2025-07-15 10:31:25', '2025-07-15 10:31:25', '44377090', 'shoot', '7', 'BsXwfcniTZnn5UL5YSclygkJ6UzyLCuH', 0, '2025-07-15 15:31:25'),
(50, '2025-07-15 10:56:18', '2025-07-15 10:56:18', '44377090', 'shoot', '7', 'eB4fiYFx8VabVMZGntBiqZP5VALGD-fj', 0, '2025-07-15 15:56:18'),
(51, '2025-07-15 11:00:25', '2025-07-15 11:00:25', '44377090', 'shoot', '7', 'G1jE1TMHgFeIkq_VUy6xPbINFG9OI3_S', 0, '2025-07-15 16:00:25'),
(52, '2025-07-15 11:04:02', '2025-07-15 11:04:02', '44377090', 'shoot', '7', '-HPQm8_MR6HjWuULfihEobw_UZYgCTTg', 0, '2025-07-15 16:04:02'),
(53, '2025-07-15 11:04:02', '2025-07-15 11:04:02', '44377090', 'shoot', '7', '-HPQm8_MR6HjWuULfihEobw_UZYgCTTg', 0, '2025-07-15 16:04:02'),
(54, '2025-07-15 11:08:25', '2025-07-15 11:08:25', '44377090', 'shoot', '7', 'BdBtpQzamjDO3FfvUQgqcKm30f21CnJ_', 0, '2025-07-15 16:08:25'),
(55, '2025-07-15 11:08:25', '2025-07-15 11:08:25', '44377090', 'shoot', '7', 'BdBtpQzamjDO3FfvUQgqcKm30f21CnJ_', 0, '2025-07-15 16:08:25'),
(56, '2025-07-15 11:19:31', '2025-07-15 11:19:31', '44377090', 'shoot', '7', 'R0ydE-QIMhECx54O4BQa3I5iONKAIQu5', 0, '2025-07-15 16:19:31'),
(57, '2025-07-15 11:21:07', '2025-07-15 11:21:07', '44377090', 'shoot', '7', '0jvdGa2vjH3h6HZ-d1zAfZuyKycnbW7Y', 0, '2025-07-15 16:21:07'),
(58, '2025-07-17 06:18:56', '2025-07-17 06:18:56', '44377090', 'hammad', '2', 'P_erMr2kuMnjS8Z7nF9SfQdfj7lDBTH-', 0, '2025-07-17 11:18:56'),
(59, '2025-07-17 06:19:41', '2025-07-17 06:19:41', '44377090', 'shoot', '7', 'P_erMr2kuMnjS8Z7nF9SfQdfj7lDBTH-', 0, '2025-07-17 11:19:41'),
(60, '2025-07-17 06:23:18', '2025-07-17 06:23:18', '44377090', 'shoot', '7', 'YMkJUe1u0f_TcES56zEaRKZPHL2wI3fu', 0, '2025-07-17 11:23:18'),
(61, '2025-07-17 06:24:12', '2025-07-17 06:24:12', '44377090', 'hammad', '2', '_ifnpj7ybQZz_4u-bw1PxrRoMF0PXeKp', 0, '2025-07-17 11:24:12'),
(62, '2025-07-17 06:24:12', '2025-07-17 06:24:12', '44377090', 'hammad', '2', '_ifnpj7ybQZz_4u-bw1PxrRoMF0PXeKp', 0, '2025-07-17 11:24:12'),
(63, '2025-07-17 06:24:58', '2025-07-17 06:24:58', '44377090', 'shoot', '7', '45tDUifeDbFapP1iEKkP6488x6zCCtjV', 0, '2025-07-17 11:24:58'),
(64, '2025-07-17 06:24:58', '2025-07-17 06:24:58', '44377090', 'shoot', '7', '45tDUifeDbFapP1iEKkP6488x6zCCtjV', 0, '2025-07-17 11:24:58'),
(65, '2025-07-17 12:05:09', '2025-07-17 12:05:09', '43537113', 'shoot', '7', 'Bsr1D_F6XfEhFYM0oZBP2SyCOB-iECYV', 0, '2025-07-17 17:05:09'),
(66, '2025-07-17 12:05:09', '2025-07-17 12:05:09', '43537113', 'shoot', '7', 'Bsr1D_F6XfEhFYM0oZBP2SyCOB-iECYV', 0, '2025-07-17 17:05:09'),
(67, '2025-07-17 12:12:46', '2025-07-17 12:12:46', '43537113', 'epicaffiliate', '11', 'RY0ll2gwO52BW_gQNLJSzdx-lVvZy5Ml', 0, '2025-07-17 17:12:46'),
(68, '2025-07-17 12:12:46', '2025-07-17 12:12:46', '43537113', 'epicaffiliate', '11', 'RY0ll2gwO52BW_gQNLJSzdx-lVvZy5Ml', 0, '2025-07-17 17:12:46'),
(69, '2025-07-17 12:14:35', '2025-07-17 12:14:35', '43537113', 'shoot', '7', '0CZbGbjjLyl79zB-HXW_4gqXUKB-T3uh', 0, '2025-07-17 17:14:35'),
(70, '2025-07-17 12:14:35', '2025-07-17 12:14:35', '43537113', 'shoot', '7', '0CZbGbjjLyl79zB-HXW_4gqXUKB-T3uh', 0, '2025-07-17 17:14:35'),
(71, '2025-07-17 12:15:20', '2025-07-17 12:15:20', '43537113', 'epicaffiliate', '11', 'jANpt8OMB3sLaIAEfl9kSaPpR70Wt7C3', 0, '2025-07-17 17:15:20'),
(72, '2025-07-17 12:15:20', '2025-07-17 12:15:20', '43537113', 'epicaffiliate', '11', 'jANpt8OMB3sLaIAEfl9kSaPpR70Wt7C3', 0, '2025-07-17 17:15:20'),
(73, '2025-07-17 12:36:42', '2025-07-17 12:36:42', '44915301', 'epicaffiliate', '11', 'c_pmcXbfHrjG36e6eO2W2pRH-AAi2qA3', 0, '2025-07-17 17:36:42'),
(74, '2025-07-17 12:36:42', '2025-07-17 12:36:42', '44915301', 'epicaffiliate', '11', 'c_pmcXbfHrjG36e6eO2W2pRH-AAi2qA3', 0, '2025-07-17 17:36:42'),
(75, '2025-07-17 15:31:29', '2025-07-17 15:31:29', '43537113', 'epicaffiliate', '11', '0TpKFZ9wBn29LVXNy20plcAsMTtOUIR2', 0, '2025-07-17 20:31:29'),
(76, '2025-07-17 15:31:29', '2025-07-17 15:31:29', '43537113', 'epicaffiliate', '11', '0TpKFZ9wBn29LVXNy20plcAsMTtOUIR2', 0, '2025-07-17 20:31:29'),
(77, '2025-07-18 11:45:17', '2025-07-18 11:45:17', '44915301', 'shoot', '7', 'p_RQnqWmTTBCN6xf8uQBNncHVu4PkWLC', 0, '2025-07-18 16:45:17'),
(78, '2025-07-18 11:45:17', '2025-07-18 11:45:17', '44915301', 'shoot', '7', 'p_RQnqWmTTBCN6xf8uQBNncHVu4PkWLC', 0, '2025-07-18 16:45:17'),
(79, '2025-07-18 12:25:04', '2025-07-18 12:25:04', '44187122', 'shoot', '7', 'vZNpvB9w3KbDEpxiXAhFy9FlxjN1mQHa', 0, '2025-07-18 17:25:04'),
(80, '2025-07-18 12:25:04', '2025-07-18 12:25:04', '44187122', 'shoot', '7', 'vZNpvB9w3KbDEpxiXAhFy9FlxjN1mQHa', 1, '2025-07-18 17:25:04'),
(81, '2025-07-18 12:28:46', '2025-07-18 12:28:46', '43537113', 'shoot', '7', 'a6zBaYqJ2VqiinTVfLjoTw0_IrKtd7_q', 0, '2025-07-18 17:28:46'),
(82, '2025-07-18 12:28:46', '2025-07-18 12:28:46', '43537113', 'shoot', '7', 'a6zBaYqJ2VqiinTVfLjoTw0_IrKtd7_q', 0, '2025-07-18 17:28:46'),
(83, '2025-07-19 10:51:27', '2025-07-19 10:51:27', '43537113', 'epicaffiliate', '11', 'MMC-IJQ8D5wBK-NiHm4wa0OGIZYSz0wQ', 0, '2025-07-19 15:51:27'),
(84, '2025-07-19 10:51:27', '2025-07-19 10:51:27', '43537113', 'epicaffiliate', '11', 'MMC-IJQ8D5wBK-NiHm4wa0OGIZYSz0wQ', 1, '2025-07-19 15:51:27'),
(85, '2025-07-23 11:57:43', '2025-07-23 11:57:43', '44377090', 'shoot', '7', 'rfi5VRrIbXG5pUleoMEwieYONTpF67xF', 0, '2025-07-23 16:57:43'),
(86, '2025-07-23 14:41:54', '2025-07-23 14:41:54', '44187263', '5starseco', '12', 'SBS0bkpzqHwl4N_ZCu4DTNBR5lcGIwVs', 0, '2025-07-23 19:41:54'),
(87, '2025-07-23 14:41:54', '2025-07-23 14:41:54', '44187263', '5starseco', '12', 'SBS0bkpzqHwl4N_ZCu4DTNBR5lcGIwVs', 1, '2025-07-23 19:41:54'),
(88, '2025-08-01 22:37:01', '2025-08-01 22:37:01', '44377090', 'shoot', '7', 'R8KbSOfEXYONSuC36j3nWbmx8akLxW36', 1, '2025-08-02 03:37:01'),
(89, '2025-08-01 22:52:07', '2025-08-01 22:52:07', '44443117', 'shoot', '7', 'i3SsyX7mdd94wRiHfPO_ZUH8AccJBmp_', 0, '2025-08-02 03:52:07'),
(90, '2025-08-01 22:52:07', '2025-08-01 22:52:07', '44443117', 'shoot', '7', 'i3SsyX7mdd94wRiHfPO_ZUH8AccJBmp_', 0, '2025-08-02 03:52:07'),
(91, '2025-08-01 22:57:38', '2025-08-01 22:57:38', '44915301', 'shoot', '7', '_hBg-7s-H_Nu72CHGZuY_IMh2dgRyxGO', 0, '2025-08-02 03:57:38'),
(92, '2025-08-01 22:57:38', '2025-08-01 22:57:38', '44915301', 'shoot', '7', '_hBg-7s-H_Nu72CHGZuY_IMh2dgRyxGO', 0, '2025-08-02 03:57:38'),
(93, '2025-08-04 16:14:41', '2025-08-04 16:14:41', '44915301', 'shoot', '7', 'dO6d1SAxN26EoqSe1fh4Q58Yrf4mfxTo', 0, '2025-08-04 21:14:41'),
(94, '2025-08-04 16:41:15', '2025-08-04 16:41:15', '44443117', 'epicaffiliate', '11', 'cZN_GJCO2z27AU7gC6StjFLllSr1ctBx', 0, '2025-08-04 21:41:15'),
(95, '2025-08-04 16:41:15', '2025-08-04 16:41:15', '44443117', 'epicaffiliate', '11', 'cZN_GJCO2z27AU7gC6StjFLllSr1ctBx', 0, '2025-08-04 21:41:15'),
(96, '2025-08-04 17:39:13', '2025-08-04 17:39:13', '44443117', 'epicaffiliate', '11', 'Zrq_W-212xNnydsh92tBQCd0VfOOU3ha', 0, '2025-08-04 22:39:13'),
(97, '2025-08-04 20:50:21', '2025-08-04 20:50:21', '44915301', 'shoot', '7', '-VWxOrPjuNHrKwsHLArGdLQgwlUpvePW', 0, '2025-08-05 01:50:21'),
(98, '2025-08-06 00:26:04', '2025-08-06 00:26:04', '44443117', 'shoot', '7', '9grbxWqWdds0Vv4HkXGWZaFO7LpZycqp', 0, '2025-08-06 05:26:04'),
(99, '2025-08-06 00:26:04', '2025-08-06 00:26:04', '44443117', 'shoot', '7', '9grbxWqWdds0Vv4HkXGWZaFO7LpZycqp', 1, '2025-08-06 05:26:04'),
(100, '2025-08-06 00:32:38', '2025-08-06 00:32:38', '44915301', 'shoot', '7', 'gJPTH6eGvm50P0ST1mjqwAB0TSEW7xW3', 0, '2025-08-06 05:32:38'),
(101, '2025-08-09 02:52:35', '2025-08-09 02:52:35', '44915301', 'shooti', '7', 'I4dT6GhcfoY8UKf_JwotFClkRLiy4idg', 1, '2025-08-09 07:52:35'),
(102, '2025-08-11 21:46:54', '2025-08-11 21:46:54', '44187122', 'user44187122-affiliate', '38', 'auto-44187122-1754984814.312118', 1, '2025-08-12 02:46:54'),
(103, '2025-08-11 21:46:54', '2025-08-11 21:46:54', 'end_005', 'userend_005-affiliate', '23', 'auto-end_005-1754984814.312118', 1, '2025-08-12 02:46:54'),
(104, '2025-08-11 21:46:54', '2025-08-11 21:46:54', 'end_004', 'userend_004-affiliate', '37', 'auto-end_004-1754984814.312118', 1, '2025-08-12 02:46:54'),
(105, '2025-08-11 21:46:54', '2025-10-09 18:36:14', 'hua1objl8w40fw7', 'first1414-affiliate', '32', 'auto-hua1objl8w40fw7-1754984814.312118', 0, '2025-08-12 02:46:54'),
(106, '2025-08-11 21:46:54', '2025-08-11 21:46:54', 'end_011', 'userend_011-affiliate', '35', 'auto-end_011-1754984814.312118', 1, '2025-08-12 02:46:54'),
(107, '2025-08-11 21:46:54', '2025-08-11 21:46:54', '6t2flwl3grvhzzc', 'epic1251-affiliate', '26', 'auto-6t2flwl3grvhzzc-1754984814.312118', 1, '2025-08-12 02:46:54'),
(108, '2025-08-11 21:46:54', '2025-08-11 21:46:54', '44377090', 'shootss', '11', 'auto-44377090-1754984814.312118', 1, '2025-08-12 02:46:54'),
(109, '2025-08-11 21:46:54', '2025-08-11 21:46:54', 'zpv1hwu56h14u88', 'testing1-affiliate', '30', 'auto-zpv1hwu56h14u88-1754984814.312118', 1, '2025-08-12 02:46:54'),
(110, '2025-08-11 21:46:54', '2025-08-11 21:46:54', 'end_009', 'userend_009-affiliate', '34', 'auto-end_009-1754984814.312118', 1, '2025-08-12 02:46:54'),
(111, '2025-08-11 21:46:54', '2025-08-11 21:46:54', '44915301', '5starseco', '12', 'auto-44915301-1754984814.312118', 1, '2025-08-12 02:46:54'),
(112, '2025-08-11 21:46:54', '2025-08-11 21:46:54', 'tp9tzi7ya1wjjyx', 'munib69affiliate-affiliate', '27', 'auto-tp9tzi7ya1wjjyx-1754984814.312118', 1, '2025-08-12 02:46:54'),
(113, '2025-08-11 21:46:54', '2025-08-11 21:46:54', 'g0u7jstj2qfvohc', 'aass-affiliate', '19', 'auto-g0u7jstj2qfvohc-1754984814.312118', 1, '2025-08-12 02:46:54'),
(114, '2025-08-11 21:46:54', '2025-08-11 21:46:54', 'kui6zoerxwrfl6g', 'epic125-affiliate', '28', 'auto-kui6zoerxwrfl6g-1754984814.312118', 1, '2025-08-12 02:46:54'),
(115, '2025-08-11 21:46:54', '2025-08-11 21:46:54', 'end_012', 'userend_012-affiliate', '21', 'auto-end_012-1754984814.312118', 1, '2025-08-12 02:46:54'),
(116, '2025-08-11 21:46:54', '2025-08-11 21:46:54', 'end_003', 'userend_003-affiliate', '31', 'auto-end_003-1754984814.312118', 1, '2025-08-12 02:46:54'),
(117, '2025-08-11 21:46:54', '2025-08-11 21:46:54', 'end_001', 'userend_001-affiliate', '25', 'auto-end_001-1754984814.312118', 1, '2025-08-12 02:46:54'),
(118, '2025-08-11 21:46:54', '2025-08-11 21:46:54', '44377090', 'epicaffiliate', '6', 'auto-44377090-1754984814.312118', 1, '2025-08-12 02:46:54'),
(119, '2025-08-11 21:46:54', '2025-08-11 21:46:54', 'end_007', 'userend_007-affiliate', '20', 'auto-end_007-1754984814.312118', 1, '2025-08-12 02:46:54'),
(120, '2025-08-11 21:46:54', '2025-08-11 21:46:54', 'end_006', 'userend_006-affiliate', '36', 'auto-end_006-1754984814.312118', 1, '2025-08-12 02:46:54'),
(121, '2025-08-11 21:46:54', '2025-08-11 21:46:54', '44443117', 'munib', '8', 'auto-44443117-1754984814.312118', 1, '2025-08-12 02:46:54'),
(122, '2025-08-11 21:46:54', '2025-08-11 21:46:54', 'end_002', 'userend_002-affiliate', '24', 'auto-end_002-1754984814.312118', 1, '2025-08-12 02:46:54'),
(123, '2025-08-11 21:46:54', '2025-08-11 21:46:54', 'end_010', 'userend_010-affiliate', '29', 'auto-end_010-1754984814.312118', 1, '2025-08-12 02:46:54'),
(124, '2025-08-11 21:46:54', '2025-08-11 21:46:54', 'yx2a1265l5xqv1t', 'first222-affiliate', '22', 'auto-yx2a1265l5xqv1t-1754984814.312118', 1, '2025-08-12 02:46:54'),
(125, '2025-08-11 21:46:54', '2025-08-11 21:46:54', 'end_008', 'userend_008-affiliate', '33', 'auto-end_008-1754984814.312118', 1, '2025-08-12 02:46:54'),
(126, '2025-08-12 04:28:13', '2025-08-12 04:28:13', 'rg1ptrh9mdfgsrz', 'munibrealtryenduser-affiliate', '40', 'tarj6uw52zlqk7zdujxmnyqf25vblnol', 1, '2025-08-12 09:28:13'),
(127, '2025-08-12 05:09:32', '2025-08-12 05:09:32', '685xf719omsrqm8', 'munibgg-affiliate', '42', 'z46koeym5r8s8662ywh3a1i47ifjefm3', 1, '2025-08-12 10:09:32'),
(128, '2025-08-13 00:00:21', '2025-08-13 00:00:21', 'iz2vpsv2u00nlu9', 'epic2244-affiliate', '43', 'ndcgqbvtsn1zxc41b0g90bq47wv17dkn', 0, '2025-08-13 05:00:21'),
(129, '2025-08-13 00:00:21', '2025-08-13 00:00:21', 'iz2vpsv2u00nlu9', 'shoot', '7', '2if9Cy6OWLphrj1pRa9_4m-8tTJNVhRK', 0, '2025-08-13 05:00:21'),
(130, '2025-08-13 00:09:25', '2025-08-13 00:09:25', 'iz2vpsv2u00nlu9', 'shoot', '7', '2433kyW72Lfvd8RPH2raHH0tm3zTcHV3', 0, '2025-08-13 05:09:25'),
(131, '2025-08-13 04:18:08', '2025-08-13 04:18:08', 'iz2vpsv2u00nlu9', 'shoot', '7', 'BFSOJOcbM2rKO60KWUyJ6OgKBorORgSr', 1, '2025-08-13 09:18:08'),
(132, '2025-08-13 04:29:06', '2025-08-13 04:29:06', '35m0crql3jbwdg5', 'mypurchases-affiliate', '44', 'xbp5t2owj0td49x2qejjpd369fw7v03u', 0, '2025-08-13 09:29:06'),
(133, '2025-08-13 04:29:07', '2025-08-13 04:29:07', '35m0crql3jbwdg5', 'shoot', '7', 'SHduwhLus78jZgMZgOmpnBz0hhXIK_3l', 1, '2025-08-13 09:29:07'),
(134, '2025-08-13 04:30:05', '2025-08-13 04:30:05', '8aqk5un6apiqd4b', 'mypurchases2-affiliate', '45', 'eg5qc8goxuf1s1r7wedq35d6yj8359pi', 0, '2025-08-13 09:30:05'),
(135, '2025-08-13 04:30:06', '2025-08-13 04:30:06', '8aqk5un6apiqd4b', 'munib6969', '18', 'VD6CEG-xkdo1-HpGvnkXSneqPMDdRVZj', 1, '2025-08-13 09:30:06'),
(136, '2025-08-18 21:11:14', '2025-08-18 21:11:14', '67hhc5l6jli5723', 'tutorialssss-affiliate', '47', 'e0takyevbpzbg0lemczaaw7dlcrafx78', 0, '2025-08-19 02:11:14'),
(137, '2025-08-18 21:11:14', '2025-08-18 21:11:14', '67hhc5l6jli5723', 'epic22222', '46', 'btFvPik_pf84482TSKa0mZy_62Opzj7i', 1, '2025-08-19 02:11:14'),
(138, '2025-08-19 11:39:05', '2025-08-19 11:39:05', 'u18o8hwgfhbcz36', 'hammadhammad-affiliate', '48', 'fax26o1jncll5y12vnnqaxn568xltjg0', 0, '2025-08-19 16:39:05'),
(139, '2025-08-19 11:39:05', '2025-08-19 11:39:05', 'u18o8hwgfhbcz36', 'shoot', '7', 'ENBVrViL4CSK1xlpNMdgIKqv13QqpvQo', 1, '2025-08-19 16:39:05'),
(140, '2025-08-19 11:45:14', '2025-08-19 11:45:14', '62b7hiatqx20iaj', 'hammadassa-affiliate', '50', '38p1lw1xhl8q9p1j1yn1vfuer2vw39v2', 0, '2025-08-19 16:45:14'),
(141, '2025-08-19 11:45:14', '2025-08-19 11:45:14', '62b7hiatqx20iaj', 'hammadhammadi', '49', 'so4Aky6vXdJ8KTfDjJvuHDHYy6pHq2K_', 1, '2025-08-19 16:45:14'),
(142, '2025-08-20 12:40:00', '2025-08-20 12:40:00', 'j756dzpftjionpa', 'munibmunib-affiliate', '51', 'intw6f1c3jhovl8j4re9q6kw0y0mymr0', 0, '2025-08-20 17:40:00'),
(143, '2025-08-20 12:40:01', '2025-08-20 12:40:01', 'j756dzpftjionpa', 'hammadhammadi', '49', 'poFdZH_Jaw3FL7lruIDYY1qSlEYjR8HW', 1, '2025-08-20 17:40:01'),
(144, '2025-08-20 13:19:03', '2025-08-20 13:19:03', '7rjtsyeijw0i8zi', 'checking22-affiliate', '52', 'gb5iklldkm7jdlyqjkddy0juvh4socah', 0, '2025-08-20 18:19:03'),
(145, '2025-08-20 13:19:04', '2025-08-20 13:19:04', '7rjtsyeijw0i8zi', 'hammadhammadi', '49', 'vhEfPj-ShYrYEUHdpnbU8m3RL-_vamP8', 1, '2025-08-20 18:19:04'),
(146, '2025-08-20 13:40:37', '2025-08-20 13:40:37', 'ss2iq4hwcaydplz', 'hello22-affiliate', '53', 'elf3mz5rrdlrcw7c5gwqyep39bfsyk22', 0, '2025-08-20 18:40:37'),
(147, '2025-08-20 13:40:38', '2025-08-20 13:40:38', 'ss2iq4hwcaydplz', 'hammadhammadi', '49', 'uALiAlleQ2ohzNxFv-exsFdCR-YAx0M6', 1, '2025-08-20 18:40:38'),
(148, '2025-08-23 06:58:33', '2025-08-23 06:58:33', '26tje8w7lymxwlj', 'testingnewaffiliatesystem-affiliate', '55', '9cvmisp7vw315km42sv28a698f4vgxxt', 1, '2025-08-23 11:58:33'),
(149, '2025-10-09 18:36:14', '2025-10-17 00:49:21', 'hua1objl8w40fw7', 'four1234', '17', 'Qw2FoiWx-y1bgb3mOj7QMnE5XimvOt6G', 0, '2025-10-09 23:36:14'),
(150, '2025-10-09 18:44:43', '2025-10-17 00:49:21', 'hua1objl8w40fw7', 'shoot', '7', 'cross-domain-session-1760035483439', 0, NULL),
(151, '2025-10-17 00:49:21', '2025-10-17 00:49:21', 'hua1objl8w40fw7', 'four1234488', '32', 'wOSCseGl-pQO729qXrrvL_ybXBaCYHth', 1, '2025-10-17 05:49:21');

-- --------------------------------------------------------

--
-- Table structure for table `end_user_activities`
--

CREATE TABLE `end_user_activities` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `user_id` varchar(255) DEFAULT NULL,
  `white_label_id` varchar(255) DEFAULT NULL,
  `activity_type` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `end_user_activities`
--

INSERT INTO `end_user_activities` (`id`, `created_at`, `updated_at`, `user_id`, `white_label_id`, `activity_type`, `description`, `metadata`) VALUES
(89, '2025-09-20 08:41:41', '2025-09-20 08:41:41', '00fb5fb2-932f-45da-9fa1-60403f078f32', '2', 'login', 'Hammad logged in', '{\"loginMethod\":\"local\",\"ipAddress\":\"127.0.0.1\"}'),
(90, '2025-09-20 08:41:41', '2025-09-20 08:41:41', '00fb5fb2-932f-45da-9fa1-60403f078f32', '2', 'purchase', 'Hammad purchased Premium Plan', '{\"planName\":\"Premium Plan\",\"amount\":29.99}'),
(91, '2025-09-20 08:41:41', '2025-09-20 08:41:41', '04mlvs50y4nls6a', '2', 'signup', 'Munib signed up', '{\"signupMethod\":\"email\",\"referrer\":\"direct\"}'),
(92, '2025-09-20 09:49:15', '2025-09-20 09:49:15', '43537113', '2', 'purchase', NULL, '{\"planId\":118,\"planName\":\"YouTube\",\"amount\":344}'),
(93, '2025-09-20 09:53:03', '2025-09-20 09:53:03', '43537113', '2', 'purchase', NULL, '{\"planId\":118,\"planName\":\"YouTube\",\"amount\":344}'),
(94, '2025-09-20 09:56:30', '2025-09-20 09:56:30', '43537113', '2', 'purchase', NULL, '{\"planId\":105,\"planName\":\"test\",\"amount\":1000}'),
(95, '2025-09-20 10:48:30', '2025-09-20 10:48:30', '44187263', '7', 'purchase', NULL, '{\"planId\":126,\"planName\":\"Google Maps\",\"amount\":12}'),
(96, '2025-09-20 11:53:30', '2025-09-20 11:53:30', '44187263', '7', 'purchase', NULL, '{\"planId\":127,\"planName\":\"test\",\"amount\":344}'),
(97, '2025-09-21 20:32:24', '2025-09-21 20:32:24', '44187263', '7', 'login', 'Rickk (owner) logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36\",\"loginMethod\":\"local\",\"ownerLogin\":true}'),
(98, '2025-09-21 21:27:49', '2025-09-21 21:27:49', '44187263', '7', 'purchase', NULL, '{\"planId\":129,\"planName\":\"News Plan\",\"amount\":22}'),
(99, '2025-09-21 21:29:03', '2025-09-21 21:29:03', '44187263', '7', 'purchase', NULL, '{\"planId\":130,\"planName\":\"Newss\",\"amount\":344}'),
(100, '2025-09-22 14:18:52', '2025-09-22 14:18:52', '44187263', '7', 'login', 'Rickk (owner) logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36\",\"loginMethod\":\"local\",\"ownerLogin\":true}'),
(101, '2025-09-22 14:20:53', '2025-09-22 14:20:53', '44187263', '7', 'login', 'Rickk (owner) logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Trae/1.100.3 Chrome/132.0.6834.210 Electron/34.5.1 Safari/537.36\",\"loginMethod\":\"local\",\"ownerLogin\":true}'),
(102, '2025-09-22 15:28:24', '2025-09-22 15:28:24', '44187263', '7', 'login', 'Rickk (owner) logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36\",\"loginMethod\":\"local\",\"ownerLogin\":true}'),
(103, '2025-09-23 12:54:57', '2025-09-23 12:54:57', '44187263', '7', 'login', 'Rickk (owner) logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36\",\"loginMethod\":\"local\",\"ownerLogin\":true}'),
(104, '2025-09-23 16:41:52', '2025-09-23 16:41:52', '44187263', '7', 'login', 'Rickk (owner) logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36\",\"loginMethod\":\"local\",\"ownerLogin\":true}'),
(105, '2025-09-23 17:02:39', '2025-09-23 17:02:39', '44187263', '7', 'login', 'Rickk (owner) logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36\",\"loginMethod\":\"local\",\"ownerLogin\":true}'),
(106, '2025-09-23 17:31:59', '2025-09-23 17:31:59', '44377090', '6', 'login', 'epic (owner) logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36\",\"loginMethod\":\"local\",\"ownerLogin\":true}'),
(107, '2025-09-23 21:17:51', '2025-09-23 21:17:51', '44377090', '11', 'login', 'epic (owner) logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36\",\"loginMethod\":\"local\",\"ownerLogin\":true}'),
(108, '2025-09-23 23:42:53', '2025-09-23 23:42:53', '44187263', '7', 'login', 'Rickk (owner) logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36\",\"loginMethod\":\"local\",\"ownerLogin\":true}'),
(109, '2025-10-09 14:57:20', '2025-10-09 14:57:20', 'hua1objl8w40fw7', '32', 'login', 'first1414 logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Trae/1.100.3 Chrome/132.0.6834.210 Electron/34.5.1 Safari/537.36\",\"loginMethod\":\"local\"}'),
(110, '2025-10-09 15:26:28', '2025-10-09 15:26:28', 'hua1objl8w40fw7', '32', 'login', 'first1414 logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\",\"loginMethod\":\"local\"}'),
(111, '2025-10-09 15:28:43', '2025-10-09 15:28:43', '44187263', '7', 'login', 'Ric (owner) logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Trae/1.100.3 Chrome/132.0.6834.210 Electron/34.5.1 Safari/537.36\",\"loginMethod\":\"local\",\"ownerLogin\":true}'),
(112, '2025-10-09 16:59:15', '2025-10-09 16:59:15', 'hua1objl8w40fw7', '32', 'login', 'first1414 logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\",\"loginMethod\":\"local\"}'),
(113, '2025-10-09 18:48:44', '2025-10-09 18:48:44', '44187263', '7', 'login', 'Ric (owner) logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\",\"loginMethod\":\"local\",\"ownerLogin\":true}'),
(114, '2025-10-10 11:14:58', '2025-10-10 11:14:58', '44187263', '7', 'login', 'Ric (owner) logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36\",\"loginMethod\":\"local\",\"ownerLogin\":true}'),
(115, '2025-10-10 11:20:37', '2025-10-10 11:20:37', 'hua1objl8w40fw7', '32', 'login', 'first1414 logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36\",\"loginMethod\":\"local\"}'),
(116, '2025-10-10 11:22:58', '2025-10-10 11:22:58', '44187263', '7', 'login', 'Ric (owner) logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36\",\"loginMethod\":\"local\",\"ownerLogin\":true}'),
(117, '2025-10-10 12:34:13', '2025-10-10 12:34:13', '44187263', '7', 'login', 'Ric (owner) logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36\",\"loginMethod\":\"local\",\"ownerLogin\":true}'),
(118, '2025-10-10 12:56:00', '2025-10-10 12:56:00', 'hua1objl8w40fw7', '32', 'login', 'first1414 logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36\",\"loginMethod\":\"local\"}'),
(119, '2025-10-10 13:26:50', '2025-10-10 13:26:50', 'hua1objl8w40fw7', '32', 'login', 'first1414 logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36\",\"loginMethod\":\"local\"}'),
(120, '2025-10-10 13:32:55', '2025-10-10 13:32:55', 'hua1objl8w40fw7', '32', 'login', 'first1414 logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36\",\"loginMethod\":\"local\"}'),
(121, '2025-10-10 13:50:57', '2025-10-10 13:50:57', '44187263', '7', 'login', 'Ric (owner) logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Trae/1.100.3 Chrome/132.0.6834.210 Electron/34.5.1 Safari/537.36\",\"loginMethod\":\"local\",\"ownerLogin\":true}'),
(122, '2025-10-10 17:09:03', '2025-10-10 17:09:03', '44187263', '7', 'login', 'Ric (owner) logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Trae/1.100.3 Chrome/132.0.6834.210 Electron/34.5.1 Safari/537.36\",\"loginMethod\":\"local\",\"ownerLogin\":true}'),
(123, '2025-10-10 17:56:26', '2025-10-10 17:56:26', '44187263', '7', 'login', 'Ric (owner) logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36\",\"loginMethod\":\"local\",\"ownerLogin\":true}'),
(124, '2025-10-10 20:13:40', '2025-10-10 20:13:40', '35m0crql3jbwdg5', '44', 'login', 'My logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36\",\"loginMethod\":\"local\"}'),
(125, '2025-10-10 23:01:57', '2025-10-10 23:01:57', 'hua1objl8w40fw7', '32', 'login', 'first1414 logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"axios/1.12.2\",\"loginMethod\":\"local\"}'),
(126, '2025-10-10 23:03:31', '2025-10-10 23:03:31', 'hua1objl8w40fw7', '32', 'login', 'first1414 logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"axios/1.12.2\",\"loginMethod\":\"local\"}'),
(127, '2025-10-10 23:04:55', '2025-10-10 23:04:55', 'hua1objl8w40fw7', '32', 'login', 'first1414 logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"axios/1.12.2\",\"loginMethod\":\"local\"}'),
(128, '2025-10-10 23:06:11', '2025-10-10 23:06:11', 'hua1objl8w40fw7', '32', 'login', 'first1414 logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"axios/1.12.2\",\"loginMethod\":\"local\"}'),
(129, '2025-10-10 23:11:12', '2025-10-10 23:11:12', 'hua1objl8w40fw7', '32', 'login', 'first1414 logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"axios/1.12.2\",\"loginMethod\":\"local\"}'),
(130, '2025-10-10 23:20:16', '2025-10-10 23:20:16', 'hua1objl8w40fw7', '32', 'login', 'first1414 logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"axios/1.12.2\",\"loginMethod\":\"local\"}'),
(131, '2025-10-10 23:20:49', '2025-10-10 23:20:49', 'hua1objl8w40fw7', '32', 'login', 'first1414 logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"axios/1.12.2\",\"loginMethod\":\"local\"}'),
(132, '2025-10-10 23:21:44', '2025-10-10 23:21:44', 'hua1objl8w40fw7', '32', 'login', 'first1414 logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"axios/1.12.2\",\"loginMethod\":\"local\"}'),
(133, '2025-10-10 23:23:54', '2025-10-10 23:23:54', 'hua1objl8w40fw7', '32', 'login', 'first1414 logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"axios/1.12.2\",\"loginMethod\":\"local\"}'),
(134, '2025-10-10 23:25:12', '2025-10-10 23:25:12', 'hua1objl8w40fw7', '32', 'login', 'first1414 logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"axios/1.12.2\",\"loginMethod\":\"local\"}'),
(135, '2025-10-10 23:26:22', '2025-10-10 23:26:22', 'hua1objl8w40fw7', '32', 'login', 'first1414 logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"axios/1.12.2\",\"loginMethod\":\"local\"}'),
(136, '2025-10-10 23:27:52', '2025-10-10 23:27:52', 'hua1objl8w40fw7', '32', 'login', 'first1414 logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"axios/1.12.2\",\"loginMethod\":\"local\"}'),
(137, '2025-10-10 23:30:53', '2025-10-10 23:30:53', 'hua1objl8w40fw7', '32', 'login', 'first1414 logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"axios/1.12.2\",\"loginMethod\":\"local\"}'),
(138, '2025-10-10 23:32:01', '2025-10-10 23:32:01', 'hua1objl8w40fw7', '32', 'login', 'first1414 logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"axios/1.12.2\",\"loginMethod\":\"local\"}'),
(139, '2025-10-10 23:34:47', '2025-10-10 23:34:47', 'hua1objl8w40fw7', '32', 'login', 'first1414 logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"axios/1.12.2\",\"loginMethod\":\"local\"}'),
(140, '2025-10-11 08:21:12', '2025-10-11 08:21:12', '26tje8w7lymxwlj', '55', 'login', 'NewAffiliate logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36\",\"loginMethod\":\"local\"}'),
(141, '2025-10-11 14:42:58', '2025-10-11 14:42:58', '26tje8w7lymxwlj', '55', 'login', 'NewAffiliate logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\",\"loginMethod\":\"local\"}'),
(142, '2025-10-12 11:53:58', '2025-10-12 11:53:58', 'iz2vpsv2u00nlu9', '43', 'login', 'epic logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\",\"loginMethod\":\"local\"}'),
(143, '2025-10-14 07:26:31', '2025-10-14 07:26:31', 'hua1objl8w40fw7', '32', 'login', 'first1414 logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\",\"loginMethod\":\"local\"}'),
(144, '2025-10-14 07:44:14', '2025-10-14 07:44:14', 'hua1objl8w40fw7', '32', 'login', 'first1414 logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\",\"loginMethod\":\"local\"}'),
(145, '2025-10-14 08:39:53', '2025-10-14 08:39:53', 'hua1objl8w40fw7', '32', 'login', 'first1414 logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\",\"loginMethod\":\"local\"}'),
(146, '2025-10-14 20:44:55', '2025-10-14 20:44:55', 'u18o8hwgfhbcz36', '48', 'login', 'hammad logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\",\"loginMethod\":\"local\"}'),
(147, '2025-10-15 12:42:35', '2025-10-15 12:42:35', '44187263', '7', 'login', 'Ric (owner) logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\",\"loginMethod\":\"local\",\"ownerLogin\":true}'),
(148, '2025-10-15 13:02:33', '2025-10-15 13:02:33', '44187263', '7', 'login', 'Ric (owner) logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\",\"loginMethod\":\"local\",\"ownerLogin\":true}'),
(149, '2025-10-16 20:07:14', '2025-10-16 20:07:14', 'u18o8hwgfhbcz36', '48', 'login', 'hammadi logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\",\"loginMethod\":\"local\"}'),
(150, '2025-10-16 20:13:10', '2025-10-16 20:13:10', '44187263', '7', 'login', 'Ric (owner) logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\",\"loginMethod\":\"local\",\"ownerLogin\":true}'),
(151, '2025-10-16 23:33:51', '2025-10-16 23:33:51', 'q1erwrot7efdcbr', '17', 'login', 'four1234 (owner) logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\",\"loginMethod\":\"local\",\"ownerLogin\":true}'),
(152, '2025-10-16 23:35:15', '2025-10-16 23:35:15', 'hua1objl8w40fw7', '32', 'login', 'first1414 logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\",\"loginMethod\":\"local\"}'),
(153, '2025-10-16 23:36:19', '2025-10-16 23:36:19', '26tje8w7lymxwlj', '55', 'login', 'NewAffiliate logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\",\"loginMethod\":\"local\"}'),
(154, '2025-10-17 01:24:51', '2025-10-17 01:24:51', 'u18o8hwgfhbcz36', '48', 'login', 'hammad logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\",\"loginMethod\":\"local\"}'),
(155, '2025-10-17 01:25:36', '2025-10-17 01:25:36', 'u18o8hwgfhbcz36', '48', 'login', 'hammad logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\",\"loginMethod\":\"local\"}'),
(156, '2025-10-17 01:26:24', '2025-10-17 01:26:24', 'u18o8hwgfhbcz36', '48', 'login', 'hammad logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\",\"loginMethod\":\"local\"}'),
(157, '2025-10-17 01:26:45', '2025-10-17 01:26:45', 'u18o8hwgfhbcz36', '48', 'login', 'hammad logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\",\"loginMethod\":\"local\"}'),
(158, '2025-10-17 01:26:54', '2025-10-17 01:26:54', '44187263', '7', 'login', 'Ric (owner) logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\",\"loginMethod\":\"local\",\"ownerLogin\":true}'),
(159, '2025-10-17 01:42:53', '2025-10-17 01:42:53', 'u18o8hwgfhbcz36', '48', 'login', 'hammad logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\",\"loginMethod\":\"local\"}'),
(160, '2025-10-17 01:50:31', '2025-10-17 01:50:31', 'u18o8hwgfhbcz36', '48', 'login', 'hammad logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\",\"loginMethod\":\"local\"}'),
(161, '2025-10-17 01:52:18', '2025-10-17 01:52:18', 'u18o8hwgfhbcz36', '48', 'login', 'hammad logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\",\"loginMethod\":\"local\"}'),
(162, '2025-10-17 01:53:15', '2025-10-17 01:53:15', 'u18o8hwgfhbcz36', '48', 'login', 'hammad logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\",\"loginMethod\":\"local\"}'),
(163, '2025-10-17 01:53:53', '2025-10-17 01:53:53', 'u18o8hwgfhbcz36', '48', 'login', 'hammad logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\",\"loginMethod\":\"local\"}'),
(164, '2025-10-17 20:11:22', '2025-10-17 20:11:22', '44187263', '7', 'login', 'Ric (owner) logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\",\"loginMethod\":\"local\",\"ownerLogin\":true}'),
(165, '2025-10-17 20:38:18', '2025-10-17 20:38:18', '44187263', '7', 'login', 'Ric (owner) logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\",\"loginMethod\":\"local\",\"ownerLogin\":true}'),
(166, '2025-10-17 22:47:10', '2025-10-17 22:47:10', '44187263', '7', 'login', 'Ric (owner) logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\",\"loginMethod\":\"local\",\"ownerLogin\":true}'),
(167, '2025-10-17 22:55:07', '2025-10-17 22:55:07', '44187263', '7', 'login', 'Ric (owner) logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\",\"loginMethod\":\"local\",\"ownerLogin\":true}'),
(168, '2025-10-18 19:23:29', '2025-10-18 19:23:29', '44187263', '7', 'login', 'Ric (owner) logged in', '{\"ipAddress\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\",\"loginMethod\":\"local\",\"ownerLogin\":true}');

-- --------------------------------------------------------

--
-- Table structure for table `integrations`
--

CREATE TABLE `integrations` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `service_name` varchar(255) DEFAULT NULL,
  `display_name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `is_connected` tinyint(1) DEFAULT NULL,
  `api_key_encrypted` text DEFAULT NULL,
  `webhook_url` text DEFAULT NULL,
  `settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`settings`)),
  `last_sync_at` datetime DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `white_label_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `integrations`
--

INSERT INTO `integrations` (`id`, `created_at`, `updated_at`, `service_name`, `display_name`, `description`, `category`, `is_active`, `is_connected`, `api_key_encrypted`, `webhook_url`, `settings`, `last_sync_at`, `user_id`, `white_label_id`) VALUES
(1, '2025-06-09 13:54:50', '2025-06-09 13:54:50', 'nmi', 'NMI Payment Gateway', 'Secure payment processing and merchant services platform', 'payment', 1, 1, '7917c8d8a12688dfb65fedfa97af70be:a51edb11db8a531ca7e3351322db5cf3d4f0fec8032e092f60cc9d01f41908392d7cc77ec1d907ee09e0035ea651f7b27d25b947b5a33c9dc96cb58c024f27867463f0c77e77490df9ffdd949e4bf86eecac0de143067c4edd0b6b5b2ee695d9d3b4379095473b266b08d156ff9958e1', NULL, '{}', '2025-06-09 18:54:50', '43537113', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `integration_logs`
--

CREATE TABLE `integration_logs` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `integration_id` varchar(255) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `error_details` text DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `integration_logs`
--

INSERT INTO `integration_logs` (`id`, `created_at`, `updated_at`, `integration_id`, `action`, `status`, `message`, `error_details`, `metadata`) VALUES
(1, '2025-06-09 13:54:50', '2025-09-17 18:32:30', '1', 'connect', 'success', 'Successfully connected stripe', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `landing_pages`
--

CREATE TABLE `landing_pages` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `domain_path` varchar(100) DEFAULT NULL,
  `elements` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`elements`)),
  `settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`settings`)),
  `is_published` tinyint(1) DEFAULT 0,
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `landing_pages`
--

INSERT INTO `landing_pages` (`id`, `user_id`, `name`, `domain_path`, `elements`, `settings`, `is_published`, `published_at`, `created_at`, `updated_at`) VALUES
(1, 'system', 'Default Template', 'Default', '[{\"id\":\"hero-section\",\"type\":\"hero\",\"content\":{\"title\":\"Welcome to Our Platform\",\"subtitle\":\"Discover amazing features and services\",\"buttonText\":\"Get Started\",\"buttonLink\":\"#plans\"}},{\"id\":\"plans-section\",\"type\":\"plans\",\"content\":{\"title\":\"Choose Your Plan\",\"subtitle\":\"Select the perfect plan for your needs\"}}]', '{\"theme\":\"default\",\"primaryColor\":\"#2563EB\",\"secondaryColor\":\"#64748B\"}', 1, '2025-09-22 14:27:27', '2025-09-22 19:27:27', '2025-09-22 19:27:27'),
(2, '44187263', 'My Landing Page', NULL, '[{\"id\":\"hero-section\",\"type\":\"hero\",\"name\":\"Hero Section\",\"locked\":false,\"visible\":true,\"style\":{\"position\":\"relative\",\"width\":\"100%\",\"height\":600,\"background\":\"linear-gradient(135deg, #667eea 0%, #764ba2 100%)\",\"display\":\"flex\",\"flexDirection\":\"column\",\"alignItems\":\"center\",\"justifyContent\":\"center\",\"color\":\"#ffffff\",\"textAlign\":\"center\",\"padding\":80,\"backgroundImage\":\"url(\'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80\')\",\"backgroundSize\":\"cover\",\"backgroundPosition\":\"center\",\"backgroundBlendMode\":\"overlay\"},\"content\":{\"title\":\"Powerful Revenue Sharing & Commission Tracking\",\"subtitle\":\"Automated calculations, transparent distribution, and real-time analytics for every stakeholder\",\"buttonText\":\"Explore Analytics\",\"buttonUrl\":\"#analytics\"}},{\"id\":\"hero-1\",\"type\":\"hero\",\"style\":{\"background\":\"linear-gradient(135deg, #667eea 0%, #764ba2 100%)\",\"color\":\"white\",\"padding\":\"120px 0 80px\",\"textAlign\":\"center\",\"position\":\"relative\",\"overflow\":\"hidden\",\"minHeight\":\"100vh\",\"display\":\"flex\",\"alignItems\":\"center\",\"justifyContent\":\"center\"},\"content\":{\"title\":\"Transform Your Business\",\"subtitle\":\"We help businesses grow with cutting-edge strategies and proven results. Join thousands of successful companies who trust our platform.\",\"ctaButton\":{\"text\":\"🚀 Get Started Free\",\"url\":\"#pricing\",\"style\":\"background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); color: white; padding: 18px 36px; border-radius: 50px; font-weight: 700; font-size: 18px; border: 2px solid rgba(255, 255, 255, 0.3); cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 12px; transition: all 0.4s ease; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);\"},\"secondaryButton\":{\"text\":\"📹 Watch Demo\",\"url\":\"#demo\",\"style\":\"background: transparent; color: white; padding: 18px 36px; border-radius: 50px; font-weight: 600; font-size: 16px; border: 2px solid rgba(255, 255, 255, 0.4); cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 12px; transition: all 0.4s ease; margin-left: 20px;\"}}},{\"id\":\"features-1\",\"type\":\"features\",\"style\":{\"padding\":\"100px 0\",\"background\":\"#f8fafc\"},\"content\":{\"title\":\"Why Choose Our Platform?\",\"subtitle\":\"Powerful features designed to accelerate your business growth\",\"features\":[{\"icon\":\"🚀\",\"title\":\"Lightning Fast\",\"description\":\"Optimized performance that delivers results in seconds, not minutes.\"},{\"icon\":\"🔒\",\"title\":\"Bank-Level Security\",\"description\":\"Enterprise-grade security protecting your data with military-grade encryption.\"},{\"icon\":\"📊\",\"title\":\"Advanced Analytics\",\"description\":\"Deep insights and real-time analytics to track your success metrics.\"},{\"icon\":\"🎯\",\"title\":\"Smart Targeting\",\"description\":\"AI-powered targeting that reaches your ideal customers automatically.\"},{\"icon\":\"💡\",\"title\":\"Innovation First\",\"description\":\"Cutting-edge technology that keeps you ahead of the competition.\"},{\"icon\":\"🌍\",\"title\":\"Global Reach\",\"description\":\"Scale your business worldwide with our international infrastructure.\"}]}},{\"id\":\"pricing-1\",\"type\":\"pricing\",\"style\":{\"padding\":\"100px 0\",\"background\":\"white\"},\"content\":{\"title\":\"Choose Your Success Plan\",\"subtitle\":\"Flexible pricing that grows with your business\",\"plans\":[{\"name\":\"Starter\",\"price\":\"$29\",\"period\":\"/month\",\"description\":\"Perfect for small businesses getting started\",\"features\":[\"Up to 1,000 contacts\",\"Basic analytics\",\"Email support\",\"Mobile app access\",\"Basic integrations\"],\"ctaText\":\"Start Free Trial\",\"popular\":false},{\"name\":\"Professional\",\"price\":\"$79\",\"period\":\"/month\",\"description\":\"Ideal for growing businesses\",\"features\":[\"Up to 10,000 contacts\",\"Advanced analytics\",\"Priority support\",\"Custom integrations\",\"Team collaboration\",\"Advanced reporting\"],\"ctaText\":\"Get Started\",\"popular\":true},{\"name\":\"Enterprise\",\"price\":\"$199\",\"period\":\"/month\",\"description\":\"For large organizations\",\"features\":[\"Unlimited contacts\",\"Custom analytics\",\"24/7 phone support\",\"White-label options\",\"Dedicated account manager\",\"Custom development\"],\"ctaText\":\"Contact Sales\",\"popular\":false}]}},{\"id\":\"testimonials-1\",\"type\":\"testimonials\",\"style\":{\"padding\":\"100px 0\",\"background\":\"#f8fafc\"},\"content\":{\"title\":\"What Our Customers Say\",\"subtitle\":\"Join thousands of satisfied customers worldwide\",\"testimonials\":[{\"name\":\"Sarah Johnson\",\"role\":\"CEO, TechStart Inc.\",\"avatar\":\"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face&auto=format&q=80\",\"content\":\"This platform transformed our business completely. We saw 300% growth in just 6 months!\",\"rating\":5},{\"name\":\"Michael Chen\",\"role\":\"Marketing Director, GrowthCo\",\"avatar\":\"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face&auto=format&q=80\",\"content\":\"The analytics and insights are incredible. We finally understand our customers.\",\"rating\":5},{\"name\":\"Emily Rodriguez\",\"role\":\"Founder, StartupXYZ\",\"avatar\":\"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face&auto=format&q=80\",\"content\":\"Best investment we\'ve made. The ROI is phenomenal and support is outstanding.\",\"rating\":5}]}},{\"id\":\"contact-1\",\"type\":\"contact\",\"style\":{\"padding\":\"100px 0\",\"background\":\"white\"},\"content\":{\"title\":\"Ready to Get Started?\",\"subtitle\":\"Contact us today and transform your business tomorrow\",\"contactInfo\":{\"email\":\"hello@yourbusiness.com\",\"phone\":\"+1 (555) 123-4567\",\"address\":\"123 Business St, Suite 100, City, State 12345\"},\"ctaButton\":{\"text\":\"Start Your Free Trial\",\"url\":\"#pricing\",\"style\":\"background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%); color: white; padding: 18px 36px; border-radius: 50px; font-weight: 700; font-size: 18px; border: none; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 12px; transition: all 0.4s ease; box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);\"}}},{\"id\":\"footer-1\",\"type\":\"footer\",\"style\":{\"padding\":\"60px 0 30px\",\"background\":\"#1a202c\",\"color\":\"white\"},\"content\":{\"companyName\":\"\",\"tagline\":\"Transforming businesses worldwide\",\"links\":[{\"text\":\"Privacy Policy\",\"url\":\"/privacy\"},{\"text\":\"Terms of Service\",\"url\":\"/terms\"},{\"text\":\"Support\",\"url\":\"/support\"},{\"text\":\"Contact\",\"url\":\"/contact\"}],\"socialLinks\":[{\"platform\":\"Twitter\",\"url\":\"https://twitter.com\",\"icon\":\"🐦\"},{\"platform\":\"LinkedIn\",\"url\":\"https://linkedin.com\",\"icon\":\"💼\"},{\"platform\":\"Facebook\",\"url\":\"https://facebook.com\",\"icon\":\"📘\"}],\"copyright\":\"© 2024. All rights reserved.\"}}]', '{\"canvasHeight\":800,\"viewMode\":\"desktop\",\"zoom\":1}', 1, '2025-09-23 15:59:44', '2025-09-22 19:28:23', '2025-09-23 15:59:44'),
(3, '44187263', 'My Landing Page', NULL, '[]', '{\"canvasHeight\":800,\"viewMode\":\"desktop\",\"zoom\":1}', 0, NULL, '2025-09-22 19:28:25', '2025-09-22 19:28:25'),
(4, '44187263', 'Default Landing Page', NULL, '[{\"id\":\"hero_default_1\",\"type\":\"hero\",\"content\":{\"title\":\"Welcome to Your Landing Page\",\"subtitle\":\"Build beautiful, high-converting landing pages with our drag-and-drop builder\",\"buttonText\":\"Get Started\",\"buttonLink\":\"#signup\",\"backgroundImage\":\"https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=800&fit=crop\"},\"style\":{\"position\":\"relative\",\"left\":9,\"top\":0,\"width\":\"100%\",\"height\":600,\"background\":\"linear-gradient(135deg, #667eea 0%, #764ba2 100%)\",\"color\":\"#ffffff\",\"padding\":80,\"display\":\"flex\",\"flexDirection\":\"column\",\"justifyContent\":\"center\",\"alignItems\":\"center\",\"textAlign\":\"center\",\"overflow\":\"hidden\"},\"locked\":false,\"visible\":true,\"name\":\"Hero Section\"},{\"id\":\"text_default_1\",\"type\":\"text\",\"content\":{\"text\":\"This is your default landing page template. You can customize it by dragging elements from the sidebar or editing existing content.\"},\"style\":{\"position\":\"absolute\",\"left\":100,\"top\":650,\"width\":800,\"height\":\"auto\",\"fontSize\":18,\"color\":\"#374151\",\"fontFamily\":\"Inter\",\"padding\":20,\"lineHeight\":1.6,\"letterSpacing\":0},\"locked\":false,\"visible\":true,\"name\":\"Welcome Text\"}]', '{\"canvasHeight\":950,\"viewMode\":\"desktop\",\"zoom\":1}', 0, NULL, '2025-09-23 13:29:38', '2025-09-23 13:29:38'),
(5, '44187263', 'Default Landing Page', NULL, '[{\"id\":\"hero_default_1\",\"type\":\"hero\",\"content\":{\"title\":\"Welcome to Your Landing Page\",\"subtitle\":\"Build beautiful, high-converting landing pages with our drag-and-drop builder\",\"buttonText\":\"Get Started\",\"buttonLink\":\"#signup\",\"backgroundImage\":\"https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=800&fit=crop\"},\"style\":{\"position\":\"relative\",\"left\":9,\"top\":0,\"width\":\"100%\",\"height\":600,\"background\":\"linear-gradient(135deg, #667eea 0%, #764ba2 100%)\",\"color\":\"#ffffff\",\"padding\":80,\"display\":\"flex\",\"flexDirection\":\"column\",\"justifyContent\":\"center\",\"alignItems\":\"center\",\"textAlign\":\"center\",\"overflow\":\"hidden\"},\"locked\":false,\"visible\":true,\"name\":\"Hero Section\"},{\"id\":\"text_default_1\",\"type\":\"text\",\"content\":{\"text\":\"This is your default landing page template. You can customize it by dragging elements from the sidebar or editing existing content.\"},\"style\":{\"position\":\"absolute\",\"left\":100,\"top\":650,\"width\":800,\"height\":\"auto\",\"fontSize\":18,\"color\":\"#374151\",\"fontFamily\":\"Inter\",\"padding\":20,\"lineHeight\":1.6,\"letterSpacing\":0},\"locked\":false,\"visible\":true,\"name\":\"Welcome Text\"}]', '{\"canvasHeight\":950,\"viewMode\":\"desktop\",\"zoom\":1}', 0, NULL, '2025-09-23 13:29:38', '2025-09-23 13:29:38'),
(7, 'hua1objl8w40fw7', 'New Landing Page', NULL, '\"[{\\\"id\\\":\\\"hero-section\\\",\\\"type\\\":\\\"hero\\\",\\\"name\\\":\\\"Hero Section\\\",\\\"locked\\\":false,\\\"visible\\\":true,\\\"style\\\":{\\\"position\\\":\\\"relative\\\",\\\"width\\\":\\\"100%\\\",\\\"height\\\":600,\\\"background\\\":\\\"linear-gradient(135deg, #667eea 0%, #764ba2 100%)\\\",\\\"display\\\":\\\"flex\\\",\\\"flexDirection\\\":\\\"column\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"color\\\":\\\"#ffffff\\\",\\\"textAlign\\\":\\\"center\\\",\\\"padding\\\":80,\\\"backgroundImage\\\":\\\"url(\'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80\')\\\",\\\"backgroundSize\\\":\\\"cover\\\",\\\"backgroundPosition\\\":\\\"center\\\",\\\"backgroundBlendMode\\\":\\\"overlay\\\"},\\\"content\\\":{\\\"title\\\":\\\"Powerful Revenue Sharing & Commission Tracking\\\",\\\"subtitle\\\":\\\"Automated calculations, transparent distribution, and real-time analytics for every stakeholder\\\",\\\"buttonText\\\":\\\"Explore Analytics\\\",\\\"buttonUrl\\\":\\\"#analytics\\\"}},{\\\"id\\\":\\\"hero-1\\\",\\\"type\\\":\\\"hero\\\",\\\"style\\\":{\\\"background\\\":\\\"linear-gradient(135deg, #667eea 0%, #764ba2 100%)\\\",\\\"color\\\":\\\"white\\\",\\\"padding\\\":\\\"120px 0 80px\\\",\\\"textAlign\\\":\\\"center\\\",\\\"position\\\":\\\"relative\\\",\\\"overflow\\\":\\\"hidden\\\",\\\"minHeight\\\":\\\"100vh\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"center\\\"},\\\"content\\\":{\\\"title\\\":\\\"Transform Your Business\\\",\\\"subtitle\\\":\\\"We help businesses grow with cutting-edge strategies and proven results. Join thousands of successful companies who trust our platform.\\\",\\\"ctaButton\\\":{\\\"text\\\":\\\"🚀 Get Started Free\\\",\\\"url\\\":\\\"#pricing\\\",\\\"style\\\":\\\"background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); color: white; padding: 18px 36px; border-radius: 50px; font-weight: 700; font-size: 18px; border: 2px solid rgba(255, 255, 255, 0.3); cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 12px; transition: all 0.4s ease; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);\\\"},\\\"secondaryButton\\\":{\\\"text\\\":\\\"📹 Watch Demo\\\",\\\"url\\\":\\\"#demo\\\",\\\"style\\\":\\\"background: transparent; color: white; padding: 18px 36px; border-radius: 50px; font-weight: 600; font-size: 16px; border: 2px solid rgba(255, 255, 255, 0.4); cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 12px; transition: all 0.4s ease; margin-left: 20px;\\\"}}},{\\\"id\\\":\\\"features-1\\\",\\\"type\\\":\\\"features\\\",\\\"style\\\":{\\\"padding\\\":\\\"100px 0\\\",\\\"background\\\":\\\"#f8fafc\\\"},\\\"content\\\":{\\\"title\\\":\\\"Why Choose Our Platform?\\\",\\\"subtitle\\\":\\\"Powerful features designed to accelerate your business growth\\\",\\\"features\\\":[{\\\"icon\\\":\\\"🚀\\\",\\\"title\\\":\\\"Lightning Fast\\\",\\\"description\\\":\\\"Optimized performance that delivers results in seconds, not minutes.\\\"},{\\\"icon\\\":\\\"🔒\\\",\\\"title\\\":\\\"Bank-Level Security\\\",\\\"description\\\":\\\"Enterprise-grade security protecting your data with military-grade encryption.\\\"},{\\\"icon\\\":\\\"📊\\\",\\\"title\\\":\\\"Advanced Analytics\\\",\\\"description\\\":\\\"Deep insights and real-time analytics to track your success metrics.\\\"},{\\\"icon\\\":\\\"🎯\\\",\\\"title\\\":\\\"Smart Targeting\\\",\\\"description\\\":\\\"AI-powered targeting that reaches your ideal customers automatically.\\\"},{\\\"icon\\\":\\\"💡\\\",\\\"title\\\":\\\"Innovation First\\\",\\\"description\\\":\\\"Cutting-edge technology that keeps you ahead of the competition.\\\"},{\\\"icon\\\":\\\"🌍\\\",\\\"title\\\":\\\"Global Reach\\\",\\\"description\\\":\\\"Scale your business worldwide with our international infrastructure.\\\"}]}},{\\\"id\\\":\\\"pricing-1\\\",\\\"type\\\":\\\"pricing\\\",\\\"style\\\":{\\\"padding\\\":\\\"100px 0\\\",\\\"background\\\":\\\"white\\\"},\\\"content\\\":{\\\"title\\\":\\\"Choose Your Success Plan\\\",\\\"subtitle\\\":\\\"Flexible pricing that grows with your business\\\",\\\"plans\\\":[{\\\"name\\\":\\\"Starter\\\",\\\"price\\\":\\\"$29\\\",\\\"period\\\":\\\"/month\\\",\\\"description\\\":\\\"Perfect for small businesses getting started\\\",\\\"features\\\":[\\\"Up to 1,000 contacts\\\",\\\"Basic analytics\\\",\\\"Email support\\\",\\\"Mobile app access\\\",\\\"Basic integrations\\\"],\\\"ctaText\\\":\\\"Start Free Trial\\\",\\\"popular\\\":false},{\\\"name\\\":\\\"Professional\\\",\\\"price\\\":\\\"$79\\\",\\\"period\\\":\\\"/month\\\",\\\"description\\\":\\\"Ideal for growing businesses\\\",\\\"features\\\":[\\\"Up to 10,000 contacts\\\",\\\"Advanced analytics\\\",\\\"Priority support\\\",\\\"Custom integrations\\\",\\\"Team collaboration\\\",\\\"Advanced reporting\\\"],\\\"ctaText\\\":\\\"Get Started\\\",\\\"popular\\\":true},{\\\"name\\\":\\\"Enterprise\\\",\\\"price\\\":\\\"$199\\\",\\\"period\\\":\\\"/month\\\",\\\"description\\\":\\\"For large organizations\\\",\\\"features\\\":[\\\"Unlimited contacts\\\",\\\"Custom analytics\\\",\\\"24/7 phone support\\\",\\\"White-label options\\\",\\\"Dedicated account manager\\\",\\\"Custom development\\\"],\\\"ctaText\\\":\\\"Contact Sales\\\",\\\"popular\\\":false}]}},{\\\"id\\\":\\\"testimonials-1\\\",\\\"type\\\":\\\"testimonials\\\",\\\"style\\\":{\\\"padding\\\":\\\"100px 0\\\",\\\"background\\\":\\\"#f8fafc\\\"},\\\"content\\\":{\\\"title\\\":\\\"What Our Customers Say\\\",\\\"subtitle\\\":\\\"Join thousands of satisfied customers worldwide\\\",\\\"testimonials\\\":[{\\\"name\\\":\\\"Sarah Johnson\\\",\\\"role\\\":\\\"CEO, TechStart Inc.\\\",\\\"avatar\\\":\\\"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face&auto=format&q=80\\\",\\\"content\\\":\\\"This platform transformed our business completely. We saw 300% growth in just 6 months!\\\",\\\"rating\\\":5},{\\\"name\\\":\\\"Michael Chen\\\",\\\"role\\\":\\\"Marketing Director, GrowthCo\\\",\\\"avatar\\\":\\\"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face&auto=format&q=80\\\",\\\"content\\\":\\\"The analytics and insights are incredible. We finally understand our customers.\\\",\\\"rating\\\":5},{\\\"name\\\":\\\"Emily Rodriguez\\\",\\\"role\\\":\\\"Founder, StartupXYZ\\\",\\\"avatar\\\":\\\"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face&auto=format&q=80\\\",\\\"content\\\":\\\"Best investment we\'ve made. The ROI is phenomenal and support is outstanding.\\\",\\\"rating\\\":5}]}},{\\\"id\\\":\\\"contact-1\\\",\\\"type\\\":\\\"contact\\\",\\\"style\\\":{\\\"padding\\\":\\\"100px 0\\\",\\\"background\\\":\\\"white\\\"},\\\"content\\\":{\\\"title\\\":\\\"Ready to Get Started?\\\",\\\"subtitle\\\":\\\"Contact us today and transform your business tomorrow\\\",\\\"contactInfo\\\":{\\\"email\\\":\\\"hello@yourbusiness.com\\\",\\\"phone\\\":\\\"+1 (555) 123-4567\\\",\\\"address\\\":\\\"123 Business St, Suite 100, City, State 12345\\\"},\\\"ctaButton\\\":{\\\"text\\\":\\\"Start Your Free Trial\\\",\\\"url\\\":\\\"#pricing\\\",\\\"style\\\":\\\"background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%); color: white; padding: 18px 36px; border-radius: 50px; font-weight: 700; font-size: 18px; border: none; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 12px; transition: all 0.4s ease; box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);\\\"}}},{\\\"id\\\":\\\"footer-1\\\",\\\"type\\\":\\\"footer\\\",\\\"style\\\":{\\\"padding\\\":\\\"60px 0 30px\\\",\\\"background\\\":\\\"#1a202c\\\",\\\"color\\\":\\\"white\\\"},\\\"content\\\":{\\\"companyName\\\":\\\"\\\",\\\"tagline\\\":\\\"Transforming businesses worldwide\\\",\\\"links\\\":[{\\\"text\\\":\\\"Privacy Policy\\\",\\\"url\\\":\\\"/privacy\\\"},{\\\"text\\\":\\\"Terms of Service\\\",\\\"url\\\":\\\"/terms\\\"},{\\\"text\\\":\\\"Support\\\",\\\"url\\\":\\\"/support\\\"},{\\\"text\\\":\\\"Contact\\\",\\\"url\\\":\\\"/contact\\\"}],\\\"socialLinks\\\":[{\\\"platform\\\":\\\"Twitter\\\",\\\"url\\\":\\\"https://twitter.com\\\",\\\"icon\\\":\\\"🐦\\\"},{\\\"platform\\\":\\\"LinkedIn\\\",\\\"url\\\":\\\"https://linkedin.com\\\",\\\"icon\\\":\\\"💼\\\"},{\\\"platform\\\":\\\"Facebook\\\",\\\"url\\\":\\\"https://facebook.com\\\",\\\"icon\\\":\\\"📘\\\"}],\\\"copyright\\\":\\\"© 2024. All rights reserved.\\\"}}]\"', '{\"canvasHeight\":800,\"viewMode\":\"desktop\",\"zoom\":1}', 1, '2025-10-10 18:51:42', '2025-10-10 18:13:21', '2025-10-10 18:51:42'),
(8, 'hua1objl8w40fw7', 'New Landing Page', NULL, '[]', '{\"canvasHeight\":800,\"viewMode\":\"desktop\",\"zoom\":1}', 0, NULL, '2025-10-10 18:13:24', '2025-10-10 18:13:24'),
(9, 'hua1objl8w40fw7', 'New Landing Page', NULL, '[]', '{\"canvasHeight\":800,\"viewMode\":\"desktop\",\"zoom\":1}', 0, NULL, '2025-10-10 18:13:25', '2025-10-10 18:13:25'),
(10, 'hua1objl8w40fw7', 'New Landing Page', NULL, '[]', '{\"canvasHeight\":800,\"viewMode\":\"desktop\",\"zoom\":1}', 0, NULL, '2025-10-10 18:13:26', '2025-10-10 18:13:26'),
(11, 'hua1objl8w40fw7', 'New Landing Page', NULL, '[]', '{\"canvasHeight\":800,\"viewMode\":\"desktop\",\"zoom\":1}', 0, NULL, '2025-10-10 18:13:33', '2025-10-10 18:13:33'),
(12, 'hua1objl8w40fw7', 'New Landing Page', NULL, '[]', '{\"canvasHeight\":800,\"viewMode\":\"desktop\",\"zoom\":1}', 0, NULL, '2025-10-10 18:13:34', '2025-10-10 18:13:34'),
(13, 'hua1objl8w40fw7', 'New Landing Page', NULL, '[]', '{\"canvasHeight\":800,\"viewMode\":\"desktop\",\"zoom\":1}', 0, NULL, '2025-10-10 18:13:35', '2025-10-10 18:13:35');

-- --------------------------------------------------------

--
-- Table structure for table `link_meta_images`
--

CREATE TABLE `link_meta_images` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `nmi_credentials`
--

CREATE TABLE `nmi_credentials` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `security_key` varchar(255) NOT NULL,
  `processor_id` varchar(255) DEFAULT NULL,
  `gateway_url` varchar(500) DEFAULT 'https://secure.networkmerchants.com/api/transact.php',
  `is_test_mode` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `last_tested_at` timestamp NULL DEFAULT NULL,
  `test_status` varchar(50) DEFAULT NULL,
  `test_error_message` varchar(1000) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nmi_credentials`
--

INSERT INTO `nmi_credentials` (`id`, `user_id`, `username`, `password`, `security_key`, `processor_id`, `gateway_url`, `is_test_mode`, `is_active`, `last_tested_at`, `test_status`, `test_error_message`, `created_at`, `updated_at`) VALUES
(1, '43537113', 'test_username', '2708c959fd80ec0afa6c8dfec4cc1124:87dfba34bd71a8fa65cb7d3e5f502f84', 'c5af13535e82a0605e7d569773001379:e5ad5485d2b1a5f3709d0d1b845f619dc77c45012d17f1d4ea8ab7d8bde50b10', NULL, 'https://secure.networkmerchants.com/api/transact.php', 1, 0, NULL, NULL, NULL, '2025-09-22 14:38:47', '2025-10-18 09:02:15'),
(2, '44187263', 'test_username', 'test_password', 'test_security_key', NULL, 'https://secure.networkmerchants.com/api/transact.php', 1, 0, NULL, NULL, NULL, '2025-10-09 16:40:33', '2025-10-10 12:17:27'),
(3, '44187263', 'test_username', 'test_password', 'test_security_key', NULL, 'https://secure.networkmerchants.com/api/transact.php', 1, 0, NULL, NULL, NULL, '2025-10-09 16:56:36', '2025-10-10 12:17:27'),
(4, '44187263', 'test_usernamess', 'test_password', 'test_security_key', NULL, 'https://secure.networkmerchants.com/api/transact.php', 1, 0, NULL, NULL, NULL, '2025-10-09 16:57:01', '2025-10-10 12:17:27'),
(5, '44187263', 'demo', '04a8b43cc7d236e9d7ee03d39c8f7882:dcfcc5de89ea26c3a4139fc853b3dcd8', 'fcae0749b91bcfceeab75268b0e744d4:5e388e65830ea0d103fc1f5f9f2937c268e92fac078bb269dd6a24119587c56e', NULL, 'https://secure.networkmerchants.com/api/transact.php', 1, 1, NULL, NULL, NULL, '2025-10-09 16:57:29', '2025-10-17 23:29:22'),
(6, 'hua1objl8w40fw7', 'test_affiliate_username', 'd432c90aeca71b0b02f1bd81ca2dab33:a989a58736403c4035e6ce1de64572eed25f7da6ffcc9a7d9708b81033abea78', '97806a55f0ace1813949a0e5c2ee396b:784ee0d5b1626e6c307a54f6dc9f9533c2e0caf492da242d63f3b6089036d3ea', 'test_processor_id', 'https://secure.networkmerchants.com/api/transact.php', 1, 1, NULL, NULL, NULL, '2025-10-10 20:06:29', '2025-10-17 23:29:22'),
(7, '43537113', 'test_username', 'aa5e2873c0d915e8a0c75ea765d508b0:b8f0a3286890c9df4ac3ffc670932d6d', 'b8e469e7575cdcf327d3384b1d19b477:61d5af5021b4ea9a68e69e02c1a3d20e80f7ecf3cca2661be53ed582d44cc3a0', NULL, 'https://secure.networkmerchants.com/api/transact.php', 1, 0, NULL, NULL, NULL, '2025-10-17 23:39:01', '2025-10-18 09:02:15'),
(8, '43537113', 'BYPASS_MODE', 'BYPASS_PASSWORD', 'BYPASS_SECURITY_KEY', NULL, 'https://secure.networkmerchants.com/api/transact.php', 1, 1, NULL, NULL, NULL, '2025-10-17 23:54:28', '2025-10-18 09:02:15'),
(9, '44187263', 'demo', '698d1efc35ec8279c91f413b1ebac119:1cd90db4c4f39a863aa44e06653004af', '02a8de1616242972b8c8e35d705a5230:f2ca0b48e875f7f562a3b98456a7a3120be157d508bf90efccd724370d7d0d2ba4f76e1c27bdcc2f8f53fa94eb0f088e', NULL, 'https://secure.networkmerchants.com/api/transact.php', 1, 1, NULL, NULL, NULL, '2025-10-18 00:01:44', '2025-10-18 00:01:44');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `user_id` varchar(255) DEFAULT NULL,
  `hashed_token` text DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `used` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `password_reset_tokens`
--

INSERT INTO `password_reset_tokens` (`id`, `created_at`, `updated_at`, `user_id`, `hashed_token`, `expires_at`, `used`) VALUES
(7, '2025-09-13 12:29:57', '2025-09-17 18:32:30', '43537113', '495aef7a50a6bca61f3eaf7ded58d601949d8d1770755d2a322b4ee888a30c64', '2025-09-13 18:29:57', 0),
(16, '2025-09-20 14:23:31', '2025-09-20 14:23:31', '00fb5fb2-932f-45da-9fa1-60403f078f32', '4807c9dbe537589e1274b6e4099f079748985cb961e71c4b29ab0cd53e6c6bbc', '2025-09-20 20:23:31', NULL),
(17, '2025-09-20 14:23:34', '2025-09-20 14:24:37', 'white_label_client_demo', '196c6e31f89598aa3d251f7635f58ac2102e6716c143300b22c88a6eaa34d67f', '2025-09-20 20:23:34', 1),
(19, '2025-09-23 16:40:33', '2025-09-23 16:41:48', '44187263', 'cc95c315ab3fc082274a0b857ef97e3a44cf92bcb8cc1ae49327bfec23f1a43c', '2025-09-23 22:40:33', 1),
(20, '2025-09-23 21:16:59', '2025-09-23 21:17:40', '44377090', 'f152d10d8ddde24d709cacdb81b464c81751d0367253e54ce185078f725dc35c', '2025-09-24 03:16:59', 1);

-- --------------------------------------------------------

--
-- Table structure for table `payment_accounts`
--

CREATE TABLE `payment_accounts` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `user_id` varchar(255) NOT NULL,
  `bank_name` varchar(255) NOT NULL,
  `account_owner_name` varchar(255) NOT NULL,
  `account_number` varchar(255) NOT NULL,
  `account_type` varchar(50) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payment_accounts`
--

INSERT INTO `payment_accounts` (`id`, `created_at`, `updated_at`, `user_id`, `bank_name`, `account_owner_name`, `account_number`, `account_type`, `is_active`) VALUES
(1, '2025-08-23 16:40:51', '2025-08-24 10:51:01', '', '', '', '', '', 1),
(2, '2025-08-24 10:43:19', '2025-08-24 10:43:19', '', '', '', '', '', 1),
(3, '2025-08-29 16:05:23', '2025-08-29 16:05:23', '', '', '', '', '', 1),
(4, '2025-08-29 16:09:41', '2025-08-29 16:09:41', '', '', '', '', '', 1),
(5, '2025-08-29 17:00:57', '2025-08-29 17:00:57', '', '', '', '', '', 1),
(6, '2025-09-19 22:37:32', '2025-09-19 22:38:13', '6kk4onsspvzjoml', 'Meezan Bank', 'Zaid Raza', '0336252924', 'savings', 1),
(7, '2025-10-15 12:59:53', '2025-10-15 12:59:53', '53cnffx7v02h7if', 'Meezan', 'Hammadi Saqib', '0333333333333', 'business_savings', 1);

-- --------------------------------------------------------

--
-- Table structure for table `plans`
--

CREATE TABLE `plans` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `monthly_price` varchar(255) DEFAULT NULL,
  `affiliate_commission_percentage` varchar(255) DEFAULT NULL,
  `max_users` int(11) DEFAULT NULL,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features`)),
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `accesses` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '[]' CHECK (json_valid(`accesses`)),
  `selected_categories` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '[]' CHECK (json_valid(`selected_categories`)),
  `selected_products` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '[]' CHECK (json_valid(`selected_products`)),
  `is_public` tinyint(1) DEFAULT 0,
  `is_main_site_plan` tinyint(1) DEFAULT 0,
  `allow_affiliate_promotion` tinyint(1) DEFAULT 1,
  `status` varchar(50) DEFAULT 'published',
  `scheduled_at` timestamp NULL DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `plans`
--

INSERT INTO `plans` (`id`, `name`, `description`, `monthly_price`, `affiliate_commission_percentage`, `max_users`, `features`, `is_active`, `created_by`, `created_at`, `updated_at`, `accesses`, `selected_categories`, `selected_products`, `is_public`, `is_main_site_plan`, `allow_affiliate_promotion`, `status`, `scheduled_at`, `published_at`) VALUES
(74, '12 Testing', 'Testing plan for 12 users', '22.00', '10', 12, '[\"Basic Features\", \"12 User Access\", \"Standard Support\"]', 1, 'system', '2025-10-14 21:34:00', '2025-10-14 21:34:00', '[]', '[]', '[]', 1, 0, 1, 'published', NULL, NULL),
(127, 'test', 'test', '344', '10', NULL, '[\"[\\\"[\\\\\\\"[\\\\\\\\\\\\\\\"[\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"test\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"]\\\\\\\\\\\\\\\"]\\\\\\\"]\\\"]\"]', 1, '43537113', '2025-09-20 11:46:22', '2025-10-10 17:58:08', '[\"categories\",\"affiliates\",\"landing_page_builder\"]', '[]', '[]', 0, 1, 1, 'published', NULL, '2025-10-10 17:58:08'),
(129, 'News Plan', '', '22', NULL, NULL, '[\"2\"]', 1, '43537113', '2025-09-21 20:19:26', '2025-09-21 20:19:26', '[]', '[]', '[]', 0, 1, 0, 'published', NULL, '2025-09-21 20:19:26'),
(130, 'Newss', '', '344', NULL, NULL, '[\"ef\"]', 1, '43537113', '2025-09-21 21:28:44', '2025-09-21 21:28:44', '[]', '[]', '[]', 0, 1, 0, 'published', NULL, '2025-09-21 21:28:44'),
(131, 'Rayiii', '', '344', '22', NULL, '[\"[\\\"[\\\\\\\"[\\\\\\\\\\\\\\\"ry\\\\\\\\\\\\\\\"]\\\\\\\"]\\\"]\"]', 1, '43537113', '2025-09-21 21:30:28', '2025-10-17 22:53:51', '[\"categories\",\"affiliates\",\"landing_page_builder\"]', '[6,19,20,30,21]', '[]', 0, 1, 1, 'published', NULL, '2025-10-17 22:53:51'),
(133, 'Google Maps', 'Hey', '11', '5', NULL, '[\"[\\\"[\\\\\\\"[\\\\\\\\\\\\\\\"[\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"[\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"[\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"[\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"[\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"hgh\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"]\\\\\\\\\\\\\\\"]\\\\\\\"]\\\"]\"]', 1, '44187263', '2025-10-10 13:57:42', '2025-10-10 18:20:18', '[]', '[]', '[]', 0, 0, 1, 'published', NULL, '2025-10-10 18:11:08'),
(134, 'Shoot Zone', 'Hey', '1313', '10', NULL, '[\"[\\\"[\\\\\\\"[\\\\\\\\\\\\\\\"[\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"[\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"[\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"[\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"[\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"hgh\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"]\\\\\\\\\\\\\\\"]\\\\\\\"]\\\"]\"]', 1, '44187263', '2025-10-10 14:00:56', '2025-10-10 18:24:54', '[]', '[37,38,40]', '[47,45]', 0, 0, 1, 'published', NULL, '2025-10-10 18:11:46'),
(136, 'Raywl', 'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.', '11', '22', NULL, '[\"[\\\"[\\\\\\\"[\\\\\\\\\\\\\\\"[\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"[\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"[\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"For\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"]\\\\\\\\\\\\\\\"]\\\\\\\"]\\\"]\"]', 1, '44187263', '2025-10-10 18:25:27', '2025-10-16 22:13:47', '[]', '[37,38,40,45,46]', '[64,63,62,61,60,47,45]', 0, 1, 1, 'published', NULL, '2025-10-16 22:13:47'),
(137, 'Copy of test', NULL, '344', NULL, NULL, NULL, 1, 'test-whitelabel-123', '2025-10-10 20:25:31', '2025-10-10 20:25:31', '[]', '[]', '[]', 0, 0, 1, 'published', NULL, NULL),
(138, 'Copy of News Plan', NULL, '22', NULL, NULL, NULL, 1, 'test-whitelabel-123', '2025-10-10 20:25:31', '2025-10-10 20:25:31', '[]', '[]', '[]', 0, 0, 1, 'published', NULL, NULL),
(139, 'Copy of Newss', NULL, '344', NULL, NULL, NULL, 1, 'test-whitelabel-123', '2025-10-10 20:25:31', '2025-10-10 20:25:31', '[]', '[]', '[]', 0, 0, 1, 'published', NULL, NULL),
(140, 'whitelabelsep', '', '341', '22', NULL, '[\"AI Generated Description\"]', 1, '44187263', '2025-10-11 08:16:48', '2025-10-11 08:16:48', '[]', '[]', '[]', 0, 0, 1, 'published', NULL, '2025-10-11 08:16:48'),
(141, 'Testing For My Affiliate', '', '12', '9.8', NULL, '[\"[\\\"[\\\\\\\"Testing\\\\\\\"]\\\"]\"]', 1, '43537113', '2025-10-15 12:54:27', '2025-10-15 12:57:54', '[]', '[]', '[]', 0, 1, 1, 'published', NULL, '2025-10-15 12:57:54'),
(142, 'test_username', '', '22', '22', NULL, '[\"22\"]', 1, '43537113', '2025-10-18 09:02:14', '2025-10-18 09:02:14', '[]', '[]', '[]', 0, 1, 1, 'published', NULL, '2025-10-18 09:02:14');

-- --------------------------------------------------------

--
-- Table structure for table `plan_categories`
--

CREATE TABLE `plan_categories` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `plan_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `plan_categories`
--

INSERT INTO `plan_categories` (`id`, `created_at`, `updated_at`, `plan_id`, `category_id`) VALUES
(9, '2025-10-14 23:20:37', '2025-10-14 23:20:37', 74, 1),
(10, '2025-10-14 23:20:37', '2025-10-14 23:20:37', 74, 6),
(11, '2025-10-14 23:20:37', '2025-10-14 23:20:37', 74, 7),
(12, '2025-10-14 23:20:37', '2025-10-14 23:20:37', 136, 1),
(13, '2025-10-14 23:20:37', '2025-10-14 23:20:37', 136, 6),
(14, '2025-10-14 23:20:37', '2025-10-14 23:20:37', 136, 7);

-- --------------------------------------------------------

--
-- Table structure for table `plan_products`
--

CREATE TABLE `plan_products` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `plan_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `plan_products`
--

INSERT INTO `plan_products` (`id`, `created_at`, `updated_at`, `plan_id`, `product_id`) VALUES
(6, '2025-10-14 23:20:37', '2025-10-14 23:20:37', 74, 13),
(7, '2025-10-14 23:20:37', '2025-10-14 23:20:37', 74, 14),
(8, '2025-10-14 23:20:37', '2025-10-14 23:20:37', 74, 15),
(9, '2025-10-14 23:20:37', '2025-10-14 23:20:37', 136, 13),
(10, '2025-10-14 23:20:37', '2025-10-14 23:20:37', 136, 14),
(11, '2025-10-14 23:20:37', '2025-10-14 23:20:37', 136, 15);

-- --------------------------------------------------------

--
-- Table structure for table `platform_settings`
--

CREATE TABLE `platform_settings` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `white_label_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `created_by` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `type` varchar(50) NOT NULL,
  `content_url` varchar(255) DEFAULT NULL,
  `access_duration` int(11) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `attachments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '[]' CHECK (json_valid(`attachments`)),
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `white_label_id`, `category_id`, `created_by`, `name`, `description`, `price`, `type`, `content_url`, `access_duration`, `image_url`, `attachments`, `metadata`, `is_active`, `created_at`, `updated_at`) VALUES
(13, 2, 32, '43537113', 'React.js', 'React is a free and open-source front-end JavaScript library that aims to make building user interfaces based on components more \"seamless\". It is maintained by Meta and a community of individual developers and companies.', 5.00, 'video', 'If you google which city never sleeps, it says New York but I kept staring out of my window one _1752502507003-364534185.mp4', NULL, '', '[]', NULL, 1, '2025-06-21 12:16:45', '2025-07-14 04:15:07'),
(14, 2, 34, '43537113', 'JavaScript', 'Complete JavaScript programming course', 29.99, 'document', 'demo_document_14.pdf', NULL, '', '[]', NULL, 1, '2025-06-21 12:18:14', '2025-07-14 04:11:36'),
(15, 2, 33, '43537113', 'Google Maps', 'Find local businesses, view maps and get driving directions in Google Maps.', 39.99, 'website_link', 'https://maps.google.com/', NULL, 'https://maps.google.com/favicon.ico', '[]', NULL, 1, '2025-06-21 12:18:14', '2025-07-14 04:17:33'),
(18, 2, NULL, '43537113', 'YouTube', 'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.', 1.00, 'website_link', 'https://www.youtube.com/', NULL, 'https://www.youtube.com/', '[]', NULL, 1, '2025-06-21 12:39:22', '2025-06-21 12:39:22'),
(19, 2, NULL, '43537113', 'car', 'c', 1.00, 'document', 'demo_document_19.pdf', NULL, '', '[]', NULL, 1, '2025-06-21 12:49:56', '2025-06-21 12:49:56'),
(20, 2, NULL, '43537113', 'Video', 'Video', 2.00, 'document', 'demo_document_20.pdf', NULL, '', '[]', NULL, 1, '2025-06-21 13:00:20', '2025-07-12 04:01:28'),
(21, 2, NULL, '43537113', 'YouTube', 'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.', 5.00, 'website_link', 'https://www.youtube.com/', NULL, 'https://www.youtube.com/', '[]', NULL, 1, '2025-06-23 12:17:38', '2025-06-23 12:17:38'),
(23, 2, NULL, '43537113', 'YouTube', 'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.', 5.00, 'website_link', 'https://youtube.com/', NULL, 'https://www.youtube.com/img/desktop/yt_1200.png', '[]', NULL, 1, '2025-06-23 12:18:15', '2025-08-13 03:35:43'),
(25, 8, NULL, '44443117', 'YouTube', 'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.', 5.00, 'website_link', 'https://youtube.com/', NULL, 'https://www.youtube.com/s/desktop/f506bd45/img/favicon_144x144.png', '[]', NULL, 1, '2025-06-30 14:36:24', '2025-06-30 14:36:24'),
(26, 8, NULL, '44443117', 'YouTube', 'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.', 0.01, 'website_link', 'https://youtube.com/', NULL, 'https://www.youtube.com/s/desktop/f506bd45/img/favicon_144x144.png', '[]', NULL, 1, '2025-06-30 14:40:55', '2025-06-30 14:40:55'),
(28, 10, NULL, '44622389', 'YouTube', '**YouTube: The World\'s Infinite Digital Stage**\n\nYouTube isn\'t merely a video-sharing platform; it\'s the definitive global nexus for visual storytelling, a boundless digital universe where every idea, passion, and piece of information finds its audience. From groundbreaking documentaries to the latest chart-topping music videos, insightful educational tutorials to viral comedy sensations, YouTube stands as the most expansive and diverse library of human creativity ever assembled. It\'s where billions connect daily to be entertained, educated, and inspired, transcending geographical boundaries and cultural divides with the universal language of video.\n\nWhat truly distinguishes YouTube is its profound democratization of content creation, transforming passive consumption into active participation. It empowered individuals from all walks of life to become creators, offering a powerful megaphone for unique voices, niche interests, and artistic expressions. This platform has not only launched', 899.00, 'website_link', 'https://www.youtube.com/', NULL, 'https://www.youtube.com/', '[]', NULL, 1, '2025-07-04 10:18:01', '2025-07-04 10:18:01'),
(42, 7, NULL, '44187263', 'Shoot Zone', 'Hey Everyone! Welcome to “Shoot Zone” YouTube Channel!\nI created this channel for android and pc games i upload daily videos about mobile and pc related games and gaming news so if you’re interested in playing games so this channel is helpful for you.\nPlease SUBSCRIBE to Shoot Zone, Thanks. NOTE: I’m from Pakistan, but the channel’s location is India because of unavailability of some YouTube features in Pakistan!', 0.99, 'website_link', 'https://youtube.com/@ShootZone', NULL, 'https://www.youtube.com/s/desktop/f506bd45/img/favicon_144x144.png', '[]', NULL, 1, '2025-07-12 14:24:35', '2025-07-13 11:38:25'),
(43, 7, NULL, '44187263', 'Munib Ahmed', '1', 1.00, 'document', 'entry_A22B11111_1747581455551.pdf_1752366298089', NULL, '', '[]', NULL, 1, '2025-07-12 14:24:59', '2025-07-12 14:24:59'),
(44, 7, NULL, '44187263', 'M2', 'M2', 69.00, 'document', 'test_document.pdf', NULL, '', '[]', NULL, 1, '2025-07-12 14:29:07', '2025-07-12 14:29:07'),
(45, 7, 37, '44187263', 'MT2C', 'MT2C', 69.00, 'document', 'test_document.pdf', NULL, '', '[]', NULL, 1, '2025-07-12 14:30:01', '2025-07-13 05:52:07'),
(47, 7, 38, '44187263', 'M2SCf', 'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.', 0.01, 'website_link', 'https://facebook.com/', NULL, 'https://www.facebook.com/images/fb_icon_325x325.png', '[]', NULL, 1, '2025-07-13 09:25:59', '2025-10-16 21:19:56'),
(48, 7, NULL, '44187263', 'Shoot Zone', 'Hey Everyone! Welcome to “Shoot Zone” YouTube Channel!\nI created this channel for android and pc games i upload daily videos about mobile and pc related games and gaming news so if you’re interested in playing games so this channel is helpful for you.\nPlease SUBSCRIBE to Shoot Zone, Thanks. NOTE: I’m from Pakistan, but the channel’s location is India because of unavailability of some YouTube features in Pakistan!', 0.99, 'website_link', 'https://youtube.com/@ShootZone', NULL, 'https://www.youtube.com/s/desktop/f506bd45/img/favicon_144x144.png', '[]', NULL, 1, '2025-07-13 11:41:20', '2025-07-13 11:41:20'),
(49, 7, NULL, '44187263', 'Shoot Zonesss', 'Hey Everyone! Welcome to “Shoot Zone” YouTube Channel!\nI created this channel for android and pc games i upload daily videos about mobile and pc related games and gaming news so if you’re interested in playing games so this channel is helpful for you.\nPlease SUBSCRIBE to Shoot Zone, Thanks. NOTE: I’m from Pakistan, but the channel’s location is India because of unavailability of some YouTube features in Pakistan!', 1.00, 'website_link', 'https://youtube.com/', NULL, 'https://www.youtube.com/s/desktop/f506bd45/img/favicon_144x144.png', '[]', NULL, 1, '2025-07-13 11:41:34', '2025-07-13 11:49:56'),
(50, 7, NULL, '44187263', 'Shoot Zone', 'Hey Everyone! Welcome to “Shoot Zone” YouTube Channel!\nI created this channel for android and pc games i upload daily videos about mobile and pc related games and gaming news so if you’re interested in playing games so this channel is helpful for you.\nPlease SUBSCRIBE to Shoot Zone, Thanks. NOTE: I’m from Pakistan, but the channel’s location is India because of unavailability of some YouTube features in Pakistan!', 1.00, 'website_link', 'https://www.youtube.com/@ShootZone', NULL, 'https://www.youtube.com/s/desktop/f506bd45/img/favicon_144x144.png', '[]', NULL, 1, '2025-07-13 11:42:12', '2025-07-13 11:44:53'),
(51, 7, NULL, '44187263', 'asalllll', 'ass', 22.00, 'document', 'entry_A22B11111_1747581455551_1752443217361-399200082.pdf', NULL, '', '[]', NULL, 1, '2025-07-13 11:46:58', '2025-07-13 11:46:58'),
(52, 7, NULL, '44187263', 'YouTube', 'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.', 149.98, 'website_link', 'https://youtube.com/', NULL, 'https://www.youtube.com/s/desktop/f506bd45/img/favicon_144x144.png', '[]', NULL, 1, '2025-08-01 22:59:17', '2025-08-01 22:59:17'),
(53, 7, NULL, '44187263', 'YouTube', 'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.', 22.00, 'website_link', 'https://youtube.com/', NULL, 'https://www.youtube.com/s/desktop/f506bd45/img/favicon_144x144.png', '[]', NULL, 1, '2025-08-12 22:00:38', '2025-08-12 22:00:38'),
(54, 7, NULL, '44187263', 'Test Product with Meta URL Image', 'Product with imageUrl field set', 25.99, 'website_link', 'https://youtube.com/', NULL, 'https://www.youtube.com/@ShootZone/', '[]', NULL, 1, '2025-08-12 22:01:38', '2025-08-12 22:15:26'),
(55, 7, NULL, '44187263', 'Test Product with File Attachment', 'Product with image file in attachments', 35.99, 'digital_product', NULL, NULL, NULL, '[{\"url\":\"https://www.youtube.com/img/desktop/yt_1200.png\",\"name\":\"product-image.jpg\",\"type\":\"image/jpeg\"}]', NULL, 1, '2025-08-12 22:01:38', '2025-08-12 22:01:38'),
(56, 7, NULL, '44187263', 'Test Product No Image', 'Product with no images at all', 15.99, 'digital_product', NULL, NULL, NULL, '[]', NULL, 1, '2025-08-12 22:01:38', '2025-08-12 22:01:38'),
(57, 7, NULL, '44187263', 'YouTube', 'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.', 11.00, 'website_link', 'https://youtube.com/', NULL, 'https://yt3.googleusercontent.com/Kq1Etwm_KLNjOFvnBsaCYIzHW8cL5QnSmR4ZWvZSpsNNQii9wSyta7AgJHx_Z0lW_-h8MZRL=s900-c-k-c0x00ffffff-no-rj', '[{\"url\":\"https://www.youtube.com/img/desktop/yt_1200.png\",\"name\":\"product-image.jpg\",\"type\":\"image/jpeg\"}]', NULL, 1, '2025-08-12 22:19:45', '2025-08-12 22:19:45'),
(58, 7, NULL, '44187263', 'YouTube', 'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.', 110.00, 'website_link', 'https://youtube.com/', NULL, 'https://www.youtube.com/s/desktop/f506bd45/img/favicon_144x144.png', '[]', NULL, 1, '2025-08-12 23:05:47', '2025-08-12 23:05:47'),
(59, 7, NULL, '44187263', '12 Testing', '12 Testing', 11.00, 'digital_product', 'entry_A22B11111_1747581455551_1755075998890-312650748.pdf', NULL, '', '[]', NULL, 1, '2025-08-12 23:06:39', '2025-08-12 23:06:39'),
(60, 7, NULL, '44187263', 'YouTube Last', 'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.', 11.00, 'website_link', 'https://youtube.com/', NULL, 'https://www.youtube.com/img/desktop/yt_1200.png', '[]', NULL, 1, '2025-08-12 23:27:11', '2025-08-12 23:27:11'),
(61, 7, NULL, '44187263', 'Shoot Zone11', 'Hey Everyone! Welcome to “Shoot Zone” YouTube Channel!\nI created this channel for android and pc games i upload daily videos about mobile and pc related games and gaming news so if you’re interested in playing games so this channel is helpful for you.\nPlease SUBSCRIBE to Shoot Zone, Thanks. NOTE: I’m from Pakistan, but the channel’s location is India because of unavailability of some YouTube features in Pakistan!', 1.00, 'website_link', 'https://www.youtube.com/@ShootZone/', NULL, 'https://yt3.googleusercontent.com/Kq1Etwm_KLNjOFvnBsaCYIzHW8cL5QnSmR4ZWvZSpsNNQii9wSyta7AgJHx_Z0lW_-h8MZRL=s900-c-k-c0x00ffffff-no-rj', '[]', NULL, 1, '2025-08-12 23:28:09', '2025-08-12 23:28:09'),
(62, 7, NULL, '44187263', 'YouTube', 'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.', 1212.00, 'website_link', 'https://youtube.com/', NULL, 'https://www.youtube.com/img/desktop/yt_1200.png', '[]', NULL, 1, '2025-08-12 23:34:07', '2025-08-12 23:34:07'),
(63, 7, NULL, '44187263', 'Shoot Zone', 'Hey Everyone! Welcome to “Shoot Zone” YouTube Channel!\nI created this channel for android and pc games i upload daily videos about mobile and pc related games and gaming news so if you’re interested in playing games so this channel is helpful for you.\nPlease SUBSCRIBE to Shoot Zone, Thanks. NOTE: I’m from Pakistan, but the channel’s location is India because of unavailability of some YouTube features in Pakistan!', 1313.00, 'website_link', 'https://www.youtube.com/@ShootZone/', NULL, 'https://yt3.googleusercontent.com/Kq1Etwm_KLNjOFvnBsaCYIzHW8cL5QnSmR4ZWvZSpsNNQii9wSyta7AgJHx_Z0lW_-h8MZRL=s900-c-k-c0x00ffffff-no-rj', '[]', NULL, 1, '2025-08-12 23:34:20', '2025-08-12 23:34:20'),
(64, 7, 46, '44187263', 'Google Mapss', 'Find local businesses, view maps and get driving directions in Google Maps.', 22.00, 'website_link', 'https://www.google.com/maps', NULL, 'https://maps.google.com/maps/api/staticmap?center=41.0115895%2C-74.304999&zoom=7&size=900x900&language=en&sensor=false&client=google-maps-frontend&signature=Aw_TC74Z_OiOXKvexlZY80L2uIw', '[]', NULL, 1, '2025-08-14 01:27:26', '2025-10-16 22:13:55'),
(66, 63, NULL, '00fb5fb2-932f-45da-9fa1-60403f078f32', 'Google Maps', 'Find local businesses, view maps and get driving directions in Google Maps.', 12.00, 'website_link', 'https://maps.google.com/', NULL, 'https://maps.google.com/maps/api/staticmap?center=41.01158955%2C-74.304999&zoom=8&size=900x900&language=en&sensor=false&client=google-maps-frontend&signature=IQ0a233xNdQP09IZsM6QOWKvM9E', '[]', NULL, 1, '2025-09-20 10:38:26', '2025-09-20 10:38:26');

-- --------------------------------------------------------

--
-- Table structure for table `promoted_sales`
--

CREATE TABLE `promoted_sales` (
  `id` int(11) NOT NULL,
  `purchase_id` int(11) NOT NULL,
  `plan_id` int(11) NOT NULL,
  `plan_name` varchar(255) NOT NULL,
  `plan_price` decimal(10,2) NOT NULL,
  `plan_commission_percentage` decimal(5,2) NOT NULL,
  `plan_description` text DEFAULT NULL,
  `plan_features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`plan_features`)),
  `promoter_user_id` varchar(255) NOT NULL,
  `promoter_domain_path` varchar(255) NOT NULL,
  `plan_owner_user_id` varchar(255) NOT NULL,
  `buyer_user_id` varchar(255) NOT NULL,
  `buyer_username` varchar(255) DEFAULT NULL,
  `buyer_email` varchar(255) DEFAULT NULL,
  `sale_amount` decimal(10,2) NOT NULL,
  `commission_amount` decimal(10,2) NOT NULL,
  `commission_status` enum('pending','paid','cancelled') DEFAULT 'pending',
  `sale_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `promoted_sales`
--

INSERT INTO `promoted_sales` (`id`, `purchase_id`, `plan_id`, `plan_name`, `plan_price`, `plan_commission_percentage`, `plan_description`, `plan_features`, `promoter_user_id`, `promoter_domain_path`, `plan_owner_user_id`, `buyer_user_id`, `buyer_username`, `buyer_email`, `sale_amount`, `commission_amount`, `commission_status`, `sale_date`, `created_at`, `updated_at`) VALUES
(2, 331, 140, 'whitelabelsep', 341.00, 22.00, '', '\"[\\\"AI Generated Description\\\"]\"', '', 'hammad', '44187263', 'iz2vpsv2u00nlu9', 'epic2244', NULL, 341.00, 75.02, 'pending', '2025-10-13 10:04:02', '2025-10-13 10:04:02', '2025-10-13 10:06:48'),
(3, 333, 136, 'Raywl', 11.00, 22.00, NULL, NULL, 'hua1objl8w40fw7', 'four1234488', '44187263', 'iz2vpsv2u00nlu9', NULL, NULL, 11.00, 2.42, 'pending', '2025-10-13 10:08:23', '2025-10-13 10:24:51', '2025-10-13 10:24:51'),
(4, 335, 136, 'Raywl', 11.00, 22.00, NULL, NULL, 'hua1objl8w40fw7', 'four1234488', '44187263', 'iz2vpsv2u00nlu9', NULL, NULL, 11.00, 2.42, 'pending', '2025-10-13 10:26:19', '2025-10-13 10:33:02', '2025-10-13 10:33:02'),
(5, 340, 136, 'Raywl', 11.00, 22.00, '', '\"[\\\"[\\\\\\\"For\\\\\\\"]\\\"]\"', 'hua1objl8w40fw7', 'four1234488', '44187263', 'cc3100ce-940e-4156-a0ae-de338282fafb', NULL, NULL, 11.00, 2.42, 'pending', '2025-10-13 11:09:37', '2025-10-13 11:53:00', '2025-10-13 11:53:00'),
(6, 339, 133, 'Google Maps', 11.00, 5.00, 'Hey', '\"[\\\"[\\\\\\\"[\\\\\\\\\\\\\\\"[\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"[\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"[\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"[\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"[\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"[\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"hgh\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"]\\\\\\\\\\\\\\\"]\\\\\\\"]\\\"]\"', 'hua1objl8w40fw7', 'four1234488', '44187263', '1758320372285_testing1221', NULL, NULL, 11.00, 0.55, 'pending', '2025-10-13 11:04:51', '2025-10-13 11:53:00', '2025-10-13 11:53:00'),
(7, 338, 133, 'Google Maps', 11.00, 5.00, 'Hey', '\"[\\\"[\\\\\\\"[\\\\\\\\\\\\\\\"[\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"[\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"[\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"[\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"[\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"[\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"hgh\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"]\\\\\\\\\\\\\\\"]\\\\\\\"]\\\"]\"', 'hua1objl8w40fw7', 'four1234488', '44187263', '1758320372285_testing1221', NULL, NULL, 11.00, 0.55, 'pending', '2025-10-13 11:04:05', '2025-10-13 11:53:00', '2025-10-13 11:53:00');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_history`
--

CREATE TABLE `purchase_history` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` varchar(50) DEFAULT 'pending',
  `user_id` varchar(255) NOT NULL,
  `plan_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(100) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `white_label_id` int(11) NOT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `purchase_history`
--

INSERT INTO `purchase_history` (`id`, `created_at`, `updated_at`, `status`, `user_id`, `plan_id`, `amount`, `payment_method`, `transaction_id`, `white_label_id`, `metadata`) VALUES
(1, '2025-07-04 05:54:21', '2025-09-17 18:32:31', 'completed', 'munibahmed125521@gmail.com', 1, 69.00, 'NMI Gateway', 'txn_12345', 1, '{\"planName\":\"YouTube\",\"domainPath\":\"hammad\"}'),
(2, '2025-07-03 05:54:21', '2025-09-17 18:32:31', 'completed', 'test@example.com', 1, 5.00, 'NMI Gateway', 'txn_12346', 1, '{\"planName\":\"YouTube\",\"domainPath\":\"hammad\"}'),
(3, '2025-07-03 06:47:43', '2025-09-17 18:32:31', 'completed', '44443117', 54, 79.99, 'card', 'txn_test_1234567890', 7, NULL),
(4, '2025-06-30 06:47:43', '2025-09-17 18:32:31', 'completed', '44443117', 54, 79.99, 'card', 'txn_test_1234567891', 7, NULL),
(5, '2025-06-28 06:47:43', '2025-09-17 18:32:31', 'completed', '44443117', 54, 79.99, 'card', 'txn_test_1234567892', 7, NULL),
(6, '2025-07-04 07:14:42', '2025-09-17 18:32:31', 'completed', '44443117', 54, 79.99, 'card', 'txn_test_2_1234567893', 2, NULL),
(7, '2025-07-02 07:14:42', '2025-09-17 18:32:31', 'completed', '44443117', 54, 79.99, 'card', 'txn_test_2_1234567894', 2, NULL),
(8, '2025-06-29 07:14:42', '2025-09-17 18:32:31', 'completed', '44443117', 54, 79.99, 'card', 'txn_test_2_1234567895', 2, NULL),
(9, '2025-07-10 10:41:19', '2025-09-17 18:32:31', 'completed', 'guest_1752180079711_g2i8ae', 55, 1.00, NULL, '10904434444', 2, NULL),
(10, '2025-07-10 10:41:55', '2025-09-17 18:32:31', 'completed', 'guest_1752180115196_d50l55', 55, 1.00, NULL, '10904437171', 2, NULL),
(11, '2025-07-10 10:43:20', '2025-09-17 18:32:31', 'completed', 'guest_1752180200711_c2p6wz', 55, 1.00, NULL, '10904443509', 2, NULL),
(12, '2025-07-10 10:49:32', '2025-09-17 18:32:31', 'completed', 'guest_1752180571926_brr5wt', 54, 69.00, NULL, '10904470532', 2, NULL),
(13, '2025-07-10 10:54:37', '2025-09-17 18:32:31', 'completed', 'guest_1752180877442_686p52', 54, 69.00, NULL, '10904493841', 2, NULL),
(14, '2025-07-12 03:00:15', '2025-09-17 18:32:31', 'completed', 'anonymous_user', 55, 1.00, 'modal_checkout', 'txn_1752325215549_dagz3lwwj', 2, '{\"source\":\"modal_checkout\",\"planName\":\"Video\",\"domainPath\":\"hammad\"}'),
(15, '2025-07-12 03:03:23', '2025-09-17 18:32:31', 'completed', '44187263', 55, 1.00, 'modal_checkout', 'txn_1752325403369_33aqago24', 2, '{\"source\":\"modal_checkout\",\"planName\":\"Video\",\"domainPath\":\"hammad\"}'),
(16, '2025-07-01 10:44:21', '2025-09-17 18:32:31', 'completed', 'guest_1751402661494', 24, 49.99, 'card', '10874079792', 7, NULL),
(17, '2025-07-01 10:44:48', '2025-09-17 18:32:31', 'completed', 'guest_1751402688689', 24, 49.99, 'card', '10874081769', 7, NULL),
(18, '2025-07-10 10:23:33', '2025-09-17 18:32:31', 'completed', 'guest_1752179012965', 55, 1.00, 'card', '10904374412', 2, NULL),
(19, '2025-07-12 03:22:11', '2025-09-17 18:32:31', 'completed', 'anonymous_user', 55, 1.00, 'modal_checkout', 'txn_1752326531496_j73byz0hf', 2, '{\"source\":\"modal_checkout\",\"planName\":\"Video\",\"domainPath\":\"hammad\"}'),
(20, '2025-07-12 03:24:41', '2025-09-17 18:32:31', 'completed', '44187263', 55, 1.00, 'modal_checkout', 'txn_1752326681754_w560m8vy6', 2, '{\"source\":\"modal_checkout\",\"planName\":\"Video\",\"domainPath\":\"hammad\"}'),
(21, '2025-07-12 03:25:35', '2025-09-17 18:32:31', 'completed', '44187263', 54, 69.00, 'modal_checkout', 'txn_1752326735788_95grt3ise', 2, '{\"source\":\"modal_checkout\",\"planName\":\"YouTube\",\"domainPath\":\"hammad\"}'),
(22, '2025-07-12 03:26:35', '2025-09-17 18:32:31', 'completed', '44187263', 55, 1.00, 'modal_checkout', 'txn_1752326795348_r68cl669j', 2, '{\"source\":\"modal_checkout\",\"planName\":\"Video\",\"domainPath\":\"hammad\"}'),
(23, '2025-07-12 03:27:37', '2025-09-17 18:32:31', 'completed', '44187263', 52, 5.00, 'modal_checkout', 'txn_1752326857188_1h8iix9bc', 2, '{\"source\":\"modal_checkout\",\"planName\":\"YouTubejj\",\"domainPath\":\"hammad\"}'),
(24, '2025-07-12 03:28:48', '2025-09-17 18:32:31', 'completed', '44187263', 52, 5.00, 'modal_checkout', 'txn_1752326928417_633w936zv', 2, '{\"source\":\"modal_checkout\",\"planName\":\"YouTubejj\",\"domainPath\":\"hammad\"}'),
(26, '2025-07-12 03:59:57', '2025-09-17 18:32:31', 'completed', '44187263', 56, 29.99, 'modal_checkout', 'txn_1752328797688_egz40z85u', 2, '{\"source\":\"modal_checkout\",\"planName\":\"JavaScript\",\"domainPath\":\"hammad\"}'),
(27, '2025-07-12 04:26:48', '2025-09-17 18:32:31', 'completed', 'anonymous_user', 56, 29.99, 'modal_checkout', 'txn_1752330408132_jt6qllfnz', 2, '{\"source\":\"modal_checkout\",\"planName\":\"JavaScript\",\"domainPath\":\"hammad\"}'),
(28, '2025-07-12 05:14:42', '2025-09-17 18:32:31', 'completed', '44915301', 55, 1.00, 'modal_checkout', 'txn_1752333282097_cjergfjj6', 2, '{\"source\":\"modal_checkout\",\"planName\":\"Video\",\"domainPath\":\"hammad\"}'),
(29, '2025-07-12 05:23:33', '2025-09-17 18:32:31', 'completed', '44187263', 59, 2.00, 'modal_checkout', 'txn_1752333813661_h50760ff5', 7, '{\"source\":\"modal_checkout\",\"planName\":\"YouTube\",\"domainPath\":\"shoot\"}'),
(30, '2025-07-12 06:30:37', '2025-09-17 18:32:31', 'completed', '44915301', 59, 2.00, 'modal_checkout', 'txn_1752337837330_z6qxahoc8', 7, '{\"source\":\"modal_checkout\",\"planName\":\"YouTube\",\"domainPath\":\"shoot\"}'),
(31, '2025-07-12 08:50:38', '2025-09-17 18:32:31', 'completed', '44915301', 45, 99.99, 'modal_checkout', 'txn_1752346238214_7lj9oy0sz', 7, '{\"source\":\"modal_checkout\",\"planName\":\"Car\",\"domainPath\":\"shoot\"}'),
(32, '2025-07-12 12:26:32', '2025-09-17 18:32:31', 'completed', '44915301', 45, 99.99, 'modal_checkout', 'txn_1752359192059_6uzgsqnkq', 7, '{\"source\":\"modal_checkout\",\"planName\":\"Car\",\"domainPath\":\"shoot\"}'),
(33, '2025-07-12 13:21:30', '2025-09-17 18:32:31', 'completed', '44915301', 60, 69.00, 'modal_checkout', 'txn_1752362490955_882usu797', 7, '{\"source\":\"modal_checkout\",\"planName\":\"Document File\",\"domainPath\":\"shoot\"}'),
(34, '2025-07-12 14:26:33', '2025-09-17 18:32:31', 'completed', '44915301', 61, 1.00, 'modal_checkout', 'txn_1752366393538_sf4mf6zcu', 7, '{\"source\":\"modal_checkout\",\"planName\":\"Munib Ahmed\",\"domainPath\":\"shoot\"}'),
(35, '2025-07-13 05:53:46', '2025-09-17 18:32:31', 'completed', '44915301', 64, 69.00, 'modal_checkout', 'txn_1752422026896_zthk6b3kc', 7, '{\"source\":\"modal_checkout\",\"planName\":\"M2\",\"domainPath\":\"shoot\"}'),
(36, '2025-07-13 05:59:47', '2025-09-17 18:32:31', 'completed', '44915301', 63, 1.00, 'modal_checkout', 'txn_1752422387176_zmaia5n1q', 7, '{\"source\":\"modal_checkout\",\"planName\":\"Car\",\"domainPath\":\"shoot\"}'),
(37, '2025-07-13 06:00:39', '2025-09-17 18:32:31', 'completed', '44915301', 45, 99.99, 'modal_checkout', 'txn_1752422439150_3ryl6z0ta', 7, '{\"source\":\"modal_checkout\",\"planName\":\"Car\",\"domainPath\":\"shoot\"}'),
(38, '2025-07-13 06:27:32', '2025-09-17 18:32:31', 'completed', '44377090', 64, 69.00, 'modal_checkout', 'txn_1752424052640_8emqp3aql', 7, '{\"source\":\"modal_checkout\",\"planName\":\"M2\",\"domainPath\":\"shoot\"}'),
(39, '2025-07-13 10:05:29', '2025-09-17 18:32:31', 'completed', '44377090', 65, 0.99, 'modal_checkout', 'txn_1752437129162_tk7dx8wlb', 7, '{\"source\":\"modal_checkout\",\"planName\":\"YouTubeD\",\"domainPath\":\"shoot\"}'),
(40, '2025-07-14 04:34:08', '2025-09-17 18:32:31', 'completed', '44377090', 56, 29.99, 'modal_checkout', 'txn_1752503648493_wc0tbeuw2', 2, '{\"source\":\"modal_checkout\",\"planName\":\"JavaScript\",\"domainPath\":\"hammad\"}'),
(41, '2025-07-15 00:00:00', '2025-09-17 18:32:31', 'completed', '43537113', 65, 22.00, NULL, NULL, 7, NULL),
(42, '2025-07-16 04:30:00', '2025-09-17 18:32:31', 'completed', '44443117', 65, 22.00, NULL, NULL, 7, NULL),
(43, '2025-07-16 23:15:00', '2025-09-17 18:32:31', 'completed', '44915301', 65, 22.00, NULL, NULL, 7, NULL),
(44, '2025-07-17 13:31:26', '2025-09-17 18:32:31', 'completed', '44377090', 65, 22.00, 'modal_checkout', 'txn_1752795086895_nwl3zx6xo', 7, '{\"source\":\"modal_checkout\",\"planName\":\"asalllll\",\"domainPath\":\"shoot\"}'),
(45, '2025-07-17 13:32:16', '2025-09-17 18:32:31', 'completed', '43537113', 65, 22.00, 'modal_checkout', 'txn_1752795136259_xlwm02y0r', 11, '{\"source\":\"modal_checkout\",\"planName\":\"asalllll\",\"domainPath\":\"epicaffiliate\"}'),
(46, '2025-07-17 13:32:52', '2025-09-17 18:32:31', 'completed', '43537113', 65, 22.00, 'modal_checkout', 'txn_1752795172062_tsdxnkrsj', 11, '{\"source\":\"modal_checkout\",\"planName\":\"asalllll\",\"domainPath\":\"epicaffiliate\"}'),
(47, '2025-07-17 13:38:19', '2025-09-17 18:32:31', 'completed', '43537113', 65, 22.00, 'modal_checkout', 'txn_1752795499973_fu6dwkyw2', 11, '{\"source\":\"modal_checkout\",\"planName\":\"asalllll\",\"domainPath\":\"epicaffiliate\"}'),
(48, '2025-07-17 13:39:36', '2025-09-17 18:32:31', 'completed', '43537113', 65, 22.00, 'test_checkout', 'test_txn_fake_purchase', 7, '{\"source\":\"test_checkout\",\"planName\":\"asalllll\",\"domainPath\":\"shoot\"}'),
(49, '2025-07-17 13:41:18', '2025-09-17 18:32:31', 'completed', '43537113', 64, 1.00, 'modal_checkout', 'txn_1752795678918_6yd72iz8n', 11, '{\"source\":\"modal_checkout\",\"planName\":\"Munib Ahmed\",\"domainPath\":\"epicaffiliate\"}'),
(50, '2025-07-17 13:48:44', '2025-09-17 18:32:31', 'completed', '43537113', 65, 22.00, 'modal_checkout', 'txn_1752796124739_pkduj748f', 11, '{\"source\":\"modal_checkout\",\"planName\":\"asalllll\",\"domainPath\":\"epicaffiliate\"}'),
(51, '2025-07-17 13:49:23', '2025-09-17 18:32:31', 'completed', '43537113', 64, 1.00, 'modal_checkout', 'txn_1752796163078_nw6de2owm', 11, '{\"source\":\"modal_checkout\",\"planName\":\"Munib Ahmed\",\"domainPath\":\"epicaffiliate\"}'),
(52, '2025-07-17 15:32:39', '2025-09-17 18:32:31', 'completed', '43537113', 65, 22.00, 'modal_checkout', 'txn_1752802359425_ef8aaxyc1', 11, '{\"source\":\"modal_checkout\",\"planName\":\"asalllll\",\"domainPath\":\"epicaffiliate\"}'),
(53, '2025-07-17 15:51:24', '2025-09-17 18:32:31', 'completed', '43537113', 65, 22.00, 'modal_checkout', 'txn_1752803484038_3scpec2rd', 11, '{\"source\":\"modal_checkout\",\"planName\":\"asalllll\",\"domainPath\":\"epicaffiliate\"}'),
(54, '2025-07-19 10:42:56', '2025-09-17 18:32:31', 'completed', '43537113', 60, 69.00, 'modal_checkout', 'txn_1752957776224_78xgpa774', 11, '{\"source\":\"modal_checkout\",\"planName\":\"Document File\",\"domainPath\":\"epicaffiliate\"}'),
(55, '2025-07-19 10:44:37', '2025-09-17 18:32:31', 'completed', '43537113', 65, 22.00, 'modal_checkout', 'txn_1752957877560_8wiq81ptk', 11, '{\"source\":\"modal_checkout\",\"planName\":\"asalllll\",\"domainPath\":\"epicaffiliate\"}'),
(56, '2025-07-19 10:48:02', '2025-09-17 18:32:31', 'completed', '44443117', 65, 22.00, 'modal_checkout', 'txn_1752958082881_5iz1vnuyk', 11, '{\"source\":\"modal_checkout\",\"planName\":\"asalllll\",\"domainPath\":\"epicaffiliate\"}'),
(58, '2025-07-22 15:46:31', '2025-09-17 18:32:31', 'completed', '44187263', 69, 99.99, NULL, NULL, 7, NULL),
(59, '2025-07-23 11:45:50', '2025-09-17 18:32:31', 'completed', '44443117', 69, 999.00, 'credit_card', NULL, 8, NULL),
(60, '2025-07-23 12:33:57', '2025-09-17 18:32:31', 'completed', '44377090', 64, 1.00, 'modal_checkout', 'txn_1753310037734_293tlgjue', 7, '{\"source\":\"modal_checkout\",\"planName\":\"Munib Ahmed\",\"domainPath\":\"shoot\"}'),
(61, '2025-07-23 12:36:23', '2025-09-17 18:32:31', 'completed', '44377090', 64, 1.00, 'modal_checkout', 'txn_1753310183609_02ucnqlnt', 7, '{\"source\":\"modal_checkout\",\"planName\":\"Munib Ahmed\",\"domainPath\":\"shoot\"}'),
(62, '2025-07-23 14:39:11', '2025-09-17 18:32:31', 'completed', 'anonymous_user', 69, 2.00, 'modal_checkout', 'txn_1753317551329_z6k6811yt', 12, '{\"source\":\"modal_checkout\",\"planName\":\"Pro Plan\",\"domainPath\":\"5starseco\"}'),
(63, '2025-07-23 14:43:30', '2025-09-17 18:32:31', 'completed', '44187263', 69, 2.00, 'modal_checkout', 'txn_1753317810277_2ohz8pq35', 12, '{\"source\":\"modal_checkout\",\"planName\":\"Pro Plan\",\"domainPath\":\"5starseco\"}'),
(64, '2025-07-23 15:36:01', '2025-09-17 18:32:31', 'completed', '44443117', 68, 29.00, 'credit_card', NULL, 8, NULL),
(65, '2025-07-23 15:54:38', '2025-09-17 18:32:31', 'completed', '44443117', 1, 29.00, 'credit_card', NULL, 8, NULL),
(66, '2025-07-23 16:11:24', '2025-09-17 18:32:31', 'completed', '44187263', 68, 29.00, 'credit_card', NULL, 7, '{\"source\":\"process_payment\",\"planName\":\"Basic Plan\",\"referralCode\":\"5starsecofficial\"}'),
(67, '2025-07-23 16:12:58', '2025-09-17 18:32:31', 'completed', '44187263', 1, 29.00, 'credit_card', NULL, 7, '{\"source\":\"process_payment\",\"planName\":\"Starter Plan\",\"referralCode\":null}'),
(68, '2025-07-23 16:13:19', '2025-09-17 18:32:31', 'completed', '44187263', 71, 121.00, 'credit_card', NULL, 7, '{\"source\":\"process_payment\",\"planName\":\"Testing\",\"referralCode\":\"5starsecofficial\"}'),
(69, '2025-07-23 16:26:24', '2025-09-17 18:32:31', 'completed', '44443117', 71, 121.00, 'credit_card', NULL, 8, '{\"source\":\"process_payment\",\"planName\":\"Testing\",\"referralCode\":null}'),
(70, '2025-07-23 16:28:51', '2025-09-17 18:32:31', 'completed', '44377090', 71, 121.00, 'credit_card', NULL, 6, '{\"source\":\"process_payment\",\"planName\":\"Testing\",\"referralCode\":\"5starsecofficial\"}'),
(71, '2025-07-23 16:33:20', '2025-09-17 18:32:31', 'completed', '44377090', 1, 29.00, 'credit_card', NULL, 6, '{\"source\":\"process_payment\",\"planName\":\"Starter Plan\",\"referralCode\":\"5starsecofficial\"}'),
(72, '2025-07-23 16:43:33', '2025-09-17 18:32:31', 'completed', '44443117', 69, 2.00, NULL, 'txn_demo_921066', 8, NULL),
(73, '2025-07-24 10:38:41', '2025-09-17 18:32:31', 'completed', '44377090', 68, 29.00, 'credit_card', NULL, 6, '{\"source\":\"process_payment\",\"planName\":\"Basic Plan\",\"referralCode\":\"munibahmed125521\"}'),
(74, '2025-07-24 10:39:46', '2025-09-17 18:32:31', 'completed', '44377090', 68, 29.00, 'credit_card', NULL, 6, '{\"source\":\"process_payment\",\"planName\":\"Basic Plan\",\"referralCode\":\"munibahmed125521\"}'),
(75, '2025-07-24 10:40:30', '2025-09-17 18:32:31', 'completed', '44377090', 69, 2.00, 'credit_card', NULL, 6, '{\"source\":\"process_payment\",\"planName\":\"Pro Plan\",\"referralCode\":\"munibahmed125521\"}'),
(76, '2025-05-24 11:29:26', '2025-09-17 18:32:31', 'completed', 'end_001', 5, 79.99, 'credit_card', 'tx_sarah_001', 3, NULL),
(77, '2025-06-03 11:29:26', '2025-09-17 18:32:31', 'completed', 'end_002', 4, 29.99, 'credit_card', 'tx_sarah_002', 3, NULL),
(78, '2025-07-03 11:29:26', '2025-09-17 18:32:31', 'completed', 'end_003', 6, 199.99, 'credit_card', 'tx_sarah_003', 4, NULL),
(79, '2025-07-03 11:29:29', '2025-09-17 18:32:31', 'completed', 'end_004', 5, 79.99, 'credit_card', 'tx_mike_001', 5, NULL),
(80, '2025-07-10 11:29:29', '2025-09-17 18:32:31', 'completed', 'end_005', 45, 99.99, 'paypal', 'tx_mike_002', 5, NULL),
(81, '2025-07-17 11:29:29', '2025-09-17 18:32:31', 'completed', 'end_006', 6, 199.99, 'credit_card', 'tx_mike_003', 6, NULL),
(82, '2025-07-19 11:29:30', '2025-09-17 18:32:31', 'completed', 'end_007', 4, 29.99, 'credit_card', 'tx_lisa_001', 8, NULL),
(83, '2025-07-22 11:29:30', '2025-09-17 18:32:31', 'completed', 'end_008', 5, 79.99, 'credit_card', 'tx_lisa_002', 8, NULL),
(84, '2025-07-19 11:29:44', '2025-09-17 18:32:31', 'completed', 'end_009', 4, 29.99, 'credit_card', 'tx_david_001', 4, NULL),
(85, '2025-07-21 11:29:44', '2025-09-17 18:32:31', 'completed', 'end_010', 6, 199.99, 'paypal', 'tx_david_002', 5, NULL),
(86, '2025-07-23 11:29:44', '2025-09-17 18:32:31', 'completed', 'end_011', 5, 79.99, 'credit_card', 'tx_emma_001', 6, NULL),
(87, '2025-07-23 23:29:44', '2025-09-17 18:32:31', 'completed', 'end_012', 45, 99.99, 'credit_card', 'tx_emma_002', 8, NULL),
(91, '2025-07-24 12:48:52', '2025-09-17 18:32:31', 'completed', '44377090', 72, 999.99, 'credit_card', NULL, 6, '{\"source\":\"process_payment\",\"planName\":\"Mega\",\"referralCode\":\"munibahmed125521\"}'),
(92, '2025-07-24 12:49:16', '2025-09-17 18:32:31', 'completed', '44377090', 72, 999.99, 'credit_card', NULL, 6, '{\"source\":\"process_payment\",\"planName\":\"Mega\",\"referralCode\":\"munibahmed125521\"}'),
(93, '2025-08-01 22:38:42', '2025-09-17 18:32:31', 'completed', '44377090', 65, 22.00, 'modal_checkout', 'txn_1754123922950_nc9oojh97', 11, '{\"source\":\"modal_checkout\",\"planName\":\"asalllll\",\"domainPath\":\"epicaffiliate\",\"referralCode\":null}'),
(94, '2025-08-04 16:11:39', '2025-09-17 18:32:31', 'completed', '44377090', 60, 69.00, 'modal_checkout', 'txn_1754359899453_y3nzgasm0', 7, '{\"source\":\"modal_checkout\",\"planName\":\"Document File\",\"domainPath\":\"shoot\",\"referralCode\":null}'),
(95, '2025-08-04 16:18:09', '2025-09-17 18:32:31', 'completed', '44443117', 72, 999.99, 'credit_card', NULL, 8, '{\"source\":\"process_payment\",\"planName\":\"Mega\",\"referralCode\":\"5starsecofficial\"}'),
(96, '2025-08-04 16:42:49', '2025-09-17 18:32:31', 'completed', '44443117', 74, 22.00, 'modal_checkout', 'txn_1754361769062_zyma96grr', 11, '{\"source\":\"modal_checkout\",\"planName\":\"12 Testing\",\"domainPath\":\"epicaffiliate\",\"referralCode\":null}'),
(97, '2025-08-04 16:50:22', '2025-09-17 18:32:31', 'completed', '44443117', 74, 22.00, 'modal_checkout', 'txn_1754362222685_86fs9keth', 11, '{\"source\":\"modal_checkout\",\"planName\":\"12 Testing\",\"domainPath\":\"epicaffiliate\",\"referralCode\":null}'),
(98, '2025-08-04 16:52:44', '2025-09-17 18:32:31', 'completed', '44443117', 74, 22.00, 'modal_checkout', 'txn_1754362364499_sk8qeq26p', 11, '{\"source\":\"modal_checkout\",\"planName\":\"12 Testing\",\"domainPath\":\"epicaffiliate\",\"referralCode\":\"epic125\"}'),
(99, '2025-08-04 17:25:54', '2025-09-17 18:32:31', 'completed', '44443117', 74, 22.00, 'modal_checkout', 'txn_1754364354836_l8a7aowwl', 11, '{\"source\":\"modal_checkout\",\"planName\":\"12 Testing\",\"domainPath\":\"epicaffiliate\",\"referralCode\":null}'),
(100, '2025-08-04 17:36:40', '2025-09-17 18:32:31', 'completed', '44443117', 74, 22.00, 'modal_checkout', 'txn_1754365000285_c6cm5gunf', 11, '{\"source\":\"modal_checkout\",\"planName\":\"12 Testing\",\"domainPath\":\"epicaffiliate\",\"referralCode\":null}'),
(101, '2025-08-04 18:01:40', '2025-09-17 18:32:31', 'completed', '44443117', 74, 22.00, 'modal_checkout', 'txn_1754366500759_q8o3bdmi5', 11, '{\"source\":\"modal_checkout\",\"planName\":\"12 Testing\",\"domainPath\":\"epicaffiliate\",\"referralCode\":null}'),
(102, '2025-08-04 18:03:39', '2025-09-17 18:32:31', 'completed', '44443117', 65, 22.00, 'modal_checkout', 'txn_1754366619432_hmdwvoh81', 11, '{\"source\":\"modal_checkout\",\"planName\":\"asalllll\",\"domainPath\":\"epicaffiliate\",\"referralCode\":null}'),
(103, '2025-08-04 18:26:05', '2025-09-17 18:32:31', 'completed', '44443117', 74, 22.00, 'modal_checkout', 'txn_1754367965247_tgvw1prst', 11, '{\"source\":\"modal_checkout\",\"planName\":\"12 Testing\",\"domainPath\":\"epicaffiliate\",\"referralCode\":null}'),
(104, '2025-08-04 20:47:09', '2025-09-17 18:32:31', 'completed', '44443117', 45, 99.99, 'modal_checkout', 'txn_1754376429078_yh1iga2cm', 11, '{\"source\":\"modal_checkout\",\"planName\":\"Car\",\"domainPath\":\"epicaffiliate\",\"referralCode\":null}'),
(106, '2025-08-09 01:39:48', '2025-09-17 18:32:31', 'completed', '5dx1605cytc7gjb', 72, 999.99, 'credit_card', NULL, 7, '{\"source\":\"process_payment\",\"planName\":\"Mega\",\"referralCode\":null}'),
(107, '2025-08-09 01:40:56', '2025-09-17 18:32:31', 'completed', '5dx1605cytc7gjb', 69, 2.00, 'credit_card', NULL, 7, '{\"source\":\"process_payment\",\"planName\":\"Pro Plan\",\"referralCode\":null}'),
(137, '2025-08-09 08:58:40', '2025-09-17 18:32:31', 'completed', '3j0v57v5seewlhe', 72, 999.99, 'credit_card', NULL, 13, '{\"source\":\"process_payment\",\"planName\":\"Mega\",\"referralCode\":null}'),
(138, '2025-08-09 08:58:50', '2025-09-17 18:32:31', 'completed', '3j0v57v5seewlhe', 69, 2.00, 'credit_card', NULL, 13, '{\"source\":\"process_payment\",\"planName\":\"Pro Plan\",\"referralCode\":null}'),
(139, '2025-08-09 21:20:30', '2025-09-17 18:32:31', 'completed', 'eytfi58ut8nfduf', 69, 2.00, 'credit_card', NULL, 15, '{\"source\":\"process_payment\",\"planName\":\"Pro Plan\",\"referralCode\":null}'),
(140, '2025-08-09 21:21:34', '2025-09-17 18:32:31', 'completed', 'jv13bugizvv8m4q', 69, 2.00, 'credit_card', NULL, 16, '{\"source\":\"process_payment\",\"planName\":\"Pro Plan\",\"referralCode\":null}'),
(141, '2025-08-09 21:32:22', '2025-09-17 18:32:31', 'completed', 'q1erwrot7efdcbr', 69, 2.00, 'credit_card', NULL, 17, '{\"source\":\"process_payment\",\"planName\":\"Pro Plan\",\"referralCode\":null}'),
(142, '2025-08-10 01:42:33', '2025-09-17 18:32:31', 'completed', 'a4didmki51vg2hw', 69, 2.00, 'credit_card', NULL, 18, '{\"source\":\"process_payment\",\"planName\":\"Pro Plan\",\"referralCode\":null}'),
(143, '2025-08-10 01:51:19', '2025-09-17 18:32:31', 'completed', 'g0u7jstj2qfvohc', 78, 50.00, NULL, NULL, 18, NULL),
(144, '2025-08-11 22:13:45', '2025-09-17 18:32:31', 'completed', 'tp9tzi7ya1wjjyx', 74, 22.00, 'modal_checkout', 'txn_1754986425499_46ewho7v0', 30, '{\"source\":\"modal_checkout\",\"planName\":\"12 Testing\",\"domainPath\":\"testing1\",\"referralCode\":null}'),
(145, '2025-08-11 22:17:38', '2025-09-17 18:32:31', 'completed', 'tp9tzi7ya1wjjyx', 65, 22.00, 'modal_checkout', 'txn_1754986658380_c0futzern', 30, '{\"source\":\"modal_checkout\",\"planName\":\"asalllll\",\"domainPath\":\"testing1\",\"referralCode\":null}'),
(146, '2025-08-12 02:33:36', '2025-09-17 18:32:31', 'completed', 'tp9tzi7ya1wjjyx', 78, 6969.00, 'modal_checkout', 'txn_1755002016517_tzzm9gf03', 27, '{\"source\":\"modal_checkout\",\"planName\":\"Munib6969\",\"domainPath\":\"munib69affiliate\",\"referralCode\":null}'),
(147, '2025-08-12 02:35:12', '2025-09-17 18:32:31', 'completed', 'tp9tzi7ya1wjjyx', 78, 6969.00, 'modal_checkout', 'txn_1755002112031_wg0oif828', 27, '{\"source\":\"modal_checkout\",\"planName\":\"Munib6969\",\"domainPath\":\"munib69affiliate\",\"referralCode\":null}'),
(148, '2025-08-12 02:45:01', '2025-09-17 18:32:31', 'completed', 'tp9tzi7ya1wjjyx', 78, 6969.00, 'modal_checkout', 'txn_1755002701795_2xcelwmts', 27, '{\"source\":\"modal_checkout\",\"planName\":\"Munib6969\",\"domainPath\":\"munib69affiliate\",\"referralCode\":null}'),
(149, '2025-08-12 04:04:58', '2025-09-17 18:32:31', 'completed', 'zpv1hwu56h14u88', 65, 22.00, 'modal_checkout', 'txn_1755007498577_c4pblsvd2', 30, '{\"source\":\"modal_checkout\",\"planName\":\"asalllll\",\"domainPath\":\"testing1\",\"referralCode\":null}'),
(150, '2025-08-12 04:27:09', '2025-09-17 18:32:31', 'completed', 'd29oee2p96xfn06', 69, 2.00, 'credit_card', NULL, 39, '{\"source\":\"process_payment\",\"planName\":\"Pro Plan\",\"referralCode\":null}'),
(151, '2025-08-12 04:29:28', '2025-09-17 18:32:31', 'completed', 'rg1ptrh9mdfgsrz', 79, 111.00, 'modal_checkout', 'txn_1755008968269_z6cztywc4', 39, '{\"source\":\"modal_checkout\",\"planName\":\"munibrealtry\",\"domainPath\":\"munibrealtry\",\"referralCode\":null}'),
(152, '2025-08-12 04:30:33', '2025-09-17 18:32:31', 'completed', 'rg1ptrh9mdfgsrz', 79, 111.00, 'modal_checkout', 'txn_1755009033778_am7du5izw', 39, '{\"source\":\"modal_checkout\",\"planName\":\"munibrealtry\",\"domainPath\":\"munibrealtry\",\"referralCode\":null}'),
(153, '2025-08-12 04:32:02', '2025-09-17 18:32:31', 'completed', 'rg1ptrh9mdfgsrz', 79, 111.00, 'modal_checkout', 'txn_1755009122137_k1i0vyrm1', 40, '{\"source\":\"modal_checkout\",\"planName\":\"munibrealtry\",\"domainPath\":\"munibrealtry1\",\"referralCode\":null}'),
(154, '2025-08-12 04:32:42', '2025-09-17 18:32:31', 'completed', 'rg1ptrh9mdfgsrz', 79, 111.00, 'modal_checkout', 'txn_1755009162113_hrzx8zhmc', 40, '{\"source\":\"modal_checkout\",\"planName\":\"munibrealtry\",\"domainPath\":\"munibrealtry1\",\"referralCode\":null}'),
(155, '2025-08-12 05:03:09', '2025-09-17 18:32:31', 'completed', '04mlvs50y4nls6a', 80, 149.99, 'credit_card', NULL, 41, '{\"source\":\"process_payment\",\"planName\":\"Pro Max\",\"referralCode\":null}'),
(156, '2025-08-12 05:06:22', '2025-09-17 18:32:31', 'completed', 'anonymous_user', 81, 6969.00, 'modal_checkout', 'txn_1755011182714_l4cpymlsm', 41, '{\"source\":\"modal_checkout\",\"planName\":\"Pro Max\",\"domainPath\":\"munibahmed20\",\"referralCode\":null}'),
(157, '2025-08-12 05:11:50', '2025-09-17 18:32:31', 'completed', '685xf719omsrqm8', 81, 6969.00, 'modal_checkout', 'txn_1755011510448_kumkpegq8', 42, '{\"source\":\"modal_checkout\",\"planName\":\"Pro Max\",\"domainPath\":\"munibahmed200\",\"referralCode\":null}'),
(158, '2025-08-12 23:58:39', '2025-09-17 18:32:31', 'completed', '44377090', 57, 5.00, 'modal_checkout', 'txn_1755079119766_osuxh00tt', 6, '{\"source\":\"modal_checkout\",\"planName\":\"Car\",\"domainPath\":\"epicaffiliate\",\"referralCode\":null}'),
(159, '2025-08-13 00:27:26', '2025-09-17 18:32:31', 'completed', 'iz2vpsv2u00nlu9', 65, 22.00, 'modal_checkout', 'txn_1755080846416_1aryjv6y3', 7, '{\"source\":\"modal_checkout\",\"planName\":\"asalllll\",\"domainPath\":\"shoot\",\"referralCode\":null}'),
(160, '2025-08-13 00:37:27', '2025-09-17 18:32:31', 'completed', 'iz2vpsv2u00nlu9', 74, 19.99, NULL, NULL, 7, NULL),
(161, '2025-08-13 03:20:30', '2025-09-17 18:32:31', 'completed', '44187263', 80, 149.99, 'credit_card', NULL, 7, '{\"source\":\"process_payment\",\"planName\":\"Pro Max\",\"referralCode\":null}'),
(162, '2025-08-13 04:28:08', '2025-09-17 18:32:31', 'completed', 'iz2vpsv2u00nlu9', 61, 1.00, 'modal_checkout', 'txn_1755095288647_cc3blwu83', 7, '{\"source\":\"modal_checkout\",\"planName\":\"Munib Ahmed\",\"domainPath\":\"shoot\",\"referralCode\":null}'),
(163, '2025-08-13 04:30:25', '2025-09-17 18:32:31', 'completed', '8aqk5un6apiqd4b', 78, 6969.00, 'modal_checkout', 'txn_1755095425669_3n9h9m116', 18, '{\"source\":\"modal_checkout\",\"planName\":\"Munib6969\",\"domainPath\":\"munib6969\",\"referralCode\":null}'),
(164, '2025-08-13 06:40:20', '2025-09-17 18:32:31', 'completed', '43537113', 72, 999.99, 'credit_card', NULL, 2, '{\"source\":\"process_payment\",\"planName\":\"Mega\",\"referralCode\":\"superaffiliate\"}'),
(165, '2025-08-14 00:42:31', '2025-09-17 18:32:31', 'completed', '44187263', 72, 999.99, 'credit_card', NULL, 7, '{\"source\":\"process_payment\",\"planName\":\"Mega\",\"referralCode\":\"zaid\"}'),
(166, '2025-08-18 21:08:14', '2025-09-17 18:32:31', 'completed', '2eo8zb2e3dqomeb', 69, 2.00, 'credit_card', NULL, 46, '{\"source\":\"process_payment\",\"planName\":\"Pro Plan\",\"referralCode\":null}'),
(167, '2025-08-18 21:09:21', '2025-09-17 18:32:31', 'completed', '44187263', 82, 22.00, 'modal_checkout', 'txn_1755587361696_1hfkphvwl', 46, '{\"source\":\"modal_checkout\",\"planName\":\"Kuch Bhi Nhi\",\"domainPath\":\"epic22222\",\"referralCode\":null}'),
(168, '2025-08-19 11:40:18', '2025-09-17 18:32:31', 'completed', 'u18o8hwgfhbcz36', 74, 22.00, 'modal_checkout', 'txn_1755639618760_q841jirmm', 7, '{\"source\":\"modal_checkout\",\"planName\":\"12 Testing\",\"domainPath\":\"shoot\",\"referralCode\":null}'),
(169, '2025-08-19 11:42:58', '2025-09-17 18:32:31', 'completed', '8m691wqlghkf3nc', 69, 2.00, 'credit_card', NULL, 49, '{\"source\":\"process_payment\",\"planName\":\"Pro Plan\",\"referralCode\":null}'),
(170, '2025-08-19 11:44:13', '2025-09-17 18:32:31', 'completed', 'anonymous_user', 83, 89.00, 'modal_checkout', 'txn_1755639853560_15zgd12ig', 49, '{\"source\":\"modal_checkout\",\"planName\":\"sasadsad\",\"domainPath\":\"hammadhammadi\",\"referralCode\":null}'),
(171, '2025-08-19 11:46:25', '2025-09-17 18:32:31', 'completed', '62b7hiatqx20iaj', 83, 89.00, 'modal_checkout', 'txn_1755639985099_ugz2k7upb', 49, '{\"source\":\"modal_checkout\",\"planName\":\"sasadsad\",\"domainPath\":\"hammadhammadi\",\"referralCode\":null}'),
(172, '2025-08-20 12:41:20', '2025-09-17 18:32:31', 'completed', 'j756dzpftjionpa', 83, 89.00, 'modal_checkout', 'txn_1755729680355_w1t2ekwhk', 49, '{\"source\":\"modal_checkout\",\"planName\":\"sasadsad\",\"domainPath\":\"hammadhammadi\",\"referralCode\":null}'),
(173, '2025-08-20 13:21:33', '2025-09-17 18:32:31', 'completed', '7rjtsyeijw0i8zi', 83, 89.00, 'modal_checkout', 'txn_1755732093570_ngjlx2u73', 49, '{\"source\":\"modal_checkout\",\"planName\":\"sasadsad\",\"domainPath\":\"hammadhammadi\",\"referralCode\":null}'),
(174, '2025-08-22 16:20:04', '2025-09-17 18:32:31', 'completed', 'jwg84z5hawl8jms', 68, 29.00, 'credit_card', NULL, 54, '{\"source\":\"process_payment\",\"planName\":\"Basic Plan\",\"referralCode\":\"affiliate\"}'),
(175, '2025-08-23 06:56:18', '2025-09-17 18:32:31', 'completed', 'jwg84z5hawl8jms', 80, 149.99, 'credit_card', NULL, 54, '{\"source\":\"process_payment\",\"planName\":\"Pro Max\",\"referralCode\":null}'),
(176, '2025-08-23 10:22:11', '2025-09-17 18:32:31', 'completed', '1fykk71x0x07yod', 72, 999.99, 'credit_card', NULL, 56, '{\"source\":\"process_payment\",\"planName\":\"Mega\",\"referralCode\":\"hammadi\"}'),
(177, '2025-08-23 10:22:48', '2025-09-17 18:32:31', 'completed', '1fykk71x0x07yod', 74, 22.00, 'credit_card', NULL, 56, '{\"source\":\"process_payment\",\"planName\":\"12 Testing\",\"referralCode\":\"hammadi\"}'),
(178, '2025-08-23 10:39:00', '2025-09-17 18:32:31', 'completed', '1fykk71x0x07yod', 80, 149.99, 'credit_card', NULL, 56, '{\"source\":\"process_payment\",\"planName\":\"Pro Max\",\"referralCode\":\"zaidy\"}'),
(179, '2025-08-23 11:09:29', '2025-09-17 18:32:31', 'completed', '1fykk71x0x07yod', 104, 22.00, 'credit_card', NULL, 56, '{\"source\":\"process_payment\",\"planName\":\"Checking\",\"referralCode\":\"epic1\"}'),
(180, '2025-08-24 05:46:07', '2025-09-17 18:32:31', 'completed', '1fykk71x0x07yod', 68, 29.00, 'credit_card', NULL, 56, '{\"source\":\"process_payment\",\"planName\":\"Basic Plan\",\"referralCode\":\"hammadi\"}'),
(181, '2025-08-29 03:24:03', '2025-09-17 18:32:31', 'completed', '8m691wqlghkf3nc', 72, 999.99, 'credit_card', NULL, 49, '{\"source\":\"process_payment\",\"planName\":\"Mega\",\"referralCode\":\"hammadi\"}'),
(183, '2025-08-29 03:51:12', '2025-09-17 18:32:31', 'completed', '8m691wqlghkf3nc', 69, 2.00, NULL, NULL, 2, NULL),
(184, '2025-08-29 04:01:52', '2025-09-17 18:32:31', 'completed', 'c0c8zgzt7hi4hr0', 72, 999.99, 'credit_card', NULL, 57, '{\"source\":\"process_payment\",\"planName\":\"Mega\",\"referralCode\":\"hammadi\"}'),
(185, '2025-08-29 10:33:58', '2025-09-17 18:32:31', 'completed', '1fykk71x0x07yod', 72, 999.99, NULL, NULL, 2, NULL),
(186, '2025-08-29 10:35:31', '2025-09-17 18:32:31', 'completed', 'db4k9owwms65bna', 104, 22.00, NULL, NULL, 2, NULL),
(187, '2025-08-29 10:39:02', '2025-09-17 18:32:31', 'completed', '44187263', 105, 1000.00, 'credit_card', NULL, 7, '{\"source\":\"process_payment\",\"planName\":\"test\",\"referralCode\":\"sarah25\"}'),
(188, '2025-08-29 10:52:11', '2025-09-17 18:32:31', 'completed', '44187263', 104, 22.00, 'credit_card', NULL, 7, '{\"source\":\"process_payment\",\"planName\":\"Checking\",\"referralCode\":\"sarah2555\"}'),
(189, '2025-08-29 10:54:58', '2025-09-17 18:32:31', 'completed', '44187263', 106, 2000.00, 'credit_card', NULL, 7, '{\"source\":\"process_payment\",\"planName\":\"test 25\",\"referralCode\":\"sarah25\"}'),
(190, '2025-08-29 10:59:15', '2025-09-17 18:32:31', 'completed', '44187263', 107, 2000.00, 'credit_card', NULL, 7, '{\"source\":\"process_payment\",\"planName\":\"test2425\",\"referralCode\":\"sarah2025\"}'),
(191, '2025-08-29 11:03:24', '2025-09-17 18:32:31', 'completed', '44187263', 108, 2000.00, 'credit_card', NULL, 7, '{\"source\":\"process_payment\",\"planName\":\"testing\",\"referralCode\":\"sarah25\"}'),
(192, '2025-08-29 11:22:32', '2025-09-17 18:32:31', 'completed', '44187263', 74, 22.00, 'credit_card', NULL, 7, '{\"source\":\"process_payment\",\"planName\":\"12 Testing\",\"referralCode\":\"mkkk\"}'),
(193, '2025-09-13 08:18:37', '2025-09-17 18:32:31', 'completed', '44187263', 103, 32.00, 'credit_card', NULL, 7, '{\"source\":\"process_payment\",\"planName\":\"Testing New Affiliate System\",\"referralCode\":null}'),
(194, '2025-09-13 08:34:13', '2025-09-17 18:32:31', 'completed', 'c3082ce4-1026-4d8a-a517-e2366d0e9164', 108, 2000.00, 'credit_card', NULL, 69, '{\"source\":\"process_payment\",\"planName\":\"testing\",\"referralCode\":null}'),
(198, '2025-09-20 08:53:15', '2025-09-20 09:02:18', 'completed', '00fb5fb2-932f-45da-9fa1-60403f078f32', 4, 29.99, 'credit_card', NULL, 2, NULL),
(199, '2025-09-20 08:54:27', '2025-09-20 09:02:22', 'completed', '00fb5fb2-932f-45da-9fa1-60403f078f32', 4, 29.99, 'credit_card', NULL, 2, NULL),
(200, '2025-09-20 09:12:19', '2025-09-20 09:12:19', 'completed', '00fb5fb2-932f-45da-9fa1-60403f078f32', 1, 29.00, 'credit_card', NULL, 2, '{\"referralCode\":null,\"planName\":\"Starter Plan\",\"source\":\"process_payment\"}'),
(204, '2025-09-20 09:22:07', '2025-09-20 09:22:07', 'completed', '00fb5fb2-932f-45da-9fa1-60403f078f32', 1, 29.00, 'credit_card', NULL, 2, '{\"referralCode\":null,\"planName\":\"Starter Plan\",\"source\":\"process_payment\"}'),
(206, '2025-09-20 09:24:53', '2025-09-20 09:32:42', 'completed', '62b7hiatqx20iaj', 119, 22.00, 'credit_card', NULL, 50, '{\"source\":\"manual_fix\",\"original_subscription_id\":279,\"created_via\":\"orphan_analysis\"}'),
(211, '2025-09-20 09:36:50', '2025-09-20 09:36:50', 'completed', '00fb5fb2-932f-45da-9fa1-60403f078f32', 4, 29.99, 'credit_card', NULL, 2, '{\"planName\":\"Test Plan\",\"source\":\"drizzle_test_fixed\"}'),
(212, '2025-09-20 09:36:50', '2025-09-20 09:36:50', 'completed', '00fb5fb2-932f-45da-9fa1-60403f078f32', 4, 29.99, 'credit_card', 'test_1758361010612', 2, '{\"gateway\":\"test\",\"source\":\"routes_style_test\"}'),
(213, '2025-09-20 09:08:25', '2025-09-20 09:39:11', 'refunded', '62b7hiatqx20iaj', 118, 344.00, 'credit_card', 'backfill_274_1758361151143', 50, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":274,\"plan_name\":\"YouTube\",\"backfill_date\":\"2025-09-20T09:39:11.143Z\"}'),
(214, '2025-09-19 15:24:01', '2025-09-20 09:39:11', 'refunded', '62b7hiatqx20iaj', 119, 22.00, 'credit_card', 'backfill_270_1758361151146', 50, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":270,\"plan_name\":\"DB Testing\",\"backfill_date\":\"2025-09-20T09:39:11.146Z\"}'),
(215, '2025-09-19 14:50:26', '2025-09-20 09:39:11', 'refunded', '62b7hiatqx20iaj', 119, 22.00, 'credit_card', 'backfill_269_1758361151147', 50, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":269,\"plan_name\":\"DB Testing\",\"backfill_date\":\"2025-09-20T09:39:11.147Z\"}'),
(216, '2025-09-19 14:32:06', '2025-09-20 09:39:11', 'refunded', '62b7hiatqx20iaj', 119, 22.00, 'credit_card', 'backfill_267_1758361151148', 50, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":267,\"plan_name\":\"DB Testing\",\"backfill_date\":\"2025-09-20T09:39:11.148Z\"}'),
(217, '2025-09-19 14:22:58', '2025-09-20 09:39:11', 'refunded', '62b7hiatqx20iaj', 119, 22.00, 'credit_card', 'backfill_266_1758361151149', 50, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":266,\"plan_name\":\"DB Testing\",\"backfill_date\":\"2025-09-20T09:39:11.149Z\"}'),
(218, '2025-09-19 14:19:10', '2025-09-20 09:39:11', 'refunded', '62b7hiatqx20iaj', 119, 22.00, 'credit_card', 'backfill_265_1758361151150', 50, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":265,\"plan_name\":\"DB Testing\",\"backfill_date\":\"2025-09-20T09:39:11.150Z\"}'),
(219, '2025-09-19 14:09:00', '2025-09-20 09:39:11', 'refunded', '62b7hiatqx20iaj', 118, 344.00, 'credit_card', 'backfill_264_1758361151151', 50, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":264,\"plan_name\":\"YouTube\",\"backfill_date\":\"2025-09-20T09:39:11.151Z\"}'),
(220, '2025-09-19 14:04:27', '2025-09-20 09:39:11', 'refunded', '62b7hiatqx20iaj', 118, 344.00, 'credit_card', 'backfill_263_1758361151152', 50, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":263,\"plan_name\":\"YouTube\",\"backfill_date\":\"2025-09-20T09:39:11.152Z\"}'),
(221, '2025-09-19 14:03:31', '2025-09-20 09:39:11', 'refunded', '62b7hiatqx20iaj', 118, 344.00, 'credit_card', 'backfill_262_1758361151154', 50, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":262,\"plan_name\":\"YouTube\",\"backfill_date\":\"2025-09-20T09:39:11.154Z\"}'),
(222, '2025-09-19 14:01:05', '2025-09-20 09:39:11', 'refunded', '62b7hiatqx20iaj', 118, 344.00, 'credit_card', 'backfill_261_1758361151155', 50, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":261,\"plan_name\":\"YouTube\",\"backfill_date\":\"2025-09-20T09:39:11.155Z\"}'),
(223, '2025-09-19 13:58:56', '2025-09-20 09:39:11', 'refunded', '62b7hiatqx20iaj', 118, 344.00, 'credit_card', 'backfill_260_1758361151156', 50, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":260,\"plan_name\":\"YouTube\",\"backfill_date\":\"2025-09-20T09:39:11.156Z\"}'),
(224, '2025-09-19 13:58:24', '2025-09-20 09:39:11', 'completed', '00fb5fb2-932f-45da-9fa1-60403f078f32', 4, 29.99, 'credit_card', 'backfill_259_1758361151157', 63, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":259,\"plan_name\":\"Starter Plan\",\"backfill_date\":\"2025-09-20T09:39:11.157Z\"}'),
(225, '2025-09-19 13:57:24', '2025-09-20 09:39:11', 'refunded', '00fb5fb2-932f-45da-9fa1-60403f078f32', 4, 29.99, 'credit_card', 'backfill_258_1758361151158', 63, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":258,\"plan_name\":\"Starter Plan\",\"backfill_date\":\"2025-09-20T09:39:11.158Z\"}'),
(226, '2025-09-19 13:57:22', '2025-09-20 09:39:11', 'refunded', '00fb5fb2-932f-45da-9fa1-60403f078f32', 4, 29.99, 'credit_card', 'backfill_257_1758361151158', 63, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":257,\"plan_name\":\"Starter Plan\",\"backfill_date\":\"2025-09-20T09:39:11.158Z\"}'),
(227, '2025-09-19 13:57:21', '2025-09-20 09:39:11', 'refunded', '00fb5fb2-932f-45da-9fa1-60403f078f32', 4, 29.99, 'credit_card', 'backfill_256_1758361151159', 63, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":256,\"plan_name\":\"Starter Plan\",\"backfill_date\":\"2025-09-20T09:39:11.159Z\"}'),
(228, '2025-09-19 13:56:45', '2025-09-20 09:39:11', 'refunded', '62b7hiatqx20iaj', 118, 344.00, 'credit_card', 'backfill_255_1758361151160', 50, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":255,\"plan_name\":\"YouTube\",\"backfill_date\":\"2025-09-20T09:39:11.160Z\"}'),
(229, '2025-09-19 13:56:43', '2025-09-20 09:39:11', 'refunded', '62b7hiatqx20iaj', 118, 344.00, 'credit_card', 'backfill_254_1758361151161', 50, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":254,\"plan_name\":\"YouTube\",\"backfill_date\":\"2025-09-20T09:39:11.161Z\"}'),
(230, '2025-09-19 13:56:42', '2025-09-20 09:39:11', 'refunded', '62b7hiatqx20iaj', 118, 344.00, 'credit_card', 'backfill_253_1758361151162', 50, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":253,\"plan_name\":\"YouTube\",\"backfill_date\":\"2025-09-20T09:39:11.162Z\"}'),
(231, '2025-09-19 13:56:42', '2025-09-20 09:39:11', 'refunded', '00fb5fb2-932f-45da-9fa1-60403f078f32', 4, 29.99, 'credit_card', 'backfill_252_1758361151163', 63, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":252,\"plan_name\":\"Starter Plan\",\"backfill_date\":\"2025-09-20T09:39:11.163Z\"}'),
(232, '2025-09-19 13:56:40', '2025-09-20 09:39:11', 'refunded', '00fb5fb2-932f-45da-9fa1-60403f078f32', 4, 29.99, 'credit_card', 'backfill_251_1758361151164', 63, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":251,\"plan_name\":\"Starter Plan\",\"backfill_date\":\"2025-09-20T09:39:11.164Z\"}'),
(233, '2025-09-19 13:56:39', '2025-09-20 09:39:11', 'refunded', '00fb5fb2-932f-45da-9fa1-60403f078f32', 4, 29.99, 'credit_card', 'backfill_250_1758361151164', 63, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":250,\"plan_name\":\"Starter Plan\",\"backfill_date\":\"2025-09-20T09:39:11.164Z\"}'),
(234, '2025-09-19 13:56:07', '2025-09-20 09:39:11', 'refunded', '00fb5fb2-932f-45da-9fa1-60403f078f32', 4, 29.99, 'credit_card', 'backfill_249_1758361151165', 63, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":249,\"plan_name\":\"Starter Plan\",\"backfill_date\":\"2025-09-20T09:39:11.165Z\"}'),
(235, '2025-09-19 13:56:05', '2025-09-20 09:39:11', 'refunded', '00fb5fb2-932f-45da-9fa1-60403f078f32', 4, 29.99, 'credit_card', 'backfill_248_1758361151166', 63, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":248,\"plan_name\":\"Starter Plan\",\"backfill_date\":\"2025-09-20T09:39:11.166Z\"}'),
(236, '2025-09-19 13:56:04', '2025-09-20 09:39:11', 'refunded', '00fb5fb2-932f-45da-9fa1-60403f078f32', 4, 29.99, 'credit_card', 'backfill_247_1758361151166', 63, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":247,\"plan_name\":\"Starter Plan\",\"backfill_date\":\"2025-09-20T09:39:11.166Z\"}'),
(237, '2025-09-19 13:55:17', '2025-09-20 09:39:11', 'refunded', '00fb5fb2-932f-45da-9fa1-60403f078f32', 4, 29.99, 'credit_card', 'backfill_246_1758361151167', 63, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":246,\"plan_name\":\"Starter Plan\",\"backfill_date\":\"2025-09-20T09:39:11.167Z\"}'),
(238, '2025-09-19 13:55:15', '2025-09-20 09:39:11', 'refunded', '00fb5fb2-932f-45da-9fa1-60403f078f32', 4, 29.99, 'credit_card', 'backfill_245_1758361151168', 63, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":245,\"plan_name\":\"Starter Plan\",\"backfill_date\":\"2025-09-20T09:39:11.168Z\"}'),
(239, '2025-09-19 13:55:14', '2025-09-20 09:39:11', 'refunded', '00fb5fb2-932f-45da-9fa1-60403f078f32', 4, 29.99, 'credit_card', 'backfill_244_1758361151169', 63, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":244,\"plan_name\":\"Starter Plan\",\"backfill_date\":\"2025-09-20T09:39:11.169Z\"}'),
(240, '2025-09-19 13:54:35', '2025-09-20 09:39:11', 'refunded', '00fb5fb2-932f-45da-9fa1-60403f078f32', 4, 29.99, 'credit_card', 'backfill_243_1758361151170', 63, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":243,\"plan_name\":\"Starter Plan\",\"backfill_date\":\"2025-09-20T09:39:11.170Z\"}'),
(241, '2025-09-19 13:54:33', '2025-09-20 09:39:11', 'refunded', '00fb5fb2-932f-45da-9fa1-60403f078f32', 4, 29.99, 'credit_card', 'backfill_242_1758361151171', 63, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":242,\"plan_name\":\"Starter Plan\",\"backfill_date\":\"2025-09-20T09:39:11.171Z\"}'),
(242, '2025-09-19 13:54:32', '2025-09-20 09:39:11', 'refunded', '00fb5fb2-932f-45da-9fa1-60403f078f32', 4, 29.99, 'credit_card', 'backfill_241_1758361151171', 63, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":241,\"plan_name\":\"Starter Plan\",\"backfill_date\":\"2025-09-20T09:39:11.171Z\"}'),
(243, '2025-09-19 13:52:39', '2025-09-20 09:39:11', 'refunded', '00fb5fb2-932f-45da-9fa1-60403f078f32', 4, 29.99, 'credit_card', 'backfill_240_1758361151172', 63, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":240,\"plan_name\":\"Starter Plan\",\"backfill_date\":\"2025-09-20T09:39:11.172Z\"}'),
(244, '2025-09-19 13:52:37', '2025-09-20 09:39:11', 'refunded', '00fb5fb2-932f-45da-9fa1-60403f078f32', 4, 29.99, 'credit_card', 'backfill_239_1758361151173', 63, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":239,\"plan_name\":\"Starter Plan\",\"backfill_date\":\"2025-09-20T09:39:11.173Z\"}'),
(245, '2025-09-19 13:52:36', '2025-09-20 09:39:11', 'refunded', '00fb5fb2-932f-45da-9fa1-60403f078f32', 4, 29.99, 'credit_card', 'backfill_238_1758361151174', 63, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":238,\"plan_name\":\"Starter Plan\",\"backfill_date\":\"2025-09-20T09:39:11.174Z\"}'),
(246, '2025-09-19 13:45:40', '2025-09-20 09:39:11', 'refunded', '62b7hiatqx20iaj', 108, 2000.00, 'credit_card', 'backfill_237_1758361151175', 50, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":237,\"plan_name\":\"testing\",\"backfill_date\":\"2025-09-20T09:39:11.175Z\"}'),
(247, '2025-09-19 13:45:38', '2025-09-20 09:39:11', 'refunded', '62b7hiatqx20iaj', 108, 2000.00, 'credit_card', 'backfill_236_1758361151176', 50, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":236,\"plan_name\":\"testing\",\"backfill_date\":\"2025-09-20T09:39:11.176Z\"}'),
(248, '2025-09-19 13:45:37', '2025-09-20 09:39:11', 'refunded', '62b7hiatqx20iaj', 108, 2000.00, 'credit_card', 'backfill_235_1758361151177', 50, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":235,\"plan_name\":\"testing\",\"backfill_date\":\"2025-09-20T09:39:11.177Z\"}'),
(249, '2025-09-19 13:42:20', '2025-09-20 09:39:11', 'completed', 'white_label_client_demo', 1, 29.00, 'credit_card', 'backfill_233_1758361151178', 76, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":233,\"plan_name\":\"Starter Plan\",\"backfill_date\":\"2025-09-20T09:39:11.178Z\"}'),
(250, '2025-09-19 13:42:18', '2025-09-20 09:39:11', 'completed', 'white_label_client_demo', 1, 29.00, 'credit_card', 'backfill_232_1758361151179', 76, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":232,\"plan_name\":\"Starter Plan\",\"backfill_date\":\"2025-09-20T09:39:11.179Z\"}'),
(251, '2025-09-19 13:42:17', '2025-09-20 09:39:11', 'completed', 'white_label_client_demo', 1, 29.00, 'credit_card', 'backfill_231_1758361151179', 76, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":231,\"plan_name\":\"Starter Plan\",\"backfill_date\":\"2025-09-20T09:39:11.179Z\"}'),
(252, '2025-09-19 13:34:44', '2025-09-20 09:39:11', 'refunded', '62b7hiatqx20iaj', 108, 2000.00, 'credit_card', 'backfill_230_1758361151180', 50, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":230,\"plan_name\":\"testing\",\"backfill_date\":\"2025-09-20T09:39:11.180Z\"}'),
(253, '2025-09-19 13:34:42', '2025-09-20 09:39:11', 'refunded', '62b7hiatqx20iaj', 108, 2000.00, 'credit_card', 'backfill_229_1758361151181', 50, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":229,\"plan_name\":\"testing\",\"backfill_date\":\"2025-09-20T09:39:11.181Z\"}'),
(254, '2025-09-19 13:34:40', '2025-09-20 09:39:11', 'refunded', '62b7hiatqx20iaj', 108, 2000.00, 'credit_card', 'backfill_228_1758361151182', 50, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":228,\"plan_name\":\"testing\",\"backfill_date\":\"2025-09-20T09:39:11.182Z\"}'),
(255, '2025-09-19 13:06:18', '2025-09-20 09:39:11', 'refunded', '62b7hiatqx20iaj', 108, 2000.00, 'credit_card', 'backfill_227_1758361151182', 50, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":227,\"plan_name\":\"testing\",\"backfill_date\":\"2025-09-20T09:39:11.182Z\"}'),
(256, '2025-09-19 13:06:16', '2025-09-20 09:39:11', 'refunded', '62b7hiatqx20iaj', 108, 2000.00, 'credit_card', 'backfill_226_1758361151183', 50, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":226,\"plan_name\":\"testing\",\"backfill_date\":\"2025-09-20T09:39:11.183Z\"}'),
(257, '2025-09-19 13:06:14', '2025-09-20 09:39:11', 'refunded', '62b7hiatqx20iaj', 108, 2000.00, 'credit_card', 'backfill_225_1758361151184', 50, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":225,\"plan_name\":\"testing\",\"backfill_date\":\"2025-09-20T09:39:11.184Z\"}'),
(258, '2025-09-19 12:43:04', '2025-09-20 09:39:11', 'refunded', 'white_label_client_demo', 1, 29.00, 'credit_card', 'backfill_224_1758361151185', 76, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":224,\"plan_name\":\"Starter Plan\",\"backfill_date\":\"2025-09-20T09:39:11.185Z\"}'),
(259, '2025-09-19 12:43:02', '2025-09-20 09:39:11', 'refunded', 'white_label_client_demo', 1, 29.00, 'credit_card', 'backfill_223_1758361151185', 76, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":223,\"plan_name\":\"Starter Plan\",\"backfill_date\":\"2025-09-20T09:39:11.185Z\"}'),
(260, '2025-09-19 12:43:01', '2025-09-20 09:39:11', 'refunded', 'white_label_client_demo', 1, 29.00, 'credit_card', 'backfill_222_1758361151186', 76, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":222,\"plan_name\":\"Starter Plan\",\"backfill_date\":\"2025-09-20T09:39:11.186Z\"}'),
(261, '2025-09-19 09:36:53', '2025-09-20 09:39:11', 'refunded', '62b7hiatqx20iaj', 108, 2000.00, 'credit_card', 'backfill_220_1758361151187', 50, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":220,\"plan_name\":\"testing\",\"backfill_date\":\"2025-09-20T09:39:11.187Z\"}'),
(262, '2025-09-19 09:36:51', '2025-09-20 09:39:11', 'refunded', '62b7hiatqx20iaj', 108, 2000.00, 'credit_card', 'backfill_219_1758361151187', 50, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":219,\"plan_name\":\"testing\",\"backfill_date\":\"2025-09-20T09:39:11.187Z\"}'),
(263, '2025-09-19 09:36:50', '2025-09-20 09:39:11', 'refunded', '62b7hiatqx20iaj', 108, 2000.00, 'credit_card', 'backfill_218_1758361151188', 50, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":218,\"plan_name\":\"testing\",\"backfill_date\":\"2025-09-20T09:39:11.188Z\"}'),
(264, '2025-09-14 16:00:14', '2025-09-20 09:39:11', 'completed', '00fb5fb2-932f-45da-9fa1-60403f078f32', 108, 2000.00, 'credit_card', 'backfill_189_1758361151189', 74, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":189,\"plan_name\":\"testing\",\"backfill_date\":\"2025-09-20T09:39:11.189Z\"}'),
(265, '2025-09-13 18:43:56', '2025-09-20 09:39:11', 'completed', '00fb5fb2-932f-45da-9fa1-60403f078f32', 107, 2000.00, 'credit_card', 'backfill_188_1758361151189', 69, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":188,\"plan_name\":\"test2425\",\"backfill_date\":\"2025-09-20T09:39:11.189Z\"}');
INSERT INTO `purchase_history` (`id`, `created_at`, `updated_at`, `status`, `user_id`, `plan_id`, `amount`, `payment_method`, `transaction_id`, `white_label_id`, `metadata`) VALUES
(266, '2025-09-13 18:34:13', '2025-09-20 09:39:11', 'completed', '00fb5fb2-932f-45da-9fa1-60403f078f32', 108, 2000.00, 'credit_card', 'backfill_187_1758361151190', 69, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":187,\"plan_name\":\"testing\",\"backfill_date\":\"2025-09-20T09:39:11.190Z\"}'),
(267, '2025-09-13 18:18:37', '2025-09-20 09:39:11', 'completed', '00fb5fb2-932f-45da-9fa1-60403f078f32', 103, 32.00, 'credit_card', 'backfill_186_1758361151191', 7, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":186,\"plan_name\":\"Testing New Affiliate System\",\"backfill_date\":\"2025-09-20T09:39:11.191Z\"}'),
(268, '2025-08-29 21:22:32', '2025-09-20 09:39:11', 'completed', '00fb5fb2-932f-45da-9fa1-60403f078f32', 74, 22.00, 'credit_card', 'backfill_185_1758361151192', 7, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":185,\"plan_name\":\"12 Testingg\",\"backfill_date\":\"2025-09-20T09:39:11.192Z\"}'),
(269, '2025-08-29 21:03:24', '2025-09-20 09:39:11', 'completed', '00fb5fb2-932f-45da-9fa1-60403f078f32', 108, 2000.00, 'credit_card', 'backfill_184_1758361151193', 7, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":184,\"plan_name\":\"testing\",\"backfill_date\":\"2025-09-20T09:39:11.193Z\"}'),
(270, '2025-08-29 20:59:15', '2025-09-20 09:39:11', 'completed', '00fb5fb2-932f-45da-9fa1-60403f078f32', 107, 2000.00, 'credit_card', 'backfill_183_1758361151194', 7, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":183,\"plan_name\":\"test2425\",\"backfill_date\":\"2025-09-20T09:39:11.194Z\"}'),
(271, '2025-08-29 20:54:58', '2025-09-20 09:39:11', 'completed', '00fb5fb2-932f-45da-9fa1-60403f078f32', 106, 2000.00, 'credit_card', 'backfill_182_1758361151195', 7, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":182,\"plan_name\":\"test 25\",\"backfill_date\":\"2025-09-20T09:39:11.195Z\"}'),
(272, '2025-08-29 20:52:11', '2025-09-20 09:39:11', 'completed', '00fb5fb2-932f-45da-9fa1-60403f078f32', 104, 22.00, 'credit_card', 'backfill_181_1758361151196', 7, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":181,\"plan_name\":\"Checking\",\"backfill_date\":\"2025-09-20T09:39:11.196Z\"}'),
(273, '2025-08-29 20:39:02', '2025-09-20 09:39:11', 'completed', '00fb5fb2-932f-45da-9fa1-60403f078f32', 105, 1000.00, 'credit_card', 'backfill_180_1758361151196', 7, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":180,\"plan_name\":\"test\",\"backfill_date\":\"2025-09-20T09:39:11.196Z\"}'),
(274, '2025-08-29 14:01:52', '2025-09-20 09:39:11', 'completed', '00fb5fb2-932f-45da-9fa1-60403f078f32', 72, 999.99, 'credit_card', 'backfill_179_1758361151197', 57, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":179,\"plan_name\":\"Mega\",\"backfill_date\":\"2025-09-20T09:39:11.197Z\"}'),
(275, '2025-08-29 13:24:03', '2025-09-20 09:39:11', 'completed', '00fb5fb2-932f-45da-9fa1-60403f078f32', 72, 999.99, 'credit_card', 'backfill_178_1758361151198', 49, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":178,\"plan_name\":\"Mega\",\"backfill_date\":\"2025-09-20T09:39:11.198Z\"}'),
(276, '2025-08-24 15:46:07', '2025-09-20 09:39:11', 'completed', '00fb5fb2-932f-45da-9fa1-60403f078f32', 68, 29.00, 'credit_card', 'backfill_177_1758361151199', 56, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":177,\"plan_name\":\"Basic Plan\",\"backfill_date\":\"2025-09-20T09:39:11.199Z\"}'),
(277, '2025-08-23 21:09:29', '2025-09-20 09:39:11', 'completed', '00fb5fb2-932f-45da-9fa1-60403f078f32', 104, 22.00, 'credit_card', 'backfill_176_1758361151199', 56, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":176,\"plan_name\":\"Checking\",\"backfill_date\":\"2025-09-20T09:39:11.199Z\"}'),
(278, '2025-08-23 20:39:00', '2025-09-20 09:39:11', 'completed', '00fb5fb2-932f-45da-9fa1-60403f078f32', 80, 149.99, 'credit_card', 'backfill_175_1758361151200', 56, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":175,\"plan_name\":\"Pro Max\",\"backfill_date\":\"2025-09-20T09:39:11.200Z\"}'),
(279, '2025-08-23 20:22:48', '2025-09-20 09:39:11', 'completed', '00fb5fb2-932f-45da-9fa1-60403f078f32', 74, 22.00, 'credit_card', 'backfill_174_1758361151201', 56, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":174,\"plan_name\":\"12 Testingg\",\"backfill_date\":\"2025-09-20T09:39:11.201Z\"}'),
(280, '2025-08-23 20:22:11', '2025-09-20 09:39:11', 'completed', '00fb5fb2-932f-45da-9fa1-60403f078f32', 72, 999.99, 'credit_card', 'backfill_173_1758361151201', 56, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":173,\"plan_name\":\"Mega\",\"backfill_date\":\"2025-09-20T09:39:11.201Z\"}'),
(281, '2025-08-23 16:56:18', '2025-09-20 09:39:11', 'completed', '00fb5fb2-932f-45da-9fa1-60403f078f32', 80, 149.99, 'credit_card', 'backfill_172_1758361151203', 54, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":172,\"plan_name\":\"Pro Max\",\"backfill_date\":\"2025-09-20T09:39:11.203Z\"}'),
(282, '2025-08-23 02:20:04', '2025-09-20 09:39:11', 'completed', '00fb5fb2-932f-45da-9fa1-60403f078f32', 68, 29.00, 'credit_card', 'backfill_171_1758361151203', 54, '{\"source\":\"orphaned_subscription_backfill\",\"original_subscription_id\":171,\"plan_name\":\"Basic Plan\",\"backfill_date\":\"2025-09-20T09:39:11.203Z\"}'),
(283, '2025-09-20 09:10:31', '2025-09-20 09:39:36', 'completed', '62b7hiatqx20iaj', 119, 22.00, 'credit_card', NULL, 50, '{\"source\":\"manual_fix\",\"original_subscription_id\":276,\"created_via\":\"orphan_analysis\"}'),
(284, '2025-09-20 09:49:15', '2025-09-20 09:49:15', 'completed', '43537113', 118, 344.00, 'credit_card', NULL, 2, '{\"referralCode\":null,\"planName\":\"YouTube\",\"source\":\"process_payment\"}'),
(285, '2025-09-20 09:53:03', '2025-09-20 09:53:03', 'completed', '43537113', 118, 344.00, 'credit_card', NULL, 2, '{\"referralCode\":null,\"planName\":\"YouTube\",\"source\":\"process_payment\"}'),
(286, '2025-09-20 09:56:30', '2025-09-20 09:56:30', 'completed', '43537113', 105, 1000.00, 'credit_card', 'txn_1758362190149_uxk9rdpb4_7113', 2, '{\"referralCode\":null,\"planName\":\"test\",\"source\":\"process_payment\",\"paymentToken\":\"mock_client_secret_1758362165478_b02eg4o47rf\",\"transactionId\":\"txn_1758362190149_uxk9rdpb4_7113\"}'),
(287, '2025-09-20 10:48:30', '2025-09-20 10:48:30', 'completed', '44187263', 126, 12.00, 'credit_card', 'txn_1758365310683_9zej9i2ns_7263', 7, '{\"referralCode\":null,\"planName\":\"Google Maps\",\"source\":\"process_payment\",\"paymentToken\":\"mock_client_secret_1758365292009_offi7nfg4x\",\"transactionId\":\"txn_1758365310683_9zej9i2ns_7263\"}'),
(288, '2025-09-20 11:53:30', '2025-09-20 11:53:30', 'completed', '44187263', 127, 344.00, 'credit_card', 'txn_1758369210636_clk635uor_7263', 7, '{\"referralCode\":null,\"planName\":\"test\",\"source\":\"process_payment\",\"paymentToken\":\"mock_client_secret_1758369196467_tijawu9nxzl\",\"transactionId\":\"txn_1758369210636_clk635uor_7263\"}'),
(289, '2025-09-21 21:27:49', '2025-09-21 21:27:49', 'completed', '44187263', 129, 22.00, 'credit_card', 'txn_1758490069968_adgg5thsr_7263', 7, '{\"referralCode\":null,\"planName\":\"News Plan\",\"source\":\"process_payment\",\"paymentToken\":\"mock_client_secret_1758490054860_qkkyuev205r\",\"transactionId\":\"txn_1758490069968_adgg5thsr_7263\"}'),
(290, '2025-09-21 21:29:03', '2025-09-21 21:29:03', 'completed', '44187263', 130, 344.00, 'credit_card', 'txn_1758490143428_mr5xbv8jk_7263', 7, '{\"referralCode\":null,\"planName\":\"Newss\",\"source\":\"process_payment\",\"paymentToken\":\"mock_client_secret_1758490130548_35163dyb9w\",\"transactionId\":\"txn_1758490143428_mr5xbv8jk_7263\"}'),
(291, '2025-09-23 17:41:31', '2025-09-23 17:41:31', 'completed', '44377090', 131, 344.00, 'manual_admin', 'manual_1758649291507', 7, NULL),
(292, '2025-10-09 18:29:47', '2025-10-09 18:29:47', 'completed', 'user_1760034587114_hammadisaqib@gmail.com', 132, 222.00, 'NMI Gateway', '11235006563', 0, '{\"planName\":\"YouTube\",\"nmiTransactionId\":\"11235006563\",\"nmiAuthCode\":\"123456\",\"planOwnerId\":\"44187263\",\"customerEmail\":\"hammadisaqib@gmail.com\",\"customerName\":\"Hammad Saqib\",\"referralCode\":\"Hammad\"}'),
(293, '2025-10-09 18:48:13', '2025-10-09 18:48:13', 'completed', 'user_1760035693011_hammadisaqib@gmail.com', 132, 222.00, 'NMI Gateway', '11235071322', 0, '{\"planName\":\"YouTube\",\"nmiTransactionId\":\"11235071322\",\"nmiAuthCode\":\"123456\",\"planOwnerId\":\"44187263\",\"customerEmail\":\"hammadisaqib@gmail.com\",\"customerName\":\"Hammad Saqib\",\"referralCode\":null}'),
(294, '2025-10-10 11:21:38', '2025-10-10 11:21:38', 'completed', 'user_1760095298953_hammadisaqib@gmail.com', 132, 222.00, 'NMI Gateway', '11237631901', 0, '{\"planName\":\"YouTube\",\"nmiTransactionId\":\"11237631901\",\"nmiAuthCode\":\"123456\",\"planOwnerId\":\"44187263\",\"customerEmail\":\"hammadisaqib@gmail.com\",\"customerName\":\"Hammad Saqib\",\"referralCode\":null}'),
(295, '2025-10-10 11:23:59', '2025-10-10 11:23:59', 'completed', 'user_1760095439426_hammadisaqib@gmail.com', 132, 222.00, 'NMI Gateway', '11237638949', 0, '{\"planName\":\"YouTube\",\"nmiTransactionId\":\"11237638949\",\"nmiAuthCode\":\"123456\",\"planOwnerId\":\"44187263\",\"customerEmail\":\"hammadisaqib@gmail.com\",\"customerName\":\"Hammad Saqib\",\"referralCode\":null}'),
(296, '2025-10-10 11:29:25', '2025-10-10 11:29:25', 'completed', 'user_1760095765935_hammadisaqib@gmail.com', 132, 222.00, 'NMI Gateway', '11237654029', 0, '{\"planName\":\"YouTube\",\"nmiTransactionId\":\"11237654029\",\"nmiAuthCode\":\"123456\",\"planOwnerId\":\"44187263\",\"customerEmail\":\"hammadisaqib@gmail.com\",\"customerName\":\"Hammad Saqib\",\"referralCode\":null}'),
(297, '2025-10-10 11:39:44', '2025-10-10 11:39:44', 'completed', 'user_1760096384283_hammadisaqib@gmail.com', 132, 222.00, 'NMI Gateway', '11237678800', 0, '{\"planName\":\"YouTube\",\"nmiTransactionId\":\"11237678800\",\"nmiAuthCode\":\"123456\",\"planOwnerId\":\"44187263\",\"customerEmail\":\"hammadisaqib@gmail.com\",\"customerName\":\"Hammad Saqib\",\"referralCode\":null}'),
(298, '2025-10-10 11:41:06', '2025-10-10 11:53:09', 'completed', '44187263', 132, 222.00, 'NMI Gateway', '11237682537', 0, '{\"planName\":\"YouTube\",\"nmiTransactionId\":\"11237682537\",\"nmiAuthCode\":\"123456\",\"planOwnerId\":\"44187263\",\"customerEmail\":\"hammadisaqib@gmail.com\",\"customerName\":\"Munib Ahmed\",\"referralCode\":null}'),
(299, '2025-10-10 12:11:43', '2025-10-10 12:11:43', 'completed', 'user_1760098302979_john.doe@example.com', 128, 68.98, 'NMI Gateway', '11237762921', 0, '{\"planName\":\"oo\",\"nmiTransactionId\":\"11237762921\",\"nmiAuthCode\":\"123456\",\"planOwnerId\":\"44187263\",\"customerEmail\":\"john.doe@example.com\",\"customerName\":\"John Doe\",\"referralCode\":\"TEST123\"}'),
(300, '2025-10-10 12:17:40', '2025-10-10 12:17:40', 'completed', 'user_1760098302979_john.doe@example.com', 128, 68.98, 'NMI Gateway', '11237782015', 0, '{\"planName\":\"oo\",\"nmiTransactionId\":\"11237782015\",\"nmiAuthCode\":\"123456\",\"planOwnerId\":\"44187263\",\"customerEmail\":\"john.doe@example.com\",\"customerName\":\"John Doe\",\"referralCode\":\"TEST123\"}'),
(301, '2025-10-10 12:47:16', '2025-10-10 12:47:16', 'completed', '44187263', 131, 344.00, 'NMI Gateway', 'TEST-1760100436458-1501', 0, '{\"planName\":\"Rayiii\",\"nmiTransactionId\":\"TEST-1760100436458-1501\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"43537113\",\"customerEmail\":\"hammadisaqib@gmail.com\",\"customerName\":\"Munib Ahmed\",\"referralCode\":null}'),
(302, '2025-10-10 13:12:14', '2025-10-10 13:12:14', 'completed', 'hua1objl8w40fw7', 132, 222.00, 'NMI Gateway', '11237960748', 0, '{\"planName\":\"YouTube\",\"nmiTransactionId\":\"11237960748\",\"nmiAuthCode\":\"123456\",\"planOwnerId\":\"44187263\",\"customerEmail\":\"hammadisaqib@gmail.com\",\"customerName\":\"Kaif Ahmed\",\"referralCode\":null}'),
(303, '2025-10-10 13:14:52', '2025-10-10 13:14:52', 'completed', 'hua1objl8w40fw7', 132, 222.00, 'NMI Gateway', 'TEST-1760102092211-8353', 0, '{\"planName\":\"YouTube\",\"nmiTransactionId\":\"TEST-1760102092211-8353\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"customerEmail\":\"hammadisaqib@gmail.com\",\"customerName\":\"Kaif Ahmed\",\"referralCode\":null}'),
(304, '2025-10-10 14:14:48', '2025-10-10 14:14:48', 'completed', 'hua1objl8w40fw7', 134, 1.00, 'NMI Gateway', '11238254138', 0, '{\"planName\":\"Testing2269\",\"nmiTransactionId\":\"11238254138\",\"nmiAuthCode\":\"123456\",\"planOwnerId\":\"44187263\",\"customerEmail\":\"hammadisaqib@gmail.com\",\"customerName\":\"Kaif Ahmed\",\"referralCode\":null}'),
(305, '2025-10-10 14:20:40', '2025-10-10 14:20:40', 'completed', 'hua1objl8w40fw7', 128, 68.98, 'NMI Gateway', '11238283181', 0, '{\"planName\":\"oo\",\"nmiTransactionId\":\"11238283181\",\"nmiAuthCode\":\"123456\",\"planOwnerId\":\"44187263\",\"customerEmail\":\"hammadisaqib@gmail.com\",\"customerName\":\"Kaif Ahmed\",\"referralCode\":null}'),
(306, '2025-10-10 19:29:21', '2025-10-10 19:29:21', 'completed', '44187263', 134, 1313.00, 'NMI Gateway', 'TEST-1760124561179-3159', 0, '{\"planName\":\"Shoot Zone\",\"nmiTransactionId\":\"TEST-1760124561179-3159\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"customerEmail\":\"hammadisaqib@gmail.com\",\"customerName\":\"Kaif Ahmed\",\"referralCode\":null}'),
(307, '2025-10-10 20:08:19', '2025-10-10 20:08:19', 'completed', 'hua1objl8w40fw7', 134, 1313.00, 'NMI Gateway', 'TEST-1760126899863-7230', 0, '{\"planName\":\"Shoot Zone\",\"nmiTransactionId\":\"TEST-1760126899863-7230\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"paymentProcessorId\":\"hua1objl8w40fw7\",\"customerEmail\":\"hammadisaqib@gmail.com\",\"customerName\":\"Muneeb Ahmed\",\"referralCode\":null,\"whiteLabelDomain\":\"four12344\"}'),
(308, '2025-10-10 20:13:45', '2025-10-10 20:13:45', 'completed', '35m0crql3jbwdg5', 134, 1313.00, 'NMI Gateway', 'TEST-1760127225495-9331', 0, '{\"planName\":\"Shoot Zone\",\"nmiTransactionId\":\"TEST-1760127225495-9331\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"paymentProcessorId\":\"44187263\",\"customerEmail\":\"hammadisaqib@gmail.com\",\"customerName\":\"Hammad Saqib\",\"referralCode\":null,\"whiteLabelDomain\":null}'),
(309, '2025-10-10 20:43:01', '2025-10-10 20:43:01', 'completed', '35m0crql3jbwdg5', 134, 1313.00, 'NMI Gateway', 'TEST-1760128981762-9989', 0, '{\"planName\":\"Shoot Zone\",\"nmiTransactionId\":\"TEST-1760128981762-9989\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"paymentProcessorId\":\"44187263\",\"customerEmail\":\"hammadisaqib@gmail.com\",\"customerName\":\"Hammad Saqib\",\"referralCode\":null,\"whiteLabelDomain\":null}'),
(311, '2025-10-10 20:57:44', '2025-10-10 21:07:28', 'completed', '35m0crql3jbwdg5', 134, 1313.00, 'NMI Gateway', 'TEST-1760129864822-412', 32, '{\"planName\":\"Shoot Zone\",\"nmiTransactionId\":\"TEST-1760129864822-412\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"paymentProcessorId\":\"hua1objl8w40fw7\",\"customerEmail\":\"hammadisaqib@gmail.com\",\"customerName\":\"Hammad Saqib\",\"referralCode\":null,\"whiteLabelDomain\":\"four12344\"}'),
(312, '2025-10-10 21:34:43', '2025-10-10 22:32:36', 'completed', '35m0crql3jbwdg5', 136, 11.00, 'NMI Gateway', 'TEST-1760132083681-2110', 32, '{\"planName\":\"Raywl\",\"nmiTransactionId\":\"TEST-1760132083681-2110\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"paymentProcessorId\":\"hua1objl8w40fw7\",\"customerEmail\":\"hammadisaqib@gmail.com\",\"customerName\":\"Hammad Saqib\",\"referralCode\":null,\"whiteLabelDomain\":\"four12344\"}'),
(313, '2025-10-10 21:45:24', '2025-10-10 22:32:36', 'completed', '35m0crql3jbwdg5', 136, 11.00, 'NMI Gateway', 'TEST-1760132724282-1419', 32, '{\"planName\":\"Raywl\",\"nmiTransactionId\":\"TEST-1760132724282-1419\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"paymentProcessorId\":\"hua1objl8w40fw7\",\"customerEmail\":\"hammadisaqib@gmail.com\",\"customerName\":\"Hammad Saqib\",\"referralCode\":null,\"whiteLabelDomain\":\"four12344\"}'),
(314, '2025-10-10 22:05:36', '2025-10-10 22:05:36', 'completed', '35m0crql3jbwdg5', 136, 11.00, 'credit_card', 'TEST-FIXED-1760133936735-wn0n', 32, '{\"referralCode\":null,\"planName\":\"Raywl\",\"source\":\"process_payment\",\"paymentToken\":\"mock_client_secret_1760133936735_test\",\"transactionId\":\"TEST-FIXED-1760133936735-wn0n\",\"whiteLabelDomain\":\"four12344\",\"customerEmail\":null,\"customerName\":\"My Purchases\",\"planOwnerId\":\"44187263\",\"paymentProcessorId\":\"hua1objl8w40fw7\"}'),
(315, '2025-10-10 22:08:56', '2025-10-10 22:32:36', 'completed', '35m0crql3jbwdg5', 136, 11.00, 'NMI Gateway', 'TEST-1760134136514-8039', 32, '{\"planName\":\"Raywl\",\"nmiTransactionId\":\"TEST-1760134136514-8039\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"paymentProcessorId\":\"hua1objl8w40fw7\",\"customerEmail\":\"hammadisaqib@gmail.com\",\"customerName\":\"Hammad Saqib\",\"referralCode\":null,\"whiteLabelDomain\":\"four12344\"}'),
(316, '2025-10-10 22:12:02', '2025-10-10 22:32:36', 'completed', '35m0crql3jbwdg5', 136, 11.00, 'NMI Gateway', 'TEST-1760134322336-2059', 32, '{\"planName\":\"Raywl\",\"nmiTransactionId\":\"TEST-1760134322336-2059\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"paymentProcessorId\":\"hua1objl8w40fw7\",\"customerEmail\":\"hammadisaqib@gmail.com\",\"customerName\":\"Hammad Saqib\",\"referralCode\":null,\"whiteLabelDomain\":\"four12344\"}'),
(317, '2025-10-10 22:13:18', '2025-10-10 22:32:36', 'completed', 'hua1objl8w40fw7', 136, 11.00, 'NMI Gateway', 'TEST-1760134398794-7898', 32, '{\"planName\":\"Raywl\",\"nmiTransactionId\":\"TEST-1760134398794-7898\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"paymentProcessorId\":\"44187263\",\"customerEmail\":\"hammadisaqib@gmail.com\",\"customerName\":\"Kaif Gamer\",\"referralCode\":null,\"whiteLabelDomain\":\"shoot\"}'),
(318, '2025-10-10 22:23:33', '2025-10-10 22:23:33', 'completed', '35m0crql3jbwdg5', 134, 1313.00, 'NMI Gateway', 'TEST-1760135013976-2995', 0, '{\"planName\":\"Shoot Zone\",\"nmiTransactionId\":\"TEST-1760135013976-2995\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"paymentProcessorId\":\"hua1objl8w40fw7\",\"customerEmail\":\"hammadisaqib@gmail.com\",\"customerName\":\"Hammad Saqib\",\"referralCode\":null,\"whiteLabelDomain\":\"four12344\"}'),
(319, '2025-10-10 22:24:06', '2025-10-10 22:24:06', 'completed', '35m0crql3jbwdg5', 136, 11.00, 'NMI Gateway', 'TEST-1760135046466-615', 0, '{\"planName\":\"Raywl\",\"nmiTransactionId\":\"TEST-1760135046466-615\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"paymentProcessorId\":\"hua1objl8w40fw7\",\"customerEmail\":\"hammadisaqib@gmail.com\",\"customerName\":\"Hammad Saqib\",\"referralCode\":null,\"whiteLabelDomain\":\"four12344\"}'),
(320, '2025-10-11 08:21:16', '2025-10-11 08:21:16', 'completed', '26tje8w7lymxwlj', 140, 341.00, 'NMI Gateway', 'TEST-1760170876860-7711', 0, '{\"planName\":\"whitelabelsep\",\"nmiTransactionId\":\"TEST-1760170876860-7711\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"paymentProcessorId\":\"44187263\",\"customerEmail\":\"hammadisaqib@gmail.com\",\"customerName\":\"Hammad Saqib\",\"referralCode\":null,\"whiteLabelDomain\":null}'),
(321, '2025-10-11 08:22:19', '2025-10-11 08:22:19', 'completed', '26tje8w7lymxwlj', 134, 1313.00, 'NMI Gateway', 'TEST-1760170939411-964', 0, '{\"planName\":\"Shoot Zone\",\"nmiTransactionId\":\"TEST-1760170939411-964\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"paymentProcessorId\":\"44187263\",\"customerEmail\":\"hammadisaqib@gmail.com\",\"customerName\":\"Hammad Saqib\",\"referralCode\":null,\"whiteLabelDomain\":null}'),
(322, '2025-10-11 14:43:32', '2025-10-11 14:43:32', 'completed', '26tje8w7lymxwlj', 136, 11.00, 'NMI Gateway', 'TEST-1760193812314-7866', 0, '{\"planName\":\"Raywl\",\"nmiTransactionId\":\"TEST-1760193812314-7866\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"paymentProcessorId\":\"44187263\",\"customerEmail\":\"hammadisaqib@gmail.com\",\"customerName\":\"Hammad Saqib\",\"referralCode\":null,\"whiteLabelDomain\":null}'),
(323, '2025-10-12 11:01:12', '2025-10-12 11:01:12', 'completed', 'hua1objl8w40fw7', 136, 11.00, 'NMI Gateway', 'TEST-1760266872438-718', 0, '{\"planName\":\"Raywl\",\"nmiTransactionId\":\"TEST-1760266872438-718\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"paymentProcessorId\":\"44187263\",\"customerEmail\":\"hammadisaqib@gmail.com\",\"customerName\":\"kaif gamer\",\"referralCode\":null,\"whiteLabelDomain\":\"shoot\"}'),
(324, '2025-10-12 11:54:48', '2025-10-12 11:54:48', 'completed', 'iz2vpsv2u00nlu9', 136, 11.00, 'NMI Gateway', 'TEST-1760270088331-4947', 0, '{\"planName\":\"Raywl\",\"nmiTransactionId\":\"TEST-1760270088331-4947\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"paymentProcessorId\":\"hua1objl8w40fw7\",\"customerEmail\":\"info@theblackstoneconsultants.com\",\"customerName\":\"John Done\",\"referralCode\":null,\"whiteLabelDomain\":\"four1234488\"}'),
(325, '2025-10-12 12:30:45', '2025-10-12 12:30:45', 'completed', 'iz2vpsv2u00nlu9', 136, 11.00, 'NMI Gateway', 'TEST-1760272245251-7928', 0, '{\"planName\":\"Raywl\",\"nmiTransactionId\":\"TEST-1760272245251-7928\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"paymentProcessorId\":\"hua1objl8w40fw7\",\"customerEmail\":\"info@theblackstoneconsultants.com\",\"customerName\":\"John Done\",\"referralCode\":null,\"whiteLabelDomain\":\"four1234488\"}'),
(326, '2025-10-13 09:13:46', '2025-10-13 09:13:46', 'completed', 'iz2vpsv2u00nlu9', 140, 341.00, 'NMI Gateway', 'TEST-1760346826742-5555', 0, '{\"planName\":\"whitelabelsep\",\"nmiTransactionId\":\"TEST-1760346826742-5555\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"paymentProcessorId\":\"44187263\",\"customerEmail\":\"info@theblackstoneconsultants.com\",\"customerName\":\"John Done\",\"referralCode\":null,\"whiteLabelDomain\":\"shoot\"}'),
(327, '2025-10-13 09:16:32', '2025-10-13 09:16:32', 'completed', 'iz2vpsv2u00nlu9', 136, 11.00, 'NMI Gateway', 'TEST-1760346992226-5537', 0, '{\"planName\":\"Raywl\",\"nmiTransactionId\":\"TEST-1760346992226-5537\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"paymentProcessorId\":\"hua1objl8w40fw7\",\"customerEmail\":\"info@theblackstoneconsultants.com\",\"customerName\":\"John Done\",\"referralCode\":null,\"whiteLabelDomain\":\"four1234488\"}'),
(328, '2025-10-13 09:18:21', '2025-10-13 09:18:21', 'completed', 'iz2vpsv2u00nlu9', 140, 341.00, 'NMI Gateway', 'TEST-1760347100997-2973', 0, '{\"planName\":\"whitelabelsep\",\"nmiTransactionId\":\"TEST-1760347100997-2973\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"paymentProcessorId\":\"hua1objl8w40fw7\",\"customerEmail\":\"info@theblackstoneconsultants.com\",\"customerName\":\"John Done\",\"referralCode\":null,\"whiteLabelDomain\":\"four1234488\"}'),
(329, '2025-10-13 09:20:30', '2025-10-13 09:20:30', 'completed', 'iz2vpsv2u00nlu9', 136, 11.00, 'NMI Gateway', 'TEST-1760347230025-9320', 0, '{\"planName\":\"Raywl\",\"nmiTransactionId\":\"TEST-1760347230025-9320\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"paymentProcessorId\":\"hua1objl8w40fw7\",\"customerEmail\":\"info@theblackstoneconsultants.com\",\"customerName\":\"John Done\",\"referralCode\":null,\"whiteLabelDomain\":\"four1234488\"}'),
(330, '2025-10-13 09:30:23', '2025-10-13 09:30:23', 'completed', 'iz2vpsv2u00nlu9', 140, 341.00, 'NMI Gateway', 'TEST-1760347823664-3295', 0, '{\"planName\":\"whitelabelsep\",\"nmiTransactionId\":\"TEST-1760347823664-3295\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"paymentProcessorId\":\"44187263\",\"customerEmail\":\"info@theblackstoneconsultants.com\",\"customerName\":\"John Done\",\"referralCode\":null,\"whiteLabelDomain\":\"shoot\"}'),
(331, '2025-10-13 09:31:16', '2025-10-13 09:31:16', 'completed', 'iz2vpsv2u00nlu9', 140, 341.00, 'NMI Gateway', 'TEST-1760347876861-9305', 0, '{\"planName\":\"whitelabelsep\",\"nmiTransactionId\":\"TEST-1760347876861-9305\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"paymentProcessorId\":\"44187263\",\"customerEmail\":\"info@theblackstoneconsultants.com\",\"customerName\":\"John Done\",\"referralCode\":null,\"whiteLabelDomain\":\"shoot\"}'),
(332, '2025-10-13 10:07:38', '2025-10-13 10:07:38', 'completed', 'iz2vpsv2u00nlu9', 136, 11.00, 'NMI Gateway', 'TEST-1760350058372-3513', 0, '{\"planName\":\"Raywl\",\"nmiTransactionId\":\"TEST-1760350058372-3513\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"paymentProcessorId\":\"44187263\",\"customerEmail\":\"info@theblackstoneconsultants.com\",\"customerName\":\"John Done\",\"referralCode\":null,\"whiteLabelDomain\":\"shoot\"}'),
(333, '2025-10-13 10:08:23', '2025-10-13 10:24:51', 'completed', 'iz2vpsv2u00nlu9', 136, 11.00, 'NMI Gateway', 'TEST-1760350103904-2884', 0, '{\"planName\":\"Raywl\",\"nmiTransactionId\":\"TEST-1760350103904-2884\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"paymentProcessorId\":\"44187263\",\"customerEmail\":\"info@theblackstoneconsultants.com\",\"customerName\":\"John Done\",\"referralCode\":null,\"whiteLabelDomain\":\"four1234488\",\"originalIncorrectDomain\":\"shoot\",\"correctionNote\":\"Domain corrected from shoot to four1234488\"}'),
(334, '2025-10-13 10:17:28', '2025-10-13 10:17:28', 'completed', 'iz2vpsv2u00nlu9', 140, 341.00, 'NMI Gateway', 'TEST-1760350648887-1664', 0, '{\"planName\":\"whitelabelsep\",\"nmiTransactionId\":\"TEST-1760350648887-1664\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"paymentProcessorId\":\"44187263\",\"customerEmail\":\"info@theblackstoneconsultants.com\",\"customerName\":\"John Done\",\"referralCode\":null,\"whiteLabelDomain\":\"shoot\"}'),
(335, '2025-10-13 10:26:19', '2025-10-13 10:33:02', 'completed', 'iz2vpsv2u00nlu9', 136, 11.00, 'NMI Gateway', 'TEST-1760351179568-8294', 0, '{\"planName\":\"Raywl\",\"nmiTransactionId\":\"TEST-1760351179568-8294\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"paymentProcessorId\":\"44187263\",\"customerEmail\":\"info@theblackstoneconsultants.com\",\"customerName\":\"John Done\",\"referralCode\":null,\"whiteLabelDomain\":\"four1234488\"}'),
(336, '2025-10-13 10:35:56', '2025-10-13 10:35:56', 'completed', 'iz2vpsv2u00nlu9', 134, 1313.00, 'NMI Gateway', 'TEST-1760351756940-2586', 0, '{\"planName\":\"Shoot Zone\",\"nmiTransactionId\":\"TEST-1760351756940-2586\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"paymentProcessorId\":\"44187263\",\"customerEmail\":\"info@theblackstoneconsultants.com\",\"customerName\":\"John Done\",\"referralCode\":null,\"whiteLabelDomain\":\"shoot\"}'),
(337, '2025-10-13 10:36:35', '2025-10-13 10:36:35', 'completed', 'iz2vpsv2u00nlu9', 140, 341.00, 'NMI Gateway', 'TEST-1760351795558-968', 0, '{\"planName\":\"whitelabelsep\",\"nmiTransactionId\":\"TEST-1760351795558-968\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"paymentProcessorId\":\"hua1objl8w40fw7\",\"customerEmail\":\"info@theblackstoneconsultants.com\",\"customerName\":\"John Done\",\"referralCode\":null,\"whiteLabelDomain\":\"four1234488\"}'),
(338, '2025-10-13 11:04:05', '2025-10-13 11:04:05', 'completed', '1758320372285_testing1221', 133, 11.00, 'credit_card', 'txn_1760353445570_9txgjnlgh_1221', 32, '{\"planName\":\"Google Maps\",\"source\":\"cross_domain_test_purchase\",\"whiteLabelDomain\":\"four1234488\",\"customerEmail\":null,\"customerName\":\"testing1221\",\"planOwnerId\":\"44187263\",\"testPurchase\":true,\"crossDomainTest\":true,\"visitedDomain\":\"four1234488\",\"planDomain\":\"shoot\",\"simulationTimestamp\":\"2025-10-13T11:04:05.570Z\"}'),
(339, '2025-10-13 11:04:51', '2025-10-13 11:04:51', 'completed', '1758320372285_testing1221', 133, 11.00, 'credit_card', 'txn_1760353491359_ojj5379al_1221', 32, '{\"planName\":\"Google Maps\",\"source\":\"cross_domain_test_purchase\",\"whiteLabelDomain\":\"four1234488\",\"customerEmail\":null,\"customerName\":\"testing1221\",\"planOwnerId\":\"44187263\",\"testPurchase\":true,\"crossDomainTest\":true,\"visitedDomain\":\"four1234488\",\"planDomain\":\"shoot\",\"simulationTimestamp\":\"2025-10-13T11:04:51.359Z\"}'),
(340, '2025-10-13 11:09:37', '2025-10-13 11:09:37', 'pending', 'cc3100ce-940e-4156-a0ae-de338282fafb', 136, 11.00, NULL, 'txn_1760353777416_o7i3p5gdg_real', 32, '{\"whiteLabelDomain\":\"four1234488\",\"planName\":\"Raywl\",\"buyerInfo\":{\"username\":\"printteam@example.com\",\"email\":\"epicgamer125521@gmail.com\"},\"purchaseType\":\"realistic_test\",\"visitedDomain\":\"four1234488\"}'),
(341, '2025-10-13 11:57:52', '2025-10-13 11:57:52', 'completed', 'iz2vpsv2u00nlu9', 136, 11.00, 'NMI Gateway', 'TEST-1760356672408-138', 0, '{\"planName\":\"Raywl\",\"nmiTransactionId\":\"TEST-1760356672408-138\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"paymentProcessorId\":\"hua1objl8w40fw7\",\"customerEmail\":\"info@theblackstoneconsultants.com\",\"customerName\":\"John Done\",\"referralCode\":null,\"whiteLabelDomain\":\"four1234488\"}'),
(342, '2025-10-13 13:04:45', '2025-10-13 13:04:45', 'completed', 'iz2vpsv2u00nlu9', 128, 68.98, 'NMI Gateway', 'TEST-1760360685181-2048', 0, '{\"planName\":\"oo\",\"nmiTransactionId\":\"TEST-1760360685181-2048\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"paymentProcessorId\":\"44187263\",\"customerEmail\":\"info@theblackstoneconsultants.com\",\"customerName\":\"John Done\",\"referralCode\":null,\"whiteLabelDomain\":\"shoot\"}'),
(343, '2025-10-13 13:13:11', '2025-10-13 13:13:11', 'completed', 'iz2vpsv2u00nlu9', 140, 341.00, 'NMI Gateway', 'TEST-1760361191575-1373', 0, '{\"planName\":\"whitelabelsep\",\"nmiTransactionId\":\"TEST-1760361191575-1373\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"paymentProcessorId\":\"44187263\",\"customerEmail\":\"info@theblackstoneconsultants.com\",\"customerName\":\"John Done\",\"referralCode\":null,\"whiteLabelDomain\":\"shoot\"}'),
(344, '2025-10-13 13:16:20', '2025-10-13 13:16:20', 'completed', 'iz2vpsv2u00nlu9', 128, 68.98, 'NMI Gateway', 'TEST-1760361380169-660', 0, '{\"planName\":\"oo\",\"nmiTransactionId\":\"TEST-1760361380169-660\",\"nmiAuthCode\":\"TEST-AUTH\",\"planOwnerId\":\"44187263\",\"paymentProcessorId\":\"44187263\",\"customerEmail\":\"info@theblackstoneconsultants.com\",\"customerName\":\"John Done\",\"referralCode\":null,\"whiteLabelDomain\":\"shoot\"}'),
(345, '2025-10-14 20:49:49', '2025-10-18 08:39:34', 'completed', 'user_1760748333137_hammad@gmail.com', 136, 11.00, 'NMI Gateway', '11252132052', 0, '{\"planName\":\"Raywl\",\"nmiTransactionId\":\"11252132052\",\"nmiAuthCode\":\"123456\",\"planOwnerId\":\"44187263\",\"customerEmail\":\"hammad@gmail.com\",\"customerName\":\"hammad hammad\",\"referralCode\":null}'),
(346, '2025-10-14 20:58:19', '2025-10-18 08:39:34', 'pending', 'user_1760748333137_hammad@gmail.com', 136, 99.00, 'test', 'test_1760475499759', 1, NULL),
(347, '2025-10-14 21:49:42', '2025-10-14 22:00:58', 'completed', 'u18o8hwgfhbcz36', 136, 11.00, 'NMI Gateway', '11252314297', 0, '{\"planName\":\"Raywl\",\"nmiTransactionId\":\"11252314297\",\"nmiAuthCode\":\"123456\",\"planOwnerId\":\"44187263\",\"customerEmail\":\"hammad@gmail.com\",\"customerName\":\"hammad hammad\",\"referralCode\":null}'),
(348, '2025-10-16 20:11:17', '2025-10-18 08:39:34', 'completed', 'user_1760748333137_hammad@gmail.com', 140, 341.00, 'NMI Gateway', '11260684602', 0, '{\"planName\":\"whitelabelsep\",\"nmiTransactionId\":\"11260684602\",\"nmiAuthCode\":\"123456\",\"planOwnerId\":\"44187263\",\"customerEmail\":\"hammad@gmail.com\",\"customerName\":\"hammad saqib\",\"referralCode\":null}'),
(349, '2025-10-18 00:22:14', '2025-10-18 08:39:34', 'completed', 'user_1760748333137_hammad@gmail.com', 141, 12.00, 'Bypass - Direct Purchase', 'bypass_1760746933975_141', 0, '{\"planName\":\"Testing For My Affiliate\",\"bypassTransactionId\":\"bypass_1760746933975_141\",\"bypassAuthCode\":\"AUTH_1760746933975\",\"planOwnerId\":\"43537113\",\"customerEmail\":\"hammad@gmail.com\",\"customerName\":\"hammad hammad\",\"referralCode\":\"ali1\",\"paymentMethod\":\"Bypass - Direct Purchase\"}'),
(350, '2025-10-18 00:23:15', '2025-10-18 08:39:34', 'completed', 'user_1760748333137_hammad@gmail.com', 141, 12.00, 'Bypass - Direct Purchase', 'bypass_1760746995069_141', 0, '{\"planName\":\"Testing For My Affiliate\",\"bypassTransactionId\":\"bypass_1760746995069_141\",\"bypassAuthCode\":\"AUTH_1760746995069\",\"planOwnerId\":\"43537113\",\"customerEmail\":\"hammad@gmail.com\",\"customerName\":\"hammad hammad\",\"referralCode\":\"ali1\",\"paymentMethod\":\"Bypass - Direct Purchase\"}'),
(351, '2025-10-18 00:26:36', '2025-10-18 08:39:34', 'completed', 'user_1760748333137_hammad@gmail.com', 141, 12.00, 'Bypass - Direct Purchase', 'bypass_1760747196391_141', 0, '{\"planName\":\"Testing For My Affiliate\",\"bypassTransactionId\":\"bypass_1760747196391_141\",\"bypassAuthCode\":\"AUTH_1760747196391\",\"planOwnerId\":\"43537113\",\"customerEmail\":\"hammad@gmail.com\",\"customerName\":\"hammad hammad\",\"referralCode\":\"ali1\",\"paymentMethod\":\"Bypass - Direct Purchase\"}'),
(352, '2025-10-18 00:27:55', '2025-10-18 08:39:34', 'completed', 'user_1760748333137_hammad@gmail.com', 141, 12.00, 'Bypass - Direct Purchase', 'bypass_1760747275752_141', 0, '{\"planName\":\"Testing For My Affiliate\",\"bypassTransactionId\":\"bypass_1760747275752_141\",\"bypassAuthCode\":\"AUTH_1760747275752\",\"planOwnerId\":\"43537113\",\"customerEmail\":\"hammad@gmail.com\",\"customerName\":\"hammad saqib\",\"referralCode\":\"ali1\",\"paymentMethod\":\"Bypass - Direct Purchase\"}'),
(353, '2025-10-18 00:30:56', '2025-10-18 08:39:34', 'completed', 'user_1760748333137_hammad@gmail.com', 141, 12.00, 'Bypass - Direct Purchase', 'bypass_1760747456617_141', 0, '{\"planName\":\"Testing For My Affiliate\",\"bypassTransactionId\":\"bypass_1760747456617_141\",\"bypassAuthCode\":\"AUTH_1760747456617\",\"planOwnerId\":\"43537113\",\"customerEmail\":\"hammad@gmail.com\",\"customerName\":\"hammad hammad\",\"referralCode\":\"ali1\",\"paymentMethod\":\"Bypass - Direct Purchase\"}'),
(354, '2025-10-18 00:32:35', '2025-10-18 08:39:34', 'completed', 'user_1760748333137_hammad@gmail.com', 141, 12.00, 'Bypass - Direct Purchase', 'bypass_1760747555936_141', 0, '{\"planName\":\"Testing For My Affiliate\",\"bypassTransactionId\":\"bypass_1760747555936_141\",\"bypassAuthCode\":\"AUTH_1760747555936\",\"planOwnerId\":\"43537113\",\"customerEmail\":\"hammad@gmail.com\",\"customerName\":\"Affiliate hammad\",\"referralCode\":\"ali1\",\"paymentMethod\":\"Bypass - Direct Purchase\"}'),
(355, '2025-10-18 00:34:39', '2025-10-18 08:46:50', 'completed', '44187263453', 141, 12.00, 'Bypass - Direct Purchase', 'bypass_1760747679296_141', 0, '{\"planName\":\"Testing For My Affiliate\",\"bypassTransactionId\":\"bypass_1760747679296_141\",\"bypassAuthCode\":\"AUTH_1760747679296\",\"planOwnerId\":\"43537113\",\"customerEmail\":\"hammad@gmail.com\",\"customerName\":\"hammad hammad\",\"referralCode\":\"ali1\",\"paymentMethod\":\"Bypass - Direct Purchase\"}'),
(356, '2025-10-18 00:36:31', '2025-10-18 00:37:24', 'completed', '1760747791238', 141, 12.00, 'Bypass - Direct Purchase', 'bypass_1760747791238_141', 0, '{\"planName\":\"Testing For My Affiliate\",\"bypassTransactionId\":\"bypass_1760747791238_141\",\"bypassAuthCode\":\"AUTH_1760747791238\",\"planOwnerId\":\"43537113\",\"customerEmail\":\"hammad@gmail.com\",\"customerName\":\"hammad hammad\",\"referralCode\":\"ali1\",\"paymentMethod\":\"Bypass - Direct Purchase\"}'),
(357, '2025-10-18 00:44:22', '2025-10-18 08:39:34', 'completed', 'user_1760748333137_hammad@gmail.com', 141, 12.00, 'Bypass - Direct Purchase', 'bypass_1760748262704_141', 0, '{\"planName\":\"Testing For My Affiliate\",\"bypassTransactionId\":\"bypass_1760748262704_141\",\"bypassAuthCode\":\"AUTH_1760748262704\",\"planOwnerId\":\"43537113\",\"customerEmail\":\"hammad@gmail.com\",\"customerName\":\"hammad saqib\",\"referralCode\":\"ali1\",\"paymentMethod\":\"Bypass - Direct Purchase\"}'),
(358, '2025-10-18 00:45:33', '2025-10-18 00:45:33', 'completed', 'user_1760748333137_hammad@gmail.com', 141, 12.00, 'Bypass - Direct Purchase', 'bypass_1760748333136_141', 0, '{\"planName\":\"Testing For My Affiliate\",\"bypassTransactionId\":\"bypass_1760748333136_141\",\"bypassAuthCode\":\"AUTH_1760748333136\",\"planOwnerId\":\"43537113\",\"customerEmail\":\"hammad@gmail.com\",\"customerName\":\"Affiliate hammad\",\"referralCode\":\"ali1\",\"paymentMethod\":\"Bypass - Direct Purchase\"}'),
(359, '2025-10-18 09:03:18', '2025-10-18 09:03:18', 'completed', 'user_1760778198497_test@example.com', 141, 97.00, 'NMI Credit Card', 'bypass_1760778198496_xw9olblwj', 0, '{\"planName\":\"Testing For My Affiliate\",\"nmiTransactionId\":\"bypass_1760778198496_xw9olblwj\",\"nmiAuthCode\":\"AUTH7D8LTM\",\"planOwnerId\":\"43537113\",\"customerEmail\":\"test@example.com\",\"customerName\":\"Test User\",\"referralCode\":null,\"paymentMethod\":\"NMI Credit Card\",\"orderId\":\"order_1760778198494_141\"}'),
(360, '2025-10-18 09:03:41', '2025-10-18 09:03:41', 'completed', 'user_1760778221347_hammad@gmail.com', 142, 22.00, 'NMI Credit Card', 'bypass_1760778221345_haaqkwkww', 0, '{\"planName\":\"test_username\",\"nmiTransactionId\":\"bypass_1760778221345_haaqkwkww\",\"nmiAuthCode\":\"AUTHSHXUQZ\",\"planOwnerId\":\"43537113\",\"customerEmail\":\"hammad@gmail.com\",\"customerName\":\"hammad hammad\",\"referralCode\":\"ali1\",\"paymentMethod\":\"NMI Credit Card\",\"orderId\":\"order_1760778221342_142\"}'),
(361, '2025-10-18 09:11:06', '2025-10-18 09:11:06', 'completed', 'user_1760778666931_testuser@example.com', 141, 97.00, 'NMI Credit Card', 'bypass_1760778666930_yadpzdqkh', 0, '{\"planName\":\"Testing For My Affiliate\",\"nmiTransactionId\":\"bypass_1760778666930_yadpzdqkh\",\"nmiAuthCode\":\"AUTHJERJ57\",\"planOwnerId\":\"43537113\",\"customerEmail\":\"testuser@example.com\",\"customerName\":\"Test User\",\"referralCode\":null,\"paymentMethod\":\"NMI Credit Card\",\"orderId\":\"order_1760778666929_141\"}'),
(362, '2025-10-18 09:11:50', '2025-10-18 09:11:50', 'completed', 'user_1760778710058_testuser@example.com', 141, 97.00, 'NMI Credit Card', 'bypass_1760778710057_wd8c6djph', 0, '{\"planName\":\"Testing For My Affiliate\",\"nmiTransactionId\":\"bypass_1760778710057_wd8c6djph\",\"nmiAuthCode\":\"AUTHOD8E87\",\"planOwnerId\":\"43537113\",\"customerEmail\":\"testuser@example.com\",\"customerName\":\"Test User\",\"referralCode\":null,\"paymentMethod\":\"NMI Credit Card\",\"orderId\":\"order_1760778710056_141\"}'),
(363, '2025-10-18 09:13:44', '2025-10-18 09:13:44', 'completed', 'user_1760778824475_testuser@example.com', 141, 97.00, 'NMI Credit Card', 'bypass_1760778824475_c8q5g02ou', 0, '{\"planName\":\"Testing For My Affiliate\",\"nmiTransactionId\":\"bypass_1760778824475_c8q5g02ou\",\"nmiAuthCode\":\"AUTHDYVBZ9\",\"planOwnerId\":\"43537113\",\"customerEmail\":\"testuser@example.com\",\"customerName\":\"Test User\",\"referralCode\":null,\"paymentMethod\":\"NMI Credit Card\",\"orderId\":\"order_1760778824473_141\"}'),
(364, '2025-10-18 09:14:26', '2025-10-18 09:14:26', 'completed', 'user_1760778866172_hammad@gmail.com', 142, 22.00, 'NMI Credit Card', 'bypass_1760778866171_qcfpte714', 0, '{\"planName\":\"test_username\",\"nmiTransactionId\":\"bypass_1760778866171_qcfpte714\",\"nmiAuthCode\":\"AUTH5VHQY7\",\"planOwnerId\":\"43537113\",\"customerEmail\":\"hammad@gmail.com\",\"customerName\":\"hammad hammad\",\"referralCode\":\"ali1\",\"paymentMethod\":\"NMI Credit Card\",\"orderId\":\"order_1760778866169_142\"}'),
(365, '2025-10-18 09:15:33', '2025-10-18 09:15:33', 'completed', 'user_1760474786796_hammad@gmail.com', 142, 22.00, 'NMI Credit Card', 'bypass_1760778933393_l6tk0n64m', 0, '{\"planName\":\"test_username\",\"nmiTransactionId\":\"bypass_1760778933393_l6tk0n64m\",\"nmiAuthCode\":\"AUTH99QWOW\",\"planOwnerId\":\"43537113\",\"customerEmail\":\"hammad@gmail.com\",\"customerName\":\"hammad hammad\",\"referralCode\":\"ali1\",\"paymentMethod\":\"NMI Credit Card\",\"orderId\":\"order_1760778933392_142\"}'),
(366, '2025-10-18 09:15:35', '2025-10-18 09:15:35', 'completed', 'fm682enwv01i389', 141, 97.00, 'NMI Credit Card', 'bypass_1760778935639_ibb1sllwr', 0, '{\"planName\":\"Testing For My Affiliate\",\"nmiTransactionId\":\"bypass_1760778935639_ibb1sllwr\",\"nmiAuthCode\":\"AUTH42IGJA\",\"planOwnerId\":\"43537113\",\"customerEmail\":\"newtest1760778935615@example.com\",\"customerName\":\"New Test\",\"referralCode\":null,\"paymentMethod\":\"NMI Credit Card\",\"orderId\":\"order_1760778935637_141\"}'),
(367, '2025-10-18 09:16:29', '2025-10-18 09:16:29', 'completed', 'user_1760474786796_hammad@gmail.com', 142, 22.00, 'NMI Credit Card', 'bypass_1760778989302_iab5dbrtz', 0, '{\"planName\":\"test_username\",\"nmiTransactionId\":\"bypass_1760778989302_iab5dbrtz\",\"nmiAuthCode\":\"AUTHCDM8XC\",\"planOwnerId\":\"43537113\",\"customerEmail\":\"hammad@gmail.com\",\"customerName\":\"hammad hammad\",\"referralCode\":\"ali1\",\"paymentMethod\":\"NMI Credit Card\",\"orderId\":\"order_1760778989300_142\"}'),
(368, '2025-10-18 09:25:15', '2025-10-18 09:25:15', 'completed', 'user_1760474786796_hammad@gmail.com', 142, 22.00, 'NMI Credit Card', 'bypass_1760779515309_a4i2liu3l', 0, '{\"planName\":\"test_username\",\"nmiTransactionId\":\"bypass_1760779515309_a4i2liu3l\",\"nmiAuthCode\":\"AUTHV4X56G\",\"planOwnerId\":\"43537113\",\"customerEmail\":\"hammad@gmail.com\",\"customerName\":\"test username \",\"referralCode\":\"ali1\",\"paymentMethod\":\"NMI Credit Card\",\"orderId\":\"order_1760779515308_142\"}'),
(369, '2025-10-18 09:37:55', '2025-10-18 09:37:55', 'completed', 'user_1760474786796_hammad@gmail.com', 142, 22.00, 'NMI Credit Card', 'bypass_1760780275731_vp4dwey9r', 0, '{\"planName\":\"test_username\",\"nmiTransactionId\":\"bypass_1760780275731_vp4dwey9r\",\"nmiAuthCode\":\"AUTH1QDSBB\",\"planOwnerId\":\"43537113\",\"customerEmail\":\"hammad@gmail.com\",\"customerName\":\"test username\",\"referralCode\":\"ali1\",\"paymentMethod\":\"NMI Credit Card\",\"orderId\":\"order_1760780275730_142\"}'),
(370, '2025-10-18 09:44:06', '2025-10-18 09:44:06', 'completed', 'egqhkg18dwo88qw', 142, 22.00, 'NMI Credit Card', 'bypass_1760780646326_b9f0o899s', 0, '{\"planName\":\"test_username\",\"nmiTransactionId\":\"bypass_1760780646326_b9f0o899s\",\"nmiAuthCode\":\"AUTH84BLKO\",\"planOwnerId\":\"43537113\",\"customerEmail\":\"had@gmail.com\",\"customerName\":\"Purchase Purchase\",\"referralCode\":\"ali1\",\"paymentMethod\":\"NMI Credit Card\",\"orderId\":\"order_1760780646325_142\"}'),
(371, '2025-10-18 09:45:54', '2025-10-18 09:45:54', 'completed', '00fb5fb2-932f-45da-9fa1-60403f078f32', 142, 22.00, 'NMI Credit Card', 'bypass_1760780754222_2md9rzjyk', 0, '{\"planName\":\"test_username\",\"nmiTransactionId\":\"bypass_1760780754222_2md9rzjyk\",\"nmiAuthCode\":\"AUTH47N72K\",\"planOwnerId\":\"43537113\",\"customerEmail\":\"hammadiisaqib@gmail.com\",\"customerName\":\"Purchase Purchase\",\"referralCode\":\"ali1\",\"paymentMethod\":\"NMI Credit Card\",\"orderId\":\"order_1760780754221_142\"}'),
(372, '2025-10-18 09:53:16', '2025-10-18 09:53:16', 'completed', 'nxagkqgzvw7yuyb', 142, 22.00, 'NMI Credit Card', 'bypass_1760781196645_6kqau3hsr', 0, '{\"planName\":\"test_username\",\"nmiTransactionId\":\"bypass_1760781196645_6kqau3hsr\",\"nmiAuthCode\":\"AUTHINQ7CA\",\"planOwnerId\":\"43537113\",\"customerEmail\":\"hammdsdsad@gmail.com\",\"customerName\":\"test username\",\"referralCode\":\"ali1\",\"paymentMethod\":\"NMI Credit Card\",\"orderId\":\"order_1760781196643_142\"}'),
(373, '2025-10-18 09:54:53', '2025-10-18 09:55:49', 'completed', '44187263', 142, 22.00, 'NMI Credit Card', 'bypass_1760781293637_824l8ogdz', 0, '{\"planName\":\"test_username\",\"nmiTransactionId\":\"bypass_1760781293637_824l8ogdz\",\"nmiAuthCode\":\"AUTHVW9T6T\",\"planOwnerId\":\"43537113\",\"customerEmail\":\"hammadiisaqib@gmail.com\",\"customerName\":\"Ric Slick\",\"referralCode\":\"ali1\",\"paymentMethod\":\"NMI Credit Card\",\"orderId\":\"order_1760781293636_142\"}');

-- --------------------------------------------------------

--
-- Table structure for table `referral_clicks`
--

CREATE TABLE `referral_clicks` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `referral_commissions`
--

CREATE TABLE `referral_commissions` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `affiliate_id` varchar(255) NOT NULL,
  `commission_amount` decimal(10,2) NOT NULL,
  `plan_amount` decimal(10,2) NOT NULL,
  `purchaser_user_id` varchar(255) NOT NULL,
  `subscription_id` int(11) NOT NULL,
  `plan_id` int(11) NOT NULL,
  `referral_code` varchar(255) NOT NULL,
  `commission_percentage` decimal(5,2) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'pending',
  `paid_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `referral_commissions`
--

INSERT INTO `referral_commissions` (`id`, `created_at`, `updated_at`, `affiliate_id`, `commission_amount`, `plan_amount`, `purchaser_user_id`, `subscription_id`, `plan_id`, `referral_code`, `commission_percentage`, `status`, `paid_at`) VALUES
(2, '2025-07-23 20:59:47', '2025-07-23 20:59:47', '44915301', 2.90, 29.00, '44443117', 0, 0, '', 0.00, 'pending', NULL),
(3, '2025-07-23 21:11:24', '2025-07-23 21:11:24', '44915301', 2.90, 29.00, '44187263', 0, 0, '', 0.00, 'pending', NULL),
(6, '2025-07-23 21:30:55', '2025-07-23 21:30:55', '44915301', 0.00, 121.00, '44377090', 0, 0, '', 0.00, 'pending', NULL),
(7, '2025-07-23 21:33:20', '2025-07-23 21:33:20', '44915301', 4.35, 29.00, '44377090', 0, 0, '', 0.00, 'pending', NULL),
(8, '2025-07-23 21:43:32', '2025-07-23 21:43:32', '44915301', 0.00, 2.00, '44443117', 0, 0, '', 0.00, 'pending', NULL),
(9, '2025-07-24 15:38:41', '2025-07-24 15:38:41', '44443117', 2.90, 29.00, '44377090', 0, 0, '', 0.00, 'pending', NULL),
(10, '2025-07-24 15:39:46', '2025-07-24 15:39:46', '44443117', 2.90, 29.00, '44377090', 0, 0, '', 0.00, 'pending', NULL),
(11, '2025-07-24 15:40:30', '2025-07-24 15:40:30', '44443117', 0.00, 2.00, '44377090', 0, 0, '', 0.00, 'pending', NULL),
(12, '2025-07-24 17:48:53', '2025-07-24 17:48:53', '44443117', 160.00, 999.99, '44377090', 0, 0, '', 0.00, 'pending', NULL),
(13, '2025-07-24 17:49:16', '2025-07-24 17:49:16', '44443117', 160.00, 999.99, '44377090', 0, 0, '', 0.00, 'pending', NULL),
(14, '2025-07-25 19:03:47', '2025-07-25 19:03:47', 'test_affiliate_001', 50.00, 1000.00, '44377090', 0, 0, '', 0.00, 'pending', NULL),
(15, '2025-08-04 21:18:09', '2025-08-04 21:18:09', '44915301', 160.00, 999.99, '44443117', 0, 0, '', 0.00, 'pending', NULL),
(16, '2025-08-12 03:36:16', '2025-08-12 03:36:16', 'zpv1hwu56h14u88', 1.10, 22.00, 'tp9tzi7ya1wjjyx', 0, 0, '', 0.00, 'pending', NULL),
(17, '2025-08-12 03:36:32', '2025-08-12 03:36:32', 'zpv1hwu56h14u88', 2.20, 22.00, 'tp9tzi7ya1wjjyx', 0, 0, '', 0.00, 'pending', NULL),
(18, '2025-08-12 07:33:36', '2025-08-12 07:33:36', 'tp9tzi7ya1wjjyx', 696.90, 6969.00, 'tp9tzi7ya1wjjyx', 0, 0, '', 0.00, 'pending', NULL),
(19, '2025-08-12 07:35:12', '2025-08-12 07:35:12', 'tp9tzi7ya1wjjyx', 1115.04, 6969.00, 'tp9tzi7ya1wjjyx', 0, 0, '', 0.00, 'pending', NULL),
(20, '2025-08-12 07:45:01', '2025-08-12 07:45:01', 'tp9tzi7ya1wjjyx', 1115.04, 6969.00, 'tp9tzi7ya1wjjyx', 0, 0, '', 0.00, 'pending', NULL),
(21, '2025-08-12 09:04:58', '2025-08-12 09:04:58', 'zpv1hwu56h14u88', 1.10, 22.00, 'zpv1hwu56h14u88', 0, 0, '', 0.00, 'pending', NULL),
(22, '2025-08-12 09:32:02', '2025-08-12 09:32:02', 'rg1ptrh9mdfgsrz', 24.42, 111.00, 'rg1ptrh9mdfgsrz', 0, 0, '', 0.00, 'pending', NULL),
(23, '2025-08-12 09:32:42', '2025-08-12 09:32:42', 'rg1ptrh9mdfgsrz', 24.42, 111.00, 'rg1ptrh9mdfgsrz', 0, 0, '', 0.00, 'pending', NULL),
(24, '2025-08-12 10:11:50', '2025-08-12 10:11:50', '685xf719omsrqm8', 1811.94, 6969.00, '685xf719omsrqm8', 0, 0, '', 0.00, 'pending', NULL),
(25, '2025-08-13 04:58:39', '2025-08-13 04:58:39', '44377090', 0.50, 5.00, '44377090', 0, 0, '', 0.00, 'pending', NULL),
(26, '2025-08-13 11:40:20', '2025-08-13 11:40:20', '6pa5688t8fntppw', 120.00, 999.99, '43537113', 0, 0, '', 0.00, 'pending', NULL),
(27, '2025-08-14 05:42:31', '2025-08-14 05:42:31', '6kk4onsspvzjoml', 120.00, 999.99, '44187263', 0, 0, '', 0.00, 'pending', NULL),
(28, '2025-08-22 21:20:05', '2025-08-22 21:20:05', '53cnffx7v02h7if', 2.90, 29.00, 'jwg84z5hawl8jms', 0, 0, '', 0.00, 'pending', NULL),
(29, '2025-08-23 15:22:11', '2025-08-23 15:22:11', '53cnffx7v02h7if', 120.00, 999.99, '1fykk71x0x07yod', 0, 0, '', 0.00, 'pending', NULL),
(30, '2025-08-23 15:22:48', '2025-08-23 15:22:48', '53cnffx7v02h7if', 2.20, 22.00, '1fykk71x0x07yod', 0, 0, '', 0.00, 'pending', NULL),
(31, '2025-08-23 15:39:00', '2025-08-23 15:39:00', '6kk4onsspvzjoml', 0.00, 149.99, '1fykk71x0x07yod', 0, 0, '', 0.00, 'pending', NULL),
(32, '2025-08-23 16:09:29', '2025-08-23 16:09:29', 'db4k9owwms65bna', 4.84, 22.00, '1fykk71x0x07yod', 0, 0, '', 0.00, 'pending', NULL),
(36, '2025-08-29 08:51:29', '2025-08-29 08:51:29', 'aff_001', 0.20, 0.00, '', 0, 0, '', 0.00, 'pending', NULL),
(38, '2025-08-29 15:34:01', '2025-08-29 15:34:01', 'aff_001', 100.00, 0.00, '', 0, 0, '', 0.00, 'pending', NULL),
(39, '2025-08-29 15:35:34', '2025-08-29 15:35:34', 'aff_001', 2.20, 0.00, '', 0, 0, '', 0.00, 'pending', NULL),
(40, '2025-08-29 16:03:24', '2025-08-29 16:03:24', 'aff_001', 200.00, 2000.00, '44187263', 0, 0, '', 0.00, 'pending', NULL),
(41, '2025-08-29 16:22:32', '2025-08-29 16:22:32', 'aff_002', 2.20, 22.00, '44187263', 0, 0, '', 0.00, 'pending', NULL),
(43, '2025-10-18 10:22:29', '2025-10-18 10:22:29', 'e2m3st59vmryro0', 0.00, 22.00, '44187263', 0, 142, 'ali1', 0.00, 'pending', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `referral_links`
--

CREATE TABLE `referral_links` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `affiliate_id` varchar(255) DEFAULT NULL,
  `referral_code` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `total_clicks` int(11) DEFAULT NULL,
  `total_signups` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `referral_links`
--

INSERT INTO `referral_links` (`id`, `created_at`, `updated_at`, `affiliate_id`, `referral_code`, `is_active`, `total_clicks`, `total_signups`) VALUES
(1, '2025-06-27 12:44:12', '2025-06-27 12:44:12', '43537113', 'REF_43537113_1751064252353', 1, 0, 0),
(2, '2025-06-28 14:25:41', '2025-06-28 14:25:41', '44187263', 'REF_44187263_1751156741217', 1, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `referral_signups`
--

CREATE TABLE `referral_signups` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `referral_link_id` varchar(255) DEFAULT NULL,
  `affiliate_id` varchar(255) DEFAULT NULL,
  `signup_user_id` varchar(255) DEFAULT NULL,
  `ip_address` text DEFAULT NULL,
  `user_agent` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `referral_signups`
--

INSERT INTO `referral_signups` (`id`, `created_at`, `updated_at`, `referral_link_id`, `affiliate_id`, `signup_user_id`, `ip_address`, `user_agent`) VALUES
(2, '2025-06-27 13:32:08', '2025-09-17 18:32:31', '1', '43537113', 'test-wl-client-1', NULL, NULL),
(3, '2025-06-27 13:32:25', '2025-09-17 18:32:31', '1', '43537113', 'test-wl-client-2', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `referral_tracking`
--

CREATE TABLE `referral_tracking` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `affiliate_id` varchar(255) DEFAULT NULL,
  `referred_user_id` varchar(255) DEFAULT NULL,
  `white_label_id` varchar(255) DEFAULT NULL,
  `domain_path` varchar(255) DEFAULT NULL,
  `status` text DEFAULT NULL,
  `referral_source` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `referral_tracking`
--

INSERT INTO `referral_tracking` (`id`, `created_at`, `updated_at`, `affiliate_id`, `referred_user_id`, `white_label_id`, `domain_path`, `status`, `referral_source`) VALUES
(1, '2025-07-17 00:15:00', '2025-07-17 12:18:43', '44377090', '43537113', '11', 'epicaffiliate', NULL, 'landing_page'),
(2, '2025-07-16 04:30:00', '2025-07-17 12:18:43', '44377090', '44443117', '11', 'epicaffiliate', NULL, 'landing_page'),
(3, '2025-07-14 23:20:00', '2025-07-17 12:18:43', '44377090', '44377090', '11', 'epicaffiliate', NULL, 'landing_page'),
(4, '2025-07-17 12:36:42', '2025-07-17 12:36:42', '44377090', '44915301', '7', 'epicaffiliate', 'active', 'landing_page'),
(5, '2025-07-17 13:39:37', '2025-07-17 13:39:37', '44377090', '43537113', '7', 'shoot', 'active', 'landing_page'),
(6, '2025-07-17 15:31:29', '2025-07-17 15:31:29', '44377090', '43537113', '7', 'epicaffiliate', 'active', 'landing_page'),
(7, '2025-07-19 10:51:27', '2025-07-19 10:51:27', '44377090', '43537113', '7', 'epicaffiliate', 'active', 'landing_page'),
(8, '2025-05-24 11:29:09', '2025-07-24 11:29:09', 'aff_001', 'end_001', '3', '', 'confirmed', 'landing_page'),
(9, '2025-05-24 11:29:09', '2025-07-24 11:29:09', 'aff_001', 'end_002', '3', '', 'confirmed', 'landing_page'),
(10, '2025-06-24 11:29:09', '2025-07-24 11:29:09', 'aff_001', 'end_003', '4', '', 'confirmed', 'landing_page'),
(11, '2025-06-24 11:29:12', '2025-07-24 11:29:12', 'aff_002', 'end_004', '5', '', 'confirmed', 'landing_page'),
(12, '2025-07-03 11:29:12', '2025-07-24 11:29:12', 'aff_002', 'end_005', '5', '', 'confirmed', 'landing_page'),
(13, '2025-07-10 11:29:12', '2025-07-24 11:29:12', 'aff_002', 'end_006', '6', '', 'confirmed', 'landing_page'),
(14, '2025-07-17 11:29:14', '2025-07-24 11:29:14', 'aff_003', 'end_007', '8', 'munib', 'confirmed', 'landing_page'),
(15, '2025-07-21 11:29:14', '2025-07-24 11:29:14', 'aff_003', 'end_008', '8', 'munib', 'confirmed', 'landing_page'),
(16, '2025-07-17 11:29:41', '2025-07-24 11:29:41', 'aff_004', 'end_009', '4', '', 'confirmed', 'landing_page'),
(17, '2025-07-20 11:29:41', '2025-07-24 11:29:41', 'aff_004', 'end_010', '5', '', 'confirmed', 'landing_page'),
(18, '2025-07-22 11:29:41', '2025-07-24 11:29:41', 'aff_005', 'end_011', '6', '', 'confirmed', 'landing_page'),
(19, '2025-07-23 11:29:41', '2025-07-24 11:29:41', 'aff_005', 'end_012', '8', 'munib', 'confirmed', 'landing_page'),
(20, '2025-08-01 22:37:01', '2025-08-01 22:37:01', '44187263', '44377090', '12', 'shoot', 'active', 'landing_page'),
(21, '2025-08-01 22:52:07', '2025-08-01 22:52:07', '44187263', '44443117', '12', 'shoot', 'active', 'landing_page'),
(22, '2025-08-01 22:57:38', '2025-08-01 22:57:38', '44187263', '44915301', '12', 'shoot', 'active', 'landing_page'),
(23, '2025-08-04 16:14:41', '2025-08-04 16:14:41', '44187263', '44915301', '12', 'shoot', 'active', 'landing_page'),
(24, '2025-08-04 16:41:15', '2025-08-04 16:41:15', '44377090', '44443117', '7', 'epicaffiliate', 'active', 'landing_page'),
(25, '2025-08-04 17:39:13', '2025-08-04 17:39:13', '44377090', '44443117', '7', 'epicaffiliate', 'active', 'landing_page'),
(26, '2025-08-04 20:50:21', '2025-08-04 20:50:21', '44187263', '44915301', '12', 'shoot', 'active', 'landing_page'),
(27, '2025-08-06 00:26:04', '2025-08-06 00:26:04', '44187263', '44443117', '12', 'shoot', 'active', 'landing_page'),
(28, '2025-08-06 00:32:38', '2025-08-06 00:32:38', '44187263', '44915301', '12', 'shoot', 'active', 'landing_page'),
(29, '2025-08-11 22:36:03', '2025-08-11 22:36:03', 'zpv1hwu56h14u88', 'tp9tzi7ya1wjjyx', '30', 'testing1', 'converted', 'domain_purchase'),
(30, '2025-08-12 02:33:36', '2025-08-12 02:33:36', 'tp9tzi7ya1wjjyx', 'tp9tzi7ya1wjjyx', '27', 'munib69affiliate', 'active', 'domain_purchase'),
(31, '2025-08-12 02:35:12', '2025-08-12 02:35:12', 'tp9tzi7ya1wjjyx', 'tp9tzi7ya1wjjyx', '27', 'munib69affiliate', 'active', 'domain_purchase'),
(32, '2025-08-12 02:45:01', '2025-08-12 02:45:01', 'tp9tzi7ya1wjjyx', 'tp9tzi7ya1wjjyx', '27', 'munib69affiliate', 'active', 'domain_purchase'),
(33, '2025-08-12 04:04:58', '2025-08-12 04:04:58', 'zpv1hwu56h14u88', 'zpv1hwu56h14u88', '30', 'testing1', 'active', 'domain_purchase'),
(34, '2025-08-12 04:32:02', '2025-08-12 04:32:02', 'rg1ptrh9mdfgsrz', 'rg1ptrh9mdfgsrz', '40', 'munibrealtry1', 'active', 'domain_purchase'),
(35, '2025-08-12 04:32:42', '2025-08-12 04:32:42', 'rg1ptrh9mdfgsrz', 'rg1ptrh9mdfgsrz', '40', 'munibrealtry1', 'active', 'domain_purchase'),
(36, '2025-08-12 05:11:50', '2025-08-12 05:11:50', '685xf719omsrqm8', '685xf719omsrqm8', '42', 'munibahmed200', 'active', 'domain_purchase'),
(37, '2025-08-12 23:58:39', '2025-08-12 23:58:39', '44377090', '44377090', '6', 'epicaffiliate', 'active', 'domain_purchase'),
(38, '2025-08-29 03:50:54', '2025-08-29 03:50:54', 'aff_001', '8m691wqlghkf3nc', '2', 'pricing', 'converted', 'sarah25'),
(39, '2025-08-29 10:33:56', '2025-08-29 10:33:56', 'aff_001', '1fykk71x0x07yod', '2', 'pricing', 'converted', 'sarah25'),
(40, '2025-08-29 10:35:29', '2025-08-29 10:35:29', 'aff_001', 'db4k9owwms65bna', '2', 'pricing', 'converted', 'sarah25');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `sid` varchar(255) NOT NULL,
  `sess` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`sess`)),
  `expire` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`sid`, `sess`, `expire`, `data`) VALUES
('_pAjbqKjWHqRyTKqvGCWeQzZ18NRmU2Q', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-27T13:24:35.846Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"44187263\"}}', '0000-00-00 00:00:00', NULL),
('-7qxYf-9_4OCILfG3MdqaqQVgxg2Heqz', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-27T17:21:32.478Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shooti\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shooti\",\"businessName\":\"shoot zone\"}}', '0000-00-00 00:00:00', NULL),
('-f77I7Na-ND-aES90x6BhrnaqXWECgc5', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-19T12:53:15.446Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"43537113\"},\"affiliateDomainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\"},\"whiteLabelId\":32,\"whiteLabelDomain\":\"four12344\",\"domainContext\":{\"whiteLabelId\":32,\"domainPath\":\"four12344\",\"userLogo\":null}}', '0000-00-00 00:00:00', NULL),
('-uHwKHRw9B_zDPgrxlSQqkbZXuT46FYW', '{\"cookie\":{\"originalMaxAge\":604799999,\"expires\":\"2025-10-01T14:49:07.865Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"43537113\"},\"userId\":\"44187263\",\"originalAdminId\":\"43537113\",\"originalAdminRole\":\"super_admin\",\"isImpersonating\":true,\"impersonatedUserId\":\"44187263\",\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"userLogo\":\"/uploads/brand-logos/brand_logo_1758725343257-773439350.png\"}}', '0000-00-00 00:00:00', NULL),
('063ifivv4g3F6NcwVCLz8t27ohwQvdPy', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-27T13:50:13.049Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"white_label_client_demo\"}}', '0000-00-00 00:00:00', NULL),
('0BJII6UeEvcr11cObMr6DeTDTi2c50nf', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-19T14:53:16.189Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"first1414\"}}', '0000-00-00 00:00:00', NULL),
('0e4C7O3O-HGJfFs0mZgiyAHR_pKaAVvq', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-29T17:31:33.542Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"businessName\":\"shoot zone\"}}', '0000-00-00 00:00:00', NULL),
('0ucHot_rk0CO5EJSV-HMMflikf2mZbJX', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-18T17:15:48.729Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"hua1objl8w40fw7\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"userLogo\":\"/uploads/brand-logos/brand_logo_1758725343257-773439350.png\"},\"affiliateDomainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\"}}', '0000-00-00 00:00:00', NULL),
('1dfMcYbeT9v75xiNL7No9dyxjHUokiUO', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-29T14:53:00.642Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shooti\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shooti\",\"businessName\":\"shoot zone\"}}', '0000-00-00 00:00:00', NULL),
('2uVLcOhiJmnIaJwl2Da2O12tcNwljNio', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-24T02:15:58.012Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"u18o8hwgfhbcz36\"}}', '0000-00-00 00:00:00', NULL),
('2vqbmBLjXidMX5Ow-wrne0svK0L9PHb5', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-29T15:08:35.913Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shooti\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shooti\",\"businessName\":\"shoot zone\"}}', '0000-00-00 00:00:00', NULL),
('324clDTeKDXdl6eLvoha7NKkWKqddgEo', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-26T13:52:36.123Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"00fb5fb2-932f-45da-9fa1-60403f078f32\"}}', '0000-00-00 00:00:00', NULL),
('4-r_tHGsRtZYJPZUbPiGG3H27yqucSef', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-24T00:38:26.069Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"userLogo\":\"/uploads/brand-logos/brand_logo_1758725343257-773439350.png\"}}', '0000-00-00 00:00:00', NULL),
('41TImSK1IeqS7S2-jQDZMSBte31dzWVD', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-27T13:53:04.447Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"white_label_client_demo\"}}', '0000-00-00 00:00:00', NULL),
('4aJNNudR80FKzy4JD_K6IM1T1zxB8p6f', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-24T01:55:27.859Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"u18o8hwgfhbcz36\"}}', '0000-00-00 00:00:00', NULL),
('4CSyZ9ooNfPZjFOOmz9odirNJwizT5Vw', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-26T09:29:18.209Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"62b7hiatqx20iaj\"},\"returnUrl\":\"http://localhost:3000/pricing\"}', '0000-00-00 00:00:00', NULL),
('4J-2jizfswbKq95QfqCN_c5Ea4xILbj5', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-27T17:27:58.992Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shooti\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shooti\",\"businessName\":\"shoot zone\"}}', '0000-00-00 00:00:00', NULL),
('4pe81VT6QfYDwy7aOFkOiXPYwmX4MH3j', '{\"cookie\":{\"path\":\"/\",\"secure\":false,\"expires\":\"2025-09-22T16:03:44.172Z\",\"httpOnly\":true,\"originalMaxAge\":604800000},\"passport\":{\"user\":\"44187263\"}}', '2025-09-23 12:49:36', NULL),
('595VUh1cYxD6hwWGjDdgweut2cL7BluL', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-24T00:38:12.853Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"userLogo\":\"/uploads/brand-logos/brand_logo_1758725343257-773439350.png\"}}', '0000-00-00 00:00:00', NULL),
('5DLxgKAwxiO4xMgSTSRlWwQK8JyxmFBv', '{\"cookie\":{\"path\":\"/\",\"secure\":false,\"expires\":\"2025-09-20T17:18:38.969Z\",\"httpOnly\":true,\"originalMaxAge\":604800000},\"passport\":{\"user\":\"43537113\"}}', '2025-09-20 12:03:12', NULL),
('5unr60GoGXTpaQBuTGySh65iUtXK1XC4', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-17T20:57:14.353Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"35m0crql3jbwdg5\"},\"whiteLabelId\":32,\"whiteLabelDomain\":\"four12344\",\"domainContext\":{\"whiteLabelId\":32,\"domainPath\":\"four12344\",\"userLogo\":null}}', '0000-00-00 00:00:00', NULL),
('6i-yMkEW5N6d99VkqcKmDI_-XcZwDKO4', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-01T01:13:58.054Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"43537113\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"userLogo\":\"/uploads/brand-logos/brand_logo_1758669709689-107649725.png\"}}', '0000-00-00 00:00:00', NULL),
('7EY_y-2u4lsd-2ByP5UkICFqfQT7tsKE', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-25T15:00:50.445Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"43537113\"},\"userId\":\"43537113\"}', '0000-00-00 00:00:00', NULL),
('7S8L3oHBt4exNqEJ3_Imyzzvp-Y6tLdy', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-27T14:24:53.917Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"white_label_client_demo\"}}', '0000-00-00 00:00:00', NULL),
('8UsxTs2EwQM7reDOJZ9V_y76cyHyCPzT', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-20T13:22:24.498Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"userLogo\":\"/uploads/brand-logos/brand_logo_1758725343257-773439350.png\"}}', '0000-00-00 00:00:00', NULL),
('8xXaa5YYteVkyXtH1UMqoBgXX4_2sM-9', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-16T17:14:07.408Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"userLogo\":\"/uploads/brand-logos/brand_logo_1758725343257-773439350.png\"}}', '0000-00-00 00:00:00', NULL),
('9ovJ5VVYz1umfZUCj3vdz4jzGgIdMFTy', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-24T01:53:15.408Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"u18o8hwgfhbcz36\"}}', '0000-00-00 00:00:00', NULL),
('9pFT3ftxp8fNT2QYFRJp_wfdVhml_Yo8', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-27T17:22:05.712Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shooti\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shooti\",\"businessName\":\"shoot zone\"}}', '0000-00-00 00:00:00', NULL),
('9r65lAriLD6XlyivEUsa_yAvHOBTWFhN', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-19T14:13:10.313Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"first1414\"}}', '0000-00-00 00:00:00', NULL),
('9sLJMmDJLDuU43B23-RDDRtBY9sxsqh4', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-24T02:35:28.087Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"u18o8hwgfhbcz36\"}}', '0000-00-00 00:00:00', NULL),
('A-aSkrLPZkGhYIpYka2Yg3Noep7HKJ88', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-27T17:31:27.540Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shooti\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shooti\",\"businessName\":\"shoot zone\"}}', '0000-00-00 00:00:00', NULL),
('a-qzZZ7gLK-z4M5QuQZA6b7xoc1UHtKX', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-17T19:59:29.004Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":32,\"whiteLabelDomain\":\"four12344\",\"domainContext\":{\"whiteLabelId\":32,\"domainPath\":\"four12344\",\"userLogo\":null}}', '0000-00-00 00:00:00', NULL),
('AfFzUjfuw8DwC3tg1r7_8fYTIheOgZUb', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-27T17:02:35.130Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"white_label_client_demo\"}}', '0000-00-00 00:00:00', NULL),
('AICCj_bE1Nn6glCAU8xVupU0o2GHt8Rm', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-24T00:41:46.456Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"userLogo\":\"/uploads/brand-logos/brand_logo_1758725343257-773439350.png\"}}', '0000-00-00 00:00:00', NULL),
('auC23ZUeulJDVo3JCQZV772z2dTrHMaL', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-19T14:40:22.299Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"first1414\"}}', '0000-00-00 00:00:00', NULL),
('avPRrKPrGe5n2MD-8eenNvJgeWysPOdp', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-29T22:42:59.201Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"businessName\":\"shootBS\"}}', '0000-00-00 00:00:00', NULL),
('aYIgzW8dMYZon8kE8yHyFaFnLlxdtR2H', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-17T23:11:12.529Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"hua1objl8w40fw7\"}}', '0000-00-00 00:00:00', NULL),
('BIT30ckZm8QrqLANb0FtJ5EgsCmp7Aiq', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-27T17:03:12.626Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"white_label_client_demo\"}}', '0000-00-00 00:00:00', NULL),
('bkXGUFTZ9kTV5t5tg1IZGBjZFraQCYOL', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-29T21:12:21.080Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"businessName\":\"shoot zone\"}}', '0000-00-00 00:00:00', NULL),
('bP6Qv0_wWcowr0GabD8yo3IYRZb-Ta0x', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-27T17:29:26.380Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shooti\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shooti\",\"businessName\":\"shoot zone\"}}', '0000-00-00 00:00:00', NULL),
('bPHDbeZtE-EQKEXXrJOhdybkIzXVrRq1', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-19T14:15:23.045Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"first1414\"}}', '0000-00-00 00:00:00', NULL),
('c1_G2Ek3nQaUYudn0SdahzNNVj5Faofi', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-17T23:20:49.454Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"hua1objl8w40fw7\"}}', '0000-00-00 00:00:00', NULL),
('cbDCgOQEsksNi7_YHeHXoksK5Q8gfkwj', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-24T02:02:58.246Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"u18o8hwgfhbcz36\"},\"affiliateDomainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\"}}', '0000-00-00 00:00:00', NULL),
('cgMibgjSBPDHts9wKP2VrLMVSXKkS4UV', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-16T18:20:57.316Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"userLogo\":\"/uploads/brand-logos/brand_logo_1758725343257-773439350.png\"}}', '0000-00-00 00:00:00', NULL),
('chGWD2aEOxbXc6ioZAdnGh-JzfKrJG2i', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-17T21:58:11.516Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":32,\"whiteLabelDomain\":\"four12344\",\"domainContext\":{\"whiteLabelId\":32,\"domainPath\":\"four12344\",\"userLogo\":null}}', '0000-00-00 00:00:00', NULL),
('cICq0CUlaMiTn__xYds7z_tjYwFJGEUd', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-25T17:32:16.382Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"44915301\"}}', '0000-00-00 00:00:00', NULL),
('cK85w6CjBN3Fp1PvHS81__dap1vzLaPo', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-18T14:42:58.536Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"26tje8w7lymxwlj\"}}', '0000-00-00 00:00:00', NULL),
('CLIsMdORLI82WKsSruHXmwdhC0n0lO_d', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-24T01:52:18.023Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"u18o8hwgfhbcz36\"}}', '0000-00-00 00:00:00', NULL),
('Cn6sw3oLn6OqduqK4i0LPOLFmdvoIwbF', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-26T13:57:21.327Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"00fb5fb2-932f-45da-9fa1-60403f078f32\"}}', '0000-00-00 00:00:00', NULL),
('Cx-gbq_etVI9yNfCH4bX_poSLf0kHpUW', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-29T15:07:21.631Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shooti\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shooti\",\"businessName\":\"shoot zone\"}}', '0000-00-00 00:00:00', NULL),
('dDCkrZy6KjzVx_oWvl25Qv3NorpWj_wN', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-17T22:04:45.822Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":32,\"whiteLabelDomain\":\"four12344\",\"domainContext\":{\"whiteLabelId\":32,\"domainPath\":\"four12344\",\"userLogo\":null}}', '0000-00-00 00:00:00', NULL),
('DkDYQ_BxfI_r0NM-rQvkqvuijZGtP_9I', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-24T01:53:53.787Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"u18o8hwgfhbcz36\"}}', '0000-00-00 00:00:00', NULL),
('Dnpg09_Rbk69jCKcS4Wvq8GJI_EHFvTs', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-24T01:27:02.085Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"u18o8hwgfhbcz36\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"userLogo\":\"/uploads/brand-logos/brand_logo_1758725343257-773439350.png\"}}', '0000-00-00 00:00:00', NULL),
('dT7TuZdIMPPXFa6W5u2Z7eUszYzF1TF3', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-27T13:54:08.608Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"white_label_client_demo\"}}', '0000-00-00 00:00:00', NULL),
('Dxyf7i4TK2-CfqMrD4-TFLiaoIlxNUl2', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-16T18:15:32.166Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"userLogo\":\"/uploads/brand-logos/brand_logo_1758725343257-773439350.png\"}}', '0000-00-00 00:00:00', NULL),
('Dydyp5LTCzOU6Zk86_qO6YudQPteObm0', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-29T15:09:23.451Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shooti\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shooti\",\"businessName\":\"shoot zone\"}}', '0000-00-00 00:00:00', NULL),
('edshb6A5TyLebabcG-2y_aRQXtB5gnk2', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-29T22:49:18.139Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"businessName\":\"shootBS\"}}', '0000-00-00 00:00:00', NULL),
('EIdclL0pzZKVSN5d_UoUzD7dyeAC9l_0', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-24T22:53:30.821Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"e2m3st59vmryro0\"}}', '0000-00-00 00:00:00', NULL),
('EjCCO4yF1qtnD8Lwna1muoG6LgZd9c8_', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-24T01:42:53.433Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"u18o8hwgfhbcz36\"}}', '0000-00-00 00:00:00', NULL),
('EO6CKyzj1hy_VCyKvO1As_qunHVOPseV', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-17T21:57:34.334Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":32,\"whiteLabelDomain\":\"four12344\",\"domainContext\":{\"whiteLabelId\":32,\"domainPath\":\"four12344\",\"userLogo\":null}}', '0000-00-00 00:00:00', NULL),
('EP21lVy_6EJi1pJPpoGWbbBUCU9nWEwg', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-25T19:23:29.506Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"44187263\"}}', '0000-00-00 00:00:00', NULL),
('F4AvPKyLrKxZhDT8GkORpB2xj4o-at9M', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-17T23:04:55.405Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"hua1objl8w40fw7\"}}', '0000-00-00 00:00:00', NULL),
('f4j8zfaebpWswEgmSB8L06mEwEh5WLXu', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-19T12:47:02.252Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"white_label_affiliate_demo\"}}', '0000-00-00 00:00:00', NULL),
('fKD9KD7NVgAlgfZWAJP03HSgApEuKqyf', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-29T15:09:34.423Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shooti\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shooti\",\"businessName\":\"shoot zone\"}}', '0000-00-00 00:00:00', NULL),
('fLSLepYmJbzlwKGTti9bisZG29aief89', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-19T12:42:41.658Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"end_user_demo\"}}', '0000-00-00 00:00:00', NULL),
('fPKFbg9w67e4Y9SbFe0WRd0MfhDxv3XW', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-20T09:31:33.385Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"first1414\"}}', '0000-00-00 00:00:00', NULL),
('fRkAAKZqP_vfM9S-H3e87VAUfLy-uF0c', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-29T15:33:02.421Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"businessName\":\"shoot zone\"}}', '0000-00-00 00:00:00', NULL),
('FT4gXsHwv-S6aEdjq0Fc8frkZdW5Fv1t', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-24T01:50:31.361Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"u18o8hwgfhbcz36\"}}', '0000-00-00 00:00:00', NULL),
('Fv_B5ldYoldM_qx5tp0bigXMWRN7AXSx', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-24T20:38:53.006Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"43537113\"}}', '0000-00-00 00:00:00', NULL),
('fYWbrdpell-n6W2E0PbiaqHzNI_-wa0w', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-24T10:37:04.301Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"u18o8hwgfhbcz36\"},\"pendingRole\":\"affiliate\",\"pendingWhiteLabelId\":\"7\"}', '0000-00-00 00:00:00', NULL),
('G0-R3hBzPyC_VPYJb6lAVuIrTRdm32go', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-24T00:49:55.509Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"userLogo\":\"/uploads/brand-logos/brand_logo_1758725343257-773439350.png\"}}', '0000-00-00 00:00:00', NULL),
('G1oma0lkekQ30X3pmB9neqGTEZQPdJ9i', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-26T13:55:14.781Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"00fb5fb2-932f-45da-9fa1-60403f078f32\"}}', '0000-00-00 00:00:00', NULL),
('g7Ex7a5vLHx-vDkq3aV9GSGscBa7pY8n', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-24T01:25:00.422Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"u18o8hwgfhbcz36\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"userLogo\":\"/uploads/brand-logos/brand_logo_1758725343257-773439350.png\"}}', '0000-00-00 00:00:00', NULL),
('GcbCTwDXyZezFwCO5WfNn4he5a5Mkhz5', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-29T22:48:52.544Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"businessName\":\"shootBS\"}}', '0000-00-00 00:00:00', NULL),
('gCU7HjqwpZapkbNzhE6Zmes5s2APLbO6', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-27T13:58:44.861Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"white_label_client_demo\"}}', '0000-00-00 00:00:00', NULL),
('ggRF-1wxnf0sdE2pkzftVI93smG2ewon', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-19T14:28:27.445Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"first1414\"}}', '0000-00-00 00:00:00', NULL),
('HAwptkyK4aRnJFIxPqxfGn4ubhqDPYXA', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-20T09:05:27.389Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"first1414\"}}', '0000-00-00 00:00:00', NULL),
('hck59Qbtap_9ISpfjo1JJgL8nbhGmueg', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-25T07:23:32.288Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"44187263\"}}', '0000-00-00 00:00:00', NULL),
('heltqOkzNNa_S8BvWRr4IDDy3-OmGzsD', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-17T23:32:01.076Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"hua1objl8w40fw7\"}}', '0000-00-00 00:00:00', NULL),
('Hh67PkvEVO-VEvha9iH0qx81hx2ISw64', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-26T13:42:17.678Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"white_label_client_demo\"}}', '0000-00-00 00:00:00', NULL),
('I6gwUU5grSsj-kAFlxvrcq7nddBLTXuP', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-26T09:44:39.979Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"white_label_client_demo\"}}', '0000-00-00 00:00:00', NULL),
('IxESpjox400Mmnib0mkHazNwV69JBZLP', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-26T12:43:01.593Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"white_label_client_demo\"}}', '0000-00-00 00:00:00', NULL),
('J_17FWWMrs6YDiQLocEMQRgpz4NxAlzE', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-16T17:25:52.416Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"userLogo\":\"/uploads/brand-logos/brand_logo_1758725343257-773439350.png\"}}', '0000-00-00 00:00:00', NULL),
('J_ZxJB3ZFzImt0SMpganMpJ1SlFqnyfi', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-16T17:06:14.513Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"userLogo\":\"/uploads/brand-logos/brand_logo_1758725343257-773439350.png\"}}', '0000-00-00 00:00:00', NULL),
('JAGiaLzh3wGvU-0ru9hr9F9S6bX4Sq9V', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-16T17:18:48.527Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"userLogo\":\"/uploads/brand-logos/brand_logo_1758725343257-773439350.png\"}}', '0000-00-00 00:00:00', NULL),
('JcZ87MNrTP64ARMn-AjBMGQTUDL7Qa48', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-24T22:53:44.074Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"43537113\"}}', '0000-00-00 00:00:00', NULL),
('Jntf7dHizWUUykw82rUouJuYTOd2u0ww', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-17T23:20:16.410Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"hua1objl8w40fw7\"}}', '0000-00-00 00:00:00', NULL),
('jqZBoXmWJBboU_XkXZkRH7NGZu4je5SQ', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-16T15:28:49.178Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"44187263\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"userLogo\":\"/uploads/brand-logos/brand_logo_1758725343257-773439350.png\"}}', '0000-00-00 00:00:00', NULL),
('Jyj3xFSzyQGpf578YDLC2lfah9FZSd5u', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-24T20:38:08.236Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"u18o8hwgfhbcz36\"}}', '0000-00-00 00:00:00', NULL),
('K3sAlDi5VqhuxGgdmsqruZ96a9lUMHrQ', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-27T17:14:04.813Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"44187263\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shooti\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shooti\",\"businessName\":\"shoot zone\"}}', '0000-00-00 00:00:00', NULL),
('KapsRQbO8SEm9_1-jxZsoQ_NONMdkH3E', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-19T14:33:04.014Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"first1414\"}}', '0000-00-00 00:00:00', NULL),
('kc6eaxgTNl5hg4LRsDLhyqUVcuydTL_N', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-27T14:03:22.427Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"white_label_client_demo\"}}', '0000-00-00 00:00:00', NULL),
('KfHXOLWZLW467X59xkxSFC2MF5nW8ZOp', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-29T15:09:01.579Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shooti\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shooti\",\"businessName\":\"shoot zone\"}}', '0000-00-00 00:00:00', NULL),
('koe2vUU3ATZirPViEWWiZ4C2RdMMShC5', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-29T22:42:20.647Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"businessName\":\"shootBS\"}}', '0000-00-00 00:00:00', NULL),
('Kq2l9LVEUbPV1jlnLd_9V3FlsNOA32mf', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-17T23:21:44.791Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"hua1objl8w40fw7\"}}', '0000-00-00 00:00:00', NULL),
('KqKGaem6AEZ9A96sfnO9gPqEpj6KMqMk', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-20T09:14:11.004Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"first1414\"}}', '0000-00-00 00:00:00', NULL),
('kQX5h29Lnj7VzvLgHRagi9BRU75K0yiZ', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-20T12:54:14.135Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"first1414\"}}', '0000-00-00 00:00:00', NULL),
('kRHxn4GPBf9s0lEYds-PXIPhdTRgrCRY', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-29T22:45:04.829Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"businessName\":\"shootBS\"}}', '0000-00-00 00:00:00', NULL),
('kXdJwwcoh4WB7s4bQfQJQ-Z9_Y7Q4MhC', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-29T16:39:52.856Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"businessName\":\"shoot zone\"}}', '0000-00-00 00:00:00', NULL),
('KXoP0QgeLfFE6hFR2R-P45qPKLdqWnIy', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-17T19:25:26.879Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":32,\"whiteLabelDomain\":\"four12344\",\"domainContext\":{\"whiteLabelId\":32,\"domainPath\":\"four12344\",\"userLogo\":null}}', '0000-00-00 00:00:00', NULL),
('lIddCXaqlatus7bsu9p7aHK2NT5oA2ju', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-20T12:51:05.146Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"first1414\"}}', '0000-00-00 00:00:00', NULL),
('lKm-XOz8Wl-Pa84MbraPooi1agLWcSLf', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-16T17:13:29.795Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"userLogo\":\"/uploads/brand-logos/brand_logo_1758725343257-773439350.png\"}}', '0000-00-00 00:00:00', NULL),
('lojviFK4pT_hwO5mrKIW9rHrMJjV5Zf5', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-24T01:26:54.999Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"44187263\"}}', '0000-00-00 00:00:00', NULL),
('lP6tML-M1ZPDE1wK8lYU3ijV4XzeUJDs', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-26T12:42:31.237Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"white_label_client_demo\"}}', '0000-00-00 00:00:00', NULL),
('lp8cX4Os_uIq2xln4QVoW-Kd4xkxRFbk', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-20T09:19:05.295Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"first1414\"}}', '0000-00-00 00:00:00', NULL),
('M_oQ9SmvmOsbzbG9RkO4Fgt6AQX_bK-V', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-21T08:40:06.422Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"hua1objl8w40fw7\"},\"affiliateDomainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\"}}', '0000-00-00 00:00:00', NULL),
('M0yUEKQ2kvLqp7ssp_7JUGTaN-ddQDrL', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-24T19:10:34.740Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"u18o8hwgfhbcz36\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"userLogo\":\"/uploads/brand-logos/brand_logo_1758725343257-773439350.png\"},\"affiliateDomainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\"}}', '0000-00-00 00:00:00', NULL),
('MFzE_P07CP-m6TL2I_IAFnJqE0hGGlCU', '{\"cookie\":{\"path\":\"/\",\"secure\":true,\"expires\":\"2025-09-21T16:01:31.477Z\",\"httpOnly\":true,\"originalMaxAge\":604800000},\"passport\":{\"user\":\"6e5cb5fb-6b38-41fb-88e5-fcf235f39fc5\"}}', '2025-09-21 06:10:20', NULL),
('mjLQLxJm7-EKiLKbfrBrHBtA-CK6Kqlf', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-18T08:21:12.035Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"26tje8w7lymxwlj\"}}', '0000-00-00 00:00:00', NULL),
('mv3XtWIDnCu8Rds_Xhg4yB3mH9hFPyl5', '{\"cookie\":{\"originalMaxAge\":604799999,\"expires\":\"2025-09-29T15:08:46.198Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shooti\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shooti\",\"businessName\":\"shoot zone\"}}', '0000-00-00 00:00:00', NULL),
('MYAnI8kRsyRzRGe2xbhTTdyadVOyQhrM', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-27T16:51:33.250Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"white_label_client_demo\"}}', '0000-00-00 00:00:00', NULL),
('mzG1PG1GQx9k0aqopxYSatv_TgN0QFVf', '{\"cookie\":{\"path\":\"/\",\"secure\":false,\"expires\":\"2025-09-20T18:18:11.672Z\",\"httpOnly\":true,\"originalMaxAge\":604800000},\"passport\":{\"user\":\"44187263\"},\"returnUrl\":\"https://8088caf7-121d-4269-b4df-731ed5f89058-00-1mroz026k4m0c.kirk.replit.dev/pricing\"}', '2025-09-20 08:22:09', NULL),
('nNr4ilrrFKrRTnn6hkvfB36yWzcz1UTl', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-27T11:41:03.371Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"44187263\"},\"returnUrl\":\"http://localhost:3000/pricing\"}', '0000-00-00 00:00:00', NULL),
('noskMGeSeHiJdog8NZwGwcTQsH67aPeO', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-26T20:39:04.241Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"44187263\"}}', '0000-00-00 00:00:00', NULL),
('NwMzpypsZ3fDXGJg7h84r_XFyF53RerJ', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-29T15:09:09.021Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shooti\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shooti\",\"businessName\":\"shoot zone\"}}', '0000-00-00 00:00:00', NULL),
('NzQAroc0wFjm1unD92ij56cIcCII0Tpp', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-19T14:14:29.474Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"first1414\"}}', '0000-00-00 00:00:00', NULL),
('OfeYcqwGlNWnp7ZOSKrV8IOjJO-DlUMa', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-17T23:25:12.622Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"hua1objl8w40fw7\"}}', '0000-00-00 00:00:00', NULL),
('okjWvs-asho8TfjOuE63XMp_0_EIHbi0', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-27T13:59:53.552Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"white_label_client_demo\"}}', '0000-00-00 00:00:00', NULL),
('omofoqEIRbADbgbQwGy_TFVGPtQVh8fr', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-24T02:32:07.914Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"u18o8hwgfhbcz36\"}}', '0000-00-00 00:00:00', NULL),
('orihR0wCFII1PJgAYRhTca-kwFycwfm_', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-24T02:26:57.599Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"u18o8hwgfhbcz36\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"userLogo\":\"/uploads/brand-logos/brand_logo_1758725343257-773439350.png\"}}', '0000-00-00 00:00:00', NULL),
('Os_cfB2cM5xF3ZWnUWVt8iyeNQz9yPof', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-17T23:03:31.333Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"hua1objl8w40fw7\"}}', '0000-00-00 00:00:00', NULL),
('ouPVj0O-aJSeFwZiYqXc183mWNCbNeGX', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-24T19:24:19.004Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"43537113\"}}', '0000-00-00 00:00:00', NULL),
('P1DUbKBZW2EGt4A0HvNfZWgFj8Jdwng-', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-17T23:34:47.265Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"hua1objl8w40fw7\"}}', '0000-00-00 00:00:00', NULL),
('P87HXQutMWwV2n9Pb7fLjqrNe1rUjgkK', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-17T21:59:03.421Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":32,\"whiteLabelDomain\":\"four12344\",\"domainContext\":{\"whiteLabelId\":32,\"domainPath\":\"four12344\",\"userLogo\":null}}', '0000-00-00 00:00:00', NULL),
('p9gtAUlII8Z94nyEBFpwtFt4OxFMuR7Z', '{\"cookie\":{\"path\":\"/\",\"secure\":false,\"expires\":\"2025-09-20T18:48:47.130Z\",\"httpOnly\":true,\"originalMaxAge\":604800000},\"passport\":{\"user\":\"c3082ce4-1026-4d8a-a517-e2366d0e9164\"}}', '2025-09-20 08:49:13', NULL),
('PIGA3KlGcvOaWR-8gTno0ugGcSHDVLrP', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-28T21:27:34.860Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"44187263\"},\"returnUrl\":\"http://localhost:3000/pricing\"}', '0000-00-00 00:00:00', NULL),
('Pn8nfvQM5uxopJ-Lgl2YdkTgyuEz6TRH', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-26T13:58:24.784Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"00fb5fb2-932f-45da-9fa1-60403f078f32\"}}', '0000-00-00 00:00:00', NULL),
('pOZFFMp7jNeIbgqT4KnMPz7bZjfx8TTC', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-16T17:22:36.634Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"userLogo\":\"/uploads/brand-logos/brand_logo_1758725343257-773439350.png\"}}', '0000-00-00 00:00:00', NULL),
('pqsei9Wr6YLONjmpYxBXJt3wH4SnhJ8-', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-21T08:52:00.294Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"44187263\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"userLogo\":\"/uploads/brand-logos/brand_logo_1758725343257-773439350.png\"}}', '0000-00-00 00:00:00', NULL),
('Pr9DaHwNrOuuK-qbDjCqpTdipRcelE6o', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-24T02:23:07.306Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"u18o8hwgfhbcz36\"}}', '0000-00-00 00:00:00', NULL),
('PS7ztZPOSe7ufj_PptKWkAJ0O1Hv6J2a', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-27T17:30:36.283Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shooti\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shooti\",\"businessName\":\"shoot zone\"}}', '0000-00-00 00:00:00', NULL),
('PW5RdTJdYZ4igaxr33sUv6lzCSLksFWy', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-24T02:35:08.064Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"26tje8w7lymxwlj\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"userLogo\":\"/uploads/brand-logos/brand_logo_1758725343257-773439350.png\"}}', '0000-00-00 00:00:00', NULL),
('QAsEae7Vy0lOokBtXiDHkUZwqYseUIZj', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-17T23:23:54.701Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"hua1objl8w40fw7\"}}', '0000-00-00 00:00:00', NULL),
('qDhYBAvdcf9BTDd2Cz0L3obEFOrk0eQi', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-20T12:47:41.400Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"first1414\"}}', '0000-00-00 00:00:00', NULL),
('qmvjdrQerzN51SDa6_Xwy29Zdm6-24jh', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-27T17:12:31.169Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"44187263\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shooti\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shooti\",\"businessName\":\"shoot zone\"}}', '0000-00-00 00:00:00', NULL),
('QSPwQ9YgQehMmkfPj2pYvjvl2AciV4Jq', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-16T15:26:40.521Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"hua1objl8w40fw7\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"userLogo\":\"/uploads/brand-logos/brand_logo_1758725343257-773439350.png\"}}', '0000-00-00 00:00:00', NULL),
('qV4W3uScQJciH1Ww-ee9OZ8mYDZ15HkB', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-24T02:01:44.181Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"u18o8hwgfhbcz36\"}}', '0000-00-00 00:00:00', NULL),
('Qw2FoiWx-y1bgb3mOj7QMnE5XimvOt6G', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-16T18:47:18.085Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"hua1objl8w40fw7\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"userLogo\":\"/uploads/brand-logos/brand_logo_1758725343257-773439350.png\"}}', '0000-00-00 00:00:00', NULL),
('r7FlbDI36wpDsi2cq59LTceyQtBRST5k', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-17T23:30:53.096Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"hua1objl8w40fw7\"}}', '0000-00-00 00:00:00', NULL),
('R7UdJ8qncIoi3M_iozRhdMgIleYgsPdt', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-17T23:27:52.177Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"hua1objl8w40fw7\"}}', '0000-00-00 00:00:00', NULL),
('RAKuBf5Ao7_fdsEeZcrjqvUjbz9PG4ja', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-27T13:43:35.351Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"white_label_client_demo\"}}', '0000-00-00 00:00:00', NULL),
('rauO0Ku-8f97lRDsMQSfqZDDp9pGAUPL', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-27T16:48:32.021Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"white_label_client_demo\"}}', '0000-00-00 00:00:00', NULL),
('Rj0hC3l725KSE23zHNKklL7-6itF6kCp', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-26T13:56:39.395Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"00fb5fb2-932f-45da-9fa1-60403f078f32\"}}', '0000-00-00 00:00:00', NULL),
('rNuJoRdRyDBlG8u6CTiX7EECKW6ALqoF', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-17T23:06:11.309Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"hua1objl8w40fw7\"}}', '0000-00-00 00:00:00', NULL),
('SCk-nbO-iZOfRuOe09n7H3bpn4cxO6Xc', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-26T12:40:52.917Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"white_label_client_demo\"}}', '0000-00-00 00:00:00', NULL),
('sG_S8mI_RWGIXhdapl-LsGlZcyaCwmr3', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-27T17:16:14.577Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"43537113\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shooti\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shooti\",\"businessName\":\"shoot zone\"}}', '0000-00-00 00:00:00', NULL),
('SIctaBAH7znbTcXiL6KB8nq-8VWAACpi', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-25T07:27:36.780Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"43537113\"}}', '0000-00-00 00:00:00', NULL),
('Smok-YXJhKJNskCoaJjRqOarXsQrgKha', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-20T12:49:45.141Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"first1414\"}}', '0000-00-00 00:00:00', NULL),
('STT2ObSz6h-k7f-wD4DsyK5WxjCBQj1V', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-26T22:26:27.724Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"43537113\"},\"userId\":\"43537113\"}', '0000-00-00 00:00:00', NULL),
('syvla5gXSbLJyXwFoIeyRWmVL7BzYHi_', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-24T02:16:18.636Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"u18o8hwgfhbcz36\"}}', '0000-00-00 00:00:00', NULL),
('t0cRDVcxLycIVZLnZgHBmQxyVGxBuAgh', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-20T13:04:06.358Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"iz2vpsv2u00nlu9\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"userLogo\":\"/uploads/brand-logos/brand_logo_1758725343257-773439350.png\"}}', '0000-00-00 00:00:00', NULL),
('TahYDWPeAnPC7badicoBsmcwMkCa7Z7V', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-29T15:15:06.240Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shooti\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shooti\",\"businessName\":\"shoot zone\"}}', '0000-00-00 00:00:00', NULL),
('th7zkdkn6PonloKTyoLIiabdIdSRB9nf', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-26T07:54:22.399Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"62b7hiatqx20iaj\"},\"returnUrl\":\"http://localhost:3000/pricing\"}', '0000-00-00 00:00:00', NULL),
('tj-i-x_UAXfaUaoDkQG0ug9YoEiEYgXA', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-30T20:50:23.793Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"44377090\"},\"returnUrl\":\"http://localhost:3000/pricing\",\"whiteLabelId\":11,\"whiteLabelDomain\":\"epic\",\"domainContext\":{\"whiteLabelId\":11,\"domainPath\":\"epic\",\"userLogo\":\"/uploads/brand-logos/brand_logo_1758660622211-393601978.png\"}}', '0000-00-00 00:00:00', NULL),
('tKXXusBQG4xz2Jhhb6BOoywHV6z3mR8c', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-24T20:11:22.881Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"44187263\"}}', '0000-00-00 00:00:00', NULL),
('tN_IsJlhYRcJMzWuHlvPKzsBIvTNdLXv', '{\"cookie\":{\"path\":\"/\",\"secure\":false,\"expires\":\"2025-09-24T00:04:06.317Z\",\"httpOnly\":true,\"originalMaxAge\":604800000},\"passport\":{\"user\":\"43537113\"}}', '2025-09-23 14:04:55', NULL),
('tTj10b6hXYvDvZROxiKC2YWcNC7A5KfE', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-27T17:20:26.054Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shooti\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shooti\",\"businessName\":\"shoot zone\"}}', '0000-00-00 00:00:00', NULL),
('TVErJio8u8iFL5zISudXQCngRhGySs9S', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-26T13:56:04.370Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"00fb5fb2-932f-45da-9fa1-60403f078f32\"}}', '0000-00-00 00:00:00', NULL),
('umLpTk6niDr28MnBHGPnQEW6zy05sXTx', '{\"cookie\":{\"originalMaxAge\":604799999,\"expires\":\"2025-09-27T16:55:44.940Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"white_label_client_demo\"}}', '0000-00-00 00:00:00', NULL),
('UR6cf86KYthA-S_wTxdvFhYdTjs0uw0D', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-26T13:54:32.895Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"00fb5fb2-932f-45da-9fa1-60403f078f32\"}}', '0000-00-00 00:00:00', NULL),
('USXYGwXwAWySrAfYShMUWNNk7NHgOyTl', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-19T14:46:20.358Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"first1414\"}}', '0000-00-00 00:00:00', NULL),
('ute-RgMTNybanvMc6y1pfCeaUN5r6EX9', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-25T19:23:09.850Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"u18o8hwgfhbcz36\"}}', '0000-00-00 00:00:00', NULL),
('uWYhcvUEl7QrBPZyqDaRcJp5vhN2D6Zg', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-24T22:58:57.938Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"44187263\"},\"returnUrl\":\"http://localhost:3000/pricing?ali1\"}', '0000-00-00 00:00:00', NULL);
INSERT INTO `sessions` (`sid`, `sess`, `expire`, `data`) VALUES
('uZDvo_5-jwxNvr6f-gEQLfCKBH78_SpO', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-29T23:17:13.636Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"businessName\":\"shootBS\"}}', '0000-00-00 00:00:00', NULL),
('VBnzD8wOu4g4jy6oQHj8RlC0lfEvlPt8', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-29T15:08:48.141Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shooti\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shooti\",\"businessName\":\"shoot zone\"}}', '0000-00-00 00:00:00', NULL),
('VCILdvEBIBASxKg27QRMj154FsRSkhLc', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-19T14:56:43.057Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"first1414\"}}', '0000-00-00 00:00:00', NULL),
('vDekv7i7vRP0eyQt0oYVEi7_eriptrnr', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-26T22:27:33.442Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"6kk4onsspvzjoml\"}}', '0000-00-00 00:00:00', NULL),
('vfDhJeU5go6CxRyhaAuCLw5fVU6V9WyM', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-27T14:02:05.296Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"white_label_client_demo\"}}', '0000-00-00 00:00:00', NULL),
('VkpvvAPBL-RI3oFh4ZCWFB-GEE_mDmR0', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-29T17:31:05.136Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"businessName\":\"shoot zone\"}}', '0000-00-00 00:00:00', NULL),
('VQS6W6ktYMpycZNfdOCWdFmYQhVqZoRY', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-20T13:20:43.728Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"userLogo\":\"/uploads/brand-logos/brand_logo_1758725343257-773439350.png\"}}', '0000-00-00 00:00:00', NULL),
('VtY34Xmjxv40Ys36EOYPmFS8tKG5ay9O', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-19T14:11:36.886Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"first1414\"}}', '0000-00-00 00:00:00', NULL),
('VYBBtPa7tE2tYfITEYGmU4OL8Jwg3HgJ', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-29T15:09:12.972Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shooti\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shooti\",\"businessName\":\"shoot zone\"}}', '0000-00-00 00:00:00', NULL),
('w6YxES57mYnF3vdhhJZIsRlDEOiRe2oF', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-27T14:02:49.134Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"white_label_client_demo\"}}', '0000-00-00 00:00:00', NULL),
('wOSCseGl-pQO729qXrrvL_ybXBaCYHth', '{\"cookie\":{\"originalMaxAge\":604799999,\"expires\":\"2025-10-24T01:09:03.702Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"hua1objl8w40fw7\"},\"affiliateDomainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"userLogo\":\"/uploads/brand-logos/brand_logo_1758725343257-773439350.png\"}}', '0000-00-00 00:00:00', NULL),
('XBKRhR00fl39gtIGHyvF1QPuMz0YyeTw', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-16T17:22:31.741Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"userLogo\":\"/uploads/brand-logos/brand_logo_1758725343257-773439350.png\"}}', '0000-00-00 00:00:00', NULL),
('XGMMwuE_b2TsOPF5dS7sAcbP1k5XqRt6', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-17T23:26:22.222Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"hua1objl8w40fw7\"}}', '0000-00-00 00:00:00', NULL),
('xJaG4IMB07-2IhGa3wUR5Xnu9CqEIuH_', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-24T00:34:30.741Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"userLogo\":\"/uploads/brand-logos/brand_logo_1758725343257-773439350.png\"}}', '0000-00-00 00:00:00', NULL),
('Xk3kKunhqSyRsJwloSlqWt7l4b80Mt7R', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-17T23:01:57.189Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"hua1objl8w40fw7\"}}', '0000-00-00 00:00:00', NULL),
('XTmluPZAKPHrxKDBDXhbAYd3gkeB6PIe', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-19T12:46:41.391Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"white_label_affiliate_demo\"}}', '0000-00-00 00:00:00', NULL),
('y1D3DXVMI4t1mhF5iPp7Phue7yMOyWCk', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-26T13:05:57.350Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"62b7hiatqx20iaj\"},\"returnUrl\":\"http://localhost:3000/pricing\"}', '0000-00-00 00:00:00', NULL),
('Y2km-K56jBBvTcLlGzyZKhlD0-MAQk1p', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-09-29T22:42:32.073Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"businessName\":\"shootBS\"}}', '0000-00-00 00:00:00', NULL),
('ZJTUrE-4WyVX9qPksOYnbqpD9md2Topb', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-24T00:33:10.871Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"whiteLabelId\":7,\"whiteLabelDomain\":\"shoot\",\"domainContext\":{\"whiteLabelId\":7,\"domainPath\":\"shoot\",\"userLogo\":\"/uploads/brand-logos/brand_logo_1758725343257-773439350.png\"}}', '0000-00-00 00:00:00', NULL),
('ZRhzbGQSh6XOHZSeV-MU0-P-T1lMYAek', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-10-19T14:13:43.796Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"first1414\"}}', '0000-00-00 00:00:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` int(11) NOT NULL,
  `white_label_id` int(11) DEFAULT NULL,
  `plan_id` int(11) NOT NULL,
  `status` varchar(50) NOT NULL,
  `billing_cycle` varchar(50) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `next_billing_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `referral_code` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `current_period_start` timestamp NULL DEFAULT NULL,
  `current_period_end` timestamp NULL DEFAULT NULL,
  `cancel_at_period_end` tinyint(1) DEFAULT 0,
  `stripe_subscription_id` varchar(255) DEFAULT NULL,
  `stripe_customer_id` varchar(255) DEFAULT NULL,
  `selected_categories` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '[]' COMMENT 'User-specific category selections' CHECK (json_valid(`selected_categories`)),
  `selected_products` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '[]' COMMENT 'User-specific product selections' CHECK (json_valid(`selected_products`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subscriptions`
--

INSERT INTO `subscriptions` (`id`, `white_label_id`, `plan_id`, `status`, `billing_cycle`, `amount`, `next_billing_date`, `created_at`, `updated_at`, `referral_code`, `user_id`, `current_period_start`, `current_period_end`, `cancel_at_period_end`, `stripe_subscription_id`, `stripe_customer_id`, `selected_categories`, `selected_products`) VALUES
(3, 7, 127, 'cancelled', 'monthly', 344.00, '2025-10-20', '2025-09-20 11:53:30', '2025-09-21 21:27:49', NULL, '44187263', '2025-09-20 06:53:30', '2025-10-20 06:53:30', 0, 'sub_1758369210613_5cr1j2lb0', 'cus_1758369210613_yw0d5oxvc', '[]', '[]'),
(4, 76, 127, 'active', 'monthly', 344.00, '2025-10-20', '2025-09-20 13:48:33', '2025-09-20 14:11:29', NULL, 'white_label_client_demo', '2025-09-20 14:11:29', '2025-10-20 14:11:29', 0, NULL, NULL, '[]', '[]'),
(5, 7, 129, 'cancelled', 'monthly', 22.00, '2025-10-21', '2025-09-21 21:27:49', '2025-09-21 21:29:03', NULL, '44187263', '2025-09-21 16:27:49', '2025-10-21 16:27:49', 0, 'sub_1758490069950_30la3mhu4', 'cus_1758490069950_0onwscy5d', '[]', '[]'),
(6, 7, 130, 'active', 'monthly', 344.00, '2025-10-21', '2025-09-21 21:29:03', '2025-09-21 21:29:03', NULL, '44187263', '2025-09-21 16:29:03', '2025-10-21 16:29:03', 0, 'sub_1758490143409_47tsze20x', 'cus_1758490143409_382uhynlw', '[]', '[]'),
(7, 11, 131, 'active', 'monthly', 344.00, '2025-10-21', '2025-09-21 21:29:03', '2025-09-23 17:38:07', NULL, '44377090', '2025-09-21 16:29:03', '2025-10-21 16:29:03', 0, 'sub_1758490143409_47tsze20x', 'cus_1758490143409_382uhynlw', '[]', '[]'),
(11, NULL, 132, 'active', 'monthly', 222.00, '2025-11-08', '2025-10-09 18:29:47', '2025-10-09 18:29:47', NULL, 'user_1760034587114_hammadisaqib@gmail.com', '2025-10-09 13:29:47', '2025-11-08 13:29:47', 0, '11235006563', 'nmi_11235006563', '[]', '[]'),
(12, NULL, 136, 'active', 'monthly', 222.00, '2025-11-08', '2025-10-09 18:48:13', '2025-10-14 23:31:42', NULL, 'user_1760035693011_hammadisaqib@gmail.com', '2025-10-09 13:48:13', '2025-11-08 13:48:13', 0, '11235071322', 'nmi_11235071322', '[]', '[]'),
(13, NULL, 132, 'active', 'monthly', 222.00, '2025-11-09', '2025-10-10 11:21:38', '2025-10-10 11:21:38', NULL, 'user_1760095298953_hammadisaqib@gmail.com', '2025-10-10 06:21:38', '2025-11-09 06:21:38', 0, '11237631901', 'nmi_11237631901', '[]', '[]'),
(14, NULL, 132, 'active', 'monthly', 222.00, '2025-11-09', '2025-10-10 11:23:59', '2025-10-10 11:23:59', NULL, 'user_1760095439426_hammadisaqib@gmail.com', '2025-10-10 06:23:59', '2025-11-09 06:23:59', 0, '11237638949', 'nmi_11237638949', '[]', '[]'),
(15, NULL, 132, 'active', 'monthly', 222.00, '2025-11-09', '2025-10-10 11:29:25', '2025-10-10 11:29:25', NULL, 'user_1760095765935_hammadisaqib@gmail.com', '2025-10-10 06:29:25', '2025-11-09 06:29:25', 0, '11237654029', 'nmi_11237654029', '[]', '[]'),
(16, NULL, 132, 'active', 'monthly', 222.00, '2025-11-09', '2025-10-10 11:39:44', '2025-10-10 11:39:44', NULL, 'user_1760096384283_hammadisaqib@gmail.com', '2025-10-10 06:39:44', '2025-11-09 06:39:44', 0, '11237678800', 'nmi_11237678800', '[]', '[]'),
(17, NULL, 132, 'active', 'monthly', 222.00, '2025-11-09', '2025-10-10 11:41:06', '2025-10-10 11:41:06', NULL, 'user_1760096466289_hammadisaqib@gmail.com', '2025-10-10 06:41:06', '2025-11-09 06:41:06', 0, '11237682537', 'nmi_11237682537', '[]', '[]'),
(18, NULL, 128, 'active', 'monthly', 68.98, '2025-11-09', '2025-10-10 12:11:42', '2025-10-10 12:11:42', NULL, 'user_1760098302979_john.doe@example.com', '2025-10-10 07:11:42', '2025-11-09 07:11:42', 0, '11237762921', 'nmi_11237762921', '[]', '[]'),
(19, NULL, 128, 'active', 'monthly', 68.98, '2025-11-09', '2025-10-10 12:17:40', '2025-10-10 12:17:40', NULL, 'user_1760098302979_john.doe@example.com', '2025-10-10 07:17:40', '2025-11-09 07:17:40', 0, '11237782015', 'nmi_11237782015', '[]', '[]'),
(20, NULL, 131, 'active', 'monthly', 344.00, '2025-11-09', '2025-10-10 12:47:16', '2025-10-10 12:47:16', NULL, '44187263', '2025-10-10 07:47:16', '2025-11-09 07:47:16', 0, 'TEST-1760100436458-1501', 'nmi_TEST-1760100436458-1501', '[]', '[]'),
(21, NULL, 132, 'active', 'monthly', 222.00, '2025-11-09', '2025-10-10 13:12:14', '2025-10-10 13:12:14', NULL, 'hua1objl8w40fw7', '2025-10-10 08:12:14', '2025-11-09 08:12:14', 0, '11237960748', 'nmi_11237960748', '[]', '[]'),
(22, NULL, 132, 'active', 'monthly', 222.00, '2025-11-09', '2025-10-10 13:14:52', '2025-10-10 13:14:52', NULL, 'hua1objl8w40fw7', '2025-10-10 08:14:52', '2025-11-09 08:14:52', 0, 'TEST-1760102092211-8353', 'nmi_TEST-1760102092211-8353', '[]', '[]'),
(23, 7, 132, 'active', '', 0.00, NULL, '2025-10-10 13:44:55', '2025-10-10 13:44:55', NULL, 'hua1objl8w40fw7', '2025-10-10 13:44:55', '2025-11-10 13:44:55', 0, NULL, NULL, '[]', '[]'),
(24, NULL, 134, 'active', 'monthly', 1.00, '2025-11-09', '2025-10-10 14:14:48', '2025-10-10 14:14:48', NULL, 'hua1objl8w40fw7', '2025-10-10 09:14:48', '2025-11-09 09:14:48', 0, '11238254138', 'nmi_11238254138', '[]', '[]'),
(25, NULL, 128, 'active', 'monthly', 68.98, '2025-11-09', '2025-10-10 14:20:40', '2025-10-10 14:20:40', NULL, 'hua1objl8w40fw7', '2025-10-10 09:20:40', '2025-11-09 09:20:40', 0, '11238283181', 'nmi_11238283181', '[]', '[]'),
(26, NULL, 132, 'active', '', 0.00, NULL, '2025-10-10 16:24:27', '2025-10-10 16:24:27', NULL, '44443117', NULL, NULL, 0, NULL, NULL, '[]', '[]'),
(28, 7, 128, 'active', '', 0.00, NULL, '2025-10-10 16:45:19', '2025-10-10 16:45:19', NULL, 'first1414', NULL, NULL, 0, NULL, NULL, '[]', '[]'),
(29, 7, 132, 'active', '', 0.00, NULL, '2025-10-10 16:45:19', '2025-10-10 16:45:19', NULL, 'first1414', NULL, NULL, 0, NULL, NULL, '[]', '[]'),
(30, 7, 134, 'active', '', 0.00, NULL, '2025-10-10 16:45:19', '2025-10-10 16:45:19', NULL, 'first1414', NULL, NULL, 0, NULL, NULL, '[]', '[]'),
(31, NULL, 134, 'active', 'monthly', 1313.00, '2025-11-09', '2025-10-10 19:29:21', '2025-10-10 19:29:21', NULL, '44187263', '2025-10-10 14:29:21', '2025-11-09 14:29:21', 0, 'TEST-1760124561179-3159', 'nmi_TEST-1760124561179-3159', '[]', '[]'),
(32, NULL, 134, 'active', 'monthly', 1313.00, '2025-11-09', '2025-10-10 20:08:19', '2025-10-10 20:08:19', NULL, 'hua1objl8w40fw7', '2025-10-10 15:08:19', '2025-11-09 15:08:19', 0, 'TEST-1760126899863-7230', 'nmi_TEST-1760126899863-7230', '[]', '[]'),
(33, NULL, 134, 'active', 'monthly', 1313.00, '2025-11-09', '2025-10-10 20:13:45', '2025-10-10 20:13:45', NULL, '35m0crql3jbwdg5', '2025-10-10 15:13:45', '2025-11-09 15:13:45', 0, 'TEST-1760127225495-9331', 'nmi_TEST-1760127225495-9331', '[]', '[]'),
(34, NULL, 134, 'active', 'monthly', 1313.00, '2025-11-09', '2025-10-10 20:43:01', '2025-10-10 20:43:01', NULL, '35m0crql3jbwdg5', '2025-10-10 15:43:01', '2025-11-09 15:43:01', 0, 'TEST-1760128981762-9989', 'nmi_TEST-1760128981762-9989', '[]', '[]'),
(36, 32, 134, 'active', 'monthly', 1313.00, '2025-11-09', '2025-10-10 20:57:44', '2025-10-10 21:09:31', NULL, '35m0crql3jbwdg5', '2025-10-10 15:57:44', '2025-11-09 15:57:44', 0, 'TEST-1760129864822-412', 'nmi_TEST-1760129864822-412', '[]', '[]'),
(37, NULL, 136, 'active', 'monthly', 11.00, '2025-11-09', '2025-10-10 21:34:43', '2025-10-10 21:34:43', NULL, '35m0crql3jbwdg5', '2025-10-10 16:34:43', '2025-11-09 16:34:43', 0, 'TEST-1760132083681-2110', 'nmi_TEST-1760132083681-2110', '[]', '[]'),
(38, NULL, 136, 'active', 'monthly', 11.00, '2025-11-09', '2025-10-10 21:45:24', '2025-10-10 21:45:24', NULL, '35m0crql3jbwdg5', '2025-10-10 16:45:24', '2025-11-09 16:45:24', 0, 'TEST-1760132724282-1419', 'nmi_TEST-1760132724282-1419', '[]', '[]'),
(39, NULL, 136, 'active', 'monthly', 11.00, '2025-11-09', '2025-10-10 22:08:56', '2025-10-10 22:08:56', NULL, '35m0crql3jbwdg5', '2025-10-10 17:08:56', '2025-11-09 17:08:56', 0, 'TEST-1760134136514-8039', 'nmi_TEST-1760134136514-8039', '[]', '[]'),
(40, NULL, 136, 'active', 'monthly', 11.00, '2025-11-09', '2025-10-10 22:12:02', '2025-10-10 22:12:02', NULL, '35m0crql3jbwdg5', '2025-10-10 17:12:02', '2025-11-09 17:12:02', 0, 'TEST-1760134322336-2059', 'nmi_TEST-1760134322336-2059', '[]', '[]'),
(41, NULL, 136, 'active', 'monthly', 11.00, '2025-11-09', '2025-10-10 22:13:18', '2025-10-10 22:13:18', NULL, 'hua1objl8w40fw7', '2025-10-10 17:13:18', '2025-11-09 17:13:18', 0, 'TEST-1760134398794-7898', 'nmi_TEST-1760134398794-7898', '[]', '[]'),
(42, NULL, 134, 'active', 'monthly', 1313.00, '2025-11-09', '2025-10-10 22:23:33', '2025-10-10 22:23:33', NULL, '35m0crql3jbwdg5', '2025-10-10 17:23:33', '2025-11-09 17:23:33', 0, 'TEST-1760135013976-2995', 'nmi_TEST-1760135013976-2995', '[]', '[]'),
(43, NULL, 136, 'active', 'monthly', 11.00, '2025-11-09', '2025-10-10 22:24:06', '2025-10-10 22:24:06', NULL, '35m0crql3jbwdg5', '2025-10-10 17:24:06', '2025-11-09 17:24:06', 0, 'TEST-1760135046466-615', 'nmi_TEST-1760135046466-615', '[]', '[]'),
(44, NULL, 140, 'active', 'monthly', 341.00, '2025-11-10', '2025-10-11 08:21:16', '2025-10-11 08:21:16', NULL, '26tje8w7lymxwlj', '2025-10-11 03:21:16', '2025-11-10 03:21:16', 0, 'TEST-1760170876860-7711', 'nmi_TEST-1760170876860-7711', '[]', '[]'),
(45, NULL, 134, 'active', 'monthly', 1313.00, '2025-11-10', '2025-10-11 08:22:19', '2025-10-11 08:22:19', NULL, '26tje8w7lymxwlj', '2025-10-11 03:22:19', '2025-11-10 03:22:19', 0, 'TEST-1760170939411-964', 'nmi_TEST-1760170939411-964', '[]', '[]'),
(46, NULL, 136, 'active', 'monthly', 11.00, '2025-11-10', '2025-10-11 14:43:32', '2025-10-11 14:43:32', NULL, '26tje8w7lymxwlj', '2025-10-11 09:43:32', '2025-11-10 09:43:32', 0, 'TEST-1760193812314-7866', 'nmi_TEST-1760193812314-7866', '[]', '[]'),
(47, NULL, 136, 'active', 'monthly', 11.00, '2025-11-11', '2025-10-12 11:01:12', '2025-10-12 11:01:12', NULL, 'hua1objl8w40fw7', '2025-10-12 06:01:12', '2025-11-11 06:01:12', 0, 'TEST-1760266872438-718', 'nmi_TEST-1760266872438-718', '[]', '[]'),
(48, NULL, 136, 'active', 'monthly', 11.00, '2025-11-11', '2025-10-12 11:54:48', '2025-10-12 11:54:48', NULL, 'iz2vpsv2u00nlu9', '2025-10-12 06:54:48', '2025-11-11 06:54:48', 0, 'TEST-1760270088331-4947', 'nmi_TEST-1760270088331-4947', '[]', '[]'),
(49, NULL, 136, 'active', 'monthly', 11.00, '2025-11-11', '2025-10-12 12:30:45', '2025-10-12 12:30:45', NULL, 'iz2vpsv2u00nlu9', '2025-10-12 07:30:45', '2025-11-11 07:30:45', 0, 'TEST-1760272245251-7928', 'nmi_TEST-1760272245251-7928', '[]', '[]'),
(50, NULL, 140, 'active', 'monthly', 341.00, '2025-11-12', '2025-10-13 09:13:46', '2025-10-13 09:13:46', NULL, 'iz2vpsv2u00nlu9', '2025-10-13 04:13:46', '2025-11-12 04:13:46', 0, 'TEST-1760346826742-5555', 'nmi_TEST-1760346826742-5555', '[]', '[]'),
(51, NULL, 136, 'active', 'monthly', 11.00, '2025-11-12', '2025-10-13 09:16:32', '2025-10-13 09:16:32', NULL, 'iz2vpsv2u00nlu9', '2025-10-13 04:16:32', '2025-11-12 04:16:32', 0, 'TEST-1760346992226-5537', 'nmi_TEST-1760346992226-5537', '[]', '[]'),
(52, NULL, 140, 'active', 'monthly', 341.00, '2025-11-12', '2025-10-13 09:18:21', '2025-10-13 09:18:21', NULL, 'iz2vpsv2u00nlu9', '2025-10-13 04:18:21', '2025-11-12 04:18:21', 0, 'TEST-1760347100997-2973', 'nmi_TEST-1760347100997-2973', '[]', '[]'),
(53, NULL, 136, 'active', 'monthly', 11.00, '2025-11-12', '2025-10-13 09:20:30', '2025-10-13 09:20:30', NULL, 'iz2vpsv2u00nlu9', '2025-10-13 04:20:30', '2025-11-12 04:20:30', 0, 'TEST-1760347230025-9320', 'nmi_TEST-1760347230025-9320', '[]', '[]'),
(54, NULL, 140, 'active', 'monthly', 341.00, '2025-11-12', '2025-10-13 09:30:23', '2025-10-13 09:30:23', NULL, 'iz2vpsv2u00nlu9', '2025-10-13 04:30:23', '2025-11-12 04:30:23', 0, 'TEST-1760347823664-3295', 'nmi_TEST-1760347823664-3295', '[]', '[]'),
(55, NULL, 140, 'active', 'monthly', 341.00, '2025-11-12', '2025-10-13 09:31:16', '2025-10-13 09:31:16', NULL, 'iz2vpsv2u00nlu9', '2025-10-13 04:31:16', '2025-11-12 04:31:16', 0, 'TEST-1760347876861-9305', 'nmi_TEST-1760347876861-9305', '[]', '[]'),
(56, NULL, 136, 'active', 'monthly', 11.00, '2025-11-12', '2025-10-13 10:07:38', '2025-10-13 10:07:38', NULL, 'iz2vpsv2u00nlu9', '2025-10-13 05:07:38', '2025-11-12 05:07:38', 0, 'TEST-1760350058372-3513', 'nmi_TEST-1760350058372-3513', '[]', '[]'),
(57, NULL, 136, 'active', 'monthly', 11.00, '2025-11-12', '2025-10-13 10:08:23', '2025-10-13 10:08:23', NULL, 'iz2vpsv2u00nlu9', '2025-10-13 05:08:23', '2025-11-12 05:08:23', 0, 'TEST-1760350103904-2884', 'nmi_TEST-1760350103904-2884', '[]', '[]'),
(58, NULL, 140, 'active', 'monthly', 341.00, '2025-11-12', '2025-10-13 10:17:28', '2025-10-13 10:17:28', NULL, 'iz2vpsv2u00nlu9', '2025-10-13 05:17:28', '2025-11-12 05:17:28', 0, 'TEST-1760350648887-1664', 'nmi_TEST-1760350648887-1664', '[]', '[]'),
(59, NULL, 136, 'active', 'monthly', 11.00, '2025-11-12', '2025-10-13 10:26:19', '2025-10-13 10:26:19', NULL, 'iz2vpsv2u00nlu9', '2025-10-13 05:26:19', '2025-11-12 05:26:19', 0, 'TEST-1760351179568-8294', 'nmi_TEST-1760351179568-8294', '[]', '[]'),
(60, NULL, 134, 'active', 'monthly', 1313.00, '2025-11-12', '2025-10-13 10:35:56', '2025-10-13 10:35:56', NULL, 'iz2vpsv2u00nlu9', '2025-10-13 05:35:56', '2025-11-12 05:35:56', 0, 'TEST-1760351756940-2586', 'nmi_TEST-1760351756940-2586', '[]', '[]'),
(61, NULL, 140, 'active', 'monthly', 341.00, '2025-11-12', '2025-10-13 10:36:35', '2025-10-13 10:36:35', NULL, 'iz2vpsv2u00nlu9', '2025-10-13 05:36:35', '2025-11-12 05:36:35', 0, 'TEST-1760351795558-968', 'nmi_TEST-1760351795558-968', '[]', '[]'),
(62, NULL, 136, 'active', 'monthly', 11.00, '2025-11-12', '2025-10-13 11:57:52', '2025-10-13 11:57:52', NULL, 'iz2vpsv2u00nlu9', '2025-10-13 06:57:52', '2025-11-12 06:57:52', 0, 'TEST-1760356672408-138', 'nmi_TEST-1760356672408-138', '[]', '[]'),
(63, NULL, 128, 'active', 'monthly', 68.98, '2025-11-12', '2025-10-13 13:04:45', '2025-10-13 13:04:45', NULL, 'iz2vpsv2u00nlu9', '2025-10-13 08:04:45', '2025-11-12 08:04:45', 0, 'TEST-1760360685181-2048', 'nmi_TEST-1760360685181-2048', '[]', '[]'),
(64, NULL, 140, 'active', 'monthly', 341.00, '2025-11-12', '2025-10-13 13:13:11', '2025-10-13 13:13:11', NULL, 'iz2vpsv2u00nlu9', '2025-10-13 08:13:11', '2025-11-12 08:13:11', 0, 'TEST-1760361191575-1373', 'nmi_TEST-1760361191575-1373', '[]', '[]'),
(65, NULL, 128, 'active', 'monthly', 68.98, '2025-11-12', '2025-10-13 13:16:20', '2025-10-13 13:16:20', NULL, 'iz2vpsv2u00nlu9', '2025-10-13 08:16:20', '2025-11-12 08:16:20', 0, 'TEST-1760361380169-660', 'nmi_TEST-1760361380169-660', '[]', '[]'),
(66, NULL, 136, 'active', 'monthly', 11.00, '2025-11-13', '2025-10-14 20:49:49', '2025-10-14 20:49:49', NULL, 'user_1760474989560_hammad@gmail.com', '2025-10-14 15:49:49', '2025-11-13 15:49:49', 0, '11252132052', 'nmi_11252132052', '[]', '[]'),
(67, NULL, 136, 'active', '', 0.00, NULL, '2025-10-14 20:58:19', '2025-10-14 20:58:19', NULL, 'user_1760474786796_hammad@gmail.com', NULL, NULL, 0, NULL, NULL, '[]', '[]'),
(68, 7, 74, 'active', 'monthly', 22.00, NULL, '2025-10-14 21:28:00', '2025-10-14 21:28:00', NULL, 'u18o8hwgfhbcz36', '2025-10-14 21:28:00', '2025-11-13 21:28:00', 0, NULL, NULL, '[]', '[]'),
(69, NULL, 136, 'active', 'monthly', 11.00, '2025-11-13', '2025-10-14 21:49:42', '2025-10-14 21:49:42', NULL, 'user_1760478582585_hammad@gmail.com', '2025-10-14 16:49:42', '2025-11-13 16:49:42', 0, '11252314297', 'nmi_11252314297', '[]', '[]'),
(70, 7, 136, 'active', 'monthly', 11.00, '2025-11-14', '2025-10-14 21:49:42', '2025-10-14 22:51:40', NULL, 'u18o8hwgfhbcz36', '2025-10-14 21:49:42', '2025-11-14 21:49:42', 0, NULL, NULL, '[]', '[]'),
(71, NULL, 140, 'active', 'monthly', 341.00, '2025-11-15', '2025-10-16 20:11:17', '2025-10-16 20:11:17', NULL, 'user_1760645477813_hammad@gmail.com', '2025-10-16 15:11:17', '2025-11-15 15:11:17', 0, '11260684602', 'nmi_11260684602', '[]', '[]'),
(72, NULL, 141, 'active', 'monthly', 12.00, '2025-11-17', '2025-10-18 00:22:14', '2025-10-18 00:22:14', NULL, 'user_1760746933975_hammad@gmail.com', '2025-10-17 19:22:14', '2025-11-16 19:22:14', 0, 'bypass_1760746933975_141', 'bypass_bypass_1760746933975_141', '[]', '[]'),
(73, NULL, 141, 'active', 'monthly', 12.00, '2025-11-17', '2025-10-18 00:23:15', '2025-10-18 00:23:15', NULL, 'user_1760746995069_hammad@gmail.com', '2025-10-17 19:23:15', '2025-11-16 19:23:15', 0, 'bypass_1760746995069_141', 'bypass_bypass_1760746995069_141', '[]', '[]'),
(74, NULL, 141, 'active', 'monthly', 12.00, '2025-11-17', '2025-10-18 00:26:36', '2025-10-18 00:26:36', NULL, 'user_1760747196391_hammad@gmail.com', '2025-10-17 19:26:36', '2025-11-16 19:26:36', 0, 'bypass_1760747196391_141', 'bypass_bypass_1760747196391_141', '[]', '[]'),
(75, NULL, 141, 'active', 'monthly', 12.00, '2025-11-17', '2025-10-18 00:27:55', '2025-10-18 00:27:55', NULL, 'user_1760747275753_hammad@gmail.com', '2025-10-17 19:27:55', '2025-11-16 19:27:55', 0, 'bypass_1760747275752_141', 'bypass_bypass_1760747275752_141', '[]', '[]'),
(76, NULL, 141, 'active', 'monthly', 12.00, '2025-11-17', '2025-10-18 00:30:56', '2025-10-18 00:30:56', NULL, 'user_1760747456617_hammad@gmail.com', '2025-10-17 19:30:56', '2025-11-16 19:30:56', 0, 'bypass_1760747456617_141', 'bypass_bypass_1760747456617_141', '[]', '[]'),
(77, NULL, 141, 'active', 'monthly', 12.00, '2025-11-17', '2025-10-18 00:32:35', '2025-10-18 00:32:35', NULL, 'user_1760747555936_hammad@gmail.com', '2025-10-17 19:32:35', '2025-11-16 19:32:35', 0, 'bypass_1760747555936_141', 'bypass_bypass_1760747555936_141', '[]', '[]'),
(78, NULL, 141, 'active', 'monthly', 12.00, '2025-11-17', '2025-10-18 00:34:39', '2025-10-18 00:34:39', NULL, 'user_1760747679296_hammad@gmail.com', '2025-10-17 19:34:39', '2025-11-16 19:34:39', 0, 'bypass_1760747679296_141', 'bypass_bypass_1760747679296_141', '[]', '[]'),
(79, NULL, 141, 'active', 'monthly', 12.00, '2025-11-17', '2025-10-18 00:36:31', '2025-10-18 00:36:31', NULL, 'user_1760747791238_hammad@gmail.com', '2025-10-17 19:36:31', '2025-11-16 19:36:31', 0, 'bypass_1760747791238_141', 'bypass_bypass_1760747791238_141', '[]', '[]'),
(80, NULL, 141, 'active', 'monthly', 12.00, '2025-11-17', '2025-10-18 00:44:22', '2025-10-18 00:44:22', NULL, 'user_1760748262704_hammad@gmail.com', '2025-10-17 19:44:22', '2025-11-16 19:44:22', 0, 'bypass_1760748262704_141', 'bypass_bypass_1760748262704_141', '[]', '[]'),
(81, NULL, 141, 'active', 'monthly', 12.00, '2025-11-17', '2025-10-18 00:45:33', '2025-10-18 00:45:33', NULL, 'user_1760748333137_hammad@gmail.com', '2025-10-17 19:45:33', '2025-11-16 19:45:33', 0, 'bypass_1760748333136_141', 'bypass_bypass_1760748333136_141', '[]', '[]'),
(82, NULL, 141, 'active', 'monthly', 97.00, '2025-11-17', '2025-10-18 09:03:18', '2025-10-18 09:03:18', NULL, 'user_1760778198497_test@example.com', '2025-10-18 04:03:18', '2025-11-17 04:03:18', 0, 'bypass_1760778198496_xw9olblwj', 'bypass_bypass_1760778198496_xw9olblwj', '[]', '[]'),
(83, NULL, 142, 'active', 'monthly', 22.00, '2025-11-17', '2025-10-18 09:03:41', '2025-10-18 09:03:41', NULL, 'user_1760778221347_hammad@gmail.com', '2025-10-18 04:03:41', '2025-11-17 04:03:41', 0, 'bypass_1760778221345_haaqkwkww', 'bypass_bypass_1760778221345_haaqkwkww', '[]', '[]'),
(84, NULL, 141, 'active', 'monthly', 97.00, '2025-11-17', '2025-10-18 09:11:06', '2025-10-18 09:11:06', NULL, 'user_1760778666931_testuser@example.com', '2025-10-18 04:11:06', '2025-11-17 04:11:06', 0, 'bypass_1760778666930_yadpzdqkh', 'bypass_bypass_1760778666930_yadpzdqkh', '[]', '[]'),
(85, NULL, 141, 'active', 'monthly', 97.00, '2025-11-17', '2025-10-18 09:11:50', '2025-10-18 09:11:50', NULL, 'user_1760778710058_testuser@example.com', '2025-10-18 04:11:50', '2025-11-17 04:11:50', 0, 'bypass_1760778710057_wd8c6djph', 'bypass_bypass_1760778710057_wd8c6djph', '[]', '[]'),
(86, NULL, 141, 'active', 'monthly', 97.00, '2025-11-17', '2025-10-18 09:13:44', '2025-10-18 09:13:44', NULL, 'user_1760778824475_testuser@example.com', '2025-10-18 04:13:44', '2025-11-17 04:13:44', 0, 'bypass_1760778824475_c8q5g02ou', 'bypass_bypass_1760778824475_c8q5g02ou', '[]', '[]'),
(87, NULL, 142, 'active', 'monthly', 22.00, '2025-11-17', '2025-10-18 09:14:26', '2025-10-18 09:14:26', NULL, 'user_1760778866172_hammad@gmail.com', '2025-10-18 04:14:26', '2025-11-17 04:14:26', 0, 'bypass_1760778866171_qcfpte714', 'bypass_bypass_1760778866171_qcfpte714', '[]', '[]'),
(88, NULL, 142, 'active', 'monthly', 22.00, '2025-11-17', '2025-10-18 09:15:33', '2025-10-18 09:15:33', NULL, 'user_1760474786796_hammad@gmail.com', '2025-10-18 04:15:33', '2025-11-17 04:15:33', 0, 'bypass_1760778933393_l6tk0n64m', 'bypass_bypass_1760778933393_l6tk0n64m', '[]', '[]'),
(89, NULL, 141, 'active', 'monthly', 97.00, '2025-11-17', '2025-10-18 09:15:35', '2025-10-18 09:15:35', NULL, 'fm682enwv01i389', '2025-10-18 04:15:35', '2025-11-17 04:15:35', 0, 'bypass_1760778935639_ibb1sllwr', 'bypass_bypass_1760778935639_ibb1sllwr', '[]', '[]'),
(90, NULL, 142, 'active', 'monthly', 22.00, '2025-11-17', '2025-10-18 09:16:29', '2025-10-18 09:16:29', NULL, 'user_1760474786796_hammad@gmail.com', '2025-10-18 04:16:29', '2025-11-17 04:16:29', 0, 'bypass_1760778989302_iab5dbrtz', 'bypass_bypass_1760778989302_iab5dbrtz', '[]', '[]'),
(91, NULL, 142, 'active', 'monthly', 22.00, '2025-11-17', '2025-10-18 09:25:15', '2025-10-18 09:25:15', NULL, 'user_1760474786796_hammad@gmail.com', '2025-10-18 04:25:15', '2025-11-17 04:25:15', 0, 'bypass_1760779515309_a4i2liu3l', 'bypass_bypass_1760779515309_a4i2liu3l', '[]', '[]'),
(92, NULL, 142, 'active', 'monthly', 22.00, '2025-11-17', '2025-10-18 09:37:55', '2025-10-18 09:37:55', NULL, 'user_1760474786796_hammad@gmail.com', '2025-10-18 04:37:55', '2025-11-17 04:37:55', 0, 'bypass_1760780275731_vp4dwey9r', 'bypass_bypass_1760780275731_vp4dwey9r', '[]', '[]'),
(93, NULL, 142, 'active', 'monthly', 22.00, '2025-11-17', '2025-10-18 09:44:06', '2025-10-18 09:44:06', NULL, 'egqhkg18dwo88qw', '2025-10-18 04:44:06', '2025-11-17 04:44:06', 0, 'bypass_1760780646326_b9f0o899s', 'bypass_bypass_1760780646326_b9f0o899s', '[]', '[]'),
(94, NULL, 142, 'active', 'monthly', 22.00, '2025-11-17', '2025-10-18 09:45:54', '2025-10-18 09:45:54', NULL, '00fb5fb2-932f-45da-9fa1-60403f078f32', '2025-10-18 04:45:54', '2025-11-17 04:45:54', 0, 'bypass_1760780754222_2md9rzjyk', 'bypass_bypass_1760780754222_2md9rzjyk', '[]', '[]'),
(95, NULL, 142, 'active', 'monthly', 22.00, '2025-11-17', '2025-10-18 09:53:16', '2025-10-18 09:53:16', NULL, 'nxagkqgzvw7yuyb', '2025-10-18 04:53:16', '2025-11-17 04:53:16', 0, 'bypass_1760781196645_6kqau3hsr', 'bypass_bypass_1760781196645_6kqau3hsr', '[]', '[]'),
(96, NULL, 142, 'active', 'monthly', 22.00, '2025-11-17', '2025-10-18 09:54:53', '2025-10-18 09:54:53', NULL, '00fb5fb2-932f-45da-9fa1-60403f078f32', '2025-10-18 04:54:53', '2025-11-17 04:54:53', 0, 'bypass_1760781293637_824l8ogdz', 'bypass_bypass_1760781293637_824l8ogdz', '[]', '[]');

-- --------------------------------------------------------

--
-- Table structure for table `templates`
--

CREATE TABLE `templates` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `preview_url` varchar(255) DEFAULT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `config_schema` text DEFAULT NULL,
  `default_config` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `is_premium` tinyint(1) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `templates`
--

INSERT INTO `templates` (`id`, `created_at`, `updated_at`, `name`, `description`, `type`, `category`, `preview_url`, `thumbnail_url`, `config_schema`, `default_config`, `is_active`, `is_premium`, `created_by`) VALUES
(1, '2025-06-09 14:41:41', '2025-06-09 14:41:41', 'test', 'test', 'dashboard', 'business', 'https://analytics.google.com/', 'https://analytics.google.com/', NULL, NULL, 1, 1, '43537113');

-- --------------------------------------------------------

--
-- Table structure for table `themes`
--

CREATE TABLE `themes` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) NOT NULL DEFAULT '',
  `password` varchar(255) DEFAULT NULL,
  `profile_image_url` varchar(255) DEFAULT NULL,
  `logo_image_url` varchar(255) DEFAULT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'white_label_client',
  `is_active` tinyint(1) DEFAULT 1,
  `white_label_id` int(11) DEFAULT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `auth_provider` varchar(50) NOT NULL DEFAULT 'local',
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `referral_code` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `first_name`, `last_name`, `password`, `profile_image_url`, `logo_image_url`, `role`, `is_active`, `white_label_id`, `google_id`, `auth_provider`, `name`, `phone`, `company`, `referral_code`, `created_at`, `updated_at`) VALUES
('00fb5fb2-932f-45da-9fa1-60403f078f32', 'trackdiv', 'hammadiisaqib@gmail.com', 'Hammad', 'Saqib', '$2b$12$Ja.bsTvK96d4XCwU2awOFOlfEHq6LeX2AsfOnmydSH4m4CBrEi6oO', NULL, NULL, 'white_label_client', 1, 63, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-30 17:31:43', '2025-09-20 14:18:13'),
('04mlvs50y4nls6a', 'munibahmed20', NULL, 'Munib', 'Ahmed', '$2b$12$OeR76cD1e0tExSoxPcSuTuAixnB0pS0WR99eecDL1REhFf16HT4Xu', NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-12 09:59:36', '2025-08-12 10:28:32'),
('128cf820-2f12-439d-b994-0213c5eb5219', 'hunai2', 'hunai2248n@gmail.com', 'hunai', 'ahmed', '$2b$10$N9KdNAfpRRNGubJVdWLqYeAF4a7iWIqJz1yOCTLRO8DUhri5q2BLC', NULL, NULL, 'white_label_client', 1, 82, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-17 20:43:38', '2025-10-17 20:43:38'),
('1756662017869_muneeb', 'muneeb', NULL, 'muneeb', 'muneeb', '$2b$10$m7MhYl8Lb7fduvvcaZJ1CeCm6D0jEgK1TRnQBjJfOsNrFxQgkindS', NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-31 12:40:17', '2025-08-31 12:40:17'),
('1758320336397_superadminwhitelabelportalee', 'superadminwhitelabelportalee', NULL, 'muneeb', 'muneeb', '$2b$10$UULyMT/Fas68wWJfxdmLMunkvnJSabzI50acldGb66eFxawnIdoUq', NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-09-19 22:18:56', '2025-09-19 22:18:56'),
('1758320372285_testing1221', 'testing1221', NULL, 'muneeb', 'muneeb', '$2b$10$UFjTvE4rFn5P2TdnbD1Wg.mOhRHH3ClriJIH6CCIwr1UEkWFqpXoy', NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-09-19 22:19:32', '2025-09-19 22:19:32'),
('1d735bdd-65d7-4d14-9be2-5828bad59c2e', 'trackdivw', 'trackdivw', 'Hammad', 'Saqib', '$2b$10$E.D4B1wT/RRFzIwlQ4oyAO9.BTPjhwXD7lQ69N/m08T4eLklK5dia', NULL, NULL, 'white_label_client', 1, 64, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-30 17:45:44', '2025-08-30 17:45:44'),
('1fykk71x0x07yod', 'testingaffiliatetracker', NULL, 'Testing', 'Affiliatetracker', '$2b$12$HCjcx2khdGO/.LFKQjoAPeq/uABOv/DjBGtt5qKThzdgyHBJ/4B9G', NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-23 15:21:30', '2025-08-23 15:21:30'),
('23707e2f-95b4-11f0-8827-b42e99ed786f', 'testuser1', 'testuser1@example.com', 'Test', 'User One', '$2b$10$example.hash.for.password123', NULL, NULL, 'end_user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-09-19 23:55:36', '2025-09-19 23:55:36'),
('2370fb64-95b4-11f0-8827-b42e99ed786f', 'testuser2', 'testuser2@gmail.com', 'Test', 'User Two', '$2b$10$example.hash.for.password456', NULL, NULL, 'end_user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-09-19 23:55:36', '2025-09-19 23:55:36'),
('23712dc5-95b4-11f0-8827-b42e99ed786f', 'flowtest', 'flowtest@icloud.com', 'Flow', 'Tester', '$2b$10$example.hash.for.password789', NULL, NULL, 'end_user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-09-19 23:55:36', '2025-09-19 23:55:36'),
('26tje8w7lymxwlj', 'testingnewaffiliatesystem', NULL, 'NewAffiliatee', 'System', '$2b$12$qyDvxAjDDwg/1POl7OhPnujJD3/0OkixcJJ2b992kwWPC3HpK.rOm', NULL, NULL, 'end_user', 1, 54, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-23 11:58:33', '2025-10-16 23:36:42'),
('2eo8zb2e3dqomeb', 'epic22222', NULL, 'epic', '22222', '$2b$12$FAktUOuc.bdU52kZJNjEROeRo4FR34WAWh6mcTOyqgTGz0LXYauIC', NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-19 02:01:45', '2025-08-19 02:01:45'),
('328afffb-74f6-4d76-aa7a-6cb7d37e8fa3', 'finaldebugtest', 'finaldebugtest', 'Final', 'Debug', '$2b$10$I0tJfSZjxiRhxTfizsOMXuYJu4jBcLdAHtq.R8gWHMypN3R/HOk2e', NULL, NULL, 'white_label_client', 1, 62, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-29 18:34:01', '2025-08-29 18:34:01'),
('35m0crql3jbwdg5', 'mypurchases', NULL, 'My', 'Purchases', '$2b$12$PgmC4iBJnkPoavoaMz0qE.IDIUCw/iJYaQ0Tk.gwqjQ2OS/gguPNm', NULL, NULL, 'end_user', 1, 7, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-13 09:29:06', '2025-08-13 09:29:06'),
('3j0v57v5seewlhe', 'first1', NULL, 'first', 'first', '$2b$12$4X.pg0fZfRrH9/57w6YkWuMMqomhPckgxUDUyhLyX7S69vxEAivSK', NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-09 13:50:13', '2025-08-09 13:50:13'),
('43537113', 'superadminwhitelabelportal', 'hammadisaqibii@gmail.com', 'Hammad', 'Saqib', '$2b$12$KlE7kQwg5zYfv5TwDrPR7OaW7dAWvCxWCfYBAuRn7AzW99x1SW9fm', '/api/files/profile_1758725226531-640447795.jpg', '/uploads/brand-logos/brand_logo_1760531898137-577241784.png', 'super_admin', 1, NULL, NULL, 'local', NULL, '03337008731', 'TrackDiv', NULL, '2025-06-05 21:12:21', '2025-10-16 20:06:32'),
('44187122', NULL, 'nigolib693@exitbit.com', 'rora', 'kami', NULL, NULL, NULL, 'end_user', 1, 7, NULL, 'local', NULL, NULL, NULL, NULL, '2025-06-23 17:14:34', '2025-07-18 17:25:04'),
('44187263', 'tutorials', 'hammadiisaqib@gmail.com', 'Ric', 'Slick', '$2b$12$hkWeQiPt3DdWGn942pGL6eWiuqU6nI6IZT4j38g22iuI4iLuAPr/2', '/api/files/profile_1758725331899-810398326.jpg', '/uploads/brand-logos/brand_logo_1758725343257-773439350.png', 'white_label_client', 1, 12, NULL, 'local', 'tutorial', '+1 555 123 4567', 'fggd', NULL, '2025-06-23 17:20:25', '2025-09-24 14:49:03'),
('44377090', 'epicgamer', 'hammadiusaqib@gmail.com', 'epic', 'epic', '$2b$12$8JWOj1Uv9tOMpApPj04MYeynwYc9.gQytHdhX8v4u6xW5r9QsK5Pi', '/api/files/profile_1758660600318-628098241.jpg', '/uploads/brand-logos/brand_logo_1758666226213-599688340.png', 'white_label_client', 1, 7, NULL, 'local', NULL, NULL, NULL, 'epic125', '2025-06-28 16:56:52', '2025-10-17 10:27:44'),
('44443117', NULL, 'munibahmed1225521@gmail.com', NULL, '', NULL, 'data:image/webp;base64,UklGRkiyAQBXRUJQVlA4WAoAAAAgAAAANwQANwQASUNDUMgBAAAAAAHIbGNtcwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABzYXdzY3RybAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWhhbmSdkQA9QICwPUB0LIGepSKOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNj', NULL, 'end_user', 1, 7, NULL, 'local', NULL, NULL, NULL, 'munibahmed125521', '2025-06-30 04:18:18', '2025-08-06 00:26:04'),
('44622389', NULL, 'rehmanaptech50@gmail.com', NULL, '', NULL, NULL, NULL, 'white_label_affiliate', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-07-04 10:11:23', '2025-07-04 10:22:59'),
('44915301', '5star', '5starsecoff3icial@gmail.com', NULL, '', '$2b$12$ZRsh31/fz9rFF0uqtaMnmOZBthj.c4Hgt38L5dQzttVFO7Rv.Yv7e', NULL, NULL, 'end_user', 1, 7, NULL, 'local', NULL, NULL, NULL, '5starsecofficial', '2025-07-11 11:23:30', '2025-08-06 00:32:38'),
('45490908', NULL, 'munibbahmed290@gmail.com', NULL, '', NULL, NULL, NULL, 'white_label_client', 1, 8, NULL, 'local', NULL, NULL, NULL, NULL, '2025-07-24 12:30:25', '2025-08-01 22:58:18'),
('4f725c6a-c57e-47de-b1a3-a8bf81965cdf', 'tutorialsd', 'tutorialsworld847775@gmail.com', 'hammad', 'saqib', '$2b$10$aA3ePapRZ5v.xl0GLBY/g.C5y.TEfdsFRpWPhmaIrdgsL/jTw9yeC', NULL, NULL, 'white_label_client', 1, 70, NULL, 'local', NULL, NULL, NULL, NULL, '2025-09-13 13:26:07', '2025-09-13 13:26:07'),
('53cnffx7v02h7if', 'affiliatemodule', NULL, 'Affiliate', 'Module', '$2b$12$pmTMNJpfkR.D4Pli3XMUlud.ra5X0t13dH35YxoeezzJvgZo34MeC', NULL, NULL, 'super_admin_affiliate', 1, NULL, NULL, 'local', NULL, NULL, NULL, 'hammadisaqib', '2025-08-22 21:11:02', '2025-10-15 12:55:52'),
('5454d9e6-adb9-4be3-a27f-7a1ccc3e0792', 'debugtest123', 'debugtest123', 'Debug', 'User', '$2b$10$DamBCxwsRx9O4TbctNdCkOCiUSak4SSu6wX1uB7lUIyB2sRz.0JKG', NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-29 18:31:59', '2025-08-29 18:31:59'),
('5dx1605cytc7gjb', 'w5star', NULL, 'Five', 'Star', '$2b$12$1V4VKf7YeD0hFXoCdV3RZObg4/7av9ztVFbNgnrrWjIXSyVosF4m2', NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-09 06:38:14', '2025-08-09 06:38:14'),
('5qa8llwaph4fhut', 'feziiee', NULL, 'Fazina ', 'Lola', '$2b$12$An5GjZGRtUqVJLCOJ3iTq.bXZkjgAjj1QuYhiy/SPNwrSh3eTkDJW', NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-14 12:47:01', '2025-08-14 12:47:01'),
('62b7hiatqx20iaj', 'hammadassa', NULL, 'Munib', 'Saqib', '$2b$12$X4UsuKg4qdrhMS6tKIKsx.kYzWrer61djoYpHrC3K5Siqm2h.nS9q', NULL, NULL, 'white_label_client', 1, 49, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-19 16:45:14', '2025-09-19 07:54:08'),
('67hhc5l6jli5723', 'tutorialssss', NULL, 'Munib', 'World', '$2b$12$RIAupbnEr3Mv6ZCBhia.uerBqTrp0B8LuMd8Iydg5vngwgjlRrwau', NULL, NULL, 'end_user', 1, 46, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-19 02:11:14', '2025-08-19 02:11:14'),
('685xf719omsrqm8', 'munibgg', NULL, 'Munib', 'Ahmed', '$2b$12$Tgcf3yO6.JH5PtawPmGCwuZVMjGY51iEjdB6ti/oOBcsDxbyPDSUO', NULL, NULL, 'end_user', 1, 41, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-12 10:09:31', '2025-08-12 10:09:31'),
('6b3bed99-6b66-476e-aaa2-c7dd94b26abe', 'finaltest456', 'finaltest456', 'Final', 'Test', '$2b$10$uRUxDHWhTQjeDZVKrVqzNuatk5JCkmA6nhQaU9N6UPro2Ldd27XF6', NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-29 18:32:59', '2025-08-29 18:32:59'),
('6e5cb5fb-6b38-41fb-88e5-fcf235f39fc5', 'aslam', 'mahzuli@icloud.com', 'M', 'Aslam', '$2b$10$EHIffKlkJUbg5oIDqJKgo.0iAn.Jvi6/LNw3r9D.unv7xGEIsK.lK', NULL, NULL, 'white_label_client', 1, 74, NULL, 'local', NULL, NULL, NULL, NULL, '2025-09-14 10:58:31', '2025-09-14 10:58:32'),
('6e66111b-3ad3-4613-84ce-fa4c6e8e973c', 'investigate ', 'tutorialsworld84475@gmmail.com', 'hammad', 'saqib', '$2b$10$lSfiQ55XobLVS7POwMoNkuHnI4xXgu52QHycdahSDhtsov7rtx5MG', NULL, NULL, 'white_label_client', 1, 71, NULL, 'local', NULL, NULL, NULL, NULL, '2025-09-13 13:53:42', '2025-09-13 13:53:42'),
('6kk4onsspvzjoml', 'zaidaffiliate', 'zaid@gmail.com', 'Zaid', 'Affiliate', '$2b$12$/CREmsyqE/EF7utAsSIfiuPlCecikIzYkEsgkUc.0mq5fpMe9ID.W', NULL, NULL, 'super_admin_affiliate', 1, NULL, NULL, 'local', NULL, NULL, NULL, 'zaidy', '2025-08-14 05:41:52', '2025-08-14 06:08:45'),
('6pa5688t8fntppw', 'superaffiliate', NULL, 'Super', 'Affiliate', '$2b$12$pqnqQl9v9xZQJAOg27mr1eQHthb0.SPvIkQiQYljQOHKvVkH/m.By', NULL, NULL, 'super_admin_affiliate', 1, NULL, NULL, 'local', NULL, NULL, NULL, 'superaffiliate', '2025-08-13 09:31:46', '2025-08-13 09:31:46'),
('6t2flwl3grvhzzc', 'epic1251', NULL, 'epic', 'aa', '$2b$12$rFXPox3imLwTwAR7ZNNc2ukizzDo1Wp3H1uBW60adbAsdlkKOFSxm', NULL, NULL, 'end_user', 1, 7, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-09 14:07:32', '2025-08-09 14:07:32'),
('6xmpbnukza0d1de', 'hammadi', NULL, 'Munib', 'World', '$2b$12$FJ1jXzzhf.NFkRcA6b23qe4qpI6JKCw5wiyMM58OVJw.zV63CXqTu', NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', 'Munib World', NULL, NULL, NULL, '2025-08-07 07:43:44', '2025-08-07 07:43:44'),
('7b3143a3-a880-45d8-aab8-998aa3557f32', 'superadminwhitelabelpportal', 'munibahmed125521@gmail.com', 'Hammad', 'Saqib', '$2b$10$MfI6dFyQ0d2PPlcyr3ord.X7quNStVLX4nDOREm9dHD9zOFypTX4m', NULL, NULL, 'white_label_client', 1, 73, NULL, 'local', NULL, NULL, NULL, NULL, '2025-09-13 14:22:03', '2025-09-13 14:22:03'),
('7rjtsyeijw0i8zi', 'checking22', NULL, 'Checking22', 'Checking22', '$2b$12$idBumDF3x90ebBia4ejx6uXzxCPnPMXtCty6u3/jFuqmMwl/.T29m', NULL, NULL, 'end_user', 1, 52, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-20 18:19:03', '2025-08-20 18:19:03'),
('7usxyuegu2omgk7', 'munibaffiliate', NULL, 'Munib', 'affiliate', '$2b$12$seyY57YmM89GiFxzxyJAq.wNw.d2PsnoZp/HxvjuIyXhcoI8GfdaO', NULL, NULL, 'super_admin_affiliate', 1, NULL, NULL, 'local', NULL, NULL, NULL, 'munib', '2025-08-08 03:50:31', '2025-08-08 03:50:31'),
('8252680b-4060-4da5-a893-0a1e8349df39', 'trackdivq', 'trackdivq', 'Hammad', 'Saqib', '$2b$10$RNF7Jce19UH.B/hJlR2RYeCHdnlRZbqlNmT1fEMvKTZW8DeOZY8Va', NULL, NULL, 'white_label_client', 1, 65, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-30 18:04:13', '2025-08-30 18:04:13'),
('8aqk5un6apiqd4b', 'mypurchases2', NULL, 'My', 'Purchases', '$2b$12$GNjxxEFQaBch1u6iS/88A./ceJTt637oB6V/ZhSgqYFsqiEqbQ5PK', NULL, NULL, 'end_user', 1, 18, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-13 09:30:05', '2025-08-13 09:30:05'),
('8m691wqlghkf3nc', 'hammadhammadi', NULL, 'hammad', 'hammad', '$2b$12$3z1negKAX51Me0e/Fhvai.Tbyja2i9Az7aSubUUWZX3eaBLy1WGqu', NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-19 16:41:59', '2025-08-19 16:41:59'),
('9221adef-ab0a-47a4-b844-a6fa529d3aad', 'tutorialsnj', 'tutorialsworld8475@gmail.com', 'hammad', 'saqib', '$2b$10$gZgQRcunZ8lbAZkQVvZYAOmRLkdySiwc1Z0LLfvEAhREigw8mxpiG', NULL, NULL, 'white_label_client', 1, 72, NULL, 'local', NULL, NULL, NULL, NULL, '2025-09-13 14:10:44', '2025-09-13 14:10:44'),
('9a280199-284f-47de-9cea-bf5c1844c343', 'trackdivl', 'trackdivl', 'hammad', 'saqib', '$2b$10$zoOuIVI7zzkHa3Fezg3PRuPpEWC2bBeEA3yjrQQQfW8YRYGvbgo3e', NULL, NULL, 'white_label_client', 1, 66, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-30 18:30:53', '2025-08-30 18:30:53'),
('9w3via67sj0trt8', 'affiliate', NULL, 'affiliate1', 'Saqib', '$2b$12$6fR8LqvpntmE1yOWoCn7ku2Xz2FjYO6PEyUmG5Mpfo41DNKPqX5x.', NULL, NULL, 'super_admin_affiliate', 1, NULL, NULL, 'local', NULL, NULL, NULL, 'affiliate1', '2025-08-08 03:25:04', '2025-08-08 03:25:04'),
('a4didmki51vg2hw', 'munib6969', NULL, 'Munib6969', 'Munib6969', '$2b$12$tg56XiPfit6IlQFXLJrfBOl8TyiIxYdY/DWda1McLR/f4CLF6Pgeq', NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-10 06:41:29', '2025-08-10 06:41:29'),
('aff_001', 'sarah', 'sarah.johnson@marketpro.com', 'Sarah', 'Johnson', '$2b$12$3z1negKAX51Me0e/Fhvai.Tbyja2i9Az7aSubUUWZX3eaBLy1WGqu', NULL, NULL, 'super_admin_affiliate', 1, NULL, NULL, 'local', 'Sarah Johnson', '+1-555-0101', 'MarketPro Solutions', 'sarah25', '2025-01-24 16:28:52', '2025-08-29 16:02:15'),
('aff_002', 'malik', 'mike.chen@techboost.com', 'Mike', 'Chen', '$2b$12$3z1negKAX51Me0e/Fhvai.Tbyja2i9Az7aSubUUWZX3eaBLy1WGqu', NULL, NULL, 'super_admin_affiliate', 1, NULL, NULL, 'local', 'Mike Chen', '+1-555-0102', 'TechBoost Inc', 'mkkk', '2025-03-24 16:28:52', '2025-08-29 16:22:03'),
('aff_003', NULL, 'lisa.rodriguez@salesforce.com', 'Lisa', 'Rodriguez', NULL, NULL, NULL, 'super_admin_affiliate', 1, NULL, NULL, 'local', 'Lisa Rodriguez', '+1-555-0103', 'SalesForce Elite', 'LISA2025', '2024-11-24 16:28:52', '2025-07-24 16:28:52'),
('aff_004', NULL, 'david.wilson@digitalads.com', 'David', 'Wilson', NULL, NULL, NULL, 'super_admin_affiliate', 1, NULL, NULL, 'local', 'David Wilson', '+1-555-0104', 'Digital Ads Co', 'DAVID2025', '2025-04-24 16:28:52', '2025-07-24 16:28:52'),
('aff_005', NULL, 'emma.taylor@growthagency.com', 'Emmaaaaa', 'Taylor', NULL, NULL, NULL, 'super_admin_affiliate', 1, NULL, NULL, 'local', 'Emma Taylor', '+1-555-0105', 'Growth Agency', 'EMMA2025', '2025-02-24 16:28:52', '2025-07-24 16:28:52'),
('affiliate_1', NULL, 'partner@example.com', 'Lisa', 'Partner', NULL, NULL, NULL, 'white_label_affiliate', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-06-09 20:07:33', '2025-06-09 20:07:33'),
('au9gefzh7th8dlz', 'Hammadi', NULL, 'Hammad', 'Saqib', '$2b$12$O4RUGVPylVVfmsbRjvqXa.jMbP30DdVuG8N9zNqvmyuJylaUFbn06', NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', 'Hammad Saqib', NULL, NULL, NULL, '2025-08-07 05:18:08', '2025-08-07 05:18:08'),
('ba20cb50-cc28-41ae-af11-86d0217618c1', 'debugtest2', 'debugtest2', 'Debug', 'Test2', '$2b$10$CDx9oKjAM/XZNKcMOOg9b.dY40Wr5ED54ohhjYUFhVU0fThuKLhNq', NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-29 18:33:49', '2025-08-29 18:33:49'),
('bk65b67mlxr3oja', 'testuser123', NULL, 'Test', 'User', '$2b$12$kblqVzUpa0m4MrBGKsmPkOpJ1qp5yMI/pl2T8Sth8DzjbPDf3Wzia', NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', 'Test User', NULL, NULL, NULL, '2025-08-07 05:09:12', '2025-08-07 05:09:12'),
('c0c8zgzt7hi4hr0', 'test', NULL, 'Testing', '22', '$2b$12$9AFNRHDJzOZ616uoXGXWH.ckxVJ10Ow2RjZ2ogogXt40CscoHiJLu', NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-29 09:01:14', '2025-08-29 09:01:14'),
('c3082ce4-1026-4d8a-a517-e2366d0e9164', 'faizan', 'faizanfezii7@gmail.com', 'faizan', 'ahmed', '$2b$10$G5VeseSWzqXeRwnzNchewONpTWFzQvoYj1DY1hNDh1B3leQvmi5C.', NULL, NULL, 'white_label_client', 1, 69, NULL, 'local', NULL, NULL, NULL, NULL, '2025-09-13 12:26:52', '2025-09-13 12:26:52'),
('cc3100ce-940e-4156-a0ae-de338282fafb', 'printteam@example.com', 'epicgamer125521@gmail.com', 'Hammad', 'Saqib', '$2b$10$6RUvmu8E9D3AFULWSfoRlefD1RtBWXdBFuWAbGk7HHhIza.kWK.su', NULL, NULL, 'white_label_client', 1, 75, NULL, 'local', NULL, NULL, NULL, NULL, '2025-09-15 10:01:10', '2025-09-15 10:01:10'),
('client_1', NULL, 'client@example.com', 'Mike', 'Client', NULL, NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-06-09 20:07:33', '2025-06-09 20:07:33'),
('cutzfp93hvuvz2l', 'superadmin5star', NULL, 'Hammad', 'Saqib', '$2b$12$82/UE.Crv0plLm5YGRDgM.a14Aq8gVOZ8mqh5ngP7lEKOXoDu0q2S', NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-07 23:51:55', '2025-08-07 23:51:55'),
('d29oee2p96xfn06', 'munibrealtry', NULL, 'munib', 'ahmed', '$2b$12$eD53BX9aMH63CkBOTZ8HpO8dA6B0wuZNYKgxYiDIeEF7ioFZMZ9pK', NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-12 09:25:39', '2025-08-12 09:25:39'),
('db4k9owwms65bna', 'epic3try', NULL, 'epic', '3try', '$2b$12$Xckaqe2FCXx4CTB0kDKjl.2z6MstBDHOiT8cvWoIbS4S3tpLnUGrW', NULL, NULL, 'super_admin_affiliate', 1, NULL, NULL, 'local', NULL, NULL, NULL, 'epic1', '2025-08-14 05:40:40', '2025-08-14 05:40:40'),
('ded4aec0-4909-4ef0-bf15-7fcb11748131', 'reyanderson', 'reyanderson', 'Rey', 'Anderson ', '$2b$10$5c8gzIn2DeoNuR4EtG0fs.DxtLiFZldZKySv7R4sjsYe3zrzLOL0e', NULL, NULL, 'white_label_client', 1, 68, NULL, 'local', NULL, NULL, NULL, NULL, '2025-09-10 10:04:42', '2025-09-10 10:04:42'),
('e2m3st59vmryro0', 'alibadi', 'adrwealthadvisorsllc@gmail.com', 'Ali', 'badi', '$2b$12$hH1cM51x.NWVzGNllMfmWuQUBQlmIbMoDmfYembtIJyMx/TWORAvC', NULL, NULL, 'super_admin_affiliate', 1, NULL, NULL, 'local', NULL, NULL, NULL, 'ali1', '2025-10-17 22:53:27', '2025-10-17 22:53:27'),
('e99adad5-95b4-11f0-8827-b42e99ed786f', 'testuser1', 'testuser1@example.com', 'Test', 'User One', '$2b$10$example.hash.for.password123', NULL, NULL, 'end_user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-09-20 00:01:09', '2025-09-20 00:01:09'),
('e99b7fa6-95b4-11f0-8827-b42e99ed786f', 'testuser2', 'testuser2@gmail.com', 'Test', 'User Two', '$2b$10$example.hash.for.password456', NULL, NULL, 'end_user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-09-20 00:01:09', '2025-09-20 00:01:09'),
('e99bbd43-95b4-11f0-8827-b42e99ed786f', 'flowtest', 'flowtest@icloud.com', 'Flow', 'Tester', '$2b$10$example.hash.for.password789', NULL, NULL, 'end_user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-09-20 00:01:09', '2025-09-20 00:01:09'),
('ed038a59-ae1a-42fa-a0bd-410de437f8ab', 'workingtest789', 'workingtest789', 'Working', 'Test', '$2b$10$/weor92zHsD33.XuzB.OmeLnUQjuGoMLsGg/8tO0fPuTwRfyog4MS', NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-29 18:33:40', '2025-08-29 18:33:40'),
('ee7u4z5o056zugj', 'superadmin1', NULL, 'Hammad', 'Saqib', '$2b$12$FmlD/pkIZ4ddQrm4sqi3N.TtYRn8hjbJVBqx2/0qIk47fVQZl/zLO', NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-07 23:52:19', '2025-08-07 23:52:19'),
('egqhkg18dwo88qw', NULL, 'had@gmail.com', 'Purchase', 'Purchase', NULL, NULL, NULL, 'end_user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-18 09:44:06', '2025-10-18 09:44:06'),
('end_001', NULL, 'customer1@example.com', 'John', 'Smith', NULL, NULL, NULL, 'end_user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-04-24 16:28:56', '2025-07-24 16:28:56'),
('end_002', NULL, 'customer2@example.com', 'Jane', 'Doe', NULL, NULL, NULL, 'end_user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-04-24 16:28:56', '2025-07-24 16:28:56'),
('end_003', NULL, 'customer3@example.com', 'Bob', 'Williams', NULL, NULL, NULL, 'end_user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-05-24 16:28:56', '2025-07-24 16:28:56'),
('end_004', NULL, 'customer4@example.com', 'Alice', 'Brown', NULL, NULL, NULL, 'end_user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-05-24 16:28:56', '2025-07-24 16:28:56'),
('end_005', NULL, 'customer5@example.com', 'Charlie', 'Davis', NULL, NULL, NULL, 'end_user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-06-24 16:28:56', '2025-07-24 16:28:56'),
('end_006', NULL, 'customer6@example.com', 'Diana', 'Miller', NULL, NULL, NULL, 'end_user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-06-24 16:28:56', '2025-07-24 16:28:56'),
('end_007', NULL, 'customer7@example.com', 'Frank', 'Garcia', NULL, NULL, NULL, 'end_user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-07-10 16:28:56', '2025-07-24 16:28:56'),
('end_008', NULL, 'customer8@example.com', 'Grace', 'Martinez', NULL, NULL, NULL, 'end_user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-07-17 16:28:56', '2025-07-24 16:28:56'),
('end_009', NULL, 'customer9@example.com', 'Helen', 'Clark', NULL, NULL, NULL, 'end_user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-07-17 16:29:37', '2025-07-24 16:29:37'),
('end_010', NULL, 'customer10@example.com', 'Ivan', 'Lewis', NULL, NULL, NULL, 'end_user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-07-19 16:29:37', '2025-07-24 16:29:37'),
('end_011', NULL, 'customer11@example.com', 'Julia', 'Walker', NULL, NULL, NULL, 'end_user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-07-21 16:29:37', '2025-07-24 16:29:37'),
('end_012', NULL, 'customer12@example.com', 'Kevin', 'Hall', NULL, NULL, NULL, 'end_user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-07-22 16:29:37', '2025-07-24 16:29:37'),
('end_user_demo', NULL, 'user@whitelabelpro.com', 'End', 'User', '$2b$12$Q7UJLs1pLrJS00w/WjTLAumgJVPJwUwrWh0dcfGXNReMGLvLGboea', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-09-17 13:35:18', '2025-09-17 08:38:06'),
('eytfi58ut8nfduf', 'first2', NULL, 'first2', 'first2', '$2b$12$jz1yHx02o1bvv0LMutAEveUlqoM.ndWQ4OMLeiiwwmQ0SKfNRzXkS', NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-10 02:12:16', '2025-08-10 02:12:16'),
('fbd4f0c5-422e-443f-8237-ed69898562ea', 'hammadhammadu', 'hammadisadsaqib@gmail.com', 'hammad', 'end-user', '$2b$10$tz.pynlFR9Dg/TC75NJxhOodD42LQDW2fM6EaXKIRm7qlljwEZerS', NULL, NULL, 'white_label_client', 1, 81, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-17 10:30:55', '2025-10-17 20:39:53'),
('first1414', NULL, 'first1414@example.com', NULL, '', 'hashed_password', NULL, NULL, 'white_label_client', 1, 7, NULL, 'local', 'First User 1414', NULL, NULL, NULL, '2025-10-10 16:45:07', '2025-10-12 13:31:28'),
('fm682enwv01i389', NULL, 'newtest1760778935615@example.com', 'New', 'Test', NULL, NULL, NULL, 'end_user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-18 09:15:35', '2025-10-18 09:15:35'),
('g0u7jstj2qfvohc', 'aass1212', NULL, 'aass', 'aass', '$2b$12$TeJ7exG3zBZljNTpVLwHZOc5Ra1XZZmt19Yl8pwn1nsYGvZRCzxNm', NULL, NULL, 'end_user', 1, 18, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-10 06:45:31', '2025-08-10 06:45:31'),
('guest_1752180079711_g2i8ae', NULL, 'munibahmed@gmail.com', 'munibahmed', 'Customer', NULL, NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-07-10 15:41:19', '2025-07-10 15:41:19'),
('guest_1752180115196_d50l55', NULL, 'munibahme@gmail.com', 'munibahme', 'Customer', NULL, NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-07-10 15:41:55', '2025-07-10 15:41:55'),
('guest_1752180200711_c2p6wz', NULL, 'munibahmed111@gmail.com', 'munibahme', 'Customer', NULL, NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-07-10 15:43:20', '2025-07-10 15:43:20'),
('guest_1752180571926_brr5wt', NULL, 'munibahmed22@gmail.com', 'Munib', 'Ahmed', NULL, NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-07-10 15:49:32', '2025-07-10 15:49:32'),
('guest_1752180877442_686p52', NULL, 'info@theblackstoneconsultants.com', 'John', 'Done', NULL, NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-07-10 15:54:37', '2025-07-10 15:54:37'),
('hua1objl8w40fw7', 'first1414', NULL, 'first1414', 'first1414', '$2b$12$jxQqeyJbdkJ.Heg4cCidf.F2PnVPUarv1vhIC0HOReW7v9qrwNTTy', NULL, NULL, 'end_user', 1, 32, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-10 06:40:24', '2025-10-10 20:52:24'),
('iz2vpsv2u00nlu9', 'epic2244', NULL, 'epic', 'epic', '$2b$12$MTjHZy63r4KvJ4EzZ5/KWu4O1kdbkD31gwoIm.GrW2R39JVUZ/j.a', NULL, NULL, 'end_user', 1, 7, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-13 05:00:21', '2025-08-13 05:00:21'),
('j756dzpftjionpa', 'munibmunib', NULL, 'Munib', 'Saqib', '$2b$12$Mj6GlyXHxRCy.FbczLgiM.9V3p2aLVvAtdiLjVXwTnNTJP9EPC7uK', NULL, NULL, 'end_user', 1, 49, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-20 17:40:00', '2025-08-20 17:40:00'),
('jv13bugizvv8m4q', 'first3', NULL, 'first3', 'first3', '$2b$12$WM3LbH7V/ZE3JXiUwsctCeP69az.629flsGlzDed25L/noc7tbowe', NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-10 02:21:15', '2025-08-10 02:21:15'),
('jwg84z5hawl8jms', 'checking222', NULL, 'Checking222', 'Checking222', '$2b$12$b1aVYSm8ZgahqRTLxtITZ.p0iYxlU6iEtFxkGnDvxnLKEtj5VCi.G', NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-22 21:13:44', '2025-08-22 21:13:44'),
('kui6zoerxwrfl6g', 'epic125', NULL, 'epic', 'ss', '$2b$12$X0CuLYMv2762YJfTiOra..U.Psb4nyH59YEyySiIfLKaFBqdzeIH2', NULL, NULL, 'end_user', 1, 13, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-09 14:05:50', '2025-08-09 14:05:50'),
('m2fmx2u6gelmzg8', 'newuser123', NULL, 'Test', 'User', '$2b$12$DWxwrU955jANMyV9KjyYoetbdYROicivCVB7YwUikuufuPG5mNjHK', NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', 'Test User', NULL, NULL, NULL, '2025-08-07 05:27:42', '2025-08-07 05:27:42'),
('mctx40qbxj25k91', 'munibahmed2', NULL, 'Munib', 'World', '$2b$12$B5bScZg35GkdV47Vu1G76emTzSfMs1GxJXko4VcR2BZM490JN1Jpu', NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-08 03:39:54', '2025-08-08 03:39:54'),
('nxa55whhxu95in1', 'alibagfdi', 'adrwealthadlkjvisorsllc@gmail.com', 'Ali', 'badi', '$2b$12$YK4IhO58pudV9u3H9G/bmeIBIUYQxuuiNsRy9HSgSb52kJjUvUkcO', NULL, NULL, 'super_admin_affiliate', 1, NULL, NULL, 'local', NULL, NULL, NULL, 'alifds', '2025-10-17 22:40:45', '2025-10-17 22:45:48'),
('nxagkqgzvw7yuyb', NULL, 'hammdsdsad@gmail.com', 'test', 'username', NULL, NULL, NULL, 'end_user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-18 09:53:16', '2025-10-18 09:53:16'),
('nxn1sh8n77x34qk', 'testaffiliate123', NULL, 'Test', 'Affiliate', '$2b$12$YKqxMX..trrDB.MkpB158O3oHaW5cKESkpSDLtsv.S5h.wTZ4VmTG', NULL, NULL, 'super_admin_affiliate', 1, NULL, NULL, 'local', NULL, NULL, NULL, 'test', '2025-08-14 05:39:15', '2025-08-14 05:39:15'),
('pp5zhlbdh5iiq2o', 'epic1212', NULL, 'epic', '22', '$2b$12$EqCUb1gvX4vLgyyfkD0Ee.bP57HdPSr4gUJWfXMFpxyfl1J9SVtXS', NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-19 01:55:19', '2025-08-19 01:55:19'),
('q1erwrot7efdcbr', 'four1234', NULL, 'four1234', 'four1234', '$2b$12$MhzbUxg8lKNYdHbFoeXMHeSW8pnSeJTx7dGhIdIW6QOvr8BHKMHrG', NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-10 02:32:04', '2025-08-10 02:32:04'),
('q73yih2yuif8nde', 'affiliatescanner', NULL, 'Affiliate', 'Scanner', '$2b$12$XzwSN2w0Sf5ecDpdIKp5SuB6vejWImMCU9Eh9XZu.KDL.EHydKGMG', NULL, NULL, 'super_admin_affiliate', 1, NULL, NULL, 'local', NULL, NULL, NULL, 'affiliate2', '2025-08-22 21:49:37', '2025-08-22 21:49:37'),
('r1n6d9c0qgjvx2j', 'aadmin', NULL, 'Hammad', 'Saqib', '$2b$12$XmV2LZ3S7NHpGPhq1WO69.a2NfdO7ZXCtBGwTYmIkEPDNi7mBbERK', NULL, NULL, 'super_admin_affiliate', 1, NULL, NULL, 'local', NULL, NULL, NULL, 'hammad', '2025-08-07 23:51:20', '2025-08-07 23:51:20'),
('r1yixgd0a8g1soo', 'checkingufjksdfd', NULL, 'epic', 'asdasd', '$2b$12$ZXQ5/.6.kt43IuTeE6LVFesIB5lDFSuneHC/h6bpJAPpJDXDEfRlW', NULL, NULL, 'super_admin_affiliate', 1, NULL, NULL, 'local', NULL, NULL, NULL, 'epic', '2025-08-13 12:14:10', '2025-08-13 12:14:10'),
('rg1ptrh9mdfgsrz', 'munibrealtryenduser', NULL, 'munib', 'real', '$2b$12$n0ghgyrFLKaPzKfsZNjRgOGm81aoF76KYZ05L3DAG9n0PjnGUafqi', NULL, NULL, 'end_user', 1, 39, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-12 09:28:13', '2025-08-12 09:28:13'),
('rhehxqns9hj0xj6', 'hammadsd', NULL, 'HammadSD', 'SaqibSD', '$2b$12$lpHV9eAt99w6Kr7ZNUEWPuqwFLG.B5Cf1QhXYc9rJOML/RYayYYoC', NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-09 06:51:14', '2025-08-09 06:51:14'),
('spu8bw3d6ynrvs0', 'alibsdfadi', 'adrwealthafdgddvisorsllc@gmail.com', 'Ali', 'badi', '$2b$12$Nol0t1rcG8gIC2RsUVf4i.m3bgPRXTsdTbg2mliTMB3PzD/QJqZ0a', NULL, NULL, 'super_admin_affiliate', 1, NULL, NULL, 'local', NULL, NULL, NULL, 'ali', '2025-10-17 22:48:00', '2025-10-17 22:51:45'),
('ss2iq4hwcaydplz', 'hello22', NULL, 'Munib', 'ma', '$2b$12$ZPjCRqcPoBvn/dl42l353OGFrn3kP/3PRyMZ5WkrIRpaypVKf3cGq', NULL, NULL, 'end_user', 1, 49, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-20 18:40:37', '2025-08-20 18:40:37'),
('super_admin_1', NULL, 'admin@whitelabelpro.com', 'John', 'Admin', '$2b$12$kzU0JSWkjsq1uYK0tK.IqucvYtka8J2HBHsDaghO3QjkAoLKpg3Ba', NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-06-09 20:07:33', '2025-09-17 08:38:04'),
('super_admin_affiliate_demo', NULL, 'affiliate@whitelabelpro.com', 'Super Admin', 'Affiliate', '$2b$12$.q.bgQ8v6rlHkRFO1Du4GuTyihFoFMDU.Hqrz8HWCxv.B72Ojhzdu', 'https://images.unsplash.com/photo-1494790108755-2616b332c777?w=150&h=150&fit=crop&crop=face', NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-09-17 13:35:18', '2025-09-17 08:38:04'),
('super_admin_demo', NULL, 'admin@whitelabelpro.com', 'Super', 'Admin', '$2b$12$kzU0JSWkjsq1uYK0tK.IqucvYtka8J2HBHsDaghO3QjkAoLKpg3Ba', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-09-17 13:35:18', '2025-09-17 08:38:04'),
('super_affiliate_1', NULL, 'affiliate@whitelabelpro.com', 'Sarah', 'Affiliate', '$2b$12$.q.bgQ8v6rlHkRFO1Du4GuTyihFoFMDU.Hqrz8HWCxv.B72Ojhzdu', NULL, NULL, 'super_admin_affiliate', 1, NULL, NULL, 'local', NULL, NULL, NULL, 'sarah', '2025-06-09 20:07:33', '2025-09-17 08:38:04'),
('test_affiliate_001', NULL, 'test.affiliate@example.com', NULL, '', NULL, NULL, NULL, 'super_admin_affiliate', 1, NULL, NULL, 'local', 'Test Affiliate', NULL, NULL, 'testaffiliate', '2025-07-25 14:04:09', '2025-07-25 14:04:09'),
('test-whitelabel-123', NULL, 'test-whitelabel@example.com', NULL, 'Test', 'hashedpassword', NULL, NULL, 'white_label', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-10 18:19:48', '2025-10-10 18:19:48'),
('test-wl-client-1', NULL, 'testclient@business.com', 'John', 'Smith', NULL, NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-06-27 18:31:57', '2025-06-27 18:31:57'),
('test-wl-client-2', NULL, 'sarah@techstartup.io', 'Sarah', 'Johnson', NULL, NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-06-27 18:32:14', '2025-06-27 18:32:14'),
('tp9tzi7ya1wjjyx', 'munib69affiliate', NULL, 'munib', 'affiliate', '$2b$12$UDU79MQ92S0eh3WookimG.B6R//qKhfOT6c3RCFdYvNsZJe4aF.I6', NULL, NULL, 'end_user', 1, 18, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-12 02:17:10', '2025-08-12 02:17:10'),
('tutorial_user_001', 'tutorial', NULL, NULL, '', '$2b$10$dcbZZSudM6lCdS7Bl2zzG.ujUCZeDZhsPnjEw3wm.wMdnxtuFvfc.', NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-07 22:32:22', '2025-08-07 22:32:22'),
('u18o8hwgfhbcz36', 'hammadhammad', 'hammadhammad@example.com', 'hammadi', 'saqib', '$2b$12$W6XxP3UIjjbV6I.ubiWLV.vBdXOxEqBJaRZRVttOW5VhXYbeshJNC', '/api/files/profile_1760474709684-450997118.jpg', NULL, 'affiliate', 1, 7, NULL, 'local', NULL, '03333333', NULL, NULL, '2025-08-19 16:39:05', '2025-10-17 18:37:59'),
('user_1', NULL, 'user@example.com', 'Tom', 'User', NULL, NULL, NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-06-09 20:07:33', '2025-06-09 20:07:33'),
('user_1760034587114_hammadisaqib@gmail.com', NULL, 'hammadisssaqib@gmail.com', 'Hammad', 'Saqib', NULL, NULL, NULL, 'user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-09 13:29:47', '2025-10-17 10:29:49'),
('user_1760035693011_hammadisaqib@gmail.com', NULL, 'hammadisfgaqib@gmail.com', 'Hammad', 'Saqib', NULL, NULL, NULL, 'user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-09 13:48:13', '2025-10-17 10:29:53'),
('user_1760095298953_hammadisaqib@gmail.com', NULL, 'hammadisakjlqib@gmail.com', 'Hammad', 'Saqib', NULL, NULL, NULL, 'user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-10 06:21:38', '2025-10-17 10:29:56'),
('user_1760095439426_hammadisaqib@gmail.com', NULL, 'hammadishkaqib@gmail.com', 'Hammad', 'Saqib', NULL, NULL, NULL, 'user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-10 06:23:59', '2025-10-17 10:29:58'),
('user_1760095765935_hammadisaqib@gmail.com', NULL, 'hammadighjsaqib@gmail.com', 'Hammad', 'Saqib', NULL, NULL, NULL, 'user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-10 06:29:25', '2025-10-17 10:30:01'),
('user_1760096384283_hammadisaqib@gmail.com', NULL, 'hammadhgjisaqib@gmail.com', 'Hammad', 'Saqib', NULL, NULL, NULL, 'user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-10 06:39:44', '2025-10-17 10:30:05'),
('user_1760096466289_hammadisaqib@gmail.com', NULL, 'hammadsdgisaqib@gmail.com', 'Munib', 'Ahmed', NULL, NULL, NULL, 'user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-10 06:41:06', '2025-10-17 10:30:08'),
('user_1760098302979_john.doe@example.com', NULL, 'john.doe@example.com', 'John', 'Doe', NULL, NULL, NULL, 'end_user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-10 07:11:42', '2025-10-10 07:11:42'),
('user_1760474786796_hammad@gmail.com', NULL, 'hammad@gmail.com', 'hammad', 'hammad', NULL, NULL, NULL, 'user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-14 15:46:26', '2025-10-14 15:46:26'),
('user_1760474795415_hammad@gmail.com', NULL, 'hammad@gmail.com', 'hammad', 'hammad', NULL, NULL, NULL, 'user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-14 15:46:35', '2025-10-14 15:46:35'),
('user_1760474814425_hammad@gmail.com', NULL, 'hammad@gmail.com', 'hammad', 'hammad', NULL, NULL, NULL, 'user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-14 15:46:54', '2025-10-14 15:46:54'),
('user_1760474823687_hammad@gmail.com', NULL, 'hammad@gmail.com', 'hammad', 'hammad', NULL, NULL, NULL, 'user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-14 15:47:03', '2025-10-14 15:47:03'),
('user_1760474836182_hammad@gmail.com', NULL, 'hammad@gmail.com', 'hammad', 'hammad', NULL, NULL, NULL, 'user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-14 15:47:16', '2025-10-14 15:47:16'),
('user_1760474989560_hammad@gmail.com', NULL, 'hammad@gmail.com', 'hammad', 'hammad', NULL, NULL, NULL, 'user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-14 15:49:49', '2025-10-14 15:49:49'),
('user_1760478582585_hammad@gmail.com', NULL, 'hammad@gmail.com', 'hammad', 'hammad', NULL, NULL, NULL, 'user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-14 16:49:42', '2025-10-14 16:49:42'),
('user_1760645477813_hammad@gmail.com', NULL, 'hammad@gmail.com', 'hammad', 'saqib', NULL, NULL, NULL, 'user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-16 15:11:17', '2025-10-16 15:11:17'),
('user_1760746933975_hammad@gmail.com', NULL, 'hammad@gmail.com', 'hammad', 'hammad', NULL, NULL, NULL, 'user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-17 19:22:13', '2025-10-17 19:22:13'),
('user_1760746995069_hammad@gmail.com', NULL, 'hammad@gmail.com', 'hammad', 'hammad', NULL, NULL, NULL, 'user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-17 19:23:15', '2025-10-17 19:23:15'),
('user_1760747196391_hammad@gmail.com', NULL, 'hammad@gmail.com', 'hammad', 'hammad', NULL, NULL, NULL, 'user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-17 19:26:36', '2025-10-17 19:26:36'),
('user_1760747275753_hammad@gmail.com', NULL, 'hammad@gmail.com', 'hammad', 'saqib', NULL, NULL, NULL, 'user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-17 19:27:55', '2025-10-17 19:27:55'),
('user_1760747456617_hammad@gmail.com', NULL, 'hammad@gmail.com', 'hammad', 'hammad', NULL, NULL, NULL, 'user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-17 19:30:56', '2025-10-17 19:30:56'),
('user_1760747555936_hammad@gmail.com', NULL, 'hammad@gmail.com', 'Affiliate', 'hammad', NULL, NULL, NULL, 'user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-17 19:32:35', '2025-10-17 19:32:35'),
('user_1760747679296_hammad@gmail.com', NULL, 'hammad@gmail.com', 'hammad', 'hammad', NULL, NULL, NULL, 'user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-17 19:34:39', '2025-10-17 19:34:39'),
('user_1760747791238_hammad@gmail.com', NULL, 'hammad@gmail.com', 'hammad', 'hammad', NULL, NULL, NULL, 'user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-17 19:36:31', '2025-10-17 19:36:31'),
('user_1760748262704_hammad@gmail.com', NULL, 'hammad@gmail.com', 'hammad', 'saqib', NULL, NULL, NULL, 'user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-17 19:44:22', '2025-10-17 19:44:22'),
('user_1760748333137_hammad@gmail.com', NULL, 'hammad@gmail.com', 'Affiliate', 'hammad', NULL, NULL, NULL, 'user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-17 19:45:33', '2025-10-17 19:45:33'),
('user_1760778198497_test@example.com', NULL, 'test@example.com', 'Test', 'User', NULL, NULL, NULL, 'user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-18 04:03:18', '2025-10-18 04:03:18'),
('user_1760778221347_hammad@gmail.com', NULL, 'hammad@gmail.com', 'hammad', 'hammad', NULL, NULL, NULL, 'user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-18 04:03:41', '2025-10-18 04:03:41'),
('user_1760778666931_testuser@example.com', NULL, 'testuser@example.com', 'Test', 'User', NULL, NULL, NULL, 'user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-18 04:11:06', '2025-10-18 04:11:06'),
('user_1760778710058_testuser@example.com', NULL, 'testuser@example.com', 'Test', 'User', NULL, NULL, NULL, 'user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-18 04:11:50', '2025-10-18 04:11:50'),
('user_1760778824475_testuser@example.com', NULL, 'testuser@example.com', 'Test', 'User', NULL, NULL, NULL, 'user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-18 04:13:44', '2025-10-18 04:13:44'),
('user_1760778866172_hammad@gmail.com', NULL, 'hammad@gmail.com', 'hammad', 'hammad', NULL, NULL, NULL, 'user', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-18 04:14:26', '2025-10-18 04:14:26'),
('white_label_affiliate_demo', NULL, 'wlaffiliate@whitelabelpro.com', 'WL', 'Affiliate', '$2b$12$0lTISD2NeJUfSqSgN66Qw.CG6Dw3fiu26iGT7gz.adWc3Sbqj1MCW', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', NULL, 'white_label_client', 1, 7, NULL, 'local', NULL, NULL, NULL, NULL, '2025-09-17 13:35:18', '2025-10-12 12:49:15'),
('white_label_client_demo', NULL, 'hammadisaqiib@gmail.com', 'White-Label', 'Client', '$2b$12$dUaquycqyfjvsY2sQ3IuuOKmw/Ta/JP/GecAZlh6O9x.T3uxlWjzK', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', NULL, 'white_label_client', 1, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-09-17 13:35:18', '2025-09-23 12:49:58'),
('yx2a1265l5xqv1t', 'first222', NULL, 'first222', 'first222', '$2b$12$jTvIHPA/JPJtqEHV6E2Xue8LQExM3D0cUNTURHFCX0JRtc/YLBJAy', NULL, NULL, 'end_user', 1, 17, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-10 02:47:55', '2025-08-10 02:47:55'),
('zpv1hwu56h14u88', 'testing1', NULL, 'testing1', 'testing1', '$2b$12$A3idmuV1nbM2gQt1muPeZefOnCS93bfHek5FltyKiMFlhx7K8JYMW', NULL, NULL, 'end_user', 1, 7, NULL, 'local', NULL, NULL, NULL, NULL, '2025-08-12 02:21:06', '2025-08-12 02:21:06');

-- --------------------------------------------------------

--
-- Table structure for table `user_preferences`
--

CREATE TABLE `user_preferences` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `user_id` varchar(255) NOT NULL,
  `theme` varchar(50) DEFAULT 'light',
  `primary_color` varchar(7) DEFAULT '#3b82f6',
  `secondary_color` varchar(7) DEFAULT '#64748b',
  `logo_url` text DEFAULT NULL,
  `language` varchar(10) DEFAULT 'en',
  `timezone` varchar(50) DEFAULT 'UTC',
  `currency` varchar(3) DEFAULT 'USD',
  `email_notifications` tinyint(1) DEFAULT 1,
  `marketing_emails` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_preferences`
--

INSERT INTO `user_preferences` (`id`, `created_at`, `updated_at`, `user_id`, `theme`, `primary_color`, `secondary_color`, `logo_url`, `language`, `timezone`, `currency`, `email_notifications`, `marketing_emails`) VALUES
(1, '2025-08-14 01:52:21', '2025-10-14 08:53:44', '44187263', 'system', '#ff00dd', '#4c00ff', NULL, 'en', 'UTC', 'USD', 0, 0),
(2, '2025-08-14 01:52:25', '2025-10-16 19:02:42', '43537113', 'light', '#0052f5', '#0daf87', NULL, 'en', 'UTC', 'USD', 1, 0),
(3, '2025-08-14 02:02:08', '2025-08-14 02:03:54', 'd29oee2p96xfn06', 'light', '#002d8f', '#64748B', NULL, 'en', 'UTC', 'USD', 1, 0),
(4, '2025-08-14 07:47:04', '2025-08-14 07:53:02', '5qa8llwaph4fhut', 'dark', '#ff0000', '#ffff00', NULL, 'en', 'UTC', 'USD', 1, 0),
(5, '2025-08-18 20:55:27', '2025-08-18 20:55:27', 'pp5zhlbdh5iiq2o', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', 1, 0),
(6, '2025-08-18 21:01:51', '2025-08-18 21:07:39', '2eo8zb2e3dqomeb', 'light', '#2563EB', '#ffffff', NULL, 'en', 'UTC', 'USD', 1, 0),
(7, '2025-08-19 11:42:06', '2025-08-19 11:42:06', '8m691wqlghkf3nc', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', 1, 0),
(8, '2025-08-22 16:13:52', '2025-08-22 16:13:52', 'jwg84z5hawl8jms', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', 1, 0),
(9, '2025-08-23 10:21:38', '2025-08-23 10:21:38', '1fykk71x0x07yod', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', 1, 0),
(10, '2025-08-29 04:01:21', '2025-08-29 04:01:21', 'c0c8zgzt7hi4hr0', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', 1, 0),
(11, '2025-08-30 13:14:21', '2025-08-30 13:14:21', '8252680b-4060-4da5-a893-0a1e8349df39', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', 1, 0),
(12, '2025-08-30 13:31:02', '2025-08-30 13:31:02', '9a280199-284f-47de-9cea-bf5c1844c343', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', 1, 0),
(13, '2025-08-31 07:41:57', '2025-08-31 07:41:57', '1756662017869_muneeb', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', 1, 0),
(14, '2025-09-03 03:23:08', '2025-09-03 03:23:32', 'q1erwrot7efdcbr', 'light', '#2563EB', '#ffffff', NULL, 'en', 'UTC', 'USD', 1, 0),
(15, '2025-09-03 03:25:15', '2025-09-03 03:25:15', 'test-wl-client-2', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', 1, 0),
(16, '2025-09-10 05:04:46', '2025-09-10 05:04:46', 'ded4aec0-4909-4ef0-bf15-7fcb11748131', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', 1, 0),
(17, '2025-09-13 07:27:41', '2025-09-13 07:27:41', 'c3082ce4-1026-4d8a-a517-e2366d0e9164', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', 1, 0),
(18, '2025-09-13 08:27:50', '2025-09-13 08:27:50', '4f725c6a-c57e-47de-b1a3-a8bf81965cdf', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', 1, 0),
(19, '2025-09-13 08:54:13', '2025-09-13 08:54:13', '6e66111b-3ad3-4613-84ce-fa4c6e8e973c', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', 1, 0),
(20, '2025-09-13 09:14:46', '2025-09-13 09:14:46', '9221adef-ab0a-47a4-b844-a6fa529d3aad', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', 1, 0),
(21, '2025-09-13 10:15:40', '2025-09-13 10:15:40', '7b3143a3-a880-45d8-aab8-998aa3557f32', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', 1, 0),
(22, '2025-09-14 05:58:34', '2025-09-14 05:58:34', '6e5cb5fb-6b38-41fb-88e5-fcf235f39fc5', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', 1, 0),
(23, '2025-09-15 05:49:42', '2025-09-15 05:49:42', 'cc3100ce-940e-4156-a0ae-de338282fafb', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', 1, 0),
(24, '2025-09-19 07:54:11', '2025-09-19 07:54:11', '62b7hiatqx20iaj', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', 1, 0),
(25, '2025-09-19 22:19:52', '2025-09-19 22:26:20', '1758320372285_testing1221', 'dark', '#2563EB', '#000000', NULL, 'en', 'UTC', 'USD', 1, 0),
(26, '2025-09-20 10:27:33', '2025-09-20 10:27:33', '00fb5fb2-932f-45da-9fa1-60403f078f32', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', 1, 0),
(27, '2025-09-20 14:24:54', '2025-09-20 14:24:54', 'white_label_client_demo', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', 1, 0),
(28, '2025-09-23 17:31:59', '2025-09-23 20:30:13', '44377090', 'light', '#2563EB', '#ffffff', NULL, 'en', 'UTC', 'USD', 1, 0),
(29, '2025-10-09 14:57:20', '2025-10-09 14:57:20', 'hua1objl8w40fw7', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', 1, 0),
(30, '2025-10-10 20:13:41', '2025-10-10 20:13:41', '35m0crql3jbwdg5', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', 1, 0),
(31, '2025-10-11 08:21:12', '2025-10-11 08:21:12', '26tje8w7lymxwlj', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', 1, 0),
(32, '2025-10-12 11:53:59', '2025-10-12 11:53:59', 'iz2vpsv2u00nlu9', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', 1, 0),
(33, '2025-10-14 20:44:55', '2025-10-14 20:44:55', 'u18o8hwgfhbcz36', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', 1, 0),
(34, '2025-10-15 12:49:35', '2025-10-15 12:49:35', '53cnffx7v02h7if', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', 1, 0),
(35, '2025-10-17 10:30:56', '2025-10-17 10:30:56', 'fbd4f0c5-422e-443f-8237-ed69898562ea', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', 1, 0),
(36, '2025-10-17 20:43:38', '2025-10-17 20:43:38', '128cf820-2f12-439d-b994-0213c5eb5219', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', 1, 0),
(37, '2025-10-17 22:40:58', '2025-10-17 22:40:58', 'nxa55whhxu95in1', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', 1, 0),
(38, '2025-10-17 22:48:28', '2025-10-17 22:48:28', 'spu8bw3d6ynrvs0', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', 1, 0),
(39, '2025-10-17 22:53:32', '2025-10-17 22:53:32', 'e2m3st59vmryro0', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `user_sessions`
--

CREATE TABLE `user_sessions` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `user_id` varchar(255) DEFAULT NULL,
  `white_label_id` varchar(255) DEFAULT NULL,
  `session_token` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `last_active_at` datetime DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_sessions`
--

INSERT INTO `user_sessions` (`id`, `created_at`, `updated_at`, `user_id`, `white_label_id`, `session_token`, `is_active`, `ip_address`, `user_agent`, `last_active_at`, `expires_at`) VALUES
(1, '2025-08-20 12:50:57', '2025-09-17 18:32:32', 'j756dzpftjionpa', '51', 'GXrcq_Tsu_mCYbIC-gKsYAO6mgRcERP2', 1, '10.82.4.66', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-08-20 17:50:57', NULL),
(2, '2025-08-20 12:57:21', '2025-09-17 18:32:32', '62b7hiatqx20iaj', '50', 'Ng_HgJNNRHxdR8849gNVRRC23kKR41fE', 1, '10.82.0.185', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-08-20 17:57:21', NULL),
(3, '2025-08-20 13:19:25', '2025-09-17 18:32:32', '7rjtsyeijw0i8zi', '52', 'MTEoW_qjwr57CEMf17HYfmjZDWlKjeRJ', 1, '10.82.0.185', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-08-20 18:19:25', NULL),
(4, '2025-08-20 13:20:58', '2025-09-17 18:32:32', '7rjtsyeijw0i8zi', '52', 'mdiUwZ2UXCir-iS1FJiB-tk9M-CWcVuV', 1, '10.82.0.185', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-08-20 18:20:58', NULL),
(5, '2025-08-20 13:41:20', '2025-09-17 18:32:32', 'ss2iq4hwcaydplz', '53', 'EHgvrKK9C3w3DgcnHkvnXQMybWf9YeDK', 1, '10.82.1.57', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-08-20 18:41:20', NULL),
(6, '2025-08-20 14:10:51', '2025-09-17 18:32:32', '43537113', '2', 'R3aqfXTMte_yrpFeM2uO2mwGewAE93TT', 0, '34.60.193.23', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-13 17:12:10', NULL),
(7, '2025-08-20 15:09:39', '2025-09-23 16:41:48', '44187263', '7', 'eD0WZN0ROyeFz7_aiXOCqLaR5wy2crcY', 0, '10.82.1.88', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-23 21:41:48', NULL),
(8, '2025-08-20 15:56:36', '2025-09-17 18:32:32', '43537113', '2', 'EeWZSFBBNYYfilvZfsY9spSeV1zUM3n8', 0, '10.82.9.81', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-13 17:12:10', NULL),
(9, '2025-08-20 17:59:40', '2025-09-23 16:41:48', '44187263', '7', 'i0vTVZkKddDokCBrPx6YGzfAOxXj2jEh', 0, '10.82.3.29', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-23 21:41:48', NULL),
(10, '2025-08-21 11:51:00', '2025-09-17 18:32:32', '43537113', '2', 'OO9yw-xmQP02q8n_lpbKU1RBW2Xsmtuk', 0, '34.45.106.16', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-13 17:12:10', NULL),
(11, '2025-08-23 08:37:28', '2025-09-23 16:41:48', '44187263', '7', 'U8KofEJYGZZBYOPXI9vF8aHSrIxT9MrM', 0, '10.82.1.136', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-23 21:41:48', NULL),
(12, '2025-08-23 10:08:06', '2025-09-17 18:32:32', '6kk4onsspvzjoml', NULL, 'aJxOVqATOOG0EnGemGPj7GZSnCGKvgkt', 1, '10.82.3.76', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-08-23 15:08:06', NULL),
(13, '2025-08-23 10:09:30', '2025-09-17 18:32:32', '53cnffx7v02h7if', NULL, 'Sp7pl-_XR3peR1fmwstVGVXVWgyTdki5', 1, '10.82.0.122', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-08-23 15:09:30', NULL),
(14, '2025-08-23 10:38:07', '2025-09-17 18:32:32', '6kk4onsspvzjoml', NULL, 'Hm4MYwX8qW0zqt8zmi5DYau0rhT178bt', 1, '10.82.5.119', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-08-23 15:38:07', NULL),
(15, '2025-08-23 11:07:52', '2025-09-17 18:32:32', 'db4k9owwms65bna', NULL, 'RZjtoj5WFXsgiEgMLpUm7LpV2wjnPSqU', 1, '10.82.5.119', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-08-23 16:07:52', NULL),
(16, '2025-08-24 04:32:40', '2025-09-23 16:41:48', '44187263', '7', 'ltZ7LKn9MKjCw-WIYzME0zK5J4LLUqxi', 0, '34.58.89.73', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36', '2025-09-23 21:41:48', NULL),
(17, '2025-08-24 05:50:44', '2025-09-17 18:32:32', 'db4k9owwms65bna', NULL, 'BxxDug7aj463L4sRA85d86Us0vYYBL5a', 1, '10.82.9.147', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-08-24 10:50:44', NULL),
(18, '2025-08-29 03:22:17', '2025-09-17 18:32:32', '43537113', '2', 'mWJ9E_rMzfbQyh-aq500zbH3E2vhgiVU', 0, '10.82.1.205', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-13 17:12:10', NULL),
(19, '2025-08-29 03:22:51', '2025-09-17 18:32:32', '8m691wqlghkf3nc', '49', 'j5wwuaeIBlw54gUb1qFSFipILmRzTcGh', 1, '10.82.6.222', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-08-29 08:22:51', NULL),
(20, '2025-08-29 03:22:56', '2025-09-17 18:32:32', '53cnffx7v02h7if', NULL, '5zsHjlialqfIr2GOCxW5uWkzi-BWSHO2', 1, '10.82.10.43', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-08-29 08:22:56', NULL),
(21, '2025-08-29 03:47:58', '2025-09-17 18:32:32', '43537113', '2', '2qdXQ3lMGwiUvn7XUKOrwe6UUhKDjOZ_', 0, '10.82.10.43', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-13 17:12:10', NULL),
(22, '2025-08-29 03:59:26', '2025-09-17 18:32:32', '53cnffx7v02h7if', NULL, '09dG1HaU96XCIxpBhXEINRFGW_4AvFDg', 1, '10.82.6.222', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-08-29 08:59:26', NULL),
(23, '2025-08-29 10:37:57', '2025-09-23 16:41:48', '44187263', '7', 'AUZFLm-hBKwyxOA0Gx1uhFROabbxtA9J', 0, '10.82.4.151', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-23 21:41:48', NULL),
(24, '2025-08-29 11:01:56', '2025-09-17 18:32:32', 'aff_001', NULL, '4vRnghACB8OODKfmdUQs92pCY3Y0K84-', 1, '10.82.4.151', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-08-29 16:01:56', NULL),
(25, '2025-08-29 11:08:59', '2025-09-17 18:32:32', '6kk4onsspvzjoml', NULL, 'ygutFwJkKXFykubFsmLzYYLM_10JJZFf', 1, '10.82.2.133', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-08-29 16:08:59', NULL),
(26, '2025-08-29 11:19:25', '2025-09-17 18:32:32', '44915301', '12', '0QOapPzwYVheeslPILpImxY8CiX4eWE_', 1, '10.82.4.151', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-08-29 16:19:25', NULL),
(27, '2025-08-29 11:21:36', '2025-09-17 18:32:32', 'aff_002', NULL, 'KYgj28NLujTR-w4kPGbUlj4yLwVw_zUA', 1, '10.82.1.205', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-08-29 16:21:36', NULL),
(28, '2025-08-29 11:28:19', '2025-09-17 18:32:32', '44915301', '12', 'tBMzWmZEqv3Q7PpKFsnNrhHy9hkKXLqK', 1, '10.82.3.48', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-08-29 16:28:19', NULL),
(29, '2025-08-29 11:29:03', '2025-09-17 18:32:32', '6kk4onsspvzjoml', NULL, 'OPpFrh3YlyzBEnTuoXA1Ec0VM4aYMeqx', 1, '10.82.1.205', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-08-29 16:29:03', NULL),
(30, '2025-08-29 11:33:28', '2025-09-17 18:32:32', '53cnffx7v02h7if', NULL, 'eCkE6A77aFoAMI0rAAyC99XxAvqY5yBG', 1, '10.82.4.151', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-08-29 16:33:28', NULL),
(31, '2025-08-29 11:35:11', '2025-09-17 18:32:32', 'db4k9owwms65bna', NULL, '87AY3Zh4Ks6F89P9wn1-ER3FadQiqjQ4', 1, '10.82.6.222', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-08-29 16:35:11', NULL),
(32, '2025-08-29 11:39:16', '2025-09-17 18:32:32', '43537113', '2', 'C2Twgvelahgip8Kd7F2MYb9IFQRZu2rp', 0, '10.82.6.222', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-13 17:12:10', NULL),
(33, '2025-08-29 11:58:22', '2025-09-17 18:32:32', '6kk4onsspvzjoml', NULL, 'TxqAgwgzjCIhv3_pZQ1PgYYIEfZblBZb', 1, '10.82.10.43', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-08-29 16:58:22', NULL),
(34, '2025-08-29 11:59:47', '2025-09-17 18:32:32', 'aff_001', NULL, 'BTIL04kdBrhYcjrVA5TOvbR8qlHfS_Wj', 1, '10.82.3.48', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-08-29 16:59:47', NULL),
(35, '2025-08-29 12:00:32', '2025-09-17 18:32:32', 'aff_002', NULL, 'msYxNkHCUjmkjFATBKjPPnEd4WCgMH-B', 1, '10.82.2.133', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-08-29 17:00:32', NULL),
(36, '2025-08-29 14:47:58', '2025-09-17 18:32:32', '43537113', '2', '7se2qwMHqhA4Q2aA2gsdvtSggbEaC8iH', 0, '34.30.225.124', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-13 17:12:10', NULL),
(37, '2025-08-30 13:33:55', '2025-09-17 18:32:32', '43537113', '2', 'EmCUOn9i_dRJBsC3tFIOtkE_X7yKe-Su', 0, '10.82.12.45', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-13 17:12:10', NULL),
(38, '2025-08-30 13:38:10', '2025-09-23 16:41:48', '44187263', '7', '03UpOcZqgaDHJuleDL7xxbA1PddNWlhc', 0, '10.82.2.133', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-23 21:41:48', NULL),
(39, '2025-08-31 07:41:49', '2025-09-17 18:32:32', '1756662017869_muneeb', '67', 'KKedT9KpXoGeqV1B7YaIKdIEvD_C7yl8', 1, '10.82.12.45', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-08-31 12:41:49', NULL),
(40, '2025-08-31 07:42:55', '2025-09-23 16:41:48', '44187263', '7', '4sa-iPhFuDOm0CAnKvK5OqNEtF1Kv9x4', 0, '10.82.3.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-23 21:41:48', NULL),
(41, '2025-08-31 08:24:30', '2025-09-17 18:32:32', '43537113', '2', 'Bw3rF8X0D_u9SbFEszBetpOhCtZetKC5', 0, '10.82.7.40', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-13 17:12:10', NULL),
(42, '2025-08-31 08:25:14', '2025-09-17 18:32:32', '43537113', '2', '7devMDnjNWjO0serFg4KGmxLtkCbx1se', 0, '10.82.5.3', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-13 17:12:10', NULL),
(43, '2025-08-31 08:26:23', '2025-09-23 16:41:48', '44187263', '7', 'Sa-Sfmxhegy9AHJ3lSpdxrn2V8Kshq3O', 0, '10.82.7.40', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-23 21:41:48', NULL),
(44, '2025-08-31 08:27:28', '2025-09-23 16:41:48', '44187263', '7', 'N2KKHhIND37ge_puMVJfaP2lMrMiPbV2', 0, '10.82.2.2', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-23 21:41:48', NULL),
(45, '2025-08-31 08:27:58', '2025-09-17 18:32:32', '43537113', '2', 'KCEM5lqg_P6TL4nLDfi_bHt7B2ttFLIV', 0, '10.82.5.3', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-13 17:12:10', NULL),
(46, '2025-08-31 09:00:12', '2025-09-17 18:32:32', '43537113', '2', 'YIWJLKCT_F85B5nsSVAcSujN7V9yfiKE', 0, '34.69.46.147', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-13 17:12:10', NULL),
(47, '2025-08-31 09:07:07', '2025-09-17 18:32:32', '6kk4onsspvzjoml', NULL, 'ExcGtViLSK65ZkAzPA_c6ZVWJsfftaW3', 1, '34.69.46.147', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-08-31 14:07:07', NULL),
(48, '2025-08-31 21:39:51', '2025-09-17 18:32:32', '6kk4onsspvzjoml', NULL, '1WV232lAMoWrw2y3UVWzPprm7rlGf14C', 1, '34.69.46.147', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-01 02:39:51', NULL),
(49, '2025-08-31 22:40:06', '2025-09-17 18:32:32', '6kk4onsspvzjoml', NULL, '6FlPAi9DSsxzhqQMbil_PSsl3ph8Grqv', 1, '34.58.89.73', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-09-01 03:40:06', NULL),
(50, '2025-09-10 05:06:00', '2025-09-17 18:32:32', '6kk4onsspvzjoml', NULL, 'LWhLn-Jqdmq2YdtqsgNpaYhzU4rCGfJf', 1, '34.133.76.182', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36', '2025-09-10 10:06:00', NULL),
(51, '2025-09-13 04:11:53', '2025-09-17 18:32:32', '43537113', '2', '-3tMBiX0jkytScJWetQAhlq_Op_s3HTZ', 0, '10.82.5.107', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-13 17:12:10', NULL),
(52, '2025-09-13 04:13:45', '2025-09-23 16:41:48', '44187263', '7', 'xj2GbxLpivG2ojnaYE4Ib48n1x3IJa0W', 0, '10.82.3.36', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-23 21:41:48', NULL),
(53, '2025-09-13 07:18:38', '2025-09-17 18:32:32', '43537113', '2', '5DLxgKAwxiO4xMgSTSRlWwQK8JyxmFBv', 0, '10.82.6.193', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-13 17:12:10', NULL),
(54, '2025-09-13 07:28:22', '2025-09-17 18:32:32', 'c3082ce4-1026-4d8a-a517-e2366d0e9164', '69', 'f5MBWBvrbJ1A940bslK5guz8gUr0CaS1', 1, '10.82.4.123', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-13 12:28:22', NULL),
(55, '2025-09-13 08:16:37', '2025-09-23 16:41:48', '44187263', '7', 'mzG1PG1GQx9k0aqopxYSatv_TgN0QFVf', 0, '10.82.11.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-23 21:41:48', NULL),
(56, '2025-09-13 08:22:43', '2025-09-23 16:41:48', '44187263', '7', 'WjNWfuaZ6Vt3YeVfPWzVi-hSuk_h4_TC', 0, '10.82.12.196', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-23 21:41:48', NULL),
(57, '2025-09-13 08:33:08', '2025-09-17 18:32:32', 'c3082ce4-1026-4d8a-a517-e2366d0e9164', '69', 'H5Jc2h3bKAwGetUkVpGCvhQDBNbe6a1r', 1, '10.82.12.196', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-13 13:33:08', NULL),
(58, '2025-09-13 08:46:17', '2025-09-17 18:32:32', 'c3082ce4-1026-4d8a-a517-e2366d0e9164', '69', 'bW0kSAHvSIY7QV6O2s2As_Jk6BiwQYTE', 1, '10.82.2.159', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-13 13:46:17', NULL),
(59, '2025-09-13 08:48:47', '2025-09-17 18:32:32', 'c3082ce4-1026-4d8a-a517-e2366d0e9164', '69', 'p9gtAUlII8Z94nyEBFpwtFt4OxFMuR7Z', 1, '10.82.6.193', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-13 13:48:47', NULL),
(60, '2025-09-13 12:03:48', '2025-09-17 18:32:33', '43537113', '2', 'xSU9a9V0Q5LSkh0SOyCeDlr-PQlglr3S', 0, '10.82.4.123', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-13 17:12:10', NULL),
(61, '2025-09-13 12:12:21', '2025-09-17 18:32:33', '43537113', '2', 'EW_bv3EgO_CIqQnDzCNeXXnACBLKJbf3', 1, '34.30.242.206', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-13 17:12:21', NULL),
(62, '2025-09-14 06:01:31', '2025-09-17 18:32:33', '6e5cb5fb-6b38-41fb-88e5-fcf235f39fc5', '74', 'MFzE_P07CP-m6TL2I_IAFnJqE0hGGlCU', 1, '34.30.225.124', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '2025-09-14 11:01:31', NULL),
(63, '2025-09-15 04:51:57', '2025-09-17 18:32:33', '43537113', '2', 'HyWlrIsSUzxL2rgvvyvq2eAv9Vaj6Rt4', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-15 09:51:57', NULL),
(64, '2025-09-15 04:53:03', '2025-09-17 18:32:33', '43537113', '2', 'fC9H9EIYx6pESSIjDPUmgZIPRIY7I_lZ', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-15 09:53:03', NULL),
(65, '2025-09-15 04:53:33', '2025-09-17 18:32:33', '43537113', '2', '0qn_XmJVaC81bXjBU3dJ8PbxKFFr4Ray', 1, '34.136.244.224', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-15 09:53:33', NULL),
(66, '2025-09-15 04:54:57', '2025-09-17 18:32:33', '43537113', '2', 'fePTN32OL_nvMY7ypgZ21WqQqxL3krcb', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-15 09:54:57', NULL),
(67, '2025-09-15 04:56:48', '2025-09-23 16:41:48', '44187263', '7', '1Bm7dAvaTnWgseMaY9eJHsfA1Ae_hh8e', 0, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-23 21:41:48', NULL),
(68, '2025-09-15 05:50:21', '2025-09-17 18:32:33', '43537113', '2', 'ghIsz6w2fcTinH5Mqq_pKfrns4upt4iC', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-15 10:50:21', NULL),
(69, '2025-09-15 05:57:47', '2025-09-17 18:32:33', '9221adef-ab0a-47a4-b844-a6fa529d3aad', '72', '13g-KQtWiCHTBvQ-7yDnhztavlEik6nQ', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-15 10:57:47', NULL),
(70, '2025-09-15 06:02:48', '2025-09-23 16:41:48', '44187263', '7', 'jgLRM7AzNnKoAdp9O2MtwjoN5l5IzWbc', 0, '34.59.60.32', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-23 21:41:48', NULL),
(71, '2025-09-15 06:03:43', '2025-09-23 16:41:48', '44187263', '7', '4pe81VT6QfYDwy7aOFkOiXPYwmX4MH3j', 0, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-23 21:41:48', NULL),
(72, '2025-09-15 06:20:31', '2025-09-17 18:32:33', '6kk4onsspvzjoml', NULL, 'XnVlZocsIphDtFpxPtkl4EX4OjUtqRT4', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-15 11:20:31', NULL),
(73, '2025-09-16 14:04:06', '2025-09-17 18:32:33', '43537113', '2', 'tN_IsJlhYRcJMzWuHlvPKzsBIvTNdLXv', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-16 19:04:06', NULL),
(74, '2025-09-16 14:06:03', '2025-09-17 18:32:33', '43537113', '2', '1bdH9YPzPpy3b2C2UNFonUuWG4l5Jn5O', 1, '35.223.5.74', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-16 19:06:03', NULL),
(75, '2025-09-17 03:48:45', '2025-09-17 18:32:33', '43537113', '2', 'jW-qmU1sa4Auf6Ov-3FuNIF8RWeSyfH9', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-17 08:48:45', NULL),
(76, '2025-09-17 03:49:19', '2025-09-17 18:32:33', '43537113', '2', 'HeMXvB_hVLO4gh7aP13ZapjAT9dHLTiL', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-17 08:49:19', NULL),
(77, '2025-09-17 03:49:38', '2025-09-23 16:41:48', '44187263', '7', 'c70N1bBsafGKYwixCBK41v9HQukt__Zt', 0, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-23 21:41:48', NULL),
(78, '2025-09-17 03:51:54', '2025-09-17 18:32:33', '6kk4onsspvzjoml', NULL, 'WV9k3mdR21Z_d5wjBOA0IWBxqv1W3Y-j', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-17 08:51:54', NULL),
(79, '2025-09-17 03:52:21', '2025-09-23 16:41:48', '44187263', '7', 'PwHrJQVwiXSAT6h6ytWhMZ2WQlf6uMsN', 0, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-23 21:41:48', NULL),
(80, '2025-09-21 20:18:15', '2025-09-21 20:18:15', '43537113', '2', 'mPlrbJVU9fcV0H8xNGcZCdCp4zd1fV6M', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-22 01:18:15', NULL),
(81, '2025-09-21 20:32:24', '2025-09-23 16:41:48', '44187263', '7', 'PIGA3KlGcvOaWR-8gTno0ugGcSHDVLrP', 0, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-23 21:41:48', NULL),
(82, '2025-09-21 20:44:54', '2025-09-21 20:44:54', '43537113', '2', 'wYe-0-kQJ4BnMIM4htfcYstBAyzdJcYZ', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Trae/1.100.3 Chrome/132.0.6834.210 Electron/34.5.1 Safari/537.36', '2025-09-22 01:44:54', NULL),
(83, '2025-09-21 21:02:36', '2025-09-21 21:02:36', '43537113', '2', 'k5IKLHjNyIpepB_RiQbBhO-uzUdUznsE', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-22 02:02:36', NULL),
(84, '2025-09-22 11:52:32', '2025-09-22 11:52:32', '43537113', '2', 'tYJVE5sAMOw4UWaLTZwJlM49RZzY32_N', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-22 16:52:32', NULL),
(85, '2025-09-22 11:52:53', '2025-09-22 11:52:53', '43537113', '2', 'VVHDrP-WLWWtt4TZrFGmIzwUj6zVQSon', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-22 16:52:53', NULL),
(86, '2025-09-22 12:53:38', '2025-09-22 12:53:38', '43537113', '2', 'TXZfqrdXaJG0naL8IdXf4w3DjhY1-Ak7', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-22 17:53:38', NULL),
(87, '2025-09-22 14:18:51', '2025-09-23 16:41:48', '44187263', '7', 'B4SWpHDLGiGj2SwGaNe8I-gLd3FvZVy1', 0, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-23 21:41:48', NULL),
(88, '2025-09-22 14:20:53', '2025-09-23 16:41:48', '44187263', '7', 'hc0dnIpegeBmRq5mDYq4p5ZRMlobSIiM', 0, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Trae/1.100.3 Chrome/132.0.6834.210 Electron/34.5.1 Safari/537.36', '2025-09-23 21:41:48', NULL),
(89, '2025-09-22 15:00:55', '2025-09-22 15:00:55', '43537113', '2', 'E87ut7wSdH-ecuSK96qERr_0FP9t5hYn', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-22 20:00:55', NULL),
(90, '2025-09-22 15:28:24', '2025-09-23 16:41:48', '44187263', '7', 'AX2OV8gmga19TgJoRQGnfv0BD6nD8Uel', 0, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-23 21:41:48', NULL),
(91, '2025-09-22 23:03:47', '2025-09-22 23:03:47', '43537113', '2', 'zDKHiA3eFpVU7WZyxX5gy1Dc8nKIO5pr', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-23 04:03:47', NULL),
(92, '2025-09-23 01:59:34', '2025-09-23 01:59:34', '43537113', '2', 'naPEeAKDVadhtWJebsGVT02gQMpg4-76', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-23 06:59:34', NULL),
(93, '2025-09-23 12:36:11', '2025-09-23 12:36:11', '43537113', '2', 'UERrjYWGyB_18lCV0HNzu6xlo4GF31rr', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-23 17:36:11', NULL),
(94, '2025-09-23 12:38:09', '2025-09-23 12:38:09', '43537113', '2', 'jdKD9u2xWh6HzbZTrMfjnVB15ygadhoC', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-23 17:38:09', NULL),
(95, '2025-09-23 12:54:57', '2025-09-23 16:41:48', '44187263', '7', 'C0Fesa6xpd2yJ0pL0sPvwPU2vfM3_PbR', 0, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-23 21:41:48', NULL),
(96, '2025-09-23 16:19:24', '2025-09-23 16:19:24', '43537113', '2', 'g_aNmGFEEiEYHVLK_CdlN2pnUVl8mbHR', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-23 21:19:24', NULL),
(97, '2025-09-23 16:20:13', '2025-09-23 16:20:13', '43537113', '2', 'b0Vq81HwaOYh32jMu1aEWO2yceBcS7rV', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-23 21:20:13', NULL),
(98, '2025-09-23 16:20:50', '2025-09-23 16:20:50', '43537113', '2', 'tD-5l0JTonxlv_-_DV88idUegqdwmqUm', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-23 21:20:50', NULL),
(99, '2025-09-23 16:41:52', '2025-09-23 16:41:52', '44187263', '7', 'Kr9DScd1WKdCEyVLJu--Vr5_33yHii6U', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-23 21:41:52', NULL),
(100, '2025-09-23 17:02:03', '2025-09-23 17:02:03', '43537113', '2', '6i-yMkEW5N6d99VkqcKmDI_-XcZwDKO4', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Trae/1.100.3 Chrome/132.0.6834.210 Electron/34.5.1 Safari/537.36', '2025-09-23 22:02:03', NULL),
(101, '2025-09-23 17:02:39', '2025-09-23 17:02:39', '44187263', '7', '95LQiwDlhH7xTfn3bQjFTUg1_vk57DDB', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-23 22:02:39', NULL),
(102, '2025-09-23 17:31:59', '2025-09-23 21:17:40', '44377090', '6', 'tj-i-x_UAXfaUaoDkQG0ug9YoEiEYgXA', 0, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-24 02:17:40', NULL),
(103, '2025-09-23 21:17:51', '2025-09-23 21:17:51', '44377090', '11', '4s9OgrY46LKbqXRXkVlEqXcQ-WYgD8zw', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-24 02:17:51', NULL),
(104, '2025-09-23 23:42:33', '2025-09-23 23:42:33', '43537113', '2', 'vD3h463rL4WFJJGTJrRuaHDt1DSbedPk', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-24 04:42:33', NULL),
(105, '2025-09-23 23:42:53', '2025-09-23 23:42:53', '44187263', '7', '50aY8X_yK0DY2GXnSi_D6opmkFus0VVN', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-24 04:42:53', NULL),
(106, '2025-09-24 14:17:01', '2025-09-24 14:17:01', '43537113', '2', 'whWGyaPqmAIrr7VSbw-_M4m-TkHfU5Yj', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-24 19:17:01', NULL),
(107, '2025-09-24 14:20:19', '2025-09-24 14:20:19', '43537113', '2', '-uHwKHRw9B_zDPgrxlSQqkbZXuT46FYW', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-24 19:20:19', NULL),
(108, '2025-10-09 06:31:50', '2025-10-09 06:31:50', '43537113', '2', 'RwZ0mrubDctulNxO9YaVAvp-i3EyffF6', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-09 11:31:50', NULL),
(109, '2025-10-09 06:37:52', '2025-10-09 06:37:52', '43537113', '2', 'zoycJnxLXPnw0zn6Z7yx1xaFqCG2vKKr', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Trae/1.100.3 Chrome/132.0.6834.210 Electron/34.5.1 Safari/537.36', '2025-10-09 11:37:52', NULL),
(110, '2025-10-09 06:49:51', '2025-10-09 06:49:51', '43537113', '2', 'YCmZOCr9QzEC7U-Ao0VAOaznHptJvjhW', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-09 11:49:51', NULL),
(111, '2025-10-09 14:43:14', '2025-10-09 14:43:14', '43537113', '2', 'tcNb6vthM6WQasiDRYH5mFWd15ljU3xx', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Trae/1.100.3 Chrome/132.0.6834.210 Electron/34.5.1 Safari/537.36', '2025-10-09 19:43:14', NULL),
(112, '2025-10-09 14:57:20', '2025-10-09 14:57:20', 'hua1objl8w40fw7', '32', 'QN0-899APtGHbw-Cc43qtPzf3i9Egfix', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Trae/1.100.3 Chrome/132.0.6834.210 Electron/34.5.1 Safari/537.36', '2025-10-09 19:57:20', NULL),
(113, '2025-10-09 15:26:28', '2025-10-09 15:26:28', 'hua1objl8w40fw7', '32', 'QSPwQ9YgQehMmkfPj2pYvjvl2AciV4Jq', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-09 20:26:28', NULL),
(114, '2025-10-09 15:28:43', '2025-10-09 15:28:43', '44187263', '7', 'jqZBoXmWJBboU_XkXZkRH7NGZu4je5SQ', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Trae/1.100.3 Chrome/132.0.6834.210 Electron/34.5.1 Safari/537.36', '2025-10-09 20:28:43', NULL),
(115, '2025-10-09 16:56:00', '2025-10-09 16:56:00', '43537113', '2', 'Gu-ycflyXpA99WzDQ7ydmEWXcLyTeWAb', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-09 21:56:00', NULL),
(116, '2025-10-09 16:59:15', '2025-10-09 16:59:15', 'hua1objl8w40fw7', '32', 'Qw2FoiWx-y1bgb3mOj7QMnE5XimvOt6G', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-09 21:59:15', NULL),
(117, '2025-10-09 18:48:44', '2025-10-09 18:48:44', '44187263', '7', '9GhI6qmPmRxLZY-MsqyBrCjRgEpyUD7G', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-09 23:48:44', NULL),
(118, '2025-10-10 11:14:58', '2025-10-10 11:14:58', '44187263', '7', 'SVE-X1aZwGvGAxpSbwJZM-Q2wBNTyl1R', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-10-10 16:14:58', NULL),
(119, '2025-10-10 11:20:37', '2025-10-10 11:20:37', 'hua1objl8w40fw7', '32', 'bJugZnC71YdEvwSyJtyt9tuaBne6_zhF', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-10-10 16:20:37', NULL),
(120, '2025-10-10 11:22:36', '2025-10-10 11:22:36', '43537113', '2', 'tgPhvgE_TnF0IfSSul5prJqOfVQSi4KI', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Trae/1.100.3 Chrome/132.0.6834.210 Electron/34.5.1 Safari/537.36', '2025-10-10 16:22:36', NULL),
(121, '2025-10-10 11:22:58', '2025-10-10 11:22:58', '44187263', '7', 'H2cQgniLC3ZkpeU1AL4mAUL9jJ1ioy4O', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-10-10 16:22:58', NULL),
(122, '2025-10-10 12:34:13', '2025-10-10 12:34:13', '44187263', '7', 'KrSXA1kMmEAdIeh-2s0YAFP7lwEQB0st', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-10-10 17:34:13', NULL),
(123, '2025-10-10 12:56:00', '2025-10-10 12:56:00', 'hua1objl8w40fw7', '32', 'FUSaxr_ewhWu-f5Rohn-I-tXK_CuX3LY', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-10-10 17:56:00', NULL),
(124, '2025-10-10 13:26:50', '2025-10-10 13:26:50', 'hua1objl8w40fw7', '32', 'yNY5C-6s5fXy2UwSwwdplaXvGGw_QUpI', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-10-10 18:26:50', NULL),
(125, '2025-10-10 13:32:55', '2025-10-10 13:32:55', 'hua1objl8w40fw7', '32', '0ucHot_rk0CO5EJSV-HMMflikf2mZbJX', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-10-10 18:32:55', NULL),
(126, '2025-10-10 13:50:57', '2025-10-10 13:50:57', '44187263', '7', 'mIM8skvQVkMaVuSNoUb8GrAPJRgNKady', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Trae/1.100.3 Chrome/132.0.6834.210 Electron/34.5.1 Safari/537.36', '2025-10-10 18:50:57', NULL),
(127, '2025-10-10 17:09:03', '2025-10-10 17:09:03', '44187263', '7', 'yy19oge_0yVK9t_H58eH9JBTq4JfrvBK', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Trae/1.100.3 Chrome/132.0.6834.210 Electron/34.5.1 Safari/537.36', '2025-10-10 22:09:03', NULL),
(128, '2025-10-10 17:56:22', '2025-10-10 17:56:22', '43537113', '2', '-f77I7Na-ND-aES90x6BhrnaqXWECgc5', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Trae/1.100.3 Chrome/132.0.6834.210 Electron/34.5.1 Safari/537.36', '2025-10-10 22:56:22', NULL),
(129, '2025-10-10 17:56:26', '2025-10-10 17:56:26', '44187263', '7', 'pqsei9Wr6YLONjmpYxBXJt3wH4SnhJ8-', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-10-10 22:56:26', NULL),
(130, '2025-10-10 20:13:40', '2025-10-10 20:13:40', '35m0crql3jbwdg5', '44', '5unr60GoGXTpaQBuTGySh65iUtXK1XC4', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-10-11 01:13:40', NULL),
(131, '2025-10-10 23:01:57', '2025-10-10 23:01:57', 'hua1objl8w40fw7', '32', 'Xk3kKunhqSyRsJwloSlqWt7l4b80Mt7R', 1, '::1', 'axios/1.12.2', '2025-10-11 04:01:57', NULL),
(132, '2025-10-10 23:03:31', '2025-10-10 23:03:31', 'hua1objl8w40fw7', '32', 'Os_cfB2cM5xF3ZWnUWVt8iyeNQz9yPof', 1, '::1', 'axios/1.12.2', '2025-10-11 04:03:31', NULL),
(133, '2025-10-10 23:04:55', '2025-10-10 23:04:55', 'hua1objl8w40fw7', '32', 'F4AvPKyLrKxZhDT8GkORpB2xj4o-at9M', 1, '::1', 'axios/1.12.2', '2025-10-11 04:04:55', NULL),
(134, '2025-10-10 23:06:11', '2025-10-10 23:06:11', 'hua1objl8w40fw7', '32', 'rNuJoRdRyDBlG8u6CTiX7EECKW6ALqoF', 1, '::1', 'axios/1.12.2', '2025-10-11 04:06:11', NULL),
(135, '2025-10-10 23:11:12', '2025-10-10 23:11:12', 'hua1objl8w40fw7', '32', 'aYIgzW8dMYZon8kE8yHyFaFnLlxdtR2H', 1, '::1', 'axios/1.12.2', '2025-10-11 04:11:12', NULL),
(136, '2025-10-10 23:20:16', '2025-10-10 23:20:16', 'hua1objl8w40fw7', '32', 'Jntf7dHizWUUykw82rUouJuYTOd2u0ww', 1, '::1', 'axios/1.12.2', '2025-10-11 04:20:16', NULL),
(137, '2025-10-10 23:20:49', '2025-10-10 23:20:49', 'hua1objl8w40fw7', '32', 'c1_G2Ek3nQaUYudn0SdahzNNVj5Faofi', 1, '::1', 'axios/1.12.2', '2025-10-11 04:20:49', NULL),
(138, '2025-10-10 23:21:44', '2025-10-10 23:21:44', 'hua1objl8w40fw7', '32', 'Kq2l9LVEUbPV1jlnLd_9V3FlsNOA32mf', 1, '::1', 'axios/1.12.2', '2025-10-11 04:21:44', NULL),
(139, '2025-10-10 23:23:54', '2025-10-10 23:23:54', 'hua1objl8w40fw7', '32', 'QAsEae7Vy0lOokBtXiDHkUZwqYseUIZj', 1, '::1', 'axios/1.12.2', '2025-10-11 04:23:54', NULL),
(140, '2025-10-10 23:25:12', '2025-10-10 23:25:12', 'hua1objl8w40fw7', '32', 'OfeYcqwGlNWnp7ZOSKrV8IOjJO-DlUMa', 1, '::1', 'axios/1.12.2', '2025-10-11 04:25:12', NULL),
(141, '2025-10-10 23:26:22', '2025-10-10 23:26:22', 'hua1objl8w40fw7', '32', 'XGMMwuE_b2TsOPF5dS7sAcbP1k5XqRt6', 1, '::1', 'axios/1.12.2', '2025-10-11 04:26:22', NULL),
(142, '2025-10-10 23:27:52', '2025-10-10 23:27:52', 'hua1objl8w40fw7', '32', 'R7UdJ8qncIoi3M_iozRhdMgIleYgsPdt', 1, '::1', 'axios/1.12.2', '2025-10-11 04:27:52', NULL),
(143, '2025-10-10 23:30:53', '2025-10-10 23:30:53', 'hua1objl8w40fw7', '32', 'r7FlbDI36wpDsi2cq59LTceyQtBRST5k', 1, '::1', 'axios/1.12.2', '2025-10-11 04:30:53', NULL),
(144, '2025-10-10 23:32:01', '2025-10-10 23:32:01', 'hua1objl8w40fw7', '32', 'heltqOkzNNa_S8BvWRr4IDDy3-OmGzsD', 1, '::1', 'axios/1.12.2', '2025-10-11 04:32:01', NULL),
(145, '2025-10-10 23:34:47', '2025-10-10 23:34:47', 'hua1objl8w40fw7', '32', 'P1DUbKBZW2EGt4A0HvNfZWgFj8Jdwng-', 1, '::1', 'axios/1.12.2', '2025-10-11 04:34:47', NULL),
(146, '2025-10-11 08:21:12', '2025-10-11 08:21:12', '26tje8w7lymxwlj', '55', 'mjLQLxJm7-EKiLKbfrBrHBtA-CK6Kqlf', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '2025-10-11 13:21:12', NULL),
(147, '2025-10-11 14:42:58', '2025-10-11 14:42:58', '26tje8w7lymxwlj', '55', 'cK85w6CjBN3Fp1PvHS81__dap1vzLaPo', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-11 19:42:58', NULL),
(148, '2025-10-12 11:53:58', '2025-10-12 11:53:58', 'iz2vpsv2u00nlu9', '43', 't0cRDVcxLycIVZLnZgHBmQxyVGxBuAgh', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-12 16:53:58', NULL),
(149, '2025-10-12 12:42:41', '2025-10-12 12:42:41', 'end_user_demo', NULL, 'fLSLepYmJbzlwKGTti9bisZG29aief89', 1, '::1', 'axios/1.12.2', '2025-10-12 17:42:41', NULL),
(150, '2025-10-12 12:46:41', '2025-10-12 12:46:41', 'white_label_affiliate_demo', NULL, 'XTmluPZAKPHrxKDBDXhbAYd3gkeB6PIe', 1, '::1', 'axios/1.12.2', '2025-10-12 17:46:41', NULL),
(151, '2025-10-12 12:47:02', '2025-10-12 12:47:02', 'white_label_affiliate_demo', NULL, 'f4j8zfaebpWswEgmSB8L06mEwEh5WLXu', 1, '::1', 'axios/1.12.2', '2025-10-12 17:47:02', NULL),
(152, '2025-10-12 14:11:36', '2025-10-12 14:11:36', 'first1414', NULL, 'VtY34Xmjxv40Ys36EOYPmFS8tKG5ay9O', 1, '::1', 'node', '2025-10-12 19:11:36', NULL),
(153, '2025-10-12 14:13:10', '2025-10-12 14:13:10', 'first1414', NULL, '9r65lAriLD6XlyivEUsa_yAvHOBTWFhN', 1, '::1', 'node', '2025-10-12 19:13:10', NULL),
(154, '2025-10-12 14:13:43', '2025-10-12 14:13:43', 'first1414', NULL, 'ZRhzbGQSh6XOHZSeV-MU0-P-T1lMYAek', 1, '::1', 'node', '2025-10-12 19:13:43', NULL),
(155, '2025-10-12 14:14:29', '2025-10-12 14:14:29', 'first1414', NULL, 'NzQAroc0wFjm1unD92ij56cIcCII0Tpp', 1, '::1', 'node', '2025-10-12 19:14:29', NULL),
(156, '2025-10-12 14:15:23', '2025-10-12 14:15:23', 'first1414', NULL, 'bPHDbeZtE-EQKEXXrJOhdybkIzXVrRq1', 1, '::1', 'node', '2025-10-12 19:15:23', NULL),
(157, '2025-10-12 14:28:27', '2025-10-12 14:28:27', 'first1414', NULL, 'ggRF-1wxnf0sdE2pkzftVI93smG2ewon', 1, '::1', 'node', '2025-10-12 19:28:27', NULL),
(158, '2025-10-12 14:33:04', '2025-10-12 14:33:04', 'first1414', NULL, 'KapsRQbO8SEm9_1-jxZsoQ_NONMdkH3E', 1, '::1', 'node', '2025-10-12 19:33:04', NULL),
(159, '2025-10-12 14:40:22', '2025-10-12 14:40:22', 'first1414', NULL, 'auC23ZUeulJDVo3JCQZV772z2dTrHMaL', 1, '::1', 'node', '2025-10-12 19:40:22', NULL),
(160, '2025-10-12 14:46:20', '2025-10-12 14:46:20', 'first1414', NULL, 'USXYGwXwAWySrAfYShMUWNNk7NHgOyTl', 1, '::1', 'node', '2025-10-12 19:46:20', NULL),
(161, '2025-10-12 14:53:16', '2025-10-12 14:53:16', 'first1414', NULL, '0BJII6UeEvcr11cObMr6DeTDTi2c50nf', 1, '::1', 'node', '2025-10-12 19:53:16', NULL),
(162, '2025-10-12 14:56:43', '2025-10-12 14:56:43', 'first1414', NULL, 'VCILdvEBIBASxKg27QRMj154FsRSkhLc', 1, '::1', 'node', '2025-10-12 19:56:43', NULL),
(163, '2025-10-13 09:05:27', '2025-10-13 09:05:27', 'first1414', NULL, 'HAwptkyK4aRnJFIxPqxfGn4ubhqDPYXA', 1, '::1', 'node', '2025-10-13 14:05:27', NULL),
(164, '2025-10-13 09:14:10', '2025-10-13 09:14:11', 'first1414', NULL, 'KqKGaem6AEZ9A96sfnO9gPqEpj6KMqMk', 1, '::1', 'node', '2025-10-13 14:14:10', NULL),
(165, '2025-10-13 09:19:05', '2025-10-13 09:19:05', 'first1414', NULL, 'lp8cX4Os_uIq2xln4QVoW-Kd4xkxRFbk', 1, '::1', 'node', '2025-10-13 14:19:05', NULL),
(166, '2025-10-13 09:31:33', '2025-10-13 09:31:33', 'first1414', NULL, 'fPKFbg9w67e4Y9SbFe0WRd0MfhDxv3XW', 1, '::1', 'node', '2025-10-13 14:31:33', NULL),
(167, '2025-10-13 12:47:41', '2025-10-13 12:47:41', 'first1414', NULL, 'qDhYBAvdcf9BTDd2Cz0L3obEFOrk0eQi', 1, '::1', 'node', '2025-10-13 17:47:41', NULL),
(168, '2025-10-13 12:49:45', '2025-10-13 12:49:45', 'first1414', NULL, 'Smok-YXJhKJNskCoaJjRqOarXsQrgKha', 1, '::1', 'node', '2025-10-13 17:49:45', NULL),
(169, '2025-10-13 12:51:05', '2025-10-13 12:51:05', 'first1414', NULL, 'lIddCXaqlatus7bsu9p7aHK2NT5oA2ju', 1, '::1', 'node', '2025-10-13 17:51:05', NULL),
(170, '2025-10-13 12:54:14', '2025-10-13 12:54:14', 'first1414', NULL, 'kQX5h29Lnj7VzvLgHRagi9BRU75K0yiZ', 1, '::1', 'axios/1.12.2', '2025-10-13 17:54:14', NULL),
(171, '2025-10-14 07:26:31', '2025-10-14 07:26:31', 'hua1objl8w40fw7', '32', 'kSdVl5FTNNy-flmDpCWu9Rty6ci8s3Ji', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-14 12:26:31', NULL),
(172, '2025-10-14 07:44:14', '2025-10-14 07:44:14', 'hua1objl8w40fw7', '32', '4iQro39ML1cuLx9uaEr6VpwbQfGBenjv', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-14 12:44:14', NULL),
(173, '2025-10-14 08:39:53', '2025-10-14 08:39:53', 'hua1objl8w40fw7', '32', 'M_oQ9SmvmOsbzbG9RkO4Fgt6AQX_bK-V', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-14 13:39:53', NULL),
(174, '2025-10-14 20:44:55', '2025-10-14 20:44:55', 'u18o8hwgfhbcz36', '48', 'I2L1I6Sb1gqx25r1xWAr7Lg3WJSKPP4f', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-15 01:44:55', NULL),
(175, '2025-10-15 12:29:03', '2025-10-15 12:29:03', '43537113', '2', 'HG1ogHdtCs5T9pO__MLzJo3iLTMlCMC5', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-15 17:29:03', NULL),
(176, '2025-10-15 12:31:48', '2025-10-15 12:31:48', '43537113', '2', 'bswpqrfWR7zWpMXFDHlkr743qmjY21Z3', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-15 17:31:48', NULL),
(177, '2025-10-15 12:42:35', '2025-10-15 12:42:35', '44187263', '7', '6Z8QMMiWvlZa-qSllkjBXQ9LClWUqH2w', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-15 17:42:35', NULL),
(178, '2025-10-15 12:49:34', '2025-10-15 12:49:34', '53cnffx7v02h7if', NULL, 'qO4C2MCh2u_SF_pqe7Ee4VvpqvpgrvTp', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-15 17:49:34', NULL),
(179, '2025-10-15 12:52:30', '2025-10-15 12:52:30', '53cnffx7v02h7if', NULL, 'o1gxfiyPWCCdqvo3on0__UnWHoHWlyf2', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-15 17:52:30', NULL),
(180, '2025-10-15 12:53:23', '2025-10-15 12:53:23', '43537113', '2', 'P_cctdBkGDM5tREiWmEBFYu3OKkvak25', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-15 17:53:23', NULL),
(181, '2025-10-15 12:53:50', '2025-10-15 12:53:50', '53cnffx7v02h7if', NULL, 'lqgCQpBbcf9l-9QNzT-oXEYnJ0ffK9ub', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-15 17:53:50', NULL),
(182, '2025-10-15 13:02:33', '2025-10-15 13:02:33', '44187263', '7', '7Nb0w0HgKPrcHUcATqghpPVZd1Gmo7YO', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-15 18:02:33', NULL),
(183, '2025-10-16 18:00:03', '2025-10-16 18:00:03', '43537113', '2', 'MxLbVyhrbmlZtP9asGRLh_SX7VTHauVv', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-16 23:00:03', NULL),
(184, '2025-10-16 20:07:14', '2025-10-16 20:07:14', 'u18o8hwgfhbcz36', '48', 'tdAVkr5AjzYr7wFgr256_ACOibje0nOs', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-17 01:07:14', NULL),
(185, '2025-10-16 20:13:10', '2025-10-16 20:13:10', '44187263', '7', 'EDFI24DmWSW6Ap60bWKpaAUV5tFmhe5f', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-17 01:13:10', NULL),
(186, '2025-10-16 23:33:51', '2025-10-16 23:33:51', 'q1erwrot7efdcbr', '17', 'js3pF3HCW8T7uGcsC10M7X0j2wRTOvIi', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-17 04:33:51', NULL),
(187, '2025-10-16 23:35:15', '2025-10-16 23:35:15', 'hua1objl8w40fw7', '32', 'wOSCseGl-pQO729qXrrvL_ybXBaCYHth', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-17 04:35:15', NULL),
(188, '2025-10-16 23:36:19', '2025-10-16 23:36:19', '26tje8w7lymxwlj', '55', 'PW5RdTJdYZ4igaxr33sUv6lzCSLksFWy', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-17 04:36:19', NULL),
(189, '2025-10-17 01:24:51', '2025-10-17 01:24:51', 'u18o8hwgfhbcz36', '48', 'g7Ex7a5vLHx-vDkq3aV9GSGscBa7pY8n', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-17 06:24:51', NULL),
(190, '2025-10-17 01:25:36', '2025-10-17 01:25:36', 'u18o8hwgfhbcz36', '48', 'yIVgah7y5LHp8gAm1DkYFaCQDIEQ_2wa', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-17 06:25:36', NULL),
(191, '2025-10-17 01:26:24', '2025-10-17 01:26:24', 'u18o8hwgfhbcz36', '48', 'IM9oRCV5U8lKCFpFn4WnMbWQGj1XMqRi', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-17 06:26:24', NULL),
(192, '2025-10-17 01:26:45', '2025-10-17 01:26:45', 'u18o8hwgfhbcz36', '48', 'Dnpg09_Rbk69jCKcS4Wvq8GJI_EHFvTs', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-17 06:26:45', NULL),
(193, '2025-10-17 01:26:54', '2025-10-17 01:26:54', '44187263', '7', 'lojviFK4pT_hwO5mrKIW9rHrMJjV5Zf5', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-17 06:26:54', NULL),
(194, '2025-10-17 01:42:53', '2025-10-17 01:42:53', 'u18o8hwgfhbcz36', '48', 'EjCCO4yF1qtnD8Lwna1muoG6LgZd9c8_', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-17 06:42:53', NULL),
(195, '2025-10-17 01:50:31', '2025-10-17 01:50:31', 'u18o8hwgfhbcz36', '48', 'FT4gXsHwv-S6aEdjq0Fc8frkZdW5Fv1t', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-17 06:50:31', NULL),
(196, '2025-10-17 01:52:18', '2025-10-17 01:52:18', 'u18o8hwgfhbcz36', '48', 'CLIsMdORLI82WKsSruHXmwdhC0n0lO_d', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-17 06:52:18', NULL),
(197, '2025-10-17 01:53:15', '2025-10-17 01:53:15', 'u18o8hwgfhbcz36', '48', '9ovJ5VVYz1umfZUCj3vdz4jzGgIdMFTy', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-17 06:53:15', NULL),
(198, '2025-10-17 01:53:53', '2025-10-17 01:53:53', 'u18o8hwgfhbcz36', '48', 'DkDYQ_BxfI_r0NM-rQvkqvuijZGtP_9I', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-17 06:53:53', NULL),
(199, '2025-10-17 01:55:27', '2025-10-17 01:55:27', 'u18o8hwgfhbcz36', '48', '4aJNNudR80FKzy4JD_K6IM1T1zxB8p6f', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-17 06:55:27', NULL),
(200, '2025-10-17 02:01:44', '2025-10-17 02:01:44', 'u18o8hwgfhbcz36', '48', 'qV4W3uScQJciH1Ww-ee9OZ8mYDZ15HkB', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-17 07:01:44', NULL),
(201, '2025-10-17 02:02:44', '2025-10-17 02:02:44', 'u18o8hwgfhbcz36', '48', 'cbDCgOQEsksNi7_YHeHXoksK5Q8gfkwj', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-17 07:02:44', NULL);
INSERT INTO `user_sessions` (`id`, `created_at`, `updated_at`, `user_id`, `white_label_id`, `session_token`, `is_active`, `ip_address`, `user_agent`, `last_active_at`, `expires_at`) VALUES
(202, '2025-10-17 02:15:58', '2025-10-17 02:15:58', 'u18o8hwgfhbcz36', '48', '2uVLcOhiJmnIaJwl2Da2O12tcNwljNio', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-17 07:15:58', NULL),
(203, '2025-10-17 02:16:18', '2025-10-17 02:16:18', 'u18o8hwgfhbcz36', '48', 'syvla5gXSbLJyXwFoIeyRWmVL7BzYHi_', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-17 07:16:18', NULL),
(204, '2025-10-17 02:21:14', '2025-10-17 02:21:14', 'u18o8hwgfhbcz36', '48', 'mLhmPyBJivHUikZtYvoYGwBdY3DPCrKH', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-17 07:21:14', NULL),
(205, '2025-10-17 02:23:07', '2025-10-17 02:23:07', 'u18o8hwgfhbcz36', '48', 'Pr9DaHwNrOuuK-qbDjCqpTdipRcelE6o', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-17 07:23:07', NULL),
(206, '2025-10-17 02:24:07', '2025-10-17 02:24:07', 'u18o8hwgfhbcz36', '48', 'orihR0wCFII1PJgAYRhTca-kwFycwfm_', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-17 07:24:07', NULL),
(207, '2025-10-17 02:27:19', '2025-10-17 02:27:19', 'u18o8hwgfhbcz36', '48', 'E4ZpRMLqm_j0NX6gCAAAFhcarQQFElOx', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-17 07:27:19', NULL),
(208, '2025-10-17 02:28:04', '2025-10-17 02:28:04', 'u18o8hwgfhbcz36', '48', 'f1qxFlca5uqF6qPSeoVr_RjPbMPEn-xk', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-17 07:28:04', NULL),
(209, '2025-10-17 02:32:07', '2025-10-17 02:32:07', 'u18o8hwgfhbcz36', '48', 'omofoqEIRbADbgbQwGy_TFVGPtQVh8fr', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-17 07:32:07', NULL),
(210, '2025-10-17 02:33:36', '2025-10-17 02:33:36', 'u18o8hwgfhbcz36', '48', 'E9ocWSxjCz35gSngV0_rqGeWh5Dfoimu', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-17 07:33:36', NULL),
(211, '2025-10-17 02:35:28', '2025-10-17 02:35:28', 'u18o8hwgfhbcz36', '48', '9sLJMmDJLDuU43B23-RDDRtBY9sxsqh4', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-17 07:35:28', NULL),
(212, '2025-10-17 10:26:19', '2025-10-17 10:26:19', 'u18o8hwgfhbcz36', '48', 'HnhawdWqbhUzHLPMXFRrWO2OraHr-h8_', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-17 15:26:19', NULL),
(213, '2025-10-17 10:34:40', '2025-10-17 10:34:40', 'u18o8hwgfhbcz36', '48', 'fYWbrdpell-n6W2E0PbiaqHzNI_-wa0w', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Trae/1.104.3 Chrome/138.0.7204.235 Electron/37.3.1 Safari/537.36', '2025-10-17 15:34:40', NULL),
(214, '2025-10-17 10:37:21', '2025-10-17 10:37:21', 'u18o8hwgfhbcz36', '48', 'FQNeoEjGRlJfBIAECICuMUA5fhdcyqlT', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-17 15:37:21', NULL),
(215, '2025-10-17 18:34:03', '2025-10-17 18:34:03', 'u18o8hwgfhbcz36', '48', 'MnvjaQjCvQ-33VrMnwrLk3rWA_vQ2NGK', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-17 23:34:03', NULL),
(216, '2025-10-17 18:34:47', '2025-10-17 18:34:47', 'u18o8hwgfhbcz36', '48', 'yzwUTdug4kp4MbsNf2aJKED3ltHfxHx9', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-17 23:34:47', NULL),
(217, '2025-10-17 18:34:58', '2025-10-17 18:34:58', 'u18o8hwgfhbcz36', '48', 'TJByQQxfry_RIWIQk86UYy_42g_baHYs', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-17 23:34:58', NULL),
(218, '2025-10-17 18:40:15', '2025-10-17 18:40:15', 'u18o8hwgfhbcz36', '48', 'M0yUEKQ2kvLqp7ssp_7JUGTaN-ddQDrL', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-17 23:40:15', NULL),
(219, '2025-10-17 20:11:22', '2025-10-17 20:11:22', '44187263', '7', 'tKXXusBQG4xz2Jhhb6BOoywHV6z3mR8c', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-18 01:11:22', NULL),
(220, '2025-10-17 20:38:08', '2025-10-17 20:38:08', 'u18o8hwgfhbcz36', '48', 'Jyj3xFSzyQGpf578YDLC2lfah9FZSd5u', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-18 01:38:08', NULL),
(221, '2025-10-17 20:38:18', '2025-10-17 20:38:18', '44187263', '7', 'yiExPUqaVCgP9LnUAn8rxZUhR3W5MM2V', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-18 01:38:18', NULL),
(222, '2025-10-17 20:38:53', '2025-10-17 20:38:53', '43537113', '2', 'Fv_B5ldYoldM_qx5tp0bigXMWRN7AXSx', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-18 01:38:53', NULL),
(223, '2025-10-17 22:03:54', '2025-10-17 22:03:54', 'u18o8hwgfhbcz36', '48', '0mWAF90VG9qS-NLnEgMTkpycarnyAC0J', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-18 03:03:54', NULL),
(224, '2025-10-17 22:47:10', '2025-10-17 22:47:10', '44187263', '7', 'vvqbnca1goT-Zu3oizKY5__NUVEcxXKy', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-18 03:47:10', NULL),
(225, '2025-10-17 22:53:44', '2025-10-17 22:53:44', '43537113', '2', 'JcZ87MNrTP64ARMn-AjBMGQTUDL7Qa48', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-18 03:53:44', NULL),
(226, '2025-10-17 22:55:07', '2025-10-17 22:55:07', '44187263', '7', 'uWYhcvUEl7QrBPZyqDaRcJp5vhN2D6Zg', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-18 03:55:07', NULL),
(227, '2025-10-18 19:23:09', '2025-10-18 19:23:09', 'u18o8hwgfhbcz36', '48', 'ute-RgMTNybanvMc6y1pfCeaUN5r6EX9', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-19 00:23:09', NULL),
(228, '2025-10-18 19:23:29', '2025-10-18 19:23:29', '44187263', '7', 'EP21lVy_6EJi1pJPpoGWbbBUCU9nWEwg', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-19 00:23:29', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_theme_preferences`
--

CREATE TABLE `user_theme_preferences` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `white_labels`
--

CREATE TABLE `white_labels` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `plan_id` int(11) DEFAULT NULL,
  `business_name` varchar(255) DEFAULT NULL,
  `domain` varchar(255) DEFAULT NULL,
  `logo_url` varchar(500) DEFAULT NULL,
  `primary_color` varchar(7) DEFAULT '#3B82F6',
  `secondary_color` varchar(7) DEFAULT '#1E40AF',
  `is_active` tinyint(1) DEFAULT 1,
  `invited_by` varchar(255) DEFAULT NULL,
  `domain_path` varchar(255) DEFAULT NULL,
  `default_landing_page_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `landing_page_code` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `white_labels`
--

INSERT INTO `white_labels` (`id`, `user_id`, `plan_id`, `business_name`, `domain`, `logo_url`, `primary_color`, `secondary_color`, `is_active`, `invited_by`, `domain_path`, `default_landing_page_id`, `created_at`, `updated_at`, `landing_page_code`) VALUES
(2, '43537113', 1, 'My Business', '43537113.example.com', '/uploads/brand-logos/brand_logo_1760531898137-577241784.png', '#3B82F6', '#64748B', 1, NULL, 'hammad', 1, '2025-06-09 18:28:27', '2025-10-15 12:38:18', 'default'),
(3, 'client_1', NULL, 'Example Business Solutions', 'example.whitelabelpro.com', NULL, '#3B82F6', '#1E40AF', 1, NULL, NULL, 139, '2025-06-09 20:08:09', '2025-10-10 19:17:51', 'default'),
(4, 'test-wl-client-1', NULL, 'Smith Digital Solutions', 'smithdigital.com', NULL, '#2563EB', '#64748B', 1, NULL, NULL, 152, '2025-06-27 18:32:02', '2025-10-10 19:17:51', 'default'),
(5, 'test-wl-client-2', NULL, 'TechStartup Solutions', 'techstartup.io', NULL, '#2563EB', '#64748B', 1, NULL, NULL, 136, '2025-06-27 18:32:19', '2025-10-10 19:17:51', 'default'),
(7, '44187263', 8, 'shootBS', '44187263.example.com', '/uploads/brand-logos/brand_logo_1758725343257-773439350.png', '#2563EB', '#64748B', 1, NULL, 'shoot', 2, '2025-06-28 16:59:30', '2025-09-24 14:49:03', 'default'),
(8, '44443117', 5, 'My Business', '44443117.example.com', NULL, '#2563EB', '#64748B', 1, NULL, 'munib', 86, '2025-06-30 09:18:27', '2025-10-10 19:17:51', 'default'),
(10, '44622389', 49, 'My Business', '44622389.example.com', NULL, '#2563EB', '#64748B', 1, NULL, 'rey', 93, '2025-07-04 15:11:31', '2025-10-10 19:17:51', 'default'),
(11, '44377090', NULL, 'EpicGamer Affiliate', '44377090.example.com', '/uploads/brand-logos/brand_logo_1758666226213-599688340.png', '#2563EB', '#64748B', 1, NULL, 'epic', 102, '2025-07-15 16:47:06', '2025-09-23 22:23:46', 'default'),
(12, '44915301', NULL, '5 Star Seco Official', NULL, NULL, '#2563EB', '#64748B', 1, NULL, '5starseco', 118, '2025-07-23 19:21:56', '2025-10-10 19:17:51', 'default'),
(13, '3j0v57v5seewlhe', NULL, 'first1 Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'first1', 122, '2025-08-09 13:58:27', '2025-10-10 19:17:51', 'default'),
(14, 'guest_1752180877442_686p52', 69, 'The Blackstone Consultants', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'blackstone-consultants', 135, '2025-08-10 02:17:13', '2025-10-10 19:17:51', 'default'),
(15, 'eytfi58ut8nfduf', 69, 'first2\'s Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'first2', 124, '2025-08-10 02:20:30', '2025-10-10 19:17:51', 'default'),
(16, 'jv13bugizvv8m4q', 69, 'first3\'s Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'first3', 125, '2025-08-10 02:21:34', '2025-10-10 19:17:51', 'default'),
(17, 'q1erwrot7efdcbr', 69, 'four1234\'s Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'four1234', 127, '2025-08-10 02:32:21', '2025-10-10 19:17:51', 'default'),
(18, 'a4didmki51vg2hw', 69, 'Munib6969\'s Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'munib6969', 129, '2025-08-10 06:42:33', '2025-10-10 19:17:51', 'default'),
(19, 'g0u7jstj2qfvohc', NULL, 'Aass Affiliate Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'aass-affiliate', 131, '2025-08-10 07:08:14', '2025-10-10 19:17:51', 'default'),
(20, 'end_007', NULL, 'Frank Garcia Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'userend_007-affiliate', 132, '2025-08-12 02:36:38', '2025-10-10 19:17:51', 'default'),
(21, 'end_012', NULL, 'Kevin Hall Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'userend_012-affiliate', 133, '2025-08-12 02:36:38', '2025-10-10 19:17:51', 'default'),
(22, 'yx2a1265l5xqv1t', NULL, 'First222 First222 Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'first222-affiliate', 134, '2025-08-12 02:36:38', '2025-10-10 19:17:51', 'default'),
(23, 'end_005', NULL, 'Charlie Davis Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'userend_005-affiliate', 137, '2025-08-12 02:36:38', '2025-10-10 19:17:51', 'default'),
(24, 'end_002', NULL, 'Jane Doe Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'userend_002-affiliate', 138, '2025-08-12 02:36:38', '2025-10-10 19:17:51', 'default'),
(25, 'end_001', NULL, 'John Smith Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'userend_001-affiliate', 140, '2025-08-12 02:36:38', '2025-10-10 19:17:51', 'default'),
(26, '6t2flwl3grvhzzc', NULL, 'Epic Aa Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'epic1251-affiliate', 141, '2025-08-12 02:36:38', '2025-10-10 19:17:51', 'default'),
(27, 'tp9tzi7ya1wjjyx', NULL, 'Munib Affiliate Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'munib69affiliate', 157, '2025-08-12 02:36:38', '2025-10-10 19:17:51', 'default'),
(28, 'kui6zoerxwrfl6g', NULL, 'Epic Ss Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'epic125-affiliate', 143, '2025-08-12 02:36:38', '2025-10-10 19:17:51', 'default'),
(29, 'end_010', NULL, 'Ivan Lewis Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'userend_010-affiliate', 144, '2025-08-12 02:36:38', '2025-10-10 19:17:51', 'default'),
(30, 'zpv1hwu56h14u88', NULL, 'Testing1 Testing1 Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'testing1', 156, '2025-08-12 02:36:38', '2025-10-10 19:17:51', 'default'),
(31, 'end_003', NULL, 'Bob Williams Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'userend_003-affiliate', 146, '2025-08-12 02:36:38', '2025-10-10 19:17:51', 'default'),
(32, 'hua1objl8w40fw7', NULL, 'First1414 First1414 Business', 'four12344.localhost', NULL, '#2563EB', '#64748B', 1, NULL, 'four1234488', 7, '2025-08-12 02:36:38', '2025-10-11 08:17:55', 'default'),
(33, 'end_008', NULL, 'Grace Martinez Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'userend_008-affiliate', 148, '2025-08-12 02:36:38', '2025-10-10 19:17:51', 'default'),
(34, 'end_009', NULL, 'Helen Clark Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'userend_009-affiliate', 149, '2025-08-12 02:36:38', '2025-10-10 19:17:51', 'default'),
(35, 'end_011', NULL, 'Julia Walker Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'userend_011-affiliate', 150, '2025-08-12 02:36:38', '2025-10-10 19:17:51', 'default'),
(36, 'end_006', NULL, 'Diana Miller Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'userend_006-affiliate', 151, '2025-08-12 02:36:38', '2025-10-10 19:17:51', 'default'),
(37, 'end_004', NULL, 'Alice Brown Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'userend_004-affiliate', 153, '2025-08-12 02:36:38', '2025-10-10 19:17:51', 'default'),
(38, '44187122', NULL, 'Rora Kami Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'user44187122-affiliate', 154, '2025-08-12 02:36:38', '2025-10-10 19:17:51', 'default'),
(39, 'd29oee2p96xfn06', 69, 'munib\'s Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'munibrealtry', 160, '2025-08-12 09:27:08', '2025-10-10 19:17:51', 'default'),
(40, 'rg1ptrh9mdfgsrz', NULL, 'Munib real Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'munibrealtry1', 162, '2025-08-12 09:28:13', '2025-10-10 19:17:51', 'default'),
(41, '04mlvs50y4nls6a', 80, 'Munib\'s Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'munibahmed20', 164, '2025-08-12 10:03:06', '2025-10-10 19:17:51', 'default'),
(42, '685xf719omsrqm8', NULL, 'Munib Ahmed Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'munibahmed200', 166, '2025-08-12 10:09:31', '2025-10-10 19:17:51', 'default'),
(43, 'iz2vpsv2u00nlu9', NULL, 'Epic epic Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'epic2244', 168, '2025-08-13 05:00:21', '2025-10-10 19:17:51', 'default'),
(44, '35m0crql3jbwdg5', NULL, 'My Purchases Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'mypurchases-affiliate', NULL, '2025-08-13 09:29:06', '2025-10-10 19:17:51', 'default'),
(45, '8aqk5un6apiqd4b', NULL, 'My Purchases Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'mypurchases2-affiliate', NULL, '2025-08-13 09:30:05', '2025-10-10 19:17:51', 'default'),
(46, '2eo8zb2e3dqomeb', 69, 'epic\'s Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'epic22222', 173, '2025-08-19 02:08:14', '2025-10-10 19:17:51', 'default'),
(47, '67hhc5l6jli5723', NULL, 'Munib World Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'tutorialssss-affiliate', NULL, '2025-08-19 02:11:14', '2025-10-10 19:17:51', 'default'),
(48, 'u18o8hwgfhbcz36', NULL, 'Hammad hammad Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'hammadhammad-affiliate', NULL, '2025-08-19 16:39:05', '2025-10-10 19:17:51', 'default'),
(49, '8m691wqlghkf3nc', 69, 'hammad\'s Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'hammadhammadi', 177, '2025-08-19 16:42:58', '2025-10-10 19:17:51', 'default'),
(50, '62b7hiatqx20iaj', NULL, 'Munib Saqib Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'hammadassa-affiliate', NULL, '2025-08-19 16:45:14', '2025-10-10 19:17:51', 'default'),
(51, 'j756dzpftjionpa', NULL, 'Munib Saqib Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'munibmunib-affiliate', NULL, '2025-08-20 17:40:00', '2025-10-10 19:17:51', 'default'),
(52, '7rjtsyeijw0i8zi', NULL, 'Checking22 Checking22 Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'checking22-affiliate', NULL, '2025-08-20 18:19:03', '2025-10-10 19:17:51', 'default'),
(53, 'ss2iq4hwcaydplz', NULL, 'Munib ma Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'hello22-affiliate', NULL, '2025-08-20 18:40:37', '2025-10-10 19:17:51', 'default'),
(54, 'jwg84z5hawl8jms', 68, 'Checking222\'s Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'checking222', 183, '2025-08-22 21:20:04', '2025-10-10 19:17:51', 'default'),
(55, '26tje8w7lymxwlj', NULL, 'NewAffiliate System Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'checkingaffiliate', 185, '2025-08-23 11:58:33', '2025-10-10 19:17:51', 'default'),
(56, '1fykk71x0x07yod', 72, 'Testing\'s Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'testingaffiliatetracker', NULL, '2025-08-23 15:22:11', '2025-10-10 19:17:51', 'default'),
(57, 'c0c8zgzt7hi4hr0', 72, 'Testing\'s Business', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'test', NULL, '2025-08-29 09:01:52', '2025-10-10 19:17:51', 'default'),
(58, '5454d9e6-adb9-4be3-a27f-7a1ccc3e0792', NULL, 'Debug Test', NULL, '', '#667eea', '#764ba2', 1, NULL, 'debugtest123', NULL, '2025-08-29 18:31:59', '2025-10-10 19:17:51', 'default'),
(59, '6b3bed99-6b66-476e-aaa2-c7dd94b26abe', NULL, 'Final Test Business', NULL, '', '#667eea', '#764ba2', 1, NULL, 'finaltest456', NULL, '2025-08-29 18:32:59', '2025-10-10 19:17:51', 'default'),
(60, 'ed038a59-ae1a-42fa-a0bd-410de437f8ab', NULL, 'Working Test Business', NULL, '', '#667eea', '#764ba2', 1, NULL, 'workingtest789', NULL, '2025-08-29 18:33:40', '2025-10-10 19:17:51', 'default'),
(61, 'ba20cb50-cc28-41ae-af11-86d0217618c1', NULL, 'Debug Test 2', NULL, '', '#667eea', '#764ba2', 1, NULL, 'debugtest2', NULL, '2025-08-29 18:33:49', '2025-10-10 19:17:51', 'default'),
(62, '328afffb-74f6-4d76-aa7a-6cb7d37e8fa3', NULL, 'Final Debug Test', NULL, '', '#667eea', '#764ba2', 1, NULL, 'finaldebugtest', NULL, '2025-08-29 18:34:01', '2025-10-10 19:17:51', 'default'),
(63, '00fb5fb2-932f-45da-9fa1-60403f078f32', NULL, 'TrackDiv', 'abcd', '', '#667eea', '#764ba2', 1, NULL, 'rackiv', NULL, '2025-08-30 17:31:43', '2025-10-10 19:17:51', 'default'),
(64, '1d735bdd-65d7-4d14-9be2-5828bad59c2e', NULL, 'TrackDiv', NULL, '/uploads/payment-proofs/payment-proof-1756593828816-519382835.png', '#667eea', '#764ba2', 1, NULL, 'trackdiv', NULL, '2025-08-30 17:45:44', '2025-10-10 19:17:51', 'default'),
(65, '8252680b-4060-4da5-a893-0a1e8349df39', NULL, 'TrackDiv', NULL, '/uploads/payment-proofs/payment-proof-1756595037768-790673855.png', '#667eea', '#764ba2', 1, NULL, 'rackivb', NULL, '2025-08-30 18:04:13', '2025-10-10 19:17:51', 'default'),
(66, '9a280199-284f-47de-9cea-bf5c1844c343', NULL, 'trackdiv', NULL, '/uploads/logos/payment-proof-1756596640938-114202072.png', '#667eea', '#764ba2', 1, NULL, 'trackdivl', NULL, '2025-08-30 18:30:53', '2025-10-10 19:17:51', 'default'),
(67, '1756662017869_muneeb', NULL, 'muneeb', NULL, NULL, '#2563EB', '#64748B', 1, NULL, 'muneeb', NULL, '2025-08-31 12:40:17', '2025-10-10 19:17:51', 'default'),
(68, 'ded4aec0-4909-4ef0-bf15-7fcb11748131', NULL, 'Yurhix Solutions', NULL, '', '#667eea', '#764ba2', 1, NULL, 'fuckyou', NULL, '2025-09-10 10:04:42', '2025-10-10 19:17:51', 'default'),
(69, 'c3082ce4-1026-4d8a-a517-e2366d0e9164', NULL, 'Faizi', NULL, '', '#667eea', '#764ba2', 1, NULL, 'faizan', NULL, '2025-09-13 12:26:52', '2025-10-10 19:17:51', 'default'),
(70, '4f725c6a-c57e-47de-b1a3-a8bf81965cdf', NULL, 'trackdiv', NULL, '', '#667eea', '#764ba2', 1, NULL, 'trackdivbbb', NULL, '2025-09-13 13:26:07', '2025-10-10 19:17:51', 'default'),
(71, '6e66111b-3ad3-4613-84ce-fa4c6e8e973c', NULL, 'trackdiv', NULL, '', '#667eea', '#764ba2', 1, NULL, 'trackdivddd', NULL, '2025-09-13 13:53:42', '2025-10-10 19:17:51', 'default'),
(72, '9221adef-ab0a-47a4-b844-a6fa529d3aad', NULL, 'trackdiv', NULL, '', '#667eea', '#764ba2', 1, NULL, 'shootdsa', NULL, '2025-09-13 14:10:44', '2025-10-10 19:17:51', 'default'),
(73, '7b3143a3-a880-45d8-aab8-998aa3557f32', NULL, 'TrackDiv', NULL, '', '#667eea', '#764ba2', 1, NULL, 'munib20', NULL, '2025-09-13 14:22:03', '2025-10-10 19:17:51', 'default'),
(74, '6e5cb5fb-6b38-41fb-88e5-fcf235f39fc5', NULL, 'Aslam', NULL, '', '#01c7fc', '#76bb40', 1, NULL, 'aslam', NULL, '2025-09-14 10:58:31', '2025-10-10 19:17:51', 'default'),
(75, 'cc3100ce-940e-4156-a0ae-de338282fafb', NULL, 'TrackDiv', NULL, '', '#667eea', '#764ba2', 1, NULL, 'muneb', NULL, '2025-09-15 10:01:10', '2025-10-10 19:17:51', 'default'),
(76, 'white_label_client_demo', NULL, 'TechSolutions Pro', 'techsolutions.example.com', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=80&fit=crop', '#3B82F6', '#8B5CF6', 1, NULL, NULL, NULL, '2025-09-17 13:35:18', '2025-10-10 19:17:51', 'default'),
(77, '1758320336397_superadminwhitelabelportalee', NULL, 'TrackDiv', NULL, NULL, '#3B82F6', '#1E40AF', 1, NULL, 'trackdivee', NULL, '2025-09-19 22:18:56', '2025-10-10 19:17:51', 'default'),
(78, '1758320372285_testing1221', NULL, 'TrackDiv', NULL, NULL, '#3B82F6', '#1E40AF', 1, NULL, 'trackdivhh', NULL, '2025-09-19 22:19:32', '2025-10-10 19:17:51', 'default'),
(79, '44187263', NULL, 'Shoot', 'shoot', '/uploads/profile_1758573914115-879455885.png', '#3B82F6', '#1E40AF', 1, NULL, NULL, NULL, '2025-09-22 21:16:51', '2025-10-10 19:17:51', 'default'),
(80, 'test-whitelabel-123', NULL, 'Test Analytics Business', 'test-analytics-domain.com', NULL, '#3B82F6', '#1E40AF', 1, NULL, NULL, NULL, '2025-10-10 20:25:31', '2025-10-10 20:25:31', NULL),
(81, 'fbd4f0c5-422e-443f-8237-ed69898562ea', NULL, 'trackdiv', NULL, '/uploads/logos/payment-proof-1760697043813-592396237.png', '#667eea', '#764ba2', 1, NULL, 'yyy', NULL, '2025-10-17 10:30:55', '2025-10-17 10:30:55', NULL),
(82, '128cf820-2f12-439d-b994-0213c5eb5219', NULL, 'hunai zone', NULL, '', '#667eea', '#764ba2', 1, NULL, 'hunai22', NULL, '2025-10-17 20:43:38', '2025-10-17 20:43:38', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activities`
--
ALTER TABLE `activities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_userId` (`userId`),
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_createdAt` (`createdAt`);

--
-- Indexes for table `affiliates`
--
ALTER TABLE `affiliates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `referral_code` (`referral_code`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `affiliate_payments`
--
ALTER TABLE `affiliate_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `affiliate_id` (`affiliate_id`),
  ADD KEY `paid_by_user_id` (`paid_by_user_id`);

--
-- Indexes for table `affiliate_plan_visibility`
--
ALTER TABLE `affiliate_plan_visibility`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ai_content_optimizations`
--
ALTER TABLE `ai_content_optimizations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ai_generated_content`
--
ALTER TABLE `ai_generated_content`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `ai_recommendations`
--
ALTER TABLE `ai_recommendations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `analytics_events`
--
ALTER TABLE `analytics_events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `analytics_metrics`
--
ALTER TABLE `analytics_metrics`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `white_label_id` (`white_label_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `announcement_analytics`
--
ALTER TABLE `announcement_analytics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `announcement_id` (`announcement_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `announcement_comments`
--
ALTER TABLE `announcement_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `announcement_id` (`announcement_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `announcement_likes`
--
ALTER TABLE `announcement_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_like` (`announcement_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `announcement_shares`
--
ALTER TABLE `announcement_shares`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_announcement_share` (`user_id`,`announcement_id`),
  ADD KEY `idx_announcement_shares_announcement_id` (`announcement_id`),
  ADD KEY `idx_announcement_shares_user_id` (`user_id`),
  ADD KEY `idx_announcement_shares_shared_at` (`shared_at`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `white_label_id` (`white_label_id`);

--
-- Indexes for table `client_template_customizations`
--
ALTER TABLE `client_template_customizations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `commissions`
--
ALTER TABLE `commissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `affiliate_id` (`affiliate_id`),
  ADD KEY `subscription_id` (`subscription_id`);

--
-- Indexes for table `custom_domains`
--
ALTER TABLE `custom_domains`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `domain_user_sessions`
--
ALTER TABLE `domain_user_sessions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `end_user_activities`
--
ALTER TABLE `end_user_activities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `integrations`
--
ALTER TABLE `integrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `integration_logs`
--
ALTER TABLE `integration_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `landing_pages`
--
ALTER TABLE `landing_pages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `domain_path` (`domain_path`);

--
-- Indexes for table `link_meta_images`
--
ALTER TABLE `link_meta_images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `nmi_credentials`
--
ALTER TABLE `nmi_credentials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payment_accounts`
--
ALTER TABLE `payment_accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `plans`
--
ALTER TABLE `plans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `plan_categories`
--
ALTER TABLE `plan_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `plan_products`
--
ALTER TABLE `plan_products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `platform_settings`
--
ALTER TABLE `platform_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `white_label_id` (`white_label_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `promoted_sales`
--
ALTER TABLE `promoted_sales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_promoter_user_id` (`promoter_user_id`),
  ADD KEY `idx_plan_owner_user_id` (`plan_owner_user_id`),
  ADD KEY `idx_buyer_user_id` (`buyer_user_id`),
  ADD KEY `idx_promoter_domain_path` (`promoter_domain_path`),
  ADD KEY `idx_sale_date` (`sale_date`),
  ADD KEY `idx_commission_status` (`commission_status`),
  ADD KEY `purchase_id` (`purchase_id`),
  ADD KEY `plan_id` (`plan_id`);

--
-- Indexes for table `purchase_history`
--
ALTER TABLE `purchase_history`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `referral_clicks`
--
ALTER TABLE `referral_clicks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `referral_commissions`
--
ALTER TABLE `referral_commissions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `referral_links`
--
ALTER TABLE `referral_links`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `referral_signups`
--
ALTER TABLE `referral_signups`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `referral_tracking`
--
ALTER TABLE `referral_tracking`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`sid`),
  ADD KEY `IDX_session_expire` (`expire`);

--
-- Indexes for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_white_label_id` (`white_label_id`),
  ADD KEY `idx_plan_id` (`plan_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `fk_subscriptions_user_id` (`user_id`);

--
-- Indexes for table `templates`
--
ALTER TABLE `templates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `themes`
--
ALTER TABLE `themes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_preferences`
--
ALTER TABLE `user_preferences`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_theme_preferences`
--
ALTER TABLE `user_theme_preferences`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `white_labels`
--
ALTER TABLE `white_labels`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `affiliates`
--
ALTER TABLE `affiliates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `affiliate_payments`
--
ALTER TABLE `affiliate_payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `affiliate_plan_visibility`
--
ALTER TABLE `affiliate_plan_visibility`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `ai_content_optimizations`
--
ALTER TABLE `ai_content_optimizations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `ai_generated_content`
--
ALTER TABLE `ai_generated_content`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=116;

--
-- AUTO_INCREMENT for table `ai_recommendations`
--
ALTER TABLE `ai_recommendations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `analytics_events`
--
ALTER TABLE `analytics_events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `analytics_metrics`
--
ALTER TABLE `analytics_metrics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- AUTO_INCREMENT for table `announcement_analytics`
--
ALTER TABLE `announcement_analytics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1592;

--
-- AUTO_INCREMENT for table `announcement_comments`
--
ALTER TABLE `announcement_comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `announcement_likes`
--
ALTER TABLE `announcement_likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=139;

--
-- AUTO_INCREMENT for table `announcement_shares`
--
ALTER TABLE `announcement_shares`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `client_template_customizations`
--
ALTER TABLE `client_template_customizations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `commissions`
--
ALTER TABLE `commissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `custom_domains`
--
ALTER TABLE `custom_domains`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `domain_user_sessions`
--
ALTER TABLE `domain_user_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=152;

--
-- AUTO_INCREMENT for table `end_user_activities`
--
ALTER TABLE `end_user_activities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=169;

--
-- AUTO_INCREMENT for table `integrations`
--
ALTER TABLE `integrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `integration_logs`
--
ALTER TABLE `integration_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `landing_pages`
--
ALTER TABLE `landing_pages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `link_meta_images`
--
ALTER TABLE `link_meta_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `nmi_credentials`
--
ALTER TABLE `nmi_credentials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `payment_accounts`
--
ALTER TABLE `payment_accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `plans`
--
ALTER TABLE `plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=143;

--
-- AUTO_INCREMENT for table `plan_categories`
--
ALTER TABLE `plan_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `plan_products`
--
ALTER TABLE `plan_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `platform_settings`
--
ALTER TABLE `platform_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `promoted_sales`
--
ALTER TABLE `promoted_sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `purchase_history`
--
ALTER TABLE `purchase_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=374;

--
-- AUTO_INCREMENT for table `referral_clicks`
--
ALTER TABLE `referral_clicks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `referral_commissions`
--
ALTER TABLE `referral_commissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `referral_links`
--
ALTER TABLE `referral_links`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `referral_signups`
--
ALTER TABLE `referral_signups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `referral_tracking`
--
ALTER TABLE `referral_tracking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT for table `templates`
--
ALTER TABLE `templates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `themes`
--
ALTER TABLE `themes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user_preferences`
--
ALTER TABLE `user_preferences`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `user_sessions`
--
ALTER TABLE `user_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=229;

--
-- AUTO_INCREMENT for table `user_theme_preferences`
--
ALTER TABLE `user_theme_preferences`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `white_labels`
--
ALTER TABLE `white_labels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `affiliates`
--
ALTER TABLE `affiliates`
  ADD CONSTRAINT `affiliates_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `affiliate_payments`
--
ALTER TABLE `affiliate_payments`
  ADD CONSTRAINT `affiliate_payments_ibfk_1` FOREIGN KEY (`affiliate_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `affiliate_payments_ibfk_2` FOREIGN KEY (`paid_by_user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `ai_generated_content`
--
ALTER TABLE `ai_generated_content`
  ADD CONSTRAINT `ai_generated_content_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `promoted_sales`
--
ALTER TABLE `promoted_sales`
  ADD CONSTRAINT `promoted_sales_ibfk_1` FOREIGN KEY (`purchase_id`) REFERENCES `purchase_history` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `promoted_sales_ibfk_2` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD CONSTRAINT `fk_subscriptions_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
