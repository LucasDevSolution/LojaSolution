import { FastifyRequest, FastifyReply } from "fastify";
import { CreateSaleService } from '../services/CreateSaleService';

class CreateSaleController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { customerId, items, metodoPagamento } = request.body as {
      customerId: string;
      items: { itemId: string, quantidade: number, precov: number }[];
      metodoPagamento: string;
    };

    const createSaleService = new CreateSaleService();
    try {
      const sale = await createSaleService.execute({ customerId, items, metodoPagamento });
      reply.send(sale);
    } catch (error) {
      reply.status(500).send({ error: 'Erro ao criar venda.' });
    }
  }
}

export { CreateSaleController };
