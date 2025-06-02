# Shopping Backend

Este é um backend de sistema de compras online desenvolvido com NestJS, TypeScript e SQLite.

## Funcionalidades

- Gerenciamento de produtos (CRUD)
- Carrinho de compras
- Finalização de pedidos

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

## Exemplos de Uso

### Criar um Produto

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Produto Teste",
    "description": "Descrição do produto",
    "price": 99.99,
    "stock": 10
  }'
```

### Criar um Carrinho

```bash
curl -X POST http://localhost:3000/cart
```

### Adicionar Item ao Carrinho

```bash
curl -X POST http://localhost:3000/cart/1/items \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "quantity": 2
  }'
```

### Finalizar Pedido

```bash
curl -X POST http://localhost:3000/orders/1
```

## Estrutura do Projeto

```
src/
  product/           # Módulo de produtos
  cart/              # Módulo de carrinho
  order/            # Módulo de pedidos
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

## Contribuição

Sinta-se à vontade para contribuir com o projeto através de pull requests.
