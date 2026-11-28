import React, { useState } from 'react';
import './Produtos.css';

function Produtos() {
  const [produtos, setProdutos] = useState([
    {
      id: 1,
      nome: 'Hamburguer bom',
      preco: '100',
      categoria: 'Comida',
      estoque: 100,
      imagem: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300'
    },
    {
      id: 2,
      nome: 'Computador',
      preco: '1.500,00',
      categoria: 'Tecnologia',
      estoque: 12,
      imagem: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300'
    },
    {
      id: 3,
      nome: 'Fone de ouvido da Apple',
      preco: '11.000,00',
      categoria: 'Tecnologia de luxo',
      estoque: 3,
      imagem: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300'
    }
  ]);

  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Tudo');
  const [modalAberto, setModalAberto] = useState(false);

  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('');
  const [imagem, setImagem] = useState('');

  const categorias = ['Tudo', 'Comida', 'Tecnologia', 'Tecnologia de luxo'];

  const listaFiltrada = produtos.filter((produto) => {
    const correspondeBusca = produto.nome
      .toLowerCase()
      .includes(busca.toLowerCase());
    const correspondeCategoria =
      categoriaAtiva === 'Tudo' || produto.categoria === categoriaAtiva;

    return correspondeBusca && correspondeCategoria;
  });

  function excluirProduto(id) {
    if (window.confirm('Deseja remover este produto?')) {
      setProdutos(produtos.filter((item) => item.id !== id));
    }
  }

  function salvarProduto(e) {
    e.preventDefault();

    if (!nome.trim() || !preco.trim() || !categoria) {
      alert('Preencha nome, preço e categoria.');
      return;
    }

    const novoProduto = {
      id: Date.now(),
      nome: nome.trim(),
      preco: preco.trim(),
      categoria,
      estoque: 0,
      imagem: imagem.trim() || 'https://via.placeholder.com/150?text=Produto'
    };

    setProdutos([...produtos, novoProduto]);
    setNome('');
    setPreco('');
    setCategoria('');
    setImagem('');
    setModalAberto(false);
  }

  return (
    <section className="pagina-produtos">
      <div className="barra-busca">
        <input
          type="text"
          placeholder="Busque por um produto"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <div className="filtros-categorias">
        {categorias.map((cat) => (
          <button
            key={cat}
            type="button"
            className={categoriaAtiva === cat ? 'filtro-btn ativo' : 'filtro-btn'}
            onClick={() => setCategoriaAtiva(cat)}
          >
            {cat}
          </button>
        ))}

        <button
          type="button"
          className="btn-engrenagem"
          title="Categorias"
          onClick={() => alert('Navegar para tela de categorias')}
        >
          ⚙️
        </button>
      </div>

      <div className="grade-produtos">
        {listaFiltrada.map((produto) => (
          <article key={produto.id} className="card-produto">
            <img src={produto.imagem} alt={produto.nome} />

            <h3>{produto.nome}</h3>
            <p className="preco">R$ {produto.preco}</p>
            <p className="categoria">{produto.categoria}</p>
            <span className="quantidade">Estoque: {produto.estoque}</span>

            <div className="botoes-card">
              <button
                type="button"
                title="Editar"
                onClick={() => alert(`Editar ${produto.nome}`)}
              >
                ✏️
              </button>
              <button
                type="button"
                title="Movimentação"
                onClick={() => alert(`Movimentar ${produto.nome}`)}
              >
                💲
              </button>
              <button
                type="button"
                title="Excluir"
                onClick={() => excluirProduto(produto.id)}
              >
                🗑️
              </button>
            </div>
          </article>
        ))}
      </div>

      <button
        type="button"
        className="botao-mais"
        title="Adicionar produto"
        onClick={() => setModalAberto(true)}
      >
        +
      </button>

      {modalAberto && (
        <div className="sobreposicao-modal">
          <form className="modal-produto" onSubmit={salvarProduto}>
            <div className="area-imagem">
              <label htmlFor="url-imagem">URL da imagem</label>
              <input
                id="url-imagem"
                type="text"
                placeholder="https://..."
                value={imagem}
                onChange={(e) => setImagem(e.target.value)}
              />
            </div>

            <div className="area-campos">
              <input
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />

              <input
                type="text"
                placeholder="Digite um preço"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
              />

              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <option value="">Selecione uma categoria...</option>
                <option value="Comida">Comida</option>
                <option value="Tecnologia">Tecnologia</option>
                <option value="Tecnologia de luxo">Tecnologia de luxo</option>
              </select>

              <div className="acoes-modal">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                >
                  Cancelar
                </button>
                <button type="submit">
                  Adicionar
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default Produtos;