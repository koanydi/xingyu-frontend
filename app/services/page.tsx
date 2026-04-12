"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Code2, Smartphone, Globe, Database, Cpu, Wrench, ArrowRight, CheckCircle } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";

const SERVICES = [
  {
    icon: Smartphone, title: "小程序开发", color: "#00d4ff",
    desc: "微信、抖音、支付宝小程序全平台开发，覆盖电商、社交、工具等场景。",
    features: ["微信/抖音/支付宝", "云开发 & 云函数", "支付/分享/地图集成", "小程序管理后台"],
  },
  {
    icon: Globe, title: "Web 网站", color: "#7c3aed",
    desc: "企业官网、电商平台、SaaS系统，响应式设计，SEO友好，性能卓越。",
    features: ["企业官网定制", "电商商城系统", "SaaS 多租户", "SEO 优化"],
  },
  {
    icon: Smartphone, title: "App 开发", color: "#06ffd4",
    desc: "iOS & Android 原生或跨平台应用，流畅体验，上线 App Store / 应用宝。",
    features: ["iOS / Android", "React Native 跨平台", "上架辅助服务", "消息推送集成"],
  },
  {
    icon: Database, title: "企业系统", color: "#f59e0b",
    desc: "ERP、CRM、OA、HRM 等企业管理系统，流程自动化，提升运营效率。",
    features: ["ERP / CRM / OA", "工作流引擎", "权限管理体系", "数据报表看板"],
  },
  {
    icon: Cpu, title: "AI 功能集成", color: "#ec4899",
    desc: "GPT、Claude、文心一言等大模型能力接入，为产品增加智能交互体验。",
    features: ["AI 对话 & 客服", "内容生成系统", "智能推荐引擎", "图像识别处理"],
  },
  {
    icon: Wrench, title: "接口 & 运维", color: "#10b981",
    desc: "第三方API对接、服务器部署配置、数据迁移、系统集成一站式服务。",
    features: ["API 接口对接", "云服务器配置", "数据库迁移", "CI/CD 流水线"],
  },
];

const TECHS = ["React / Next.js", "Vue / Nuxt.js", "React Native", "Golang", "Node.js", "Python", "MySQL", "Redis", "Docker", "Nginx", "微信云开发", "Vercel"];

export default function ServicesPage() {
  return (
    <PageWrapper>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 24px 80px" }}>

        {/* 页头 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="section-label">Services</div>
          <h1 className="section-title">服务项目</h1>
          <div className="divider" />
          <p className="section-desc">覆盖全栈技术，AI赋能每一个开发环节，快速将你的想法变为现实</p>
        </motion.div>

        {/* 服务卡片网格 */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: 24,
          marginBottom: 72,
        }}>
          {SERVICES.map((svc, i) => (
            <motion.div key={svc.title}
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass glass-hover"
              style={{ padding: 28, cursor: "default", transition: "all 0.25s" }}
              whileHover={{ y: -4 }}>
              {/* 图标 */}
              <div style={{
                width: 52, height: 52, borderRadius: 14, marginBottom: 20,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: `${svc.color}15`, border: `1px solid ${svc.color}30`,
              }}>
                <svc.icon size={24} color={svc.color} />
              </div>

              {/* 内容 */}
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 10 }}>{svc.title}</h2>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, marginBottom: 20 }}>{svc.desc}</p>

              {/* 功能列表 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px" }}>
                {svc.features.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#94a3b8" }}>
                    <CheckCircle size={12} color={svc.color} style={{ flexShrink: 0 }} /> {f}
                  </div>
                ))}
              </div>

              {/* 底部色条 */}
              <div style={{
                height: 2, borderRadius: 2, marginTop: 24,
                background: `linear-gradient(90deg, ${svc.color}60, transparent)`
              }} />
            </motion.div>
          ))}
        </div>

        {/* 技术栈 */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass" style={{ padding: 40, textAlign: "center", marginBottom: 64 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 24 }}>主要技术栈</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {TECHS.map((t) => (
              <span key={t} style={{
                padding: "6px 16px", borderRadius: 100, fontSize: 13,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#94a3b8"
              }}>{t}</span>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{
            textAlign: "center", padding: "56px 32px", borderRadius: 20,
            background: "linear-gradient(135deg, rgba(0,212,255,0.06), rgba(124,58,237,0.06))",
            border: "1px solid rgba(0,212,255,0.12)",
          }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "white", marginBottom: 12 }}>找不到你需要的服务？</h2>
          <p style={{ color: "#64748b", marginBottom: 28 }}>告诉我们你的需求，我们会给出最合适的解决方案</p>
          <Link href="/order" className="btn-main" style={{ fontSize: 15, padding: "13px 32px" }}>
            免费提交需求 <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
