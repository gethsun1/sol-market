# File Upload Guide for cPanel Deployment

This guide specifies exactly which files to upload and which to exclude when deploying to cPanel.

## Files to UPLOAD

### Root Directory Files
- ✅ `package.json`
- ✅ `package-lock.json` (if exists)
- ✅ `next.config.mjs`
- ✅ `tsconfig.json`
- ✅ `tailwind.config.ts`
- ✅ `postcss.config.mjs`
- ✅ `server.js` (created for cPanel)
- ✅ `.htaccess` (optional, for static assets)
- ✅ `README.md` (optional)
- ✅ `CPANEL_DEPLOYMENT.md` (deployment guide)
- ✅ `DEPLOYMENT_CHECKLIST.md` (checklist)

### Source Code Directories
- ✅ `app/` (entire directory)
- ✅ `components/` (entire directory)
- ✅ `lib/` (entire directory)
- ✅ `hooks/` (entire directory)
- ✅ `public/` (entire directory)
- ✅ `styles/` (entire directory)
- ✅ `shims/` (entire directory)

### Configuration Files
- ✅ `.env.production.example` (template, not actual values)

## Files to EXCLUDE (Do NOT Upload)

### Build and Cache Files
- ❌ `.next/` (entire directory - will be regenerated on server)
- ❌ `.next/cache/` (will be regenerated)
- ❌ `out/` (if exists from static export)

### Dependencies
- ❌ `node_modules/` (entire directory - install on server)

### Environment and Secrets
- ❌ `.env.local` (use cPanel environment variables instead)
- ❌ `.env` (if exists)
- ❌ `.env.production` (if exists, use cPanel env vars)
- ❌ Any file containing actual secrets or API keys

### Version Control
- ❌ `.git/` (entire directory)
- ❌ `.gitignore` (not needed on server)

### Development Files
- ❌ `*.log` (log files)
- ❌ `.DS_Store` (macOS)
- ❌ `Thumbs.db` (Windows)
- ❌ `.vscode/` (VS Code settings)
- ❌ `.idea/` (IntelliJ settings)
- ❌ `*.swp` (vim swap files)
- ❌ `*.swo` (vim swap files)

### Other Project Directories (if not needed)
- ❌ `SolMarket/` (if this is a duplicate/old version)
- ❌ `Mashar/` (if this is a different project)
- ❌ `anchor/` (if Solana program development files)

## Upload Methods

### Method 1: cPanel File Manager
1. Log into cPanel
2. Open **File Manager**
3. Navigate to `public_html/` (or subdomain directory)
4. Click **Upload**
5. Select files/folders to upload
6. Wait for upload to complete

**Note:** File Manager may have file size limits. For large uploads, use FTP/SFTP.

### Method 2: FTP/SFTP Client (Recommended)
1. Use FileZilla, WinSCP, or similar client
2. Connect using cPanel FTP credentials
3. Navigate to `public_html/` directory
4. Upload files maintaining directory structure
5. Set permissions after upload (644 for files, 755 for directories)

**FTP Settings:**
- Host: `ftp.yourdomain.com` or server IP
- Port: 21 (FTP) or 22 (SFTP)
- Username: Your cPanel username
- Password: Your cPanel password

### Method 3: SSH/SCP (If SSH Access Available)
```bash
# From your local machine
scp -r app/ components/ lib/ user@server:/home/username/public_html/
scp package.json next.config.mjs server.js user@server:/home/username/public_html/
```

### Method 4: Git (If Repository Access)
If you have Git access on the server:
```bash
# On server
cd /home/username/public_html
git clone your-repo-url .
# Then remove .git and install dependencies
rm -rf .git
npm install --production
```

## Directory Structure After Upload

Your cPanel directory should look like this:

```
public_html/
├── app/
│   ├── api/
│   ├── auctions/
│   ├── cart/
│   ├── checkout/
│   ├── dashboard/
│   ├── marketplace/
│   ├── raffles/
│   ├── register/
│   ├── shop/
│   ├── transactions/
│   ├── wallet/
│   ├── web3-news/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── lib/
├── hooks/
├── public/
├── styles/
├── shims/
├── package.json
├── package-lock.json
├── next.config.mjs
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── server.js
└── .htaccess
```

## File Permissions

After uploading, set correct permissions:

**Via File Manager:**
1. Select files/folders
2. Right-click → Change Permissions
3. Set:
   - Files: 644
   - Directories: 755

**Via SSH:**
```bash
# Files
find . -type f -exec chmod 644 {} \;

# Directories
find . -type d -exec chmod 755 {} \;

# Executable (if needed)
chmod +x server.js
```

## Verification After Upload

1. **Check File Count:**
   ```bash
   # Should see your source files, not node_modules
   ls -la
   ```

2. **Verify Structure:**
   - `app/` directory exists
   - `components/` directory exists
   - `package.json` exists
   - `server.js` exists

3. **Check Permissions:**
   ```bash
   ls -l
   # Files should show 644, directories 755
   ```

## Quick Upload Checklist

- [ ] All source directories uploaded (app/, components/, lib/, etc.)
- [ ] Configuration files uploaded (package.json, next.config.mjs, etc.)
- [ ] server.js uploaded
- [ ] public/ folder uploaded
- [ ] node_modules/ NOT uploaded
- [ ] .next/ NOT uploaded
- [ ] .env.local NOT uploaded
- [ ] File permissions set correctly
- [ ] Directory structure maintained

## Troubleshooting Upload Issues

### Issue: Upload Fails - File Too Large
**Solution:** Use FTP/SFTP instead of File Manager, or increase PHP upload limits in cPanel

### Issue: Files Upload But Don't Appear
**Solution:** 
- Check you're in the correct directory
- Refresh File Manager
- Check file permissions

### Issue: Directory Structure Broken
**Solution:**
- Re-upload maintaining folder structure
- Use FTP client that preserves structure
- Or create directories manually first, then upload files

### Issue: Special Characters in Filenames
**Solution:**
- Avoid special characters in filenames
- Use only alphanumeric, dash, and underscore
