# 🔧 FIX: "DATABASE_URL must be set" Error

## 🔍 **Your Error:**

```
Error: DATABASE_URL must be set. Did you forget to provision a database?
```

**Root Causes:**
1. ❌ Environment variables not set in cPanel
2. ❌ App is in wrong directory (`/home/whitelabelportal/public_html/whitelabelportal/`)

---

## ✅ **COMPLETE FIX (Step-by-Step)**

### **STEP 1: Stop the Application**

1. Login to cPanel
2. Go to **Software** → **Setup Node.js App**
3. Find your application
4. Click **Stop App** button

---

### **STEP 2: Move App to Correct Location**

Your app is currently at:
```
/home/whitelabelportal/public_html/whitelabelportal/  ❌ WRONG!
```

It should be at:
```
/home/whitelabelportal/whitelabelportal/  ✅ CORRECT!
```

**Via SSH:**
```bash
# Login via SSH
ssh whitelabelportal@yourserver.com

# Navigate to home directory
cd /home/whitelabelportal

# Move app from public_html to home directory
mv public_html/whitelabelportal ./

# Verify the move
ls -la whitelabelportal
pwd  # Should show: /home/whitelabelportal
```

**Via cPanel File Manager:**
1. Open **File Manager**
2. Navigate to `/home/whitelabelportal/public_html/`
3. Right-click on `whitelabelportal` folder
4. Select **Move**
5. Change destination to: `/home/whitelabelportal/`
6. Click **Move File(s)**

---

### **STEP 3: Create .env File**

**Via SSH:**
```bash
cd /home/whitelabelportal/whitelabelportal
nano .env
```

**Paste this content:**
```bash
# Database Configuration
DATABASE_URL=mysql://whitelabelportal_admin:whitelabelportal_admin@localhost:3306/whitelabelportal_main

# Server Configuration
NODE_ENV=production
PORT=3000
SESSION_SECRET=change_this_to_a_random_secret_string_12345

# Google OAuth
GOOGLE_CLIENT_ID=556742536850-v06apakkgmf23rgm4rm4gjlu4qh2u7gn.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback

# Email Configuration
EMAIL_USER=hammadisaqib@gmail.com
EMAIL_PASS=bwqxqaroigqzkjqn

# Google AI Configuration
GEMINI_API_KEY=AIzaSyD0yx89zD4kd5qtxyZpaEzO41XYKM7Ckv4
GOOGLE_AI_PROJECT_ID=1053293898585
GOOGLE_AI_STUDIO_API_KEY=AIzaSyD0yx89zD4kd5qtxyZpaEzO41XYKM7Ckv4

# OpenAI Configuration (backup)
OPENAI_API_KEY=
```

**Save:** Ctrl+O, Enter, Ctrl+X

**IMPORTANT:** Replace `yourdomain.com` with your actual domain!

---

### **STEP 4: Set Environment Variables in cPanel**

1. Go to cPanel → **Setup Node.js App**
2. Find your application
3. Click **Edit** (pencil icon)
4. Scroll down to **"Environment variables"** section
5. Click **"Add Variable"** for each variable below:

**Add these one by one:**

| Variable Name | Variable Value |
|---------------|----------------|
| `DATABASE_URL` | `mysql://whitelabelportal_admin:whitelabelportal_admin@localhost:3306/whitelabelportal_main` |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `SESSION_SECRET` | `your_random_secret_here_12345` |
| `GOOGLE_CLIENT_ID` | `556742536850-v06apakkgmf23rgm4rm4gjlu4qh2u7gn.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | `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` |
| `GOOGLE_REDIRECT_URI` | `https://yourdomain.com/api/auth/google/callback` |
| `EMAIL_USER` | `hammadisaqib@gmail.com` |
| `EMAIL_PASS` | `bwqxqaroigqzkjqn` |
| `GEMINI_API_KEY` | `AIzaSyD0yx89zD4kd5qtxyZpaEzO41XYKM7Ckv4` |
| `GOOGLE_AI_PROJECT_ID` | `1053293898585` |

**After adding all variables, click "Save"**

---

### **STEP 5: Update Application Configuration**

Still in **Setup Node.js App** → **Edit**:

**Update these fields:**
- **Application root:** `whitelabelportal` (just the folder name)
- **Application startup file:** `dist/index.js`
- **Application mode:** Production (or Development)

**Click "Save"**

---

### **STEP 6: Run Database Migrations**

**Via SSH:**
```bash
cd /home/whitelabelportal/whitelabelportal

# Run migrations
npm run db:push
```

Expected output:
```
✓ Pushing schema...
✓ Schema pushed successfully!
```

If you see errors, verify:
- Database `whitelabelportal_main` exists
- User `whitelabelportal_admin` has permissions

---

### **STEP 7: Verify Files & Permissions**

```bash
cd /home/whitelabelportal/whitelabelportal

# Check files exist
ls -la

# Should see:
# - client/
# - server/
# - dist/
# - node_modules/
# - package.json
# - .env

# Check .env contains DATABASE_URL
cat .env | grep DATABASE_URL

# Set correct permissions
chmod 644 .env
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;
```

---

### **STEP 8: Start the Application**

**In cPanel:**
1. Go to **Setup Node.js App**
2. Find your application
3. Click **Start App**
4. Wait for status to change to **"Running"** ✅

**Monitor startup:**

Via SSH:
```bash
# Watch the application logs (if available)
tail -f /home/whitelabelportal/whitelabelportal/logs/app.log

# Or check Node.js process
ps aux | grep node
```

---

### **STEP 9: Test the Application**

**Test these URLs:**

1. **Frontend:**
   ```
   https://yourdomain.com/
   ```
   Should load the React application

2. **API Health:**
   ```
   https://yourdomain.com/api/health
   ```
   Should return JSON response

3. **Auth Status:**
   ```
   https://yourdomain.com/api/auth/me
   ```
   Should return 401 or user data

---

## 🧪 **Troubleshooting**

### **Still seeing "DATABASE_URL must be set"?**

**Test 1: Check if .env file is readable**
```bash
cd /home/whitelabelportal/whitelabelportal
cat .env
```
Should display your environment variables.

**Test 2: Try starting manually**
```bash
cd /home/whitelabelportal/whitelabelportal
node dist/index.js
```

If you see the same error, it means `.env` isn't being loaded.

**Test 3: Start with explicit environment variable**
```bash
DATABASE_URL="mysql://whitelabelportal_admin:whitelabelportal_admin@localhost:3306/whitelabelportal_main" node dist/index.js
```

If this works, the issue is environment variable loading.

---

### **Database Connection Error?**

**Verify database exists:**
```bash
mysql -u whitelabelportal_admin -p whitelabelportal_main
# Enter password: whitelabelportal_admin
```

Should connect successfully.

**If connection fails:**
1. Go to cPanel → **MySQL® Databases**
2. Verify database `whitelabelportal_main` exists
3. Verify user `whitelabelportal_admin` has ALL PRIVILEGES

---

### **Application won't start in cPanel?**

**Check logs:**
1. In **Setup Node.js App** interface
2. Look for error messages
3. Common issues:
   - Missing `dist/index.js` - Run `npm run build`
   - Wrong Application Root - Should be `whitelabelportal`
   - Node.js version too old - Use 18.x or 20.x

---

## 📋 **Verification Checklist**

Before starting app, verify:

- [ ] App is at: `/home/whitelabelportal/whitelabelportal/` (NOT in public_html)
- [ ] `.env` file exists with DATABASE_URL
- [ ] Environment variables set in cPanel Node.js App
- [ ] Application Root is: `whitelabelportal`
- [ ] Application Startup File is: `dist/index.js`
- [ ] Database `whitelabelportal_main` exists
- [ ] User `whitelabelportal_admin` has permissions
- [ ] `dist/index.js` file exists (run `npm run build` if missing)
- [ ] `node_modules` installed (run `npm install` if missing)
- [ ] Migrations run successfully (`npm run db:push`)

---

## 🎯 **Quick Command Summary**

```bash
# 1. Move app to correct location
cd /home/whitelabelportal
mv public_html/whitelabelportal ./

# 2. Navigate to app
cd whitelabelportal

# 3. Create .env file
nano .env
# (paste content from STEP 3 above, save with Ctrl+O, Enter, Ctrl+X)

# 4. Install dependencies (if needed)
npm install

# 5. Build application (if needed)
npm run build

# 6. Run migrations
npm run db:push

# 7. Set permissions
chmod 644 .env
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;

# 8. Check everything is ready
pwd  # Should show: /home/whitelabelportal/whitelabelportal
ls dist/index.js  # Should exist
cat .env | grep DATABASE_URL  # Should show your connection string
```

Then in cPanel:
1. Update Application Root: `whitelabelportal`
2. Add all environment variables
3. Click "Start App"

---

## 🔑 **Key Points**

1. **Directory:** App must be in `/home/whitelabelportal/whitelabelportal/` (NOT in public_html)
2. **Environment Variables:** Must be set BOTH in `.env` file AND in cPanel Node.js App
3. **Application Root:** Must be set to `whitelabelportal` (just the folder name)
4. **Database:** Must exist and user must have permissions

---

## ✅ **Success Indicators**

You've succeeded when:
- ✅ Application status shows "Running" in cPanel
- ✅ `https://yourdomain.com/` loads your frontend
- ✅ `https://yourdomain.com/api/health` returns JSON
- ✅ No errors in application logs
- ✅ Database queries work

---

**Follow these steps carefully and your application will start successfully!** 🚀
