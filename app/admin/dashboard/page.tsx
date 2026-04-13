"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag, DollarSign, Clock, Package, Layers, TrendingUp, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { adminDashboard, adminLogout, type DashboardData } from "@/lib/api";

const NAV = [
  { href: "/admin/dashboard", label: "仪表盘" },
  { href: "/admin/products", label: "商品管理" },
  { href: "/admin/accounts", label: "收款账号" },
  { href: "/admin/orders", label: "订单管理" },
];

function AdminLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [sideOpen, setSideOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const uname = localStorage.getItem("admin_user");
    if (!token) { router.push("/admin/login"); return; }
    setUser(uname || "admin");
  }, [router]);

  async function logout() {
    try { await adminLogout(); } catch { }
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/admin/login");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#070c1a" }}>
      {/* 侧边栏 */}
      <div style={{
        width: sideOpen ? 220 : 0, overflow: "hidden",
        background: "rgba(255,255,255,0.02)", borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex", flexDirection: "column", transition: "width 0.2s",
        flexShrink: 0,
      }}>
        <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontFamily: "Orbitron,sans-serif", fontWeight: 700, fontSize: 14, color: "#00d4ff" }}>星屿发卡</div>
          <div style={{ fontSize: 11, color: "#334155", marginTop: 2 }}>管理后台</div>
        </div>
        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {NAV.map(({ href, label }) => (
            <Link key={href} href={href} style={{
              display: "block", padding: "10px 14px", borderRadius: 8, marginBottom: 2,
              textDecoration: "none", fontSize: 13, color: "#64748b",
              transition: "all 0.15s",
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.color = "white"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ""; (e.currentTarget as HTMLElement).style.color = "#64748b"; }}>
              {label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={logout} style={{
            width: "100%", padding: "10px 14px", borderRadius: 8,
            background: "none", border: "none", cursor: "pointer", color: "#475569",
            display: "flex", alignItems: "center", gap: 8, fontSize: 13, textAlign: "left",
          }}>
            <LogOut size={14} /> 退出登录
          </button>
        </div>
      </div>

      {/* 主内容 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
        <div style={{
          padding: "0 24px", height: 56,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", gap: 12,
          background: "rgba(255,255,255,0.01)",
        }}>
          <button onClick={() => setSideOpen(!sideOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569" }}>
            <Menu size={18} />
          </button>
          <span style={{ fontSize: 15, fontWeight: 600, color: "white" }}>{title}</span>
          <span style={{ marginLeft: "auto", fontSize: 12, color: "#334155" }}>{user}</span>
        </div>
        <div style={{ flex: 1, padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin/login"); return; }
    adminDashboard().then(setData).catch(() => router.push("/admin/login"));
  }, [router]);

  const stats = data ? [
    { label: "今日收入", value: `¥${data.today_revenue.toFixed(2)}`, icon: DollarSign, color: "#00d4ff" },
    { label: "总订单数", value: data.total_orders, icon: ShoppingBag, color: "#7c3aed" },
    { label: "已支付", value: data.paid_orders, icon: TrendingUp, color: "#06ffd4" },
    { label: "待支付", value: data.pending_orders, icon: Clock, color: "#f59e0b" },
    { label: "商品数量", value: data.product_count, icon: Package, color: "#ec4899" },
    { label: "卡密库存", value: data.card_stock, icon: Layers, color: "#8b5cf6" },
  ] : [];

  return (
    <AdminLayout title="仪表盘">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <div style={{
              padding: "20px 24px", borderRadius: 12,
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
              display: "flex", alignItems: "center", gap: 16,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: `${s.color}12`, border: `1px solid ${s.color}30`,
              }}>
                <s.icon size={20} color={s.color} />
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "white", fontFamily: "Orbitron,sans-serif" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>{s.label}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        {[
          { href: "/admin/products", label: "管理商品", desc: "上架/下架/编辑商品" },
          { href: "/admin/accounts", label: "管理收款账号", desc: "添加微信/支付宝/USDT账号" },
          { href: "/admin/orders", label: "查看订单", desc: "处理订单和手动发货" },
        ].map(({ href, label, desc }) => (
          <Link key={href} href={href} style={{
            padding: "20px", borderRadius: 12, textDecoration: "none",
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            display: "block", transition: "all 0.2s",
          }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.3)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 12, color: "#475569" }}>{desc}</div>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}

export { AdminLayout };
