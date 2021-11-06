const express = require("express");
const { uuid } = require("uuidv4");

const app = express();
const PORT = 4000;

app.use(express.json());

let customers = [];

//Middleware
function verifyIfExistsAccountCPF(req, res, next) {
    const { cpf } = req.headers
    const customer = customers.find(customer => (customer.cpf === cpf))
    if(!customer) {
        res.status(404).json({ error:'Costumer not found' })
    }
    req.customer = customer
    return next()
}

//Routes
app.post("/account", (req, res) => {
    const id = uuid();
    const { cpf, name } = req.body;
    const customerAlreadyExists = customers.some(customer => customer.cpf === cpf)

    if(customerAlreadyExists) {
        return res.status(400).json({ error: 'Costumer already exists!' })
    }

    customers.push({
        cpf,
        name,
        id,
        statement: [],
    });
    res.status(201).send();
});

app.get('/statement/',verifyIfExistsAccountCPF, (req, res) => {
    const { customer } = req
    
    res.status(200).send(customer.statement)
})

app.listen(PORT, () => console.log(`Server is running on port:${PORT}`));
