import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export default {
  databaseUrl: process.env.DATABASE_URL,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleRedirectUri: process.env.GOOGLE_REDIRECT_URI,
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS
};