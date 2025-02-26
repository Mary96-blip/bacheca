const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const messagesFile = 'messages.json';
let messages = fs.existsSync(messagesFile) ? JSON.parse(fs.readFileSync(messagesFile)) : [];

app.get('/messages', (req, res) => {
    res.json(messages);
});

app.post('/messages', (req, res) => {
    const message = req.body.text;
    if (!message.trim()) return res.status(400).send('Messaggio vuoto');

    messages.push(message);
    fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));

    res.json({ success: true });
});

app.listen(3000, () => console.log('Server in ascolto su http://localhost:3000'));