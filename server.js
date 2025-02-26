app.post('/messages', (req, res) => {
    const newMessage = req.body.message; // Prendi il messaggio inviato

    if (!newMessage) {
        return res.status(400).send('Messaggio vuoto'); // Se non c'è un messaggio, restituisci un errore
    }

    // Leggi i messaggi esistenti
    fs.readFile('messages.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Errore nella lettura dei messaggi');
        }

        const messages = JSON.parse(data); // Trasforma i dati in un array
        messages.push(newMessage); // Aggiungi il nuovo messaggio

        // Salva il nuovo array nel file
        fs.writeFile('messages.json', JSON.stringify(messages, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Errore nel salvataggio del messaggio');
            }
            res.status(200).send('Messaggio aggiunto con successo');
        });
    });
});
