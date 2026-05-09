# Deployment Guide: Vercel + Render

This guide walks through deploying the NovaMind AI chatbot to production using Vercel (frontend) and Render (backend).

---

## 📋 Prerequisites

- GitHub account with the repo pushed
- [Vercel](https://vercel.com) account (free tier available)
- [Render](https://render.com) account (free tier available)
- [Supabase](https://supabase.com) account for PostgreSQL (free tier: 500 MB storage)
- Environment variables ready (API keys, secrets, etc.)

### Required Environment Variables

The app reads the following variables at runtime:

#### Backend

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret used to sign auth tokens
- `OPENAI_API_KEY` - OpenAI API key for chat and embeddings
- `OPENAI_MODEL` - Optional model override, defaults to `gpt-4o-mini`
- `CORS_ORIGIN` - Allowed frontend origin, defaults to `http://localhost:3000`
- `STRIPE_SECRET_KEY` - Stripe secret key for billing
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `STRIPE_PRICE_STARTER` - Stripe price ID for Starter plan
- `STRIPE_PRICE_PRO` - Stripe price ID for Pro plan
- `STRIPE_PRICE_ENTERPRISE` - Stripe price ID for Enterprise plan
- `PORT` - Backend port, defaults to `4000`

#### Frontend

- `NEXT_PUBLIC_API_URL` - Public backend URL, for example `https://kky-chatbot-backend.onrender.com`

---

## 🚀 Step 1: Deploy Database (Supabase PostgreSQL)

### 1.1 Create Supabase Project
1. Go to https://supabase.com
2. Sign up / log in
3. Create a new project:
   - Name: `novamind-ai-db`
   - Region: Choose closest to your users
   - Password: Save securely
4. Wait for project to initialize (~2 min)

### 1.2 Get Connection String
1. Go to **Settings** → **Database** → **Connection Pooling**
2. Copy the connection string (starts with `postgresql://`)
3. Replace `[YOUR-PASSWORD]` with your database password
4. Save as `DATABASE_URL` for later

### 1.3 Create Tables (Prisma Migrate)
Later, after deploying backend, run:
```bash
# From your local repo
cd backend
npx prisma migrate deploy
```

---

## 📱 Step 2: Deploy Frontend (Vercel)

### 2.1 Connect GitHub to Vercel
1. Go to https://vercel.com/new
2. **Import Git Repository** → Select `KKY-chatbot-saas`
3. Click **Import**

### 2.2 Configure Frontend
1. **Framework Preset:** Next.js (auto-detected)
2. **Root Directory:** `frontend`
3. **Build Command:** `npm run build` (auto-filled)
4. **Environment Variables** → Add:
   ```
   NEXT_PUBLIC_API_URL=https://kky-chatbot-backend.onrender.com
   ```
   (We'll get the Render URL after deploying backend)
5. Click **Deploy**

### 2.3 Wait for Deployment
- Vercel builds and deploys automatically
- Frontend URL will be: `https://kky-chatbot-saas.vercel.app` (or custom domain)
- Copy this URL for later

---

## ⚙️ Step 3: Deploy Backend (Render)

### 3.1 Create Web Service on Render
1. Go to https://dashboard.render.com
2. Click **New** → **Web Service**
3. **Connect Repository** → Select `KKY-chatbot-saas`
4. Configure:
   - **Name:** `kky-chatbot-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install --prefix backend && cd backend && npm run build`
   - **Start Command:** `cd backend && npm start`
   - **Root Directory:** `.` (leave empty/default)

### 3.2 Add Environment Variables
Click **Environment** and add:

```env
NODE_ENV=production
DATABASE_URL=postgresql://...      # From Supabase (Step 1.2)
JWT_SECRET=your-random-secret-key-here-min-32-chars
OPENAI_API_KEY=sk_...              # From OpenAI dashboard
OPENAI_MODEL=gpt-4o-mini           # Optional
CORS_ORIGIN=https://kky-chatbot-saas.vercel.app
STRIPE_SECRET_KEY=sk_live_...      # From Stripe dashboard
STRIPE_WEBHOOK_SECRET=whsec_...    # From Stripe webhook settings
STRIPE_PRICE_STARTER=price_...     # From Stripe dashboard
STRIPE_PRICE_PRO=price_...         # From Stripe dashboard
STRIPE_PRICE_ENTERPRISE=price_...  # From Stripe dashboard
PORT=4000
```

**To generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3.3 Deploy
1. Scroll down, click **Create Web Service**
2. Render builds and deploys
3. Copy the backend URL: `https://kky-chatbot-backend.onrender.com`

---

## 🔄 Step 4: Update Frontend with Backend URL

Now that we have the Render backend URL:

### 4.1 Update Vercel Environment Variable
1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Find/Update `NEXT_PUBLIC_API_URL`:
   ```
   NEXT_PUBLIC_API_URL=https://kky-chatbot-backend.onrender.com
   ```
3. Vercel will auto-redeploy

### 4.2 Frontend Environment Summary

The frontend only needs one public variable:

```env
NEXT_PUBLIC_API_URL=https://kky-chatbot-backend.onrender.com
```

---

## 🔐 Step 5: Configure Stripe Webhooks (Optional)

If using payments:

### 5.1 Add Webhook Endpoint
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. **Developers** → **Webhooks**
3. Click **Add Endpoint**
4. **Endpoint URL:**
   ```
   https://kky-chatbot-backend.onrender.com/api/payments/webhook
   ```
5. **Events to send:**
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
6. Click **Add Endpoint**
7. Copy the **Signing Secret** (starts with `whsec_`)
8. Add to Render environment variables as `STRIPE_WEBHOOK_SECRET`

---

## 🌐 Step 6: Setup Custom Domain (Optional)

### Vercel Frontend
1. **Settings** → **Domains**
2. Add your domain: `app.yourdomain.com`
3. Update DNS records as instructed

### Render Backend
1. **Settings** → **Custom Domain**
2. Add: `api.yourdomain.com`
3. Update DNS records

---

## ✅ Step 7: Verify Deployment

### Test Frontend
```bash
curl https://kky-chatbot-saas.vercel.app
```
Should return 200 OK

### Test Backend Health
```bash
curl https://kky-chatbot-backend.onrender.com/api/health
```
Should return `{ "status": "ok" }`

### Test Chat Endpoint
```bash
curl -X POST https://kky-chatbot-backend.onrender.com/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{ "message": "Hello" }'
```

---

## 🗄️ Step 8: Run Database Migrations

Once backend is deployed and database is configured:

```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

This creates all tables in Supabase.

---

## 📊 Monitoring & Logs

### Vercel Logs
- Dashboard → Project → **Deployments** → View build logs

### Render Logs
- Dashboard → Web Service → **Logs** tab

---

## 🆘 Troubleshooting

### Backend won't start
- Check **Render Logs** for errors
- Verify `DATABASE_URL` is correct
- Ensure all required env vars are set

### Frontend can't reach backend
- Check `NEXT_PUBLIC_API_URL` in Vercel env vars
- Test backend health endpoint manually
- Check CORS settings in backend (`src/index.ts`)

### Database connection fails
- Verify Supabase project is active
- Check password in `DATABASE_URL`
- Ensure IP whitelist allows Render's IP (Supabase auto-allows all in free tier)

### Stripe webhooks not firing
- Verify webhook endpoint URL in Stripe dashboard
- Check `STRIPE_WEBHOOK_SECRET` matches
- View webhook logs in Stripe dashboard

---

## 📈 Free Tier Limits

| Service | Free Tier |
|---------|-----------|
| **Vercel** | 100 GB bandwidth/month, unlimited deployments |
| **Render** | 750 free hours/month (1 web service always up) |
| **Supabase** | 500 MB storage, unlimited API calls |

---

## 💰 Estimated Monthly Cost (Production)

- **Vercel:** Free-$20/month
- **Render:** Free-$12/month (web service)
- **Supabase:** Free-$25/month (increased storage)
- **OpenAI:** $5-$100/month (usage-based)
- **Stripe:** 2.9% + $0.30 per transaction

**Total minimum:** ~$20-50/month (or free with free tiers)

---

## 🔄 CI/CD Pipeline

Deployments happen automatically on push to `main`:
1. GitHub Actions runs tests
2. Vercel builds & deploys frontend
3. Render builds & deploys backend

No manual steps needed after initial setup!

---

## 📝 Next Steps

1. ✅ Deploy database (Supabase)
2. ✅ Deploy frontend (Vercel)
3. ✅ Deploy backend (Render)
4. ✅ Connect them together
5. ✅ Run database migrations
6. ✅ Test all endpoints
7. 📊 Monitor logs & performance
8. 🔐 Setup SSL (auto-configured)
9. 📧 Setup error alerts (Render/Vercel dashboards)
10. 🎯 Add custom domain (optional)

---

## 📞 Support

- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Issue Tracker:** https://github.com/kamlesh90256/KKY-chatbot-saas/issues

---

**Your app is now production-ready! 🚀**
