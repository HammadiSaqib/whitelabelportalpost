#!/bin/bash

# VPS Deployment Script for White Label Portal
# Usage: ./vps-deploy.sh

set -e

echo "🚀 Starting VPS Deployment for White Label Portal..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run this script as root (use sudo)"
    exit 1
fi

print_status "Updating system packages..."
apt update && apt upgrade -y

print_status "Installing essential packages..."
apt install -y curl wget git build-essential htop nano ufw

print_status "Installing Node.js LTS..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
apt-get install -y nodejs

print_status "Installing PostgreSQL..."
apt install -y postgresql postgresql-contrib

print_status "Starting PostgreSQL service..."
systemctl start postgresql
systemctl enable postgresql

print_status "Installing PM2 process manager..."
npm install -g pm2 typescript tsx drizzle-kit

print_status "Installing Nginx..."
apt install -y nginx

print_status "Creating application directory..."
mkdir -p /var/www
cd /var/www

print_status "Cloning repository..."
if [ -d "whitelabelportalpost" ]; then
    print_warning "Directory already exists. Updating..."
    cd whitelabelportalpost
    git pull origin main
else
    git clone https://github.com/HammadiSaqib/whitelabelportalpost.git
    cd whitelabelportalpost
fi

print_status "Setting permissions..."
chown -R www-data:www-data /var/www/whitelabelportalpost

print_status "Installing Node.js dependencies..."
npm install

print_status "Setting up database..."
sudo -u postgres psql -c "CREATE DATABASE whitelabel_portal;" 2>/dev/null || print_warning "Database might already exist"
sudo -u postgres psql -c "CREATE USER portal_user WITH PASSWORD 'SecurePassword123!';" 2>/dev/null || print_warning "User might already exist"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE whitelabel_portal TO portal_user;" 2>/dev/null
sudo -u postgres psql -c "ALTER USER portal_user CREATEDB;" 2>/dev/null

print_status "Creating environment file..."
cat > .env << EOF
# Database Configuration
DATABASE_URL=postgresql://portal_user:SecurePassword123!@localhost:5432/whitelabel_portal
PGDATABASE=whitelabel_portal
PGHOST=localhost
PGPORT=5432
PGUSER=portal_user
PGPASSWORD=SecurePassword123!

# Server Configuration
PORT=3000
NODE_ENV=production

# JWT and Security
JWT_SECRET=your_jwt_secret_key_change_this_in_production
ENCRYPTION_KEY=change_this_32_char_key_in_prod

# Email Configuration (update with your SMTP details)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EOF

print_status "Building the application..."
npm run build 2>/dev/null || print_warning "Build command might not be available"

print_status "Creating PM2 ecosystem file..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'whitelabel-portal',
    script: 'server/index.ts',
    interpreter: 'tsx',
    instances: 1,
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
EOF

print_status "Creating logs directory..."
mkdir -p logs

print_status "Configuring Nginx..."
cat > /etc/nginx/sites-available/whitelabel-portal << EOF
server {
    listen 80;
    server_name _;

    # Serve static files
    location / {
        root /var/www/whitelabelportalpost/dist;
        try_files \$uri \$uri/ /index.html;
    }

    # API routes
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Handle uploads
    location /uploads {
        alias /var/www/whitelabelportalpost/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

print_status "Enabling Nginx site..."
ln -sf /etc/nginx/sites-available/whitelabel-portal /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

print_status "Testing Nginx configuration..."
nginx -t

print_status "Restarting Nginx..."
systemctl restart nginx
systemctl enable nginx

print_status "Setting up firewall..."
ufw allow ssh
ufw allow 80
ufw allow 443
ufw --force enable

print_status "Starting application with PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

print_status "Running database migrations..."
npm run db:push 2>/dev/null || print_warning "Database migration command might not be available"

print_status "🎉 Deployment completed successfully!"
echo ""
print_status "Application Status:"
pm2 status

echo ""
print_status "Next Steps:"
echo "1. Update the .env file with your actual configuration values"
echo "2. Configure your domain name in Nginx configuration"
echo "3. Set up SSL certificate with: certbot --nginx -d yourdomain.com"
echo "4. Monitor logs with: pm2 logs whitelabel-portal"
echo ""
print_status "Your application should be accessible at: http://$(curl -s ifconfig.me)"
EOF