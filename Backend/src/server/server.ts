  import Fastify from 'fastify';
  import { routes } from '../routes/routes';
  import cors from '@fastify/cors';
  import { salesRoutes } from '../routes/salesRoutes';

  const app = Fastify({ logger: true });

  app.setErrorHandler((error, request, reply) => {
    app.log.error(error); // Log do erro
    reply.code(400).send({ message: error.message });
  });

  const start = async () => {
    try {
      await app.register(cors);
      await app.register(routes);
      await app.register(salesRoutes); // Adicione esta linha
      await app.listen({ port: 3333 });
      app.log.info('Server listening on http://localhost:3333');
    } catch (err) {
      app.log.error(err);
      process.exit(1);
    }
  };

  start();
