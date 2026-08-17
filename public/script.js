const API_URL = 'http://localhost:3000';

function mostrarResultado(status, dados) {
  document.getElementById('resultado').textContent =
    `Status: ${status}\n\n` + JSON.stringify(dados, null, 2);
}

async function listarTodos() {
  const resp = await fetch(`${API_URL}/produtos`);
  const dados = await resp.json();
  mostrarResultado(resp.status, dados);
}

async function filtrarCategoria() {
  const categoria = document.getElementById('inputCategoria').value;
  
  const resp = await fetch(`${API_URL}/produtos/filtrar?categoria=${encodeURIComponent(categoria)}`);
  const dados = await resp.json();
  mostrarResultado(resp.status, dados);
}

async function buscarPorId() {
  const id = document.getElementById('inputId').value;
 
  const resp = await fetch(`${API_URL}/produtos/${id}`);
  const dados = await resp.json();
  mostrarResultado(resp.status, dados);
}

async function cadastrarProduto() {
  const nome = document.getElementById('novoNome').value;
  const categoria = document.getElementById('novaCategoria').value;
  const preco = document.getElementById('novoPreco').value;

  
  const resp = await fetch(`${API_URL}/produtos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, categoria, preco }),
  });
  const dados = await resp.json();
  mostrarResultado(resp.status, dados);
}

async function deletarProduto() {
  const id = document.getElementById('deleteId').value;
  const resp = await fetch(`${API_URL}/produtos/${id}`, { method: 'DELETE' });
  const dados = await resp.json();
  mostrarResultado(resp.status, dados);
}