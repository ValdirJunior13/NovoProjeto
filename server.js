import Fastify from 'fastify'; 
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import rotasBiblioteca from './Routes/biblioteca_online.js';
import rotasUsuarios from './Routes/contasUsuarios.js';

dotenv.config();

const fastify = Fastify({ logger: true });

const PORT = process.env.PORT || 8000;
const banco = process.env.DB_URL;

mongoose.connect(banco)
    .then(() => console.log("Conectado ao MongoDB com sucesso!"))
    .catch((error) => console.log("Erro ao conectar ao MongoDB", error));

const start = async () => {
    try {
        await fastify.register(cors);

        await fastify.register(rotasBiblioteca, {
            prefix: '/biblioteca',
            versao: '0.1',
            manutencao: false
        });

        await fastify.register(rotasUsuarios, {
            prefix:'/contas'
        })

        await fastify.listen({ port: PORT });
        console.log(`Servidor Fastify rodando na porta ${PORT}`);

    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();