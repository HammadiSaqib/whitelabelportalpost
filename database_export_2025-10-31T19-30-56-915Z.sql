-- Database Export from neondb
-- Generated on: 2025-10-31T19:30:14.414Z
-- Host: ep-spring-paper-ae4fqe6n.c-2.us-east-2.aws.neon.tech

-- Table: activities
DROP TABLE IF EXISTS "activities" CASCADE;
CREATE TABLE "activities" (
  "id" int4 NOT NULL DEFAULT nextval('activities_id_seq'::regclass),
  "user_id" varchar(255) NOT NULL,
  "type" varchar(255) NOT NULL,
  "description" varchar(1000) NOT NULL,
  "metadata" jsonb,
  "created_at" timestamp DEFAULT now()
);

-- Data for table: activities
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (2, 'admin_1761023059755', 'user_login', 'Super (super_admin) logged in', '{"ipAddress":"::ffff:127.0.0.1","userAgent":"node-fetch/1.0 (+https://github.com/bitinn/node-fetch)","loginMethod":"local"}', '2025-10-21T11:09:10.939Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (3, 'admin_1761023059755', 'user_login', 'Super (super_admin) logged in', '{"ipAddress":"10.82.9.121","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-21T11:17:44.159Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (4, 'admin_1761023031290', 'user_login', 'Super (super_admin) logged in', '{"ipAddress":"10.82.9.121","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-21T17:29:36.113Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (5, 'admin_1761023031290', 'user_login', 'Super (super_admin) logged in', '{"ipAddress":"10.82.5.119","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-21T17:36:12.620Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (6, 'admin_1761023031290', 'user_login', 'Super (super_admin) logged in', '{"ipAddress":"10.82.4.22","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-22T08:41:44.779Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (7, 'admin_1761023031290', 'user_login', 'Super (super_admin) logged in', '{"ipAddress":"10.82.3.23","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-22T09:13:40.050Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (8, 'admin_1761023031290', 'user_login', 'Super (super_admin) logged in', '{"ipAddress":"10.82.4.70","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-22T09:30:43.037Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (9, 'admin_1761023031290', 'user_login', 'Super (super_admin) logged in', '{"ipAddress":"10.82.9.121","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-22T09:41:16.894Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (10, 'admin_1761023031290', 'user_login', 'Super (super_admin) logged in', '{"ipAddress":"10.82.6.4","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-22T11:34:17.052Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (11, 'admin_1761023031290', 'user_login', 'Super (super_admin) logged in', '{"ipAddress":"10.82.5.119","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-22T13:38:01.260Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (12, 'admin_1761023031290', 'user_login', 'Super (super_admin) logged in', '{"ipAddress":"10.82.6.4","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-22T16:15:05.963Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (13, 'admin_1761023031290', 'user_login', 'Super (super_admin) logged in', '{"ipAddress":"10.82.3.41","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-22T19:18:09.593Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (14, '9jx56q9of3z3so7', 'user_login', 'epic (super_admin_affiliate) logged in', '{"ipAddress":"10.82.6.4","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-22T19:47:35.915Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (15, 'admin_1761023031290', 'user_login', 'Super (super_admin) logged in', '{"ipAddress":"10.82.11.144","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-22T19:49:19.716Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (16, '9jx56q9of3z3so7', 'user_login', 'epic (super_admin_affiliate) logged in', '{"ipAddress":"10.82.6.4","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-22T19:58:22.678Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (17, '9jx56q9of3z3so7', 'user_login', 'epic (super_admin_affiliate) logged in', '{"ipAddress":"10.82.9.121","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-22T20:51:14.502Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (18, 'admin_1761023031290', 'user_login', 'Super (super_admin) logged in', '{"ipAddress":"10.82.9.121","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-22T22:25:56.425Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (19, 's7dbfr1bi9ib2qn', 'user_login', 'Hammad (white_label_affiliate) logged in', '{"ipAddress":"10.82.6.4","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-22T22:44:23.732Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (20, 's7dbfr1bi9ib2qn', 'user_login', 'Hammad (white_label_affiliate) logged in', '{"ipAddress":"10.82.6.4","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-22T22:47:44.455Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (21, 's7dbfr1bi9ib2qn', 'user_login', 'Hammad (white_label_affiliate) logged in', '{"ipAddress":"10.82.9.121","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-22T22:51:14.933Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (22, 's7dbfr1bi9ib2qn', 'user_login', 'Hammad (white_label_affiliate) logged in', '{"ipAddress":"10.82.3.48","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-22T23:08:10.383Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (23, 's7dbfr1bi9ib2qn', 'user_login', 'Hammad (white_label_affiliate) logged in', '{"ipAddress":"10.82.3.48","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-22T23:28:55.872Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (24, 'admin_1761023031290', 'user_login', 'Super (super_admin) logged in', '{"ipAddress":"10.82.5.119","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-22T23:37:02.682Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (25, 'admin_1761023031290', 'user_login', 'Super (super_admin) logged in', '{"ipAddress":"10.82.5.119","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-22T23:38:49.242Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (26, 's7dbfr1bi9ib2qn', 'user_login', 'Hammad (white_label_affiliate) logged in', '{"ipAddress":"10.82.9.121","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-22T23:52:15.495Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (27, 'izbb770i17l44pj', 'user_login', 'Ali (super_admin_affiliate) logged in', '{"ipAddress":"10.82.5.119","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-24T16:31:42.663Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (28, 's7dbfr1bi9ib2qn', 'user_login', 'Hammad (End-user) logged in', '{"ipAddress":"10.82.8.140","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-24T16:32:49.618Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (29, 'admin_1761023031290', 'user_login', 'Super (super_admin) logged in', '{"ipAddress":"10.82.5.119","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-24T16:35:17.836Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (30, '0fev12eo0oe2ovw', 'user_login', 'test (white_label_affiliate) logged in', '{"ipAddress":"10.82.2.99","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-24T17:30:44.534Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (31, 's7dbfr1bi9ib2qn', 'user_login', 'Hammad (End-user) logged in', '{"ipAddress":"10.82.9.121","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-24T18:01:40.055Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (32, '0fev12eo0oe2ovw', 'user_login', 'test (white_label_affiliate) logged in', '{"ipAddress":"10.82.11.144","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-24T18:02:51.534Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (33, 'admin_1761023031290', 'user_login', 'Super (super_admin) logged in', '{"ipAddress":"10.82.3.48","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-24T18:04:49.081Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (34, 's7dbfr1bi9ib2qn', 'user_login', 'Hammad (End-user) logged in', '{"ipAddress":"10.82.5.119","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-24T18:07:08.608Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (35, 'qn3rqhhyooxt4c8', 'user_login', 'Epic (super_admin_affiliate) logged in', '{"ipAddress":"10.82.0.70","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-24T18:26:04.749Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (36, '0fev12eo0oe2ovw', 'user_login', 'test (white_label_affiliate) logged in', '{"ipAddress":"10.82.5.119","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-24T18:27:08.259Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (37, 's7dbfr1bi9ib2qn', 'user_login', 'Hammad (End-user) logged in', '{"ipAddress":"10.82.9.121","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-24T18:30:02.287Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (38, 'admin_1761023031290', 'user_login', 'Super (super_admin) logged in', '{"ipAddress":"10.82.5.163","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T05:08:12.087Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (39, 'admin_1761023031290', 'user_login', 'Super (super_admin) logged in', '{"ipAddress":"10.82.6.182","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T05:17:47.628Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (40, 'admin_1761023031290', 'user_login', 'Super (super_admin) logged in', '{"ipAddress":"10.82.5.163","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T06:59:29.013Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (41, 'admin_1761023031290', 'user_login', 'Super (super_admin) logged in', '{"ipAddress":"10.82.7.213","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T07:31:48.904Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (42, '0hcverickhqijpi', 'user_login', 'Munib (white_label_affiliate) logged in', '{"ipAddress":"10.82.7.213","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T07:41:53.837Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (43, '0hcverickhqijpi', 'user_login', 'Munib (white_label_affiliate) logged in', '{"ipAddress":"10.82.2.232","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T07:50:45.932Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (44, 'admin_1761023031290', 'user_login', 'Super (super_admin) logged in', '{"ipAddress":"10.82.9.198","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T07:55:07.451Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (45, 'qn3rqhhyooxt4c8', 'user_login', 'Epic (super_admin_affiliate) logged in', '{"ipAddress":"10.82.0.34","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T08:06:15.055Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (46, 'qn3rqhhyooxt4c8', 'user_login', 'Epic (super_admin_affiliate) logged in', '{"ipAddress":"10.82.0.34","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T08:07:33.341Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (47, '0hcverickhqijpi', 'user_login', 'Munib (white_label_affiliate) logged in', '{"ipAddress":"10.82.5.163","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T08:17:30.170Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (48, '0hcverickhqijpi', 'user_login', 'Munib (white_label_affiliate) logged in', '{"ipAddress":"10.82.4.220","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T08:27:28.851Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (49, 'admin_1761023031290', 'user_login', 'Super (super_admin) logged in', '{"ipAddress":"10.82.5.163","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T08:33:20.141Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (50, '0hcverickhqijpi', 'user_login', 'Munib (white_label_affiliate) logged in', '{"ipAddress":"10.82.2.232","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T08:39:45.109Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (51, '0hcverickhqijpi', 'user_login', 'Munib (white_label_affiliate) logged in', '{"ipAddress":"10.82.6.182","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T08:41:25.474Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (52, 'admin_1761023031290', 'user_login', 'Super (super_admin) logged in', '{"ipAddress":"10.82.10.75","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T08:54:23.038Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (53, '0hcverickhqijpi', 'user_login', 'Munib (white_label_affiliate) logged in', '{"ipAddress":"10.82.2.232","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T09:11:19.254Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (54, '0hcverickhqijpi', 'user_login', 'Munib (white_label_affiliate) logged in', '{"ipAddress":"10.82.5.163","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T09:36:39.533Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (55, '9jx56q9of3z3so7', 'user_login', 'epic (super_admin_affiliate) logged in', '{"ipAddress":"10.82.6.182","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T09:45:36.986Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (56, '0hcverickhqijpi', 'user_login', 'Munib (white_label_affiliate) logged in', '{"ipAddress":"10.82.10.75","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T10:14:43.085Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (57, '9jx56q9of3z3so7', 'user_login', 'epic (super_admin_affiliate) logged in', '{"ipAddress":"10.82.2.232","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T10:15:10.472Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (58, '0hcverickhqijpi', 'user_login', 'Munib (white_label_affiliate) logged in', '{"ipAddress":"10.82.7.213","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T10:32:19.052Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (59, '0hcverickhqijpi', 'user_login', 'Munib (white_label_affiliate) logged in', '{"ipAddress":"10.82.3.169","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T10:34:44.628Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (60, '0hcverickhqijpi', 'user_login', 'Munib (white_label_affiliate) logged in', '{"ipAddress":"10.82.10.75","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T10:38:25.881Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (61, '9jx56q9of3z3so7', 'user_login', 'epic (super_admin_affiliate) logged in', '{"ipAddress":"10.82.10.75","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T10:40:42.171Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (62, '9jx56q9of3z3so7', 'user_login', 'epic (super_admin_affiliate) logged in', '{"ipAddress":"10.82.6.182","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T11:00:51.149Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (63, '0hcverickhqijpi', 'user_login', 'Munib (white_label_affiliate) logged in', '{"ipAddress":"10.82.5.163","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T11:02:15.070Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (64, '9jx56q9of3z3so7', 'user_login', 'epic (super_admin_affiliate) logged in', '{"ipAddress":"10.82.7.213","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T11:11:41.076Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (65, '0hcverickhqijpi', 'user_login', 'Munib (white_label_affiliate) logged in', '{"ipAddress":"10.82.4.220","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T11:14:07.801Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (66, 'admin_1761023031290', 'user_login', 'Super (super_admin) logged in', '{"ipAddress":"10.82.10.75","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T12:12:46.783Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (67, '0hcverickhqijpi', 'user_login', 'Munib (white_label_affiliate) logged in', '{"ipAddress":"10.82.9.198","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T12:20:28.849Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (68, '0hcverickhqijpi', 'user_login', 'Munib (white_label_affiliate) logged in', '{"ipAddress":"10.82.5.163","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T12:36:23.083Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (69, '0hcverickhqijpi', 'user_login', 'Munib (white_label_affiliate) logged in', '{"ipAddress":"::1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T13:51:51.716Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (70, '0hcverickhqijpi', 'user_login', 'Munib (white_label_affiliate) logged in', '{"ipAddress":"::1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T14:13:57.773Z');
INSERT INTO "activities" ("id", "user_id", "type", "description", "metadata", "created_at") VALUES (71, '0hcverickhqijpi', 'user_login', 'Munib (white_label_affiliate) logged in', '{"ipAddress":"::1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T14:28:16.284Z');

-- Table: affiliate_payments
DROP TABLE IF EXISTS "affiliate_payments" CASCADE;
CREATE TABLE "affiliate_payments" (
  "id" int4 NOT NULL DEFAULT nextval('affiliate_payments_id_seq'::regclass),
  "affiliate_id" varchar(255) NOT NULL,
  "paid_by" varchar(255),
  "amount" numeric(10,2) NOT NULL,
  "payment_method" varchar(255) DEFAULT 'bank_transfer'::character varying,
  "receipt_image_url" varchar(255),
  "notes" varchar(1000),
  "status" varchar(50) DEFAULT 'completed'::character varying,
  "metadata" jsonb,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now(),
  "paid_by_user_id" varchar(255),
  "transaction_proof_url" varchar(255),
  "description" varchar(1000),
  "historical_bank_name" varchar(255),
  "historical_account_number" varchar(255),
  "historical_account_owner_name" varchar(255),
  "historical_account_type" varchar(255),
  "currency" varchar(3) DEFAULT 'USD'::character varying,
  "transaction_id" varchar(255)
);

-- Data for table: affiliate_payments
INSERT INTO "affiliate_payments" ("id", "affiliate_id", "paid_by", "amount", "payment_method", "receipt_image_url", "notes", "status", "metadata", "created_at", "updated_at", "paid_by_user_id", "transaction_proof_url", "description", "historical_bank_name", "historical_account_number", "historical_account_owner_name", "historical_account_type", "currency", "transaction_id") VALUES (2, '9jx56q9of3z3so7', 'admin_1761023031290', '50.00', 'bank_transfer', NULL, NULL, 'completed', NULL, '2025-10-22T19:56:11.531Z', '2025-10-22T19:56:11.531Z', NULL, NULL, NULL, 'Meezan', '033332132121', 'Epic', 'business_checking', 'USD', NULL);
INSERT INTO "affiliate_payments" ("id", "affiliate_id", "paid_by", "amount", "payment_method", "receipt_image_url", "notes", "status", "metadata", "created_at", "updated_at", "paid_by_user_id", "transaction_proof_url", "description", "historical_bank_name", "historical_account_number", "historical_account_owner_name", "historical_account_type", "currency", "transaction_id") VALUES (5, '9jx56q9of3z3so7', 'admin_1761023031290', '30.00', 'bank_transfer', NULL, NULL, 'completed', NULL, '2025-10-31T07:55:38.179Z', '2025-10-31T07:55:38.179Z', NULL, '/uploads/payment-proofs/payment-proof-1761915337331-135408.jpg', 'Checking', 'Meezan', '033332132121', 'Epic', 'business_checking', 'USD', NULL);
INSERT INTO "affiliate_payments" ("id", "affiliate_id", "paid_by", "amount", "payment_method", "receipt_image_url", "notes", "status", "metadata", "created_at", "updated_at", "paid_by_user_id", "transaction_proof_url", "description", "historical_bank_name", "historical_account_number", "historical_account_owner_name", "historical_account_type", "currency", "transaction_id") VALUES (7, '0hcverickhqijpi', '526fdca7-303c-48b5-9676-0d0eba06d6fb', '10.00', 'bank_transfer', NULL, NULL, 'completed', NULL, '2025-10-31T09:37:36.000Z', '2025-10-31T09:37:36.000Z', NULL, NULL, 'Trdting', 'Meezan', '04532201010', 'Munib', 'business_savings', 'USD', NULL);
INSERT INTO "affiliate_payments" ("id", "affiliate_id", "paid_by", "amount", "payment_method", "receipt_image_url", "notes", "status", "metadata", "created_at", "updated_at", "paid_by_user_id", "transaction_proof_url", "description", "historical_bank_name", "historical_account_number", "historical_account_owner_name", "historical_account_type", "currency", "transaction_id") VALUES (4, '0hcverickhqijpi', '526fdca7-303c-48b5-9676-0d0eba06d6fb', '-50.00', 'bank_transfer', NULL, NULL, 'completed', NULL, '2025-10-31T07:54:20.825Z', '2025-10-31T07:54:20.825Z', NULL, '/uploads/payment-proofs/payment-proof-1761915337331-135408.jpg', 'For Checking', 'Meezan', '04532201010', 'Munib', 'business_savings', 'USD', NULL);
INSERT INTO "affiliate_payments" ("id", "affiliate_id", "paid_by", "amount", "payment_method", "receipt_image_url", "notes", "status", "metadata", "created_at", "updated_at", "paid_by_user_id", "transaction_proof_url", "description", "historical_bank_name", "historical_account_number", "historical_account_owner_name", "historical_account_type", "currency", "transaction_id") VALUES (6, '0hcverickhqijpi', '526fdca7-303c-48b5-9676-0d0eba06d6fb', '25.00', 'bank_transfer', NULL, NULL, 'completed', NULL, '2025-10-31T09:22:33.073Z', '2025-10-31T09:22:33.073Z', NULL, NULL, NULL, 'Meezan', '04532201010', 'Munib', 'business_savings', 'USD', NULL);
INSERT INTO "affiliate_payments" ("id", "affiliate_id", "paid_by", "amount", "payment_method", "receipt_image_url", "notes", "status", "metadata", "created_at", "updated_at", "paid_by_user_id", "transaction_proof_url", "description", "historical_bank_name", "historical_account_number", "historical_account_owner_name", "historical_account_type", "currency", "transaction_id") VALUES (8, '0hcverickhqijpi', '526fdca7-303c-48b5-9676-0d0eba06d6fb', '5.00', 'bank_transfer', NULL, NULL, 'completed', NULL, '2025-10-31T09:38:25.308Z', '2025-10-31T09:38:25.308Z', NULL, NULL, 'ddddd', 'Meezan', '04532201010', 'Munib', 'business_savings', 'USD', NULL);
INSERT INTO "affiliate_payments" ("id", "affiliate_id", "paid_by", "amount", "payment_method", "receipt_image_url", "notes", "status", "metadata", "created_at", "updated_at", "paid_by_user_id", "transaction_proof_url", "description", "historical_bank_name", "historical_account_number", "historical_account_owner_name", "historical_account_type", "currency", "transaction_id") VALUES (9, '0hcverickhqijpi', '526fdca7-303c-48b5-9676-0d0eba06d6fb', '1.00', 'bank_transfer', NULL, NULL, 'completed', NULL, '2025-10-31T10:12:39.909Z', '2025-10-31T10:12:39.909Z', NULL, NULL, NULL, 'Meezan', '04532201010', 'Munib', 'business_savings', 'USD', NULL);
INSERT INTO "affiliate_payments" ("id", "affiliate_id", "paid_by", "amount", "payment_method", "receipt_image_url", "notes", "status", "metadata", "created_at", "updated_at", "paid_by_user_id", "transaction_proof_url", "description", "historical_bank_name", "historical_account_number", "historical_account_owner_name", "historical_account_type", "currency", "transaction_id") VALUES (10, '0hcverickhqijpi', '526fdca7-303c-48b5-9676-0d0eba06d6fb', '1.00', 'bank_transfer', NULL, NULL, 'completed', NULL, '2025-10-31T10:32:58.102Z', '2025-10-31T10:32:58.102Z', NULL, NULL, NULL, 'Meezan', '04532201010', 'Munib', 'business_savings', 'USD', NULL);
INSERT INTO "affiliate_payments" ("id", "affiliate_id", "paid_by", "amount", "payment_method", "receipt_image_url", "notes", "status", "metadata", "created_at", "updated_at", "paid_by_user_id", "transaction_proof_url", "description", "historical_bank_name", "historical_account_number", "historical_account_owner_name", "historical_account_type", "currency", "transaction_id") VALUES (11, '0hcverickhqijpi', '526fdca7-303c-48b5-9676-0d0eba06d6fb', '2.00', 'bank_transfer', NULL, NULL, 'completed', NULL, '2025-10-31T10:34:04.372Z', '2025-10-31T10:34:04.372Z', NULL, NULL, NULL, 'Meezan', '04532201010', 'Munib', 'business_savings', 'USD', NULL);
INSERT INTO "affiliate_payments" ("id", "affiliate_id", "paid_by", "amount", "payment_method", "receipt_image_url", "notes", "status", "metadata", "created_at", "updated_at", "paid_by_user_id", "transaction_proof_url", "description", "historical_bank_name", "historical_account_number", "historical_account_owner_name", "historical_account_type", "currency", "transaction_id") VALUES (12, '0hcverickhqijpi', '526fdca7-303c-48b5-9676-0d0eba06d6fb', '1.10', 'bank_transfer', NULL, NULL, 'completed', NULL, '2025-10-31T10:40:10.692Z', '2025-10-31T10:40:10.692Z', NULL, NULL, 'Test', 'Meezan', '04532201010', 'Munib', 'business_savings', 'USD', NULL);
INSERT INTO "affiliate_payments" ("id", "affiliate_id", "paid_by", "amount", "payment_method", "receipt_image_url", "notes", "status", "metadata", "created_at", "updated_at", "paid_by_user_id", "transaction_proof_url", "description", "historical_bank_name", "historical_account_number", "historical_account_owner_name", "historical_account_type", "currency", "transaction_id") VALUES (13, '0hcverickhqijpi', '526fdca7-303c-48b5-9676-0d0eba06d6fb', '0.10', 'bank_transfer', NULL, NULL, 'completed', NULL, '2025-10-31T11:01:06.703Z', '2025-10-31T11:01:06.703Z', NULL, '/uploads/payment-proofs/payment-proof-1761926466111-682216904.jpg', NULL, 'Meezan', '04532201010', 'Munib', 'business_savings', 'USD', NULL);

-- Table: affiliate_plan_visibility
DROP TABLE IF EXISTS "affiliate_plan_visibility" CASCADE;
CREATE TABLE "affiliate_plan_visibility" (
  "id" int4 NOT NULL DEFAULT nextval('affiliate_plan_visibility_id_seq'::regclass),
  "affiliate_id" varchar(255) NOT NULL,
  "plan_id" int4 NOT NULL,
  "is_visible" bool DEFAULT false,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Data for table: affiliate_plan_visibility
INSERT INTO "affiliate_plan_visibility" ("id", "affiliate_id", "plan_id", "is_visible", "created_at", "updated_at") VALUES (2, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 14, TRUE, '2025-10-23T00:19:08.307Z', '2025-10-23T00:19:08.307Z');

-- Table: affiliates
DROP TABLE IF EXISTS "affiliates" CASCADE;
CREATE TABLE "affiliates" (
  "id" int4 NOT NULL DEFAULT nextval('affiliates_id_seq'::regclass),
  "user_id" varchar(255) NOT NULL,
  "affiliate_type" varchar(50),
  "parent_id" varchar(255),
  "commission_rate" numeric(5,2) NOT NULL DEFAULT 10.00,
  "total_earnings" numeric(10,2) DEFAULT 0.00,
  "is_active" bool DEFAULT true,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now(),
  "referral_code" varchar(255),
  "total_referrals" int4 DEFAULT 0,
  "bank_name" varchar(255),
  "account_number" varchar(255),
  "account_owner_name" varchar(255),
  "account_type" varchar(255)
);

-- Table: ai_content_optimizations
DROP TABLE IF EXISTS "ai_content_optimizations" CASCADE;
CREATE TABLE "ai_content_optimizations" (
  "id" int4 NOT NULL DEFAULT nextval('ai_content_optimizations_id_seq'::regclass),
  "user_id" varchar(255) NOT NULL,
  "original_content" varchar(1000) NOT NULL,
  "optimized_content" varchar(1000) NOT NULL,
  "optimization_type" varchar(50) NOT NULL,
  "improvements" jsonb,
  "quality_score" int4,
  "is_applied" bool DEFAULT false,
  "created_at" timestamp DEFAULT now()
);

-- Table: ai_generated_content
DROP TABLE IF EXISTS "ai_generated_content" CASCADE;
CREATE TABLE "ai_generated_content" (
  "id" int4 NOT NULL DEFAULT nextval('ai_generated_content_id_seq'::regclass),
  "user_id" varchar(255) NOT NULL,
  "type" varchar(50) NOT NULL,
  "prompt" varchar(1000) NOT NULL,
  "generated_content" varchar(1000) NOT NULL,
  "metadata" jsonb,
  "is_approved" bool DEFAULT false,
  "usage_count" int4 DEFAULT 0,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Table: ai_recommendations
DROP TABLE IF EXISTS "ai_recommendations" CASCADE;
CREATE TABLE "ai_recommendations" (
  "id" int4 NOT NULL DEFAULT nextval('ai_recommendations_id_seq'::regclass),
  "user_id" varchar(255) NOT NULL,
  "type" varchar(50) NOT NULL,
  "title" varchar(255) NOT NULL,
  "description" varchar(1000) NOT NULL,
  "reason" varchar(1000),
  "priority" int4 DEFAULT 1,
  "is_viewed" bool DEFAULT false,
  "is_actioned" bool DEFAULT false,
  "metadata" jsonb,
  "expires_at" timestamp,
  "created_at" timestamp DEFAULT now()
);

-- Table: analytics_events
DROP TABLE IF EXISTS "analytics_events" CASCADE;
CREATE TABLE "analytics_events" (
  "id" int4 NOT NULL DEFAULT nextval('analytics_events_id_seq'::regclass),
  "user_id" varchar(255),
  "session_id" varchar(255),
  "event_type" varchar(100) NOT NULL,
  "event_data" jsonb,
  "user_agent" varchar(255),
  "ip_address" varchar(45),
  "timestamp" timestamp DEFAULT now()
);

-- Table: analytics_metrics
DROP TABLE IF EXISTS "analytics_metrics" CASCADE;
CREATE TABLE "analytics_metrics" (
  "id" int4 NOT NULL DEFAULT nextval('analytics_metrics_id_seq'::regclass),
  "metric_name" varchar(255) NOT NULL,
  "metric_value" varchar(255) NOT NULL,
  "dimensions" jsonb,
  "period" varchar(20) NOT NULL,
  "date" timestamp NOT NULL,
  "created_at" timestamp DEFAULT now()
);

-- Table: announcement_analytics
DROP TABLE IF EXISTS "announcement_analytics" CASCADE;
CREATE TABLE "announcement_analytics" (
  "id" int4 NOT NULL DEFAULT nextval('announcement_analytics_id_seq'::regclass),
  "announcement_id" int4 NOT NULL,
  "user_id" varchar(255) NOT NULL,
  "event_type" varchar(50) NOT NULL,
  "event_data" jsonb,
  "session_id" varchar(255),
  "created_at" timestamp DEFAULT now()
);

-- Data for table: announcement_analytics
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (2, 2, 'admin_1761023059755', 'view', '{}', NULL, '2025-10-21T11:23:07.574Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (3, 2, 'admin_1761023059755', 'view', '{}', NULL, '2025-10-21T11:23:08.033Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (4, 2, 'admin_1761023059755', 'view', '{}', NULL, '2025-10-21T11:23:08.526Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (5, 2, 'admin_1761023059755', 'view', '{}', NULL, '2025-10-21T11:23:09.212Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (6, 2, 'admin_1761023059755', 'click', '{"elementClicked":"card"}', NULL, '2025-10-21T11:23:09.642Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (7, 2, 'admin_1761023059755', 'view', '{}', NULL, '2025-10-21T11:23:19.284Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (8, 2, 'admin_1761023059755', 'view', '{}', NULL, '2025-10-21T11:23:20.147Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (9, 2, 'admin_1761023059755', 'click', '{"elementClicked":"card"}', NULL, '2025-10-21T11:23:20.588Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (10, 2, 'admin_1761023059755', 'view', '{}', NULL, '2025-10-21T11:23:21.716Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (11, 2, 'admin_1761023059755', 'view', '{}', NULL, '2025-10-21T11:23:22.148Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (12, 2, 'admin_1761023059755', 'view', '{}', NULL, '2025-10-21T11:23:22.816Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (13, 2, 'admin_1761023059755', 'view', '{}', NULL, '2025-10-21T11:23:24.950Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (14, 2, 'admin_1761023059755', 'click', '{"elementClicked":"like"}', NULL, '2025-10-21T11:23:25.724Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (15, 2, 'admin_1761023059755', 'click', '{"elementClicked":"like"}', NULL, '2025-10-21T11:23:26.982Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (16, 2, 'admin_1761023059755', 'click', '{"elementClicked":"like"}', NULL, '2025-10-21T11:23:28.887Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (17, 2, 'admin_1761023059755', 'click', '{"elementClicked":"comment"}', NULL, '2025-10-21T11:23:29.558Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (18, 2, 'admin_1761023059755', 'click', '{"elementClicked":"card"}', NULL, '2025-10-21T11:23:30.300Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (19, 2, 'admin_1761023059755', 'view', '{}', NULL, '2025-10-21T11:23:33.188Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (20, 2, 'admin_1761023059755', 'click', '{"elementClicked":"share"}', NULL, '2025-10-21T11:23:34.045Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (21, 2, 'admin_1761023059755', 'view', '{}', NULL, '2025-10-21T11:23:36.330Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (22, 2, 'admin_1761023059755', 'view', '{}', NULL, '2025-10-21T11:24:44.461Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (23, 2, 'admin_1761023059755', 'view', '{}', NULL, '2025-10-21T11:24:45.010Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (24, 2, 'admin_1761023059755', 'view', '{}', NULL, '2025-10-21T11:24:45.938Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (25, 2, 'admin_1761023059755', 'view', '{}', NULL, '2025-10-21T11:30:14.857Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (26, 2, 'admin_1761023059755', 'view', '{}', NULL, '2025-10-21T11:30:16.108Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (27, 2, 'admin_1761023059755', 'view', '{}', NULL, '2025-10-21T11:30:16.352Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (28, 2, 'admin_1761023059755', 'click', '{"elementClicked":"card"}', NULL, '2025-10-21T11:30:16.811Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (29, 2, 'admin_1761023031290', 'view', '{}', NULL, '2025-10-21T18:18:37.781Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (30, 2, 'admin_1761023031290', 'click', '{"elementClicked":"comment"}', NULL, '2025-10-21T18:18:39.461Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (31, 2, 'admin_1761023031290', 'view', '{}', NULL, '2025-10-21T18:18:55.357Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (32, 2, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-21T18:18:59.244Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (33, 2, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-21T18:19:05.374Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (34, 3, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-21T18:19:07.068Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (35, 3, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-21T18:19:37.776Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (36, 2, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-21T18:19:37.880Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (37, 2, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-21T18:19:41.842Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (38, 3, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-21T18:19:42.472Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (39, 3, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-21T18:19:44.177Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (40, 3, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-21T18:19:44.844Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (41, 2, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-21T18:19:45.727Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (42, 3, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-21T18:19:46.365Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (43, 2, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-21T18:19:47.119Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (44, 3, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'click', '{"elementClicked":"like"}', NULL, '2025-10-21T18:19:47.149Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (45, 3, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-21T18:19:47.714Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (46, 2, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-21T18:19:48.936Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (47, 3, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-21T18:19:49.721Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (48, 3, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-21T18:19:50.590Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (49, 3, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'click', '{"elementClicked":"card"}', NULL, '2025-10-21T18:19:51.310Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (50, 3, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-21T18:20:02.881Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (51, 3, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-21T18:20:05.625Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (52, 3, 'admin_1761023031290', 'view', '{}', NULL, '2025-10-21T18:20:30.818Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (53, 3, 'admin_1761023031290', 'click', '{"elementClicked":"comment"}', NULL, '2025-10-21T18:20:32.002Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (54, 3, 'admin_1761023031290', 'click', '{"elementClicked":"card"}', NULL, '2025-10-21T18:20:32.677Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (55, 3, '24aadd3e-4821-4c16-bb9d-7cd6788994e7', 'view', '{}', NULL, '2025-10-22T13:34:28.053Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (56, 4, '24aadd3e-4821-4c16-bb9d-7cd6788994e7', 'view', '{}', NULL, '2025-10-22T13:34:29.289Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (57, 4, 'admin_1761023031290', 'view', '{}', NULL, '2025-10-22T19:49:33.850Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (58, 2, 'admin_1761023031290', 'view', '{}', NULL, '2025-10-22T19:49:45.668Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (59, 4, 'admin_1761023031290', 'view', '{}', NULL, '2025-10-22T19:49:50.480Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (60, 2, 'admin_1761023031290', 'view', '{}', NULL, '2025-10-22T19:49:57.322Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (61, 3, 'admin_1761023031290', 'view', '{}', NULL, '2025-10-22T19:50:07.077Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (62, 4, 'admin_1761023031290', 'view', '{}', NULL, '2025-10-22T19:50:07.222Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (63, 2, 'admin_1761023031290', 'view', '{}', NULL, '2025-10-22T19:50:13.579Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (64, 2, 'admin_1761023031290', 'click', '{"elementClicked":"like"}', NULL, '2025-10-22T19:50:15.250Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (65, 2, 'admin_1761023031290', 'click', '{"elementClicked":"like"}', NULL, '2025-10-22T19:50:17.812Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (66, 3, 'admin_1761023031290', 'view', '{}', NULL, '2025-10-22T19:50:21.565Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (67, 4, 'admin_1761023031290', 'view', '{}', NULL, '2025-10-22T19:50:21.878Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (68, 4, 'admin_1761023031290', 'view', '{}', NULL, '2025-10-22T19:51:33.065Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (69, 5, 'admin_1761023031290', 'view', '{}', NULL, '2025-10-22T19:51:33.603Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (70, 5, 'admin_1761023031290', 'view', '{}', NULL, '2025-10-22T19:51:35.928Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (71, 5, 'admin_1761023031290', 'view', '{}', NULL, '2025-10-22T19:51:37.640Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (72, 5, 'admin_1761023031290', 'view', '{}', NULL, '2025-10-22T19:51:46.020Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (73, 5, 'admin_1761023031290', 'view', '{}', NULL, '2025-10-22T19:51:46.669Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (74, 5, 'admin_1761023031290', 'click', '{"elementClicked":"like"}', NULL, '2025-10-22T19:51:47.627Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (75, 5, 'admin_1761023031290', 'click', '{"elementClicked":"like"}', NULL, '2025-10-22T19:51:48.836Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (76, 5, 'admin_1761023031290', 'click', '{"elementClicked":"like"}', NULL, '2025-10-22T19:51:55.019Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (77, 5, 'admin_1761023031290', 'click', '{"elementClicked":"like"}', NULL, '2025-10-22T19:51:56.685Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (78, 5, 'admin_1761023031290', 'view', '{}', NULL, '2025-10-22T19:52:04.484Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (79, 5, 'admin_1761023031290', 'click', '{"elementClicked":"like"}', NULL, '2025-10-22T19:52:05.429Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (80, 4, 'admin_1761023031290', 'view', '{}', NULL, '2025-10-22T19:52:07.017Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (81, 5, 'admin_1761023031290', 'view', '{}', NULL, '2025-10-22T19:52:16.996Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (82, 5, 'admin_1761023031290', 'view', '{}', NULL, '2025-10-22T19:52:44.302Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (83, 5, 'admin_1761023031290', 'view', '{}', NULL, '2025-10-22T19:52:55.737Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (84, 3, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-24T16:45:07.440Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (85, 3, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-24T16:45:07.907Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (86, 3, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T08:02:02.476Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (87, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T08:02:03.836Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (88, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T08:02:07.370Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (89, 3, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T08:02:08.250Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (90, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T08:02:08.499Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (91, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'click', '{"elementClicked":"like"}', NULL, '2025-10-31T08:02:09.005Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (92, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'click', '{"elementClicked":"comment"}', NULL, '2025-10-31T08:02:11.521Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (93, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'click', '{"elementClicked":"card"}', NULL, '2025-10-31T08:02:12.372Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (95, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T08:02:26.637Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (94, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T08:02:18.318Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (96, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T08:02:27.067Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (97, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T08:02:28.171Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (98, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T08:02:30.517Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (99, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T08:07:54.046Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (100, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T08:07:59.885Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (101, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T08:08:00.829Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (102, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T08:08:04.465Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (103, 3, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T08:08:05.035Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (104, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T08:08:06.168Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (105, 5, 'admin_1761023031290', 'view', '{}', NULL, '2025-10-31T08:08:21.305Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (106, 5, 'admin_1761023031290', 'click', '{"elementClicked":"like"}', NULL, '2025-10-31T08:08:22.402Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (107, 5, 'admin_1761023031290', 'view', '{}', NULL, '2025-10-31T08:08:23.365Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (108, 5, 'admin_1761023031290', 'click', '{"elementClicked":"like"}', NULL, '2025-10-31T08:08:24.113Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (109, 6, 'admin_1761023031290', 'view', '{}', NULL, '2025-10-31T08:55:08.143Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (110, 6, 'admin_1761023031290', 'view', '{}', NULL, '2025-10-31T08:55:36.988Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (111, 6, 'admin_1761023031290', 'click', '{"elementClicked":"like"}', NULL, '2025-10-31T08:55:37.124Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (112, 5, 'admin_1761023031290', 'view', '{}', NULL, '2025-10-31T09:05:55.963Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (113, 6, 'admin_1761023031290', 'view', '{}', NULL, '2025-10-31T09:05:56.071Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (114, 6, 'admin_1761023031290', 'view', '{}', NULL, '2025-10-31T09:06:37.043Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (115, 5, 'admin_1761023031290', 'view', '{}', NULL, '2025-10-31T09:06:38.305Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (116, 6, 'admin_1761023031290', 'view', '{}', NULL, '2025-10-31T09:06:38.384Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (117, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T09:48:20.754Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (118, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'click', '{"elementClicked":"like"}', NULL, '2025-10-31T09:48:21.937Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (119, 3, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T09:48:24.193Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (120, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T09:48:24.514Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (121, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'click', '{"elementClicked":"like"}', NULL, '2025-10-31T09:48:24.948Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (122, 3, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T09:48:27.399Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (123, 3, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T09:48:28.791Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (124, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T09:48:29.222Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (125, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'click', '{"elementClicked":"card"}', NULL, '2025-10-31T09:48:29.568Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (126, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'click', '{"elementClicked":"like"}', NULL, '2025-10-31T09:48:29.855Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (127, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'click', '{"elementClicked":"like"}', NULL, '2025-10-31T09:48:32.560Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (128, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T09:48:35.167Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (129, 3, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T09:48:38.060Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (130, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T09:48:38.368Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (131, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'click', '{"elementClicked":"like"}', NULL, '2025-10-31T09:48:38.818Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (132, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'click', '{"elementClicked":"like"}', NULL, '2025-10-31T09:48:41.645Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (133, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T09:48:43.482Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (134, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'click', '{"elementClicked":"like"}', NULL, '2025-10-31T09:48:46.150Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (135, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'click', '{"elementClicked":"like"}', NULL, '2025-10-31T09:48:48.681Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (136, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T09:49:03.972Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (137, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T10:12:16.157Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (138, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T10:12:18.296Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (139, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T10:39:30.739Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (140, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'click', '{"elementClicked":"like"}', NULL, '2025-10-31T10:39:31.983Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (141, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T10:39:33.005Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (142, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T10:39:39.883Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (143, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T10:39:42.083Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (144, 5, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T10:39:42.185Z');
INSERT INTO "announcement_analytics" ("id", "announcement_id", "user_id", "event_type", "event_data", "session_id", "created_at") VALUES (145, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'view', '{}', NULL, '2025-10-31T10:39:47.170Z');

-- Table: announcement_comments
DROP TABLE IF EXISTS "announcement_comments" CASCADE;
CREATE TABLE "announcement_comments" (
  "id" int4 NOT NULL DEFAULT nextval('announcement_comments_id_seq'::regclass),
  "announcement_id" int4 NOT NULL,
  "user_id" varchar(255) NOT NULL,
  "content" varchar(1000) NOT NULL,
  "parent_comment_id" int4,
  "is_active" bool DEFAULT true,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Data for table: announcement_comments
INSERT INTO "announcement_comments" ("id", "announcement_id", "user_id", "content", "parent_comment_id", "is_active", "created_at", "updated_at") VALUES (2, 2, 'admin_1761023059755', 'Hey', NULL, TRUE, '2025-10-21T11:23:32.249Z', '2025-10-21T11:23:32.249Z');
INSERT INTO "announcement_comments" ("id", "announcement_id", "user_id", "content", "parent_comment_id", "is_active", "created_at", "updated_at") VALUES (3, 2, 'izbb770i17l44pj', 'hi', NULL, TRUE, '2025-10-21T18:18:28.078Z', '2025-10-21T18:18:28.078Z');
INSERT INTO "announcement_comments" ("id", "announcement_id", "user_id", "content", "parent_comment_id", "is_active", "created_at", "updated_at") VALUES (4, 4, '54b33e98-23c3-4fe4-a664-7a688a613730', 'Hey', NULL, TRUE, '2025-10-22T13:35:01.542Z', '2025-10-22T13:35:01.542Z');
INSERT INTO "announcement_comments" ("id", "announcement_id", "user_id", "content", "parent_comment_id", "is_active", "created_at", "updated_at") VALUES (5, 2, '9jx56q9of3z3so7', 'Yooo', NULL, TRUE, '2025-10-22T19:17:20.989Z', '2025-10-22T19:17:20.989Z');
INSERT INTO "announcement_comments" ("id", "announcement_id", "user_id", "content", "parent_comment_id", "is_active", "created_at", "updated_at") VALUES (6, 6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'Well Work', NULL, TRUE, '2025-10-31T08:02:17.656Z', '2025-10-31T08:02:17.656Z');
INSERT INTO "announcement_comments" ("id", "announcement_id", "user_id", "content", "parent_comment_id", "is_active", "created_at", "updated_at") VALUES (7, 5, '9jx56q9of3z3so7', 'Hello', NULL, TRUE, '2025-10-31T09:45:54.573Z', '2025-10-31T09:45:54.573Z');
INSERT INTO "announcement_comments" ("id", "announcement_id", "user_id", "content", "parent_comment_id", "is_active", "created_at", "updated_at") VALUES (8, 6, '0hcverickhqijpi', 'Well', NULL, TRUE, '2025-10-31T10:35:44.071Z', '2025-10-31T10:35:44.071Z');
INSERT INTO "announcement_comments" ("id", "announcement_id", "user_id", "content", "parent_comment_id", "is_active", "created_at", "updated_at") VALUES (9, 6, '0hcverickhqijpi', 'Wellllll', NULL, TRUE, '2025-10-31T10:38:55.727Z', '2025-10-31T10:38:55.727Z');
INSERT INTO "announcement_comments" ("id", "announcement_id", "user_id", "content", "parent_comment_id", "is_active", "created_at", "updated_at") VALUES (10, 5, '9jx56q9of3z3so7', 'well', NULL, TRUE, '2025-10-31T10:41:24.011Z', '2025-10-31T10:41:24.011Z');
INSERT INTO "announcement_comments" ("id", "announcement_id", "user_id", "content", "parent_comment_id", "is_active", "created_at", "updated_at") VALUES (11, 5, '9jx56q9of3z3so7', 'h', NULL, TRUE, '2025-10-31T10:41:32.042Z', '2025-10-31T10:41:32.042Z');

-- Table: announcement_likes
DROP TABLE IF EXISTS "announcement_likes" CASCADE;
CREATE TABLE "announcement_likes" (
  "id" int4 NOT NULL DEFAULT nextval('announcement_likes_id_seq'::regclass),
  "announcement_id" int4 NOT NULL,
  "user_id" varchar(255) NOT NULL,
  "created_at" timestamp DEFAULT now()
);

-- Data for table: announcement_likes
INSERT INTO "announcement_likes" ("id", "announcement_id", "user_id", "created_at") VALUES (3, 2, 'admin_1761023059755', '2025-10-21T11:23:28.947Z');
INSERT INTO "announcement_likes" ("id", "announcement_id", "user_id", "created_at") VALUES (4, 3, '526fdca7-303c-48b5-9676-0d0eba06d6fb', '2025-10-21T18:19:47.207Z');
INSERT INTO "announcement_likes" ("id", "announcement_id", "user_id", "created_at") VALUES (5, 4, '54b33e98-23c3-4fe4-a664-7a688a613730', '2025-10-22T13:34:54.960Z');
INSERT INTO "announcement_likes" ("id", "announcement_id", "user_id", "created_at") VALUES (12, 3, 's7dbfr1bi9ib2qn', '2025-10-24T16:33:24.238Z');
INSERT INTO "announcement_likes" ("id", "announcement_id", "user_id", "created_at") VALUES (16, 5, 'admin_1761023031290', '2025-10-31T08:08:24.171Z');
INSERT INTO "announcement_likes" ("id", "announcement_id", "user_id", "created_at") VALUES (17, 5, 'qn3rqhhyooxt4c8', '2025-10-31T08:08:30.042Z');
INSERT INTO "announcement_likes" ("id", "announcement_id", "user_id", "created_at") VALUES (18, 6, 'admin_1761023031290', '2025-10-31T08:55:37.310Z');
INSERT INTO "announcement_likes" ("id", "announcement_id", "user_id", "created_at") VALUES (43, 3, '0hcverickhqijpi', '2025-10-31T10:39:25.281Z');
INSERT INTO "announcement_likes" ("id", "announcement_id", "user_id", "created_at") VALUES (53, 2, '9jx56q9of3z3so7', '2025-10-31T11:03:11.312Z');

-- Table: announcement_shares
DROP TABLE IF EXISTS "announcement_shares" CASCADE;
CREATE TABLE "announcement_shares" (
  "id" int4 NOT NULL DEFAULT nextval('announcement_shares_id_seq'::regclass),
  "announcement_id" int4 NOT NULL,
  "user_id" varchar(255) NOT NULL,
  "shared_with" varchar(50) DEFAULT 'public'::character varying,
  "created_at" timestamp DEFAULT now()
);

-- Table: announcements
DROP TABLE IF EXISTS "announcements" CASCADE;
CREATE TABLE "announcements" (
  "id" int4 NOT NULL DEFAULT nextval('announcements_id_seq'::regclass),
  "user_id" varchar(255) NOT NULL,
  "white_label_id" int4,
  "title" varchar(255),
  "content" varchar(1000) NOT NULL,
  "attachments" jsonb DEFAULT '[]'::jsonb,
  "visibility" varchar(50) DEFAULT 'public'::character varying,
  "status" varchar(50) DEFAULT 'draft'::character varying,
  "scheduled_at" timestamp,
  "published_at" timestamp,
  "targeting_type" varchar(50) DEFAULT 'everyone'::character varying,
  "targeted_plan_ids" jsonb DEFAULT '[]'::jsonb,
  "is_pinned" bool DEFAULT false,
  "is_active" bool DEFAULT true,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Data for table: announcements
INSERT INTO "announcements" ("id", "user_id", "white_label_id", "title", "content", "attachments", "visibility", "status", "scheduled_at", "published_at", "targeting_type", "targeted_plan_ids", "is_pinned", "is_active", "created_at", "updated_at") VALUES (2, 'admin_1761023059755', NULL, 'news', '', '[{"url":"/uploads/announcement_1761063798223-864259371_avatar_profile_icon_in_flat_style_male_user_profile_illustration_on_isolated_background_man_profile_sign_business_concept_vector.jpg","name":"avatar-profile-icon-in-flat-style-male-user-profile-illustration-on-isolated-background-man-profile-sign-business-concept-vector.jpg","size":14290,"type":"image/jpeg"}]', 'public', 'published', NULL, '2025-10-21T11:23:18.291Z', 'everyone', '[]', FALSE, TRUE, '2025-10-21T11:23:05.741Z', '2025-10-21T11:23:18.409Z');
INSERT INTO "announcements" ("id", "user_id", "white_label_id", "title", "content", "attachments", "visibility", "status", "scheduled_at", "published_at", "targeting_type", "targeted_plan_ids", "is_pinned", "is_active", "created_at", "updated_at") VALUES (3, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'news', '', '[{"url":"/uploads/announcement_1761088797931-796422234_68067e4f81c3b027f20b51ef.png","name":"68067e4f81c3b027f20b51ef.png","size":111603,"type":"image/png"}]', 'public', 'published', NULL, '2025-10-21T18:19:58.180Z', 'everyone', '[]', FALSE, TRUE, '2025-10-21T18:19:04.863Z', '2025-10-21T18:19:58.417Z');
INSERT INTO "announcements" ("id", "user_id", "white_label_id", "title", "content", "attachments", "visibility", "status", "scheduled_at", "published_at", "targeting_type", "targeted_plan_ids", "is_pinned", "is_active", "created_at", "updated_at") VALUES (4, '24aadd3e-4821-4c16-bb9d-7cd6788994e7', 3, 'Testing', '', '[{"url":"/uploads/announcement_1761158067332-968592310_news_grunge_text_460848_9369.jpg","name":"news-grunge-text_460848-9369.jpg","size":19804,"type":"image/jpeg"}]', 'public', 'published', NULL, '2025-10-22T13:34:27.472Z', 'everyone', '[]', FALSE, TRUE, '2025-10-22T13:34:27.505Z', '2025-10-22T13:34:27.505Z');
INSERT INTO "announcements" ("id", "user_id", "white_label_id", "title", "content", "attachments", "visibility", "status", "scheduled_at", "published_at", "targeting_type", "targeted_plan_ids", "is_pinned", "is_active", "created_at", "updated_at") VALUES (5, 'admin_1761023031290', NULL, 'Image Checking', '', '[{"url":"/uploads/announcement_1761180692515-415762402_yellow_megaphone_with_welcome_speech_clouds_chat_bubble_3d_rendering_476612_30535.jpg","name":"yellow-megaphone-with-welcome-speech-clouds-chat-bubble-3d-rendering_476612-30535.jpg","size":7352,"type":"image/jpeg"}]', 'public', 'published', NULL, '2025-10-22T19:51:32.517Z', 'everyone', '[]', FALSE, TRUE, '2025-10-22T19:51:32.549Z', '2025-10-22T19:51:32.549Z');
INSERT INTO "announcements" ("id", "user_id", "white_label_id", "title", "content", "attachments", "visibility", "status", "scheduled_at", "published_at", "targeting_type", "targeted_plan_ids", "is_pinned", "is_active", "created_at", "updated_at") VALUES (6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'news for testing', 'news for testing', '[{"url":"/uploads/announcement_1761915721033-162333460_Profile.jpg","name":"Profile.jpg","size":150016,"type":"image/jpeg"}]', 'public', 'published', NULL, '2025-10-31T08:02:01.887Z', 'everyone', '[]', FALSE, TRUE, '2025-10-31T08:02:01.923Z', '2025-10-31T08:02:01.923Z');

-- Table: categories
DROP TABLE IF EXISTS "categories" CASCADE;
CREATE TABLE "categories" (
  "id" int4 NOT NULL DEFAULT nextval('categories_id_seq'::regclass),
  "white_label_id" int4 NOT NULL,
  "name" varchar(255) NOT NULL,
  "description" varchar(1000),
  "parent_category_id" int4,
  "is_active" bool DEFAULT true,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Data for table: categories
INSERT INTO "categories" ("id", "white_label_id", "name", "description", "parent_category_id", "is_active", "created_at", "updated_at") VALUES (2, 2, 'Root YT', NULL, NULL, TRUE, '2025-10-22T09:42:03.708Z', '2025-10-22T09:42:03.708Z');
INSERT INTO "categories" ("id", "white_label_id", "name", "description", "parent_category_id", "is_active", "created_at", "updated_at") VALUES (3, 2, 'Par YT', NULL, 2, TRUE, '2025-10-22T09:42:14.122Z', '2025-10-22T09:42:14.122Z');
INSERT INTO "categories" ("id", "white_label_id", "name", "description", "parent_category_id", "is_active", "created_at", "updated_at") VALUES (4, 3, 'YouTubeEpic', NULL, NULL, TRUE, '2025-10-22T17:08:38.230Z', '2025-10-22T17:08:38.230Z');
INSERT INTO "categories" ("id", "white_label_id", "name", "description", "parent_category_id", "is_active", "created_at", "updated_at") VALUES (5, 2, 'First', NULL, NULL, TRUE, '2025-10-31T05:16:13.524Z', '2025-10-31T05:16:13.524Z');
INSERT INTO "categories" ("id", "white_label_id", "name", "description", "parent_category_id", "is_active", "created_at", "updated_at") VALUES (6, 2, 'First sab', NULL, 5, TRUE, '2025-10-31T05:16:23.889Z', '2025-10-31T05:16:23.889Z');

-- Table: client_template_customizations
DROP TABLE IF EXISTS "client_template_customizations" CASCADE;
CREATE TABLE "client_template_customizations" (
  "id" int4 NOT NULL DEFAULT nextval('client_template_customizations_id_seq'::regclass),
  "client_id" int4 NOT NULL,
  "template_id" int4 NOT NULL,
  "custom_config" jsonb NOT NULL,
  "is_active" bool DEFAULT true,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Table: commissions
DROP TABLE IF EXISTS "commissions" CASCADE;
CREATE TABLE "commissions" (
  "id" int4 NOT NULL DEFAULT nextval('commissions_id_seq'::regclass),
  "affiliate_id" int4 NOT NULL,
  "subscription_id" int4 NOT NULL,
  "amount" numeric(10,2) NOT NULL,
  "commission_type" varchar(50) NOT NULL,
  "status" varchar(50) NOT NULL DEFAULT 'pending'::character varying,
  "paid_at" timestamp,
  "created_at" timestamp DEFAULT now()
);

-- Table: custom_domains
DROP TABLE IF EXISTS "custom_domains" CASCADE;
CREATE TABLE "custom_domains" (
  "id" int4 NOT NULL DEFAULT nextval('custom_domains_id_seq'::regclass),
  "user_id" varchar(255) NOT NULL,
  "landing_page_id" int4,
  "domain" varchar(255) NOT NULL,
  "is_verified" bool DEFAULT false,
  "verification_token" varchar(255),
  "ssl_enabled" bool DEFAULT false,
  "is_active" bool DEFAULT true,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

-- Table: domain_user_sessions
DROP TABLE IF EXISTS "domain_user_sessions" CASCADE;
CREATE TABLE "domain_user_sessions" (
  "id" int4 NOT NULL DEFAULT nextval('domain_user_sessions_id_seq'::regclass),
  "user_id" varchar(255) NOT NULL,
  "domain_path" varchar(255) NOT NULL,
  "white_label_id" int4 NOT NULL,
  "session_id" varchar(255) NOT NULL,
  "is_active" bool DEFAULT true,
  "last_activity" timestamp DEFAULT now(),
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Data for table: domain_user_sessions
INSERT INTO "domain_user_sessions" ("id", "user_id", "domain_path", "white_label_id", "session_id", "is_active", "last_activity", "created_at", "updated_at") VALUES (3, 'ujklk6hjzxnni74', 'kaifgamer762354-affiliate', 7, 'z10gi4fqg5rj4etgrtczl7gdby47kolu', TRUE, '2025-10-22T20:35:39.348Z', '2025-10-22T20:35:39.380Z', '2025-10-22T20:35:39.380Z');
INSERT INTO "domain_user_sessions" ("id", "user_id", "domain_path", "white_label_id", "session_id", "is_active", "last_activity", "created_at", "updated_at") VALUES (2, 'q4cryh0182l4uxz', 'kaifgamer762-affiliate', 5, 'btgfbvwpwi9rmr8cfbxkoxe7iij18ao1', FALSE, '2025-10-22T18:18:37.937Z', '2025-10-22T18:18:37.970Z', '2025-10-22T18:18:37.970Z');
INSERT INTO "domain_user_sessions" ("id", "user_id", "domain_path", "white_label_id", "session_id", "is_active", "last_activity", "created_at", "updated_at") VALUES (4, 'q4cryh0182l4uxz', 'munib', 2, 'm094ns3TNzyDwgZpZ2YmyLhSwCLTFU4o', TRUE, '2025-10-31T12:09:53.955Z', '2025-10-31T12:09:53.987Z', '2025-10-31T12:09:53.987Z');

-- Table: end_user_activities
DROP TABLE IF EXISTS "end_user_activities" CASCADE;
CREATE TABLE "end_user_activities" (
  "id" int4 NOT NULL DEFAULT nextval('end_user_activities_id_seq'::regclass),
  "user_id" varchar(255) NOT NULL,
  "white_label_id" int4 NOT NULL,
  "activity_type" varchar(50) NOT NULL,
  "description" varchar(1000),
  "metadata" jsonb,
  "created_at" timestamp DEFAULT now()
);

-- Data for table: end_user_activities
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (2, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.5.119","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-22T08:39:04.615Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (3, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.6.4","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-22T08:41:46.178Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (4, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.11.144","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-22T09:16:45.087Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (5, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.5.119","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-22T09:29:33.832Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munibb (owner) logged in', '{"ipAddress":"10.82.5.119","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-22T09:39:07.250Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (7, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munibb (owner) logged in', '{"ipAddress":"10.82.6.4","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-22T11:40:55.207Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (8, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.0.19","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-22T13:37:54.486Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (9, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.6.4","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-22T14:41:14.965Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (10, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.4.22","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-22T14:47:12.619Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (11, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.4.22","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-22T14:52:20.423Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (12, '24aadd3e-4821-4c16-bb9d-7cd6788994e7', 3, 'login', 'epic (owner) logged in', '{"ipAddress":"10.82.5.119","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-22T15:13:28.365Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (13, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.3.18","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-22T15:14:00.854Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (14, '24aadd3e-4821-4c16-bb9d-7cd6788994e7', 3, 'login', 'epic (owner) logged in', '{"ipAddress":"10.82.4.22","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-22T17:04:35.338Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (15, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.6.4","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-22T17:04:37.009Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (16, 'q4cryh0182l4uxz', 5, 'login', 'kaif logged in', '{"ipAddress":"10.82.6.4","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-22T18:19:44.353Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (17, 'q4cryh0182l4uxz', 5, 'login', 'kaif logged in', '{"ipAddress":"10.82.3.18","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-22T18:23:36.578Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (18, 'q4cryh0182l4uxz', 5, 'login', 'kaif logged in', '{"ipAddress":"10.82.6.4","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-22T18:26:50.017Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (19, 'q4cryh0182l4uxz', 5, 'login', 'kaif logged in', '{"ipAddress":"10.82.9.121","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-22T18:30:50.161Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (20, 'q4cryh0182l4uxz', 5, 'login', 'kaif logged in', '{"ipAddress":"10.82.10.165","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-22T18:42:22.187Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (21, 'q4cryh0182l4uxz', 5, 'login', 'kaif logged in', '{"ipAddress":"10.82.10.165","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-22T18:50:14.786Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (22, 'q4cryh0182l4uxz', 5, 'login', 'kaif logged in', '{"ipAddress":"10.82.9.121","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-22T18:54:50.070Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (23, 'q4cryh0182l4uxz', 5, 'login', 'kaif logged in', '{"ipAddress":"10.82.6.4","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-22T19:00:13.255Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (24, 'q4cryh0182l4uxz', 5, 'login', 'kaif logged in', '{"ipAddress":"10.82.4.22","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-22T19:04:23.880Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (25, 'q4cryh0182l4uxz', 5, 'login', 'kaif logged in', '{"ipAddress":"10.82.5.119","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-22T19:11:20.610Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (26, 'q4cryh0182l4uxz', 5, 'login', 'kaif logged in', '{"ipAddress":"10.82.5.119","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-22T19:46:29.326Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (27, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.6.4","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-22T19:53:37.433Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (28, 'de5c95de-decd-46b9-8c4f-99518664a325', 6, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.5.119","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-22T20:29:43.833Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (29, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.11.144","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-22T22:29:39.939Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (30, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.9.121","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-22T23:10:25.164Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (31, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.11.144","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-22T23:29:34.589Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (32, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.6.4","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-23T00:02:17.711Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (33, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.3.48","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-24T16:16:25.991Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (34, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.6.4","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-24T17:34:07.155Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (35, 'q4cryh0182l4uxz', 5, 'login', 'kaif logged in', '{"ipAddress":"10.82.0.67","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-24T17:38:10.854Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (36, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.0.67","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-24T17:38:20.644Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (37, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.10.75","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-31T05:07:42.172Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (38, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.2.232","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-31T05:15:53.406Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (39, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.10.75","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-31T06:35:23.274Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (40, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.10.75","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-31T06:52:39.029Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (41, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.2.232","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-31T06:57:06.855Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (42, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.2.232","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-31T07:32:15.725Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (43, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.2.232","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-31T07:41:16.162Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (44, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.7.213","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-31T07:52:29.317Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (45, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.0.34","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-31T08:18:29.333Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (46, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.2.232","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-31T08:28:15.247Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (47, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.10.75","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-31T08:54:39.493Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (48, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.7.213","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-31T09:36:42.732Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (49, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.5.163","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-31T10:11:41.370Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (50, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.0.34","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-31T10:31:56.147Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (51, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.10.75","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-31T10:39:10.648Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (52, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.3.171","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-31T11:00:32.883Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (53, 'q4cryh0182l4uxz', 5, 'login', 'kaif logged in', '{"ipAddress":"10.82.6.182","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T12:08:22.902Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (54, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'login', 'Munib (owner) logged in', '{"ipAddress":"10.82.3.172","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","ownerLogin":true,"loginMethod":"local"}', '2025-10-31T12:10:39.530Z');
INSERT INTO "end_user_activities" ("id", "user_id", "white_label_id", "activity_type", "description", "metadata", "created_at") VALUES (55, 'q4cryh0182l4uxz', 5, 'login', 'kaif logged in', '{"ipAddress":"10.82.9.198","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36","loginMethod":"local"}', '2025-10-31T12:33:13.119Z');

-- Table: integration_logs
DROP TABLE IF EXISTS "integration_logs" CASCADE;
CREATE TABLE "integration_logs" (
  "id" int4 NOT NULL DEFAULT nextval('integration_logs_id_seq'::regclass),
  "integration_id" int4 NOT NULL,
  "action" varchar(255) NOT NULL,
  "status" varchar(255) NOT NULL,
  "message" varchar(1000),
  "error_details" jsonb,
  "metadata" jsonb,
  "created_at" timestamp DEFAULT now()
);

-- Table: integrations
DROP TABLE IF EXISTS "integrations" CASCADE;
CREATE TABLE "integrations" (
  "id" int4 NOT NULL DEFAULT nextval('integrations_id_seq'::regclass),
  "service_name" varchar(255) NOT NULL,
  "display_name" varchar(255) NOT NULL,
  "description" varchar(1000),
  "category" varchar(255) NOT NULL,
  "is_active" bool DEFAULT false,
  "is_connected" bool DEFAULT false,
  "api_key_encrypted" varchar(1000),
  "webhook_url" varchar(255),
  "settings" jsonb,
  "last_sync_at" timestamp,
  "user_id" varchar(255) NOT NULL,
  "white_label_id" int4,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Table: landing_pages
DROP TABLE IF EXISTS "landing_pages" CASCADE;
CREATE TABLE "landing_pages" (
  "id" int4 NOT NULL DEFAULT nextval('landing_pages_id_seq'::regclass),
  "user_id" varchar(255) NOT NULL,
  "name" varchar(255) NOT NULL,
  "domain_path" varchar(100),
  "elements" jsonb NOT NULL,
  "settings" jsonb NOT NULL,
  "is_published" bool DEFAULT false,
  "published_at" timestamp,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

-- Data for table: landing_pages
INSERT INTO "landing_pages" ("id", "user_id", "name", "domain_path", "elements", "settings", "is_published", "published_at", "created_at", "updated_at") VALUES (2, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'New Landing Page', NULL, '[{"id":"hero-section","name":"Hero Section","type":"hero","style":{"color":"#ffffff","width":"100%","height":600,"display":"flex","padding":80,"position":"relative","textAlign":"center","alignItems":"center","background":"linear-gradient(135deg, #667eea 0%, #764ba2 100%)","flexDirection":"column","backgroundSize":"cover","justifyContent":"center","backgroundImage":"url(''https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80'')","backgroundPosition":"center","backgroundBlendMode":"overlay"},"locked":false,"content":{"title":"Powerful Revenue Sharing & Commission Tracking","subtitle":"Automated calculations, transparent distribution, and real-time analytics for every stakeholder","buttonUrl":"#analytics","buttonText":"Explore Analytics"},"visible":true},{"id":"hero-1","type":"hero","style":{"color":"white","display":"flex","padding":"120px 0 80px","overflow":"hidden","position":"relative","minHeight":"100vh","textAlign":"center","alignItems":"center","background":"linear-gradient(135deg, #667eea 0%, #764ba2 100%)","justifyContent":"center"},"content":{"title":"Transform Your Business","subtitle":"We help businesses grow with cutting-edge strategies and proven results. Join thousands of successful companies who trust our platform.","ctaButton":{"url":"#pricing","text":"🚀 Get Started Free","style":"background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); color: white; padding: 18px 36px; border-radius: 50px; font-weight: 700; font-size: 18px; border: 2px solid rgba(255, 255, 255, 0.3); cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 12px; transition: all 0.4s ease; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);"},"secondaryButton":{"url":"#demo","text":"📹 Watch Demo","style":"background: transparent; color: white; padding: 18px 36px; border-radius: 50px; font-weight: 600; font-size: 16px; border: 2px solid rgba(255, 255, 255, 0.4); cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 12px; transition: all 0.4s ease; margin-left: 20px;"}}},{"id":"features-1","type":"features","style":{"padding":"100px 0","background":"#f8fafc"},"content":{"title":"Why Choose Our Platform?","features":[{"icon":"🚀","title":"Lightning Fast","description":"Optimized performance that delivers results in seconds, not minutes."},{"icon":"🔒","title":"Bank-Level Security","description":"Enterprise-grade security protecting your data with military-grade encryption."},{"icon":"📊","title":"Advanced Analytics","description":"Deep insights and real-time analytics to track your success metrics."},{"icon":"🎯","title":"Smart Targeting","description":"AI-powered targeting that reaches your ideal customers automatically."},{"icon":"💡","title":"Innovation First","description":"Cutting-edge technology that keeps you ahead of the competition."},{"icon":"🌍","title":"Global Reach","description":"Scale your business worldwide with our international infrastructure."}],"subtitle":"Powerful features designed to accelerate your business growth"}},{"id":"pricing-1","type":"pricing","style":{"padding":"100px 0","background":"white"},"content":{"plans":[{"name":"Starter","price":"$29","period":"/month","ctaText":"Start Free Trial","popular":false,"features":["Up to 1,000 contacts","Basic analytics","Email support","Mobile app access","Basic integrations"],"description":"Perfect for small businesses getting started"},{"name":"Professional","price":"$79","period":"/month","ctaText":"Get Started","popular":true,"features":["Up to 10,000 contacts","Advanced analytics","Priority support","Custom integrations","Team collaboration","Advanced reporting"],"description":"Ideal for growing businesses"},{"name":"Enterprise","price":"$199","period":"/month","ctaText":"Contact Sales","popular":false,"features":["Unlimited contacts","Custom analytics","24/7 phone support","White-label options","Dedicated account manager","Custom development"],"description":"For large organizations"}],"title":"Choose Your Success Plan","subtitle":"Flexible pricing that grows with your business"}},{"id":"testimonials-1","type":"testimonials","style":{"padding":"100px 0","background":"#f8fafc"},"content":{"title":"What Our Customers Say","subtitle":"Join thousands of satisfied customers worldwide","testimonials":[{"name":"Sarah Johnson","role":"CEO, TechStart Inc.","avatar":"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face&auto=format&q=80","rating":5,"content":"This platform transformed our business completely. We saw 300% growth in just 6 months!"},{"name":"Michael Chen","role":"Marketing Director, GrowthCo","avatar":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face&auto=format&q=80","rating":5,"content":"The analytics and insights are incredible. We finally understand our customers."},{"name":"Emily Rodriguez","role":"Founder, StartupXYZ","avatar":"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face&auto=format&q=80","rating":5,"content":"Best investment we''ve made. The ROI is phenomenal and support is outstanding."}]}},{"id":"contact-1","type":"contact","style":{"padding":"100px 0","background":"white"},"content":{"title":"Ready to Get Started?","subtitle":"Contact us today and Transform Your Business tomorrow","ctaButton":{"url":"#pricing","text":"Start Your Free Trial","style":"background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%); color: white; padding: 18px 36px; border-radius: 50px; font-weight: 700; font-size: 18px; border: none; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 12px; transition: all 0.4s ease; box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);"},"contactInfo":{"email":"hello@yourbusiness.com","phone":"+1 (555) 123-4567","address":"123 Business St, Suite 100, City, State 12345"}}},{"id":"footer-1","type":"footer","style":{"color":"white","padding":"60px 0 30px","background":"#1a202c"},"content":{"links":[{"url":"/privacy","text":"Privacy Policy"},{"url":"/terms","text":"Terms of Service"},{"url":"/support","text":"Support"},{"url":"/contact","text":"Contact"}],"tagline":"Transforming businesses worldwide","copyright":"© 2024. All rights reserved.","companyName":"","socialLinks":[{"url":"https://twitter.com","icon":"🐦","platform":"Twitter"},{"url":"https://linkedin.com","icon":"💼","platform":"LinkedIn"},{"url":"https://facebook.com","icon":"📘","platform":"Facebook"}]}}]', '{"zoom":1,"viewMode":"desktop","canvasHeight":800}', TRUE, '2025-10-22T11:52:29.102Z', '2025-10-22T09:44:40.840Z', '2025-10-22T11:52:29.102Z');
INSERT INTO "landing_pages" ("id", "user_id", "name", "domain_path", "elements", "settings", "is_published", "published_at", "created_at", "updated_at") VALUES (3, '24aadd3e-4821-4c16-bb9d-7cd6788994e7', 'New Landing Page', NULL, '[{"id":"hero-section","name":"Hero Section","type":"hero","style":{"color":"#ffffff","width":"100%","height":600,"display":"flex","padding":80,"position":"relative","textAlign":"center","alignItems":"center","background":"linear-gradient(135deg, #667eea 0%, #764ba2 100%)","flexDirection":"column","backgroundSize":"cover","justifyContent":"center","backgroundImage":"url(''https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80'')","backgroundPosition":"center","backgroundBlendMode":"overlay"},"locked":false,"content":{"title":"Powerful Revenue Sharing & Commission Tracking","subtitle":"Automated calculations, transparent distribution, and real-time analytics for every stakeholder","buttonUrl":"#analytics","buttonText":"Explore Analytics"},"visible":true},{"id":"hero-1","type":"hero","style":{"color":"white","display":"flex","padding":"120px 0 80px","overflow":"hidden","position":"relative","minHeight":"100vh","textAlign":"center","alignItems":"center","background":"linear-gradient(135deg, #667eea 0%, #764ba2 100%)","justifyContent":"center"},"content":{"title":"Transform Your Business","subtitle":"We help businesses grow with cutting-edge strategies and proven results. Join thousands of successful companies who trust our platform.","ctaButton":{"url":"#pricing","text":"🚀 Get Started Free","style":"background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); color: white; padding: 18px 36px; border-radius: 50px; font-weight: 700; font-size: 18px; border: 2px solid rgba(255, 255, 255, 0.3); cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 12px; transition: all 0.4s ease; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);"},"secondaryButton":{"url":"#demo","text":"📹 Watch Demo","style":"background: transparent; color: white; padding: 18px 36px; border-radius: 50px; font-weight: 600; font-size: 16px; border: 2px solid rgba(255, 255, 255, 0.4); cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 12px; transition: all 0.4s ease; margin-left: 20px;"}}},{"id":"features-1","type":"features","style":{"padding":"100px 0","background":"#f8fafc"},"content":{"title":"Why Choose Our Platform?","features":[{"icon":"🚀","title":"Lightning Fast","description":"Optimized performance that delivers results in seconds, not minutes."},{"icon":"🔒","title":"Bank-Level Security","description":"Enterprise-grade security protecting your data with military-grade encryption."},{"icon":"📊","title":"Advanced Analytics","description":"Deep insights and real-time analytics to track your success metrics."},{"icon":"🎯","title":"Smart Targeting","description":"AI-powered targeting that reaches your ideal customers automatically."},{"icon":"💡","title":"Innovation First","description":"Cutting-edge technology that keeps you ahead of the competition."},{"icon":"🌍","title":"Global Reach","description":"Scale your business worldwide with our international infrastructure."}],"subtitle":"Powerful features designed to accelerate your business growth"}},{"id":"pricing-1","type":"pricing","style":{"padding":"100px 0","background":"white"},"content":{"plans":[{"name":"Starter","price":"$29","period":"/month","ctaText":"Start Free Trial","popular":false,"features":["Up to 1,000 contacts","Basic analytics","Email support","Mobile app access","Basic integrations"],"description":"Perfect for small businesses getting started"},{"name":"Professional","price":"$79","period":"/month","ctaText":"Get Started","popular":true,"features":["Up to 10,000 contacts","Advanced analytics","Priority support","Custom integrations","Team collaboration","Advanced reporting"],"description":"Ideal for growing businesses"},{"name":"Enterprise","price":"$199","period":"/month","ctaText":"Contact Sales","popular":false,"features":["Unlimited contacts","Custom analytics","24/7 phone support","White-label options","Dedicated account manager","Custom development"],"description":"For large organizations"}],"title":"Choose Your Success Plan","subtitle":"Flexible pricing that grows with your business"}},{"id":"testimonials-1","type":"testimonials","style":{"padding":"100px 0","background":"#f8fafc"},"content":{"title":"What Our Customers Say","subtitle":"Join thousands of satisfied customers worldwide","testimonials":[{"name":"Sarah Johnson","role":"CEO, TechStart Inc.","avatar":"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face&auto=format&q=80","rating":5,"content":"This platform transformed our business completely. We saw 300% growth in just 6 months!"},{"name":"Michael Chen","role":"Marketing Director, GrowthCo","avatar":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face&auto=format&q=80","rating":5,"content":"The analytics and insights are incredible. We finally understand our customers."},{"name":"Emily Rodriguez","role":"Founder, StartupXYZ","avatar":"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face&auto=format&q=80","rating":5,"content":"Best investment we''ve made. The ROI is phenomenal and support is outstanding."}]}},{"id":"contact-1","type":"contact","style":{"padding":"100px 0","background":"white"},"content":{"title":"Ready to Get Started?","subtitle":"Contact us today and Transform Your Business tomorrow","ctaButton":{"url":"#pricing","text":"Start Your Free Trial","style":"background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%); color: white; padding: 18px 36px; border-radius: 50px; font-weight: 700; font-size: 18px; border: none; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 12px; transition: all 0.4s ease; box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);"},"contactInfo":{"email":"hello@yourbusiness.com","phone":"+1 (555) 123-4567","address":"123 Business St, Suite 100, City, State 12345"}}},{"id":"footer-1","type":"footer","style":{"color":"white","padding":"60px 0 30px","background":"#1a202c"},"content":{"links":[{"url":"/privacy","text":"Privacy Policy"},{"url":"/terms","text":"Terms of Service"},{"url":"/support","text":"Support"},{"url":"/contact","text":"Contact"}],"tagline":"Transforming businesses worldwide","copyright":"© 2024. All rights reserved.","companyName":"","socialLinks":[{"url":"https://twitter.com","icon":"🐦","platform":"Twitter"},{"url":"https://linkedin.com","icon":"💼","platform":"LinkedIn"},{"url":"https://facebook.com","icon":"📘","platform":"Facebook"}]}}]', '{"zoom":1,"viewMode":"desktop","canvasHeight":800}', TRUE, '2025-10-22T13:24:45.107Z', '2025-10-22T13:24:33.333Z', '2025-10-22T13:24:45.107Z');
INSERT INTO "landing_pages" ("id", "user_id", "name", "domain_path", "elements", "settings", "is_published", "published_at", "created_at", "updated_at") VALUES (5, 'de5c95de-decd-46b9-8c4f-99518664a325', 'New Landing Page', NULL, '[{"id":"hero-section","name":"Hero Section","type":"hero","style":{"color":"#ffffff","width":"100%","height":600,"display":"flex","padding":80,"position":"relative","textAlign":"center","alignItems":"center","background":"linear-gradient(135deg, #667eea 0%, #764ba2 100%)","flexDirection":"column","backgroundSize":"cover","justifyContent":"center","backgroundImage":"url(''https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80'')","backgroundPosition":"center","backgroundBlendMode":"overlay"},"locked":false,"content":{"title":"Powerful Revenue Sharing & Commission Tracking","subtitle":"Automated calculations, transparent distribution, and real-time analytics for every stakeholder","buttonUrl":"#analytics","buttonText":"Explore Analytics"},"visible":true},{"id":"hero-1","type":"hero","style":{"color":"white","display":"flex","padding":"120px 0 80px","overflow":"hidden","position":"relative","minHeight":"100vh","textAlign":"center","alignItems":"center","background":"linear-gradient(135deg, #667eea 0%, #764ba2 100%)","justifyContent":"center"},"content":{"title":"Transform Your Business","subtitle":"We help businesses grow with cutting-edge strategies and proven results. Join thousands of successful companies who trust our platform.","ctaButton":{"url":"#pricing","text":"🚀 Get Started Free","style":"background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); color: white; padding: 18px 36px; border-radius: 50px; font-weight: 700; font-size: 18px; border: 2px solid rgba(255, 255, 255, 0.3); cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 12px; transition: all 0.4s ease; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);"},"secondaryButton":{"url":"#demo","text":"📹 Watch Demo","style":"background: transparent; color: white; padding: 18px 36px; border-radius: 50px; font-weight: 600; font-size: 16px; border: 2px solid rgba(255, 255, 255, 0.4); cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 12px; transition: all 0.4s ease; margin-left: 20px;"}}},{"id":"features-1","type":"features","style":{"padding":"100px 0","background":"#f8fafc"},"content":{"title":"Why Choose Our Platform?","features":[{"icon":"🚀","title":"Lightning Fast","description":"Optimized performance that delivers results in seconds, not minutes."},{"icon":"🔒","title":"Bank-Level Security","description":"Enterprise-grade security protecting your data with military-grade encryption."},{"icon":"📊","title":"Advanced Analytics","description":"Deep insights and real-time analytics to track your success metrics."},{"icon":"🎯","title":"Smart Targeting","description":"AI-powered targeting that reaches your ideal customers automatically."},{"icon":"💡","title":"Innovation First","description":"Cutting-edge technology that keeps you ahead of the competition."},{"icon":"🌍","title":"Global Reach","description":"Scale your business worldwide with our international infrastructure."}],"subtitle":"Powerful features designed to accelerate your business growth"}},{"id":"pricing-1","type":"pricing","style":{"padding":"100px 0","background":"white"},"content":{"plans":[{"name":"Starter","price":"$29","period":"/month","ctaText":"Start Free Trial","popular":false,"features":["Up to 1,000 contacts","Basic analytics","Email support","Mobile app access","Basic integrations"],"description":"Perfect for small businesses getting started"},{"name":"Professional","price":"$79","period":"/month","ctaText":"Get Started","popular":true,"features":["Up to 10,000 contacts","Advanced analytics","Priority support","Custom integrations","Team collaboration","Advanced reporting"],"description":"Ideal for growing businesses"},{"name":"Enterprise","price":"$199","period":"/month","ctaText":"Contact Sales","popular":false,"features":["Unlimited contacts","Custom analytics","24/7 phone support","White-label options","Dedicated account manager","Custom development"],"description":"For large organizations"}],"title":"Choose Your Success Plan","subtitle":"Flexible pricing that grows with your business"}},{"id":"testimonials-1","type":"testimonials","style":{"padding":"100px 0","background":"#f8fafc"},"content":{"title":"What Our Customers Say","subtitle":"Join thousands of satisfied customers worldwide","testimonials":[{"name":"Sarah Johnson","role":"CEO, TechStart Inc.","avatar":"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face&auto=format&q=80","rating":5,"content":"This platform transformed our business completely. We saw 300% growth in just 6 months!"},{"name":"Michael Chen","role":"Marketing Director, GrowthCo","avatar":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face&auto=format&q=80","rating":5,"content":"The analytics and insights are incredible. We finally understand our customers."},{"name":"Emily Rodriguez","role":"Founder, StartupXYZ","avatar":"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face&auto=format&q=80","rating":5,"content":"Best investment we''ve made. The ROI is phenomenal and support is outstanding."}]}},{"id":"contact-1","type":"contact","style":{"padding":"100px 0","background":"white"},"content":{"title":"Ready to Get Started?","subtitle":"Contact us today and Transform Your Business tomorrow","ctaButton":{"url":"#pricing","text":"Start Your Free Trial","style":"background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%); color: white; padding: 18px 36px; border-radius: 50px; font-weight: 700; font-size: 18px; border: none; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 12px; transition: all 0.4s ease; box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);"},"contactInfo":{"email":"hello@yourbusiness.com","phone":"+1 (555) 123-4567","address":"123 Business St, Suite 100, City, State 12345"}}},{"id":"footer-1","type":"footer","style":{"color":"white","padding":"60px 0 30px","background":"#1a202c"},"content":{"links":[{"url":"/privacy","text":"Privacy Policy"},{"url":"/terms","text":"Terms of Service"},{"url":"/support","text":"Support"},{"url":"/contact","text":"Contact"}],"tagline":"Transforming businesses worldwide","copyright":"© 2024. All rights reserved.","companyName":"","socialLinks":[{"url":"https://twitter.com","icon":"🐦","platform":"Twitter"},{"url":"https://linkedin.com","icon":"💼","platform":"LinkedIn"},{"url":"https://facebook.com","icon":"📘","platform":"Facebook"}]}}]', '{"zoom":1,"viewMode":"desktop","canvasHeight":800}', TRUE, '2025-10-22T20:30:32.587Z', '2025-10-22T20:12:36.161Z', '2025-10-22T20:30:32.588Z');

-- Table: link_meta_images
DROP TABLE IF EXISTS "link_meta_images" CASCADE;
CREATE TABLE "link_meta_images" (
  "id" int4 NOT NULL DEFAULT nextval('link_meta_images_id_seq'::regclass),
  "url" varchar(255) NOT NULL,
  "title" varchar(255),
  "description" varchar(1000),
  "image_url" varchar(255),
  "site_name" varchar(255),
  "favicon_url" varchar(255),
  "is_active" bool DEFAULT true,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Table: nmi_credentials
DROP TABLE IF EXISTS "nmi_credentials" CASCADE;
CREATE TABLE "nmi_credentials" (
  "id" int4 NOT NULL DEFAULT nextval('nmi_credentials_id_seq'::regclass),
  "user_id" varchar(255) NOT NULL,
  "username" varchar(255) NOT NULL,
  "password" varchar(255) NOT NULL,
  "security_key" varchar(255) NOT NULL,
  "processor_id" varchar(255),
  "gateway_url" varchar(500) DEFAULT 'https://secure.networkmerchants.com/api/transact.php'::character varying,
  "is_test_mode" bool DEFAULT false,
  "is_active" bool DEFAULT true,
  "last_tested_at" timestamp,
  "test_status" varchar(50),
  "test_error_message" varchar(1000),
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Data for table: nmi_credentials
INSERT INTO "nmi_credentials" ("id", "user_id", "username", "password", "security_key", "processor_id", "gateway_url", "is_test_mode", "is_active", "last_tested_at", "test_status", "test_error_message", "created_at", "updated_at") VALUES (2, 'admin_1761023031290', 'BYPASS_MODE', '2b156e9b704320c4139c811d55fa31e0:cf3625ee7c70bc6214ff2ee30fbcb666', 'bcc2722053a028f84d9d5fb99d4f4c0b:9e5b37e6cec8fcd6432ffacc2ffeb6d6', NULL, 'https://secure.networkmerchants.com/api/transact.php', TRUE, TRUE, NULL, NULL, NULL, '2025-10-22T08:54:35.624Z', '2025-10-22T08:54:35.624Z');
INSERT INTO "nmi_credentials" ("id", "user_id", "username", "password", "security_key", "processor_id", "gateway_url", "is_test_mode", "is_active", "last_tested_at", "test_status", "test_error_message", "created_at", "updated_at") VALUES (3, 'admin_1761023031290', 'BYPASS_MODE', 'a8e4c55878c75251d1150ff9b19c6df9:548f8292c33e78d471275ac0c54541a0', '70a33f7947e92db3b20de547effb8ab3:670ef31d1c7c4062b3ddf47bc2b67629', NULL, 'https://secure.nmi.com/api/transact.php', TRUE, TRUE, NULL, NULL, NULL, '2025-10-22T08:55:19.284Z', '2025-10-22T08:55:19.284Z');
INSERT INTO "nmi_credentials" ("id", "user_id", "username", "password", "security_key", "processor_id", "gateway_url", "is_test_mode", "is_active", "last_tested_at", "test_status", "test_error_message", "created_at", "updated_at") VALUES (4, 'admin_1761023031290', 'BYPASS_MODE', '4c9587699180fedf1045199d633f3dff:ad1513be002dce582b889612897225f5', '44789ae0dfd6f00cbf706f96ecb63e43:ac931d88044756aae870e50e77b556da', NULL, 'https://secure.nmi.com/api/transact.php', TRUE, TRUE, NULL, NULL, NULL, '2025-10-22T08:57:13.138Z', '2025-10-22T08:57:13.138Z');
INSERT INTO "nmi_credentials" ("id", "user_id", "username", "password", "security_key", "processor_id", "gateway_url", "is_test_mode", "is_active", "last_tested_at", "test_status", "test_error_message", "created_at", "updated_at") VALUES (5, 'admin_1761023031290', 'BYPASS_MODE', '0c3a14ea06ab4813965cc30ea1c6175a:619fa0daf15cf89debdfd9d22fd4f3b2', 'aa6f65b215073ebb3ebc61f8e9df3344:710b9e2c542a3467a6c4fe5aad42b7e3', NULL, ' https://secure.networkmerchants.com/api/transact.php', TRUE, TRUE, NULL, NULL, NULL, '2025-10-22T08:59:10.498Z', '2025-10-22T08:59:10.498Z');
INSERT INTO "nmi_credentials" ("id", "user_id", "username", "password", "security_key", "processor_id", "gateway_url", "is_test_mode", "is_active", "last_tested_at", "test_status", "test_error_message", "created_at", "updated_at") VALUES (6, 'admin_1761023031290', 'BYPASS_MODE', '6cbd3abd7729a700c97ffa9d9ce6d4bf:3bf4e9aa56cdd2194e6bae4e233cad69', '6d7d8cb18a1153c064b1ea083b71f456:2a58749bbf3f3f5362b65054b23b83e2', NULL, ' https://secure.networkmerchants.com/api/transact.php', TRUE, TRUE, NULL, NULL, NULL, '2025-10-22T08:59:17.483Z', '2025-10-22T08:59:17.483Z');
INSERT INTO "nmi_credentials" ("id", "user_id", "username", "password", "security_key", "processor_id", "gateway_url", "is_test_mode", "is_active", "last_tested_at", "test_status", "test_error_message", "created_at", "updated_at") VALUES (7, 'admin_1761023031290', 'BYPASS_MODE', '04c8c6056e9387d58ad197817006b9c1:6ea305bbd3c899d9480757da041cfceb', '03fd24eba6519e3bb5124d2c42576a14:9b88097644dd6e7fadc9f67485cdd62c', NULL, ' https://secure.networkmerchants.com/api/transact.php', TRUE, TRUE, NULL, NULL, NULL, '2025-10-22T09:01:48.054Z', '2025-10-22T09:01:48.054Z');
INSERT INTO "nmi_credentials" ("id", "user_id", "username", "password", "security_key", "processor_id", "gateway_url", "is_test_mode", "is_active", "last_tested_at", "test_status", "test_error_message", "created_at", "updated_at") VALUES (8, 'admin_1761023031290', 'BYPASS_MODE', '6f7649ae61db6b833d0f9d5c385e6702:369cb4fc9a40e6bcc46560bfd352dc2e', '979be7f353117f924b05c57817377292:d18261844b0c7e03ce4fd1d9723ee151', NULL, 'https://secure.networkmerchants.com/api/transact.php', TRUE, TRUE, NULL, NULL, NULL, '2025-10-22T09:03:49.094Z', '2025-10-22T09:03:49.094Z');
INSERT INTO "nmi_credentials" ("id", "user_id", "username", "password", "security_key", "processor_id", "gateway_url", "is_test_mode", "is_active", "last_tested_at", "test_status", "test_error_message", "created_at", "updated_at") VALUES (9, 'admin_1761023031290', 'BYPASS_MODE', '598b1b53e0123ea224918a196ea08f02:49b3092ff5c1b7e57638fb0078e54c94', '197c4f2a5174bcfd6640ffcaa0527250:7fb9c79f74a97238a6de264fd8b1d3ca', NULL, 'https://secure.networkmerchants.com/api/transact.php', TRUE, TRUE, NULL, NULL, NULL, '2025-10-22T09:04:02.923Z', '2025-10-22T09:04:02.923Z');
INSERT INTO "nmi_credentials" ("id", "user_id", "username", "password", "security_key", "processor_id", "gateway_url", "is_test_mode", "is_active", "last_tested_at", "test_status", "test_error_message", "created_at", "updated_at") VALUES (10, 'admin_1761023031290', 'BYPASS_MODE', 'f25f347fa43b62dec68fe8e65ca99ab9:909904be94e29b560a18a2b37af34ffc', 'defc06ec2cc39e3e7ab76f5f19cfe8d6:87c9e5b290e5c987901f34c3d1b32244', NULL, 'https://secure.networkmerchants.com/api/transact.php', TRUE, TRUE, NULL, NULL, NULL, '2025-10-22T09:14:16.627Z', '2025-10-22T09:14:16.627Z');
INSERT INTO "nmi_credentials" ("id", "user_id", "username", "password", "security_key", "processor_id", "gateway_url", "is_test_mode", "is_active", "last_tested_at", "test_status", "test_error_message", "created_at", "updated_at") VALUES (11, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'BYPASS_MODE', '74f68104610eff317be069c48cafc14b:0736f5ea87d70cb5b4bdeacfcb6577ef', 'aafa6fa82c0fd7c46f79bb961aa090ce:259348c51ca00513ffe7a0669565ba6c', NULL, 'https://secure.networkmerchants.com/api/transact.php', TRUE, TRUE, NULL, NULL, NULL, '2025-10-22T13:39:26.018Z', '2025-10-22T13:39:26.018Z');
INSERT INTO "nmi_credentials" ("id", "user_id", "username", "password", "security_key", "processor_id", "gateway_url", "is_test_mode", "is_active", "last_tested_at", "test_status", "test_error_message", "created_at", "updated_at") VALUES (12, '24aadd3e-4821-4c16-bb9d-7cd6788994e7', 'BYPASS_MODE', 'f99f61b441a47c13efa3822fc35477a3:530adc2a72af768f2a33ef78e640b1ce', 'b15c9d72140761a863ace59d35bc8fb3:a515bae2891d9713c68ac14a9dbd015f', NULL, 'https://secure.networkmerchants.com/api/transact.php', TRUE, TRUE, NULL, NULL, NULL, '2025-10-22T17:10:17.973Z', '2025-10-22T17:10:17.973Z');

-- Table: password_reset_tokens
DROP TABLE IF EXISTS "password_reset_tokens" CASCADE;
CREATE TABLE "password_reset_tokens" (
  "id" int4 NOT NULL DEFAULT nextval('password_reset_tokens_id_seq'::regclass),
  "user_id" varchar(255) NOT NULL,
  "hashed_token" varchar(255) NOT NULL,
  "expires_at" timestamp NOT NULL,
  "used" bool DEFAULT false,
  "created_at" timestamp DEFAULT now()
);

-- Data for table: password_reset_tokens
INSERT INTO "password_reset_tokens" ("id", "user_id", "hashed_token", "expires_at", "used", "created_at") VALUES (6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', '2143d3b72c41ebd07eba3d5667a6f43daf110b74e50a244e9b935588ac7471f4', '2025-10-22T09:38:01.497Z', TRUE, '2025-10-22T08:38:01.707Z');
INSERT INTO "password_reset_tokens" ("id", "user_id", "hashed_token", "expires_at", "used", "created_at") VALUES (7, 'ujklk6hjzxnni74', 'eb714c20fba5eb08f619d1bac4781e06f98f47365fd4560829b2a70c40d2af62', '2025-10-24T17:26:13.496Z', FALSE, '2025-10-24T16:26:13.710Z');
INSERT INTO "password_reset_tokens" ("id", "user_id", "hashed_token", "expires_at", "used", "created_at") VALUES (8, 'izbb770i17l44pj', '9db42683451de54f44627c9c4c67774360c1bf59d0c9a1686d8f0184b870500d', '2025-10-24T17:27:31.630Z', TRUE, '2025-10-24T16:27:31.842Z');
INSERT INTO "password_reset_tokens" ("id", "user_id", "hashed_token", "expires_at", "used", "created_at") VALUES (9, 's7dbfr1bi9ib2qn', 'ef613b224459446cee9b999ca81fbdbd2916a70bb56441decc2625edb2c50e40', '2025-10-24T17:30:21.281Z', TRUE, '2025-10-24T16:30:21.492Z');

-- Table: payment_accounts
DROP TABLE IF EXISTS "payment_accounts" CASCADE;
CREATE TABLE "payment_accounts" (
  "id" int4 NOT NULL DEFAULT nextval('payment_accounts_id_seq'::regclass),
  "user_id" varchar(255) NOT NULL,
  "bank_name" varchar(255) NOT NULL,
  "account_owner_name" varchar(255) NOT NULL,
  "account_number" varchar(255) NOT NULL,
  "account_type" varchar(50) NOT NULL,
  "is_active" bool DEFAULT true,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Data for table: payment_accounts
INSERT INTO "payment_accounts" ("id", "user_id", "bank_name", "account_owner_name", "account_number", "account_type", "is_active", "created_at", "updated_at") VALUES (2, 'izbb770i17l44pj', 'Meezan', 'Ali Badi', '030303030303', 'checking', TRUE, '2025-10-21T18:20:56.422Z', '2025-10-21T18:20:56.422Z');
INSERT INTO "payment_accounts" ("id", "user_id", "bank_name", "account_owner_name", "account_number", "account_type", "is_active", "created_at", "updated_at") VALUES (3, '9jx56q9of3z3so7', 'Meezan', 'Epic', '033332132121', 'business_checking', TRUE, '2025-10-22T19:17:00.475Z', '2025-10-22T19:17:00.475Z');
INSERT INTO "payment_accounts" ("id", "user_id", "bank_name", "account_owner_name", "account_number", "account_type", "is_active", "created_at", "updated_at") VALUES (4, '0hcverickhqijpi', 'Meezan', 'Munib', '04532201010', 'business_savings', TRUE, '2025-10-31T07:52:07.964Z', '2025-10-31T07:52:07.964Z');

-- Table: plan_categories
DROP TABLE IF EXISTS "plan_categories" CASCADE;
CREATE TABLE "plan_categories" (
  "id" int4 NOT NULL DEFAULT nextval('plan_categories_id_seq'::regclass),
  "plan_id" int4 NOT NULL,
  "category_id" int4 NOT NULL,
  "is_active" bool DEFAULT true,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Table: plan_products
DROP TABLE IF EXISTS "plan_products" CASCADE;
CREATE TABLE "plan_products" (
  "id" int4 NOT NULL DEFAULT nextval('plan_products_id_seq'::regclass),
  "plan_id" int4 NOT NULL,
  "product_id" int4 NOT NULL,
  "is_active" bool DEFAULT true,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Table: plans
DROP TABLE IF EXISTS "plans" CASCADE;
CREATE TABLE "plans" (
  "id" int4 NOT NULL DEFAULT nextval('plans_id_seq'::regclass),
  "name" varchar(255) NOT NULL,
  "description" varchar(1000),
  "monthly_price" varchar(255),
  "affiliate_commission_percentage" varchar(255),
  "max_users" int4,
  "features" jsonb,
  "accesses" jsonb DEFAULT '[]'::jsonb,
  "selected_categories" jsonb DEFAULT '[]'::jsonb,
  "selected_products" jsonb DEFAULT '[]'::jsonb,
  "is_active" bool DEFAULT true,
  "is_public" bool DEFAULT false,
  "is_main_site_plan" bool DEFAULT false,
  "allow_affiliate_promotion" bool DEFAULT false,
  "status" varchar(50) DEFAULT 'published'::character varying,
  "scheduled_at" timestamp,
  "published_at" timestamp,
  "created_by" varchar(255) NOT NULL,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Data for table: plans
INSERT INTO "plans" ("id", "name", "description", "monthly_price", "affiliate_commission_percentage", "max_users", "features", "accesses", "selected_categories", "selected_products", "is_active", "is_public", "is_main_site_plan", "allow_affiliate_promotion", "status", "scheduled_at", "published_at", "created_by", "created_at", "updated_at") VALUES (2, 'Basic White Label', 'Perfect for small businesses starting their white-label journey with essential features', '49.99', '10.0', 25, '["Up to 25 end users","Custom branding (logo & colors)","Basic analytics dashboard","Email support","Standard templates","Domain path routing"]', '["categories"]', '[]', '[]', TRUE, TRUE, TRUE, TRUE, 'published', NULL, NULL, 'admin_1761023031290', '2025-10-21T00:03:51.717Z', '2025-10-21T00:03:51.717Z');
INSERT INTO "plans" ("id", "name", "description", "monthly_price", "affiliate_commission_percentage", "max_users", "features", "accesses", "selected_categories", "selected_products", "is_active", "is_public", "is_main_site_plan", "allow_affiliate_promotion", "status", "scheduled_at", "published_at", "created_by", "created_at", "updated_at") VALUES (3, 'Basic White Label', 'Perfect for small businesses starting their white-label journey with essential features', '49.99', '10.0', 25, '["Up to 25 end users","Custom branding (logo & colors)","Basic analytics dashboard","Email support","Standard templates","Domain path routing"]', '["categories"]', '[]', '[]', TRUE, TRUE, TRUE, TRUE, 'published', NULL, NULL, 'admin_1761023059755', '2025-10-21T00:04:20.183Z', '2025-10-21T00:04:20.183Z');
INSERT INTO "plans" ("id", "name", "description", "monthly_price", "affiliate_commission_percentage", "max_users", "features", "accesses", "selected_categories", "selected_products", "is_active", "is_public", "is_main_site_plan", "allow_affiliate_promotion", "status", "scheduled_at", "published_at", "created_by", "created_at", "updated_at") VALUES (4, 'Professional White Label', 'Ideal for growing businesses with advanced customization and affiliate management', '149.99', '15.0', 100, '["Up to 100 end users","Full white-label branding","Advanced analytics & reporting","Affiliate management system","Priority support","Custom landing pages","API access","Custom domain support"]', '["categories","affiliates"]', '[]', '[]', TRUE, TRUE, TRUE, TRUE, 'published', NULL, NULL, 'admin_1761023059755', '2025-10-21T00:04:20.246Z', '2025-10-21T00:04:20.246Z');
INSERT INTO "plans" ("id", "name", "description", "monthly_price", "affiliate_commission_percentage", "max_users", "features", "accesses", "selected_categories", "selected_products", "is_active", "is_public", "is_main_site_plan", "allow_affiliate_promotion", "status", "scheduled_at", "published_at", "created_by", "created_at", "updated_at") VALUES (5, 'Enterprise White Label', 'Complete white-label solution for large organizations with unlimited scalability', '399.99', '20.0', NULL, '["Unlimited end users","Complete white-label solution","Multi-tier affiliate network","AI Content Studio access","24/7 premium support","Custom integrations","Dedicated account manager","Advanced revenue sharing","Custom development hours included"]', '["categories","affiliates","ai_content_studio"]', '[]', '[]', TRUE, TRUE, TRUE, TRUE, 'published', NULL, NULL, 'admin_1761023059755', '2025-10-21T00:04:20.308Z', '2025-10-21T00:04:20.308Z');
INSERT INTO "plans" ("id", "name", "description", "monthly_price", "affiliate_commission_percentage", "max_users", "features", "accesses", "selected_categories", "selected_products", "is_active", "is_public", "is_main_site_plan", "allow_affiliate_promotion", "status", "scheduled_at", "published_at", "created_by", "created_at", "updated_at") VALUES (6, 'Startup Special', 'Limited-time offer for startups - Get started with white-label at a special price', '29.99', '12.0', 10, '["Up to 10 end users","Basic branding","Standard analytics","Community support","Email templates"]', '["categories"]', '[]', '[]', TRUE, TRUE, TRUE, TRUE, 'published', NULL, NULL, 'admin_1761023059755', '2025-10-21T00:04:20.369Z', '2025-10-21T00:04:20.369Z');
INSERT INTO "plans" ("id", "name", "description", "monthly_price", "affiliate_commission_percentage", "max_users", "features", "accesses", "selected_categories", "selected_products", "is_active", "is_public", "is_main_site_plan", "allow_affiliate_promotion", "status", "scheduled_at", "published_at", "created_by", "created_at", "updated_at") VALUES (10, 'hhh', '', '1000', '10', NULL, '["hhh"]', '["categories","affiliates","landing_page_builder"]', '[]', '[]', TRUE, FALSE, TRUE, TRUE, 'published', NULL, '2025-10-21T18:12:12.644Z', 'admin_1761023031290', '2025-10-21T18:12:12.794Z', '2025-10-21T18:12:12.794Z');
INSERT INTO "plans" ("id", "name", "description", "monthly_price", "affiliate_commission_percentage", "max_users", "features", "accesses", "selected_categories", "selected_products", "is_active", "is_public", "is_main_site_plan", "allow_affiliate_promotion", "status", "scheduled_at", "published_at", "created_by", "created_at", "updated_at") VALUES (18, 'Test For My Affiliates', '', '34', NULL, NULL, '["Test"]', '[]', '[]', '[]', TRUE, FALSE, FALSE, TRUE, 'published', NULL, '2025-10-31T08:35:50.055Z', '526fdca7-303c-48b5-9676-0d0eba06d6fb', '2025-10-31T08:34:43.449Z', '2025-10-31T08:34:43.449Z');
INSERT INTO "plans" ("id", "name", "description", "monthly_price", "affiliate_commission_percentage", "max_users", "features", "accesses", "selected_categories", "selected_products", "is_active", "is_public", "is_main_site_plan", "allow_affiliate_promotion", "status", "scheduled_at", "published_at", "created_by", "created_at", "updated_at") VALUES (19, 'testing for sp affiliate', 'testing for sp affiliate', '100', '100', NULL, '["testing for sp affiliate"]', '[]', '[]', '[]', TRUE, FALSE, TRUE, TRUE, 'published', NULL, '2025-10-31T12:13:22.213Z', 'admin_1761023031290', '2025-10-31T12:13:22.379Z', '2025-10-31T12:13:22.379Z');
INSERT INTO "plans" ("id", "name", "description", "monthly_price", "affiliate_commission_percentage", "max_users", "features", "accesses", "selected_categories", "selected_products", "is_active", "is_public", "is_main_site_plan", "allow_affiliate_promotion", "status", "scheduled_at", "published_at", "created_by", "created_at", "updated_at") VALUES (15, 'YouTubeEpic', 'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.', '22', NULL, NULL, '["l"]', '[]', '[4]', '[6,5]', TRUE, FALSE, FALSE, FALSE, 'published', NULL, '2025-10-22T17:09:15.802Z', '24aadd3e-4821-4c16-bb9d-7cd6788994e7', '2025-10-22T17:09:15.953Z', '2025-10-22T17:09:15.953Z');
INSERT INTO "plans" ("id", "name", "description", "monthly_price", "affiliate_commission_percentage", "max_users", "features", "accesses", "selected_categories", "selected_products", "is_active", "is_public", "is_main_site_plan", "allow_affiliate_promotion", "status", "scheduled_at", "published_at", "created_by", "created_at", "updated_at") VALUES (13, 'Its SA', '', '100', '10', NULL, '["Everything"]', '["categories","affiliates","landing_page_builder"]', '[]', '[]', TRUE, FALSE, TRUE, TRUE, 'published', NULL, '2025-10-22T19:19:36.140Z', 'admin_1761023031290', '2025-10-22T08:42:31.825Z', '2025-10-22T08:42:31.825Z');
INSERT INTO "plans" ("id", "name", "description", "monthly_price", "affiliate_commission_percentage", "max_users", "features", "accesses", "selected_categories", "selected_products", "is_active", "is_public", "is_main_site_plan", "allow_affiliate_promotion", "status", "scheduled_at", "published_at", "created_by", "created_at", "updated_at") VALUES (16, 'Test For Affiliate', '', '1000', '10', NULL, '["Testing"]', '[]', '[]', '[]', TRUE, FALSE, TRUE, TRUE, 'published', NULL, '2025-10-22T19:20:45.245Z', 'admin_1761023031290', '2025-10-22T19:20:45.392Z', '2025-10-22T19:20:45.392Z');
INSERT INTO "plans" ("id", "name", "description", "monthly_price", "affiliate_commission_percentage", "max_users", "features", "accesses", "selected_categories", "selected_products", "is_active", "is_public", "is_main_site_plan", "allow_affiliate_promotion", "status", "scheduled_at", "published_at", "created_by", "created_at", "updated_at") VALUES (14, '1st try', 'Log into Facebook to start sharing and connecting with your friends, family, and people you know.', '200', '10', NULL, '["tes"]', '[]', '[2,3]', '[3,4,2]', TRUE, FALSE, FALSE, TRUE, 'published', NULL, '2025-10-22T23:11:27.596Z', '526fdca7-303c-48b5-9676-0d0eba06d6fb', '2025-10-22T09:44:32.705Z', '2025-10-22T09:44:32.705Z');
INSERT INTO "plans" ("id", "name", "description", "monthly_price", "affiliate_commission_percentage", "max_users", "features", "accesses", "selected_categories", "selected_products", "is_active", "is_public", "is_main_site_plan", "allow_affiliate_promotion", "status", "scheduled_at", "published_at", "created_by", "created_at", "updated_at") VALUES (17, 'YouTube', '', '1', '1', NULL, '["tes"]', '[]', '[]', '[]', TRUE, FALSE, FALSE, TRUE, 'published', NULL, '2025-10-24T16:45:28.120Z', '526fdca7-303c-48b5-9676-0d0eba06d6fb', '2025-10-22T22:31:24.823Z', '2025-10-22T22:31:24.823Z');

-- Table: platform_settings
DROP TABLE IF EXISTS "platform_settings" CASCADE;
CREATE TABLE "platform_settings" (
  "id" int4 NOT NULL DEFAULT nextval('platform_settings_id_seq'::regclass),
  "key" varchar(255) NOT NULL,
  "value" jsonb NOT NULL,
  "type" varchar(50) NOT NULL,
  "category" varchar(100) NOT NULL,
  "description" varchar(1000),
  "is_public" bool DEFAULT false,
  "updated_by" varchar(255) NOT NULL,
  "updated_at" timestamp DEFAULT now()
);

-- Table: products
DROP TABLE IF EXISTS "products" CASCADE;
CREATE TABLE "products" (
  "id" int4 NOT NULL DEFAULT nextval('products_id_seq'::regclass),
  "white_label_id" int4 NOT NULL,
  "category_id" int4,
  "created_by" varchar(255) NOT NULL,
  "name" varchar(255) NOT NULL,
  "description" varchar(1000),
  "price" numeric(10,2),
  "type" varchar(50) NOT NULL,
  "content_url" varchar(255),
  "access_duration" int4,
  "image_url" varchar(255),
  "attachments" jsonb DEFAULT '[]'::jsonb,
  "metadata" jsonb,
  "is_active" bool DEFAULT true,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Data for table: products
INSERT INTO "products" ("id", "white_label_id", "category_id", "created_by", "name", "description", "price", "type", "content_url", "access_duration", "image_url", "attachments", "metadata", "is_active", "created_at", "updated_at") VALUES (2, 2, 3, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'YouTube', 'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.', '15.00', 'website_link', 'https://youtube.com/', NULL, 'https://www.youtube.com/img/desktop/yt_1200.png', '[]', NULL, TRUE, '2025-10-22T09:40:30.743Z', '2025-10-22T09:42:27.018Z');
INSERT INTO "products" ("id", "white_label_id", "category_id", "created_by", "name", "description", "price", "type", "content_url", "access_duration", "image_url", "attachments", "metadata", "is_active", "created_at", "updated_at") VALUES (3, 2, NULL, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'Facebook - log in or sign up', 'Log into Facebook to start sharing and connecting with your friends, family, and people you know.', '22.00', 'website_link', 'https://facebook.com/', NULL, 'https://www.facebook.com/images/fb_icon_325x325.png', '[]', NULL, TRUE, '2025-10-22T09:43:34.345Z', '2025-10-22T09:43:34.345Z');
INSERT INTO "products" ("id", "white_label_id", "category_id", "created_by", "name", "description", "price", "type", "content_url", "access_duration", "image_url", "attachments", "metadata", "is_active", "created_at", "updated_at") VALUES (4, 2, 2, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'Read Care', 'Read', '11.00', 'document', 'Read Carefully_1761170788100-356951987.txt', NULL, '', '[]', NULL, TRUE, '2025-10-22T17:06:28.636Z', '2025-10-22T17:06:28.636Z');
INSERT INTO "products" ("id", "white_label_id", "category_id", "created_by", "name", "description", "price", "type", "content_url", "access_duration", "image_url", "attachments", "metadata", "is_active", "created_at", "updated_at") VALUES (5, 3, NULL, '24aadd3e-4821-4c16-bb9d-7cd6788994e7', 'YouTube', 'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.', '22.00', 'website_link', 'https://youtube.com/', NULL, 'https://www.youtube.com/img/desktop/yt_1200.png', '[]', NULL, TRUE, '2025-10-22T17:08:06.300Z', '2025-10-22T17:08:06.300Z');
INSERT INTO "products" ("id", "white_label_id", "category_id", "created_by", "name", "description", "price", "type", "content_url", "access_duration", "image_url", "attachments", "metadata", "is_active", "created_at", "updated_at") VALUES (6, 3, 4, '24aadd3e-4821-4c16-bb9d-7cd6788994e7', 'Google Maps', 'Find local businesses, view maps and get driving directions in Google Maps.', '22.00', 'website_link', 'https://maps.google.com/', NULL, 'https://maps.google.com/maps/api/staticmap?center=40.85970505%2C-74.1581944&zoom=9&size=900x900&language=en&sensor=false&client=google-maps-frontend&signature=kfkdyNEA2eA1bHrEnkRcQ8b6lIo', '[]', NULL, TRUE, '2025-10-22T17:08:59.144Z', '2025-10-22T17:08:59.144Z');

-- Table: purchase_history
DROP TABLE IF EXISTS "purchase_history" CASCADE;
CREATE TABLE "purchase_history" (
  "id" int4 NOT NULL DEFAULT nextval('purchase_history_id_seq'::regclass),
  "user_id" varchar(255) NOT NULL,
  "white_label_id" int4 NOT NULL,
  "plan_id" int4 NOT NULL,
  "amount" numeric(10,2) NOT NULL,
  "transaction_id" varchar(255),
  "payment_method" varchar(255),
  "status" varchar(50) DEFAULT 'pending'::character varying,
  "metadata" jsonb,
  "created_at" timestamp DEFAULT now()
);

-- Data for table: purchase_history
INSERT INTO "purchase_history" ("id", "user_id", "white_label_id", "plan_id", "amount", "transaction_id", "payment_method", "status", "metadata", "created_at") VALUES (2, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 13, '100.00', 'bypass_1761143397501_bbtowqqqs', 'NMI Credit Card', 'completed', '{"orderId":"order_1761143397500_13","planName":"Its SA","nmiAuthCode":"AUTHW8R6VT","planOwnerId":"admin_1761023031290","customerName":"Munib Ahmed","referralCode":null,"customerEmail":"munibahmed125521@gmail.com","paymentMethod":"NMI Credit Card","nmiTransactionId":"bypass_1761143397501_bbtowqqqs"}', '2025-10-22T09:29:57.659Z');
INSERT INTO "purchase_history" ("id", "user_id", "white_label_id", "plan_id", "amount", "transaction_id", "payment_method", "status", "metadata", "created_at") VALUES (3, '24aadd3e-4821-4c16-bb9d-7cd6788994e7', 3, 13, '100.00', 'bypass_1761157448662_yey5efq4e', 'NMI Credit Card', 'completed', '{"orderId":"order_1761157448657_13","planName":"Its SA","nmiAuthCode":"AUTHUQUNES","planOwnerId":"admin_1761023031290","customerName":"epic gamer","referralCode":null,"customerEmail":"epicgamer125521@gmail.com","paymentMethod":"NMI Credit Card","nmiTransactionId":"bypass_1761157448662_yey5efq4e"}', '2025-10-22T13:24:08.824Z');
INSERT INTO "purchase_history" ("id", "user_id", "white_label_id", "plan_id", "amount", "transaction_id", "payment_method", "status", "metadata", "created_at") VALUES (4, '54b33e98-23c3-4fe4-a664-7a688a613730', 4, 14, '200.00', 'bypass_1761158373635_1kmvlo27g', 'NMI Credit Card', 'completed', '{"orderId":"order_1761158373628_14","planName":"1st try","nmiAuthCode":"AUTHBSHRFJ","planOwnerId":"526fdca7-303c-48b5-9676-0d0eba06d6fb","customerName":"kaif gamerz","referralCode":null,"customerEmail":"kaifgamer762@gmail.com","paymentMethod":"NMI Credit Card","nmiTransactionId":"bypass_1761158373635_1kmvlo27g"}', '2025-10-22T13:39:33.799Z');
INSERT INTO "purchase_history" ("id", "user_id", "white_label_id", "plan_id", "amount", "transaction_id", "payment_method", "status", "metadata", "created_at") VALUES (5, '54b33e98-23c3-4fe4-a664-7a688a613730', 4, 15, '22.00', 'bypass_1761171023361_tfpo0mzmq', 'NMI Credit Card', 'completed', '{"orderId":"order_1761171023360_15","planName":"YouTubeEpic","nmiAuthCode":"AUTH0W7165","planOwnerId":"24aadd3e-4821-4c16-bb9d-7cd6788994e7","customerName":"kaif gamerz","referralCode":null,"customerEmail":"kaifgamer762@gmail.com","paymentMethod":"NMI Credit Card","nmiTransactionId":"bypass_1761171023361_tfpo0mzmq"}', '2025-10-22T17:10:23.513Z');
INSERT INTO "purchase_history" ("id", "user_id", "white_label_id", "plan_id", "amount", "transaction_id", "payment_method", "status", "metadata", "created_at") VALUES (6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 16, '1000.00', 'bypass_1761180858881_m7ns7c3hu', 'NMI Credit Card', 'completed', '{"orderId":"order_1761180858880_16","planName":"Test For Affiliate","nmiAuthCode":"AUTHWBRBBI","planOwnerId":"admin_1761023031290","customerName":"Munib Ahmed","referralCode":"epic","customerEmail":"munibahmed125521@gmail.com","paymentMethod":"NMI Credit Card","nmiTransactionId":"bypass_1761180858881_m7ns7c3hu"}', '2025-10-22T19:54:19.041Z');
INSERT INTO "purchase_history" ("id", "user_id", "white_label_id", "plan_id", "amount", "transaction_id", "payment_method", "status", "metadata", "created_at") VALUES (7, 'de5c95de-decd-46b9-8c4f-99518664a325', 6, 13, '100.00', 'bypass_1761181897958_jav1rtq6q', 'NMI Credit Card', 'completed', '{"orderId":"order_1761181897958_13","planName":"Its SA","nmiAuthCode":"AUTH7SGJ4L","planOwnerId":"admin_1761023031290","customerName":"Munib Ahmed","referralCode":"epic","customerEmail":"kaifgamer762@gmail.com","paymentMethod":"NMI Credit Card","nmiTransactionId":"bypass_1761181897958_jav1rtq6q"}', '2025-10-22T20:11:38.111Z');
INSERT INTO "purchase_history" ("id", "user_id", "white_label_id", "plan_id", "amount", "transaction_id", "payment_method", "status", "metadata", "created_at") VALUES (8, 's7dbfr1bi9ib2qn', 2, 14, '200.00', 'bypass_1761341640604_wo6b5q88o', 'NMI Credit Card', 'completed', '{"orderId":"order_1761341640601_14","planName":"1st try","nmiAuthCode":"AUTHYVJJNW","planOwnerId":"526fdca7-303c-48b5-9676-0d0eba06d6fb","customerName":"Hammad Saqib","referralCode":null,"customerEmail":"adrwealthadvisorsllc@gmail.com","paymentMethod":"NMI Credit Card","nmiTransactionId":"bypass_1761341640604_wo6b5q88o"}', '2025-10-24T16:34:00.759Z');
INSERT INTO "purchase_history" ("id", "user_id", "white_label_id", "plan_id", "amount", "transaction_id", "payment_method", "status", "metadata", "created_at") VALUES (9, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 10, '1000.00', 'bypass_1761341790348_ecdgbod1c', 'NMI Credit Card', 'completed', '{"orderId":"order_1761341790348_10","planName":"hhh","nmiAuthCode":"AUTHC0L4KK","planOwnerId":"admin_1761023031290","customerName":"Munib Ahmed","referralCode":null,"customerEmail":"munibahmed1255211@gmail.com","paymentMethod":"NMI Credit Card","nmiTransactionId":"bypass_1761341790348_ecdgbod1c"}', '2025-10-24T16:36:30.509Z');
INSERT INTO "purchase_history" ("id", "user_id", "white_label_id", "plan_id", "amount", "transaction_id", "payment_method", "status", "metadata", "created_at") VALUES (10, '2928066f-1693-4af4-9c02-6728a132130d', 8, 13, '100.00', 'bypass_1761347019468_13wlh976c', 'NMI Credit Card', 'completed', '{"orderId":"order_1761347019467_13","planName":"Its SA","nmiAuthCode":"AUTH19BQ78","planOwnerId":"admin_1761023031290","customerName":"kaif gamer","referralCode":"tes","customerEmail":"nipef11391@ametitas.com","paymentMethod":"NMI Credit Card","nmiTransactionId":"bypass_1761347019468_13wlh976c"}', '2025-10-24T18:03:39.624Z');
INSERT INTO "purchase_history" ("id", "user_id", "white_label_id", "plan_id", "amount", "transaction_id", "payment_method", "status", "metadata", "created_at") VALUES (11, 's7dbfr1bi9ib2qn', 2, 14, '200.00', 'bypass_1761347397253_sqylcsm7q', 'NMI Credit Card', 'completed', '{"orderId":"order_1761347397253_14","planName":"1st try","nmiAuthCode":"AUTHV1B1UU","planOwnerId":"526fdca7-303c-48b5-9676-0d0eba06d6fb","customerName":"Hammad Saqib","referralCode":null,"customerEmail":"adrwealthadvisorsllc@gmail.com","paymentMethod":"NMI Credit Card","nmiTransactionId":"bypass_1761347397253_sqylcsm7q"}', '2025-10-24T18:09:57.403Z');
INSERT INTO "purchase_history" ("id", "user_id", "white_label_id", "plan_id", "amount", "transaction_id", "payment_method", "status", "metadata", "created_at") VALUES (12, 's7dbfr1bi9ib2qn', 2, 14, '200.00', 'bypass_1761348604557_cq54xp8yd', 'NMI Credit Card', 'completed', '{"orderId":"order_1761348604556_14","planName":"1st try","nmiAuthCode":"AUTHFHAPEZ","planOwnerId":"526fdca7-303c-48b5-9676-0d0eba06d6fb","customerName":"Hammad Saqib","referralCode":null,"customerEmail":"adrwealthadvisorsllc@gmail.com","paymentMethod":"NMI Credit Card","nmiTransactionId":"bypass_1761348604557_cq54xp8yd"}', '2025-10-24T18:30:04.710Z');
INSERT INTO "purchase_history" ("id", "user_id", "white_label_id", "plan_id", "amount", "transaction_id", "payment_method", "status", "metadata", "created_at") VALUES (13, 'q4cryh0182l4uxz', 2, 14, '200.00', 'bypass_1761930578207_l6b1ynt5z', 'NMI Credit Card', 'completed', '{"orderId":"order_1761930578207_14","planName":"1st try","nmiAuthCode":"AUTHN2D19W","planOwnerId":"526fdca7-303c-48b5-9676-0d0eba06d6fb","customerName":"kaif gamer","referralCode":null,"customerEmail":"kaifgamekjr762@gmail.com","paymentMethod":"NMI Credit Card","nmiTransactionId":"bypass_1761930578207_l6b1ynt5z"}', '2025-10-31T12:09:38.376Z');
INSERT INTO "purchase_history" ("id", "user_id", "white_label_id", "plan_id", "amount", "transaction_id", "payment_method", "status", "metadata", "created_at") VALUES (14, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 19, '100.00', 'bypass_1761930859823_15ngc6z3i', 'NMI Credit Card', 'completed', '{"orderId":"order_1761930859822_19","planName":"testing for sp affiliate","nmiAuthCode":"AUTHM1FQAE","planOwnerId":"admin_1761023031290","customerName":"Munib Ahmed","referralCode":"epic","customerEmail":"munibahmed1255211@gmail.com","paymentMethod":"NMI Credit Card","nmiTransactionId":"bypass_1761930859823_15ngc6z3i"}', '2025-10-31T12:14:19.993Z');
INSERT INTO "purchase_history" ("id", "user_id", "white_label_id", "plan_id", "amount", "transaction_id", "payment_method", "status", "metadata", "created_at") VALUES (15, 'q4cryh0182l4uxz', 2, 14, '200.00', 'bypass_1761932064140_wip5gwa4s', 'NMI Credit Card', 'completed', '{"orderId":"order_1761932064138_14","planName":"1st try","nmiAuthCode":"AUTHM5FDVK","planOwnerId":"526fdca7-303c-48b5-9676-0d0eba06d6fb","customerName":"kaif gamer","referralCode":null,"customerEmail":"kaifgamekjr762@gmail.com","paymentMethod":"NMI Credit Card","nmiTransactionId":"bypass_1761932064140_wip5gwa4s"}', '2025-10-31T12:34:24.311Z');
INSERT INTO "purchase_history" ("id", "user_id", "white_label_id", "plan_id", "amount", "transaction_id", "payment_method", "status", "metadata", "created_at") VALUES (16, 'q4cryh0182l4uxz', 2, 14, '200.00', 'bypass_1761932690087_4smnemg24', 'NMI Credit Card', 'completed', '{"orderId":"order_1761932690086_14","planName":"1st try","nmiAuthCode":"AUTHY947QP","planOwnerId":"526fdca7-303c-48b5-9676-0d0eba06d6fb","customerName":"kaif gamer","referralCode":null,"customerEmail":"kaifgamekjr762@gmail.com","paymentMethod":"NMI Credit Card","nmiTransactionId":"bypass_1761932690087_4smnemg24"}', '2025-10-31T12:44:50.277Z');

-- Table: referral_clicks
DROP TABLE IF EXISTS "referral_clicks" CASCADE;
CREATE TABLE "referral_clicks" (
  "id" int4 NOT NULL DEFAULT nextval('referral_clicks_id_seq'::regclass),
  "referral_link_id" int4 NOT NULL,
  "affiliate_id" varchar(255) NOT NULL,
  "ip_address" varchar(255),
  "user_agent" varchar(1000),
  "converted_to_signup" bool DEFAULT false,
  "created_at" timestamp DEFAULT now()
);

-- Table: referral_commissions
DROP TABLE IF EXISTS "referral_commissions" CASCADE;
CREATE TABLE "referral_commissions" (
  "id" int4 NOT NULL DEFAULT nextval('referral_commissions_id_seq'::regclass),
  "affiliate_id" varchar(255) NOT NULL,
  "subscription_id" int4 NOT NULL,
  "plan_id" int4 NOT NULL,
  "referral_code" varchar(255) NOT NULL,
  "purchaser_user_id" varchar(255) NOT NULL,
  "commission_amount" numeric(10,2) NOT NULL,
  "commission_percentage" numeric(5,2) NOT NULL,
  "plan_amount" numeric(10,2) NOT NULL,
  "status" varchar(50) NOT NULL DEFAULT 'pending'::character varying,
  "paid_at" timestamp,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Data for table: referral_commissions
INSERT INTO "referral_commissions" ("id", "affiliate_id", "subscription_id", "plan_id", "referral_code", "purchaser_user_id", "commission_amount", "commission_percentage", "plan_amount", "status", "paid_at", "created_at", "updated_at") VALUES (2, '9jx56q9of3z3so7', 10, 16, 'epic', '526fdca7-303c-48b5-9676-0d0eba06d6fb', '100.00', '10.00', '1000.00', 'pending', NULL, '2025-10-22T19:54:19.162Z', '2025-10-22T19:54:19.162Z');
INSERT INTO "referral_commissions" ("id", "affiliate_id", "subscription_id", "plan_id", "referral_code", "purchaser_user_id", "commission_amount", "commission_percentage", "plan_amount", "status", "paid_at", "created_at", "updated_at") VALUES (3, '9jx56q9of3z3so7', 11, 13, 'epic', 'de5c95de-decd-46b9-8c4f-99518664a325', '10.00', '10.00', '100.00', 'pending', NULL, '2025-10-22T20:11:38.231Z', '2025-10-22T20:11:38.231Z');
INSERT INTO "referral_commissions" ("id", "affiliate_id", "subscription_id", "plan_id", "referral_code", "purchaser_user_id", "commission_amount", "commission_percentage", "plan_amount", "status", "paid_at", "created_at", "updated_at") VALUES (4, '9jx56q9of3z3so7', 18, 19, 'epic', '526fdca7-303c-48b5-9676-0d0eba06d6fb', '100.00', '100.00', '100.00', 'pending', NULL, '2025-10-31T12:14:20.128Z', '2025-10-31T12:14:20.128Z');

-- Table: referral_links
DROP TABLE IF EXISTS "referral_links" CASCADE;
CREATE TABLE "referral_links" (
  "id" int4 NOT NULL DEFAULT nextval('referral_links_id_seq'::regclass),
  "affiliate_id" varchar(255) NOT NULL,
  "referral_code" varchar(50) NOT NULL,
  "is_active" bool DEFAULT true,
  "total_clicks" int4 DEFAULT 0,
  "total_signups" int4 DEFAULT 0,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Table: referral_signups
DROP TABLE IF EXISTS "referral_signups" CASCADE;
CREATE TABLE "referral_signups" (
  "id" int4 NOT NULL DEFAULT nextval('referral_signups_id_seq'::regclass),
  "referral_link_id" int4 NOT NULL,
  "affiliate_id" varchar(255) NOT NULL,
  "signup_user_id" varchar(255) NOT NULL,
  "ip_address" varchar(255),
  "user_agent" varchar(1000),
  "created_at" timestamp DEFAULT now()
);

-- Table: referral_tracking
DROP TABLE IF EXISTS "referral_tracking" CASCADE;
CREATE TABLE "referral_tracking" (
  "id" int4 NOT NULL DEFAULT nextval('referral_tracking_id_seq'::regclass),
  "affiliate_id" varchar(255) NOT NULL,
  "referred_user_id" varchar(255) NOT NULL,
  "white_label_id" int4 NOT NULL,
  "domain_path" varchar(255) NOT NULL,
  "referral_source" varchar(50) DEFAULT 'landing_page'::character varying,
  "status" varchar(20) DEFAULT 'pending'::character varying,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Table: sessions
DROP TABLE IF EXISTS "sessions" CASCADE;
CREATE TABLE "sessions" (
  "sid" varchar(255) NOT NULL,
  "sess" jsonb NOT NULL,
  "expire" timestamp NOT NULL
);

-- Table: subscriptions
DROP TABLE IF EXISTS "subscriptions" CASCADE;
CREATE TABLE "subscriptions" (
  "id" int4 NOT NULL DEFAULT nextval('subscriptions_id_seq'::regclass),
  "user_id" varchar(255),
  "white_label_id" int4 NOT NULL,
  "plan_id" int4 NOT NULL,
  "selected_categories" jsonb DEFAULT '[]'::jsonb,
  "selected_products" jsonb DEFAULT '[]'::jsonb,
  "status" varchar(50) NOT NULL DEFAULT 'active'::character varying,
  "billing_cycle" varchar(50) NOT NULL DEFAULT 'monthly'::character varying,
  "amount" numeric(10,2) NOT NULL,
  "referral_code" varchar(255),
  "current_period_start" timestamp,
  "current_period_end" timestamp,
  "cancel_at_period_end" bool DEFAULT false,
  "stripe_subscription_id" varchar(255),
  "stripe_customer_id" varchar(255),
  "next_billing_date" timestamp,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Data for table: subscriptions
INSERT INTO "subscriptions" ("id", "user_id", "white_label_id", "plan_id", "selected_categories", "selected_products", "status", "billing_cycle", "amount", "referral_code", "current_period_start", "current_period_end", "cancel_at_period_end", "stripe_subscription_id", "stripe_customer_id", "next_billing_date", "created_at", "updated_at") VALUES (6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 13, '[]', '[]', 'active', 'monthly', '100.00', NULL, '2025-10-22T09:29:57.561Z', '2025-11-21T09:29:57.561Z', FALSE, 'bypass_1761143397501_bbtowqqqs', 'bypass_bypass_1761143397501_bbtowqqqs', '2025-11-21T09:29:57.561Z', '2025-10-22T09:29:57.594Z', '2025-10-22T09:29:57.594Z');
INSERT INTO "subscriptions" ("id", "user_id", "white_label_id", "plan_id", "selected_categories", "selected_products", "status", "billing_cycle", "amount", "referral_code", "current_period_start", "current_period_end", "cancel_at_period_end", "stripe_subscription_id", "stripe_customer_id", "next_billing_date", "created_at", "updated_at") VALUES (7, '24aadd3e-4821-4c16-bb9d-7cd6788994e7', 3, 13, '[]', '[]', 'active', 'monthly', '100.00', NULL, '2025-10-22T13:24:08.728Z', '2025-11-21T13:24:08.728Z', FALSE, 'bypass_1761157448662_yey5efq4e', 'bypass_bypass_1761157448662_yey5efq4e', '2025-11-21T13:24:08.728Z', '2025-10-22T13:24:08.760Z', '2025-10-22T13:24:08.760Z');
INSERT INTO "subscriptions" ("id", "user_id", "white_label_id", "plan_id", "selected_categories", "selected_products", "status", "billing_cycle", "amount", "referral_code", "current_period_start", "current_period_end", "cancel_at_period_end", "stripe_subscription_id", "stripe_customer_id", "next_billing_date", "created_at", "updated_at") VALUES (8, '54b33e98-23c3-4fe4-a664-7a688a613730', 4, 14, '[]', '[]', 'active', 'monthly', '200.00', NULL, '2025-10-22T13:39:33.708Z', '2025-11-21T13:39:33.708Z', FALSE, 'bypass_1761158373635_1kmvlo27g', 'bypass_bypass_1761158373635_1kmvlo27g', '2025-11-21T13:39:33.708Z', '2025-10-22T13:39:33.740Z', '2025-10-22T13:39:33.740Z');
INSERT INTO "subscriptions" ("id", "user_id", "white_label_id", "plan_id", "selected_categories", "selected_products", "status", "billing_cycle", "amount", "referral_code", "current_period_start", "current_period_end", "cancel_at_period_end", "stripe_subscription_id", "stripe_customer_id", "next_billing_date", "created_at", "updated_at") VALUES (9, '54b33e98-23c3-4fe4-a664-7a688a613730', 4, 15, '[]', '[]', 'active', 'monthly', '22.00', NULL, '2025-10-22T17:10:23.419Z', '2025-11-21T17:10:23.419Z', FALSE, 'bypass_1761171023361_tfpo0mzmq', 'bypass_bypass_1761171023361_tfpo0mzmq', '2025-11-21T17:10:23.419Z', '2025-10-22T17:10:23.451Z', '2025-10-22T17:10:23.451Z');
INSERT INTO "subscriptions" ("id", "user_id", "white_label_id", "plan_id", "selected_categories", "selected_products", "status", "billing_cycle", "amount", "referral_code", "current_period_start", "current_period_end", "cancel_at_period_end", "stripe_subscription_id", "stripe_customer_id", "next_billing_date", "created_at", "updated_at") VALUES (10, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 16, '[]', '[]', 'active', 'monthly', '1000.00', NULL, '2025-10-22T19:54:18.942Z', '2025-11-21T19:54:18.942Z', FALSE, 'bypass_1761180858881_m7ns7c3hu', 'bypass_bypass_1761180858881_m7ns7c3hu', '2025-11-21T19:54:18.942Z', '2025-10-22T19:54:18.980Z', '2025-10-22T19:54:18.980Z');
INSERT INTO "subscriptions" ("id", "user_id", "white_label_id", "plan_id", "selected_categories", "selected_products", "status", "billing_cycle", "amount", "referral_code", "current_period_start", "current_period_end", "cancel_at_period_end", "stripe_subscription_id", "stripe_customer_id", "next_billing_date", "created_at", "updated_at") VALUES (11, 'de5c95de-decd-46b9-8c4f-99518664a325', 6, 13, '[]', '[]', 'active', 'monthly', '100.00', NULL, '2025-10-22T20:11:38.018Z', '2025-11-21T20:11:38.018Z', FALSE, 'bypass_1761181897958_jav1rtq6q', 'bypass_bypass_1761181897958_jav1rtq6q', '2025-11-21T20:11:38.018Z', '2025-10-22T20:11:38.050Z', '2025-10-22T20:11:38.050Z');
INSERT INTO "subscriptions" ("id", "user_id", "white_label_id", "plan_id", "selected_categories", "selected_products", "status", "billing_cycle", "amount", "referral_code", "current_period_start", "current_period_end", "cancel_at_period_end", "stripe_subscription_id", "stripe_customer_id", "next_billing_date", "created_at", "updated_at") VALUES (12, 's7dbfr1bi9ib2qn', 2, 14, '[]', '[]', 'active', 'monthly', '200.00', NULL, '2025-10-24T16:34:00.663Z', '2025-11-23T16:34:00.663Z', FALSE, 'bypass_1761341640604_wo6b5q88o', 'bypass_bypass_1761341640604_wo6b5q88o', '2025-11-23T16:34:00.663Z', '2025-10-24T16:34:00.696Z', '2025-10-24T16:34:00.696Z');
INSERT INTO "subscriptions" ("id", "user_id", "white_label_id", "plan_id", "selected_categories", "selected_products", "status", "billing_cycle", "amount", "referral_code", "current_period_start", "current_period_end", "cancel_at_period_end", "stripe_subscription_id", "stripe_customer_id", "next_billing_date", "created_at", "updated_at") VALUES (13, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 10, '[]', '[]', 'active', 'monthly', '1000.00', NULL, '2025-10-24T16:36:30.415Z', '2025-11-23T16:36:30.415Z', FALSE, 'bypass_1761341790348_ecdgbod1c', 'bypass_bypass_1761341790348_ecdgbod1c', '2025-11-23T16:36:30.415Z', '2025-10-24T16:36:30.448Z', '2025-10-24T16:36:30.448Z');
INSERT INTO "subscriptions" ("id", "user_id", "white_label_id", "plan_id", "selected_categories", "selected_products", "status", "billing_cycle", "amount", "referral_code", "current_period_start", "current_period_end", "cancel_at_period_end", "stripe_subscription_id", "stripe_customer_id", "next_billing_date", "created_at", "updated_at") VALUES (14, '2928066f-1693-4af4-9c02-6728a132130d', 8, 13, '[]', '[]', 'active', 'monthly', '100.00', NULL, '2025-10-24T18:03:39.530Z', '2025-11-23T18:03:39.530Z', FALSE, 'bypass_1761347019468_13wlh976c', 'bypass_bypass_1761347019468_13wlh976c', '2025-11-23T18:03:39.530Z', '2025-10-24T18:03:39.562Z', '2025-10-24T18:03:39.562Z');
INSERT INTO "subscriptions" ("id", "user_id", "white_label_id", "plan_id", "selected_categories", "selected_products", "status", "billing_cycle", "amount", "referral_code", "current_period_start", "current_period_end", "cancel_at_period_end", "stripe_subscription_id", "stripe_customer_id", "next_billing_date", "created_at", "updated_at") VALUES (15, 's7dbfr1bi9ib2qn', 2, 14, '[]', '[]', 'active', 'monthly', '200.00', NULL, '2025-10-24T18:09:57.311Z', '2025-11-23T18:09:57.311Z', FALSE, 'bypass_1761347397253_sqylcsm7q', 'bypass_bypass_1761347397253_sqylcsm7q', '2025-11-23T18:09:57.311Z', '2025-10-24T18:09:57.343Z', '2025-10-24T18:09:57.343Z');
INSERT INTO "subscriptions" ("id", "user_id", "white_label_id", "plan_id", "selected_categories", "selected_products", "status", "billing_cycle", "amount", "referral_code", "current_period_start", "current_period_end", "cancel_at_period_end", "stripe_subscription_id", "stripe_customer_id", "next_billing_date", "created_at", "updated_at") VALUES (16, 's7dbfr1bi9ib2qn', 2, 14, '[]', '[]', 'active', 'monthly', '200.00', NULL, '2025-10-24T18:30:04.616Z', '2025-11-23T18:30:04.616Z', FALSE, 'bypass_1761348604557_cq54xp8yd', 'bypass_bypass_1761348604557_cq54xp8yd', '2025-11-23T18:30:04.616Z', '2025-10-24T18:30:04.648Z', '2025-10-24T18:30:04.648Z');
INSERT INTO "subscriptions" ("id", "user_id", "white_label_id", "plan_id", "selected_categories", "selected_products", "status", "billing_cycle", "amount", "referral_code", "current_period_start", "current_period_end", "cancel_at_period_end", "stripe_subscription_id", "stripe_customer_id", "next_billing_date", "created_at", "updated_at") VALUES (17, 'q4cryh0182l4uxz', 2, 14, '[]', '[]', 'active', 'monthly', '200.00', NULL, '2025-10-31T12:09:38.272Z', '2025-11-30T12:09:38.272Z', FALSE, 'bypass_1761930578207_l6b1ynt5z', 'bypass_bypass_1761930578207_l6b1ynt5z', '2025-11-30T12:09:38.272Z', '2025-10-31T12:09:38.306Z', '2025-10-31T12:09:38.306Z');
INSERT INTO "subscriptions" ("id", "user_id", "white_label_id", "plan_id", "selected_categories", "selected_products", "status", "billing_cycle", "amount", "referral_code", "current_period_start", "current_period_end", "cancel_at_period_end", "stripe_subscription_id", "stripe_customer_id", "next_billing_date", "created_at", "updated_at") VALUES (18, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 19, '[]', '[]', 'active', 'monthly', '100.00', NULL, '2025-10-31T12:14:19.891Z', '2025-11-30T12:14:19.891Z', FALSE, 'bypass_1761930859823_15ngc6z3i', 'bypass_bypass_1761930859823_15ngc6z3i', '2025-11-30T12:14:19.891Z', '2025-10-31T12:14:19.923Z', '2025-10-31T12:14:19.923Z');
INSERT INTO "subscriptions" ("id", "user_id", "white_label_id", "plan_id", "selected_categories", "selected_products", "status", "billing_cycle", "amount", "referral_code", "current_period_start", "current_period_end", "cancel_at_period_end", "stripe_subscription_id", "stripe_customer_id", "next_billing_date", "created_at", "updated_at") VALUES (19, 'q4cryh0182l4uxz', 2, 14, '[]', '[]', 'active', 'monthly', '200.00', NULL, '2025-10-31T12:34:24.207Z', '2025-11-30T12:34:24.207Z', FALSE, 'bypass_1761932064140_wip5gwa4s', 'bypass_bypass_1761932064140_wip5gwa4s', '2025-11-30T12:34:24.207Z', '2025-10-31T12:34:24.240Z', '2025-10-31T12:34:24.240Z');
INSERT INTO "subscriptions" ("id", "user_id", "white_label_id", "plan_id", "selected_categories", "selected_products", "status", "billing_cycle", "amount", "referral_code", "current_period_start", "current_period_end", "cancel_at_period_end", "stripe_subscription_id", "stripe_customer_id", "next_billing_date", "created_at", "updated_at") VALUES (20, 'q4cryh0182l4uxz', 2, 14, '[]', '[]', 'active', 'monthly', '200.00', NULL, '2025-10-31T12:44:50.176Z', '2025-11-30T12:44:50.176Z', FALSE, 'bypass_1761932690087_4smnemg24', 'bypass_bypass_1761932690087_4smnemg24', '2025-11-30T12:44:50.176Z', '2025-10-31T12:44:50.209Z', '2025-10-31T12:44:50.209Z');

-- Table: templates
DROP TABLE IF EXISTS "templates" CASCADE;
CREATE TABLE "templates" (
  "id" int4 NOT NULL DEFAULT nextval('templates_id_seq'::regclass),
  "name" varchar(255) NOT NULL,
  "description" varchar(1000),
  "type" varchar(50) NOT NULL,
  "category" varchar(100) NOT NULL,
  "preview_url" varchar(255),
  "thumbnail_url" varchar(255),
  "config_schema" jsonb,
  "default_config" jsonb,
  "is_active" bool DEFAULT true,
  "is_premium" bool DEFAULT false,
  "created_by" varchar(255) NOT NULL,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Table: themes
DROP TABLE IF EXISTS "themes" CASCADE;
CREATE TABLE "themes" (
  "id" int4 NOT NULL DEFAULT nextval('themes_id_seq'::regclass),
  "name" varchar(255) NOT NULL,
  "description" varchar(1000),
  "colors" jsonb NOT NULL,
  "is_default" bool DEFAULT false,
  "is_active" bool DEFAULT true,
  "created_by" varchar(255) NOT NULL,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Table: user_preferences
DROP TABLE IF EXISTS "user_preferences" CASCADE;
CREATE TABLE "user_preferences" (
  "id" int4 NOT NULL DEFAULT nextval('user_preferences_id_seq'::regclass),
  "user_id" varchar(255) NOT NULL,
  "theme" varchar(50) DEFAULT 'light'::character varying,
  "primary_color" varchar(255) DEFAULT '#2563EB'::character varying,
  "secondary_color" varchar(255) DEFAULT '#64748B'::character varying,
  "logo_url" varchar(255),
  "language" varchar(255) DEFAULT 'en'::character varying,
  "timezone" varchar(255) DEFAULT 'UTC'::character varying,
  "currency" varchar(255) DEFAULT 'USD'::character varying,
  "email_notifications" bool DEFAULT true,
  "marketing_emails" bool DEFAULT false,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Data for table: user_preferences
INSERT INTO "user_preferences" ("id", "user_id", "theme", "primary_color", "secondary_color", "logo_url", "language", "timezone", "currency", "email_notifications", "marketing_emails", "created_at", "updated_at") VALUES (2, 'admin_1761023059755', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', TRUE, FALSE, '2025-10-21T11:18:00.465Z', '2025-10-21T11:18:00.465Z');
INSERT INTO "user_preferences" ("id", "user_id", "theme", "primary_color", "secondary_color", "logo_url", "language", "timezone", "currency", "email_notifications", "marketing_emails", "created_at", "updated_at") VALUES (19, '0iaesg6mdixsene', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', TRUE, FALSE, '2025-10-31T05:46:42.378Z', '2025-10-31T05:46:42.378Z');
INSERT INTO "user_preferences" ("id", "user_id", "theme", "primary_color", "secondary_color", "logo_url", "language", "timezone", "currency", "email_notifications", "marketing_emails", "created_at", "updated_at") VALUES (20, '0zjlohc2wnv0jwo', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', TRUE, FALSE, '2025-10-31T06:13:26.775Z', '2025-10-31T06:13:26.775Z');
INSERT INTO "user_preferences" ("id", "user_id", "theme", "primary_color", "secondary_color", "logo_url", "language", "timezone", "currency", "email_notifications", "marketing_emails", "created_at", "updated_at") VALUES (21, 'ow1cffxdntt3tw0', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', TRUE, FALSE, '2025-10-31T06:21:47.283Z', '2025-10-31T06:21:47.283Z');
INSERT INTO "user_preferences" ("id", "user_id", "theme", "primary_color", "secondary_color", "logo_url", "language", "timezone", "currency", "email_notifications", "marketing_emails", "created_at", "updated_at") VALUES (22, '0hcverickhqijpi', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', TRUE, FALSE, '2025-10-31T06:34:25.095Z', '2025-10-31T06:34:25.095Z');
INSERT INTO "user_preferences" ("id", "user_id", "theme", "primary_color", "secondary_color", "logo_url", "language", "timezone", "currency", "email_notifications", "marketing_emails", "created_at", "updated_at") VALUES (4, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 'light', '#2563EB', '#ff0f0f', NULL, 'en', 'UTC', 'USD', TRUE, FALSE, '2025-10-21T17:37:52.610Z', '2025-10-31T07:33:17.345Z');
INSERT INTO "user_preferences" ("id", "user_id", "theme", "primary_color", "secondary_color", "logo_url", "language", "timezone", "currency", "email_notifications", "marketing_emails", "created_at", "updated_at") VALUES (5, 'izbb770i17l44pj', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', TRUE, FALSE, '2025-10-21T18:18:09.869Z', '2025-10-21T18:18:09.869Z');
INSERT INTO "user_preferences" ("id", "user_id", "theme", "primary_color", "secondary_color", "logo_url", "language", "timezone", "currency", "email_notifications", "marketing_emails", "created_at", "updated_at") VALUES (6, '24aadd3e-4821-4c16-bb9d-7cd6788994e7', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', TRUE, FALSE, '2025-10-22T13:23:11.018Z', '2025-10-22T13:23:11.018Z');
INSERT INTO "user_preferences" ("id", "user_id", "theme", "primary_color", "secondary_color", "logo_url", "language", "timezone", "currency", "email_notifications", "marketing_emails", "created_at", "updated_at") VALUES (7, '54b33e98-23c3-4fe4-a664-7a688a613730', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', TRUE, FALSE, '2025-10-22T13:30:46.907Z', '2025-10-22T13:30:46.907Z');
INSERT INTO "user_preferences" ("id", "user_id", "theme", "primary_color", "secondary_color", "logo_url", "language", "timezone", "currency", "email_notifications", "marketing_emails", "created_at", "updated_at") VALUES (8, 'q4cryh0182l4uxz', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', TRUE, FALSE, '2025-10-22T18:18:48.890Z', '2025-10-22T18:18:48.890Z');
INSERT INTO "user_preferences" ("id", "user_id", "theme", "primary_color", "secondary_color", "logo_url", "language", "timezone", "currency", "email_notifications", "marketing_emails", "created_at", "updated_at") VALUES (9, '9jx56q9of3z3so7', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', TRUE, FALSE, '2025-10-22T19:16:27.266Z', '2025-10-22T19:16:27.266Z');
INSERT INTO "user_preferences" ("id", "user_id", "theme", "primary_color", "secondary_color", "logo_url", "language", "timezone", "currency", "email_notifications", "marketing_emails", "created_at", "updated_at") VALUES (10, 'qn3rqhhyooxt4c8', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', TRUE, FALSE, '2025-10-22T20:05:17.156Z', '2025-10-22T20:05:17.156Z');
INSERT INTO "user_preferences" ("id", "user_id", "theme", "primary_color", "secondary_color", "logo_url", "language", "timezone", "currency", "email_notifications", "marketing_emails", "created_at", "updated_at") VALUES (11, 'de5c95de-decd-46b9-8c4f-99518664a325', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', TRUE, FALSE, '2025-10-22T20:11:05.592Z', '2025-10-22T20:11:05.592Z');
INSERT INTO "user_preferences" ("id", "user_id", "theme", "primary_color", "secondary_color", "logo_url", "language", "timezone", "currency", "email_notifications", "marketing_emails", "created_at", "updated_at") VALUES (12, 'ujklk6hjzxnni74', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', TRUE, FALSE, '2025-10-22T20:35:50.444Z', '2025-10-22T20:35:50.444Z');
INSERT INTO "user_preferences" ("id", "user_id", "theme", "primary_color", "secondary_color", "logo_url", "language", "timezone", "currency", "email_notifications", "marketing_emails", "created_at", "updated_at") VALUES (13, 'ku4dt1cvfl45ame', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', TRUE, FALSE, '2025-10-22T21:15:35.218Z', '2025-10-22T21:15:35.218Z');
INSERT INTO "user_preferences" ("id", "user_id", "theme", "primary_color", "secondary_color", "logo_url", "language", "timezone", "currency", "email_notifications", "marketing_emails", "created_at", "updated_at") VALUES (14, 's7dbfr1bi9ib2qn', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', TRUE, FALSE, '2025-10-22T22:31:10.157Z', '2025-10-22T22:31:10.157Z');
INSERT INTO "user_preferences" ("id", "user_id", "theme", "primary_color", "secondary_color", "logo_url", "language", "timezone", "currency", "email_notifications", "marketing_emails", "created_at", "updated_at") VALUES (15, '0fev12eo0oe2ovw', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', TRUE, FALSE, '2025-10-24T16:44:27.759Z', '2025-10-24T16:44:27.759Z');
INSERT INTO "user_preferences" ("id", "user_id", "theme", "primary_color", "secondary_color", "logo_url", "language", "timezone", "currency", "email_notifications", "marketing_emails", "created_at", "updated_at") VALUES (16, '2928066f-1693-4af4-9c02-6728a132130d', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', TRUE, FALSE, '2025-10-24T18:01:14.752Z', '2025-10-24T18:01:14.752Z');
INSERT INTO "user_preferences" ("id", "user_id", "theme", "primary_color", "secondary_color", "logo_url", "language", "timezone", "currency", "email_notifications", "marketing_emails", "created_at", "updated_at") VALUES (3, 'admin_1761023031290', 'light', '#2563EB', '#bb00ff', NULL, 'en', 'UTC', 'USD', TRUE, FALSE, '2025-10-21T17:29:44.683Z', '2025-10-31T05:08:52.100Z');
INSERT INTO "user_preferences" ("id", "user_id", "theme", "primary_color", "secondary_color", "logo_url", "language", "timezone", "currency", "email_notifications", "marketing_emails", "created_at", "updated_at") VALUES (17, 'a4oucaebdlwa6y1', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', TRUE, FALSE, '2025-10-31T05:31:25.899Z', '2025-10-31T05:31:25.899Z');
INSERT INTO "user_preferences" ("id", "user_id", "theme", "primary_color", "secondary_color", "logo_url", "language", "timezone", "currency", "email_notifications", "marketing_emails", "created_at", "updated_at") VALUES (18, 'zuw3mikecamfuym', 'light', '#2563EB', '#64748B', NULL, 'en', 'UTC', 'USD', TRUE, FALSE, '2025-10-31T05:44:51.648Z', '2025-10-31T05:44:51.648Z');

-- Table: user_sessions
DROP TABLE IF EXISTS "user_sessions" CASCADE;
CREATE TABLE "user_sessions" (
  "id" int4 NOT NULL DEFAULT nextval('user_sessions_id_seq'::regclass),
  "user_id" varchar(255) NOT NULL,
  "white_label_id" int4,
  "session_token" varchar(255) NOT NULL,
  "is_active" bool DEFAULT true,
  "ip_address" varchar(255),
  "user_agent" varchar(1000),
  "last_active_at" timestamp DEFAULT now(),
  "created_at" timestamp DEFAULT now(),
  "expires_at" timestamp
);

-- Data for table: user_sessions
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (2, 'admin_1761023059755', NULL, 'K7I9t4w-S8vG9ZfGj2OHnpxHtfs61Vjx', TRUE, '::ffff:127.0.0.1', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)', '2025-10-21T11:09:10.724Z', '2025-10-21T11:09:10.724Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (3, 'admin_1761023059755', NULL, 'hAzkhLf8eCYoicC0u82vk1S_jhbnNp9y', TRUE, '10.82.9.121', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-21T11:17:43.939Z', '2025-10-21T11:17:43.939Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (4, 'admin_1761023031290', NULL, '6XsBew_6PwdNZTdVm5tPFKQWjwhFnbL4', TRUE, '10.82.9.121', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-21T17:29:35.887Z', '2025-10-21T17:29:35.887Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (5, 'admin_1761023031290', NULL, 'qF6ORvKC03cyrrzHrp_F8lHEDUoqF3Pz', TRUE, '10.82.5.119', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-21T17:36:12.413Z', '2025-10-21T17:36:12.413Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (6, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'twcHmeNtFJE4uyr0MBwNwudWba_FkYgQ', TRUE, '10.82.5.119', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T08:39:04.404Z', '2025-10-22T08:39:04.404Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (7, 'admin_1761023031290', NULL, 'ZrHjs1y-VcjcQDGLDAQkXq5xZeZHitPG', TRUE, '10.82.4.22', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T08:41:44.554Z', '2025-10-22T08:41:44.554Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (8, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'tcgJHrpuTAamY1GIEVNJ_S4XTln1E8ja', TRUE, '10.82.6.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T08:41:46.083Z', '2025-10-22T08:41:46.083Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (9, 'admin_1761023031290', NULL, 'xadxQVk9Etu_O5J5HrFjMgQZWFK0pht4', TRUE, '10.82.3.23', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T09:13:39.823Z', '2025-10-22T09:13:39.823Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (10, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'E0GT3Tu5_TAP4y62PVRjrc4MKQMf6-Uw', TRUE, '10.82.11.144', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T09:16:44.876Z', '2025-10-22T09:16:44.876Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (11, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'egGLqbQLknTgfWCDCLa_Rb3KntOo_OTp', TRUE, '10.82.5.119', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T09:29:33.612Z', '2025-10-22T09:29:33.612Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (12, 'admin_1761023031290', NULL, 'GatNHMUdfOFlTjjPkbjbKCZGueamxxzK', TRUE, '10.82.4.70', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T09:30:42.821Z', '2025-10-22T09:30:42.821Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (13, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, '3amcF_diwx8DlmPEnAsNsR7JP0vYBlsg', TRUE, '10.82.5.119', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T09:39:07.038Z', '2025-10-22T09:39:07.038Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (14, 'admin_1761023031290', NULL, 'pQRrGb0B3OVJOyV8xW8j1Df1RhOM2dIh', TRUE, '10.82.9.121', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T09:41:16.672Z', '2025-10-22T09:41:16.672Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (15, 'admin_1761023031290', NULL, 'kC0mzt272YLLWkYAkE9IQJH2E5s1uklJ', TRUE, '10.82.6.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T11:34:16.836Z', '2025-10-22T11:34:16.836Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (16, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'YEZkgj0YkalX2mTZbs8YcHGU19SE-4L6', TRUE, '10.82.6.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T11:40:54.994Z', '2025-10-22T11:40:54.994Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (17, '54b33e98-23c3-4fe4-a664-7a688a613730', 4, 'PflqZmp3RQetZrv1V0e8P1VOg6ADx6SJ', TRUE, '10.82.3.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T13:33:00.209Z', '2025-10-22T13:33:00.209Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (18, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'aA3NbgONPcM6Y5EcGWbRl7NVDOgtZQ4T', TRUE, '10.82.0.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T13:37:54.275Z', '2025-10-22T13:37:54.275Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (19, 'admin_1761023031290', NULL, 'fzR6qQQCMB8uspPL8tgdoLe5zvDpKNJm', TRUE, '10.82.5.119', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T13:38:01.168Z', '2025-10-22T13:38:01.168Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (20, '54b33e98-23c3-4fe4-a664-7a688a613730', 4, 'yMBskkl24X1Qb2zao-R98qWy-F53li__', TRUE, '10.82.9.121', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T14:26:57.062Z', '2025-10-22T14:26:57.062Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (21, '54b33e98-23c3-4fe4-a664-7a688a613730', 4, 'DnEDBHJpd3OUmBtsWVO22kvZz1wD0Wni', TRUE, '10.82.9.121', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T14:40:42.717Z', '2025-10-22T14:40:42.717Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (22, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, '_nbDYaodnFXzc49Aw08xO0tGcjGZts-e', TRUE, '10.82.6.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T14:41:14.750Z', '2025-10-22T14:41:14.750Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (23, '54b33e98-23c3-4fe4-a664-7a688a613730', 4, '8GwSmQvHs_LXIBtNQA2J2_wGORTCE_ow', TRUE, '10.82.10.152', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T14:41:41.411Z', '2025-10-22T14:41:41.411Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (24, '54b33e98-23c3-4fe4-a664-7a688a613730', 4, 'EvvXx5SnwJ0JwbmoX3Qix0BtRau0fpXD', TRUE, '10.82.3.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T14:46:37.499Z', '2025-10-22T14:46:37.499Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (25, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, '7t1zgPx0XqGgFI3FC2HI9BJJZxDin3xd', TRUE, '10.82.4.22', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T14:47:12.409Z', '2025-10-22T14:47:12.409Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (26, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, '78bb43vPM5kdUhjCNmcLwp18CHZfqy2H', TRUE, '10.82.4.22', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T14:52:20.200Z', '2025-10-22T14:52:20.200Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (27, '54b33e98-23c3-4fe4-a664-7a688a613730', 4, 'AQ_1ibv8_VDE9WHxJBGM4WxII9Xj3ukY', TRUE, '10.82.6.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T14:53:15.671Z', '2025-10-22T14:53:15.671Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (28, '54b33e98-23c3-4fe4-a664-7a688a613730', 4, 'Hmh0Lq8iLO7c9euUzUOl7x63wLtrQpga', TRUE, '10.82.11.144', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T15:13:26.265Z', '2025-10-22T15:13:26.265Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (29, '24aadd3e-4821-4c16-bb9d-7cd6788994e7', 3, '4OuF3L022MmdQAuMcD3pB0dPNQcnkAuK', TRUE, '10.82.5.119', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T15:13:28.270Z', '2025-10-22T15:13:28.270Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (30, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'eiu9KeC2piEehzRHna42I_8J6-T_fRuV', TRUE, '10.82.3.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T15:14:00.762Z', '2025-10-22T15:14:00.762Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (31, '54b33e98-23c3-4fe4-a664-7a688a613730', 4, 'Hp2nlBsPm465AwCn74cs8e8tmGHMQnV_', TRUE, '10.82.6.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T16:02:44.357Z', '2025-10-22T16:02:44.357Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (32, '54b33e98-23c3-4fe4-a664-7a688a613730', 4, 'Maebh1P65Pw0jmLH5TrDL-EExakeHIKM', TRUE, '10.82.3.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T16:06:49.676Z', '2025-10-22T16:06:49.676Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (33, '54b33e98-23c3-4fe4-a664-7a688a613730', 4, 'nSIMCmkajAJa95h3Go_j5blSI-G45k1v', TRUE, '10.82.3.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T16:10:19.553Z', '2025-10-22T16:10:19.553Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (34, '54b33e98-23c3-4fe4-a664-7a688a613730', 4, '9jnGN__-9Snsb4iaan8RO36QEV3oHLNw', TRUE, '10.82.11.144', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T16:13:54.400Z', '2025-10-22T16:13:54.400Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (35, 'admin_1761023031290', NULL, 'd-pZdgiyu4Ku9mgbC1H1bIRH0JtYziJ9', TRUE, '10.82.6.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T16:15:05.752Z', '2025-10-22T16:15:05.752Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (36, '54b33e98-23c3-4fe4-a664-7a688a613730', 4, '1TK8tX0GpIcELlUTymeB75GGbQkotLKY', TRUE, '10.82.6.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T16:15:56.706Z', '2025-10-22T16:15:56.706Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (37, '54b33e98-23c3-4fe4-a664-7a688a613730', 4, 'j8K759hT8szsKMA_a79--3-X4_lKaEFm', TRUE, '10.82.9.121', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T16:24:43.124Z', '2025-10-22T16:24:43.124Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (38, '54b33e98-23c3-4fe4-a664-7a688a613730', 4, 'XumvSJOOY5uGN1fjW8Q2hkuawBGTsTm6', TRUE, '10.82.10.160', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T16:28:15.658Z', '2025-10-22T16:28:15.658Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (39, '54b33e98-23c3-4fe4-a664-7a688a613730', 4, 'rt8l6U87kqA5bii0UvDIBvha3EF2pBwA', TRUE, '10.82.9.121', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T16:32:40.423Z', '2025-10-22T16:32:40.423Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (40, '54b33e98-23c3-4fe4-a664-7a688a613730', 4, 'WhbcIgxiHZr6GIRHwh291ae5l0QYWV5W', TRUE, '10.82.11.144', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T16:52:52.973Z', '2025-10-22T16:52:52.973Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (41, '54b33e98-23c3-4fe4-a664-7a688a613730', 4, 'H0XDzXqSKN1ucmTOwoQ5OiEgs_nAl1Y1', TRUE, '10.82.11.144', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T17:02:56.405Z', '2025-10-22T17:02:56.405Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (42, '24aadd3e-4821-4c16-bb9d-7cd6788994e7', 3, 'QVXGfreMcfuh799r59c97u63KWkZu-Uv', TRUE, '10.82.4.22', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T17:04:35.124Z', '2025-10-22T17:04:35.124Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (43, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'dofKkslrcEYc1OKEinX5hUDF5oRb4MqQ', TRUE, '10.82.6.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T17:04:36.912Z', '2025-10-22T17:04:36.912Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (44, '54b33e98-23c3-4fe4-a664-7a688a613730', 4, 'HxfxfEcYD_Yi9TCmNFSluFeRZJottXW3', TRUE, '10.82.4.22', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T17:38:15.961Z', '2025-10-22T17:38:15.961Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (45, '54b33e98-23c3-4fe4-a664-7a688a613730', 4, 'JP-5b5sVUiAbpGPjB8kq18sR2Gpf8AcL', TRUE, '10.82.4.22', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T17:47:28.386Z', '2025-10-22T17:47:28.386Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (46, '54b33e98-23c3-4fe4-a664-7a688a613730', 4, 'bdFIKgrwjLyWiJwqvMg06ZC05GYI9qgx', TRUE, '10.82.10.160', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T17:55:38.987Z', '2025-10-22T17:55:38.987Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (47, 'q4cryh0182l4uxz', 5, 'UZ2h9Uc6cqwjLQVl3ndqodAQuO20Ld4E', TRUE, '10.82.6.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T18:19:44.142Z', '2025-10-22T18:19:44.142Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (48, 'q4cryh0182l4uxz', 5, 'XKdIYaRod89jWcDQTxB1eCE9kmbAYitx', TRUE, '10.82.3.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T18:23:36.361Z', '2025-10-22T18:23:36.361Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (49, 'q4cryh0182l4uxz', 5, '8UEah62-MrHXvk6mFRwnL-_-4fMk5yzs', TRUE, '10.82.6.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T18:26:49.807Z', '2025-10-22T18:26:49.807Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (50, 'q4cryh0182l4uxz', 5, 'TZA8tCjX1YLKFqbN9hllfH_XommziC8o', TRUE, '10.82.9.121', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T18:30:49.940Z', '2025-10-22T18:30:49.940Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (51, 'q4cryh0182l4uxz', 5, 'KwFRdswcXcpDV04Nsk79qvv5eh_V59wa', TRUE, '10.82.10.165', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T18:42:21.975Z', '2025-10-22T18:42:21.975Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (52, 'q4cryh0182l4uxz', 5, 'XU32ms8oyTKBfQNevLQNGC8YsFj1SMwp', TRUE, '10.82.10.165', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T18:50:14.572Z', '2025-10-22T18:50:14.572Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (53, 'q4cryh0182l4uxz', 5, '878gkryZG9_pCWnUvKcJmicAqa2CNR52', TRUE, '10.82.9.121', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T18:54:49.857Z', '2025-10-22T18:54:49.857Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (54, 'q4cryh0182l4uxz', 5, '2kmpLWDgiaJ-FQIYAzwIhwb764TVfkJc', TRUE, '10.82.6.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T19:00:13.039Z', '2025-10-22T19:00:13.039Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (55, 'q4cryh0182l4uxz', 5, 'bH6Tlh2VKFp5tLV9W5or-CbTmaKxTI9q', TRUE, '10.82.4.22', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T19:04:23.668Z', '2025-10-22T19:04:23.668Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (56, 'q4cryh0182l4uxz', 5, 'wLnr6LNbwKzyKv_yTWuLc38KZmu2xqEZ', TRUE, '10.82.5.119', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T19:11:20.393Z', '2025-10-22T19:11:20.393Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (57, 'admin_1761023031290', NULL, 'vCqZLivgg0E9w1WIfilG2XnAwCS047hy', TRUE, '10.82.3.41', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T19:18:09.377Z', '2025-10-22T19:18:09.377Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (58, 'q4cryh0182l4uxz', 5, '7sQbrfeuSwWWN_Zyu2sHpHuX7j7nx_Cq', TRUE, '10.82.5.119', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T19:46:29.106Z', '2025-10-22T19:46:29.106Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (59, '9jx56q9of3z3so7', NULL, 'iMg02TEbEiRR6TBstw1RvwSfmA-hC8FF', TRUE, '10.82.6.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T19:47:35.705Z', '2025-10-22T19:47:35.705Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (60, 'admin_1761023031290', NULL, '0io3mVPxCVejky_bfomWKPxlqaSjeVdD', TRUE, '10.82.11.144', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T19:49:19.505Z', '2025-10-22T19:49:19.505Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (61, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'WJVepQsfqsbfmd6w2xY9hMsYCWCoeKRu', TRUE, '10.82.6.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T19:53:37.221Z', '2025-10-22T19:53:37.221Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (62, '9jx56q9of3z3so7', NULL, 'f-pYE1st5_0QoFlJPSxpQg1HlDIGHbXn', TRUE, '10.82.6.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T19:58:22.468Z', '2025-10-22T19:58:22.468Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (63, 'de5c95de-decd-46b9-8c4f-99518664a325', 6, 'kzZo6R2grQqZBvRJgiYx5KDAqXNSBTgp', TRUE, '10.82.5.119', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T20:29:43.610Z', '2025-10-22T20:29:43.610Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (64, '9jx56q9of3z3so7', NULL, '27cVQe2xc14u5o6XSth3La48QaTIzW2Y', TRUE, '10.82.9.121', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T20:51:14.290Z', '2025-10-22T20:51:14.290Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (65, 'admin_1761023031290', NULL, 'Huo71jt_scPXAU_TfChKrfGW5x1TfX7s', TRUE, '10.82.9.121', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T22:25:56.208Z', '2025-10-22T22:25:56.208Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (66, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'yt0AzqWb6t68rb0U4eMHwzXAr0MT4J4h', TRUE, '10.82.11.144', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T22:29:39.723Z', '2025-10-22T22:29:39.723Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (71, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'vcCqkYryBAjWBF2vkZY4xy5KvWl2WZum', TRUE, '10.82.9.121', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T23:10:24.950Z', '2025-10-22T23:10:24.950Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (73, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'bnweL8zFsGB_MDWDNBiuIND_FvxKeuLr', TRUE, '10.82.11.144', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T23:29:34.382Z', '2025-10-22T23:29:34.382Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (74, 'admin_1761023031290', NULL, 'M91PgLwz1AVZpVYG0GxYbksAkpierhUi', TRUE, '10.82.5.119', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T23:37:02.473Z', '2025-10-22T23:37:02.473Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (75, 'admin_1761023031290', NULL, '7paTMrVphkAM4mXd1pKRN3UDLVrH1yGK', TRUE, '10.82.5.119', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-22T23:38:49.026Z', '2025-10-22T23:38:49.026Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (77, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, '7oAunfzPJxE3TuJfTF4zTNM1NrLOB29i', TRUE, '10.82.6.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-23T00:02:17.504Z', '2025-10-23T00:02:17.504Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (78, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, '6IQaIQDTbHCghBwZnlMW3KoGLGIsRVdv', TRUE, '10.82.3.48', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-24T16:16:25.766Z', '2025-10-24T16:16:25.766Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (67, 's7dbfr1bi9ib2qn', NULL, 'po7mKbClL9Folmwu2-Ofjf0G7Vex7Xuv', FALSE, '10.82.6.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-24T16:31:38.997Z', '2025-10-22T22:44:23.514Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (68, 's7dbfr1bi9ib2qn', NULL, '5B9sDTJrHLJBZBk0pHXRSLh4sk98ugtE', FALSE, '10.82.6.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-24T16:31:38.997Z', '2025-10-22T22:47:44.234Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (69, 's7dbfr1bi9ib2qn', NULL, '_oM2C6G09S-Em3ru5pSZhpQVPs4hY_eF', FALSE, '10.82.9.121', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-24T16:31:38.997Z', '2025-10-22T22:51:14.716Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (70, 's7dbfr1bi9ib2qn', NULL, 'Xi2QJG-dBr4_R_DU0KWv2WfSrFOQhxQr', FALSE, '10.82.3.48', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-24T16:31:38.997Z', '2025-10-22T23:08:10.171Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (72, 's7dbfr1bi9ib2qn', NULL, 'TGjB748FuJ8xeACiuFMAqNET4xNcGIDR', FALSE, '10.82.3.48', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-24T16:31:38.997Z', '2025-10-22T23:28:55.660Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (76, 's7dbfr1bi9ib2qn', NULL, 'kfMCogwT3GuJSZcZFET8p7Nte1Yu38CB', FALSE, '10.82.9.121', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-24T16:31:38.997Z', '2025-10-22T23:52:15.286Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (79, 'izbb770i17l44pj', NULL, 'Bj0rA994i4IO2U5_N21n4FpopiFV_lFw', TRUE, '10.82.5.119', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-24T16:31:42.571Z', '2025-10-24T16:31:42.571Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (80, 's7dbfr1bi9ib2qn', NULL, 'W49_BYi7oaO3JVWJmU9laHbnF3yjvuUC', TRUE, '10.82.8.140', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-24T16:32:49.401Z', '2025-10-24T16:32:49.401Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (81, 'admin_1761023031290', NULL, 'v7K9NEd3D5tWoMlUNpytsRuia4oKLu3n', TRUE, '10.82.5.119', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-24T16:35:17.623Z', '2025-10-24T16:35:17.623Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (82, '0fev12eo0oe2ovw', NULL, '0oe-AJ-N-nJG-TzRtCZWZIuUNqGT_W1g', TRUE, '10.82.2.99', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-24T17:30:44.323Z', '2025-10-24T17:30:44.323Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (83, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'kCnuQmt7yPYW3bjA3318uEzSp_oeYMDz', TRUE, '10.82.6.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-24T17:34:06.946Z', '2025-10-24T17:34:06.946Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (84, 'q4cryh0182l4uxz', 5, 'ot27ocQLnR0ruWWWQEV964zNvPCXbNfP', TRUE, '10.82.0.67', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-24T17:38:10.641Z', '2025-10-24T17:38:10.641Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (85, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'OV481dqQU4bdl8TfVqVcyoe-_pFILtQ5', TRUE, '10.82.0.67', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-24T17:38:20.551Z', '2025-10-24T17:38:20.551Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (86, 's7dbfr1bi9ib2qn', NULL, 'zHdA5-GnjJx1kUvyuwXCNJhK9Lh-nyRK', TRUE, '10.82.9.121', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-24T18:01:39.848Z', '2025-10-24T18:01:39.848Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (87, '0fev12eo0oe2ovw', NULL, 'jVQSsHrzGKDO9q5FfynmXlGgGdHFKmZu', TRUE, '10.82.11.144', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-24T18:02:51.318Z', '2025-10-24T18:02:51.318Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (88, 'admin_1761023031290', NULL, 'eS2Ne7PUSlXgD82CvzWp6-YwFU2Qb2BO', TRUE, '10.82.3.48', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-24T18:04:48.867Z', '2025-10-24T18:04:48.867Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (89, 's7dbfr1bi9ib2qn', NULL, 'NM_q-ctUClnbly611bY_uqb003mKY6AY', TRUE, '10.82.5.119', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-24T18:07:08.401Z', '2025-10-24T18:07:08.401Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (90, 'qn3rqhhyooxt4c8', NULL, 'A4Lcv_WYvtLllW3MeNsOoQq0cny1IS5a', TRUE, '10.82.0.70', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-24T18:26:04.533Z', '2025-10-24T18:26:04.533Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (91, '0fev12eo0oe2ovw', NULL, 'Qn7S3oA6cDNh4tv90XfPKfCVwW0Y0C8S', TRUE, '10.82.5.119', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-24T18:27:08.049Z', '2025-10-24T18:27:08.049Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (92, 's7dbfr1bi9ib2qn', NULL, 'W6E4OkBFaVM2JXLkVjB-QooKLRhxZu78', TRUE, '10.82.9.121', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-24T18:30:02.075Z', '2025-10-24T18:30:02.075Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (93, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'rQJu6UIq_mzlSXOMkF0XY0ScTYpiOyTQ', TRUE, '10.82.10.75', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-10-31T05:07:41.947Z', '2025-10-31T05:07:41.947Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (94, 'admin_1761023031290', NULL, 'LrjS_fAnLdyOCVDvrqMq0Lc4qor33W3Q', TRUE, '10.82.5.163', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-10-31T05:08:11.990Z', '2025-10-31T05:08:11.990Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (95, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, '7pBvOW_UyIb3HK_ndZFDP-LpWRzHw65q', TRUE, '10.82.2.232', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-10-31T05:15:53.196Z', '2025-10-31T05:15:53.196Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (96, 'admin_1761023031290', NULL, 'Jurro9DTenlb1OruECG5VMRZ0MXVauaG', TRUE, '10.82.6.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-10-31T05:17:47.418Z', '2025-10-31T05:17:47.418Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (97, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'CIY6Jz9herN7bzS9ScPW-62jjpRLaRfZ', TRUE, '10.82.10.75', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-10-31T06:35:23.069Z', '2025-10-31T06:35:23.069Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (98, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'ci6K7HXfl6VNCAcYqvrLwOOuUUA1su4r', TRUE, '10.82.10.75', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-10-31T06:52:38.813Z', '2025-10-31T06:52:38.813Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (99, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'ujjVxYsI_nQIMQgN71rSv5lWhli4MaIE', TRUE, '10.82.2.232', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-10-31T06:57:06.643Z', '2025-10-31T06:57:06.643Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (100, 'admin_1761023031290', NULL, 'KhZ-VWSLwz3iZSkl4zpnMBvqFYX4Ft7G', TRUE, '10.82.5.163', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-10-31T06:59:28.797Z', '2025-10-31T06:59:28.797Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (101, 'admin_1761023031290', NULL, 'dAMgD3dHJoBxD-nKIfuJLaMZQCTZhmKf', TRUE, '10.82.7.213', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-10-31T07:31:48.693Z', '2025-10-31T07:31:48.693Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (102, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'M53_Pso-uiF0RNXt8bDr7kdg2NFXX0jj', TRUE, '10.82.2.232', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-10-31T07:32:15.513Z', '2025-10-31T07:32:15.513Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (103, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'UuMYc72dgP3pF2Iv_UeuaBa7JMrE_nRc', TRUE, '10.82.2.232', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-10-31T07:41:15.946Z', '2025-10-31T07:41:15.946Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (104, '0hcverickhqijpi', NULL, 'rD5WaTZqXonGVmMEaCxYhehFDeZ-Wh_n', TRUE, '10.82.7.213', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-10-31T07:41:53.625Z', '2025-10-31T07:41:53.625Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (105, '0hcverickhqijpi', NULL, 'H27ETYOZwKOBe7Ngu8LH9d2eaNxPa6CH', TRUE, '10.82.2.232', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-10-31T07:50:45.715Z', '2025-10-31T07:50:45.715Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (106, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'L4Qq21yMqdCBAQOLsmc7DLbiMGfgSdTk', TRUE, '10.82.7.213', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-10-31T07:52:29.107Z', '2025-10-31T07:52:29.107Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (107, 'admin_1761023031290', NULL, 'aOXoP7c6uyyWTfraOkRFyV8d2jJEqOp6', TRUE, '10.82.9.198', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-10-31T07:55:07.238Z', '2025-10-31T07:55:07.238Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (108, 'qn3rqhhyooxt4c8', NULL, 'CyWHV01KXJ2ZQaJ6mZX3qPRd-ZP0_K4N', TRUE, '10.82.0.34', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-10-31T08:06:14.844Z', '2025-10-31T08:06:14.844Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (109, 'qn3rqhhyooxt4c8', NULL, 'ckYytVwZNgxurXieUxg6EC_HAOrDrRw2', TRUE, '10.82.0.34', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-10-31T08:07:33.130Z', '2025-10-31T08:07:33.131Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (110, '0hcverickhqijpi', NULL, 'bMRWGCvzwPuTr1gjYVmSgXxMSPXAsN_O', TRUE, '10.82.5.163', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-10-31T08:17:29.952Z', '2025-10-31T08:17:29.952Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (111, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, '3Ng79S4K7DgVCiUuGWNxCrnJiWRt12h1', TRUE, '10.82.0.34', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-10-31T08:18:29.102Z', '2025-10-31T08:18:29.102Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (112, '0hcverickhqijpi', NULL, 'Z-1MZn6SKmhuDohQJP2-eYjDr3glravn', TRUE, '10.82.4.220', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-10-31T08:27:28.634Z', '2025-10-31T08:27:28.634Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (113, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'qomXR6RVcUgMnpaX21RJ3UeEezHRIAZ-', TRUE, '10.82.2.232', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-10-31T08:28:15.041Z', '2025-10-31T08:28:15.041Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (114, 'admin_1761023031290', NULL, 'QjjW23aeLHUEg_eOvflXJXLkEXHtjS9L', TRUE, '10.82.5.163', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-10-31T08:33:19.932Z', '2025-10-31T08:33:19.932Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (115, '0hcverickhqijpi', NULL, 'n2oBgKnDoFK1NcZ795F5AG4GdrmmuzjY', TRUE, '10.82.2.232', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-10-31T08:39:44.894Z', '2025-10-31T08:39:44.894Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (116, '0hcverickhqijpi', NULL, 'N8oT0QMmjc647jqbLw12x0bvP-FOYahv', TRUE, '10.82.6.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-10-31T08:41:25.260Z', '2025-10-31T08:41:25.260Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (117, 'admin_1761023031290', NULL, 'jAs0L_dxTYxykO9mP_Uj-gEa5Kr_tTET', TRUE, '10.82.10.75', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-31T08:54:22.828Z', '2025-10-31T08:54:22.828Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (118, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'hcnecwza18rTgD-OqnSn6oWTJnCnlxrS', TRUE, '10.82.10.75', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-31T08:54:39.280Z', '2025-10-31T08:54:39.280Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (119, '0hcverickhqijpi', NULL, 'INopUDyFhYJZ5dlRLlaifY0w_Q67DR33', TRUE, '10.82.2.232', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-31T09:11:19.043Z', '2025-10-31T09:11:19.043Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (120, '0hcverickhqijpi', NULL, 'ppvq7r6HGQbm2xb1Ab8g9pzrbNssOSzX', TRUE, '10.82.5.163', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-31T09:36:39.293Z', '2025-10-31T09:36:39.293Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (121, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'yTTIQ8uviUW9oYB4TVshb9o3xkjvjB3j', TRUE, '10.82.7.213', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-31T09:36:42.627Z', '2025-10-31T09:36:42.627Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (122, '9jx56q9of3z3so7', NULL, 'VK-EJYpx3f6ivgohJEoZASrz0lKEH3pq', TRUE, '10.82.6.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-31T09:45:36.751Z', '2025-10-31T09:45:36.751Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (123, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'jXlOKKV-lvDl1-L7KeIpgjsElvMhiYgn', TRUE, '10.82.5.163', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-31T10:11:41.134Z', '2025-10-31T10:11:41.134Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (124, '0hcverickhqijpi', NULL, 'EcsrZyXQ28HMUD1nqkjHwTlZ5mmd6Q7O', TRUE, '10.82.10.75', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-31T10:14:42.848Z', '2025-10-31T10:14:42.848Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (125, '9jx56q9of3z3so7', NULL, 'nTDhXNU8YOcNqDxuGOvoorrOqFg_SHBs', TRUE, '10.82.2.232', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-31T10:15:10.373Z', '2025-10-31T10:15:10.373Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (126, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'oI6OnUvxcN5AgpgWZwBv6bzZoJgRggt1', TRUE, '10.82.0.34', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-31T10:31:55.906Z', '2025-10-31T10:31:55.906Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (127, '0hcverickhqijpi', NULL, 'AIhzQkLUkdAj3fKWl6EOr9-iPx0i6W5I', TRUE, '10.82.7.213', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-31T10:32:18.814Z', '2025-10-31T10:32:18.814Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (128, '0hcverickhqijpi', NULL, 'QaxrvBvhsctyPwvO6OuFeBgaTaPNMPYy', TRUE, '10.82.3.169', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-31T10:34:44.395Z', '2025-10-31T10:34:44.395Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (129, '0hcverickhqijpi', NULL, 'UL7HvnC5Tb5mfVCT-Ag_4bDR49RHUS-Z', TRUE, '10.82.10.75', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-31T10:38:25.633Z', '2025-10-31T10:38:25.633Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (130, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, '13SiIw6y5nftEaN6pOEeYvwlQvz-G0p_', TRUE, '10.82.10.75', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-31T10:39:10.419Z', '2025-10-31T10:39:10.419Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (131, '9jx56q9of3z3so7', NULL, 'KpEfbUfkyQwh6hidx-BDRniaxQfrzlsK', TRUE, '10.82.10.75', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-31T10:40:42.071Z', '2025-10-31T10:40:42.071Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (132, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, '9dz39vn0QP8Hswz5VyF1pBEe8XuZwW8b', TRUE, '10.82.3.171', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-31T11:00:32.647Z', '2025-10-31T11:00:32.647Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (133, '9jx56q9of3z3so7', NULL, '-J3dhFfztm0tCL_hQus2fyW3ge4iftwL', TRUE, '10.82.6.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-31T11:00:51.050Z', '2025-10-31T11:00:51.050Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (134, '0hcverickhqijpi', NULL, 'oXnkBZebugBhIxwsE9Z16mA5lbRb1hef', TRUE, '10.82.5.163', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-31T11:02:14.837Z', '2025-10-31T11:02:14.837Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (135, '9jx56q9of3z3so7', NULL, 'dOP_GQj1jY7vMCADz2NzBueA-sXT6o6m', TRUE, '10.82.7.213', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-31T11:11:40.839Z', '2025-10-31T11:11:40.839Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (136, '0hcverickhqijpi', NULL, 'IE0VtTuTfu-x82-Dj6cPR8wJFIYVun9l', TRUE, '10.82.4.220', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-31T11:14:07.571Z', '2025-10-31T11:14:07.571Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (137, 'q4cryh0182l4uxz', 5, 'm094ns3TNzyDwgZpZ2YmyLhSwCLTFU4o', TRUE, '10.82.6.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-31T12:08:22.658Z', '2025-10-31T12:08:22.658Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (138, '526fdca7-303c-48b5-9676-0d0eba06d6fb', 2, 'Jd-N7M2aAO7rVn9n0IwZCuPpAeV7Bquz', TRUE, '10.82.3.172', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-31T12:10:39.298Z', '2025-10-31T12:10:39.298Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (139, 'admin_1761023031290', NULL, 'sjw_rpqpH6DT9z80r_i2XgZfc9tm-MiQ', TRUE, '10.82.10.75', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-31T12:12:46.682Z', '2025-10-31T12:12:46.682Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (140, '0hcverickhqijpi', NULL, '6c01o0s_o14cgXL9EIKdicdtoVCiFEvN', TRUE, '10.82.9.198', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-31T12:20:28.579Z', '2025-10-31T12:20:28.579Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (141, 'q4cryh0182l4uxz', 5, 'iC2m2I25nqMJEvmnjjLGfgAG0pDf8YJb', TRUE, '10.82.9.198', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-31T12:33:12.886Z', '2025-10-31T12:33:12.886Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (142, '0hcverickhqijpi', NULL, 'rmRCwBc3OPgmwN0GkgTppXjNP2cfBBnc', TRUE, '10.82.5.163', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-31T12:36:22.853Z', '2025-10-31T12:36:22.853Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (143, '0hcverickhqijpi', NULL, 'JIHohXcSk1wwCqvE69y8bnQYwKbPdetS', TRUE, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-10-31T18:51:48.645Z', '2025-10-31T18:51:48.645Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (144, '0hcverickhqijpi', NULL, '9pP-9HO_C--2Gswx91hDBIinMYT1VbuM', TRUE, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-10-31T19:13:57.450Z', '2025-10-31T19:13:57.450Z', NULL);
INSERT INTO "user_sessions" ("id", "user_id", "white_label_id", "session_token", "is_active", "ip_address", "user_agent", "last_active_at", "created_at", "expires_at") VALUES (145, '0hcverickhqijpi', NULL, '0-OGPd2gJe80WQ751aj9IZN9yVnn-TnF', TRUE, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-10-31T19:28:15.508Z', '2025-10-31T19:28:15.508Z', NULL);

-- Table: user_theme_preferences
DROP TABLE IF EXISTS "user_theme_preferences" CASCADE;
CREATE TABLE "user_theme_preferences" (
  "id" int4 NOT NULL DEFAULT nextval('user_theme_preferences_id_seq'::regclass),
  "user_id" varchar(255) NOT NULL,
  "theme_id" int4 NOT NULL,
  "is_active" bool DEFAULT true,
  "updated_at" timestamp DEFAULT now()
);

-- Table: users
DROP TABLE IF EXISTS "users" CASCADE;
CREATE TABLE "users" (
  "id" varchar(255) NOT NULL,
  "username" varchar(255) NOT NULL,
  "email" varchar(255),
  "first_name" varchar(255) NOT NULL,
  "last_name" varchar(255) NOT NULL,
  "password" varchar(255),
  "profile_image_url" varchar(255),
  "logo_image_url" varchar(255),
  "role" varchar(50) NOT NULL DEFAULT 'white_label_client'::character varying,
  "is_active" bool DEFAULT true,
  "white_label_id" int4,
  "google_id" varchar(255),
  "auth_provider" varchar(50) NOT NULL DEFAULT 'local'::character varying,
  "name" varchar(255),
  "phone" varchar(255),
  "company" varchar(255),
  "referral_code" varchar(255),
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now(),
  "affiliate_of_white_label_id" int4
);

-- Data for table: users
INSERT INTO "users" ("id", "username", "email", "first_name", "last_name", "password", "profile_image_url", "logo_image_url", "role", "is_active", "white_label_id", "google_id", "auth_provider", "name", "phone", "company", "referral_code", "created_at", "updated_at", "affiliate_of_white_label_id") VALUES ('admin_1761023059755', 'superadmin', 'admin@whitelabelpro.com', 'Supera', 'Admina', '$2b$10$ADoVET6ZBCGZ6dEAP/qFA.iCcTgjE20U.xUCErxNkZqlA.KtMTz9O', '/uploads/logo.png', NULL, 'super_admin', TRUE, NULL, NULL, 'local', NULL, '03306252925', 'Carftdiv', NULL, '2025-10-21T00:04:20.054Z', '2025-10-21T11:20:06.359Z', NULL);
INSERT INTO "users" ("id", "username", "email", "first_name", "last_name", "password", "profile_image_url", "logo_image_url", "role", "is_active", "white_label_id", "google_id", "auth_provider", "name", "phone", "company", "referral_code", "created_at", "updated_at", "affiliate_of_white_label_id") VALUES ('24aadd3e-4821-4c16-bb9d-7cd6788994e7', 'epic', 'epicgamer122455211@gmail.com', 'epic', 'gamer', '$2b$10$wp/YKYR2C69sz/FltmAu7ul9.HFd1scDvJT7SmshgFuS6Snzd9MWq', NULL, NULL, 'white_label_client', TRUE, 3, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-22T13:23:08.968Z', '2025-10-22T13:23:09.439Z', NULL);
INSERT INTO "users" ("id", "username", "email", "first_name", "last_name", "password", "profile_image_url", "logo_image_url", "role", "is_active", "white_label_id", "google_id", "auth_provider", "name", "phone", "company", "referral_code", "created_at", "updated_at", "affiliate_of_white_label_id") VALUES ('9jx56q9of3z3so7', 'epicaffiliate', 'epicgamer125524121@gmail.com', 'epic', 'gamer', '$2b$12$nZeNJavkrzwmYdvqloaqOepO9iRx6bpcv6rQOEg9V3zjhkUWTtyB2', NULL, NULL, 'super_admin_affiliate', TRUE, NULL, NULL, 'local', NULL, NULL, NULL, 'epic', '2025-10-22T19:15:57.128Z', '2025-10-22T19:15:57.128Z', NULL);
INSERT INTO "users" ("id", "username", "email", "first_name", "last_name", "password", "profile_image_url", "logo_image_url", "role", "is_active", "white_label_id", "google_id", "auth_provider", "name", "phone", "company", "referral_code", "created_at", "updated_at", "affiliate_of_white_label_id") VALUES ('qn3rqhhyooxt4c8', 'epicgamer', 'epicgamer125521@gmail.com', 'Epic', 'Gamer', '$2b$12$UxXZYcjlMrRbEatFWl/ZguQnEafXElvlUZePo4WBjy.vqL5M45WZ.', NULL, NULL, 'super_admin_affiliate', TRUE, NULL, NULL, 'local', NULL, NULL, NULL, 'epic1', '2025-10-22T20:05:05.509Z', '2025-10-22T20:05:05.509Z', NULL);
INSERT INTO "users" ("id", "username", "email", "first_name", "last_name", "password", "profile_image_url", "logo_image_url", "role", "is_active", "white_label_id", "google_id", "auth_provider", "name", "phone", "company", "referral_code", "created_at", "updated_at", "affiliate_of_white_label_id") VALUES ('a4oucaebdlwa6y1', 'munibahsadmeed', 'fsdsf@gmail.com', 'Munib', 'Affiliate', '$2b$12$S0tQrYhnhh46fQbCnC.FsugxkkkL702tCGGsUMF/M0A0PXND50aES', NULL, NULL, 'white_label_affiliate', TRUE, 2, NULL, 'local', NULL, NULL, NULL, 'munibadad', '2025-10-31T05:31:13.989Z', '2025-10-31T05:31:45.415Z', NULL);
INSERT INTO "users" ("id", "username", "email", "first_name", "last_name", "password", "profile_image_url", "logo_image_url", "role", "is_active", "white_label_id", "google_id", "auth_provider", "name", "phone", "company", "referral_code", "created_at", "updated_at", "affiliate_of_white_label_id") VALUES ('de5c95de-decd-46b9-8c4f-99518664a325', 'kaifgamer76', 'kaifgaklmer762@gmail.com', 'Munib', 'Ahmed', '$2b$10$n7Fh5.LFH6iC4gSlhdMn..dS21l9l4Qn3rrdVICDv2ydreJxF0u7y', NULL, NULL, 'white_label_client', TRUE, 6, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-22T20:11:03.709Z', '2025-10-22T20:11:04.155Z', NULL);
INSERT INTO "users" ("id", "username", "email", "first_name", "last_name", "password", "profile_image_url", "logo_image_url", "role", "is_active", "white_label_id", "google_id", "auth_provider", "name", "phone", "company", "referral_code", "created_at", "updated_at", "affiliate_of_white_label_id") VALUES ('ujklk6hjzxnni74', 'kaifgamer762354', 'kaifgamer762@gmail.com', 'kaif', 'gamer', '$2b$12$L0PBRizx.eMh78PF4K2pqul5CXqY8iqQu3YzZPfooYJMfOlRSIzHu', NULL, NULL, 'end_user', TRUE, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-22T20:35:38.890Z', '2025-10-22T20:35:38.890Z', NULL);
INSERT INTO "users" ("id", "username", "email", "first_name", "last_name", "password", "profile_image_url", "logo_image_url", "role", "is_active", "white_label_id", "google_id", "auth_provider", "name", "phone", "company", "referral_code", "created_at", "updated_at", "affiliate_of_white_label_id") VALUES ('ku4dt1cvfl45ame', 'munibahmedeffiliate', 'yatej68005@elygifts.com', 'Munib', 'Ahmed', '$2b$12$uXyHBaWxETPPwKkpqyl/luiZWTgqKk8FNKKS3mcg5PuyNDZot3VIu', NULL, NULL, 'white_label_affiliate', TRUE, 2, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-22T21:14:54.936Z', '2025-10-22T21:14:54.936Z', NULL);
INSERT INTO "users" ("id", "username", "email", "first_name", "last_name", "password", "profile_image_url", "logo_image_url", "role", "is_active", "white_label_id", "google_id", "auth_provider", "name", "phone", "company", "referral_code", "created_at", "updated_at", "affiliate_of_white_label_id") VALUES ('54b33e98-23c3-4fe4-a664-7a688a613730', 'kaif', 'kaifgamer7s62@gmail.com', 'kaif', 'gamerz', '$2b$10$CbXO4bNN5vM89W023CZu0Ol.Aw3iMdG6WYOljM3khjIdXyS9WpY8C', '/api/files/profile_1761158119013-907745722.jpg', NULL, 'End-user', TRUE, 4, NULL, 'local', NULL, '033323232323', NULL, NULL, '2025-10-22T13:30:44.943Z', '2025-10-22T13:35:28.265Z', NULL);
INSERT INTO "users" ("id", "username", "email", "first_name", "last_name", "password", "profile_image_url", "logo_image_url", "role", "is_active", "white_label_id", "google_id", "auth_provider", "name", "phone", "company", "referral_code", "created_at", "updated_at", "affiliate_of_white_label_id") VALUES ('0misgb47mbcc0ek', 'kaifii', 'kaifgameasdr762@gmail.com', 'kaif', 'gamer', '$2b$12$wq7qH9q11.7ko5fucXEvs.Cfv58XWF4y6hMVkwtBIyCJtsqxF45oK', NULL, NULL, 'super_admin_affiliate', TRUE, NULL, NULL, 'local', NULL, NULL, NULL, 'kaif', '2025-10-22T18:09:44.784Z', '2025-10-22T18:09:44.784Z', NULL);
INSERT INTO "users" ("id", "username", "email", "first_name", "last_name", "password", "profile_image_url", "logo_image_url", "role", "is_active", "white_label_id", "google_id", "auth_provider", "name", "phone", "company", "referral_code", "created_at", "updated_at", "affiliate_of_white_label_id") VALUES ('zuw3mikecamfuym', 'hg', 'munibahmeefsdd@gmail.com', 'Munib', 'Affiliate', '$2b$12$PDeibIQcNLnAwuI9x/bjduoZRhBvKjKPPHOBlC63japCJSSUufvSm', NULL, NULL, 'white_label_affiliate', TRUE, 2, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-31T05:44:39.729Z', '2025-10-31T05:44:39.729Z', NULL);
INSERT INTO "users" ("id", "username", "email", "first_name", "last_name", "password", "profile_image_url", "logo_image_url", "role", "is_active", "white_label_id", "google_id", "auth_provider", "name", "phone", "company", "referral_code", "created_at", "updated_at", "affiliate_of_white_label_id") VALUES ('0iaesg6mdixsene', 'munibahmeedsad', 'munibahasdmeed@gmail.com', 'Munib', 'Affiliate', '$2b$12$XxuX3RnRKJjmL4e/fWdu8uoT29ut41k5.va.yxrA13kabmbmnh9cq', NULL, NULL, 'white_label_affiliate', TRUE, 2, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-31T05:46:30.557Z', '2025-10-31T05:46:30.557Z', NULL);
INSERT INTO "users" ("id", "username", "email", "first_name", "last_name", "password", "profile_image_url", "logo_image_url", "role", "is_active", "white_label_id", "google_id", "auth_provider", "name", "phone", "company", "referral_code", "created_at", "updated_at", "affiliate_of_white_label_id") VALUES ('526fdca7-303c-48b5-9676-0d0eba06d6fb', 'munib', 'munibahmed1255211@gmail.com', 'Munib', 'Ahmed', '$2b$12$2OjUEvyMKr3L.LPUDX/EDe6a4S60w9t4QuTRb55v4KIKz9hwvBMli', '/api/files/profile_1761086308033-221210403.jpg', '/uploads/brand-logos/brand_logo_1761088897383-938020604.png', 'white_label_client', TRUE, 2, NULL, 'local', NULL, '03306252925', 'CraftDiv', NULL, '2025-10-21T17:37:50.788Z', '2025-10-22T11:42:05.737Z', NULL);
INSERT INTO "users" ("id", "username", "email", "first_name", "last_name", "password", "profile_image_url", "logo_image_url", "role", "is_active", "white_label_id", "google_id", "auth_provider", "name", "phone", "company", "referral_code", "created_at", "updated_at", "affiliate_of_white_label_id") VALUES ('admin_1761023031290', 'superadmin', 'rick@5starprocessing.com', 'Super', 'Admin', '$2b$12$cIWFtRkBh34NQ4TzByPCoONDo..TKyGUfg1DU9/NM6rvEFB9eTP2a', '/uploads/logo.png', '/uploads/logo.png', 'super_admin', TRUE, NULL, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-21T00:03:51.588Z', '2025-10-22T23:37:39.833Z', NULL);
INSERT INTO "users" ("id", "username", "email", "first_name", "last_name", "password", "profile_image_url", "logo_image_url", "role", "is_active", "white_label_id", "google_id", "auth_provider", "name", "phone", "company", "referral_code", "created_at", "updated_at", "affiliate_of_white_label_id") VALUES ('izbb770i17l44pj', 'alibadi', 'adrwealthadvisorsllc@gmail.com', 'Ali', 'badi', '$2b$12$UmWnGeLTdWQA65i6Wwd8IOmriqf41pq3Gk7LHZwt4xq4KgPD1FI3W', NULL, NULL, 'super_admin_affiliate', TRUE, NULL, NULL, 'local', NULL, NULL, NULL, 'ali', '2025-10-21T18:17:41.224Z', '2025-10-21T18:17:41.224Z', NULL);
INSERT INTO "users" ("id", "username", "email", "first_name", "last_name", "password", "profile_image_url", "logo_image_url", "role", "is_active", "white_label_id", "google_id", "auth_provider", "name", "phone", "company", "referral_code", "created_at", "updated_at", "affiliate_of_white_label_id") VALUES ('0zjlohc2wnv0jwo', 'hjkjhk', 'munibajkljlkhmeed@gmail.com', 'Munib', 'Affiliate', '$2b$12$7H3PmCcpOf.sbbtpo0CLNeO8vY35sHBY.PFEcJ11wmqXJ0xExw9KW', NULL, NULL, 'white_label_affiliate', TRUE, 2, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-31T06:13:14.463Z', '2025-10-31T06:13:14.463Z', NULL);
INSERT INTO "users" ("id", "username", "email", "first_name", "last_name", "password", "profile_image_url", "logo_image_url", "role", "is_active", "white_label_id", "google_id", "auth_provider", "name", "phone", "company", "referral_code", "created_at", "updated_at", "affiliate_of_white_label_id") VALUES ('s7dbfr1bi9ib2qn', 'munibaffiliate', 'adrwealthadvisorsllc@gmail.com', 'Hammad', 'Saqib', '$2b$12$mxVBwyelWSlZAKiL7djTnOhZNDAiYd.7ochegYE1SitTuj/OjddLe', NULL, NULL, 'End-user', TRUE, 2, NULL, 'local', NULL, NULL, NULL, 'affiliate', '2025-10-22T22:30:58.637Z', '2025-10-22T23:20:27.948Z', NULL);
INSERT INTO "users" ("id", "username", "email", "first_name", "last_name", "password", "profile_image_url", "logo_image_url", "role", "is_active", "white_label_id", "google_id", "auth_provider", "name", "phone", "company", "referral_code", "created_at", "updated_at", "affiliate_of_white_label_id") VALUES ('0fev12eo0oe2ovw', 'testtest', 'wadore3449@keevle.com', 'test', 'test', '$2b$12$804mLfQZTD4ky7c2.qNTpujHUp7uekVvdkLl75Wo94DwIVXvrQckG', NULL, NULL, 'white_label_affiliate', TRUE, 2, NULL, 'local', NULL, NULL, NULL, 'tes', '2025-10-24T16:44:14.913Z', '2025-10-24T16:44:36.862Z', NULL);
INSERT INTO "users" ("id", "username", "email", "first_name", "last_name", "password", "profile_image_url", "logo_image_url", "role", "is_active", "white_label_id", "google_id", "auth_provider", "name", "phone", "company", "referral_code", "created_at", "updated_at", "affiliate_of_white_label_id") VALUES ('2928066f-1693-4af4-9c02-6728a132130d', 'test125', 'nipef11391@ametitas.com', 'kaif', 'gamer', '$2b$10$zUwaFrz5EGOWdrVqwEiLG.Km8X2awy5CxPH6GM4uBRj9EZs/rc/mS', NULL, NULL, 'white_label_client', TRUE, 8, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-24T18:01:12.917Z', '2025-10-24T18:01:13.309Z', NULL);
INSERT INTO "users" ("id", "username", "email", "first_name", "last_name", "password", "profile_image_url", "logo_image_url", "role", "is_active", "white_label_id", "google_id", "auth_provider", "name", "phone", "company", "referral_code", "created_at", "updated_at", "affiliate_of_white_label_id") VALUES ('ow1cffxdntt3tw0', 'fdgfdg', 'dfgfd@gmail.com', 'Munib', 'Affiliate', '$2b$12$UN.WN0YUuuVADqfI6sGb3.2xQ2Ul/Rhh3FiZekECZ3Su1Hj/BkAPS', NULL, NULL, 'white_label_affiliate', TRUE, 2, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-31T06:21:35.454Z', '2025-10-31T06:21:35.454Z', NULL);
INSERT INTO "users" ("id", "username", "email", "first_name", "last_name", "password", "profile_image_url", "logo_image_url", "role", "is_active", "white_label_id", "google_id", "auth_provider", "name", "phone", "company", "referral_code", "created_at", "updated_at", "affiliate_of_white_label_id") VALUES ('q4cryh0182l4uxz', 'kaifgamer762', 'kaifgamekjr762@gmail.com', 'kaif', 'gamer', '$2b$12$eeETSHFbZolCS6qjhEHXpuyXGDR8tsLWJNvb3ui/WicIkjevTb1d.', NULL, NULL, 'end_user', TRUE, 2, NULL, 'local', NULL, NULL, NULL, NULL, '2025-10-22T18:18:37.467Z', '2025-10-22T18:18:37.467Z', NULL);
INSERT INTO "users" ("id", "username", "email", "first_name", "last_name", "password", "profile_image_url", "logo_image_url", "role", "is_active", "white_label_id", "google_id", "auth_provider", "name", "phone", "company", "referral_code", "created_at", "updated_at", "affiliate_of_white_label_id") VALUES ('0hcverickhqijpi', 'munibahmeed', 'munibahmeed@gmail.com', 'Munib', 'Affiliate', '$2b$12$fGBwwLx9bUA9CgJ8VXjq0.TkfkRu2SCF9Q6lfTQznjcRLkmU8krM6', NULL, NULL, 'white_label_affiliate', TRUE, 2, NULL, 'local', NULL, NULL, NULL, 'ahmeedd', '2025-10-31T06:34:13.349Z', '2025-10-31T12:27:37.177Z', 2);

-- Table: white_labels
DROP TABLE IF EXISTS "white_labels" CASCADE;
CREATE TABLE "white_labels" (
  "id" int4 NOT NULL DEFAULT nextval('white_labels_id_seq'::regclass),
  "user_id" varchar(255) NOT NULL,
  "plan_id" int4,
  "business_name" varchar(255) NOT NULL,
  "domain" varchar(255),
  "domain_path" varchar(255),
  "logo_url" varchar(255),
  "primary_color" varchar(255) DEFAULT '#2563EB'::character varying,
  "secondary_color" varchar(255) DEFAULT '#64748B'::character varying,
  "default_landing_page_id" int4,
  "landing_page_code" varchar(50),
  "is_active" bool DEFAULT true,
  "invited_by" varchar(255),
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Data for table: white_labels
INSERT INTO "white_labels" ("id", "user_id", "plan_id", "business_name", "domain", "domain_path", "logo_url", "primary_color", "secondary_color", "default_landing_page_id", "landing_page_code", "is_active", "invited_by", "created_at", "updated_at") VALUES (4, '54b33e98-23c3-4fe4-a664-7a688a613730', NULL, 'kaifgamer', NULL, 'kaif', '', '#667eea', '#764ba2', NULL, NULL, TRUE, NULL, '2025-10-22T13:30:45.237Z', '2025-10-22T13:30:45.237Z');
INSERT INTO "white_labels" ("id", "user_id", "plan_id", "business_name", "domain", "domain_path", "logo_url", "primary_color", "secondary_color", "default_landing_page_id", "landing_page_code", "is_active", "invited_by", "created_at", "updated_at") VALUES (5, 'q4cryh0182l4uxz', NULL, 'Kaif gamer Business', NULL, 'kaifgamer762-affiliate', NULL, '#2563EB', '#64748B', NULL, NULL, TRUE, NULL, '2025-10-22T18:18:37.653Z', '2025-10-22T18:18:37.653Z');
INSERT INTO "white_labels" ("id", "user_id", "plan_id", "business_name", "domain", "domain_path", "logo_url", "primary_color", "secondary_color", "default_landing_page_id", "landing_page_code", "is_active", "invited_by", "created_at", "updated_at") VALUES (3, '24aadd3e-4821-4c16-bb9d-7cd6788994e7', NULL, 'epicgaming', NULL, 'epic', '', '#667eea', '#764ba2', 3, 'NULL', TRUE, NULL, '2025-10-22T13:23:09.309Z', '2025-10-22T13:23:09.309Z');
INSERT INTO "white_labels" ("id", "user_id", "plan_id", "business_name", "domain", "domain_path", "logo_url", "primary_color", "secondary_color", "default_landing_page_id", "landing_page_code", "is_active", "invited_by", "created_at", "updated_at") VALUES (7, 'ujklk6hjzxnni74', NULL, 'Kaif gamer Business', NULL, 'kaifgamer762354-affiliate', NULL, '#2563EB', '#64748B', NULL, NULL, TRUE, NULL, '2025-10-22T20:35:39.069Z', '2025-10-22T20:35:39.069Z');
INSERT INTO "white_labels" ("id", "user_id", "plan_id", "business_name", "domain", "domain_path", "logo_url", "primary_color", "secondary_color", "default_landing_page_id", "landing_page_code", "is_active", "invited_by", "created_at", "updated_at") VALUES (6, 'de5c95de-decd-46b9-8c4f-99518664a325', NULL, 'CraftDiv', NULL, 'shoot', '', '#667eea', '#764ba2', 5, NULL, TRUE, NULL, '2025-10-22T20:11:04.010Z', '2025-10-22T20:36:31.010Z');
INSERT INTO "white_labels" ("id", "user_id", "plan_id", "business_name", "domain", "domain_path", "logo_url", "primary_color", "secondary_color", "default_landing_page_id", "landing_page_code", "is_active", "invited_by", "created_at", "updated_at") VALUES (8, '2928066f-1693-4af4-9c02-6728a132130d', NULL, 'kaifgamer', NULL, 'kaiff', '', '#667eea', '#764ba2', NULL, NULL, TRUE, NULL, '2025-10-24T18:01:13.215Z', '2025-10-24T18:01:13.215Z');
INSERT INTO "white_labels" ("id", "user_id", "plan_id", "business_name", "domain", "domain_path", "logo_url", "primary_color", "secondary_color", "default_landing_page_id", "landing_page_code", "is_active", "invited_by", "created_at", "updated_at") VALUES (2, '526fdca7-303c-48b5-9676-0d0eba06d6fb', NULL, 'CraftDiv', NULL, 'munib', '/uploads/brand-logos/brand_logo_1761088897383-938020604.png', '#667eea', '#764ba2', 2, 'NULL', TRUE, NULL, '2025-10-21T17:37:51.094Z', '2025-10-24T18:21:47.012Z');

-- Sequence: activities_id_seq
SELECT setval('"activities_id_seq"', 71, true);

-- Sequence: affiliate_payments_id_seq
SELECT setval('"affiliate_payments_id_seq"', 13, true);

-- Sequence: affiliate_plan_visibility_id_seq
SELECT setval('"affiliate_plan_visibility_id_seq"', 2, true);

-- Sequence: affiliates_id_seq
SELECT setval('"affiliates_id_seq"', 1, true);

-- Sequence: ai_content_optimizations_id_seq
SELECT setval('"ai_content_optimizations_id_seq"', 1, true);

-- Sequence: ai_generated_content_id_seq
SELECT setval('"ai_generated_content_id_seq"', 1, true);

-- Sequence: ai_recommendations_id_seq
SELECT setval('"ai_recommendations_id_seq"', 1, true);

-- Sequence: analytics_events_id_seq
SELECT setval('"analytics_events_id_seq"', 1, true);

-- Sequence: analytics_metrics_id_seq
SELECT setval('"analytics_metrics_id_seq"', 1, true);

-- Sequence: announcement_analytics_id_seq
SELECT setval('"announcement_analytics_id_seq"', 145, true);

-- Sequence: announcement_comments_id_seq
SELECT setval('"announcement_comments_id_seq"', 11, true);

-- Sequence: announcement_likes_id_seq
SELECT setval('"announcement_likes_id_seq"', 57, true);

-- Sequence: announcement_shares_id_seq
SELECT setval('"announcement_shares_id_seq"', 1, true);

-- Sequence: announcements_id_seq
SELECT setval('"announcements_id_seq"', 6, true);

-- Sequence: categories_id_seq
SELECT setval('"categories_id_seq"', 6, true);

-- Sequence: client_template_customizations_id_seq
SELECT setval('"client_template_customizations_id_seq"', 1, true);

-- Sequence: commissions_id_seq
SELECT setval('"commissions_id_seq"', 1, true);

-- Sequence: custom_domains_id_seq
SELECT setval('"custom_domains_id_seq"', 1, true);

-- Sequence: domain_user_sessions_id_seq
SELECT setval('"domain_user_sessions_id_seq"', 4, true);

-- Sequence: end_user_activities_id_seq
SELECT setval('"end_user_activities_id_seq"', 55, true);

-- Sequence: integration_logs_id_seq
SELECT setval('"integration_logs_id_seq"', 1, true);

-- Sequence: integrations_id_seq
SELECT setval('"integrations_id_seq"', 1, true);

-- Sequence: landing_pages_id_seq
SELECT setval('"landing_pages_id_seq"', 6, true);

-- Sequence: link_meta_images_id_seq
SELECT setval('"link_meta_images_id_seq"', 1, true);

-- Sequence: nmi_credentials_id_seq
SELECT setval('"nmi_credentials_id_seq"', 12, true);

-- Sequence: password_reset_tokens_id_seq
SELECT setval('"password_reset_tokens_id_seq"', 9, true);

-- Sequence: payment_accounts_id_seq
SELECT setval('"payment_accounts_id_seq"', 4, true);

-- Sequence: plan_categories_id_seq
SELECT setval('"plan_categories_id_seq"', 1, true);

-- Sequence: plan_products_id_seq
SELECT setval('"plan_products_id_seq"', 1, true);

-- Sequence: plans_id_seq
SELECT setval('"plans_id_seq"', 19, true);

-- Sequence: platform_settings_id_seq
SELECT setval('"platform_settings_id_seq"', 1, true);

-- Sequence: products_id_seq
SELECT setval('"products_id_seq"', 6, true);

-- Sequence: purchase_history_id_seq
SELECT setval('"purchase_history_id_seq"', 16, true);

-- Sequence: referral_clicks_id_seq
SELECT setval('"referral_clicks_id_seq"', 1, true);

-- Sequence: referral_commissions_id_seq
SELECT setval('"referral_commissions_id_seq"', 4, true);

-- Sequence: referral_links_id_seq
SELECT setval('"referral_links_id_seq"', 1, true);

-- Sequence: referral_signups_id_seq
SELECT setval('"referral_signups_id_seq"', 1, true);

-- Sequence: referral_tracking_id_seq
SELECT setval('"referral_tracking_id_seq"', 1, true);

-- Sequence: subscriptions_id_seq
SELECT setval('"subscriptions_id_seq"', 20, true);

-- Sequence: templates_id_seq
SELECT setval('"templates_id_seq"', 1, true);

-- Sequence: themes_id_seq
SELECT setval('"themes_id_seq"', 1, true);

-- Sequence: user_preferences_id_seq
SELECT setval('"user_preferences_id_seq"', 22, true);

-- Sequence: user_sessions_id_seq
SELECT setval('"user_sessions_id_seq"', 145, true);

-- Sequence: user_theme_preferences_id_seq
SELECT setval('"user_theme_preferences_id_seq"', 1, true);

-- Sequence: white_labels_id_seq
SELECT setval('"white_labels_id_seq"', 8, true);

