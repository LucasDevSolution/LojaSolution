import { FastifyRequest, FastifyReply } from "fastify";
import { CreateCustomerServices } from '../services/CraeteCustomerServices'; // Corrigido o nome

class CreateCustomersControllers {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { item, quantidade, fornecedor, precoc, precov } = request.body as {
      item: string,
      fornecedor: string,
      quantidade: number,
      precoc: number,
      precov: number
    };

    const customerService = new CreateCustomerServices(); // Corrigido o nome
    const customer = await customerService.execute({ item, quantidade, fornecedor, precoc, precov });

    reply.send(customer);
  }
}

export { CreateCustomersControllers };
