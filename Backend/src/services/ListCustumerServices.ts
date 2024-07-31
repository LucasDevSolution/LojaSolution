import prismaClient from "../prisma";

class ListCustomerServices { // Corrigido o nome
  async execute() {
    const customers = await prismaClient.customer.findMany();
    return customers;
  }
}

export { ListCustomerServices };
