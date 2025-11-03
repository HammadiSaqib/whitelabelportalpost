# WhiteLabelPortal - cPanel Deployment Guide (Development Mode)

## 📋 Pre-Deployment Checklist

### Local Preparation
- [ ] All code committed to Git
- [ ] Dependencies updated (`npm install`)
- [ ] Build tested locally (`npm run build`)
- [ ] Environment variables documented
- [ ] Database schema finalized

---

## 🎯 Step-by-Step Deployment Process

### **PHASE 1: cPanel Setup**

#### 1.1 Create MySQL Database
1. Login to **cPanel**
2. Navigate to **MySQL® Databases**
3. Create a new database (e.g., `username_whitelabel`)
4. Create a database user (e.g., `username_wluser`)
5. Set a strong password
6. Add user to database with **ALL PRIVILEGES**
7. Note down:
   - Database name: `username_whitelabel`
   - Username: `username_wluser`
   - Password: `your_secure_password`
   - Host: `localhost`

#### 1.2 Enable Node.js Application
1. In cPanel, go to **Software** → **Setup Node.js App**
2. Click **Create Application**
3. Configure:
   - **Node.js version**: 18.x or higher (recommended 20.x)
   - **Application mode**: Development (for now)
   - **Application root**: `/home/username/whitelabelportal` (or your choice)
   - **Application URL**: Your domain or subdomain
   - **Application startup file**: `dist/index.js`
4. Click **Create**

#### 1.3 Set Environment Variables in cPanel
1. In the Node.js App interface, scroll to **Environment Variables**
2. Add these variables:

```
DATABASE_URL=mysql://username_wluser:password@localhost:3306/username_whitelabel
GOOGLE_CLIENT_ID=556742536850-v06apakkgmf23rgm4rm4gjlu4qh2u7gn.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback
EMAIL_USER=hammadisaqib@gmail.com
EMAIL_PASS=bwqxqaroigqzkjqn
GEMINI_API_KEY=AIzaSyD0yx89zD4kd5qtxyZpaEzO41XYKM7Ckv4
GOOGLE_AI_PROJECT_ID=1053293898585
GOOGLE_AI_STUDIO_API_KEY=AIzaSyD0yx89zD4kd5qtxyZpaEzO41XYKM7Ckv4
NODE_ENV=development
PORT=3000
SESSION_SECRET=generate_a_random_secret_here
```

---

### **PHASE 2: File Upload**

#### 2.1 Upload via Git (Recommended)
If your cPanel supports Git:

1. In cPanel, go to **Git™ Version Control**
2. Click **Create**
3. Enter your repository URL
4. Set repository path: `/home/username/whitelabelportal`
5. Click **Create**
6. cPanel will clone your repository

#### 2.2 Upload via File Manager (Alternative)
1. Compress your project folder to `.zip` (exclude `node_modules`, `dist`, `.git`)
2. In cPanel **File Manager**, navigate to desired location
3. Upload the zip file
4. Extract it
5. Set proper permissions (755 for directories, 644 for files)

#### 2.3 Upload via FTP (Alternative)
1. Use FileZilla or similar FTP client
2. Connect to your cPanel FTP
3. Upload entire project (exclude `node_modules`, `dist`)
4. This may take time for large projects

---

### **PHASE 3: Installation & Build**

#### 3.1 Access Terminal
1. In cPanel, go to **Advanced** → **Terminal**
2. Or use SSH if enabled: `ssh username@yourdomain.com`

#### 3.2 Navigate to Project Directory
```bash
cd /home/username/whitelabelportal
```

#### 3.3 Install Dependencies
```bash
npm install
```

Expected time: 2-5 minutes depending on server speed

#### 3.4 Build the Application
```bash
npm run build
```

This will:
- Build frontend with Vite → `dist/public/`
- Bundle backend with esbuild → `dist/index.js`

#### 3.5 Run Database Migrations
```bash
npm run db:push
```

This applies all schema changes to your MySQL database using Drizzle ORM.

---

### **PHASE 4: Google Cloud Configuration**

#### 4.1 Upload Google Cloud Credentials
1. Copy `client_secret_556742536850-v06apakkgmf23rgm4rm4gjlu4qh2u7gn.apps.googleusercontent.com_1754562604909.json`
2. Upload to `/home/username/whitelabelportal/attached_assets/`
3. Update path in environment if needed

#### 4.2 Update Google OAuth Redirect URI
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID
4. Add authorized redirect URI: `https://yourdomain.com/api/auth/google/callback`
5. Save changes

---

### **PHASE 5: Start the Application**

#### 5.1 Using Node.js App Manager (Recommended)
1. Go back to cPanel → **Setup Node.js App**
2. Find your application
3. Click **Stop** then **Start** (or **Restart**)
4. Application should now be running

#### 5.2 Using PM2 (Advanced)
If you have SSH access and PM2 installed:

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start dist/index.js --name whitelabelportal

# Save PM2 process list
pm2 save

# Setup PM2 startup script
pm2 startup
```

#### 5.3 Verify Application is Running
```bash
# Check if Node.js is running
ps aux | grep node

# Check application logs
tail -f logs/error.log  # if you set up logging
```

---

### **PHASE 6: Configure Web Server**

#### 6.1 Update .htaccess (if not auto-created)
The `.htaccess` file in your project root should:
- Redirect all traffic to HTTPS
- Proxy API requests to Node.js (port 3000)
- Serve static files from `dist/public`

#### 6.2 Test Routes
Visit these URLs to verify:
- `https://yourdomain.com/` - Should load React frontend
- `https://yourdomain.com/api/health` - Should return API status
- `https://yourdomain.com/api/auth/me` - Should return user info (or 401)

---

### **PHASE 7: Post-Deployment Testing**

#### 7.1 Functional Tests
- [ ] Frontend loads correctly
- [ ] Login/Register works
- [ ] Google OAuth authentication works
- [ ] Database queries execute properly
- [ ] File uploads work
- [ ] Email sending works (SendGrid)
- [ ] AI features work (Gemini API)
- [ ] White-label domains route correctly

#### 7.2 Performance Tests
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Database queries optimized
- [ ] Static assets cached properly

#### 7.3 Security Tests
- [ ] HTTPS enforced
- [ ] Environment variables not exposed
- [ ] SQL injection protection (Drizzle ORM)
- [ ] CORS configured properly
- [ ] Rate limiting enabled (if applicable)

---

## 🔧 Troubleshooting

### Common Issues

#### **Issue 1: Application won't start**
**Symptoms**: "Application stopped" in cPanel
**Solutions**:
```bash
# Check Node.js version
node -v  # Should be 18.x or higher

# Check for errors in startup file
node dist/index.js

# Check environment variables
env | grep DATABASE_URL
```

#### **Issue 2: Database connection failed**
**Symptoms**: "Connection refused" or "Access denied"
**Solutions**:
1. Verify database credentials in `.env`
2. Ensure database user has permissions
3. Check if MySQL is running: `systemctl status mysql`
4. Test connection:
```bash
mysql -u username_wluser -p username_whitelabel
```

#### **Issue 3: Build fails**
**Symptoms**: npm build errors
**Solutions**:
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json dist
npm install
npm run build

# Check TypeScript errors
npm run check
```

#### **Issue 4: Static files not loading**
**Symptoms**: 404 errors for CSS/JS files
**Solutions**:
1. Verify build output in `dist/public/`
2. Check `.htaccess` rewrite rules
3. Set correct permissions:
```bash
chmod -R 755 dist/public
```

#### **Issue 5: Google OAuth not working**
**Symptoms**: Redirect URI mismatch error
**Solutions**:
1. Update redirect URI in Google Console
2. Verify `GOOGLE_REDIRECT_URI` in environment variables
3. Ensure HTTPS is enforced

#### **Issue 6: Port already in use**
**Symptoms**: "Port 3000 already in use"
**Solutions**:
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change port in environment variables
```

---

## 📊 Monitoring & Maintenance

### Application Logs
```bash
# View application logs
tail -f /home/username/whitelabelportal/logs/app.log

# View Node.js application logs in cPanel
# Navigate to Setup Node.js App → View logs
```

### Database Backups
```bash
# Create database backup
mysqldump -u username_wluser -p username_whitelabel > backup_$(date +%Y%m%d).sql

# Restore from backup
mysql -u username_wluser -p username_whitelabel < backup_20251018.sql
```

### Application Updates
```bash
# Pull latest code (if using Git)
cd /home/username/whitelabelportal
git pull origin main

# Install new dependencies
npm install

# Rebuild application
npm run build

# Restart application
# Use cPanel Node.js App Manager or PM2
```

---

## 🔒 Security Best Practices

1. **Keep secrets secure**
   - Never commit `.env` to Git
   - Use strong passwords for database
   - Rotate API keys regularly

2. **Regular updates**
   - Update npm packages: `npm update`
   - Update Node.js version periodically
   - Apply security patches

3. **Access control**
   - Limit SSH/FTP access
   - Use strong cPanel password
   - Enable 2FA on cPanel if available

4. **Monitoring**
   - Set up uptime monitoring
   - Monitor error logs
   - Track database performance

---

## 📞 Support & Resources

- **cPanel Documentation**: https://docs.cpanel.net/
- **Node.js in cPanel**: https://docs.cpanel.net/ea4/experimental/passenger-nodejs/
- **Drizzle ORM Docs**: https://orm.drizzle.team/
- **Vite Documentation**: https://vitejs.dev/

---

## ✅ Final Checklist

Before going live:
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Google OAuth configured
- [ ] HTTPS enabled
- [ ] Backups configured
- [ ] Monitoring set up
- [ ] Error logging enabled
- [ ] Performance optimized
- [ ] Security hardened

---

**Congratulations! Your WhiteLabelPortal is now deployed on cPanel! 🎉**
