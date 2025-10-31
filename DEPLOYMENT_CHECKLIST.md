# ✅ WhiteLabelPortal - Deployment Checklist

Print this checklist and check off each item as you complete it.

---

## 📋 PRE-DEPLOYMENT (Local Machine)

### Documentation Review
- [ ] Read `DEPLOYMENT_INDEX.md`
- [ ] Read `DEPLOYMENT_SUMMARY.md`
- [ ] Review `DEPLOYMENT_FLOWCHART.md`
- [ ] Bookmark `CPANEL_DEPLOYMENT.md` for quick reference

### Project Preparation
- [ ] All code changes committed to Git
- [ ] Run `npm install` successfully
- [ ] Run `npm run build` successfully
- [ ] Run `npm run check` (no TypeScript errors)
- [ ] Test locally with `npm run dev`
- [ ] All tests passing (if you have tests)

### Configuration Files
- [ ] `.env.production` reviewed and understood
- [ ] `.cpanel.yml` updated with your username/path
- [ ] `.htaccess` reviewed
- [ ] `app.js` present
- [ ] `deploy.sh` present and reviewed
- [ ] `quick-deploy.sh` present and reviewed

### Credentials Gathered
- [ ] cPanel login credentials
- [ ] Database name decided (e.g., `username_whitelabel`)
- [ ] Database username decided (e.g., `username_wluser`)
- [ ] Strong database password generated
- [ ] Google OAuth Client ID ready
- [ ] Google OAuth Client Secret ready
- [ ] SendGrid API key or email credentials ready
- [ ] Google AI API keys ready (if using AI features)

---

## 🔧 cPANEL SETUP

### MySQL Database
- [ ] Login to cPanel
- [ ] Navigate to **MySQL® Databases**
- [ ] Create new database: `____________________` (write name)
- [ ] Create new user: `____________________` (write username)
- [ ] Set strong password: `____________________` (save securely!)
- [ ] Add user to database
- [ ] Grant **ALL PRIVILEGES** to user
- [ ] Note connection details:
  ```
  Host: localhost
  Port: 3306
  Database: ____________________
  Username: ____________________
  Password: ____________________
  ```

### Node.js Application Setup
- [ ] Navigate to **Software** → **Setup Node.js App**
- [ ] Click **Create Application**
- [ ] Configure settings:
  - [ ] Node.js version: **18.x or 20.x** (latest LTS)
  - [ ] Application mode: **Development**
  - [ ] Application root: `/home/username/whitelabelportal`
  - [ ] Application URL: `____________________` (your domain)
  - [ ] Application startup file: `dist/index.js`
- [ ] Click **Create**

### Environment Variables (in cPanel Node.js App)
- [ ] Add `DATABASE_URL=mysql://user:pass@localhost:3306/dbname`
- [ ] Add `GOOGLE_CLIENT_ID=your_client_id`
- [ ] Add `GOOGLE_CLIENT_SECRET=your_client_secret`
- [ ] Add `GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback`
- [ ] Add `EMAIL_USER=your_email@gmail.com`
- [ ] Add `EMAIL_PASS=your_app_password`
- [ ] Add `GEMINI_API_KEY=your_api_key` (if using AI)
- [ ] Add `NODE_ENV=development`
- [ ] Add `PORT=3000`
- [ ] Add `SESSION_SECRET=____________________` (generate random)
- [ ] Save all environment variables

---

## 📤 FILE UPLOAD

### Choose Upload Method
- [ ] **Method selected:** ☐ Git  ☐ FTP  ☐ File Manager

### If Using Git:
- [ ] Push code to GitHub/GitLab
- [ ] In cPanel, go to **Git™ Version Control**
- [ ] Click **Create**
- [ ] Enter repository URL: `____________________`
- [ ] Set path: `/home/username/whitelabelportal`
- [ ] Click **Create** (cPanel clones repository)

### If Using FTP:
- [ ] Connect to cPanel FTP
- [ ] Navigate to destination folder
- [ ] Upload all files (exclude `node_modules`, `dist`, `.git`)
- [ ] Verify all files uploaded successfully

### If Using File Manager:
- [ ] Create ZIP of project (exclude `node_modules`, `dist`, `.git`)
- [ ] Upload ZIP to cPanel File Manager
- [ ] Navigate to upload location
- [ ] Extract ZIP file
- [ ] Verify extraction successful

---

## 💻 SSH/TERMINAL SETUP

### Access Terminal
- [ ] **Access method:** ☐ cPanel Terminal  ☐ SSH (ssh username@domain.com)
- [ ] Successfully logged in

### Navigate to Project
```bash
cd /home/username/whitelabelportal
```
- [ ] In project directory
- [ ] Run `ls` to verify files present

### File Permissions
```bash
chmod +x quick-deploy.sh
chmod +x deploy.sh
```
- [ ] Scripts made executable

---

## 🚀 INSTALLATION & BUILD

### Run Quick Deploy Script
```bash
./quick-deploy.sh
```
- [ ] Script started successfully
- [ ] Dependencies installing (watching progress)
- [ ] Dependencies installed ✅
- [ ] Build started
- [ ] Frontend build completed ✅
- [ ] Backend build completed ✅
- [ ] Directories created (uploads, logs)
- [ ] Script completed successfully

### Update Environment File
```bash
nano .env
# or
vi .env
```
- [ ] `.env` file opened
- [ ] Updated `DATABASE_URL` with actual credentials
- [ ] Updated `GOOGLE_REDIRECT_URI` with actual domain
- [ ] Updated all other variables as needed
- [ ] Saved file (Ctrl+O, Enter, Ctrl+X in nano)

### Run Database Migrations
```bash
npm run db:push
```
- [ ] Migration script started
- [ ] Database connection successful
- [ ] Tables created/updated
- [ ] Migration completed ✅
- [ ] No errors reported

---

## ⚙️ GOOGLE CLOUD CONFIGURATION

### Upload Credentials File
- [ ] Navigate to `attached_assets/` folder
- [ ] Upload Google Cloud credentials JSON
- [ ] Verify file permissions (644)

### Update OAuth Settings
- [ ] Login to [Google Cloud Console](https://console.cloud.google.com)
- [ ] Navigate to **APIs & Services** → **Credentials**
- [ ] Find OAuth 2.0 Client ID
- [ ] Add Authorized Redirect URI: `https://yourdomain.com/api/auth/google/callback`
- [ ] Save changes ✅
- [ ] Wait 5 minutes for changes to propagate

---

## 🎬 START APPLICATION

### Start via cPanel (Recommended)
- [ ] Go to **Setup Node.js App**
- [ ] Find your application
- [ ] Click **Start App** (or **Restart** if already started)
- [ ] Status shows: **Running** ✅
- [ ] Note the process ID if shown

### Or Start via PM2 (Advanced)
```bash
npm install -g pm2
pm2 start dist/index.js --name whitelabelportal
pm2 save
pm2 startup
```
- [ ] PM2 installed
- [ ] Application started
- [ ] Process saved
- [ ] Startup script configured

### Verify Process Running
```bash
ps aux | grep node
```
- [ ] Node.js process visible
- [ ] Process ID noted: `____________________`

---

## ✅ TESTING & VERIFICATION

### Frontend Tests
- [ ] Visit: `https://yourdomain.com/`
- [ ] Page loads successfully ✅
- [ ] No console errors
- [ ] CSS/styling loads correctly
- [ ] Images display correctly
- [ ] Navigation works

### API Tests
- [ ] Visit: `https://yourdomain.com/api/health`
- [ ] Returns JSON response ✅
- [ ] Status code: 200

### Authentication Tests
- [ ] Visit: `https://yourdomain.com/api/auth/me`
- [ ] Returns response (401 or user data) ✅
- [ ] Click **Login** on frontend
- [ ] Login form appears ✅
- [ ] Try test login
- [ ] Login works OR errors are clear ✅

### Google OAuth Tests
- [ ] Click **Sign in with Google**
- [ ] Redirects to Google ✅
- [ ] Authorize application
- [ ] Redirects back to app ✅
- [ ] User logged in successfully ✅

### Database Tests
- [ ] Create test data (if applicable)
- [ ] Data saves to database ✅
- [ ] Data retrieves correctly ✅
- [ ] Updates work ✅
- [ ] Deletes work ✅

### File Upload Tests
- [ ] Navigate to upload feature
- [ ] Upload test file
- [ ] File uploads successfully ✅
- [ ] File accessible via URL ✅

### Email Tests
- [ ] Trigger email action (e.g., register)
- [ ] Email sent successfully ✅
- [ ] Email received ✅
- [ ] Email content correct ✅

### AI Features Tests (if applicable)
- [ ] Trigger AI feature
- [ ] AI response received ✅
- [ ] Response is relevant ✅

---

## 📊 MONITORING SETUP

### Application Logs
```bash
tail -f logs/app.log
```
- [ ] Logs directory exists
- [ ] Log file created
- [ ] Logs showing activity
- [ ] No critical errors

### Error Monitoring
- [ ] cPanel error logs accessible
- [ ] No errors in Apache error log
- [ ] No errors in Node.js log

### Performance Check
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Database query time acceptable
- [ ] No memory issues

---

## 🔒 SECURITY VERIFICATION

### HTTPS
- [ ] HTTPS enforced (check URL shows https://)
- [ ] HTTP redirects to HTTPS ✅
- [ ] SSL certificate valid ✅

### File Permissions
```bash
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;
```
- [ ] Directories: 755
- [ ] Files: 644
- [ ] Uploads directory: 755
- [ ] Logs directory: 755

### Sensitive Files Protected
- [ ] `.env` file not publicly accessible (test: `https://yourdomain.com/.env`)
- [ ] Returns 403 Forbidden ✅
- [ ] `package.json` not accessible
- [ ] Returns 403 Forbidden ✅

### Environment Variables
- [ ] All secrets stored in environment variables
- [ ] No secrets in code
- [ ] `.env` not in Git repository ✅

---

## 📦 BACKUP CONFIGURATION

### Database Backup
```bash
mysqldump -u user -p dbname > backup_$(date +%Y%m%d).sql
```
- [ ] Test backup created
- [ ] Backup file verified
- [ ] Backup schedule planned:
  - [ ] Daily backups
  - [ ] Weekly backups
  - [ ] Monthly backups

### File Backup
- [ ] Backup strategy decided
- [ ] Important directories identified:
  - [ ] `uploads/`
  - [ ] `attached_assets/`
  - [ ] `.env`
- [ ] Backup location chosen
- [ ] Automated backup configured (optional)

---

## 📈 POST-DEPLOYMENT

### Documentation
- [ ] Document any custom configurations
- [ ] Note any issues encountered and solutions
- [ ] Update team/collaborators on deployment
- [ ] Save all credentials securely

### Monitoring Tools (Optional)
- [ ] Setup UptimeRobot or similar
- [ ] Configure email alerts
- [ ] Setup performance monitoring

### Final Verification
- [ ] Application fully functional ✅
- [ ] All features tested ✅
- [ ] No critical errors ✅
- [ ] Performance acceptable ✅
- [ ] Security measures in place ✅

---

## 🎉 DEPLOYMENT COMPLETE!

### Completion Details
- **Deployment Date:** `____________________`
- **Deployed By:** `____________________`
- **Domain:** `____________________`
- **Node.js Version:** `____________________`
- **Database:** `____________________`
- **Time Taken:** `____________________`

### Notes & Issues
```
_______________________________________________________________
_______________________________________________________________
_______________________________________________________________
_______________________________________________________________
_______________________________________________________________
```

### Next Steps
- [ ] Monitor for 24 hours
- [ ] Gather user feedback
- [ ] Plan for production deployment
- [ ] Schedule maintenance window
- [ ] Update documentation as needed

---

## 🆘 QUICK TROUBLESHOOTING

If something goes wrong, check:

1. **Logs:**
   ```bash
   tail -f logs/app.log
   ```

2. **Node.js process:**
   ```bash
   ps aux | grep node
   ```

3. **Database connection:**
   ```bash
   mysql -u username -p dbname
   ```

4. **Restart app:**
   ```bash
   touch tmp/restart.txt
   # OR via cPanel interface
   ```

5. **Review documentation:**
   - [`CPANEL_DEPLOYMENT.md`](./CPANEL_DEPLOYMENT.md) → Quick fixes
   - [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) → Detailed troubleshooting

---

**Congratulations on your deployment! 🎊**

Keep this checklist for future deployments and updates.

---

*Checklist Version: 1.0*  
*Last Updated: 2025-10-18*
