import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';
import './Produtos.css';

const IMAGEM_PADRAO =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='100' viewBox='0 0 150 100'%3E%3Crect width='150' height='100' fill='%23ebd6c3'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23533b34' font-family='sans-serif' font-size='14'%3ESem imagem%3C/text%3E%3C/svg%3E";

const formatadorMoeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

function formatarPreco(valor) {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) {
    return 'R$ 0,00';
  }
  return formatadorMoeda.format(numero);
}

function parsePrecoParaNumero(valor) {
  const texto = String(valor ?? '')
    .replace(/R\$/gi, '')
    .replace(/\s+/g, '')
    .trim();

  if (!texto) {
    return NaN;
  }

  let normalizado = texto;
  const temVirgula = texto.includes(',');
  const temPonto = texto.includes('.');

  if (temVirgula && temPonto) {
    if (texto.lastIndexOf(',') > texto.lastIndexOf('.')) {
      normalizado = texto.replace(/\./g, '').replace(',', '.');
    } else {
      normalizado = texto.replace(/,/g, '');
    }
  } else if (temVirgula) {
    normalizado = texto.replace(',', '.');
  } else if ((texto.match(/\./g) || []).length > 1) {
    normalizado = texto.replace(/\./g, '');
  }

  const numero = Number(normalizado);
  return Number.isFinite(numero) ? numero : NaN;
}

function normalizarLista(resposta) {
  if (Array.isArray(resposta)) {
    return resposta;
  }
  return resposta?.content || [];
}

function normalizarCategorias(lista) {
  return normalizarLista(lista).map((cat) => {
    if (typeof cat === 'string') {
      return { id: cat, nome: cat };
    }
    const nome = cat.nome ?? cat.categoriaNome ?? String(cat.id ?? '');
    const id = cat.id ?? cat.categoriaId ?? nome;
    return { id, nome };
  });
}

function Produtos() {
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Tudo');

  const [modalAberto, setModalAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setCarregando(true);
    setErro('');
    try {
      const [respostaProdutos, respostaCategorias] = await Promise.all([
        apiFetch('/produtos'),
        apiFetch('/produtos/opcoes-categorias'),
      ]);

      setProdutos(normalizarLista(respostaProdutos));
      setCategorias(normalizarCategorias(respostaCategorias));
    } catch (err) {
      setErro(err.message || 'Não foi possível carregar os produtos.');
    } finally {
      setCarregando(false);
    }
  }

  function abrirModalNovo() {
    setProdutoEditando(null);
    setNome('');
    setPreco('');
    setCategoriaId('');
    setImagemUrl('');
    setErroForm('');
    setModalAberto(true);
  }

  function abrirModalEditar(produto) {
    const categoriaCorrespondente = categorias.find(
      (cat) =>
        String(cat.id) === String(produto.categoriaId) ||
        cat.nome === produto.categoriaNome
    );

    setProdutoEditando(produto);
    setNome(produto.nome || '');
    setPreco(
      produto.preco != null
        ? Number(produto.preco).toFixed(2).replace('.', ',')
        : ''
    );
    setCategoriaId(
      produto.categoriaId != null
        ? String(produto.categoriaId)
        : categoriaCorrespondente
          ? String(categoriaCorrespondente.id)
          : ''
    );
    setImagemUrl(produto.imagemUrl || '');
    setErroForm('');
    setModalAberto(true);
  }

  function fecharModal() {
    if (salvando) return;
    setModalAberto(false);
    setProdutoEditando(null);
    setErroForm('');
  }

  async function excluirProduto(id) {
    if (!window.confirm('Deseja remover este produto?')) {
      return;
    }

    setErro('');
    setSucesso('');
    try {
      await apiFetch(`/produtos/${id}`, { method: 'DELETE' });
      setSucesso('Produto removido com sucesso!');
      await carregarDados();
    } catch (err) {
      setErro(err.message || 'Não foi possível remover o produto.');
    }
  }

  async function salvarProduto(e) {
    e.preventDefault();
    setErroForm('');
    setSucesso('');

    const precoNumerico = parsePrecoParaNumero(preco);

    if (!nome.trim() || !categoriaId) {
      setErroForm('Preencha nome, preço e categoria.');
      return;
    }

    if (!Number.isFinite(precoNumerico) || precoNumerico < 0) {
      setErroForm('Informe um preço válido (ex.: 1500,00 ou 1500.00).');
      return;
    }

    const idNumerico = Number(categoriaId);
    const payload = {
      nome: nome.trim(),
      preco: Number(precoNumerico.toFixed(2)),
      categoriaId: Number.isNaN(idNumerico) ? categoriaId : idNumerico,
      imagemUrl: imagemUrl.trim() || null,
    };

    setSalvando(true);
    try {
      if (produtoEditando) {
        await apiFetch(`/produtos/${produtoEditando.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        setSucesso('Produto atualizado com sucesso!');
      } else {
        await apiFetch('/produtos', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setSucesso('Produto cadastrado com sucesso!');
      }

      setModalAberto(false);
      setProdutoEditando(null);
      await carregarDados();
    } catch (err) {
      setErroForm(err.message || 'Não foi possível salvar o produto.');
    } finally {
      setSalvando(false);
    }
  }

  const termoBusca = busca.trim().toLowerCase();

  const listaFiltrada = produtos.filter((produto) => {
    const correspondeBusca = (produto.nome || '')
      .toLowerCase()
      .includes(termoBusca);
    const correspondeCategoria =
      categoriaAtiva === 'Tudo' || produto.categoriaNome === categoriaAtiva;

    return correspondeBusca && correspondeCategoria;
  });

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
        <button
          type="button"
          className={categoriaAtiva === 'Tudo' ? 'filtro-btn ativo' : 'filtro-btn'}
          onClick={() => setCategoriaAtiva('Tudo')}
        >
          Tudo
        </button>

        {categorias.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={categoriaAtiva === cat.nome ? 'filtro-btn ativo' : 'filtro-btn'}
            onClick={() => setCategoriaAtiva(cat.nome)}
          >
            {cat.nome}
          </button>
        ))}

        <button
          type="button"
          className="btn-engrenagem"
          title="Categorias"
          onClick={() => alert('Tela de categorias em breve!')}
        >
          ⚙️
        </button>
      </div>

      {sucesso && <p className="produtos-status">{sucesso}</p>}

      {carregando && <p className="produtos-status">Carregando produtos...</p>}

      {erro && (
        <div className="produtos-erro">
          <p>{erro}</p>
          <button type="button" className="filtro-btn ativo" onClick={carregarDados}>
            Tentar novamente
          </button>
        </div>
      )}

      {!carregando && !erro && listaFiltrada.length === 0 && (
        <p className="produtos-status">Nenhum produto encontrado.</p>
      )}

      <div className="grade-produtos">
        {listaFiltrada.map((produto) => (
          <article key={produto.id} className="card-produto">
            <img
              src={produto.imagemUrl || IMAGEM_PADRAO}
              alt={produto.nome}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = IMAGEM_PADRAO;
              }}
            />

            <h3>{produto.nome}</h3>
            <p className="preco">{formatarPreco(produto.preco)}</p>
            <p className="categoria">{produto.categoriaNome || 'Sem categoria'}</p>
            <span className="quantidade">
              Estoque: {produto.quantidadeAtual ?? 0}
            </span>

            <div className="botoes-card">
              <button
                type="button"
                title="Editar"
                onClick={() => abrirModalEditar(produto)}
              >
                ✏️
              </button>
              <button
                type="button"
                title="Movimentação"
                onClick={() => navigate('/movimentacoes')}
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
        onClick={abrirModalNovo}
      >
        +
      </button>

      {modalAberto && (
        <div className="sobreposicao-modal" onClick={fecharModal}>
          <form
            className="modal-produto"
            onSubmit={salvarProduto}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="area-imagem">
              {imagemUrl.trim() && (
                <img
                  key={imagemUrl.trim()}
                  src={imagemUrl.trim()}
                  alt="Pré-visualização"
                  className="preview-imagem"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <label htmlFor="url-imagem">URL da imagem</label>
              <input
                id="url-imagem"
                type="text"
                placeholder="https://..."
                value={imagemUrl}
                onChange={(e) => setImagemUrl(e.target.value)}
              />
            </div>

            <div className="area-campos">
              <h2 className="titulo-modal">
                {produtoEditando ? 'Editar produto' : 'Novo produto'}
              </h2>

              <input
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Digite um preço (ex.: 1500,00)"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                required
              />

              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                required
              >
                <option value="">Selecione uma categoria...</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nome}
                  </option>
                ))}
              </select>

              {erroForm && <p className="erro-modal">{erroForm}</p>}

              <div className="acoes-modal">
                <button
                  type="button"
                  onClick={fecharModal}
                  disabled={salvando}
                >
                  Cancelar
                </button>
                <button type="submit" disabled={salvando}>
                  {salvando
                    ? 'Salvando...'
                    : produtoEditando
                      ? 'Salvar'
                      : 'Adicionar'}
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
