const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3010";

async function req<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, ...rest } = options;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(rest.headers as Record<string, string>),
  };
  const res = await fetch(`${BASE}${path}`, { ...rest, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message ?? `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  userId: number;
  status: string;
  subTotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  items: OrderItem[];
  addressSnapshot: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export function loginAdmin(email: string, password: string) {
  return req<{ accessToken: string; refreshToken: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// ─── Users ────────────────────────────────────────────────────────────────────

export function fetchUsers(token: string) {
  return req<AdminUser[]>("/users", { token });
}

// ─── Categories ───────────────────────────────────────────────────────────────

export function fetchCategories(token: string) {
  return req<Category[]>("/categories", { token });
}

export function createCategory(data: { name: string; slug: string }, token: string) {
  return req<Category>("/admin/categories", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });
}

export function updateCategory(id: number, data: Partial<{ name: string; slug: string }>, token: string) {
  return req<Category>(`/admin/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    token,
  });
}

export function deleteCategory(id: number, token: string) {
  return req<void>(`/admin/categories/${id}`, { method: "DELETE", token });
}

// ─── Products ─────────────────────────────────────────────────────────────────

export function fetchProducts(token: string) {
  return req<Product[]>("/products", { token });
}

export function createProduct(
  data: Omit<Product, "id" | "createdAt" | "updatedAt">,
  token: string
) {
  return req<Product>("/admin/products", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });
}

export function updateProduct(
  id: number,
  data: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>,
  token: string
) {
  return req<Product>(`/admin/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    token,
  });
}

export function deleteProduct(id: number, token: string) {
  return req<void>(`/admin/products/${id}`, { method: "DELETE", token });
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export function fetchOrders(token: string) {
  return req<Order[]>("/orders", { token });
}

export function updateOrderStatus(id: number, status: string, token: string) {
  return req<Order>(`/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
    token,
  });
}
