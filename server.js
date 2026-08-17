// ============================================================
// server.js - API de Produtos (Node.js + Express)
// ============================================================

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// ------------------------------------------------------------
// MIDDLEWARES (rodam ANTES das rotas, em toda requisição)
// ------------------------------------------------------------

// 1) CORS: sem isso, o navegador BLOQUEIA o front-end de "outra origem"
//    (ex: um front rodando em file:// ou em outra porta) de falar com esta API.
//    É o navegador quem bloqueia, não o servidor - por isso o erro só
//    aparece no console do navegador, nunca no terminal do Node.
app.use(cors());

// 2) express.json(): lê o corpo (body) de requisições com Content-Type: application/json
//    e transforma em objeto JS acessível via req.body.
//    Sem isso, req.body vem undefined mesmo que o front-end tenha enviado os dados certos.
app.use(express.json());

// ------------------------------------------------------------
// "BANCO DE DADOS" EM MEMÓRIA (mock)
// ------------------------------------------------------------
let produtos = [
  { id: 1, nome: 'Notebook Gamer', categoria: 'Eletrônicos', preco: 4500.00 },
  { id: 2, nome: 'Mouse sem fio',  categoria: 'Eletrônicos', preco: 89.90  },
  { id: 3, nome: 'Cadeira Gamer',  categoria: 'Móveis',      preco: 1200.00 },
  { id: 4, nome: 'Caneca Térmica', categoria: 'Casa',        preco: 45.00  },
  { id: 5, nome: 'Monitor 27"',    categoria: 'Eletrônicos', preco: 1350.00 },
];

// contador para gerar novos IDs
let proximoId = 6;

// ------------------------------------------------------------
// ROTAS
// ------------------------------------------------------------

// ROTA 1 - GET /produtos
// Lista todos os produtos
app.get('/produtos', (req, res) => {
  res.status(200).json(produtos);
});

// ROTA 2 - GET /produtos/filtrar?categoria=Eletrônicos
// Usa req.query porque "categoria" é um FILTRO OPCIONAL, não identifica
// um recurso específico. Precisa vir ANTES da rota /produtos/:id,
// senão o Express vai achar que "filtrar" é um :id.
app.get('/produtos/filtrar', (req, res) => {
  const { categoria } = req.query;

  if (!categoria) {
    return res.status(400).json({ erro: 'Informe uma categoria na query string. Ex: /produtos/filtrar?categoria=Casa' });
  }

  const resultado = produtos.filter(p =>
    p.categoria.toLowerCase().includes(categoria.toLowerCase())
  );

  res.status(200).json(resultado);
});

// ROTA 3 - GET /produtos/:id
// Usa req.params porque o ID identifica UM recurso específico
// (faz parte da própria URL, não é um filtro opcional).
app.get('/produtos/:id', (req, res) => {
  const id = Number(req.params.id);
  const produto = produtos.find(p => p.id === id);

  if (!produto) {
    return res.status(404).json({ erro: `Produto com id ${id} não encontrado.` });
  }

  res.status(200).json(produto);
});

// ROTA 4 - POST /produtos
// Usa req.body porque os dados do NOVO produto vêm no corpo da requisição
// (formulário do front-end), não na URL.
app.post('/produtos', (req, res) => {
  const { nome, categoria, preco } = req.body;

  if (!nome || !categoria || preco === undefined) {
    return res.status(400).json({ erro: 'Envie nome, categoria e preco no corpo da requisição.' });
  }

  const novoProduto = {
    id: proximoId++,
    nome,
    categoria,
    preco: Number(preco),
  };

  produtos.push(novoProduto);
  res.status(201).json(novoProduto);
});

// ROTA 5 - DELETE /produtos/:id
// Remove um produto do array em memória
app.delete('/produtos/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = produtos.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: `Produto com id ${id} não encontrado.` });
  }

  const removido = produtos.splice(index, 1);
  res.status(200).json({ mensagem: 'Produto removido com sucesso.', produto: removido[0] });
});

// ------------------------------------------------------------
// INICIALIZAÇÃO DO SERVIDOR
// ------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});