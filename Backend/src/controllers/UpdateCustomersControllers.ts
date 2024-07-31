import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma'; 

export class UpdateCustomersControllers {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const { item, fornecedor, quantidade, precoc, precov } = request.body as {
      item: string;
      fornecedor: string;
      quantidade: number; // Corrigido para número
      precoc: number; // Corrigido para número
      precov: number; // Corrigido para número
    };

    try {
      const updatedCustomer = await prisma.customer.update({
        where: { id },
        data: {
          item,
          fornecedor,
          quantidade,
          precoc,
          precov,
          updated_at: new Date(), // Atualizar timestamp
        }
      });

      // Verificar se a quantidade é zero e excluir o item se for
      if (quantidade === 0) {
        await prisma.customer.delete({
          where: { id }
        });
        return reply.status(200).send({ message: "Item excluído devido à quantidade ser zero." });
      }

      return reply.status(200).send(updatedCustomer);
    } catch (error) {
      console.error('Error updating customer:', error);
      return reply.status(500).send({ error: 'Erro ao atualizar item.' });
    }
  }
}
