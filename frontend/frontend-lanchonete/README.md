# SnapPDV — Frontend React

Sistema de Ponto de Venda para lanchonete, construído com Vite + React 18 + Tailwind CSS.

---

## Pré-requisitos

- Node.js 18+ (recomendado 20 LTS)
- npm 9+ ou yarn
- API Spring Boot rodando em `http://localhost:8080`

---

## Instalação e execução

```bash
# 1. Instalar dependências
npm install

# 2. Rodar em desenvolvimento (proxy para localhost:8080)
npm run dev

# 3. Acessar no navegador
# http://localhost:5173
```

---

## Build para produção

```bash
npm run build
# Gera a pasta /dist — sirva com Nginx, Apache ou qualquer CDN
```

---

## Estrutura de pastas

```
src/
├── contexts/
│   ├── AuthContext.jsx     # Estado global de autenticação + JWT
│   ├── CartContext.jsx     # Estado global do carrinho (useReducer)
│   └── ToastContext.jsx    # Canal de notificações
│
├── hooks/
│   └── useToast.js         # Hook de notificações toast
│
├── services/
│   ├── api.js              # Axios + interceptor Bearer Token + redirect 401
│   ├── authService.js      # POST /api/auth/login
│   └── dataService.js      # Produtos, Vendas, Usuários
│
├── components/
│   └── layout/
│       ├── AppLayout.jsx   # Shell principal (Sidebar + Topbar + Outlet)
│       ├── Sidebar.jsx     # Navegação lateral com NavLink
│       ├── Topbar.jsx      # Barra superior com título e avatar
│       ├── Toast.jsx       # Notificações flutuantes
│       └── PrivateRoute.jsx# Proteção de rotas autenticadas
│
├── pages/
│   ├── LoginPage.jsx       # Tela de login com React Hook Form + Zod
│   ├── PDVPage.jsx         # Catálogo + Carrinho + Finalização
│   ├── DashboardPage.jsx   # Métricas + Gráfico + Últimas vendas
│   ├── EstoquePage.jsx     # CRUD de produtos com modal
│   └── EquipePage.jsx      # CRUD de usuários com roles
│
└── styles/
    └── globals.css         # Tailwind base + variáveis CSS + scrollbar
```

---

## Endpoints esperados da API Spring Boot

### Autenticação
```
POST   /api/auth/login
Body:  { email, senha }
Resp:  { token: "eyJ...", user: { id, nome, email, role } }
```

### Produtos
```
GET    /api/produtos
POST   /api/produtos
PUT    /api/produtos/{id}
DELETE /api/produtos/{id}
```

### Vendas
```
POST   /api/vendas
Body:  { itens: [{ produtoId, quantidade, precoUnitario }], observacao, total }

GET    /api/vendas
GET    /api/vendas/resumo-dia
Resp:  { vendasHoje, pedidos, ticketMedio, estoqueBaixo }
```

### Usuários
```
GET    /api/usuarios
POST   /api/usuarios
PUT    /api/usuarios/{id}
DELETE /api/usuarios/{id}
```

---

## Variáveis de ambiente (opcional)

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_BASE_URL=http://localhost:8080
```

E atualize `src/services/api.js`:
```js
baseURL: import.meta.env.VITE_API_BASE_URL + '/api'
```

---

## Roles e permissões

| Role     | PDV | Dashboard | Estoque | Equipe |
|----------|-----|-----------|---------|--------|
| OPERADOR |  ✓  |     ✗     |    ✗    |   ✗    |
| GERENTE  |  ✓  |     ✓     |    ✓    |   ✗    |
| ADMIN    |  ✓  |     ✓     |    ✓    |   ✓    |

O controle de acesso é feito no `PrivateRoute` via `isAdmin` do `AuthContext`.

---

## Dados mock (fallback)

Todas as páginas têm fallback com dados mock quando a API não está disponível.
Isso permite desenvolver o frontend sem precisar da API rodando.
Os `.catch(() => {})` nos `useEffect` garantem que a aplicação não quebre.

---

## Deploy com Nginx (produção)

```nginx
server {
  listen 80;
  root /var/www/snappdv/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /api/ {
    proxy_pass http://localhost:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

---

## Stack

- **Vite 5** — build tool
- **React 18** — UI
- **Tailwind CSS 3** — estilização utilitária
- **React Router Dom 6** — roteamento
- **Axios** — HTTP client com interceptors JWT
- **React Hook Form + Zod** — formulários e validação
- **Lucide React** — ícones
- **Context API + useReducer** — estado global
