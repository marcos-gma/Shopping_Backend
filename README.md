# Shopping Backend

Este é um backend de sistema de compras online desenvolvido com NestJS, TypeScript e SQLite.

## Funcionalidades

- Gerenciamento de produtos (CRUD)
- Carrinho de compras
- Finalização de pedidos
- Lista de Desejos (Wishlist)

## Requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/marcos-gma/Shopping_Backend.git
cd shopping-backend
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor:
```bash
npm run start:dev
```

O servidor estará rodando em `http://localhost:3000`

## Endpoints da API

### Produtos

- `POST /products` - Criar um novo produto
- `GET /products` - Listar todos os produtos
- `GET /products/:id` - Buscar um produto específico
- `PUT /products/:id` - Atualizar um produto
- `DELETE /products/:id` - Remover um produto
- `GET /products?search=termo` - Buscar produtos por nome ou descrição

### Carrinho

- `POST /cart` - Criar um novo carrinho
- `GET /cart/:id` - Buscar um carrinho
- `POST /cart/:id/items` - Adicionar item ao carrinho
- `PUT /cart/:id/items/:productId` - Atualizar quantidade de um item
- `DELETE /cart/:id/items/:productId` - Remover item do carrinho
- `DELETE /cart/:id` - Limpar carrinho
- `GET /cart/:id/total` - Calcular total do carrinho

### Pedidos

- `POST /orders/:cartId` - Criar pedido a partir de um carrinho
- `GET /orders` - Listar todos os pedidos
- `GET /orders/:id` - Buscar um pedido específico

### Lista de Desejos (Wishlist)

- `POST /wishlist` - Criar uma nova lista de desejos
- `GET /wishlist/:id` - Ver produtos na lista de desejos
- `POST /wishlist/:id/products/:productId` - Adicionar produto à lista
- `DELETE /wishlist/:id/products/:productId` - Remover produto da lista
- `GET /wishlist/:id/products/:productId` - Verificar se produto está na lista

## Exemplos de Uso no PowerShell

### Produtos

```powershell
# Criar um produto
$body = @{name = "Produto Teste"; description = "Descrição do produto"; price = 99.99; stock = 10} | ConvertTo-Json; Invoke-RestMethod -Method Post -Uri "http://localhost:3000/products" -Body $body -ContentType "application/json"

# Listar todos os produtos
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/products"

# Buscar produto específico
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/products/1"

# Atualizar produto
$body = @{name = "Novo Nome"; description = "Nova descrição"; price = 149.99; stock = 20} | ConvertTo-Json; Invoke-RestMethod -Method Put -Uri "http://localhost:3000/products/1" -Body $body -ContentType "application/json"

# Deletar produto
Invoke-RestMethod -Method Delete -Uri "http://localhost:3000/products/1"
```

### Carrinho

```powershell
# Criar um novo carrinho e guardar ID
$cartResponse = Invoke-RestMethod -Method Post -Uri "http://localhost:3000/cart"; $cartId = $cartResponse.id

# Adicionar um produto ao carrinho (exemplo: produto ID 1, quantidade 2)
$body = @{productId = 1; quantity = 2} | ConvertTo-Json; Invoke-RestMethod -Method Post -Uri "http://localhost:3000/cart/$cartId/items" -Body $body -ContentType "application/json"

# Ver o carrinho
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/cart/$cartId"

# Remover um item do carrinho (exemplo: produto ID 1)
Invoke-RestMethod -Method Delete -Uri "http://localhost:3000/cart/$cartId/items/1"

# Ver total do carrinho
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/cart/$cartId/total"

# Limpar todo o carrinho
Invoke-RestMethod -Method Delete -Uri "http://localhost:3000/cart/$cartId"
```

### Lista de Desejos

```powershell
# Criar nova wishlist e guardar ID
$wishlistResponse = Invoke-RestMethod -Method Post -Uri "http://localhost:3000/wishlist"; $wishlistId = $wishlistResponse.id

# Adicionar produto à wishlist (exemplo: produto ID 1)
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/wishlist/$wishlistId/products/1"

# Ver produtos na wishlist
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/wishlist/$wishlistId"

# Remover produto da wishlist (exemplo: produto ID 1)
Invoke-RestMethod -Method Delete -Uri "http://localhost:3000/wishlist/$wishlistId/products/1"

# Verificar se produto está na wishlist
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/wishlist/$wishlistId/products/1"
```

### Pedidos

```powershell
# Criar pedido a partir do carrinho
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/orders/$cartId"

# Listar todos os pedidos
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/orders"

# Ver pedido específico
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/orders/1"
```

## Estrutura do Projeto

```
src/
  product/           # Módulo de produtos
  cart/              # Módulo de carrinho
  order/            # Módulo de pedidos
  wishlist/         # Módulo de lista de desejos
  app.module.ts     # Módulo principal
  main.ts           # Ponto de entrada
```

## Banco de Dados

O projeto utiliza SQLite como banco de dados. O arquivo do banco será criado automaticamente como `shopping.db` na raiz do projeto.
