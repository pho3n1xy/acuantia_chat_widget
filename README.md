# Acuantia Chat Widget (Tankbot)

A custom, high-performance static chat widget for the Acuantia / Tank Depot website, built with Next.js and Tailwind CSS. 

This repository contains the frontend user interface that embeds into the Magento store. It connects securely to our custom Python AI Agent hosted on Google Cloud Run.

## Architecture Highlights

- **Framework**: Next.js (React, TypeScript)
- **Styling**: Tailwind CSS & shadcn/ui
- **Chat Components**: `assistant-ui`
- **Deployment Strategy**: Statically exported (`output: "export"`) to raw HTML/CSS/JS.
- **Hosting**: Google Cloud Storage (Bucket) served globally via Google Cloud CDN.
- **Backend API**: The widget sends messages to `/api/chat`. The Google Cloud Load Balancer intercepts these requests and securely tunnels them to the `tankbot-agent` Cloud Run service.

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. 

*Note: In local development, the widget will still try to send messages to `/api/chat`. Unless you are running a local proxy or have configured the Python agent locally, API calls might fail until deployed behind the Load Balancer.*

## Deployment Process

Because this widget relies on Google Cloud CDN and a Load Balancer to route API traffic, the deployment process involves generating a static build and uploading it to our Cloud Storage bucket.

1. **Build the static export:**
```bash
npm run build
```
*This will generate optimized HTML/JS/CSS files into the `out/` directory.*

2. **Upload to Google Cloud Storage:**
```bash
gsutil -m cp -r ./out/* gs://tankbot-widget/
```

3. **Invalidate the CDN Cache** (so users get the update immediately):
```bash
gcloud compute url-maps invalidate-cdn-cache tankbot-url-map --path "/*"
```
