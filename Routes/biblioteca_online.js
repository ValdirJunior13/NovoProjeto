import fastify from 'fastify';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import { Livro, LivroFisico } from '../Models/Livros.js';
const schemaPostOnline = {
    body: {
        type: 'object', 
        required: ['autor', 'ano', 'categoria', 'digital'],
        properties: {
            urlImagem: {type: 'string', format: 'uri'}, 
            autor: {type: 'string', minLength: 2},
            ano: {type: 'integer', minimum: 0, maximum: 2026},
            status: {type: 'string'},
            categoria: {type: 'string'},
            tags: {type: 'string'},
            formato: {type: 'string'},
            digital: {type: 'boolean'}
        }
    }
}
const schemaPostFisico = {
    body: {
        required: ['titulo', 'autor', 'status', 'fisico'],
        properties: {
      titulo:    { type: 'string', minLength: 1 },
      autor:     { type: 'string' },
      ano:       { type: 'integer' },
      status:    { type: 'string' },
      categoria: { type: 'string' },
      fisico:    { type: 'boolean' }
        }
    }
};

async function verificarAdmin(request, reply) {
    try {
        const authHeader = request.headers['authorization'];
        if (!authHeader) {
            return reply.status(401).send({ erro: "Acesso negado. Token não fornecido." });
        }

        const token = authHeader.replace("Bearer ", "");
        const usuarioLogado = jwt.verify(token, process.env.JWT_SECRET);

        if (usuarioLogado.tipo !== 'admin') {
            return reply.status(403).send({ erro: "Acesso negado. Apenas admins." });
        }

        request.usuario = usuarioLogado; 

    } catch (error) {
        return reply.status(401).send({ erro: "Token inválido ou expirado." });
    }
}

export default async function rotasBiblioteca(fastify, options){
    fastify.get("/livros", async(request, reply) => {
        try {
            const {categoria, digital, autor} = request.query;
            let filtro = {};
            if(categoria) filtro.categoria = categoria;
            if(autor) filtro.autor = new RegExp(autor, 'i');
            if(digital != undefined) filtro.digital = digital === 'true';

            const livros = await Livro.find(filtro);
            return livros;
        } catch(error) {
            return reply.status(500).send({ erro: `Erro no catch: ${error.message}` });
        }
    });
    fastify.post("/livros", { preHandler: verificarAdmin }, async (request, reply) => {
        try {
            const dadosLivro = request.body;
            const novoLivro = await Livro.create(dadosLivro);

            return reply.status(201).send(novoLivro);
        } catch(error) {
            return reply.status(500).send({ erro: "Erro ao criar dados no banco" });
        }
    });

    fastify.put("/livros/:id", { preHandler: verificarAdmin }, async(request, reply) => {
        try {

            const id = request.params.id;

            const dadosNovos = request.body;

            const livroAtualizado = await Livro.findByIdAndUpdate(id, dadosNovos, {new: true});

            if(!livroAtualizado){
                return reply.status(404).send({
                    erro: "Livro não encontrado para atualizar"
                });
            }

            return reply.status(200).send(livroAtualizado);
            
        } catch (error) {
            return reply.status(500).send({ erro: "Erro interno no servidor ao atualizar" });
        }
    });

    fastify.delete("/livros/:id", { preHandler: verificarAdmin }, async (request, reply) => {
        try{
           

            const id = request.params.id;
            const livroDeletado = await Livro.findByIdAndDelete(id);

         if (!livroDeletado) {
            return reply.status(404).send({ erro: "Livro não encontrado para exclusão." });
            }

        return reply.status(200).send({ mensagem: "Livro deletado com sucesso!", livro: livroDeletado });
        }catch(error){
             return reply.status(500).send({ erro: "Erro interno no servidor ao atualizar" });
        }
    });

    
    fastify.get('/livrosfisicos', async (request, reply) => {
        try{
            const pegarDados = await LivroFisico.find();
            return pegarDados;
        }catch(error){
            return reply.status(500).send({message: "Erro no catch" });
        }
    });

    fastify.post('/livrosfisicos', {schema: schemaPostFisico, preHandler: verificarAdmin }, async(request, reply) => {
        try{

        const postarDados = request.body;
        const novoCadastro = await LivroFisico.create(postarDados);

        return reply.status(201).send({
            message: "Deu tudo certo!",
            novoCadastro: novoCadastro
        });
        }catch(error){
            return reply.status(500).send({
            message: "Erro no catch"
        }); 
       }
    });

    fastify.put('/livrosfisicos/:id', { preHandler: verificarAdmin }, async(request, reply) => {
       try{

        const id = request.params.id;
        const dados = request.body;
        const mudarDados = await LivroFisico.findByIdAndUpdate(id, dados, {new: true});
        if(!mudarDados) return reply.status(404).send({ erro: "Livro físico não encontrado." });
        
        return reply.status(200).send(mudarDados);

       }catch(error){
            return reply.status(500).send({
            message: "Erro no catch"
        }); 
       }
    });

    fastify.delete('/livrosfisicos/:id', { preHandler: verificarAdmin }, async(request, reply)=>{
        try{    
            const id = request.params.id;

            const deletarDados = await LivroFisico.findByIdAndDelete(id);
            if(!deletarDados) return reply.status(404).send({ erro: "Livro físico não encontrado." });

            return reply.status(200).send(deletarDados);

        }catch(error){
            return reply.status(500).send({
            message: "Erro no catch"
        }); 
       }
    });

};


    