# SSH Deployment Commands for Server 72.61.3.128

## Prerequisites
- Ensure SSH key authentication is set up for root@72.61.3.128
- Verify you have the latest `whitelabel-portal-update.zip` package
- Confirm PM2 is installed and configured on the target server

## Step 1: Upload the Update Package
Upload the `whitelabel-portal-update.zip` file to your server using SCP:

```bash
# Upload the update package
scp whitelabel-portal-update.zip root@72.61.3.128:/root/

# Verify upload was successful
ssh root@72.61.3.128 "ls -la /root/whitelabel-portal-update.zip"
```

## Step 2: SSH into the Server
```bash
ssh root@72.61.3.128
```

## Step 3: Backup Current Installation (Recommended)
```bash
# Create timestamped backup
cd /var/www/html
cp -r whitelabel-portal whitelabel-portal-backup-$(date +%Y%m%d-%H%M%S)

# Verify backup was created
ls -la whitelabel-portal-backup-*
```

## Step 4: Extract and Deploy Updates
```bash
# Navigate to root directory and extract update
cd /root
unzip -o whitelabel-portal-update.zip -d /tmp/whitelabel-update/
cd /tmp/whitelabel-update/

# Stop the application before updating files
pm2 stop whitelabel-portal

# Copy updated files with proper permissions
cp -r dist/* /var/www/html/whitelabel-portal/
cp -r server/* /var/www/html/whitelabel-portal/server/
cp -r shared/* /var/www/html/whitelabel-portal/shared/
cp package.json /var/www/html/whitelabel-portal/
cp package-lock.json /var/www/html/whitelabel-portal/

# Set proper ownership and permissions
chown -R www-data:www-data /var/www/html/whitelabel-portal/
chmod -R 755 /var/www/html/whitelabel-portal/
```

## Step 5: Install Dependencies and Restart
```bash
# Navigate to application directory
cd /var/www/html/whitelabel-portal/

# Install production dependencies
npm install --production --no-optional

# Clear PM2 logs and restart application
pm2 flush whitelabel-portal
pm2 restart whitelabel-portal

# Wait for application to start
sleep 5
```

## Step 6: Verify Deployment
```bash
# Check PM2 status
pm2 status

# Check recent logs for errors
pm2 logs whitelabel-portal --lines 20

# Test application response
curl -I http://localhost:3000

# Check if application is responding on the correct port
netstat -tulpn | grep :3000
```

## Step 7: Cleanup (Optional)
```bash
# Remove temporary files
rm -rf /tmp/whitelabel-update/
rm /root/whitelabel-portal-update.zip

# Remove old backups (keep last 3)
cd /var/www/html
ls -t whitelabel-portal-backup-* | tail -n +4 | xargs rm -rf
```

## Recent Updates Included:
- ✅ Fixed tabs component to use default colors (not brand colors)
- ✅ Updated ProductManager text styling to be professional black/bold
- ✅ Removed comparison functionality from ComprehensiveAnalytics
- ✅ Fixed Badge component references

## SSH Security Best Practices:
- Use SSH key authentication instead of password authentication
- Consider using a non-standard SSH port for additional security
- Regularly update SSH keys and review authorized_keys file
- Monitor SSH access logs: `tail -f /var/log/auth.log`

## Troubleshooting:
If you encounter issues during deployment:

```bash
# Check detailed PM2 logs
pm2 logs whitelabel-portal --lines 50

# Restart with fresh environment
pm2 restart whitelabel-portal --update-env

# Check system resources
free -h
df -h

# Check if port is available
netstat -tulpn | grep :3000

# Check Node.js version compatibility
node --version
npm --version

# Rollback to previous backup if needed
cd /var/www/html
rm -rf whitelabel-portal
mv whitelabel-portal-backup-YYYYMMDD-HHMMSS whitelabel-portal
pm2 restart whitelabel-portal
```

## Quick SSH Commands Reference:
```bash
# Connect to server
ssh root@72.61.3.128

# Upload files
scp file.zip root@72.61.3.128:/root/

# Execute remote command
ssh root@72.61.3.128 "command"

# Copy files from server
scp root@72.61.3.128:/path/to/file ./local-file
```