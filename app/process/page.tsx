"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageSquare, FileText, Rocket, Award, ArrowRight, CheckCircle, Clock } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";

const STEPS = [
  {
    num: "01", icon: MessageSquare, color: "#00d4ff",
    title: "需求沟通",
    time: "1 小时内响应",
    desc: "填写需求表单，AI智能分析你的项目需求，专属顾问1小时内（工作日）主动联系，深度了解你的产品构想与业务目标。",
    details: [
      "AI自动分析需求可行性",
      "专属顾问1:1沟通",
      "明确功能边界与优先级",
      "评估技术方案",
    ]
  },
  {
    num: "02", icon: FileText, color: "#7c3aed",
    title: "方案报价",
    time: "24 小时内出方案",
    desc: "基于需求分析，提供详细的技术架构方案、UI设计风格参考、开发周期规划和精准透明的报价清单，无任何隐藏费用。",
    details: [
      "技术架构方案书",
      "UI 设计风格确认",
      "开发周期与里程碑",
      "透明报价无隐费",
    ]
  },
  {
    num: "03", icon: Rocket, color: "#06ffd4",
    title: "AI 极速开发",
    time: "效率提升 10 倍",
    desc: "AI辅助全栈开发，每个功能模块代码由AI生成后经资深工程师审查优化，每周同步开发进度，确保质量与效率双达标。",
    details: [
      "AI 辅助代码生成",
      "资深工程师审查",
      "每周进度同步报告",
      "严格代码质量管控",
    ]
  },
  {
    num: "04", icon: Award, color: "#f59e0b",
    title: "交付上线",
    time: "30 天免费售后",
    desc: "全面自动化测试 + 人工验收测试，部署上线，提供完整源码、技术文档和操作手册，30天免费售后支持，长期维护可选。",
    details: [
      "自动化 + 人工双测试",
      "服务器部署配置",
      "完整源码 + 文档",
      "30 天免费售后",
    ]
  },
];

const FAQS = [
  { q: "开发周期大概多久？", a: "根据项目复杂度，小程序/官网类 2-4 周，App/系统类 4-8 周，AI辅助开发比传统开发快 2-3 倍。" },
  { q: "如何保障代码质量？", a: "所有代码由AI生成后经资深工程师逐行审查，遵循行业最佳实践，交付前进行完整的单元测试和集成测试。" },
  { q: "签合同吗？源码归谁？", a: "签正式合同，源代码100%归客户所有，交付后完全转让所有权，我们不保留任何版权。" },
  { q: "后期维护怎么算？", a: "交付后30天内免费维护，之后可选择按需维护（按小时计费）或包月维护套餐，费用透明。" },
];

export default function ProcessPage() {
  return (
    <PageWrapper>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "72px 24px 80px" }}>

        {/* 页头 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", marginBottom: 72 }}>
          <div className="section-label" style={{ color: "#7c3aed" }}>Process</div>
          <h1 className="section-title">开发流程</h1>
          <div className="divider" style={{ background: "linear-gradient(90deg,#7c3aed,#ec4899)" }} />
          <p className="section-desc">透明可视的4步流程，从创意到上线，全程可追踪</p>
        </motion.div>

        {/* 流程步骤 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 80 }}>
          {STEPS.map((step, i) => (
            <motion.div key={step.num}
              initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              style={{
                display: "grid",
                gridTemplateColumns: i % 2 === 0 ? "1fr 48px 1fr" : "1fr 48px 1fr",
                gap: 0,
                alignItems: "start",
                marginBottom: i < STEPS.length - 1 ? 0 : 0,
              }}>

              {/* 左侧（奇数步骤显示内容，偶数步骤空白） */}
              <div style={{
                padding: "32px 32px 32px 0",
                textAlign: i % 2 === 0 ? "right" : "left",
              }}>
                {i % 2 === 0 ? (
                  <StepCard step={step} align="right" />
                ) : (
                  <div style={{ height: "100%" }} />
                )}
              </div>

              {/* 中轴线 */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 32 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
                  background: `linear-gradient(135deg, ${step.color}33, ${step.color}18)`,
                  border: `2px solid ${step.color}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 0 20px ${step.color}30`,
                  zIndex: 2, position: "relative",
                }}>
                  <step.icon size={20} color={step.color} />
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{
                    width: 2, flex: 1, minHeight: 80,
                    background: `linear-gradient(180deg, ${step.color}60, ${STEPS[i+1].color}30)`,
                    marginTop: 8,
                  }} />
                )}
              </div>

              {/* 右侧（偶数步骤显示内容，奇数步骤空白） */}
              <div style={{ padding: "32px 0 32px 32px" }}>
                {i % 2 !== 0 ? (
                  <StepCard step={step} align="left" />
                ) : (
                  <div style={{ height: "100%" }} />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* 常见问题 */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "white", textAlign: "center", marginBottom: 32 }}>
            常见问题
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(420px,1fr))", gap: 16, marginBottom: 64 }}>
            {FAQS.map((faq) => (
              <div key={faq.q} className="glass" style={{ padding: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#00d4ff", marginBottom: 10 }}>Q: {faq.q}</div>
                <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>A: {faq.a}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{
            textAlign: "center", padding: "56px 32px", borderRadius: 20,
            background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(0,212,255,0.05))",
            border: "1px solid rgba(124,58,237,0.15)",
          }}>
          <Clock size={32} color="#7c3aed" style={{ marginBottom: 16 }} />
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "white", marginBottom: 10 }}>准备好开始了吗？</h2>
          <p style={{ color: "#64748b", marginBottom: 28 }}>提交需求，1小时内获得专属顾问回复</p>
          <Link href="/order" className="btn-main" style={{ fontSize: 15, padding: "13px 32px" }}>
            立即提交需求 <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </PageWrapper>
  );
}

function StepCard({ step, align }: { step: typeof STEPS[0]; align: "left" | "right" }) {
  return (
    <div className="glass" style={{
      padding: 28,
      borderLeft: align === "left" ? `3px solid ${step.color}` : undefined,
      borderRight: align === "right" ? `3px solid ${step.color}` : undefined,
      textAlign: "left",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        justifyContent: align === "right" ? "flex-end" : "flex-start",
        marginBottom: 12, flexWrap: "wrap",
      }}>
        <span style={{
          fontFamily: "Orbitron, sans-serif", fontSize: 28, fontWeight: 900,
          color: step.color, opacity: 0.5,
        }}>{step.num}</span>
        <span style={{ fontSize: 16, fontWeight: 700, color: "white" }}>{step.title}</span>
        <span style={{
          fontSize: 11, padding: "2px 10px", borderRadius: 100,
          background: `${step.color}15`, border: `1px solid ${step.color}30`, color: step.color,
        }}>{step.time}</span>
      </div>
      <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, marginBottom: 16 }}>{step.desc}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        {step.details.map((d) => (
          <div key={d} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#94a3b8" }}>
            <CheckCircle size={11} color={step.color} style={{ flexShrink: 0 }} /> {d}
          </div>
        ))}
      </div>
    </div>
  );
}
