"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Clock, Copy, RefreshCw, AlertTriangle } from "lucide-react";
import { getOrderStatus, type CreateOrderResp, type OrderStatus } from "@/lib/api";
import PageWrapper from "@/components/PageWrapper";

export default function PayPage() {
  const { orderNo } = useParams<{ orderNo: string }>();
  const router = useRouter();
  const [payInfo, setPayInfo] = useState<CreateOrderResp | null>(null);
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const [cards, setCards] = useState<string[]>([]);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("pay_info");
    if (stored) {
      try { setPayInfo(JSON.parse(stored)); } catch { }
    }
    // 立即拉一次状态
    pollStatus();
    pollRef.current = setInterval(pollStatus, 3000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [orderNo]);

  // 倒计时
  useEffect(() => {
    if (!payInfo) return;
    const expire = new Date(payInfo.expire_at).getTime();
    const tick = () => {
      const diff = Math.max(0, Math.floor((expire - Date.now()) / 1000));
      setTimeLeft(diff);
    };
    tick();
    timerRef.current = setInterval(tick, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [payInfo]);

  async function pollStatus() {
    try {
      const s = await getOrderStatus(orderNo);
      setStatus(s);
      if (s.pay_status === "paid" && s.card_contents) {
        if (pollRef.current) clearInterval(pollRef.current);
        const parsed = JSON.parse(s.card_contents) as string[];
        setCards(parsed);
      }
    } catch { }
  }

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  const isPaid = status?.pay_status === "paid";
  const isExpired = timeLeft === 0 && status?.pay_status === "pending";

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  return (
    <PageWrapper>
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "48px 24px 80px" }}>

        <AnimatePresence mode="wait">
          {/* 已支付 - 展示卡密 */}
          {isPaid ? (
            <motion.div key="paid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                  <CheckCircle size={64} color="#06ffd4" style={{ margin: "0 auto 16px" }} />
                </motion.div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "white", marginBottom: 6 }}>支付成功，发货完成！</h2>
                <p style={{ fontSize: 13, color: "#64748b" }}>请妥善保存以下卡密信息</p>
              </div>

              <div className="glass" style={{ padding: 24, marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: "#475569", fontWeight: 600, marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  卡密内容（共 {cards.length} 条）
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {cards.map((card, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "flex-start", gap: 10,
                      padding: "12px 14px", borderRadius: 8,
                      background: "rgba(6,255,212,0.04)", border: "1px solid rgba(6,255,212,0.15)",
                    }}>
                      <code style={{ flex: 1, fontSize: 13, color: "#06ffd4", wordBreak: "break-all", fontFamily: "monospace", lineHeight: 1.6 }}>
                        {card}
                      </code>
                      <button onClick={() => copy(card, String(i))} style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: copied === String(i) ? "#06ffd4" : "#475569", flexShrink: 0, paddingTop: 2,
                      }}>
                        <Copy size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={() => copy(cards.join("\n"), "all")} style={{
                  marginTop: 14, width: "100%", padding: "10px", borderRadius: 8,
                  border: "1px solid rgba(6,255,212,0.2)", background: "rgba(6,255,212,0.06)",
                  color: "#06ffd4", cursor: "pointer", fontSize: 13, fontWeight: 600,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}>
                  <Copy size={13} /> {copied === "all" ? "已复制！" : "一键复制全部"}
                </button>
              </div>

              <div className="glass" style={{ padding: 16, fontSize: 12, color: "#475569", lineHeight: 1.8 }}>
                <div style={{ fontWeight: 600, color: "#64748b", marginBottom: 6 }}>订单信息</div>
                <div>订单号：{orderNo}</div>
                <div>如有问题可凭订单号联系客服</div>
              </div>
            </motion.div>
          ) : (
            /* 等待支付 */
            <motion.div key="waiting" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "white", marginBottom: 6 }}>
                  {isExpired ? "订单已过期" : "等待付款"}
                </h2>
                {payInfo && (
                  <p style={{ fontSize: 13, color: "#64748b" }}>{payInfo.product.name}</p>
                )}
              </div>

              {/* 倒计时 */}
              {!isExpired && (
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px",
                    borderRadius: 100, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)",
                  }}>
                    <Clock size={13} color="#f59e0b" />
                    <span style={{ fontFamily: "Orbitron,sans-serif", color: "#f59e0b", fontWeight: 700, fontSize: 16 }}>
                      {mins}:{secs}
                    </span>
                    <span style={{ fontSize: 11, color: "#64748b" }}>剩余</span>
                  </div>
                </div>
              )}

              {isExpired ? (
                <div className="glass" style={{ padding: 32, textAlign: "center" }}>
                  <AlertTriangle size={40} color="#f59e0b" style={{ margin: "0 auto 16px" }} />
                  <p style={{ color: "#94a3b8", marginBottom: 20 }}>订单已超时，请重新下单</p>
                  <button onClick={() => router.push("/")} className="btn-main" style={{ padding: "10px 28px" }}>
                    返回首页
                  </button>
                </div>
              ) : payInfo && (
                <div className="glass" style={{ padding: 24 }}>
                  {/* 支付金额 */}
                  <div style={{
                    textAlign: "center", padding: "16px", marginBottom: 20,
                    background: "rgba(0,212,255,0.04)", borderRadius: 10, border: "1px solid rgba(0,212,255,0.1)",
                  }}>
                    <div style={{ fontSize: 12, color: "#475569", marginBottom: 4 }}>请扫码支付（金额精确到分）</div>
                    <div style={{ fontSize: 32, fontWeight: 900, fontFamily: "Orbitron,sans-serif", color: "#00d4ff" }}>
                      {payInfo.pay_channel === "usdt"
                        ? `${payInfo.pay_amount.toFixed(2)} USDT`
                        : `¥${payInfo.pay_amount.toFixed(2)}`}
                    </div>
                    <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>⚠️ 金额必须分毫不差，否则无法自动发货</div>
                  </div>

                  {/* 二维码 */}
                  {payInfo.pay_channel !== "usdt" ? (
                    payInfo.qr_image ? (
                      <div style={{ textAlign: "center", marginBottom: 20 }}>
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_BASE || "/api"}/uploads/qr/${payInfo.qr_image}`}
                          alt="收款二维码"
                          style={{ width: 200, height: 200, borderRadius: 12, border: "4px solid white" }}
                        />
                        <div style={{ fontSize: 12, color: "#64748b", marginTop: 10 }}>
                          {payInfo.pay_channel === "wechat" ? "💚 微信扫码支付" : "💙 支付宝扫码支付"}
                        </div>
                      </div>
                    ) : (
                      <div style={{ textAlign: "center", padding: 24, color: "#475569" }}>
                        收款码加载中...
                      </div>
                    )
                  ) : (
                    /* USDT */
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 12, color: "#475569", marginBottom: 8 }}>USDT (TRC-20) 收款地址</div>
                      <div style={{
                        display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
                        borderRadius: 8, background: "rgba(38,161,123,0.08)", border: "1px solid rgba(38,161,123,0.2)",
                      }}>
                        <code style={{ flex: 1, fontSize: 11, color: "#26a17b", wordBreak: "break-all" }}>
                          {payInfo.usdt_address || "地址未配置"}
                        </code>
                        <button onClick={() => copy(payInfo.usdt_address || "", "addr")}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#26a17b" }}>
                          <Copy size={14} />
                        </button>
                      </div>
                      {payInfo.usdt_rate && (
                        <div style={{ fontSize: 11, color: "#475569", marginTop: 8 }}>
                          参考汇率：1 USDT ≈ ¥{payInfo.usdt_rate.toFixed(4)}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 轮询状态提示 */}
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    fontSize: 12, color: "#475569",
                  }}>
                    <RefreshCw size={12} style={{ animation: "spin 2s linear infinite" }} />
                    系统自动检测付款，付款后将自动发货
                  </div>
                </div>
              )}

              <div style={{ marginTop: 16, textAlign: "center", fontSize: 12, color: "#334155" }}>
                订单号：{orderNo} · <button onClick={() => router.push(`/order/lookup`)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#00d4ff", fontSize: 12 }}>
                  查询订单
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}
