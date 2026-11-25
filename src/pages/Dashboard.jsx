import { useMemo } from 'react';
import './Dashboard.css';

// ---------- Dados de exemplo (depois troque por chamadas à API) ----------

const agora = new Date();

// Cria uma data "n" dias atrás, em uma determinada hora
const diasAtras = (n, hora = 10, minuto = 0) => {
  const d = new Date(agora);
  d.setDate(d.getDate() - n);
  d.setHours(hora, minuto, 0, 0);
  return d.toISOString();
};

const produtos = [
  { id: 1,  nome: 'Arroz 5kg',            quantidade: 4,  minimo: 20, preco: 28.9 },
  { id: 2,  nome: 'Feijão carioca 1kg',   quantidade: 0,  minimo: 25, preco: 8.5 },
  { id: 3,  nome: 'Óleo de soja 900ml',   quantidade: 31, minimo: 15, preco: 7.2 },
  { id: 4,  nome: 'Detergente 500ml',     quantidade: 9,  minimo: 18, preco: 2.8 },
  { id: 5,  nome: 'Água sanitária 2L',    quantidade: 22, minimo: 10, preco: 6.4 },
  { id: 6,  nome: 'Papel higiênico 12un', quantidade: 12, minimo: 15, preco: 19.9 },
  { id: 7,  nome: 'Sabonete 90g',         quantidade: 64, minimo: 30, preco: 2.2 },
  { id: 8,  nome: 'Café torrado 500g',    quantidade: 3,  minimo: 12, preco: 17.5 },
  { id: 9,  nome: 'Leite integral 1L',    quantidade: 48, minimo: 40, preco: 5.3 },
  { id: 10, nome: 'Açúcar 1kg',           quantidade: 27, minimo: 20, preco: 4.9 },
];

const movimentacoes = [
  { id: 1,  produtoId: 1,  tipo: 'saida',   quantidade: 12, data: diasAtras(0, 9, 40) },
  { id: 2,  produtoId: 9,  tipo: 'entrada', quantidade: 60, data: diasAtras(0, 8, 15) },
  { id: 3,  produtoId: 2,  tipo: 'saida',   quantidade: 18, data: diasAtras(1, 16, 5) },
  { id: 4,  produtoId: 8,  tipo: 'saida',   quantidade: 6,  data: diasAtras(1, 11, 30) },
  { id: 5,  produtoId: 3,  tipo: 'entrada', quantidade: 40, data: diasAtras(2, 14, 0) },
  { id: 6,  produtoId: 4,  tipo: 'saida',   quantidade: 10, data: diasAtras(2, 10, 20) },
  { id: 7,  produtoId: 7,  tipo: 'entrada', quantidade: 80, data: diasAtras(3, 9, 0) },
  { id: 8,  produtoId: 6,  tipo: 'saida',   quantidade: 7,  data: diasAtras(3, 15, 45) },
  { id: 9,  produtoId: 10, tipo: 'saida',   quantidade: 9,  data: diasAtras(4, 13, 10) },
  { id: 10, produtoId: 5,  tipo: 'entrada', quantidade: 25, data: diasAtras(4, 8, 50) },
  { id: 11, produtoId: 1,  tipo: 'saida',   quantidade: 14, data: diasAtras(5, 17, 0) },
  { id: 12, produtoId: 9,  tipo: 'saida',   quantidade: 22, data: diasAtras(5, 12, 30) },
  { id: 13, produtoId: 2,  tipo: 'saida',   quantidade: 15, data: diasAtras(6, 10, 0) },
  { id: 14, produtoId: 10, tipo: 'entrada', quantidade: 30, data: diasAtras(6, 9, 15) },
];

// ---------- Formatadores ----------

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const numero = new Intl.NumberFormat('pt-BR');

// Chave do dia no fuso local, para agrupar movimentações por dia
const chaveDoDia = (data) => {
  const d = new Date(data);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

// ---------- Cálculos ----------

function calcularIndicadores(lista) {
  const abaixoDoMinimo = lista.filter((p) => p.quantidade <= p.minimo);
  return {
    totalProdutos: lista.length,
    totalUnidades: lista.reduce((soma, p) => soma + p.quantidade, 0),
    valorEmEstoque: lista.reduce((soma, p) => soma + p.quantidade * p.preco, 0),
    qtdAbaixoDoMinimo: abaixoDoMinimo.length,
    // Os mais críticos primeiro (menor proporção entre estoque atual e mínimo)
    paraRepor: [...abaixoDoMinimo].sort(
      (a, b) => a.quantidade / a.minimo - b.quantidade / b.minimo
    ),
  };
}

function agruparPorDia(lista, quantidadeDeDias = 7) {
  const dias = [];
  for (let i = quantidadeDeDias - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dias.push({
      chave: chaveDoDia(d),
      rotulo: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
      entradas: 0,
      saidas: 0,
    });
  }
  for (const m of lista) {
    const dia = dias.find((x) => x.chave === chaveDoDia(m.data));
    if (!dia) continue;
    if (m.tipo === 'entrada') dia.entradas += m.quantidade;
    else dia.saidas += m.quantidade;
  }
  return dias;
}

// ---------- Componentes ----------

function Indicadores({ dados }) {
  const itens = [
    { rotulo: 'Produtos cadastrados', valor: numero.format(dados.totalProdutos) },
    { rotulo: 'Unidades em estoque', valor: numero.format(dados.totalUnidades) },
    { rotulo: 'Valor em estoque', valor: moeda.format(dados.valorEmEstoque) },
    { rotulo: 'Abaixo do mínimo', valor: numero.format(dados.qtdAbaixoDoMinimo) },
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
  return (
    <section className="dash-panel dash-panel-alerta" aria-labelledby="titulo-repor">
      <h2 id="titulo-repor">Precisa de reposição</h2>

      {lista.length === 0 ? (
        <p className="dash-vazio">Tudo certo: nenhum produto abaixo do mínimo.</p>
      ) : (
        <ul className="dash-repor">
          {lista.slice(0, 6).map((p) => {
            const esgotado = p.quantidade === 0;
            const percentual = Math.min(p.quantidade / p.minimo, 1) * 100;
            return (
              <li key={p.id}>
                <div className="dash-repor-linha">
                  <span className="dash-repor-nome">{p.nome}</span>
                  <span className="dash-repor-status">
                    {esgotado ? 'Esgotado' : `${p.quantidade} de ${p.minimo}`}
                  </span>
                </div>
                <div className="dash-barra" aria-hidden="true">
                  <div className="dash-barra-preenchida" style={{ width: `${percentual}%` }} />
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

function UltimasMovimentacoes({ lista, produtosPorId }) {
  const recentes = [...lista]
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .slice(0, 6);

  return (
    <section className="dash-panel dash-largo" aria-labelledby="titulo-mov">
      <h2 id="titulo-mov">Últimas movimentações</h2>

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
            {recentes.map((m) => {
              const entrada = m.tipo === 'entrada';
              return (
                <tr key={m.id}>
                  <td>{produtosPorId[m.produtoId]?.nome ?? 'Produto removido'}</td>
                  <td>{entrada ? 'Entrada' : 'Saída'}</td>
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
    </section>
  );
}

// ---------- Página ----------

export default function Dashboard() {
  const indicadores = useMemo(() => calcularIndicadores(produtos), []);
  const dias = useMemo(() => agruparPorDia(movimentacoes, 7), []);
  const produtosPorId = useMemo(
    () => Object.fromEntries(produtos.map((p) => [p.id, p])),
    []
  );

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

      <Indicadores dados={indicadores} />

      <div className="dash-grade">
        <PrecisaRepor lista={indicadores.paraRepor} />
        <GraficoMovimentacao dias={dias} />
        <UltimasMovimentacoes lista={movimentacoes} produtosPorId={produtosPorId} />
      </div>
    </div>
  );
}