import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiTrash2 } from 'react-icons/fi'; // Importa o ícone de lixeira
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';

interface Customer {
  id: string;
  item: string;
  fornecedor: string;
  quantidade: number;
  precoc: number;
  precov: number;
}

interface VendaItem {
  id: string;
  item: string;
  quantidade: number;
  preco: number;
}

const VenderEstoque: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [venderQuantidade, setVenderQuantidade] = useState<number>(0);
  const [vendaItems, setVendaItems] = useState<VendaItem[]>([]);
  const [totalPagar, setTotalPagar] = useState<number>(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:3333/customers');
        setCustomers(response.data);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const total = vendaItems.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
    setTotalPagar(total);
  }, [vendaItems]);

  const handleAddItem = () => {
    if (selectedCustomer && venderQuantidade > 0) {
      const customer = customers.find(c => c.id === selectedCustomer.value);
      if (customer && venderQuantidade <= customer.quantidade) {
        setVendaItems(prevItems => [
          ...prevItems,
          { id: customer.id, item: customer.item, quantidade: venderQuantidade, preco: customer.precov }
        ]);
        setSelectedCustomer(null);
        setVenderQuantidade(0);
      } else {
        setErrorMessage('Quantidade inválida para venda.');
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      }
    } else {
      setErrorMessage('Selecione um item.');
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  const handleVenda = async () => {
    if (vendaItems.length === 0) {
      setErrorMessage('Nenhum item adicionado à lista.');
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
      return;
    }

    try {
      for (const vendaItem of vendaItems) {
        const customer = customers.find(c => c.id === vendaItem.id);
        if (customer) {
          const updatedQuantidade = customer.quantidade - vendaItem.quantidade;
          await axios.put(`http://localhost:3333/customers/${customer.id}`, {
            ...customer,
            quantidade: updatedQuantidade,
          });

          setCustomers(customers.map(c =>
            c.id === customer.id ? { ...c, quantidade: updatedQuantidade } : c
          ));
        }
      }

      setSuccessMessage('Venda realizada com sucesso!');
      setVendaItems([]);
      setTotalPagar(0);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Erro ao vender item:', error);
      setErrorMessage('Erro ao vender item.');
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleClearItems = () => {
    setVendaItems([]);
    setTotalPagar(0);
  };

  const formatOptions = (customers: Customer[]) => {
    return customers.map(customer => ({
      value: customer.id,
      label: `${customer.item} - ${customer.fornecedor} (Em estoque: ${customer.quantidade})`,
    }));
  };

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: '#374151',
      borderColor: '#4B5563',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#9CA3AF',
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: '#374151',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#1F2937' : '#374151',
      color: state.isSelected ? '#D1D5DB' : '#E5E7EB',
      '&:hover': {
        backgroundColor: '#1F2937',
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#E5E7EB',
    }),
    input: (provided: any) => ({
      ...provided,
      color: '#E5E7EB',
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#E5E7EB',
    }),
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

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
      <main className="my-10 w-full md:max-w-2xl">
        <h1 className="text-4xl font-medium text-white">Vender Estoque</h1>
        <div className="flex flex-col my-6">
          <label className="font-medium text-white">Selecione o item:</label>
          <Select
            id="customer"
            value={selectedCustomer}
            onChange={setSelectedCustomer}
            options={formatOptions(customers)}
            placeholder="Selecione um item"
            styles={customStyles}
          />
          <label className="font-medium text-white" htmlFor="venderQuantidade">Quantidade a vender:</label>
          <input
            type="number"
            id="venderQuantidade"
            value={venderQuantidade}
            onChange={e => setVenderQuantidade(parseInt(e.target.value))}
            min="1"
            className="w-full mb-5 px-2 py-2 rounded bg-gray-700 text-white"
          />
          <button
            onClick={handleAddItem}
            className="w-full p-2 mb-5 bg-green-500 rounded font-medium"
          >
            Adicionar Item
          </button>
          <div className="mb-5">
            <h2 className="text-2xl font-medium text-white">Itens a vender</h2>
            {vendaItems.length > 0 ? (
              <div>
                <ul className="list-disc list-inside text-white">
                  {vendaItems.map((item, index) => (
                    <li key={index}>
                      {item.item} - Quantidade: {item.quantidade} - Preço: {formatCurrency(item.preco * item.quantidade)}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleClearItems}
                  className="mt-2 text-red-500 flex items-center"
                >
                  <FiTrash2 size={18} className="mr-2" />
                  
                </button>
              </div>
            ) : (
              <p className="text-white">Nenhum item adicionado.</p>
            )}
          </div>
          <div className="text-white text-2xl p-2  font-bold">
            <p>Total a Pagar: {formatCurrency(totalPagar)}</p>
          </div>
          <button
            onClick={handleVenda}
            className="w-full p-2 mb-5 bg-green-500 rounded font-medium"
          >
            Finalizar Venda
          </button>
        </div>
      </main>
    </div>
  );
};

export default VenderEstoque;
