import React, { useState, useEffect } from 'react';
import { api } from '../services/api'
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

interface SaleProps {
  id: string;
  item: string;
  quantidade: number;
  preco: number;
  data: string;
}

const Caixa: React.FC = () => {
  const [sales, setSales] = useState<SaleProps[]>([]);
  const [totalSalesValue, setTotalSalesValue] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSales() {
      try {
        const response = await api.get('/sales');
        setSales(response.data);
      } catch (error) {
        console.error('Erro ao buscar vendas:', error);
      }
    }

    fetchSales();
  }, []);

  useEffect(() => {
    const totalValue = sales.reduce((total, sale) => total + sale.quantidade * sale.preco, 0);
    setTotalSalesValue(totalValue);
  }, [sales]);

  function handleBack() {
    navigate('/dashboard');
  }

  return (
    <div className="relative w-full min-h-screen bg-gray-900 flex justify-center px-4">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 bg-gray-800 text-white p-2 rounded-full shadow-md flex items-center justify-center"
        title="Voltar"
      >
        <FiArrowLeft size={24} />
      </button>

      <main className="my-10 w-full md:max-w-2xl">
        <h1 className="text-4xl font-medium text-white">Caixa - Saldo de Vendas</h1>

        <div className="mt-4 text-white">
          <h2 className="text-xl font-medium">Histórico de Vendas:</h2>
          <ul>
            {sales.map((sale) => (
              <li key={sale.id}>
                {sale.item} - Quantidade: {sale.quantidade} - Valor Unitário: R${sale.preco.toFixed(2)} - Total: R${(sale.quantidade * sale.preco).toFixed(2)}
              </li>
            ))}
          </ul>
          <h3 className="mt-2 text-lg font-medium">Total em Vendas: R${totalSalesValue.toFixed(2)}</h3>
        </div>
      </main>
    </div>
  );
};

export default Caixa;
