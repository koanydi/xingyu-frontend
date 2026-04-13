"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Upload, X, Package, Layers } from "lucide-react";
import { AdminLayout } from "@/app/admin/dashboard/page";
import {
  adminGetProducts, adminGetCategories, adminCreateProduct, adminUpdateProduct,
  adminDeleteProduct, adminGetCards, adminImportCards, adminDeleteCard,
  type Product, type Category, type CardList,
} from "@/lib/api";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editProduct, setEditProduct] = useState<Partial<Product> | null>(null);
  const [cardModal, setCardModal] = useState<Product | null>(null);
  const [cardData, setCardData] = useState<CardList | null>(null);
  const [importText, setImportText] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) { router.push("/admin/login"); return; }
    load();
  }, [router]);

  async function load() {
    const [prods, cats] = await Promise.all([adminGetProducts(), adminGetCategories()]);
    setProducts(prods);
    setCategories(cats);
  }

  async function saveProduct() {
    if (!editProduct?.name || !editProduct.category_id || !editProduct.price) {
      setMsg("请填写必填项"); return;
    }
    setLoading(true);
    try {
      if (editProduct.id) {
        await adminUpdateProduct(editProduct.id, editProduct);
      } else {
        await adminCreateProduct(editProduct);
      }
      setEditProduct(null); setMsg(""); await load();
    } catch (e: unknown) { setMsg((e as Error).message); }
    finally { setLoading(false); }
  }

  async function deleteProduct(id: number) {
    if (!confirm("确认删除此商品？")) return;
    await adminDeleteProduct(id);
    await load();
  }

  async function openCardModal(p: Product) {
    setCardModal(p);
    const data = await adminGetCards(p.id);
    setCardData(data);
  }

  async function importCards() {
    if (!importText.trim() || !cardModal) return;
    setLoading(true);
    try {
      const r = await adminImportCards(cardModal.id, importText) as unknown as { imported: number };
      setImportText("");
      alert(`成功导入 ${(r as unknown as { imported: number }).imported} 条卡密`);
      const data = await adminGetCards(cardModal.id);
      setCardData(data);
      await load();
    } catch (e: unknown) { alert((e as Error).message); }
    finally { setLoading(false); }
  }

  return (
    <AdminLayout title="商品管理">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "white" }}>商品列表</h2>
        <button onClick={() => setEditProduct({ status: 1, price: 0 })} className="btn-main" style={{ padding: "8px 16px" }}>
          <Plus size={14} /> 新增商品
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {products.map((p) => (
          <div key={p.id} style={{
            padding: "16px 20px", borderRadius: 10,
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <Package size={16} color="#475569" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "white" }}>{p.name}</div>
              <div style={{ fontSize: 12, color: "#475569" }}>
                ¥{p.price.toFixed(2)} · 库存 {p.stock_count} · 已售 {p.sales_count} ·
                <span style={{ color: p.status === 1 ? "#06ffd4" : "#475569", marginLeft: 4 }}>
                  {p.status === 1 ? "上架" : "下架"}
                </span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => openCardModal(p)} style={{
                padding: "6px 12px", borderRadius: 7, border: "1px solid rgba(124,58,237,0.3)",
                background: "rgba(124,58,237,0.08)", color: "#a78bfa", cursor: "pointer", fontSize: 12,
                display: "flex", alignItems: "center", gap: 4,
              }}>
                <Layers size={12} /> 卡密
              </button>
              <button onClick={() => setEditProduct(p)} style={{
                padding: "6px 12px", borderRadius: 7, border: "1px solid rgba(0,212,255,0.2)",
                background: "rgba(0,212,255,0.06)", color: "#00d4ff", cursor: "pointer", fontSize: 12,
                display: "flex", alignItems: "center", gap: 4,
              }}>
                <Pencil size={12} /> 编辑
              </button>
              <button onClick={() => deleteProduct(p.id)} style={{
                padding: "6px 12px", borderRadius: 7, border: "1px solid rgba(239,68,68,0.2)",
                background: "rgba(239,68,68,0.06)", color: "#f87171", cursor: "pointer", fontSize: 12,
                display: "flex", alignItems: "center", gap: 4,
              }}>
                <Trash2 size={12} /> 删除
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 编辑商品弹窗 */}
      {editProduct && (
        <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ width: "100%", maxWidth: 480, background: "#0f1628", borderRadius: 16, border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden" }}>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 700, color: "white" }}>{editProduct.id ? "编辑商品" : "新增商品"}</span>
              <button onClick={() => { setEditProduct(null); setMsg(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569" }}><X size={16} /></button>
            </div>
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { key: "name", label: "商品名称 *", placeholder: "例如：Steam礼品卡 100元" },
                { key: "subtitle", label: "副标题", placeholder: "简短描述" },
                { key: "cover_img", label: "封面图片名", placeholder: "上传后填写文件名" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <div style={{ fontSize: 12, color: "#475569", marginBottom: 6 }}>{label}</div>
                  <input value={(editProduct as Record<string, unknown>)[key] as string || ""}
                    onChange={e => setEditProduct({ ...editProduct, [key]: e.target.value })}
                    placeholder={placeholder}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 7, boxSizing: "border-box", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 13, outline: "none" }} />
                </div>
              ))}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 12, color: "#475569", marginBottom: 6 }}>分类 *</div>
                  <select value={editProduct.category_id || ""} onChange={e => setEditProduct({ ...editProduct, category_id: Number(e.target.value) })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 7, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 13, outline: "none" }}>
                    <option value="">选择分类</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#475569", marginBottom: 6 }}>状态</div>
                  <select value={editProduct.status ?? 1} onChange={e => setEditProduct({ ...editProduct, status: Number(e.target.value) })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 7, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 13, outline: "none" }}>
                    <option value={1}>上架</option>
                    <option value={0}>下架</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { key: "price", label: "售价 *" },
                  { key: "original_price", label: "原价（划线价）" },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <div style={{ fontSize: 12, color: "#475569", marginBottom: 6 }}>{label}</div>
                    <input type="number" step="0.01" value={(editProduct as Record<string, unknown>)[key] as number || ""}
                      onChange={e => setEditProduct({ ...editProduct, [key]: parseFloat(e.target.value) || 0 })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: 7, boxSizing: "border-box", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 13, outline: "none" }} />
                  </div>
                ))}
              </div>

              <div>
                <div style={{ fontSize: 12, color: "#475569", marginBottom: 6 }}>商品说明</div>
                <textarea value={editProduct.description || ""} onChange={e => setEditProduct({ ...editProduct, description: e.target.value })} rows={4} placeholder="卡密使用说明、注意事项等"
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 7, boxSizing: "border-box", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 13, outline: "none", resize: "vertical" }} />
              </div>

              {msg && <div style={{ color: "#f87171", fontSize: 12 }}>{msg}</div>}
              <button onClick={saveProduct} disabled={loading} className="btn-main" style={{ width: "100%", padding: 11, borderRadius: 8, justifyContent: "center" }}>
                {loading ? "保存中..." : "保存"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 卡密管理弹窗 */}
      {cardModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ width: "100%", maxWidth: 560, background: "#0f1628", borderRadius: 16, border: "1px solid rgba(255,255,255,0.1)", maxHeight: "85vh", overflow: "auto" }}>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", position: "sticky", top: 0, background: "#0f1628", zIndex: 1 }}>
              <div>
                <span style={{ fontWeight: 700, color: "white" }}>卡密管理</span>
                <span style={{ fontSize: 12, color: "#475569", marginLeft: 8 }}>{cardModal.name}</span>
              </div>
              <button onClick={() => { setCardModal(null); setCardData(null); setImportText(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569" }}><X size={16} /></button>
            </div>
            <div style={{ padding: 24 }}>
              {cardData && (
                <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                  {[
                    { label: "未售卡密", value: cardData.unsold_count, color: "#06ffd4" },
                    { label: "已售卡密", value: cardData.sold_count, color: "#475569" },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ flex: 1, textAlign: "center", padding: "12px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ fontSize: 22, fontWeight: 900, color, fontFamily: "Orbitron,sans-serif" }}>{value}</div>
                      <div style={{ fontSize: 11, color: "#475569" }}>{label}</div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 10 }}>批量导入卡密</div>
                <textarea value={importText} onChange={e => setImportText(e.target.value)} rows={6}
                  placeholder={"每行一条卡密，例如：\nABCD-EFGH-IJKL-MNOP\nXXXX-YYYY-ZZZZ-1234"}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, boxSizing: "border-box", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 12, outline: "none", resize: "vertical", fontFamily: "monospace" }} />
                <button onClick={importCards} disabled={loading || !importText.trim()} className="btn-main" style={{ marginTop: 10, width: "100%", padding: 10, borderRadius: 8, justifyContent: "center" }}>
                  <Upload size={13} /> {loading ? "导入中..." : "确认导入"}
                </button>
              </div>

              {cardData && cardData.list.length > 0 && (
                <div>
                  <div style={{ fontSize: 12, color: "#475569", marginBottom: 10 }}>最近导入的未售卡密（最多显示100条）</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 240, overflowY: "auto" }}>
                    {cardData.list.map(card => (
                      <div key={card.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 6, background: "rgba(255,255,255,0.02)" }}>
                        <code style={{ flex: 1, fontSize: 11, color: "#64748b", wordBreak: "break-all" }}>{card.content}</code>
                        <button onClick={async () => { await adminDeleteCard(card.id); const data = await adminGetCards(cardModal.id); setCardData(data); }}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#334155" }}>
                          <Trash2 size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
