// ─── Telegram Bot Server ────────────────────────────────────────────
// Simple bot server using grammy framework
// Deploy to: Railway, Render, or any Node.js host

/**
 * Setup instructions:
 * 1. npm install grammy @grammyjs/validator dotenv
 * 2. Create .env with TELEGRAM_BOT_TOKEN
 * 3. Run: npx tsx server/bot.ts
 * 4. Set webhook: curl -F "url=https://your-server.com/webhook" https://api.telegram.org/bot<TOKEN>/setWebhook
 */

/*
import { Bot } from "grammy";
import { BOT_COMMANDS, handleStart, handlePrice, handleHelp, handleReferral, handleInlineQuery, generateReferralCode } from "../lib/bot-commands";
import { fetchSinglePrice, fetchPortfolio } from "../lib/onchain";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) throw new Error("TELEGRAM_BOT_TOKEN required");

const bot = new Bot(token);

// Register commands
bot.api.setMyCommands(BOT_COMMANDS.map(({ command, description }) => ({ command, description })));

// /start
bot.command("start", async (ctx) => {
  const ref = ctx.match; // ref code from /start ref_XXX
  await handleStart({
    userId: ctx.from!.id,
    username: ctx.from!.username,
    chatId: ctx.chat!.id,
    reply: (text, opts) => ctx.reply(text, opts),
    openTMA: () => Promise.resolve(),
  });
});

// /price
bot.command("price", async (ctx) => {
  await handlePrice({
    userId: ctx.from!.id,
    username: ctx.from!.username,
    chatId: ctx.chat!.id,
    reply: (text, opts) => ctx.reply(text, opts),
    openTMA: () => Promise.resolve(),
  });
});

// /portfolio (requires wallet connection via TMA)
bot.command("portfolio", async (ctx) => {
  await ctx.reply("📊 <b>Portfolio</b>\n\nConnect your wallet in Prophet TMA to view your portfolio.", {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "🌀 Open TMA", web_app: { url: "https://prophet1.vercel.app/tma" } }
      ]],
    },
  });
});

// /swap
bot.command("swap", async (ctx) => {
  await ctx.reply("💱 <b>Swap</b>\n\nOpen Prophet TMA to swap tokens via Jupiter Aggregator.", {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "💱 Open Swap", web_app: { url: "https://prophet1.vercel.app/tma" } }
      ]],
    },
  });
});

// /stake
bot.command("stake", async (ctx) => {
  try {
    const price = await fetchSinglePrice("SOL");
    await ctx.reply(
      `🔒 <b>Stake SOL</b>\n\n` +
      `Current SOL price: <b>$${price.toFixed(2)}</b>\n` +
      `Estimated APY: <b>~7%</b>\n\n` +
      `Stake directly in Prophet TMA with native Solana delegation.`,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[
            { text: "🔒 Open Staking", web_app: { url: "https://prophet1.vercel.app/tma" } }
          ]],
        },
      }
    );
  } catch {
    await ctx.reply("⚠️ Staking info temporarily unavailable.");
  }
});

// /referral
bot.command("referral", async (ctx) => {
  await handleReferral({
    userId: ctx.from!.id,
    username: ctx.from!.username,
    chatId: ctx.chat!.id,
    reply: (text, opts) => ctx.reply(text, opts),
    openTMA: () => Promise.resolve(),
  });
});

// /leaderboard
bot.command("leaderboard", async (ctx) => {
  const lb = [
    { rank: 1, name: "CryptoOracle", xp: 48200 },
    { rank: 2, name: "DeFiWhale", xp: 42100 },
    { rank: 3, name: "AlphaSeeker", xp: 38900 },
    { rank: 4, name: "GemHunter", xp: 35400 },
    { rank: 5, name: "SolMaxi", xp: 32100 },
  ];

  let text = "🏆 <b>Prophet Leaderboard</b>\n\n";
  lb.forEach((u) => {
    const medal = u.rank === 1 ? "🥇" : u.rank === 2 ? "🥈" : u.rank === 3 ? "🥉" : `${u.rank}.`;
    text += `${medal} <b>${u.name}</b> — ${u.xp.toLocaleString()} XP\n`;
  });
  text += "\n📊 Full leaderboard in Prophet TMA";

  await ctx.reply(text, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "🌀 Open TMA", web_app: { url: "https://prophet1.vercel.app/tma" } }
      ]],
    },
  });
});

// /help
bot.command("help", async (ctx) => {
  await handleHelp({
    userId: ctx.from!.id,
    username: ctx.from!.username,
    chatId: ctx.chat!.id,
    reply: (text, opts) => ctx.reply(text, opts),
    openTMA: () => Promise.resolve(),
  });
});

// Inline query (type @botname in any chat)
bot.on("inline_query", async (ctx) => {
  await handleInlineQuery({
    query: ctx.inlineQuery.query,
    userId: ctx.from.id,
    answer: (results) => ctx.answerInlineQuery(results, { cache_time: 30 }),
  });
});

// Start bot (polling for dev, webhook for prod)
if (process.env.NODE_ENV === "production" && process.env.WEBHOOK_URL) {
  // Webhook mode
  bot.api.setWebhook(process.env.WEBHOOK_URL);
} else {
  // Polling mode (development)
  bot.start();
  console.log("Bot started via polling...");
}

export { bot };
*/
