require('dotenv').config();
const express = require('express');
const { requestLogger } = require('./logger');
const app = express();
const cors = require('cors');

const Note = require('./models/notes');

//middleware functions
app.use(express.static('dist'));
app.use(express.json());
app.use(requestLogger);

// posting a new resource
app.post('/api/notes', (req, res, next) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({
      error: 'Content missing',
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note
    .save()
    .then((savedNote) => {
      res.json(savedNote);
    })
    .catch((error) => next(error));
});

app.use(cors());

// error handler

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
});

// getting all the resources
app.get('/api/notes', (req, res) => {
  Note.find({}).then((note) => {
    res.json(note);
  });
});

// getting a single resource
app.get('/api/notes/:id', (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

// deleting a resource
app.delete('/api/notes/:id', (req, res, next) => {
  const id = req.params.id;
  Note.findByIdAndRemove(id)
    .then((note) => {
      console.log(note);
      res.status(204).end();
    })
    .catch((error) => next(error));
});

// updating a resource

app.put('/api/notes/:id', (req, res, next) => {
  const body = req.body;
  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(req.params.id, note, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedNote) => {
      res.json(updatedNote);
    })
    .catch((error) => next(error));
});

// unknown end points

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  } else if (error.name === 'CastError') {
    console.log(error.name);
    return res.status(400).send({ error: 'malformatted id' });
  }
  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`server running on port ${PORT}`);

// GXbTfCIZy151AKfo
