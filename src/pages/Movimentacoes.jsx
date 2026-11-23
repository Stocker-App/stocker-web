import { useState, useEffect } from 'react';
import './Movimentacoes.css';

const DADOS_INICIAIS = [
  {
    id: 1,
    produtoNome: 'Hamburguer bom',
    imagemUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
    tipo: 'ENTRADA',
    quantidade: 100,
    observacao: 'Reposição de estoque',
    data: '23/11/2026 10:30'
  },
  {
    id: 2,
    produtoNome: 'Computador',
    imagemUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80',
    tipo: 'SAIDA',
    quantidade: 3,
    observacao: 'Venda realizada',
    data: '23/11/2026 11:15'
  },
  {
    id: 3,
    produtoNome: 'Fone de ouvido da Apple',
    imagemUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    tipo: 'SAIDA',
    quantidade: 1,
    observacao: 'ninguem quer compar',
    data: '22/11/2026 16:40'
  }
];

export default function Movimentacoes() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [filtro, setFiltro] = useState('TODOS');
  const [filtroAberto, setFiltroAberto] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    buscarMovimentacoes();
  }, []);

  async function buscarMovimentacoes() {
    setCarregando(true);
    setErro('');
    try {
      setTimeout(() => {
        setMovimentacoes(DADOS_INICIAIS);
        setCarregando(false);
      }, 300);
    } catch (err) {
      setErro('Não foi possível carregar as movimentações.');
      setCarregando(false);
    }
  }

  function selecionarFiltro(novoFiltro) {
    setFiltro(novoFiltro);
    setFiltroAberto(false);
  }

  const listaFiltrada = movimentacoes.filter((item) => {
    if (filtro === 'TODOS') return true;
    return item.tipo === filtro;
  });

  return (
    <div className="layout-container">
      {/* Sidebar feita pelo integrante responsável */}

      {/* Camada que desfoca o fundo quando o menu de filtro está aberto */}
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
        </header>

        {carregando && <p className="mensagem-status">Carregando histórico...</p>}

        {erro && (
          <div className="mensagem-erro">
            <p>{erro}</p>
            <button type="button" onClick={buscarMovimentacoes}>Tentar novamente</button>
          </div>
        )}

        {!carregando && !erro && listaFiltrada.length === 0 && (
          <p className="mensagem-status">Nenhuma movimentação registrada.</p>
        )}

        <section className="lista-movimentacoes">
          {listaFiltrada.map((mov, index) => {
            const corCard = index % 2 === 0 ? 'card-verde' : 'card-rosa';
            const textoAcao =
              mov.tipo === 'ENTRADA'
                ? `Entrou ${mov.quantidade} ${mov.quantidade === 1 ? 'unidade' : 'unidades'}`
                : `Saiu ${mov.quantidade} ${mov.quantidade === 1 ? 'unidade' : 'unidades'}`;

            return (
              <article key={mov.id} className={`card-movimentacao ${corCard}`}>
                <div className="card-imagem-box">
                  <img src={mov.imagemUrl} alt={mov.produtoNome} />
                </div>

                <div className="card-info">
                  <h2>{mov.produtoNome}</h2>
                  <p className="texto-quantidade">{textoAcao}</p>
                  {mov.observacao && <span className="texto-obs">{mov.observacao}</span>}
                  <small className="texto-data">{mov.data}</small>
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}