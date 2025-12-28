#!/bin/bash

###############################################################################
# Frontend Build & Package Script for cPanel Deployment
# Run this on your local machine or CI/CD
###############################################################################

set -e

echo "🎨 Building SolMarket Frontend for cPanel..."
echo "=================================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
API_URL="${API_URL:-https://api.makenadao.com}"
OUTPUT_DIR="out"
PACKAGE_NAME="solmarket-frontend-$(date +%Y%m%d-%H%M%S).zip"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo -e "${RED}❌ package.json not found!${NC}"
  echo "Run this script from the project root directory"
  exit 1
fi

# Set environment variables for build
export NEXT_PUBLIC_API_URL="$API_URL"

echo -e "${YELLOW}🔧 Configuration:${NC}"
echo "  API URL: $API_URL"
echo "  Output: $OUTPUT_DIR"
echo "  Package: $PACKAGE_NAME"
echo ""

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

# Build Next.js static export
echo -e "${YELLOW}🔨 Building Next.js application...${NC}"
npm run build

# Check if build was successful
if [ ! -d "$OUTPUT_DIR" ]; then
  echo -e "${RED}❌ Build failed - $OUTPUT_DIR directory not found${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Build successful${NC}"

# Create .htaccess file for cPanel
echo -e "${YELLOW}📝 Creating .htaccess file...${NC}"

cat > "$OUTPUT_DIR/.htaccess" << 'EOF'
# Enable RewriteEngine
RewriteEngine On

# Force HTTPS (uncomment if you have SSL)
# RewriteCond %{HTTPS} off
# RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Prevent directory browsing
Options -Indexes

# Default document
DirectoryIndex index.html

# Handle Next.js client-side routing
# Serve .html files for extensionless URLs
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.*)$ $1.html [L]

# SPA fallback - if file doesn't exist, serve index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  
  # Images
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/x-icon "access plus 1 year"
  
  # CSS and JavaScript
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
  
  # Fonts
  ExpiresByType font/ttf "access plus 1 year"
  ExpiresByType font/woff "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  
  # HTML (don't cache)
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>

# Compress files
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/xml
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/json
  AddOutputFilterByType DEFLATE application/xml
</IfModule>

# Security headers
<IfModule mod_headers.c>
  # Prevent clickjacking
  Header always set X-Frame-Options "SAMEORIGIN"
  
  # XSS protection
  Header always set X-XSS-Protection "1; mode=block"
  
  # Prevent MIME sniffing
  Header always set X-Content-Type-Options "nosniff"
  
  # Referrer policy
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Error pages (optional)
ErrorDocument 404 /404.html
EOF

echo -e "${GREEN}✓ .htaccess created${NC}"

# Create deployment instructions
echo -e "${YELLOW}📝 Creating deployment instructions...${NC}"

cat > "$OUTPUT_DIR/DEPLOYMENT_INSTRUCTIONS.txt" << EOF
SolMarket Frontend Deployment Instructions
==========================================

Built: $(date)
API URL: $API_URL

cPanel Deployment Steps:
------------------------

1. Log in to cPanel at your hosting provider

2. Go to File Manager

3. Navigate to public_html directory

4. IMPORTANT: Backup existing files!
   - Select all files
   - Click "Compress"
   - Download the backup

5. Delete all existing files in public_html
   (except cgi-bin if it exists)

6. Upload $PACKAGE_NAME to public_html

7. Extract the zip file:
   - Right-click the zip file
   - Click "Extract"
   - Extract to current directory

8. Move files from 'out' folder to public_html root:
   - Select all files inside the 'out' folder
   - Click "Move"
   - Move to /public_html (one level up)

9. Delete the now-empty 'out' folder and zip file

10. Verify .htaccess file exists in public_html

11. Set file permissions (if needed):
    - Files: 644
    - Directories: 755

Testing:
--------

Visit the following URLs to verify deployment:

✓ Homepage: https://makenadao.com/
✓ Marketplace: https://makenadao.com/marketplace
✓ Auctions: https://makenadao.com/auctions
✓ Raffles: https://makenadao.com/raffles
✓ Wallet: https://makenadao.com/wallet

Check for:
- No 404 errors
- All images load
- Navigation works
- API calls work (check browser console)
- Wallet connects properly

Troubleshooting:
----------------

If you see 404 errors:
- Verify .htaccess exists and has correct content
- Check file permissions
- Clear browser cache

If API calls fail:
- Check browser console for CORS errors
- Verify API_URL is correct: $API_URL
- Ensure VPS backend is running

If images don't load:
- Check public_html structure
- Verify files were extracted correctly
- Check file permissions

Support:
--------
See MIGRATION_PLAN.md for complete documentation

EOF

echo -e "${GREEN}✓ Instructions created${NC}"

# Create package
echo -e "${YELLOW}📦 Creating deployment package...${NC}"

cd "$OUTPUT_DIR"
zip -r "../$PACKAGE_NAME" . > /dev/null 2>&1
cd ..

echo -e "${GREEN}✓ Package created: $PACKAGE_NAME${NC}"

# Calculate package size
PACKAGE_SIZE=$(du -h "$PACKAGE_NAME" | cut -f1)

# Display summary
echo ""
echo "=================================================="
echo -e "${GREEN}✅ Frontend Build Complete!${NC}"
echo "=================================================="
echo ""
echo "📦 Package: $PACKAGE_NAME ($PACKAGE_SIZE)"
echo "📁 Output directory: $OUTPUT_DIR"
echo "🔗 API URL: $API_URL"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Upload to cPanel:"
echo "   - Use File Manager upload"
echo "   - Or use FTP/SFTP"
echo "   - Or use this command:"
echo "     scp $PACKAGE_NAME updjaybc@178.32.103.89:/home/updjaybc/public_html/"
echo ""
echo "2. Follow instructions in:"
echo "   $OUTPUT_DIR/DEPLOYMENT_INSTRUCTIONS.txt"
echo ""
echo "3. Test the deployment:"
echo "   https://makenadao.com"
echo ""
echo "📝 Files to upload:"
ls -lh "$PACKAGE_NAME"
echo ""


