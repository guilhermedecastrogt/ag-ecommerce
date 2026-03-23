# Microsservices E-commerce

Monorepo com backend em NestJS (arquitetura de microsserviços) e frontend em Next.js.

## Serviços no backend

- `api-gateway`
- `users-service`
- `auth-service`
- `orders-service`
- `product-service`

## Objetivo do MVP (backend)

Entregar um fluxo completo de compra no backend:

- cadastro/login
- consulta de catálogo
- criação de pedido com itens
- atualização de status do pedido
- integração inicial de pagamento (intenção + confirmação)

## Sprints detalhadas para chegar no MVP (Backend)

### Sprint 1 — Catálogo e Produtos (Product Service)

**Meta:** Transformar o `product-service` em um catálogo real e consultável, expondo os dados através do Gateway.

**Tarefas técnicas:**
- **Modelagem de Dados:** Criar os models `Product` e `Category` no Prisma (campos: `name`, `slug`, `price`, `stock`, `description`, `imageUrl`).
- **Casos de Uso (`product-service`):** Implementar `ListProductsUseCase`, `GetProductBySlugUseCase`, `ListCategoriesUseCase`.
- **Comunicação Síncrona (TCP):** Expor `products.findAll`, `products.findBySlug` via TCP para o Gateway.
- **Mensageria (Kafka):**
  - **Publica:** `product.created`, `product.updated`, `product.stock_updated` (para invalidar cache ou avisar o `orders-service` sobre baixa de estoque).
- **API Gateway (`api-gateway`):**
  - Adicionar o `PRODUCT_SERVICE` no `ClientsModule` do `api-gateway.module.ts`.
  - Criar os endpoints REST: `GET /products`, `GET /products/:slug`, `GET /categories`.

**Critério de pronto:** O frontend consegue listar produtos e ver detalhes via `GET /products` do gateway, sem usar mocks locais.

---

### Sprint 2 — Carrinho e Pedido Completo (Orders Service)

**Meta:** Evoluir o `orders-service` para suportar pedidos com múltiplos itens, cálculos de valores e controle de status.

**Tarefas técnicas:**
- **Modelagem de Dados (`orders-service/prisma/schema.prisma`):**
  - Atualizar o model `Order` para conter: `status` (`PENDING`, `PAID`, `CANCELLED`), `subTotal`, `shippingFee`, `discount`, `total`, e snapshot do endereço.
  - Criar o model `OrderItem` (relacionado a `Order`, contendo `productId`, `price`, `quantity`).
- **Lógica de Negócio (`orders-service`):**
  - Refatorar `CreateOrderUseCase` para receber um array de itens.
  - Calcular o total no backend iterando sobre os itens (comunicar com `product-service` para checar estoque/preço ou confiar num snapshot do carrinho).
- **Mensageria (Kafka):**
  - **Publica:** `order.created` (sinalizando a intenção de compra para o `payment-service` ou gateway externo), `order.cancelled`.
  - **Consome:** `product.updated` (para manter uma tabela de cache local de preços/produtos e evitar requests síncronas na hora do checkout).
- **API Gateway:**
  - Endpoint `POST /orders/checkout` recebendo itens do carrinho.
  - Endpoint `GET /orders/my-orders` para o usuário logado ver seu histórico.

**Critério de pronto:** Pedido criado com itens detalhados, valor total calculado pelo backend e status inicial `PENDING` persistido no banco.

---

### Sprint 3 — Autenticação e Segurança (Auth Service + Gateway)

**Meta:** Endurecer a segurança da aplicação para produção, removendo brechas e garantindo tipagem forte.

**Tarefas técnicas:**
- **Tipagem Forte (`api-gateway`):**
  - Remover os tipos `any` nos endpoints de auth (`/auth/register`, `/auth/login`) substituindo pelos respectivos DTOs (`RegisterUserDto`, `LoginUserDto`).
- **Validação Global:**
  - Ativar o `ValidationPipe` global no `main.ts` do Gateway para rejeitar payloads malformados automaticamente.
- **Segurança (Hardening):**
  - Configurar CORS restritivo no Gateway (permitindo apenas o domínio do frontend).
  - Adicionar as bibliotecas `helmet` e configurar rate-limiting (`@nestjs/throttler`).
- **Tokens e Sessão:**
  - Revisar expiração de JWT, garantir que a secret está sendo lida do `.env` e implementar lógica sólida de revogação no refresh token.
- **Mensageria (Kafka):**
  - **Publica:** `auth.user_registered` (já existe, útil para disparar e-mail de boas-vindas).
  - **Consome:** (Geralmente não consome eventos de negócio, focado apenas em emitir tokens).

**Critério de pronto:** A API rejeita requisições malformadas, não expõe cabeçalhos sensíveis, limita taxa de requisições e a autenticação possui tipagem estrita de ponta a ponta.

---

### Sprint 4 — Pagamentos e Ciclo de Vida do Pedido (Novo módulo ou Orders)

**Meta:** Fechar o ciclo financeiro, permitindo que o pedido mude de status com base na aprovação do pagamento.

**Tarefas técnicas:**
- **Integração de Pagamento:**
  - Criar um provedor de pagamento (ex: Fake, Stripe, Pagar.me). Pode ser um novo microserviço (`payment-service`) ou um módulo dentro do `orders-service`.
- **Intenção de Pagamento:** Ao criar o pedido (`CreateOrderUseCase`), gerar um link/PIX e devolver para o frontend.
- **Webhook de Confirmação:**
  - Criar um endpoint público `POST /webhooks/payments` no Gateway.
- **Mensageria (Kafka):**
  - O webhook (no Gateway ou `payment-service`) **Publica:** `payment.approved` ou `payment.failed`.
  - O `orders-service` **Consome:** `payment.approved` (atualiza status para `PAID` e publica `order.paid`) e `payment.failed` (cancela o pedido).
  - O `product-service` **Consome:** `order.paid` (para abater definitivamente o estoque reservado).
- **Reatividade:**
  - Garantir idempotência: evitar processar o mesmo evento do Kafka ou webhook duas vezes.

**Critério de pronto:** O pedido avança automaticamente para o status pago quando o evento de aprovação do pagamento é recebido e processado de forma idempotente.

---

### Sprint 5 — Observabilidade e Confiabilidade (Transversal)

**Meta:** Preparar o ecossistema para operação contínua, permitindo monitoramento e rastreabilidade de erros em produção.

**Tarefas técnicas:**
- **Logs Estruturados:** Substituir o logger padrão do Nest por `nestjs-pino` para logs em JSON.
- **Correlation ID:** Implementar `nestjs-cls` (Continuation Local Storage) para propagar um ID de requisição (`x-correlation-id`) do Gateway para os microserviços via cabeçalhos TCP/Kafka, amarrando os logs.
- **Health Checks:** Configurar `@nestjs/terminus` (Terminus) em cada serviço (`/health`) checando conexão com BD e Kafka.
- **Tratamento de Falhas:** Adicionar lógicas de Retry ou Circuit Breaker nas comunicações críticas via `rxjs` (`retry()`, `catchError`).

**Critério de pronto:** É possível rastrear todo o caminho de uma requisição pelo `Correlation ID` através dos logs de múltiplos serviços, e o status de saúde da infraestrutura pode ser monitorado.

---

### Sprint 6 — Testes E2E e Preparação para Go-Live

**Meta:** Garantir a estabilidade através de testes automatizados e alinhar infraestrutura de deploy.

**Tarefas técnicas:**
- **Testes E2E (Gateway):**
  - Usar `supertest` no `api-gateway/test/app.e2e-spec.ts`.
  - Criar fluxo completo automatizado: Cadastra Usuário -> Loga -> Lista Produtos -> Cria Pedido.
- **Testes Unitários:** Garantir cobertura nas lógicas de cálculo de preço do `orders-service` e hashing do `auth-service`.
- **Lint e Build:**
  - Resolver os erros pendentes de lint (ex: `@typescript-eslint/no-unsafe-member-access` no auth-service).
- **Infraestrutura:** Revisar o `docker-compose.yml`, garantindo volumes persistentes apenas para dev e revisando variáveis de ambiente de produção.

**Critério de pronto:** Cobertura de testes end-to-end do fluxo feliz de compras passando, zero erros de lint e ambiente Docker preparado para subir em staging.

## Sequência sugerida de execução

1. Sprint 1
2. Sprint 2
3. Sprint 3
4. Sprint 4
5. Sprint 5
6. Sprint 6

## Comandos úteis

```bash
npm install
npm run prisma:generate
npm run lint
npm run typecheck
npm run start:gateway
```
