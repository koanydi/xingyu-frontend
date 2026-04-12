"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Zap, ArrowRight } from "lucide-react";

const NAV_LINKS = [
  { href: "/services", label: "服务项目" },
  { href: "/process", label: "开发流程" },
  { href: "/cases", label: "案例展示" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(8,12,24,0.85)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>

          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg,#00d4ff,#7c3aed)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Zap size={18} color="white" />
            </div>
            <span style={{
              fontFamily: "Orbitron, sans-serif", fontWeight: 700, fontSize: 15,
              color: "white", letterSpacing: "0.02em"
            }}>
              星屿工作室
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 4 }} className="hidden-mobile">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link key={link.href} href={link.href} style={{
                  padding: "8px 18px", borderRadius: 8,
                  fontSize: 14, fontWeight: 500, textDecoration: "none",
                  transition: "all 0.2s",
                  color: active ? "#00d4ff" : "#94a3b8",
                  background: active ? "rgba(0,212,255,0.08)" : "transparent",
                  borderBottom: active ? "2px solid #00d4ff" : "2px solid transparent",
                }}>
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }} className="hidden-mobile">
            <Link href="/order" className="btn-main" style={{ padding: "9px 20px", fontSize: 13, borderRadius: 9 }}>
              立即下单 <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4 }}
            className="show-mobile">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div style={{
            paddingBottom: 16, display: "flex", flexDirection: "column", gap: 4,
            borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12
          }}>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} style={{
                padding: "10px 12px", borderRadius: 8, fontSize: 14,
                color: pathname === link.href ? "#00d4ff" : "#94a3b8",
                textDecoration: "none", display: "block",
                background: pathname === link.href ? "rgba(0,212,255,0.08)" : "transparent",
              }}>
                {link.label}
              </Link>
            ))}
            <Link href="/order" onClick={() => setOpen(false)} className="btn-main" style={{ marginTop: 8 }}>
              立即下单
            </Link>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
        @media (min-width: 769px) {
          .hidden-mobile { display: flex !important; }
          .show-mobile { display: none !important; }
        }
      `}</style>
    </header>
  );
}
