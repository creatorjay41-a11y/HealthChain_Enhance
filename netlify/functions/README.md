# Netlify Functions for Health Analytics

This directory contains serverless functions for the Health Analytics application. These functions are optimized for fast response times and are deployed automatically by Netlify.

## Functions Overview

### 1. `health-analytics.ts`
**Endpoint:** `/.netlify/functions/health-analytics`

Retrieves comprehensive health analytics data including metrics, insights, and trends.

**Response:**
```json
{
  "metrics": [...],
  "insights": [...],
  "trends": [...],
  "healthScore": number
}
```

**Cache:** 5 minutes (300 seconds)
**Use Case:** Full page load with all data

### 2. `health-insights.ts`
**Endpoint:** `/.netlify/functions/health-insights`

Returns AI-generated health insights and recommendations.

**Response:**
```json
{
  "insights": [...]
}
```

**Cache:** 10 minutes (600 seconds)
**Use Case:** Insights tab, minimal data needed for quick loads

### 3. `health-metrics.ts`
**Endpoint:** `/.netlify/functions/health-metrics`

Returns current vital signs and health metrics.

**Response:**
```json
{
  "metrics": [...],
  "healthScore": number
}
```

**Cache:** 1 minute (60 seconds)
**Use Case:** Live metrics updates, frequent calls

## Performance Optimization

- **Caching:** Each function uses appropriate cache headers for its data freshness requirements
- **Edge deployment:** Functions run on Netlify's edge network for fast global response
- **Minimal payloads:** Focused endpoints return only necessary data
- **Error handling:** All functions include comprehensive error handling

## Development

Functions are written in TypeScript and automatically transpiled by Netlify's build process.

To test locally with Netlify CLI:
```bash
netlify dev
```

This will start a local development server at `http://localhost:8888` with functions available at `http://localhost:8888/.netlify/functions/`

## Deployment

Functions are automatically deployed when you push to your repository. Netlify will:

1. Detect the functions in `netlify/functions/`
2. Transpile TypeScript to JavaScript
3. Bundle and deploy to the edge network
4. Make them available at `/.netlify/functions/{function-name}`

## Adding New Functions

To add a new function:

1. Create a new `.ts` file in this directory
2. Export a `handler` function with the Netlify Handler type
3. Push to your repository
4. Netlify will automatically deploy it

Example:
```typescript
import { Handler } from '@netlify/functions';

const handler: Handler = async (event, context) => {
  return new Response(JSON.stringify({ data: 'hello' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export { handler };
```

## Troubleshooting

### Slow responses
- Check the cache headers - ensure appropriate cache times are set
- Review the Netlify Analytics to see function duration
- Consider splitting large functions into smaller, more focused ones

### Function not found
- Verify the filename matches the function name (without .ts extension)
- Check that the handler is exported correctly
- Redeploy by pushing changes to your repository

### Connection issues
- Verify that `/.netlify/functions/` is accessible
- Check browser console for CORS errors
- Use Netlify CLI to test functions locally: `netlify dev`
