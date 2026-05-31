// ─── Telegram Bot Commands ──────────────────────────────────────────
// Inline bot commands that work everywhere in Telegram
// These are handled via webhook or polling from the bot backend

/**
 * Bot command definitions for @BotFather /setcommands
 * 
 * Commands:
 *   start     - Welcome + open TMA
 *   price     - Get SOL/USDC price
 *   portfolio - Show connected wallet portfolio  
 *   swap      - Quick swap interface
 *   stake     - Stake SOL
 *   referral  - Get referral link
 *   leaderboard - Top traders
 *   help      - Show all commands
 */

export const BOT_COMMANDS = [
  { command: "start", description: "🌀 Open Prophet DeFi" },
  { command: "price", description: "💰 Get SOL price" },
  { command: "portfolio", description: "📊 View your portfolio" },
  { command: "swap", description: "💱 Quick swap tokens" },
  { command: "stake", description: "🔒 Stake SOL" },
  { command: "referral", description: "🎁 Your referral link" },
  { command: "leaderboard", description: "🏆 Top traders" },
  { command: "help", description: "❓ Show all commands" },
];

// ─── Bot Command Handlers ──────────────────────────────────────────
// These would run on a Node.js backend server with grammy or telegraf

import { fetchSinglePrice } from "@/lib/onchain";

export interface BotContext {
  userId: number;
  username?: string;
  chatId: number;
  reply: (text: string, options?: any) => Promise<void>;
  openTMA: () => Promise<void>;
}

export async function handleStart(ctx: BotContext) {
  const welcome = `
🌀 <b>Welcome to Prophet DeFi!</b>

Trade, stake, and earn on Solana — right inside Telegram.

<b>Quick Start:</b>
• /price — Check SOL price
• /portfolio — View your portfolio
• /swap — Swap tokens
• /stake — Stake SOL for ~7% APY
• /referral — Get your referral link
• /leaderboard — Top traders

Or tap the button below to open Prophet TMA 👇
`;

  await ctx.reply(welcome, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "🌀 Open Prophet", web_app: { url: "https://prophet1.vercel.app/tma" } }
      ]],
    },
  });
}

export async function handlePrice(ctx: BotContext) {
  try {
    const solPrice = await fetchSinglePrice("SOL");
    const usdcPrice = 1.0; // USDC is stable

    const text = `
💰 <b>Live Prices</b>

<b>SOL</b> — $${solPrice.toFixed(2)} <i>(via CoinGecko)</i>
<b>USDC</b> — $${usdcPrice.toFixed(2)}

🔄 Updated every 30s
`;

    await ctx.reply(text, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[
          { text: "💱 Swap", web_app: { url: "https://prophet1.vercel.app/tma" } },
          { text: "📊 Portfolio", web_app: { url: "https://prophet1.vercel.app/tma" } },
        ]],
      },
    });
  } catch {
    await ctx.reply("⚠️ Price feed temporarily unavailable. Try again.");
  }
}

export async function handleHelp(ctx: BotContext) {
  const text = `
<b>🌀 Prophet DeFi Bot Commands</b>

/start — Open Prophet DeFi
/price — Live SOL price
/portfolio — View portfolio (connect wallet)
/swap — Swap tokens via Jupiter
/stake — Stake SOL natively
/referral — Your referral link & stats
/leaderboard — Top traders by XP
/help — Show this message

<b>Features:</b>
• 💱 Jupiter-powered swaps
• 💰 Native SOL staking (~7% APY)
• 🌉 Cross-chain bridges (Li.Fi)
• 🤖 AI market copilot
• 🔔 Real-time price alerts
• 🛡️ Token security scanners
• 🏛️ DAO governance
• 🎮 Play-to-earn games
• 📊 Portfolio analytics

🔗 <a href="https://prophet1.vercel.app/tma">Open TMA</a>
`;

  await ctx.reply(text, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "🌀 Open Prophet TMA", web_app: { url: "https://prophet1.vercel.app/tma" } }
      ]],
    },
  });
}

export function generateReferralCode(userId: number): string {
  return `PROPHET${userId.toString(36).toUpperCase().slice(0, 6)}`;
}

export async function handleReferral(ctx: BotContext) {
  const code = generateReferralCode(ctx.userId);
  const link = `https://t.me/ProphetDeFiBot?start=ref_${code}`;

  const text = `
🎁 <b>Your Referral Program</b>

<b>Code:</b> <code>${code}</code>
<b>Link:</b> ${link}

<b>Rewards:</b>
• 10% of referrals' XP as bonus
• Earn XP for each active referral
• Top referrers get exclusive badges

Tap to copy your link and share! 👇
`;

  await ctx.reply(text, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "📋 Copy Link", copy_text: { text: link } }],
        [{ text: "📤 Share", url: `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent("Join me on Prophet DeFi! Trade, stake, and earn on Solana 🌀")}` }],
        [{ text: "🌀 Open TMA", web_app: { url: "https://prophet1.vercel.app/tma" } }],
      ],
    },
  });
}

// Inline query handler (type @ProphetDeFiBot in any chat)
export async function handleInlineQuery(ctx: {
  query: string;
  userId: number;
  answer: (results: any[]) => Promise<void>;
}) {
  try {
    const solPrice = await fetchSinglePrice("SOL");

    const results = [
      {
        type: "article",
        id: "price",
        title: "💰 SOL Price",
        description: `$${solPrice.toFixed(2)} — Updated ${new Date().toLocaleTimeString()}`,
        input_message_content: {
          message_text: `💰 <b>SOL: $${solPrice.toFixed(2)}</b>\n\nVia Prophet DeFi`,
          parse_mode: "HTML",
        },
      },
      {
        type: "article",
        id: "app",
        title: "🌀 Open Prophet DeFi",
        description: "Trade, stake, and earn on Solana",
        input_message_content: {
          message_text: "🌀 <b>Prophet DeFi</b>\n\nTap to launch 👇",
          parse_mode: "HTML",
        },
        reply_markup: {
          inline_keyboard: [[
            { text: "🌀 Open", web_app: { url: "https://prophet1.vercel.app/tma" } }
          ]],
        },
      },
    ];

    await ctx.answer(results);
  } catch {
    await ctx.answer([]);
  }
}
