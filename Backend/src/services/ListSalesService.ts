import prismaClient from "../prisma";

class ListSalesService {
  async execute() {
    return await prismaClient.sale.findMany({
      include: {
        items: true,
        customer: true,
      },
    });
  }
}

export { ListSalesService };
