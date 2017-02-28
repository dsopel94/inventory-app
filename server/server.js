const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');

const {DATABASE_URL, PORT} = require('./config');
const {InventoryList} = require('./models');

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname,'../public')))

mongoose.Promise = global.Promise;

app.get('/', (req,res) => {
  res.sendFile(path.resolve(__dirname + '../public/index.html'));
})

app.get('/items', (req, res) => {
  InventoryList
    .find()
  	.exec()
  	.then(items => {
  		res.json(items.map(item => item.apiRepr()));
  	})
  	.catch(err => {
  		console.error(err);
  		res.status(500).json({error: 'something went horribly awry', message: err})
  	})
});

app.get('/items/:id', (req, res) => {
  InventoryList
  .findById(req.params.id)
  .exec()
  .then(item => res.json(item.apiRepr()))
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'something went horribly awry'})
  })
})

app.post('/items', (req,res) => {
  const requiredFields = ['product','location','form','quantity','hazardous'];
  for (let i=0; i<requiredFields.length;i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing ${field} in request body`
        console.error(message);
        return res.status(400).send(message);
    }
  }

  InventoryList
    .create({
      product: req.body.product,
      form: req.body.form,
      hazardous: req.body.hazardous,
      location: req.body.location,
      quantity: req.body.quantity
    })
    .then(item => res.status(201).json(item.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Something went wrong'});
    });
});

app.put('/items/:id', (req, res) => {
  if (req.params.id && req.body.id && req.params.id !== req.body.id) {
    return res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }
  const updated = {}
  const updateableFields = ['product','form','hazardous', 'location', 'quantity'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  InventoryList
    .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
    .exec()
    .then(updatedItem => res.status(201).json(updatedItem.apiRepr()))
    .catch(err => res.status(500).json({message: 'Something went wrong'}));
});

app.delete('/items/:id', (req, res) => {
  InventoryList
  .findByIdAndRemove(req.params.id)
  .exec()
  .then(() => {
    console.log(`Deleted blog post with id ${req.params.id}`);
    res.status(204).end();

  })
})

let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }

      app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {runServer, app, closeServer};