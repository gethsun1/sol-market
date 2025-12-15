#!/bin/bash

# Build and Package Script for cPanel Deployment
# This script builds the Next.js app and creates a zip file ready for cPanel upload

set -e  # Exit on error

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ZIP_FILE="$ROOT_DIR/solmarket-cpanel-deploy.zip"
TEMP_DIR="$ROOT_DIR/cpanel-deploy-temp"

echo "🚀 Starting cPanel deployment package build..."
echo ""

# Clean previous builds
echo "📦 Step 1: Cleaning previous builds..."
rm -rf "$TEMP_DIR"
rm -f "$ZIP_FILE"
mkdir -p "$TEMP_DIR"
echo "✅ Cleaned previous builds"
echo ""

# Build the Next.js application
echo "🔨 Step 2: Building Next.js application..."
cd "$ROOT_DIR"
NODE_ENV=production npm run build
echo "✅ Build completed successfully"
echo ""

# Copy files to temp directory (excluding unnecessary files)
echo "📋 Step 3: Copying files to deployment package..."

# Copy directories
cp -r "$ROOT_DIR/app" "$TEMP_DIR/"
cp -r "$ROOT_DIR/components" "$TEMP_DIR/"
cp -r "$ROOT_DIR/lib" "$TEMP_DIR/"
cp -r "$ROOT_DIR/hooks" "$TEMP_DIR/"
cp -r "$ROOT_DIR/public" "$TEMP_DIR/"
cp -r "$ROOT_DIR/styles" "$TEMP_DIR/"
cp -r "$ROOT_DIR/shims" "$TEMP_DIR/"

# Copy .next directory but exclude cache
if [ -d "$ROOT_DIR/.next" ]; then
  mkdir -p "$TEMP_DIR/.next"
  rsync -av --exclude='cache' --exclude='server/chunks' "$ROOT_DIR/.next/" "$TEMP_DIR/.next/"
fi

# Copy configuration files
cp "$ROOT_DIR/package.json" "$TEMP_DIR/"
[ -f "$ROOT_DIR/package-lock.json" ] && cp "$ROOT_DIR/package-lock.json" "$TEMP_DIR/"
cp "$ROOT_DIR/next.config.mjs" "$TEMP_DIR/"
cp "$ROOT_DIR/tsconfig.json" "$TEMP_DIR/"
cp "$ROOT_DIR/tailwind.config.ts" "$TEMP_DIR/"
cp "$ROOT_DIR/postcss.config.mjs" "$TEMP_DIR/"
cp "$ROOT_DIR/server.js" "$TEMP_DIR/"

# Copy deployment files
[ -f "$ROOT_DIR/.htaccess" ] && cp "$ROOT_DIR/.htaccess" "$TEMP_DIR/"
[ -f "$ROOT_DIR/.env.production.example" ] && cp "$ROOT_DIR/.env.production.example" "$TEMP_DIR/"
[ -f "$ROOT_DIR/CPANEL_DEPLOYMENT.md" ] && cp "$ROOT_DIR/CPANEL_DEPLOYMENT.md" "$TEMP_DIR/"
[ -f "$ROOT_DIR/DEPLOYMENT_CHECKLIST.md" ] && cp "$ROOT_DIR/DEPLOYMENT_CHECKLIST.md" "$TEMP_DIR/"
[ -f "$ROOT_DIR/UPLOAD_GUIDE.md" ] && cp "$ROOT_DIR/UPLOAD_GUIDE.md" "$TEMP_DIR/"
[ -f "$ROOT_DIR/ENVIRONMENT_SETUP.md" ] && cp "$ROOT_DIR/ENVIRONMENT_SETUP.md" "$TEMP_DIR/"
[ -f "$ROOT_DIR/DEPLOYMENT_SUMMARY.md" ] && cp "$ROOT_DIR/DEPLOYMENT_SUMMARY.md" "$TEMP_DIR/"

echo "✅ Files copied successfully"
echo ""

# Create zip file
echo "📦 Step 4: Creating zip file..."
cd "$TEMP_DIR"
zip -r "$ZIP_FILE" . -q
cd "$ROOT_DIR"

# Get zip file size
ZIP_SIZE=$(du -h "$ZIP_FILE" | cut -f1)
echo "✅ Zip file created: $(basename "$ZIP_FILE")"
echo "   Size: $ZIP_SIZE"
echo "   Location: $ZIP_FILE"
echo ""

# Clean up temp directory
echo "🧹 Cleaning up temporary files..."
rm -rf "$TEMP_DIR"
echo "✅ Cleanup complete"
echo ""

echo "🎉 Deployment package ready!"
echo ""
echo "📤 Next steps:"
echo "   1. Upload the zip file to your cPanel"
echo "   2. Extract it to your domain root (public_html)"
echo "   3. Follow the instructions in CPANEL_DEPLOYMENT.md"
echo ""
echo "   Zip file: $ZIP_FILE"
echo ""
