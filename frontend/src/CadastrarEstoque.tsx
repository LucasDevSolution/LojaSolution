import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { api } from './services/api';

interface CustomersProps {
  id: string;
  item: string;
  fornecedor: string;
  quantidade: number;
  precoc: number;
  precov: number;
  created_at: string;
}

export default function App() {
  const [customers, setCustomers] = useState<CustomersProps[]>([]);
  const [item, setItem] = useState<string>('');
  const [fornecedor, setFornecedor] = useState<string>('');
  const [quantidade, setQuantidade] = useState<number | ''>('');
  const [precoc, setPrecoc] = useState<string>('');
  const [precov, setPrecov] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const response = await api.get('/customers'); // Corrigido de /customer para /customers
        setCustomers(response.data);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    }
    fetchCustomers();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!item || !fornecedor || quantidade === '' || !precoc || !precov) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    // Verificar se o item já está cadastrado no estado local
    const itemExists = customers.some(customer => customer.item.toLowerCase() === item.toLowerCase());
    if (itemExists) {
      setErrorMessage('Item Já Cadastrado');
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000); // Remover a mensagem de erro após 3 segundos
      return;
    }

    try {
      // Enviar dados ao backend para criar um novo cliente
      const response = await api.post('/customer', {
        item: item,
        fornecedor: fornecedor,
        quantidade: quantidade,
        precoc: parseFloat(precoc.replace('R$ ', '').replace('.', '').replace(',', '.')),
        precov: parseFloat(precov.replace('R$ ', '').replace('.', '').replace(',', '.')),
      });

      // Limpar campos do formulário
      setItem('');
      setFornecedor('');
      setQuantidade('');
      setPrecoc('');
      setPrecov('');

      // Atualizar o estado de clientes para incluir o novo cliente
      setCustomers(prevCustomers => {
        // Verifica se o novo cliente já foi adicionado ao estado
        const newCustomer = response.data;
        if (prevCustomers.some(customer => customer.id === newCustomer.id)) {
          return prevCustomers;
        }
        return [...prevCustomers, newCustomer];
      });

      // Mensagem de sucesso
      setSuccessMessage('Cadastrado Com Sucesso!');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000); // Remover a mensagem de sucesso após 3 segundos

    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      setErrorMessage('Erro ao cadastrar cliente. Tente novamente.');
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000); // Remover a mensagem de erro após 3 segundos
    }
  }

  function capitalizeWords(value: string): string {
    return value.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function handleItemChange(event: React.ChangeEvent<HTMLInputElement>) {
    const capitalized = capitalizeWords(event.target.value);
    setItem(capitalized);
  }

  function handleFornecedorChange(event: React.ChangeEvent<HTMLInputElement>) {
    const capitalized = capitalizeWords(event.target.value);
    setFornecedor(capitalized);
  }

  function formatCurrency(value: string): string {
    let numericValue = value.replace(/[^\d]/g, '');
    if (numericValue.length > 2) {
      numericValue = numericValue.replace(/(\d)(\d{2})$/, '$1,$2');
    }
    return `R$ ${numericValue}`;
  }

  function handlePriceChange(event: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) {
    const formattedValue = formatCurrency(event.target.value);
    setter(formattedValue);
  }

  function handleBack() {
    navigate('/dashboard');
  }

  return (
    <div className="relative w-full min-h-screen bg-gray-900 flex justify-center px-4">
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-black p-3 rounded shadow-lg font-bold">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="fixed top-4 right-4 bg-red-500 text-black p-3 rounded shadow-lg font-bold">
          {errorMessage}
        </div>
      )}
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 bg-gray-800 text-white p-2 rounded-full shadow-md flex items-center justify-center"
        title="Voltar"
      >
        <FiArrowLeft size={24} />
      </button>
      <main className="my-10 w-full md:max-w-4xl bg-gray-800 rounded-lg p-6">
        <h1 className="text-4xl font-medium text-white">Cadastro De Estoque</h1>
        <form className="flex flex-col my-6" onSubmit={handleSubmit}>
          <label className="font-medium text-white">Item:</label>
          <input
            type="text"
            placeholder="Nome Do Item..."
            className="w-full mb-5 px-2 py-2 rounded bg-gray-700 text-white"
            value={item}
            onChange={handleItemChange}
          />
          <label className="font-medium text-white">Fornecedor:</label>
          <input
            type="text"
            placeholder="Nome Do Fornecedor..."
            className="w-full mb-5 px-2 py-2 rounded bg-gray-700 text-white"
            value={fornecedor}
            onChange={handleFornecedorChange}
          />
          <label className="font-medium text-white">Quantidade:</label>
          <input
            type="number"
            placeholder="Digite a Quantidade..."
            className="w-full mb-5 px-2 py-2 rounded bg-gray-700 text-white"
            value={quantidade === '' ? '' : quantidade} // Verifica se o valor é uma string vazia
            onChange={(e) => setQuantidade(Number(e.target.value))}
          />
          <label className="font-medium text-white">Preço De Compra:</label>
          <input
            type="text"
            placeholder="Valor..."
            className="w-full mb-5 px-2 py-2 rounded bg-gray-700 text-white"
            value={precoc}
            onChange={(e) => handlePriceChange(e, setPrecoc)}
          />
          <label className="font-medium text-white">Preço De Venda:</label>
          <input
            type="text"
            placeholder="Valor..."
            className="w-full mb-5 px-2 py-2 rounded bg-gray-700 text-white"
            value={precov}
            onChange={(e) => handlePriceChange(e, setPrecov)}
          />
          <input
            type="submit"
            value="Cadastrar"
            className="cursor-pointer w-full p-2 mt-4 bg-green-500 rounded font-medium"
          />
        </form>
      </main>
    </div>
  );
}
