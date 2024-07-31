// CadastrarEstoqueModal.tsx
import React, { useState, useRef, FormEvent, useEffect } from 'react';
import { Modal, Box, IconButton, TextField, Button, Snackbar, Alert } from '@mui/material';
import { api } from '../services/api';
import { FiTrash } from 'react-icons/fi';

interface CustomersProps {
  id: string;
  item: string;
  fornecedor: string;
  quantidade: string;
  precoc: string;
  precov: string;
  created_at: string;
}

interface CadastrarEstoqueModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export default function CadastrarEstoqueModal({ open, onClose, onSuccess }: CadastrarEstoqueModalProps) {
  const [customers, setCustomers] = useState<CustomersProps[]>([]);
  const [item, setItem] = useState<string>('');
  const [fornecedor, setFornecedor] = useState<string>('');
  const [precoc, setPrecoc] = useState<string>('');
  const [precov, setPrecov] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fornecedorRef = useRef<HTMLInputElement | null>(null);
  const quantidadeRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    const response = await api.get('/customers');
    setCustomers(response.data);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!item || !fornecedor || !quantidadeRef.current?.value || !precoc || !precov) {
      setErrorMessage('Por favor, preencha todos os campos.');
      return;
    }

    const itemExists = customers.some(customer => customer.item.toLowerCase() === item.toLowerCase());

    if (itemExists) {
      setErrorMessage('Item já está cadastrado.');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    try {
      const response = await api.post('/customer', {
        item: item,
        fornecedor: fornecedor,
        quantidade: quantidadeRef.current.value,
        precoc: precoc.replace('R$ ', '').replace('.', '').replace(',', '.'),
        precov: precov.replace('R$ ', '').replace('.', '').replace(',', '.'),
      });

      setCustomers((allCustomers) => [...allCustomers, response.data]);

      // Clear form fields
      setItem('');
      setFornecedor('');
      if (quantidadeRef.current) quantidadeRef.current.value = '';
      setPrecoc('');
      setPrecov('');

      // Show success message
      setSuccessMessage('Cadastro realizado com sucesso!');
      setTimeout(() => setSuccessMessage(null), 3000);
      onSuccess('Cadastro realizado com sucesso!');
    } catch (error) {
      console.error('Error registering customer:', error);
    }
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

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="p-4 w-full max-w-lg mx-auto mt-10 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Cadastrar Estoque</h2>

        <form className="flex flex-col my-6" onSubmit={handleSubmit}>
          <TextField
            label="Item"
            variant="outlined"
            margin="normal"
            fullWidth
            value={item}
            onChange={(e) => setItem(e.target.value)}
          />
          <TextField
            label="Fornecedor"
            variant="outlined"
            margin="normal"
            fullWidth
            value={fornecedor}
            onChange={(e) => setFornecedor(e.target.value)}
            inputRef={fornecedorRef}
          />
          <TextField
            label="Quantidade"
            variant="outlined"
            margin="normal"
            type="number"
            fullWidth
            inputRef={quantidadeRef}
          />
          <TextField
            label="Preço de Compra"
            variant="outlined"
            margin="normal"
            fullWidth
            value={precoc}
            onChange={(e) => handlePriceChange(e, setPrecoc)}
          />
          <TextField
            label="Preço de Venda"
            variant="outlined"
            margin="normal"
            fullWidth
            value={precov}
            onChange={(e) => handlePriceChange(e, setPrecov)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="mt-4"
          >
            Cadastrar
          </Button>
        </form>

        {successMessage && (
          <Snackbar
            open={!!successMessage}
            autoHideDuration={3000}
            onClose={() => setSuccessMessage(null)}
          >
            <Alert onClose={() => setSuccessMessage(null)} severity="success">
              {successMessage}
            </Alert>
          </Snackbar>
        )}

        {errorMessage && (
          <Snackbar
            open={!!errorMessage}
            autoHideDuration={3000}
            onClose={() => setErrorMessage(null)}
          >
            <Alert onClose={() => setErrorMessage(null)} severity="error">
              {errorMessage}
            </Alert>
          </Snackbar>
        )}
      </Box>
    </Modal>
  );
}
