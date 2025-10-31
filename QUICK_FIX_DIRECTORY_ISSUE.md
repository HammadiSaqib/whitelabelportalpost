# ⚡ QUICK FIX: "Directory public_html not allowed" Error

## 🎯 The Problem

You're seeing: **"Directory public_html not allowed"**

**Why?** You're trying to use `public_html` as your Node.js application directory, but cPanel Node.js applications should NOT be in `public_html`.

---

## ✅ SOLUTION (3 Steps)

### Step 1: Create Correct Directory

**In cPanel File Manager:**
1. Login to cPanel
2. Click **File Manager**
3. You should be in `/home/yourusername/` (your home directory)
4. Click **+ Folder** button
5. Enter folder name: `whitelabelportal`
6. Click **Create New Folder**

**Or via SSH:**
```bash
mkdir ~/whitelabelportal
```

### Step 2: Upload Files to Correct Location

**Upload your files to:**
```
/home/yourusername/whitelabelportal/
```

**NOT to:**
```
/home/yourusername/public_html/  ❌ WRONG!
```

### Step 3: Configure Node.js App Correctly

When setting up in **Setup Node.js App**:

**Application root field, enter ONLY:**
```
whitelabelportal
```

**NOT:**
```
public_html/whitelabelportal  ❌ WRONG!
/home/username/public_html    ❌ WRONG!
```

---

## 📁 Correct Directory Structure

```
/home/yourusername/
├── whitelabelportal/        ← Upload ALL your files here ✅
│   ├── client/
│   ├── server/
│   ├── dist/
│   ├── package.json
│   └── ... (all files)
│
└── public_html/             ← DON'T upload Node.js app here ❌
    └── (leave empty or use for .htaccess only)
```

---

## 🔧 Updated Files

I've already updated these files for you:

### ✅ `.cpanel.yml` Updated
```yaml
# Now uses correct path
- export DEPLOYPATH=/home/username/whitelabelportal/
```

**Remember:** Replace `username` with YOUR actual cPanel username!

---

## 🚀 Quick Deployment Steps

### 1. Create Directory
```bash
# Via SSH
mkdir ~/whitelabelportal
cd ~/whitelabelportal
```

### 2. Upload Files
- Use **File Manager** → Upload to `/home/yourusername/whitelabelportal/`
- OR use **Git™ Version Control** → Repository path: `whitelabelportal`
- OR use **FTP** → Upload to `whitelabelportal/` folder

### 3. Configure Node.js App
- Go to **Setup Node.js App** → **Create Application**
- **Application root:** Enter `whitelabelportal` (just the folder name)
- **Application URL:** Your domain
- **Startup file:** `dist/index.js`

### 4. Deploy
```bash
cd ~/whitelabelportal
npm install
npm run build
npm run db:push
```

### 5. Start App
In cPanel **Setup Node.js App**, click **Start App**

---

## ✅ Verification

After setup, verify files are in correct location:

```bash
cd ~/whitelabelportal
ls -la
```

You should see:
```
client/
server/
shared/
package.json
.env
... (all your files)
```

---

## 🆘 Still Having Issues?

### Issue: "Cannot find module"
**Solution:** Make sure you're in the right directory
```bash
cd ~/whitelabelportal
pwd  # Should show: /home/yourusername/whitelabelportal
```

### Issue: "Application won't start"
**Solution:** Check Application Root setting
- Should be: `whitelabelportal`
- NOT: `public_html` or `/home/username/public_html`

### Issue: "Permission denied"
**Solution:** Set correct permissions
```bash
cd ~/whitelabelportal
chmod 755 .
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;
```

---

## 📚 Full Documentation

For complete details, see:
- [`CPANEL_DIRECTORY_SETUP.md`](./CPANEL_DIRECTORY_SETUP.md) - Complete directory guide
- [`DEPLOYMENT_INDEX.md`](./DEPLOYMENT_INDEX.md) - All deployment docs

---

## 🎯 Key Takeaway

**Node.js apps go in their own directory, NOT in public_html!**

```
✅ Correct:   /home/yourusername/whitelabelportal/
❌ Wrong:     /home/yourusername/public_html/
```

---

*This is a common cPanel setup requirement. Once you use the correct directory, everything will work!*
