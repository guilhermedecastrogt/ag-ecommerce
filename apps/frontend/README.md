# Frontend E-commerce (Next.js)

Este app é o frontend do monorepo, iniciado sem integração com os microsserviços para evolução incremental.

## Executando

No diretório raiz do monorepo:

```bash
npm run start:frontend
```

Ou dentro de `apps/frontend`:

```bash
npm run dev
```

## Estrutura

```text
src
├── app
│   ├── (store)      # navegação pública da loja
│   ├── (auth)       # login e cadastro
│   └── (account)    # área autenticada do cliente
├── features
│   ├── catalog
│   ├── cart
│   ├── checkout
│   └── auth
├── widgets          # blocos compostos (header, footer, shell)
└── shared           # utilitários, tipos, config e UI base
```

## Organização por feature

Cada feature pode usar os blocos:

- `domain`: tipos e regras de negócio
- `application`: casos de uso
- `infrastructure`: repositórios/adapters
- `presentation`: componentes e composição de UI

## Rotas iniciais

- `/` home da loja
- `/produtos`
- `/categorias/[slug]`
- `/carrinho`
- `/checkout`
- `/entrar`
- `/cadastro`
- `/conta`

## Qualidade

```bash
npm run lint:frontend
npm run build:frontend
```
