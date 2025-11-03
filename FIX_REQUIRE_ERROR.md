# 🔧 FIX: "require is not defined in ES module" Error

## 🔍 **Your Error:**

```
ReferenceError: require is not defined in ES module scope, you can use import instead
```

**Root Causes:**
1. ❌ `app.js` is using CommonJS syntax but project is ES module
2. ❌ You don't actually need `app.js` for cPanel Node.js apps
3. ❌ App is STILL in wrong directory (`/home/whitelabelportal/public_html/whitelabelportal/`)

---

## ✅ **SOLUTION**

### **Fix 1: Remove app.js (Not Needed)**

I've deleted `app.js` from your project because:
- ✅ Modern cPanel Node.js apps don't need it
- ✅ You should run `dist/index.js` directly
- ✅ Passenger automatically handles the startup

**In cPanel Setup Node.js App:**
- **Application startup file:** `dist/index.js` (NOT `app.js`)

---

### **Fix 2: Move App Out of public_html** ⚠️ **CRITICAL**

Your app is STILL in the wrong location:
```
Current: /home/whitelabelportal/public_html/whitelabelportal/  ❌
Should be: /home/whitelabelportal/whitelabelportal/  ✅
```

**Fix it NOW:**

```bash
# SSH into server
cd /home/whitelabelportal

# Move app from public_html to home directory
mv public_html/whitelabelportal ./

# Verify
ls -la whitelabelportal
pwd  # Should show: /home/whitelabelportal
```

---

### **Fix 3: Update cPanel Configuration**

1. **Stop the app:**
   - cPanel → Setup Node.js App → Click "Stop App"

2. **Edit the application:**
   - Click "Edit" (pencil icon)
   
3. **Update these settings:**
   - **Application root:** `whitelabelportal` (NOT `public_html/whitelabelportal`)
   - **Application startup file:** `dist/index.js` (NOT `app.js`)
   - **Application mode:** Production (or Development)
   
4. **Click "Save"**

---

## 🚀 **Complete Step-by-Step Fix**

### **STEP 1: Stop Application**
cPanel → Setup Node.js App → **Stop App**

---

### **STEP 2: Move App to Correct Location**

**Via SSH:**
```bash
# 1. SSH into server
ssh whitelabelportal@yourserver.com

# 2. Navigate to home
cd /home/whitelabelportal

# 3. Check current structure
ls -la public_html/

# 4. Move app OUT of public_html
mv public_html/whitelabelportal ./

# 5. Verify new location
ls -la whitelabelportal/
pwd  # Should output: /home/whitelabelportal

# 6. Verify dist/index.js exists
ls -la whitelabelportal/dist/index.js
```

**Via cPanel File Manager:**
1. Navigate to `/home/whitelabelportal/public_html/`
2. Right-click `whitelabelportal` folder
3. Select **Move**
4. Change destination to: `/home/whitelabelportal/`
5. Click **Move File(s)**

---

### **STEP 3: Create/Update .env File**

```bash
cd /home/whitelabelportal/whitelabelportal
nano .env
```

**Paste this:**
```bash
# Database
DATABASE_URL=mysql://whitelabelportal_admin:whitelabelportal_admin@localhost:3306/whitelabelportal_main

# Server
NODE_ENV=production
PORT=3000
SESSION_SECRET=your_random_secret_change_this_12345

# Google OAuth
GOOGLE_CLIENT_ID=556742536850-v06apakkgmf23rgm4rm4gjlu4qh2u7gn.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback

# Email
EMAIL_USER=hammadisaqib@gmail.com
EMAIL_PASS=bwqxqaroigqzkjqn

# Google AI
GEMINI_API_KEY=AIzaSyD0yx89zD4kd5qtxyZpaEzO41XYKM7Ckv4
GOOGLE_AI_PROJECT_ID=1053293898585
GOOGLE_AI_STUDIO_API_KEY=AIzaSyD0yx89zD4kd5qtxyZpaEzO41XYKM7Ckv4
```

**Save:** Ctrl+O, Enter, Ctrl+X

**Replace `yourdomain.com` with your actual domain!**

---

### **STEP 4: Update cPanel Node.js App Settings**

1. **Go to:** cPanel → Setup Node.js App
2. **Find your app** in the list
3. **Click "Edit"** (pencil icon)

**Update these fields:**

| Field | Value |
|-------|-------|
| **Application root** | `whitelabelportal` |
| **Application URL** | `yourdomain.com` |
| **Application startup file** | `dist/index.js` |
| **Node.js version** | 18.x or 20.x |
| **Application mode** | Production |

4. **Scroll to "Environment variables"**
5. **Add these variables one by one:**

Click "Add Variable" for each:

| Variable Name | Variable Value |
|---------------|----------------|
| `DATABASE_URL` | `mysql://whitelabelportal_admin:whitelabelportal_admin@localhost:3306/whitelabelportal_main` |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `SESSION_SECRET` | `your_random_secret_12345` |
| `GOOGLE_CLIENT_ID` | `556742536850-v06apakkgmf23rgm4rm4gjlu4qh2u7gn.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | `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` |
| `GOOGLE_REDIRECT_URI` | `https://yourdomain.com/api/auth/google/callback` |
| `EMAIL_USER` | `hammadisaqib@gmail.com` |
| `EMAIL_PASS` | `bwqxqaroigqzkjqn` |
| `GEMINI_API_KEY` | `AIzaSyD0yx89zD4kd5qtxyZpaEzO41XYKM7Ckv4` |

6. **Click "Save"**

---

### **STEP 5: Verify Files Exist**

```bash
cd /home/whitelabelportal/whitelabelportal

# Check dist/index.js exists
ls -la dist/index.js

# If missing, rebuild:
npm install
npm run build

# Verify it's there now
ls -la dist/index.js
```

---

### **STEP 6: Run Database Migrations**

```bash
cd /home/whitelabelportal/whitelabelportal
npm run db:push
```

Expected output:
```
✓ Schema pushed successfully!
```

---

### **STEP 7: Set Correct Permissions**

```bash
cd /home/whitelabelportal/whitelabelportal

chmod 644 .env
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;
```

---

### **STEP 8: Start Application**

1. **In cPanel:** Setup Node.js App
2. **Find your app**
3. **Click "Start App"**
4. **Wait for status:** "Running" ✅

---

### **STEP 9: Test Application**

**Open these URLs:**

1. **Frontend:**
   ```
   https://yourdomain.com/
   ```
   Should load React app

2. **API:**
   ```
   https://yourdomain.com/api/health
   ```
   Should return JSON

3. **Check logs (SSH):**
   ```bash
   cd /home/whitelabelportal/whitelabelportal
   # If you have logs directory
   tail -f logs/app.log
   ```

---

## 🧪 **Troubleshooting**

### **Still seeing require error?**

**Check if app.js is still there:**
```bash
cd /home/whitelabelportal/whitelabelportal
ls -la app.js
```

If it exists, delete it:
```bash
rm app.js
```

Then in cPanel, make sure **Application startup file** is `dist/index.js` (NOT `app.js`)

---

### **dist/index.js not found?**

**Rebuild the application:**
```bash
cd /home/whitelabelportal/whitelabelportal
npm install
npm run build
```

This creates `dist/index.js` from your TypeScript source.

---

### **Module not found errors?**

**Reinstall dependencies:**
```bash
cd /home/whitelabelportal/whitelabelportal
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

### **Can't connect to database?**

**Verify database exists:**
```bash
mysql -u whitelabelportal_admin -p whitelabelportal_main
# Password: whitelabelportal_admin
```

If connection fails:
1. cPanel → MySQL® Databases
2. Verify `whitelabelportal_main` exists
3. Verify user has ALL PRIVILEGES

---

### **Application won't start?**

**Check Node.js version:**
```bash
node -v
```
Should be v18 or v20.

**In cPanel:**
1. Setup Node.js App → Edit
2. Change Node.js version to 18.x or 20.x
3. Save and restart

---

## 📋 **Final Checklist**

Before starting app:

- [ ] App is at `/home/whitelabelportal/whitelabelportal/` (NOT in public_html)
- [ ] `app.js` is deleted (not needed)
- [ ] `dist/index.js` exists (run `npm run build` if missing)
- [ ] `.env` file exists with DATABASE_URL
- [ ] Application root is: `whitelabelportal`
- [ ] Application startup file is: `dist/index.js`
- [ ] Environment variables set in cPanel
- [ ] Database exists and user has permissions
- [ ] Migrations completed (`npm run db:push`)

---

## 🎯 **Key Points**

1. **No app.js needed:** Modern cPanel runs `dist/index.js` directly
2. **ES Module:** Your project uses `"type": "module"` in package.json
3. **Directory:** Must be `/home/whitelabelportal/whitelabelportal/` NOT in public_html
4. **Startup file:** Must be `dist/index.js` in cPanel settings

---

## ✅ **Quick Command Summary**

```bash
# 1. Move app
cd /home/whitelabelportal
mv public_html/whitelabelportal ./

# 2. Navigate to app
cd whitelabelportal

# 3. Delete app.js if it exists
rm -f app.js

# 4. Create .env
nano .env
# (paste environment variables, save)

# 5. Install & build
npm install
npm run build

# 6. Migrate database
npm run db:push

# 7. Set permissions
chmod 644 .env
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;

# 8. Verify
pwd  # Should show: /home/whitelabelportal/whitelabelportal
ls dist/index.js  # Should exist
cat .env | grep DATABASE_URL  # Should show connection string
```

**Then in cPanel:**
1. Application root: `whitelabelportal`
2. Startup file: `dist/index.js`
3. Add environment variables
4. Start App

---

## 🚀 **Why These Changes?**

### **Why remove app.js?**
- Your project is ES module (`"type": "module"`)
- `app.js` was using CommonJS (`require`, `module.exports`)
- Modern cPanel/Passenger can run ES modules directly
- No conversion layer needed

### **Why dist/index.js?**
- It's the built output from TypeScript
- Already in correct ES module format
- Contains all your server code bundled by esbuild
- Ready to run in production

### **Why move from public_html?**
- Security: Source code shouldn't be in web root
- cPanel requirement: Node.js apps need dedicated directory
- Separation: Keep application code separate from static files

---

## ✅ **Success Indicators**

You've succeeded when:
- ✅ No "require is not defined" error
- ✅ No "DATABASE_URL must be set" error
- ✅ Application shows "Running" in cPanel
- ✅ `https://yourdomain.com/` loads your app
- ✅ API endpoints respond correctly

---

**Follow these steps and your application will start successfully!** 🚀
