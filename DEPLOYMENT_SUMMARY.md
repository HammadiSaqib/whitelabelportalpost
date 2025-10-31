# 🎯 WhiteLabelPortal - cPanel Deployment Summary

## 📊 Project Overview

**Project Name:** WhiteLabelPortal  
**Type:** Full-stack SaaS Platform  
**Tech Stack:**
- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Database:** MySQL (via Drizzle ORM)
- **Authentication:** Passport (Google OAuth) + Lucia
- **Storage:** Google Cloud Storage
- **Email:** SendGrid
- **AI:** Google Gemini AI

## 📁 Files Created for Deployment

| File | Purpose | Action Required |
|------|---------|----------------|
| `.env.production` | Production environment template | ✅ Update with your credentials |
| `.cpanel.yml` | Automated cPanel deployment | ✅ Update username/path |
| `.htaccess` | Apache configuration | ✅ Review and upload |
| `app.js` | Passenger startup file | ✅ Upload as-is |
| `deploy.sh` | Full deployment script | ✅ Make executable & run |
| `quick-deploy.sh` | Quick setup script | ✅ Run on server |
| `DEPLOYMENT_GUIDE.md` | Complete step-by-step guide | 📖 Read this first! |
| `CPANEL_DEPLOYMENT.md` | Quick reference guide | 📖 Quick commands |
| `.gitignore` | Updated ignore rules | ✅ Commit to Git |

## 🚀 Deployment Steps (High-Level)

### Phase 1: Pre-Deployment (Local)
1. ✅ Review `DEPLOYMENT_GUIDE.md`
2. ✅ Update `.env.production` with actual values
3. ✅ Test build locally: `npm run build`
4. ✅ Commit all changes to Git
5. ✅ Create deployment package

### Phase 2: cPanel Setup
1. ✅ Create MySQL database & user
2. ✅ Enable Node.js application
3. ✅ Configure environment variables
4. ✅ Set up domain/subdomain

### Phase 3: Upload & Install
1. ✅ Upload files (Git/FTP/File Manager)
2. ✅ SSH into server
3. ✅ Run: `chmod +x quick-deploy.sh && ./quick-deploy.sh`
4. ✅ Edit `.env` with actual credentials

### Phase 4: Configuration
1. ✅ Update Google OAuth redirect URI
2. ✅ Configure database connection
3. ✅ Run database migrations
4. ✅ Upload Google Cloud credentials

### Phase 5: Launch
1. ✅ Start Node.js app in cPanel
2. ✅ Test all endpoints
3. ✅ Verify functionality
4. ✅ Monitor logs

## 🔑 Critical Environment Variables

**Required for Basic Functionality:**
```bash
DATABASE_URL=mysql://whitelabelportal_admin:whitelabelportal_admin@localhost:3306/whitelabelportal_main
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback
NODE_ENV=development
PORT=3000
SESSION_SECRET=random_secret_here
```

**Required for Email:**
```bash
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

**Required for AI Features:**
```bash
GEMINI_API_KEY=your_api_key
GOOGLE_AI_PROJECT_ID=your_project_id
```

## 📋 cPanel Configuration

### Node.js Application Setup
```
Node.js Version: 18.x or 20.x (latest LTS)
Application Mode: Development
Application Root: whitelabelportal (NOT public_html)
Application URL: yourdomain.com
Application Startup File: dist/index.js
```

### MySQL Database Setup
```
Database Name: username_whitelabel
Database User: username_wluser
Privileges: ALL PRIVILEGES
Host: localhost
```

## 🧪 Testing Checklist

After deployment, test these URLs:

- [ ] `https://yourdomain.com/` - Frontend loads
- [ ] `https://yourdomain.com/api/health` - API responds
- [ ] `https://yourdomain.com/api/auth/me` - Auth endpoint works
- [ ] Login/Register functionality
- [ ] Google OAuth flow
- [ ] Database operations
- [ ] File uploads
- [ ] Email sending
- [ ] AI features

## 🔧 Common Commands

### On Server (SSH/Terminal)
```bash
# Navigate to project
cd /home/username/whitelabelportal

# Install dependencies
npm install

# Build application
npm run build

# Run migrations
npm run db:push

# Start application (if not using cPanel interface)
npm start

# View logs
tail -f logs/app.log

# Restart application (Passenger)
touch tmp/restart.txt
```

### Database Management
```bash
# Connect to MySQL
mysql -u username_wluser -p username_whitelabel

# Backup database
mysqldump -u username_wluser -p username_whitelabel > backup.sql

# Restore database
mysql -u username_wluser -p username_whitelabel < backup.sql
```

## 🚨 Troubleshooting Quick Fixes

| Issue | Quick Fix |
|-------|-----------|
| **App won't start** | Check Node.js version: `node -v` (need 18+) |
| **Database error** | Verify `.env` DATABASE_URL and user privileges |
| **Build fails** | Clear: `rm -rf node_modules dist && npm install && npm run build` |
| **404 on assets** | Check `.htaccess` is uploaded and `dist/public` exists |
| **OAuth fails** | Update redirect URI in Google Console |
| **Port in use** | `lsof -i :3000` then `kill -9 <PID>` |

## 📊 Project Structure

```
whitelabelportal/
├── client/                 # React frontend
│   ├── src/
│   └── index.html
├── server/                 # Express backend
│   ├── index.ts           # Main entry
│   ├── routes.ts          # API routes
│   ├── db.ts              # Database config
│   └── auth.ts            # Authentication
├── shared/                 # Shared code
│   └── schema.ts          # Database schema
├── migrations/             # Database migrations
├── dist/                   # Build output
│   ├── public/            # Frontend build
│   └── index.js           # Backend bundle
├── uploads/                # User uploads
├── .env                    # Environment variables
├── .htaccess              # Apache config
├── app.js                 # Passenger startup
└── package.json           # Dependencies

```

## 🔒 Security Checklist

- [ ] `.env` file is NOT committed to Git
- [ ] Strong database password set
- [ ] HTTPS enforced (in `.htaccess`)
- [ ] Google OAuth credentials secured
- [ ] File upload validation enabled
- [ ] CORS properly configured
- [ ] SQL injection protected (using Drizzle ORM)
- [ ] Session secrets are random and strong
- [ ] Rate limiting enabled (optional)
- [ ] Error messages don't leak sensitive info

## 📈 Performance Optimization

### Already Implemented:
- ✅ Static asset compression (in `.htaccess`)
- ✅ Browser caching (in `.htaccess`)
- ✅ Production build optimization (Vite)
- ✅ Database connection pooling (MySQL2)

### Optional Improvements:
- [ ] Enable Cloudflare CDN
- [ ] Set up Redis for session storage
- [ ] Implement database query caching
- [ ] Enable gzip compression
- [ ] Add CDN for static assets

## 📚 Documentation Links

- **Full Guide:** `DEPLOYMENT_GUIDE.md` - Complete step-by-step instructions
- **Quick Reference:** `CPANEL_DEPLOYMENT.md` - Common commands and quick fixes
- **Project Docs:** `README.md` - Project overview and features

## 🎓 Learning Resources

- [cPanel Node.js Documentation](https://docs.cpanel.net/ea4/experimental/passenger-nodejs/)
- [Passenger Documentation](https://www.phusionpassenger.com/docs/)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Vite Production Build](https://vitejs.dev/guide/build.html)

## 💡 Pro Tips

1. **Always backup before deploying:**
   ```bash
   mysqldump -u user -p dbname > backup_$(date +%Y%m%d).sql
   ```

2. **Use Git for deployments:**
   - Push to GitHub/GitLab
   - Use cPanel Git™ Version Control to pull

3. **Monitor your application:**
   - Set up uptime monitoring (UptimeRobot, Pingdom)
   - Check logs regularly
   - Monitor database performance

4. **Keep Node.js updated:**
   - Use cPanel to update Node.js version
   - Test on staging before production

5. **Environment-specific configs:**
   - Use `.env.development` locally
   - Use `.env.production` on server
   - Never commit `.env` to Git

## 🆘 Getting Help

If you encounter issues:

1. **Check logs:**
   - Application logs: `tail -f logs/app.log`
   - cPanel logs: In Node.js App interface
   - Apache logs: In cPanel Error Log viewer

2. **Common solutions:**
   - Restart app: `touch tmp/restart.txt` or use cPanel
   - Rebuild: `npm run build`
   - Re-migrate: `npm run db:push`

3. **Review documentation:**
   - `DEPLOYMENT_GUIDE.md` - Detailed troubleshooting section
   - `CPANEL_DEPLOYMENT.md` - Quick fixes table

## ✅ Final Deployment Checklist

Before marking deployment as complete:

- [ ] Application builds successfully
- [ ] All environment variables set
- [ ] Database connected and migrated
- [ ] Google OAuth working
- [ ] HTTPS enforced
- [ ] File uploads working
- [ ] Email sending working
- [ ] AI features functional
- [ ] All pages load correctly
- [ ] No errors in logs
- [ ] Performance is acceptable
- [ ] Backups configured
- [ ] Monitoring set up

---

## 🎉 Success!

Once all items are checked, your WhiteLabelPortal is successfully deployed on cPanel in development mode!

**Next Steps:**
1. Test all features thoroughly
2. Invite beta users for feedback
3. Monitor performance and errors
4. Plan for production deployment
5. Set up automated backups

**Remember:** Development mode is for testing. For production:
- Change `NODE_ENV=production`
- Enable additional security measures
- Set up proper logging and monitoring
- Configure automated backups

---

**Document Version:** 1.0  
**Last Updated:** 2025-10-18  
**Author:** AI Assistant  
**Project:** WhiteLabelPortal
