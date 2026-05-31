# ─── Railway Deployment ────────────────────────────────────────────
# Option A: Railway (recommended free tier)
# 1. Push this repo to GitHub
# 2. Go to railway.app → New Project → Deploy from GitHub repo
# 3. Set root directory to /server
# 4. Add environment variables:
#    TELEGRAM_BOT_TOKEN=your_token_here
#    WEBHOOK_URL=https://your-app-name.up.railway.app
#    NODE_ENV=production
#    PORT=3000
# 5. Railway auto-deploys on push
#
# Option B: Render.com (free tier)
# 1. Go to render.com → New Web Service
# 2. Connect GitHub repo, set root to /server
# 3. Build: cd server && npm install
# 4. Start: cd server && npm start
# 5. Add env vars same as above
#    WEBHOOK_URL=https://your-app-name.onrender.com
#
# Option C: Fly.io (free tier)
# 1. fly launch --dockerfile Dockerfile.bot
# 2. fly secrets set TELEGRAM_BOT_TOKEN=xxx
#
# ─── @BotFather Setup ──────────────────────────────────────────────
# 1. Open @BotFather in Telegram
# 2. /newbot → name: "Prophet Bot" → username: prophet_defi_bot
# 3. Copy the bot token → set as TELEGRAM_BOT_TOKEN
# 4. /setdescription → "🔮 Prophet DeFi — Trade, stake, and earn on Solana"
# 5. /setabouttext → "Solana super-app inside Telegram"
# 6. /setuserpic → upload prophet logo
# 7. /setmenubutton → set URL to https://prophet1.vercel.app/tma
# 8. /setcommands → paste:
#    start — Open Prophet TMA
#    price — SOL price
#    swap — Swap tokens
#    stake — Stake SOL
#    portfolio — View portfolio
#    referral — Referral link
#    leaderboard — Top traders
#    help — Show commands
