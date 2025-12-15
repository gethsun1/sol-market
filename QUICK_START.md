# Quick Start - Build & Deploy to cPanel

## 🎯 Fastest Way to Deploy

### 1. Install Dependencies
```bash
npm install
```

### 2. Build and Package
```bash
npm run build:cpanel
```

This single command will:
- ✅ Build your Next.js application
- ✅ Package all necessary files
- ✅ Create `solmarket-cpanel-deploy.zip` in the project root
- ✅ Exclude unnecessary files automatically

### 3. Upload to cPanel

**Via File Manager:**
1. Log into cPanel
2. Open **File Manager**
3. Navigate to `public_html/` (or your subdomain directory)
4. Click **Upload**
5. Select `solmarket-cpanel-deploy.zip`
6. Wait for upload to complete
7. Right-click the zip file → **Extract**
8. Delete the zip file after extraction

**Via FTP/SFTP:**
1. Upload `solmarket-cpanel-deploy.zip` to your server
2. Extract using cPanel File Manager or SSH

### 4. Configure in cPanel

1. **Create Node.js Application:**
   - Go to **Node.js Selector** in cPanel
   - Click **Create Application**
   - Set Node.js version: **18+**
   - Application root: `/home/username/public_html` (or your path)
   - Application URL: Your domain
   - Startup file: `server.js`

2. **Set Environment Variables:**
   - In Node.js app settings, add all variables from `.env.production.example`
   - See `ENVIRONMENT_SETUP.md` for details

3. **Install Dependencies:**
   - In cPanel Node.js app terminal or SSH:
   ```bash
   npm install --production
   ```

4. **Start Application:**
   - Click **Start** in cPanel Node.js app
   - Check logs for errors

### 5. Update Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Add redirect URI: `https://yourdomain.com/api/auth/callback/google`
3. Save changes

### 6. Test Deployment

Visit your domain and verify:
- ✅ Homepage loads
- ✅ Wallet connection works
- ✅ Google authentication works
- ✅ API routes respond

## 📦 What's in the Zip?

**Included:**
- All source code (app/, components/, lib/, etc.)
- Built Next.js files (.next/ folder, excluding cache)
- Configuration files (package.json, next.config.mjs, etc.)
- Deployment files (server.js, .htaccess, documentation)

**Excluded:**
- node_modules/ (install on server)
- .next/cache/ (regenerated on server)
- .env.local (use cPanel environment variables)
- Development files (.git/, logs, etc.)

## 🆘 Troubleshooting

### Script fails: "archiver not found"
```bash
npm install --save-dev archiver
```

### Script fails: Permission denied (shell script)
```bash
chmod +x scripts/build-for-cpanel.sh
```

### Build fails
- Check all dependencies are installed: `npm install`
- Verify no TypeScript errors
- Check `next.config.mjs` is correct

### Application won't start in cPanel
- Verify Node.js version is 18+
- Check all environment variables are set
- Review application logs in cPanel
- Ensure `server.js` is the startup file

## 📚 More Information

- **Full deployment guide:** `CPANEL_DEPLOYMENT.md`
- **Environment variables:** `ENVIRONMENT_SETUP.md`
- **Deployment checklist:** `DEPLOYMENT_CHECKLIST.md`
- **File upload details:** `UPLOAD_GUIDE.md`

## ✅ Success Checklist

- [ ] Zip file created successfully
- [ ] Zip file uploaded to cPanel
- [ ] Files extracted to domain root
- [ ] Node.js application created
- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Application started
- [ ] Google OAuth redirect URI updated
- [ ] Site accessible and working

---

**That's it!** Your SolMarket Dapp should now be live on cPanel! 🚀
