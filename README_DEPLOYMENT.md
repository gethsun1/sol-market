# Quick Deployment Guide

## Automated Build & Package Script

The easiest way to prepare your application for cPanel deployment is to use the automated build script.

### Option 1: Using npm script (Recommended)

```bash
npm install  # Install dependencies including archiver
npm run build:cpanel
```

This will:
1. Build your Next.js application
2. Package all necessary files into a zip
3. Create `solmarket-cpanel-deploy.zip` in the project root

### Option 2: Using Node.js script directly

```bash
node scripts/build-for-cpanel.js
```

### Option 3: Using shell script (Linux/Mac)

```bash
chmod +x scripts/build-for-cpanel.sh
./scripts/build-for-cpanel.sh
```

## What Gets Packaged

The script automatically includes:
- ✅ All source code (`app/`, `components/`, `lib/`, etc.)
- ✅ Built Next.js files (`.next/` folder, excluding cache)
- ✅ Configuration files (`package.json`, `next.config.mjs`, etc.)
- ✅ Deployment files (`server.js`, `.htaccess`, documentation)
- ✅ Public assets (`public/` folder)

The script automatically excludes:
- ❌ `node_modules/` (install on server)
- ❌ `.next/cache/` (regenerated on server)
- ❌ `.env.local` (use cPanel environment variables)
- ❌ Development files (`.git/`, logs, etc.)

## Uploading to cPanel

1. **Build the package:**
   ```bash
   npm run build:cpanel
   ```

2. **Upload the zip file:**
   - Log into cPanel
   - Go to File Manager
   - Navigate to `public_html/` (or your subdomain directory)
   - Click "Upload"
   - Select `solmarket-cpanel-deploy.zip`
   - Wait for upload to complete

3. **Extract the zip file:**
   - In File Manager, right-click the zip file
   - Select "Extract"
   - Choose extraction location (usually current directory)
   - Click "Extract File(s)"
   - Delete the zip file after extraction

4. **Set up Node.js app:**
   - Follow instructions in `CPANEL_DEPLOYMENT.md`
   - Configure environment variables
   - Install dependencies: `npm install --production`
   - Start the application

## Manual Build (Alternative)

If you prefer to build manually:

```bash
# 1. Build the application
npm run build

# 2. Create a zip file manually
# Include: app/, components/, lib/, hooks/, public/, styles/, shims/,
#          .next/ (excluding cache), package.json, next.config.mjs,
#          tsconfig.json, tailwind.config.ts, postcss.config.mjs,
#          server.js, .htaccess, and documentation files
# Exclude: node_modules/, .next/cache/, .env.local, .git/
```

## Troubleshooting

### Script fails with "archiver not found"
```bash
npm install --save-dev archiver
```

### Script fails with permission error (shell script)
```bash
chmod +x scripts/build-for-cpanel.sh
```

### Zip file is too large
- The script excludes unnecessary files automatically
- If still large, check that `node_modules/` is not included
- Consider using a paid RPC endpoint instead of public Solana RPC

### Build fails
- Ensure all dependencies are installed: `npm install`
- Check for TypeScript errors
- Verify `next.config.mjs` is correct

## Next Steps After Upload

1. Extract the zip file in cPanel File Manager
2. Create Node.js application in cPanel
3. Set environment variables (see `ENVIRONMENT_SETUP.md`)
4. Install dependencies: `npm install --production`
5. Start the application
6. Test the deployment

For detailed instructions, see `CPANEL_DEPLOYMENT.md`.
