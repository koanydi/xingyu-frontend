"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingCart, Zap, Shield, ArrowLeft, Plus, Minus, AlertCircle } from "lucide-react";
import Link from "next/link";
import { getProduct, type Product } from "@/lib/api";
import PageWrapper from "@/components/PageWrapper";

const CHANNELS = [
  { id: "wechat", label: "微信支付", emoji: "💚", color: "#07c160" },
  { id: "alipay", label: "支付宝", emoji: "💙", color: "#1677ff" },
  { id: "usdt", label: "USDT", emoji: "🪙", color: "#26a17b" },
];

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [channel, setChannel] = useState("wechat");
  const [email, setEmail] = useState("");
  const [qq, setQQ] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getProduct(id).then(setProduct).catch(() => router.push("/")).finally(() => setLoading(false));
  }, [id, router]);

  async function handleBuy() {
    if (!email.trim()) { setError("请填写邮箱（用于找回订单）"); return; }
    if (!/\S+@\S+\.\S+/.test(email.trim())) { setError("邮箱格式不正确"); return; }
    setError(""); setSubmitting(true);
    try {
      const { createOrder } = await import("@/lib/api");
      const resp = await createOrder({
        product_id: product!.id, quantity: qty,
        buyer_email: email.trim(), buyer_qq: qq.trim(), pay_channel: channel,
      });
      // 存储支付信息到 sessionStorage
      sessionStorage.setItem("pay_info", JSON.stringify(resp));
      router.push(`/pay/${resp.order_no}`);
    } catch (e: unknown) {
      setError((e as Error).message || "创建订单失败，请重试");
    } finally { setSubmitting(false); }
  }

  if (loading) return (
    <PageWrapper><div style={{ textAlign: "center", padding: 100, color: "#475569" }}>加载中...</div></PageWrapper>
  );
  if (!product) return null;

  const total = (product.price * qty).toFixed(2);

  return (
    <PageWrapper>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 80px" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#475569", textDecoration: "none", fontSize: 13, marginBottom: 24 }}>
          <ArrowLeft size={14} /> 返回首页
        </Link>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }}>

          {/* 左：商品信息 */}
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
            <div className="glass" style={{ padding: 28 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "white", marginBottom: 8 }}>{product.name}</h1>
              {product.subtitle && <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>{product.subtitle}</p>}
              <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: "#00d4ff", fontFamily: "Orbitron,sans-serif" }}>
                  ¥{product.price.toFixed(2)}
                </span>
                {product.original_price > product.price && (
                  <span style={{ fontSize: 14, color: "#334155", textDecoration: "line-through", alignSelf: "flex-end" }}>
                    ¥{product.original_price.toFixed(2)}
                  </span>
                )}
              </div>

              <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                {[
                  { label: "库存", value: product.stock_count },
                  { label: "已售", value: product.sales_count },
                ].map(item => (
                  <div key={item.label} className="glass" style={{ padding: "8px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "white" }}>{item.value}</div>
                    <div style={{ fontSize: 11, color: "#475569" }}>{item.label}</div>
                  </div>
                ))}
                <div className="glass" style={{ padding: "8px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#00d4ff" }}>自动</div>
                  <div style={{ fontSize: 11, color: "#475569" }}>发货</div>
                </div>
              </div>

              {product.description && (
                <div>
                  <div style={{ fontSize: 12, color: "#475569", fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>商品说明</div>
                  <div style={{
                    fontSize: 13, color: "#94a3b8", lineHeight: 1.8,
                    background: "rgba(255,255,255,0.02)", borderRadius: 8, padding: 16,
                    border: "1px solid rgba(255,255,255,0.04)",
                    whiteSpace: "pre-wrap",
                  }}>
                    {product.description}
                  </div>
                </div>
              )}

              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { icon: <Zap size={12} color="#00d4ff" />, text: "付款后自动发货，无需等待" },
                  { icon: <Shield size={12} color="#06ffd4" />, text: "卡密安全存储，一人一码" },
                ].map(({ icon, text }) => (
                  <div key={text} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, color: "#475569" }}>
                    {icon} {text}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 右：购买表单 */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="glass" style={{ padding: 24, position: "sticky", top: 80 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>下单购买</div>

              {/* 数量 */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 12, color: "#475569", marginBottom: 8 }}>购买数量</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{
                    width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.04)", cursor: "pointer", color: "#64748b",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}><Minus size={13} /></button>
                  <span style={{ fontSize: 18, fontWeight: 700, color: "white", minWidth: 28, textAlign: "center" }}>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(10, q + 1))} style={{
                    width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(0,212,255,0.3)",
                    background: "rgba(0,212,255,0.08)", cursor: "pointer", color: "#00d4ff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}><Plus size={13} /></button>
                </div>
              </div>

              {/* 邮箱 */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, color: "#475569", marginBottom: 6 }}>邮箱 <span style={{ color: "#ef4444" }}>*</span></div>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="用于找回订单，请填真实邮箱"
                  style={{
                    width: "100%", padding: "10px 12px", borderRadius: 8, boxSizing: "border-box",
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "white", fontSize: 13, outline: "none",
                  }} />
              </div>

              {/* QQ */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 12, color: "#475569", marginBottom: 6 }}>QQ（选填）</div>
                <input value={qq} onChange={e => setQQ(e.target.value)} placeholder="选填"
                  style={{
                    width: "100%", padding: "10px 12px", borderRadius: 8, boxSizing: "border-box",
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "white", fontSize: 13, outline: "none",
                  }} />
              </div>

              {/* 支付方式 */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, color: "#475569", marginBottom: 8 }}>支付方式</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {CHANNELS.map(ch => (
                    <button key={ch.id} onClick={() => setChannel(ch.id)} style={{
                      padding: "10px 14px", borderRadius: 8, cursor: "pointer", textAlign: "left",
                      border: `1px solid ${channel === ch.id ? ch.color : "rgba(255,255,255,0.08)"}`,
                      background: channel === ch.id ? `${ch.color}12` : "rgba(255,255,255,0.03)",
                      display: "flex", alignItems: "center", gap: 10, transition: "all 0.15s",
                    }}>
                      <span style={{ fontSize: 18 }}>{ch.emoji}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: channel === ch.id ? "white" : "#64748b" }}>{ch.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 错误 */}
              {error && (
                <div style={{
                  display: "flex", gap: 8, alignItems: "flex-start", padding: "10px 12px",
                  borderRadius: 8, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                  color: "#f87171", fontSize: 12, marginBottom: 14,
                }}>
                  <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} /> {error}
                </div>
              )}

              {/* 总价 + 下单 */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16, marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                  <span style={{ fontSize: 13, color: "#64748b" }}>应付金额</span>
                  <span style={{ fontSize: 20, fontWeight: 900, color: "#00d4ff", fontFamily: "Orbitron,sans-serif" }}>¥{total}</span>
                </div>
                <button onClick={handleBuy} disabled={submitting || product.stock_count === 0}
                  className="btn-main" style={{ width: "100%", padding: 13, borderRadius: 10, justifyContent: "center" }}>
                  <ShoppingCart size={15} />
                  {product.stock_count === 0 ? "已售罄" : submitting ? "处理中..." : "立即购买"}
                </button>
              </div>

              <p style={{ fontSize: 11, color: "#334155", textAlign: "center" }}>
                付款成功后自动发送卡密，请保存订单号
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
