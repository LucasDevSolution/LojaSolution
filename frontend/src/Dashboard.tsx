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
import VisibilityIcon from '@mui/icons-material/Visibility';
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

interface SaleProps {
  id: string;
  itemId: string;
  item: string;
  quantidade: number;
  preco: number;
  metodoPagamento: string;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [lowStockItems, setLowStockItems] = useState<ItemProps[]>([]);
  const [showAlertList, setShowAlertList] = useState<boolean>(false);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [profitData, setProfitData] = useState<any[]>([]);
  const [sales, setSales] = useState<SaleProps[]>([]);
  const [items, setItems] = useState<ItemProps[]>([]);

  useEffect(() => {
    async function fetchItemsAndSales() {
      try {
        const response = await api.get('/customers');
        const items = response.data;
        const lowStock = items.filter((item: ItemProps) => parseInt(item.quantidade) <= 5);
        setLowStockItems(lowStock);
        setItems(items);

        const salesResponse = await api.get('/sales');
        const sales = salesResponse.data;
        setSales(sales);
      } catch (error) {
        console.error('Erro ao buscar itens:', error);
      }
    }

    fetchItemsAndSales();
  }, []);

  useEffect(() => {
    const calculateSalesAndProfitData = () => {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const itemSales: { [key: string]: number } = {};
      const itemProfit: { [key: string]: number } = {};

      // Filtrar vendas do mês atual e calcular o lucro e as vendas
      sales.filter(sale => {
        const saleDate = new Date(sale.created_at);
        return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
      }).forEach(sale => {
        const item = items.find(i => i.id === sale.itemId);
        if (item) {
          const lucro = (parseFloat(item.precov) - parseFloat(item.precoc)) * sale.quantidade;

          if (!itemSales[sale.item]) {
            itemSales[sale.item] = 0;
            itemProfit[sale.item] = 0;
          }

          itemSales[sale.item] += sale.quantidade;
          itemProfit[sale.item] += lucro;
        }
      });

      // Ordenar os itens por lucro em ordem decrescente e selecionar os 4 primeiros
      const topProfitData = Object.keys(itemProfit).map(item => ({
        item,
        profit: itemProfit[item]
      })).sort((a, b) => b.profit - a.profit).slice(0, 4);

      // Filtrar os dados de vendas para incluir apenas os itens de maior lucro
      const topSalesData = topProfitData.map(data => ({
        item: data.item,
        sales: itemSales[data.item]
      }));

      setSalesData(topSalesData);
      setProfitData(topProfitData);
    };

    if (sales.length && items.length) {
      calculateSalesAndProfitData();
    }
  }, [sales, items]);

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
      label: 'Lucro',
      data: profitData.map(data => data.profit),
      backgroundColor: profitData.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`),
      borderColor: profitData.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`),
      borderWidth: 1,
    }],
  };

  const handleNavigateToVenda = () => {
    navigate('/caixa');
  };

  const handleNavigateToCadastroEstoque = () => {
    navigate('/cadastrar-estoque', { state: { updateItems: true } });
  };

  const handleNavigateToEstoque = () => {
    navigate('/estoque');
  };

  const handleNavigateToVisualizarVendas = () => {
    navigate('/visualizar-vendas');
  };

  const handleNavigateTocaixa = () => {
    navigate('/saldo');
  };

  const handleNavigateToCustomUrl = () => {
    window.open('http://189.31.47.25:3000/dashboard', '_blank');
  };

  const isNewMonth = () => {
    const now = new Date();
    const lastMonth = localStorage.getItem('lastMonth');
    const currentMonth = now.getMonth();

    if (lastMonth === null || parseInt(lastMonth) !== currentMonth) {
      localStorage.setItem('lastMonth', currentMonth.toString());
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (isNewMonth()) {
      setSales([]);
      setSalesData([]);
      setProfitData([]);
    }
  }, []);

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
          <button onClick={handleNavigateToEstoque} className="mb-6">
            <InventoryIcon style={{ color: 'white', fontSize: 30 }} />
          </button>
        </Tooltip>
        <Tooltip title="Venda" placement="right">
          <button onClick={handleNavigateToVenda} className="mb-6">
            <SellIcon style={{ color: 'white', fontSize: 30 }} />
          </button>
        </Tooltip>
        <Tooltip title="Visualizar Vendas" placement="right">
          <button onClick={handleNavigateToVisualizarVendas} className="mb-6">
            <VisibilityIcon style={{ color: 'white', fontSize: 30 }} />
          </button>
        </Tooltip>
        <Tooltip title="Caixa" placement="right">
          <button onClick={handleNavigateTocaixa} className="mb-6">
            <AttachMoneyIcon style={{ color: 'white', fontSize: 30 }} />
          </button>
        </Tooltip>
        
        <Tooltip title="Alertas de Estoque Baixo" placement="right">
          <button onClick={handleAlertClick} className="relative mb-6">
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
        <h1 className="text-4xl font-medium -mt-4">Dashboard</h1>
        {showAlertList && lowStockItems.length > 0 && (
          <div className="bg-red-500 text-white p-4 rounded mb-6">
            <h2 className="text-2xl font-semibold">Atenção! Itens com baixo estoque:</h2>
            <ul className="mt-2">
              {lowStockItems.map((item, index) => (
                <li key={index}>{item.item} - Quantidade: {item.quantidade}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-gray-800 p-4 rounded-lg shadow-md" style={{ height: '300px' }}>
            <h2 className="text-xl font-semibold -mb-5">Vendas por Item</h2>
            <Bar data={salesChartData} options={{ maintainAspectRatio: false }} />
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-md" style={{ height: '300px' }}>
            <h2 className="text-xl font-semibold -mb-6">Lucro por Item</h2>
            <Pie data={profitChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;