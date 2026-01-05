import { useState } from 'react'

 const Filtered = ({handleFilterInput, filter}) => {
  return (
    <div>
        filter shown with <input value={filter} onChange={handleFilterInput}/>
      </div>
  )
 }

 const PersonsForm = ({handleFormSubmit, newName, handleNameInput, newNumber, handleNumberInput}) => {
  
  return (
    <form onSubmit={handleFormSubmit}>
        <div>
          name: <input value={newName} onChange={handleNameInput}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberInput} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
 }

  const Persons = ({showPersons}) => {
    return (
      <div>
        {showPersons.map(person => 
        <p key={person.id}>
          {person.name + ' '}
          {person.number}
        </p>)} 
      </div>
    )
  }

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // Checks if new person is in same name at persons list
    const isNameExists = persons.some(person => person.name === newName.trim());

    if (!isNameExists) {
      const newPerson = persons.concat({
          name: newName.trim(),
          number: newNumber.trim(),
          id: persons.length === 0 ? persons.length + 1 : Math.max(...persons.map(person => person.id)) + 1
        })
      setPersons(newPerson)
    }
    else {
      alert(`${newName} is already added to phonebook`)
    }

    setNewName('');
    setNewNumber('');
  }

  const handleNameInput = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberInput = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterInput = (event) => {
    setFilter(event.target.value)

  }
  //This is filtering persons data and displays them
  const cleanFilterInput = filter.trim().toLowerCase();
  const filteredPersonsList = persons.filter(person =>  person.name.toLowerCase().includes(cleanFilterInput));      
  const showPersons = filter ? filteredPersonsList: persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Filtered filter={filter} handleFilterInput={handleFilterInput}/>
      <h3>add a new</h3>
      <PersonsForm 
        handleFormSubmit={handleFormSubmit}
        newName={newName} handleNameInput={handleNameInput}
        newNumber={newNumber} handleNumberInput={handleNumberInput}
      />
      <h3>Numbers</h3>
      <Persons showPersons={showPersons}/>
    </div>
  )
}

export default App