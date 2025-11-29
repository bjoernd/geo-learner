# Deployment Guide

## Option 1: Netlify

### Steps:

1. **Sign up at Netlify:** https://www.netlify.com

2. **Create new project:**
   - "Add new site" → "Import an existing project"
   - Connect GitHub repository

3. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Deploy:** Netlify will automatically create a build

### Environment Variables:

None required for this application.

### Custom Domain (optional):

- In Netlify: Site settings → Domain management
- Add custom domain and configure DNS

---

## Option 2: Vercel

### Steps:

1. **Sign up at Vercel:** https://vercel.com

2. **Import project:**
   - Connect GitHub repository

3. **Framework preset:** Vite will be automatically detected

4. **Deploy:** Automatic build and deployment

---

## Option 3: GitHub Pages

### Steps:

1. **Adjust vite.config.ts:**

```typescript
export default defineConfig({
  plugins: [svelte()],
  base: '/geo-learner/', // Repository name
  // ... rest of config
})
```

2. **Add deploy script to `package.json`:**

```json
{
  "scripts": {
    "deploy": "vite build && gh-pages -d dist"
  }
}
```

3. **Install gh-pages:**

```bash
npm install -D gh-pages
```

4. **Deploy:**

```bash
npm run deploy
```

5. **Enable GitHub Pages:**
   - Repository Settings → Pages
   - Source: gh-pages branch

---

## Option 4: Custom Server

### Prerequisites:

- Web server (nginx, Apache, etc.)
- SSH access

### Steps:

1. **Create build:**

```bash
npm run build
```

2. **Upload dist folder:**

```bash
scp -r dist/* user@server:/var/www/html/geo-learner/
```

3. **Nginx configuration (example):**

```nginx
server {
    listen 80;
    server_name geo-learner.example.com;

    root /var/www/html/geo-learner;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

4. **Reload server:**

```bash
sudo systemctl reload nginx
```

---

## Continuous Deployment

### GitHub Actions (for Netlify/Vercel):

These platforms provide automatic deployments on git push.

### GitHub Actions (for custom server):

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - name: Deploy to server
        uses: easingthemes/ssh-deploy@v4
        with:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          SOURCE: "dist/"
          TARGET: "/var/www/html/geo-learner/"
```

---

## Post-Deployment Checks

- [ ] Application loads correctly
- [ ] All game modes work
- [ ] Map is displayed
- [ ] LocalStorage works
- [ ] No console errors
- [ ] Performance is good (< 3s load time)
- [ ] Works on mobile devices
