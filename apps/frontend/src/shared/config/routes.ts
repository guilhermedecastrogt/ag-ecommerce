export const routes = {
  home: "/",
  products: "/produtos",
  category: (slug: string) => `/categorias/${slug}`,
  cart: "/carrinho",
  checkout: "/checkout",
  login: "/entrar",
  register: "/cadastro",
  account: "/conta",
} as const;
