import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";
import { CreateSaleController } from "../controllers/CreateSaleController";
import { ListSalesController } from "../controllers/ListSalesController";

export async function salesRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.post("/sales", async (request: FastifyRequest, reply: FastifyReply) => {
    return new CreateSaleController().handle(request, reply);
  });

  fastify.get("/sales", async (request: FastifyRequest, reply: FastifyReply) => {
    return new ListSalesController().handle(request, reply);
  });
}
