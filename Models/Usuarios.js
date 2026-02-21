import mongoose from 'mongoose'

const BancoUsuario = new mongoose.Schema({
    email: String,
    senha: String,
    foto: String,
    telefone: Number,
    id: String,
    livros_salvos: [{type: String}],
    tipo: { type: String, default: 'user' }
});

export const Usuario = mongoose.model('credenciais', BancoUsuario, 'Usuarios');