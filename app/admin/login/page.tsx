"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, User, Eye, EyeOff, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import StarField from "@/components/StarField";
import { adminLogin } from "@/lib/api";

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.username || !form.password) { setError("请填写用户名和密码"); return; }
    setLoading(true);
    try {
      const res = await adminLogin(form.username, form.password);
      if (res.token) {
        localStorage.setItem("admin_token", res.token);
        localStorage.setItem("admin_user", res.username);
        router.push("/admin/dashboard");
      } else {
        setError("用户名或密码错误");
      }
    } catch {
      setError("网络错误，请检查连接");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex" style={{ background: "#0a0e1a" }}>
      <StarField />

      {/* 左侧装饰区 */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden p-12"
        style={{ background: "linear-gradient(135deg, #0d1229 0%, #0a0e1a 100%)" }}>
        <div className="absolute inset-0"
          style={{ backgroundImage: "linear-gradient(rgba(0,212,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.04) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute"
          style={{ width: 500, height: 500, borderRadius: "50%", border: "1px solid rgba(0,212,255,0.08)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", animation: "float 6s ease-in-out infinite" }} />
        <div className="absolute"
          style={{ width: 700, height: 700, borderRadius: "50%", border: "1px solid rgba(124,58,237,0.06)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", animation: "float 9s ease-in-out infinite reverse" }} />

        <div className="relative z-10 text-center max-w-sm">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8"
              style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(124,58,237,0.2))", border: "1px solid rgba(0,212,255,0.3)", boxShadow: "0 0 40px rgba(0,212,255,0.15)" }}>
              <Zap size={36} style={{ color: "#00d4ff" }} />
            </div>
            <h1 className="text-3xl font-black mb-4" style={{ fontFamily: "Orbitron, sans-serif", color: "white" }}>
              星屿文化<br />传媒工作室
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
              AI驱动的软件开发服务平台<br />
              专注为客户提供极速、高质量的开发解决方案
            </p>

            <div className="mt-10 space-y-3">
              {["实时订单管理", "客户需求跟踪", "项目进度监控"].map((item, i) => (
                <motion.div key={item} className="flex items-center gap-3 text-sm"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#00d4ff,#7c3aed)" }} />
                  <span style={{ color: "#94a3b8" }}>{item}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <Link href="/" className="inline-flex items-center gap-2 text-sm transition-colors"
                style={{ color: "#64748b" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4ff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}>
                ← 返回官网首页
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 右侧登录区 */}
      <div className="flex-1 lg:max-w-lg flex items-center justify-center p-6 lg:p-12 relative z-10">
        <motion.div className="w-full max-w-md"
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>

          {/* 移动端 Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#00d4ff,#7c3aed)" }}>
              <Zap size={20} style={{ color: "white" }} />
            </div>
            <span className="font-bold" style={{ fontFamily: "Orbitron, sans-serif", color: "white" }}>星屿工作室</span>
          </div>

          {/* 标题 */}
          <div className="mb-8">
            <h2 className="text-3xl font-black mb-2" style={{ color: "white" }}>欢迎回来</h2>
            <p className="text-sm" style={{ color: "#64748b" }}>登录管理后台，查看和处理客户订单</p>
          </div>

          {/* 登录表单 */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 用户名 */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#94a3b8" }}>用户名</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <User size={16} style={{ color: "#475569" }} />
                </div>
                <input
                  type="text"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#e2e8f0",
                  }}
                  placeholder="请输入用户名"
                  value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                  autoComplete="username"
                  onFocus={(e) => { e.target.style.borderColor = "rgba(0,212,255,0.5)"; e.target.style.background = "rgba(0,212,255,0.04)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,212,255,0.08)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.04)"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            {/* 密码 */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#94a3b8" }}>密码</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Lock size={16} style={{ color: "#475569" }} />
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#e2e8f0",
                  }}
                  placeholder="请输入密码"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  autoComplete="current-password"
                  onFocus={(e) => { e.target.style.borderColor = "rgba(0,212,255,0.5)"; e.target.style.background = "rgba(0,212,255,0.04)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,212,255,0.08)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.04)"; e.target.style.boxShadow = "none"; }}
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "#475569" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4ff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
                  onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* 错误提示 */}
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#ef4444" }} />
                {error}
              </motion.div>
            )}

            {/* 登录按钮 */}
            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all group"
              style={{
                background: loading ? "rgba(0,212,255,0.3)" : "linear-gradient(135deg,#00d4ff,#7c3aed)",
                color: "white",
                boxShadow: loading ? "none" : "0 0 24px rgba(0,212,255,0.25)",
                cursor: loading ? "not-allowed" : "pointer"
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.boxShadow = "0 0 40px rgba(0,212,255,0.4)"; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.boxShadow = "0 0 24px rgba(0,212,255,0.25)"; }}>
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>登录管理后台 <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" /></>
              )}
            </button>
          </form>

          {/* 底部 */}
          <div className="mt-8 pt-6 flex items-center justify-between"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <Link href="/" className="text-sm transition-colors"
              style={{ color: "#475569" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4ff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}>
              ← 返回官网
            </Link>
            <div className="text-xs" style={{ color: "#334155" }}>
              星屿文化传媒 © 2026
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
