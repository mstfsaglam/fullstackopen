const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log('connecting to', url);
mongoose.connect(url, { family: 4 })
  .then(result => {
    console.log('connected to MongoDB')    ;
  })
  .catch(error => {
    console.log('error connection to MongoDB: ', error.message);
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
  },
  number: {
    type: String,
    validate: {
      validator: (value) => {
        return /^((\d{2}-\d{5,})|(\d{3}-\d{4,}))$/.test(value);
      },
      message: props => `${props.value}  is not valid number!`
    },
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
})

module.exports = mongoose.model('Person', personSchema);