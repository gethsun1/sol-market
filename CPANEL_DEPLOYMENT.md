# cPanel Deployment Guide for SolMarket Dapp

This guide walks you through deploying the SolMarket Dapp on cPanel using Node.js Selector.

## Prerequisites

1. cPanel access with Node.js Selector enabled
2. Node.js 18+ available in cPanel
3. Domain or subdomain configured
4. All environment variables ready (see `.env.production.example`)

## Step-by-Step Deployment

### Step 1: Verify Node.js Availability

1. Log into your cPanel
2. Look for "Node.js Selector" or "Setup Node.js App" in the Software section
3. Verify Node.js 18 or higher is available
4. If not available, contact your hosting provider

### Step 2: Prepare Your Build Locally

Before uploading, test the production build locally:

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Test the production build
npm start
```

Verify that:
- Build completes without errors
- Application starts on http://localhost:3000
- All pages load correctly
- API routes respond

### Step 3: Upload Files to cPanel

**Files to Upload:**
- All files in the project root (except exclusions below)
- `app/` directory
- `components/` directory
- `lib/` directory
- `public/` directory
- `styles/` directory
- `hooks/` directory
- `shims/` directory
- `package.json`
- `package-lock.json` (if exists)
- `next.config.mjs`
- `tsconfig.json`
- `tailwind.config.ts`
- `postcss.config.mjs`
- `server.js` (created for cPanel)
- `.htaccess` (optional, for static assets)

**Files to EXCLUDE:**
- `node_modules/` (will be installed on server)
- `.next/cache/` (will be regenerated)
- `.env.local` (use cPanel environment variables instead)
- `.git/` (if present)
- Development files

**Upload Methods:**
1. **File Manager:** Use cPanel File Manager to upload files
2. **FTP/SFTP:** Use FileZilla or similar client
3. **SSH:** Use `scp` or `rsync` if SSH access is available

**Recommended Directory Structure:**
- Upload to `public_html/` for main domain
- Or upload to `public_html/subdomain/` for subdomain

### Step 4: Create Node.js Application in cPanel

1. Go to **Node.js Selector** in cPanel
2. Click **Create Application**
3. Configure the application:
   - **Node.js version:** Select 18 or higher
   - **Application mode:** Production
   - **Application root:** `/home/username/public_html` (or your subdomain path)
   - **Application URL:** Select your domain or subdomain
   - **Application startup file:** `server.js`
   - **Application port:** Leave default or note the assigned port

### Step 5: Configure Environment Variables

In the Node.js app settings, add the following environment variables:

**Required Variables:**
```
NODE_ENV=production
DATABASE_URL=your-database-connection-string
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://yourdomain.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_REOWN_PROJECT_ID=your-reown-project-id
NEXT_PUBLIC_SOLANA_CLUSTER=devnet
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_ESCROW_EXPIRY_SECS=259200
NEXT_LANG=en
```

**Important Notes:**
- Replace all placeholder values with actual values
- `NEXTAUTH_URL` must match your production domain exactly (with https://)
- For production, consider using `mainnet-beta` instead of `devnet`
- Use a strong random string for `NEXTAUTH_SECRET` (minimum 32 characters)

### Step 6: Install Dependencies

**Option A: Using cPanel Node.js App Terminal**
1. In Node.js app settings, click "Terminal" or "Run npm install"
2. Run: `npm install --production`

**Option B: Using SSH (if available)**
```bash
cd /home/username/public_html
npm install --production
```

**Option C: Using cPanel File Manager Terminal**
1. Open Terminal in File Manager
2. Navigate to your app directory
3. Run: `npm install --production`

### Step 7: Update Google OAuth Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to your OAuth 2.0 Client
3. Add authorized redirect URI:
   - `https://yourdomain.com/api/auth/callback/google`
4. Save changes

### Step 8: Start the Application

1. In cPanel Node.js app settings, click **Start**
2. Wait for the application to start (check status)
3. View logs to ensure no errors

### Step 9: Verify Deployment

1. **Access your site:** Visit `https://yourdomain.com`
2. **Check homepage:** Verify it loads correctly
3. **Test API routes:** Try accessing `/api/products`
4. **Test wallet connection:** Try connecting a Solana wallet
5. **Test authentication:** Try Google sign-in
6. **Check browser console:** Look for any errors

## Troubleshooting

### Application Won't Start

**Check:**
- Node.js version is 18+
- All dependencies installed (`npm install --production`)
- Environment variables are set correctly
- Port is not in use by another application
- Check application logs in cPanel

**Common Solutions:**
```bash
# Check Node.js version
node --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install --production

# Check logs
# View logs in cPanel Node.js app interface
```

### API Routes Return 404

**Causes:**
- Application not running
- Incorrect routing configuration
- Static export mode enabled (should not be)

**Solutions:**
- Ensure `next.config.mjs` does NOT have `output: 'export'`
- Verify `server.js` is the startup file
- Check that API route files exist in `app/api/`
- Restart the Node.js application

### Database Connection Fails

**Check:**
- `DATABASE_URL` is set correctly
- Database server allows connections from your hosting IP
- SSL mode is correct in connection string
- Firewall allows outbound connections

**Test Connection:**
```bash
# If you have SSH access, test the connection string
node -e "require('@neondatabase/serverless').neon(process.env.DATABASE_URL)"
```

### Environment Variables Not Loading

**Solutions:**
- Verify variables are set in cPanel Node.js app settings (not in `.env` file)
- Restart application after adding variables
- Check variable names match exactly (case-sensitive)
- Ensure no extra spaces or quotes

### Static Assets Not Loading

**Check:**
- File permissions (644 for files, 755 for directories)
- `.htaccess` configuration (if using)
- `public/` folder is uploaded
- Next.js `images: { unoptimized: true }` is set in `next.config.mjs`

### Solana Wallet Connection Issues

**Check:**
- `NEXT_PUBLIC_RPC_URL` is correct and accessible
- RPC endpoint is not rate-limited
- Browser console for Web3 errors
- Network tab for failed requests

## File Permissions

Set correct permissions:
```bash
# Files
find . -type f -exec chmod 644 {} \;

# Directories
find . -type d -exec chmod 755 {} \;

# Executable files (if any)
chmod +x server.js
```

## Security Checklist

- [ ] `.env.local` is not uploaded to server
- [ ] Environment variables are set in cPanel (not in files)
- [ ] HTTPS is enabled (SSL certificate installed)
- [ ] File permissions are correct (644/755)
- [ ] Sensitive files are protected (`.htaccess` rules)
- [ ] Database credentials are secure
- [ ] Google OAuth secrets are protected

## Performance Optimization

1. **Enable Gzip Compression:**
   - Already configured in `.htaccess`
   - Verify it's working in cPanel

2. **Configure Caching:**
   - Static assets cached (configured in `.htaccess`)
   - Next.js automatic caching for API routes

3. **Monitor Resources:**
   - Check CPU and memory usage in cPanel
   - Monitor database connections
   - Review application logs regularly

## Maintenance

**Regular Tasks:**
- Update dependencies: `npm update`
- Monitor application logs
- Check for security updates
- Backup database regularly
- Monitor disk space

**Updating the Application:**
1. Upload new files (overwrite existing)
2. Run `npm install --production` if dependencies changed
3. Restart the Node.js application
4. Test all functionality

## Alternative: Static Export (Not Recommended)

If Node.js is not available, you can use static export, but API routes won't work:

1. Update `next.config.mjs`:
```javascript
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // ... rest of config
}
```

2. Build: `npm run build`
3. Upload `out/` folder contents to `public_html/`
4. Deploy API routes separately (VPS, Railway, etc.)

**Note:** This approach requires a separate backend server for API functionality.

## Support

If you encounter issues:
1. Check cPanel application logs
2. Review browser console errors
3. Check server error logs
4. Verify all environment variables
5. Test locally first to isolate issues

## Next Steps After Deployment

1. Set up domain DNS (if not already done)
2. Install SSL certificate (Let's Encrypt via cPanel)
3. Configure CDN (optional, for better performance)
4. Set up monitoring (optional)
5. Configure backups
6. Test all features thoroughly
