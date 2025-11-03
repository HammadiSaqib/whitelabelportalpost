// Environment variable loading - must be imported first
import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: envFile });

// Export for debugging purposes
export const loadedEnvFile = envFile;