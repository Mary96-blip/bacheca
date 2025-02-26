const fs = require('fs'); // Importa il modulo per leggere e scrivere file
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); // Permette di leggere il corpo delle richieste in formato JSON
app.use(express.static('public')); // Serve la cartella 'public' per il sito

// Percorso per ottenere i messaggi
app.get('/messages', (req, res) => {
    fs.readFile('messages.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Errore nella lettura dei messaggi');
        }
        res.send(JSON.parse(data)); // Invia i messaggi in formato JSON
    });
});

// Percorso per aggiungere un messaggio
app.post('/messages', (req, res) => {
    const newMessage = req.body.message;

    fs.readFile('messages.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Errore nella lettura dei messaggi');
        }

        const messages = JSON.parse(data);
        messages.push(newMessage);

        fs.writeFile('messages.json', JSON.stringify(messages, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Errore nel salvataggio del messaggio');
            }
            res.status(200).send('Messaggio aggiunto con successo');
        });
    });
});

// Avvia il server
app.listen(port, () => {
    console.log(`Server in ascolto su http://localhost:${port}`);
});

