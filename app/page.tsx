"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ShoppingCart, Star, Zap, Shield, Clock } from "lucide-react";
import Link from "next/link";
import { getCategories, getProducts, type Category, type Product } from "@/lib/api";
import PageWrapper from "@/components/PageWrapper";

const CHANNEL_ICONS: Record<string, string> = {
  gamepad: "🎮", crown: "👑", play: "▶️", user: "👤",
  default: "📦",
};

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCat, setActiveCat] = useState<number | null>(null);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (activeCat) params.category_id = String(activeCat);
    if (keyword.trim()) params.keyword = keyword.trim();
    getProducts(params)
      .then(r => setProducts(r.list ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeCat, keyword]);

  return (
    <PageWrapper>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px 80px" }}>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", padding: "48px 0 40px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 16px",
            borderRadius: 100, fontSize: 12, fontWeight: 600, marginBottom: 20,
            background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)", color: "#00d4ff"
          }}>
            <Zap size={12} /> 自动发货 · 秒到账
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 900, fontFamily: "Orbitron, sans-serif", color: "white", marginBottom: 12 }}>
            星屿发卡平台
          </h1>
          <p style={{ fontSize: 15, color: "#64748b", marginBottom: 36 }}>
            游戏充值 · 软件会员 · 视频会员 · 账号购买，付款即发货
          </p>

          {/* 搜索框 */}
          <div style={{ maxWidth: 480, margin: "0 auto", position: "relative" }}>
            <Search size={16} color="#475569" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
            <input
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="搜索商品..."
              style={{
                width: "100%", padding: "12px 16px 12px 40px", borderRadius: 12,
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                color: "white", fontSize: 14, outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
        </motion.div>

        {/* 特性栏 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 36 }}>
          {[
            { icon: <Zap size={16} color="#00d4ff" />, title: "自动发货", desc: "付款后秒级发卡" },
            { icon: <Shield size={16} color="#06ffd4" />, title: "安全可靠", desc: "卡密加密存储" },
            { icon: <Clock size={16} color="#f59e0b" />, title: "24h服务", desc: "全天候自动处理" },
          ].map((f) => (
            <div key={f.title} className="glass" style={{ padding: "16px 20px", display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ flexShrink: 0 }}>{f.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{f.title}</div>
                <div style={{ fontSize: 11, color: "#475569" }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 分类 Tab */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
          <button onClick={() => setActiveCat(null)} style={{
            padding: "8px 18px", borderRadius: 100, fontSize: 13, fontWeight: 600,
            cursor: "pointer", border: "1px solid",
            borderColor: activeCat === null ? "#00d4ff" : "rgba(255,255,255,0.1)",
            background: activeCat === null ? "rgba(0,212,255,0.1)" : "transparent",
            color: activeCat === null ? "#00d4ff" : "#64748b",
          }}>
            全部
          </button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveCat(cat.id)} style={{
              padding: "8px 18px", borderRadius: 100, fontSize: 13, fontWeight: 600,
              cursor: "pointer", border: "1px solid",
              borderColor: activeCat === cat.id ? "#00d4ff" : "rgba(255,255,255,0.1)",
              background: activeCat === cat.id ? "rgba(0,212,255,0.1)" : "transparent",
              color: activeCat === cat.id ? "#00d4ff" : "#64748b",
            }}>
              {CHANNEL_ICONS[cat.icon] || CHANNEL_ICONS.default} {cat.name}
            </button>
          ))}
        </div>

        {/* 商品网格 */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#334155" }}>加载中...</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: "#334155" }}>暂无商品</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: 16 }}>
            {products.map((p, i) => (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}>
                <Link href={`/product/${p.id}`} style={{ textDecoration: "none" }}>
                  <div className="glass" style={{
                    padding: 20, cursor: "pointer", transition: "all 0.2s", height: "100%",
                    boxSizing: "border-box",
                  }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.3)";
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    }}>

                    {/* 封面/图标 */}
                    <div style={{
                      width: "100%", height: 100, borderRadius: 8, marginBottom: 14,
                      background: "linear-gradient(135deg,rgba(0,212,255,0.08),rgba(124,58,237,0.08))",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40,
                      overflow: "hidden",
                    }}>
                      {p.cover_img ? (
                        <img src={`/api/uploads/qr/${p.cover_img}`} alt={p.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        CHANNEL_ICONS[categories.find(c => c.id === p.category_id)?.icon ?? ""] || "📦"
                      )}
                    </div>

                    <div style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 4, lineHeight: 1.4 }}>
                      {p.name}
                    </div>
                    {p.subtitle && (
                      <div style={{ fontSize: 11, color: "#475569", marginBottom: 12 }}>{p.subtitle}</div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span style={{ fontSize: 18, fontWeight: 900, color: "#00d4ff", fontFamily: "Orbitron, sans-serif" }}>
                          ¥{p.price.toFixed(2)}
                        </span>
                        {p.original_price > 0 && p.original_price > p.price && (
                          <span style={{ fontSize: 11, color: "#334155", textDecoration: "line-through", marginLeft: 6 }}>
                            ¥{p.original_price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: "#334155" }}>库存 {p.stock_count}</div>
                    </div>

                    <div style={{ marginTop: 12, display: "flex", gap: 6, alignItems: "center" }}>
                      <Star size={10} color="#f59e0b" fill="#f59e0b" />
                      <span style={{ fontSize: 11, color: "#475569" }}>已售 {p.sales_count}</span>
                      <span style={{
                        marginLeft: "auto", fontSize: 10, padding: "2px 8px", borderRadius: 100,
                        background: "rgba(0,212,255,0.1)", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.2)"
                      }}>自动发货</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
