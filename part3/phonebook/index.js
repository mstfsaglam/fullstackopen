const express = require("express");
const app = express();
const PORT = 3001;

app.use(express.json());

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
  response.json(persons);
});

app.get("/info", (request, response) => {
  const createdAt = new Date().toString();
  response.send(`
    <div>Phonebook has info for ${persons.length} people</div>
    <p>${createdAt}</p>
  `);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  person ? response.json(person) : response.status(404).end();
});

const generateId = () => {
  return String(Math.floor(Math.random() * 1e9))
}

const checkSameName = (bodyName) => {
  return persons.find(person => person.name === bodyName) ? true : false
}

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if(!body.name || !body.number || checkSameName(body.name)){
    return response.status(400).json( { error: "name must be uniq!" } );
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  };

  persons = persons.concat(person);
  response.json(person);
})

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.listen(PORT, () => {
  console.log(`phonebook app listening on port ${PORT}`);
});
