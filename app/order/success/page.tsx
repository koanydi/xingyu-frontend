"use client";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle, Home, ArrowRight, MessageCircle } from "lucide-react";
import StarField from "@/components/StarField";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const orderNo = params.get("no") || "未知";

  return (
    <main className="min-h-screen star-bg grid-bg flex items-center justify-center px-4">
      <StarField />
      <motion.div
        className="relative z-10 max-w-lg w-full text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="glass-card p-12 rounded-2xl border-glow">
          {/* 成功图标 */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400/20 to-green-400/20 border border-cyan-400/40 flex items-center justify-center mx-auto">
              <CheckCircle size={40} className="text-cyan-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "Orbitron, sans-serif" }}>
              提交成功！
            </h1>
            <p className="text-blue-300 mb-6">你的需求已经收到，我们将尽快与你联系</p>

            {/* 订单号 */}
            <div className="glass-card p-4 rounded-xl mb-6">
              <div className="text-blue-400 text-xs mb-1">订单编号</div>
              <div className="text-cyan-400 font-mono text-lg font-bold">{orderNo}</div>
              <div className="text-blue-400 text-xs mt-1">请保存此编号，便于后续沟通查询</div>
            </div>

            {/* 下一步 */}
            <div className="text-left space-y-3 mb-8">
              <h3 className="text-white font-medium text-center mb-4">接下来会发生什么？</h3>
              {[
                { step: "1", text: "我们收到你的需求，AI将自动分析" },
                { step: "2", text: "1小时内（工作日）专属顾问联系你" },
                { step: "3", text: "提供详细方案和精准报价" },
                { step: "4", text: "确认后即可启动开发" },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center flex-shrink-0 text-cyan-400 text-xs font-bold">
                    {item.step}
                  </div>
                  <span className="text-blue-300 text-sm">{item.text}</span>
                </div>
              ))}
            </div>

            {/* 联系方式 */}
            <div className="glass-card p-4 rounded-xl mb-6 flex items-center gap-3">
              <MessageCircle size={20} className="text-cyan-400 flex-shrink-0" />
              <div className="text-left">
                <div className="text-blue-200 text-sm font-medium">有疑问？直接联系我们</div>
                <div className="text-blue-400 text-xs">工作时间：09:00 - 22:00 每天在线</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/" className="btn-neon flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 text-sm">
                <Home size={16} />
                返回首页
              </Link>
              <Link href="/order" className="btn-primary flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 text-sm">
                再提交一个
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen star-bg" />}>
      <SuccessContent />
    </Suspense>
  );
}
