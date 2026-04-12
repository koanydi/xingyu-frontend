"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Code2, CheckSquare, Square, Plus, Minus,
  Zap, ArrowRight, X, Smartphone, QrCode, Clock,
  ShoppingCart, ChevronDown, ChevronUp
} from "lucide-react";
import Link from "next/link";
import PageWrapper from "@/components/PageWrapper";

// ─── 定价数据 ───────────────────────────────────────────────────
type Category = "website" | "miniapp" | "app" | "system";

const CATEGORIES: { id: Category; icon: typeof Globe; label: string; subtitle: string; base: number; color: string }[] = [
  { id: "website", icon: Globe, label: "网站开发", subtitle: "企业官网 / 电商 / SaaS", base: 1500, color: "#00d4ff" },
  { id: "miniapp", icon: Smartphone, label: "小程序", subtitle: "微信 / 抖音 / 支付宝", base: 3000, color: "#7c3aed" },
  { id: "app", icon: Smartphone, label: "App 开发", subtitle: "iOS / Android / 跨平台", base: 6000, color: "#06ffd4" },
  { id: "system", icon: Code2, label: "管理系统", subtitle: "ERP / CRM / OA / 定制", base: 5000, color: "#f59e0b" },
];

interface OptionItem {
  id: string;
  label: string;
  desc: string;
  price: number;
  unit?: string;
  min?: number;
  max?: number;
}

const OPTIONS: Record<Category, { section: string; items: OptionItem[] }[]> = {
  website: [
    {
      section: "页面数量",
      items: [
        { id: "pages", label: "内页数量", desc: "首页已含，每增加一个内页", price: 400, unit: "页", min: 0, max: 20 },
      ]
    },
    {
      section: "基础功能",
      items: [
        { id: "responsive", label: "响应式适配", desc: "手机/平板/PC完美适配", price: 500 },
        { id: "seo", label: "SEO 优化", desc: "搜索引擎优化，提升排名", price: 600 },
        { id: "animation", label: "动效设计", desc: "高级交互动画效果", price: 800 },
        { id: "multilang", label: "多语言支持", desc: "中英文等多语言切换", price: 1200 },
      ]
    },
    {
      section: "高级功能",
      items: [
        { id: "cms", label: "内容管理后台", desc: "可视化内容编辑系统", price: 2000 },
        { id: "auth", label: "用户登录注册", desc: "账号体系 + 权限管理", price: 1200 },
        { id: "payment", label: "在线支付集成", desc: "微信/支付宝支付接入", price: 1800 },
        { id: "im", label: "在线客服系统", desc: "实时消息 + 聊天功能", price: 1500 },
        { id: "stats", label: "数据统计报表", desc: "访问数据可视化看板", price: 1500 },
        { id: "ai", label: "AI 智能功能", desc: "智能问答/推荐/生成", price: 2500 },
      ]
    },
    {
      section: "交付配置",
      items: [
        { id: "domain", label: "域名配置", desc: "域名解析 + SSL 证书", price: 300 },
        { id: "deploy", label: "服务器部署", desc: "云服务器配置上线", price: 500 },
        { id: "maintain", label: "1年维护服务", desc: "bug修复 + 小功能更新", price: 1200 },
      ]
    }
  ],
  miniapp: [
    {
      section: "页面数量",
      items: [
        { id: "pages", label: "功能页面数", desc: "首页已含，每增加一个功能页", price: 500, unit: "页", min: 0, max: 30 },
      ]
    },
    {
      section: "核心功能",
      items: [
        { id: "auth", label: "用户登录授权", desc: "微信一键登录授权", price: 600 },
        { id: "payment", label: "微信支付", desc: "微信支付 + 退款功能", price: 1500 },
        { id: "push", label: "消息推送", desc: "订阅消息/模板消息", price: 800 },
        { id: "location", label: "地图定位", desc: "地图展示 + 位置服务", price: 800 },
        { id: "share", label: "分享邀请", desc: "分享卡片 + 邀请裂变", price: 600 },
        { id: "scan", label: "扫码功能", desc: "二维码/条形码扫描", price: 500 },
      ]
    },
    {
      section: "业务功能",
      items: [
        { id: "mall", label: "商城系统", desc: "商品 + 购物车 + 订单", price: 2500 },
        { id: "booking", label: "预约系统", desc: "在线预约 + 日历管理", price: 1500 },
        { id: "member", label: "会员积分", desc: "会员等级 + 积分兑换", price: 1200 },
        { id: "admin", label: "管理后台", desc: "Web端数据管理系统", price: 2000 },
        { id: "ai", label: "AI 功能", desc: "智能客服/推荐/生成", price: 2500 },
        { id: "live", label: "直播功能", desc: "小程序直播间", price: 3500 },
      ]
    },
    {
      section: "交付配置",
      items: [
        { id: "submit", label: "审核上架辅助", desc: "协助提交小程序审核", price: 300 },
        { id: "maintain", label: "1年维护服务", desc: "版本更新 + bug修复", price: 1500 },
      ]
    }
  ],
  app: [
    {
      section: "平台选择",
      items: [
        { id: "android", label: "Android 版本", desc: "安卓原生或跨平台", price: 0 },
        { id: "ios", label: "iOS 版本", desc: "苹果原生或跨平台（+3000）", price: 3000 },
      ]
    },
    {
      section: "页面数量",
      items: [
        { id: "pages", label: "功能界面数", desc: "基础界面已含，每增加一个", price: 600, unit: "个", min: 0, max: 30 },
      ]
    },
    {
      section: "核心功能",
      items: [
        { id: "auth", label: "用户系统", desc: "注册/登录/个人中心", price: 1000 },
        { id: "payment", label: "支付系统", desc: "微信/支付宝/苹果支付", price: 2000 },
        { id: "push", label: "消息推送", desc: "App 推送通知", price: 800 },
        { id: "im", label: "即时通讯", desc: "私信/群聊功能", price: 3000 },
        { id: "location", label: "地图导航", desc: "地图 + LBS定位服务", price: 1200 },
        { id: "camera", label: "相机/相册", desc: "拍照/录像/上传功能", price: 600 },
      ]
    },
    {
      section: "业务功能",
      items: [
        { id: "mall", label: "商城模块", desc: "完整电商购物流程", price: 3000 },
        { id: "content", label: "内容社区", desc: "帖子/评论/点赞", price: 2000 },
        { id: "live", label: "直播功能", desc: "推流/拉流/互动", price: 5000 },
        { id: "admin", label: "管理后台", desc: "Web端运营管理系统", price: 2500 },
        { id: "ai", label: "AI 功能", desc: "智能推荐/客服/生成", price: 3000 },
      ]
    },
    {
      section: "交付配置",
      items: [
        { id: "submit", label: "应用商店上架", desc: "协助上架各大应用商店", price: 500 },
        { id: "maintain", label: "1年维护服务", desc: "版本迭代 + bug修复", price: 2000 },
      ]
    }
  ],
  system: [
    {
      section: "系统规模",
      items: [
        { id: "modules", label: "功能模块数", desc: "基础模块已含，每增加一个", price: 1000, unit: "个", min: 0, max: 20 },
        { id: "users", label: "并发用户数（千）", desc: "支持并发用户数扩展", price: 2000, unit: "千人", min: 0, max: 10 },
      ]
    },
    {
      section: "基础模块",
      items: [
        { id: "auth", label: "用户权限管理", desc: "角色/菜单/数据权限", price: 2000 },
        { id: "log", label: "操作日志审计", desc: "全链路操作记录", price: 1000 },
        { id: "workflow", label: "工作流引擎", desc: "可视化流程审批", price: 3000 },
        { id: "report", label: "报表统计", desc: "数据可视化看板", price: 2000 },
        { id: "notice", label: "消息通知", desc: "站内信/邮件/短信", price: 1000 },
        { id: "export", label: "Excel 导入导出", desc: "批量数据处理", price: 800 },
      ]
    },
    {
      section: "高级能力",
      items: [
        { id: "api", label: "开放 API", desc: "对外接口 + API 文档", price: 2000 },
        { id: "saas", label: "多租户 SaaS", desc: "数据隔离 + 独立配置", price: 5000 },
        { id: "ai", label: "AI 智能分析", desc: "AI 预测 + 异常检测", price: 4000 },
        { id: "mobile", label: "移动端适配", desc: "配套 App 或小程序", price: 8000 },
      ]
    },
    {
      section: "交付配置",
      items: [
        { id: "deploy", label: "私有化部署", desc: "内网/云服务器部署", price: 1000 },
        { id: "doc", label: "完整技术文档", desc: "系统文档 + 用户手册", price: 500 },
        { id: "maintain", label: "1年维护服务", desc: "功能迭代 + 运维支持", price: 3000 },
      ]
    }
  ]
};

// ─── 支付弹窗 ────────────────────────────────────────────────────
function PayModal({
  total, category, onClose
}: { total: number; category: Category; onClose: () => void }) {
  const [method, setMethod] = useState<"wechat" | "alipay">("wechat");
  const [paid, setPaid] = useState(false);
  const catLabel = CATEGORIES.find(c => c.id === category)?.label ?? "";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24
    }} onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        style={{
          width: "100%", maxWidth: 440,
          background: "#0f1628", borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.1)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}>

        {/* 弹窗头 */}
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "linear-gradient(135deg, rgba(0,212,255,0.08), rgba(124,58,237,0.06))"
        }}>
          <div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 2 }}>订单金额</div>
            <div style={{ fontSize: 28, fontWeight: 900, fontFamily: "Orbitron, sans-serif", color: "#00d4ff" }}>
              ¥{total.toLocaleString()}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 24 }}>
          {/* 订单摘要 */}
          <div style={{
            padding: "12px 16px", borderRadius: 10, marginBottom: 24,
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
            fontSize: 13, color: "#64748b",
          }}>
            <span style={{ color: "#94a3b8" }}>{catLabel}</span> · 一口价方案 · 含所选全部功能
          </div>

          {/* 支付方式 */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: "#475569", marginBottom: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>选择支付方式</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { id: "wechat" as const, label: "微信支付", color: "#07c160", emoji: "💚" },
                { id: "alipay" as const, label: "支付宝", color: "#1677ff", emoji: "💙" },
              ].map((m) => (
                <button key={m.id} onClick={() => setMethod(m.id)} style={{
                  padding: "12px", borderRadius: 10, cursor: "pointer",
                  border: `1px solid ${method === m.id ? m.color : "rgba(255,255,255,0.08)"}`,
                  background: method === m.id ? `${m.color}12` : "rgba(255,255,255,0.03)",
                  color: method === m.id ? m.color : "#64748b",
                  fontSize: 13, fontWeight: 600, transition: "all 0.2s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                }}>
                  <span style={{ fontSize: 18 }}>{m.emoji}</span> {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* 二维码区 */}
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            padding: "28px 20px", borderRadius: 14,
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            marginBottom: 20,
          }}>
            {/* 模拟二维码 */}
            <div style={{
              width: 160, height: 160, borderRadius: 12, marginBottom: 16,
              background: "white", display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", overflow: "hidden",
            }}>
              {/* 二维码图案（纯 CSS 模拟） */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(9,1fr)", gap: 2, padding: 12 }}>
                {Array.from({ length: 81 }).map((_, i) => {
                  const r = Math.floor(i / 9), c = i % 9;
                  const corner = (r < 3 && c < 3) || (r < 3 && c > 5) || (r > 5 && c < 3);
                  const rand = ((i * 37 + 13) % 100) > 45;
                  return (
                    <div key={i} style={{
                      width: "100%", aspectRatio: "1",
                      background: (corner || rand) ? "#111" : "transparent",
                      borderRadius: corner ? 1 : 0,
                    }} />
                  );
                })}
              </div>
              {/* 遮罩提示 */}
              <div style={{
                position: "absolute", inset: 0,
                background: "rgba(255,255,255,0.92)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 8,
              }}>
                <Clock size={28} color="#94a3b8" />
                <div style={{ fontSize: 11, color: "#64748b", textAlign: "center", lineHeight: 1.5, padding: "0 10px" }}>
                  支付功能<br />开发完善中
                </div>
              </div>
            </div>

            <div style={{ fontSize: 13, color: "#64748b", textAlign: "center", lineHeight: 1.7 }}>
              {method === "wechat" ? "微信扫码支付" : "支付宝扫码支付"}
            </div>
            <div style={{
              marginTop: 8, padding: "4px 14px", borderRadius: 100, fontSize: 11,
              background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)", color: "#f59e0b"
            }}>
              在线支付功能正在接入中，敬请期待
            </div>
          </div>

          {/* 提示 */}
          <p style={{ fontSize: 12, color: "#334155", textAlign: "center", marginBottom: 16, lineHeight: 1.7 }}>
            当前支付功能仍在开发中，如需立即下单请
          </p>
          <Link href="/order" className="btn-main" style={{ width: "100%", justifyContent: "center", padding: "13px" }}
            onClick={onClose}>
            提交需求联系我们 <ArrowRight size={15} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// ─── 主页面 ────────────────────────────────────────────────────
export default function PricingPage() {
  const [category, setCategory] = useState<Category>("website");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [showPay, setShowPay] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const cat = CATEGORIES.find(c => c.id === category)!;
  const sections = OPTIONS[category];

  // 切换分类时重置
  useEffect(() => { setSelected({}); setCounts({}); }, [category]);

  // 计算总价
  const total = (() => {
    let sum = cat.base;
    for (const sec of sections) {
      for (const item of sec.items) {
        if (item.unit) {
          const cnt = counts[item.id] ?? 0;
          sum += cnt * item.price;
        } else if (selected[item.id]) {
          sum += item.price;
        }
      }
    }
    return sum;
  })();

  // 已选功能列表
  const selectedItems: { label: string; price: number }[] = [];
  selectedItems.push({ label: cat.label + "（基础版）", price: cat.base });
  for (const sec of sections) {
    for (const item of sec.items) {
      if (item.unit) {
        const cnt = counts[item.id] ?? 0;
        if (cnt > 0) selectedItems.push({ label: `${item.label} ×${cnt}`, price: cnt * item.price });
      } else if (selected[item.id]) {
        selectedItems.push({ label: item.label, price: item.price });
      }
    }
  }

  const toggleSection = (s: string) => setExpanded(e => ({ ...e, [s]: !e[s] }));

  return (
    <PageWrapper>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 24px 100px" }}>

        {/* 页头 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="section-label" style={{ color: "#f59e0b" }}>Pricing</div>
          <h1 className="section-title">一口价计算器</h1>
          <div className="divider" style={{ background: "linear-gradient(90deg,#f59e0b,#ec4899)" }} />
          <p className="section-desc">选择你需要的功能，实时计算价格，透明无隐藏费用</p>
        </motion.div>

        {/* 分类选择 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 40 }}>
          {CATEGORIES.map((c) => (
            <button key={c.id} onClick={() => setCategory(c.id)} style={{
              padding: "18px 12px", borderRadius: 14, cursor: "pointer", textAlign: "center",
              border: `2px solid ${category === c.id ? c.color : "rgba(255,255,255,0.06)"}`,
              background: category === c.id ? `${c.color}12` : "rgba(255,255,255,0.03)",
              transition: "all 0.2s",
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, margin: "0 auto 10px",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: `${c.color}18`, border: `1px solid ${c.color}30`,
              }}>
                <c.icon size={18} color={c.color} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: category === c.id ? "white" : "#94a3b8", marginBottom: 2 }}>{c.label}</div>
              <div style={{ fontSize: 11, color: "#475569" }}>{c.subtitle}</div>
            </button>
          ))}
        </div>

        {/* 主体：左选项 + 右汇总 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>

          {/* 左：选项列表 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* 基础费用 */}
            <div className="glass" style={{
              padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center",
              borderLeft: `3px solid ${cat.color}`,
            }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 2 }}>{cat.label}基础版</div>
                <div style={{ fontSize: 12, color: "#475569" }}>含基础架构、UI设计、测试部署</div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: cat.color, fontFamily: "Orbitron, sans-serif" }}>
                ¥{cat.base.toLocaleString()}
              </div>
            </div>

            {/* 各选项分区 */}
            {sections.map((sec) => {
              const isOpen = expanded[sec.section] !== false; // 默认展开
              return (
                <div key={sec.section} className="glass" style={{ overflow: "hidden" }}>
                  {/* 分区标题 */}
                  <button onClick={() => toggleSection(sec.section)} style={{
                    width: "100%", padding: "16px 24px",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: "none", border: "none", cursor: "pointer",
                    borderBottom: isOpen ? "1px solid rgba(255,255,255,0.06)" : "none",
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.05em" }}>{sec.section}</span>
                    {isOpen ? <ChevronUp size={16} color="#475569" /> : <ChevronDown size={16} color="#475569" />}
                  </button>

                  {isOpen && (
                    <div style={{ padding: "8px 0" }}>
                      {sec.items.map((item) => (
                        <div key={item.id} style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "12px 24px", transition: "background 0.15s",
                          gap: 12,
                        }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>

                          {/* 勾选/步进 */}
                          {item.unit ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                              <button onClick={() => setCounts(c => ({ ...c, [item.id]: Math.max(item.min ?? 0, (c[item.id] ?? 0) - 1) }))}
                                style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Minus size={12} />
                              </button>
                              <span style={{ fontSize: 15, fontWeight: 700, color: "white", minWidth: 20, textAlign: "center" }}>
                                {counts[item.id] ?? 0}
                              </span>
                              <button onClick={() => setCounts(c => ({ ...c, [item.id]: Math.min(item.max ?? 99, (c[item.id] ?? 0) + 1) }))}
                                style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${cat.color}44`, background: `${cat.color}12`, cursor: "pointer", color: cat.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Plus size={12} />
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => setSelected(s => ({ ...s, [item.id]: !s[item.id] }))} style={{ background: "none", border: "none", cursor: "pointer", flexShrink: 0, color: selected[item.id] ? cat.color : "#334155" }}>
                              {selected[item.id] ? <CheckSquare size={20} /> : <Square size={20} />}
                            </button>
                          )}

                          {/* 描述 */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 500, color: "white", marginBottom: 2 }}>{item.label}</div>
                            <div style={{ fontSize: 12, color: "#475569" }}>{item.desc}</div>
                          </div>

                          {/* 价格 */}
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#94a3b8" }}>
                              {item.unit ? `+¥${item.price.toLocaleString()}/${item.unit}` : `+¥${item.price.toLocaleString()}`}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 右：价格汇总（sticky） */}
          <div style={{ position: "sticky", top: 80 }}>
            <div className="glass" style={{ overflow: "hidden" }}>
              {/* 头部 */}
              <div style={{
                padding: "24px",
                background: `linear-gradient(135deg, ${cat.color}12, ${cat.color}06)`,
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>当前报价</div>
                <motion.div
                  key={total}
                  initial={{ scale: 0.95, opacity: 0.7 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{ fontSize: 36, fontWeight: 900, fontFamily: "Orbitron, sans-serif", color: cat.color }}>
                  ¥{total.toLocaleString()}
                </motion.div>
                <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>一口价，含所选全部功能</div>
              </div>

              {/* 已选清单 */}
              <div style={{ padding: "16px 20px", maxHeight: 320, overflowY: "auto" }}>
                <div style={{ fontSize: 11, color: "#334155", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>费用明细</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {selectedItems.map((si, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12, color: "#64748b", flex: 1, minWidth: 0 }}>{si.label}</span>
                      <span style={{ fontSize: 12, color: "#94a3b8", flexShrink: 0 }}>¥{si.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 分割线 + 总计 */}
              <div style={{ padding: "0 20px 16px" }}>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12, marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8" }}>合计</span>
                  <span style={{ fontSize: 15, fontWeight: 900, color: "white" }}>¥{total.toLocaleString()}</span>
                </div>

                {/* 支付按钮 */}
                <button onClick={() => setShowPay(true)} className="btn-main" style={{ width: "100%", padding: "13px", borderRadius: 12 }}>
                  <ShoppingCart size={16} /> 立即支付
                </button>
                <Link href="/order" style={{
                  display: "block", textAlign: "center", marginTop: 10, fontSize: 12,
                  color: "#475569", textDecoration: "none", transition: "color 0.2s"
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4ff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}>
                  或提交需求让我们来报价 →
                </Link>
              </div>

              {/* 底部说明 */}
              <div style={{
                padding: "14px 20px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)",
              }}>
                {["价格透明，无隐藏费", "源码100%归你所有", "30天免费售后保障"].map((t) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#334155", marginBottom: 6 }}>
                    <Zap size={10} color={cat.color} /> {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 支付弹窗 */}
      <AnimatePresence>
        {showPay && <PayModal total={total} category={category} onClose={() => setShowPay(false)} />}
      </AnimatePresence>
    </PageWrapper>
  );
}
