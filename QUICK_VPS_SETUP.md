# Quick VPS Setup - White Label Portal

## 🚀 Fast Track Deployment

### Step 1: Connect to Your VPS
```bash
ssh root@72.61.3.128
```

### Step 2: Run the Automated Script
```bash
# Download and run the deployment script
wget https://raw.githubusercontent.com/HammadiSaqib/whitelabelportalpost/main/vps-deploy.sh
chmod +x vps-deploy.sh
./vps-deploy.sh
```

### Step 3: Manual Setup (Alternative)
If the automated script doesn't work, follow these commands:

```bash
# 1. Update system
apt update && apt upgrade -y

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
apt-get install -y nodejs git postgresql postgresql-contrib nginx

# 3. Clone repository
cd /var/www
git clone https://github.com/HammadiSaqib/whitelabelportalpost.git
cd whitelabelportalpost

# 4. Install dependencies
npm install -g pm2 tsx typescript
npm install

# 5. Setup database
sudo -u postgres createdb whitelabel_portal
sudo -u postgres createuser -P portal_user

# 6. Create environment file
cp .env.production .env
nano .env  # Edit with your settings

# 7. Start application
pm2 start server/index.ts --interpreter tsx --name whitelabel-portal
pm2 save
pm2 startup
```

## 🔧 Configuration Files

### Environment Variables (.env)
```env
DATABASE_URL=postgresql://portal_user:password@localhost:5432/whitelabel_portal
PORT=3000
NODE_ENV=production
JWT_SECRET=your_secret_key
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your_domain.com;
    
    location / {
        root /var/www/whitelabelportalpost/dist;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔍 Verification Commands

```bash
# Check application status
pm2 status

# Check logs
pm2 logs whitelabel-portal

# Check if port is listening
netstat -tlnp | grep :3000

# Check Nginx status
systemctl status nginx

# Test application
curl http://localhost:3000/api/health
```

## 🌐 Access Your Application

After deployment, your application will be available at:
- **HTTP**: `http://72.61.3.128`
- **API**: `http://72.61.3.128/api`

## 🔒 Security Checklist

- [ ] Change default database passwords
- [ ] Update JWT secret in .env
- [ ] Configure firewall (UFW)
- [ ] Set up SSL certificate
- [ ] Regular backups

## 📞 Support Commands

```bash
# Restart application
pm2 restart whitelabel-portal

# Update application
cd /var/www/whitelabelportalpost
git pull origin main
npm install
pm2 restart whitelabel-portal

# View system resources
htop

# Check disk space
df -h
```

---

**Need Help?** Check the full deployment guide in `VPS_DEPLOYMENT_GUIDE.md`