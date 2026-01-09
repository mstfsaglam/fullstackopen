import { useState, useEffect, useRef } from 'react'
import personsService from './services/persons'
import Notification from './components/Notification'

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

  const Persons = ({showPersons, deletePerson}) => {
    return (
      <div>
        {showPersons.map(person => 
        <div key={person.id}>
          {person.name + ' '}
          {person.number + ' '}
        <button onClick={() => deletePerson(person)}>delete</button> 
        </div>)}
      </div>
    )
  }

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notification, setNotification] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    personsService
    .getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
    })

  }, [])

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const cleanedNewName = newName.trim();
    const cleanedNewNumber = newNumber.trim();
    // Checks if new person is in same name at persons list
    const isNameExists = persons.some(person => person.name === cleanedNewName);

    if (!isNameExists) {
      const newPerson = {
          name: cleanedNewName,
          number: cleanedNewNumber
        }

      return personsService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(prev => prev.concat(returnedPerson));
          setNotification({message: `${cleanedNewName} added successfully ✅`, type: 'create'});
          handleNotificationMessage();
          setNewName('');
          setNewNumber('');
        })
    }
    
    const isConfirmed = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`);

    if(isConfirmed) {
      const updatedPerson = {
        ...persons.find(person => person.name === cleanedNewName), 
        number: cleanedNewNumber
      }
 
      return personsService
        .update(updatedPerson)
        .then(returnedPerson => {
          setPersons(prev => prev.map(person => person.id === returnedPerson.id ? returnedPerson : person))
          setNotification({message: `${cleanedNewName} updated successfully ✅`, type: 'update'});
          handleNotificationMessage();
          setNewName('');
          setNewNumber('');
        })
        .catch(() => {
          alert('This person could be already deleted from server')
        })
    }
      
  }

  const handleDeleteClick = (clickedPerson) => {
    const confirmDelete = window.confirm(`Delete ${clickedPerson.name} ?`);
    
    if(confirmDelete){
      return personsService
        .deletePerson(clickedPerson.id)
        .then(() => {
          setPersons(prev => prev.filter(person => person.id !== clickedPerson.id))
        })
        .catch((error) => {
          setNotification({message: `Information of ${clickedPerson.name} has already been removed from server!`, type: 'error'})
          handleNotificationMessage();
          if(error.status === 404) {
            setPersons(prev => prev.filter(person => person.id !== clickedPerson.id))
          } 
        })
    }
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
  const handleNotificationMessage = () => {
    if(timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setNotification(null);
    }, 3000);
  }
  //This is filtering persons data and displays them
  const cleanFilterInput = filter.trim().toLowerCase();
  const filteredPersonsList = persons.filter(person =>  person.name.toLowerCase().includes(cleanFilterInput));      
  const showPersons = filter ? filteredPersonsList: persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification}/>
      <Filtered filter={filter} handleFilterInput={handleFilterInput}/>
      <h3>add a new</h3>
      <PersonsForm 
        handleFormSubmit={handleFormSubmit}
        newName={newName} handleNameInput={handleNameInput}
        newNumber={newNumber} handleNumberInput={handleNumberInput}
      />
      <h3>Numbers</h3>
      <Persons deletePerson={handleDeleteClick} showPersons={showPersons}/>
    </div>
  )
}

export default App