# 🚀 WhiteLabelPortal - cPanel Deployment Package

## 📦 What's Included

This deployment package includes everything you need to deploy WhiteLabelPortal to cPanel in development mode.

### 📚 Complete Documentation Set (4 Guides)

```
📖 DEPLOYMENT_INDEX.md          → START HERE - Navigation guide
📋 DEPLOYMENT_SUMMARY.md         → Overview & quick reference  
⚡ CPANEL_DEPLOYMENT.md          → Quick commands & fixes
📗 DEPLOYMENT_GUIDE.md           → Complete step-by-step manual
📊 DEPLOYMENT_FLOWCHART.md       → Visual process diagram
```

### ⚙️ Configuration Files (6 Files)

```
🔧 .env.production               → Environment variables template
🔧 .cpanel.yml                   → Automated cPanel deployment
🔧 .htaccess                     → Apache configuration
🔧 app.js                        → Passenger startup file
🔧 deploy.sh                     → Full deployment script
🔧 quick-deploy.sh               → Quick setup script
```

---

## 🎯 Choose Your Path

### 👨‍💻 First Time Deploying to cPanel?
**Time needed:** 1-2 hours

1. 📖 Read: [`DEPLOYMENT_INDEX.md`](./DEPLOYMENT_INDEX.md)
2. 📋 Review: [`DEPLOYMENT_SUMMARY.md`](./DEPLOYMENT_SUMMARY.md)  
3. 📊 Visualize: [`DEPLOYMENT_FLOWCHART.md`](./DEPLOYMENT_FLOWCHART.md)
4. 📗 Follow: [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md)

### 🏃 Need to Deploy Quickly?
**Time needed:** 30-45 minutes

1. ⚡ Jump to: [`CPANEL_DEPLOYMENT.md`](./CPANEL_DEPLOYMENT.md) → Quick Start (3 Minutes)
2. 🚀 Run: `quick-deploy.sh` on server
3. ✅ Test: Use checklist in [`DEPLOYMENT_SUMMARY.md`](./DEPLOYMENT_SUMMARY.md)

### 🔍 Looking for Specific Information?
**Use the index:**

👉 [`DEPLOYMENT_INDEX.md`](./DEPLOYMENT_INDEX.md) → Find Information By Topic

---

## 📊 Visual Deployment Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT PROCESS                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Phase 1: LOCAL PREPARATION                                │
│  ├─ Review files                                           │
│  ├─ Build project (npm run build)                          │
│  └─ Create deployment package                              │
│                                                             │
│  Phase 2: cPANEL SETUP                                     │
│  ├─ Create MySQL database                                  │
│  ├─ Enable Node.js application                             │
│  └─ Set environment variables                              │
│                                                             │
│  Phase 3: UPLOAD & INSTALL                                 │
│  ├─ Upload files (Git/FTP/File Manager)                    │
│  ├─ SSH to server                                          │
│  ├─ Run: ./quick-deploy.sh                                 │
│  └─ Update .env file                                       │
│                                                             │
│  Phase 4: CONFIGURATION                                    │
│  ├─ Update Google OAuth redirect URI                       │
│  ├─ Configure database connection                          │
│  └─ Run migrations (npm run db:push)                       │
│                                                             │
│  Phase 5: TESTING & LAUNCH                                 │
│  ├─ Start Node.js app in cPanel                            │
│  ├─ Test all endpoints                                     │
│  ├─ Verify functionality                                   │
│  └─ Monitor logs                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 What You Need

### Required Access:
- ✅ cPanel account with Node.js support (v18+)
- ✅ MySQL database access
- ✅ Domain/subdomain configured
- ✅ SSH/Terminal access (recommended)

### Required Credentials:
- ✅ Database: name, user, password
- ✅ Google OAuth: Client ID, Client Secret
- ✅ SendGrid: API key or email credentials
- ✅ Google AI: API keys (for AI features)

### Required Skills:
- 🟢 Basic command line usage
- 🟢 Understanding of environment variables
- 🟡 Basic Node.js knowledge (helpful)
- 🟡 Git basics (if using Git deployment)

---

## ⚡ Quick Start Commands

### On Your Local Machine:
```bash
# Build the project
npm run build

# Test locally first
npm run start:dev

# Create deployment package (if using Git)
git push origin main
```

### On cPanel Server (Terminal/SSH):
```bash
# Navigate to project directory
cd /home/username/whitelabelportal

# Run quick deployment
chmod +x quick-deploy.sh
./quick-deploy.sh

# Edit environment variables
nano .env

# Restart application
touch tmp/restart.txt
```

---

## 📋 Essential Environment Variables

Copy from `.env.production` and update:

```bash
# Database (REQUIRED)
DATABASE_URL=mysql://user:pass@localhost:3306/dbname

# Google OAuth (REQUIRED for auth)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback

# Email (REQUIRED for emails)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Server (REQUIRED)
NODE_ENV=development
PORT=3000
SESSION_SECRET=random_secret_here
```

---

## ✅ Testing Checklist

After deployment, verify:

- [ ] `https://yourdomain.com/` - Frontend loads
- [ ] `https://yourdomain.com/api/health` - API responds
- [ ] Login/Register works
- [ ] Google OAuth flow works
- [ ] Database queries execute
- [ ] File uploads work
- [ ] Emails send correctly
- [ ] No errors in logs

---

## 🆘 Common Issues & Quick Fixes

| Problem | Quick Fix | Detailed Guide |
|---------|-----------|----------------|
| App won't start | `node -v` (need 18+), check `.env` | DEPLOYMENT_GUIDE.md → Issue 1 |
| Database error | Verify credentials, check privileges | DEPLOYMENT_GUIDE.md → Issue 2 |
| Build fails | `rm -rf node_modules dist && npm install && npm run build` | DEPLOYMENT_GUIDE.md → Issue 3 |
| 404 on assets | Check `.htaccess`, verify `dist/public/` | DEPLOYMENT_GUIDE.md → Issue 4 |
| OAuth fails | Update redirect URI in Google Console | DEPLOYMENT_GUIDE.md → Issue 5 |

**For more:** See [`CPANEL_DEPLOYMENT.md`](./CPANEL_DEPLOYMENT.md) → Troubleshooting Table

---

## 📚 Documentation Map

```
DEPLOYMENT_INDEX.md
├── Quick navigation by experience level
├── Topic-based information finder
└── Emergency quick fixes

DEPLOYMENT_SUMMARY.md
├── Project overview
├── Files explanation
├── High-level steps
├── Environment variables
└── Testing & security checklists

CPANEL_DEPLOYMENT.md
├── Prerequisites
├── 3-minute quick start
├── Database setup
├── Common commands
└── Troubleshooting table

DEPLOYMENT_GUIDE.md
├── Complete step-by-step instructions
├── 7 detailed phases
├── Configuration screenshots
├── Extensive troubleshooting
└── Security & maintenance

DEPLOYMENT_FLOWCHART.md
├── Visual process diagram
├── Decision trees
├── Time estimates
└── Success indicators
```

---

## 🎓 Time Estimates

- **First-time deployment:** 1-2 hours
- **Experienced deployment:** 30-45 minutes
- **Quick update (already deployed):** 5-10 minutes

---

## 🔒 Security Reminders

Before deploying:

- [ ] Never commit `.env` to Git
- [ ] Use strong database passwords
- [ ] Update Google OAuth redirect URI
- [ ] Enable HTTPS (handled by `.htaccess`)
- [ ] Review file permissions (755/644)
- [ ] Generate strong SESSION_SECRET

---

## 📞 Where to Get Help

1. **Start with docs:**
   - Quick answers: [`CPANEL_DEPLOYMENT.md`](./CPANEL_DEPLOYMENT.md)
   - Detailed help: [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md)

2. **Check logs:**
   ```bash
   tail -f logs/app.log
   ```

3. **Review flowchart:**
   - [`DEPLOYMENT_FLOWCHART.md`](./DEPLOYMENT_FLOWCHART.md) → Troubleshooting Branches

---

## 🎉 Ready to Deploy!

### Start Here:
👉 **[DEPLOYMENT_INDEX.md](./DEPLOYMENT_INDEX.md)** - Your complete navigation guide

### Or Jump To:
- 📋 **Overview:** [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)
- ⚡ **Quick Start:** [CPANEL_DEPLOYMENT.md](./CPANEL_DEPLOYMENT.md)
- 📗 **Full Guide:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- 📊 **Visual Map:** [DEPLOYMENT_FLOWCHART.md](./DEPLOYMENT_FLOWCHART.md)

---

## 📝 Package Contents Summary

### Documentation (5 files)
- ✅ Complete deployment guides
- ✅ Quick reference materials
- ✅ Troubleshooting resources
- ✅ Visual diagrams

### Configuration (6 files)
- ✅ Environment templates
- ✅ Server configurations
- ✅ Deployment scripts
- ✅ Automation tools

### Total: 11 files for successful deployment

---

**Everything you need is included. Follow the guides and you'll be deployed successfully! 🚀**

Good luck with your deployment!

---

*Questions? Start with [DEPLOYMENT_INDEX.md](./DEPLOYMENT_INDEX.md)*
