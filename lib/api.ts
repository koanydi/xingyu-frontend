const BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(data.msg || "请求失败");
  return data.data as T;
}

// ── 公开接口 ────────────────────────────────────────────────
export const getCategories = () => req<Category[]>("/categories");
export const getProducts = (params?: Record<string, string>) => {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return req<ProductList>(`/products${qs}`);
};
export const getProduct = (id: number | string) => req<Product>(`/products/${id}`);

export const createOrder = (body: CreateOrderBody) =>
  req<CreateOrderResp>("/orders", { method: "POST", body: JSON.stringify(body) });

export const getOrderStatus = (orderNo: string) =>
  req<OrderStatus>(`/orders/${orderNo}/status`);

export const lookupOrder = (body: { order_no: string; buyer_email: string }) =>
  req<OrderStatus>("/orders/lookup", { method: "POST", body: JSON.stringify(body) });

export const getUSDTInfo = () => req<{ address: string; rate: number }>("/pay/usdt");

// ── 管理员接口 ──────────────────────────────────────────────
function authHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function adminReq<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { ...authHeaders(), ...(options?.headers as Record<string, string> | undefined) };
  return req<T>(path, { ...options, headers });
}

export const adminLogin = (username: string, password: string) =>
  req<{ token: string; username: string }>("/admin/login", {
    method: "POST", body: JSON.stringify({ username, password })
  });

export const adminLogout = () =>
  adminReq("/admin/logout", { method: "POST" });

export const adminDashboard = () => adminReq<DashboardData>("/admin/dashboard");

// 分类
export const adminGetCategories = () => adminReq<Category[]>("/admin/categories");
export const adminCreateCategory = (data: Partial<Category>) =>
  adminReq("/admin/categories", { method: "POST", body: JSON.stringify(data) });
export const adminUpdateCategory = (id: number, data: Partial<Category>) =>
  adminReq(`/admin/categories/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const adminDeleteCategory = (id: number) =>
  adminReq(`/admin/categories/${id}`, { method: "DELETE" });

// 商品
export const adminGetProducts = () => adminReq<Product[]>("/admin/products");
export const adminCreateProduct = (data: Partial<Product>) =>
  adminReq("/admin/products", { method: "POST", body: JSON.stringify(data) });
export const adminUpdateProduct = (id: number, data: Partial<Product>) =>
  adminReq(`/admin/products/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const adminDeleteProduct = (id: number) =>
  adminReq(`/admin/products/${id}`, { method: "DELETE" });

// 卡密
export const adminGetCards = (productId: number, showSold?: boolean) =>
  adminReq<CardList>(`/admin/products/${productId}/cards${showSold ? "?show_sold=1" : ""}`);
export const adminImportCards = (productId: number, content: string) =>
  adminReq(`/admin/products/${productId}/cards/import`, { method: "POST", body: JSON.stringify({ content }) });
export const adminDeleteCard = (id: number) =>
  adminReq(`/admin/cards/${id}`, { method: "DELETE" });

// 订单
export const adminGetOrders = (status?: string) =>
  adminReq<{ list: AdminOrder[]; total: number }>(`/admin/orders${status ? "?pay_status=" + status : ""}`);
export const adminManualDeliver = (orderNo: string) =>
  adminReq(`/admin/orders/${orderNo}/deliver`, { method: "POST" });

// 收款账号
export const adminGetAccounts = () => adminReq<PayAccount[]>("/admin/accounts");
export const adminCreateAccount = (data: Partial<PayAccount>) =>
  adminReq("/admin/accounts", { method: "POST", body: JSON.stringify(data) });
export const adminUpdateAccount = (id: number, data: Partial<PayAccount>) =>
  adminReq(`/admin/accounts/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const adminDeleteAccount = (id: number) =>
  adminReq(`/admin/accounts/${id}`, { method: "DELETE" });

export const adminGetPayLogs = () => adminReq<PayLog[]>("/admin/pay-logs");
export const adminSetUSDTAddress = (address: string) =>
  adminReq("/admin/usdt/address", { method: "POST", body: JSON.stringify({ address }) });

// ── 类型定义 ────────────────────────────────────────────────
export interface Category { id: number; name: string; icon: string; sort: number; is_active: boolean; }
export interface Product {
  id: number; category_id: number; name: string; subtitle: string;
  description: string; price: number; original_price: number;
  stock_count: number; sales_count: number; cover_img: string;
  sort: number; status: number; created_at: string;
}
export interface ProductList { list: Product[]; total: number; page: number; page_size: number; }
export interface CreateOrderBody {
  product_id: number; quantity: number; buyer_email: string;
  buyer_qq?: string; pay_channel: string;
}
export interface CreateOrderResp {
  order_no: string; pay_amount: number; pay_channel: string;
  expire_at: string; qr_image?: string; usdt_address?: string; usdt_rate?: number;
  product: { name: string; price: number };
}
export interface OrderStatus {
  order_no: string; pay_status: string; delivery_status: string;
  pay_amount: number; pay_channel: string; expire_at: string;
  card_contents?: string; product_name?: string; quantity?: number; created_at?: string;
}
export interface CardList {
  list: Card[]; total: number; sold_count: number; unsold_count: number;
}
export interface Card { id: number; product_id: number; content: string; is_sold: boolean; imported_at: string; }
export interface AdminOrder extends OrderStatus { id: number; buyer_email: string; buyer_qq: string; product_name: string; }
export interface PayAccount {
  id: number; channel: string; nickname: string; qr_image: string;
  daily_limit: number; order_limit_min: number; order_limit_max: number;
  today_received: number; is_active: boolean; is_online: boolean;
}
export interface PayLog { id: number; channel: string; amount: number; matched_order_no: string; is_matched: boolean; created_at: string; }
export interface DashboardData {
  total_orders: number; paid_orders: number; pending_orders: number;
  today_revenue: number; product_count: number; card_stock: number;
}
