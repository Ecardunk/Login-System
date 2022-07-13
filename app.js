// IMPORTS
const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//


//Banco de Dados - Provisório para testes
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD
mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.7la1x.mongodb.net/?retryWrites=true&w=majority`).then(() => {
    console.log("MongoDB Conetado com sucesso!")
}).catch((err) => {
    console.log("Houve um erro: " + err)
});
//

const app = express();

app.get('/', (_req, res) => {
  res.sendFile(__dirname + '/view/index.html');
});

// Servidor
app.listen(3000, () => {
    console.log('Servidor ON!');
})
