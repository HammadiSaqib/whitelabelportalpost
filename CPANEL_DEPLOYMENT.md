# 🚀 cPanel Deployment - Quick Reference

## Prerequisites
- cPanel account with Node.js support
- MySQL database
- Domain or subdomain configured
- SSH/Terminal access (recommended)

## 📦 Files Created for Deployment

| File | Purpose |
|------|---------|
| `.env.production` | Production environment variables template |
| `.cpanel.yml` | Automated deployment configuration |
| `.htaccess` | Apache rewrite rules and security |
| `app.js` | Passenger/cPanel startup file |
| `deploy.sh` | Full deployment automation script |
| `quick-deploy.sh` | Quick setup script for server |
| `DEPLOYMENT_GUIDE.md` | Complete step-by-step guide |

## ⚡ Quick Start (3 Minutes)

### On Your Local Machine:
```bash
# 1. Build the project
npm run build

# 2. Create deployment package (exclude node_modules)
git archive -o deploy.zip HEAD
```

### On cPanel Server:

#### Option A: Via Terminal/SSH
```bash
# 1. Create application directory (NOT in public_html)
mkdir -p ~/whitelabelportal

# 2. Upload and extract files
cd ~/whitelabelportal
unzip deploy.zip

# 2. Run quick deployment
chmod +x quick-deploy.sh
./quick-deploy.sh

# 3. Configure environment
nano .env  # Update with your credentials
```

#### Option B: Via cPanel File Manager
1. Upload `deploy.zip` via File Manager
2. Extract it
3. Go to Terminal and run:
```bash
cd /home/username/whitelabelportal
chmod +x quick-deploy.sh && ./quick-deploy.sh
```

### Configure Node.js App in cPanel:
1. **Software** → **Setup Node.js App** → **Create Application**
2. Settings:
   - Node version: 18.x or higher
   - Application mode: **Development**
   - App root: `whitelabelportal` (NOT public_html)
   - App URL: your domain
   - Startup file: `dist/index.js`
3. Add environment variables (see `.env.production`)
4. Click **Create** then **Start App**

## 🗄️ Database Setup

### 1. Create MySQL Database in cPanel:
- Database name: `username_whitelabel`
- User: `username_wluser`
- Grant ALL PRIVILEGES

### 2. Update .env:
```bash
DATABASE_URL=mysql://whitelabelportal_admin:whitelabelportal_admin@localhost:3306/whitelabelportal_main
```

### 3. Run Migrations:
```bash
npm run db:push
```

## 🔐 Google OAuth Setup

### Update Redirect URI:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. **APIs & Services** → **Credentials**
3. Add: `https://yourdomain.com/api/auth/google/callback`
4. Update in `.env`: `GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback`

## ✅ Verify Deployment

### Test these URLs:
- ✅ `https://yourdomain.com/` - Frontend
- ✅ `https://yourdomain.com/api/health` - API Health
- ✅ `https://yourdomain.com/api/auth/me` - Auth Status

### Check Logs:
```bash
# Application logs
tail -f logs/app.log

# cPanel Node.js logs
# View in Setup Node.js App interface
```

## 🔧 Common Commands

```bash
# Restart application
touch tmp/restart.txt  # Passenger restart
# OR use cPanel interface

# View running processes
ps aux | grep node

# Check port usage
lsof -i :3000

# Database backup
mysqldump -u user -p dbname > backup.sql

# Update application
git pull origin main
npm install
npm run build
touch tmp/restart.txt
```

## 📚 Full Documentation

For detailed instructions, troubleshooting, and best practices:
👉 **See `DEPLOYMENT_GUIDE.md`**

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| App won't start | Check Node.js version (need 18+), verify `.env` |
| DB connection error | Verify credentials, check user privileges |
| 404 on static files | Run `npm run build`, check `.htaccess` |
| OAuth fails | Update redirect URI in Google Console |
| Port in use | Kill process: `lsof -i :3000` then `kill -9 PID` |

## 📞 Need Help?

1. Check `DEPLOYMENT_GUIDE.md` for detailed steps
2. Review cPanel error logs
3. Check Node.js application logs
4. Verify all environment variables are set

---

**Happy Deploying! 🎉**
