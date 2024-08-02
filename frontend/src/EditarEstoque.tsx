import React, { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { api } from './services/api';

// Função para formatar números como moeda brasileira
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value);
};

// Função para desformatar valores de moeda brasileira
const parseCurrency = (value: string) => {
  return parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.'));
};

// Função para adicionar formatação ao valor enquanto o usuário digita
const formatInput = (value: string) => {
  let numericValue = value.replace(/[^\d]/g, '');
  let formattedValue = numericValue;

  // Adiciona a vírgula para centavos
  if (numericValue.length > 2) {
    formattedValue = numericValue.slice(0, -2) + ',' + numericValue.slice(-2);
  }

  // Adiciona o ponto para separação de milhar
  if (numericValue.length > 5) {
    const integerPart = formattedValue.slice(0, -3);
    const decimalPart = formattedValue.slice(-3);
    formattedValue = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + decimalPart;
  }

  return `R$ ${formattedValue}`;
};

interface CustomerProps {
  id: string;
  item: string;
  fornecedor: string;
  quantidade: number;
  precoc: number;
  precov: number;
}

const EditarEstoque: React.FC = () => {
  const [customer, setCustomer] = useState<CustomerProps | null>(null);
  const [item, setItem] = useState('');
  const [fornecedor, setFornecedor] = useState('');
  const [quantidade, setQuantidade] = useState<number | string>('');
  const [precoc, setPrecoc] = useState<string>('');
  const [precov, setPrecov] = useState<string>('');
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      const { item, fornecedor, quantidade, precoc, precov } = location.state as CustomerProps;
      setCustomer(location.state as CustomerProps);
      setItem(item);
      setFornecedor(fornecedor);
      setQuantidade(quantidade);
      setPrecoc(formatCurrency(precoc));
      setPrecov(formatCurrency(precov));
    } else if (id) {
      // Caso não haja state, busque o item pelo ID
      loadCustomer(id);
    }
  }, [location.state, id]);

  const loadCustomer = async (id: string) => {
    try {
      const response = await api.get(`/customers/${id}`);
      const { item, fornecedor, quantidade, precoc, precov } = response.data;
      setCustomer(response.data);
      setItem(item);
      setFornecedor(fornecedor);
      setQuantidade(quantidade);
      setPrecoc(formatCurrency(precoc));
      setPrecov(formatCurrency(precov));
    } catch (error) {
      console.error('Erro ao carregar cliente:', error);
    }
  };

  const handleSave = async () => {
    if (!customer) return;

    try {
      await api.put(`/customers/${customer.id}`, {
        item,
        fornecedor,
        quantidade: parseInt(quantidade as string),
        precoc: parseCurrency(precoc),
        precov: parseCurrency(precov),
      });

      navigate('/estoque');
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    }
  };

  const handleBack = () => {
    navigate('/estoque');
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 flex justify-center px-4 relative">
      <button
        onClick={handleBack}
        className="absolute top-1 left-4 bg-gray-800 text-white p-0 rounded-full shadow-md flex items-center justify-center"
        title="Voltar"
      >
        <FiArrowLeft size={24} />
      </button>

      <main className="my-10 w-full md:max-w-4xl bg-gray-800 rounded-lg p-6">
        <h1 className="text-4xl font-medium text-white">Editar Estoque</h1>

        <section className="flex flex-col gap-0 mt-6">
          <label htmlFor="item" className="text-white">Item:</label>
          <input
            id="item"
            type="text"
            placeholder="Item"
            className="mb-4 p-2 rounded border border-gray-600 bg-gray-700 text-white"
            value={item}
            onChange={(e) => setItem(e.target.value)}
          />

          <label htmlFor="fornecedor" className="text-white">Fornecedor:</label>
          <input
            id="fornecedor"
            type="text"
            placeholder="Fornecedor"
            className="mb-4 p-2 rounded border border-gray-600 bg-gray-700 text-white"
            value={fornecedor}
            onChange={(e) => setFornecedor(e.target.value)}
          />

          <label htmlFor="quantidade" className="text-white">Quantidade:</label>
          <input
            id="quantidade"
            type="number"
            placeholder="Quantidade"
            className="mb-4 p-2 rounded border border-gray-600 bg-gray-700 text-white"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
          />

          <label htmlFor="precoc" className="text-white">Preço de Compra:</label>
          <input
            id="precoc"
            type="text"
            placeholder="Preço de Compra"
            className="mb-4 p-2 rounded border border-gray-600 bg-gray-700 text-white"
            value={precoc}
            onChange={(e) => setPrecoc(formatInput(e.target.value))}
          />

          <label htmlFor="precov" className="text-white">Preço de Venda:</label>
          <input
            id="precov"
            type="text"
            placeholder="Preço de Venda"
            className="mb-4 p-2 rounded border border-gray-600 bg-gray-700 text-white"
            value={precov}
            onChange={(e) => setPrecov(formatInput(e.target.value))}
          />

          <button
            onClick={handleSave}
            className="bg-green-500 text-black p-2 rounded shadow-md font-bold"
          >
            Salvar
          </button>
          
         
        </section>
      </main>
    </div>
  );
};

export default EditarEstoque;
