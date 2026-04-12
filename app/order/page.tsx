"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Zap } from "lucide-react";
import Link from "next/link";
import StarField from "@/components/StarField";
import { submitOrder } from "@/lib/api";

const APP_TYPES = [
  "微信小程序", "抖音小程序", "支付宝小程序",
  "iOS App", "Android App", "跨平台App",
  "Web 网站", "后台管理系统", "企业ERP/CRM",
  "AI 功能集成", "API 接口对接", "其他"
];

const BUDGETS = [
  "1万以内", "1-3万", "3-5万", "5-10万", "10-30万", "30万以上", "面议"
];

export default function OrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    customer_name: "",
    customer_contact: "",
    app_type: "",
    requirements: "",
    budget: "",
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.customer_name || !form.customer_contact || !form.app_type || !form.requirements) {
      setError("请填写所有必填项");
      return;
    }
    if (form.requirements.length < 10) {
      setError("需求描述至少10个字");
      return;
    }
    setLoading(true);
    try {
      const res = await submitOrder(form);
      if (res.order_no) {
        router.push(`/order/success?no=${res.order_no}`);
      } else {
        setError(res.error || "提交失败，请稍后重试");
      }
    } catch {
      setError("网络错误，请检查网络后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen star-bg grid-bg">
      <StarField />
      <div className="relative z-10 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link href="/" className="inline-flex items-center gap-2 text-blue-300 hover:text-cyan-400 transition-colors mb-6">
              <ArrowLeft size={16} />
              返回首页
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
                <Zap size={20} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
                提交需求
              </h1>
            </div>
            <p className="text-blue-300">填写你的开发需求，我们将在1小时内与你联系并给出方案报价</p>
          </motion.div>

          {/* Form */}
          <motion.div
            className="glass-card p-8 rounded-2xl border-glow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 姓名 */}
              <div>
                <label className="block text-blue-200 text-sm font-medium mb-2">
                  姓名 / 昵称 <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  className="input-neon w-full px-4 py-3 rounded-xl text-sm"
                  placeholder="请输入你的姓名或昵称"
                  value={form.customer_name}
                  onChange={(e) => set("customer_name", e.target.value)}
                />
              </div>

              {/* 联系方式 */}
              <div>
                <label className="block text-blue-200 text-sm font-medium mb-2">
                  联系方式 <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  className="input-neon w-full px-4 py-3 rounded-xl text-sm"
                  placeholder="手机号 / 微信号 / 邮箱"
                  value={form.customer_contact}
                  onChange={(e) => set("customer_contact", e.target.value)}
                />
              </div>

              {/* 应用类型 */}
              <div>
                <label className="block text-blue-200 text-sm font-medium mb-2">
                  需要开发的类型 <span className="text-cyan-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {APP_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => set("app_type", type)}
                      className={`px-3 py-2 rounded-lg text-xs text-center transition-all duration-200 border ${
                        form.app_type === type
                          ? "bg-cyan-400/20 border-cyan-400 text-cyan-300"
                          : "border-white/10 text-blue-300 hover:border-cyan-400/50 hover:text-cyan-300"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* 需求描述 */}
              <div>
                <label className="block text-blue-200 text-sm font-medium mb-2">
                  需求描述 <span className="text-cyan-400">*</span>
                </label>
                <textarea
                  className="input-neon w-full px-4 py-3 rounded-xl text-sm resize-none"
                  rows={6}
                  placeholder="请详细描述你的需求，包括功能点、参考案例、用户群体等。描述越详细，报价越准确。"
                  value={form.requirements}
                  onChange={(e) => set("requirements", e.target.value)}
                />
                <div className="text-right text-xs text-blue-400 mt-1">{form.requirements.length} 字</div>
              </div>

              {/* 预算 */}
              <div>
                <label className="block text-blue-200 text-sm font-medium mb-2">预算范围</label>
                <div className="grid grid-cols-4 gap-2">
                  {BUDGETS.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => set("budget", b)}
                      className={`px-3 py-2 rounded-lg text-xs text-center transition-all duration-200 border ${
                        form.budget === b
                          ? "bg-purple-500/20 border-purple-400 text-purple-300"
                          : "border-white/10 text-blue-300 hover:border-purple-400/50"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    提交中...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    提交需求
                  </>
                )}
              </button>

              <p className="text-blue-400 text-xs text-center">
                提交即代表你同意我们与你联系讨论需求，信息仅用于服务沟通
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
