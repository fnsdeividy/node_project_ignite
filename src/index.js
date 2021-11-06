const express = require("express");
const { uuid } = require("uuidv4");

const app = express();
const PORT = 4000;

app.use(express.json());

const costumers = [];

app.post("/account", (req, res) => {
    const id = uuid();
    const { cpf, name } = req.body;
    const costumerAlreadyExists = costumers.some(costumer => costumer.cpf === cpf)

    if(costumerAlreadyExists) {
        return res.status(400).json({ error: 'Costumer already exists!' })
    }

    costumers.push({
        cpf,
        name,
        id,
        statement: [],
    });
    res.status(201).send();
});

app.get('/statement/', (req, res) => {
    const { cpf } = req.headers
    const costumer = costumers.find(costumer => (costumer.cpf === cpf))
    if(!costumer) {
        res.status(404).json({ error:'Costumer not found' })
    }
    res.status(200).send(costumer.statement)
})

app.listen(PORT, () => console.log(`Server is running on port:${PORT}`));
