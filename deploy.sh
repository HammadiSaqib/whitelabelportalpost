#!/bin/bash

echo "======================================"
echo "WhiteLabelPortal Deployment Script"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check Node.js version
echo -e "\n${YELLOW}Step 1: Checking Node.js version...${NC}"
node_version=$(node -v)
echo "Node.js version: $node_version"

# Step 2: Install dependencies
echo -e "\n${YELLOW}Step 2: Installing dependencies...${NC}"
npm install --production
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencies installed successfully${NC}"
else
    echo -e "${RED}✗ Failed to install dependencies${NC}"
    exit 1
fi

# Step 3: Build the application
echo -e "\n${YELLOW}Step 3: Building the application...${NC}"
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build completed successfully${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi

# Step 4: Run database migrations
echo -e "\n${YELLOW}Step 4: Running database migrations...${NC}"
npm run db:push
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database migrations completed${NC}"
else
    echo -e "${YELLOW}⚠ Database migrations failed or skipped${NC}"
fi

# Step 5: Create necessary directories
echo -e "\n${YELLOW}Step 5: Creating necessary directories...${NC}"
mkdir -p uploads
mkdir -p logs
chmod 755 uploads
chmod 755 logs
echo -e "${GREEN}✓ Directories created${NC}"

# Step 6: Set file permissions
echo -e "\n${YELLOW}Step 6: Setting file permissions...${NC}"
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;
chmod +x node_modules/.bin/* 2>/dev/null
echo -e "${GREEN}✓ Permissions set${NC}"

echo -e "\n${GREEN}======================================"
echo "Deployment completed successfully!"
echo "======================================${NC}"
echo -e "\nNext steps:"
echo "1. Copy .env.production to .env and update with your cPanel credentials"
echo "2. Update Google OAuth redirect URI in Google Console"
echo "3. Set up MySQL database in cPanel"
echo "4. Configure Node.js app in cPanel Application Manager"
echo "5. Start the application: npm start"
