const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3010";

/* ── Types ──────────────────────────────────────── */
export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  description: string;
  imageUrl: string | null;
  categoryId: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Order {
  id: string;
  userId: string;
  status: "PENDING" | "PAID" | "CANCELLED";
  subTotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  addressSnapshot: AddressSnapshot;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface AddressSnapshot {
  name: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

/* ── Helpers ───────────────────────────────────── */
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message ?? `HTTP ${res.status}`);
  }
  return res.json();
}

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

/* ── Products ───────────────────────────────────── */
export function fetchProducts(): Promise<Product[]> {
  return request<Product[]>("/products");
}

export function fetchProductBySlug(slug: string): Promise<Product> {
  return request<Product>(`/products/${slug}`);
}

export function fetchCategories(): Promise<Category[]> {
  return request<Category[]>("/categories");
}

/* ── Auth ───────────────────────────────────────── */
export function login(
  email: string,
  password: string
): Promise<{ accessToken: string; refreshToken: string }> {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function register(
  name: string,
  email: string,
  password: string
): Promise<{ accessToken: string; refreshToken: string }> {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export function refreshTokens(
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> {
  return request("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export function logout(token: string): Promise<void> {
  return request("/auth/logout", {
    method: "POST",
    headers: authHeaders(token),
  });
}

/* ── Orders ─────────────────────────────────────── */
export interface CheckoutPayload {
  items: { productId: string; quantity: number }[];
  address: AddressSnapshot;
}

export function checkout(
  payload: CheckoutPayload,
  token: string
): Promise<Order> {
  return request<Order>("/orders/checkout", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
}

export function fetchMyOrders(token: string): Promise<Order[]> {
  return request<Order[]>("/orders/my-orders", {
    headers: authHeaders(token),
  });
}

export function cancelOrder(
  orderId: string,
  token: string
): Promise<Order> {
  return request<Order>("/orders/cancel", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ orderId }),
  });
}
