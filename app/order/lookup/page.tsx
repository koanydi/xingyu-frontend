"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Copy, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { lookupOrder, type OrderStatus } from "@/lib/api";
import PageWrapper from "@/components/PageWrapper";

const channelLabel: Record<string, string> = {
  wechat: "💚 微信支付", alipay: "💙 支付宝", usdt: "🪙 USDT",
};
const statusInfo: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  paid: { label: "已支付", color: "#06ffd4", icon: CheckCircle },
  pending: { label: "待付款", color: "#f59e0b", icon: Clock },
  expired: { label: "已过期", color: "#ef4444", icon: XCircle },
};

export default function OrderLookupPage() {
  const [orderNo, setOrderNo] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<OrderStatus | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [copied, setCopied] = useState("");

  async function handleSearch() {
    if (!orderNo.trim() || !email.trim()) {
      setError("请填写订单号和邮箱");
      return;
    }
    setError(""); setLoading(true); setResult(null);
    try {
      const data = await lookupOrder({ order_no: orderNo.trim(), buyer_email: email.trim() });
      setResult(data);
    } catch (e: unknown) {
      setError((e as Error).message || "查询失败");
    } finally { setLoading(false); }
  }

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null as unknown as string), 2000);
  }

  const cards = result?.card_contents ? JSON.parse(result.card_contents) as string[] : [];
  const si = result ? (statusInfo[result.pay_status] ?? statusInfo.pending) : null;

  return (
    <PageWrapper>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "56px 24px 80px" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="section-label" style={{ color: "#00d4ff" }}>Order Lookup</div>
            <h1 className="section-title" style={{ fontSize: 28 }}>订单查询</h1>
            <p style={{ fontSize: 13, color: "#475569" }}>通过订单号和邮箱找回你的卡密</p>
          </div>

          <div className="glass" style={{ padding: 28, marginBottom: 20 }}>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: "#475569", marginBottom: 6 }}>订单号</div>
              <input value={orderNo} onChange={e => setOrderNo(e.target.value)}
                placeholder="例如：20240101123456789012"
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                style={{
                  width: "100%", padding: "11px 14px", borderRadius: 8, boxSizing: "border-box",
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "white", fontSize: 13, outline: "none",
                }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: "#475569", marginBottom: 6 }}>下单邮箱</div>
              <input value={email} onChange={e => setEmail(e.target.value)}
                placeholder="下单时填写的邮箱"
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                style={{
                  width: "100%", padding: "11px 14px", borderRadius: 8, boxSizing: "border-box",
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "white", fontSize: 13, outline: "none",
                }} />
            </div>
            {error && <div style={{ color: "#f87171", fontSize: 12, marginBottom: 12 }}>{error}</div>}
            <button onClick={handleSearch} disabled={loading} className="btn-main"
              style={{ width: "100%", padding: 12, borderRadius: 10, justifyContent: "center" }}>
              <Search size={14} /> {loading ? "查询中..." : "查询订单"}
            </button>
          </div>

          {/* 查询结果 */}
          <AnimatePresence>
            {result && si && (
              <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <div className="glass" style={{ padding: 24 }}>
                  {/* 状态 */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
                    borderRadius: 10, marginBottom: 20,
                    background: `${si.color}10`, border: `1px solid ${si.color}30`,
                  }}>
                    <si.icon size={18} color={si.color} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: si.color }}>{si.label}</div>
                      <div style={{ fontSize: 11, color: "#475569" }}>
                        {result.delivery_status === "delivered" ? "卡密已发送" : "等待处理"}
                      </div>
                    </div>
                  </div>

                  {/* 订单详情 */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                    {[
                      { label: "订单号", value: result.order_no },
                      { label: "商品", value: result.product_name || "-" },
                      { label: "数量", value: `${result.quantity || 1} 件` },
                      { label: "支付金额", value: result.pay_channel === "usdt" ? `${result.pay_amount.toFixed(2)} USDT` : `¥${result.pay_amount.toFixed(2)}` },
                      { label: "支付方式", value: channelLabel[result.pay_channel] || result.pay_channel },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                        <span style={{ color: "#475569" }}>{label}</span>
                        <span style={{ color: "#94a3b8", fontWeight: 500 }}>{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* 卡密 */}
                  {cards.length > 0 && (
                    <div>
                      <button onClick={() => setShowCards(!showCards)} style={{
                        width: "100%", padding: "10px 14px", borderRadius: 8,
                        background: "rgba(6,255,212,0.06)", border: "1px solid rgba(6,255,212,0.2)",
                        color: "#06ffd4", cursor: "pointer", fontSize: 13, fontWeight: 600,
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        marginBottom: showCards ? 12 : 0,
                      }}>
                        <span>查看卡密（{cards.length} 条）</span>
                        {showCards ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                      <AnimatePresence>
                        {showCards && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                              {cards.map((card, i) => (
                                <div key={i} style={{
                                  display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 12px",
                                  borderRadius: 8, background: "rgba(6,255,212,0.04)", border: "1px solid rgba(6,255,212,0.1)",
                                }}>
                                  <code style={{ flex: 1, fontSize: 12, color: "#06ffd4", wordBreak: "break-all", lineHeight: 1.6 }}>{card}</code>
                                  <button onClick={() => copy(card, String(i))}
                                    style={{ background: "none", border: "none", cursor: "pointer", color: copied === String(i) ? "#06ffd4" : "#334155" }}>
                                    <Copy size={13} />
                                  </button>
                                </div>
                              ))}
                            </div>
                            <button onClick={() => copy(cards.join("\n"), "all")} style={{
                              marginTop: 10, width: "100%", padding: "8px", borderRadius: 8,
                              border: "1px solid rgba(6,255,212,0.15)", background: "rgba(6,255,212,0.04)",
                              color: "#06ffd4", cursor: "pointer", fontSize: 12,
                            }}>
                              {copied === "all" ? "已复制！" : "复制全部"}
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {result.pay_status === "pending" && (
                    <p style={{ fontSize: 12, color: "#475569", textAlign: "center", marginTop: 16 }}>
                      订单待付款，付款后自动发货
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
