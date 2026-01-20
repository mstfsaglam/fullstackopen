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

const errorHandling = (error, request, response, next) => {
  console.log(error.message);
  
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  next(error);
}

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then(person => {
      response.json(person);
    })
    .catch(error => next(error));
});

app.get("/info", (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      const createdAt = new Date().toString();
      response.send(
        `<div>Phonebook has info for ${count} people</div>
        <p>${createdAt}</p>`   
      );
    })
    .catch(error => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      response.json(person);
    })
    .catch(error => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const person = new Person({
    name: request.body.name,
    number: request.body.number,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson);
    })
    .catch(error => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const number = request.body.number;
  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end();
      }

      person.number = number;

      person.save().then(updatedPerson => {
        response.json(updatedPerson);
      })
    })
    .catch(error => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

const unknownEndpoint = (request, response) => {
  return response.status(404).send({ error: 'unknown endpoint' });
};

// Managing request with unknown endpoint
app.use(unknownEndpoint);

// Managing requests that result in errors
app.use(errorHandling);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`phonebook app listening on port ${PORT}`);
});
