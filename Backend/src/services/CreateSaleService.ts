import prismaClient from "../prisma";

interface CreateSaleProps {
  itemId: string;
  item: string;
  quantidade: number;
  precoc: number;
  precov: number;
  precot: number;
  metodoPagamento: string;
}

class CreateSaleService {
  async execute({ itemId, item, quantidade, precoc, precov, precot, metodoPagamento }: CreateSaleProps) {
    if (!itemId || !item || !quantidade || !precoc || !precov || !precot || !metodoPagamento) {
      throw new Error("Preencha todos os campos");
    }
    
    const sale = await prismaClient.sale.create({
      data: {
        itemId,
        item,
        quantidade,
        precoc,
        precov,
        precot,
        metodoPagamento
      }
    });
    
    return sale;
  }
}

export { CreateSaleService };
