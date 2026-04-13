"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Clock, XCircle, Send, RefreshCw } from "lucide-react";
import { AdminLayout } from "@/app/admin/dashboard/page";
import { adminGetOrders, adminManualDeliver, type AdminOrder } from "@/lib/api";

const STATUS_FILTER = [
  { value: "", label: "全部" },
  { value: "paid", label: "已支付" },
  { value: "pending", label: "待支付" },
  { value: "expired", label: "已过期" },
];

const channelLabel: Record<string, string> = { wechat: "💚微信", alipay: "💙支付宝", usdt: "🪙USDT" };

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) { router.push("/admin/login"); return; }
    load();
  }, [router, statusFilter]);

  async function load() {
    setLoading(true);
    try {
      const r = await adminGetOrders(statusFilter || undefined);
      setOrders(r.list || []);
      setTotal(r.total || 0);
    } finally { setLoading(false); }
  }

  async function manualDeliver(orderNo: string) {
    if (!confirm("手动触发发货？")) return;
    try {
      await adminManualDeliver(orderNo);
      alert("发货成功");
      await load();
    } catch (e: unknown) { alert((e as Error).message); }
  }

  return (
    <AdminLayout title="订单管理">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {STATUS_FILTER.map(f => (
            <button key={f.value} onClick={() => setStatusFilter(f.value)} style={{
              padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600,
              border: `1px solid ${statusFilter === f.value ? "rgba(0,212,255,0.4)" : "rgba(255,255,255,0.06)"}`,
              background: statusFilter === f.value ? "rgba(0,212,255,0.1)" : "transparent",
              color: statusFilter === f.value ? "#00d4ff" : "#64748b",
            }}>
              {f.label}
            </button>
          ))}
        </div>
        <button onClick={load} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569" }}>
          <RefreshCw size={16} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
        </button>
      </div>

      <div style={{ fontSize: 12, color: "#334155", marginBottom: 16 }}>共 {total} 条订单</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {orders.map(order => {
          const isPaid = order.pay_status === "paid";
          const isDelivered = order.delivery_status === "delivered";
          return (
            <div key={order.id} style={{
              padding: "16px 20px", borderRadius: 10,
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontFamily: "monospace", color: "#64748b" }}>{order.order_no}</span>
                    <span style={{
                      fontSize: 10, padding: "1px 7px", borderRadius: 100,
                      background: isPaid ? "rgba(6,255,212,0.1)" : "rgba(245,158,11,0.1)",
                      color: isPaid ? "#06ffd4" : "#f59e0b",
                      border: `1px solid ${isPaid ? "rgba(6,255,212,0.2)" : "rgba(245,158,11,0.2)"}`,
                    }}>
                      {isPaid ? "已支付" : order.pay_status === "expired" ? "已过期" : "待支付"}
                    </span>
                    {isDelivered && (
                      <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 100, background: "rgba(124,58,237,0.1)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.2)" }}>
                        已发货
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 4 }}>
                    {order.product_name} × {order.quantity}
                  </div>
                  <div style={{ fontSize: 12, color: "#475569" }}>
                    {channelLabel[order.pay_channel]} · {order.pay_channel === "usdt" ? `${order.pay_amount.toFixed(2)} USDT` : `¥${order.pay_amount.toFixed(2)}`}
                    · {order.buyer_email}
                    {order.buyer_qq && ` · QQ: ${order.buyer_qq}`}
                  </div>
                  <div style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>
                    {new Date(order.created_at || "").toLocaleString("zh-CN")}
                  </div>
                </div>

                {isPaid && !isDelivered && (
                  <button onClick={() => manualDeliver(order.order_no)} style={{
                    padding: "7px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600,
                    border: "1px solid rgba(0,212,255,0.3)", background: "rgba(0,212,255,0.08)", color: "#00d4ff",
                    display: "flex", alignItems: "center", gap: 6,
                  }}>
                    <Send size={12} /> 手动发货
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {orders.length === 0 && !loading && (
          <div style={{ textAlign: "center", padding: 40, color: "#334155" }}>暂无订单</div>
        )}
      </div>
    </AdminLayout>
  );
}
