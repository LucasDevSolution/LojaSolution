import { FastifyRequest, FastifyReply } from "fastify";
import { ListCustomerServices } from "../services/ListCustumerServices"; // Corrigido o nome

class ListCustomerControllers {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const listCustomerServices = new ListCustomerServices(); // Corrigido o nome

    const customers = await listCustomerServices.execute();

    reply.send(customers);
  }
}

export { ListCustomerControllers };
