"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Users, Clock, Star } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";

const CASES = [
  {
    id: "01", color: "#00d4ff",
    title: "智能餐饮小程序",
    type: "微信小程序", client: "连锁餐饮品牌",
    desc: "为连锁餐饮品牌打造的全功能小程序，支持在线点餐、扫码支付、会员积分、外卖配送，日活用户超过2000人，营业额提升35%。",
    metrics: [
      { icon: Users, label: "月活用户", val: "2万+" },
      { icon: TrendingUp, label: "营业额提升", val: "35%" },
      { icon: Clock, label: "开发周期", val: "3周" },
      { icon: Star, label: "用户评分", val: "4.9" },
    ],
    tech: ["微信云开发", "Node.js", "MySQL", "Redis"],
    highlights: ["扫码点餐流程", "微信支付集成", "智能推荐算法", "多门店管理"],
  },
  {
    id: "02", color: "#7c3aed",
    title: "企业 HR 管理系统",
    type: "Web 系统", client: "制造业集团",
    desc: "为千人规模制造业集团定制的HR管理系统，覆盖招聘、入职、考勤、薪资、绩效全流程，人事工作效率提升80%，年节省人力成本40万+。",
    metrics: [
      { icon: Users, label: "管理员工", val: "3000+" },
      { icon: TrendingUp, label: "效率提升", val: "80%" },
      { icon: Clock, label: "开发周期", val: "6周" },
      { icon: Star, label: "服务企业", val: "50+" },
    ],
    tech: ["React", "Golang", "MySQL", "Docker"],
    highlights: ["智能考勤打卡", "薪资自动核算", "绩效管理体系", "多级审批流程"],
  },
  {
    id: "03", color: "#06ffd4",
    title: "跨境电商 App",
    type: "iOS + Android", client: "出口贸易企业",
    desc: "面向东南亚市场的跨境电商App，支持8种语言、多种支付方式，AI智能选品和推荐，上线3个月GMV月增30%，用户好评率98%。",
    metrics: [
      { icon: TrendingUp, label: "月GMV增长", val: "30%" },
      { icon: Users, label: "注册用户", val: "5万+" },
      { icon: Clock, label: "开发周期", val: "8周" },
      { icon: Star, label: "好评率", val: "98%" },
    ],
    tech: ["React Native", "Node.js", "Redis", "AWS"],
    highlights: ["8种语言支持", "多币种支付", "AI智能推荐", "实时物流追踪"],
  },
  {
    id: "04", color: "#f59e0b",
    title: "AI 智能客服系统",
    type: "AI 功能集成", client: "教育科技公司",
    desc: "基于GPT-4的智能客服系统，覆盖售前咨询、售后服务、课程推荐，7×24小时在线，解决率85%，客服人力成本降低60%。",
    metrics: [
      { icon: TrendingUp, label: "问题解决率", val: "85%" },
      { icon: Users, label: "服务用户", val: "10万+" },
      { icon: Clock, label: "开发周期", val: "4周" },
      { icon: Star, label: "成本降低", val: "60%" },
    ],
    tech: ["GPT-4", "Python", "FastAPI", "PostgreSQL"],
    highlights: ["多轮对话理解", "知识库管理", "人工接管转换", "对话分析报告"],
  },
  {
    id: "05", color: "#ec4899",
    title: "社区团购小程序",
    type: "微信小程序", client: "社区服务公司",
    desc: "社区团购平台，支持团长招募、商品团购、自提核销全流程，上线首月GMV破百万，团长超500人，覆盖20+小区。",
    metrics: [
      { icon: TrendingUp, label: "首月GMV", val: "100万+" },
      { icon: Users, label: "注册团长", val: "500+" },
      { icon: Clock, label: "开发周期", val: "4周" },
      { icon: Star, label: "覆盖小区", val: "20+" },
    ],
    tech: ["微信小程序", "PHP", "MySQL", "OSS"],
    highlights: ["团长管理体系", "社区配送路线", "自提核销流程", "分佣结算系统"],
  },
  {
    id: "06", color: "#10b981",
    title: "设备监控 SaaS 平台",
    type: "Web + 移动端", client: "工业设备厂商",
    desc: "工业IoT设备实时监控平台，支持千台设备接入、实时数据采集、异常告警、远程控制，帮助客户减少设备故障损失70%。",
    metrics: [
      { icon: Users, label: "接入设备", val: "1000+" },
      { icon: TrendingUp, label: "故障减少", val: "70%" },
      { icon: Clock, label: "开发周期", val: "10周" },
      { icon: Star, label: "企业客户", val: "30+" },
    ],
    tech: ["Vue.js", "Go", "InfluxDB", "MQTT"],
    highlights: ["实时数据可视化", "设备远程控制", "智能异常告警", "多租户SaaS架构"],
  },
];

export default function CasesPage() {
  return (
    <PageWrapper>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 24px 80px" }}>

        {/* 页头 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="section-label" style={{ color: "#06ffd4" }}>Cases</div>
          <h1 className="section-title">案例展示</h1>
          <div className="divider" style={{ background: "linear-gradient(90deg,#06ffd4,#00d4ff)" }} />
          <p className="section-desc">真实案例，数据说话，我们用结果证明实力</p>
        </motion.div>

        {/* 案例列表 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32, marginBottom: 72 }}>
          {CASES.map((c, i) => (
            <motion.div key={c.id}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.05 * i }}
              className="glass glass-hover"
              style={{ padding: 32, borderLeft: `3px solid ${c.color}` }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 24,
                alignItems: "start",
              }}>
                {/* 左侧内容 */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
                    <span style={{
                      fontFamily: "Orbitron, sans-serif", fontSize: 32, fontWeight: 900,
                      color: c.color, opacity: 0.3,
                    }}>{c.id}</span>
                    <div>
                      <h2 style={{ fontSize: 20, fontWeight: 700, color: "white" }}>{c.title}</h2>
                      <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                        <span style={{
                          fontSize: 12, padding: "2px 10px", borderRadius: 100,
                          background: `${c.color}15`, border: `1px solid ${c.color}30`, color: c.color
                        }}>{c.type}</span>
                        <span style={{ fontSize: 12, color: "#475569" }}>客户：{c.client}</span>
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.8, marginBottom: 20, maxWidth: 600 }}>{c.desc}</p>

                  {/* 技术栈 + 亮点 */}
                  <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px 24px", alignItems: "start" }}>
                    <div>
                      <div style={{ fontSize: 11, color: "#475569", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>技术栈</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {c.tech.map((t) => (
                          <span key={t} style={{
                            fontSize: 11, padding: "3px 10px", borderRadius: 6,
                            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                            color: "#64748b"
                          }}>{t}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "#475569", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>核心功能</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {c.highlights.map((h) => (
                          <span key={h} style={{
                            fontSize: 11, padding: "3px 10px", borderRadius: 6,
                            background: `${c.color}10`, border: `1px solid ${c.color}20`, color: c.color
                          }}>{h}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 右侧数据 */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, minWidth: 200 }}>
                  {c.metrics.map((m) => (
                    <div key={m.label} style={{
                      padding: "14px 12px", borderRadius: 12, textAlign: "center",
                      background: `${c.color}0a`, border: `1px solid ${c.color}18`,
                    }}>
                      <m.icon size={14} color={c.color} style={{ margin: "0 auto 6px" }} />
                      <div style={{ fontSize: 18, fontWeight: 800, color: c.color, lineHeight: 1 }}>{m.val}</div>
                      <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{
            textAlign: "center", padding: "56px 32px", borderRadius: 20,
            background: "linear-gradient(135deg, rgba(6,255,212,0.05), rgba(0,212,255,0.05))",
            border: "1px solid rgba(6,255,212,0.12)",
          }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "white", marginBottom: 10 }}>你的项目也可以成为下一个案例</h2>
          <p style={{ color: "#64748b", marginBottom: 28 }}>提交需求，开启你的数字化转型之旅</p>
          <Link href="/order" className="btn-main" style={{ fontSize: 15, padding: "13px 32px" }}>
            立即开始 <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
