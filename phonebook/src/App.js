import React, { useEffect, useState } from 'react'
import personService from './services/persons'
const Filter = ({ filter, handleFilter }) =>
  <div>
    filter shown with
    <input value={filter} onChange={handleFilter} />
  </div>

const Person = ({ person, deleteContact }) =>
  <div>
    {person.name} {person.number} <button onClick={() => deleteContact(person.id)}>delete</button>
  </div>
const PersonForm = ({ newName, handleAddContact,
  handleChange, handleChangeNumber, newNumber }) =>
  <form onSubmit={handleAddContact}>
    <div>
      name: <input value={newName} onChange={handleChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleChangeNumber} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>

const Persons = ({ persons, filter, deleteContact }) =>
  persons.filter(x => x.name.toLowerCase().includes(filter.toLowerCase())).map(
    person =>
      <Person key={person.name} person={person} deleteContact={deleteContact} />
  )
const Notification = ({message}) => {
  if(message.text===null) return null
  return(
    <div className={message.reason}>
      {message.text}
    </div>
  )
}
const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState({text: null, reason: null})
  useEffect(() => {
    personService
      .getAll()
      .then(persons => setPersons(persons))
  }, [])
  const handleAddContact = (event) => {
    event.preventDefault()
    personService
      .getAll()
      .then(backendPersons => {
        const personToUpdate = backendPersons.find(person => person.name === newName)
        if (personToUpdate !== undefined) {

          if (window.confirm(`${newName}  is already added to phonebook, replace the old number with the new one?`)) {
            const newContact = { name: newName, number: newNumber }
            personService
              .update(personToUpdate.id, newContact)
              .then(newPerson => {
                setPersons(persons.map(x => x.id !== newPerson.id ? x : newPerson))
                setNotificationMessage({text:`Replaced ${newPerson.name}'s number`, reason:'success'})
                setTimeout(() => {
                  setNotificationMessage({text:null, reason:null})
                }, 5000)
                setNewName('')
                setNewNumber('')
                
              })
              .catch(error => {
                setNotificationMessage({text:`Information of ${newName} has already been removed from server`, reason:'error'})
              })
          }
          else {
              setNewName('')
              setNewNumber('')
          }
        }
        else {
          const newContact = { name: newName, number: newNumber }
          personService
            .create(newContact)
            .then(newPerson => {
              setPersons(persons.concat(newPerson))
              const msg={text:`Added ${newName}`, reason:'success'}
              setNotificationMessage(msg)
              setTimeout(() => {
                setNotificationMessage({text:null, reason:null})
              }, 5000)
              setNewName('')
              setNewNumber('')
            })
        }
      })

  }
  const deleteContact = (id) => {
    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(x => x.id !== id))
      })

  }
  const handleChange = (event) => {
    setNewName(event.target.value)
  }
  const handleChangeNumber = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilter = (event) => {
    setFilter(event.target.value)
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} />
      <Filter filter={filter} handleFilter={handleFilter} />
      <h2>add a new </h2>
      <PersonForm newName={newName} handleAddContact={handleAddContact}
        handleChange={handleChange} handleChangeNumber={handleChangeNumber}
        newNumber={newNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} deleteContact={deleteContact} />
    </div>
  )
}

export default App
