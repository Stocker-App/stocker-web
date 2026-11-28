import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';
import './Dashboard.css';

// ---------- Formatadores ----------

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const numero = new Intl.NumberFormat('pt-BR');

// ---------- Adaptadores (API -> formato que os componentes usam) ----------

// A API devolve "2026-11-28" (só a data). Criamos a data no fuso local
// para o rótulo do dia da semana não "voltar" um dia.
function paraDiaDoGrafico(item) {
  const [ano, mes, dia] = item.data.split('-').map(Number);
  const d = new Date(ano, mes - 1, dia);
  return {
    chave: item.data,
    rotulo: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
    entradas: item.entradas,
    saidas: item.saidas,
  };
}

// ---------- Componentes ----------

function Indicadores({ dados }) {
  const itens = [
    { rotulo: 'Produtos cadastrados', valor: numero.format(dados.totalProdutos) },
    { rotulo: 'Unidades em estoque', valor: numero.format(dados.totalUnidadesEmEstoque) },
    { rotulo: 'Valor em estoque', valor: moeda.format(dados.valorTotalEstoque) },
    { rotulo: 'Abaixo do mínimo', valor: numero.format(dados.produtosEmAlerta) },
  ];

  return (
    <dl className="dash-kpis">
      {itens.map((item) => (
        <div className="dash-kpi" key={item.rotulo}>
          <dt>{item.rotulo}</dt>
          <dd>{item.valor}</dd>
        </div>
      ))}
    </dl>
  );
}

function PrecisaRepor({ lista }) {
  // Os mais críticos primeiro (menor proporção entre estoque atual e mínimo)
  const ordenada = [...lista].sort(
    (a, b) =>
      a.quantidadeAtual / (a.estoqueMinimo || 1) - b.quantidadeAtual / (b.estoqueMinimo || 1)
  );

  return (
    <section className="dash-panel dash-panel-alerta" aria-labelledby="titulo-repor">
      <h2 id="titulo-repor">Precisa de reposição</h2>

      {ordenada.length === 0 ? (
        <p className="dash-vazio">Tudo certo: nenhum produto abaixo do mínimo.</p>
      ) : (
        <ul className="dash-repor">
          {ordenada.slice(0, 6).map((p) => {
            const esgotado = p.severidade === 'CRITICO';
            return (
              <li key={p.produtoId}>
                <div className="dash-repor-linha">
                  <span className="dash-repor-nome">{p.produtoNome}</span>
                  <span className="dash-repor-status">
                    {esgotado ? 'Esgotado' : `${p.quantidadeAtual} de ${p.estoqueMinimo}`}
                  </span>
                </div>
                <div className="dash-barra" aria-hidden="true">
                  <div className="dash-barra-preenchida" style={{ width: `${p.percentualEstoque}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function GraficoMovimentacao({ dias }) {
  const L = 560;
  const A = 220;
  const margem = { topo: 22, base: 28, lado: 8 };
  const areaH = A - margem.topo - margem.base;
  const faixa = (L - margem.lado * 2) / dias.length;
  const larguraBarra = Math.min(22, faixa / 3);
  const maximo = Math.max(1, ...dias.flatMap((d) => [d.entradas, d.saidas]));
  const y = (v) => margem.topo + areaH - (v / maximo) * areaH;
  const yBase = margem.topo + areaH;

  const resumo = dias
    .map((d) => `${d.rotulo}: ${d.entradas} entradas, ${d.saidas} saídas`)
    .join('; ');

  return (
    <section className="dash-panel" aria-labelledby="titulo-grafico">
      <div className="dash-panel-topo">
        <h2 id="titulo-grafico">Entradas e saídas nos últimos 7 dias</h2>
        <div className="dash-legenda">
          <span><i className="dash-legenda-cor dash-cor-entrada" /> Entradas</span>
          <span><i className="dash-legenda-cor dash-cor-saida" /> Saídas</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${L} ${A}`} role="img" aria-label={resumo} className="dash-grafico">
        <line x1={margem.lado} x2={L - margem.lado} y1={yBase} y2={yBase} className="dash-grafico-base" />
        {dias.map((d, i) => {
          const centro = margem.lado + faixa * i + faixa / 2;
          return (
            <g key={d.chave}>
              <rect
                x={centro - larguraBarra - 2}
                y={y(d.entradas)}
                width={larguraBarra}
                height={yBase - y(d.entradas)}
                rx="3"
                className="dash-cor-entrada"
              />
              <rect
                x={centro + 2}
                y={y(d.saidas)}
                width={larguraBarra}
                height={yBase - y(d.saidas)}
                rx="3"
                className="dash-cor-saida"
              />
              {d.entradas > 0 && (
                <text x={centro - larguraBarra / 2 - 2} y={y(d.entradas) - 5} className="dash-grafico-valor">
                  {d.entradas}
                </text>
              )}
              {d.saidas > 0 && (
                <text x={centro + larguraBarra / 2 + 2} y={y(d.saidas) - 5} className="dash-grafico-valor">
                  {d.saidas}
                </text>
              )}
              <text x={centro} y={A - 8} className="dash-grafico-rotulo">{d.rotulo}</text>
            </g>
          );
        })}
      </svg>
    </section>
  );
}

function UltimasMovimentacoes({ lista }) {
  return (
    <section className="dash-panel dash-largo" aria-labelledby="titulo-mov">
      <h2 id="titulo-mov">Últimas movimentações</h2>

      {lista.length === 0 ? (
        <p className="dash-vazio">Nenhuma movimentação registrada ainda.</p>
      ) : (
        <div className="dash-tabela-rolagem">
          <table className="dash-tabela">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Tipo</th>
                <th className="dash-num">Quantidade</th>
                <th>Quando</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((m) => {
                const entrada = m.tipo === 'ENTRADA';
                return (
                  <tr key={m.id}>
                    <td>{m.produtoNome}</td>
                    <td>
                      {entrada ? 'Entrada' : 'Saída'}
                      {m.estornada ? ' (estornada)' : ''}
                    </td>
                    <td className="dash-num">{entrada ? '+' : '−'}{m.quantidade}</td>
                    <td>
                      {new Date(m.data).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

// ---------- Página ----------

export default function Dashboard() {
  const [resumo, setResumo] = useState(null);
  const [alertas, setAlertas] = useState([]);
  const [porDia, setPorDia] = useState([]);
  const [recentes, setRecentes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro('');
      try {
        const [r, a, d, m] = await Promise.all([
          apiFetch('/dashboard/resumo'),
          apiFetch('/alertas'),
          apiFetch('/dashboard/movimentacoes-por-dia?dias=7'),
          apiFetch('/dashboard/movimentacoes-recentes?limite=6'),
        ]);
        setResumo(r);
        setAlertas(a || []);
        setPorDia((d || []).map(paraDiaDoGrafico));
        setRecentes(m || []);
      } catch (err) {
        setErro(err.message || 'Não foi possível carregar o dashboard.');
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  const hoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="dashboard">
      <header className="dash-cabecalho">
        <h1>Visão geral</h1>
        <p>{hoje}</p>
      </header>

      {carregando && <p className="dash-vazio">Carregando dados do estoque...</p>}

      {erro && (
        <p className="dash-vazio" role="alert">
          {erro}
        </p>
      )}

      {!carregando && !erro && resumo && (
        <>
          <Indicadores dados={resumo} />

          <div className="dash-grade">
            <PrecisaRepor lista={alertas} />
            <GraficoMovimentacao dias={porDia} />
            <UltimasMovimentacoes lista={recentes} />
          </div>
        </>
      )}
    </div>
  );
}