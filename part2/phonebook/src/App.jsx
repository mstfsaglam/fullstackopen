import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const isNameExists = persons.some(person => person.name === newName.trim());

    if (!isNameExists) {
      setPersons(persons.concat({name: newName}))
    } else {
      alert(`${newName} is already added to phonebook`)
    }

    setNewName('');
  }

  const handleInputChange = (event) => {
    setNewName(event.target.value);

  }
  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={handleFormSubmit}>
        <div>
          name: <input value={newName} onChange={handleInputChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
        {persons.map(person => 
        <p key={person.name}>
          {person.name}
        </p>)}  
    </div>
  )
}

export default App