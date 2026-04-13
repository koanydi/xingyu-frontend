"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ShoppingBag, Search } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "首页" },
  { href: "/products", label: "所有商品" },
  { href: "/order/lookup", label: "订单查询" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 64,
      background: "rgba(8,12,28,0.85)", backdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      display: "flex", alignItems: "center", padding: "0 24px",
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: "linear-gradient(135deg,#00d4ff,#7c3aed)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <ShoppingBag size={16} color="white" />
        </div>
        <span style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 700, fontSize: 15, color: "white" }}>
          星屿发卡
        </span>
      </Link>

      {/* 桌面导航 */}
      <div style={{ display: "flex", gap: 4, marginLeft: 32, flex: 1 }}>
        {NAV_LINKS.map(({ href, label }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href} style={{
              padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500,
              textDecoration: "none", transition: "all 0.2s",
              color: active ? "#00d4ff" : "#94a3b8",
              background: active ? "rgba(0,212,255,0.08)" : "transparent",
              border: active ? "1px solid rgba(0,212,255,0.2)" : "1px solid transparent",
            }}>
              {label}
            </Link>
          );
        })}
      </div>

      {/* 右侧操作 */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Link href="/order/lookup" style={{
          padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
          textDecoration: "none", color: "#00d4ff",
          border: "1px solid rgba(0,212,255,0.3)",
          background: "rgba(0,212,255,0.06)",
        }}>
          查订单
        </Link>
      </div>

      {/* 汉堡菜单 */}
      <button onClick={() => setOpen(!open)} style={{
        display: "none", background: "none", border: "none", cursor: "pointer",
        color: "#94a3b8", marginLeft: 12,
      }} className="nav-hamburger">
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* 移动端菜单 */}
      {open && (
        <div style={{
          position: "absolute", top: 64, left: 0, right: 0,
          background: "rgba(8,12,28,0.98)", padding: 16,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} style={{
              display: "block", padding: "12px 16px", color: "#94a3b8",
              textDecoration: "none", borderRadius: 8, fontSize: 14,
            }}>
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
