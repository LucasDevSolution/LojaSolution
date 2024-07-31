import prismaClient from "../prisma";

interface CreateCustomerProps {
  item: string;
  quantidade: number;
  fornecedor: string;
  precoc: number;
  precov: number;
}

class CreateCustomerServices { // Corrigido o nome
  async execute({ item, quantidade, fornecedor, precoc, precov }: CreateCustomerProps) {
    if (!item || !quantidade || !fornecedor || !precoc || !precov) {
      throw new Error("Preencha Todos os Campos");
    }
    const customer = await prismaClient.customer.create({
      data: { item, fornecedor, quantidade, precoc, precov }
    });
    return customer;
  }
}

export { CreateCustomerServices };
