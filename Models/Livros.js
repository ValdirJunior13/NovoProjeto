import mongoose from 'mongoose';


const livroOnlineSchema = new mongoose.Schema({
    urlImagem: String,
    autor: String,
    ano: Number,
    status: String,
    categoria: String,
    tags: String,
    formato: String,
    digital: Boolean,
    
});

const livroOffSchema = new mongoose.Schema({
    titulo: String,
    autor: String,
    ano: Number,
    status: String,
    categoria: String,
    fisico: Boolean
})
export const LivroFisico = mongoose.model('livro_fisico', livroOffSchema, 'Biblioteca');
export const Livro = mongoose.model('Livro', livroOnlineSchema, 'Biblioteca');
