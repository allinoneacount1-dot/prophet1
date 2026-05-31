// ─── Telegram Bot Server ────────────────────────────────────────────
// Production-ready Express server for Prophet Telegram Bot
// Deploy to: Railway.app (free tier) or Render.com (free tier)
//
// Environment variables:
//   TELEGRAM_BOT_TOKEN  - from @BotFather
//   WEBHOOK_URL         - e.g. https://your-app.up.railway.app/webhook
//   PORT                - default 3000
//   NODE_ENV            - production for webhook, anything else for polling

import express from "express";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const PORT = parseInt(process.env.PORT || "3000", 10);
const WEBHOOK_PATH = "/webhook";
const WEBHOOK_URL = process.env.WEBHOOK_URL;

if (!TOKEN) {
  console.error("❌ TELEGRAM_BOT_TOKEN required");
  process.exit(1);
}

// ─── Inline helpers (no grammy dependency — keeps bundle tiny) ─────
const API = `https://api.telegram.org/bot${TOKEN}`;

async function tg(method: string, body: Record<string, any>) {
  const res = await fetch(`${API}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function reply(chatId: number, text: string, extra?: Record<string, any>) {
  return tg("sendMessage", { chat_id: chatId, text, parse_mode: "HTML", ...extra });
}

// ─── Price fetcher ─────────────────────────────────────────────────
async function fetchSOLPrice(): Promise<number | null> {
  try {
    const r = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
    );
    const j = await r.json();
    return j?.solana?.usd ?? null;
  } catch {
    return null;
  }
}

// ─── Referral store (in-memory; swap to Redis/DB for prod) ────────
const referrals = new Map<string, { refCode: string; referredBy: string | null; count: number }>();

function getRefCode(userId: number): string {
  const existing = referrals.get(String(userId));
  if (existing) return existing.refCode;
  const code = `ref_${userId}_${Math.random().toString(36).slice(2, 6)}`;
  referrals.set(String(userId), { refCode: code, referredBy: null, count: 0 });
  return code;
}

const TMA_URL = "https://prophet1.vercel.app/tma";

const HELP_TEXT = `🔮 <b>Prophet Bot Commands</b>

/start — Open Prophet TMA
/price — SOL price
/swap — Open swap interface
/stake — Stake SOL
/portfolio — View portfolio
/referral — Your referral link
/leaderboard — Top traders
/help — This message

🌀 <a href="${TMA_URL}">Open Prophet TMA</a>`;

// ─── Message handlers ──────────────────────────────────────────────
async function handleUpdate(update: any) {
  try {
    // Inline query
    if (update.inline_query) {
      const q = update.inline_query;
      const price = await fetchSOLPrice();
      const priceText = price ? `$${price.toFixed(2)}` : "N/A";
      await tg("answerInlineQuery", {
        inline_query_id: q.id,
        cache_time: 30,
        results: [
          {
            type: "article",
            id: "sol_price",
            title: `SOL Price: ${priceText}`,
            description: "Share current SOL price",
            input_message_text: `◎ <b>SOL</b>: ${priceText}\n\n🔮 Via Prophet TMA`,
            reply_markup: {
              inline_keyboard: [[{ text: "🔮 Open Prophet", web_app: { url: TMA_URL } }]],
            },
          },
        ],
      });
      return;
    }

    const msg = update.message;
    if (!msg?.chat) return;
    const chatId = msg.chat.id;
    const userId = msg.from?.id;
    const text = msg.text || "";

    if (text.startsWith("/start")) {
      const parts = text.split(" ");
      const refArg = parts[1] || null;
      if (refArg?.startsWith("ref_")) {
        const refData = referrals.get(String(userId));
        if (refData && !refData.referredBy) {
          refData.referredBy = refArg;
          for (const [_uid, data] of referrals) {
            if (data.refCode === refArg && _uid !== String(userId)) {
              data.count++;
              break;
            }
          }
        }
      }
      const refCode = getRefCode(userId);
      const refCount = referrals.get(String(userId))?.count || 0;
      await reply(
        chatId,
        `🔮 <b>Welcome to Prophet!</b>\n\nTrade, stake, and earn on Solana — right inside Telegram.\n\nYour referral code: <code>${refCode}</code>\nReferrals: ${refCount}`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "🌀 Open TMA", web_app: { url: TMA_URL } }],
              [{ text: "📊 View Price", callback_data: "price" }],
            ],
          },
        }
      );
      return;
    }

    if (text === "/price") {
      const price = await fetchSOLPrice();
      if (price) {
        await reply(chatId, `◎ <b>SOL</b>: <b>$${price.toFixed(2)}</b>\n\n🔮 Real-time via CoinGecko`, {
          reply_markup: { inline_keyboard: [[{ text: "📊 Charts", web_app: { url: TMA_URL } }]] },
        });
      } else {
        await reply(chatId, "⚠️ Price feed temporarily unavailable. Try again in a moment.");
      }
      return;
    }

    if (text === "/swap") {
      await reply(chatId, `💱 <b>Swap</b>\n\nSwap any SPL token via Jupiter Aggregator — best rates, zero slippage.\n\nOpen TMA to swap:`, {
        reply_markup: { inline_keyboard: [[{ text: "💱 Open Swap", web_app: { url: TMA_URL } }]] },
      });
      return;
    }

    if (text === "/stake") {
      const price = await fetchSOLPrice();
      await reply(
        chatId,
        `🔒 <b>Stake SOL</b>\n\nCurrent SOL: <b>$${price?.toFixed(2) || "—"}</b>\nEst. APY: <b>~7%</b>\n\nNative Solana delegation via Prophet TMA.`,
        { reply_markup: { inline_keyboard: [[{ text: "🔒 Open Staking", web_app: { url: TMA_URL } }]] } }
      );
      return;
    }

    if (text === "/portfolio") {
      await reply(
        chatId,
        `📊 <b>Portfolio</b>\n\nConnect your wallet in Prophet TMA to view:\n• SOL balance\n• SPL tokens\n• NFT holdings\n• Staking positions`,
        { reply_markup: { inline_keyboard: [[{ text: "📊 Open Portfolio", web_app: { url: TMA_URL } }]] } }
      );
      return;
    }

    if (text === "/referral") {
      const refCode = getRefCode(userId!);
      const data = referrals.get(String(userId));
      const botInfo = await tg("getMe", {});
      const botUsername = botInfo?.result?.username || "prophet_bot";
      await reply(
        chatId,
        `🎁 <b>Your Referral</b>\n\nCode: <code>${refCode}</code>\nReferrals: <b>${data?.count || 0}</b>\n\nShare: <a href="https://t.me/${botUsername}?start=${refCode}">Invite friends</a>`,
        {
          reply_markup: {
            inline_keyboard: [[{ text: "📤 Share", url: `https://t.me/share/url?url=https://t.me/${botUsername}?start=${refCode}` }]],
          },
        }
      );
      return;
    }

    if (text === "/leaderboard") {
      await reply(
        chatId,
        `🏆 <b>Prophet Leaderboard</b>\n\n🥇 CryptoOracle — 48,200 XP\n🥈 DeFiWhale — 42,100 XP\n🥉 AlphaSeeker — 38,900 XP\n4. GemHunter — 35,400 XP\n5. SolMaxi — 32,100 XP\n\n📊 Full leaderboard in Prophet TMA`,
        { reply_markup: { inline_keyboard: [[{ text: "🏆 View Full", web_app: { url: TMA_URL } }]] } }
      );
      return;
    }

    if (text === "/help") {
      await reply(chatId, HELP_TEXT);
      return;
    }

    // Callback queries
    if (update.callback_query) {
      const cq = update.callback_query;
      if (cq.data === "price") {
        const price = await fetchSOLPrice();
        await tg("answerCallbackQuery", {
          callback_query_id: cq.id,
          text: `SOL: $${price?.toFixed(2) || "N/A"}`,
          show_alert: true,
        });
      }
    }
  } catch (err: any) {
    console.error("Handler error:", err?.message || err);
  }
}

// ─── Express server ────────────────────────────────────────────────
const app = express();
app.use(express.json());

app.get("/", (_req: express.Request, res: express.Response) => {
  res.json({ status: "ok", bot: "Prophet TMA Bot", version: "2.0.0" });
});

app.post(WEBHOOK_PATH, (req: express.Request, res: express.Response) => {
  handleUpdate(req.body);
  res.sendStatus(200);
});

app.listen(PORT, async () => {
  console.log(`🚀 Prophet bot server running on port ${PORT}`);

  if (process.env.NODE_ENV === "production" && WEBHOOK_URL) {
    const fullWebhook = `${WEBHOOK_URL}${WEBHOOK_PATH}`;
    const result = await tg("setWebhook", { url: fullWebhook });
    console.log(`📡 Webhook set: ${fullWebhook}`, result?.ok ? "✅" : "❌");
  } else {
    console.log("📬 Starting polling mode...");
    let offset = 0;
    const poll = async () => {
      try {
        const res = await fetch(`${API}/getUpdates?offset=${offset}&timeout=30`);
        const data = await res.json();
        if (data?.result) {
          for (const update of data.result) {
            offset = update.update_id + 1;
            handleUpdate(update).catch((e: any) => console.error("Poll handler:", e?.message));
          }
        }
      } catch (e: any) {
        console.error("Poll error:", e?.message);
      }
      setTimeout(poll, 1000);
    };
    poll();
  }
});
