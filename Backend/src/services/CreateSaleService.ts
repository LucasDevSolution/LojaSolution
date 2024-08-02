import prismaClient from "../prisma";

interface SaleItemProps {
  itemId: string;
  quantidade: number;
  precov: number;
}

interface CreateSaleProps {
  customerId: string;
  items: SaleItemProps[];
  metodoPagamento: string;
}

class CreateSaleService {
  async execute({ customerId, items, metodoPagamento }: CreateSaleProps) {
    if (!customerId || items.length === 0 || !metodoPagamento) {
      throw new Error("Preencha todos os campos");
    }
    
    const totalQuantidade = items.reduce((sum, item) => sum + item.quantidade, 0);
    const totalPrecov = items.reduce((sum, item) => sum + item.precov * item.quantidade, 0);
    const precot = totalPrecov; // Aqui assumo que o precot é o totalPrecov

    const sale = await prismaClient.sale.create({
      data: {
        customerId,
        totalQuantity: totalQuantidade,
        totalPrecov,
        precot,
        metodoPagamento,
        items: {
          create: items.map(item => ({
            itemId: item.itemId,
            quantidade: item.quantidade,
            precov: item.precov,
          })),
        },
      },
      include: {
        items: true,
      },
    });
    
    return sale;
  }
}

export { CreateSaleService };
