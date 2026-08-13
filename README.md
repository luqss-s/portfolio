This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Keep Supabase Database Alive (Prevent Auto-Pausing)

To prevent the Supabase database from pausing after 1 week of inactivity, two solutions have been set up:

### 1. GitHub Actions (Recommended)
This runs a scheduled workflow directly on GitHub's servers every 3 days. It pings your Supabase REST API directly.
**To set it up:**
1. Go to your GitHub repository settings.
2. Under **Settings** -> **Secrets and variables** -> **Actions**, add two **Repository Secrets**:
   - `SUPABASE_URL`: Your Supabase project URL (e.g. `https://your-project.supabase.co`).
   - `SUPABASE_ANON_KEY`: Your Supabase anonymous API key.
3. The workflow is located at `.github/workflows/keep-alive.yml` and will run automatically. You can also manually trigger it under the **Actions** tab of your repo.

### 2. Public Keep-Alive API Endpoint (External Ping Services)
We created a public, lightweight API endpoint: `/api/keep-alive`. It queries a single record from the database to keep it active.
**To set it up:**
1. Deploy your website to any hosting provider (e.g., Vercel, Netlify).
2. Go to a free uptime monitoring service like [UptimeRobot](https://uptimerobot.com/) or [Cron-job.org](https://cron-job.org/).
3. Add a new HTTP GET monitor pointing to: `https://your-domain.com/api/keep-alive`
4. Set the monitor interval to run every **1 day** or **3 days**.

