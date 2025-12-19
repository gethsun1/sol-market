# Vercel Deployment Guide - SolMarket

## 🚀 Quick Deployment

This guide will help you deploy SolMarket to Vercel with all serverless features enabled.

### Prerequisites

1. **Vercel Account**: Create account at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push code to GitHub
3. **Environment Variables**: Configure all required variables

### 📋 Required Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

#### Database
```
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

#### Authentication
```
NEXTAUTH_SECRET=your-32+character-random-string
NEXTAUTH_URL=https://your-app.vercel.app
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

#### Solana Configuration
```
NEXT_PUBLIC_SOLANA_CLUSTER=devnet
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_ESCROW_EXPIRY_SECS=259200
```

#### Image Upload (Optional but recommended)
```
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### 🛠️ Deployment Steps

#### Step 1: Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

#### Step 2: Configure Build Settings
Vercel automatically configures Next.js, but verify:
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

#### Step 3: Set Environment Variables
1. Go to Project Settings → Environment Variables
2. Add all variables from the list above
3. Mark sensitive ones as "Secret" (🔒)
4. Save and redeploy

#### Step 4: Deploy
Click "Deploy" - Vercel will:
- Install dependencies
- Build the application
- Deploy serverless functions
- Provide you with a production URL

### 🧪 Post-Deployment Testing

After deployment, test these endpoints:

#### Authentication
```bash
curl https://your-app.vercel.app/api/auth/session
```

#### API Health Check
```bash
curl https://your-app.vercel.app/api/products
```

#### Database Connection
```bash
curl -X POST https://your-app.vercel.app/api/products \
  -H "Content-Type: application/json" \
  -d '{"merchantId":"1","name":"Test Product","priceLamports":1000000}'
```

### 📊 Monitoring

#### Vercel Analytics
- Automatically enabled with `@vercel/analytics`
- View page views and performance metrics
- Monitor API usage patterns

#### Error Tracking
- Check Vercel Logs for runtime errors
- Monitor function execution times
- Set up alerts for high error rates

### 🔧 Troubleshooting

#### Common Issues

**1. Database Connection Errors**
```
Error: Connection refused
```
- Verify `DATABASE_URL` is correct
- Check if Neon database is active
- Ensure SSL mode is enabled

**2. Authentication Issues**
```
Error: NEXTAUTH_SECRET not set
```
- Add a strong random secret (32+ characters)
- Verify `NEXTAUTH_URL` matches your Vercel domain

**3. Solana Connection Issues**
```
Error: Failed to connect to devnet
```
- Verify RPC URL is correct
- Check if devnet is operational
- Test with [Solana Explorer](https://explorer.solana.com/?cluster=devnet)

**4. Image Upload Failures**
```
Error: Cloudinary not configured
```
- Add Cloudinary environment variables
- Verify API keys have upload permissions
- Check Cloudinary account limits

#### Debug Mode
For development debugging:
```bash
# Set environment variable in Vercel
NODE_ENV=development

# Or test locally with same environment
vercel env pull .env.local
npm run dev
```

### 🚀 Performance Optimization

#### Edge Functions
For better performance, configure API routes to run on Edge:
```typescript
// In your API route
export const runtime = 'edge'
```

#### Caching
Enable caching for static data:
```typescript
// In API routes
export const revalidate = 60 // 60 seconds
```

#### Image Optimization
Images are automatically optimized through:
- Next.js Image component
- Cloudinary transformations
- WebP format conversion

### 🔒 Security Considerations

#### Rate Limiting
API routes are protected with rate limiting:
- 30 requests per minute per IP
- Configurable in `lib/rate-limit.ts`

#### Environment Security
- All secrets are encrypted in Vercel
- Never commit `.env.local` to Git
- Use Vercel's secret management

#### CORS Configuration
API routes handle CORS for frontend:
```typescript
// Automatic CORS headers
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
```

### 📈 Scaling

#### Database Scaling
- Neon automatically scales with demand
- Monitor connection pool usage
- Consider connection pooling for high traffic

#### Function Scaling
- Vercel automatically scales serverless functions
- Monitor function execution time
- Optimize cold start performance

#### CDN Caching
- Static assets cached globally
- API responses cached when appropriate
- Configure custom cache headers as needed

### 🔄 CI/CD Integration

#### Automatic Deployments
Vercel automatically deploys:
- On every push to main branch
- On pull requests (preview deployments)
- Manual deployments from dashboard

#### Environment Promotion
1. **Preview**: Every PR gets preview URL
2. **Staging**: Deploy to staging branch
3. **Production**: Deploy to main branch

#### Custom Domains
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records
4. Enable automatic HTTPS

### 📞 Support

#### Vercel Support
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Status](https://www.vercel-status.com/)
- [Community Forums](https://vercel.com/discussions)

#### SolMarket Support
- Check GitHub Issues
- Review this deployment guide
- Contact development team

---

## 🎉 Deployment Complete!

Once deployed, your SolMarket will have:
- ✅ Full serverless API functionality
- ✅ Solana blockchain integration
- ✅ Image upload capabilities
- ✅ Authentication with Google OAuth
- ✅ Real-time marketplace features
- ✅ Production-ready error handling

Visit your deployed app and start testing!
