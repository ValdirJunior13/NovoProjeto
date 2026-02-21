import mongoose from 'mongoose'

const BancoUsuario = new mongoose.Schema({
    email: String,
    senha: String,
    foto: String,
    telefone: Number,
    id: String
});

export const Usuario = mongoose.model('credenciais', BancoUsuario, 'Usuarios');