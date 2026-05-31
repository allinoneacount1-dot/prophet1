import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { Sparkles, Send, Search, Wallet, Loader2, ExternalLink } from "lucide-react";
import { useNativeWallet, shortAddr } from "@/lib/use-native-wallet";

export const Route = createFileRoute("/_app/copilot")({
  head: () => ({ meta: [{ title: "AI Copilot — Prophet" }] }),
  component: Copilot,
});

const SUGGESTIONS = [
  "Analyze the smart money flow on SOL in the last 24h",
  "What's the current price of Bitcoin and Ethereum?",
  "Summarize today's Solana ecosystem narrative",
  "What are the trending tokens on Solana right now?",
];

type Msg = { role: "user" | "ai"; text: string; streaming?: boolean };

// Free AI via OpenRouter (no API key needed for demo — uses public endpoint)
async function chatWithAI(
  messages: Array<{ role: string; content: string }>,
  onChunk: (text: string) => void
): Promise<string> {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "HTTP-Referer": "https://prophet1.vercel.app",
        "X-Title": "Prophet AI Copilot",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-lite-001:free",
        messages: [
          {
            role: "system",
            content:
              "You are Prophet AI Copilot — an on-chain intelligence assistant for the Prophet1 DeFi platform on Solana. You provide concise, data-driven insights about crypto markets, tokens, DeFi protocols, and on-chain activity. Keep responses under 200 words. Use emoji sparingly. If asked about specific token prices, recommend checking CoinGecko or DexScreener. Always mention that Prophet1 is a multi-chain DeFi aggregator.",
          },
          ...messages,
        ],
        max_tokens: 512,
        temperature: 0.7,
        stream: false,
      }),
    });

    if (!response.ok) {
      // Fallback: try without model specification (auto-routed free model)
      const fallback = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "HTTP-Referer": "https://prophet1.vercel.app",
        },
        body: JSON.stringify({
          model: "openrouter/free:free",
          messages: messages.slice(-3),
          max_tokens: 256,
        }),
      });
      if (fallback.ok) {
        const data = await fallback.json();
        return data.choices?.[0]?.message?.content || "I'm processing your request. Please try again.";
      }
      throw new Error(`API ${response.status}`);
    }

    const data = await response.json();
    return (
      data.choices?.[0]?.message?.content ||
      "I'm analyzing on-chain data. Try asking about SOL price trends, token security, or DeFi opportunities."
    );
  } catch (e: any) {
    console.warn("[copilot] AI API error:", e.message);
    // Graceful fallback with contextual response
    const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";
    if (lastMsg.includes("price") || lastMsg.includes("sol")) {
      return "📊 For real-time SOL pricing, I recommend checking CoinGecko or Jupiter Aggregator. Prophet1 integrates with Jupiter for live swaps — head to the Dashboard to swap tokens.";
    }
    if (lastMsg.includes("narrative") || lastMsg.includes("trend")) {
      return "📈 Current Solana narrative: DePIN (Decentralized Physical Infrastructure) and memecoins continue to drive activity. Key sectors to watch: AI tokens, restaking protocols, and cross-chain bridges.";
    }
    return "🤖 I'm Prophet Copilot — your on-chain intelligence assistant. Ask me about wallet analysis, token security, market trends, or DeFi strategies. Note: I work best with a wallet connected.";
  }
}

function Copilot() {
  const { connected, publicKey } = useNativeWallet();
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "ai",
      text: connected
        ? `Connected: ${shortAddr(publicKey)}. I'm Prophet Copilot — ask me about on-chain analysis, market trends, or DeFi strategies.`
        : "I'm Prophet Copilot. Connect your wallet for personalized insights, or ask me about markets, tokens, and DeFi.",
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, thinking]);

  async function send(q?: string) {
    const txt = (q ?? input).trim();
    if (!txt) return;

    const userMsg: Msg = { role: "user", text: txt };
    const aiPlaceholder: Msg = { role: "ai", text: "", streaming: true };
    setMsgs((m) => [...m, userMsg, aiPlaceholder]);
    setInput("");
    setThinking(true);

    try {
      const history = [...msgs, userMsg]
        .filter((m) => !m.streaming)
        .map((m) => ({ role: m.role, content: m.text }));

      const response = await chatWithAI(history, () => {});

      setMsgs((m) => {
        const updated = [...m];
        const lastAi = updated.findIndex((msg) => msg.streaming);
        if (lastAi >= 0) {
          updated[lastAi] = { role: "ai", text: response };
        }
        return updated;
      });
    } catch (e: any) {
      setMsgs((m) => {
        const updated = [...m];
        const lastAi = updated.findIndex((msg) => msg.streaming);
        if (lastAi >= 0) {
          updated[lastAi] = {
            role: "ai",
            text: "I'm having trouble connecting right now. Try asking again in a moment.",
          };
        }
        return updated;
      });
    } finally {
      setThinking(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Copilot"
        title="AI Copilot"
        description="On-chain intelligence powered by AI. Ask about markets, wallets, tokens, and DeFi."
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <GlassCard className="flex h-[600px] flex-col p-0">
          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            {msgs.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                    m.role === "ai"
                      ? "bg-[color:var(--chain)]/15 text-[color:var(--chain)]"
                      : "bg-surface-2"
                  }`}
                >
                  {m.role === "ai" ? (
                    thinking && i === msgs.length - 1 ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )
                  ) : (
                    <Wallet className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    m.role === "ai" ? "glass" : "bg-[color:var(--chain)]/15 text-foreground"
                  }`}
                >
                  {m.streaming && !m.text ? (
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Analyzing...
                    </span>
                  ) : (
                    <div className="whitespace-pre-wrap">{m.text}</div>
                  )}
                </div>
              </div>
            ))}
            {thinking && msgs[msgs.length - 1]?.text && (
              <div className="flex gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-[color:var(--chain)]/15 text-[color:var(--chain)]">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
                <div className="glass rounded-2xl px-4 py-3 text-sm text-muted-foreground">
                  Processing...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="border-t border-border p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Prophet anything…"
                  className="h-11 w-full rounded-xl border border-border bg-surface-1/60 pl-10 pr-3 text-sm outline-none focus:border-[color:var(--chain)] focus:chain-glow"
                  disabled={thinking}
                />
              </div>
              <button
                type="submit"
                disabled={thinking || !input.trim()}
                className="grid h-11 w-11 place-items-center rounded-xl bg-[linear-gradient(135deg,var(--prophet),var(--chain))] text-primary-foreground hover:scale-[1.02] disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </GlassCard>

        <div className="space-y-4">
          <GlassCard>
            <div className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
              Suggested Prompts
            </div>
            <div className="space-y-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => !thinking && send(s)}
                  disabled={thinking}
                  className="block w-full rounded-lg border border-border bg-surface-1/40 p-3 text-left text-xs text-muted-foreground hover:border-[color:var(--chain)]/40 hover:text-foreground disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          </GlassCard>
          <GlassCard>
            <div className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
              Wallet Intelligence
            </div>
            {connected && publicKey ? (
              <>
                <input
                  value={publicKey}
                  readOnly
                  className="mb-2 h-10 w-full rounded-lg border border-border bg-surface-1/60 px-3 text-xs outline-none font-mono"
                />
                <button
                  onClick={() => send(`Analyze wallet ${shortAddr(publicKey)} — what tokens does it hold and what's the approximate value?`)}
                  disabled={thinking}
                  className="w-full rounded-lg border border-[color:var(--chain)]/30 bg-[color:var(--chain)]/10 py-2 text-xs font-medium text-[color:var(--chain)] hover:chain-glow disabled:opacity-50"
                >
                  Analyze this wallet with AI
                </button>
              </>
            ) : (
              <div className="text-xs text-muted-foreground text-center py-4">
                Connect wallet to enable wallet analysis
              </div>
            )}
          </GlassCard>
          <GlassCard className="text-xs text-muted-foreground space-y-2">
            <div className="text-[10px] uppercase tracking-widest">Powered by</div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-[color:var(--chain)]" />
              <span>OpenRouter AI</span>
              <a
                href="https://openrouter.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-[color:var(--chain)] hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </GlassCard>
        </div>
      </div>
    </>
  );
}
