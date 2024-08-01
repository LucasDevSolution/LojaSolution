import { FastifyRequest, FastifyReply } from "fastify";
import { CreateSaleService } from '../services/CreateSaleService';

class CreateSaleController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { itemId, item, quantidade, preco, metodoPagamento } = request.body as {
      itemId: string;
      item: string;
      quantidade: number;
      preco: number;
      metodoPagamento: string;
    };

    const createSaleService = new CreateSaleService();
    try {
      const sale = await createSaleService.execute({ itemId, item, quantidade, preco, metodoPagamento });
      reply.send(sale);
    } catch (error) {
      reply.status(500).send({ error: 'Erro ao criar venda.' });
    }
  }
}

export { CreateSaleController };
