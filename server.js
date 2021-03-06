const express = require('express');
const cors = require('cors');
const jwt = require ('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

var messages = [{user: "lu", text: "hello"}, {user: "lu", text: "hi"}];
var users = [{userName: "lu", userPassword: "1"}];

app.get('/messages', (req, res) => {
    res.send(messages);
});

app.get('/messages/:id', (req, res) => {
    res.send(messages[req.params.id]);
});

app.post('/messages', (req, res) => {
    const token = req.header('Authorization');
    const userId = jwt.decode(token, '123');
    const user = users[userId];
    let msg = { user: user.userName, text: req.body.message };
    messages.push(msg);
    res.json(msg);
});

app.post('/register', (req, res) => {
    let registerData = req.body;
    let newIndex = users.push(registerData);
    let userId = newIndex - 1;

    let token = jwt.sign(userId, '123');

    res.json({user: registerData.userName, token});
});

app.post('/login', (req, res) => {
    let loginData = req.body;

    let userId = users.findIndex(user => user.userName == loginData.userName);

    if (userId == -1)
        return res.status(401).send({message: 'User Name or Password is invalid!'})

    if (users[userId].userPassword != loginData.userPassword)
        return res.status(401).send({message: 'User Name or Password is invalid!'})

    let token = jwt.sign(userId, '123');

    res.json({user: users[userId].userName, token});
});

app.listen(port, () => console.log('app running'));