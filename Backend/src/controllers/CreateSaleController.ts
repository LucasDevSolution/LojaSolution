import { FastifyRequest, FastifyReply } from "fastify";
import { CreateSaleService } from '../services/CreateSaleService';

class CreateSaleController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { itemId, item, quantidade, precoc, precov, metodoPagamento } = request.body as {
      itemId: string;
      item: string;
      quantidade: number;
      precoc: number;
      precov: number;
      metodoPagamento: string;
    };

    const createSaleService = new CreateSaleService();
    try {
      const precot = quantidade * precov;
      const sale = await createSaleService.execute({ itemId, item, quantidade, precoc, precov, precot, metodoPagamento });
      reply.send(sale);
    } catch (error) {
      reply.status(500).send({ error: 'Erro ao criar venda.' });
    }
  }
}

export { CreateSaleController };
