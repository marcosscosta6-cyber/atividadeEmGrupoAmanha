

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;


app.use(cors());

app.use(express.json());

let produtos = [
  { id: 1, nome: 'Notebook Gamer', categoria: 'Eletrônicos', preco: 4500.00 },
  { id: 2, nome: 'Mouse sem fio',  categoria: 'Eletrônicos', preco: 89.90  },
  { id: 3, nome: 'Cadeira Gamer',  categoria: 'Móveis',      preco: 1200.00 },
  { id: 4, nome: 'Caneca Térmica', categoria: 'Casa',        preco: 45.00  },
  { id: 5, nome: 'Monitor 27"',    categoria: 'Eletrônicos', preco: 1350.00 },
];


let proximoId = 6;

app.get('/produtos', (req, res) => {
  res.status(200).json(produtos);
});

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

app.get('/produtos/:id', (req, res) => {
  const id = Number(req.params.id);
  const produto = produtos.find(p => p.id === id);

  if (!produto) {
    return res.status(404).json({ erro: `Produto com id ${id} não encontrado.` });
  }

  res.status(200).json(produto);
});

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

app.delete('/produtos/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = produtos.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: `Produto com id ${id} não encontrado.` });
  }

  const removido = produtos.splice(index, 1);
  res.status(200).json({ mensagem: 'Produto removido com sucesso.', produto: removido[0] });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
