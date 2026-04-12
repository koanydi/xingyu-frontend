"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LogOut, RefreshCw, Search, Filter, Eye, Edit2, Zap,
  Clock, CheckCircle, XCircle, PlayCircle, PhoneCall
} from "lucide-react";
import { getOrders, updateOrder, adminLogout } from "@/lib/api";
import StarField from "@/components/StarField";

const STATUS_MAP: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending:     { label: "待处理", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30", icon: Clock },
  contacted:   { label: "已联系", color: "text-blue-400 bg-blue-400/10 border-blue-400/30", icon: PhoneCall },
  in_progress: { label: "开发中", color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/30", icon: PlayCircle },
  completed:   { label: "已完成", color: "text-green-400 bg-green-400/10 border-green-400/30", icon: CheckCircle },
  cancelled:   { label: "已取消", color: "text-red-400 bg-red-400/10 border-red-400/30", icon: XCircle },
};

type Order = {
  id: number;
  order_no: string;
  customer_name: string;
  customer_contact: string;
  app_type: string;
  requirements: string;
  budget: string;
  status: string;
  admin_note: string;
  created_at: string;
};

export default function AdminOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);
  const [editing, setEditing] = useState(false);
  const [editNote, setEditNote] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("admin_token");
    if (!t) { router.push("/admin/login"); return; }
    setToken(t);
  }, [router]);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await getOrders(token, { page, status: filterStatus, keyword });
      if (res.data) { setOrders(res.data); setTotal(res.total); }
      else if (res.error === "未授权" || res.error === "token 无效") {
        router.push("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  }, [token, page, filterStatus, keyword, router]);

  useEffect(() => { load(); }, [load]);

  const handleLogout = async () => {
    await adminLogout(token);
    localStorage.clear();
    router.push("/admin/login");
  };

  const handleSave = async () => {
    if (!selected) return;
    await updateOrder(token, selected.id, { status: editStatus, admin_note: editNote });
    setEditing(false);
    setSelected(null);
    load();
  };

  const openDetail = (o: Order) => {
    setSelected(o);
    setEditing(false);
    setEditNote(o.admin_note || "");
    setEditStatus(o.status);
  };

  const totalPages = Math.ceil(total / 20);
  const username = typeof window !== "undefined" ? localStorage.getItem("admin_user") : "";

  return (
    <main className="min-h-screen star-bg">
      <StarField />
      <div className="relative z-10">
        {/* 顶栏 */}
        <nav className="glass-card rounded-none border-x-0 border-t-0 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-white font-semibold" style={{ fontFamily: "Orbitron, sans-serif" }}>
              订单管理
            </span>
            <span className="glass-card px-2 py-0.5 rounded text-cyan-400 text-xs">{total} 条</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-blue-300 text-sm hidden sm:block">{username}</span>
            <button onClick={handleLogout} className="btn-neon px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5">
              <LogOut size={14} /> 退出
            </button>
          </div>
        </nav>

        <div className="p-6">
          {/* 筛选 */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
              <input
                className="input-neon pl-8 pr-4 py-2 rounded-lg text-sm w-48"
                placeholder="搜索姓名/联系方式..."
                value={keyword}
                onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
              />
            </div>
            <div className="relative">
              <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
              <select
                className="input-neon pl-8 pr-8 py-2 rounded-lg text-sm appearance-none cursor-pointer"
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
              >
                <option value="">全部状态</option>
                {Object.entries(STATUS_MAP).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            <button onClick={load} className="btn-neon px-3 py-2 rounded-lg text-sm flex items-center gap-1.5">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> 刷新
            </button>
          </div>

          {/* 表格 */}
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-cyan-500/10 text-blue-400">
                    <th className="px-4 py-3 text-left">订单号</th>
                    <th className="px-4 py-3 text-left">客户</th>
                    <th className="px-4 py-3 text-left">联系方式</th>
                    <th className="px-4 py-3 text-left">类型</th>
                    <th className="px-4 py-3 text-left">预算</th>
                    <th className="px-4 py-3 text-left">状态</th>
                    <th className="px-4 py-3 text-left">时间</th>
                    <th className="px-4 py-3 text-left">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={8} className="text-center py-12 text-blue-400">
                      <div className="w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-2" />
                      加载中...
                    </td></tr>
                  ) : orders.length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-12 text-blue-400">暂无订单</td></tr>
                  ) : orders.map((o, i) => {
                    const st = STATUS_MAP[o.status] || STATUS_MAP.pending;
                    return (
                      <motion.tr
                        key={o.id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <td className="px-4 py-3 font-mono text-cyan-400 text-xs">{o.order_no}</td>
                        <td className="px-4 py-3 text-white">{o.customer_name}</td>
                        <td className="px-4 py-3 text-blue-300">{o.customer_contact}</td>
                        <td className="px-4 py-3 text-blue-200">{o.app_type}</td>
                        <td className="px-4 py-3 text-blue-300">{o.budget || "-"}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs ${st.color}`}>
                            <st.icon size={10} />
                            {st.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-blue-400 text-xs">
                          {new Date(o.created_at).toLocaleDateString("zh-CN")}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => openDetail(o)} className="text-blue-400 hover:text-cyan-400 transition-colors">
                              <Eye size={14} />
                            </button>
                            <button onClick={() => { openDetail(o); setEditing(true); }} className="text-blue-400 hover:text-purple-400 transition-colors">
                              <Edit2 size={14} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm transition-all ${
                    p === page ? "btn-primary" : "btn-neon"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 详情侧栏 */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <motion.div
            className="relative glass-card w-full max-w-md h-full overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-semibold">订单详情</h2>
                <button onClick={() => setSelected(null)} className="text-blue-400 hover:text-white">✕</button>
              </div>

              <div className="space-y-4 text-sm">
                <div className="glass-card p-3 rounded-xl">
                  <div className="text-blue-400 text-xs mb-1">订单号</div>
                  <div className="font-mono text-cyan-400">{selected.order_no}</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-card p-3 rounded-xl">
                    <div className="text-blue-400 text-xs mb-1">客户姓名</div>
                    <div className="text-white">{selected.customer_name}</div>
                  </div>
                  <div className="glass-card p-3 rounded-xl">
                    <div className="text-blue-400 text-xs mb-1">联系方式</div>
                    <div className="text-blue-200">{selected.customer_contact}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-card p-3 rounded-xl">
                    <div className="text-blue-400 text-xs mb-1">应用类型</div>
                    <div className="text-white">{selected.app_type}</div>
                  </div>
                  <div className="glass-card p-3 rounded-xl">
                    <div className="text-blue-400 text-xs mb-1">预算</div>
                    <div className="text-white">{selected.budget || "未填"}</div>
                  </div>
                </div>
                <div className="glass-card p-3 rounded-xl">
                  <div className="text-blue-400 text-xs mb-1">需求描述</div>
                  <div className="text-blue-200 leading-relaxed whitespace-pre-wrap">{selected.requirements}</div>
                </div>

                {/* 编辑区 */}
                <div className="glass-card p-4 rounded-xl space-y-3">
                  <div className="text-white font-medium text-xs uppercase tracking-widest">管理操作</div>
                  <div>
                    <label className="text-blue-400 text-xs mb-1 block">更新状态</label>
                    <select
                      className="input-neon w-full px-3 py-2 rounded-lg text-sm"
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      disabled={!editing}
                    >
                      {Object.entries(STATUS_MAP).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-blue-400 text-xs mb-1 block">备注</label>
                    <textarea
                      className="input-neon w-full px-3 py-2 rounded-lg text-sm resize-none"
                      rows={3}
                      placeholder="填写跟进备注..."
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      disabled={!editing}
                    />
                  </div>
                  <div className="flex gap-2">
                    {!editing ? (
                      <button onClick={() => setEditing(true)} className="btn-primary flex-1 py-2 rounded-lg text-sm flex items-center justify-center gap-1">
                        <Edit2 size={14} /> 编辑
                      </button>
                    ) : (
                      <>
                        <button onClick={() => setEditing(false)} className="btn-neon flex-1 py-2 rounded-lg text-sm">取消</button>
                        <button onClick={handleSave} className="btn-primary flex-1 py-2 rounded-lg text-sm">保存</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}
