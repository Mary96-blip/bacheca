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
    const username = req.body.username; // Aggiungi il nome dell'utente

    fs.readFile('messages.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Errore nella lettura dei messaggi');
        }

        const messages = JSON.parse(data);
        const messageId = new Date().getTime(); // Usa timestamp come ID univoco
        messages.push({ id: messageId, username, text: newMessage });

        fs.writeFile('messages.json', JSON.stringify(messages, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Errore nel salvataggio del messaggio');
            }
            res.status(200).send('Messaggio aggiunto con successo');
        });
    });
});

// Percorso per cancellare un messaggio
app.delete('/messages/:id', (req, res) => {
    const messageId = parseInt(req.params.id); // Ottieni l'ID del messaggio da cancellare
    const username = req.body.username; // L'utente deve inviare il proprio nome

    fs.readFile('messages.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Errore nella lettura dei messaggi');
        }

        let messages = JSON.parse(data);
        const messageIndex = messages.findIndex(msg => msg.id === messageId && msg.username === username);

        if (messageIndex === -1) {
            return res.status(403).send('Non puoi cancellare un messaggio che non hai scritto');
        }

        messages.splice(messageIndex, 1); // Rimuovi il messaggio

        fs.writeFile('messages.json', JSON.stringify(messages, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Errore nel salvataggio dei messaggi');
            }
            res.status(200).send('Messaggio cancellato con successo');
        });
    });
});

// Avvia il server
app.listen(port, () => {
    console.log(`Server in ascolto su http://localhost:${port}`);
});


