#!/bin/bash

# Automated Deployment Script for Whitelabel Portal
# Target Server: root@72.61.3.128
# Author: Auto-generated deployment script

set -e  # Exit on any error

# Configuration
SERVER="root@72.61.3.128"
REMOTE_PATH="/var/www/html/whitelabel-portal"
LOCAL_PACKAGE="whitelabel-portal-update.zip"
BACKUP_DIR="/var/www/html"
APP_NAME="whitelabel-portal"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if SSH key is available
    if ! ssh -o BatchMode=yes -o ConnectTimeout=5 $SERVER exit 2>/dev/null; then
        error "Cannot connect to $SERVER. Please ensure SSH key authentication is set up."
    fi
    
    # Check if package exists
    if [ ! -f "$LOCAL_PACKAGE" ]; then
        error "Package $LOCAL_PACKAGE not found. Please create the deployment package first."
    fi
    
    success "Prerequisites check passed"
}

# Create deployment package
create_package() {
    log "Creating deployment package..."
    
    # Remove old package if exists
    [ -f "$LOCAL_PACKAGE" ] && rm "$LOCAL_PACKAGE"
    
    # Create temporary directory
    TEMP_DIR=$(mktemp -d)
    
    # Copy necessary files
    cp -r dist "$TEMP_DIR/"
    cp -r server "$TEMP_DIR/"
    cp -r shared "$TEMP_DIR/"
    cp package.json "$TEMP_DIR/"
    cp package-lock.json "$TEMP_DIR/"
    
    # Create zip package
    cd "$TEMP_DIR"
    zip -r "../$LOCAL_PACKAGE" .
    cd - > /dev/null
    
    # Move package to current directory
    mv "$TEMP_DIR/../$LOCAL_PACKAGE" .
    
    # Cleanup
    rm -rf "$TEMP_DIR"
    
    success "Deployment package created: $LOCAL_PACKAGE"
}

# Upload package to server
upload_package() {
    log "Uploading package to server..."
    
    scp "$LOCAL_PACKAGE" "$SERVER:/root/" || error "Failed to upload package"
    
    # Verify upload
    ssh "$SERVER" "ls -la /root/$LOCAL_PACKAGE" > /dev/null || error "Package not found on server"
    
    success "Package uploaded successfully"
}

# Create backup on server
create_backup() {
    log "Creating backup on server..."
    
    BACKUP_NAME="whitelabel-portal-backup-$(date +%Y%m%d-%H%M%S)"
    
    ssh "$SERVER" "
        cd $BACKUP_DIR
        if [ -d whitelabel-portal ]; then
            cp -r whitelabel-portal $BACKUP_NAME
            echo 'Backup created: $BACKUP_NAME'
        else
            echo 'No existing installation found, skipping backup'
        fi
    " || error "Failed to create backup"
    
    success "Backup created successfully"
}

# Deploy application
deploy_application() {
    log "Deploying application..."
    
    ssh "$SERVER" "
        set -e
        
        # Extract package
        cd /root
        rm -rf /tmp/whitelabel-update
        unzip -o $LOCAL_PACKAGE -d /tmp/whitelabel-update/
        
        # Stop application
        pm2 stop $APP_NAME 2>/dev/null || echo 'Application not running'
        
        # Create directory if not exists
        mkdir -p $REMOTE_PATH
        
        # Deploy files
        cd /tmp/whitelabel-update
        cp -r dist/* $REMOTE_PATH/
        cp -r server/* $REMOTE_PATH/server/
        cp -r shared/* $REMOTE_PATH/shared/
        cp package.json $REMOTE_PATH/
        cp package-lock.json $REMOTE_PATH/
        
        # Set permissions
        chown -R www-data:www-data $REMOTE_PATH 2>/dev/null || chown -R root:root $REMOTE_PATH
        chmod -R 755 $REMOTE_PATH
        
        echo 'Files deployed successfully'
    " || error "Failed to deploy application"
    
    success "Application deployed successfully"
}

# Install dependencies and restart
install_and_restart() {
    log "Installing dependencies and restarting application..."
    
    ssh "$SERVER" "
        set -e
        
        cd $REMOTE_PATH
        
        # Install dependencies
        npm install --production --no-optional
        
        # Clear PM2 logs
        pm2 flush $APP_NAME 2>/dev/null || echo 'No existing logs to clear'
        
        # Start/restart application
        pm2 restart $APP_NAME 2>/dev/null || pm2 start server/index.js --name $APP_NAME
        
        # Wait for application to start
        sleep 5
        
        echo 'Application restarted successfully'
    " || error "Failed to install dependencies or restart application"
    
    success "Dependencies installed and application restarted"
}

# Verify deployment
verify_deployment() {
    log "Verifying deployment..."
    
    ssh "$SERVER" "
        # Check PM2 status
        pm2 status
        
        # Check if application is responding
        sleep 2
        curl -f -s http://localhost:3000 > /dev/null && echo 'Application is responding' || echo 'Application may not be responding'
        
        # Check port
        netstat -tulpn | grep :3000 && echo 'Port 3000 is active' || echo 'Port 3000 not found'
        
        # Show recent logs
        echo '--- Recent logs ---'
        pm2 logs $APP_NAME --lines 10 --nostream
    " || warning "Verification completed with some issues"
    
    success "Deployment verification completed"
}

# Cleanup
cleanup() {
    log "Cleaning up..."
    
    ssh "$SERVER" "
        # Remove temporary files
        rm -rf /tmp/whitelabel-update
        rm -f /root/$LOCAL_PACKAGE
        
        # Keep only last 3 backups
        cd $BACKUP_DIR
        ls -t whitelabel-portal-backup-* 2>/dev/null | tail -n +4 | xargs rm -rf 2>/dev/null || true
        
        echo 'Cleanup completed'
    " || warning "Cleanup completed with some issues"
    
    success "Cleanup completed"
}

# Main deployment function
main() {
    echo "🚀 Starting automated deployment to $SERVER"
    echo "================================================"
    
    check_prerequisites
    create_package
    upload_package
    create_backup
    deploy_application
    install_and_restart
    verify_deployment
    cleanup
    
    echo "================================================"
    success "🎉 Deployment completed successfully!"
    echo ""
    echo "Next steps:"
    echo "- Check application at your domain"
    echo "- Monitor logs: ssh $SERVER 'pm2 logs $APP_NAME'"
    echo "- Check status: ssh $SERVER 'pm2 status'"
}

# Run main function
main "$@"