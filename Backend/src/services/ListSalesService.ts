import prismaClient from "../prisma";

class ListSalesService {
  async execute() {
    return await prismaClient.sale.findMany();
  }
}

export { ListSalesService };
