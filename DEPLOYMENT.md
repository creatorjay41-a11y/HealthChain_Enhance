# Netlify Deployment Guide

## Quick Deploy

### Option 1: Deploy via Netlify CLI

1. Install Netlify CLI globally:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Deploy your site:
```bash
netlify deploy --prod
```

### Option 2: Deploy via Netlify Dashboard

1. Push your code to GitHub, GitLab, or Bitbucket
2. Go to [Netlify Dashboard](https://app.netlify.com/)
3. Click "Add new site" → "Import an existing project"
4. Connect your Git repository
5. Netlify will auto-detect the settings from `netlify.toml`
6. Click "Deploy site"

## Build Configuration

The project is pre-configured with:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 20

These settings are defined in `netlify.toml` and will be automatically detected.

## Environment Variables (Optional)

If you plan to use Supabase features in the future:

1. Go to your Netlify site settings
2. Navigate to "Site configuration" → "Environment variables"
3. Add the following variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Continuous Deployment

Once connected to your Git repository, Netlify will automatically:
- Deploy on every push to your main branch
- Create preview deployments for pull requests
- Run the build command and deploy the `dist` folder

## Custom Domain (Optional)

1. Go to "Site configuration" → "Domain management"
2. Click "Add custom domain"
3. Follow the instructions to configure your DNS

## Build Status

After deployment, your site will be available at:
`https://[your-site-name].netlify.app`

## Troubleshooting

If build fails:
- Check build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility
- Check for any TypeScript errors with `npm run typecheck`

## Performance

The site is optimized for production with:
- Vite's production build optimization
- Code splitting
- Asset optimization
- Fast CDN delivery via Netlify
