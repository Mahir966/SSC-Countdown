# 🚀 SSC Countdown — Deployment & Operations Manual

> **Production Deployment, Local Hosting, LAN Network Sharing, and Server Operations Guide**  
> **Author:** Mahir Ahmed

---

## 📑 Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Local Hosting (Windows First)](#2-local-hosting-windows-first)
3. [Local Hosting (macOS & Linux)](#3-local-hosting-macos--linux)
4. [LAN / Wi-Fi Network Sharing](#4-lan--wi-fi-network-sharing)
5. [Cloud Production Deployment Guides](#5-cloud-production-deployment-guides)
   - [GitHub Pages (Recommended)](#a-github-pages-recommended)
   - [Vercel](#b-vercel)
   - [Netlify](#c-netlify)
   - [Cloudflare Pages](#d-cloudflare-pages)
   - [Firebase Hosting](#e-firebase-hosting)
6. [Traditional Web Server Configuration (Nginx & Apache)](#6-traditional-web-server-configuration-nginx--apache)
7. [Production Verification Checklist](#7-production-verification-checklist)

---

## 1. Architecture Overview

**SSC Countdown** is a pure static web application. It requires:
- ❌ No Node.js runtime on the server
- ❌ No backend database (MySQL, MongoDB, PostgreSQL)
- ❌ No build pipeline (Webpack, Vite, Rollup)
- ❌ No npm package dependencies
- ✅ Any static file web server or direct browser execution

---

## 2. Local Hosting (Windows First)

### Method A: Direct File Execution (Zero Install)
The fastest way to test the application is to double-click `index.html` or run:

```powershell
# PowerShell
Start-Process "index.html"

# Windows Command Prompt (CMD)
start index.html
```

---

### Method B: Python Built-In HTTP Server (Recommended)
Python comes pre-installed on most modern Windows developer setups.

```powershell
# PowerShell or CMD — Default Port 8080
python -m http.server 8080

# Or Custom Port 3000
python -m http.server 3000
```
Open your browser at: `http://localhost:8080` (or `http://localhost:3000`)

**To Stop Python Server:**
Press `Ctrl + C` in the terminal window.

---

### Method C: Node.js (npx serve / http-server)
If Node.js is installed on your Windows machine:

```powershell
# Using 'serve'
npx serve -l 8080

# Or using 'http-server'
npx http-server -p 8080 -c-1
```
Open your browser at: `http://localhost:8080`

**To Stop Node Server:**
Press `Ctrl + C` in the terminal.

---

### Method D: PHP Built-In Server
If PHP is installed in your PATH:

```powershell
php -S localhost:8080
```

---

## 3. Local Hosting (macOS & Linux)

### Python 3:
```bash
# Terminal (bash / zsh)
python3 -m http.server 8080
```

### Node.js:
```bash
npx serve -l 8080
```

### PHP:
```bash
php -S 0.0.0.0:8080
```

---

## 4. LAN / Wi-Fi Network Sharing

To view and test the application on mobile phones or tablets connected to the same Wi-Fi network:

### Step 1: Find Your Local IP Address

**On Windows (PowerShell):**
```powershell
ipconfig | Select-String "IPv4 Address"
```
*(Example output: `IPv4 Address. . . . . . . . . . . : 192.168.1.15`)*

**On macOS / Linux:**
```bash
ip route get 1 | awk '{print $7}'
# or
ifconfig | grep "inet " | grep -v 127.0.0.1
```

### Step 2: Start Server Bound to All Network Interfaces
```powershell
# Bind to 0.0.0.0 so all LAN devices can connect
python -m http.server 8080 --bind 0.0.0.0
```

### Step 3: Windows Firewall Authorization (If Prompted)
If Windows Firewall prompts you, check **Private networks** and click **Allow access**.  
Alternatively, open port 8080 in PowerShell as Administrator:
```powershell
New-NetFirewallRule -DisplayName "SSC Countdown Web Server" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow
```

### Step 4: Access From Smartphone
Open your mobile browser and navigate to:
```text
http://192.168.1.15:8080
```
*(Replace `192.168.1.15` with your computer's actual IPv4 address)*

---

## 5. Cloud Production Deployment Guides

### A. GitHub Pages (Recommended)

1. Initialize Git repository and commit files:
   ```bash
   git init
   git add .
   git commit -m "Deploy SSC Countdown"
   ```
2. Create a repository on GitHub (e.g. `ssc-countdown`) and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/ssc-countdown.git
   git branch -M main
   git push -u origin main
   ```
3. In your GitHub repository:
   - Go to **Settings > Pages**.
   - Under **Build and deployment > Source**, select **Deploy from a branch**.
   - Select Branch: `main` and Folder: `/ (root)`.
   - Click **Save**.
4. Your site will be live at:
   `https://YOUR_USERNAME.github.io/ssc-countdown/`

---

### B. Vercel

1. Install Vercel CLI (or connect GitHub repository via vercel.com):
   ```bash
   npx vercel
   ```
2. Follow the interactive prompts (defaults are optimal for static sites).
3. Production deployment:
   ```bash
   npx vercel --prod
   ```

---

### C. Netlify

**Method 1 (Drag and Drop):**
1. Visit [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag the `ssc-countdown/` folder directly onto the browser window.
3. Your site deploys in 5 seconds with a free SSL certificate.

**Method 2 (CLI):**
```bash
npx netlify-cli deploy --prod --dir=.
```

---

### D. Cloudflare Pages

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Compute (Workers & Pages) > Pages > Create a project**.
3. Choose **Direct Upload** (drag & drop folder) or **Connect to Git**.
4. Deployment completes instantly across Cloudflare's global edge network.

---

### E. Firebase Hosting

```bash
# 1. Login
npx firebase login

# 2. Initialize
npx firebase init hosting
# (Set public directory to '.' and configure as single-page app: No)

# 3. Deploy
npx firebase deploy --only hosting
```

---

## 6. Traditional Web Server Configuration (Nginx & Apache)

### Nginx Virtual Host Configuration:
```nginx
server {
    listen 80;
    server_name ssc.yourdomain.com;
    root /var/www/ssc-countdown;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # Enable gzip compression for lightning fast transfer
    gzip on;
    gzip_types text/plain text/css application/javascript image/svg+xml;

    # Browser caching headers for static assets
    location ~* \.(css|js|svg)$ {
        expires 7d;
        add_header Cache-Control "public, no-transform";
    }
}
```

### Apache `.htaccess`:
```apache
<IfModule mod_mime.c>
    AddType image/svg+xml .svg
    AddType text/css .css
    AddType application/javascript .js
</IfModule>

<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml
</IfModule>
```

---

## 7. Production Verification Checklist

Before public distribution, verify the following operational checks:

- [x] **File Structure Integrity:** `index.html`, `style.css`, `script.js`, `favicon.svg`, `README.md` present.
- [x] **Clean Directory:** No `.git`, `node_modules`, temporary files, or cache in production bundle.
- [x] **Timezone Synchronization:** Countdown calculates in `Asia/Dhaka` regardless of visitor's local machine clock.
- [x] **Class 1 → SSC Progress:** Dynamic calculation verified across all batches.
- [x] **Theme Persistence:** Dark and light modes toggle cleanly and persist on refresh.
- [x] **Mobile Responsiveness:** Tested on 320px, 375px, 640px, 768px, and desktop displays.
- [x] **Portfolio Link:** Mahir Ahmed's link points to `https://mahir966.github.io/mahir.github.io/`.
- [x] **Console Cleanliness:** Zero errors or warnings in browser developer tools console.
