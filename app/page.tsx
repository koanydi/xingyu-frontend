"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Code2, Smartphone, Globe, Database, Cpu, ChevronRight,
  Star, Zap, Shield, Clock, ArrowRight, CheckCircle
} from "lucide-react";
import StarField from "@/components/StarField";
import Navbar from "@/components/Navbar";

const SERVICES = [
  { icon: Smartphone, title: "小程序开发", desc: "微信/抖音/支付宝小程序，快速上线，用户体验极致", color: "#00d4ff" },
  { icon: Globe, title: "Web 网站", desc: "响应式官网、电商平台、SaaS系统，现代设计语言", color: "#7c3aed" },
  { icon: Smartphone, title: "App 开发", desc: "iOS & Android 原生/跨平台应用，流畅稳定", color: "#06ffd4" },
  { icon: Database, title: "企业系统", desc: "ERP/CRM/OA等管理系统，提升企业运营效率", color: "#f59e0b" },
  { icon: Cpu, title: "AI 功能集成", desc: "接入大模型能力，为你的产品赋予智能大脑", color: "#ec4899" },
  { icon: Code2, title: "API 对接", desc: "第三方接口对接、数据迁移、系统集成", color: "#10b981" },
];

const PROCESS = [
  { step: "01", title: "需求沟通", desc: "填写需求表单，我们1小时内响应，深入了解你的想法" },
  { step: "02", title: "方案报价", desc: "AI分析需求，提供详细开发方案和精准报价" },
  { step: "03", title: "极速开发", desc: "AI辅助开发，效率提升10倍，交付周期大幅缩短" },
  { step: "04", title: "测试交付", desc: "严格测试，提供源码和文档，售后无忧" },
];

const ADVANTAGES = [
  { icon: Zap, title: "极速交付", desc: "AI赋能开发，效率提升10倍" },
  { icon: Shield, title: "品质保障", desc: "严格代码审查，稳定可靠" },
  { icon: Clock, title: "7×24响应", desc: "专属沟通，随时在线" },
  { icon: Star, title: "透明报价", desc: "无隐藏费用，价格实惠" },
];

function TypewriterText({ texts }: { texts: string[] }) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[index];
    let timer: ReturnType<typeof setTimeout>;
    if (!deleting && displayed.length < current.length) {
      timer = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === current.length) {
      timer = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timer = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % texts.length);
    }
    return () => clearTimeout(timer);
  }, [displayed, deleting, index, texts]);

  return (
    <span className="neon-text">
      {displayed}
      <span className="cursor-blink text-cyan-400">|</span>
    </span>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen star-bg grid-bg">
      <StarField />
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 px-4">
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-8 text-cyan-400 text-sm border-glow">
              <Zap size={14} />
              <span>AI 驱动 · 极速交付 · 品质保障</span>
            </div>

            <h1
              className="text-5xl md:text-7xl font-black mb-6 leading-tight"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              <span className="text-white">星屿文化</span>
              <br />
              <span className="text-white">传媒工作室</span>
            </h1>

            <p className="text-2xl md:text-3xl text-blue-200 mb-4 h-10">
              <TypewriterText
                texts={[
                  "让 AI 为你开发任何应用",
                  "小程序 · App · Web · 系统",
                  "极速交付，品质第一",
                  "用科技点亮你的创意",
                ]}
              />
            </p>

            <p className="text-blue-300 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
              专业AI软件开发服务，提交需求即可获得定制化开发方案。
              无论是移动端、Web端还是企业系统，我们都能快速实现。
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/order"
                className="btn-primary px-8 py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-2 group"
              >
                立即下单开发
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/#services"
                className="btn-neon px-8 py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-2"
              >
                了解服务
                <ChevronRight size={20} />
              </Link>
            </div>
          </motion.div>

          {/* 浮动数据卡片 */}
          <motion.div
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {[
              { num: "500+", label: "成功项目" },
              { num: "10x", label: "AI提效" },
              { num: "98%", label: "客户满意度" },
              { num: "7×24", label: "在线服务" },
            ].map((item) => (
              <div key={item.label} className="glass-card p-4 rounded-xl text-center border-glow">
                <div className="text-2xl font-bold neon-text" style={{ fontFamily: "Orbitron, sans-serif" }}>
                  {item.num}
                </div>
                <div className="text-blue-300 text-sm mt-1">{item.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* 装饰圆环 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-cyan-500/10 float-anim" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-purple-500/10" style={{ animation: "float 6s ease-in-out infinite reverse" }} />
        </div>
      </section>

      {/* 优势 */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {ADVANTAGES.map((adv, i) => (
            <motion.div
              key={adv.title}
              className="glass-card p-6 rounded-xl text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <adv.icon size={32} className="text-cyan-400 mx-auto mb-3" />
              <div className="text-white font-semibold mb-1">{adv.title}</div>
              <div className="text-blue-300 text-sm">{adv.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 服务项目 */}
      <section id="services" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-cyan-400 text-sm font-medium mb-3 uppercase tracking-widest">Services</div>
            <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "Orbitron, sans-serif" }}>
              服务项目
            </h2>
            <p className="text-blue-300 max-w-xl mx-auto">覆盖全栈技术，AI赋能每一个开发环节</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((svc, i) => (
              <motion.div
                key={svc.title}
                className="glass-card p-6 rounded-xl group hover:border-cyan-400/40 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${svc.color}22`, border: `1px solid ${svc.color}44` }}
                >
                  <svc.icon size={24} style={{ color: svc.color }} />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{svc.title}</h3>
                <p className="text-blue-300 text-sm leading-relaxed">{svc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 开发流程 */}
      <section id="process" className="relative z-10 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-cyan-400 text-sm font-medium mb-3 uppercase tracking-widest">Process</div>
            <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "Orbitron, sans-serif" }}>
              开发流程
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {PROCESS.map((p, i) => (
              <motion.div
                key={p.step}
                className="relative glass-card p-6 rounded-xl text-center"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div
                  className="text-4xl font-black mb-4 neon-text"
                  style={{ fontFamily: "Orbitron, sans-serif" }}
                >
                  {p.step}
                </div>
                <h3 className="text-white font-semibold mb-2">{p.title}</h3>
                <p className="text-blue-300 text-sm leading-relaxed">{p.desc}</p>
                {i < PROCESS.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 z-10 text-cyan-500">
                    <ChevronRight size={20} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cases" className="relative z-10 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="glass-card p-12 rounded-2xl border-glow"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="text-5xl mb-6">🚀</div>
            <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "Orbitron, sans-serif" }}>
              准备好了吗？
            </h2>
            <p className="text-blue-300 text-lg mb-8 max-w-xl mx-auto">
              提交你的需求，我们的AI将在1小时内给出专业开发方案和报价。
              无论项目大小，都欢迎咨询。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              {[
                "需求分析免费",
                "方案1小时内回复",
                "价格透明无隐费",
                "不满意可退款",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-cyan-300 text-sm">
                  <CheckCircle size={14} className="text-cyan-400 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <Link
              href="/order"
              className="btn-primary inline-flex items-center gap-2 px-10 py-4 rounded-xl text-lg font-bold"
            >
              免费提交需求
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-cyan-500/10 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-blue-400 text-sm">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-cyan-400" />
            <span style={{ fontFamily: "Orbitron, sans-serif" }}>星屿文化传媒工作室</span>
          </div>
          <div>© 2026 星屿文化传媒工作室. All rights reserved.</div>
          <div className="flex gap-4">
            <Link href="/order" className="hover:text-cyan-400 transition-colors">提交需求</Link>
            <Link href="/admin/login" className="hover:text-cyan-400 transition-colors">管理后台</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
