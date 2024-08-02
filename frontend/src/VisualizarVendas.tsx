import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Venda {
  id: string;
  itemId: string;
  item: string;
  quantidade: number;
  preco: number;
  metodoPagamento: string;
  created_at: string;
}

const VisualizarVendas: React.FC = () => {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendas = async () => {
      try {
        const response = await axios.get('http://localhost:3333/sales');
        setVendas(response.data);
      } catch (error) {
        console.error('Erro ao buscar vendas:', error);
        setErrorMessage('Erro ao carregar vendas.');
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      }
    };

    fetchVendas();
  }, []);

  const formatCurrency = (value: number) => {
    // Se o valor for em centavos, divida por 100. Caso contrário, remova a divisão.
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2, // Garante duas casas decimais
      maximumFractionDigits: 2, // Limita a duas casas decimais
    }).format(value / 100); // Divida por 100 se o valor for em centavos
  };

  return (
    <div className="relative w-full min-h-screen bg-gray-900 p-6">
      {errorMessage && (
        <div className="fixed top-4 right-4 bg-red-500 text-black p-3 rounded shadow-lg font-bold">
          {errorMessage}
        </div>
      )}
      <h1 className="text-4xl font-medium text-white mb-6">Visualizar Vendas</h1>
      <div className="overflow-x-auto">
        <table className="w-full bg-gray-800 text-white border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b border-gray-600 text-left">Item</th>
              <th className="px-4 py-2 border-b border-gray-600 text-left">Quantidade</th>
              <th className="px-4 py-2 border-b border-gray-600 text-left">Preço</th>
              <th className="px-4 py-2 border-b border-gray-600 text-left">Método de Pagamento</th>
              <th className="px-4 py-2 border-b border-gray-600 text-left">Data da Venda</th>
            </tr>
          </thead>
          <tbody>
            {vendas.length > 0 ? (
              vendas.map(venda => (
                <tr key={venda.id}>
                  <td className="px-4 py-2 border-b border-gray-700">{venda.item}</td>
                  <td className="px-4 py-2 border-b border-gray-700">{venda.quantidade}</td>
                  <td className="px-4 py-2 border-b border-gray-700">{formatCurrency(venda.preco)}</td>
                  <td className="px-4 py-2 border-b border-gray-700">{venda.metodoPagamento}</td>
                  <td className="px-4 py-2 border-b border-gray-700">
                    {new Date(venda.created_at).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-2 text-center border-b border-gray-700">
                  Nenhuma venda registrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VisualizarVendas;
