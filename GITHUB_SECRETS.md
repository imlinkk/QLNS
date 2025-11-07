# 🔐 GitHub Secrets Setup - Quick Guide

## ⚡ Quick Setup (5 minutes)

### Step 1: Go to Repository Settings

1. Open: https://github.com/imlinkk/QLNS
2. Click **Settings** tab (top right)
3. Click **Secrets and variables** → **Actions** (left sidebar)

### Step 2: Add Secrets

Click **"New repository secret"** button for each secret below:

---

#### Secret 1: FTP_SERVER

- **Name**: `FTP_SERVER`
- **Value**: `imlink.id.vn`

Click **"Add secret"**

---

#### Secret 2: FTP_USERNAME

- **Name**: `FTP_USERNAME`
- **Value**: `link@imlink.id.vn`

Click **"Add secret"**

---

#### Secret 3: FTP_PASSWORD

- **Name**: `FTP_PASSWORD`
- **Value**: `123456`

Click **"Add secret"**

---

### Step 3: Verify Secrets

After adding all 3 secrets, you should see:

```
Repository secrets

FTP_SERVER          Updated X seconds ago
FTP_USERNAME        Updated X seconds ago
FTP_PASSWORD        Updated X seconds ago
```

---

## ✅ Done!

Your CI/CD is now ready. When you push code:

```bash
git add .
git commit -m "Deploy to production"
git push origin fixByAlex
```

GitHub Actions will automatically deploy to: **https://hrm.imlink.id.vn**

---

## 🔍 Visual Guide

```
GitHub Repo → Settings → Secrets and variables → Actions → New repository secret

┌─────────────────────────────────────┐
│  Set a new secret                   │
├─────────────────────────────────────┤
│  Name *                             │
│  ┌───────────────────────────────┐  │
│  │ FTP_SERVER                    │  │
│  └───────────────────────────────┘  │
│                                     │
│  Secret *                           │
│  ┌───────────────────────────────┐  │
│  │ imlink.id.vn                  │  │
│  └───────────────────────────────┘  │
│                                     │
│  [ Add secret ]                     │
└─────────────────────────────────────┘
```

Repeat for `FTP_USERNAME` and `FTP_PASSWORD`.

---

## ⚠️ Important Notes

- Secret names are **case-sensitive**
- Don't add quotes around values
- Secrets are encrypted and hidden after saving
- You can update secrets anytime

---

## 🧪 Test Deployment

After setup, trigger deployment:

**Option 1: Push Code**

```bash
git push origin fixByAlex
```

**Option 2: Manual Trigger**

1. Go to **Actions** tab
2. Click **"🚀 Deploy to Production FTP"**
3. Click **"Run workflow"**
4. Click **"Run workflow"** button

---

## 📊 Check Deployment Status

Watch live deployment:

- https://github.com/imlinkk/QLNS/actions

You'll see:

- ✅ Green checkmark = Success
- ❌ Red X = Failed
- 🔄 Yellow circle = Running

---

## 🎉 Success!

When deployment completes, visit:

- **https://hrm.imlink.id.vn**

Login with:

- Username: `admin`
- Password: `admin123`

---

**Need help?** Check `DEPLOYMENT.md` for detailed troubleshooting.
