// IMPORTS
const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
//

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Banco de Dados - Provisório para testes
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD
mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.7la1x.mongodb.net/?retryWrites=true&w=majority`).then(() => {
    console.log("MongoDB Conectado com sucesso!")
}).catch((err) => {
    console.log("Houve um erro: " + err)
});
//

// Public Route
app.get('/', (_req, res) => {
  res.sendFile(__dirname + '/view/index.html');
});

app.post('/login', async(req, res) => {
  const htmlEmail = req.body.email;
  const htmlPassword = req.body.password;
  const user = new User({
    email: htmlEmail,
    password: htmlPassword,
  });

  await user.save();
});

// Servidor
app.listen(3000, () => {
    console.log('Servidor ON!');
})
