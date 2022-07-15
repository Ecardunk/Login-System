// IMPORTS
const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

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

// Public Route
app.get('/', (_req, res) => {
  res.sendFile(__dirname + '/view/index.html');
});

// Private Route
app.get('/user/:id', checkToken, async (req, res) => {
  const id = req.params.id
  const user = await User.findById(id, '-password')
  if(!user) {
    return res.status(404).json({msg:'Acesso restrito!'})
  }
});

// rota privada
app.get('/restrito', checkToken, (_req, res) => {
  res.send({msg: 'você é privilegiado!'});
});

app.post('/login', async (req, res) => {
  //Trocar essa parte depois pela integração com o frontend
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

  try {
    const secret = process.env.SECRET;
    const token = jwt.sign({
      id: user._id,
    }, 
    secret,
    );
    res.sendFile(__dirname + '/view/logado.html');
  } catch {
    res.status(500).json({msg:'Aconteceu algum erro no servidor, tente novamente mais tarde!'});
  }
});

function checkToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];

  if(!token) {
    return res.status(401).json({msg: 'Acesso negado!'})
  }
  
  try {
    const secret = process.env.SECRET;
    jwt.verify(token, secret)
    next()

  } catch(error) {
    res.status(400).json({msg:"Token inválido!"})
  }
}

// Servidor
app.listen(3000, () => {
  console.log('Servidor ON!');
})
