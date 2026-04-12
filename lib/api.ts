const API_BASE = "/api";

export async function submitOrder(data: {
  customer_name: string;
  customer_contact: string;
  app_type: string;
  requirements: string;
  budget: string;
}) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function adminLogin(username: string, password: string) {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function getOrders(
  token: string,
  params?: { page?: number; status?: string; keyword?: string }
) {
  const q = new URLSearchParams();
  if (params?.page) q.set("page", String(params.page));
  if (params?.status) q.set("status", params.status);
  if (params?.keyword) q.set("keyword", params.keyword);
  const res = await fetch(`${API_BASE}/admin/orders?${q}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function getOrder(token: string, id: number) {
  const res = await fetch(`${API_BASE}/admin/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function updateOrder(
  token: string,
  id: number,
  data: { status?: string; admin_note?: string }
) {
  const res = await fetch(`${API_BASE}/admin/orders/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function adminLogout(token: string) {
  await fetch(`${API_BASE}/admin/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}
