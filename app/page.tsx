"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Code2, Smartphone, Globe, Database, Cpu, ChevronRight,
  Star, Zap, Shield, Clock, ArrowRight, CheckCircle,
  MessageSquare, FileText, Rocket, Award
} from "lucide-react";
import StarField from "@/components/StarField";
import Navbar from "@/components/Navbar";

const SERVICES = [
  {
    icon: Smartphone, title: "小程序开发", desc: "微信/抖音/支付宝小程序，快速上线，用户体验极致流畅",
    color: "#00d4ff", bg: "from-cyan-500/20 to-blue-600/10",
    tags: ["微信", "抖音", "支付宝"]
  },
  {
    icon: Globe, title: "Web 网站", desc: "响应式官网、电商平台、SaaS系统，现代设计语言",
    color: "#7c3aed", bg: "from-purple-500/20 to-violet-600/10",
    tags: ["官网", "电商", "SaaS"]
  },
  {
    icon: Smartphone, title: "App 开发", desc: "iOS & Android 原生/跨平台应用，流畅稳定高性能",
    color: "#06ffd4", bg: "from-emerald-500/20 to-teal-600/10",
    tags: ["iOS", "Android", "跨平台"]
  },
  {
    icon: Database, title: "企业系统", desc: "ERP/CRM/OA等管理系统，AI赋能，提升运营效率",
    color: "#f59e0b", bg: "from-amber-500/20 to-orange-600/10",
    tags: ["ERP", "CRM", "OA"]
  },
  {
    icon: Cpu, title: "AI 功能集成", desc: "GPT/Claude/文心等大模型接入，为产品赋予智能大脑",
    color: "#ec4899", bg: "from-pink-500/20 to-rose-600/10",
    tags: ["GPT", "Claude", "文心"]
  },
  {
    icon: Code2, title: "API 对接", desc: "第三方接口对接、数据迁移、系统集成一站式服务",
    color: "#10b981", bg: "from-green-500/20 to-emerald-600/10",
    tags: ["接口", "数据", "集成"]
  },
];

const PROCESS = [
  {
    step: "01", icon: MessageSquare, title: "需求沟通",
    desc: "填写需求表单，AI智能分析，1小时内专属顾问响应，深入了解你的产品构想",
    detail: ["免费需求分析", "1小时内回复", "专属顾问对接"]
  },
  {
    step: "02", icon: FileText, title: "方案报价",
    desc: "AI辅助生成技术方案，提供详细开发规划、时间节点和精准透明报价",
    detail: ["技术方案定制", "透明报价无隐费", "合同签署保障"]
  },
  {
    step: "03", icon: Rocket, title: "极速开发",
    desc: "AI赋能全栈开发，效率提升10倍，每周同步进度，代码质量严格把关",
    detail: ["AI辅助开发", "每周进度汇报", "严格代码审查"]
  },
  {
    step: "04", icon: Award, title: "交付上线",
    desc: "全面测试、部署上线、提供完整源码和技术文档，30天免费售后支持",
    detail: ["全面测试", "源码+文档", "30天售后"]
  },
];

const CASES = [
  {
    title: "智能餐饮小程序",
    type: "微信小程序",
    desc: "在线点餐、扫码支付、会员积分系统，月活用户2万+",
    tech: ["Next.js", "微信云开发", "AI推荐"],
    color: "#00d4ff",
    metrics: [{ label: "月活用户", val: "2万+" }, { label: "日订单", val: "500+" }, { label: "开发周期", val: "3周" }]
  },
  {
    title: "企业HR管理系统",
    type: "Web 系统",
    desc: "员工档案、考勤管理、薪资核算全自动化，服务企业50+",
    tech: ["React", "Golang", "MySQL"],
    color: "#7c3aed",
    metrics: [{ label: "服务企业", val: "50+" }, { label: "管理员工", val: "3000+" }, { label: "效率提升", val: "80%" }]
  },
  {
    title: "跨境电商App",
    type: "iOS + Android",
    desc: "多语言支持、跨境支付、智能选品，GMV月增30%",
    tech: ["React Native", "Node.js", "Redis"],
    color: "#06ffd4",
    metrics: [{ label: "月GMV增长", val: "30%" }, { label: "语言支持", val: "8种" }, { label: "好评率", val: "98%" }]
  },
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
      timer = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayed.length > 0) {
      timer = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
    } else {
      setDeleting(false);
      setIndex((i) => (i + 1) % texts.length);
    }
    return () => clearTimeout(timer);
  }, [displayed, deleting, index, texts]);
  return (
    <span>
      <span className="neon-text">{displayed}</span>
      <span className="cursor-blink" style={{ color: "#00d4ff" }}>|</span>
    </span>
  );
}

function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);
  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: "#0a0e1a" }}>
      <StarField />
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 px-4" style={{
        background: "radial-gradient(ellipse at 50% 0%, rgba(0,212,255,0.08) 0%, transparent 60%)"
      }}>
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(0,212,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.03) 1px,transparent 1px)",
          backgroundSize: "60px 60px"
        }} />
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm"
              style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.25)", color: "#00d4ff" }}>
              <Zap size={14} /><span>AI 驱动 · 极速交付 · 品质保障</span>
            </div>
            <h1 className="font-black mb-6 leading-tight" style={{ fontFamily: "Orbitron, sans-serif", fontSize: "clamp(2.5rem, 8vw, 5rem)" }}>
              <span style={{ color: "white" }}>星屿文化</span><br />
              <span style={{ color: "white" }}>传媒工作室</span>
            </h1>
            <p className="text-xl md:text-2xl mb-4 h-9" style={{ color: "#93c5fd" }}>
              <TypewriterText texts={["让 AI 为你开发任何应用", "小程序 · App · Web · 系统", "极速交付，品质第一", "用科技点亮你的创意"]} />
            </p>
            <p className="text-lg mb-12 max-w-2xl mx-auto leading-relaxed" style={{ color: "#60a5fa" }}>
              专业AI软件开发服务，提交需求即可获得定制化开发方案。
              无论是移动端、Web端还是企业系统，我们都能快速实现。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/order" className="btn-primary px-8 py-4 rounded-xl text-lg font-semibold inline-flex items-center justify-center gap-2 group">
                立即下单开发<ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#services" className="btn-neon px-8 py-4 rounded-xl text-lg font-semibold inline-flex items-center justify-center gap-2">
                了解服务<ChevronRight size={20} />
              </Link>
            </div>
          </motion.div>

          {/* 数据统计 */}
          <motion.div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
            {[{ end: 500, suffix: "+", label: "成功项目" }, { end: 10, suffix: "x", label: "AI提效" }, { end: 98, suffix: "%", label: "客户满意度" }, { end: 7, suffix: "×24", label: "在线服务" }].map((item) => (
              <div key={item.label} className="glass-card p-4 rounded-xl text-center border-glow">
                <div className="text-2xl font-bold neon-text" style={{ fontFamily: "Orbitron, sans-serif" }}>
                  <CountUp end={item.end} suffix={item.suffix} />
                </div>
                <div className="text-sm mt-1" style={{ color: "#93c5fd" }}>{item.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* 装饰圆环 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full float-anim"
            style={{ width: 600, height: 600, border: "1px solid rgba(0,212,255,0.08)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ width: 900, height: 900, border: "1px solid rgba(124,58,237,0.06)", animation: "float 6s ease-in-out infinite reverse" }} />
        </div>
      </section>

      {/* ===== 优势 ===== */}
      <section className="relative z-10 py-16 px-4" style={{ background: "rgba(0,212,255,0.02)" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Zap, title: "极速交付", desc: "AI赋能开发，效率提升10倍", color: "#00d4ff" },
            { icon: Shield, title: "品质保障", desc: "严格代码审查，稳定可靠", color: "#7c3aed" },
            { icon: Clock, title: "7×24响应", desc: "专属顾问，随时在线", color: "#06ffd4" },
            { icon: Star, title: "透明报价", desc: "无隐藏费用，价格实惠", color: "#f59e0b" },
          ].map((adv, i) => (
            <motion.div key={adv.title} className="glass-card p-6 rounded-xl text-center"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ background: `${adv.color}18`, border: `1px solid ${adv.color}33` }}>
                <adv.icon size={22} style={{ color: adv.color }} />
              </div>
              <div className="font-semibold mb-1" style={{ color: "white" }}>{adv.title}</div>
              <div className="text-sm" style={{ color: "#93c5fd" }}>{adv.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== 服务项目 ===== */}
      <section id="services" className="relative z-10 py-24 px-4" style={{
        background: "linear-gradient(180deg, #0a0e1a 0%, #0d1229 50%, #0a0e1a 100%)"
      }}>
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-xs font-bold mb-3 uppercase tracking-[0.3em]" style={{ color: "#00d4ff" }}>— SERVICES —</div>
            <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: "Orbitron, sans-serif", color: "white" }}>
              服务项目
            </h2>
            <div className="h-1 w-24 mx-auto rounded-full mb-4" style={{ background: "linear-gradient(90deg,#00d4ff,#7c3aed)" }} />
            <p style={{ color: "#93c5fd" }}>覆盖全栈技术，AI赋能每一个开发环节</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((svc, i) => (
              <motion.div key={svc.title}
                className="relative rounded-2xl p-6 group overflow-hidden cursor-default"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, borderColor: `${svc.color}44` }}>
                {/* 背景渐变 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${svc.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`} />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: `${svc.color}18`, border: `1px solid ${svc.color}33` }}>
                    <svc.icon size={28} style={{ color: svc.color }} />
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: "white" }}>{svc.title}</h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "#93c5fd" }}>{svc.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {svc.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-1 rounded-full"
                        style={{ background: `${svc.color}12`, border: `1px solid ${svc.color}33`, color: svc.color }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {/* 角标光效 */}
                <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `radial-gradient(circle at top right, ${svc.color}20, transparent 70%)` }} />
              </motion.div>
            ))}
          </div>

          <motion.div className="mt-12 text-center"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Link href="/order" className="btn-primary px-10 py-4 rounded-xl font-semibold inline-flex items-center gap-2">
              免费咨询报价 <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== 开发流程 ===== */}
      <section id="process" className="relative z-10 py-24 px-4" style={{
        background: "linear-gradient(135deg, #0f0a1e 0%, #0a0e1a 40%, #1a0f2e 100%)"
      }}>
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(124,58,237,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(0,212,255,0.04) 0%, transparent 50%)"
        }} />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-xs font-bold mb-3 uppercase tracking-[0.3em]" style={{ color: "#7c3aed" }}>— PROCESS —</div>
            <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: "Orbitron, sans-serif", color: "white" }}>
              开发流程
            </h2>
            <div className="h-1 w-24 mx-auto rounded-full mb-4" style={{ background: "linear-gradient(90deg,#7c3aed,#ec4899)" }} />
            <p style={{ color: "#c4b5fd" }}>4步极速落地，从创意到产品</p>
          </motion.div>

          {/* 流程时间线 */}
          <div className="relative">
            {/* 连接线 */}
            <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.4), rgba(0,212,255,0.4), transparent)" }} />

            <div className="grid md:grid-cols-4 gap-8">
              {PROCESS.map((p, i) => (
                <motion.div key={p.step}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                  {/* 步骤图标 */}
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center relative z-10"
                        style={{
                          background: `linear-gradient(135deg, rgba(124,58,237,0.3), rgba(0,212,255,0.2))`,
                          border: "2px solid rgba(124,58,237,0.5)",
                          boxShadow: "0 0 24px rgba(124,58,237,0.2)"
                        }}>
                        <p.icon size={24} style={{ color: "#c4b5fd" }} />
                      </div>
                      <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                        style={{ background: "linear-gradient(135deg,#7c3aed,#00d4ff)", color: "white", fontFamily: "Orbitron, sans-serif" }}>
                        {p.step}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold mb-2" style={{ color: "white" }}>{p.title}</h3>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "#c4b5fd" }}>{p.desc}</p>
                    <div className="space-y-1.5 w-full">
                      {p.detail.map((d) => (
                        <div key={d} className="flex items-center gap-2 text-xs justify-center"
                          style={{ color: "#a78bfa" }}>
                          <CheckCircle size={12} style={{ color: "#7c3aed", flexShrink: 0 }} />
                          {d}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 底部保障 */}
          <motion.div className="mt-16 rounded-2xl p-6"
            style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {["需求分析免费", "方案1小时回复", "价格透明无隐费", "不满意可退款"].map((item) => (
                <div key={item} className="flex items-center justify-center gap-2 text-sm" style={{ color: "#c4b5fd" }}>
                  <CheckCircle size={14} style={{ color: "#7c3aed" }} />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== 案例展示 ===== */}
      <section id="cases" className="relative z-10 py-24 px-4" style={{
        background: "linear-gradient(180deg, #0a0e1a 0%, #081520 60%, #0a0e1a 100%)"
      }}>
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(ellipse at 50% 30%, rgba(6,255,212,0.04) 0%, transparent 60%)"
        }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-xs font-bold mb-3 uppercase tracking-[0.3em]" style={{ color: "#06ffd4" }}>— CASES —</div>
            <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: "Orbitron, sans-serif", color: "white" }}>
              案例展示
            </h2>
            <div className="h-1 w-24 mx-auto rounded-full mb-4" style={{ background: "linear-gradient(90deg,#06ffd4,#00d4ff)" }} />
            <p style={{ color: "#6ee7d4" }}>真实案例，数据说话</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {CASES.map((c, i) => (
              <motion.div key={c.title} className="rounded-2xl overflow-hidden group"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                whileHover={{ y: -8 }}>
                {/* 案例头部 */}
                <div className="h-40 relative flex items-center justify-center overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${c.color}15, ${c.color}05)` }}>
                  <div className="text-center">
                    <div className="text-5xl font-black mb-1" style={{ color: `${c.color}60`, fontFamily: "Orbitron, sans-serif" }}>
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="text-xs px-3 py-1 rounded-full" style={{
                      background: `${c.color}18`, border: `1px solid ${c.color}44`, color: c.color
                    }}>
                      {c.type}
                    </div>
                  </div>
                  {/* 装饰 */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `radial-gradient(circle at center, ${c.color}10, transparent 70%)` }} />
                </div>

                {/* 案例内容 */}
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2" style={{ color: "white" }}>{c.title}</h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "#93c5fd" }}>{c.desc}</p>

                  {/* 数据指标 */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {c.metrics.map((m) => (
                      <div key={m.label} className="rounded-xl p-2 text-center"
                        style={{ background: `${c.color}0d`, border: `1px solid ${c.color}22` }}>
                        <div className="text-sm font-bold" style={{ color: c.color }}>{m.val}</div>
                        <div className="text-xs mt-0.5" style={{ color: "#64748b" }}>{m.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* 技术栈 */}
                  <div className="flex flex-wrap gap-2">
                    {c.tech.map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded"
                        style={{ background: "rgba(255,255,255,0.06)", color: "#64748b" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative z-10 py-24 px-4" style={{
        background: "linear-gradient(135deg, #0a0e1a, #0d1a2e, #0a0e1a)"
      }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div className="rounded-3xl p-12 relative overflow-hidden"
            style={{ background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.15)" }}
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <div className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse at center, rgba(0,212,255,0.06) 0%, transparent 70%)" }} />
            <div className="relative z-10">
              <div className="text-5xl mb-6">🚀</div>
              <h2 className="text-4xl font-black mb-4" style={{ fontFamily: "Orbitron, sans-serif", color: "white" }}>
                准备好了吗？
              </h2>
              <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: "#93c5fd" }}>
                提交你的需求，AI将在1小时内给出专业开发方案和报价。无论项目大小，都欢迎咨询。
              </p>
              <Link href="/order" className="btn-primary inline-flex items-center gap-2 px-12 py-4 rounded-xl text-lg font-bold">
                免费提交需求 <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="relative z-10 py-8 px-4" style={{ borderTop: "1px solid rgba(0,212,255,0.08)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm" style={{ color: "#475569" }}>
          <div className="flex items-center gap-2">
            <Zap size={14} style={{ color: "#00d4ff" }} />
            <span style={{ fontFamily: "Orbitron, sans-serif", color: "#94a3b8" }}>星屿文化传媒工作室</span>
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
