# Deployment Checklist for SolMarket Dapp

Use this checklist to ensure all steps are completed before and during deployment.

## Pre-Deployment

### Code Preparation
- [ ] Test build locally: `npm run build`
- [ ] Test production server locally: `npm start`
- [ ] Verify all pages load correctly
- [ ] Test all API routes (`/api/products`, `/api/carts`, etc.)
- [ ] Test Solana wallet connection
- [ ] Test Google authentication flow
- [ ] Verify database operations (create listing, add to cart)
- [ ] Check for console errors in browser
- [ ] Verify no sensitive data in code (API keys, secrets)

### Build Verification
- [ ] Build completes without errors
- [ ] `.next` folder is generated
- [ ] No TypeScript errors (or acceptable errors with `ignoreBuildErrors: true`)
- [ ] Bundle size is reasonable
- [ ] Static assets are optimized

### Environment Variables Preparation
- [ ] `DATABASE_URL` - Neon PostgreSQL connection string ready
- [ ] `NEXTAUTH_SECRET` - Strong random secret (32+ characters) generated
- [ ] `NEXTAUTH_URL` - Production domain URL determined
- [ ] `GOOGLE_CLIENT_ID` - Google OAuth client ID ready
- [ ] `GOOGLE_CLIENT_SECRET` - Google OAuth secret ready
- [ ] `NEXT_PUBLIC_REOWN_PROJECT_ID` - Reown project ID ready
- [ ] `NEXT_PUBLIC_SOLANA_CLUSTER` - Network selected (devnet/mainnet)
- [ ] `NEXT_PUBLIC_RPC_URL` - Solana RPC endpoint URL ready
- [ ] `NEXT_PUBLIC_ESCROW_EXPIRY_SECS` - Escrow expiry time set

### Google OAuth Configuration
- [ ] Google Cloud Console project created/accessed
- [ ] OAuth 2.0 credentials created
- [ ] Authorized redirect URI prepared: `https://yourdomain.com/api/auth/callback/google`
- [ ] Client ID and secret copied

### cPanel Preparation
- [ ] cPanel access confirmed
- [ ] Node.js Selector feature verified available
- [ ] Node.js 18+ version confirmed available
- [ ] Domain/subdomain configured
- [ ] SSL certificate available or can be installed
- [ ] Sufficient disk space available
- [ ] FTP/SFTP or File Manager access confirmed

## Deployment Steps

### File Upload
- [ ] All source files uploaded (app/, components/, lib/, etc.)
- [ ] `package.json` uploaded
- [ ] `next.config.mjs` uploaded
- [ ] `tsconfig.json` uploaded
- [ ] `tailwind.config.ts` uploaded
- [ ] `postcss.config.mjs` uploaded
- [ ] `server.js` uploaded
- [ ] `public/` folder uploaded
- [ ] `.htaccess` uploaded (optional)
- [ ] `node_modules/` NOT uploaded (will install on server)
- [ ] `.next/cache/` NOT uploaded (will regenerate)
- [ ] `.env.local` NOT uploaded (use cPanel env vars)

### Node.js App Configuration
- [ ] Node.js application created in cPanel
- [ ] Node.js version set to 18+
- [ ] Application root path set correctly
- [ ] Application URL configured
- [ ] Startup file set to `server.js`
- [ ] Port number noted (if assigned)

### Environment Variables Setup
- [ ] `NODE_ENV=production` set
- [ ] `DATABASE_URL` set in cPanel
- [ ] `NEXTAUTH_SECRET` set in cPanel
- [ ] `NEXTAUTH_URL` set in cPanel (with https://)
- [ ] `GOOGLE_CLIENT_ID` set in cPanel
- [ ] `GOOGLE_CLIENT_SECRET` set in cPanel
- [ ] `NEXT_PUBLIC_REOWN_PROJECT_ID` set in cPanel
- [ ] `NEXT_PUBLIC_SOLANA_CLUSTER` set in cPanel
- [ ] `NEXT_PUBLIC_RPC_URL` set in cPanel
- [ ] `NEXT_PUBLIC_ESCROW_EXPIRY_SECS` set in cPanel
- [ ] `NEXT_LANG` set in cPanel

### Dependencies Installation
- [ ] Navigated to application directory
- [ ] Ran `npm install --production`
- [ ] Installation completed without errors
- [ ] `node_modules/` folder created

### Google OAuth Update
- [ ] Logged into Google Cloud Console
- [ ] Navigated to OAuth 2.0 Client settings
- [ ] Added redirect URI: `https://yourdomain.com/api/auth/callback/google`
- [ ] Saved changes

### Application Start
- [ ] Clicked "Start" in cPanel Node.js app
- [ ] Application status shows "Running"
- [ ] Checked logs for startup errors
- [ ] No critical errors in logs

## Post-Deployment Verification

### Basic Functionality
- [ ] Homepage loads at `https://yourdomain.com`
- [ ] No 404 errors on main pages
- [ ] CSS/styles loading correctly
- [ ] Images loading correctly
- [ ] No console errors in browser
- [ ] Mobile responsive design works

### API Routes Testing
- [ ] `/api/products` returns data
- [ ] `/api/carts` works
- [ ] `/api/orders` works
- [ ] `/api/auth/[...nextauth]` accessible
- [ ] Database queries execute successfully

### Authentication Testing
- [ ] Google sign-in button appears
- [ ] Clicking sign-in redirects to Google
- [ ] After Google auth, redirects back to site
- [ ] User session created
- [ ] User data stored in database

### Solana Integration Testing
- [ ] Wallet connect button appears
- [ ] Wallet modal opens
- [ ] Can connect Phantom wallet
- [ ] Can connect other Solana wallets
- [ ] Wallet address displays after connection
- [ ] RPC calls work (balance checks, etc.)

### Database Operations Testing
- [ ] Can create marketplace listing
- [ ] Can add products to cart
- [ ] Can create orders
- [ ] Can view transactions
- [ ] User registration works
- [ ] Data persists correctly

### Security Checks
- [ ] HTTPS enabled and working
- [ ] `.env.local` not accessible via URL
- [ ] Sensitive files protected
- [ ] File permissions correct (644/755)
- [ ] CORS configured correctly (if needed)
- [ ] No sensitive data exposed in frontend

### Performance Checks
- [ ] Page load times acceptable
- [ ] API response times reasonable
- [ ] No memory leaks (monitor over time)
- [ ] Static assets cached properly
- [ ] Gzip compression working

## Troubleshooting Log

Document any issues encountered and their solutions:

### Issue 1:
- **Problem:**
- **Solution:**
- **Status:** [ ] Resolved [ ] Pending

### Issue 2:
- **Problem:**
- **Solution:**
- **Status:** [ ] Resolved [ ] Pending

## Maintenance Schedule

- [ ] Set up regular backups (database + files)
- [ ] Monitor application logs weekly
- [ ] Check disk space monthly
- [ ] Update dependencies quarterly
- [ ] Review security settings monthly
- [ ] Monitor performance metrics

## Notes

Add any additional notes or custom configurations here:

---

**Deployment Date:** _______________
**Deployed By:** _______________
**Production URL:** _______________
**Node.js Version:** _______________
**Next.js Version:** _______________
