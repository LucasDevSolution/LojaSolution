import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import HomeIcon from '@mui/icons-material/Home';
import AddBoxIcon from '@mui/icons-material/AddBox';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SellIcon from '@mui/icons-material/Sell';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import BuildIcon from '@mui/icons-material/Build';
import Tooltip from '@mui/material/Tooltip';
import { api } from '../src/services/api';
import 'chart.js/auto';

interface ItemProps {
  id: string;
  item: string;
  fornecedor: string;
  quantidade: string;
  precoc: string;
  precov: string;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [lowStockItems, setLowStockItems] = useState<ItemProps[]>([]);
  const [showAlertList, setShowAlertList] = useState<boolean>(false);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [profitData, setProfitData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await api.get('/customers');
        const items = response.data;
        const lowStock = items.filter((item: ItemProps) => parseInt(item.quantidade) <= 5);
        setLowStockItems(lowStock);

        // Mock data for sales and profit
        const salesMockData = [
          { item: 'Item A', sales: 120 },
          { item: 'Item B', sales: 80 },
          { item: 'Item C', sales: 100 },
          { item: 'Item D', sales: 90 },
        ];

        const profitMockData = [
          { item: 'Item A', profit: 500 },
          { item: 'Item B', profit: 700 },
          { item: 'Item C', profit: 400 },
          { item: 'Item D', profit: 600 },
        ];

        setSalesData(salesMockData);
        setProfitData(profitMockData);

      } catch (error) {
        console.error('Erro ao buscar itens:', error);
      }
    }

    fetchItems();
  }, []);

  useEffect(() => {
    if (lowStockItems.length > 0) {
      const timer = setTimeout(() => {
        setLowStockItems([]); // Remove todos os itens de uma vez
      }, 10000); // Tempo para remover todos os itens

      return () => clearTimeout(timer);
    }
  }, [lowStockItems]);

  const handleAlertClick = () => {
    setShowAlertList(!showAlertList);
  };

  const salesChartData = {
    labels: salesData.map(data => data.item),
    datasets: [{
      label: 'Vendas',
      data: salesData.map(data => data.sales),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }],
  };

  const profitChartData = {
    labels: profitData.map(data => data.item),
    datasets: [{
      data: profitData.map(data => data.profit),
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
      ],
      hoverBackgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
      ],
    }],
  };

  const handleNavigateTocaixa= () => {
    navigate('/saldo');
  };


  const handleNavigateToCadastroEstoque = () => {
    navigate('/cadastrar-estoque', { state: { updateItems: true } });
  };

  const handleNavigateToVenda = () => {
    navigate('/caixa');
  };

  const handleNavigateToCustomUrl = () => {
    window.open('http://189.31.47.25:3000/dashboard', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <aside className="w-20 bg-gray-800 flex flex-col items-center py-4">
        <Tooltip title="Home" placement="right">
          <button onClick={() => navigate('/dashboard')} className="mb-6">
            <HomeIcon style={{ color: 'white', fontSize: 30 }} />
          </button>
        </Tooltip>
        <Tooltip title="Cadastrar Estoque" placement="right">
          <button onClick={handleNavigateToCadastroEstoque} className="mb-6">
            <AddBoxIcon style={{ color: 'white', fontSize: 30 }} />
          </button>
        </Tooltip>
        <Tooltip title="Estoque" placement="right">
          <button onClick={() => navigate('/estoque')} className="mb-6">
            <InventoryIcon style={{ color: 'white', fontSize: 30 }} />
          </button>
        </Tooltip>
        <Tooltip title="Venda" placement="right">
          <button onClick={handleNavigateToVenda} className="mb-6">
            <SellIcon style={{ color: 'white', fontSize: 30 }} />
          </button>
        </Tooltip>
        <Tooltip title="Caixa" placement="right">
          <button onClick={handleNavigateTocaixa}className="mb-6">
            <AttachMoneyIcon style={{ color: 'white', fontSize: 30 }} />
          </button>
        </Tooltip>
        <Tooltip title="Alertas de Estoque Baixo" placement="right">
          <button onClick={handleAlertClick} className={`relative mb-6 ${lowStockItems.length > 0 ? 'animate-shake' : ''}`}>
            <NotificationsIcon style={{ color: 'white', fontSize: 30 }} />
            {lowStockItems.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {lowStockItems.length}
              </span>
            )}
          </button>
        </Tooltip>
        <Tooltip title="Sistema Solution" placement="right">
          <button onClick={handleNavigateToCustomUrl} className="mb-6">
            <div className="flex items-center justify-center">
              <LightbulbIcon style={{ color: 'white', fontSize: 24 }} />
              <BuildIcon style={{ color: 'white', fontSize: 24, position: 'absolute' }} />
            </div>
          </button>
        </Tooltip>
      </aside>
      <main className="flex-1 p-6 text-white">
        <h1 className="text-4xl font-medium -mt-4">Dashboard Solution</h1>
        {showAlertList && lowStockItems.length > 0 && (
          <div className="bg-red-500 text-white p-4 rounded mb-6">
            <h2 className="text-2xl font-semibold">Atenção! Itens com baixo estoque:</h2>
            <ul className="mt-2">
              {lowStockItems.map((item) => (
                <li key={item.id}>
                  {item.item}: {item.quantidade} unidades restantes
                </li>
              ))}
            </ul>
          </div>
        )}
      {/* Gráficos */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
  <div className="bg-gray-800 p-6 rounded h-72">
    <h2 className="text-xl font-semibold mb-4">Itens Mais Vendidos</h2>
    <Bar data={salesChartData} options={{ maintainAspectRatio: false }} />
  </div>
  <div className="bg-gray-800 p-12 rounded h-72 relative">
    <h2 className="text-xl font-semibold mb-3 absolute top-4 left-4">Lucro por Item</h2>
    <Pie data={profitChartData} options={{ maintainAspectRatio: false }} />
  </div>
</div>
      </main>
    </div>
  );
};

export default Dashboard;
