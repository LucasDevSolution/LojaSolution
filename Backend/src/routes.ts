import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";
import { CreateCustomersControllers } from "./controllers/CreateCustomersControllers";
import { ListCustomerControllers } from './controllers/ListCostumerControllers';
import { DeleteCustomersControllers } from './controllers/DeleteCustumersControllers';
import { UpdateCustomersControllers } from './controllers/UpdateCustomersControllers';

export async function routes(fastify: FastifyInstance, option: FastifyPluginOptions) {
    fastify.get("/teste", async (request: FastifyRequest, reply: FastifyReply) => {
        return { ok: true };
    });

    fastify.post("/customer", async (request: FastifyRequest, reply: FastifyReply) => {
        return new CreateCustomersControllers().handle(request, reply);
    });
    fastify.get("/customers", async (request: FastifyRequest, reply: FastifyReply) => {
        return new ListCustomerControllers().handle(request, reply);
    });
    fastify.delete("/customer", async (request: FastifyRequest, reply: FastifyReply) => {
        return new DeleteCustomersControllers().handle(request, reply);
    });
    // Atualizar cliente
    fastify.put("/customers/:id", async (request: FastifyRequest, reply: FastifyReply) => {
        return new UpdateCustomersControllers().handle(request, reply);
    });
}
