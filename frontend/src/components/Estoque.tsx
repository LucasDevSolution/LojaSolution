import React, { useEffect, useState } from 'react';
import { FiTrash, FiEdit, FiArrowLeft } from 'react-icons/fi';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface CustomersProps {
  id: string;
  item: string;
  fornecedor: string;
  quantidade: number; // Ajustado para number
  precoc: number; // Ajustado para number
  precov: number; // Ajustado para number
  created_at: string;
}

const VisualizarEstoque: React.FC = () => {
  const [customers, setCustomers] = useState<CustomersProps[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      const response = await api.get('/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete('/customer', {
        params: { id: id },
      });
      setCustomers(customers.filter((customer) => customer.id !== id));
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
    }
  }

  function handleEdit(customer: CustomersProps) {
    navigate(`/editar-estoque/${customer.id}`, { state: customer });
  }

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value);
  }

  function handleBack() {
    navigate('/dashboard');
  }

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.item.toLowerCase().includes(searchLower) ||
      customer.fornecedor.toLowerCase().includes(searchLower) ||
      customer.quantidade.toString().toLowerCase().includes(searchLower) || // Convertido para string
      customer.precoc.toString().toLowerCase().includes(searchLower) || // Convertido para string
      customer.precov.toString().toLowerCase().includes(searchLower) // Convertido para string
    );
  });

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  return (
    <div className="w-full min-h-screen bg-gray-900 flex justify-center px-4 relative">
      <button
        onClick={handleBack}
        className="absolute top-1 left-4 bg-gray-800 text-white p-2 rounded-full shadow-md flex items-center justify-center"
        title="Voltar"
      >
        <FiArrowLeft size={24} />
      </button>

      <main className="my-5 w-full md:max-w-5X1 bg-gray-800 rounded-lg p-6">
        <h1 className="text-4xl font-medium text-white">Estoque</h1>

        <section className="flex flex-col gap-4 mt-6">
          <input
            type="text"
            placeholder="Buscar..."
            className="mb-4 p-2 rounded border border-gray-600 bg-gray-700 text-white"
            value={searchTerm}
            onChange={handleSearchChange}
          />

          <table className="w-full bg-gray-700 rounded-lg shadow-md text-white">
            <thead>
              <tr className="bg-gray-600">
                <th className="p-4 text-left">Item</th>
                <th className="p-4 text-left">Fornecedor</th>
                <th className="p-4 text-left">Quant.</th>
                <th className="p-4 text-left">Preço De Compra</th>
                <th className="p-4 text-left">Preço De Venda</th>
                <th className="p-4 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-600">
                  <td className="p-4">{customer.item}</td>
                  <td className="p-4">{customer.fornecedor}</td>
                  <td className="p-4">{customer.quantidade}</td>
                  <td className="p-4">{formatCurrency(customer.precoc)}</td>
                  <td className="p-4">{formatCurrency(customer.precov)}</td>
                  <td className="p-4 flex gap-2">
                    <button
                      className="bg-blue-500 text-white p-2 rounded"
                      onClick={() => handleEdit(customer)}
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      className="bg-red-500 text-white p-2 rounded"
                      onClick={() => handleDelete(customer.id)}
                    >
                      <FiTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default VisualizarEstoque;
