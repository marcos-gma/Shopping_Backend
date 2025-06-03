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
git clone [URL_DO_SEU_REPOSITORIO]
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

## Exemplos de Uso (PowerShell)

### Produtos

```powershell
# Criar um produto
$body = @{name = "Produto Teste"; description = "Descrição do produto"; price = 99.99; stock = 10} | ConvertTo-Json; Invoke-RestMethod -Method Post -Uri "http://localhost:3000/products" -Body $body -ContentType "application/json"

# Listar todos os produtos
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/products"

# Buscar produto específico (id = 1)
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/products/1"

# Atualizar produto (id = 1)
$body = @{name = "Produto Atualizado"; description = "Nova descrição"; price = 149.99; stock = 15} | ConvertTo-Json; Invoke-RestMethod -Method Put -Uri "http://localhost:3000/products/1" -Body $body -ContentType "application/json"

# Deletar produto (id = 1)
Invoke-RestMethod -Method Delete -Uri "http://localhost:3000/products/1"
```

### Carrinho

```powershell
# Criar novo carrinho
$cartResponse = Invoke-RestMethod -Method Post -Uri "http://localhost:3000/cart"

# Adicionar item ao carrinho
$body = @{productId = 1; quantity = 2} | ConvertTo-Json; Invoke-RestMethod -Method Post -Uri "http://localhost:3000/cart/$($cartResponse.id)/items" -Body $body -ContentType "application/json"

# Ver carrinho
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/cart/$($cartResponse.id)"

# Atualizar quantidade de item
$body = @{quantity = 3} | ConvertTo-Json; Invoke-RestMethod -Method Put -Uri "http://localhost:3000/cart/$($cartResponse.id)/items/1" -Body $body -ContentType "application/json"

# Ver total do carrinho
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/cart/$($cartResponse.id)/total"
```

### Lista de Desejos

```powershell
# Criar nova wishlist
$wishlistResponse = Invoke-RestMethod -Method Post -Uri "http://localhost:3000/wishlist"

# Adicionar produto à wishlist
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/wishlist/$($wishlistResponse.id)/products/1"

# Ver produtos na wishlist
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/wishlist/$($wishlistResponse.id)"

# Verificar se produto está na wishlist
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/wishlist/$($wishlistResponse.id)/products/1"
```

### Pedidos

```powershell
# Criar pedido a partir do carrinho
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/orders/$($cartResponse.id)"

# Listar todos os pedidos
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/orders"
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

## Desenvolvimento

Para executar em modo de desenvolvimento com hot-reload:

```bash
npm run start:dev
```

## Testes

Para executar os testes:

```bash
npm run test
```

## Notas

- O modo `synchronize: true` está ativado para desenvolvimento. Em produção, use migrations.
- Este é um projeto de exemplo e pode precisar de ajustes para uso em produção.
- Os comandos PowerShell foram otimizados para copiar e colar em uma única linha.

## Contribuição

Sinta-se à vontade para contribuir com o projeto através de pull requests.
