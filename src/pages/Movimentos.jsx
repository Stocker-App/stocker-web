import { useState, useEffect } from 'react';
import './Movimentacoes.css';

// Dados fictícios para testar a tela antes de ligar com o Spring Boot
const DADOS_INICIAIS = [
  {
    id: 1,
    produtoNome: 'Hamburguer',
    imagemUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
    tipo: 'ENTRADA',
    quantidade: 10,
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