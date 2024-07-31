import prismaClient from "../prisma";

interface DeleteCustomerProps {
  id: string;
}

class DeleteCustomerService { // Corrigido o nome
  async execute({ id }: DeleteCustomerProps) {
    if (!id) {
      throw new Error("Solicitação Inválida!");
    }
    const findCustomer = await prismaClient.customer.findFirst({
      where: { id }
    });

    if (!findCustomer) {
      throw new Error("Cliente Não Existe");
    }
    await prismaClient.customer.delete({
      where: { id: findCustomer.id }
    });
    return { message: "Deletado Com Sucesso!" };
  }
}

export { DeleteCustomerService };
