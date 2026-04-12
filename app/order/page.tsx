"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Send, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import PageWrapper from "@/components/PageWrapper";
import { submitOrder } from "@/lib/api";

const APP_TYPES = [
  "微信小程序", "抖音小程序", "支付宝小程序",
  "iOS App", "Android App", "跨平台 App",
  "Web 网站", "企业管理系统", "AI 功能集成", "其他",
];
const BUDGETS = ["1万以内", "1-3万", "3-5万", "5-10万", "10-30万", "30万以上", "面议"];

export default function OrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ customer_name: "", customer_contact: "", app_type: "", requirements: "", budget: "" });
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.customer_name.trim()) return setError("请填写姓名");
    if (!form.customer_contact.trim()) return setError("请填写联系方式");
    if (!form.app_type) return setError("请选择开发类型");
    if (form.requirements.trim().length < 10) return setError("需求描述至少10个字");
    setLoading(true);
    try {
      const res = await submitOrder(form);
      if (res.order_no) router.push(`/order/success?no=${res.order_no}`);
      else setError(res.error || "提交失败，请稍后重试");
    } catch { setError("网络错误，请检查网络后重试"); }
    finally { setLoading(false); }
  };

  return (
    <PageWrapper>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "56px 24px 80px" }}>

        {/* 返回 */}
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#475569", textDecoration: "none", fontSize: 14, marginBottom: 32, transition: "color 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4ff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}>
          <ArrowLeft size={15} /> 返回首页
        </Link>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 40, alignItems: "start" }}>

          {/* 左：表单 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "white", marginBottom: 6 }}>提交开发需求</h1>
            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 36 }}>填写你的需求，我们将在1小时内与你联系并给出方案报价</p>

            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                {/* 姓名 + 联系方式 */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#94a3b8", marginBottom: 8 }}>
                      姓名 / 昵称 <span style={{ color: "#00d4ff" }}>*</span>
                    </label>
                    <input className="input-field" placeholder="请输入姓名或昵称"
                      value={form.customer_name} onChange={(e) => set("customer_name", e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#94a3b8", marginBottom: 8 }}>
                      联系方式 <span style={{ color: "#00d4ff" }}>*</span>
                    </label>
                    <input className="input-field" placeholder="手机 / 微信 / 邮箱"
                      value={form.customer_contact} onChange={(e) => set("customer_contact", e.target.value)} />
                  </div>
                </div>

                {/* 开发类型 */}
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#94a3b8", marginBottom: 12 }}>
                    需要开发的类型 <span style={{ color: "#00d4ff" }}>*</span>
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {APP_TYPES.map((type) => (
                      <button key={type} type="button" onClick={() => set("app_type", type)} style={{
                        padding: "7px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                        border: `1px solid ${form.app_type === type ? "#00d4ff" : "rgba(255,255,255,0.08)"}`,
                        background: form.app_type === type ? "rgba(0,212,255,0.1)" : "rgba(255,255,255,0.03)",
                        color: form.app_type === type ? "#00d4ff" : "#64748b",
                        transition: "all 0.15s",
                      }}>
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 需求描述 */}
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#94a3b8", marginBottom: 8 }}>
                    需求描述 <span style={{ color: "#00d4ff" }}>*</span>
                  </label>
                  <textarea className="input-field" rows={6} placeholder="请详细描述你的需求，包括功能点、参考案例、目标用户等。描述越详细，报价越精准。"
                    style={{ resize: "none" }}
                    value={form.requirements} onChange={(e) => set("requirements", e.target.value)} />
                  <div style={{ textAlign: "right", fontSize: 12, color: "#334155", marginTop: 4 }}>
                    {form.requirements.length} 字
                  </div>
                </div>

                {/* 预算 */}
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#94a3b8", marginBottom: 12 }}>
                    预算范围（选填）
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {BUDGETS.map((b) => (
                      <button key={b} type="button" onClick={() => set("budget", b)} style={{
                        padding: "7px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                        border: `1px solid ${form.budget === b ? "#7c3aed" : "rgba(255,255,255,0.08)"}`,
                        background: form.budget === b ? "rgba(124,58,237,0.1)" : "rgba(255,255,255,0.03)",
                        color: form.budget === b ? "#a78bfa" : "#64748b",
                        transition: "all 0.15s",
                      }}>
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 错误 */}
                {error && (
                  <div style={{
                    padding: "12px 16px", borderRadius: 10, fontSize: 13,
                    background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171",
                  }}>{error}</div>
                )}

                {/* 提交 */}
                <button type="submit" disabled={loading} className="btn-main" style={{
                  width: "100%", padding: "14px", fontSize: 15, borderRadius: 12,
                  opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer",
                }}>
                  {loading
                    ? <><div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin-slow 0.8s linear infinite" }} /> 提交中...</>
                    : <><Send size={16} /> 提交需求</>
                  }
                </button>
                <p style={{ fontSize: 12, color: "#334155", textAlign: "center" }}>
                  提交即表示同意我们与你联系讨论需求，信息仅用于服务沟通
                </p>
              </div>
            </form>
          </motion.div>

          {/* 右：说明卡 */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="glass" style={{ padding: 28, marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 20 }}>提交后会发生什么？</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { step: "1", text: "AI 自动分析你的需求" },
                  { step: "2", text: "1小时内专属顾问联系你" },
                  { step: "3", text: "24小时内提供方案报价" },
                  { step: "4", text: "确认后启动开发" },
                ].map((item) => (
                  <div key={item.step} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                      background: "rgba(0,212,255,0.15)", border: "1px solid rgba(0,212,255,0.3)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, color: "#00d4ff",
                    }}>{item.step}</div>
                    <span style={{ fontSize: 13, color: "#94a3b8", paddingTop: 3 }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass" style={{ padding: 28 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 16 }}>我们的承诺</h3>
              {["需求分析完全免费", "方案1小时内回复", "价格透明无隐藏费", "源码100%归你所有", "30天免费售后"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748b", marginBottom: 10 }}>
                  <CheckCircle size={13} color="#00d4ff" style={{ flexShrink: 0 }} /> {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
