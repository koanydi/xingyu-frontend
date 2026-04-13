"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Wifi, WifiOff, Settings } from "lucide-react";
import { AdminLayout } from "@/app/admin/dashboard/page";
import {
  adminGetAccounts, adminCreateAccount, adminUpdateAccount, adminDeleteAccount,
  adminGetPayLogs, adminSetUSDTAddress, getUSDTInfo,
  type PayAccount, type PayLog,
} from "@/lib/api";

export default function AdminAccountsPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<PayAccount[]>([]);
  const [logs, setLogs] = useState<PayLog[]>([]);
  const [editAcc, setEditAcc] = useState<Partial<PayAccount> | null>(null);
  const [usdtAddr, setUsdtAddr] = useState("");
  const [usdtRate, setUsdtRate] = useState(0);
  const [tab, setTab] = useState<"accounts" | "logs" | "usdt">("accounts");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) { router.push("/admin/login"); return; }
    load();
  }, [router]);

  async function load() {
    const [accs, ls, usdt] = await Promise.all([
      adminGetAccounts(), adminGetPayLogs(), getUSDTInfo(),
    ]);
    setAccounts(accs);
    setLogs(ls);
    setUsdtAddr(usdt.address || "");
    setUsdtRate(usdt.rate);
  }

  async function saveAccount() {
    if (!editAcc?.channel || !editAcc?.nickname) { setMsg("请填写必填项"); return; }
    setLoading(true);
    try {
      if (editAcc.id) {
        await adminUpdateAccount(editAcc.id, editAcc);
      } else {
        await adminCreateAccount(editAcc);
      }
      setEditAcc(null); setMsg(""); await load();
    } catch (e: unknown) { setMsg((e as Error).message); }
    finally { setLoading(false); }
  }

  async function deleteAccount(id: number) {
    if (!confirm("确认删除此账号？")) return;
    await adminDeleteAccount(id);
    await load();
  }

  async function saveUSDT() {
    await adminSetUSDTAddress(usdtAddr);
    alert("USDT地址已更新");
  }

  const TABS = [
    { id: "accounts" as const, label: "收款账号" },
    { id: "usdt" as const, label: "USDT 设置" },
    { id: "logs" as const, label: "支付日志" },
  ];

  return (
    <AdminLayout title="收款账号管理">
      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "7px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
            border: `1px solid ${tab === t.id ? "rgba(0,212,255,0.4)" : "rgba(255,255,255,0.06)"}`,
            background: tab === t.id ? "rgba(0,212,255,0.1)" : "transparent",
            color: tab === t.id ? "#00d4ff" : "#64748b",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* 收款账号列表 */}
      {tab === "accounts" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "#475569" }}>
              添加微信/支付宝个人收款二维码，系统自动轮换
            </div>
            <button onClick={() => setEditAcc({ channel: "wechat", daily_limit: 2000, order_limit_min: 1, order_limit_max: 500 })}
              className="btn-main" style={{ padding: "8px 16px" }}>
              <Plus size={14} /> 添加账号
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {accounts.map(acc => (
              <div key={acc.id} style={{
                padding: "16px 20px", borderRadius: 10,
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: acc.is_online ? "#06ffd4" : "#334155",
                    boxShadow: acc.is_online ? "0 0 6px #06ffd4" : "none",
                  }} />
                  <span style={{ fontWeight: 700, color: "white", fontSize: 14 }}>{acc.nickname}</span>
                  <span style={{
                    fontSize: 11, padding: "2px 8px", borderRadius: 100,
                    background: acc.channel === "wechat" ? "rgba(7,193,96,0.12)" : "rgba(22,119,255,0.12)",
                    color: acc.channel === "wechat" ? "#07c160" : "#1677ff",
                    border: `1px solid ${acc.channel === "wechat" ? "rgba(7,193,96,0.3)" : "rgba(22,119,255,0.3)"}`,
                  }}>
                    {acc.channel === "wechat" ? "微信" : "支付宝"}
                  </span>
                  {!acc.is_active && (
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 100, background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
                      已禁用
                    </span>
                  )}
                  <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                    <button onClick={() => setEditAcc(acc)} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569" }}>
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => deleteAccount(acc.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569" }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {/* 今日额度进度 */}
                <div style={{ marginBottom: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#475569", marginBottom: 4 }}>
                    <span>今日已收</span>
                    <span>¥{acc.today_received.toFixed(0)} / ¥{acc.daily_limit.toFixed(0)}</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)" }}>
                    <div style={{
                      height: "100%", borderRadius: 2,
                      background: acc.today_received / acc.daily_limit > 0.8 ? "#f59e0b" : "#00d4ff",
                      width: `${Math.min(100, (acc.today_received / acc.daily_limit) * 100)}%`,
                      transition: "width 0.3s",
                    }} />
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "#334155" }}>
                  单笔限额：¥{acc.order_limit_min} ~ ¥{acc.order_limit_max}
                  {acc.is_online
                    ? <span style={{ color: "#06ffd4", marginLeft: 12 }}>● 监控在线</span>
                    : <span style={{ color: "#334155", marginLeft: 12 }}>○ 监控离线</span>}
                </div>
              </div>
            ))}
            {accounts.length === 0 && (
              <div style={{ textAlign: "center", padding: 40, color: "#334155" }}>
                暂无收款账号，点击「添加账号」开始配置
              </div>
            )}
          </div>

          {/* 编辑账号弹窗 */}
          {editAcc && (
            <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
              <div style={{ width: "100%", maxWidth: 440, background: "#0f1628", borderRadius: 16, border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 700, color: "white" }}>{editAcc.id ? "编辑账号" : "添加收款账号"}</span>
                  <button onClick={() => { setEditAcc(null); setMsg(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569" }}><X size={16} /></button>
                </div>
                <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <div style={{ fontSize: 12, color: "#475569", marginBottom: 6 }}>支付渠道 *</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[{ id: "wechat", label: "💚 微信支付" }, { id: "alipay", label: "💙 支付宝" }].map(ch => (
                        <button key={ch.id} onClick={() => setEditAcc({ ...editAcc, channel: ch.id })} style={{
                          flex: 1, padding: "9px", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 600,
                          border: `1px solid ${editAcc.channel === ch.id ? "rgba(0,212,255,0.4)" : "rgba(255,255,255,0.08)"}`,
                          background: editAcc.channel === ch.id ? "rgba(0,212,255,0.08)" : "transparent",
                          color: editAcc.channel === ch.id ? "white" : "#64748b",
                        }}>
                          {ch.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {[
                    { key: "nickname", label: "备注名称 *", placeholder: "如：张三微信" },
                    { key: "qr_image", label: "二维码图片文件名", placeholder: "上传后的文件名，如：qr_wechat1.jpg" },
                    { key: "webhook_secret", label: "Webhook密钥", placeholder: "AiPay App里设置的密钥" },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <div style={{ fontSize: 12, color: "#475569", marginBottom: 6 }}>{label}</div>
                      <input value={(editAcc as Record<string, unknown>)[key] as string || ""}
                        onChange={e => setEditAcc({ ...editAcc, [key]: e.target.value })}
                        placeholder={placeholder}
                        style={{ width: "100%", padding: "9px 12px", borderRadius: 7, boxSizing: "border-box", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 13, outline: "none" }} />
                    </div>
                  ))}

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                    {[
                      { key: "daily_limit", label: "日限额(元)" },
                      { key: "order_limit_min", label: "单笔最低" },
                      { key: "order_limit_max", label: "单笔最高" },
                    ].map(({ key, label }) => (
                      <div key={key}>
                        <div style={{ fontSize: 11, color: "#475569", marginBottom: 5 }}>{label}</div>
                        <input type="number" value={(editAcc as Record<string, unknown>)[key] as number || ""}
                          onChange={e => setEditAcc({ ...editAcc, [key]: parseFloat(e.target.value) || 0 })}
                          style={{ width: "100%", padding: "8px 10px", borderRadius: 7, boxSizing: "border-box", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 12, outline: "none" }} />
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    {[
                      { key: "is_active", label: "启用账号" },
                    ].map(({ key, label }) => (
                      <label key={key} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, color: "#94a3b8" }}>
                        <input type="checkbox" checked={!!(editAcc as Record<string, unknown>)[key]}
                          onChange={e => setEditAcc({ ...editAcc, [key]: e.target.checked })} />
                        {label}
                      </label>
                    ))}
                  </div>

                  {msg && <div style={{ color: "#f87171", fontSize: 12 }}>{msg}</div>}
                  <button onClick={saveAccount} disabled={loading} className="btn-main" style={{ width: "100%", padding: 11, borderRadius: 8, justifyContent: "center" }}>
                    {loading ? "保存中..." : "保存"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* USDT 设置 */}
      {tab === "usdt" && (
        <div style={{ maxWidth: 500 }}>
          <div className="glass" style={{ padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 16 }}>USDT (TRC-20) 收款配置</div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: "#475569", marginBottom: 6 }}>收款钱包地址</div>
              <input value={usdtAddr} onChange={e => setUsdtAddr(e.target.value)}
                placeholder="TRC-20 USDT 钱包地址"
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, boxSizing: "border-box", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 13, outline: "none", fontFamily: "monospace" }} />
            </div>
            <div style={{ fontSize: 12, color: "#475569", marginBottom: 20 }}>
              当前实时汇率：1 USDT ≈ ¥{usdtRate.toFixed(4)}（每5分钟自动更新）
            </div>
            <button onClick={saveUSDT} className="btn-main" style={{ padding: "10px 24px" }}>
              保存地址
            </button>
            <div style={{ marginTop: 20, padding: 14, borderRadius: 8, background: "rgba(38,161,123,0.06)", border: "1px solid rgba(38,161,123,0.15)", fontSize: 12, color: "#475569", lineHeight: 1.8 }}>
              <div style={{ fontWeight: 600, color: "#26a17b", marginBottom: 6 }}>使用说明</div>
              <div>1. 填写你的 TRC-20 USDT 收款地址</div>
              <div>2. 系统每15秒自动扫描链上交易</div>
              <div>3. 检测到匹配金额后自动发卡</div>
            </div>
          </div>
        </div>
      )}

      {/* 支付日志 */}
      {tab === "logs" && (
        <div>
          <div style={{ fontSize: 13, color: "#475569", marginBottom: 14 }}>最近100条支付通知（包含未匹配）</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {logs.map(log => (
              <div key={log.id} style={{
                padding: "12px 16px", borderRadius: 8,
                background: log.is_matched ? "rgba(6,255,212,0.04)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${log.is_matched ? "rgba(6,255,212,0.15)" : "rgba(255,255,255,0.06)"}`,
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                  background: log.is_matched ? "#06ffd4" : "#334155",
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "white", fontWeight: 500 }}>
                    {log.channel === "wechat" ? "💚" : log.channel === "alipay" ? "💙" : "🪙"} {" "}
                    {log.channel === "usdt" ? `${log.amount.toFixed(2)} USDT` : `¥${log.amount.toFixed(2)}`}
                    {log.is_matched && <span style={{ color: "#06ffd4", marginLeft: 8 }}>→ {log.matched_order_no}</span>}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "#334155" }}>
                  {new Date(log.created_at).toLocaleString("zh-CN")}
                </div>
                <div style={{
                  fontSize: 11, padding: "2px 8px", borderRadius: 100,
                  background: log.is_matched ? "rgba(6,255,212,0.1)" : "rgba(255,255,255,0.04)",
                  color: log.is_matched ? "#06ffd4" : "#475569",
                }}>
                  {log.is_matched ? "已匹配" : "未匹配"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
