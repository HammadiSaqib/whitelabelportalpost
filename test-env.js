// Test environment loading
import dotenv from 'dotenv';

console.log('NODE_ENV before dotenv:', process.env.NODE_ENV);

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
console.log('Loading env file:', envFile);

dotenv.config({ path: envFile });

console.log('NODE_ENV after dotenv:', process.env.NODE_ENV);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
console.log('SESSION_SECRET:', process.env.SESSION_SECRET ? 'SET' : 'NOT SET');