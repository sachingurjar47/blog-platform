# Deployment Guide for Blog Platform

## Issues Fixed

### 1. **File System Dependency (CRITICAL)**

- **Problem**: Your app uses `fs` operations to read/write `src/data/data.json`
- **Issue**: Serverless functions don't have persistent file system access
- **Solution**: Implemented unified in-memory database for both development and production

### 2. **Async Database Operations**

- **Problem**: Database operations were synchronous
- **Solution**: Updated all API routes to use async/await pattern

### 3. **Environment Variables**

- **Problem**: JWT secret using fallback value
- **Solution**: Added proper environment variable configuration

### 4. **Data Persistence Strategy**

- **Problem**: Inconsistent data storage between dev and prod
- **Solution**: Unified in-memory storage with one-time migration from data.json

## Deployment Steps

### For Vercel (Recommended)

1. **Set Environment Variables**:

   ```bash
   # In Vercel dashboard or CLI
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   NODE_ENV=production
   ```

2. **Deploy**:
   ```bash
   npm run build
   vercel --prod
   ```

### For Netlify

1. **Set Environment Variables**:

   ```bash
   # In Netlify dashboard
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   NODE_ENV=production
   ```

2. **Deploy**:
   ```bash
   npm run build
   netlify deploy --prod
   ```

## Production Database Options

### Option 1: Quick Fix (Current Implementation)

- Uses in-memory storage (data resets on serverless function restart)
- Good for testing, not for production

### Option 2: External Database (Recommended)

Replace the database implementation with:

#### A. PostgreSQL (Recommended)

```bash
# Add to package.json
npm install pg @types/pg
```

#### B. MongoDB

```bash
# Add to package.json
npm install mongodb
```

#### C. Firebase Firestore

```bash
# Add to package.json
npm install firebase-admin
```

## Image Upload Solutions

### Current Issue

- File system uploads won't work in serverless environments

### Solutions

#### A. Cloudinary (Recommended)

```bash
npm install cloudinary
```

#### B. AWS S3

```bash
npm install aws-sdk
```

#### C. Vercel Blob Storage

```bash
npm install @vercel/blob
```

## Testing Deployment

1. **Check API Routes**:

   ```bash
   curl https://your-domain.vercel.app/api/posts
   ```

2. **Test Authentication**:
   ```bash
   curl -X POST https://your-domain.vercel.app/api/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"admin123"}'
   ```

## Common Issues & Solutions

### 1. "Module not found" errors

- Ensure all dependencies are in `package.json`
- Check import paths are correct

### 2. "Function timeout" errors

- Increase timeout in `vercel.json`
- Optimize database queries

### 3. "CORS" errors

- Add proper CORS headers to API routes
- Check domain configuration

### 4. "Database connection" errors

- Verify environment variables
- Check database service status

## Next Steps

1. **Set up external database** (PostgreSQL recommended)
2. **Implement cloud storage** for images (Cloudinary recommended)
3. **Add proper error monitoring** (Sentry recommended)
4. **Set up CI/CD pipeline**
5. **Add database migrations**
6. **Implement caching** (Redis recommended)

## Files Modified

- `src/lib/db.ts` - Added production-safe database layer
- `src/lib/db-production.ts` - Production database implementation
- `src/lib/db-external.ts` - External database template
- `src/pages/api/**/*.ts` - Updated to async operations
- `next.config.ts` - Added production configuration
- `vercel.json` - Added deployment configuration
