import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import CadastrarEstoque from './CadastrarEstoque';
import VisualizarEstoque from './VisualizarEstoque';
import EditarEstoque from './EditarEstoque';
import VenderEstoque from '../src/VenderEstoque';
import Caixa from './Caixa';
import VisualizarVendas from './VisualizarVendas';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Redireciona da raiz para o painel */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        {/* Rota para o painel */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Rota para cadastro de estoque */}
        <Route path="/cadastrar-estoque" element={<CadastrarEstoque />} />
        {/* Rota para visualização de estoque */}
        <Route path="/estoque" element={<VisualizarEstoque />} />
        {/* Rota para edição de estoque, com parâmetro de ID */}
        <Route path="/editar-estoque/:id" element={<EditarEstoque />} />
        {/* Adicione outras rotas aqui conforme necessário */}
        <Route path="/caixa" element={<VenderEstoque/>} />
         {/* Adicione outras rotas aqui conforme necessário */}
         <Route path="/saldo" element={<Caixa/>} />
         <Route path="/visualizar-vendas" element={<VisualizarVendas/>} />
      </Routes>
    </Router>
  );
};

export default App;
