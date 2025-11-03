# 📁 cPanel Directory Setup for Node.js Applications

## ⚠️ Important: Do NOT Use public_html for Node.js Apps

**Why?** `public_html` is for static websites and PHP applications, NOT for Node.js applications.

---

## ✅ Correct Directory Structure for cPanel Node.js

### Recommended Setup:

```
/home/yourusername/
├── public_html/              ← For static files ONLY (served by Apache)
│   └── .htaccess            ← Proxy rules to redirect to Node.js app
├── whitelabelportal/         ← Your Node.js application (MAIN APP DIRECTORY)
│   ├── client/
│   ├── server/
│   ├── dist/
│   ├── node_modules/
│   ├── package.json
│   ├── .env
│   └── ... (all your app files)
└── tmp/
    └── restart.txt          ← For Passenger app restarts
```

---

## 🎯 Where to Upload Your Files

### Option 1: Dedicated Application Directory (RECOMMENDED)

**Path:** `/home/yourusername/whitelabelportal`

**Steps:**
1. Create directory in cPanel File Manager or SSH
2. Upload all your project files to this directory
3. Configure Node.js app to point to this directory

**Benefits:**
- ✅ Clean separation from web root
- ✅ Better security
- ✅ Easier to manage
- ✅ Node.js app manager compatible

### Option 2: Subdirectory Outside public_html

**Path:** `/home/yourusername/applications/whitelabelportal`

**Steps:**
1. Create `applications` folder (or any name you prefer)
2. Create `whitelabelportal` subfolder inside
3. Upload files there

---

## 🔧 cPanel Node.js App Configuration

When setting up in **Setup Node.js App**:

### Application Settings:

```
Node.js Version:        18.x or 20.x (latest LTS)
Application Mode:       Development (or Production)
Application Root:       whitelabelportal
                        (or the full path: /home/username/whitelabelportal)
Application URL:        yourdomain.com (or subdomain.yourdomain.com)
Application Startup:    dist/index.js
```

### Important Notes:

- **Application Root** should be OUTSIDE `public_html`
- cPanel will automatically handle routing
- You don't need to manually configure Passenger most of the time

---

## 🌐 How to Serve Static Files

Your React frontend (in `dist/public/`) needs to be accessible via the web. Here are two approaches:

### Approach 1: Let Node.js Serve Everything (RECOMMENDED)

Your Express server already serves static files from `dist/public/`:

```javascript
// In server/index.ts or server/vite.ts
app.use(express.static('dist/public'));
```

**Setup:**
1. Upload app to `/home/username/whitelabelportal`
2. Configure Node.js app to run on your domain
3. Done! Node.js serves both API and frontend

### Approach 2: Hybrid Setup (Apache for Static, Node.js for API)

If you want Apache to serve static files directly:

**Directory Structure:**
```
/home/username/
├── public_html/
│   ├── .htaccess           ← Proxy API requests to Node.js
│   └── (static files)      ← Copy dist/public/* here
└── whitelabelportal/
    └── (Node.js app)       ← Main application
```

**Steps:**
1. Upload Node.js app to `/home/username/whitelabelportal`
2. Copy `dist/public/*` to `/home/username/public_html/`
3. Create `.htaccess` in `public_html` to proxy API calls

---

## 📝 Updated .cpanel.yml

I've updated your `.cpanel.yml` to use the correct path:

```yaml
deployment:
  tasks:
    - export DEPLOYPATH=/home/username/whitelabelportal/
    - /bin/cp -R * $DEPLOYPATH
    - cd $DEPLOYPATH
    - npm install --production
    - npm run build
```

**Remember to replace `username` with your actual cPanel username!**

---

## 🚀 Deployment Steps with Correct Directories

### Step 1: Create Application Directory

**Via cPanel File Manager:**
1. Login to cPanel
2. Open **File Manager**
3. Navigate to home directory (`/home/yourusername/`)
4. Click **+ Folder**
5. Name it `whitelabelportal`
6. Click **Create New Folder**

**Via SSH:**
```bash
mkdir -p ~/whitelabelportal
```

### Step 2: Upload Files

**Via Git (Recommended):**
1. cPanel → **Git™ Version Control**
2. Click **Create**
3. Repository URL: `your-git-repo-url`
4. Repository Path: `/home/yourusername/whitelabelportal`
5. Click **Create**

**Via FTP:**
1. Connect to your cPanel FTP
2. Navigate to `/home/yourusername/`
3. Upload all files to `whitelabelportal/` folder

**Via File Manager:**
1. Upload ZIP to `/home/yourusername/whitelabelportal/`
2. Extract it

### Step 3: Configure Node.js Application

1. cPanel → **Setup Node.js App**
2. Click **Create Application**
3. Fill in:
   - **Application root:** `whitelabelportal`
   - **Application URL:** Your domain
   - **Application startup file:** `dist/index.js`
4. Click **Create**

### Step 4: Set Environment Variables

In the Node.js App interface, add:

```
DATABASE_URL=mysql://whitelabelportal_admin:whitelabelportal_admin@localhost:3306/whitelabelportal_main
NODE_ENV=development
PORT=3000
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback
# ... other variables
```

### Step 5: Install & Build

**Via SSH:**
```bash
cd ~/whitelabelportal
npm install
npm run build
npm run db:push
```

**Or let cPanel do it automatically** when you start the app.

### Step 6: Start Application

In **Setup Node.js App**, click **Start App** (or **Restart App**)

---

## 🔍 Verify Setup

### Check Application is Running:

```bash
# SSH into your server
cd ~/whitelabelportal
ps aux | grep node
```

You should see your Node.js process running.

### Test URLs:

- `https://yourdomain.com/` - Frontend (served by Node.js)
- `https://yourdomain.com/api/health` - API endpoint
- `https://yourdomain.com/api/auth/me` - Auth status

---

## 🛠️ Update Your Deployment Files

### 1. Update `.cpanel.yml`

Replace `username` with your actual cPanel username:

```yaml
- export DEPLOYPATH=/home/YOURUSERNAME/whitelabelportal/
```

### 2. Update deployment scripts

In `deploy.sh` and `quick-deploy.sh`, no changes needed - they work relative to current directory.

### 3. Update documentation

When following guides, replace:
- `/home/username/public_html` → `/home/yourusername/whitelabelportal`
- `public_html` → `whitelabelportal`

---

## ⚠️ Common Mistakes to Avoid

### ❌ DON'T:
- Upload Node.js app files to `public_html`
- Mix PHP and Node.js files in the same directory
- Use `public_html` as Application Root in Node.js setup
- Put `node_modules` in `public_html`

### ✅ DO:
- Create dedicated directory for Node.js app
- Use `public_html` only for `.htaccess` if needed
- Keep Node.js app separate from web root
- Let Node.js serve static files OR copy them separately

---

## 🔒 Security Benefits

Keeping your Node.js app outside `public_html`:

- ✅ Source code not directly accessible via web
- ✅ `.env` file protected from web access
- ✅ `node_modules` not exposed
- ✅ Better separation of concerns
- ✅ Easier to secure with file permissions

---

## 📊 Directory Permissions

Set correct permissions after upload:

```bash
cd ~/whitelabelportal

# Set directory permissions
find . -type d -exec chmod 755 {} \;

# Set file permissions
find . -type f -exec chmod 644 {} \;

# Make scripts executable
chmod +x *.sh
chmod +x node_modules/.bin/*
```

---

## 🆘 Troubleshooting

### "Directory not allowed" error?

**Solution:** Don't use `public_html` for Node.js apps. Use a dedicated directory like `whitelabelportal`.

### Can't find application files?

**Check:**
```bash
cd ~/whitelabelportal
ls -la
```

You should see all your project files.

### Node.js app won't start?

**Verify Application Root:**
1. Go to **Setup Node.js App**
2. Check **Application root** field
3. Should be: `whitelabelportal` (not `public_html/whitelabelportal`)

### Static files not loading?

**Option 1:** Let Node.js serve them (already configured in your app)

**Option 2:** Copy to public_html:
```bash
cp -r ~/whitelabelportal/dist/public/* ~/public_html/
```

---

## 🎯 Recommended Final Structure

```
/home/yourusername/
│
├── whitelabelportal/              ← Main Node.js application
│   ├── client/
│   ├── server/
│   ├── shared/
│   ├── dist/
│   │   ├── index.js              ← Backend bundle
│   │   └── public/               ← Frontend build
│   ├── node_modules/
│   ├── package.json
│   ├── .env
│   ├── .htaccess                 ← Optional, for Apache
│   └── app.js                    ← Passenger startup
│
├── public_html/                   ← Optional: for .htaccess only
│   └── .htaccess                 ← Proxy rules (if needed)
│
└── tmp/
    └── restart.txt               ← Touch to restart app
```

---

## ✅ Quick Setup Checklist

- [ ] Create directory: `/home/yourusername/whitelabelportal`
- [ ] Upload all files to this directory (NOT public_html)
- [ ] Update `.cpanel.yml` with correct username
- [ ] Configure Node.js app with correct Application Root
- [ ] Set environment variables in Node.js app
- [ ] Run `npm install` and `npm run build`
- [ ] Start application via Node.js App Manager
- [ ] Test URLs to verify everything works

---

## 📞 Next Steps

1. **Create the directory** in cPanel File Manager or SSH
2. **Upload your files** to the correct location
3. **Configure Node.js app** pointing to the right directory
4. **Follow the deployment guides** with updated paths

---

**Remember:** Your Node.js application should live in its own directory, NOT in `public_html`!

---

*Updated: 2025-10-18*  
*For: WhiteLabelPortal cPanel Deployment*
