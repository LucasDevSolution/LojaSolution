import { FastifyRequest, FastifyReply } from "fastify";
import { ListSalesService } from "../services/ListSalesService";

class ListSalesController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const listSalesService = new ListSalesService();
    try {
      const sales = await listSalesService.execute();
      reply.send(sales);
    } catch (error) {
      reply.status(500).send({ error: 'Erro ao listar vendas.' });
    }
  }
}

export { ListSalesController };
