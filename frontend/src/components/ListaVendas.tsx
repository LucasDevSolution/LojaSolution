import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import qrCodeImage from '../image/My_PDF.png'; // Certifique-se de que o caminho para o QR code está correto

interface Venda {
  id: string;
  itemId: string;
  item: string;
  quantidade: number;
  precov: number;
  metodoPagamento: string;
  created_at: string;
}

const VisualizarVendas: React.FC = () => {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showReciboModal, setShowReciboModal] = useState<boolean>(false);
  const [selectedVenda, setSelectedVenda] = useState<Venda | null>(null);
  const navigate = useNavigate();

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
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const gerarReciboPDF = (venda: Venda) => {
    const doc = new jsPDF({
      unit: 'mm',
      format: [55, 200]
    });

    const currentDate = moment().format('DD/MM/YYYY');
    const currentTime = moment().format('HH:mm:ss');

    doc.setFontSize(8); // Definindo um tamanho de fonte menor
    doc.text('SOLUTION LEVANDO SOLUÇAO', 3, 10);
    doc.text('Av. Niemeyer Qd. 157 Lt 24 74943-700', 3, 15);
    doc.text('Aparecida De Goiânia,Garavelo - GO', 3, 20);
    doc.text('CNPJ: 46.293.911/0001-55', 3, 25);
    doc.text('(62) 3222-6069 (62) 98529-6795', 3, 30);
    doc.text('slevandosolucao@gmail.com', 3, 35);
    doc.text('@solutionprestadoradeservico', 3, 40);

    doc.text(`${currentDate} ${currentTime}`, 3, 44);
    doc.text('-----------------------------------------------------------', 0, 46);
    doc.text('  COMPROVANTE DE PAGAMENTO', 3, 49);
    doc.text('-----------------------------------------------------------', 0, 51);

    doc.text(
      `1 ${venda.item}${venda.quantidade}UN${formatCurrency(venda.precov)}${formatCurrency(venda.precov * venda.quantidade)}`,
      0, 56
    );
    doc.text('-----------------------------------------------------------', 0, 100);
    doc.text(`Método de Pagamento: ${venda.metodoPagamento}`, 0, 93);
    doc.text(`Total Pago: ${formatCurrency(venda.precov * venda.quantidade)}`, 0, 98);


    doc.addImage(qrCodeImage, 'PNG', 13, 165, 30, 30);

    doc.save('recibo.pdf');

    setShowReciboModal(false);
  };

  const handleReciboClick = (venda: Venda) => {
    setSelectedVenda(venda);
    setShowReciboModal(true);
  };

  const confirmRecibo = () => {
    if (selectedVenda) {
      gerarReciboPDF(selectedVenda);
    }
    setShowReciboModal(false);
  };

  return (
    <div className="relative w-full min-h-screen bg-gray-900 p-6">
      {errorMessage && (
        <div className="fixed top-4 right-4 bg-red-500 text-black p-3 rounded shadow-lg font-bold">
          {errorMessage}
        </div>
      )}
      {showReciboModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-medium mb-4">Recibo</h2>
            <button
              onClick={confirmRecibo}
              className="w-full p-2 mb-5 bg-green-500 rounded font-medium"
            >
              Baixar Recibo
            </button>
            <button
              onClick={() => setShowReciboModal(false)}
              className="w-full p-2 bg-gray-500 rounded font-medium"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
      <button
        onClick={handleBack}
        className="absolute top-1 left-4 bg-gray-800 text-white p-0 rounded-full shadow-md flex items-center justify-center"
        title="Voltar"
      >
        <FiArrowLeft size={24} />
      </button>
      <h1 className="text-4xl font-medium text-white mb-3">Vendas</h1>
      <div className="overflow-x-auto">
        <table className="w-full bg-gray-800 text-white border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b border-gray-600 text-left">Item</th>
              <th className="px-4 py-2 border-b border-gray-600 text-left">Quantidade</th>
              <th className="px-4 py-2 border-b border-gray-600 text-left">Preço</th>
              <th className="px-4 py-2 border-b border-gray-600 text-left">Método de Pagamento</th>
              <th className="px-4 py-2 border-b border-gray-600 text-left">Data da Venda</th>
              <th className="px-4 py-2 border-b border-gray-600 text-left">Recibo</th>
            </tr>
          </thead>
          <tbody>
            {vendas.length > 0 ? (
              vendas.map(venda => {
                const quantidade = Number(venda.quantidade);
                const precov = Number(venda.precov);
                const precoTotal = quantidade * precov;

                return (
                  <tr key={venda.id}>
                    <td className="px-4 py-2 border-b border-gray-700">{venda.item}</td>
                    <td className="px-4 py-2 border-b border-gray-700">{quantidade}</td>
                    <td className="px-4 py-2 border-b border-gray-700">
                      {Number.isNaN(precoTotal) ? 'R$ 0,00' : formatCurrency(precoTotal)}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-700">{venda.metodoPagamento}</td>
                    <td className="px-4 py-2 border-b border-gray-700">
                      {new Date(venda.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-700">
                      <button
                        onClick={() => handleReciboClick(venda)}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Recibo
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-2 text-center border-b border-gray-700">
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
