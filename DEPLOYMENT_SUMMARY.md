# SolMarket Dapp - cPanel Deployment Summary

## ✅ Implementation Complete

All necessary files and configurations have been created for deploying your SolMarket Dapp to cPanel.

## 📁 Files Created

### Core Deployment Files
1. **`server.js`** - Node.js entry point for cPanel
2. **`.htaccess`** - Apache configuration for static assets and routing
3. **`.gitignore`** - Updated to exclude sensitive files

### Documentation Files
1. **`CPANEL_DEPLOYMENT.md`** - Complete step-by-step deployment guide
2. **`DEPLOYMENT_CHECKLIST.md`** - Pre and post-deployment checklist
3. **`UPLOAD_GUIDE.md`** - Detailed file upload instructions
4. **`ENVIRONMENT_SETUP.md`** - Environment variables configuration guide
5. **`.env.production.example`** - Template for environment variables

### Code Updates
1. **`components/appkit/init.ts`** - Updated to use dynamic URL
2. **`components/appkit/provider.tsx`** - Updated to use dynamic URL

## 🚀 Quick Start Guide

### Step 1: Build and Package for cPanel (Easiest Method)

**Automated script (recommended):**
```bash
npm install  # Install dependencies including archiver
npm run build:cpanel
```

This will:
1. Build your Next.js application
2. Create a zip file (`solmarket-cpanel-deploy.zip`) ready for upload
3. Exclude all unnecessary files automatically

**Alternative methods:**
- Shell script: `./scripts/build-for-cpanel.sh` (Linux/Mac)
- Direct: `node scripts/build-for-cpanel.js`

See `README_DEPLOYMENT.md` for details.

### Step 2: Upload to cPanel
1. Upload `solmarket-cpanel-deploy.zip` to cPanel File Manager
2. Extract it to `public_html/` (or your subdomain directory)
3. Delete the zip file after extraction

### Step 3: Verify Prerequisites
- [ ] cPanel access with Node.js Selector enabled
- [ ] Node.js 18+ available
- [ ] Domain/subdomain configured
- [ ] All environment variables prepared (see `.env.production.example`)

### Step 4: Test Build Locally (Optional but Recommended)
```bash
npm install
npm run build
npm start
```
Verify the application runs correctly on `http://localhost:3000`

### Step 4: Configure in cPanel
1. Create Node.js application in cPanel
2. Set startup file to `server.js`
3. Add all environment variables (see `ENVIRONMENT_SETUP.md`)
4. Install dependencies: `npm install --production`
5. Start the application

### Step 5: Update Google OAuth
Add redirect URI in Google Console:
`https://yourdomain.com/api/auth/callback/google`

### Step 6: Verify Deployment
- [ ] Homepage loads
- [ ] API routes work
- [ ] Wallet connection works
- [ ] Google authentication works
- [ ] Database operations work

## 📚 Documentation Reference

| Document | Purpose |
|----------|---------|
| `CPANEL_DEPLOYMENT.md` | Complete deployment walkthrough |
| `DEPLOYMENT_CHECKLIST.md` | Pre/post deployment checklist |
| `UPLOAD_GUIDE.md` | File upload instructions |
| `ENVIRONMENT_SETUP.md` | Environment variables guide |
| `.env.production.example` | Environment variables template |

## 🔑 Key Environment Variables

**Required:**
- `NODE_ENV=production`
- `DATABASE_URL` - Neon PostgreSQL connection
- `NEXTAUTH_SECRET` - 32+ character random string
- `NEXTAUTH_URL` - Your production domain (https://)
- `GOOGLE_CLIENT_ID` - From Google Console
- `GOOGLE_CLIENT_SECRET` - From Google Console
- `NEXT_PUBLIC_REOWN_PROJECT_ID` - From Reown Cloud
- `NEXT_PUBLIC_SOLANA_CLUSTER` - devnet or mainnet-beta
- `NEXT_PUBLIC_RPC_URL` - Solana RPC endpoint

**Optional:**
- `NEXT_PUBLIC_APP_URL` - App URL (auto-detected if not set)
- `NEXT_PUBLIC_ESCROW_EXPIRY_SECS` - Default: 259200
- `NEXT_LANG` - Default: en

## ⚠️ Important Notes

1. **Never upload `.env.local`** - Use cPanel environment variables instead
2. **NEXTAUTH_URL must match domain exactly** - Include https://, no trailing slash
3. **Update Google OAuth redirect URI** - Must match your production domain
4. **Test locally first** - Always test `npm run build && npm start` before deploying
5. **Restart app after env changes** - Environment variables require app restart

## 🔧 Troubleshooting

### Application Won't Start
- Check Node.js version (18+)
- Verify all dependencies installed
- Check application logs in cPanel
- Ensure PORT environment variable is set

### API Routes Return 404
- Verify Next.js server is running (not static export)
- Check `next.config.mjs` doesn't have `output: 'export'`
- Ensure `server.js` is the startup file

### Database Connection Fails
- Verify `DATABASE_URL` is correct
- Check firewall allows outbound connections
- Test connection string from server

### Environment Variables Not Loading
- Check cPanel Node.js app environment variable settings
- Restart application after adding variables
- Verify variable names match exactly (case-sensitive)

## 📞 Next Steps

1. **Read the full guide:** `CPANEL_DEPLOYMENT.md`
2. **Follow the checklist:** `DEPLOYMENT_CHECKLIST.md`
3. **Prepare environment variables:** See `ENVIRONMENT_SETUP.md`
4. **Upload files:** Follow `UPLOAD_GUIDE.md`
5. **Configure and deploy:** Use `CPANEL_DEPLOYMENT.md` step-by-step

## 🎯 Success Criteria

Your deployment is successful when:
- ✅ Application starts without errors
- ✅ Homepage loads correctly
- ✅ API routes respond
- ✅ Wallet connection works
- ✅ Google authentication works
- ✅ Database operations succeed
- ✅ No console errors in browser

## 📝 Additional Resources

- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **cPanel Node.js:** Check your hosting provider's documentation
- **Neon Database:** https://neon.tech/docs
- **Solana RPC:** https://docs.solana.com/cluster/rpc-endpoints
- **NextAuth:** https://next-auth.js.org/configuration/options

---

**Good luck with your deployment!** 🚀

If you encounter issues, refer to the troubleshooting sections in `CPANEL_DEPLOYMENT.md` and `ENVIRONMENT_SETUP.md`.
