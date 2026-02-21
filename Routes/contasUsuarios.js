import bcrypt from 'bcrypt';
import {Usuario} from '../Models/Usuarios.js'
import jwt from 'jsonwebtoken';

export default async function rotasUsuarios(fastify, options){
    fastify.get('/user', async (request, reply)=>{
        try{
            const pegarUsuario = await Usuario.find();
        return reply.status(200).send({
            message: "Deu tudo certo!",
            dados: pegarUsuario
        })
        }catch(error){
            return reply.status(500).send({
                message: `Erro no catch ${error.message}`
            })
        }
    });

    fastify.post('/user', async (request, reply) => {
        try{
            const req = request.body;
            
            const salt = await bcrypt.genSalt(10);
            const senhaCriptografada = await bcrypt.hash(req.senha, salt);

            req.senha = senhaCriptografada;

            const criarUser = await Usuario.create(req);

            return reply.status(201).send({
                message: "Deu tudo certo!",
                criarUsuario: criarUser
            })
        }catch(error){
             return reply.status(500).send({
                message: `Erro no catch ${error.message}`
            })
        }
    });

    fastify.put('/user/:id', async (request, reply) => {
       try{
        const id = request.params.id;
        const body = request.body;

        const mudarDados = await Usuario.findByIdAndUpdate(id, body, {new: true});
        if(!mudarDados){
            return reply.status(404).send({
                message: "Erro 404"
            })
        }

        return reply.status(200).send({
            message: "Deu certo no put!",
            atualizarDados: mudarDados
        });

       }catch(error){
             return reply.status(500).send({
                message: `Erro no catch ${error.message}`
            });
        };

    } );

    fastify.delete('/user/:id', async(request, reply) => {
       try{
        const id = request.params.id;
        const deletarUser = await Usuario.findByIdAndDelete(id);
        if(!deletarUser){
            return reply.status(404).send({
                message: "Erro 404"
            });
        }
        return reply.status(200).send({
            message: "Usuario deletado com sucesso!",
            usuarioDeletado: deletarUser
        })
       }catch(error){
             return reply.status(500).send({
                message: `Erro no catch ${error.message}`
            });
        };
    });

    fastify.post('/login', async(req, reply) => {
        try{
            const {email, senha} = req.body;
            const encontrarUsuario = await Usuario.findOne({email: email});
            if(!encontrarUsuario){
                return reply.status(404).send({erro: "Erro 404 ao tentar encontrar o usuario"});
            }


            const compararSenha = await bcrypt.compare(senha, encontrarUsuario.senha);
            if(!compararSenha){
                return reply.status(401).send({erro: "senha Incorreta"});
            }

            const token = jwt.sign(
                {idUsuario: usuarioEncontrado._id},
                process.env.JWT_SECRET, 
                {expiresIn: '7d'}
            );

            return reply.status(200).send({
                message: "Tudo certo com o login", 
                token: token
            })

        }catch(error){
            return reply.status(500).send({
                message: "Erro no catch do /login"
            });
        }
    });

    fastify.get('/user/livros', async(request, reply) => {
        const authHeader = request.headers['authorization'];
        if (!authHeader) {
                return reply.status(401).send({ erro: "Acesso negado. Token não fornecido." });
            }
        const token = authHeader.replace("Bearer", "");
        
        const usuarioLogado = jwt.verify(token, process.env.JWT_SECRET);

        const dadosUsuario = await Usuario.findById(usuarioLogado.idUsuario);

        if (!dadosUsuario) {
                return reply.status(404).send({ erro: "Usuário não encontrado no banco." });
            }
        const acharLivros = await Livro.find();

        return reply.status(200).send({
            message: "Deu tudo certo",
            acharLivros: acharLivros
        })
    });
}