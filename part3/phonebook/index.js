const express = require("express");
const morgan = require("morgan");
require('dotenv').config();
const Person = require('./models/person')
const app = express();

app.use(express.static('dist'));
app.use(express.json());

morgan.token('newPerson', (request, response) => {
  if(request.method === 'POST') {
    return JSON.stringify(request.body);
  }
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :newPerson"));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  Person.find({}).then(person => {
    response.json(person);
  })
});

app.get("/info", (request, response) => {
  const createdAt = new Date().toString();
  response.send(`
    <div>Phonebook has info for ${persons.length} people</div>
    <p>${createdAt}</p>
  `);
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person);
  })
});

app.post("/api/persons", (request, response) => {
  const person = new Person({
    name: request.body.name,
    number: request.body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson);
  })
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

const unknownEndpoint = (request, response) => {
  return response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`phonebook app listening on port ${PORT}`);
});
