# VPS Deployment Guide - White Label Portal

## Server Information
- **VPS IP**: 72.61.3.128
- **Access**: ssh root@72.61.3.128
- **GitHub Repository**: https://github.com/HammadiSaqib/whitelabelportalpost.git

## Step-by-Step Deployment Instructions

### 1. Connect to Your VPS
```bash
ssh root@72.61.3.128
```

### 2. Update System Packages
```bash
# Update package list
apt update && apt upgrade -y

# Install essential packages
apt install -y curl wget git build-essential
```

### 3. Install Node.js (Latest LTS)
```bash
# Install Node.js using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 4. Install PostgreSQL
```bash
# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# Create database and user
sudo -u postgres psql -c "CREATE DATABASE whitelabel_portal;"
sudo -u postgres psql -c "CREATE USER portal_user WITH PASSWORD 'your_secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE whitelabel_portal TO portal_user;"
sudo -u postgres psql -c "ALTER USER portal_user CREATEDB;"
```

### 5. Install PM2 (Process Manager)
```bash
npm install -g pm2
```

### 6. Clone Your Repository
```bash
# Navigate to web directory
cd /var/www

# Clone the repository
git clone https://github.com/HammadiSaqib/whitelabelportalpost.git
cd whitelabelportalpost

# Set proper permissions
chown -R www-data:www-data /var/www/whitelabelportalpost
```

### 7. Install Dependencies
```bash
# Install Node.js dependencies
npm install

# Install global dependencies if needed
npm install -g typescript tsx drizzle-kit
```

### 8. Environment Configuration
```bash
# Create production environment file
cp .env.production .env

# Edit environment variables
nano .env
```

**Required Environment Variables:**
```env
# Database Configuration
DATABASE_URL=postgresql://portal_user:your_secure_password@localhost:5432/whitelabel_portal
PGDATABASE=whitelabel_portal
PGHOST=localhost
PGPORT=5432
PGUSER=portal_user
PGPASSWORD=your_secure_password

# Server Configuration
PORT=3000
NODE_ENV=production

# JWT and Security
JWT_SECRET=your_jwt_secret_key_here
ENCRYPTION_KEY=your_32_character_encryption_key

# Email Configuration (if using email features)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email@domain.com
SMTP_PASS=your_email_password

# Payment Configuration (if using payments)
NMI_API_KEY=your_nmi_api_key
NMI_USERNAME=your_nmi_username
NMI_PASSWORD=your_nmi_password
```

### 9. Database Setup
```bash
# Run database migrations
npm run db:push

# Seed initial data (if available)
npm run db:seed
```

### 10. Build the Application
```bash
# Build the frontend
npm run build

# Build the backend (if separate build needed)
npm run build:server
```

### 11. Configure Nginx (Reverse Proxy)
```bash
# Install Nginx
apt install -y nginx

# Create Nginx configuration
nano /etc/nginx/sites-available/whitelabel-portal
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name your_domain.com www.your_domain.com;  # Replace with your domain

    # Serve static files
    location / {
        root /var/www/whitelabelportalpost/dist;
        try_files $uri $uri/ /index.html;
    }

    # API routes
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Handle uploads
    location /uploads {
        alias /var/www/whitelabelportalpost/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Enable the site
ln -s /etc/nginx/sites-available/whitelabel-portal /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx
systemctl enable nginx
```

### 12. Start the Application with PM2
```bash
# Create PM2 ecosystem file
nano ecosystem.config.js
```

**PM2 Configuration:**
```javascript
module.exports = {
  apps: [{
    name: 'whitelabel-portal',
    script: 'server/index.ts',
    interpreter: 'tsx',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

```bash
# Create logs directory
mkdir -p logs

# Start the application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### 13. Configure Firewall
```bash
# Install and configure UFW
ufw allow ssh
ufw allow 80
ufw allow 443
ufw --force enable
```

### 14. SSL Certificate (Optional but Recommended)
```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d your_domain.com -d www.your_domain.com

# Auto-renewal
crontab -e
# Add this line:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

### 15. Monitoring and Maintenance
```bash
# Check application status
pm2 status
pm2 logs whitelabel-portal

# Check Nginx status
systemctl status nginx

# Check PostgreSQL status
systemctl status postgresql

# Monitor system resources
htop
```

## Useful Commands

### Application Management
```bash
# Restart application
pm2 restart whitelabel-portal

# Stop application
pm2 stop whitelabel-portal

# View logs
pm2 logs whitelabel-portal --lines 100

# Monitor in real-time
pm2 monit
```

### Database Management
```bash
# Connect to PostgreSQL
sudo -u postgres psql whitelabel_portal

# Backup database
pg_dump -U portal_user -h localhost whitelabel_portal > backup.sql

# Restore database
psql -U portal_user -h localhost whitelabel_portal < backup.sql
```

### Updates and Maintenance
```bash
# Update application code
cd /var/www/whitelabelportalpost
git pull origin main
npm install
npm run build
pm2 restart whitelabel-portal
```

## Troubleshooting

### Common Issues
1. **Port already in use**: Check if another service is using port 3000
2. **Database connection failed**: Verify PostgreSQL is running and credentials are correct
3. **Permission denied**: Ensure proper file permissions with `chown -R www-data:www-data`
4. **Build failures**: Check Node.js version compatibility

### Log Locations
- Application logs: `/var/www/whitelabelportalpost/logs/`
- Nginx logs: `/var/log/nginx/`
- PostgreSQL logs: `/var/log/postgresql/`

## Security Recommendations
1. Change default PostgreSQL passwords
2. Use strong JWT secrets
3. Enable firewall (UFW)
4. Install SSL certificates
5. Regular security updates
6. Monitor application logs
7. Backup database regularly

## Performance Optimization
1. Use PM2 cluster mode
2. Enable Nginx gzip compression
3. Set up proper caching headers
4. Monitor resource usage
5. Optimize database queries
6. Use CDN for static assets

---

**Note**: Replace placeholder values (your_domain.com, passwords, API keys) with your actual values before deployment.