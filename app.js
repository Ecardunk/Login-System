// IMPORTS
const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const JWT_SECRET = process.env.jwt;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get('/restrito', (req, res) => {
  const { token } = req.cookies;
  const verify = jwt.verify(token, JWT_SECRET);
  if (verify === 'user') {
    res.sendFile(__dirname + '/view/logado.html');
  } else {
    res.redirect('/');
  }
});

app.post('/login', async (req, res) => {
  const htmlEmail = req.body.email;
  const htmlPassword = req.body.password;

  const user = await User.findOne({ email: htmlEmail });
  if (!user) {
    return res.status(404).json({msg: 'Usuário não encontrado!'});
  }

  const checkPassword = await bcrypt.compare(htmlPassword, user.password);
  if (!checkPassword) {
    return res.status(422).json({msg: 'Senha incorreta!'});
  }

  res.cookie('token', jwt.sign( {id: user._id, username:user.email, type: 'user'}, JWT_SECRET, { expiresIn: '1h'} ), { maxAge: 1 * 60 * 60 * 1000, httpOnly: true } );
  return res.send({msg: 'Logado com sucesso!'});
});

// Servidor
app.listen(3000, () => {
  console.log('Servidor ON!');
})
