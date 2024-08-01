import prismaClient from "../prisma";

interface CreateSaleProps {
  itemId: string;
  item: string;
  quantidade: number;
  preco: number;
  metodoPagamento: string;
}

class CreateSaleService {
  async execute({ itemId, item, quantidade, preco, metodoPagamento }: CreateSaleProps) {
    if (!itemId || !item || !quantidade || !preco || !metodoPagamento) {
      throw new Error("Preencha todos os campos");
    }
    
    const sale = await prismaClient.sale.create({
      data: {
        itemId,
        item,
        quantidade,
        preco,
        metodoPagamento
      }
    });
    
    return sale;
  }
}

export { CreateSaleService };
