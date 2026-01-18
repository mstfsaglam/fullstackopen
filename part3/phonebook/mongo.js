const mongoose = require('mongoose');

console.log(process.argv);

if (process.argv[2] < 3){
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://phonebookDB:${password}@cluster0.hprtnmy.mongodb.net/Phonebook?appName=Cluster0`;

mongoose.set('strict', false);

mongoose.connect(url, { family: 4 });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema);

if (process.argv.length < 5) {
  return Person.find({}).then(result => {
    console.log('phonebook:');
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  })
}

const personName = process.argv[3];
const personNumber = process.argv[4];

const person = new Person ({
  name: personName,
  number: personNumber,
})

person.save().then(result => {
  console.log(`added ${personName} number ${personNumber} to phonebook`);
  mongoose.connection.close();
})