"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Code2, Smartphone, Globe, ChevronRight } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";

function TypewriterText({ texts }: { texts: string[] }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const cur = texts[idx];
    let t: ReturnType<typeof setTimeout>;
    if (!del && displayed.length < cur.length)
      t = setTimeout(() => setDisplayed(cur.slice(0, displayed.length + 1)), 75);
    else if (!del && displayed.length === cur.length)
      t = setTimeout(() => setDel(true), 2000);
    else if (del && displayed.length > 0)
      t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
    else { setDel(false); setIdx((i) => (i + 1) % texts.length); }
    return () => clearTimeout(t);
  }, [displayed, del, idx, texts]);
  return (
    <span style={{ background: "linear-gradient(135deg,#00d4ff,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
      {displayed}<span className="cursor-blink" style={{ WebkitTextFillColor: "#00d4ff" }}>|</span>
    </span>
  );
}

const QUICK_LINKS = [
  { icon: Smartphone, label: "小程序开发", color: "#00d4ff", href: "/services" },
  { icon: Globe, label: "Web 开发", color: "#7c3aed", href: "/services" },
  { icon: Code2, label: "App 开发", color: "#06ffd4", href: "/services" },
];

export default function Home() {
  return (
    <PageWrapper>
      {/* Hero */}
      <section style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "60px 24px",
        position: "relative",
        background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,212,255,0.06) 0%, transparent 70%)",
      }}>
        {/* 装饰圆 */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 600, height: 600, borderRadius: "50%",
          border: "1px solid rgba(0,212,255,0.06)",
          pointerEvents: "none"
        }} className="float-anim" />
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 900, height: 900, borderRadius: "50%",
          border: "1px solid rgba(124,58,237,0.04)",
          pointerEvents: "none",
          animation: "float 8s ease-in-out infinite reverse"
        }} />

        <div style={{ maxWidth: 860, width: "100%", textAlign: "center", position: "relative", zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            {/* 徽章 */}
            <div className="badge" style={{ marginBottom: 28, display: "inline-flex" }}>
              <Zap size={12} /> AI驱动 · 极速交付 · 品质保障
            </div>

            {/* 主标题 */}
            <h1 style={{
              fontSize: "clamp(2.4rem, 8vw, 5.5rem)",
              fontWeight: 900, lineHeight: 1.1,
              fontFamily: "Orbitron, sans-serif",
              color: "white", marginBottom: 20,
            }}>
              星屿文化<br />传媒工作室
            </h1>

            {/* 副标题打字机 */}
            <p style={{ fontSize: "clamp(1.1rem, 3vw, 1.5rem)", marginBottom: 16, minHeight: 40, color: "#94a3b8" }}>
              <TypewriterText texts={["让 AI 为你开发任何应用", "小程序 · App · Web · 系统", "极速交付，品质第一"]} />
            </p>

            <p style={{ fontSize: 16, color: "#64748b", marginBottom: 44, maxWidth: 520, margin: "0 auto 44px" }}>
              专业AI软件开发服务，提交需求即可获得定制化开发方案，
              无论是移动端、Web端还是企业系统，我们都能快速实现。
            </p>

            {/* 按钮组 */}
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 64 }}>
              <Link href="/order" className="btn-main" style={{ fontSize: 16, padding: "14px 32px", borderRadius: 12 }}>
                免费提交需求 <ArrowRight size={18} />
              </Link>
              <Link href="/services" className="btn-outline" style={{ fontSize: 16, padding: "14px 32px", borderRadius: 12 }}>
                查看服务 <ChevronRight size={18} />
              </Link>
            </div>

            {/* 快速入口 */}
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              {QUICK_LINKS.map((ql) => (
                <Link key={ql.label} href={ql.href} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 18px", borderRadius: 10, textDecoration: "none",
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  color: "#94a3b8", fontSize: 13, transition: "all 0.2s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = ql.color + "44"; e.currentTarget.style.color = ql.color; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#94a3b8"; }}>
                  <ql.icon size={14} style={{ color: ql.color }} /> {ql.label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* 数据栏 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginTop: 72 }}>
            {[
              { num: "500+", label: "成功项目" },
              { num: "10x", label: "AI 提效" },
              { num: "98%", label: "满意度" },
              { num: "7×24", label: "在线服务" },
            ].map((item) => (
              <div key={item.label} className="glass" style={{ padding: "20px 12px", textAlign: "center" }}>
                <div style={{
                  fontSize: 24, fontWeight: 900, fontFamily: "Orbitron, sans-serif",
                  background: "linear-gradient(135deg,#00d4ff,#7c3aed)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
                }}>{item.num}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{item.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "24px",
        textAlign: "center",
        color: "#334155",
        fontSize: 13,
        position: "relative", zIndex: 2,
      }}>
        © 2026 星屿文化传媒工作室. All rights reserved.
        <Link href="/admin/login" style={{ marginLeft: 16, color: "#475569", textDecoration: "none" }}>管理后台</Link>
      </footer>
    </PageWrapper>
  );
}
