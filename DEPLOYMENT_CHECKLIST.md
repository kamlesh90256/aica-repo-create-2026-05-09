# 🚀 Deployment Checklist: Vercel + Render

Complete these steps to deploy your app to production.

---

## ✅ Pre-Deployment (Local)

- [ ] All code pushed to GitHub `main` branch
- [ ] `.env` files are **NOT** committed (they're in `.gitignore`)
- [ ] `vercel.json` exists in root ✓
- [ ] `render.yaml` exists in root ✓

---

## 📱 Step 1: Deploy Database (Supabase) - 5 min

1. [ ] Go to https://supabase.com
2. [ ] Create new project
   - Name: `novamind-ai-db`
   - Region: Closest to users
3. [ ] Go to **Settings** → **Database** → **Connection Pooling**
4. [ ] Copy connection string
5. [ ] Replace `[YOUR-PASSWORD]` with database password
6. [ ] Save as `DATABASE_URL` (you'll need this in Step 3 & 4)

**Example:** `postgresql://postgres:PASSWORD@db.XXXX.supabase.co:5432/postgres`

---

## 🌐 Step 2: Deploy Frontend (Vercel) - 3 min

### 2.1 Connect to Vercel
1. [ ] Go to https://vercel.com/new
2. [ ] Sign in with GitHub
3. [ ] **Import Git Repository** → Search for `KKY-chatbot-saas`
4. [ ] Click **Import**

### 2.2 Configure Project
1. [ ] **Framework Preset:** Next.js (auto-detected)
2. [ ] **Root Directory:** `frontend`
3. [ ] Leave build settings as default
4. [ ] Click **Deploy**
5. [ ] Wait for deployment to complete (2-3 min)
6. [ ] Copy frontend URL: `https://kky-chatbot-saas.vercel.app`

---

## ⚙️ Step 3: Deploy Backend (Render) - 5 min

### 3.1 Create Web Service
1. [ ] Go to https://dashboard.render.com
2. [ ] Click **New** → **Web Service**
3. [ ] **Connect Repository** → Select `KKY-chatbot-saas`
4. [ ] Configure:
   - [ ] **Name:** `kky-chatbot-backend`
   - [ ] **Environment:** `Node`
   - [ ] **Build Command:** `npm install --prefix backend && cd backend && npm run build`
   - [ ] **Start Command:** `cd backend && npm start`

### 3.2 Add Environment Variables
Click **Environment** and add these variables:

```
NODE_ENV=production
DATABASE_URL=postgresql://...  (from Step 1)
JWT_SECRET=<generate-below>
OPENAI_API_KEY=sk_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_ENTERPRISE=price_...
PORT=4000
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Get API keys from:**
- OpenAI: https://platform.openai.com/api-keys
- Stripe: https://dashboard.stripe.com/apikeys

### 3.3 Deploy
1. [ ] Scroll down, click **Create Web Service**
2. [ ] Wait for deployment (5-10 min)
3. [ ] Go to **Settings** → **Domains**
4. [ ] Copy your Render URL: `https://kky-chatbot-backend.onrender.com`

---

## 🔄 Step 4: Connect Frontend to Backend

### 4.1 Update Vercel Environment Variable
1. [ ] Go to Vercel Dashboard → Your Project
2. [ ] Click **Settings** → **Environment Variables**
3. [ ] Find `NEXT_PUBLIC_API_URL`
4. [ ] Set value to: `https://kky-chatbot-backend.onrender.com`
5. [ ] Click **Save**
6. [ ] Go to **Deployments** → Click latest → **Redeploy**

---

## 🗄️ Step 5: Run Database Migrations

1. [ ] From your local machine:
```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

2. [ ] This creates all tables in Supabase

---

## 🔐 Step 6: Configure Stripe Webhooks (If using payments)

1. [ ] Go to https://dashboard.stripe.com
2. [ ] **Developers** → **Webhooks** → **Add Endpoint**
3. [ ] Endpoint URL: `https://kky-chatbot-backend.onrender.com/api/payments/webhook`
4. [ ] Select events:
   - [ ] `checkout.session.completed`
   - [ ] `customer.subscription.updated`
   - [ ] `customer.subscription.deleted`
5. [ ] Click **Add Endpoint**
6. [ ] Copy **Signing Secret** (starts with `whsec_`)
7. [ ] Add to Render env vars as `STRIPE_WEBHOOK_SECRET`

---

## ✅ Step 7: Verify Deployment

### Test Frontend
```bash
curl https://kky-chatbot-saas.vercel.app
# Should return 200 OK
```

### Test Backend Health
```bash
curl https://kky-chatbot-backend.onrender.com/api/health
# Should return: {"status":"ok"}
```

### Test Chat Endpoint
```bash
curl -X POST https://kky-chatbot-backend.onrender.com/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'
# Should return streaming response
```

---

## 🎉 You're Live!

Your production app is now running at:
- **Frontend:** https://kky-chatbot-saas.vercel.app
- **Backend API:** https://kky-chatbot-backend.onrender.com

---

## 📊 Monitor Deployments

### Vercel Logs
- Dashboard → Project → **Deployments** → View logs

### Render Logs
- Dashboard → Service → **Logs** tab

### Errors?
- Check logs for error messages
- Verify environment variables are set correctly
- Ensure database connection string is valid

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check Render logs; verify `DATABASE_URL` is correct |
| Frontend can't reach backend | Check `NEXT_PUBLIC_API_URL` in Vercel env vars |
| Database connection fails | Verify Supabase password and URL in `DATABASE_URL` |
| Stripe webhooks not firing | Check webhook endpoint URL and signing secret match |
| Build fails | Check build logs in Vercel/Render; ensure dependencies are installed |

---

## 📈 Next Steps

1. [ ] Monitor application in production
2. [ ] Setup error tracking (Sentry, LogRocket, etc.)
3. [ ] Setup monitoring alerts
4. [ ] Add custom domain (optional)
5. [ ] Setup automated backups for database
6. [ ] Monitor API usage and costs

---

**Questions?** Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed info.

**Status:** Ready to deploy! 🚀
