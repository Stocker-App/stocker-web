import { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import './Movimentacoes.css';

export default function Movimentacoes() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState('TODOS');
  const [busca, setBusca] = useState('');
  const [filtroAberto, setFiltroAberto] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // Estados do formulário de nova movimentação
  const [formAberto, setFormAberto] = useState(false);
  const [produtoId, setProdutoId] = useState('');
  const [tipo, setTipo] = useState('ENTRADA');
  const [quantidade, setQuantidade] = useState('1');
  const [observacao, setObservacao] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState('');
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setCarregando(true);
    setErro('');
    try {
      const [paginaMovs, listaProdutos] = await Promise.all([
        apiFetch('/movimentacoes?size=50&sort=data,desc'),
        apiFetch('/movimentacoes/opcoes-produtos'),
      ]);
      setMovimentacoes(paginaMovs.content || []);
      setProdutos(listaProdutos || []);
      if (listaProdutos?.length > 0 && !produtoId) {
        setProdutoId(String(listaProdutos[0].id));
      }
    } catch (err) {
      setErro(err.message || 'Não foi possível carregar as movimentações.');
    } finally {
      setCarregando(false);
    }
  }

  async function registrarMovimentacao(e) {
    e.preventDefault();
    setErroForm('');
    setSucesso('');

    if (!produtoId || Number(quantidade) <= 0) {
      setErroForm('Selecione um produto e informe uma quantidade maior que zero.');
      return;
    }

    setSalvando(true);
    try {
      await apiFetch('/movimentacoes', {
        method: 'POST',
        body: JSON.stringify({
          produtoId: Number(produtoId),
          tipo,
          quantidade: Number(quantidade),
          observacao: observacao.trim() || null,
        }),
      });

      setObservacao('');
      setQuantidade('1');
      setFormAberto(false);
      setSucesso('Movimentação registrada com sucesso!');
      await carregarDados();
    } catch (err) {
      // Aqui aparece automaticamente a mensagem do back-end (ex.: "Saldo insuficiente em estoque...")
      setErroForm(err.message || 'Erro ao registrar movimentação.');
    } finally {
      setSalvando(false);
    }
  }

  async function estornarMovimentacao(id) {
    if (!window.confirm('Deseja estornar esta movimentação e reverter o saldo?')) return;
    setErro('');
    setSucesso('');
    try {
      await apiFetch(`/movimentacoes/${id}/estornar`, { method: 'POST' });
      setSucesso('Movimentação estornada com sucesso!');
      await carregarDados();
    } catch (err) {
      setErro(err.message || 'Não foi possível estornar.');
    }
  }

  function selecionarFiltro(novoFiltro) {
    setFiltro(novoFiltro);
    setFiltroAberto(false);
  }

  const termoBusca = busca.trim().toLowerCase();

  const listaFiltrada = movimentacoes.filter((item) => {
    const bateTipo = filtro === 'TODOS' || item.tipo === filtro;
    const textoMovimento =
      item.tipo === 'ENTRADA'
        ? `Entrou ${item.quantidade} ${item.quantidade === 1 ? 'unidade' : 'unidades'}`
        : `Saiu ${item.quantidade} ${item.quantidade === 1 ? 'unidade' : 'unidades'}`;

    const bateTexto =
      !termoBusca ||
      item.produtoNome.toLowerCase().includes(termoBusca) ||
      textoMovimento.toLowerCase().includes(termoBusca) ||
      String(item.quantidade).includes(termoBusca) ||
      (item.observacao && item.observacao.toLowerCase().includes(termoBusca));

    return bateTipo && bateTexto;
  });

  return (
    <div className="layout-container">
      {filtroAberto && (
        <div
          className="filtro-backdrop"
          onClick={() => setFiltroAberto(false)}
          aria-hidden="true"
        />
      )}

      <main className="movimentacoes-conteudo">
        <header className="movimentacoes-topo">
          <div className="filtro-wrapper">
            <button
              type="button"
              className={`btn-filtro-redondo ${filtroAberto ? 'aberto' : ''}`}
              onClick={() => setFiltroAberto((prev) => !prev)}
            >
              Filtro
            </button>

            <div className={`filtros-dropdown ${filtroAberto ? 'visivel' : ''}`}>
              <button
                type="button"
                className={`btn-filtro ${filtro === 'TODOS' ? 'ativo' : ''}`}
                onClick={() => selecionarFiltro('TODOS')}
              >
                Tudo
              </button>
              <button
                type="button"
                className={`btn-filtro ${filtro === 'ENTRADA' ? 'ativo' : ''}`}
                onClick={() => selecionarFiltro('ENTRADA')}
              >
                Entradas
              </button>
              <button
                type="button"
                className={`btn-filtro ${filtro === 'SAIDA' ? 'ativo' : ''}`}
                onClick={() => selecionarFiltro('SAIDA')}
              >
                Saídas
              </button>
            </div>
          </div>

          <input
            type="search"
            className="input-pesquisa"
            placeholder="Busque por uma movimentação ou produto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            aria-label="Buscar movimentação"
          />

          <button
            type="button"
            className="btn-filtro ativo"
            onClick={() => {
              setErroForm('');
              setFormAberto((prev) => !prev);
            }}
          >
            {formAberto ? 'Fechar' : '+ Nova movimentação'}
          </button>
        </header>

        {sucesso && <p className="mensagem-status">{sucesso}</p>}

        {formAberto && (
          <form
            onSubmit={registrarMovimentacao}
            className="card-movimentacao card-verde"
            style={{ flexDirection: 'column', gap: '12px', marginBottom: '24px', alignItems: 'stretch' }}
          >
            <h2 style={{ margin: 0 }}>Registrar movimentação</h2>

            <label>
              Produto
              <select
                value={produtoId}
                onChange={(e) => setProdutoId(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '8px', marginTop: '4px' }}
              >
                {produtos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome} (Saldo atual: {p.quantidadeAtual})
                  </option>
                ))}
              </select>
            </label>

            <label>
              Tipo
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', marginTop: '4px' }}
              >
                <option value="ENTRADA">Entrada</option>
                <option value="SAIDA">Saída</option>
              </select>
            </label>

            <label>
              Quantidade
              <input
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '8px', marginTop: '4px' }}
              />
            </label>

            <label>
              Observação
              <input
                type="text"
                maxLength={255}
                placeholder="Ex.: Reposição de estoque ou venda"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', marginTop: '4px' }}
              />
            </label>

            {erroForm && <p style={{ color: '#a00000', fontWeight: 700, margin: 0 }}>{erroForm}</p>}

            <button type="submit" className="btn-filtro-redondo" style={{ width: 'auto', borderRadius: '25px', padding: '12px 24px', height: 'auto' }} disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar movimentação'}
            </button>
          </form>
        )}

        {carregando && <p className="mensagem-status">Carregando histórico...</p>}

        {erro && (
          <div className="mensagem-erro">
            <p>{erro}</p>
            <button type="button" onClick={carregarDados}>Tentar novamente</button>
          </div>
        )}

        {!carregando && !erro && listaFiltrada.length === 0 && (
          <p className="mensagem-status">Nenhuma movimentação encontrada.</p>
        )}

        <section className="lista-movimentacoes">
          {listaFiltrada.map((mov) => {
            const corCard = mov.tipo === 'ENTRADA' ? 'card-verde' : 'card-rosa';
            const textoAcao =
              mov.tipo === 'ENTRADA'
                ? `Entrou ${mov.quantidade} ${mov.quantidade === 1 ? 'unidade' : 'unidades'}`
                : `Saiu ${mov.quantidade} ${mov.quantidade === 1 ? 'unidade' : 'unidades'}`;

            return (
              <article
                key={mov.id}
                className={`card-movimentacao ${corCard}`}
                style={{ opacity: mov.estornada ? 0.6 : 1 }}
              >
                <div className="card-imagem-box">
                  <img
                    src={mov.imagemUrl || 'https://via.placeholder.com/210x135?text=Produto'}
                    alt={mov.produtoNome}
                  />
                </div>

                <div className="card-info">
                  <h2>
                    {mov.produtoNome} {mov.estornada ? '(Estornada)' : ''}
                  </h2>
                  <p className="texto-quantidade">{textoAcao}</p>
                  <span className="texto-obs">
                    Saldo: {mov.estoqueAnterior} → {mov.estoquePosterior}
                  </span>
                  {mov.observacao && <span className="texto-obs">{mov.observacao}</span>}
                  <small className="texto-data">
                    {new Date(mov.data).toLocaleString('pt-BR')}
                  </small>
                  {!mov.estornada && (
                    <button
                      type="button"
                      className="btn-filtro"
                      style={{ marginTop: '10px' }}
                      onClick={() => estornarMovimentacao(mov.id)}
                    >
                      Estornar
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}